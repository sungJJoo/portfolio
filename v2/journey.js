// 새 메인(미리보기): 스크롤 단계에 맞춰 층을 쌓고, 진행 막대와 단계 표시를 바꾸고, 첫 화면 문구를 타자 치듯 바꾼다
(() => {
  const body = document.body;
  const progress = document.querySelector('.progress');
  const pct = document.querySelector('.rail .pct');
  const links = [...document.querySelectorAll('.rail a')];
  const capTag = document.getElementById('cap-tag');
  const capText = document.getElementById('cap-text');

  // 단계마다 층 그림 아래 설명 (2~5단계는 예전 첫 화면의 층 설명 그대로)
  const caps = [
    ['시작', '아직 아무것도 없는 화면에서'],
    ['기획', '제작 방향 문서, 페이지 정보 순서, 첫 화면 시안 비교'],
    ['서버', 'Apps Script가 GitHub에 저장, 상담 신청은 시트와 메일로'],
    ['화면', '반응형 페이지와 웹 접근성, 모바일 이미지 87% 절감'],
    ['운영', '직원이 코드 없이 고치는 관리자 CMS, 변경 이력과 되돌리기'],
    ['이력', '경력과 프로젝트'],
    ['완성', 'ai.foxconnect.kr, 네 층을 모두 맡아 2026년 6월부터 운영 중'],
  ];

  // n단계까지 온 만큼 s1~sn을 붙임 (층은 쌓인 채로 남음)
  let current = 1;
  const setStep = (n) => {
    if (n === current) return;
    current = n;
    body.className = Array.from({ length: n }, (_, i) => 's' + (i + 1)).join(' ');
    links.forEach((a, i) => {
      a.classList.toggle('on', i === n - 1);
      if (i === n - 1) a.setAttribute('aria-current', 'step');
      else a.removeAttribute('aria-current');
    });
    capTag.textContent = caps[n - 1][0];
    capText.textContent = caps[n - 1][1];
  };
  // 화면 가운데 띠(위아래 45%를 뺀 곳)에 걸린 단계가 지금 단계
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) setStep(Number(e.target.dataset.step)); });
  }, { rootMargin: '-45% 0px -45% 0px' });
  document.querySelectorAll('[data-step]').forEach((s) => io.observe(s));
  // 맨 아래 이름 칸이 화면 아래 15% 선을 넘어 올라오면 층 그림을 숨김
  const endIo = new IntersectionObserver(([e]) => {
    document.documentElement.classList.toggle('at-end', e.isIntersecting);
  }, { rootMargin: '0px 0px -15% 0px' });
  endIo.observe(document.querySelector('.end'));

  // 읽은 만큼 진행 막대와 %를 채움
  let ticking = false;
  const onScroll = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    const p = max > 0 ? Math.min(1, Math.max(0, scrollY / max)) : 0;
    progress.style.transform = `scaleX(${p.toFixed(4)})`;
    pct.textContent = String(Math.round(p * 100)).padStart(2, '0') + '%';
    ticking = false;
  };
  const request = () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } };
  addEventListener('scroll', request, { passive: true });
  addEventListener('resize', request);
  onScroll();

  // 첫 화면 문구: 기본 문구 → 기획하는 → 서버를 짜는 → 화면을 만드는 → 운영까지 하는 → 다시 기본 문구
  const word = document.querySelector('#c1 .type');
  if (!word || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const main = word.textContent;
  const steps = [['plan', '기획하는'], ['api', '서버를 짜는'], ['ui', '화면을 만드는'], ['ops', '운영까지 하는'], ['', main]];
  word.closest('h1').classList.add('typing');
  // 인쇄할 때는 기본 문구로 (타자 치던 중간 글자가 찍히지 않게)
  addEventListener('beforeprint', () => { word.textContent = main; delete body.dataset.on; });
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const typeIn = async (text) => { for (let n = 1; n <= text.length; n++) { word.textContent = text.slice(0, n); await sleep(110); } };
  const erase = async () => { while (word.textContent.length) { word.textContent = word.textContent.slice(0, -1); await sleep(55); } };

  (async () => {
    await sleep(2600);
    for (let i = 0; ; i = (i + 1) % steps.length) {
      const [layer, text] = steps[i];
      await erase();
      if (layer) body.dataset.on = layer;
      else delete body.dataset.on;
      await typeIn(text);
      await sleep(layer ? 1900 : 3200);
    }
  })();
})();
