// 스크롤할 때 섹션이 부드럽게 나타나게 하는 스크립트
(function () {
  var items = document.querySelectorAll('.card, .project, .timeline > li, .skill-group');
  if (!('IntersectionObserver' in window)) return;
  items.forEach(function (el) { el.classList.add('reveal'); });
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('show'); io.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  items.forEach(function (el) { io.observe(el); });
})();
