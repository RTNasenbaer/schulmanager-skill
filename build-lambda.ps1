#!/usr/bin/env pwsh
# Build Lambda function before deployment
# Compiles TypeScript to JavaScript

Write-Host "🔨 Building Lambda function..." -ForegroundColor Cyan

# Navigate to lambda directory
Push-Location lambda

try {
    # Check if TypeScript files exist
    $tsFiles = Get-ChildItem -Recurse -Include *.ts | Where-Object { 
        $_.FullName -notlike "*node_modules*" -and $_.Name -notlike "*.d.ts"
    }

    if ($tsFiles.Count -eq 0) {
        Write-Host "⚠️  No TypeScript source files found - using existing .js files" -ForegroundColor Yellow
    } else {
        # Compile TypeScript
        Write-Host "Compiling TypeScript..." -ForegroundColor Yellow
        npx tsc

        if ($LASTEXITCODE -ne 0) {
            Write-Host "❌ TypeScript compilation failed!" -ForegroundColor Red
            exit 1
        }
    }

    # Verify critical files exist
    Write-Host "Verifying build output..." -ForegroundColor Yellow
    $criticalFiles = @(
        "index.js",
        "handlers/LaunchRequestHandler.js",
        "services/apiClient.service.js"
    )

    $allExist = $true
    foreach ($file in $criticalFiles) {
        if (-not (Test-Path $file)) {
            Write-Host "❌ Missing: $file" -ForegroundColor Red
            $allExist = $false
        }
    }

    if (-not $allExist) {
        Write-Host "❌ Build verification failed!" -ForegroundColor Red
        exit 1
    }

    # Clean up source maps (not needed in deployment)
    Write-Host "Removing source maps..." -ForegroundColor Yellow
    Get-ChildItem -Recurse -Include *.js.map | Where-Object { 
        $_.FullName -notlike "*node_modules*" 
    } | Remove-Item -Force -ErrorAction SilentlyContinue

    Write-Host "✅ Lambda build successful!" -ForegroundColor Green
    Write-Host "   All required .js files present" -ForegroundColor Gray
}
finally {
    Pop-Location
}
