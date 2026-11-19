(function () {
  var stage = document.getElementById('stage');
  var label = document.getElementById('boxLabel');
  var buttons = document.querySelectorAll('.toggle button');
  var qr = document.getElementById('qr');
  var ns = 'http://www.w3.org/2000/svg';

  // Dibuja un código QR de ilustración (patrón decorativo, no escaneable).
  var size = 80, x0 = 120, y0 = 184, n = 11, c = size / n;
  var bg = document.createElementNS(ns, 'rect');
  bg.setAttribute('x', x0 - 6); bg.setAttribute('y', y0 - 6);
  bg.setAttribute('width', size + 12); bg.setAttribute('height', size + 12);
  bg.setAttribute('fill', '#fff'); bg.setAttribute('stroke', '#141922'); bg.setAttribute('stroke-width', 2);
  qr.appendChild(bg);
  function finder(cx, cy) {
    [[0, '#141922'], [1, '#fff'], [2, '#141922']].forEach(function (p) {
      var r = document.createElementNS(ns, 'rect');
      r.setAttribute('x', x0 + cx * c + p[0] * c); r.setAttribute('y', y0 + cy * c + p[0] * c);
      r.setAttribute('width', (3 - 2 * p[0]) * c + (p[0] === 2 ? 0 : 0));
      r.setAttribute('height', (3 - 2 * p[0]) * c);
      r.setAttribute('fill', p[1]); qr.appendChild(r);
    });
  }
  finder(0, 0); finder(n - 3, 0); finder(0, n - 3);
  var seed = 7;
  function rnd() { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; }
  for (var i = 0; i < n; i++) {
    for (var j = 0; j < n; j++) {
      var inFinder = (i < 3 && j < 3) || (i >= n - 3 && j < 3) || (i < 3 && j >= n - 3);
      if (inFinder || rnd() < 0.5) continue;
      var r = document.createElementNS(ns, 'rect');
      r.setAttribute('x', x0 + i * c); r.setAttribute('y', y0 + j * c);
      r.setAttribute('width', c); r.setAttribute('height', c); r.setAttribute('fill', '#141922');
      qr.appendChild(r);
    }
  }

  function setMode(mode) {
    var con = mode === 'con';
    stage.classList.toggle('con', con);
    label.textContent = con ? 'Código QR detectado' : 'Rostro detectado';
    buttons.forEach(function (b) {
      b.setAttribute('aria-pressed', String(b.dataset.mode === mode));
    });
  }
  buttons.forEach(function (b) {
    b.addEventListener('click', function () { clearTimeout(auto); setMode(b.dataset.mode); });
  });

  // Un único momento animado al cargar: la cámara pasa del rostro al código.
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var auto = reduce ? null : setTimeout(function () { setMode('con'); }, 1800);
})();