#!/usr/bin/env bash
# 작업 시작할 때 실행 (맥북)
#   사용법:  ./scripts/start.sh
set -euo pipefail
cd "$(dirname "$0")/.."

echo "▶ 원격 상태 가져오는 중..."
git fetch --all --prune

# 저장 안 된 변경이 남아있으면 먼저 경고 (덮어쓰기 사고 방지)
if [[ -n "$(git status --porcelain)" ]]; then
  echo ""
  echo "⚠️  이 기기에 아직 push 안 된 변경이 남아 있습니다:"
  git status --short
  echo ""
  echo "   → 이어서 작업하려면 그대로 두고,"
  echo "     다른 기기 내용으로 맞추려면 먼저 정리(commit 또는 stash)하세요."
  echo "     stash:  git stash push -m \"작업중\""
  exit 1
fi

echo "▶ 최신 내용 받아오는 중..."
git pull --rebase --autostash

BRANCH=$(git rev-parse --abbrev-ref HEAD)
echo ""
echo "✅ 준비 완료  |  브랜치: $BRANCH  |  기기: $(hostname)"
echo "──────────────────────────────────────────────"

if [[ -f HANDOFF.md ]]; then
  cat HANDOFF.md
else
  echo "(HANDOFF.md 없음 — 저장소 루트에 만들어 두면 여기 표시됩니다)"
fi
