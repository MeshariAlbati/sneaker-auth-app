#!/usr/bin/env python3
"""
Test script for Sneaker Authentication API
Run this to test your API endpoints and model loading
"""

import requests
import json
import os

def test_health_endpoint(base_url):
    """Test the health endpoint"""
    try:
        response = requests.get(f"{base_url}/api/health")
        print(f"✅ Health check: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"   Model status: {data.get('model_status', 'unknown')}")
            print(f"   Model path: {data.get('model_path', 'unknown')}")
            print(f"   Download URL: {data.get('model_download_url', 'unknown')}")
        return response.status_code == 200
    except Exception as e:
        print(f"❌ Health check failed: {e}")
        return False

def test_model_file():
    """Check if model file exists locally"""
    model_path = 'sneaker_model_production.pth'
    if os.path.exists(model_path):
        size_mb = os.path.getsize(model_path) / (1024 * 1024)
        print(f"✅ Model file found: {model_path} ({size_mb:.1f} MB)")
        return True
    else:
        print(f"❌ Model file not found: {model_path}")
        return False

def test_environment():
    """Check environment variables"""
    model_url = os.getenv('MODEL_DOWNLOAD_URL')
    if model_url:
        print(f"✅ MODEL_DOWNLOAD_URL set: {model_url}")
        return True
    else:
        print("❌ MODEL_DOWNLOAD_URL not set")
        return False

def main():
    print("🧪 Testing Sneaker Authentication API...\n")
    
    # Test local environment
    print("📋 Local Environment Check:")
    test_model_file()
    test_environment()
    print()
    
    # Test API endpoints (replace with your actual Render URL)
    render_url = "https://legitkicks.onrender.com"  # Your actual Render URL
    
    print(f"🌐 Testing API at: {render_url}")
    if test_health_endpoint(render_url):
        print("✅ API is responding correctly")
    else:
        print("❌ API is not responding correctly")
    
    print("\n📝 Next steps:")
    print("1. Update the render_url variable above with your actual Render URL")
    print("2. Make sure MODEL_DOWNLOAD_URL environment variable is set in Render")
    print("3. Redeploy your app to Render")
    print("4. Test the health endpoint: https://your-app-name.onrender.com/api/health")

if __name__ == "__main__":
    main()
