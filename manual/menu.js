(function () {
  var mm = document.getElementById('mm');
  if (!mm) return;
  document.addEventListener('click', function (e) { if (mm.open && !mm.contains(e.target)) mm.open = false; });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') mm.open = false; });
  mm.addEventListener('click', function (e) { if (e.target.closest && e.target.closest('.mm-panel a')) mm.open = false; });
})();
// Al llegar a un apartado (#ancla, p. ej. desde el buscador): el video y las capturas de arriba cargan despues y
// empujaban el apartado hacia abajo. Se recoloca al cargar todo y el titulo se ilumina un momento. 16-nov-2026
(function () {
  function destino() {
    var id = decodeURIComponent((location.hash || '').slice(1));
    return id ? document.getElementById(id) : null;
  }
  function ir(marcar) {
    var el = destino();
    if (!el) return;
    // Salto inmediato: con el desplazamiento suave del CSS la animacion se cortaba al cargar el video y las
    // capturas y no llegaba al apartado
    var h = document.documentElement, antes = h.style.scrollBehavior;
    h.style.scrollBehavior = 'auto';
    el.scrollIntoView({ block: 'start', behavior: 'instant' });
    h.style.scrollBehavior = antes;
    if (marcar) { el.classList.remove('destino'); void el.offsetWidth; el.classList.add('destino'); }
  }
  if (destino()) {
    ir(true);
    window.addEventListener('load', function () { ir(false); setTimeout(function () { ir(false); }, 400); });
  }
  window.addEventListener('hashchange', function () { ir(true); });
})();
