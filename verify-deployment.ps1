#!/usr/bin/env pwsh
# Pre-deployment verification script
# Checks if Lambda is ready for deployment

Write-Host "`n🔍 Pre-Deployment Verification Checklist`n" -ForegroundColor Cyan

$allGood = $true

# Check 1: TypeScript compilation
Write-Host "[1/7] Checking TypeScript compilation..." -ForegroundColor Yellow
Push-Location lambda
try {
    $tsOutput = npx tsc --noEmit 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  ✅ TypeScript compiles without errors" -ForegroundColor Green
    } else {
        Write-Host "  ❌ TypeScript has compilation errors:" -ForegroundColor Red
        Write-Host $tsOutput
        $allGood = $false
    }
} finally {
    Pop-Location
}

# Check 2: Required JavaScript files
Write-Host "[2/7] Checking required JavaScript files..." -ForegroundColor Yellow
$requiredFiles = @(
    "lambda/index.js",
    "lambda/handlers/LaunchRequestHandler.js",
    "lambda/services/apiClient.service.js",
    "lambda/utils/responseBuilder.util.js"
)

$missingFiles = @()
foreach ($file in $requiredFiles) {
    if (-not (Test-Path $file)) {
        $missingFiles += $file
    }
}

if ($missingFiles.Count -eq 0) {
    Write-Host "  ✅ All required .js files exist" -ForegroundColor Green
} else {
    Write-Host "  ❌ Missing files:" -ForegroundColor Red
    $missingFiles | ForEach-Object { Write-Host "     - $_" -ForegroundColor Red }
    $allGood = $false
}

# Check 3: No TypeScript files in git index
Write-Host "[3/7] Checking git index for TypeScript source files..." -ForegroundColor Yellow
Push-Location lambda
try {
    $trackedTs = git ls-files "*.ts" | Where-Object { $_ -notlike "*.d.ts" }
    if ($trackedTs.Count -eq 0) {
        Write-Host "  ✅ No .ts source files in git (only .d.ts type definitions)" -ForegroundColor Green
    } else {
        Write-Host "  ❌ TypeScript source files are tracked in git:" -ForegroundColor Red
        $trackedTs | ForEach-Object { Write-Host "     - $_" -ForegroundColor Red }
        Write-Host "     Run: git rm --cached $_" -ForegroundColor Yellow
        $allGood = $false
    }
} finally {
    Pop-Location
}

# Check 4: package-lock.json exists (not yarn.lock)
Write-Host "[4/7] Checking package lock file..." -ForegroundColor Yellow
if (Test-Path "lambda/package-lock.json") {
    Write-Host "  ✅ package-lock.json exists (npm)" -ForegroundColor Green
} else {
    Write-Host "  ❌ package-lock.json missing!" -ForegroundColor Red
    Write-Host "     Run: cd lambda && npm install --package-lock-only" -ForegroundColor Yellow
    $allGood = $false
}

if (Test-Path "lambda/yarn.lock") {
    Write-Host "  ⚠️  yarn.lock exists (should be removed)" -ForegroundColor Yellow
    Write-Host "     Run: git rm lambda/yarn.lock" -ForegroundColor Yellow
    $allGood = $false
}

# Check 5: Dependencies install correctly
Write-Host "[5/7] Testing npm install..." -ForegroundColor Yellow
Push-Location lambda
try {
    $npmOutput = npm install --dry-run 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  ✅ npm install will succeed" -ForegroundColor Green
    } else {
        Write-Host "  ❌ npm install has issues:" -ForegroundColor Red
        Write-Host $npmOutput
        $allGood = $false
    }
} finally {
    Pop-Location
}

# Check 6: Handler exports correctly
Write-Host "[6/7] Verifying Lambda handler export..." -ForegroundColor Yellow
$handlerTest = @"
const handler = require('./lambda/index.js');
if (!handler.handler || typeof handler.handler !== 'function') {
    process.exit(1);
}
console.log('Handler type:', typeof handler.handler);
"@

$testResult = node -e $handlerTest 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "  ✅ Lambda handler exports correctly" -ForegroundColor Green
    Write-Host "     $testResult" -ForegroundColor Gray
} else {
    Write-Host "  ❌ Lambda handler export issue:" -ForegroundColor Red
    Write-Host $testResult
    $allGood = $false
}

# Check 7: Backend API URL configured
Write-Host "[7/7] Checking backend API configuration..." -ForegroundColor Yellow
$apiConfig = Select-String -Path "lambda/services/apiClient.service.js" -Pattern "BACKEND_API_URL"
if ($apiConfig) {
    Write-Host "  ✅ Backend API URL is configured" -ForegroundColor Green
    $apiConfig | ForEach-Object { Write-Host "     $($_.Line.Trim())" -ForegroundColor Gray }
} else {
    Write-Host "  ⚠️  Backend API URL not found in apiClient.service.js" -ForegroundColor Yellow
}

# Summary
Write-Host "`n" + ("="*60) -ForegroundColor Cyan
if ($allGood) {
    Write-Host "✅ ALL CHECKS PASSED - Ready for deployment!" -ForegroundColor Green
    Write-Host "`nNext steps:" -ForegroundColor Cyan
    Write-Host "  1. Run: .\deploy-to-alexa.ps1" -ForegroundColor White
    Write-Host "  2. Wait 1-2 minutes for Lambda to build" -ForegroundColor White
    Write-Host "  3. Test in Alexa Console: 'öffne schulmanager'" -ForegroundColor White
    Write-Host "  4. Check CloudWatch logs if errors occur" -ForegroundColor White
} else {
    Write-Host "❌ SOME CHECKS FAILED - Fix issues before deployment!" -ForegroundColor Red
    Write-Host "`nRun this script again after fixing the issues." -ForegroundColor Yellow
}
Write-Host ("="*60) -ForegroundColor Cyan
Write-Host ""
