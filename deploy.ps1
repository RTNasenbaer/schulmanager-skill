#!/usr/bin/env pwsh
# Deploy script for Alexa Skill (Windows PowerShell)
# This script builds TypeScript and deploys to Alexa-hosted skill

Write-Host "🚀 Deploying Schulmanager Alexa Skill..." -ForegroundColor Cyan

# Navigate to alexa-skill directory
Set-Location -Path "$PSScriptRoot"

# Install dependencies
Write-Host "`n📦 Installing dependencies..." -ForegroundColor Yellow
yarn install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to install dependencies" -ForegroundColor Red
    exit 1
}

# Clean dist folder
Write-Host "`n🧹 Cleaning dist folder..." -ForegroundColor Yellow
if (Test-Path "dist") {
    Remove-Item -Path "dist" -Recurse -Force
}

# Build TypeScript
Write-Host "`n🔨 Building TypeScript..." -ForegroundColor Yellow
yarn build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed" -ForegroundColor Red
    exit 1
}

# Copy compiled files to lambda folder
Write-Host "`n📋 Copying compiled files to lambda folder..." -ForegroundColor Yellow

# Copy main index.js
Copy-Item -Path "dist\index.js" -Destination "lambda\" -Force

# Copy handlers directory
if (Test-Path "dist\handlers") {
    Copy-Item -Path "dist\handlers" -Destination "lambda\" -Recurse -Force
}

# Copy services directory
if (Test-Path "dist\services") {
    Copy-Item -Path "dist\services" -Destination "lambda\" -Recurse -Force
}

# Copy utils directory
if (Test-Path "dist\utils") {
    Copy-Item -Path "dist\utils" -Destination "lambda\" -Recurse -Force
}

Write-Host "✅ Files copied successfully" -ForegroundColor Green

# Deploy to Alexa
Write-Host "`n🚀 Deploying to Alexa-hosted skill..." -ForegroundColor Yellow
ask deploy

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ Deployment successful!" -ForegroundColor Green
    Write-Host "`n🎉 Your skill is now live and ready to test!" -ForegroundColor Cyan
    Write-Host "`nNext steps:" -ForegroundColor White
    Write-Host "1. Go to https://developer.amazon.com/alexa/console/ask" -ForegroundColor White
    Write-Host "2. Open your skill" -ForegroundColor White
    Write-Host "3. Click 'Test' tab" -ForegroundColor White
    Write-Host "4. Say: 'Alexa, öffne Schulmanager'" -ForegroundColor White
} else {
    Write-Host "`n❌ Deployment failed" -ForegroundColor Red
    Write-Host "Check the error messages above" -ForegroundColor Yellow
    exit 1
}
