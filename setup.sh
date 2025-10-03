#!/bin/bash

echo "============================================"
echo "  Meeting Action Assistant - Setup Script"
echo "============================================"
echo

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js is not installed or not in PATH"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "ERROR: Python is not installed or not in PATH"
    echo "Please install Python from https://python.org/"
    exit 1
fi

echo "🔧 Setting up Frontend..."
echo

# Install frontend dependencies
npm install
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to install frontend dependencies"
    exit 1
fi

# Create frontend .env file if it doesn't exist
if [ ! -f ".env" ]; then
    echo "Creating frontend .env file..."
    cp .env.example .env
fi

echo "✅ Frontend setup complete!"
echo

echo "🔧 Setting up Backend..."
echo

# Navigate to backend directory
cd backend

# Create virtual environment
if [ ! -d "venv" ]; then
    echo "Creating Python virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
source venv/bin/activate

# Install backend dependencies
echo "Installing Python dependencies..."
pip install -r requirements.txt
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to install backend dependencies"
    cd ..
    exit 1
fi

# Create backend .env file if it doesn't exist
if [ ! -f ".env" ]; then
    echo "Creating backend .env file..."
    cp .env.example .env
    echo
    echo "⚠️  IMPORTANT: Please edit backend/.env and add your OpenAI API key!"
    echo "   Get your API key from: https://platform.openai.com/api-keys"
    echo
fi

# Create uploads directory
mkdir -p uploads

cd ..

echo "✅ Backend setup complete!"
echo
echo "============================================"
echo "  Setup Complete! 🎉"
echo "============================================"
echo
echo "Next steps:"
echo "1. Add your OpenAI API key to backend/.env"
echo "2. Start the backend: cd backend && ./start.sh"
echo "3. Start the frontend: npm run dev"
echo "4. Open http://localhost:3000"
echo
echo "For detailed instructions, see README.md"
echo