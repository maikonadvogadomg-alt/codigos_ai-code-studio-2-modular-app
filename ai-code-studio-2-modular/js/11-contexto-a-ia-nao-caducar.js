'use strict';
/* ============================================================
   CONTEXTO (a IA não "caducar")
   ============================================================ */
const MODULE_Context = (() => {
  const sendable = conv => conv.messages.filter(m => (m.role === 'user' || m.role === 'assistant') && !m.archived);

  function build(conv, query, webBlock) {
    let system = S().systemPrompt || '';
    const mem = MODULE_Brain.getContextBlock(conv, query);
    if (mem) system += '\n\n### MEMÓRIA DE LONGO PRAZO (considere sempre)\n' + mem;
    if (conv.summary) system += '\n\n### RESUMO DA CONVERSA ATÉ AQUI (mensagens antigas)\n' + conv.summary;
    let hist = sendable(conv).map(m => ({ role: m.role, content: m.content }));
    if (webBlock && hist.length) {
      const last = hist[hist.length - 1];
      hist[hist.length - 1] = { ...last, content: last.content + '\n\n[Resultados de pesquisa na web — cite as fontes]\n' + webBlock };
    }
    const budget = Math.max(1000, (+S().contextLimit || 32000) - est(system));
    let dropped = 0;
    while (hist.length > 1 && est(hist.map(m => m.content).join('')) > budget) { hist.shift(); dropped++; }
    while (hist.length > 1 && hist[0].role !== 'user') { hist.shift(); dropped++; }
    if (dropped) MODULE_UI.toast(`⚠️ ${dropped} mensagem(ns) antiga(s) ficaram fora do limite. Use 📋 para resumir ou aumente o limite em ⚙️.`, 'warn');
    return { system, history: hist };
  }

  function updateBar() {
    const conv = activeConv();
    const tokens = conv ? est(sendable(conv).map(m => m.content).join('') + (conv.summary || '')) : 0;
    const lim = +S().contextLimit || 32000;
    const pct = Math.min(100, tokens / lim * 100);
    $('tokenCount').textContent = tokens >= 1000 ? (tokens / 1000).toFixed(1) + 'k' : tokens;
    $('contextFill').style.width = pct + '%';
    $('contextFill').style.background = pct > 85 ? 'var(--red)' : pct > 60 ? 'var(--yellow)' : 'var(--green)';
  }

  async function compact(conv, signal) {
    const keep = Math.max(2, +S().keepRecent || 10);
    const active = sendable(conv);
    if (active.length <= keep) return false;
    const old = active.slice(0, active.length - keep);
    let transcript = old.map(m => (m.role === 'user' ? 'USUÁRIO' : 'IA') + ': ' + m.content).join('\n\n');
    if (transcript.length > 120000) transcript = transcript.slice(-120000);
    const { provider, model } = MODULE_Provider.current();
    MODULE_UI.setTypingStatus('📋 Resumindo mensagens antigas para não perder o fio...');
    const summary = await MODULE_AI.call(provider, model,
      'Você resume conversas técnicas com precisão, em português, sem inventar nada.',
      [{ role: 'user', content:
`Atualize o RESUMO incorporando as NOVAS MENSAGENS. Preserve com precisão: objetivo do projeto, decisões tomadas, nomes de arquivos/funções/variáveis, tecnologias, estado atual do código (o que funciona e o que falta), erros já resolvidos, preferências do usuário e pendências. Use tópicos curtos. Não inclua código longo, só o essencial.

RESUMO ANTERIOR:
${conv.summary || '(nenhum)'}

NOVAS MENSAGENS:
${transcript}` }],
      { temperature: 0.2, maxTokens: 3000, signal });
    conv.summary = summary.trim();
    old.forEach(m => { m.archived = true; });
    MODULE_Storage.save();
    return true;
  }

  async function autoCompact(conv, signal) {
    if (!S().autoSummarize) return;
    const tokens = est(sendable(conv).map(m => m.content).join(''));
    if (tokens < (+S().contextLimit || 32000) * 0.75) return;
    await compact(conv, signal);
  }

  async function compactNow() {
    const conv = activeConv();
    if (!conv || STATE.isLoading) return;
    MODULE_Chat.setLoading(true);
    try {
      const ok = await compact(conv);
      MODULE_UI.toast(ok ? '📋 Mensagens antigas resumidas — a IA continua sabendo de tudo.' : `Poucas mensagens ainda (mantenho as últimas ${S().keepRecent} inteiras).`, ok ? 'success' : '');
    } catch (e) { MODULE_UI.toast('❌ ' + e.message, 'error'); }
    MODULE_Chat.setLoading(false);
    MODULE_Chat.renderMessages();
  }

  function clear() {
    const conv = activeConv();
    if (!conv || !conv.messages.length) return;
    if (!confirm('Apagar todas as mensagens desta conversa? (Dica: 🧠 antes, para guardar no cérebro)')) return;
    conv.messages = []; conv.summary = '';
    MODULE_Storage.save(); MODULE_Chat.renderMessages();
  }
  return { build, updateBar, autoCompact, compactNow, clear };
})();
