'use strict';
/* ============================================================
   CHAT
   ============================================================ */
const MODULE_Chat = (() => {
  function createNew() {
    const id = uid('conv');
    STATE.conversations[id] = { id, title: 'Nova Conversa', messages: [], summary: '', createdAt: Date.now(), updatedAt: Date.now() };
    MODULE_Storage.save();
    load(id);
    return STATE.conversations[id];
  }
  function load(id) {
    if (!STATE.conversations[id]) return;
    STATE.activeConvId = id;
    $('convTitleEdit').value = STATE.conversations[id].title;
    renderMessages(); renderConversations(); MODULE_Brain.render();
    MODULE_Storage.saveSoon();
    if (isMobile()) $('sidebar').classList.remove('open');
  }
  function confirmNewChat() {
    const conv = activeConv();
    if (!conv || !conv.messages.some(m => m.role === 'user')) { if (!conv) createNew(); else load(conv.id); $('userInput').focus(); return; }
    $('newChatModal').classList.add('open');
  }
  function closeNewChatModal() { $('newChatModal').classList.remove('open'); }
  async function newChatAction(action) {
    closeNewChatModal();
    const conv = activeConv();
    if (conv && (action === 'memory' || action === 'both')) {
      const ok = await MODULE_Brain.memorizeConversation(conv);
      if (!ok && action === 'memory') return; // não apaga se a memória falhou
    }
    if (conv && (action === 'memory' || action === 'discard')) delete STATE.conversations[conv.id];
    createNew();
  }
  function renameConv(title) {
    const conv = activeConv();
    if (!conv || !title.trim()) return;
    conv.title = title.trim(); renderConversations(); MODULE_Storage.saveSoon();
  }
  function deleteConv(id, e) {
    e.stopPropagation();
    const c = STATE.conversations[id];
    if (c.messages.length && !confirm(`Apagar a conversa "${c.title}"?`)) return;
    delete STATE.conversations[id];
    if (STATE.activeConvId === id) {
      const rest = Object.values(STATE.conversations).sort((a, b) => b.updatedAt - a.updatedAt);
      if (rest.length) load(rest[0].id); else createNew();
    }
    MODULE_Storage.save(); renderConversations();
  }
  function renderConversations() {
    const q = ($('convSearch').value || '').toLowerCase();
    const list = Object.values(STATE.conversations)
      .filter(c => !q || c.title.toLowerCase().includes(q) || c.messages.some(m => (m.content || '').toLowerCase().includes(q)))
      .sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
    $('convList').innerHTML = list.map(c => `
      <div class="conv-item ${c.id === STATE.activeConvId ? 'active' : ''}" onclick="MODULE_Chat.load('${c.id}')">
        <div style="flex:1;min-width:0"><div class="conv-title">${escapeHtml(c.title)}</div>
        <div class="conv-meta">${c.messages.length} msgs · ${new Date(c.updatedAt || c.createdAt).toLocaleDateString('pt-BR')}</div></div>
        <span class="conv-delete" onclick="MODULE_Chat.deleteConv('${c.id}',event)" title="Apagar conversa">✕</span>
      </div>`).join('') || '<p style="font-size:12px;color:var(--text2);padding:10px">Nada encontrado.</p>';
  }
  function renderMessages() {
    const conv = activeConv();
    const c = $('messages');
    CODE_REG = {};
    if (!conv || !conv.messages.length) {
      c.innerHTML = `<div class="welcome"><h2>🤖 Pronto para conversar</h2>
        Provedor: <b>${escapeHtml(PROVIDERS[MODULE_Provider.current().provider].name)}</b> · ${escapeHtml(MODULE_Provider.current().model)}<br>
        🎤 dita · 🗣️ conversa por voz · 📎 anexa código<br>
        Código vem em caixinha com <b>📋 Copiar</b>, <b>↗ Editor</b> e <b>▶ Ver</b><br>
        🧠 Cérebro guarda o que a IA não pode esquecer</div>`;
      MODULE_Context.updateBar(); return;
    }
    let html = '';
    if (conv.summary) html += `<div class="summary-box"><details><summary>📋 Resumo das mensagens antigas (é isso que a IA recebe no lugar delas)</summary><div style="margin-top:6px">${formatMessage(conv.summary)}</div></details></div>`;
    const lastAi = conv.messages.map(m => m.role).lastIndexOf('assistant');
    conv.messages.forEach((m, i) => {
      const cls = m.role === 'user' ? 'user' : m.role === 'error' ? 'error-msg' : 'ai';
      const av = m.role === 'user' ? '👤' : m.role === 'error' ? '⚠️' : '🤖';
      const time = new Date(m.ts || m.timestamp || Date.now()).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
      let actions = `<span>${time}${m.model ? ' · ' + escapeHtml(m.model) : ''}${m.archived ? ' · 📦 resumida' : ''}</span>`;
      if (m.role !== 'error') {
        actions += `<button onclick="MODULE_Chat.copyMsg(${i})" title="Copiar mensagem inteira">📋</button>`;
        actions += `<button onclick="MODULE_Chat.speakMsg(${i})" title="Ouvir">🔊</button>`;
        actions += `<button onclick="MODULE_Brain.memorizeMessage(${i})" title="Guardar no cérebro">🧠</button>`;
        if (m.role === 'user') actions += `<button onclick="MODULE_Chat.editMsg(${i})" title="Editar e reenviar">✏️</button>`;
        if (i === lastAi) actions += `<button onclick="MODULE_Chat.regenerate()" title="Gerar de novo">🔄</button>`;
      } else actions += `<button onclick="MODULE_Chat.regenerate()" title="Tentar de novo">🔄</button>`;
      actions += `<button onclick="MODULE_Chat.deleteMsg(${i})" title="Apagar">🗑️</button>`;
      html += `<div class="message ${cls} ${m.archived ? 'archived' : ''}"><div class="avatar">${av}</div>
        <div class="msg-body"><div class="bubble">${formatMessage(m.content)}</div><div class="msg-actions">${actions}</div></div></div>`;
    });
    c.innerHTML = html;
    c.scrollTop = c.scrollHeight;
    MODULE_Context.updateBar();
  }
  function showTyping() {
    const el = document.createElement('div');
    el.className = 'message ai'; el.id = 'typingEl';
    el.innerHTML = '<div class="avatar">🤖</div><div class="msg-body"><div class="bubble"><div class="typing"><span></span><span></span><span></span></div><div class="typing-status" id="typingStatus"></div></div></div>';
    $('messages').appendChild(el);
    $('messages').scrollTop = $('messages').scrollHeight;
  }
  function setLoading(on) {
    STATE.isLoading = on;
    const b = $('sendBtn');
    b.textContent = on ? '⏹ Parar' : 'Enviar ▶';
    b.classList.toggle('danger', on); b.classList.toggle('primary', !on);
    if (!on) $('typingEl')?.remove();
  }
  function sendOrStop() { if (STATE.isLoading) { STATE.abort?.abort(); } else send(); }

  async function send(textOverride) {
    if (STATE.isLoading) return;
    const input = $('userInput');
    const text = String(textOverride ?? input.value).trim();
    if (!text) return;
    let conv = activeConv() || createNew();
    conv.messages.push({ role: 'user', content: text, ts: Date.now() });
    if (conv.title === 'Nova Conversa') { conv.title = text.replace(/\s+/g, ' ').slice(0, 45); $('convTitleEdit').value = conv.title; }
    conv.updatedAt = Date.now();
    input.value = ''; MODULE_UI.autoResize(input);
    renderMessages(); renderConversations(); MODULE_Storage.save();
    await respond(conv);
  }

  async function respond(conv) {
    setLoading(true); showTyping();
    const ctrl = new AbortController(); STATE.abort = ctrl;
    const { provider, model } = MODULE_Provider.current();
    try {
      await MODULE_Context.autoCompact(conv, ctrl.signal);
      const lastUser = [...conv.messages].reverse().find(m => m.role === 'user');
      let web = '';
      if ($('webSearchCheck').checked && lastUser) {
        MODULE_UI.setTypingStatus('🌐 Pesquisando na web...');
        try { web = await MODULE_AI.webSearch(lastUser.content); } catch (e) { MODULE_UI.toast('🌐 ' + e.message, 'warn'); }
      }
      MODULE_UI.setTypingStatus(`Pensando com ${model}...`);
      const { system, history } = MODULE_Context.build(conv, lastUser?.content || '', web);
      const reply = await MODULE_AI.call(provider, model, system, history, { signal: ctrl.signal });
      conv.messages.push({ role: 'assistant', content: reply, ts: Date.now(), model: `${PROVIDERS[provider].name} · ${model}` });
      conv.updatedAt = Date.now();
      MODULE_Storage.save();
      setLoading(false); renderMessages(); renderConversations();
      if (S().autoRead || MODULE_Voice.isConvMode()) MODULE_Voice.speak(reply, () => { if (MODULE_Voice.isConvMode()) MODULE_Voice.listen(); });
    } catch (err) {
      setLoading(false);
      if (err.name === 'AbortError') MODULE_UI.toast('⏹️ Interrompido');
      else { conv.messages.push({ role: 'error', content: '❌ ' + err.message, ts: Date.now() }); MODULE_Storage.save(); renderMessages(); }
    } finally { STATE.abort = null; if (STATE.isLoading) setLoading(false); }
  }

  function regenerate() {
    const conv = activeConv(); if (!conv || STATE.isLoading) return;
    while (conv.messages.length && conv.messages[conv.messages.length - 1].role !== 'user') conv.messages.pop();
    if (!conv.messages.length) return;
    renderMessages(); respond(conv);
  }
  function copyMsg(i) { const m = activeConv()?.messages[i]; if (m) copyText(m.content); }
  function speakMsg(i) { const m = activeConv()?.messages[i]; if (m) MODULE_Voice.speak(m.content); }
  function deleteMsg(i) {
    const conv = activeConv(); if (!conv) return;
    if (!confirm('Apagar esta mensagem?')) return;
    conv.messages.splice(i, 1); MODULE_Storage.save(); renderMessages();
  }
  function editMsg(i) {
    const conv = activeConv(); const m = conv?.messages[i]; if (!m) return;
    if (i < conv.messages.length - 1 && !confirm('Editar esta mensagem? As mensagens depois dela serão removidas.')) return;
    $('userInput').value = m.content; conv.messages.splice(i);
    MODULE_Storage.save(); renderMessages(); MODULE_UI.autoResize($('userInput')); $('userInput').focus();
  }
  function handleAttach(e) {
    const files = [...e.target.files]; e.target.value = '';
    files.forEach(f => {
      if (f.size > 2e6) { MODULE_UI.toast(`${f.name} é grande demais (máx. 2 MB)`, 'warn'); return; }
      const r = new FileReader();
      r.onload = ev => {
        const lang = MODULE_Code.langFromName(f.name);
        const inp = $('userInput');
        inp.value += (inp.value ? '\n\n' : '') + `Arquivo: ${f.name}\n\`\`\`${lang === 'text' ? '' : lang}\n${ev.target.result}\n\`\`\`\n`;
        MODULE_UI.autoResize(inp);
        MODULE_UI.toast(`📎 ${f.name} anexado (~${est(ev.target.result)} tokens)`, 'success');
      };
      r.readAsText(f);
    });
  }
  function exportConvMarkdown() {
    const conv = activeConv(); if (!conv) return;
    const md = `# ${conv.title}\n\n` + conv.messages.filter(m => m.role !== 'error')
      .map(m => `## ${m.role === 'user' ? '👤 Você' : '🤖 IA'}\n\n${m.content}`).join('\n\n---\n\n');
    MODULE_Storage.download(md, conv.title.replace(/[^\w\-À-ÿ ]/g, '').slice(0, 40) + '.md', 'text/markdown;charset=utf-8');
  }
  return { createNew, load, confirmNewChat, closeNewChatModal, newChatAction, renameConv, deleteConv, renderConversations,
           renderMessages, setLoading, sendOrStop, send, regenerate, copyMsg, speakMsg, deleteMsg, editMsg, handleAttach, exportConvMarkdown };
})();
