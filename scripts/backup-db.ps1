[CmdletBinding()]
param(
    [string]$OutputPath = ".\backups\webbanhang-$(Get-Date -Format 'yyyyMMdd-HHmmss').sql"
)

$ErrorActionPreference = "Stop"
$resolvedOutput = [System.IO.Path]::GetFullPath($OutputPath)
$parent = Split-Path -Parent $resolvedOutput
New-Item -ItemType Directory -Force -Path $parent | Out-Null

$backup = Start-Process -FilePath "docker" `
    -ArgumentList @("compose", "exec", "-T", "mysql", "sh", "-c", 'exec mysqldump --single-transaction --routines --triggers -uroot -p"$MYSQL_ROOT_PASSWORD" webbanhang') `
    -RedirectStandardOutput $resolvedOutput -NoNewWindow -Wait -PassThru
if ($backup.ExitCode -ne 0) {
    throw "Database backup failed."
}
Write-Output "Database backup written to $resolvedOutput"
