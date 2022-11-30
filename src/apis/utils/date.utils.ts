import moment from "moment";


export const  DateFormate = (date:string)=>    
     date ? moment(date).format('lll'):"_";


export const getLastDaysFrom = (date:string)=>
     moment(date).startOf('day').fromNow();    
