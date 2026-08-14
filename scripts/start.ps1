#requires -Version 5.1
# 작업 시작할 때 실행 (Windows 데스크탑)
#   사용법:  .\scripts\start.ps1
$ErrorActionPreference = 'Stop'
Set-Location (Join-Path $PSScriptRoot '..')

Write-Host "▶ 원격 상태 가져오는 중..."
git fetch --all --prune

$dirty = git status --porcelain
if ($dirty) {
    Write-Host ""
    Write-Host "⚠️  이 기기에 아직 push 안 된 변경이 남아 있습니다:" -ForegroundColor Yellow
    git status --short
    Write-Host ""
    Write-Host "   → 이어서 작업하려면 그대로 두고,"
    Write-Host "     다른 기기 내용으로 맞추려면 먼저 정리(commit 또는 stash)하세요."
    Write-Host '     stash:  git stash push -m "작업중"'
    exit 1
}

Write-Host "▶ 최신 내용 받아오는 중..."
git pull --rebase --autostash

$branch = git rev-parse --abbrev-ref HEAD
Write-Host ""
Write-Host "✅ 준비 완료  |  브랜치: $branch  |  기기: $env:COMPUTERNAME" -ForegroundColor Green
Write-Host "──────────────────────────────────────────────"

if (Test-Path 'HANDOFF.md') {
    Get-Content 'HANDOFF.md' -Encoding UTF8
} else {
    Write-Host "(HANDOFF.md 없음 — 저장소 루트에 만들어 두면 여기 표시됩니다)"
}
