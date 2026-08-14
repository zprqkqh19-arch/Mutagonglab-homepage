#requires -Version 5.1
# Windows 자동 동기화 설치 — 한 번만 실행:  .\scripts\install-autosync.ps1
$ErrorActionPreference = 'Continue'
[Console]::OutputEncoding = [Text.Encoding]::UTF8

Set-Location (Join-Path $PSScriptRoot '..')
$repo   = (Get-Location).Path
$script = Join-Path $repo 'scripts\autosync.ps1'
$name   = 'MutagonglabAutoSync'

if (-not (Test-Path $script)) {
    Write-Host "✋ $script 가 없습니다. git pull 먼저 하세요." -ForegroundColor Red
    exit 1
}

$ok = $false

# ── 방법 1: Register-ScheduledTask ──────────────────────────
try {
    $action = New-ScheduledTaskAction -Execute 'powershell.exe' `
              -Argument ('-NoProfile -WindowStyle Hidden -ExecutionPolicy Bypass -File "{0}"' -f $script)

    $tLogon  = New-ScheduledTaskTrigger -AtLogOn
    # RepetitionDuration 은 지정하지 않습니다 (지정하면 일부 Windows 에서 값 범위 오류)
    $tRepeat = New-ScheduledTaskTrigger -Once -At (Get-Date).AddMinutes(1) `
               -RepetitionInterval (New-TimeSpan -Minutes 10)

    $settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries `
                -StartWhenAvailable -ExecutionTimeLimit (New-TimeSpan -Minutes 15) `
                -MultipleInstances IgnoreNew

    Register-ScheduledTask -TaskName $name -Action $action -Trigger $tLogon,$tRepeat `
        -Settings $settings -Description '홈페이지 저장소를 10분마다 자동으로 받아오고 올립니다.' `
        -Force -ErrorAction Stop | Out-Null
    $ok = $true
}
catch {
    Write-Host "  (기본 방식 실패 — 다른 방식으로 재시도합니다)" -ForegroundColor DarkGray
}

# ── 방법 2: schtasks 로 대체 ────────────────────────────────
if (-not $ok) {
    $cmdFile = Join-Path $repo 'scripts\autosync.cmd'
    @"
@echo off
powershell.exe -NoProfile -WindowStyle Hidden -ExecutionPolicy Bypass -File "%~dp0autosync.ps1"
"@ | Set-Content $cmdFile -Encoding ASCII

    schtasks /Create /TN $name /TR $cmdFile /SC MINUTE /MO 10 /F *>$null
    if ($LASTEXITCODE -eq 0) {
        schtasks /Create /TN "$name-Logon" /TR $cmdFile /SC ONLOGON /F *>$null
        $ok = $true
    }
}

# ── 확인 ────────────────────────────────────────────────────
$task = Get-ScheduledTask -TaskName $name -ErrorAction SilentlyContinue
if ($task) {
    Write-Host "✅ 설치 완료 — 10분마다, 그리고 로그인할 때마다 자동 동기화됩니다." -ForegroundColor Green
    Write-Host "   대상 폴더: $repo"
    Write-Host "   등록 상태: $($task.State)"
    Write-Host ""
    Write-Host "   지금 바로 한 번 실행:   .\scripts\autosync.ps1"
    Write-Host "   기록 보기:              Get-Content .git\autosync.log -Tail 20"
    Write-Host "   끄기:                   Unregister-ScheduledTask -TaskName '$name' -Confirm:`$false"
} else {
    Write-Host "❌ 등록에 실패했습니다." -ForegroundColor Red
    Write-Host "   이 창의 메시지를 클로드에게 보여주세요."
    Write-Host "   그동안에는 아래를 직접 실행하면 동기화됩니다:"
    Write-Host "     .\scripts\autosync.ps1"
    exit 1
}
