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
if [ ! -f "railway.yaml" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

# Check if we have a Railway project
if ! railway status &> /dev/null; then
    echo "📁 No Railway project found. Creating new project..."
    railway init
fi

# Show current project status
echo "📊 Current Railway project status:"
railway status

# Deploy the application
echo "🚀 Deploying to Railway..."
railway up

# Show deployment status
echo "✅ Deployment completed!"
echo "🌐 Your app should be available at the URL shown above"

# Show logs
echo "📋 Recent logs:"
railway logs --tail 20

echo "🎉 Railway deployment completed successfully!"
echo "💡 Use 'railway logs' to monitor your application"
echo "🔗 Use 'railway open' to open your application in the browser"
