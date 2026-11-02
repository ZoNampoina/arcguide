export type Guide={id:string;category:string;title:string;tool:string;path:string;summary:string;steps:string[];tip:string;verify:string;common:string;keywords:string[];source:string;review:string;level:string};
export function normalize(s:string){return s.toLocaleLowerCase('fr').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,' ').trim()}
const aliases:Record<string,string[]>={
 'layout':['mise en page','geler','freeze','map frame','carte indépendante'],
 'points':['point','xy','coordonnees','gps'],
 'polygone':['perimetre','zone','surface'],
 'etiquettes':['labels','label','etiquetage'],
 'projeter':['reprojection','project','transformation'],
 'coupe':['decoupe','clip'],
 'permis':['pr','pe','aerp','minier','carres'],
 'table':['tableau','excel','csv','attributs']
};
export function getWords(query:string){const a=normalize(query).split(' ').filter(Boolean);const terms=new Set(a);for(const [key,items] of Object.entries(aliases)){const k=normalize(key);if(a.includes(k)||items.some(i=>normalize(i)===normalize(query))){items.forEach(i=>normalize(i).split(' ').forEach(w=>terms.add(w)));terms.add(k)}}return Array.from(terms)}
export function scoreGuide(g:Guide,q:string){const query=normalize(q);if(!query)return 1;
 const title=normalize(g.title),tool=normalize(g.tool),cat=normalize(g.category),keywords=normalize(g.keywords.join(' ')),body=normalize(`${g.summary} ${g.path} ${g.steps.join(' ')} ${g.tip} ${g.common}`);
 let score=0;if(title.includes(query))score+=40;if(tool.includes(query))score+=36;if(keywords.includes(query))score+=23;if(cat.includes(query))score+=15;
 const words=getWords(q);let hits=0;for(const w of words){if(w.length<2)continue;if(title.includes(w)){score+=10;hits++}else if(tool.includes(w)){score+=9;hits++}else if(keywords.includes(w)){score+=7;hits++}else if(body.includes(w)){score+=3;hits++}}
 if(hits===0)return 0;if(hits>=Math.min(2,words.length))score+=10;return score;
}
export function findGuides(guides:Guide[],q:string,category='Tous'){return guides.filter(g=>category==='Tous'||g.category===category).map(g=>({g,score:scoreGuide(g,q)})).filter(x=>x.score>0).sort((a,b)=>b.score-a.score||a.g.title.localeCompare(b.g.title,'fr')).map(x=>x.g)}