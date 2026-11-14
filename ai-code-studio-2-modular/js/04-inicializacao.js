'use strict';
/* ============================================================
   INICIALIZAÇÃO
   ============================================================ */
function refreshAll() {
  MODULE_Provider.init();
  $('tempSlider').value = S().temperature; $('tempVal').textContent = S().temperature;
  $('maxTokens').value = S().maxTokens;
  $('autoReadCheck').checked = !!S().autoRead;
  MODULE_UI.updatePlaceholder();
  if (!STATE.codeTabs.length) STATE.codeTabs.push({ id: uid('tab'), name: 'index.html', content: '', language: 'html' });
  STATE.activeCodeTab = Math.max(0, Math.min(STATE.activeCodeTab || 0, STATE.codeTabs.length - 1));
  MODULE_Code.loadTab();
  const ids = Object.keys(STATE.conversations);
  if (!ids.length) MODULE_Chat.createNew();
  else MODULE_Chat.load(STATE.conversations[STATE.activeConvId] ? STATE.activeConvId
    : Object.values(STATE.conversations).sort((a, b) => b.updatedAt - a.updatedAt)[0].id);
  MODULE_Brain.render();
}
function INIT() {
  MODULE_Storage.load();
  if (!isMobile()) $('sidebar').classList.add('open');
  refreshAll();
  MODULE_Voice.init();
  window.addEventListener('beforeunload', () => { MODULE_Code.sync(); MODULE_Storage.save(); });
  document.addEventListener('visibilitychange', () => { if (document.hidden) { MODULE_Code.sync(); MODULE_Storage.save(); } });
  document.addEventListener('click', e => { if (!e.target.closest('#menu') && !e.target.closest('#menuBtn')) $('menu').classList.remove('open'); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') document.querySelectorAll('.modal-overlay.open').forEach(m => m.classList.remove('open')); });
  document.querySelectorAll('.modal-overlay').forEach(o => o.addEventListener('click', e => { if (e.target === o) o.classList.remove('open'); }));
  if (!Object.values(S().keys).some(Boolean)) MODULE_UI.toast('👋 Abra ⚙️ e coloque a chave da IA que você vai usar.', 'warn');
}
