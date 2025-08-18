# Render Deployment Guide with Memory Optimization

This guide helps you deploy the Sneaker Authentication API to Render while minimizing memory usage.

## Memory Optimization Features

The optimized version includes:

1. **Lazy Loading**: PyTorch models are only loaded when needed
2. **Smaller Model**: Uses ResNet18 instead of ResNet50
3. **Memory Cleanup**: Automatic garbage collection after predictions
4. **Fallback Analysis**: Simple image analysis when ML model fails
5. **Resource Limits**: Docker containers with memory constraints

## Render Configuration

### 1. Service Configuration

In your Render dashboard, configure the service with:

```yaml
# render.yaml (if using Blueprint)
services:
  - type: web
    name: sneaker-auth-api
    env: python
    buildCommand: pip install -r backend/requirements.txt
    startCommand: cd backend && python app.py
    envVars:
      - key: PYTHON_VERSION
        value: 3.11.0
      - key: PORT
        value: 8000
```

### 2. Environment Variables

Set these environment variables in Render:

```bash
PYTHON_VERSION=3.11.0
PORT=8000
PYTHONUNBUFFERED=1
PYTHONDONTWRITEBYTECODE=1
PYTHONMALLOC=malloc
PYTHONDEVMODE=0
```

### 3. Resource Allocation

For the free tier (512MB limit):
- **Memory**: 512MB (maximum)
- **CPU**: 0.5 cores

For paid tiers:
- **Memory**: 1GB or more recommended
- **CPU**: 1 core or more

## Deployment Steps

### 1. Prepare Your Repository

Ensure your repository structure:
```
Sneaker project/
├── backend/
│   ├── app.py (optimized version)
│   ├── requirements.txt (lightweight)
│   └── memory_optimizer.py
├── Dockerfile (memory-optimized)
├── docker-compose.yml
└── render.yaml (optional)
```

### 2. Connect to Render

1. Go to [render.com](https://render.com)
2. Connect your GitHub repository
3. Create a new Web Service
4. Select your repository

### 3. Configure Build Settings

- **Build Command**: `pip install -r backend/requirements.txt`
- **Start Command**: `cd backend && python app.py`
- **Environment**: Python 3.11

### 4. Deploy

Click "Create Web Service" and wait for deployment.

## Memory Monitoring

### 1. Health Check Endpoint

Monitor memory usage via the health endpoint:
```bash
curl https://your-app.onrender.com/api/health
```

### 2. Memory Optimization Script

Use the included memory optimizer:
```bash
# Check memory usage
python backend/memory_optimizer.py --check

# Optimize memory
python backend/memory_optimizer.py --optimize

# Monitor memory over time
python backend/memory_optimizer.py --monitor --interval 30 --duration 1800
```

## Troubleshooting Memory Issues

### 1. Out of Memory Errors

If you still get memory errors:

1. **Check Model Size**: Ensure your model file isn't too large
2. **Reduce Batch Size**: Process one image at a time
3. **Use Fallback Mode**: The API will use simple analysis if ML fails
4. **Monitor Usage**: Use the memory optimizer script

### 2. Performance Optimization

- **Image Resizing**: Images are automatically resized to 224x224
- **Lazy Loading**: Models load only when needed
- **Memory Cleanup**: Automatic garbage collection

### 3. Scaling Options

For higher traffic:
1. **Upgrade Plan**: Move to paid tier with more memory
2. **Load Balancing**: Use multiple instances
3. **CDN**: Serve static files via CDN

## Expected Memory Usage

- **Startup**: ~50-100MB
- **After Model Load**: ~200-300MB
- **During Prediction**: ~250-350MB
- **Peak Usage**: ~400-450MB

## Alternative Deployment Options

### 1. Railway

Railway offers similar features with potentially better memory management.

### 2. Heroku

Heroku has higher memory limits but costs more.

### 3. Self-Hosted

For complete control over resources.

## Monitoring and Alerts

### 1. Render Dashboard

Monitor:
- Memory usage
- Response times
- Error rates
- Uptime

### 2. Custom Monitoring

Use the memory optimizer script to create custom alerts.

### 3. Health Checks

The API includes built-in health checks for monitoring.

## Cost Optimization

### 1. Free Tier Limitations

- 512MB memory limit
- 750 hours/month
- Sleep after 15 minutes of inactivity

### 2. Paid Tier Benefits

- Higher memory limits
- Always-on service
- Better performance

### 3. Resource Scaling

Scale resources based on actual usage patterns.

## Support

If you encounter issues:

1. Check the Render logs
2. Use the memory optimizer script
3. Review the health endpoint
4. Check Render's status page

## Best Practices

1. **Regular Monitoring**: Check memory usage regularly
2. **Optimize Images**: Ensure uploaded images aren't too large
3. **Update Dependencies**: Keep packages updated
4. **Test Locally**: Test memory usage before deploying
5. **Backup Strategy**: Keep model files backed up

## Conclusion

The optimized version should work well within Render's 512MB limit. The lazy loading and memory cleanup features ensure efficient resource usage while maintaining functionality.
