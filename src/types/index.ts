export interface StudentProfile{name:string;university:string;studentId:string;degree:string;faculty:string;email:string}
export interface InternshipDetails{companyName:string;position:string;department:string;startDate:string;endDate:string;workingDays:string[];expectedHours:number;status:'ACTIVE'|'PAUSED'|'COMPLETED'}
export interface DailyEntry{id:string;date:string;quickNote:string;activities:string[];technologies:string[];challenges:string;solutions:string;learning:string;meetings:string;status:'COMPLETED'|'MISSING'|'DRAFT';tags:string[];projectId?:string;aiGenerated?:boolean}
export interface InternshipProject{id:string;name:string;description:string;technologies:string[];startDate:string;status:'IN_PROGRESS'|'COMPLETED'}
