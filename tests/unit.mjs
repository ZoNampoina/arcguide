import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {findGuides,normalize} from '../dist/assets/search.js';
import {validateBackup,makeBackup,defaults} from '../dist/assets/store.js';
const guides=JSON.parse(readFileSync(new URL('../dist/guides.json',import.meta.url),'utf8'));
assert.equal(guides.length,40);assert.equal(new Set(guides.map(x=>x.category)).size,9);
assert.equal(normalize('Étiquettes à l’intérieur'),'etiquettes a l interieur');
for(const [q,id] of [['geler mon layout','MAP-002'],['coordonnées excel','TAB-001'],['Laborde Madagascar','CRS-004'],['carrés miniers','MINE-001'],['étiquettes points périmètre','LBL-002'],['select by location','SEL-001']]){
const top=findGuides(guides,q).slice(0,5).map(x=>x.id);assert.ok(top.includes(id),`${q} : ${top}`);
}
assert.equal(findGuides(guides,'','SIG minier Madagascar').length,5);
const b=makeBackup(defaults);assert.deepEqual(validateBackup(b),defaults);
assert.throws(()=>validateBackup({format:'wrong',version:1,data:{}}));
assert.throws(()=>validateBackup({format:'arcguide-backup',version:1,data:{notes:[{body:'x'}]}}));
console.log('Tests unitaires ARCGUIDE OK');
