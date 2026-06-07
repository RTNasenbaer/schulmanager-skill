#!/usr/bin/env pwsh
# Test Alexa Skill - Comprehensive Testing Script
# This script helps you test your Alexa skill locally and remotely

param(
    [Parameter(Mandatory=$false)]
    [ValidateSet('quick', 'full', 'dialog')]
    [string]$TestType = 'quick'
)

$skillId = "amzn1.ask.skill.ac0ac7be-22ea-4512-841b-f6a322cf5673"
$locale = "de-DE"

Write-Host "`n🧪 Alexa Skill Testing Suite" -ForegroundColor Cyan
Write-Host "============================`n" -ForegroundColor Cyan

function Test-BackendAPI {
    Write-Host "📡 Testing Backend API..." -ForegroundColor Yellow
    
    # Check if backend API is running
    $apiUrl = $env:BACKEND_API_URL
    if (-not $apiUrl) {
        $apiUrl = $env:API_BASE_URL
    }
    if (-not $apiUrl) {
        $envFile = ".env"
        if (Test-Path $envFile) {
            $apiUrl = (Get-Content $envFile | Where-Object { $_ -match 'BACKEND_API_URL=' }) -replace 'BACKEND_API_URL=',''
        }
    }

    if (-not $apiUrl) {
        $envFile = ".env"
        if (Test-Path $envFile) {
            $apiUrl = (Get-Content $envFile | Where-Object { $_ -match 'API_BASE_URL=' }) -replace 'API_BASE_URL=',''
        }
    }
    
    if ($apiUrl) {
        try {
            Write-Host "  Checking: $apiUrl" -ForegroundColor Gray
            $response = Invoke-WebRequest -Uri "$apiUrl/health" -Method GET -TimeoutSec 5 -ErrorAction Stop
            Write-Host "  ✅ Backend API is responding (Status: $($response.StatusCode))" -ForegroundColor Green
            return $true
        } catch {
            Write-Host "  ⚠️  Backend API is not responding: $_" -ForegroundColor Red
            Write-Host "  Make sure your backend is running!" -ForegroundColor Yellow
            return $false
        }
    } else {
        Write-Host "  ⚠️  BACKEND_API_URL not found in .env file" -ForegroundColor Yellow
        return $false
    }
}

function Test-SkillManifest {
    Write-Host "`n📋 Validating Skill Manifest..." -ForegroundColor Yellow
    
    try {
        $manifest = Get-Content "skill-package/skill.json" -Raw | ConvertFrom-Json
        Write-Host "  ✅ Skill manifest is valid JSON" -ForegroundColor Green
        Write-Host "  Skill Name: $($manifest.manifest.publishingInformation.locales.'de-DE'.name)" -ForegroundColor Gray
        return $true
    } catch {
        Write-Host "  ❌ Skill manifest has errors: $_" -ForegroundColor Red
        return $false
    }
}

function Test-InteractionModel {
    Write-Host "`n🗣️  Validating Interaction Model..." -ForegroundColor Yellow
    
    try {
        $model = Get-Content "skill-package/interactionModels/custom/de-DE.json" -Raw | ConvertFrom-Json
        $intentCount = $model.interactionModel.languageModel.intents.Count
        Write-Host "  ✅ Interaction model is valid JSON" -ForegroundColor Green
        Write-Host "  Total Intents: $intentCount" -ForegroundColor Gray
        return $true
    } catch {
        Write-Host "  ❌ Interaction model has errors: $_" -ForegroundColor Red
        return $false
    }
}

function Test-LambdaCode {
    Write-Host "`n⚡ Checking Lambda Code..." -ForegroundColor Yellow
    
    if (Test-Path "lambda/index.js") {
        Write-Host "  ✅ Lambda handler found (index.js)" -ForegroundColor Green
        
        # Check for common issues
        $content = Get-Content "lambda/index.js" -Raw
        if ($content -match 'exports\.handler') {
            Write-Host "  ✅ Handler export found" -ForegroundColor Green
        } else {
            Write-Host "  ⚠️  Handler export not found - check your exports" -ForegroundColor Yellow
        }
        return $true
    } else {
        Write-Host "  ❌ lambda/index.js not found!" -ForegroundColor Red
        return $false
    }
}

function Test-RemoteSkill {
    Write-Host "`n🌐 Testing Live Skill..." -ForegroundColor Yellow
    
    Write-Host "  Getting skill status..." -ForegroundColor Gray
    $status = ask smapi get-skill-status -s $skillId | ConvertFrom-Json
    
    $manifestStatus = $status.manifest.lastUpdateRequest.status
    $deployStatus = $status.hostedSkillDeployment.lastUpdateRequest.status
    
    Write-Host "  Manifest Status: $manifestStatus" -ForegroundColor $(if($manifestStatus -eq "SUCCEEDED"){"Green"}else{"Red"})
    Write-Host "  Deployment Status: $deployStatus" -ForegroundColor $(if($deployStatus -eq "SUCCEEDED"){"Green"}else{"Red"})
    
    if ($deployStatus -eq "FAILED") {
        Write-Host "`n  📋 Deployment Logs:" -ForegroundColor Yellow
        Write-Host "  Check the Alexa Developer Console for detailed error logs" -ForegroundColor Gray
        Write-Host "  https://developer.amazon.com/alexa/console/ask" -ForegroundColor Blue
    }
    
    return ($manifestStatus -eq "SUCCEEDED" -and $deployStatus -eq "SUCCEEDED")
}

function Start-DialogTest {
    Write-Host "`n💬 Starting Interactive Dialog Test..." -ForegroundColor Yellow
    Write-Host "  You can now talk to your skill!" -ForegroundColor Gray
    Write-Host "  Type your utterances (or 'quit' to exit)`n" -ForegroundColor Gray
    
    ask dialog -l $locale -s $skillId
}

function Run-QuickTests {
    Write-Host "Running Quick Tests...`n" -ForegroundColor Cyan
    
    $results = @()
    $results += Test-SkillManifest
    $results += Test-InteractionModel
    $results += Test-LambdaCode
    
    return $results
}

function Run-FullTests {
    Write-Host "Running Full Test Suite...`n" -ForegroundColor Cyan
    
    $results = @()
    $results += Test-SkillManifest
    $results += Test-InteractionModel
    $results += Test-LambdaCode
    $results += Test-BackendAPI
    $results += Test-RemoteSkill
    
    return $results
}

# Main execution
switch ($TestType) {
    'quick' {
        $results = Run-QuickTests
    }
    'full' {
        $results = Run-FullTests
    }
    'dialog' {
        Run-QuickTests | Out-Null
        Start-DialogTest
        exit 0
    }
}

# Summary
Write-Host "`n" + "="*50 -ForegroundColor Cyan
Write-Host "📊 Test Summary" -ForegroundColor Cyan
Write-Host "="*50 -ForegroundColor Cyan

$passed = ($results | Where-Object { $_ -eq $true }).Count
$total = $results.Count

Write-Host "Passed: $passed / $total" -ForegroundColor $(if($passed -eq $total){"Green"}else{"Yellow"})

if ($passed -eq $total) {
    Write-Host "`n✅ All tests passed! Your skill is ready." -ForegroundColor Green
} else {
    Write-Host "`n⚠️  Some tests failed. Check the output above." -ForegroundColor Yellow
}

Write-Host "`n💡 Testing Options:" -ForegroundColor Cyan
Write-Host "  .\test-skill.ps1 quick    - Quick local validation" -ForegroundColor Gray
Write-Host "  .\test-skill.ps1 full     - Full test including live skill" -ForegroundColor Gray
Write-Host "  .\test-skill.ps1 dialog   - Interactive testing with Alexa" -ForegroundColor Gray
Write-Host ""
