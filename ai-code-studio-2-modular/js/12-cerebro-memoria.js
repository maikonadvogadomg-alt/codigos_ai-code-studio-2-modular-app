'use strict';
/* ============================================================
   CÉREBRO / MEMÓRIA
   ============================================================ */
const MODULE_Brain = (() => {
  let editingId = null;
  const get = id => STATE.memories.find(m => m.id === id);
  const isOpen = () => $('brainPanel').classList.contains('open');

  function toggle() {
    $('brainPanel').classList.toggle('open');
    $('brainBtn').classList.toggle('on', isOpen());
    if (isOpen()) { MODULE_UI.closeOthersMobile('brainPanel'); render(); }
  }
  function render() {
    $('memCount').textContent = STATE.memories.length;
    if (!isOpen()) return;
    const q = ($('memSearch').value || '').toLowerCase();
    const conv = activeConv();
    const list = STATE.memories
      .filter(m => !q || (m.content + ' ' + m.title + ' ' + m.tags.join(' ')).toLowerCase().includes(q))
      .sort((a, b) => (b.pinned - a.pinned) || (b.createdAt - a.createdAt));
    if (!list.length) {
      $('brainContent').innerHTML = '<p style="font-size:12px;color:var(--text2);text-align:center;padding:20px;line-height:1.7">Nenhuma memória.<br>Use <b>🧠 Memorizar conversa</b> ou <b>+ Memória</b>.<br>Guarde aqui o que a IA NÃO pode esquecer.</p>';
      return;
    }
    $('brainContent').innerHTML = list.map(m => {
      const scope = m.scope === 'global' ? '🌍 global' : (conv && m.scope === conv.id ? '💬 esta conversa' : '💬 outra conversa');
      return `<div class="memory-item ${m.pinned ? 'pinned' : ''}">
        <div>${m.pinned ? '<span class="memory-tag important">📌 fixa</span>' : ''}<span class="memory-tag">${scope}</span>${m.tags.map(t => `<span class="memory-tag context">${escapeHtml(t)}</span>`).join('')}</div>
        ${m.title ? `<div class="mem-title">${escapeHtml(m.title)}</div>` : ''}
        <div class="mem-text">${escapeHtml(m.content)}</div>
        <div class="mem-foot"><span>${new Date(m.createdAt).toLocaleString('pt-BR')}</span>
          <span class="mem-btns">
            <button class="btn sm ${m.pinned ? 'on' : ''}" onclick="MODULE_Brain.togglePin('${m.id}')" title="Fixar: sempre enviada à IA">📌</button>
            <button class="btn sm" onclick="MODULE_Brain.edit('${m.id}')" title="Editar">✏️</button>
            <button class="btn sm" onclick="copyText(MODULE_Brain.get('${m.id}').content)" title="Copiar">📋</button>
            <button class="btn sm" onclick="MODULE_Brain.deleteMemory('${m.id}')" title="Apagar" style="color:var(--red)">✕</button>
          </span></div></div>`;
    }).join('');
  }
  function add(o) {
    const m = MODULE_Storage.normMemory({ id: uid('mem'), createdAt: Date.now(), ...o });
    STATE.memories.unshift(m);
    MODULE_Storage.save(); render();
    return m;
  }
  function openModal() { $('memoryModal').classList.add('open'); setTimeout(() => $('memoryContent').focus(), 50); }
  function addManual() {
    editingId = null;
    $('memoryModalTitle').textContent = '🧠 Adicionar Memória';
    $('memoryContent').value = ''; $('memoryTags').value = ''; $('memoryPinned').checked = false; $('memoryScope').value = 'global';
    openModal();
  }
  function edit(id) {
    const m = get(id); if (!m) return;
    editingId = id;
    $('memoryModalTitle').textContent = '✏️ Editar Memória';
    $('memoryContent').value = m.content; $('memoryTags').value = m.tags.join(', ');
    $('memoryPinned').checked = m.pinned; $('memoryScope').value = m.scope === 'global' ? 'global' : 'conv';
    openModal();
  }
  function closeMemoryModal() { $('memoryModal').classList.remove('open'); }
  function saveManual() {
    const content = $('memoryContent').value.trim();
    if (!content) return;
    const tags = $('memoryTags').value.split(',').map(s => s.trim()).filter(Boolean);
    const conv = activeConv();
    const scope = $('memoryScope').value === 'conv' && conv ? conv.id : 'global';
    const pinned = $('memoryPinned').checked;
    if (editingId && get(editingId)) Object.assign(get(editingId), { content, tags, scope, pinned });
    else add({ content, tags, scope, pinned });
    MODULE_Storage.save(); closeMemoryModal(); render();
    MODULE_UI.toast('🧠 Memória salva!', 'success');
  }
  function togglePin(id) { const m = get(id); if (m) { m.pinned = !m.pinned; MODULE_Storage.save(); render(); } }
  function deleteMemory(id) { if (!confirm('Apagar esta memória?')) return; STATE.memories = STATE.memories.filter(m => m.id !== id); MODULE_Storage.save(); render(); }
  function clearAll() {
    if (!STATE.memories.length) return;
    if (!confirm(`Apagar TODAS as ${STATE.memories.length} memórias? Faça um 💾 Backup antes.`)) return;
    STATE.memories = []; MODULE_Storage.save(); render();
  }
  async function memorizeConversation(conv) {
    conv = conv || activeConv();
    const msgs = (conv?.messages || []).filter(m => m.role === 'user' || m.role === 'assistant');
    if (!msgs.length) { MODULE_UI.toast('Conversa vazia'); return false; }
    let transcript = msgs.map(m => (m.role === 'user' ? 'USUÁRIO' : 'IA') + ': ' + m.content).join('\n\n');
    if (transcript.length > 100000) transcript = transcript.slice(-100000);
    const { provider, model } = MODULE_Provider.current();
    MODULE_UI.toast('🧠 A IA está criando a memória desta conversa...');
    try {
      const content = await MODULE_AI.call(provider, model,
        'Você cria memórias de longo prazo objetivas, em português, sem inventar nada.',
        [{ role: 'user', content:
`Crie uma MEMÓRIA DE LONGO PRAZO desta conversa, em tópicos curtos, com: objetivo/projeto, decisões tomadas, tecnologias, arquivos e funções importantes, estado atual (o que funciona / o que falta), preferências do usuário e pendências. Máximo ~250 palavras.

${conv.summary ? 'RESUMO ANTERIOR:\n' + conv.summary + '\n\n' : ''}CONVERSA:
${transcript}` }],
        { temperature: 0.2, maxTokens: 2000 });
      add({ content: content.trim(), title: conv.title, tags: ['conversa'] });
      MODULE_UI.toast('🧠 Memória criada no cérebro!', 'success');
      return true;
    } catch (e) { MODULE_UI.toast('❌ Não consegui criar a memória: ' + e.message, 'error'); return false; }
  }
  function memorizeMessage(i) {
    const conv = activeConv(); const m = conv?.messages[i]; if (!m) return;
    add({ content: m.content.slice(0, 8000), title: conv.title, tags: [m.role === 'user' ? 'pedido' : 'resposta'] });
    MODULE_UI.toast('🧠 Mensagem guardada no cérebro', 'success');
  }
  function getContextBlock(conv, query) {
    const pool = STATE.memories.filter(m => m.scope === 'global' || m.scope === conv.id);
    const pinned = pool.filter(m => m.pinned);
    const words = new Set((String(query || '').toLowerCase().match(/[a-zà-ÿ0-9_]{4,}/g) || []));
    const n = Math.max(0, +S().memoryInjectCount || 0);
    const rest = pool.filter(m => !m.pinned).map(m => {
      const t = (m.content + ' ' + m.title + ' ' + m.tags.join(' ')).toLowerCase();
      let sc = 0; words.forEach(w => { if (t.includes(w)) sc++; });
      if (m.scope === conv.id) sc += 2;
      return { m, sc };
    }).sort((a, b) => b.sc - a.sc || b.m.createdAt - a.m.createdAt).slice(0, n).map(x => x.m);
    const all = [...pinned, ...rest];
    if (!all.length) return '';
    return all.map(m => `- ${m.pinned ? '[FIXA] ' : ''}${m.title ? '(' + m.title + ') ' : ''}${m.content}`).join('\n');
  }
  function mergeMemories(list) {
    const ids = new Set(STATE.memories.map(m => m.id));
    list.forEach(m => { if (m && m.content && !ids.has(m.id)) STATE.memories.push(MODULE_Storage.normMemory(m)); });
  }
  function exportMemory() {
    MODULE_Storage.download(JSON.stringify({ app: 'ai-code-studio-memory', memories: STATE.memories }, null, 2), `cerebro-${MODULE_Storage.stamp()}.json`, 'application/json');
  }
  function importMemory() { $('fileImportMemory').click(); }
  function handleImport(e) {
    const f = e.target.files[0]; e.target.value = ''; if (!f) return;
    const r = new FileReader();
    r.onload = ev => {
      try {
        const d = JSON.parse(ev.target.result);
        const list = Array.isArray(d) ? d : (d.memories || []);
        const before = STATE.memories.length;
        mergeMemories(list); MODULE_Storage.save(); render();
        MODULE_UI.toast(`🧠 ${STATE.memories.length - before} memória(s) restaurada(s)`, 'success');
      } catch (err) { MODULE_UI.toast('❌ Arquivo inválido', 'error'); }
    };
    r.readAsText(f);
  }
  return { toggle, render, get, add, addManual, edit, closeMemoryModal, saveManual, togglePin, deleteMemory, clearAll,
           memorizeConversation, memorizeMessage, getContextBlock, mergeMemories, exportMemory, importMemory, handleImport };
})();
