// 06 · Röktest-mätning: laddar system/_smoke.html i Chromium vid 390/768/1440 och läser
//   (a) att alla 101 --ap*-tokens + fix + tillägg resolvar på :root (ingen tom sträng),
//   (b) getComputedStyle för varje typroll (font-size/weight/line-height/letter-spacing/font-family),
//   (c) alla --ampy-text-*/--ampy-space-*/--ampy-radius-* i px via ett mätelement.
// Kör: node konsolidering/_probes/06-smoke-matt.mjs   → konsolidering/_probes/out/smoke-matt.json
import { chromium } from '/Users/juliuscallahan/Desktop/Claude Code/ampy-designsystem/tools/node_modules/playwright/index.mjs';
import { createServer } from 'http';
import { readFile, stat, writeFile } from 'fs/promises';
import { resolve, join, extname, dirname } from 'path';
import { fileURLToPath } from 'url';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const mime = { '.html':'text/html; charset=utf-8', '.css':'text/css', '.woff2':'font/woff2', '.json':'application/json' };
const server = createServer(async (req,res)=>{ try{ const p=decodeURIComponent(new URL(req.url,'http://x').pathname); let fp=join(root,p); if((await stat(fp)).isDirectory()) fp=join(fp,'index.html'); res.writeHead(200,{'content-type':mime[extname(fp)]||'application/octet-stream'}); res.end(await readFile(fp)); }catch{ res.writeHead(404); res.end(); } });
await new Promise(r=>server.listen(0,r)); const port=server.address().port;
const lager1 = JSON.parse(await readFile(join(root,'konsolidering/_probes/out/lager1-ap-tokens.json'),'utf8')).tokens.map(t=>t.name);
const live = JSON.parse(await readFile(join(root,'inventering/live-ampy-se.json'),'utf8')).tokens_live;
const browser = await chromium.launch(); const out={};
for (const w of [390,768,1440]) {
  const page = await browser.newPage({ viewport:{width:w,height:1000} });
  const errors=[]; page.on('pageerror',e=>errors.push(String(e))); page.on('console',m=>{ if(m.type()==='error') errors.push(m.text()); });
  await page.goto(`http://localhost:${port}/system/_smoke.html`,{waitUntil:'networkidle'}); await page.waitForTimeout(300);
  const r = await page.evaluate(({names})=>{
    const cs=getComputedStyle(document.documentElement);
    const tokens={}; const missing=[];
    for (const n of names){ const v=cs.getPropertyValue(n).trim(); tokens[n]=v; if(!v) missing.push(n); }
    // alla --ampy-* och tilläggs-ap ur stylesheetet
    const all={}; for (const sh of document.styleSheets){ try{ for(const rule of sh.cssRules){ if(rule.style) for(const p of rule.style){ if(p.startsWith('--')) all[p]=cs.getPropertyValue(p).trim(); } } }catch(e){} }
    // px-mätning: sätt en div:s width till var(--x) och läs getBoundingClientRect
    const m=document.createElement('div'); m.style.position='absolute'; m.style.visibility='hidden'; document.body.appendChild(m);
    const px={}; for (const p of Object.keys(all)){ if(/^--(ampy-(text|space|radius|gutter|container)|apspace|aptext|apradius)/.test(p)){ m.style.width=`var(${p})`; const v=m.getBoundingClientRect().width; px[p]=Math.round(v*100)/100; } }
    m.remove();
    const roles={}; for (const el of document.querySelectorAll('[data-role]')){ const s=getComputedStyle(el); roles[el.dataset.role]={fontSize:parseFloat(s.fontSize), fontWeight:s.fontWeight, lineHeight:s.lineHeight, letterSpacing:s.letterSpacing, fontFamily:s.fontFamily.split(',')[0], color:s.color}; }
    const body=getComputedStyle(document.body);
    return { missing, tokensCount:Object.keys(tokens).length, px, roles, body:{fontSize:body.fontSize, fontWeight:body.fontWeight, lineHeight:body.lineHeight, color:body.color, fontFamily:body.fontFamily.split(',')[0]}, fontsLoaded: document.fonts.check('16px Outfit'), docH: document.documentElement.scrollHeight, overflowX: document.documentElement.scrollWidth>document.documentElement.clientWidth };
  }, {names: lager1});
  r.errors=errors; out[w]=r; await page.close();
}
await browser.close(); server.close();
// jämför lager 1 mot live-mätningen (px_at_1440 / px_at_390)
const diff=[];
for (const t of live){ const n=t.name; for (const [w,key] of [[1440,'px_at_1440'],[390,'px_at_390']]){ if(typeof t[key]==='number' && out[w].px[n]!==undefined){ const d=Math.abs(out[w].px[n]-t[key]); if(d>0.6 && n!=='--apspace-4xs') diff.push({token:n, w, live:t[key], smoke:out[w].px[n]}); } } }
out.lager1_vs_live = { jamforda: live.filter(t=>typeof t.px_at_1440==='number').length, avvikelser: diff, notering: '--apspace-4xs avviker medvetet (fix 1b: 5.19 -> 4.9/5.2)' };
await writeFile(join(root,'konsolidering/_probes/out/smoke-matt.json'), JSON.stringify(out,null,1));
for (const w of [390,768,1440]) console.log(w, 'missing ap*:', out[w].missing.length, 'errors:', out[w].errors, 'fonts:', out[w].fontsLoaded, 'overflowX:', out[w].overflowX, 'docH:', out[w].docH);
console.log('roles@1440', JSON.stringify(out[1440].roles,null,0));
console.log('roles@390', JSON.stringify(out[390].roles,null,0));
console.log('lager1 vs live avvikelser:', JSON.stringify(out.lager1_vs_live.avvikelser));
