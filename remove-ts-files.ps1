$directories = @(
    "app",
    "components",
    "hooks",
    "lib"
)

$removedFiles = @()
$errorFiles = @()

foreach ($dir in $directories) {
    $path = "c:\Users\user\OneDrive\Desktop\WebApi\client\$dir"
    
    # Get all TypeScript files (excluding config files and type definitions)
    $tsFiles = Get-ChildItem -Path $path -Recurse -File -Include *.tsx,*.ts | 
               Where-Object { $_.Name -notlike "*.d.ts" -and $_.Name -notlike "*.config.ts" }
    
    foreach ($file in $tsFiles) {
        # Determine the equivalent JavaScript file path
        $jsPath = $file.FullName -replace "\.tsx$", ".jsx" -replace "\.ts$", ".js"
        
        # Check if JavaScript equivalent exists
        if (Test-Path $jsPath) {
            try {
                # Remove the TypeScript file
                Remove-Item -Path $file.FullName -Force
                $removedFiles += $file.FullName
            } catch {
                $errorFiles += $file.FullName
            }
        }
    }
}

Write-Host "Successfully removed $($removedFiles.Count) TypeScript files:"
$removedFiles | ForEach-Object { Write-Host "- $_" }

if ($errorFiles.Count -gt 0) {
    Write-Host "`nFailed to remove $($errorFiles.Count) files:"
    $errorFiles | ForEach-Object { Write-Host "- $_" }
}
