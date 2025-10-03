#!/bin/bash

echo "Starting Meeting Action Assistant Backend..."
echo

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
    echo
fi

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo
    echo "WARNING: .env file not found!"
    echo "Please copy .env.example to .env and add your OpenAI API key"
    echo
    exit 1
fi

# Install/update dependencies
echo "Installing dependencies..."
pip install -r requirements.txt

# Create uploads directory
mkdir -p uploads

# Start the server
echo
echo "Starting FastAPI server on http://localhost:3001"
echo "Press Ctrl+C to stop the server"
echo
python main.py