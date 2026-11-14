'use strict';
/* ============================================================
   CONFIGURAÇÕES
   ============================================================ */
const MODULE_Settings = (() => {
  function open() {
    const s = S();
    $('keysContainer').innerHTML = Object.entries(PROVIDERS).filter(([k]) => k !== 'ollama').map(([k, p]) => `
      <div class="form-group"><label>${p.name}</label>
        <div class="api-row"><input type="password" id="key_${k}" placeholder="${escapeHtml(p.hint || 'chave')}" value="${escapeHtml(s.keys[k] || '')}" autocomplete="off">
        <button class="btn" type="button" onclick="MODULE_UI.togglePass('key_${k}')">👁️</button></div></div>`).join('');
    $('serperKeyInput').value = s.serperKey || '';
    $('ollamaUrl').value = s.ollamaUrl || '';
    $('customBase').value = s.customBase || '';
    $('contextLimit').value = s.contextLimit; $('ctxVal').textContent = s.contextLimit;
    $('memoryInjectCount').value = s.memoryInjectCount;
    $('keepRecent').value = s.keepRecent;
    $('autoSummarize').checked = !!s.autoSummarize;
    $('enterSends').checked = !!s.enterSends;
    $('systemPrompt').value = s.systemPrompt;
    $('voiceRate').value = s.voiceRate; $('rateVal').textContent = s.voiceRate;
    $('voicePitch').value = s.voicePitch; $('pitchVal').textContent = s.voicePitch;
    $('voiceAutoSend').checked = !!s.voiceAutoSend;
    MODULE_Voice.fillVoices();
    $('settingsModal').classList.add('open');
  }
  function close() { $('settingsModal').classList.remove('open'); }
  function collect() {
    const s = S();
    Object.keys(PROVIDERS).forEach(k => { const el = $('key_' + k); if (el) s.keys[k] = el.value.replace(/\s+/g, ''); });
    s.serperKey = $('serperKeyInput').value.trim();
    s.ollamaUrl = $('ollamaUrl').value.trim() || 'http://localhost:11434';
    s.customBase = $('customBase').value.trim();
    s.contextLimit = +$('contextLimit').value || 32000;
    s.memoryInjectCount = Math.max(0, +$('memoryInjectCount').value || 0);
    s.keepRecent = Math.max(2, +$('keepRecent').value || 10);
    s.autoSummarize = $('autoSummarize').checked;
    s.enterSends = $('enterSends').checked;
    s.systemPrompt = $('systemPrompt').value;
    s.voiceName = $('voiceSelect').value;
    s.voiceRate = +$('voiceRate').value || 1; s.voicePitch = +$('voicePitch').value || 1;
    s.voiceAutoSend = $('voiceAutoSend').checked;
    MODULE_Storage.save();
    MODULE_UI.updatePlaceholder();
    MODULE_Context.updateBar();
  }
  function save() { collect(); close(); MODULE_UI.toast('✅ Configurações salvas!', 'success'); }
  async function test() {
    if ($('settingsModal').classList.contains('open')) collect();
    const { provider, model } = MODULE_Provider.current();
    MODULE_UI.toast(`🧪 Testando ${PROVIDERS[provider].name} · ${model}...`);
    try {
      const r = await MODULE_AI.call(provider, model, '', [{ role: 'user', content: 'Responda apenas com a palavra OK.' }], { temperature: 0, maxTokens: 1024 });
      MODULE_UI.toast(`✅ ${PROVIDERS[provider].name} funcionando! Resposta: "${r.trim().slice(0, 40)}"`, 'success');
    } catch (e) { MODULE_UI.toast('❌ ' + e.message, 'error'); }
  }
  function quick(k, v) { S()[k] = v; MODULE_Storage.saveSoon(); }
  return { open, close, save, test, quick };
})();
