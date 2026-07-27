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
      '</g>' +
      '<g class="handle-group" data-handle="basic" style="display:none"><rect x="0" y="0" width="3" height="10" rx="1.5" class="handle"></rect></g>' +
      '<g class="foot-group" data-addon="foot" style="display:none"><circle cx="30" cy="110" r="2" class="foot"></circle><circle cx="66" cy="110" r="2" class="foot"></circle></g>' +
      "</svg>"
    );
  }

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
    { value: "paint_ivory", label: "아이보리", hex: "#E9DFC9", group: "도장" },
    { value: "paint_gray", label: "그레이", hex: "#B9B2A8", group: "도장" },
    { value: "paint_black", label: "블랙", hex: "#2D2D2D", group: "도장" },
    { value: "paint_gold", label: "골드", hex: "#B88A5A", group: "도장" },
    { value: "film_white", label: "화이트", hex: "#F3EFE6", group: "필름" },
    { value: "film_oak", label: "오크", hex: "#C9A876", group: "필름" },
    { value: "film_walnut", label: "월넛", hex: "#6F4E37", group: "필름" },
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
      value: "grid",
      label: "격자간살",
      icon: '<svg viewBox="0 0 32 44" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="4" width="24" height="36" rx="1"></rect><path d="M4,16 h24 M4,28 h24 M12,4 v36 M20,4 v36"></path></svg>',
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
      icon: '<svg viewBox="0 0 32 44" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="4" y="4" width="24" height="36" rx="1"></rect><path d="M9,10 l4,4 M9,20 l4,4 M9,30 l4,4 M19,10 l4,4 M19,20 l4,4 M19,30 l4,4"></path></svg>',
    },
    {
      value: "mist",
      label: "미스트",
      icon: '<svg viewBox="0 0 32 44"><rect x="4" y="4" width="24" height="36" rx="1" fill="currentColor" fill-opacity=".16" stroke="currentColor" stroke-width="1.2" stroke-opacity=".5"></rect><path d="M8,14 h16 M8,22 h16 M8,30 h16" stroke="currentColor" stroke-width="1.2" stroke-opacity=".35" fill="none"></path></svg>',
    },
    {
      value: "fabric",
      label: "패브릭",
      icon: '<svg viewBox="0 0 32 44" fill="none" stroke="currentColor" stroke-width="1.1" stroke-opacity=".6"><rect x="4" y="4" width="24" height="36" rx="1" stroke-opacity="1"></rect><path d="M4,10 h24 M4,16 h24 M4,22 h24 M4,28 h24 M4,34 h24 M10,4 v36 M16,4 v36 M22,4 v36"></path></svg>',
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

  // W 1000~1800(100단위) × H 2000~2500(100단위)
  var SIZE_CHOICES = (function () {
    var out = [];
    for (var w = 1000; w <= 1800; w += 100) {
      for (var h = 2000; h <= 2500; h += 100) {
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
    default: "1400x2300",
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

  var HANDLE_OPTION = {
    id: "handle",
    kind: "handle",
    label: "손잡이",
    choices: [
      { value: "none", label: "기본형" },
      { value: "basic", label: "바 손잡이" },
    ],
    default: "none",
  };

  // 길이조절발·마감판 — 무타공 제품(셀프시공형) 전용. 혜다움(시공형)은 시공팀이 현장에 맞춰 시공하므로 해당 없음.
  var ADDON_OPTION = {
    id: "footFinish",
    kind: "addon",
    label: "길이조절발 · 마감판 추가",
    description: "공간 크기에 맞춰 사이즈를 조정할 때 사용하는 부속품입니다.",
    default: false,
  };

  window.MUTAGONG_PRODUCTS = {
    "standard-door": {
      id: "standard-door",
      name: "일반 시공형 중문",
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
      options: [
        DOOR_TYPE_OPTION_WITH_AUTO,
        SIZE_OPTION,
        FINISH_TYPE_OPTION,
        FRAME_COLOR_OPTION,
        MUNTIN_OPTION,
        GLASS_TYPE_OPTION,
        GLASS_PATTERN_OPTION,
        HANDLE_OPTION,
      ],
      purchaseNotice:
        "본 상품은 시공팀이 서울·경기·경상권 기준 무료로 현장 방문 실측을 진행한 뒤 제작·시공에 들어가는 시공형 제품입니다. 그 외 지역은 무료 실측이 어려워 별도 비용이 발생하며, 정확한 금액은 상담 시 안내드립니다. 실측 후 제작 시작 전에 취소하실 경우 3만원을 제외하고 환불되며, 제작이 시작된 이후에는 단순 변심에 의한 취소·반품이 불가합니다. 제품 또는 시공 하자가 확인되는 경우 구매일로부터 1년간 무상 A/S가 적용됩니다(고객 과실로 인한 하자는 비용이 발생할 수 있습니다). A/S 출장비는 실측과 동일한 기준으로 안내드립니다.",
    },

    "standard-partition": {
      id: "standard-partition",
      name: "시공형 파티션",
      brand: "혜다움",
      tagline: "시공형 중문과 함께 시공하는 파티션입니다.",
      saleStatus: "available",
      category: "파티션",
      summary:
        "혜다움의 시공형 파티션입니다. 가벽이 없는 완전 개방형 구조에 픽스(파티션)와 중문을 함께 시공해, 목공사보다 저렴하게 공간을 구획합니다.",
      features: [
        { title: "완전개방형 대응", desc: "가벽이 없는 구축·신축 현장에 파티션과 중문을 동시에 시공합니다." },
        { title: "다양한 마감", desc: "도장·필름 프레임 색상과 간살·유리 디자인을 선택할 수 있습니다." },
        { title: "정확한 실측 필요", desc: "파티션과 중문이 만나는 자리는 특히 정확한 실측이 필요합니다." },
      ],
      useCases: [
        { tag: "완전 개방형 구조", desc: "가벽 없는 구축·신축 현장" },
        { tag: "현관·거실 분리", desc: "외부 시선 차단이 필요한 공간" },
      ],
      previewSVG: partitionPreviewSVG,
      options: [SIZE_OPTION, FINISH_TYPE_OPTION, FRAME_COLOR_OPTION, MUNTIN_OPTION, GLASS_TYPE_OPTION, GLASS_PATTERN_OPTION],
      purchaseNotice:
        "본 상품은 시공팀이 서울·경기·경상권 기준 무료로 현장 방문 실측을 진행한 뒤 제작·시공에 들어가는 시공형 제품입니다. 그 외 지역은 무료 실측이 어려워 별도 비용이 발생하며, 정확한 금액은 상담 시 안내드립니다. 실측 후 제작 시작 전에 취소하실 경우 3만원을 제외하고 환불되며, 제작이 시작된 이후에는 단순 변심에 의한 취소·반품이 불가합니다. 제품 또는 시공 하자가 확인되는 경우 구매일로부터 1년간 무상 A/S가 적용됩니다(고객 과실로 인한 하자는 비용이 발생할 수 있습니다). A/S 출장비는 실측과 동일한 기준으로 안내드립니다.",
    },

    "diy-door": {
      id: "diy-door",
      name: "무타공 DIY 중문",
      brand: "무타공랩",
      tagline: "벽과 문틀에 구멍을 내지 않는 무타공랩의 자체 R&D 제품입니다.",
      saleStatus: "coming-soon",
      category: "중문",
      summary:
        "무타공(無打孔) 방식으로 셀프 실측·셀프 시공이 가능한 무타공랩 자체 제품입니다. 3연동·원슬라이딩·스윙폴딩·여닫이 4가지 구조로 제작합니다.",
      features: [
        { title: "타공 없이 고정", desc: "벽과 문틀에 구멍을 내지 않아 원상복구가 쉽습니다." },
        { title: "셀프 시공", desc: "현장 방문 실측 없이, 가이드를 참고해 직접 실측·설치합니다." },
        { title: "사이즈 가변", desc: "표준 규격 제품에 길이조절발·마감판을 더해 공간 크기에 맞춥니다." },
        { title: "시공 현장 노하우 반영", desc: "중문·파티션 시공 현장 데이터를 참고해 구조를 설계합니다." },
      ],
      useCases: [
        { tag: "임대 공간", desc: "벽을 훼손할 수 없는 전월세·상가" },
        { tag: "셀프 인테리어", desc: "직접 시공을 원하는 1인 가구·신혼집" },
        { tag: "임시·가변 공간", desc: "구조를 자주 바꾸는 공간" },
      ],
      previewSVG: doorPreviewSVG,
      options: [
        DOOR_TYPE_OPTION,
        SIZE_OPTION,
        FINISH_TYPE_OPTION,
        FRAME_COLOR_OPTION,
        MUNTIN_OPTION,
        GLASS_TYPE_OPTION,
        GLASS_PATTERN_OPTION,
        HANDLE_OPTION,
        ADDON_OPTION,
      ],
      purchaseNotice:
        "본 상품은 고객님이 직접 실측하신 값에 맞춰 개별로 재단·제작되는 셀프 시공 제품으로, 주문 후에는 단순 변심에 의한 취소·반품이 불가합니다. 실측이 어려우시면 지역에 따라 3~10만원의 비용으로 출장 실측을 요청하실 수 있으며, 이 경우 실측 전 취소는 전액 환불, 실측 후·생산 시작 전 취소는 실측 비용을 제외하고 환불됩니다(생산 시작 후에는 취소 불가). 제품 하자가 확인되는 경우 구매일로부터 1년간 무상 A/S가 적용되며, A/S 접수 시 배송비는 고객님 부담입니다.",
    },

    partition: {
      id: "partition",
      name: "무타공 파티션",
      brand: "무타공랩",
      tagline: "공간을 완전히 막지 않고, 무타공 방식으로 구획합니다.",
      saleStatus: "coming-soon",
      category: "파티션",
      summary: "무타공 방식으로 고정하는 파티션으로, 공간을 완전히 나누지 않으면서 구역을 구분합니다.",
      features: [
        { title: "타공 없이 구획", desc: "벽 손상 없이 공간을 나눌 수 있습니다." },
        { title: "간살·유리 선택", desc: "간살 디자인과 유리 디자인을 조합해 선택할 수 있습니다." },
        { title: "사이즈 가변", desc: "길이조절발·마감판으로 공간에 맞춥니다." },
        { title: "시공 현장 노하우 반영", desc: "중문·파티션 시공 현장 데이터를 참고해 구조를 설계합니다." },
      ],
      useCases: [
        { tag: "거실·서재 구분", desc: "완전히 막지 않고 구역만 나누고 싶은 공간" },
        { tag: "상업 공간", desc: "카페·오피스의 부분 구획" },
      ],
      previewSVG: partitionPreviewSVG,
      options: [SIZE_OPTION, FINISH_TYPE_OPTION, FRAME_COLOR_OPTION, MUNTIN_OPTION, GLASS_TYPE_OPTION, GLASS_PATTERN_OPTION, ADDON_OPTION],
      purchaseNotice:
        "본 상품은 고객님이 직접 실측하신 값에 맞춰 개별로 재단·제작되는 셀프 시공 제품으로, 주문 후에는 단순 변심에 의한 취소·반품이 불가합니다. 실측이 어려우시면 지역에 따라 3~10만원의 비용으로 출장 실측을 요청하실 수 있으며, 이 경우 실측 전 취소는 전액 환불, 실측 후·생산 시작 전 취소는 실측 비용을 제외하고 환불됩니다(생산 시작 후에는 취소 불가). 제품 하자가 확인되는 경우 구매일로부터 1년간 무상 A/S가 적용되며, A/S 접수 시 배송비는 고객님 부담입니다.",
    },

    accessories: {
      id: "accessories",
      name: "길이조절발 · 마감판",
      brand: "무타공랩",
      tagline: "표준 규격 제품을 내 공간 크기에 맞추는 부속품입니다.",
      saleStatus: "coming-soon",
      category: "기타",
      summary:
        "무타공랩 제품은 표준 규격에 부속품을 더해 사이즈를 조정합니다. 길이조절발과 마감판을 추가로 구매해 설치 공간에 맞출 수 있습니다.",
      features: [
        { title: "길이조절발", desc: "바닥·천장 여유 공간에 맞춰 길이를 조정합니다." },
        { title: "마감판", desc: "문틀과 벽 사이 틈을 정리합니다." },
        { title: "단독 구매 가능", desc: "보유 중인 제품의 사이즈를 나중에 조정할 때도 추가 구매할 수 있습니다." },
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
  window.MUTAGONG_PRODUCT_ORDER = ["standard-door", "standard-partition", "diy-door", "partition", "accessories"];

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
      brand: "혜다움",
      brandSub: "시공형 중문 · 파티션",
      anchor: "hedaum",
      tint: "#241f19",
      items: [
        { id: "standard-door", type: "3연동", label: "3연동" },
        { id: "standard-door", type: "원슬라이딩", label: "원슬라이딩" },
        { id: "standard-door", type: "스윙폴딩", label: "스윙폴딩" },
        { id: "standard-door", type: "여닫이", label: "여닫이" },
        { id: "standard-door", type: "자동문", label: "자동문" },
        { id: "standard-partition", type: null, label: "파티션" },
      ],
    },
    {
      brand: "무타공랩",
      brandSub: "무타공 셀프시공형",
      anchor: "mutagonglab",
      tint: "#2e2a22",
      items: [
        { id: "diy-door", type: "3연동", label: "3연동" },
        { id: "diy-door", type: "원슬라이딩", label: "원슬라이딩" },
        { id: "diy-door", type: "스윙폴딩", label: "스윙폴딩" },
        { id: "diy-door", type: "여닫이", label: "여닫이" },
        { id: "partition", type: null, label: "파티션" },
      ],
    },
  ];
})();
