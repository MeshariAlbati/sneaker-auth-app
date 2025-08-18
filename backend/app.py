from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import torch
import torch.nn as nn
from torchvision import transforms, models
from PIL import Image
import io
import base64
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ModelLoader:
    def __init__(self):
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.model = self.load_model()
        self.transform = self.get_transform()
        
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
        
        # Load weights - with fallback for deployment
        model_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'sneaker_model_production.pth')
        
        if os.path.exists(model_path):
            # Production model available
            checkpoint = torch.load(model_path, map_location=self.device)
            model.load_state_dict(checkpoint['model_state_dict'])
            print("✅ Loaded production model")
        else:
            # Fallback: Initialize with random weights for demo
            print("⚠️ Using demo mode - model file not found")
            print("📝 Note: Predictions will be random until model is uploaded")
        
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
model_loader = ModelLoader()

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    try:
        # Read image
        contents = await file.read()
        image = Image.open(io.BytesIO(contents)).convert('RGB')
        
        # Get prediction
        result = model_loader.predict(image)
        
        return JSONResponse(content=result)
    
    except Exception as e:
        return JSONResponse(
            content={'error': str(e)},
            status_code=500
        )

@app.get("/health")
async def health():
    return {"status": "healthy"}

# Note: Email functionality now handled client-side via mailto links

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)