#!/usr/bin/env python3
"""
Simple script to upload the model file to a temporary hosting service
and then download it on the server.
"""

import os
import subprocess
import sys

def upload_to_file_io():
    """Upload model to file.io (temporary file hosting)"""
    model_path = "sneaker_model_production.pth"
    
    if not os.path.exists(model_path):
        print("❌ Model file not found!")
        print("Make sure sneaker_model_production.pth is in the current directory")
        return None
    
    print("📤 Uploading model file to file.io...")
    print("This may take a few minutes (216MB file)...")
    
    try:
        # Upload to file.io (free temporary file hosting)
        result = subprocess.run([
            "curl", "-F", f"file=@{model_path}", 
            "https://file.io"
        ], capture_output=True, text=True)
        
        if result.returncode == 0:
            print("✅ Upload successful!")
            print("Copy this download command and run it in your Render shell:")
            print()
            # Extract download URL from response
            import json
            response = json.loads(result.stdout)
            download_url = response.get('link')
            
            print(f"curl -o sneaker_model_production.pth '{download_url}'")
            print()
            print("After downloading, restart your Render service to load the model.")
            return download_url
        else:
            print("❌ Upload failed:", result.stderr)
            return None
            
    except Exception as e:
        print("❌ Error during upload:", str(e))
        return None

if __name__ == "__main__":
    upload_to_file_io()
