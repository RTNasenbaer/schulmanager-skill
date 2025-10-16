#!/usr/bin/env pwsh
# Sync Alexa dev branch with master branch

Write-Host "Fetching Alexa CodeCommit credentials..." -ForegroundColor Cyan

# Get credentials from ASK CLI
$credLines = ask util git-credentials-helper

# Parse credentials
$usernameLine = $credLines[0]
if ($usernameLine -match 'username=(.+)') {
    $username = $matches[1].Trim()
} else {
    Write-Host "❌ Failed to parse username" -ForegroundColor Red
    exit 1
}

$passwordLine = $credLines[1]
if ($passwordLine -match 'password=(.+)') {
    $password = $matches[1].Trim()
} else {
    Write-Host "❌ Failed to parse password" -ForegroundColor Red
    exit 1
}

# URL encode
Add-Type -AssemblyName System.Web
$usernameEncoded = [System.Web.HttpUtility]::UrlEncode($username)
$passwordEncoded = [System.Web.HttpUtility]::UrlEncode($password)
$repoUrl = "https://${usernameEncoded}:${passwordEncoded}@git-codecommit.us-east-1.amazonaws.com/v1/repos/ac0ac7be-22ea-4512-841b-f6a322cf5673"

Write-Host "Syncing dev branch with master..." -ForegroundColor Cyan

# Push master to dev branch (this syncs them)
git push $repoUrl master:dev --force 2>&1 | Select-Object -Last 5

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ Successfully synced dev branch with master!" -ForegroundColor Green
    Write-Host "The Alexa code editor should now be enabled." -ForegroundColor Green
} else {
    Write-Host "`n❌ Sync failed!" -ForegroundColor Red
}
