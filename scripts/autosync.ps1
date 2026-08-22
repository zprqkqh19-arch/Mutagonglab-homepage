#requires -Version 5.1
# 백그라운드 자동 동기화 (Windows) — 작업 스케줄러가 10분마다 실행
# 직접 실행해도 됩니다: .\scripts\autosync.ps1
$ErrorActionPreference = 'Continue'
[Console]::OutputEncoding = [Text.Encoding]::UTF8

Set-Location (Join-Path $PSScriptRoot '..')
$repo = (Get-Location).Path
$log  = Join-Path $repo '.git\autosync.log'
$lock = Join-Path $repo '.git\autosync.lock'
$halt = Join-Path $repo '.git\AUTOSYNC_HALTED'
$note = Join-Path $repo '_동기화_중단됨_읽어보세요.txt'

function Log($m){ "{0}  {1}" -f (Get-Date -Format 'yyyy-MM-dd HH:mm:ss'), $m | Add-Content -Path $log -Encoding UTF8 }

if ((Test-Path $log) -and (Get-Item $log).Length -gt 200000) {
    Get-Content $log -Tail 300 | Set-Content "$log.tmp" -Encoding UTF8
    Move-Item "$log.tmp" $log -Force
}

if (Test-Path $lock) {
    if ((Get-Item $lock).LastWriteTime -lt (Get-Date).AddMinutes(-30)) { Remove-Item $lock -Force } else { exit 0 }
}
New-Item $lock -ItemType File -Force *>$null
try {
    foreach ($p in '.git\rebase-merge','.git\rebase-apply','.git\MERGE_HEAD','.git\CHERRY_PICK_HEAD') {
        if (Test-Path $p) { Log "건너뜀 — 병합/리베이스 진행 중"; exit 0 }
    }
    if (Test-Path $halt) { Log "건너뜀 — 이전 충돌이 아직 해결되지 않음"; exit 0 }

    $br = git rev-parse --abbrev-ref HEAD 2>$null
    if (-not $br) { Log "건너뜀 — 브랜치 없음"; exit 0 }

    git fetch --quiet origin 2>$null
    if ($LASTEXITCODE -ne 0) { Log "건너뜀 — 원격 접속 실패(네트워크?)"; exit 0 }

    # 0) 받은 패치 자동 반영 (_받은패치\ 에 넣어두면 여기서 풀어 적용)
    $inbox = Join-Path $repo '_받은패치'
    $done  = Join-Path $inbox '처리완료'
    New-Item $done -ItemType Directory -Force *>$null

    # 다운로드 폴더에서 홈페이지 관련 파일 자동 수거
    $dl = Join-Path $env:USERPROFILE 'Downloads'
    if (Test-Path $dl) {
        $pat = 'mutagonglab|homepage|무타공랩|홈페이지|patch'
        $ext = @('.zip','.html','.css','.js','.svg','.png','.webp','.md')
        foreach ($d in @(Get-ChildItem $dl -File -ErrorAction SilentlyContinue)) {
            if ($d.Name -notmatch $pat) { continue }
            if ($ext -notcontains $d.Extension.ToLower()) { continue }
            if ($d.LastWriteTime -lt (Get-Date).AddDays(-1)) { continue }
            try { Move-Item $d.FullName (Join-Path $inbox $d.Name) -Force; Log "다운로드에서 수거: $($d.Name)" }
            catch { Log "수거 실패: $($d.Name)" }
        }
    }
    if (Test-Path $inbox) {
        foreach ($f in @(Get-ChildItem $inbox -File)) {
            if ($f.Name -like 'README*') { continue }
            try {
                if ($f.Extension -eq '.zip') {
                    $tmp = Join-Path $env:TEMP ('mtgpatch_' + [guid]::NewGuid().ToString('N'))
                    Expand-Archive -Path $f.FullName -DestinationPath $tmp -Force
                    $top = @(Get-ChildItem $tmp -Force)
                    if ($top.Count -eq 1 -and $top[0].PSIsContainer) { $src = $top[0].FullName } else { $src = $tmp }
                    $dotgit = Join-Path $src '.git'
                    if (Test-Path $dotgit) { Remove-Item $dotgit -Recurse -Force }
                    Copy-Item (Join-Path $src '*') $repo -Recurse -Force
                    Remove-Item $tmp -Recurse -Force
                    Log "패치 적용: $($f.Name)"
                } else {
                    Copy-Item $f.FullName $repo -Force
                    Log "파일 적용: $($f.Name)"
                }
                Move-Item $f.FullName (Join-Path $done $f.Name) -Force
            } catch { Log "⚠️ 패치 적용 실패: $($f.Name) — $_" }
        }
    }

    # 1) 이 기기의 변경을 커밋
    if (git status --porcelain) {
        git add -A
        $n = @(git diff --cached --numstat).Count
        git commit -q -m ("auto: {0} ({1}) — 파일 {2}개" -f (Get-Date -Format 'yyyy-MM-dd HH:mm'), $env:COMPUTERNAME, $n)
        if ($LASTEXITCODE -eq 0) { Log ("커밋 {0}  파일 {1}개" -f (git rev-parse --short HEAD), $n) }
    }

    # 2) 원격 내용 받아 합치기
    git pull --rebase --autostash --quiet 2>&1 | Add-Content $log -Encoding UTF8
    if ($LASTEXITCODE -ne 0) {
        git rebase --abort 2>$null
        New-Item $halt -ItemType File -Force *>$null
        @'
자동 동기화가 멈췄습니다.

같은 파일을 두 기기에서 동시에 고쳐서 Git이 스스로 합칠 수 없는 상태입니다.
자동 저장·업로드는 지금부터 멈춰 있습니다. (작업 내용이 사라지지는 않습니다.)

클로드에게 이 파일을 보여주시면 정리해 드립니다.
직접 하시려면 PowerShell 에서:

  cd C:\Users\FORYOUCOM\dev\Mutagonglab-homepage
  git status

정리가 끝나면 아래를 실행하면 자동 동기화가 다시 시작됩니다:

  Remove-Item .git\AUTOSYNC_HALTED, "_동기화_중단됨_읽어보세요.txt"
'@ | Set-Content $note -Encoding UTF8
        Log "⚠️ 충돌 — 자동 동기화 중단"
        exit 1
    }

    # 3) 올리기
    if (git log "origin/$br..HEAD" --oneline 2>$null) {
        git push --quiet 2>&1 | Add-Content $log -Encoding UTF8
        if ($LASTEXITCODE -eq 0) { Log "push 완료" } else { Log "push 실패" }
    }
}
finally { Remove-Item $lock -Force -ErrorAction SilentlyContinue }
