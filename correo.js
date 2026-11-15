/* Correo de contacto de ALDEA, montado al abrir la página.
   La dirección NO aparece escrita entera en el HTML (los robots que rastrean webs en busca de correos no ejecutan JavaScript).
   Marcas:  <span class="correo">  -> se sustituye por un enlace con la dirección;
            data-mail="texto|gmail|mailto" -> pone el texto o el enlace (Gmail web o programa de correo).  Autor: VicH. */
(function () {
  function dir() { return ['aldea', 'vich', 'app'].join('.') + String.fromCharCode(64) + 'gmail' + String.fromCharCode(46) + 'com'; }
  function listo() {
    var d = dir(), i, el, a;
    var s = document.querySelectorAll('span.correo');
    for (i = s.length - 1; i >= 0; i--) {
      el = s[i]; a = document.createElement('a');
      a.href = 'mailto:' + d; a.textContent = d;
      el.parentNode.replaceChild(a, el);
    }
    var m = document.querySelectorAll('[data-mail]');
    for (i = 0; i < m.length; i++) {
      el = m[i]; var t = el.getAttribute('data-mail');
      if (t === 'texto') el.textContent = d;
      else if (t === 'gmail') el.href = 'https://mail.google.com/mail/?view=cm&fs=1&to=' + encodeURIComponent(d) + '&su=ALDEA';
      else if (t === 'mailto') el.href = 'mailto:' + d + '?subject=ALDEA';
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', listo); else listo();
})();
