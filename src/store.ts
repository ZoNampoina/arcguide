export type PersonalNote={id:string;title:string;body:string;tags:string;updated:number};
export type Checklist={ [key:string]:boolean };
export type Preferences={ theme:'auto'|'dark'|'light'; compact:boolean };
export type UserData={favorites:string[];history:string[];notes:PersonalNote[];checklist:Checklist;preferences:Preferences};
export const defaults:UserData={favorites:[],history:[],notes:[],checklist:{},preferences:{theme:'auto',compact:false}};
const DB_NAME='arcguide-personal';
const DB_VERSION=1;
const STORE='preferences';
let dbPromise:Promise<IDBDatabase>|undefined;
function openDB():Promise<IDBDatabase>{
 if(!('indexedDB' in window))return Promise.reject(new Error('IndexedDB indisponible'));
 if(dbPromise)return dbPromise;
 dbPromise=new Promise((resolve,reject)=>{
  const req=indexedDB.open(DB_NAME,DB_VERSION);
  req.onupgradeneeded=()=>{const db=req.result;if(!db.objectStoreNames.contains(STORE))db.createObjectStore(STORE)};
  req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error);
 });return dbPromise;
}
function readKV(key:string):Promise<unknown>{return openDB().then(db=>new Promise((resolve,reject)=>{
 const tx=db.transaction(STORE,'readonly');const req=tx.objectStore(STORE).get(key);
 req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error);
}));}
function writeKV(key:string,value:unknown):Promise<void>{return openDB().then(db=>new Promise((resolve,reject)=>{
 const tx=db.transaction(STORE,'readwrite');tx.objectStore(STORE).put(value,key);
 tx.oncomplete=()=>resolve();tx.onerror=()=>reject(tx.error);
}));}
function listString(x:unknown):string[]{return Array.isArray(x)?Array.from(new Set(x.filter(v=>typeof v==='string').slice(0,5000))):[]}
export function validateBackup(x:unknown):UserData{
 if(!x||typeof x!=='object')throw Error('Fichier de sauvegarde invalide.');
 const o=x as Record<string,unknown>;
 if(o.format!=='arcguide-backup'||o.version!==1||!o.data||typeof o.data!=='object')throw Error('Format ou version de sauvegarde non pris en charge.');
 const d=o.data as Record<string,unknown>;
 if(!Array.isArray(d.notes)||d.notes.length>3000)throw Error('Liste de notes invalide.');
 const notes:PersonalNote[]=d.notes.map((value,i)=>{
  if(!value||typeof value!=='object')throw Error(`Note ${i+1} invalide.`);
  const n=value as Record<string,unknown>;
  if(typeof n.id!=='string'||typeof n.title!=='string'||typeof n.body!=='string'||typeof n.tags!=='string'||n.title.length>250||n.body.length>100000)throw Error(`Note ${i+1} invalide.`);
  return {id:n.id.slice(0,150),title:n.title,body:n.body,tags:n.tags.slice(0,1500),updated:typeof n.updated==='number'&&Number.isFinite(n.updated)?n.updated:0};
 });
 const c:Checklist={};if(d.checklist&&typeof d.checklist==='object'&&!Array.isArray(d.checklist)){for(const [k,v] of Object.entries(d.checklist)){if(k.length<150&&typeof v==='boolean')c[k]=v}}
 const p=d.preferences&&typeof d.preferences==='object'?d.preferences as Record<string,unknown>:{};
 const theme:Preferences['theme']=p.theme==='dark'||p.theme==='light'?p.theme:'auto';
 return {favorites:listString(d.favorites),history:listString(d.history).slice(0,40),notes,checklist:c,preferences:{theme,compact:!!p.compact}};
}
export async function loadData():Promise<UserData>{
 try{const d=await readKV('user-data');if(!d)return structuredClone(defaults);
 const r=validateBackup({format:'arcguide-backup',version:1,data:d});return r;
 }catch(e){console.error('ARCGUIDE storage load failed',e);return structuredClone(defaults)}
}
export async function saveData(data:UserData):Promise<void>{await writeKV('user-data',data)}
export function makeBackup(data:UserData){return {format:'arcguide-backup',version:1,createdAt:new Date().toISOString(),data:structuredClone(data)}}