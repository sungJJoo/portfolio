# 연구소 사이트 저장소의 커밋 기록을 주별로 쌓은 블록 벽(SVG)으로 만들어 index.html의 표시 사이에 넣는 스크립트
# 사용법: python3 tools/make-wall.py <fox-ai-lab 저장소 경로>   (git 필요, 외부 라이브러리 없음)
import datetime as dt
import math
import pathlib
import re
import subprocess
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
INDEX = ROOT / "index.html"
START, END = "<!-- wall:start -->", "<!-- wall:end -->"

# 커밋 종류: 표시 순서, 범례 이름, CSS 클래스
KINDS = {
    "site": ("화면과 기능", "k-site"),
    "cms": ("관리자 CMS 코드", "k-cms"),
    "saved": ("CMS 화면에서 저장", "k-saved"),
    "docs": ("문서", "k-docs"),
}
# 이정표: (날짜, 설명). 개수는 그 주의 커밋 수를 세어 붙인다
MILESTONES = [
    ("2026-06-16", "6월 셋째 주", "첫 화면 시안을 여러 개 만들어 비교"),
    ("2026-07-28", "7월 마지막 주", "이미지·글꼴 최적화와 접근성 점검"),
    ("2026-10-01", "10월 첫 주", "관리자 CMS 공개, CMS 화면에서 저장 시작"),
]
B, G, COLS, WEEK_GAP = 10, 2, 2, 8  # 칸 크기, 칸 사이, 한 주의 칸 수(가로), 주 사이
TOP, BOTTOM = 30, 26  # 위쪽 이정표 자리, 아래쪽 바닥선과 달 이름 자리


def kind_of(subject, files):
    if subject.startswith("관리자:"):
        return "saved"
    if files and all(f.lower().endswith(".md") for f in files):
        return "docs"
    if any(f.startswith("admin") or "/admin" in f or f.endswith(".gs") for f in files):
        return "cms"
    return "site"


def read_commits(repo):
    out = subprocess.run(
        ["git", "-C", str(repo), "log", "--reverse", "--date=short", "--name-only", "--format=@@%ad|%s"],
        capture_output=True, text=True, check=True,
    ).stdout
    commits = []
    for line in out.splitlines():
        if line.startswith("@@"):
            day, subject = line[2:].split("|", 1)
            commits.append({"day": dt.date.fromisoformat(day), "subject": subject, "files": []})
        elif line.strip():
            commits[-1]["files"].append(line.strip())
    for c in commits:
        c["kind"] = kind_of(c["subject"], c["files"])
    commits.sort(key=lambda c: c["day"])  # 같은 날은 git 순서 유지
    return commits


def monday(day):
    return day - dt.timedelta(days=day.weekday())


def build(commits):
    first, last = monday(commits[0]["day"]), monday(commits[-1]["day"])
    weeks = [first + dt.timedelta(weeks=i) for i in range((last - first).days // 7 + 1)]
    by_week = {w: [] for w in weeks}
    for c in commits:
        by_week[monday(c["day"])].append(c)

    pitch = COLS * B + (COLS - 1) * G + WEEK_GAP
    width = len(weeks) * pitch - WEEK_GAP
    rows = math.ceil(max(len(v) for v in by_week.values()) / COLS)
    stack = rows * (B + G) - G
    base = TOP + stack  # 쌓기 시작하는 바닥 y
    height = base + BOTTOM

    parts = []
    for i, w in enumerate(weeks):
        blocks, shine = [], []
        for k, c in enumerate(by_week[w]):
            r, col = divmod(k, COLS)
            x = i * pitch + col * (B + G)
            y = base - (r + 1) * B - r * G
            label = f"{c['day'].month}월 {c['day'].day}일, {KINDS[c['kind']][0]}"
            blocks.append(f'<rect class="blk {KINDS[c["kind"]][1]}" x="{x}" y="{y}" width="{B}" height="{B}"><title>{label}</title></rect>')
            shine.append(f"M{x} {y}h{B}v2h-{B}z")
        if blocks:
            parts.append(f'<g class="wcol" style="--i:{i}">{"".join(blocks)}<path class="shine" d="{"".join(shine)}"/></g>')

    # 이정표 번호: 그 주 기둥 바로 위
    for n, (day, _, _) in enumerate(MILESTONES, 1):
        i = weeks.index(monday(dt.date.fromisoformat(day)))
        h = math.ceil(len(by_week[weeks[i]]) / COLS)
        cx = i * pitch + (COLS * B + (COLS - 1) * G) / 2
        top = base - h * (B + G) + G
        parts.append(f'<g class="mark"><rect x="{cx - 8:g}" y="{top - 22}" width="16" height="16"/><text x="{cx:g}" y="{top - 10}">{n}</text></g>')

    # 바닥선과 달 이름
    parts.append(f'<rect class="ground" x="0" y="{base + 2}" width="{width}" height="2"/>')
    seen = set()
    for i, w in enumerate(weeks):
        for d in range(7):
            day = w + dt.timedelta(days=d)
            if (day.day == 1 or i == 0 and d == 0) and day.month not in seen:
                seen.add(day.month)
                parts.append(f'<text class="month" x="{i * pitch}" y="{base + 20}">{day.month}월</text>')

    months = {}
    for c in commits:
        months[c["day"].month] = months.get(c["day"].month, 0) + 1
    counts = {k: sum(c["kind"] == k for c in commits) for k in KINDS}
    desc = ", ".join(f"{m}월 {n}개" for m, n in months.items()) + ". " + ", ".join(f"{KINDS[k][0]} {n}개" for k, n in counts.items()) + "."

    svg = (
        f'<svg class="wall-svg" viewBox="0 0 {width} {height}" role="img" aria-labelledby="wall-t wall-d">'
        f'<title id="wall-t">연구소 사이트 커밋 {len(commits)}개를 주마다 쌓은 그림</title><desc id="wall-d">{desc}</desc>'
        + "".join(parts) + "</svg>"
    )
    key = "".join(f'<li><i class="{KINDS[k][1]}"></i>{KINDS[k][0]} {n}</li>' for k, n in counts.items())
    notes = "".join(
        f"<li>{when} {len(by_week[monday(dt.date.fromisoformat(day))])}개. {text}</li>" for day, when, text in MILESTONES
    )
    return (
        f'<figure class="wall">{svg}<figcaption>'
        f'<p class="wall-cap">연구소 사이트 저장소의 커밋 {len(commits)}개를 주마다 쌓았습니다. 한 칸이 커밋 하나입니다.</p>'
        f'<ul class="wall-key">{key}</ul><ol class="wall-notes">{notes}</ol></figcaption></figure>'
    )


def main():
    if len(sys.argv) != 2:
        sys.exit("사용법: python3 tools/make-wall.py <fox-ai-lab 저장소 경로>")
    html = INDEX.read_text(encoding="utf-8")
    if html.count(START) != 1 or html.count(END) != 1:
        sys.exit("index.html에 wall 표시가 한 쌍 있어야 합니다")
    figure = build(read_commits(pathlib.Path(sys.argv[1])))
    html = re.sub(re.escape(START) + ".*?" + re.escape(END), lambda m: f"{START}\n          {figure}\n          {END}", html, flags=re.S)
    INDEX.write_text(html, encoding="utf-8")
    print("index.html 블록 벽 갱신 완료")


if __name__ == "__main__":
    main()
