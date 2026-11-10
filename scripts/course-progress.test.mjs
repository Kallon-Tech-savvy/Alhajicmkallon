import test from 'node:test';
import assert from 'node:assert/strict';
import { parseCourseProgress, togglePractised } from '../src/lib/course-progress.mjs';
const slugs = ['one','two'];
const state = { version:1,enabled:true,last:'one',practised:[] };
test('absence and corrupt storage do not enable remembering',()=>{
  for(const raw of [null,'{broken','null','{}',JSON.stringify({...state,enabled:false}),'x'.repeat(12001)])assert.equal(parseCourseProgress(raw,slugs),null);
});
test('stored paths cannot create arbitrary resume destinations or fake lesson counts',()=>{
  assert.deepEqual(parseCourseProgress(JSON.stringify({...state,last:'https://example.invalid',practised:['one','one','foreign',{},'two']}),slugs),{...state,last:null,practised:['one','two']});
});
test('practice marking is explicit, reversible and bounded to known lessons',()=>{
  const saved=togglePractised(state,'two',slugs);assert.deepEqual(saved.practised,['two']);assert.equal(saved.last,'two');assert.deepEqual(state.practised,[]);
  assert.deepEqual(togglePractised(saved,'two',slugs).practised,[]);assert.equal(togglePractised(state,'foreign',slugs),state);
});
test('recording a visit alone never marks a lesson practised',()=>{
  assert.deepEqual(parseCourseProgress(JSON.stringify({...state,last:'two'}),slugs).practised,[]);
});
