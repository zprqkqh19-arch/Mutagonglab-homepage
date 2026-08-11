# 적용 안내

## 업로드할 파일 (총 5개)
1. mutagonglab.html — 커스터마이저 이식 완성본 (덮어쓰기)
2. customizer-skus.js — SKU 이미지 팩 (루트)
3. customizer-embed.js — 다른 페이지용 자가 주입 스크립트 (루트)
4. customizer/assets/bg.png — 배경 (customizer/assets/ 경로 유지)
5. product.html — DIY 제품 페이지 완성본 (덮어쓰기; diy-door에서만 커스터마이저 표시, 혜다움 제품은 기존 위젯 유지)

GitHub → Add file → Upload files → 4개 드래그 → Commit changes

## DIY 제품 페이지
product.html 완성본이 포함되어 있어 별도 편집 불필요 — 그대로 덮어쓰면
product.html?id=diy-door 에서만 커스터마이저가 자동 주입됩니다.

## 이번 수정
- 옵션 패널이 이미지 뒤에 숨는 문제: 페이지 그리드 간섭 차단(grid-column:1/-1, z-index)
  + 패널을 이미지 우측에 고정 배치
