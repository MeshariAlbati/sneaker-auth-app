#!/usr/bin/env python3
"""
Test script to verify backend routing fixes
This script tests the key endpoints to ensure they work correctly
"""

import requests
import json
import sys
import os

def test_endpoint(base_url, endpoint, expected_type="json"):
    """Test an endpoint and return the result"""
    try:
        url = f"{base_url}{endpoint}"
        print(f"🔍 Testing: {url}")
        
        response = requests.get(url, timeout=10)
        
        print(f"   Status: {response.status_code}")
        print(f"   Content-Type: {response.headers.get('content-type', 'unknown')}")
        
        if expected_type == "json":
            try:
                data = response.json()
                print(f"   Response: {json.dumps(data, indent=2)[:200]}...")
            except:
                print(f"   Response: {response.text[:200]}...")
        else:
            print(f"   Response: {response.text[:200]}...")
        
        return response.status_code == 200
        
    except Exception as e:
        print(f"   ❌ Error: {e}")
        return False

def main():
    """Main test function"""
    print("🧪 Testing Sneaker Authentication Backend Fixes")
    print("=" * 50)
    
    # Test local backend if running
    base_urls = [
        "http://localhost:8000",
        "http://127.0.0.1:8000"
    ]
    
    for base_url in base_urls:
        print(f"\n🌐 Testing base URL: {base_url}")
        
        # Test root endpoint (should serve HTML frontend)
        print("\n1️⃣ Testing Root Endpoint (/)")
        root_ok = test_endpoint(base_url, "/", "html")
        
        # Test API info endpoint
        print("\n2️⃣ Testing API Info Endpoint (/api)")
        api_ok = test_endpoint(base_url, "/api", "json")
        
        # Test health endpoint
        print("\n3️⃣ Testing Health Endpoint (/api/health)")
        health_ok = test_endpoint(base_url, "/api/health", "json")
        
        # Test docs endpoint
        print("\n4️⃣ Testing Docs Endpoint (/docs)")
        docs_ok = test_endpoint(base_url, "/docs", "html")
        
        # Summary
        print(f"\n📊 Test Results for {base_url}:")
        print(f"   Root (Frontend): {'✅ PASS' if root_ok else '❌ FAIL'}")
        print(f"   API Info: {'✅ PASS' if api_ok else '❌ FAIL'}")
        print(f"   Health: {'✅ PASS' if health_ok else '❌ FAIL'}")
        print(f"   Docs: {'✅ PASS' if docs_ok else '❌ FAIL'}")
        
        if root_ok and api_ok and health_ok:
            print(f"\n🎉 All tests passed for {base_url}!")
            print("   Your backend is working correctly!")
            return True
        else:
            print(f"\n⚠️ Some tests failed for {base_url}")
    
    print("\n❌ No backend found running locally")
    print("   To test locally, run: cd backend && python app.py")
    print("   Or use Docker: docker build -t sneaker-app . && docker run -p 8000:8000 sneaker-app")
    
    return False

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
