<!-- 포트폴리오 저장소 설명 -->
# 박성주 포트폴리오

개발자 박성주의 포트폴리오 사이트입니다.

사이트: https://sungjjoo.github.io/portfolio/

## 구성
- `index.html`: 메인 페이지 (v15 와 같은 내용. 표지, 프로젝트 목록, 일하는 방식, 연구소 사이트, 수강 신청 시뮬레이션, 이력)
- `v2/`~`v15/`: 지난 시안
- `v16/`: v15 의 글자 크기와 간격을 토큰으로 정리한 판 (아래 디자인 규칙)
- `projects/`: 프로젝트 상세 페이지 7개
- `assets/img/`: 실제 화면 캡처 (WebP)
- `assets/dark.css`: 상세 페이지를 첫 페이지와 같은 어두운 색으로 덮어쓰는 색 변수
- `assets/style.css`: 밝은 테마, 1024px과 768px 기준 반응형, A4 인쇄용 규칙
- `assets/fonts/`: Pretendard Variable 동적 서브셋 (SIL OFL 1.1)
- `assets/icons/`: 기술 로고 Devicon, 화면 아이콘 Phosphor (둘 다 MIT)
- `tools/make-pdf.js`: 메인과 상세 7개를 A4 PDF 한 개로 묶는 스크립트

빌드 없이 정적 파일만으로 GitHub Pages에서 동작합니다.

## 디자인 규칙 (v16 기준)
값은 `v16/index.html` 의 `:root` 에 변수로 있고, 화면에서는 변수만 쓴다.

- 색 11개: 바탕 `--bg` `--paper` `--card`, 선 `--line`, 글자 `--ink`(제목) `--body`(본문) `--muted`(보조), 강조 `--acc`(링크·숫자) `--slab`(표지 면), 경고 `--red`
- 글자 크기 10단계
  - 본문용: `--fs-xs` 13 · `--fs-sm` 14 · `--fs-md` 15 · `--fs-base` 17(본문) · `--fs-lg` 19 · `--fs-xl` 21(소제목) · `--fs-2xl` 30
  - 큰 글자: `--fs-d1`(큰 제목·큰 숫자) · `--fs-d2`(구역 제목) · `--fs-d3`(이력 소제목), 화면 폭에 따라 커지는 clamp
- 간격 4px 단위 12단계: `--sp-1` 4 · `--sp-2` 8 · `--sp-3` 12 · `--sp-4` 16 · `--sp-5` 20 · `--sp-6` 24 · `--sp-8` 32 · `--sp-10` 40 · `--sp-12` 48 · `--sp-16` 64 · `--sp-20` 80 · `--sp-30` 120. 4px 미만은 선 위치 맞춤에만 쓴다.
- 둥글기 `--r` 4px 하나. 글꼴은 Pretendard 하나.

## PDF 만들기
지원서에 첨부할 PDF는 저장소 폴더에서 아래 명령으로 만듭니다. 사이트 내용을 고친 뒤 다시 실행하면 PDF도 같은 내용이 됩니다.

```
node tools/make-pdf.js 박성주_포트폴리오.pdf
```

처음 한 번은 `npm i playwright`와 `npx playwright install chromium`이 필요합니다.
