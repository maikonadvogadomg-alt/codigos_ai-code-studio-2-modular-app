# 🧬 Receita para recriar: AI Code Studio

_Gerada sem IA, lendo 65 arquivo(s). Serve para remontar este app como HTML modular — com qualquer IA, um arquivo por vez._

## 1. O que é

- **Nome:** AI Code Studio
- **Partes de código:** 23 (2 tela, 19 logica, 0 servidor, 0 dados, 2 estilo)
- **Tem servidor (rotas /api):** não — dá para ser só HTML
- **Peças de fora (bibliotecas):** nenhuma

## 2. Estrutura modular proposta

```
index.html            ← a página; chama os módulos NA ORDEM
css/app.css           ← o visual
js/00-core.js         ← a "locomotiva": cria window.APP (registrar, guardar, avisar)
js/10-utilitarios.js  ← logica (era ai-code-studio-2-modular/js/01-utilitarios.js)
js/15-renderizacao-de-mensagens-mark.js← logica (era ai-code-studio-2-modular/js/02-renderizacao-de-mensagens-mark.js)
js/20-editor-de-codigo-previa-ao-viv.js← logica (era ai-code-studio-2-modular/js/03-editor-de-codigo-previa-ao-viv.js)
js/25-utilitarios.js  ← logica (era ai-code-studio-2-modular/js/05-utilitarios.js)
js/30-provedores-de-ia.js← logica (era ai-code-studio-2-modular/js/06-provedores-de-ia.js)
js/35-estado.js       ← logica (era ai-code-studio-2-modular/js/07-estado.js)
js/40-armazenamento.js← logica (era ai-code-studio-2-modular/js/08-armazenamento.js)
js/45-selecao-de-provedor-modelo.js← logica (era ai-code-studio-2-modular/js/09-selecao-de-provedor-modelo.js)
js/50-chamadas-de-ia.js← logica (era ai-code-studio-2-modular/js/10-chamadas-de-ia.js)
js/55-contexto-a-ia-nao-caducar.js← logica (era ai-code-studio-2-modular/js/11-contexto-a-ia-nao-caducar.js)
js/60-cerebro-memoria.js← logica (era ai-code-studio-2-modular/js/12-cerebro-memoria.js)
js/65-renderizacao-de-mensagens-mark.js← logica (era ai-code-studio-2-modular/js/13-renderizacao-de-mensagens-mark.js)
js/70-chat.js         ← logica (era ai-code-studio-2-modular/js/14-chat.js)
js/75-editor-de-codigo-previa-ao-viv.js← logica (era ai-code-studio-2-modular/js/15-editor-de-codigo-previa-ao-viv.js)
js/80-voz-tts-neural-ditado-modo-con.js← logica (era ai-code-studio-2-modular/js/16-voz-tts-neural-ditado-modo-con.js)
js/85-configuracoes.js← logica (era ai-code-studio-2-modular/js/17-configuracoes.js)
js/90-ui.js           ← logica (era ai-code-studio-2-modular/js/18-ui.js)
js/91-ai-code-studio-2-modular.js← AI Code Studio — 🤖 AI Code Studio (era ai-code-studio-2-modular/index.html)
js/92-inicio.js       ← codigos_ai-code-studio-2-modular — codigos_ai-code-studio-2-modular (era index.html)
js/99-app.js          ← o último: monta a tela com o que embarcou
```

## 3. As partes, uma por uma

| # | Era | Vira | Tipo | O que faz | Usa |
|---|---|---|---|---|---|
| 1 | `ai-code-studio-2-modular/js/01-utilitarios.js` | `js/10-utilitarios.js` | logica | escapeHtml, copyText | — |
| 2 | `ai-code-studio-2-modular/js/02-renderizacao-de-mensagens-mark.js` | `js/15-renderizacao-de-mensagens-mark.js` | logica | codeBox, formatMessage | — |
| 3 | `ai-code-studio-2-modular/js/03-editor-de-codigo-previa-ao-viv.js` | `js/20-editor-de-codigo-previa-ao-viv.js` | logica | __consoleHook, box | — |
| 4 | `ai-code-studio-2-modular/js/04-inicializacao.js` | css/app.css | logica | refreshAll, INIT | — |
| 5 | `ai-code-studio-2-modular/js/05-utilitarios.js` | `js/25-utilitarios.js` | logica | est, uid, isMobile | — |
| 6 | `ai-code-studio-2-modular/js/06-provedores-de-ia.js` | `js/30-provedores-de-ia.js` | logica | — | — |
| 7 | `ai-code-studio-2-modular/js/07-estado.js` | `js/35-estado.js` | logica | activeConv | — |
| 8 | `ai-code-studio-2-modular/js/08-armazenamento.js` | `js/40-armazenamento.js` | logica | MODULE_Storage, save, saveSoon, load | — |
| 9 | `ai-code-studio-2-modular/js/09-selecao-de-provedor-modelo.js` | `js/45-selecao-de-provedor-modelo.js` | logica | MODULE_Provider, models, fillProviders, fillModels | — |
| 10 | `ai-code-studio-2-modular/js/10-chamadas-de-ia.js` | `js/50-chamadas-de-ia.js` | logica | MODULE_AI, key, baseUrl, httpErr | — |
| 11 | `ai-code-studio-2-modular/js/11-contexto-a-ia-nao-caducar.js` | `js/55-contexto-a-ia-nao-caducar.js` | logica | MODULE_Context, sendable, build, updateBar | — |
| 12 | `ai-code-studio-2-modular/js/12-cerebro-memoria.js` | `js/60-cerebro-memoria.js` | logica | MODULE_Brain, get, isOpen, toggle | — |
| 13 | `ai-code-studio-2-modular/js/13-renderizacao-de-mensagens-mark.js` | `js/65-renderizacao-de-mensagens-mark.js` | logica | — | — |
| 14 | `ai-code-studio-2-modular/js/14-chat.js` | `js/70-chat.js` | logica | MODULE_Chat, createNew, load, confirmNewChat | — |
| 15 | `ai-code-studio-2-modular/js/15-editor-de-codigo-previa-ao-viv.js` | `js/75-editor-de-codigo-previa-ao-viv.js` | logica | MODULE_Code, normLang, langFromName, tab | 02-estilo.css |
| 16 | `ai-code-studio-2-modular/js/16-voz-tts-neural-ditado-modo-con.js` | `js/80-voz-tts-neural-ditado-modo-con.js` | logica | MODULE_Voice, voices, pick, clean | — |
| 17 | `ai-code-studio-2-modular/js/17-configuracoes.js` | `js/85-configuracoes.js` | logica | MODULE_Settings, open, close, collect | — |
| 18 | `ai-code-studio-2-modular/js/18-ui.js` | `js/90-ui.js` | logica | MODULE_UI, toast, autoResize, handleKey | — |
| 19 | `ai-code-studio-2-modular/js/19-inicializacao.js` | css/app.css | logica | — | — |
| 20 | `ai-code-studio-2-modular/css/01-estilo.css` | css/app.css | estilo | BASE / VARIÁVEIS | — |
| 21 | `ai-code-studio-2-modular/index.html` | `js/91-ai-code-studio-2-modular.js` | tela | AI Code Studio — 🤖 AI Code Studio | 01-estilo.css, manifest.json, favicon.ico, icon.svg |
| 22 | `index.html` | `js/92-inicio.js` | tela | codigos_ai-code-studio-2-modular — codigos_ai-code-studio-2-modular | manifest.json, favicon.ico, icon.svg, apple-touch-icon.png |
| 23 | `ai-code-studio-2-modular/css/02-estilo.css` | css/app.css | estilo | — | — |

## 4. Montar passo a passo (cada bloco é um pedido pronto: 📋 Copiar → colar na IA)

### Passo 0 — combinar as regras com a IA

```text
Vamos recriar o app "AI Code Studio" como HTML MODULAR, que abre pelo index.html, sem servidor e sem nada da Replit.
Regras: (1) index.html chama os arquivos js/ na ordem, antes do </body>; (2) js/00-core.js cria window.APP com APP.registrar(modulo), APP.guardar(chave, valor) em IndexedDB/localStorage e APP.avisar(texto); (3) cada arquivo js/NN-nome.js cuida de UM assunto, começa com (function (APP) { e termina com })(window.APP); (4) js/99-app.js vem por último e monta a tela com os módulos registrados; (5) textos em português do Brasil.
Vou pedir UM arquivo por vez. Responda só com o arquivo completo, sem cortar nada. Primeiro: crie index.html, css/app.css e js/00-core.js.
```

### Passo 1 — `js/10-utilitarios.js` (era `ai-code-studio-2-modular/js/01-utilitarios.js`, 14 linhas)

```text
Crie js/10-utilitarios.js. Ele é uma parte de logica do app.
No app original ele tinha estas funções/partes: escapeHtml, copyText.
Registre com APP.registrar({ nome, icone, abrir }). Devolva só o arquivo completo.
```

### Passo 2 — `js/15-renderizacao-de-mensagens-mark.js` (era `ai-code-studio-2-modular/js/02-renderizacao-de-mensagens-mark.js`, 36 linhas)

```text
Crie js/15-renderizacao-de-mensagens-mark.js. Ele é uma parte de logica do app.
No app original ele tinha estas funções/partes: codeBox, formatMessage.
Registre com APP.registrar({ nome, icone, abrir }). Devolva só o arquivo completo.
```

### Passo 3 — `js/20-editor-de-codigo-previa-ao-viv.js` (era `ai-code-studio-2-modular/js/03-editor-de-codigo-previa-ao-viv.js`, 27 linhas)

```text
Crie js/20-editor-de-codigo-previa-ao-viv.js. Ele é uma parte de logica do app.
No app original ele tinha estas funções/partes: __consoleHook, box.
Registre com APP.registrar({ nome, icone, abrir }). Devolva só o arquivo completo.
```

### Passo 4 — `js/25-utilitarios.js` (era `ai-code-studio-2-modular/js/05-utilitarios.js`, 16 linhas)

```text
Crie js/25-utilitarios.js. Ele é uma parte de logica do app.
No app original ele tinha estas funções/partes: est, uid, isMobile.
Registre com APP.registrar({ nome, icone, abrir }). Devolva só o arquivo completo.
```

### Passo 5 — `js/30-provedores-de-ia.js` (era `ai-code-studio-2-modular/js/06-provedores-de-ia.js`, 17 linhas)

```text
Crie js/30-provedores-de-ia.js. Ele é uma parte de logica do app.
Registre com APP.registrar({ nome, icone, abrir }). Devolva só o arquivo completo.
```

### Passo 6 — `js/35-estado.js` (era `ai-code-studio-2-modular/js/07-estado.js`, 22 linhas)

```text
Crie js/35-estado.js. Ele é uma parte de logica do app.
No app original ele tinha estas funções/partes: activeConv.
Registre com APP.registrar({ nome, icone, abrir }). Devolva só o arquivo completo.
```

### Passo 7 — `js/40-armazenamento.js` (era `ai-code-studio-2-modular/js/08-armazenamento.js`, 86 linhas)

```text
Crie js/40-armazenamento.js. Ele é uma parte de logica do app.
No app original ele tinha estas funções/partes: MODULE_Storage, save, saveSoon, load, normMemory, stamp, download, exportAll, importBackup, handleImport.
Registre com APP.registrar({ nome, icone, abrir }). Devolva só o arquivo completo.
```

### Passo 8 — `js/45-selecao-de-provedor-modelo.js` (era `ai-code-studio-2-modular/js/09-selecao-de-provedor-modelo.js`, 52 linhas)

```text
Crie js/45-selecao-de-provedor-modelo.js. Ele é uma parte de logica do app.
No app original ele tinha estas funções/partes: MODULE_Provider, models, fillProviders, fillModels, onProviderChange, onModelChange, current, refreshModels, init.
Registre com APP.registrar({ nome, icone, abrir }). Devolva só o arquivo completo.
```

### Passo 9 — `js/50-chamadas-de-ia.js` (era `ai-code-studio-2-modular/js/10-chamadas-de-ia.js`, 174 linhas)

```text
Crie js/50-chamadas-de-ia.js. Ele é uma parte de logica do app.
No app original ele tinha estas funções/partes: MODULE_AI, key, baseUrl, httpErr, mergeRoles, geminiFetch, _gemini, anthHeaders, _anthropic, oaHeaders, _openaiCompat, call, listModels, webSearch.
Ele chamava estes endereços: https://api.anthropic.com/v1/messages, https://api.anthropic.com/v1/models?limit=100, https://google.serper.dev/search. Em HTML, ligue cada um à função equivalente do módulo certo.
Registre com APP.registrar({ nome, icone, abrir }). Devolva só o arquivo completo.
```

### Passo 10 — `js/55-contexto-a-ia-nao-caducar.js` (era `ai-code-studio-2-modular/js/11-contexto-a-ia-nao-caducar.js`, 90 linhas)

```text
Crie js/55-contexto-a-ia-nao-caducar.js. Ele é uma parte de logica do app.
No app original ele tinha estas funções/partes: MODULE_Context, sendable, build, updateBar, compact, autoCompact, compactNow, clear.
Registre com APP.registrar({ nome, icone, abrir }). Devolva só o arquivo completo.
```

### Passo 11 — `js/60-cerebro-memoria.js` (era `ai-code-studio-2-modular/js/12-cerebro-memoria.js`, 150 linhas)

```text
Crie js/60-cerebro-memoria.js. Ele é uma parte de logica do app.
No app original ele tinha estas funções/partes: MODULE_Brain, get, isOpen, toggle, render, add, openModal, addManual, edit, closeMemoryModal, saveManual, togglePin, deleteMemory, clearAll, memorizeConversation, memorizeMessage, getContextBlock, mergeMemories.
Registre com APP.registrar({ nome, icone, abrir }). Devolva só o arquivo completo.
```

### Passo 12 — `js/65-renderizacao-de-mensagens-mark.js` (era `ai-code-studio-2-modular/js/13-renderizacao-de-mensagens-mark.js`, 6 linhas)

```text
Crie js/65-renderizacao-de-mensagens-mark.js. Ele é uma parte de logica do app.
Registre com APP.registrar({ nome, icone, abrir }). Devolva só o arquivo completo.
```

### Passo 13 — `js/70-chat.js` (era `ai-code-studio-2-modular/js/14-chat.js`, 200 linhas)

```text
Crie js/70-chat.js. Ele é uma parte de logica do app.
No app original ele tinha estas funções/partes: MODULE_Chat, createNew, load, confirmNewChat, closeNewChatModal, newChatAction, renameConv, deleteConv, renderConversations, renderMessages, showTyping, setLoading, sendOrStop, send, respond, regenerate, copyMsg, speakMsg.
Registre com APP.registrar({ nome, icone, abrir }). Devolva só o arquivo completo.
```

### Passo 14 — `js/75-editor-de-codigo-previa-ao-viv.js` (era `ai-code-studio-2-modular/js/15-editor-de-codigo-previa-ao-viv.js`, 163 linhas)

```text
Crie js/75-editor-de-codigo-previa-ao-viv.js. Ele é uma parte de logica do app.
No app original ele tinha estas funções/partes: MODULE_Code, normLang, langFromName, tab, isOpen, open, togglePanel, toggleWide, sync, guessLang, newTab, loadTab, renderTabs, switchTab, renameTab, closeTab, onInput, onLangChange.
Registre com APP.registrar({ nome, icone, abrir }). Devolva só o arquivo completo.
```

### Passo 15 — `js/80-voz-tts-neural-ditado-modo-con.js` (era `ai-code-studio-2-modular/js/16-voz-tts-neural-ditado-modo-con.js`, 100 linhas)

```text
Crie js/80-voz-tts-neural-ditado-modo-con.js. Ele é uma parte de logica do app.
No app original ele tinha estas funções/partes: MODULE_Voice, voices, pick, clean, chunks, speak, stopSpeaking, listen, toggleMic, toggleConvMode, fillVoices, test, init.
Registre com APP.registrar({ nome, icone, abrir }). Devolva só o arquivo completo.
```

### Passo 16 — `js/85-configuracoes.js` (era `ai-code-studio-2-modular/js/17-configuracoes.js`, 60 linhas)

```text
Crie js/85-configuracoes.js. Ele é uma parte de logica do app.
No app original ele tinha estas funções/partes: MODULE_Settings, open, close, collect, save, test, quick.
Registre com APP.registrar({ nome, icone, abrir }). Devolva só o arquivo completo.
```

### Passo 17 — `js/90-ui.js` (era `ai-code-studio-2-modular/js/18-ui.js`, 31 linhas)

```text
Crie js/90-ui.js. Ele é uma parte de logica do app.
No app original ele tinha estas funções/partes: MODULE_UI, toast, autoResize, handleKey, togglePass, toggleSidebar, toggleMenu, closeOthersMobile, setTypingStatus, updatePlaceholder.
Registre com APP.registrar({ nome, icone, abrir }). Devolva só o arquivo completo.
```

### Passo 18 — `js/91-ai-code-studio-2-modular.js` (era `ai-code-studio-2-modular/index.html`, 271 linhas)

```text
Crie js/91-ai-code-studio-2-modular.js. Ele faz: AI Code Studio — 🤖 AI Code Studio.
Ele usa o que já foi criado em: js/10-utilitarios.js, js/15-renderizacao-de-mensagens-mark.js, js/20-editor-de-codigo-previa-ao-viv.js, js/25-utilitarios.js, js/30-provedores-de-ia.js, js/35-estado.js, js/40-armazenamento.js, js/45-selecao-de-provedor-modelo.js, js/50-chamadas-de-ia.js, js/55-contexto-a-ia-nao-caducar.js, js/60-cerebro-memoria.js, js/65-renderizacao-de-mensagens-mark.js, js/70-chat.js, js/75-editor-de-codigo-previa-ao-viv.js, js/80-voz-tts-neural-ditado-modo-con.js, js/85-configuracoes.js, js/90-ui.js (pelo APP).
Registre com APP.registrar({ nome, icone, abrir }). Devolva só o arquivo completo.
```

### Passo 19 — `js/92-inicio.js` (era `index.html`, 81 linhas)

```text
Crie js/92-inicio.js. Ele faz: codigos_ai-code-studio-2-modular — codigos_ai-code-studio-2-modular.
No app original ele tinha estas funções/partes: rec, esc, card, show.
Registre com APP.registrar({ nome, icone, abrir }). Devolva só o arquivo completo.
```

### Passo 20 — `js/99-app.js` e conferir

```text
Crie js/99-app.js: ele olha APP.modulos e monta o menu/abas com um botão para cada módulo. Depois, me mande o index.html atualizado com todos os <script src="js/…"> na ordem certa: js/00-core.js, js/10-utilitarios.js, js/15-renderizacao-de-mensagens-mark.js, js/20-editor-de-codigo-previa-ao-viv.js, js/25-utilitarios.js, js/30-provedores-de-ia.js, js/35-estado.js, js/40-armazenamento.js, js/45-selecao-de-provedor-modelo.js, js/50-chamadas-de-ia.js, js/55-contexto-a-ia-nao-caducar.js, js/60-cerebro-memoria.js, js/65-renderizacao-de-mensagens-mark.js, js/70-chat.js, js/75-editor-de-codigo-previa-ao-viv.js, js/80-voz-tts-neural-ditado-modo-con.js, js/85-configuracoes.js, js/90-ui.js, js/91-ai-code-studio-2-modular.js, js/92-inicio.js, js/99-app.js.
```

## 5. Conferir no final

- [ ] Abrir o index.html na prévia: aparece a tela sem erro (▤ console vazio)?
- [ ] Cada botão abre a sua parte?
- [ ] Fechar e abrir de novo: os dados continuam?
- [ ] Nada com "replit", "REPL_", "@workspace" no código (🏗️ Preparar confere).
- [ ] 📱 PWA → deixar instalável; 📦 APK ou 🖥️ .exe.
