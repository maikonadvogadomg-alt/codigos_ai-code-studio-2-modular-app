'use strict';
const CONSOLE_JS = '(' + __consoleHook.toString() + ')();';

const MODULE_Code = (() => {
  let previewOn = false, liveTimer = null;
  const EXT = { javascript: 'js', python: 'py', html: 'html', css: 'css', typescript: 'ts', java: 'java', csharp: 'cs', cpp: 'cpp', php: 'php',
                sql: 'sql', rust: 'rs', go: 'go', bash: 'sh', json: 'json', markdown: 'md', text: 'txt' };
  const ALIAS = { js: 'javascript', jsx: 'javascript', mjs: 'javascript', node: 'javascript', py: 'python', htm: 'html', svg: 'html', xml: 'html', vue: 'html',
                  ts: 'typescript', tsx: 'typescript', cs: 'csharp', 'c#': 'csharp', 'c++': 'cpp', c: 'cpp', h: 'cpp', rs: 'rust',
                  sh: 'bash', shell: 'bash', zsh: 'bash', md: 'markdown', txt: 'text', plaintext: 'text' };
  const normLang = l => { l = (l || '').toLowerCase(); return EXT[l] ? l : (ALIAS[l] || 'text'); };
  const langFromName = n => normLang((String(n).split('.').pop() || '').toLowerCase());
  const tab = () => STATE.codeTabs[STATE.activeCodeTab];
  const isOpen = () => $('codePanel').classList.contains('open');

  function open() { $('codePanel').classList.add('open'); $('codeBtn').classList.add('on'); MODULE_UI.closeOthersMobile('codePanel'); }
  function togglePanel() { if (isOpen()) { sync(); $('codePanel').classList.remove('open'); $('codeBtn').classList.remove('on'); } else open(); }
  function toggleWide() { $('codePanel').classList.toggle('wide'); }
  function sync() { const t = tab(); if (t) t.content = $('codeEditor').value; }
  function guessLang(t) {
    if (/^\s*<(!doctype|html|head|body|div|section|script|style|main|template)/i.test(t)) return 'html';
    if (/^\s*(def |import \w+|from [\w.]+ import|class \w+.*:\s*$)/m.test(t) && !/[{};]\s*$/m.test(t)) return 'python';
    if (/^\s*[.#:@]?[\w-][\w\s,.#:>*()-]*\{[^}]*:[^}]*\}/m.test(t) && !/function|=>|const |let /.test(t)) return 'css';
    if (/(function|const |let |=>|document\.|console\.)/.test(t)) return 'javascript';
    return 'text';
  }
  function newTab(name, content = '', language) {
    sync();
    language = language || (content ? guessLang(content) : 'html');
    const n = STATE.codeTabs.length + 1;
    STATE.codeTabs.push({ id: uid('tab'), name: name || `modulo_${n}.${EXT[language] || 'txt'}`, content, language });
    STATE.activeCodeTab = STATE.codeTabs.length - 1;
    loadTab(); MODULE_Storage.save();
  }
  function loadTab() {
    const t = tab();
    $('codeEditor').value = t ? t.content : '';
    $('codeLang').value = t ? t.language : 'text';
    renderTabs();
    if (previewOn) refreshPreview();
  }
  function renderTabs() {
    $('codeTabs').innerHTML = STATE.codeTabs.map((t, i) => `
      <div class="code-tab ${i === STATE.activeCodeTab ? 'active' : ''}" onclick="MODULE_Code.switchTab(${i})" ondblclick="MODULE_Code.renameTab(${i})" title="Duplo clique para renomear">
        <span>${escapeHtml(t.name)}</span><span class="code-tab-close" onclick="event.stopPropagation();MODULE_Code.closeTab(${i})" title="Fechar aba">✕</span>
      </div>`).join('');
  }
  function switchTab(i) { sync(); STATE.activeCodeTab = i; loadTab(); MODULE_Storage.saveSoon(); }
  function renameTab(i) {
    const t = STATE.codeTabs[i];
    const n = prompt('Nome da aba (a extensão define a linguagem, ex: estilo.css):', t.name);
    if (!n || !n.trim()) return;
    t.name = n.trim();
    const l = langFromName(t.name);
    if (l !== 'text' || /\.txt$/i.test(t.name)) t.language = l;
    if (i === STATE.activeCodeTab) $('codeLang').value = t.language;
    renderTabs(); MODULE_Storage.save();
    if (previewOn) refreshPreview();
  }
  function closeTab(i) {
    sync();
    const t = STATE.codeTabs[i];
    if (t.content.trim() && !confirm(`Fechar "${t.name}"? O conteúdo será perdido (use ⬇️ antes se precisar).`)) return;
    STATE.codeTabs.splice(i, 1);
    if (!STATE.codeTabs.length) STATE.codeTabs.push({ id: uid('tab'), name: 'index.html', content: '', language: 'html' });
    if (STATE.activeCodeTab >= i && STATE.activeCodeTab > 0) STATE.activeCodeTab--;
    STATE.activeCodeTab = Math.min(STATE.activeCodeTab, STATE.codeTabs.length - 1);
    loadTab(); MODULE_Storage.save();
  }
  function onInput() {
    sync(); MODULE_Storage.saveSoon();
    if (previewOn && $('liveCheck').checked) { clearTimeout(liveTimer); liveTimer = setTimeout(refreshPreview, 600); }
  }
  function onLangChange() { const t = tab(); if (t) { t.language = $('codeLang').value; MODULE_Storage.saveSoon(); if (previewOn) refreshPreview(); } }
  function onKey(e) {
    if (e.key === 'Tab') { e.preventDefault(); e.target.setRangeText('  ', e.target.selectionStart, e.target.selectionEnd, 'end'); onInput(); }
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') { e.preventDefault(); download(); }
  }
  function copyClean() { sync(); const t = tab(); if (t && t.content) copyText(t.content); }
  function sendToChat() {
    sync(); const t = tab();
    if (!t || !t.content.trim()) { MODULE_UI.toast('Aba vazia'); return; }
    const inp = $('userInput');
    inp.value += (inp.value ? '\n\n' : '') + `Arquivo: ${t.name}\n\`\`\`${t.language === 'text' ? '' : t.language}\n${t.content}\n\`\`\`\n`;
    MODULE_UI.autoResize(inp);
    if (isMobile()) togglePanel();
    inp.focus();
    MODULE_UI.toast('💬 Código colocado na mensagem — escreva o pedido e envie', 'success');
  }
  function download() {
    sync(); const t = tab(); if (!t) return;
    let name = t.name;
    if (!/\.\w+$/.test(name)) name += '.' + (EXT[t.language] || 'txt');
    MODULE_Storage.download(t.content, name, 'text/plain;charset=utf-8');
  }
  function clear() { if (confirm('Limpar o conteúdo desta aba?')) { $('codeEditor').value = ''; onInput(); } }
  async function pasteToEditor() {
    open();
    try {
      const txt = await navigator.clipboard.readText();
      if (!txt) { MODULE_UI.toast('Área de transferência vazia'); return; }
      const t = tab();
      if (t && !t.content.trim()) { t.content = txt; t.language = guessLang(txt); loadTab(); MODULE_Storage.save(); }
      else newTab(null, txt);
      MODULE_UI.toast('📥 Colado no editor', 'success');
    } catch (e) { MODULE_UI.toast('Não consegui ler a área de transferência — toque no editor e cole (Ctrl+V / segurar e Colar).', 'warn'); $('codeEditor').focus(); }
  }
  function importFile() { $('fileImportCode').click(); }
  function handleFileImport(e) {
    const files = [...e.target.files]; e.target.value = '';
    files.forEach(f => {
      const r = new FileReader();
      r.onload = ev => { newTab(f.name, ev.target.result, langFromName(f.name)); open(); MODULE_UI.toast(`📂 ${f.name} importado`, 'success'); };
      r.readAsText(f);
    });
  }
  function copyBlock(id, btn) {
    const b = CODE_REG[id]; if (!b) return;
    copyText(b.code).then(() => { if (btn) { const o = btn.textContent; btn.textContent = '✅ Copiado'; setTimeout(() => btn.textContent = o, 1500); } });
  }
  function blockToEditor(id) {
    const b = CODE_REG[id]; if (!b) return;
    newTab(null, b.code, b.lang ? normLang(b.lang) : guessLang(b.code));
    open(); MODULE_UI.toast('↗ Aberto no editor', 'success');
  }
  function previewBlock(id) { blockToEditor(id); if (!previewOn) togglePreview(); else refreshPreview(); }
  function togglePreview() {
    previewOn = !previewOn;
    $('previewWrap').classList.toggle('hidden', !previewOn);
    $('previewBtn').classList.toggle('on', previewOn);
    if (previewOn) refreshPreview();
  }
  const afterTag = (h, re, ins) => { const m = h.match(re); return m ? h.slice(0, m.index + m[0].length) + ins + h.slice(m.index + m[0].length) : ins + h; };
  const beforeTag = (h, re, ins) => { const m = h.match(re); return m ? h.slice(0, m.index) + ins + h.slice(m.index) : h + ins; };
  function buildDoc() {
    sync(); const t = tab(); if (!t) return '';
    let html = '', css = '', js = '';
    if ($('combineCheck').checked) {
      const ht = t.language === 'html' ? t : STATE.codeTabs.find(x => x.language === 'html');
      html = ht ? ht.content : '';
      css = STATE.codeTabs.filter(x => x.language === 'css').map(x => `/* ===== ${x.name} ===== */\n${x.content}`).join('\n');
      js = STATE.codeTabs.filter(x => x.language === 'javascript').map(x => `// ===== ${x.name} =====\n${x.content}`).join('\n;\n');
    } else if (t.language === 'html') html = t.content;
    else if (t.language === 'css') { html = '<h1>Título</h1><p>Parágrafo de teste com <a href="#">link</a>.</p><button>Botão</button>'; css = t.content; }
    else if (t.language === 'javascript') js = t.content;
    else return `<pre style="font:13px monospace;white-space:pre-wrap;padding:12px">${escapeHtml(t.content)}</pre><p style="font:12px sans-serif;color:#888;padding:0 12px">Prévia disponível para HTML, CSS e JavaScript (ou ative 🧩 combinar abas).</p>`;
    if (!/<html[\s>]/i.test(html)) html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body>${html}</body></html>`;
    html = afterTag(html, /<head[^>]*>/i, '<script>' + CONSOLE_JS + '<\/script>');
    if (css) html = beforeTag(html, /<\/head>/i, `<link rel="stylesheet" href="css/02-estilo.css">`);
    if (js) html = beforeTag(html, /<\/body>/i, '<script>\n' + js.replace(/<\/script/gi, '<\\/script') + '\n<\/script>');
    return html;
  }
  function refreshPreview() { if (previewOn) $('previewFrame').srcdoc = buildDoc(); }
  function openWindow() {
    const u = URL.createObjectURL(new Blob([buildDoc()], { type: 'text/html' }));
    window.open(u, '_blank');
    setTimeout(() => URL.revokeObjectURL(u), 60000);
  }
  return { togglePanel, toggleWide, sync, newTab, loadTab, renderTabs, switchTab, renameTab, closeTab, onInput, onLangChange, onKey,
           copyClean, sendToChat, download, clear, pasteToEditor, importFile, handleFileImport, copyBlock, blockToEditor, previewBlock,
           togglePreview, refreshPreview, openWindow, langFromName };
})();
