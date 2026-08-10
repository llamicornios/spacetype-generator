/* textPersist.js — guarda y restaura el texto del textarea en localStorage.
   Se carga después del sketch (el sketch ya enganchó el textarea). */
(function () {
  'use strict';
  var KEY = 'stg_text';
  function init() {
    var ta = document.getElementById('textfield');
    if (!ta) return;
    // restaurar
    try {
      var saved = localStorage.getItem(KEY);
      if (saved) ta.value = saved;
    } catch (e) {}
    // guardar al escribir
    ta.addEventListener('input', function () {
      try { localStorage.setItem(KEY, ta.value); } catch (e) {}
    });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
