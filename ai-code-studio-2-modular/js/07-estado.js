'use strict';
/* ============================================================
   ESTADO
   ============================================================ */
const STATE = {
  conversations: {}, activeConvId: null,
  codeTabs: [], activeCodeTab: 0,
  memories: [],
  settings: {
    keys: {}, serperKey: '', ollamaUrl: 'http://localhost:11434', customBase: '',
    provider: 'gemini', model: 'gemini-2.5-flash', lastModel: {}, modelCache: {}, customModels: {}, geminiAuthMode: '',
    temperature: 0.7, maxTokens: 8192,
    contextLimit: 32000, memoryInjectCount: 6, keepRecent: 10, autoSummarize: true,
    systemPrompt: DEFAULT_SYS, enterSends: false,
    voiceName: '', voiceRate: 1, voicePitch: 1, autoRead: false, voiceAutoSend: true
  },
  isLoading: false, abort: null,
  _version: '2.0.0'
};
const S = () => STATE.settings;
const activeConv = () => STATE.conversations[STATE.activeConvId];
