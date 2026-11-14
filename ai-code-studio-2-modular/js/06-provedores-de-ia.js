'use strict';
/* ============================================================
   PROVEDORES DE IA
   ============================================================ */
const PROVIDERS = {
  gemini:     { name: 'Google Gemini',      type: 'gemini',    models: ['gemini-2.5-flash', 'gemini-2.5-pro', 'gemini-2.5-flash-lite'], hint: 'AIza... ou AQ....' },
  anthropic:  { name: 'Anthropic Claude',   type: 'anthropic', models: ['claude-sonnet-5-5', 'claude-opus-5-5', 'claude-haiku-4-5-20251001'], hint: 'sk-ant-...' },
  openai:     { name: 'OpenAI GPT',         type: 'openai', base: 'https://api.openai.com/v1', models: ['gpt-5', 'gpt-5-mini', 'gpt-4.1', 'gpt-4o-mini'], hint: 'sk-...' },
  groq:       { name: 'Groq (rápido)',      type: 'openai', base: 'https://api.groq.com/openai/v1', models: ['llama-3.3-70b-versatile', 'openai/gpt-oss-120b', 'llama-3.1-8b-instant'], hint: 'gsk_...' },
  openrouter: { name: 'OpenRouter (vários)',type: 'openai', base: 'https://openrouter.ai/api/v1', models: ['openrouter/auto', 'google/gemini-2.5-flash', 'deepseek/deepseek-chat'], hint: 'sk-or-...' },
  deepseek:   { name: 'DeepSeek',           type: 'openai', base: 'https://api.deepseek.com/v1', models: ['deepseek-chat', 'deepseek-reasoner'], hint: 'sk-...' },
  mistral:    { name: 'Mistral',            type: 'openai', base: 'https://api.mistral.ai/v1', models: ['mistral-large-latest', 'codestral-latest', 'mistral-small-latest'], hint: '' },
  xai:        { name: 'xAI Grok',           type: 'openai', base: 'https://api.x.ai/v1', models: ['grok-4', 'grok-3-mini'], hint: 'xai-...' },
  ollama:     { name: 'Ollama (local)',     type: 'openai', models: ['llama3.2', 'qwen2.5-coder', 'mistral'], hint: '' },
  custom:     { name: 'Personalizado',      type: 'openai', models: [], hint: 'chave (se precisar)' }
};
