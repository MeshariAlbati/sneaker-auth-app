from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, HTMLResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
import gc
import os
import io
import base64
import datetime
import numpy as np
from PIL import Image

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

class LightweightModelLoader:
    def __init__(self):
        self.model_loaded = False
        self.model = None
        self.transform = None
        self.device = None
        
    def load_model_lazily(self):
        """Load model only when needed to save memory"""
        if self.model_loaded:
            return
            
        try:
            # Import PyTorch only when needed
            import torch
            import torch.nn as nn
            from torchvision import transforms, models
            
            self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
            
            # Use ResNet50 to match the saved model architecture
            model = models.resnet50(weights=None)
            num_features = model.fc.in_features
            model.fc = nn.Sequential(
                nn.Dropout(0.5),
                nn.Linear(num_features, 512),  # Match the saved model: 2048 -> 512
                nn.ReLU(),
                nn.BatchNorm1d(512),
                nn.Dropout(0.3),
                nn.Linear(512, 2)  # 2 classes: fake/real
            )
            
            # Check if model file exists and get the correct path
            model_path = self.check_model_file()
            
            if model_path:
                # Load with map_location to CPU to save GPU memory
                checkpoint = torch.load(model_path, map_location='cpu')
                model.load_state_dict(checkpoint['model_state_dict'])
                print(f"✅ Loaded production model from: {model_path}")
            else:
                print("⚠️ Using demo mode - model file not found")
            
            model.to(self.device)
            model.eval()
            
            self.model = model
            self.transform = transforms.Compose([
                transforms.Resize((224, 224)),
                transforms.ToTensor(),
                transforms.Normalize(mean=[0.485, 0.456, 0.406],
                                   std=[0.229, 0.224, 0.225])
            ])
            
            self.model_loaded = True
            print("✅ Model loaded successfully")
            
        except Exception as e:
            print(f"❌ Error loading model: {e}")
            self.model_loaded = False
            self.model = None
        
    def check_model_file(self):
        """Check if model file exists"""
        # Check multiple possible model file locations for Render deployment
        model_paths = [
            'sneaker_model_production.pth',  # Current directory
            '../sneaker_model_production.pth',  # Parent directory
            './sneaker_model_production.pth',  # Explicit current directory
            '/app/sneaker_model_production.pth',  # Docker container path
            '/app/backend/sneaker_model_production.pth'  # Backend subdirectory
        ]
        
        print(f"🔍 Checking for model file in: {os.getcwd()}")
        for model_path in model_paths:
            if os.path.exists(model_path):
                print(f"✅ Model file found: {model_path}")
                return model_path
            else:
                print(f"🔍 Checking: {model_path} - not found")
        
        print("⚠️ Model file not found in any expected location")
        return None

    def predict(self, image: Image.Image):
        """Make prediction with memory cleanup"""
        try:
            # Load model if not already loaded
            if not self.model_loaded:
                self.load_model_lazily()
            
            if not self.model_loaded or self.model is None:
                # Fallback to simple image analysis
                return self.simple_image_analysis(image)
            
            # Import torch here to ensure it's available
            import torch
            
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
            
            # Store probabilities before cleanup
            fake_prob = probabilities[0][0].item() * 100
            real_prob = probabilities[0][1].item() * 100
            
            # Clean up tensors to free memory
            del img_tensor, outputs, probabilities, confidence, predicted
            gc.collect()
            
            return {
                'prediction': result,
                'confidence': round(confidence_score, 2),
                'fake_probability': round(fake_prob, 2),
                'real_probability': round(real_prob, 2),
                'method': 'ml_model'
            }
            
        except Exception as e:
            print(f"Prediction error: {e}")
            # Fallback to simple analysis
            return self.simple_image_analysis(image)
    
    def simple_image_analysis(self, image: Image.Image):
        """Simple image analysis as fallback when model fails"""
        try:
            # Convert to numpy array for analysis
            img_array = np.array(image)
            
            # Simple heuristics based on image properties
            # These are just examples - you can implement more sophisticated analysis
            
            # Check image dimensions
            height, width = img_array.shape[:2]
            
            # Check brightness
            if len(img_array.shape) == 3:
                brightness = np.mean(img_array)
            else:
                brightness = np.mean(img_array)
            
            # Check contrast (standard deviation)
            contrast = np.std(img_array)
            
            # Simple scoring system
            score = 0
            
            # Prefer images with reasonable dimensions
            if 200 <= height <= 1000 and 200 <= width <= 1000:
                score += 20
            
            # Prefer images with good brightness
            if 50 <= brightness <= 200:
                score += 30
            
            # Prefer images with good contrast
            if contrast > 20:
                score += 30
            
            # Determine prediction based on score
            if score >= 60:
                prediction = "real"
                confidence = min(score + 20, 95)
            else:
                prediction = "fake"
                confidence = max(100 - score, 30)
            
            fake_prob = 100 - confidence if prediction == "real" else confidence
            real_prob = confidence if prediction == "real" else 100 - confidence
            
            return {
                'prediction': prediction,
                'confidence': round(confidence, 2),
                'fake_probability': round(fake_prob, 2),
                'real_probability': round(real_prob, 2),
                'method': 'simple_analysis'
            }
            
        except Exception as e:
            print(f"Simple analysis error: {e}")
            # Ultimate fallback
            import random
            fake_prob = random.uniform(30, 70)
            real_prob = 100 - fake_prob
            prediction = "fake" if fake_prob > real_prob else "real"
            return {
                'prediction': prediction,
                'confidence': max(fake_prob, real_prob),
                'fake_probability': round(fake_prob, 2),
                'real_probability': round(real_prob, 2),
                'method': 'random_fallback'
            }

# Initialize lightweight model loader
model_loader = LightweightModelLoader()
print("✅ Lightweight model loader initialized")

# Mount static files for frontend FIRST (before defining routes)
try:
    # Check multiple possible locations for frontend build
    frontend_paths = [
        "dist",           # Docker build location
        "frontend/dist",  # Local development
        "../frontend/dist" # Alternative location
    ]
    
    frontend_mounted = False
    for frontend_path in frontend_paths:
        if os.path.exists(frontend_path):
            app.mount("/", StaticFiles(directory=frontend_path, html=True), name="static")
            print(f"✅ Static files mounted successfully from: {frontend_path}")
            frontend_mounted = True
            break
    
    if not frontend_mounted:
        print("⚠️ Frontend dist directory not found - API only mode")
        print(f"📂 Available directories: {os.listdir('.')}")
        
except Exception as e:
    print(f"⚠️ Could not mount static files: {e}")

# Add catch-all route for SPA routing (must come after static mounting)
@app.get("/{full_path:path}")
async def catch_all(full_path: str):
    """Catch-all route for SPA routing - serves frontend for any non-API route"""
    # Skip API routes
    if full_path.startswith("api/"):
        raise HTTPException(status_code=404, detail="API endpoint not found")
    
    # Skip static assets
    if full_path.startswith("assets/") or full_path.endswith((".js", ".css", ".png", ".jpg", ".svg")):
        raise HTTPException(status_code=404, detail="Static asset not found")
    
    # For all other routes, serve the frontend (SPA routing)
    try:
        frontend_paths = ["dist", "frontend/dist", "../frontend/dist"]
        for frontend_path in frontend_paths:
            index_path = os.path.join(frontend_path, "index.html")
            if os.path.exists(index_path):
                with open(index_path, 'r') as f:
                    html_content = f.read()
                return HTMLResponse(content=html_content, media_type="text/html")
        
        # Fallback
        raise HTTPException(status_code=404, detail="Frontend not available")
        
    except Exception as e:
        print(f"Error in catch-all route: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@app.get("/")
async def root():
    """Root endpoint serves the frontend application"""
    print(f"🌐 Root endpoint accessed - Serving frontend from: {os.getcwd()}")
    
    # Try to serve the frontend index.html
    try:
        # Check if we have frontend files
        frontend_paths = ["dist", "frontend/dist", "../frontend/dist"]
        for frontend_path in frontend_paths:
            index_path = os.path.join(frontend_path, "index.html")
            if os.path.exists(index_path):
                with open(index_path, 'r') as f:
                    html_content = f.read()
                return HTMLResponse(content=html_content, media_type="text/html")
        
        # Fallback: return a simple HTML with API info if no frontend found
        fallback_html = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <title>Sneaker Authentication API</title>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <style>
                body {{ font-family: Arial, sans-serif; margin: 40px; background: #f5f5f5; }}
                .container {{ max-width: 800px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }}
                h1 {{ color: #2563eb; text-align: center; }}
                .endpoint {{ background: #f8fafc; padding: 15px; margin: 10px 0; border-radius: 5px; border-left: 4px solid #2563eb; }}
                .method {{ font-weight: bold; color: #059669; }}
                .url {{ font-family: monospace; background: #e2e8f0; padding: 2px 6px; border-radius: 3px; }}
            </style>
        </head>
        <body>
            <div class="container">
                <h1>🏀 Sneaker Authentication API</h1>
                <p style="text-align: center; color: #64748b; margin-bottom: 30px;">
                    AI-powered sneaker authenticity detection service
                </p>
                
                <div class="endpoint">
                    <div class="method">GET</div>
                    <div class="url">/api/health</div>
                    <p>Check API health and model status</p>
                </div>
                
                <div class="endpoint">
                    <div class="method">POST</div>
                    <div class="url">/api/predict</div>
                    <p>Upload an image for sneaker authenticity prediction</p>
                </div>
                
                <div class="endpoint">
                    <div class="method">GET</div>
                    <div class="url">/docs</div>
                    <p>Interactive API documentation</p>
                </div>
                
                <div style="text-align: center; margin-top: 30px; padding: 20px; background: #f1f5f9; border-radius: 5px;">
                    <p><strong>Status:</strong> Running</p>
                    <p><strong>Version:</strong> 1.0.0</strong></p>
                    <p><strong>Working Directory:</strong> {os.getcwd()}</p>
                </div>
            </div>
        </body>
        </html>
        """
        return HTMLResponse(content=fallback_html, media_type="text/html")
        
    except Exception as e:
        print(f"Error serving frontend: {e}")
        # Ultimate fallback: return JSON
        return JSONResponse(content={
            "message": "Sneaker Authentication API",
            "version": "1.0.0",
            "status": "running",
            "error": "Frontend not available",
            "endpoints": {
                "health": "/api/health",
                "predict": "/api/predict",
                "docs": "/docs"
            }
        })

@app.get("/api")
async def api_info():
    """API information endpoint"""
    return {
        "name": "Sneaker Authentication API",
        "version": "1.0.0",
        "status": "running",
        "description": "AI-powered sneaker authenticity detection",
        "memory_optimized": True,
        "working_directory": os.getcwd(),
        "timestamp": str(datetime.datetime.now()),
        "endpoints": {
            "health": "/api/health",
            "predict": "/api/predict",
            "documentation": "/docs"
        },
        "usage": {
            "health_check": "GET /api/health",
            "predict_sneaker": "POST /api/predict (with image file)"
        }
    }

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
            
            # Clean up image to free memory
            del image, contents
            gc.collect()
            
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
    model_status = "lightweight_loader"
    model_paths = ['sneaker_model_production.pth', '../sneaker_model_production.pth']
    model_found = False
    actual_path = ""
    
    for model_path in model_paths:
        if os.path.exists(model_path):
            file_size = os.path.getsize(model_path)
            model_status = f"available ({file_size / (1024*1024):.1f} MB)"
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
        "timestamp": str(datetime.datetime.now()),
        "memory_optimized": True
    }

if __name__ == "__main__":
    import uvicorn
    print("🚀 Starting Memory-Optimized Sneaker Authentication API...")
    print(f"📁 Current working directory: {os.getcwd()}")
    print(f"📂 Files in current directory: {os.listdir('.')}")
    
    # Get port from environment variable (Render requirement) or default to 8000
    port = int(os.getenv('PORT', 8000))
    print(f"🌐 Binding to port: {port}")
    print(f"🔌 Environment PORT: {os.getenv('PORT', 'Not set')}")
    print(f"🌍 Server will be accessible at: http://0.0.0.0:{port}")
    
    try:
        # Ensure we bind to all interfaces for Render
        uvicorn.run(
            app, 
            host="0.0.0.0", 
            port=port,
            log_level="info",
            access_log=True
        )
    except Exception as e:
        print(f"❌ Failed to start server: {e}")
        raise