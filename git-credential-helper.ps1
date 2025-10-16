#!/usr/bin/env pwsh
# Git credential helper for ASK CLI
$operation = $args[0]

if ($operation -eq "get") {
    $credentials = ask util git-credentials-helper
    Write-Output $credentials
}
