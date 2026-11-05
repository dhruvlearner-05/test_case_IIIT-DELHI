export function providerConfig(env = process.env) {
  const provider = env.LLM_PROVIDER || (env.GROQ_API_KEY ? 'groq' : 'openai');
  if (provider === 'groq') return {provider, key:env.GROQ_API_KEY, model:env.GROQ_MODEL || 'openai/gpt-oss-120b', url:'https://api.groq.com/openai/v1/chat/completions'};
  if (provider === 'openai') return {provider, key:env.OPENAI_API_KEY, model:env.OPENAI_MODEL, url:'https://api.openai.com/v1/responses'};
  return {provider, key:null, model:null};
}

export async function requestExplanation(config, payload, fetchImpl = fetch) {
  const body = config.provider === 'groq'
    ? {model:config.model, messages:[{role:'system',content:payload.instructions},{role:'user',content:payload.input}], max_completion_tokens:1500}
    : {...payload,model:config.model};
  let response;
  try {
    response = await fetchImpl(config.url, {method:'POST',headers:{Authorization:'Bearer '+config.key,'Content-Type':'application/json'},body:JSON.stringify(body),signal:AbortSignal.timeout(25000)});
  } catch (error) {
    const known=['ENOTFOUND','EAI_AGAIN','ECONNREFUSED','ETIMEDOUT','UND_ERR_CONNECT_TIMEOUT','UNABLE_TO_VERIFY_LEAF_SIGNATURE','SELF_SIGNED_CERT_IN_CHAIN','CERT_HAS_EXPIRED'];
    const code=error.name==='TimeoutError'?'TIMEOUT':known.includes(error.cause?.code)?error.cause.code:'NETWORK';
    throw new Error(code);
  }
  if (!response.ok) throw new Error('upstream HTTP_'+response.status);
  const out = await response.json();
  const text = config.provider === 'groq' ? out.choices?.[0]?.message?.content : (out.output||[]).flatMap(o=>o.content||[]).filter(c=>c.type==='output_text').map(c=>c.text).join('\n');
  if (typeof text !== 'string' || !text.trim()) throw new Error('empty');
  return text;
}

export function aiFailureNotice(error) {
  const message=error?.message || '';
  if(message.includes('HTTP_401')) return 'Groq/AI rejected the API key (401). Replace it in .env and restart the server.';
  if(message.includes('HTTP_403')) return 'Groq/AI denied access (403). Check your account and model permissions.';
  if(message.includes('HTTP_429')) return 'Groq/AI rate or quota limit reached (429). Check account limits and retry later.';
  if(message.includes('HTTP_404')) return 'AI model or endpoint not found (404). Check the model name in .env.';
  if(message.includes('HTTP_400')) return 'AI rejected the model or request settings (400). Check model availability.';
  if(/CERT|SIGNATURE/.test(message)) return 'The secure connection to AI failed certificate verification. Check your Node certificate/proxy configuration.';
  if(/ENOTFOUND|EAI_AGAIN/.test(message)) return 'The AI hostname could not be resolved. Check internet access and DNS.';
  if(/TIMEOUT|ETIMEDOUT/.test(message)) return 'The AI request timed out. Check your connection and retry.';
  if(/NETWORK|ECONNREFUSED/.test(message)) return 'Could not connect to AI. Check internet access, firewall and proxy settings.';
  if(message==='empty') return 'AI returned no usable explanation. Try again or select another supported model.';
  return 'Live AI is unavailable. Please retry later.';
}
