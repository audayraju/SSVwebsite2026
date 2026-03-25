# Hostinger Deployment Script for SSV Jewellers
# Run this script in PowerShell from the ssv-react folder

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  SSV Jewellers - Hostinger Deployment" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Check if node_modules exists
if (-not (Test-Path "node_modules")) {
    Write-Host "[1/4] Installing dependencies..." -ForegroundColor Yellow
    npm install
} else {
    Write-Host "[1/4] Dependencies already installed" -ForegroundColor Green
}

# Step 2: Check for .env.production
if (-not (Test-Path ".env.production")) {
    Write-Host ""
    Write-Host "[WARNING] .env.production not found!" -ForegroundColor Red
    Write-Host "Copy .env.production.example to .env.production and configure it." -ForegroundColor Yellow
    Write-Host ""
    $continue = Read-Host "Continue with default settings? (y/n)"
    if ($continue -ne "y") {
        exit 1
    }
}

# Step 3: Build the project
Write-Host ""
Write-Host "[2/4] Building production bundle..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "[ERROR] Build failed!" -ForegroundColor Red
    exit 1
}

Write-Host "[2/4] Build completed successfully!" -ForegroundColor Green

# Step 4: Create deployment ZIP
Write-Host ""
Write-Host "[3/4] Creating deployment package..." -ForegroundColor Yellow

$timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm"
$zipName = "hostinger-deploy-$timestamp.zip"

# Remove old deployment zips
Remove-Item -Path "hostinger-deploy-*.zip" -ErrorAction SilentlyContinue

# Create ZIP from dist folder
Compress-Archive -Path "dist\*" -DestinationPath $zipName -Force

Write-Host "[3/4] Created: $zipName" -ForegroundColor Green

# Step 5: Instructions
Write-Host ""
Write-Host "[4/4] Deployment Instructions:" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Log in to Hostinger hPanel" -ForegroundColor White
Write-Host "2. Go to: Files > File Manager" -ForegroundColor White
Write-Host "3. Navigate to: public_html/" -ForegroundColor White
Write-Host "4. Delete existing files (backup first if needed)" -ForegroundColor White
Write-Host "5. Upload: $zipName" -ForegroundColor Green
Write-Host "6. Extract the ZIP in public_html/" -ForegroundColor White
Write-Host "7. Delete the ZIP file after extraction" -ForegroundColor White
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Deployment package ready!" -ForegroundColor Green
Write-Host "File location: $(Get-Location)\$zipName" -ForegroundColor Cyan
Write-Host ""

# Open the folder
explorer.exe .
