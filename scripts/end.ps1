#requires -Version 5.1
# 작업 끝낼 때 실행 (Windows 데스크탑) — 인계 노트 갱신 + 커밋 + push
#   사용법:  .\scripts\end.ps1 "무엇을 했는지 한 줄"
param([string]$Message = 'wip: 작업 중간 저장')

$ErrorActionPreference = 'Stop'
Set-Location (Join-Path $PSScriptRoot '..')

if (Test-Path 'HANDOFF.md') {
    Write-Host "▶ HANDOFF.md 를 먼저 갱신하세요. (메모장이 열립니다 — 저장 후 닫으면 계속됩니다)"
    Start-Process notepad.exe 'HANDOFF.md' -Wait
}

$dirty = git status --porcelain
if (-not $dirty) {
    Write-Host "변경 사항이 없습니다. push 할 것 없음."
    exit 0
}

git add -A
git commit -m "$Message" -m "기기: $env:COMPUTERNAME"
git pull --rebase --autostash
git push

Write-Host ""
Write-Host "✅ push 완료 — 다른 기기에서 ./scripts/start.sh (또는 .\scripts\start.ps1) 로 이어가세요." -ForegroundColor Green
