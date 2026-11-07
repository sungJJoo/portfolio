// 화면 영상: 화면에 보일 때만 소리 없이 재생하고 벗어나면 멈춘다. 움직임 줄이기나 데이터 절약 설정이면 자동 재생하지 않는다
(function () {
  var vids = document.querySelectorAll('video.demo');
  if (!vids.length) return;
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var save = navigator.connection && navigator.connection.saveData;
  if (reduce || save || !('IntersectionObserver' in window)) return;
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      var v = e.target;
      if (e.isIntersecting) {
        if (v.dataset.stopped) return;   // 사람이 직접 멈춘 영상은 다시 틀지 않는다
        v.play().catch(function () {});
      } else if (!v.paused) {
        v.dataset.auto = '1';
        v.pause();
      }
    });
  }, { threshold: 0.35 });
  vids.forEach(function (v) {
    v.addEventListener('pause', function () { if (!v.dataset.auto && !document.hidden) v.dataset.stopped = '1'; delete v.dataset.auto; });
    v.addEventListener('play', function () { delete v.dataset.stopped; });
    io.observe(v);
  });
})();
