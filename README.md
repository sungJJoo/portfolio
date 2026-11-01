<!-- 포트폴리오 저장소 설명 -->
# 박성주 포트폴리오

개발자 박성주의 포트폴리오 사이트입니다.

사이트: https://sungjjoo.github.io/portfolio/

## 구성
- `index.html`: 메인 페이지 (세 줄 요약, 경력, 문제 해결 4건, 프로젝트 목록, 기술, 학력과 수상, 연락)
- `projects/`: 프로젝트 상세 페이지 7개
- `assets/img/`: 실제 화면 캡처 (WebP)
- `assets/style.css`: 밝은 테마, 1024px과 768px 기준 반응형, A4 인쇄용 규칙
- `assets/fonts/`: Pretendard Variable 동적 서브셋 (SIL OFL 1.1)
- `assets/icons/`: 기술 로고 Devicon, 화면 아이콘 Phosphor (둘 다 MIT)
- `tools/make-pdf.js`: 메인과 상세 7개를 A4 PDF 한 개로 묶는 스크립트

빌드 없이 정적 파일만으로 GitHub Pages에서 동작합니다.

## PDF 만들기
지원서에 첨부할 PDF는 저장소 폴더에서 아래 명령으로 만듭니다. 사이트 내용을 고친 뒤 다시 실행하면 PDF도 같은 내용이 됩니다.

```
node tools/make-pdf.js 박성주_포트폴리오.pdf
```

처음 한 번은 `npm i playwright`와 `npx playwright install chromium`이 필요합니다.
