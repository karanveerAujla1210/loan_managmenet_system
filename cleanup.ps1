$ErrorActionPreference = 'SilentlyContinue'
$WarningPreference = 'SilentlyContinue'

# Directories to delete
$dirs = @('-p', '.qodo', 'desktop-app', 'mobile-app', 'infrastructure', 'monitoring', 'nginx', 'loan-crm-backend', 'public', 'src')
foreach ($dir in $dirs) {
    $path = Join-Path (Get-Location) $dir
    if (Test-Path $path) {
        Write-Host "Deleting $dir..."
        Remove-Item -Path $path -Recurse -Force
    }
}

# Files to delete
$files = @(
    'AUDIT_REPORT.md', 'BEFORE_AND_AFTER.md', 'CLEAN_STRUCTURE.md', 'COMPLETE_AUDIT_REPORT.md', 
    'COMPONENT_STRUCTURE.md', 'CONSOLIDATION_EXECUTION_GUIDE.md', 'CONSOLIDATION_SUMMARY.md', 
    'CONSOLIDATION_VISUAL_GUIDE.md', 'COREUI_ANALYSIS.md', 'COREUI_QUICK_REFERENCE.md', 
    'DASHBOARD_FLOW.md', 'DELIVERY_COMPLETE.md', 'DELIVERY_SUMMARY.md', 'FINAL_VERIFICATION_REPORT.md', 
    'FORMULAS_EXACT.md', 'FRONTEND_ARCHITECTURE.md', 'FRONTEND_DELIVERY_SUMMARY.md', 'FRONTEND_SETUP.md', 
    'IMPLEMENTATION_CHECKLIST.md', 'IMPLEMENTATION_GUIDE.md', 'LOAN_ENGINE_COMPLETE.md', 'LOAN_SYSTEM_SETUP.md', 
    'MERGE_CHECKLIST.md', 'MERGE_COMPLETION_REPORT.md', 'MERGE_DOCUMENTATION_INDEX.md', 'MERGED_PROJECT_STRUCTURE.md', 
    'MIGRATION_GUIDE.md', 'MODERN_CRM_README.md', 'OPERATIONAL_WORKFLOWS.md', 'PERFORMANCE_OPTIMIZATION_GUIDE.md', 
    'PROJECT_CONSOLIDATION_PLAN.md', 'PROJECT_STRUCTURE_DETAILED.md', 'QUICK_REFERENCE.md', 'QUICK_START_MERGED.md', 
    'README_PRODUCTION_CRM.md', 'SECURITY_FIX_REPORT.md', 'SECURITY_FIXES.md', 'SECURITY_IMPLEMENTATION_COMPLETE.md',
    'import-data.bat', 'import-data.sh', 'open-in-vscode.bat', 'setup-cron.bat', 'start-dev.bat', 
    'fix-security.ps1', 'split-json-and-import.js', '.env.production', '.vercelignore', '.dockerignore', 
    'vercel-env-backend.txt', 'vercel-env-frontend.txt'
)

foreach ($file in $files) {
    $path = Join-Path (Get-Location) $file
    if (Test-Path $path) {
        Write-Host "Deleting $file..."
        Remove-Item -Path $path -Force
    }
}

# Move data files
if (-not (Test-Path 'data')) { 
    New-Item -ItemType Directory -Path 'data' -Force | Out-Null 
}

Get-Item *.json -ErrorAction SilentlyContinue | ForEach-Object {
    Move-Item -Path $_.FullName -Destination 'data\' -Force
}

Get-Item *.xlsx -ErrorAction SilentlyContinue | ForEach-Object {
    Move-Item -Path $_.FullName -Destination 'data\' -Force
}

Write-Host "Cleanup complete!"
