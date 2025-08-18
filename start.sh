#!/bin/bash

# Sneaker Authentication App Startup Script

echo "🚀 Starting Sneaker Authentication App..."

# Function to cleanup background processes
cleanup() {
    echo "🛑 Shutting down services..."
    kill $(jobs -p) 2>/dev/null
    exit 0
}

# Set trap to cleanup on script exit
trap cleanup SIGINT SIGTERM

# Start FastAPI backend
echo "📊 Starting FastAPI backend on http://localhost:8000..."
cd backend
python app.py &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 3

# Start React frontend
echo "🎨 Starting React frontend on http://localhost:3000..."
cd ../frontend
npm run dev &
FRONTEND_PID=$!

echo ""
echo "✅ Services started successfully!"
echo "🔗 Frontend: http://localhost:3000"
echo "🔗 Backend API: http://localhost:8000"
echo "📚 API Docs: http://localhost:8000/docs"
echo ""
echo "Press Ctrl+C to stop all services"

# Wait for background processes
wait
