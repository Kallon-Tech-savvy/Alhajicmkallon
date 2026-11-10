import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
execFileSync(process.execPath,['scripts/build-protocol-offline.mjs']);
const html=await readFile('public/downloads/protocol-course-offline.html','utf8');
test('offline guide includes twelve complete lessons, native answer disclosures and lab source',()=>{
 assert.equal((html.match(/<article id="protocols-/g)||[]).length,12);
 assert.equal((html.match(/<details/g)||[]).length,12);
 for(const marker of ['createProtocolLab','Idempotency requires an atomic decision','Assumptions and limits','Content revision','Practice notebook'])assert.ok(html.includes(marker),marker);
});
test('offline content has no runtime or external asset requirement',()=>{
 assert.doesNotMatch(html,/<script|<link|<iframe|<img|\ssrc=|@import/i);
 assert.doesNotMatch(html,/href="\//);
 const ids=[...html.matchAll(/\sid="([^"]+)"/g)].map(m=>m[1]);assert.equal(new Set(ids).size,ids.length,'duplicate anchors');
 for(const match of html.matchAll(/href="#([^"]+)"/g))assert.ok(ids.includes(match[1]),`broken anchor ${match[1]}`);
});
test('notebook has one reusable evidence record for every lesson',async()=>{
 const notebook=await readFile('public/downloads/protocol-practice-notebook.md','utf8');
 assert.equal((notebook.match(/^## \d+\./gm)||[]).length,12);
 assert.equal((notebook.match(/Assumptions and limits:/g)||[]).length,12);
});
test('same sources generate the same snapshot',async()=>{
 execFileSync(process.execPath,['scripts/build-protocol-offline.mjs']);
 assert.equal(await readFile('public/downloads/protocol-course-offline.html','utf8'),html);
});
