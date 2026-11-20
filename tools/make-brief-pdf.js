// 지원서 첨부용 요약본(brief/index.html)을 A4 2쪽 PDF로 만드는 스크립트
// 사용법: node tools/make-brief-pdf.js [저장할 경로]   (Node.js와 Playwright 필요)
const { chromium } = require('playwright');
const path = require('path');
const { pathToFileURL } = require('url');

const ROOT = path.resolve(__dirname, '..');
const OUT = path.resolve(process.argv[2] || '박성주_포트폴리오_요약.pdf');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto(pathToFileURL(path.join(ROOT, 'brief', 'index.html')).href);
  await page.emulateMedia({ media: 'print' });
  await page.evaluate(() => document.fonts.ready);
  // 쪽 상자(.page)보다 내용이 길면 인쇄할 때 잘리므로 먼저 막는다
  const over = await page.$$eval('.page', (ps) => ps.map((p, i) => (p.scrollHeight > p.clientHeight + 1 ? i + 1 : 0)).filter(Boolean));
  if (over.length) throw new Error(`내용이 넘치는 쪽: ${over.join(', ')}`);
  await page.pdf({ path: OUT, preferCSSPageSize: true, printBackground: true, tagged: true, outline: true });
  await browser.close();
  console.log(OUT);
})().catch((err) => { console.error(err); process.exit(1); });
