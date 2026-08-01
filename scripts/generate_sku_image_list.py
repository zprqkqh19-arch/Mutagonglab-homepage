#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""SKU 실사진 준비용 목록 생성.

products-data.js의 skuImageKeys(["doorType","frameColor","muntin","glassPattern","handle"])
기준으로 사진이 필요한 전 조합을 CSV로 나열한다. 사진이 준비되면 CSV의 '키'와 '파일명'을
그대로 skuImages에 등록하면 된다. (사이즈·유리종류는 사진 외형과 무관해 키에서 제외된 구조)

출력: assets/sku/SKU_이미지_목록_시공형.csv, SKU_이미지_목록_무타공.csv, README.md
"""
import csv
import os

DOOR_TYPES = {
    "standard-door": ["3연동", "원슬라이딩", "스윙폴딩", "여닫이", "자동문"],
    "diy-door": ["3연동", "원슬라이딩", "스윙폴딩", "여닫이"],
}
PRODUCT_LABEL = {"standard-door": "시공형(혜다움)", "diy-door": "무타공(무타공랩)"}
PATTERN_AXIS_LABEL = {"standard-door": "유리 디자인", "diy-door": "안전창 디자인"}

FRAME_COLORS = [  # (value, 마감, 색상, 파일명용)
    ("paint_white", "도장", "화이트", "도장화이트"),
    ("paint_gray", "도장", "그레이", "도장그레이"),
    ("paint_black", "도장", "블랙", "도장블랙"),
    ("film_white", "필름", "화이트", "필름화이트"),
    ("film_gray", "필름", "그레이", "필름그레이"),
    ("film_black", "필름", "블랙", "필름블랙"),
]
MUNTINS = [("none", "민자"), ("horizontal", "가로통간살"), ("vertical", "세로통간살"), ("arch", "아치형")]
PATTERNS = [("clear", "투명"), ("bronze", "브론즈"), ("moru", "모루"), ("mist", "미스트"), ("fabric", "패브릭")]
HANDLES = [("none", "기본형"), ("circle", "원형"), ("bar", "일자형")]

DEFAULTS = {"frameColor": "paint_white", "muntin": "none", "glassPattern": "clear", "handle": "none"}


def tier(fc, mt, pt, hd):
    """촬영 우선순위: 1=대표(전부 기본), 2=한 축만 변형, 3=두 축 변형, 4=나머지."""
    diff = sum([fc != DEFAULTS["frameColor"], mt != DEFAULTS["muntin"],
                pt != DEFAULTS["glassPattern"], hd != DEFAULTS["handle"]])
    return min(diff + 1, 4)


os.makedirs("assets/sku", exist_ok=True)
counts = {}
for pid, types in DOOR_TYPES.items():
    fname = "assets/sku/SKU_이미지_목록_%s.csv" % ("시공형" if pid == "standard-door" else "무타공")
    rows = []
    for dt in types:
        for fc, fin, col, fcfile in FRAME_COLORS:
            for mt, mtl in MUNTINS:
                for pt, ptl in PATTERNS:
                    for hd, hdl in HANDLES:
                        key = "_".join([dt, fc, mt, pt, hd])
                        file = "assets/sku/%s-%s-%s-%s-%s-%s.png" % (pid, dt, fcfile, mtl, ptl, hdl)
                        rows.append([tier(fc, mt, pt, hd), dt, fin, col, mtl, ptl, hdl, key, file])
    rows.sort(key=lambda r: (r[0], types.index(r[1])))
    with open(fname, "w", newline="", encoding="utf-8-sig") as f:
        w = csv.writer(f)
        w.writerow(["우선순위", "유형", "마감", "프레임 색상", "간살",
                    PATTERN_AXIS_LABEL[pid], "손잡이", "키(skuImages용)", "파일명(권장)"])
        w.writerows(rows)
    counts[pid] = len(rows)
    t1 = sum(1 for r in rows if r[0] == 1)
    t2 = sum(1 for r in rows if r[0] == 2)
    print(f"{fname}: 총 {len(rows)}조합 (1순위 {t1}, 2순위 {t2})")
print("합계:", sum(counts.values()))
