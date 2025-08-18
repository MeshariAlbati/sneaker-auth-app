# Render Port Binding Troubleshooting Guide

## 🚨 Error: "No open ports detected, continuing to scan..."

This error occurs when Render cannot detect which port your application is listening on. Here's how to fix it:

## 🔍 Root Causes

1. **Wrong environment configuration** in `render.yaml`
2. **Application not binding to correct host/port**
3. **Missing PORT environment variable**
4. **Application failing to start**
5. **Wrong build/start commands**

## ✅ Solutions

### 1. **Use Python Native Deployment (Recommended)**

Update your `render.yaml` to use Python native deployment:

```yaml
services:
  - type: web
    name: legitkicks-app
    env: python  # NOT docker
    buildCommand: pip install -r backend/requirements.txt
    startCommand: cd backend && python app.py
    envVars:
      - key: PORT
        value: 8000
```

### 2. **Verify PORT Environment Variable**

Ensure your app reads the PORT environment variable:

```python
# In app.py
port = int(os.getenv('PORT', 8000))
uvicorn.run(app, host="0.0.0.0", port=port)
```

### 3. **Bind to All Interfaces**

Your app must bind to `0.0.0.0`, not `localhost` or `127.0.0.1`:

```python
# ✅ Correct for Render
uvicorn.run(app, host="0.0.0.0", port=port)

# ❌ Wrong for Render
uvicorn.run(app, host="127.0.0.1", port=port)
uvicorn.run(app, host="localhost", port=port)
```

### 4. **Check Application Startup**

Ensure your app starts successfully by checking the logs:

```bash
# In Render dashboard, check:
# 1. Build logs
# 2. Runtime logs
# 3. Health check endpoint
```

## 🧪 Testing Locally

### Run the Test Script

```bash
cd "Sneaker project"
python test_port_binding.py
```

### Manual Testing

```bash
# Set environment variable
export PORT=8000

# Start the app
cd backend
python app.py

# In another terminal, test the endpoint
curl http://localhost:8000/api/health
```

## 🔧 Alternative: Docker Deployment

If you prefer Docker, use `render-docker.yaml`:

```yaml
services:
  - type: web
    name: legitkicks-app-docker
    env: docker
    dockerfilePath: ./Dockerfile
    envVars:
      - key: PORT
        value: 8000
```

## 📋 Complete render.yaml

```yaml
services:
  - type: web
    name: legitkicks-app
    env: python
    buildCommand: pip install -r backend/requirements.txt
    startCommand: cd backend && python app.py
    healthCheckPath: /api/health
    healthCheckTimeout: 600
    envVars:
      - key: PORT
        value: 8000
      - key: PYTHON_VERSION
        value: "3.11"
    plan: starter
    autoDeploy: true
    branch: main
```

## 🚀 Deployment Steps

1. **Update render.yaml** with the correct configuration
2. **Commit and push** changes to GitHub
3. **Redeploy** in Render dashboard
4. **Check logs** for any errors
5. **Verify health endpoint** is accessible

## 🔍 Debugging Steps

### 1. Check Build Logs
- Look for Python installation errors
- Verify dependencies are installed
- Check for syntax errors

### 2. Check Runtime Logs
- Look for application startup messages
- Check for port binding errors
- Verify environment variables

### 3. Check Health Endpoint
- Test `/api/health` endpoint
- Verify response format
- Check response time

### 4. Check Environment Variables
- Verify PORT is set correctly
- Check Python version
- Verify other environment variables

## 🐛 Common Issues

### Issue: "Module not found"
**Solution**: Ensure `requirements.txt` is in the correct location

### Issue: "Permission denied"
**Solution**: Check file permissions and ownership

### Issue: "Port already in use"
**Solution**: Render handles this automatically, but check your local testing

### Issue: "Application timeout"
**Solution**: Increase `healthCheckTimeout` in render.yaml

## 📞 Getting Help

1. **Check Render documentation**: https://render.com/docs
2. **Review Render logs** in the dashboard
3. **Test locally** with the provided test script
4. **Verify configuration** matches the examples above

## 🎯 Quick Fix Checklist

- [ ] Use `env: python` in render.yaml
- [ ] Set `buildCommand` and `startCommand` correctly
- [ ] Ensure PORT environment variable is set
- [ ] Bind to `0.0.0.0` in your app
- [ ] Test locally before deploying
- [ ] Check Render logs after deployment

## 💡 Pro Tips

1. **Start with Python native deployment** - it's simpler for debugging
2. **Use the health endpoint** to verify your app is running
3. **Check logs immediately** after deployment
4. **Test locally first** to catch issues early
5. **Use the test script** to verify port binding works

Following these steps should resolve your port binding issue on Render!
