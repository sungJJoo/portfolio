// 메인 페이지와 프로젝트 상세 7개를 한 문서로 이어 붙여 A4 PDF 하나로 만드는 스크립트
// 사용법: node tools/make-pdf.js [저장할 경로]   (Node.js와 Playwright 필요)
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const { pathToFileURL } = require('url');

const ROOT = path.resolve(__dirname, '..');
const LIVE = 'https://sungjjoo.github.io/portfolio/';
// 상세 페이지 아래 이전·다음 이동 순서와 같게 둔다
const PROJECTS = ['fox-ai-lab', 'woosong-site', 'scheduler', 'smartvision', 'face-removal', 'plantify', 'bank-manager'];
const OUT = path.resolve(process.argv[2] || '박성주_포트폴리오.pdf');

(async () => {
  const browser = await chromium.launch();
  // 움직임 줄이기 설정으로 열어 제목 타자 효과를 멈춘 채 고정 문장으로 찍음
  const page = await browser.newPage({ reducedMotion: 'reduce' });
  await page.goto(pathToFileURL(path.join(ROOT, 'index.html')).href);

  const details = PROJECTS.map((name) => {
    const file = path.join(ROOT, 'projects', `${name}.html`);
    return { name, html: fs.readFileSync(file, 'utf8'), fileUrl: pathToFileURL(file).href, liveUrl: `${LIVE}projects/${name}.html` };
  });

  // 상세 페이지의 본문을 메인 뒤에 붙인다. 프로젝트 링크는 PDF 안의 해당 쪽으로, 나머지 사이트 링크는 실제 주소로 바꾼다
  await page.evaluate(({ details, LIVE, PROJECTS }) => {
    const main = document.querySelector('main');
    const fixLink = (a, base) => {
      const raw = a.getAttribute('href');
      if (!raw || /^(https?:|mailto:)/.test(raw)) return;
      const url = new URL(raw, base);
      const m = url.pathname.match(/\/projects\/([\w-]+)\.html$/);
      if (m && PROJECTS.includes(m[1])) return a.setAttribute('href', `#proj-${m[1]}`);
      if (url.hash && document.getElementById(url.hash.slice(1))) return a.setAttribute('href', url.hash);
      a.setAttribute('href', url.href);
    };
    main.querySelectorAll('a[href]').forEach((a) => fixLink(a, `${LIVE}index.html`));
    for (const d of details) {
      const doc = new DOMParser().parseFromString(d.html, 'text/html');
      doc.querySelectorAll('[src]').forEach((el) => el.setAttribute('src', new URL(el.getAttribute('src'), d.fileUrl).href));
      doc.querySelectorAll('a[href]').forEach((a) => fixLink(a, d.liveUrl));
      const wrap = document.createElement('div');
      wrap.className = 'pdf-project';
      wrap.id = `proj-${d.name}`;
      wrap.append(...doc.querySelector('main').childNodes);
      main.append(wrap);
    }
    document.querySelectorAll('img[loading="lazy"]').forEach((img) => { img.loading = 'eager'; });
  }, { details, LIVE, PROJECTS });

  await page.emulateMedia({ media: 'print' });
  const broken = await page.evaluate(async () => {
    const wait = (img) => (img.complete ? null : new Promise((r) => { img.onload = img.onerror = r; }));
    await Promise.race([Promise.all([...document.images].map(wait)), new Promise((r) => setTimeout(r, 15000))]);
    await document.fonts.ready;
    return [...document.images].filter((img) => !img.naturalWidth).map((img) => img.getAttribute('src'));
  });
  if (broken.length) throw new Error(`불러오지 못한 이미지: ${broken.join(', ')}`);

  await page.pdf({
    path: OUT,
    preferCSSPageSize: true,
    margin: { top: '12mm', right: '12mm', bottom: '14mm', left: '12mm' },
    scale: 0.8,
    printBackground: true,
    outline: true,
    tagged: true,
    displayHeaderFooter: true,
    headerTemplate: '<div></div>',
    footerTemplate: '<div style="width:100%;text-align:center;font-size:8px;color:#a1a1aa;font-family:sans-serif"><span class="pageNumber"></span> / <span class="totalPages"></span></div>',
  });
  await browser.close();
  console.log(OUT);
})().catch((err) => { console.error(err); process.exit(1); });
