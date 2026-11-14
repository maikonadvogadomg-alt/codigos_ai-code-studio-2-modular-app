# 📋 Plano para entender e modularizar: codigos/ai-code-studio-2.html

_Gerado pelo Laboratório em 14/11/2026, 05:26:06 — sem IA, lendo o código._

## 📊 Resumo

| Item | Quantidade |
|---|---|
| Tamanho | 101 KB · 1721 linhas |
| Blocos de estilo | 1 |
| Blocos de código | 1 |
| Funções | 156 |
| Botões/eventos na tela | 74 |
| Cores diferentes | 20 |
| Bibliotecas de fora | 0 |
| Problemas | 1 (0 graves) |

## ⚠️ Problemas encontrados (resolver primeiro)

- 🟡 O código procura o id "__cons" (em box, __consoleHook), mas a tela não tem esse id. Pode ser criado depois pelo código — ou pode ser um erro.

## 🗂️ Seções que o próprio código marca

- linha 462: **UTILITÁRIOS**
- linha 490: **PROVEDORES DE IA**
- linha 506: **ESTADO**
- linha 527: **ARMAZENAMENTO**
- linha 612: **SELEÇÃO DE PROVEDOR / MODELO**
- linha 663: **CHAMADAS DE IA**
- linha 692: **GEMINI: tenta header x-goog-api-key, ?key= e Bearer**
- linha 737: **ANTHROPIC**
- linha 753: **OPENAI E COMPATÍVEIS (Groq, OpenRouter, DeepSeek, Mistral, xAI, Ollama, personalizado)**
- linha 836: **CONTEXTO (a IA não "caducar")**
- linha 925: **CÉREBRO / MEMÓRIA**
- linha 1074: **RENDERIZAÇÃO DE MENSAGENS (markdown + caixas de código)**
- linha 1113: **CHAT**
- linha 1312: **EDITOR DE CÓDIGO + PRÉVIA AO VIVO**
- linha 1499: **VOZ (TTS neural + ditado + modo conversa)**
- linha 1598: **CONFIGURAÇÕES**
- linha 1687: **INICIALIZAÇÃO**

## 🧩 Funções — o que cada uma faz

| Função | Linhas | O que faz | Chama | É chamada por |
|---|---|---|---|---|
| `$` | 465–465 (1) | faz uma parte da lógica | — | importBackup, fillProviders, fillModels, onProviderChange, onModelChange, current |
| `est` | 466–466 (1) | faz uma parte da lógica | — | build, updateBar, autoCompact, handleAttach |
| `uid` | 467–467 (1) | sorteia | — | normMemory, handleImport, add, createNew, newTab, closeTab |
| `isMobile` | 468–468 (1) | faz uma parte da lógica | — | load, sendToChat, handleKey, closeOthersMobile, INIT |
| `escapeHtml` | 470–472 (3) | arruma texto | — | fillModels, render, codeBox, formatMessage, renderConversations, renderMessages |
| `copyText` | 473–481 (9) | desenha/muda a tela · copia para a área de transferência | toast | copyMsg, copyClean, copyBlock |
| `S` | 524–524 (1) | faz uma parte da lógica | — | load, exportAll, handleImport, models, fillProviders, fillModels |
| `activeConv` | 525–525 (1) | faz uma parte da lógica | — | updateBar, compactNow, clear, render, saveManual, memorizeConversation |
| `save` | 533–541 (9) | salva · guarda/lê no aparelho (localStorage) · converte dados (JSON) | toast | handleImport, refreshModels, compact, clear, add, saveManual |
| `saveSoon` | 542–542 (1) | salva · usa tempo (espera/repete) | — | onProviderChange, onModelChange, geminiFetch, load, renameConv, switchTab |
| `load` | 543–564 (22) | carrega · guarda/lê no aparelho (localStorage) · converte dados (JSON) | S | createNew, confirmNewChat, deleteConv, refreshAll, INIT |
| `normMemory` | 565–568 (4) | faz uma parte da lógica | uid | add, mergeMemories |
| `stamp` | 569–569 (1) | faz uma parte da lógica | — | exportAll, exportMemory |
| `download` | 570–576 (7) | carrega · desenha/muda a tela · baixa arquivo · usa tempo (espera/repete) | — | exportAll, exportMemory, exportConvMarkdown, onKey, download |
| `exportAll` | 577–585 (9) | exporta/baixa · converte dados (JSON) | sync, S, stamp, download | — |
| `importBackup` | 586–586 (1) | importa/abre | $ | — |
| `handleImport` | 587–608 (22) | importa/abre · lê arquivo · converte dados (JSON) | mergeMemories, uid, S, save, refreshAll, toast | — |
| `models` | 616–620 (5) | faz uma parte da lógica | S | fillModels |
| `fillProviders` | 621–624 (4) | desenha/muda a tela | $, S | init |
| `fillModels` | 625–634 (10) | desenha/muda a tela | $, models, S, escapeHtml | onProviderChange, onModelChange, refreshModels, init |
| `onProviderChange` | 635–635 (1) | faz uma parte da lógica | S, $, fillModels, saveSoon | — |
| `onModelChange` | 636–646 (11) | faz uma parte da lógica | $, fillModels, S, saveSoon | — |
| `current` | 647–647 (1) | faz uma parte da lógica | $ | refreshModels, compact, memorizeConversation, renderMessages, respond, test |
| `refreshModels` | 648–658 (11) | mostra/atualiza na tela | current, toast, listModels, S, fillModels, save | — |
| `init` | 659–659 (1) | começa o app | fillProviders, fillModels | refreshAll, INIT |
| `key` | 667–667 (1) | faz uma parte da lógica | S | geminiFetch, anthHeaders, oaHeaders, _openaiCompat |
| `baseUrl` | 668–672 (5) | faz uma parte da lógica | S | _openaiCompat, listModels |
| `httpErr` | 673–679 (7) | lê arquivo · converte dados (JSON) | — | geminiFetch, _anthropic, _openaiCompat, listModels, webSearch |
| `mergeRoles` | 681–690 (10) | faz uma parte da lógica | — | _gemini, _anthropic |
| `geminiFetch` | 693–719 (27) | conversa com IA/API · busca na internet/servidor | key, S, saveSoon, httpErr | _gemini, listModels |
| `_gemini` | 720–735 (16) | conversa com IA/API · converte dados (JSON) | mergeRoles, geminiFetch, toast | call |
| `anthHeaders` | 738–742 (5) | faz uma parte da lógica | key | _anthropic, listModels |
| `_anthropic` | 743–751 (9) | conversa com IA/API · busca na internet/servidor · converte dados (JSON) | mergeRoles, anthHeaders, httpErr, toast | call |
| `oaHeaders` | 754–760 (7) | faz uma parte da lógica | key | _openaiCompat, listModels |
| `_openaiCompat` | 761–785 (25) | importa/abre · busca na internet/servidor · converte dados (JSON) | baseUrl, key, oaHeaders, httpErr | call |
| `call` | 787–794 (8) | faz uma parte da lógica | S, _gemini, _anthropic, _openaiCompat | compact, memorizeConversation, respond, test |
| `listModels` | 796–819 (24) | busca na internet/servidor | geminiFetch, anthHeaders, httpErr, S, baseUrl, oaHeaders | refreshModels |
| `webSearch` | 821–831 (11) | busca na internet/servidor · converte dados (JSON) | S, httpErr | respond |
| `sendable` | 840–840 (1) | faz uma parte da lógica | — | build, updateBar, compact, autoCompact |
| `build` | 842–858 (17) | faz uma parte da lógica | S, getContextBlock, sendable, est, toast | respond |
| `updateBar` | 860–868 (9) | mostra/atualiza na tela · desenha/muda a tela | activeConv, sendable, est, S, $ | renderMessages, collect |
| `compact` | 870–894 (25) | faz uma parte da lógica | S, sendable, current, setTypingStatus, call, save | autoCompact, compactNow |
| `autoCompact` | 896–901 (6) | faz uma parte da lógica | S, sendable, est, compact | respond |
| `compactNow` | 903–913 (11) | faz uma parte da lógica | activeConv, setLoading, compact, S, toast, renderMessages | — |
| `clear` | 915–921 (7) | apaga/limpa | activeConv, save, renderMessages | — |
| `get` | 930–930 (1) | faz uma parte da lógica | — | edit, saveManual, togglePin |
| `isOpen` | 931–931 (1) | importa/abre | $ | toggle, render, togglePanel |
| `toggle` | 933–937 (5) | faz uma parte da lógica | $, isOpen, closeOthersMobile, render | — |
| `render` | 938–964 (27) | mostra/atualiza na tela · desenha/muda a tela | $, isOpen, activeConv, escapeHtml | toggle, add, saveManual, togglePin, deleteMemory, clearAll |
| `add` | 965–970 (6) | faz uma parte da lógica | uid, normMemory, save, render | saveManual, memorizeConversation, memorizeMessage |
| `openModal` | 971–971 (1) | importa/abre · usa tempo (espera/repete) | $ | addManual, edit |
| `addManual` | 972–977 (6) | desenha/muda a tela | $, openModal | — |
| `edit` | 978–985 (8) | desenha/muda a tela | get, $, openModal | — |
| `closeMemoryModal` | 986–986 (1) | abre/fecha janela | $ | saveManual |
| `saveManual` | 987–998 (12) | salva | $, activeConv, get, add, save, closeMemoryModal | — |
| `togglePin` | 999–999 (1) | faz uma parte da lógica | get, save, render | — |
| `deleteMemory` | 1000–1000 (1) | apaga/limpa | save, render | — |
| `clearAll` | 1001–1005 (5) | apaga/limpa | save, render | — |
| `memorizeConversation` | 1006–1027 (22) | faz uma parte da lógica | activeConv, toast, current, call, add | newChatAction |
| `memorizeMessage` | 1028–1032 (5) | faz uma parte da lógica | activeConv, add, toast | — |
| `getContextBlock` | 1033–1047 (15) | faz uma parte da lógica | S | build |
| `mergeMemories` | 1048–1051 (4) | faz uma parte da lógica | normMemory | handleImport |
| `exportMemory` | 1052–1054 (3) | exporta/baixa · converte dados (JSON) | stamp, download | — |
| `importMemory` | 1055–1055 (1) | importa/abre | $ | — |
| `handleImport` | 1056–1069 (14) | importa/abre · lê arquivo · converte dados (JSON) | mergeMemories, save, render, toast | — |
| `codeBox` | 1078–1088 (11) | faz uma parte da lógica | escapeHtml | formatMessage |
| `formatMessage` | 1089–1111 (23) | arruma texto | escapeHtml, codeBox | renderMessages |
| `createNew` | 1117–1123 (7) | faz uma parte da lógica | uid, save, load | confirmNewChat, newChatAction, deleteConv, send, refreshAll |
| `load` | 1124–1131 (8) | carrega | $, renderMessages, renderConversations, render, saveSoon, isMobile | createNew, confirmNewChat, deleteConv, refreshAll, INIT |
| `confirmNewChat` | 1132–1136 (5) | conversa com IA/API | activeConv, createNew, load, $ | — |
| `closeNewChatModal` | 1137–1137 (1) | abre/fecha janela | $ | newChatAction |
| `newChatAction` | 1138–1147 (10) | conversa com IA/API | closeNewChatModal, activeConv, memorizeConversation, createNew | — |
| `renameConv` | 1148–1152 (5) | faz uma parte da lógica | activeConv, renderConversations, saveSoon | — |
| `deleteConv` | 1153–1163 (11) | apaga/limpa | load, createNew, save, renderConversations | — |
| `renderConversations` | 1164–1175 (12) | mostra/atualiza na tela · desenha/muda a tela | $, escapeHtml | load, renameConv, deleteConv, send, respond |
| `renderMessages` | 1176–1210 (35) | mostra/atualiza na tela · desenha/muda a tela | activeConv, $, current, escapeHtml, updateBar, formatMessage | compactNow, clear, load, send, respond, regenerate |
| `showTyping` | 1211–1217 (7) | desenha/muda a tela | $ | respond |
| `setLoading` | 1218–1224 (7) | carrega · desenha/muda a tela | $ | compactNow, respond |
| `sendOrStop` | 1225–1225 (1) | faz uma parte da lógica | send | — |
| `send` | 1227–1239 (13) | faz uma parte da lógica | $, activeConv, createNew, autoResize, renderMessages, renderConversations | sendOrStop, listen, handleKey |
| `respond` | 1241–1266 (26) | faz uma parte da lógica | setLoading, showTyping, current, autoCompact, $, setTypingStatus | send, regenerate |
| `regenerate` | 1268–1273 (6) | faz uma parte da lógica | activeConv, renderMessages, respond | — |
| `copyMsg` | 1274–1274 (1) | faz uma parte da lógica | activeConv, copyText | — |
| `speakMsg` | 1275–1275 (1) | faz uma parte da lógica | activeConv, speak | — |
| `deleteMsg` | 1276–1280 (5) | apaga/limpa | activeConv, save, renderMessages | — |
| `editMsg` | 1281–1286 (6) | faz uma parte da lógica | activeConv, $, save, renderMessages, autoResize | — |
| `handleAttach` | 1287–1301 (15) | lê arquivo | toast, langFromName, $, autoResize, est | — |
| `exportConvMarkdown` | 1302–1307 (6) | exporta/baixa | activeConv, download | — |
| `box` | 1317–1323 (7) | desenha/muda a tela | — | w, __consoleHook |
| `w` | 1324–1324 (1) | desenha/muda a tela | box | __consoleHook |
| `__consoleHook` | 1315–1336 (22) | liga botões/eventos · desenha/muda a tela · converte dados (JSON) | box, w | — |
| `normLang` | 1346–1346 (1) | faz uma parte da lógica | — | langFromName, blockToEditor |
| `langFromName` | 1347–1347 (1) | faz uma parte da lógica | normLang | handleAttach, renameTab, handleFileImport |
| `tab` | 1348–1348 (1) | faz uma parte da lógica | — | sync, loadTab, onLangChange, copyClean, sendToChat, download |
| `isOpen` | 1349–1349 (1) | importa/abre | $ | toggle, render, togglePanel |
| `open` | 1351–1351 (1) | importa/abre | $, closeOthersMobile | togglePanel, pasteToEditor, handleFileImport, blockToEditor, openWindow |
| `togglePanel` | 1352–1352 (1) | faz uma parte da lógica | isOpen, sync, $, open | sendToChat |
| `toggleWide` | 1353–1353 (1) | faz uma parte da lógica | $ | — |
| `sync` | 1354–1354 (1) | faz uma parte da lógica | tab, $ | exportAll, togglePanel, newTab, switchTab, closeTab, onInput |
| `guessLang` | 1355–1361 (7) | faz uma parte da lógica | — | newTab, pasteToEditor, blockToEditor |
| `newTab` | 1362–1369 (8) | faz uma parte da lógica | sync, guessLang, uid, loadTab, save | pasteToEditor, handleFileImport, blockToEditor |
| `loadTab` | 1370–1376 (7) | carrega | tab, $, renderTabs, refreshPreview | newTab, switchTab, closeTab, pasteToEditor, refreshAll |
| `renderTabs` | 1377–1382 (6) | mostra/atualiza na tela · desenha/muda a tela | $, escapeHtml | loadTab, renameTab |
| `switchTab` | 1383–1383 (1) | faz uma parte da lógica | sync, loadTab, saveSoon | — |
| `renameTab` | 1384–1394 (11) | faz uma parte da lógica | langFromName, $, renderTabs, save, refreshPreview | — |
| `closeTab` | 1395–1404 (10) | abre/fecha janela | sync, uid, loadTab, save | — |
| `onInput` | 1405–1408 (4) | usa tempo (espera/repete) | sync, saveSoon, $ | onKey, clear |
| `onLangChange` | 1409–1409 (1) | faz uma parte da lógica | tab, $, saveSoon, refreshPreview | — |
| `onKey` | 1410–1413 (4) | faz uma parte da lógica | onInput, download | — |
| `copyClean` | 1414–1414 (1) | faz uma parte da lógica | sync, tab, copyText | — |
| `sendToChat` | 1415–1424 (10) | conversa com IA/API | sync, tab, toast, $, autoResize, isMobile | — |
| `download` | 1425–1430 (6) | carrega | sync, tab, download | exportAll, exportMemory, exportConvMarkdown, onKey, download |
| `clear` | 1431–1431 (1) | apaga/limpa | $, onInput | — |
| `pasteToEditor` | 1432–1442 (11) | copia para a área de transferência | open, toast, tab, guessLang, loadTab, save | — |
| `importFile` | 1443–1443 (1) | importa/abre | $ | — |
| `handleFileImport` | 1444–1451 (8) | importa/abre · lê arquivo | langFromName, newTab, open, toast | — |
| `copyBlock` | 1452–1455 (4) | desenha/muda a tela · usa tempo (espera/repete) | copyText | — |
| `blockToEditor` | 1456–1460 (5) | faz uma parte da lógica | normLang, guessLang, newTab, open, toast | previewBlock |
| `previewBlock` | 1461–1461 (1) | faz uma parte da lógica | blockToEditor, togglePreview, refreshPreview | — |
| `togglePreview` | 1462–1467 (6) | faz uma parte da lógica | $, refreshPreview | previewBlock |
| `afterTag` | 1468–1468 (1) | faz uma parte da lógica | — | buildDoc |
| `beforeTag` | 1469–1469 (1) | faz uma parte da lógica | — | buildDoc |
| `buildDoc` | 1470–1487 (18) | faz uma parte da lógica | sync, tab, $, escapeHtml, afterTag, beforeTag | refreshPreview, openWindow |
| `refreshPreview` | 1488–1488 (1) | mostra/atualiza na tela | $, buildDoc | loadTab, renameTab, onLangChange, previewBlock, togglePreview |
| `openWindow` | 1489–1493 (5) | importa/abre · baixa arquivo · usa tempo (espera/repete) | buildDoc, open | — |
| `voices` | 1505–1505 (1) | fala em voz alta | — | pick, fillVoices |
| `pick` | 1506–1515 (10) | faz uma parte da lógica | voices, S | speak |
| `clean` | 1516–1520 (5) | faz uma parte da lógica | — | speak |
| `chunks` | 1521–1529 (9) | faz uma parte da lógica | — | speak |
| `speak` | 1530–1544 (15) | fala em voz alta | toast, clean, chunks, pick, S, speak | respond, speakMsg, speak, test |
| `stopSpeaking` | 1545–1545 (1) | fala em voz alta | — | listen, toggleConvMode |
| `ui` | 1546–1546 (1) | faz uma parte da lógica | $ | listen, toggleConvMode |
| `listen` | 1547–1573 (27) | escuta a voz (ditado) · usa tempo (espera/repete) | toast, ui, stopSpeaking, $, autoResize, S | respond, toggleMic, toggleConvMode |
| `toggleMic` | 1574–1574 (1) | faz uma parte da lógica | listen | — |
| `toggleConvMode` | 1575–1579 (5) | faz uma parte da lógica | ui, toast, listen, stopSpeaking | — |
| `fillVoices` | 1580–1587 (8) | desenha/muda a tela | $, voices, S, escapeHtml | open |
| `test` | 1588–1593 (6) | faz uma parte da lógica | S, $, speak | — |
| `init` | 1594–1594 (1) | começa o app · fala em voz alta | — | refreshAll, INIT |
| `isConvMode` | 1595–1595 (1) | faz uma parte da lógica | — | respond |
| `open` | 1602–1622 (21) | importa/abre · desenha/muda a tela | S, $, escapeHtml, fillVoices | togglePanel, pasteToEditor, handleFileImport, blockToEditor, openWindow |
| `close` | 1623–1623 (1) | abre/fecha janela | $ | save |
| `collect` | 1624–1642 (19) | faz uma parte da lógica | S, $, save, updatePlaceholder, updateBar | save, test |
| `save` | 1643–1643 (1) | salva | collect, close, toast | handleImport, refreshModels, compact, clear, add, saveManual |
| `test` | 1644–1652 (9) | faz uma parte da lógica | $, collect, current, toast, call | — |
| `quick` | 1653–1653 (1) | faz uma parte da lógica | S, saveSoon | — |
| `toast` | 1662–1667 (6) | mostra aviso · desenha/muda a tela · usa tempo (espera/repete) | $ | copyText, save, handleImport, refreshModels, _gemini, _anthropic |
| `autoResize` | 1668–1668 (1) | faz uma parte da lógica | — | send, editMsg, handleAttach, sendToChat, listen |
| `handleKey` | 1669–1672 (4) | faz uma parte da lógica | S, isMobile, send | — |
| `togglePass` | 1673–1673 (1) | faz uma parte da lógica | $ | — |
| `toggleSidebar` | 1674–1674 (1) | faz uma parte da lógica | $, closeOthersMobile | — |
| `toggleMenu` | 1675–1675 (1) | faz uma parte da lógica | $ | — |
| `closeOthersMobile` | 1676–1681 (6) | abre/fecha janela | isMobile, $ | toggle, open, toggleSidebar |
| `setTypingStatus` | 1682–1682 (1) | desenha/muda a tela | $ | compact, respond |
| `updatePlaceholder` | 1683–1683 (1) | mostra/atualiza na tela | $, S | collect, refreshAll |
| `refreshAll` | 1690–1704 (15) | mostra/atualiza na tela · desenha/muda a tela | init, $, S, updatePlaceholder, uid, loadTab | handleImport, INIT |
| `INIT` | 1705–1716 (12) | começa o app · liga botões/eventos | load, isMobile, $, refreshAll, init, sync | — |

## 🖱️ Botões da tela → função

- "☰" (onclick) → `MODULE_UI.toggleSidebar()`
- "Provedor de IA" (onchange) → `MODULE_Provider.onProviderChange()`
- "Modelo" (onchange) → `MODULE_Provider.onModelChange()`
- "🔄" (onclick) → `MODULE_Provider.refreshModels()`
- "＋" (onclick) → `MODULE_Chat.confirmNewChat()`
- "💻" (onclick) → `MODULE_Code.togglePanel()`
- "🧠" (onclick) → `MODULE_Brain.toggle()`
- "⚙️" (onclick) → `MODULE_Settings.open()`
- "⋯" (onclick) → `MODULE_UI.toggleMenu()`
- "💾 Exportar backup completo" (onclick) → `MODULE_UI.toggleMenu();MODULE_Storage.exportAll()`
- "📂 Importar backup" (onclick) → `MODULE_UI.toggleMenu();MODULE_Storage.importBackup()`
- "📝 Baixar conversa (.md)" (onclick) → `MODULE_UI.toggleMenu();MODULE_Chat.exportConvMarkdown()`
- "🧪 Testar IA selecionada" (onclick) → `MODULE_UI.toggleMenu();MODULE_Settings.test()`
- "INPUT" (oninput) → `MODULE_Chat.renderConversations()`
- "＋" (onclick) → `MODULE_Chat.confirmNewChat()`
- "✕" (onclick) → `MODULE_UI.toggleSidebar()`
- "INPUT" (onblur) → `MODULE_Chat.renameConv(this.value)`
- "INPUT" (onkeydown) → `if(event.key==='Enter')this.blur()`
- "🔇" (onclick) → `MODULE_Voice.stopSpeaking()`
- "📋" (onclick) → `MODULE_Context.compactNow()`
- "🧠" (onclick) → `MODULE_Brain.memorizeConversation()`
- "✂️" (onclick) → `MODULE_Context.clear()`
- "INPUT" (onchange) → `MODULE_Settings.quick('autoRead',this.checked)`
- "INPUT" (oninput) → `document.getElementById('tempVal').textContent=this.value;MODULE_Settings.quick(`
- "INPUT" (onchange) → `MODULE_Settings.quick('maxTokens',+this.value)`
- "🎤" (onclick) → `MODULE_Voice.toggleMic()`
- "🗣️" (onclick) → `MODULE_Voice.toggleConvMode()`
- "TEXTAREA" (onkeydown) → `MODULE_UI.handleKey(event)`
- "TEXTAREA" (oninput) → `MODULE_UI.autoResize(this)`
- "📎" (onclick) → `document.getElementById('fileAttach').click()`
- "Enviar ▶" (onclick) → `MODULE_Chat.sendOrStop()`
- "+ Aba" (onclick) → `MODULE_Code.newTab()`
- "📂 Importar" (onclick) → `MODULE_Code.importFile()`
- "👁️ Prévia" (onclick) → `MODULE_Code.togglePreview()`
- "⇔" (onclick) → `MODULE_Code.toggleWide()`
- "✕" (onclick) → `MODULE_Code.togglePanel()`
- "TEXTAREA" (oninput) → `MODULE_Code.onInput()`
- "TEXTAREA" (onkeydown) → `MODULE_Code.onKey(event)`
- "INPUT" (onchange) → `MODULE_Code.refreshPreview()`
- "↻" (onclick) → `MODULE_Code.refreshPreview()`
- "↗" (onclick) → `MODULE_Code.openWindow()`
- "📋 Copiar" (onclick) → `MODULE_Code.copyClean()`
- "📥 Colar" (onclick) → `MODULE_Code.pasteToEditor()`
- "💬 Enviar ao chat" (onclick) → `MODULE_Code.sendToChat()`
- "⬇️ Baixar" (onclick) → `MODULE_Code.download()`
- "🗑️" (onclick) → `MODULE_Code.clear()`
- "HTMLCSSJS
        TSPythonJSON
        J" (onchange) → `MODULE_Code.onLangChange()`
- "✕" (onclick) → `MODULE_Brain.toggle()`
- "INPUT" (oninput) → `MODULE_Brain.render()`
- "+ Memória" (onclick) → `MODULE_Brain.addManual()`
- "🧠 Memorizar conversa" (onclick) → `MODULE_Brain.memorizeConversation()`
- "💾 Backup" (onclick) → `MODULE_Brain.exportMemory()`
- "📂 Restaurar" (onclick) → `MODULE_Brain.importMemory()`
- "🗑️" (onclick) → `MODULE_Brain.clearAll()`
- "👁️" (onclick) → `MODULE_UI.togglePass('serperKeyInput')`
- "INPUT" (oninput) → `document.getElementById('ctxVal').textContent=this.value`
- "▶ Testar" (onclick) → `MODULE_Voice.test()`
- "INPUT" (oninput) → `document.getElementById('rateVal').textContent=this.value`
- "INPUT" (oninput) → `document.getElementById('pitchVal').textContent=this.value`
- "Restaurar padrão" (onclick) → `document.getElementById('systemPrompt').value=DEFAULT_SYS`
- "🧪 Testar IA" (onclick) → `MODULE_Settings.test()`
- "Cancelar" (onclick) → `MODULE_Settings.close()`
- "💾 Salvar" (onclick) → `MODULE_Settings.save()`
- "💾 Manter a conversa salva e abrir novo " (onclick) → `MODULE_Chat.newChatAction('save')`
- "✅ Manter conversa + criar memória no cér" (onclick) → `MODULE_Chat.newChatAction('both')`
- "🧠 Só guardar como memória (apaga a conv" (onclick) → `MODULE_Chat.newChatAction('memory')`
- "🗑️ Descartar conversa" (onclick) → `MODULE_Chat.newChatAction('discard')`
- "Cancelar" (onclick) → `MODULE_Chat.closeNewChatModal()`
- "Cancelar" (onclick) → `MODULE_Brain.closeMemoryModal()`
- "💾 Salvar" (onclick) → `MODULE_Brain.saveManual()`
- "INPUT" (onchange) → `MODULE_Code.handleFileImport(event)`
- "INPUT" (onchange) → `MODULE_Storage.handleImport(event)`
- "INPUT" (onchange) → `MODULE_Brain.handleImport(event)`
- "INPUT" (onchange) → `MODULE_Chat.handleAttach(event)`

## 🔗 Variáveis que várias funções usam (o "estado" do app)

Ao separar em módulos, essas precisam ficar num lugar que todos enxerguem (ex.: um arquivo `00-estado.js` carregado primeiro).

- `PROVIDERS` (linha 493) — usada por: load, models, fillProviders, refreshModels, baseUrl, _openaiCompat, call, listModels
- `STATE` (linha 509) — usada por: S, activeConv, save, load, exportAll, handleImport, compactNow, get
- `CODE_REG` (linha 1077) — usada por: codeBox, renderMessages, copyBlock, blockToEditor

## ✂️ Proposta de módulos (já feita pelo ✂️ Picar)

- 🎨 css/01-estilo.css (226 linhas)
- 🎨 css/02-estilo.css (1 linhas)
- 📜 js/01-utilitarios.js (14 linhas: escapeHtml, copyText)
- 📜 js/02-renderizacao-de-mensagens-mark.js (36 linhas: codeBox, formatMessage)
- 📜 js/03-editor-de-codigo-previa-ao-viv.js (27 linhas: __consoleHook)
- 📜 js/04-inicializacao.js (32 linhas: refreshAll, INIT)
- 📜 js/05-utilitarios.js (16 linhas: $, est, uid, isMobile, DEFAULT_SYS)
- 📜 js/06-provedores-de-ia.js (17 linhas: PROVIDERS)
- 📜 js/07-estado.js (22 linhas: STATE, S, activeConv)
- 📜 js/08-armazenamento.js (86 linhas: MODULE_Storage)
- 📜 js/09-selecao-de-provedor-modelo.js (52 linhas: MODULE_Provider)
- 📜 js/10-chamadas-de-ia.js (174 linhas: MODULE_AI)
- 📜 js/11-contexto-a-ia-nao-caducar.js (90 linhas: MODULE_Context)
- 📜 js/12-cerebro-memoria.js (150 linhas: MODULE_Brain)
- 📜 js/13-renderizacao-de-mensagens-mark.js (6 linhas: CODE_REG, codeSeq)
- 📜 js/14-chat.js (200 linhas: MODULE_Chat)
- 📜 js/15-editor-de-codigo-previa-ao-viv.js (163 linhas: CONSOLE_JS, MODULE_Code)
- 📜 js/16-voz-tts-neural-ditado-modo-con.js (100 linhas: MODULE_Voice)
- 📜 js/17-configuracoes.js (60 linhas: MODULE_Settings)
- 📜 js/18-ui.js (31 linhas: MODULE_UI)
- 📜 js/19-inicializacao.js (3 linhas)

**Teste:** ✅ a versão picada roda igual à original (0 erro(s) que já existiam antes)

## 🛣️ Passo a passo

1. Resolva os 🔴 problemas graves (eles travam o app).
2. Use o **✂️ Picar** do Laboratório: ele separa estilos e códigos em arquivos, na mesma ordem (não muda o funcionamento) e testa.
3. Abra a versão picada no Mini SK. Cada arquivo agora é pequeno: dá para ler e mexer um por vez.
4. Para ir além (módulos "de verdade"), separe por assunto usando a tabela de funções acima: o que mexe na tela, o que salva, o que fala com a IA.
5. Sempre teste depois de cada mudança (🧪 Prévia ou ⚖️ Comparar com a versão anterior).

## 🤖 Pedido pronto para a IA

```
Tenho um app HTML chamado "codigos/ai-code-studio-2.html" (1721 linhas, 156 funções). Segue o plano gerado pelo meu Laboratório.
Quero transformar em versão MODULAR (index.html + css/ + js/ numerados), sem mudar o que ele faz.
Regras: entregue os arquivos inteiros (nunca "troque este pedaço"), explique em português simples, e resolva primeiro os problemas marcados com 🔴.
```
