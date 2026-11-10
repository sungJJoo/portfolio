// 새 메인(미리보기): 스크롤 단계에 맞춰 오른쪽 그림을 채우고, 진행 막대와 단계 표시를 바꾸고, 첫 화면 문구를 타자 치듯 바꾼다
(() => {
  const root = document.documentElement;
  const progress = document.querySelector('.progress');
  const pct = document.querySelector('.rail .pct');
  const links = [...document.querySelectorAll('.rail a')];
  const capTag = document.getElementById('cap-tag');
  const capText = document.getElementById('cap-text');

  // 그림 아래 설명: 그 단계에서 그림에 새로 생긴 것
  const caps = [
    ['시작', '아직 아무것도 없는 화면에서'],
    ['질문', '들은 것을 그대로 적은 메모'],
    ['설계', '메모마다 만들 것과 뺄 것을 정한 기능명세'],
    ['구현', '칸마다 검증 항목으로 확인한 결과'],
    ['운영', '쓰다가 나온 문의도 같은 순서로 반영'],
    ['다음', '문제 해결과 프로젝트'],
    ['완성', '도메인에서 들은 것이 구조가 되기까지'],
  ];

  // 그림은 v1~vn을 html에 붙여 n단계까지 채운다. 첫 화면에 있을 때만 바뀌는 문구가 고른 단계(preview)를 미리 보여 준다
  let step = 1;
  let preview = 0;
  const render = () => {
    const view = step === 1 && preview ? preview : step;
    for (let i = 1; i <= caps.length; i++) root.classList.toggle('v' + i, i <= view);
    capTag.textContent = caps[view - 1][0];
    capText.textContent = caps[view - 1][1];
  };
  const setStep = (n) => {
    if (n === step) return;
    step = n;
    render();
  };
  // 오른쪽 표시는 메뉴(개발, 활동, 경력, 연락) 가운데 지금 보고 있는 곳. 첫 화면(0)에서는 아무것도 켜지 않는다
  const setNav = (n) => {
    links.forEach((a, i) => {
      a.classList.toggle('on', i === n - 1);
      if (i === n - 1) a.setAttribute('aria-current', 'true');
      else a.removeAttribute('aria-current');
    });
  };
  // 화면 가운데 띠(위아래 45%를 뺀 곳)에 걸린 단계가 지금 단계
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      if (e.target.dataset.step) setStep(Number(e.target.dataset.step));
      if (e.target.dataset.nav) setNav(Number(e.target.dataset.nav));
    });
  }, { rootMargin: '-45% 0px -45% 0px' });
  document.querySelectorAll('[data-step], [data-nav]').forEach((s) => io.observe(s));
  // 맨 아래 이름 칸이 화면 아래 15% 선을 넘어 올라오면 그림을 숨김
  const endIo = new IntersectionObserver(([e]) => {
    root.classList.toggle('at-end', e.isIntersecting);
  }, { rootMargin: '0px 0px -15% 0px' });
  endIo.observe(document.querySelector('.end'));

  // 읽은 만큼 진행 막대와 %를 채움
  let ticking = false;
  const onScroll = () => {
    const max = root.scrollHeight - innerHeight;
    const p = max > 0 ? Math.min(1, Math.max(0, scrollY / max)) : 0;
    progress.style.transform = `scaleX(${p.toFixed(4)})`;
    pct.textContent = String(Math.round(p * 100)).padStart(2, '0') + '%';
    ticking = false;
  };
  const request = () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } };
  addEventListener('scroll', request, { passive: true });
  addEventListener('resize', request);
  onScroll();

  // 첫 화면 문구: 기본 문구 → 02~05 단계를 한 줄씩 → 다시 기본 문구. 문구마다 그림이 그 단계 모습이 된다
  const word = document.querySelector('#c1 .type');
  if (!word || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const main = word.textContent;
  const phrases = [[2, '왜 필요한지 묻는'], [3, '구조부터 세우는'], [4, '결과를 직접 확인하는'], [5, '만든 뒤에도 운영하는'], [0, main]];
  word.closest('h1').classList.add('typing');
  // 인쇄할 때는 기본 문구로 (타자 치던 중간 글자가 찍히지 않게)
  addEventListener('beforeprint', () => { word.textContent = main; });
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const typeIn = async (text) => { for (let n = 1; n <= text.length; n++) { word.textContent = text.slice(0, n); await sleep(110); } };
  const erase = async () => { while (word.textContent.length) { word.textContent = word.textContent.slice(0, -1); await sleep(55); } };

  (async () => {
    await sleep(2600);
    for (let i = 0; ; i = (i + 1) % phrases.length) {
      const [view, text] = phrases[i];
      await erase();
      preview = view;
      render();
      await typeIn(text);
      await sleep(view === 5 ? 3400 : view ? 2300 : 3000);
    }
  })();
})();
