'use strict';
/* ============================================================
   UI
   ============================================================ */
const MODULE_UI = (() => {
  let tt = null;
  function toast(msg, type = '') {
    const el = $('toast');
    el.textContent = msg; el.className = `toast show ${type}`;
    clearTimeout(tt);
    tt = setTimeout(() => { el.className = 'toast'; }, type === 'error' ? 7000 : type === 'warn' ? 5000 : 3000);
  }
  function autoResize(el) { el.style.height = 'auto'; el.style.height = Math.min(el.scrollHeight, 200) + 'px'; }
  function handleKey(e) {
    if (e.key !== 'Enter') return;
    if (e.ctrlKey || e.metaKey || (S().enterSends && !e.shiftKey && !isMobile())) { e.preventDefault(); MODULE_Chat.send(); }
  }
  function togglePass(id) { const el = $(id); el.type = el.type === 'password' ? 'text' : 'password'; }
  function toggleSidebar() { $('sidebar').classList.toggle('open'); if ($('sidebar').classList.contains('open')) closeOthersMobile('sidebar'); }
  function toggleMenu() { $('menu').classList.toggle('open'); }
  function closeOthersMobile(keep) {
    if (!isMobile()) return;
    ['sidebar', 'codePanel', 'brainPanel'].forEach(id => { if (id !== keep) $(id).classList.remove('open'); });
    $('codeBtn').classList.toggle('on', keep === 'codePanel');
    $('brainBtn').classList.toggle('on', keep === 'brainPanel');
  }
  function setTypingStatus(t) { const el = $('typingStatus'); if (el) el.textContent = t; }
  function updatePlaceholder() { $('userInput').placeholder = S().enterSends ? 'Mensagem... (Enter envia, Shift+Enter quebra linha)' : 'Mensagem... (Ctrl+Enter envia)'; }
  return { toast, autoResize, handleKey, togglePass, toggleSidebar, toggleMenu, closeOthersMobile, setTypingStatus, updatePlaceholder };
})();
