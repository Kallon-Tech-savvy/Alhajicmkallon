import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { once } from 'node:events';
import { createProtocolLab } from '../public/downloads/protocol-lab.mjs';

const index = JSON.parse((await readFile(new URL('../src/lib/protocol-course.ts',import.meta.url),'utf8')).match(/= ([\s\S]+) as const;/)[1]);
test('course publishes twelve substantial lessons with usable checkpoints and cross-links',async()=>{
  assert.equal(index.length,12);
  assert.equal(new Set(index.map(x=>x.slug)).size,12);
  for(const lesson of index){
    const text=await readFile(new URL(`../content/knowledge/${lesson.slug}.md`,import.meta.url),'utf8');
    assert.match(text,/status: "published"/);
    assert.match(text,/## Problem and scope/);
    assert.match(text,/## (Failure analysis|Walk through the difficult moments)/);
    assert.match(text,/## (Assessment)/);
    assert.match(text,/## Sources/);
    assert.ok(text.split(/\s+/).length>=300,`${lesson.slug} needs a complete lesson`);
    for(const match of text.matchAll(/\]\(\/knowledge\/([^\)#]+)\)/g)) if(match[1]!=='protocols') await readFile(new URL(`../content/knowledge/${match[1]}.md`,import.meta.url));
  }
});

test('local fixture demonstrates status, cache, access, validation, retries and SSE',async()=>{
  const server=createProtocolLab();
  server.listen(0,'127.0.0.1'); await once(server,'listening');
  const base=`http://127.0.0.1:${server.address().port}`;
  const token={Authorization:'Bearer studio-a'};
  try{
    let r=await fetch(`${base}/catalog`); assert.equal(r.status,200); assert.equal(r.headers.get('etag'),'"catalog-v1"');
    r=await fetch(`${base}/catalog`,{headers:{'If-None-Match':'"catalog-v1"'}});assert.equal(r.status,304);
    assert.equal((await fetch(`${base}/missing`)).status,404);
    assert.equal((await fetch(`${base}/failure`)).status,503);
    assert.equal((await fetch(`${base}/galleries`)).status,401);
    r=await fetch(`${base}/galleries/gallery-a`,{headers:{Authorization:'Bearer studio-b'}});assert.equal(r.status,404);
    r=await fetch(`${base}/galleries`,{headers:token});assert.equal((await r.json()).length,1);assert.equal(r.headers.get('cache-control'),'no-store');
    r=await fetch(`${base}/galleries`,{method:'OPTIONS',headers:{Origin:'http://localhost:3000'}});assert.equal(r.status,204);assert.equal(r.headers.get('access-control-allow-origin'),'http://localhost:3000');
    assert.equal((await fetch(`${base}/galleries`,{method:'OPTIONS',headers:{Origin:'https://example.invalid'}})).status,403);
    const options={method:'POST',headers:{...token,'Content-Type':'application/json','Idempotency-Key':'test-1'},body:JSON.stringify({title:'Portraits'})};
    const results=await Promise.all([fetch(`${base}/galleries`,options),fetch(`${base}/galleries`,options)]);
    assert.deepEqual(results.map(x=>x.status).sort(),[200,201]);
    const records=await Promise.all(results.map(x=>x.json()));assert.equal(records[0].id,records[1].id);
    assert.equal((await fetch(`${base}/galleries`,{...options,body:JSON.stringify({title:'Changed'})})).status,409);
    assert.equal((await fetch(`${base}/galleries`,{...options,body:'{broken'})).status,400);
    // Losing the reply must not erase the committed record.
    await assert.rejects(fetch(`${base}/galleries?delay=1500`,{...options,headers:{...options.headers,'Idempotency-Key':'lost-reply'},signal:AbortSignal.timeout(100)}));
    r=await fetch(`${base}/galleries`,{...options,headers:{...options.headers,'Idempotency-Key':'lost-reply'}});assert.equal(r.status,200);
    const stream=await fetch(`${base}/events`,{headers:token});const events=await stream.text();assert.equal((events.match(/event: progress/g)||[]).length,3);
  }finally{server.closeAllConnections();await new Promise(resolve=>server.close(resolve));}
});
