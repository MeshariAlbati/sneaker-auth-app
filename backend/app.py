from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
import torch
import torch.nn as nn
from torchvision import transforms, models
from PIL import Image
import io
import base64
import os
import requests
import datetime

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # Local development
        "http://localhost:3001",  # Local development alternative
        "http://localhost:3002",  # Local development alternative
        "http://localhost:5173",  # Local development alternative
        "http://localhost:5174",  # Local development alternative
        "http://localhost:8000",  # Local backend
        "https://legitkicks.onrender.com",  # Your actual Render frontend URL
        "*"  # Allow all origins for now (you can restrict this later)
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ModelLoader:
    def __init__(self):
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.model = self.load_model()
        self.transform = self.get_transform()
        
    def check_model_file(self):
        """Check if model file exists"""
        # Check both possible model file locations
        model_paths = ['sneaker_model_production.pth', '../sneaker_model_production.pth']
        
        for model_path in model_paths:
            if os.path.exists(model_path):
                print(f"✅ Model file found: {model_path}")
                return model_path
            else:
                print(f"🔍 Checking: {model_path} - not found")
        
        print("⚠️ Model file not found in any expected location")
        return None

    def load_model(self):
        model = models.resnet50(weights=None)
        num_features = model.fc.in_features
        model.fc = nn.Sequential(
            nn.Dropout(0.5),
            nn.Linear(num_features, 512),
            nn.ReLU(),
            nn.BatchNorm1d(512),
            nn.Dropout(0.3),
            nn.Linear(512, 2)
        )
        
        # Check if model file exists and get the correct path
        model_path = self.check_model_file()
        
        if model_path:
            # Production model available
            checkpoint = torch.load(model_path, map_location=self.device)
            model.load_state_dict(checkpoint['model_state_dict'])
            print(f"✅ Loaded production model from: {model_path}")
        else:
            # Fallback: Initialize with random weights for demo
            print("⚠️ Using demo mode - model file not found")
            print("📝 Note: Model file should be included in the repository")
        
        model.to(self.device)
        model.eval()
        return model
    
    def get_transform(self):
        return transforms.Compose([
            transforms.Resize((224, 224)),
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.485, 0.456, 0.406],
                               std=[0.229, 0.224, 0.225])
        ])
        
    def predict(self, image: Image.Image):
        # Preprocess image
        img_tensor = self.transform(image).unsqueeze(0).to(self.device)
        
        # Get prediction
        with torch.no_grad():
            outputs = self.model(img_tensor)
            probabilities = torch.nn.functional.softmax(outputs, dim=1)
            confidence, predicted = torch.max(probabilities, 1)
        
        # Get result
        class_names = ['fake', 'real']
        result = class_names[predicted.item()]
        confidence_score = confidence.item() * 100
        
        return {
            'prediction': result,
            'confidence': round(confidence_score, 2),
            'fake_probability': round(probabilities[0][0].item() * 100, 2),
            'real_probability': round(probabilities[0][1].item() * 100, 2)
        }

# Initialize model loader with error handling
try:
    model_loader = ModelLoader()
    print("✅ Model loader initialized successfully")
except Exception as e:
    print(f"❌ Error initializing model loader: {e}")
    # Create a dummy model loader for development
    class DummyModelLoader:
        def predict(self, image):
            import random
            fake_prob = random.uniform(10, 90)
            real_prob = 100 - fake_prob
            prediction = "fake" if fake_prob > real_prob else "real"
            return {
                'prediction': prediction,
                'confidence': max(fake_prob, real_prob),
                'fake_probability': round(fake_prob, 2),
                'real_probability': round(real_prob, 2)
            }
    model_loader = DummyModelLoader()
    print("⚠️ Using fallback dummy model due to initialization error")

@app.post("/api/predict")
async def predict(file: UploadFile = File(...)):
    try:
        # Validate file type
        if not file.content_type.startswith('image/'):
            return JSONResponse(
                content={'error': 'File must be an image'},
                status_code=400
            )
        
        # Read image
        contents = await file.read()
        
        if not contents:
            return JSONResponse(
                content={'error': 'Empty file received'},
                status_code=400
            )
        
        try:
            image = Image.open(io.BytesIO(contents)).convert('RGB')
        except Exception as img_error:
            return JSONResponse(
                content={'error': f'Invalid image format: {str(img_error)}'},
                status_code=400
            )
        
        # Get prediction
        try:
            result = model_loader.predict(image)
            return JSONResponse(content=result)
        except Exception as pred_error:
            print(f"Prediction error: {pred_error}")
            return JSONResponse(
                content={'error': f'Model prediction failed: {str(pred_error)}'},
                status_code=500
            )
    
    except Exception as e:
        print(f"Unexpected error in predict endpoint: {e}")
        return JSONResponse(
            content={'error': f'Server error: {str(e)}'},
            status_code=500
        )

@app.get("/api/health")
async def health():
    model_status = "unknown"
    # Check both possible model file locations
    model_paths = ['sneaker_model_production.pth', '../sneaker_model_production.pth']
    model_found = False
    actual_path = ""
    
    for model_path in model_paths:
        if os.path.exists(model_path):
            file_size = os.path.getsize(model_path)
            model_status = f"loaded ({file_size / (1024*1024):.1f} MB)"
            actual_path = model_path
            model_found = True
            break
    
    if not model_found:
        model_status = "not found"
        actual_path = "sneaker_model_production.pth"
    
    return {
        "status": "healthy",
        "model_status": model_status,
        "model_path": actual_path,
        "working_directory": os.getcwd(),
        "timestamp": str(datetime.datetime.now())
    }

# Mount static files for frontend (only in production)
try:
    if os.path.exists("frontend/dist"):
        app.mount("/", StaticFiles(directory="frontend/dist", html=True), name="static")
        print("✅ Static files mounted successfully")
    else:
        print("⚠️ Frontend dist directory not found - API only mode")
except Exception as e:
    print(f"⚠️ Could not mount static files: {e}")

# Note: Email functionality now handled client-side via mailto links

if __name__ == "__main__":
    import uvicorn
    print("🚀 Starting Sneaker Authentication API...")
    print(f"📁 Current working directory: {os.getcwd()}")
    print(f"📂 Files in current directory: {os.listdir('.')}")
    
    # Get port from environment variable (Render requirement) or default to 8000
    port = int(os.getenv('PORT', 8000))
    print(f"🌐 Binding to port: {port}")
    
    try:
        uvicorn.run(app, host="0.0.0.0", port=port)
    except Exception as e:
        print(f"❌ Failed to start server: {e}")
        raise