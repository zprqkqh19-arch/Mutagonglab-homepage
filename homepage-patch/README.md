# 적용 안내

## 업로드할 파일 (총 4개)
1. mutagonglab.html — 커스터마이저 이식 완성본 (덮어쓰기)
2. customizer-skus.js — SKU 이미지 팩 (루트)
3. customizer-embed.js — 다른 페이지용 자가 주입 스크립트 (루트)
4. customizer/assets/bg.png — 배경 (customizer/assets/ 경로 유지)

GitHub → Add file → Upload files → 4개 드래그 → Commit changes

## DIY 제품(product.html) '무타공 DIY 중문'에 적용
product.html에서 중문 상세 섹션 원하는 위치에 아래 3줄 추가:

  <div id="mtg-customizer-mount"></div>
  <script src="customizer-skus.js"></script>
  <script src="customizer-embed.js"></script>

- 같은 커스터마이저가 그대로 주입됩니다 (옵션·이미지·구매 버튼 동일)
- 이미 커스터마이저가 있는 페이지에서는 중복 주입되지 않음

## 이번 수정
- 옵션 패널이 이미지 뒤에 숨는 문제: 페이지 그리드 간섭 차단(grid-column:1/-1, z-index)
  + 패널을 이미지 우측에 고정 배치
