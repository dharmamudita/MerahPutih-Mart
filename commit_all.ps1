$files = git status --porcelain | ForEach-Object { $_.Substring(3) }
foreach ($file in $files) {
    if (-not [string]::IsNullOrWhiteSpace($file)) {
        git add "$file"
        $basename = Split-Path -Path $file -Leaf
        git commit -m "feat: integrate API for $basename"
    }
}
git push origin main
