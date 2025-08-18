#!/bin/bash

# Memory-Optimized Startup Script for Sneaker Authentication API

echo "🚀 Starting Memory-Optimized Sneaker Authentication API..."

# Set memory optimization environment variables
export PYTHONUNBUFFERED=1
export PYTHONDONTWRITEBYTECODE=1
export PYTHONMALLOC=malloc
export PYTHONDEVMODE=0

# Set memory limits for the process
export PYTHONHASHSEED=0

# Check if we're in the right directory
if [ ! -f "backend/app.py" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

# Navigate to backend directory
cd backend

# Check Python version
python_version=$(python3 --version 2>&1)
echo "🐍 Python version: $python_version"

# Check available memory
if command -v free &> /dev/null; then
    available_mem=$(free -m | awk 'NR==2{printf "%.0f", $7}')
    echo "💾 Available system memory: ${available_mem}MB"
    
    if [ "$available_mem" -lt 512 ]; then
        echo "⚠️  Warning: Less than 512MB available. Consider freeing up memory."
    fi
fi

# Install dependencies if needed
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv venv
fi

echo "📦 Activating virtual environment..."
source venv/bin/activate

echo "📦 Installing/updating dependencies..."
pip install --upgrade pip
pip install -r requirements.txt

# Check memory usage before starting
echo "🔍 Checking initial memory usage..."
python3 memory_optimizer.py --check

# Start the application
echo "🌐 Starting API server..."
echo "📁 Working directory: $(pwd)"
echo "🌍 Server will be available at: http://localhost:8000"

# Get port from environment or default to 8000
PORT=${PORT:-8000}
echo "🔌 Using port: $PORT"

# Start with memory monitoring
python3 -u app.py
