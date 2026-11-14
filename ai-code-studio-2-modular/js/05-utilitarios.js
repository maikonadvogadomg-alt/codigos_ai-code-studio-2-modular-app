'use strict';
/* ============================================================
   UTILITÁRIOS
   ============================================================ */
const $ = id => document.getElementById(id);
const est = t => Math.ceil(String(t || '').length / 4);
const uid = p => p + '_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
const isMobile = () => window.innerWidth <= 820;

const DEFAULT_SYS = `Você é um assistente especialista em programação e tecnologia. Responda em português do Brasil.
Regras:
1. Todo código vai em bloco com a linguagem indicada (\`\`\`html, \`\`\`js, \`\`\`css, \`\`\`python...).
2. Em código grande, entregue o ARQUIVO COMPLETO ou diga exatamente qual trecho substituir e onde.
3. Prefira código modular (HTML, CSS e JS separados por responsabilidade), limpo, sem caracteres estranhos, comentado em português.
4. Use a MEMÓRIA DE LONGO PRAZO e o RESUMO DA CONVERSA fornecidos para não esquecer decisões anteriores.`;
