'use strict';
/* ============================================================
   CHAMADAS DE IA
   ============================================================ */
const MODULE_AI = (() => {
  const key = p => String(S().keys[p] || '').replace(/\s+/g, '');
  function baseUrl(p) {
    if (p === 'ollama') return (S().ollamaUrl || 'http://localhost:11434').replace(/\/+$/, '') + '/v1';
    if (p === 'custom') return (S().customBase || '').replace(/\/+$/, '');
    return PROVIDERS[p].base;
  }
  async function httpErr(res, label) {
    let t = '';
    try { const j = await res.json(); t = j.error?.message || j.message || j.error || JSON.stringify(j).slice(0, 300); }
    catch (e) { try { t = (await res.text()).slice(0, 300); } catch (e2) {} }
    if (typeof t !== 'string') t = JSON.stringify(t);
    return new Error(`${label} HTTP ${res.status}: ${t || res.statusText}`);
  }
  // junta mensagens seguidas do mesmo papel e garante que começa pelo usuário
  function mergeRoles(msgs) {
    const out = [];
    msgs.forEach(m => {
      const last = out[out.length - 1];
      if (last && last.role === m.role) last.content += '\n\n' + m.content;
      else out.push({ role: m.role, content: m.content });
    });
    if (out.length && out[0].role !== 'user') out.unshift({ role: 'user', content: '(continuação da conversa)' });
    return out;
  }

  /* ---------- GEMINI: tenta header x-goog-api-key, ?key= e Bearer ---------- */
  async function geminiFetch(url, init = {}) {
    const k = key('gemini');
    if (!k) throw new Error('Coloque a chave do Gemini em ⚙️ Configurações.');
    const modes = ['header', 'query', 'bearer'];
    const pref = S().geminiAuthMode;
    if (pref && modes.includes(pref)) { modes.splice(modes.indexOf(pref), 1); modes.unshift(pref); }
    let lastErr;
    for (const mode of modes) {
      const headers = { ...(init.headers || {}) };
      let u = url;
      if (mode === 'header') headers['x-goog-api-key'] = k;
      else if (mode === 'query') u += (u.includes('?') ? '&' : '?') + 'key=' + encodeURIComponent(k);
      else headers['Authorization'] = 'Bearer ' + k;
      let res;
      try { res = await fetch(u, { ...init, headers }); }
      catch (e) { if (e.name === 'AbortError') throw e; lastErr = e; continue; }
      if (res.ok) {
        if (S().geminiAuthMode !== mode) { S().geminiAuthMode = mode; MODULE_Storage.saveSoon(); }
        return res;
      }
      const err = await httpErr(res, 'Gemini');
      lastErr = err;
      const authish = res.status === 401 || res.status === 403 || /api[ _-]?key|auth|credential|permission|unauthenticated/i.test(err.message);
      if (!authish) throw err;
    }
    throw new Error((lastErr?.message || 'Falha de conexão') + ' — confira a chave do Gemini (testei os 3 formatos de autenticação).');
  }
  async function _gemini(model, system, msgs, o) {
    const body = {
      contents: mergeRoles(msgs).map(m => ({ role: m.role === 'assistant' ? 'model' : 'user', parts: [{ text: m.content }] })),
      generationConfig: { temperature: o.temperature, maxOutputTokens: o.maxTokens }
    };
    if (system) body.systemInstruction = { parts: [{ text: system }] };
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`;
    const res = await geminiFetch(url, { method: 'POST', signal: o.signal, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    const data = await res.json();
    const c = data.candidates?.[0];
    if (!c) throw new Error('Gemini não respondeu' + (data.promptFeedback?.blockReason ? ` (bloqueado: ${data.promptFeedback.blockReason})` : ''));
    const txt = (c.content?.parts || []).filter(p => p.text && !p.thought).map(p => p.text).join('');
    if (!txt) throw new Error(`Resposta vazia do Gemini (motivo: ${c.finishReason || '?'}). Se for MAX_TOKENS, aumente 📏.`);
    if (c.finishReason === 'MAX_TOKENS') MODULE_UI.toast('⚠️ Resposta cortada pelo limite 📏 — aumente o valor ou peça "continue".', 'warn');
    return txt;
  }

  /* ---------- ANTHROPIC ---------- */
  function anthHeaders() {
    const k = key('anthropic');
    if (!k) throw new Error('Coloque a chave da Anthropic em ⚙️ Configurações.');
    return { 'Content-Type': 'application/json', 'x-api-key': k, 'anthropic-version': '2023-06-01', 'anthropic-dangerous-direct-browser-access': 'true' };
  }
  async function _anthropic(model, system, msgs, o) {
    const body = { model, max_tokens: o.maxTokens, temperature: Math.min(1, o.temperature), messages: mergeRoles(msgs) };
    if (system) body.system = system;
    const res = await fetch('https://api.anthropic.com/v1/messages', { method: 'POST', signal: o.signal, headers: anthHeaders(), body: JSON.stringify(body) });
    if (!res.ok) throw await httpErr(res, 'Anthropic');
    const d = await res.json();
    if (d.stop_reason === 'max_tokens') MODULE_UI.toast('⚠️ Resposta cortada pelo limite 📏.', 'warn');
    return (d.content || []).filter(b => b.type === 'text').map(b => b.text).join('');
  }

  /* ---------- OPENAI E COMPATÍVEIS (Groq, OpenRouter, DeepSeek, Mistral, xAI, Ollama, personalizado) ---------- */
  function oaHeaders(p) {
    const h = { 'Content-Type': 'application/json' };
    const k = key(p);
    if (k) h['Authorization'] = 'Bearer ' + k;
    if (p === 'openrouter') h['X-Title'] = 'AI Code Studio';
    return h;
  }
  async function _openaiCompat(p, model, system, msgs, o) {
    const base = baseUrl(p);
    if (!base) throw new Error('Configure a URL base do provedor Personalizado em ⚙️.');
    if (!key(p) && p !== 'ollama' && p !== 'custom') throw new Error(`Coloque a chave de ${PROVIDERS[p].name} em ⚙️ Configurações.`);
    const messages = [...(system ? [{ role: 'system', content: system }] : []), ...msgs.map(m => ({ role: m.role, content: m.content }))];
    const body = { model, messages };
    if (p === 'openai') {
      body.max_completion_tokens = o.maxTokens;
      if (!/^(o\d|gpt-5)/i.test(model)) body.temperature = o.temperature; // modelos de raciocínio não aceitam temperature
    } else { body.max_tokens = o.maxTokens; body.temperature = o.temperature; }
    let res;
    try { res = await fetch(base + '/chat/completions', { method: 'POST', signal: o.signal, headers: oaHeaders(p), body: JSON.stringify(body) }); }
    catch (e) {
      if (e.name === 'AbortError') throw e;
      if (p === 'ollama') throw new Error('Não conectei no Ollama. Inicie com a variável OLLAMA_ORIGINS="*" e confira a URL em ⚙️.');
      throw new Error('Falha de rede/CORS ao chamar ' + PROVIDERS[p].name + ': ' + e.message);
    }
    if (!res.ok) throw await httpErr(res, PROVIDERS[p].name);
    const d = await res.json();
    const msg = d.choices?.[0]?.message;
    let txt = msg?.content;
    if (Array.isArray(txt)) txt = txt.map(x => x.text || '').join('');
    if (!txt) throw new Error('Resposta vazia de ' + PROVIDERS[p].name + (d.choices?.[0]?.finish_reason ? ` (${d.choices[0].finish_reason})` : ''));
    return txt;
  }

  async function call(provider, model, system, messages, o = {}) {
    if (!model) throw new Error('Escolha um modelo no topo.');
    const opts = { temperature: o.temperature ?? S().temperature, maxTokens: o.maxTokens ?? S().maxTokens, signal: o.signal };
    const type = PROVIDERS[provider].type;
    if (type === 'gemini') return _gemini(model, system, messages, opts);
    if (type === 'anthropic') return _anthropic(model, system, messages, opts);
    return _openaiCompat(provider, model, system, messages, opts);
  }

  async function listModels(p) {
    const type = PROVIDERS[p].type;
    if (type === 'gemini') {
      const res = await geminiFetch('https://generativelanguage.googleapis.com/v1beta/models?pageSize=1000', { method: 'GET' });
      const d = await res.json();
      return (d.models || []).filter(m => (m.supportedGenerationMethods || []).includes('generateContent')).map(m => m.name.replace(/^models\//, ''));
    }
    if (type === 'anthropic') {
      const res = await fetch('https://api.anthropic.com/v1/models?limit=100', { headers: anthHeaders() });
      if (!res.ok) throw await httpErr(res, 'Anthropic');
      return ((await res.json()).data || []).map(m => m.id);
    }
    if (p === 'ollama') {
      const res = await fetch((S().ollamaUrl || 'http://localhost:11434').replace(/\/+$/, '') + '/api/tags');
      if (!res.ok) throw await httpErr(res, 'Ollama');
      return ((await res.json()).models || []).map(m => m.name);
    }
    const base = baseUrl(p);
    if (!base) throw new Error('Configure a URL base em ⚙️.');
    const res = await fetch(base + '/models', { headers: oaHeaders(p) });
    if (!res.ok) throw await httpErr(res, PROVIDERS[p].name);
    const d = await res.json();
    return (d.data || d.models || []).map(m => m.id || m.name).filter(Boolean);
  }

  async function webSearch(q) {
    const k = String(S().serperKey || '').trim();
    if (!k) throw new Error('Configure a chave Serper em ⚙️ para usar 🌐 Web');
    const res = await fetch('https://google.serper.dev/search', {
      method: 'POST', headers: { 'X-API-KEY': k, 'Content-Type': 'application/json' },
      body: JSON.stringify({ q: q.slice(0, 300), gl: 'br', hl: 'pt-br', num: 6 })
    });
    if (!res.ok) throw await httpErr(res, 'Serper');
    const d = await res.json();
    return (d.organic || []).slice(0, 6).map((x, i) => `[${i + 1}] ${x.title}\n${x.snippet || ''}\n${x.link}`).join('\n\n');
  }

  return { call, listModels, webSearch };
})();
