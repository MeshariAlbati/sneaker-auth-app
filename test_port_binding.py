#!/usr/bin/env python3
"""
Test script to verify port binding works correctly for Render deployment
"""

import os
import socket
import subprocess
import time
import requests
import sys

def test_port_binding():
    """Test if the application can bind to the specified port"""
    
    # Set environment variables like Render would
    os.environ['PORT'] = '8000'
    
    print("🧪 Testing port binding for Render deployment...")
    print(f"📋 Environment PORT: {os.environ.get('PORT', 'Not set')}")
    
    # Check if port 8000 is available
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    try:
        sock.bind(('0.0.0.0', 8000))
        sock.close()
        print("✅ Port 8000 is available")
    except OSError:
        print("❌ Port 8000 is already in use")
        return False
    
    # Try to start the application
    print("🚀 Starting application...")
    try:
        # Change to backend directory
        os.chdir('backend')
        
        # Start the application in a subprocess
        process = subprocess.Popen(
            [sys.executable, 'app.py'],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            env=os.environ.copy()
        )
        
        # Wait a bit for the app to start
        time.sleep(5)
        
        # Check if process is still running
        if process.poll() is None:
            print("✅ Application started successfully")
            
            # Test the health endpoint
            try:
                response = requests.get('http://localhost:8000/api/health', timeout=10)
                if response.status_code == 200:
                    print("✅ Health endpoint responding correctly")
                    print(f"📊 Response: {response.json()}")
                else:
                    print(f"❌ Health endpoint returned status {response.status_code}")
            except requests.exceptions.RequestException as e:
                print(f"❌ Could not connect to health endpoint: {e}")
            
            # Stop the application
            process.terminate()
            process.wait()
            print("🛑 Application stopped")
            return True
        else:
            stdout, stderr = process.communicate()
            print(f"❌ Application failed to start")
            print(f"📤 Stdout: {stdout.decode()}")
            print(f"📥 Stderr: {stderr.decode()}")
            return False
            
    except Exception as e:
        print(f"❌ Error testing application: {e}")
        return False

def test_environment_variables():
    """Test environment variable handling"""
    print("\n🔍 Testing environment variables...")
    
    # Test PORT environment variable
    port = os.getenv('PORT', '8000')
    print(f"📋 PORT: {port}")
    
    # Test other environment variables
    env_vars = [
        'PYTHON_VERSION',
        'PYTHONUNBUFFERED', 
        'PYTHONDONTWRITEBYTECODE',
        'PYTHONMALLOC',
        'PYTHONDEVMODE',
        'PYTHONHASHSEED'
    ]
    
    for var in env_vars:
        value = os.getenv(var, 'Not set')
        print(f"📋 {var}: {value}")
    
    return True

if __name__ == "__main__":
    print("🚀 Port Binding Test for Render Deployment")
    print("=" * 50)
    
    # Test environment variables
    env_test = test_environment_variables()
    
    # Test port binding
    port_test = test_port_binding()
    
    print("\n" + "=" * 50)
    if env_test and port_test:
        print("✅ All tests passed! Ready for Render deployment")
    else:
        print("❌ Some tests failed. Check the issues above")
    
    print("\n💡 For Render deployment:")
    print("1. Use the updated render.yaml")
    print("2. Ensure PORT environment variable is set")
    print("3. Check the Render logs for any errors")
