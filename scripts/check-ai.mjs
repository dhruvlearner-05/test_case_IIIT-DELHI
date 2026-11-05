import {providerConfig,requestExplanation,aiFailureNotice} from '../llm.mjs';
const ai=providerConfig();
console.log('Provider:',ai.provider,'| Model:',ai.model||'not configured','| Key loaded:',Boolean(ai.key));
if(!ai.key||!ai.model){console.log('FAIL: Configure the provider key and model in .env.');process.exitCode=1;}
else {
  try {
    await requestExplanation(ai,{instructions:'Reply with the word OK.',input:'Connection test.',store:false,max_output_tokens:450});
    console.log('PASS: A live AI response was received. No key or response content was printed.');
  } catch(error) {
    console.log('FAIL:',aiFailureNotice(error));
    process.exitCode=1;
  }
}
