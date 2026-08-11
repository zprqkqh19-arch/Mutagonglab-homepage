# mutagonglab.html 적용 방법 (업로드 3개 파일)

GitHub 웹 업로드 100개 제한에 맞춰 SKU 이미지 956장을 customizer-skus.js 한 파일로 패킹했습니다.

## 업로드할 파일 (총 3개)
1. mutagonglab.html  — 커스터마이저 이식 완성본 (기존 파일 덮어쓰기)
2. customizer-skus.js — SKU 이미지 팩 (저장소 루트, mutagonglab.html 옆)
3. customizer/assets/bg.png — 거실 배경 (customizer/assets/ 폴더 경로 유지)

## 순서
1) 저장소 → Add file → Upload files → 위 3개(customizer 폴더는 assets만) 드래그
   ※ bg.png는 압축 푼 customizer 폴더째 드래그하면 경로가 자동 유지됨
2) Commit changes → Actions 탭 초록 체크 확인 (1~3분)
3) 페이지 접속 후 Ctrl+Shift+R

skus 폴더(956개 SVG)는 업로드할 필요 없습니다 — customizer-skus.js에 모두 포함되어 있고, js가 없을 때만 customizer/skus/ 폴더를 참조합니다.
