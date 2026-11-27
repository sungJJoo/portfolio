<!-- 포트폴리오 저장소 설명 -->
# 박성주 포트폴리오

개발자 박성주의 포트폴리오 사이트입니다.

사이트: https://sungjjoo.github.io/portfolio/

## 구성
- `index.html`: 메인 페이지 (v16 과 같은 내용. 표지, 프로젝트 목록, 일하는 방식, 연구소 사이트, 수강 신청 시뮬레이션, 이력)
- `v2/`~`v15/`: 지난 시안
- `v16/`: v15 의 글자 크기와 간격을 토큰으로 정리한 판 (아래 디자인 규칙)
- `v17/`: v16 과 같은 구성에 색 토큰만 밝은 값으로 바꾼 비교 시안
- `v18/`: v16 구성에 중간 톤 청회색 바탕, 세로 그라데이션, 표지의 흐르는 색면을 더한 시안
- `v19/`: v18 의 탁한 청회색을 맑은 남청색으로 바꾸고 표지 질감을 뺀 시안
- `v20/`: v19 에서 둥근 빛을 빼고, 표지를 본문과 다른 검은 남색으로, 표지와 마지막 구역 파란 면에 픽셀 디더를 넣은 판
- `v21/`: v20 의 남색을 블랙(표지 거의 검정, 본문 숯색)으로 바꾸고 파랑은 픽셀·버튼·링크에만 남긴 판
- `v22/`: v21 에서 수상 설명을 겹쳐 띄우지 않고 목록 사이에 펼치게 바꾼 판 (누르면 열리고 다시 누르거나 Esc로 닫힘, 하나만 열림)
- `v23/`: v22 에 진행 느낌(점과 선으로 이은 이력 타임라인, PC 오른쪽 구역 표시)과 번호 단계 트랙 다이어그램(`v23/flow.css`)을 더한 판. 상세 페이지는 검수용 사본 `v23/projects/`(블랙 상세 색 `v23/dark.css`)로 연결
- `v24/`: v23 에서 상세 사본의 시퀀스·활동·상태·클래스 다이어그램을 단계 트랙과 같은 모양으로 맞춘 판(`v24/uml.css`). 휴대폰 시퀀스는 옆으로 밀지 않는 세로 목록
- `brief/`: 지원서 첨부용 A4 2쪽 요약본 (`tools/make-brief-pdf.js` 로 PDF 생성)
- `projects/`: 프로젝트 상세 페이지 7개
- `assets/img/`: 실제 화면 캡처 (WebP)
- `assets/dark.css`: 상세 페이지를 첫 페이지와 같은 어두운 색으로 덮어쓰는 색 변수
- `assets/style.css`: 밝은 테마, 1024px과 768px 기준 반응형, A4 인쇄용 규칙
- `assets/fx/dither.js`: 파란 면 안 픽셀 디더 (표지에 보일 때만 30fps, 움직임 줄이기면 정지, WebGL 없으면 단색 면)
- `assets/vendor/paper-shaders-0.0.82/`: [Paper Shaders](https://github.com/paper-design/shaders) 중 ShaderMount, dithering, 색 변환 모듈 사본 (Apache-2.0, LICENSE와 NOTICE 포함)
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
- 인쇄·PDF는 `@media print` 에서 같은 토큰을 밝은 값으로 바꾼다. 색을 새로 쓸 때도 `:root` 에 토큰을 만들고 화면 값과 인쇄 값을 함께 정한다.
- 둥글기 `--r` 4px 하나. 글꼴은 Pretendard 하나.

## PDF 만들기
지원서에 첨부할 PDF는 저장소 폴더에서 아래 명령으로 만듭니다. 사이트 내용을 고친 뒤 다시 실행하면 PDF도 같은 내용이 됩니다.

```
node tools/make-pdf.js 박성주_포트폴리오.pdf
```

지원서에는 2쪽 요약본을 쓴다.

```
node tools/make-brief-pdf.js 박성주_포트폴리오_요약.pdf
```

처음 한 번은 `npm i playwright`와 `npx playwright install chromium`이 필요합니다.
