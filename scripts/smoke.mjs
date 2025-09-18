import { promises as fs } from "node:fs";
import cp from "node:child_process";
const PORT = 3000, BASE = `http://localhost:${PORT}`, DEV_UID = process.env.DEV_USER_UID || "a9d5518d-ee4c-49ca-8b20-5a2d4aaa16a2";
const results=[]; const push=(n,s,i="")=>results.push({n,s,i});
async function loadEnv(){ try{ const t=await fs.readFile(".env.local","utf8"); for(const l of t.split(/\r?\n/)){ const m=l.match(/^([A-Z0-9_]+)=(.*)$/); if(!m) continue; const k=m[1]; let v=m[2]; if ((v.startsWith('"')&&v.endsWith('"'))||(v.startsWith("'")&&v.endsWith("'"))) v=v.slice(1,-1); if(!process.env[k]) process.env[k]=v; } }catch{} }
async function up(){ try{ const r=await fetch(BASE); return r.status>0 }catch{ return false } }
async function ensure(){ if(await up()) return; const p=cp.spawn("npx",["next","dev","-p",String(PORT)],{shell:true,stdio:"inherit",env:process.env}); for(let i=0;i<90;i++){ if(await up()) return; await new Promise(r=>setTimeout(r,1000)); } throw new Error("dev not up"); }
async function call(m,u,b,h={}){ try{ const r=await fetch(BASE+u,{method:m,headers:{'Content-Type':'application/json',...h},body:b?JSON.stringify(b):undefined}); let j=null; try{ j=await r.json() }catch{} return {s:r.status,j}; }catch(e){ return {s:0,j:{e:String(e)}}; } }
(async()=>{
  await loadEnv(); await ensure();
  // unauth -> 401
  for (const [m,u,b] of [
    ["POST","/api/log/bg",{value_mgdl:111}],
    ["POST","/api/log/water",{amount_ml:200}],
    ["POST","/api/log/meal",{items:[{name:"Egg"}],taken_at:new Date().toISOString()}],
    ["POST","/api/log/insulin",{dose_units:1,type:"bolus"}],
    ["POST","/api/log/weight",{weight_kg:70}],
    ["POST","/api/log/bp",{systolic:120,diastolic:80}],
    ["GET","/api/chart/bg_avg?range=7d",null],
  ]) {
    const {s}=await call(m,u,b); push(`unauth ${m} ${u}`, s===401?"PASS":"FAIL", `status=${s}`);
  }
  // auth header -> expect 200/201 OR DB_NOT_READY (pre-SQL)
  const H={"x-debug-user-id":DEV_UID};
  for (const [m,u,b] of [
    ["POST","/api/log/bg",{value_mgdl:123,tag:"fasting",taken_at:new Date().toISOString()}],
    ["POST","/api/log/water",{amount_ml:250,taken_at:new Date().toISOString()}],
    ["POST","/api/log/meal",{items:[{name:"Egg"}],taken_at:new Date().toISOString()}],
    ["POST","/api/log/insulin",{dose_units:2,type:"bolus",taken_at:new Date().toISOString()}],
    ["POST","/api/log/weight",{weight_kg:68.5,taken_at:new Date().toISOString()}],
    ["POST","/api/log/bp",{systolic:118,diastolic:76,pulse:70,taken_at:new Date().toISOString()}],
    ["GET","/api/chart/bg_avg?range=7d",null],
  ]) {
    const {s,j}=await call(m,u,b,H);
    if (s===200||s===201) push(`auth ${m} ${u}`,"PASS",`status=${s}`); else if (s===500) push(`auth ${m} ${u}`,"DB_NOT_READY","pre-SQL"); else push(`auth ${m} ${u}`,"FAIL",`status=${s}`);
  }
  const ok=await call("GET",`/api/profile/${DEV_UID}`,null,H);
  push("profile self", ok.s===200?"PASS": ok.s===500?"DB_NOT_READY":"FAIL", `status=${ok.s}`);
  const forb=await call("GET","/api/profile/00000000-0000-0000-0000-000000000000",null,H);
  push("profile wrongId", forb.s===403?"PASS":"FAIL", `status=${forb.s}`);
  const sum=results.reduce((a,r)=>(a[r.s]=(a[r.s]||0)+1,a),{});
  const md=["# Pre-SQL Smoke","", ...results.map(r=>`- ${r.s==='PASS'?'✅':r.s==='FAIL'?'❌':'🟡'} ${r.n} — ${r.s}${r.i?` · ${r.i}`:''}`)].join("\n");
  await fs.writeFile("SMOKE_REPORT.md",md,"utf8"); console.log(md);
})();