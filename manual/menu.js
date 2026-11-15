(function () {
  var mm = document.getElementById('mm');
  if (!mm) return;
  document.addEventListener('click', function (e) { if (mm.open && !mm.contains(e.target)) mm.open = false; });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') mm.open = false; });
  mm.addEventListener('click', function (e) { if (e.target.closest && e.target.closest('.mm-panel a')) mm.open = false; });
})();
