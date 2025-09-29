@echo off
REM POS Demo Setup Script for Windows
echo 🦊 Setting up Flying Fox POS Demo...

REM Check if we're in the right directory
if not exist "package.json" (
    echo ❌ Error: Please run this script from the pos-demo directory
    exit /b 1
)

REM Install dependencies
echo 📦 Installing dependencies...
npm install

REM Check if installation was successful
if %errorlevel% equ 0 (
    echo ✅ Dependencies installed successfully!
    echo.
    echo 🚀 To start the demo:
    echo    npm run dev
    echo.
    echo 🌐 The demo will be available at: http://localhost:3000
    echo.
    echo 📚 For more information, see README.md
) else (
    echo ❌ Failed to install dependencies
    exit /b 1
)
