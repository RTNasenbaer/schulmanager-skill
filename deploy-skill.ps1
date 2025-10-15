#!/usr/bin/env pwsh

# Alexa Skill Deployment Script
# Builds and deploys the Schulmanager Alexa Skill

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "Schulmanager Alexa Skill Deployment" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Build TypeScript
Write-Host "Step 1: Building TypeScript..." -ForegroundColor Yellow
Set-Location $PSScriptRoot
yarn build

if ($LASTEXITCODE -ne 0) {
    Write-Host "Build failed!" -ForegroundColor Red
    exit 1
}

Write-Host "Build successful!" -ForegroundColor Green
Write-Host ""

# Step 2: Deploy with ASK CLI
Write-Host "Step 2: Deploying to Alexa..." -ForegroundColor Yellow
ask deploy

if ($LASTEXITCODE -ne 0) {
    Write-Host "Deployment failed!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "==================================" -ForegroundColor Green
Write-Host "Deployment Complete!" -ForegroundColor Green
Write-Host "==================================" -ForegroundColor Green
Write-Host ""
Write-Host "You can now test your skill in the Alexa Developer Console or on your Alexa device." -ForegroundColor Cyan
