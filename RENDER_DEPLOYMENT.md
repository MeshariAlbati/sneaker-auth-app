# 🚀 Render Deployment Guide

## Prerequisites
- GitHub repository with your code
- Render account (free tier available)

## Deployment Steps

### 1. Push Code to GitHub
```bash
git add .
git commit -m "Prepare for Render deployment"
git push origin main
```

### 2. Deploy on Render

1. **Go to [Render Dashboard](https://dashboard.render.com/)**
2. **Click "New +" → "Web Service"**
3. **Connect your GitHub repository**
4. **Configure the service:**
   - **Name**: `sneaker-auth-api`
   - **Environment**: `Python`
   - **Build Command**: `./build.sh`
   - **Start Command**: `./start.sh`
   - **Plan**: `Starter` (free tier)

### 3. Environment Variables
Render will automatically set:
- `PORT`: 8000
- `PYTHON_VERSION`: 3.11.0
- `PYTHONUNBUFFERED`: 1

### 4. Deploy
Click "Create Web Service" and wait for the build to complete.

## File Structure for Render
```
Sneaker project/
├── render.yaml              # Render configuration
├── build.sh                 # Build script
├── start.sh                 # Start script
├── backend/
│   ├── app.py              # FastAPI application
│   ├── requirements.txt    # Python dependencies
│   └── memory_optimizer.py # Memory management
├── frontend/
│   ├── package.json        # Node.js dependencies
│   └── src/                # React source code
└── README.md               # Project documentation
```

## Build Process
1. **Frontend**: Install dependencies and build React app
2. **Backend**: Install Python dependencies
3. **Start**: Launch FastAPI server

## Health Check
- **Endpoint**: `/api/health`
- **Expected Response**: JSON with status "healthy"

## Troubleshooting

### Build Failures
- Check Python version compatibility (3.11)
- Verify all dependencies in requirements.txt
- Ensure build scripts are executable

### Runtime Errors
- Check logs in Render dashboard
- Verify environment variables
- Test health endpoint

### Frontend Issues
- Ensure build completes successfully
- Check static file mounting in backend
- Verify API endpoints are accessible

## Cost
- **Free Tier**: 750 hours/month
- **Starter Plan**: $7/month (unlimited)
- **Standard Plan**: $25/month (better performance)

## Support
- Render Documentation: https://render.com/docs
- Community Forum: https://community.render.com/
