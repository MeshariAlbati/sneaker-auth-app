#!/bin/bash

echo "🚀 Building and Deploying Sneaker Authentication App..."

# Build frontend
echo "📦 Building frontend..."
cd frontend
npm install
npm run build
cd ..

# Copy frontend build to backend directory
echo "📋 Copying frontend build to backend..."
cp -r frontend/dist backend/

# Verify the build
echo "✅ Build completed!"
echo "📁 Backend directory contents:"
ls -la backend/

echo ""
echo "🎯 Next steps:"
echo "1. Commit the changes: git add . && git commit -m 'Build frontend for deployment'"
echo "2. Push to your repository: git push origin main"
echo "3. Render will automatically deploy the updated version"
echo ""
echo "🌐 Your app should now serve the frontend at the root URL!"
