'use strict';
function codeBox(b) {
  const id = 'cb' + (++codeSeq);
  CODE_REG[id] = b;
  const lines = b.code.split('\n').length;
  const isHtml = /^(html|htm|svg|xml|vue)$/.test(b.lang) || (!b.lang && /^\s*<(!doctype|html)/i.test(b.code));
  return `<div class="codebox"><div class="codebox-head"><span class="cb-lang">${escapeHtml(b.lang || 'código')}</span><span class="cb-lines">${lines} linha${lines > 1 ? 's' : ''}</span>` +
    `<button class="cb-btn" onclick="MODULE_Code.copyBlock('${id}',this)">📋 Copiar</button>` +
    `<button class="cb-btn" onclick="MODULE_Code.blockToEditor('${id}')">↗ Editor</button>` +
    (isHtml ? `<button class="cb-btn" onclick="MODULE_Code.previewBlock('${id}')">▶ Ver</button>` : '') +
    `</div><pre><code>${escapeHtml(b.code)}</code></pre></div>`;
}
function formatMessage(text) {
  text = String(text ?? '');
  const blocks = [], inl = [];
  text = text.replace(/```([^\n`]*)\n?([\s\S]*?)(?:```|$)/g, (_, info, code) => {
    blocks.push({ lang: (info.trim().split(/\s+/)[0] || '').toLowerCase(), code: code.replace(/\n$/, '') });
    return '\u0000B' + (blocks.length - 1) + '\u0000';
  });
  text = text.replace(/`([^`\n]+)`/g, (_, c) => { inl.push(c); return '\u0001I' + (inl.length - 1) + '\u0001'; });
  text = escapeHtml(text);
  text = text.replace(/^(#{1,6})\s+(.+)$/gm, (_, h, t) => `<div class="md-h md-h${h.length}">${t}</div>`);
  text = text.replace(/^\s*(?:---|\*\*\*)\s*$/gm, '<hr>');
  text = text.replace(/^(\s*)[-*•]\s+/gm, '$1• ');
  text = text.replace(/\*\*([^*\n]+)\*\*/g, '<strong>$1</strong>');
  text = text.replace(/(^|[\s(])\*([^*\n]+)\*(?=[\s).,!?:;]|$)/gm, '$1<em>$2</em>');
  text = text.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
  text = text.replace(/(^|[\s(])(https?:\/\/[^\s<)]+)/g, '$1<a href="$2" target="_blank" rel="noopener">$2</a>');
  text = text.replace(/\n?\u0000B(\d+)\u0000\n?/g, '\u0000B$1\u0000');
  text = text.replace(/(<\/div>|<hr>)\n/g, '$1');
  text = text.replace(/\n/g, '<br>');
  text = text.replace(/\u0001I(\d+)\u0001/g, (_, n) => `<code class="inline-code">${escapeHtml(inl[n])}</code>`);
  text = text.replace(/\u0000B(\d+)\u0000/g, (_, n) => codeBox(blocks[n]));
  return text;
}
