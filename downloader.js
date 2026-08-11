/* downloader.js — Descargar resultado del canvas como PNG, GIF o WebM.
   Se carga al final del body. No depende de p5, solo del <canvas>. */
(function () {
  'use strict';

  function pageName() {
    var p = (location.pathname.split('/').pop() || 'index').replace('.html', '');
    return p || 'index';
  }

  function getCanvas() {
    return document.querySelector('canvas');
  }

  function download(url, filename) {
    var a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(function () { a.remove(); }, 800);
  }

  /* ---------- PNG ---------- */
  function savePNG() {
    var c = getCanvas();
    if (!c) { alert('Canvas no encontrado'); return; }
    try {
      var url = c.toDataURL('image/png');
      download(url, pageName() + '.png');
    } catch (e) { alert('No se pudo generar el PNG: ' + e.message); }
  }

  /* ---------- GIF (gif.js) ---------- */
  var gifBusy = false;
  function saveGIF() {
    var c = getCanvas();
    if (!c) { alert('Canvas no encontrado'); return; }
    if (gifBusy) { alert('Ya se está generando un GIF, espera…'); return; }
    if (typeof GIF === 'undefined') { alert('gif.js no cargó'); return; }
    gifBusy = true;
    setStatus('Generando GIF… (no cierres la pestaña)');

    var SECONDS = 4, FPS = 20, total = SECONDS * FPS, i = 0;
    var gif = new GIF({
      workers: 2,
      quality: 10,
      width: c.width,
      height: c.height,
      workerScript: 'gif.worker.js'
    });
    var timer = setInterval(function () {
      try { gif.addFrame(c, { copy: true, delay: 1000 / FPS }); }
      catch (e) { /* frame en blanco? intentar igual */ }
      i++;
      if (i >= total) {
        clearInterval(timer);
        gif.render();
      }
    }, 1000 / FPS);

    gif.on('finished', function (blob) {
      gifBusy = false;
      setStatus('');
      download(URL.createObjectURL(blob), pageName() + '.gif');
    });
    gif.on('abort', function () {
      gifBusy = false;
      setStatus('');
      alert('GIF cancelado');
    });
  }

  /* ---------- WebM (MediaRecorder, sin librerías) ---------- */
  var recBusy = false;
  function saveWebM() {
    var c = getCanvas();
    if (!c) { alert('Canvas no encontrado'); return; }
    if (recBusy) { alert('Ya se está grabando un video, espera…'); return; }
    if (typeof MediaRecorder === 'undefined' || !c.captureStream) {
      alert('Tu navegador no soporta grabación de video (usa Chrome/Edge)');
      return;
    }
    recBusy = true;
    setStatus('Grabando 4s…');

    var stream = c.captureStream(30);
    var mime = MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
      ? 'video/webm;codecs=vp9'
      : (MediaRecorder.isTypeSupported('video/webm') ? 'video/webm' : '');
    var rec = new MediaRecorder(stream, mime ? { mimeType: mime, videoBitsPerSecond: 8000000 } : undefined);
    var chunks = [];
    rec.ondataavailable = function (e) { if (e.data && e.data.size) chunks.push(e.data); };
    rec.onstop = function () {
      recBusy = false;
      setStatus('');
      var blob = new Blob(chunks, { type: 'video/webm' });
      download(URL.createObjectURL(blob), pageName() + '.webm');
    };
    rec.onerror = function () {
      recBusy = false;
      setStatus('');
      alert('Error grabando video');
    };
    rec.start(100);
    setTimeout(function () { try { rec.stop(); } catch (e) {} }, 4000);
  }

  /* ---------- UI ---------- */
  function setStatus(msg) {
    var el = document.getElementById('dlStatus');
    if (el) el.textContent = msg;
  }

  function buildUI() {
    if (document.getElementById('dlPanel')) return;
    var panel = document.createElement('div');
    panel.id = 'dlPanel';

    var title = document.createElement('div');
    title.className = 'dl-title';
    title.textContent = 'Descargar';

    function mkBtn(label, fn) {
      var b = document.createElement('button');
      b.type = 'button';
      b.textContent = label;
      b.addEventListener('click', fn);
      return b;
    }

    var status = document.createElement('div');
    status.id = 'dlStatus';
    status.className = 'dl-status';

    panel.appendChild(title);
    panel.appendChild(mkBtn('⬇ PNG', savePNG));
    panel.appendChild(mkBtn('⬇ GIF (4s)', saveGIF));
    panel.appendChild(mkBtn('⬇ WebM (4s)', saveWebM));
    panel.appendChild(status);
    document.body.appendChild(panel);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', buildUI);
  } else {
    buildUI();
  }
})();
