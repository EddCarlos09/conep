export let DateFormatMySql=(Dt)=>{
    if(typeof Dt === 'object'){
        let dt=new Date(Dt);
        return dt.getFullYear() + "-" + String(dt.getMonth() + 1).padStart(2, '0') + "-" + String(dt.getDate()).padStart(2, '0')
    }else{
        return Dt
    }
}
export let DateTimeFormatMySql=(Dt)=>{
    if(typeof Dt === 'object'){
        let dt=new Date(Dt);
        return dt.toISOString().slice(0, 19).replace('T', ' ')
    }else{
        return Dt
    }
}
export let YearFormatMySql=(Dt)=>{
    let dt=new Date(Dt);
return dt.getFullYear()
}
export let TimeFormatMySql=(Dt)=>{
    let dt=new Date(Dt);
        return String(dt.getHours()).padStart(2, '0') + ":" + String(dt.getMinutes()).padStart(2, '0')+":"+"00"
}
