#!/usr/bin/env pwsh
# Deploy script for Alexa-hosted skill
# This script pushes your code to Amazon's CodeCommit repository

# Step 1: Build Lambda function
Write-Host "🔨 Building Lambda function..." -ForegroundColor Cyan
& "$PSScriptRoot/build-lambda.ps1"

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed! Deployment aborted." -ForegroundColor Red
    exit 1
}

Write-Host "`nFetching Alexa CodeCommit credentials..." -ForegroundColor Cyan

# Get credentials from ASK CLI (returns array of 2 lines: username=XXX and password=YYY)
$credLines = ask util git-credentials-helper

# Parse username (first line)
$usernameLine = $credLines[0]
if ($usernameLine -match 'username=(.+)') {
    $username = $matches[1].Trim()
} else {
    Write-Host "❌ Failed to parse username from ASK CLI" -ForegroundColor Red
    exit 1
}

# Parse password (second line)
$passwordLine = $credLines[1]
if ($passwordLine -match 'password=(.+)') {
    $password = $matches[1].Trim()
} else {
    Write-Host "❌ Failed to parse password from ASK CLI" -ForegroundColor Red
    exit 1
}

# URL encode special characters in the credentials
Add-Type -AssemblyName System.Web
$usernameEncoded = [System.Web.HttpUtility]::UrlEncode($username)
$passwordEncoded = [System.Web.HttpUtility]::UrlEncode($password)

# Construct the authenticated URL
$repoUrl = "https://${usernameEncoded}:${passwordEncoded}@git-codecommit.us-east-1.amazonaws.com/v1/repos/ac0ac7be-22ea-4512-841b-f6a322cf5673"

Write-Host "Fetching latest from Alexa..." -ForegroundColor Cyan

# Fetch from Alexa to see what's there
git fetch $repoUrl master 2>&1 | Out-Null

Write-Host "Pushing to Alexa (master branch = development stage)..." -ForegroundColor Cyan

# Push to Alexa (force push if needed for first time)
git push $repoUrl master --force

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ Successfully deployed to Alexa development stage!" -ForegroundColor Green
    Write-Host "Your skill should be live in a few minutes." -ForegroundColor Green
    Write-Host "`nCheck deployment status at:" -ForegroundColor Cyan
    Write-Host "https://developer.amazon.com/alexa/console/ask/build/custom/amzn1.ask.skill.ac0ac7be-22ea-4512-841b-f6a322cf5673/development/de_DE/" -ForegroundColor Blue
} else {
    Write-Host "`n❌ Deployment failed!" -ForegroundColor Red
}
