import {DailyEntry,InternshipProject} from '@/types';
const TECH:Record<string,string>={api:'REST_API',flutter:'Flutter',react:'React',sql:'SQL',database:'Database',docker:'Docker',git:'Git',test:'Testing',bug:'Debugging',python:'Python',next:'Next.js',figma:'Figma'};
const cap=(s:string)=>s[0].toUpperCase()+s.slice(1);
export async function generateEntry(note:string):Promise<Partial<DailyEntry>>{
 await new Promise(r=>setTimeout(r,1100));const l=note.toLowerCase();
 const technologies=Array.from(new Set(Object.entries(TECH).filter(([k])=>l.includes(k)).map(([,v])=>v)));
 const activities=note.split(/[.;\n]|\band\b/i).map(s=>s.trim()).filter(s=>s.length>2).map(cap);
 return{activities,technologies,tags:technologies,meetings:/meet|call|standup|sync/.test(l)?'Team discussion mentioned in the note.':'',
  challenges:/bug|fix|issue|error/.test(l)?'An issue described in the note was investigated and resolved.':'',solutions:'',
  learning:technologies.length?`Hands-on practice with ${technologies.join(', ')}.`:'Add what you learned today.'};
}
export function answer(q:string,entries:DailyEntry[],projects:InternshipProject[]):string{
 const l=q.toLowerCase(),done=entries.filter(e=>e.status==='COMPLETED');
 if(l.includes('project'))return projects.length?'Projects so far: '+projects.map(p=>`${p.name} (${p.status.replace('_',' ').toLowerCase()})`).join('; ')+'.':'No projects recorded yet.';
 const m=['january','february','march','april','may','june','july','august','september','october','november','december'].findIndex(x=>l.includes(x));
 if(m>=0){const es=done.filter(e=>+e.date.slice(5,7)===m+1);return es.length?`${es.length} entries that month. Highlights: `+es.slice(0,4).map(e=>e.activities[0]).join('; ')+'.':'No entries found for that month.'}
 const kw=Object.values(TECH).find(v=>l.includes(v.toLowerCase().replace('_',' '))||l.includes(v.toLowerCase()));
 if(l.includes('challenge')){const es=done.filter(e=>e.challenges&&(!kw||e.technologies.includes(kw)));return es.length?es.slice(0,5).map(e=>`${e.date}: ${e.challenges}`).join('\n'):'No matching challenges recorded.'}
 return `You have ${done.length} completed entries. Try asking about a month, your projects, or your challenges.`;
}
