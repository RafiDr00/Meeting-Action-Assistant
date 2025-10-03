#!/bin/bash

echo "============================================"
echo "  Meeting Action Assistant - Development"
echo "============================================"
echo

# Check if .env files exist
if [ ! -f ".env" ]; then
    echo "ERROR: Frontend .env file not found"
    echo "Please run ./setup.sh first"
    exit 1
fi

if [ ! -f "backend/.env" ]; then
    echo "ERROR: Backend .env file not found"
    echo "Please run ./setup.sh first"
    exit 1
fi

echo "Starting backend server..."
cd backend
./start.sh &
BACKEND_PID=$!
cd ..

echo "Waiting for backend to start..."
sleep 3

echo "Starting frontend development server..."
npm run dev &
FRONTEND_PID=$!

echo
echo "============================================"
echo "  Development servers started!"
echo "============================================"
echo
echo "Frontend: http://localhost:3000"
echo "Backend:  http://localhost:3001"
echo
echo "Press Ctrl+C to stop both servers"
echo

# Function to cleanup background processes
cleanup() {
    echo
    echo "Stopping servers..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    exit 0
}

# Trap Ctrl+C and cleanup
trap cleanup INT

# Wait for both processes
wait