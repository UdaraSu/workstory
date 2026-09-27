import {addDays,today,workdays} from './dates';
import {DailyEntry,InternshipDetails,InternshipProject,StudentProfile} from '@/types';
export const seedProfile:StudentProfile={name:'Alex Perera',university:'State University',studentId:'CS/2021/042',degree:'BSc Computer Science',faculty:'Faculty of Engineering',email:'alex@example.edu'};
const t=today(),start=addDays(t,-24);
export const seedInternship:InternshipDetails={companyName:'Nimbus Labs',position:'Software Engineering Intern',department:'Backend Platform',startDate:start,endDate:addDays(start,168),workingDays:['MON','TUE','WED','THU','FRI'],expectedHours:40,status:'ACTIVE'};
export const seedProjects:InternshipProject[]=[
{id:'p1',name:'Attendance Service',description:'REST API for staff attendance tracking.',technologies:['REST_API','SQL','Docker'],startDate:start,status:'IN_PROGRESS'},
{id:'p2',name:'Mobile Companion App',description:'Flutter app consuming the attendance API.',technologies:['Flutter','REST_API'],startDate:addDays(start,10),status:'IN_PROGRESS'}];
const T:[string,string[],string[],string,string,string][]=[
['Fixed attendance API bug and met backend team',['Fixed a bug in the attendance API','Met the backend team to review open tickets'],['REST_API','Debugging'],'Intermittent 500 errors on check-in','Traced it to a null timezone field and added validation','Structured error logging shortens debugging'],
['Wrote SQL migrations and tested locally with Docker',['Wrote SQL migrations for the leave table','Ran the stack locally with Docker'],['SQL','Docker'],'Migration failed on foreign keys','Reordered migrations','Migration ordering matters'],
['Built login screen in Flutter, sync call with mentor',['Built the login screen in Flutter','Joined a sync call with my mentor'],['Flutter'],'State not persisting between screens','Moved to a shared provider','Basics of state management in Flutter'],
['Code review on Git pull request, added unit tests',['Responded to code review comments','Added unit tests for the leave endpoint'],['Git','Testing'],'','','Writing testable service functions']];
export const seedEntries=():DailyEntry[]=>workdays(start,addDays(t,-1),seedInternship.workingDays).flatMap((d,i)=>{
 if(i%4===2)return [];const x=T[i%T.length];
 return [{id:d,date:d,quickNote:x[0],activities:[...x[1]],technologies:[...x[2]],challenges:x[3],solutions:x[4],learning:x[5],meetings:'',status:'COMPLETED' as const,tags:[...x[2]],projectId:i%2?'p2':'p1',aiGenerated:true}]});
