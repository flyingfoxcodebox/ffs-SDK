#!/bin/bash

# POS Demo Setup Script
echo "🦊 Setting up Flying Fox POS Demo..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the pos-demo directory"
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Check if installation was successful
if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully!"
    echo ""
    echo "🚀 To start the demo:"
    echo "   npm run dev"
    echo ""
    echo "🌐 The demo will be available at: http://localhost:3000"
    echo ""
    echo "📚 For more information, see README.md"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi
