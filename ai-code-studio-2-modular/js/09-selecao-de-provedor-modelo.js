'use strict';
/* ============================================================
   SELEÇÃO DE PROVEDOR / MODELO
   ============================================================ */
const MODULE_Provider = (() => {
  function models(p) {
    const cache = S().modelCache?.[p];
    const base = cache && cache.length ? cache : PROVIDERS[p].models;
    return [...new Set([...(S().customModels?.[p] || []), ...base])];
  }
  function fillProviders() {
    $('aiProvider').innerHTML = Object.entries(PROVIDERS).map(([k, p]) => `<option value="${k}">${p.name}</option>`).join('');
    $('aiProvider').value = S().provider;
  }
  function fillModels() {
    const p = $('aiProvider').value;
    const list = models(p);
    const cur = S().lastModel?.[p] || (p === S().provider ? S().model : '') || list[0] || '';
    if (cur && !list.includes(cur)) list.unshift(cur);
    $('modelSelect').innerHTML = list.map(m => `<option value="${escapeHtml(m)}">${escapeHtml(m)}</option>`).join('') +
      '<option value="__custom">✏️ Digitar outro modelo…</option>';
    if (cur) $('modelSelect').value = cur;
    S().model = $('modelSelect').value === '__custom' ? '' : $('modelSelect').value;
  }
  function onProviderChange() { S().provider = $('aiProvider').value; fillModels(); MODULE_Storage.saveSoon(); }
  function onModelChange() {
    const p = $('aiProvider').value;
    let m = $('modelSelect').value;
    if (m === '__custom') {
      m = (prompt('Nome exato do modelo (como aparece na documentação do provedor):') || '').trim();
      if (!m) { fillModels(); return; }
      S().customModels = { ...(S().customModels || {}), [p]: [m, ...((S().customModels || {})[p] || [])] };
    }
    S().model = m; S().lastModel = { ...(S().lastModel || {}), [p]: m };
    fillModels(); MODULE_Storage.saveSoon();
  }
  function current() { return { provider: $('aiProvider').value, model: $('modelSelect').value === '__custom' ? '' : $('modelSelect').value }; }
  async function refreshModels() {
    const p = current().provider;
    MODULE_UI.toast(`🔄 Buscando modelos de ${PROVIDERS[p].name}...`);
    try {
      const list = await MODULE_AI.listModels(p);
      if (!list.length) throw new Error('a API não retornou modelos');
      S().modelCache = { ...(S().modelCache || {}), [p]: [...new Set(list)].sort() };
      fillModels(); MODULE_Storage.save();
      MODULE_UI.toast(`✅ ${list.length} modelos carregados — escolha na lista`, 'success');
    } catch (e) { MODULE_UI.toast('❌ ' + e.message, 'error'); }
  }
  function init() { fillProviders(); fillModels(); }
  return { init, fillModels, onProviderChange, onModelChange, current, refreshModels };
})();
