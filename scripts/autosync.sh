#!/usr/bin/env bash
export PATH="/usr/bin:/bin:/usr/sbin:/sbin:/usr/local/bin:/opt/homebrew/bin:$PATH"
cd "$(dirname "$0")/.." || exit 0
REPO="$(pwd)"
LOG="$REPO/.git/autosync.log"
LOCK="$REPO/.git/autosync.lock"
HALT="$REPO/.git/AUTOSYNC_HALTED"
NOTE="$REPO/_동기화_중단됨_읽어보세요.txt"
log(){ printf '%s  %s\n' "$(date '+%F %T')" "$*" >> "$LOG"; }
[ -f "$LOG" ] && [ "$(wc -c <"$LOG")" -gt 200000 ] && tail -n 300 "$LOG" > "$LOG.tmp" && mv "$LOG.tmp" "$LOG"
if [ -e "$LOCK" ]; then
  if [ -n "$(find "$LOCK" -mmin +30 2>/dev/null)" ]; then rm -f "$LOCK"; else exit 0; fi
fi
touch "$LOCK"; trap 'rm -f "$LOCK"' EXIT
if [ -d .git/rebase-merge ] || [ -d .git/rebase-apply ] || [ -f .git/MERGE_HEAD ] || [ -f .git/CHERRY_PICK_HEAD ]; then
  log "건너뜀 — 병합/리베이스 진행 중"; exit 0
fi
if [ -f "$HALT" ]; then log "건너뜀 — 이전 충돌이 아직 해결되지 않음"; exit 0; fi
BR="$(git rev-parse --abbrev-ref HEAD 2>/dev/null)"
[ -z "$BR" ] && { log "건너뜀 — 브랜치 없음"; exit 0; }
git fetch --quiet origin 2>/dev/null || { log "건너뜀 — 원격 접속 실패"; exit 0; }
if [ -n "$(git status --porcelain)" ]; then
  git add -A
  N="$(git diff --cached --numstat | wc -l | tr -d ' ')"
  if git commit -q -m "auto: $(date '+%Y-%m-%d %H:%M') ($(hostname -s)) — 파일 ${N}개"; then
    log "커밋 $(git rev-parse --short HEAD)  파일 ${N}개"
  fi
fi
if ! git pull --rebase --autostash --quiet 2>>"$LOG"; then
  git rebase --abort 2>/dev/null
  touch "$HALT"
  cat > "$NOTE" <<'TXT'
자동 동기화가 멈췄습니다.
같은 파일을 두 기기에서 동시에 고쳐서 Git이 스스로 합칠 수 없는 상태입니다.
작업 내용이 사라지지는 않습니다. 클로드에게 이 파일을 보여주시면 정리해 드립니다.
정리 후 재개:  rm .git/AUTOSYNC_HALTED "_동기화_중단됨_읽어보세요.txt"
TXT
  log "⚠️ 충돌 — 자동 동기화 중단"
  osascript -e 'display notification "폴더의 안내 파일을 확인하세요." with title "홈페이지 자동 동기화 중단"' 2>/dev/null
  exit 1
fi
if [ -n "$(git log "origin/$BR..HEAD" --oneline 2>/dev/null)" ]; then
  if git push --quiet 2>>"$LOG"; then log "push 완료"; else log "push 실패"; fi
fi
