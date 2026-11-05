import {providerConfig,requestExplanation,aiFailureNotice} from './llm.mjs';
import http from 'node:http';import fs from 'node:fs/promises';import path from 'node:path';import {fileURLToPath} from 'node:url';import {parseCSV,recommend,validateProfile} from './dist/core.mjs';
const root=path.join(path.dirname(fileURLToPath(import.meta.url)),'dist');const port=Number(process.env.PORT||4173);const catalogue=parseCSV(await fs.readFile(path.join(root,'data/product_catalogue.csv'),'utf8'));
const mime={'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.mjs':'text/javascript','.json':'application/json','.csv':'text/csv','.png':'image/png','.wasm':'application/wasm','.gz':'application/gzip','.txt':'text/plain'};
const json=(res,code,data)=>{res.writeHead(code,{'Content-Type':'application/json','Cache-Control':'no-store'});res.end(JSON.stringify(data));};
const ai=providerConfig();
let requests=[];
const server=http.createServer(async(req,res)=>{try{
 if(!['localhost:'+port,'127.0.0.1:'+port].includes(req.headers.host)){json(res,403,{error:'Invalid host'});return;}
 if(req.headers.origin&&!['http://localhost:'+port,'http://127.0.0.1:'+port].includes(req.headers.origin)){json(res,403,{error:'Cross-origin request denied'});return;}
 res.setHeader('X-Content-Type-Options','nosniff');res.setHeader('Referrer-Policy','no-referrer');
 if(req.url==='/api/config')return json(res,200,{genai:!!(ai.key&&ai.model)});
 if(req.url==='/api/advice'&&req.method==='POST'){
  let body='';for await(const chunk of req){body+=chunk;if(body.length>4096)return json(res,413,{error:'Request too large'});}const data=JSON.parse(body);const p={segment:data.segment,tier:+data.tier,employees:+data.employees,sites:+data.sites,budget:+data.budget,hasGst:!!data.hasGst,currentTools:['home','hotspot','business'].includes(data.currentTools)?data.currentTools:'home',priority:['uptime','lowest_cost','productivity'].includes(data.priority)?data.priority:'uptime',language:data.language==='hi'?'hi':'en'};
  if(validateProfile(p).length)return json(res,400,{error:'Invalid business profile'});const r=recommend(catalogue,p);
  if(!ai.key||!ai.model)return json(res,200,{mode:'offline',explanation:r.reason});
  requests=requests.filter(t=>Date.now()-t<60000);if(requests.length>=10)return json(res,429,{error:'Please wait a minute before requesting another explanation.'});requests.push(Date.now());
  const payload={model:process.env.OPENAI_MODEL,store:false,max_output_tokens:450,instructions:'You are the Udyam small-business advisor. Explain only the supplied, rule-approved recommendation in plain language. Respond in Hindi when language is hi, otherwise English. Mention each product purpose and the trade-off if over budget. Do not invent prices, eligibility, discounts, compliance, claims or activation guarantees. Do not request identity data. Keep under 120 words.',input:JSON.stringify({profile:p,quote:r.quote.lines.map(l=>({name:l.product_name,qty:l.qty,monthly:l.monthly,description:l.description})),subtotal:r.quote.subtotal,overBudget:r.quote.overBudget})};
  try{const explanation=await requestExplanation(ai,payload);return json(res,200,{mode:'genai',explanation});}catch(error){return json(res,200,{mode:'fallback',explanation:r.reason,notice:aiFailureNotice(error)});}
 }
 if(req.method!=='GET'&&req.method!=='HEAD')return json(res,405,{error:'Method not allowed'});
 const url=new URL(req.url,'http://localhost');const rel=decodeURIComponent(url.pathname);const file=path.resolve(root,'.'+(rel==='/'?'/index.html':rel));if(!file.startsWith(root+path.sep))return json(res,403,{error:'Forbidden'});const data=await fs.readFile(file);res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream','Cache-Control':'no-cache'});res.end(req.method==='HEAD'?undefined:data);
 }catch(err){json(res,err.code==='ENOENT'?404:400,{error:err.code==='ENOENT'?'Not found':'Invalid request'});}});
server.listen(port,'127.0.0.1',()=>console.log('Udyam Digital: http://127.0.0.1:'+port));
