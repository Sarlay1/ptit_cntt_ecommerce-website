[CmdletBinding()]
param(
    [string]$BaseUrl = "http://localhost:8088"
)

$ErrorActionPreference = "Stop"
$health = $null
$lastError = $null
for ($attempt = 0; $attempt -lt 30; $attempt++) {
    try {
        $health = Invoke-RestMethod -Uri "$BaseUrl/actuator/health" -Method Get
        if ($health.status -eq "UP") {
            break
        }
    } catch {
        $lastError = $_.Exception.Message
    }

    Start-Sleep -Seconds 2
}
if ($null -eq $health -or $health.status -ne "UP") {
    $detail = if ($lastError) { " Last error: $lastError" } else { "" }
    throw "Backend health check did not return UP.$detail"
}

$products = Invoke-RestMethod -Uri "$BaseUrl/api/v1/products?page=0&size=1" -Method Get
if ($null -eq $products.content) {
    throw "The public product catalogue did not return a paged response."
}

$cartStatus = 0
try {
    Invoke-WebRequest -Uri "$BaseUrl/api/v1/cart" -Method Get | Out-Null
} catch {
    if ($_.Exception.Response) {
        $cartStatus = [int]$_.Exception.Response.StatusCode
    }
}
if ($cartStatus -ne 401) {
    throw "Expected unauthenticated cart access to return 401; received $cartStatus."
}
Write-Output "Lumi Beauty health, public catalogue, and customer authorization checks passed."
