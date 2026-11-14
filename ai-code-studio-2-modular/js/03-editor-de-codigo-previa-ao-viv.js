'use strict';
/* ============================================================
   EDITOR DE CÓDIGO + PRÉVIA AO VIVO
   ============================================================ */
function __consoleHook() {
  var q = [];
  function box() {
    var b = document.getElementById('__cons');
    if (!b) { b = document.createElement('div'); b.id = '__cons';
      b.style.cssText = 'position:fixed;left:0;right:0;bottom:0;max-height:35%;overflow:auto;background:rgba(10,10,10,.93);color:#7ee787;font:11px/1.4 monospace;padding:4px 8px;z-index:2147483647;border-top:1px solid #333';
      document.body.appendChild(b); }
    return b;
  }
  function w(t, c) { if (!document.body) { q.push([t, c]); return; } var l = document.createElement('div'); l.style.color = c; l.textContent = t; box().appendChild(l); }
  document.addEventListener('DOMContentLoaded', function () { q.forEach(function (x) { w(x[0], x[1]); }); q = []; });
  ['log', 'info', 'warn', 'error'].forEach(function (k) {
    var o = console[k];
    console[k] = function () {
      var a = [].slice.call(arguments);
      w('› ' + a.map(function (x) { try { return typeof x === 'object' ? JSON.stringify(x) : String(x); } catch (e) { return String(x); } }).join(' '),
        k === 'error' ? '#ff7b72' : k === 'warn' ? '#e3b341' : '#7ee787');
      o.apply(console, a);
    };
  });
  window.addEventListener('error', function (e) { w('✖ ' + e.message + (e.lineno ? ' (linha ' + e.lineno + ')' : ''), '#ff7b72'); });
}
