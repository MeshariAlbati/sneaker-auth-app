#!/bin/bash
# Build script for Render deployment

echo "🚀 Starting build process..."

# Install Node.js dependencies and build frontend
echo "📦 Installing frontend dependencies..."
cd frontend
npm install
echo "🔨 Building frontend..."
npm run build
cd ..

# Install Python dependencies
echo "🐍 Installing Python dependencies..."
cd backend
pip install -r requirements.txt
cd ..

echo "✅ Build completed successfully!"
