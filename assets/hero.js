// 첫 화면 제목의 단어를 기획 → 서버 → 화면 → 운영 순서로 타자 치듯 바꾸고, 같은 층을 스택에서 띄우는 스크립트
(() => {
  const hero = document.querySelector('.hero');
  const word = hero && hero.querySelector('.type');
  const fig = hero && hero.querySelector('.stack-fig');
  if (!word || !fig || matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  hero.classList.add('typing');
  const steps = [['k-plan', '기획하는'], ['k-api', '서버를 짜는'], ['k-ui', '화면을 만드는'], ['k-ops', '운영까지 하는']];
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  let paused = false;
  fig.addEventListener('mouseenter', () => { paused = true; delete hero.dataset.on; });
  fig.addEventListener('mouseleave', () => { paused = false; });

  const typeIn = async (text) => { for (let n = 1; n <= text.length; n++) { word.textContent = text.slice(0, n); await sleep(110); } };
  const erase = async () => { while (word.textContent.length) { word.textContent = word.textContent.slice(0, -1); await sleep(55); } };

  (async () => {
    await sleep(1400);
    for (let i = 0; ; i = (i + 1) % steps.length) {
      const [layer, text] = steps[i];
      await erase();
      if (!paused) hero.dataset.on = layer;
      await typeIn(text);
      await sleep(1900);
    }
  })();
})();
