#!/usr/bin/env bash
# 백그라운드 자동 동기화 (맥) — launchd 가 10분마다 실행
# 직접 실행해도 됩니다: bash scripts/autosync.sh
export PATH="/usr/bin:/bin:/usr/sbin:/sbin:/usr/local/bin:/opt/homebrew/bin:$PATH"

cd "$(dirname "$0")/.." || exit 0
REPO="$(pwd)"
LOG="$REPO/.git/autosync.log"
LOCK="$REPO/.git/autosync.lock"
HALT="$REPO/.git/AUTOSYNC_HALTED"
NOTE="$REPO/_동기화_중단됨_읽어보세요.txt"

log(){ printf '%s  %s\n' "$(date '+%F %T')" "$*" >> "$LOG"; }

# 로그가 너무 커지면 잘라내기
[ -f "$LOG" ] && [ "$(wc -c <"$LOG")" -gt 200000 ] && tail -n 300 "$LOG" > "$LOG.tmp" && mv "$LOG.tmp" "$LOG"

# 중복 실행 방지 (30분 넘은 락은 무시)
if [ -e "$LOCK" ]; then
  if [ -n "$(find "$LOCK" -mmin +30 2>/dev/null)" ]; then rm -f "$LOCK"; else exit 0; fi
fi
touch "$LOCK"; trap 'rm -f "$LOCK"' EXIT

# 사람이 정리해야 하는 상태면 손대지 않음
if [ -d .git/rebase-merge ] || [ -d .git/rebase-apply ] || [ -f .git/MERGE_HEAD ] || [ -f .git/CHERRY_PICK_HEAD ]; then
  log "건너뜀 — 병합/리베이스 진행 중"; exit 0
fi
if [ -f "$HALT" ]; then
  log "건너뜀 — 이전 충돌이 아직 해결되지 않음"; exit 0
fi

BR="$(git rev-parse --abbrev-ref HEAD 2>/dev/null)"
[ -z "$BR" ] && { log "건너뜀 — 브랜치 없음"; exit 0; }

git fetch --quiet origin 2>/dev/null || { log "건너뜀 — 원격 접속 실패(네트워크?)"; exit 0; }

# 0) 받은 패치 자동 반영 (_받은패치/ 에 넣어두면 여기서 풀어 적용)
INBOX="$REPO/_받은패치"
mkdir -p "$INBOX/처리완료"
if [ -d "$INBOX" ]; then
  for f in "$INBOX"/*; do
    [ -f "$f" ] || continue
    BN="$(basename "$f")"
    case "$BN" in 처리완료|README*) continue;; esac
    TMP="$(mktemp -d)"
    OK=1
    case "$BN" in
      *.zip)
        if unzip -oq "$f" -d "$TMP" 2>/dev/null; then
          rm -rf "$TMP/.git"
          # 최상위가 폴더 하나뿐이면 그 안쪽을 저장소 루트로 옮긴다
          CNT="$(find "$TMP" -mindepth 1 -maxdepth 1 | wc -l | tr -d ' ')"
          ONE="$(find "$TMP" -mindepth 1 -maxdepth 1)"
          if [ "$CNT" = "1" ] && [ -d "$ONE" ]; then SRC="$ONE"; else SRC="$TMP"; fi
          rm -rf "$SRC/.git"
          cp -Rf "$SRC"/. "$REPO"/ && log "패치 적용: $BN"
        else
          OK=0; log "⚠️ 압축 해제 실패: $BN"
        fi;;
      *)
        cp -f "$f" "$REPO"/ && log "파일 적용: $BN";;
    esac
    rm -rf "$TMP"
    [ "$OK" = "1" ] && mv -f "$f" "$INBOX/처리완료/$BN"
  done
fi

# 1) 이 기기의 변경을 커밋
if [ -n "$(git status --porcelain)" ]; then
  git add -A
  N="$(git diff --cached --numstat | wc -l | tr -d ' ')"
  if git commit -q -m "auto: $(date '+%Y-%m-%d %H:%M') ($(hostname -s)) — 파일 ${N}개"; then
    log "커밋 $(git rev-parse --short HEAD)  파일 ${N}개"
  fi
fi

# 2) 원격 내용 받아 합치기
if ! git pull --rebase --autostash --quiet 2>>"$LOG"; then
  git rebase --abort 2>/dev/null
  touch "$HALT"
  cat > "$NOTE" <<'TXT'
자동 동기화가 멈췄습니다.

같은 파일을 두 기기에서 동시에 고쳐서 Git이 스스로 합칠 수 없는 상태입니다.
자동 저장·업로드는 지금부터 멈춰 있습니다. (작업 내용이 사라지지는 않습니다.)

클로드에게 이 파일을 보여주시면 정리해 드립니다.
직접 하시려면 터미널에서:

  cd ~/dev/Mutagonglab-homepage
  git status

정리가 끝나면 아래를 실행하면 자동 동기화가 다시 시작됩니다:

  rm .git/AUTOSYNC_HALTED "_동기화_중단됨_읽어보세요.txt"
TXT
  log "⚠️ 충돌 — 자동 동기화 중단"
  osascript -e 'display notification "같은 파일을 양쪽에서 고쳤습니다. 폴더의 안내 파일을 확인하세요." with title "홈페이지 자동 동기화 중단"' 2>/dev/null
  exit 1
fi

# 3) 올리기
if [ -n "$(git log "origin/$BR..HEAD" --oneline 2>/dev/null)" ]; then
  if git push --quiet 2>>"$LOG"; then log "push 완료"; else log "push 실패"; fi
fi
