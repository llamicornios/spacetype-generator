/* fontSelector.js — selector de tipografías (Google Fonts) para Space Type Generator.
   Debe cargarse DESPUÉS de p5.min.js y ANTES del sketch.js (instala hook síncrono
   sobre p5.prototype.loadFont para desviar la fuente elegida en preload).
   El panel se construye asíncrono desde fonts/fonts.json. */
(function () {
  'use strict';
  var FONT_LIST = null;

  function currentFont() {
    try { return localStorage.getItem('stg_font') || 'default'; }
    catch (e) { return 'default'; }
  }

  /* HOOK SÍNCRONO: desvía loadFont de p5 hacia fonts/<elegida>.ttf */
  (function installHook() {
    var chosen = currentFont();
    if (chosen === 'default') return; // sin hook, comportamiento original
    if (!window.p5 || !window.p5.prototype) return; // p5 aún no cargado
    var target = 'fonts/' + chosen; // chosen = nombre de archivo (p.ej. Montserrat-Regular.ttf)
    var orig = window.p5.prototype.loadFont;
    window.p5.prototype.loadFont = function (path) {
      var p = String(path);
      if (p.indexOf('.ttf') !== -1 || p.indexOf('.otf') !== -1) {
        return orig.call(this, target);
      }
      return orig.apply(this, arguments);
    };
    window.__stgFontHookActive = true;
  })();

  function loadIndex(cb) {
    if (FONT_LIST) { cb(FONT_LIST); return; }
    fetch('fonts/fonts.json')
      .then(function (r) { return r.json(); })
      .then(function (d) { FONT_LIST = d; cb(d); })
      .catch(function () { cb(null); });
  }

  function buildPanel(fonts) {
    if (document.getElementById('fontPanel')) return;
    var panel = document.createElement('div');
    panel.id = 'fontPanel';
    var label = document.createElement('label');
    label.textContent = 'Tipografía';
    var sel = document.createElement('select');
    sel.id = 'fontSelect';
    var opt = document.createElement('option');
    opt.value = 'default';
    opt.textContent = '— Original —';
    sel.appendChild(opt);
    Object.keys(fonts || {}).sort().forEach(function (name) {
      var o = document.createElement('option');
      o.value = fonts[name]; // valor = nombre de archivo
      o.textContent = name;
      sel.appendChild(o);
    });
    sel.value = currentFont();
    var hint = document.createElement('div');
    hint.className = 'hint';
    hint.textContent = 'Google Fonts · libres para usar';
    var btn = document.createElement('button');
    btn.textContent = 'Aplicar';
    function apply() {
      try { localStorage.setItem('stg_font', sel.value); } catch (e) {}
      btn.textContent = 'Aplicando…';
      location.reload();
    }
    btn.addEventListener('click', apply);
    // Aplicación en vivo: al elegir se aplica y recarga al instante
    sel.addEventListener('change', apply);
    panel.appendChild(label);
    panel.appendChild(sel);
    panel.appendChild(btn);
    panel.appendChild(hint);
    document.body.appendChild(panel);
  }

  function init() {
    loadIndex(function (fonts) { buildPanel(fonts); });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
