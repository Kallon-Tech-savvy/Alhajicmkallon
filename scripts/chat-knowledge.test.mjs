import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import ts from 'typescript';
const knowledge = {};
vm.runInNewContext(ts.transpileModule(await readFile(new URL('../src/lib/Knowledgebase.ts', import.meta.url),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText,{exports:knowledge});
const matcher = {};
vm.runInNewContext(ts.transpileModule(await readFile(new URL('../src/lib/FAQmatcher.ts', import.meta.url),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText,{exports:matcher,require:()=>knowledge});
test('starter questions return useful published facts without an AI dependency',()=>{
  assert.match(matcher.matchFaq('Show me his case studies'),/AEEM.*MJ Studio.*in development/);
  assert.match(matcher.matchFaq('What is his approach?'),/understanding the problem/);
  assert.match(matcher.matchFaq('How can I get in touch?'),/info@alhajikallon.com.*dev@alhajikallon.com/);
});
test('unrelated words do not trigger pricing answers',()=>{
  assert.equal(matcher.matchFaq('The caprice of time'),null);
});
test('knowledge does not publish old email or unsupported project claims',()=>{
  const source=JSON.stringify(knowledge);
  assert.doesNotMatch(source,/hello@|Cryptographic Award|exhaustive performance|WCAG compliance/);
  assert.match(source,/No measured conversion/);
  assert.match(source,/No public phone/);
});
