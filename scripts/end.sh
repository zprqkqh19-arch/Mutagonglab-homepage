#!/usr/bin/env bash
# 작업 끝낼 때 실행 (맥북) — 인계 노트 갱신 + 커밋 + push
#   사용법:  ./scripts/end.sh "무엇을 했는지 한 줄"
set -euo pipefail
cd "$(dirname "$0")/.."

MSG="${1:-wip: 작업 중간 저장}"

if [[ -f HANDOFF.md ]]; then
  echo "▶ HANDOFF.md 를 먼저 갱신하세요. (편집기가 열립니다)"
  "${EDITOR:-nano}" HANDOFF.md
fi

if [[ -z "$(git status --porcelain)" ]]; then
  echo "변경 사항이 없습니다. push 할 것 없음."
  exit 0
fi

git add -A
git commit -m "$MSG

기기: $(hostname)"
git pull --rebase --autostash
git push

echo ""
echo "✅ push 완료 — 다른 기기에서 ./scripts/start.sh (또는 .\\scripts\\start.ps1) 로 이어가세요."
