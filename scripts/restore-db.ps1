[CmdletBinding(SupportsShouldProcess = $true, ConfirmImpact = "High")]
param(
    [Parameter(Mandatory = $true)]
    [string]$InputPath
)

$ErrorActionPreference = "Stop"
$resolvedInput = Resolve-Path -LiteralPath $InputPath
if (-not $PSCmdlet.ShouldProcess("WebBanHang database", "Restore from $resolvedInput (overwrites current data)")) {
    return
}

$command = 'docker compose exec -T mysql sh -c "exec mysql -uroot -p`"$MYSQL_ROOT_PASSWORD`" webbanhang" < "' + $resolvedInput.Path + '"'
$restore = Start-Process -FilePath $env:ComSpec -ArgumentList @("/c", $command) -NoNewWindow -Wait -PassThru
if ($restore.ExitCode -ne 0) {
    throw "Database restore failed."
}
Write-Output "Database restored from $resolvedInput"
