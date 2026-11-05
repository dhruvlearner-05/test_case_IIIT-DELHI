import test from 'node:test';
import assert from 'node:assert/strict';
import {providerConfig,requestExplanation} from '../llm.mjs';

test('Groq config uses its own key and endpoint',()=>{
  const c=providerConfig({LLM_PROVIDER:'groq',GROQ_API_KEY:'fake-groq',OPENAI_API_KEY:'fake-other'});
  assert.equal(c.key,'fake-groq');
  assert.equal(c.url,'https://api.groq.com/openai/v1/chat/completions');
  assert.equal(c.model,'openai/gpt-oss-120b');
});
test('Groq sends chat messages and parses reply',async()=>{
  const result=await requestExplanation(providerConfig({GROQ_API_KEY:'fake'}),{instructions:'Explain',input:'Approved facts',store:false},async(url,options)=>{
    const body=JSON.parse(options.body);
    assert.equal(options.headers.Authorization,'Bearer fake');
    assert.deepEqual(body.messages,[{role:'system',content:'Explain'},{role:'user',content:'Approved facts'}]);
    assert.equal(body.store,undefined);
    return {ok:true,json:async()=>({choices:[{message:{content:'Useful explanation'}}]})};
  });
  assert.equal(result,'Useful explanation');
});
test('Provider failure and empty reply are rejected for fallback',async()=>{
  const c=providerConfig({GROQ_API_KEY:'fake'});
  await assert.rejects(requestExplanation(c,{},async()=>({ok:false})),/upstream/);
  await assert.rejects(requestExplanation(c,{},async()=>({ok:true,json:async()=>({choices:[]})})),/empty/);
});
