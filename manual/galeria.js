// Visor de capturas del manual: tocar una captura la abre en grande y pasan solas.
// Se para mientras el usuario la mira (ratón o dedo encima) o con el botón de pausa.
// Flechas, deslizar con el dedo, teclado (← → Esc espacio). Sin dependencias. Autor y propietario: VicH.
(function () {
  var tiras = document.querySelectorAll('.tira');
  if (!tiras.length) return;
  var PASO = 4000;                       // ms por captura
  var v = document.createElement('div');
  v.className = 'visor';
  v.setAttribute('role', 'dialog');
  v.setAttribute('aria-modal', 'true');
  v.setAttribute('aria-label', 'Capturas en grande');
  v.innerHTML = '<button class="cerrar" aria-label="Cerrar">✕</button>' +
    '<button class="vb ant" aria-label="Anterior">‹</button>' +
    '<figure><div class="marco"><img alt=""><figcaption></figcaption></div></figure>' +
    '<button class="vb sig" aria-label="Siguiente">›</button>' +
    '<div class="pie-v"><span class="cuenta"></span><button class="pausa"></button></div>' +
    '<div class="prog"><i></i></div>';
  document.body.appendChild(v);
  var img = v.querySelector('img'), pie = v.querySelector('figcaption'), cuenta = v.querySelector('.cuenta'),
      bPausa = v.querySelector('.pausa'), barra = v.querySelector('.prog i');
  var lista = [], i = 0, pausado = false, mirando = false, t0 = 0, resto = PASO, raf = 0;

  function mostrar(n) {
    i = (n + lista.length) % lista.length;
    var f = lista[i];
    img.style.opacity = 0;
    img.onload = function () { img.style.opacity = 1; };
    img.src = f.src; img.alt = f.alt; pie.textContent = f.pie;
    if (img.complete) img.style.opacity = 1;                 // ya en caché: onload puede no llegar
    cuenta.textContent = (i + 1) + ' / ' + lista.length;
    new Image().src = lista[(i + 1) % lista.length].src;     // precarga la siguiente
    resto = PASO; t0 = performance.now();
  }
  function parado() { return pausado || mirando; }
  function marca() {
    bPausa.textContent = pausado ? '▶ Seguir' : '⏸ Pausa';
    bPausa.setAttribute('aria-label', pausado ? 'Seguir el pase' : 'Pausar el pase');
  }
  function bucle(ahora) {
    if (!v.classList.contains('ver')) return;
    if (parado()) { t0 = ahora - (PASO - resto); }
    else {
      resto = PASO - (ahora - t0);
      if (resto <= 0) { mostrar(i + 1); resto = PASO; }
    }
    barra.style.width = (100 * (1 - resto / PASO)) + '%';
    raf = requestAnimationFrame(bucle);
  }
  function abrir(tira, n) {
    lista = Array.prototype.map.call(tira.querySelectorAll('figure'), function (fig) {
      var im = fig.querySelector('img'), c = fig.querySelector('figcaption');
      return { src: im.getAttribute('src'), alt: im.alt, pie: c ? c.textContent : '' };
    });
    pausado = false; mirando = false; marca();
    v.classList.add('ver');
    document.documentElement.style.overflow = 'hidden';
    mostrar(n);
    cancelAnimationFrame(raf); raf = requestAnimationFrame(bucle);
    v.querySelector('.cerrar').focus();
  }
  function cerrar() {
    v.classList.remove('ver');
    document.documentElement.style.overflow = '';
    cancelAnimationFrame(raf);
  }

  Array.prototype.forEach.call(tiras, function (tira) {
    Array.prototype.forEach.call(tira.querySelectorAll('figure img'), function (im, n) {
      im.setAttribute('tabindex', '0');
      im.setAttribute('role', 'button');
      im.addEventListener('click', function () { abrir(tira, n); });
      im.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); abrir(tira, n); } });
    });
  });

  v.querySelector('.cerrar').addEventListener('click', cerrar);
  v.querySelector('.ant').addEventListener('click', function () { mostrar(i - 1); });
  v.querySelector('.sig').addEventListener('click', function () { mostrar(i + 1); });
  bPausa.addEventListener('click', function () { pausado = !pausado; marca(); });
  v.addEventListener('click', function (e) { if (e.target === v) cerrar(); });     // tocar el fondo cierra
  // Mirando: ratón encima de la imagen (ordenador) o dedo apoyado (móvil)
  img.addEventListener('mouseenter', function () { mirando = true; });
  img.addEventListener('mouseleave', function () { mirando = false; });
  var x0 = null;
  img.addEventListener('touchstart', function (e) { mirando = true; x0 = e.touches[0].clientX; }, { passive: true });
  img.addEventListener('touchend', function (e) {
    mirando = false;
    if (x0 === null) return;
    var dx = e.changedTouches[0].clientX - x0; x0 = null;
    if (Math.abs(dx) > 40) mostrar(i + (dx < 0 ? 1 : -1));
    else { pausado = !pausado; marca(); }                 // un toque sin deslizar: pausa / sigue
  });
  document.addEventListener('keydown', function (e) {
    if (!v.classList.contains('ver')) return;
    if (e.key === 'Escape') cerrar();
    else if (e.key === 'ArrowRight') mostrar(i + 1);
    else if (e.key === 'ArrowLeft') mostrar(i - 1);
    else if (e.key === ' ') { e.preventDefault(); pausado = !pausado; marca(); }
  });
})();
