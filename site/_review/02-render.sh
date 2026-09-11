#!/bin/zsh
# Render-loop över alla 26 sidor: node tools/shot.mjs site/<sida>.html _shots/rev-<namn> -> site/_review/out/render.jsonl
cd "$(dirname "$0")/../.."
: > site/_review/out/render.jsonl
for f in $(find site -name "*.html" -not -path "*/_probes/*" -not -name "_mall.html" | sort); do
  name=$(echo "$f" | sed 's#^site/##; s#/#-#g; s#\.html$##')
  out=$(node tools/shot.mjs "$f" "_shots/rev-$name" 2>&1 | tr -d '\n')
  echo "{\"page\":\"$f\",\"name\":\"rev-$name\",\"result\":$out}" >> site/_review/out/render.jsonl
  echo "$name: $(echo $out | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{try{const j=JSON.parse(s);console.log("desktop",j.desktop.height,"ovf",j.desktop.overflowX,"err",j.desktop.errors.length,"| mobile",j.mobile.height,"ovf",j.mobile.overflowX,"err",j.mobile.errors.length)}catch(e){console.log("PARSE FAIL",s.slice(0,200))}})')"
done
