'use strict';
/* ============================================================
   VOZ (TTS neural + ditado + modo conversa)
   ============================================================ */
const MODULE_Voice = (() => {
  let convMode = false, listening = false, rec = null, speakId = 0;
  const hasTTS = 'speechSynthesis' in window;
  const voices = () => (hasTTS ? speechSynthesis.getVoices() : []);
  function pick(name) {
    const all = voices();
    const want = name ?? S().voiceName;
    const v = all.find(x => x.name === want);
    if (v) return v;
    const pt = all.filter(x => /^pt/i.test(x.lang));
    const br = pt.filter(x => /BR/i.test(x.lang));
    return br.find(x => /francisca/i.test(x.name)) || br.find(x => /natural|neural|online/i.test(x.name)) ||
           pt.find(x => /natural|neural|online/i.test(x.name)) || br.find(x => /google/i.test(x.name)) || br[0] || pt[0] || null;
  }
  function clean(t) {
    return String(t).replace(/```[\s\S]*?(```|$)/g, ' (tem um bloco de código na tela) ')
      .replace(/`([^`]+)`/g, '$1').replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').replace(/https?:\/\/\S+/g, ' link ')
      .replace(/[#*_>~|•]/g, ' ').replace(/\s+/g, ' ').trim();
  }
  function chunks(t) {
    const parts = t.match(/[^.!?;:\n]+[.!?;:]*\s*/g) || [t];
    const out = []; let cur = '';
    parts.forEach(p => {
      if ((cur + p).length > 220) { if (cur.trim()) out.push(cur); cur = p; } else cur += p;
    });
    if (cur.trim()) out.push(cur);
    return out;
  }
  function speak(text, onEnd) {
    if (!hasTTS) { MODULE_UI.toast('Este navegador não tem voz (TTS).', 'warn'); return; }
    speechSynthesis.cancel();
    const id = ++speakId;
    const list = chunks(clean(text));
    if (!list.length) { onEnd && onEnd(); return; }
    const v = pick();
    list.forEach((c, i) => {
      const u = new SpeechSynthesisUtterance(c);
      if (v) { u.voice = v; u.lang = v.lang; } else u.lang = 'pt-BR';
      u.rate = +S().voiceRate || 1; u.pitch = +S().voicePitch || 1;
      if (i === list.length - 1) u.onend = () => { if (id === speakId && onEnd) onEnd(); };
      speechSynthesis.speak(u);
    });
  }
  function stopSpeaking() { speakId++; if (hasTTS) speechSynthesis.cancel(); }
  function ui() { $('micBtn').classList.toggle('rec', listening); $('convBtn').classList.toggle('on', convMode); }
  function listen() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { MODULE_UI.toast('Reconhecimento de voz não suportado aqui — use Chrome ou Edge.', 'warn'); convMode = false; ui(); return; }
    if (listening) { rec && rec.stop(); return; }
    stopSpeaking();
    rec = new SR(); rec.lang = 'pt-BR'; rec.interimResults = true; rec.continuous = false;
    const inp = $('userInput');
    const base = inp.value ? inp.value + ' ' : '';
    let finalTxt = '';
    rec.onresult = e => {
      let interim = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) finalTxt += e.results[i][0].transcript; else interim += e.results[i][0].transcript;
      }
      inp.value = base + finalTxt + interim; MODULE_UI.autoResize(inp);
    };
    rec.onerror = e => {
      if (e.error === 'not-allowed' || e.error === 'service-not-allowed') { convMode = false; MODULE_UI.toast('🎤 Permita o microfone no navegador.', 'warn'); }
      else if (e.error !== 'no-speech' && e.error !== 'aborted') MODULE_UI.toast('🎤 ' + e.error, 'warn');
    };
    rec.onend = () => {
      listening = false; ui();
      if (finalTxt.trim() && (S().voiceAutoSend || convMode)) MODULE_Chat.send();
      else if (convMode && !STATE.isLoading) setTimeout(() => { if (convMode && !listening && !STATE.isLoading) listen(); }, 400);
    };
    try { rec.start(); listening = true; ui(); } catch (e) { MODULE_UI.toast('🎤 ' + e.message, 'warn'); }
  }
  function toggleMic() { listen(); }
  function toggleConvMode() {
    convMode = !convMode; ui();
    if (convMode) { MODULE_UI.toast('🗣️ Modo conversa ligado: fale, a IA responde em voz e volta a ouvir.', 'success'); if (!listening) listen(); }
    else { rec && rec.stop(); stopSpeaking(); MODULE_UI.toast('🗣️ Modo conversa desligado'); }
  }
  function fillVoices() {
    const sel = $('voiceSelect'); if (!sel) return;
    const all = voices();
    const pt = all.filter(v => /^pt/i.test(v.lang)), others = all.filter(v => !/^pt/i.test(v.lang));
    const cur = S().voiceName;
    sel.innerHTML = '<option value="">Automática (melhor voz pt-BR)</option>' + [...pt, ...others].map(v =>
      `<option value="${escapeHtml(v.name)}"${v.name === cur ? ' selected' : ''}>${/natural|neural|online/i.test(v.name) ? '⭐ ' : ''}${escapeHtml(v.name)} (${v.lang})</option>`).join('');
  }
  function test() {
    const prev = S().voiceName, pr = S().voiceRate, pp = S().voicePitch;
    S().voiceName = $('voiceSelect').value; S().voiceRate = +$('voiceRate').value; S().voicePitch = +$('voicePitch').value;
    speak('Olá! Esta é a voz do seu AI Code Studio. Tudo pronto para conversar.');
    S().voiceName = prev; S().voiceRate = pr; S().voicePitch = pp;
  }
  function init() { if (hasTTS) { speechSynthesis.onvoiceschanged = fillVoices; speechSynthesis.getVoices(); } }
  return { speak, stopSpeaking, listen, toggleMic, toggleConvMode, fillVoices, test, init, isConvMode: () => convMode };
})();
