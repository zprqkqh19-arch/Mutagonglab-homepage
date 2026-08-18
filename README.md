# 혜다움 · 무타공랩 홈페이지

두 브랜드를 한 저장소에서 운영하는 정적 사이트입니다. 빌드 도구 없이 HTML·CSS·JS 로만 구성되어 있습니다.

**공개 주소** — https://mutagonglab.com

| 브랜드 | 성격 | 진입 |
|---|---|---|
| 무타공랩 | 무타공 DIY 중문 (셀프 시공) | `index.html` (루트) |
| 혜다움 | 시공형 중문 (시공팀 설치) | `hyedaum.html` |

## 구조

```
index.html          무타공랩 홈 (루트, + 레이어 합성 커스터마이저)
hyedaum.html         혜다움 홈
products.html       브랜드별 제품 목록
product.html        제품 상세 — ?id=standard-door | diy-door
service.html · technology.html · design.html · b2b.html · contact.html

products-data.js    제품·옵션 데이터 (모든 페이지가 공유하는 단일 원본)
configurator.js     혜다움용 옵션 구성기 — 개념도 SVG + SKU 실사진
customizer-embed.js 무타공랩용 레이어 합성 커스터마이저
customizer-skus.js  위 커스터마이저가 쓰는 SKU 도면 데이터
main.js             공통 UI (내비게이션·모달·타일)
styles.css          전체 스타일 (웹폰트 내장)

assets/sku/12-22/   무타공랩 SKU 도면 SVG
assets/sku/*.png    SKU 실사진
```

## 배포

`main` 브랜치에 push 하면 GitHub Pages 가 자동으로 사이트를 갱신합니다. 별도 배포 작업은 없습니다.

`_config.yml` 의 `exclude` 목록에 있는 파일은 저장소에는 남지만 사이트에는 올라가지 않습니다.

## 작업 방식

두 대의 기기(맥북·데스크탑)에서 번갈아 작업하며, 백그라운드 스크립트가 10분마다 자동으로 커밋·동기화합니다.

- `scripts/autosync.sh` · `scripts/autosync.ps1` — 자동 동기화 (설치: `install-autosync.*`)
- `_받은패치/` — 외부에서 받은 파일·zip 을 넣으면 자동으로 반영
- `HANDOFF.md` — 기기를 옮길 때 현재 상태를 적어두는 인계 노트
- `CLAUDE.md` — 작업 규칙 (금지 사항 포함)

**GitHub 웹의 "Add files via upload" 는 쓰지 않습니다.** 병합이 아니라 덮어쓰기라 다른 기기의 작업이 사라집니다.
