#!/bin/bash

# Railway Deployment Script for Sneaker Authentication API

echo "🚂 Deploying to Railway..."

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI not found. Installing..."
    npm install -g @railway/cli
fi

# Check if we're logged in to Railway
if ! railway whoami &> /dev/null; then
    echo "🔐 Please login to Railway..."
    railway login
fi

# Check if we're in the right directory
if [ ! -f "railway.toml" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    echo "📁 Current directory: $(pwd)"
    echo "🔍 Looking for: railway.toml"
    exit 1
fi

# Check if we have a Railway project
if ! railway status &> /dev/null; then
    echo "📁 No Railway project found. Creating new project..."
    railway init
fi

# Verify configuration files
echo "🔍 Verifying configuration files..."
if [ -f "railway.yaml" ]; then
    echo "⚠️  Warning: railway.yaml found. This may conflict with railway.toml"
    echo "💡 Consider removing railway.yaml to avoid conflicts"
fi

# Show current project status
echo "📊 Current Railway project status:"
railway status

# Deploy the application
echo "🚀 Deploying to Railway..."
railway up

# Wait a moment for deployment to stabilize
echo "⏳ Waiting for deployment to stabilize..."
sleep 10

# Check deployment status
echo "🔍 Checking deployment status..."
if railway status | grep -q "running"; then
    echo "✅ Deployment appears successful!"
else
    echo "⚠️  Deployment may have issues. Checking logs..."
fi

# Show deployment status
echo "📊 Final deployment status:"
railway status

# Show logs to verify everything is working
echo "📋 Recent logs (last 20 lines):"
railway logs --tail 20

# Check if health endpoint is responding
echo "🏥 Checking health endpoint..."
HEALTH_URL=$(railway status | grep -o 'https://[^[:space:]]*' | head -1)
if [ ! -z "$HEALTH_URL" ]; then
    echo "🔗 Health check URL: ${HEALTH_URL}/api/health"
    echo "💡 You can test the health endpoint manually"
else
    echo "⚠️  Could not determine health check URL"
fi

echo ""
echo "🎉 Railway deployment completed!"
echo "💡 Use 'railway logs' to monitor your application"
echo "🔗 Use 'railway open' to open your application in the browser"
echo "📊 Use 'railway status' to check deployment status"
echo ""
echo "🚨 If you see 'service unavailable' errors:"
echo "   1. Check logs: railway logs --tail 100"
echo "   2. Verify health check: ${HEALTH_URL}/api/health"
echo "   3. Check resource limits and environment variables"
