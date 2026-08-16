/* 무타공랩 제품 데이터 모델 — 홈(타일) · 상세페이지 · 커스터마이징 프리뷰가 공유
   실제 스펙/가격/판매 가능 시점은 아직 확정 전 — 아래 옵션값은 UX 구조 검증용 예시입니다.

   ⚠️ 각 상품의 purchaseNotice(구매 전 확인사항) 문구는 임의로 고치지 말 것.
   반품/취소/A·S/실측 정책의 기준 문서는 ../CS_운영체계_기획안_2026-07-26.md 이며,
   정책이 바뀌면 그 문서를 먼저 갱신한 뒤 여기 purchaseNotice와 service.html FAQ를 맞출 것.

   ⚠️ 프레임 색상(도장/필름)·간살 디자인·유리 디자인 색상값은 실사 스와치 확보 전
   임시 근사치입니다. 실제 색상/질감 사진이 확보되면 FRAME_COLORS·MUNTIN_TYPES·
   GLASS_PATTERNS의 hex/아이콘을 실사 기준으로 교체할 것. */

(function () {
  "use strict";

  // 문(道어) 계열 프리뷰 SVG — data-shape로 5가지 형태를 전환, data-glass/data-muntin으로 유리·간살 표현
  function doorPreviewSVG() {
    return (
      '<svg viewBox="0 0 100 120" class="cfg-preview" aria-hidden="true">' +
      '<g data-shape="3연동" class="shape-group">' +
      '  <rect class="panel" data-slot="1" x="20" y="14" width="18" height="92"></rect>' +
      '  <rect class="panel" data-slot="2" x="38" y="14" width="18" height="92" opacity=".7"></rect>' +
      '  <rect class="panel" data-slot="3" x="56" y="14" width="18" height="92" opacity=".45"></rect>' +
      '  <g class="frame-lines"><rect x="20" y="14" width="18" height="92"></rect><rect x="38" y="14" width="18" height="92"></rect><rect x="56" y="14" width="18" height="92"></rect></g>' +
      '  <line class="foot-mark" x1="18" y1="108" x2="76" y2="108" stroke-dasharray="2 3"></line>' +
      '</g>' +
      '<g data-shape="원슬라이딩" class="shape-group" style="display:none">' +
      '  <rect class="panel" data-slot="1" x="22" y="14" width="30" height="92"></rect>' +
      '  <rect x="54" y="14" width="30" height="92" fill="none" class="frame-lines" stroke-dasharray="2 3"></rect>' +
      '  <g class="frame-lines"><rect x="22" y="14" width="30" height="92"></rect></g>' +
      '  <path class="frame-lines" d="M60,58 h16 M72,52 l6,6 l-6,6"></path>' +
      '</g>' +
      '<g data-shape="스윙폴딩" class="shape-group" style="display:none">' +
      '  <polygon class="panel" data-slot="1" points="50,14 26,26 26,106 50,106"></polygon>' +
      '  <polygon class="panel" data-slot="2" points="50,14 74,26 74,106 50,106" opacity=".6"></polygon>' +
      '  <g class="frame-lines"><polygon points="50,14 26,26 26,106 50,106"></polygon><polygon points="50,14 74,26 74,106 50,106"></polygon></g>' +
      '  <circle class="frame-lines" cx="50" cy="14" r="1.6" fill="currentColor" stroke="none"></circle>' +
      '</g>' +
      '<g data-shape="여닫이" class="shape-group" style="display:none">' +
      '  <rect class="panel" data-slot="1" x="26" y="14" width="24" height="92"></rect>' +
      '  <g class="frame-lines"><rect x="26" y="14" width="24" height="92"></rect><path d="M26,14 A58,58 0 0 1 78,66" stroke-dasharray="2 3"></path></g>' +
      '  <circle class="frame-lines" cx="26" cy="14" r="1.6" fill="currentColor" stroke="none"></circle>' +
      '  <circle class="frame-lines" cx="26" cy="106" r="1.6" fill="currentColor" stroke="none"></circle>' +
      '</g>' +
      '<g data-shape="자동문" class="shape-group" style="display:none">' +
      '  <rect class="panel" data-slot="1" x="18" y="14" width="28" height="92"></rect>' +
      '  <rect class="panel" data-slot="2" x="54" y="14" width="28" height="92" opacity=".7"></rect>' +
      '  <g class="frame-lines"><rect x="18" y="14" width="28" height="92"></rect><rect x="54" y="14" width="28" height="92"></rect><path d="M28,6 q4,3 0,6 M62,6 q4,3 0,6 M46,6 q4,3 0,6" stroke-dasharray="1.5 2.5"></path></g>' +
      '</g>' +
      '<g class="muntin-overlay" data-muntin="none" aria-hidden="true">' +
      '  <line class="muntin-line muntin-h" x1="20" y1="38" x2="84" y2="38"></line>' +
      '  <line class="muntin-line muntin-h" x1="20" y1="60" x2="84" y2="60"></line>' +
      '  <line class="muntin-line muntin-h" x1="20" y1="82" x2="84" y2="82"></line>' +
      '  <line class="muntin-line muntin-v" x1="38" y1="14" x2="38" y2="106"></line>' +
      '  <line class="muntin-line muntin-v" x1="56" y1="14" x2="56" y2="106"></line>' +
      '  <path class="muntin-line muntin-arch" d="M20,32 Q52,12 84,32" fill="none"></path>' +
      '</g>' +
      '<g class="handle-group" style="display:none">' +
      '  <g class="handle-shape-bar"><rect x="33.5" y="50" width="2.4" height="20" rx="1.2" class="handle"></rect></g>' +
      '  <g class="handle-shape-circle"><circle cx="34.7" cy="60" r="3" class="handle"></circle></g>' +
      '</g>' +
      '<g class="foot-group" data-addon="foot" style="display:none"><circle cx="30" cy="110" r="2" class="foot"></circle><circle cx="66" cy="110" r="2" class="foot"></circle></g>' +
      "</svg>"
    );
  }

  window.MUTAGONG_PARTITION_PREVIEW_SVG = partitionPreviewSVG;

  function partitionPreviewSVG() {
    return (
      '<svg viewBox="0 0 100 120" class="cfg-preview" aria-hidden="true">' +
      '<g data-shape="파티션" class="shape-group">' +
      '  <rect class="panel" data-slot="1" x="14" y="18" width="20" height="86"></rect>' +
      '  <rect class="panel" data-slot="2" x="40" y="10" width="20" height="94" opacity=".85"></rect>' +
      '  <rect class="panel" data-slot="3" x="66" y="18" width="20" height="86" opacity=".7"></rect>' +
      '  <g class="frame-lines"><rect x="14" y="18" width="20" height="86"></rect><rect x="40" y="10" width="20" height="94"></rect><rect x="66" y="18" width="20" height="86"></rect></g>' +
      '</g>' +
      '<g class="muntin-overlay" data-muntin="none" aria-hidden="true">' +
      '  <line class="muntin-line muntin-h" x1="14" y1="43" x2="86" y2="43"></line>' +
      '  <line class="muntin-line muntin-h" x1="14" y1="68" x2="86" y2="68"></line>' +
      '  <line class="muntin-line muntin-v" x1="40" y1="10" x2="40" y2="104"></line>' +
      '  <line class="muntin-line muntin-v" x1="66" y1="10" x2="66" y2="104"></line>' +
      '  <path class="muntin-line muntin-arch" d="M14,34 Q50,14 86,34" fill="none"></path>' +
      '</g>' +
      '<g class="foot-group" data-addon="foot" style="display:none"><circle cx="24" cy="106" r="2" class="foot"></circle><circle cx="76" cy="106" r="2" class="foot"></circle></g>' +
      "</svg>"
    );
  }

  function accessoryPreviewSVG() {
    return (
      '<svg viewBox="0 0 100 120" class="cfg-preview" aria-hidden="true">' +
      '<g data-shape="부속품" class="shape-group">' +
      '  <rect class="panel" x="40" y="16" width="20" height="70"></rect>' +
      '  <g class="frame-lines"><rect x="40" y="16" width="20" height="70"></rect></g>' +
      '  <g class="foot-group" data-addon="foot" style="display:inline"><rect x="44" y="86" width="12" height="10" class="foot"></rect><line x1="50" y1="96" x2="50" y2="108" class="frame-lines"></line></g>' +
      "</svg>"
    );
  }

  // ============ 프레임 색상 — 도장 / 필름 구분 ============
  // ⚠️ 필름이 기계 시공인지 수작업 시공인지는 확정된 바 없음(2026-07-27 대표 정정) — 확정 전까지 시공 방식 관련 문구를 넣지 말 것.
  // 근거: 시공사장님_상세페이지_컨펌요청_2026-07-25.docx — 불소도장/필름 두 가지 마감 방식이 있다는 것까지만 확인됨.
  var FRAME_COLORS = [
    { value: "paint_white", label: "화이트", hex: "#F6F3EE", group: "도장" },
    { value: "paint_gray", label: "그레이", hex: "#B9B2A8", group: "도장" },
    { value: "paint_black", label: "블랙", hex: "#2D2D2D", group: "도장" },
    { value: "film_white", label: "화이트", hex: "#F3EFE6", group: "필름" },
    { value: "film_gray", label: "그레이", hex: "#A9A29A", group: "필름" },
    { value: "film_black", label: "블랙", hex: "#2A2724", group: "필름" },
  ];

  // ============ 간살 디자인 (패널 종류 대체) ============
  // 근거: 자료요청서 — 원슬라이딩 "간살형"(띠간살/통간살, 간격 35~40mm, 전체간살은 비용 약 2배)
  var MUNTIN_TYPES = [
    {
      value: "none",
      label: "민자",
      icon: '<svg viewBox="0 0 32 44" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="4" width="24" height="36" rx="1"></rect></svg>',
    },
    {
      value: "horizontal",
      label: "가로 통간살",
      icon: '<svg viewBox="0 0 32 44" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="4" width="24" height="36" rx="1"></rect><path d="M4,16 h24 M4,28 h24"></path></svg>',
    },
    {
      value: "vertical",
      label: "세로 통간살",
      icon: '<svg viewBox="0 0 32 44" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="4" width="24" height="36" rx="1"></rect><path d="M12,4 v36 M20,4 v36"></path></svg>',
    },
    {
      value: "arch",
      label: "아치형",
      icon: '<svg viewBox="0 0 32 44" fill="none" stroke="currentColor" stroke-width="2"><path d="M4,40 V16 A12,12 0 0 1 28,16 V40"></path></svg>',
    },
  ];

  // ============ 유리 디자인 ============
  var GLASS_TYPES = [
    { value: "general", label: "일반유리" },
    { value: "tempered", label: "강화유리" },
  ];

  var GLASS_PATTERNS = [
    {
      value: "clear",
      label: "투명",
      icon: '<svg viewBox="0 0 32 44" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="4" y="4" width="24" height="36" rx="1"></rect><path d="M9,32 L23,10" stroke-opacity=".55"></path></svg>',
    },
    {
      value: "bronze",
      label: "브론즈",
      icon: '<svg viewBox="0 0 32 44"><rect x="4" y="4" width="24" height="36" rx="1" fill="currentColor" fill-opacity=".38" stroke="currentColor" stroke-width="1.2"></rect></svg>',
    },
    {
      value: "moru",
      label: "모루",
      icon: '<svg viewBox="0 0 32 44" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="4" y="4" width="24" height="36" rx="1"></rect><path d="M11,5 Q14,11 11,17 Q8,23 11,29 Q14,35 11,42" stroke-opacity=".8"></path><path d="M21,5 Q24,11 21,17 Q18,23 21,29 Q24,35 21,42" stroke-opacity=".8"></path></svg>',
    },
    {
      value: "mist",
      label: "미스트",
      icon: '<svg viewBox="0 0 32 44"><rect x="4" y="4" width="24" height="36" rx="1" fill="currentColor" fill-opacity=".14" stroke="currentColor" stroke-width="1.2" stroke-opacity=".5"></rect><path d="M7,14 Q12,11.5 16,14 T27,14" stroke="currentColor" stroke-width="1.2" stroke-opacity=".45" fill="none"></path><path d="M6,22 Q11,24.5 16,22 T28,22" stroke="currentColor" stroke-width="1.2" stroke-opacity=".35" fill="none"></path><path d="M7,30 Q12,27.5 16,30 T27,30" stroke="currentColor" stroke-width="1.2" stroke-opacity=".25" fill="none"></path></svg>',
    },
    {
      value: "fabric",
      label: "패브릭",
      icon: '<svg viewBox="0 0 32 44" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-opacity=".65"><rect x="4" y="4" width="24" height="36" rx="1" stroke-opacity="1"></rect><path d="M8,10 l2.5,1.5 M14,8 l2,2.5 M20,11 l2.5,1 M24,16 l1.5,2 M8,18 l2.5,1.5 M15,17 l2,2.5 M21,19 l2,2 M9,25 l2.5,1 M16,24 l2.5,2 M22,26 l1.5,2.5 M8,33 l2,1.5 M14,32 l2.5,2 M20,34 l2,1.5 M24,29 l1.5,2"></path></svg>',
    },
  ];

  var DOOR_TYPE_OPTION = {
    id: "doorType",
    kind: "doorType",
    label: "제품 유형",
    choices: ["3연동", "원슬라이딩", "스윙폴딩", "여닫이"].map(function (v) {
      return { value: v, label: v };
    }),
    default: "3연동",
  };

  var DOOR_TYPE_OPTION_WITH_AUTO = {
    id: "doorType",
    kind: "doorType",
    label: "제품 유형",
    choices: ["3연동", "원슬라이딩", "스윙폴딩", "여닫이", "자동문"].map(function (v) {
      return { value: v, label: v };
    }),
    default: "3연동",
  };

  // W 1100~1400(100단위) × H 2000~2300(100단위) 중 가로세로 비율(W/H)이 0.45~0.60을 벗어나는
  // 조합(문이 과도하게 낮고 넓어지는 비정상 비례)은 제조 비효율로 제외.
  // 비율 기준 근거: 규격화.xlsx 확정 3연동/원슬라이딩 M·L 실측 비율(0.45~0.56)에 신규 확장분 버퍼 포함(2026-07-28).
  // H2400은 별도 제외: 무타공 중문은 설치 공간보다 작으면 보정 설치가 가능하지만 크면 설치 자체가 불가능해
  // 방어적으로 최대 세로 사이즈를 낮춤(2026-07-28).
  var SIZE_CHOICES = (function () {
    var out = [];
    var MIN_RATIO = 0.45;
    var MAX_RATIO = 0.6;
    for (var w = 1100; w <= 1400; w += 100) {
      for (var h = 2000; h <= 2300; h += 100) {
        var ratio = w / h;
        if (ratio < MIN_RATIO || ratio > MAX_RATIO) continue;
        out.push({ value: w + "x" + h, label: "W" + w + " × H" + h });
      }
    }
    return out;
  })();

  var SIZE_OPTION = {
    id: "size",
    kind: "size",
    label: "사이즈",
    choices: SIZE_CHOICES,
    default: "1200x2200",
  };

  // 무타공(DIY) 전용 — 규격 v0.18: 사이즈 선택 시 적합 천장고·내경·코드 병기(누락 금지, 2026-07-31 대표 지시)
  var DIY_SIZE_OPTION = {
    id: "size",
    kind: "size",
    label: "사이즈",
    choices: SIZE_CHOICES,
    default: "1200x2200",
    note: "천장 높이를 좌·중·우 3곳에서 재고, 가장 낮은 값이 '적합 천장고' 범위에 드는 사이즈를 선택하세요. 3곳 편차가 15mm를 넘으면 유상 출장 실측을 이용해 주세요.",
  };

  var FINISH_TYPE_OPTION = {
    id: "finish",
    kind: "finish",
    label: "마감 방식",
    choices: [
      { value: "도장", label: "도장" },
      { value: "필름", label: "필름" },
    ],
    default: "도장",
  };

  var FRAME_COLOR_OPTION = {
    id: "frameColor",
    kind: "frameColor",
    label: "프레임 색상",
    choices: FRAME_COLORS,
    dependsOn: "finish",
    default: "paint_white",
  };

  var MUNTIN_OPTION = {
    id: "muntin",
    kind: "visual",
    label: "간살 디자인",
    choices: MUNTIN_TYPES,
    default: "none",
  };

  var GLASS_TYPE_OPTION = {
    id: "glassType",
    kind: "glassType",
    label: "유리 종류",
    choices: GLASS_TYPES,
    default: "general",
  };

  var GLASS_PATTERN_OPTION = {
    id: "glassPattern",
    kind: "visual",
    label: "유리 디자인",
    choices: GLASS_PATTERNS,
    default: "clear",
  };

  // 무타공(DIY) 전용 — 채움재는 안전창(폴리카보네이트) 단일이라 '종류' 분류 없음.
  // 소비자 표기 확정(2026-07-31): "안전창 디자인" + 물음표 툴팁 한 문장. '유리' 표기 금지.
  var SAFETY_PANEL_OPTION = {
    id: "glassPattern",
    kind: "visual",
    label: "안전창 디자인",
    help: "유리 대신, 방탄창에도 쓰이는 폴리카보네이트 소재를 사용해 유리보다 가볍고 충격에 깨지지 않는 안전한 투명창입니다.",
    choices: GLASS_PATTERNS,
    default: "clear",
  };

  var HANDLE_OPTION = {
    id: "handle",
    kind: "handle",
    label: "손잡이",
    choices: [
      { value: "none", label: "기본형" },
      { value: "circle", label: "원형" },
      { value: "bar", label: "일자형" },
    ],
    default: "none",
  };

  // 마감판 — 무타공 제품(셀프시공형) 전용. 혜다움(시공형)은 시공팀이 현장에 맞춰 시공하므로 해당 없음.
  // 조절볼트는 모든 무타공 중문에 기본 포함(프레임 연결 필수 부품, 2026-08-01 대표 확정) — 추가 구매 옵션에서 제외.
  // 규격 v0.20 확정(2026-08-01): 길이조절발 폐지 — 높이 대응은 조절볼트 트래블 +30 × 헤더 기둥 옵션(40/70/100/130).
  var ADDON_OPTION = {
    id: "footFinish",
    kind: "addon",
    label: "마감판 추가",
    description: "문틀·벽면과 프레임 사이 틈을 정리하는 마감판을 추가합니다. (높이 조절용 조절볼트는 모든 제품에 기본 포함)",
    default: false,
  };

  // 시공형 파티션 — 별도 상품이 아니라 시공형 중문 커스터마이징의 마지막 옵션에서 추가 여부를 선택
  var PARTITION_ADDON_OPTION = {
    id: "partitionAddon",
    kind: "addon",
    label: "시공형 파티션 추가",
    description: "중문과 함께 시공하는 파티션을 추가합니다. 가벽 없는 개방형 구조에 픽스(파티션)와 중문을 동시에 시공합니다.",
    default: false,
  };

  // 무타공 파티션 — 별도 상품 페이지 없이 무타공 DIY 중문 커스터마이징의 addon으로 통합
  var DIY_PARTITION_ADDON_OPTION = {
    id: "partitionAddon",
    kind: "addon",
    label: "무타공 파티션 추가",
    description: "중문과 함께 셀프 설치하는 무타공 파티션을 추가합니다. 벽에 구멍을 내지 않고 공간을 구획합니다.",
    default: false,
  };

  // 유상 출장 실측 — 셀프 실측이 어려운 경우 신청하는 서비스 addon
  var MEASUREMENT_ADDON_OPTION = {
    id: "measurementAddon",
    kind: "addon",
    label: "유상 출장 실측 신청",
    description: "셀프 실측이 어려운 경우, 지역에 따라 3~10만원의 비용으로 출장 실측을 신청할 수 있습니다.",
    default: false,
  };

  // ============ 레이어 합성 커스터마이저 스펙 (무타공랩 DIY, 12-22) ============
  // 디자인 핸드오프(design_handoff_customizer) 기반. A(프레임)+B(중문) SVG를 좌표계에 맞춰
  // 레이어로 합성하고, 간살은 실시간 오버레이로 그린다. 좌표·팔레트·자산 규칙은 핸드오프 README 기준.
  // 자산: assets/sku/12-22/{A,B,B1}. 현재 12-22 한 사이즈만 제공(나머지 9종은 자산 생성 후 확장).
  var LAYERED_CUSTOMIZER_12_22 = {
    // SVG 자산 세트는 12-22 하나(디자인 동일) — 모든 사이즈에 스케일해 재사용
    assetSize: "12-22",
    assetBase: "assets/sku/12-22",
    // 좌표계(mm, 정면): 프로파일 정면 폭 30 → 내경 = (W-60) × (H-130). 연장 시 상단 볼트 노출 +30(innerTop 130→160)
    profile: 30, innerTop: 130, innerTopExt: 160, extDelta: 30,
    // 판매 10종(규격화 W/H 0.45~0.60). code = (W/100)-(H/100). 사이즈만 고르면 나머지 디자인은 12-22와 동일 적용.
    sizes: [
      { code: "11-20", w: 1100, h: 2000 }, { code: "11-21", w: 1100, h: 2100 },
      { code: "11-22", w: 1100, h: 2200 }, { code: "11-23", w: 1100, h: 2300 },
      { code: "12-20", w: 1200, h: 2000 }, { code: "12-21", w: 1200, h: 2100 },
      { code: "12-22", w: 1200, h: 2200 }, { code: "12-23", w: 1200, h: 2300 },
      { code: "13-22", w: 1300, h: 2200 }, { code: "13-23", w: 1300, h: 2300 },
    ],
    types: [
      { value: "3연동", label: "3연동", prefix: "B" },
      { value: "원슬라이딩", label: "원슬라이딩", prefix: "B1" },
      { value: "스윙폴딩", label: "스윙폴딩", disabled: true },
      { value: "여닫이", label: "여닫이", disabled: true },
    ],
    frameColors: [{ value: "sv", label: "실버" }],
    doorColors: [
      { value: "wh", label: "화이트", hex: "#eeece7" },
      { value: "gr", label: "그레이", hex: "#707074" },
      { value: "bk", label: "블랙", hex: "#2b2b2e" },
    ],
    glass: [
      { value: "cl", label: "투명" },
      { value: "br", label: "브론즈" },
      { value: "mi", label: "미스트" },
      { value: "mo", label: "모루" },
      { value: "sa", label: "샤틴" },
      { value: "fa", label: "패브릭" },
    ],
    handles: [
      { value: "st", label: "기본" },
      { value: "rd", label: "반원형" },
      { value: "ba", label: "긴 바형" },
      { value: "sb", label: "짧은 바형" },
      { value: "line", label: "일자형", disabled: true },
    ],
    // 배경 넣기(유리 비침 비교)용 이미지. 이 경로에 파일이 존재하면 '배경 넣기' 토글이 자동 활성화되고,
    // 없으면(로드 실패) 토글은 비활성으로 표시된다. 거실 사진을 아래 경로에 넣기만 하면 켜진다.
    background: "assets/sku/room-bg.webp",
    defaults: { sz: "12-22", t: "3연동", a: "sv", d: "wh", g: "cl", h: "st" },
  };

  // ============ 레이어 합성 커스터마이저 스펙 (혜다움 시공형, 12-22) ============
  // 무타공랩 DIY(LAYERED_CUSTOMIZER_12_22)와 동일한 자산 세트를 그대로 재사용.
  // 다른 점: ① 안전창(PC)이 아니라 실유리라 라벨을 "유리"로 표시(glassLabel, configurator.js에서 참조)
  //         ② 프레임 색상은 FRAME_COLORS 6종(도장/필름 × 화이트/그레이/블랙) 노출 —
  //            단, 지금은 '실버' 1종의 프레임 이미지 자산만 있어 나머지 5종은 비활성(disabled) 처리.
  //            실사 자산(A_12-22_{value}.svg)이 준비되면 disabled를 지우면 바로 활성화됨.
  //         ③ 자동문 유형은 이미지 자산(prefix)이 아직 없어 비활성 처리 — 자산 준비 후 disabled 제거.
  var LAYERED_CUSTOMIZER_HEDAUM = {
    assetSize: "12-22",
    assetBase: "assets/sku/12-22",
    profile: 30, innerTop: 130, innerTopExt: 160, extDelta: 30,
    sizes: LAYERED_CUSTOMIZER_12_22.sizes,
    glassLabel: "유리",
    types: [
      { value: "3연동", label: "3연동", prefix: "B" },
      { value: "원슬라이딩", label: "원슬라이딩", prefix: "B1" },
      { value: "스윙폴딩", label: "스윙폴딩", disabled: true },
      { value: "여닫이", label: "여닫이", disabled: true },
      { value: "자동문", label: "자동문", disabled: true },
    ],
    frameColors: [
      { value: "sv", label: "실버" },
      { value: "paint_white", label: "화이트(도장)", disabled: true },
      { value: "paint_gray", label: "그레이(도장)", disabled: true },
      { value: "paint_black", label: "블랙(도장)", disabled: true },
      { value: "film_white", label: "화이트(필름)", disabled: true },
      { value: "film_gray", label: "그레이(필름)", disabled: true },
      { value: "film_black", label: "블랙(필름)", disabled: true },
    ],
    doorColors: LAYERED_CUSTOMIZER_12_22.doorColors,
    glass: LAYERED_CUSTOMIZER_12_22.glass,
    handles: LAYERED_CUSTOMIZER_12_22.handles,
    background: "assets/sku/room-bg.webp",
    defaults: { sz: "12-22", t: "3연동", a: "sv", d: "wh", g: "cl", h: "st" },
  };

  window.MUTAGONG_PRODUCTS = {
    "standard-door": {
      id: "standard-door",
      layeredCustomizer: LAYERED_CUSTOMIZER_HEDAUM,
      name: "시공형 중문",
      brand: "혜다움",
      heroPhoto: "assets/hedaum-concept-01.png",
      tagline: "지금 바로 상담·구매가 가능한 시공형 중문입니다.",
      saleStatus: "available",
      category: "중문",
      summary:
        "혜다움의 시공형 중문입니다. 레일과 힌지로 시공하는 일반적인 방식으로, 3연동·원슬라이딩·스윙폴딩·여닫이·자동문 구조로 제작하며 지금 바로 상담과 구매 문의가 가능합니다.",
      features: [
        { title: "5가지 구조", desc: "3연동·원슬라이딩·스윙폴딩·여닫이·자동문 중 공간에 맞는 구조를 선택할 수 있습니다." },
        { title: "빠른 시공", desc: "일반 시공 방식으로, 시공팀을 통해 설치까지 진행합니다." },
        { title: "다양한 마감", desc: "도장·필름 프레임 색상과 간살·유리 디자인을 선택해 인테리어 톤에 맞출 수 있습니다." },
      ],
      useCases: [
        { tag: "구축 인테리어", desc: "기존 문틀 자리에 맞춰 교체 시공하는 현장" },
        { tag: "신축 현장", desc: "설계 단계부터 중문 자리를 확보한 신축 공간" },
        { tag: "상업 공간", desc: "사무실·상가 등 구획이 필요한 공간" },
      ],
      previewSVG: doorPreviewSVG,
      // SKU 실사진(배경 제거된 제품 이미지) — 준비되는 대로 skuImages에 추가하면 개념도(SVG) 대신 표시됨.
      // 키 형식: skuImageKeys에 나열한 옵션 id들의 현재 값을 "_"로 이어붙인 문자열.
      // 예) doorType="3연동", frameColor="paint_white", muntin="none", glassPattern="clear", handle="none"
      //     → 키 "3연동_paint_white_none_clear_none"
      skuImageKeys: ["doorType", "frameColor", "muntin", "glassPattern", "handle"],
      skuImages: {
        // "3연동_paint_white_none_clear_none": "assets/sku/standard-door-3연동-화이트-민자-투명-기본형.png",
      },
      options: [
        DOOR_TYPE_OPTION_WITH_AUTO,
        SIZE_OPTION,
        FINISH_TYPE_OPTION,
        FRAME_COLOR_OPTION,
        MUNTIN_OPTION,
        GLASS_TYPE_OPTION,
        GLASS_PATTERN_OPTION,
        HANDLE_OPTION,
        PARTITION_ADDON_OPTION,
      ],
      purchaseNotice:
        "본 상품은 시공팀이 서울·경기·경상권 기준 무료로 현장 방문 실측을 진행한 뒤 제작·시공에 들어가는 시공형 제품입니다. 그 외 지역은 무료 실측이 어려워 별도 비용이 발생하며, 정확한 금액은 상담 시 안내드립니다. 실측 후 제작 시작 전에 취소하실 경우 3만원을 제외하고 환불되며, 제작이 시작된 이후에는 단순 변심에 의한 취소·반품이 불가합니다. 제품 또는 시공 하자가 확인되는 경우 구매일로부터 1년간 무상 A/S가 적용됩니다(고객 과실로 인한 하자는 비용이 발생할 수 있습니다). A/S 출장비는 실측과 동일한 기준으로 안내드립니다.",
    },

    "diy-door": {
      id: "diy-door",
      layeredCustomizer: LAYERED_CUSTOMIZER_12_22,
      name: "무타공 DIY 중문",
      brand: "무타공랩",
      tagline: "벽과 문틀에 구멍을 내지 않는 무타공랩의 자체 R&D 제품입니다.",
      saleStatus: "coming-soon",
      category: "중문",
      summary:
        "무타공(無打孔) 방식으로 셀프 실측·셀프 시공이 가능한 무타공랩 자체 제품입니다. 문짝에는 유리 대신 깨지지 않는 안전창(폴리카보네이트)을 사용하며, 3연동·원슬라이딩·스윙폴딩·여닫이 4가지 구조로 제작합니다.",
      features: [
        { title: "타공 없이 고정", desc: "벽과 문틀에 구멍을 내지 않아 원상복구가 쉽고, 전월세 공간에도 설치할 수 있습니다." },
        { title: "가변형 구조", desc: "기본 포함된 조절볼트로 높이를 맞추고, 마감판(선택)으로 틈새를 정리할 수 있습니다." },
        { title: "알루미늄 소재", desc: "저가형 플라스틱이 아닌, 시공형 중문과 동일한 알루미늄 프레임으로 내구성과 심미성을 갖췄습니다." },
        { title: "완조립 셀프 설치", desc: "조립된 상태로 배송되어, 별도 시공비 없이 직접 설치할 수 있습니다." },
        { title: "고정 후 바로 사용", desc: "고정 설치와 마감재 부착까지 마치면 바로 사용할 수 있습니다." },
        { title: "구조 안전성 검증", desc: "하중과 고정력을 직접 검토하며 안전성을 확인합니다." },
      ],
      useCases: [
        { tag: "임대 공간", desc: "벽을 훼손할 수 없는 전월세·상가" },
        { tag: "셀프 인테리어", desc: "직접 시공을 원하는 1인 가구·신혼집" },
        { tag: "임시·가변 공간", desc: "구조를 자주 바꾸는 공간" },
      ],
      previewSVG: doorPreviewSVG,
      // SKU 실사진(배경 제거된 제품 이미지) — 준비되는 대로 skuImages에 추가하면 개념도(SVG) 대신 표시됨.
      // 키 형식: skuImageKeys에 나열한 옵션 id들의 현재 값을 "_"로 이어붙인 문자열.
      skuImageKeys: ["doorType", "frameColor", "muntin", "glassPattern", "handle"],
      skuImages: {
        "3연동_paint_white_none_clear_none": "assets/sku/diy-door-3yeondong-white-none-clear-none.png",
        "3연동_paint_white_none_clear_circle": "assets/sku/diy-door-3yeondong-white-none-clear-circle.png",
        "3연동_paint_white_none_clear_bar": "assets/sku/diy-door-3yeondong-white-none-clear-bar.png",
      },
      options: [
        DOOR_TYPE_OPTION,
        DIY_SIZE_OPTION,
        FINISH_TYPE_OPTION,
        FRAME_COLOR_OPTION,
        MUNTIN_OPTION,
        SAFETY_PANEL_OPTION,
        HANDLE_OPTION,
        ADDON_OPTION,
        DIY_PARTITION_ADDON_OPTION,
        MEASUREMENT_ADDON_OPTION,
      ],
      installSteps: [
        { title: "패키지 확인", desc: "완조립된 프레임·도어 패널(안전창 포함), 조절볼트·마감판, 설치 공구, 설치 가이드가 한 박스로 함께 배송됩니다. 개봉 즉시 가이드의 부속품 목록과 대조해 확인해 주세요." },
        { title: "고정 설치", desc: "가이드에 따라 문틀 자리에 프레임을 세운 뒤, 상단·하단 프레임 연결부의 조절볼트로 높이를 맞춰 고정합니다." },
        { title: "마감재 부착", desc: "동봉된 마감판을 프레임과 벽 사이 틈에 연결해 정리하면 시공이 완료되어 바로 사용할 수 있습니다." },
      ],
      installLimits: [
        "석고보드·합판 등 압착 고정이 어려운 경질 벽체",
        "선택 가능한 사이즈 범위를 초과하는 공간(이동이 잦으실 경우 다음 공간의 설치를 고려하여 사이즈를 작게 구성하시기를 추천드립니다.)",
        "문틀이 심하게 뒤틀리거나 손상된 경우",
        "바닥·벽면이 고르지 않아 밀착이 어려운 경우",
      ],
      purchaseNotice:
        "본 상품은 고객님이 직접 실측하신 값에 맞춰 개별로 재단·제작되는 셀프 시공 제품으로, 주문 후에는 단순 변심에 의한 취소·반품이 불가합니다. 실측이 어려우시면 지역에 따라 3~10만원의 비용으로 출장 실측을 요청하실 수 있으며, 이 경우 실측 전 취소는 전액 환불, 실측 후·생산 시작 전 취소는 실측 비용을 제외하고 환불됩니다(생산 시작 후에는 취소 불가). 제품 하자가 확인되는 경우 구매일로부터 1년간 무상 A/S가 적용되며, A/S 접수 시 배송비는 고객님 부담입니다.",
    },

    accessories: {
      id: "accessories",
      name: "마감판",
      brand: "무타공랩",
      tagline: "표준 규격 제품을 내 공간 크기에 맞추는 부속품입니다.",
      saleStatus: "coming-soon",
      category: "기타",
      summary:
        "무타공랩 제품의 문틀·벽면 마감용 부속품입니다. 높이 조절용 조절볼트는 모든 중문에 기본 포함되어 있어 별도 구매가 필요 없습니다.",
      features: [
        { title: "조절볼트는 기본 포함", desc: "상단·하단 프레임 연결부의 높이 조절용 조절볼트와 헤더 기둥은 중문 본품에 기본 포함됩니다. 주문 시 실측 천장고에 맞는 기둥 규격으로 제작됩니다." },
        { title: "마감판", desc: "문틀과 벽 사이 틈을 정리합니다." },
        { title: "단독 구매 가능", desc: "보유 중인 제품의 마감을 나중에 정리할 때도 추가 구매할 수 있습니다." },
      ],
      useCases: [{ tag: "사이즈 보정", desc: "실측값과 표준 규격 사이 오차를 보정할 때" }],
      previewSVG: accessoryPreviewSVG,
      options: [
        FRAME_COLOR_OPTION,
        { id: "footFinish2", kind: "addon", label: "마감판 포함", description: "문틀 마감판을 함께 구성합니다.", default: true },
      ],
    },
  };

  // 랜딩 타일에 쓰는 순서 고정
  window.MUTAGONG_PRODUCT_ORDER = ["standard-door", "diy-door", "accessories"];

  // 제품 유형별 비교 참고 정보 — 정확한 사이즈·비용은 현장·구성마다 달라 상담 시 확인을 원칙으로 하고,
  // 여기서는 상담 전 비교에 필요한 일반적인 특징만 안내(수치 스펙은 임의로 추가하지 말 것).
  window.MUTAGONG_DOOR_TYPE_INFO = {
    "3연동": { recommend: "넓은 개구부, 신발장이 입구를 막는 현장", feature: "3개 패널이 겹쳐 열려 개방감과 공간 활용도가 높습니다." },
    "원슬라이딩": { recommend: "복도형 구조, 넓은 개방감을 원하는 현장", feature: "패널 1장이 옆으로 슬라이딩하는 가장 단순한 구조입니다." },
    "스윙폴딩": { recommend: "현관 입구가 좁은 현장", feature: "큰 문짝과 작은 문짝이 함께 접히며 열려 좁은 공간에 유리합니다." },
    "여닫이": { recommend: "좁은 현관, 힌지 개폐가 익숙한 공간", feature: "가장 일반적인 개폐 방식으로, 한쪽 또는 양쪽으로 열립니다." },
    "자동문": { recommend: "어린이·노약자·반려동물 가정, 상업 공간", feature: "감지센서로 자동 개폐되어 수동 개폐가 불편한 경우에 적합합니다." },
  };

  // products.html 브랜드별 그룹핑 — 혜다움(시공형) vs 무타공랩(무타공 셀프시공형)
  window.MUTAGONG_BRAND_GROUPS = [
    {
      brand: "무타공랩",
      brandSub: "중문 · 파티션",
      anchor: "mutagonglab",
      tint: "#2e2a22",
      items: [
        { id: "diy-door", type: "3연동", label: "3연동" },
        { id: "diy-door", type: "원슬라이딩", label: "원슬라이딩" },
        { id: "diy-door", type: "스윙폴딩", label: "스윙폴딩" },
        { id: "diy-door", type: "여닫이", label: "여닫이" },
      ],
    },
    {
      brand: "혜다움",
      brandSub: "중문",
      anchor: "hedaum",
      tint: "#241f19",
      items: [
        { id: "standard-door", type: "3연동", label: "3연동" },
        { id: "standard-door", type: "원슬라이딩", label: "원슬라이딩" },
        { id: "standard-door", type: "스윙폴딩", label: "스윙폴딩" },
        { id: "standard-door", type: "여닫이", label: "여닫이" },
        { id: "standard-door", type: "자동문", label: "자동문" },
      ],
    },
  ];
})();
