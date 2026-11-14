'use strict';
/* ============================================================
   ARMAZENAMENTO
   ============================================================ */
const MODULE_Storage = (() => {
  const KEY = 'aiStudio_v2';
  let timer = null;
  function save() {
    try {
      localStorage.setItem(KEY, JSON.stringify({
        conversations: STATE.conversations, activeConvId: STATE.activeConvId,
        codeTabs: STATE.codeTabs, activeCodeTab: STATE.activeCodeTab,
        memories: STATE.memories, settings: STATE.settings, _version: STATE._version
      }));
    } catch (e) { MODULE_UI.toast('⚠️ Armazenamento do navegador cheio — exporte um backup e apague conversas antigas.', 'warn'); }
  }
  function saveSoon() { clearTimeout(timer); timer = setTimeout(save, 400); }
  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return;
      const d = JSON.parse(raw);
      STATE.conversations = d.conversations || {};
      Object.values(STATE.conversations).forEach(c => { c.messages = c.messages || []; c.updatedAt = c.updatedAt || c.createdAt || Date.now(); });
      STATE.activeConvId = d.activeConvId || null;
      STATE.codeTabs = (d.codeTabs || []).map(t => ({ language: 'text', content: '', ...t }));
      STATE.activeCodeTab = d.activeCodeTab || 0;
      STATE.memories = (d.memories || []).map(normMemory);
      const o = d.settings || {};
      STATE.settings = { ...STATE.settings, ...o, keys: { ...(o.keys || {}) } };
      // migração da versão antiga
      if (o.apiKey && !S().keys.openai) S().keys.openai = o.apiKey;
      if (o.geminiKey && !S().keys.gemini) S().keys.gemini = o.geminiKey;
      if (o.anthropicKey && !S().keys.anthropic) S().keys.anthropic = o.anthropicKey;
      ['apiKey', 'geminiKey', 'anthropicKey', 'contextStrategy', 'autoSaveInterval', 'autoMemory'].forEach(k => delete S()[k]);
      if (!S().systemPrompt || S().systemPrompt.startsWith('Você é um assistente especialista em programação. Ao gerar')) S().systemPrompt = DEFAULT_SYS;
      if (!PROVIDERS[S().provider]) S().provider = 'gemini';
    } catch (e) { console.error(e); }
  }
  function normMemory(m) {
    return { id: m.id || uid('mem'), content: m.content || '', title: m.title || '', tags: m.tags || (m.type ? [m.type] : []),
             pinned: !!m.pinned, scope: m.scope || 'global', createdAt: m.createdAt || Date.now() };
  }
  const stamp = () => new Date().toISOString().slice(0, 16).replace(/[:T]/g, '-');
  function download(content, filename, type) {
    const blob = new Blob([content], { type });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = filename;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 5000);
  }
  function exportAll() {
    MODULE_Code.sync();
    const withKeys = confirm('Incluir as chaves de API no backup?\n\nOK = incluir\nCancelar = sem chaves (mais seguro)');
    const settings = JSON.parse(JSON.stringify(S()));
    if (!withKeys) { settings.keys = {}; settings.serperKey = ''; }
    download(JSON.stringify({ app: 'ai-code-studio', _version: STATE._version, exportedAt: new Date().toISOString(),
      conversations: STATE.conversations, codeTabs: STATE.codeTabs, memories: STATE.memories, settings }, null, 2),
      `ai-studio-backup-${stamp()}.json`, 'application/json');
  }
  function importBackup() { $('fileImportBackup').click(); }
  function handleImport(e) {
    const file = e.target.files[0]; e.target.value = '';
    if (!file) return;
    const r = new FileReader();
    r.onload = ev => {
      try {
        const d = JSON.parse(ev.target.result);
        if (d.conversations) Object.assign(STATE.conversations, d.conversations);
        if (Array.isArray(d.memories)) MODULE_Brain.mergeMemories(d.memories);
        if (Array.isArray(d.codeTabs) && d.codeTabs.length && confirm(`Importar também ${d.codeTabs.length} aba(s) de código?`))
          STATE.codeTabs.push(...d.codeTabs.map(t => ({ ...t, id: uid('tab') })));
        if (d.settings && confirm('Importar também as configurações?')) {
          const keys = { ...S().keys };
          Object.entries(d.settings.keys || {}).forEach(([k, v]) => { if (v) keys[k] = v; });
          STATE.settings = { ...S(), ...d.settings, keys };
        }
        save(); refreshAll();
        MODULE_UI.toast('✅ Backup importado!', 'success');
      } catch (err) { MODULE_UI.toast('❌ Arquivo de backup inválido', 'error'); }
    };
    r.readAsText(file);
  }
  return { save, saveSoon, load, exportAll, importBackup, handleImport, download, stamp, normMemory };
})();
