export const fmt=(d:Date)=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
export const parse=(s:string)=>{const [y,m,d]=s.split('-').map(Number);return new Date(y,m-1,d)};
export const addDays=(s:string,n:number)=>{const d=parse(s);d.setDate(d.getDate()+n);return fmt(d)};
export const today=()=>fmt(new Date());
const DN=['SUN','MON','TUE','WED','THU','FRI','SAT'];
export const workdays=(a:string,b:string,days:string[])=>{const out:string[]=[];for(let d=a;d<=b;d=addDays(d,1))if(days.includes(DN[parse(d).getDay()]))out.push(d);return out};
export const pretty=(s:string)=>parse(s).toLocaleDateString(undefined,{weekday:'short',month:'short',day:'numeric'});
