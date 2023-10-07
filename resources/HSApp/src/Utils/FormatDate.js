export let DateFormatMySql=(Dt)=>{
    let dt=new Date(Dt);
return dt.getFullYear() + "-" + (dt.getMonth() + 1) + "-" + dt.getDate()
}
export let DateTimeFormatMySql=(Dt)=>{
    if(typeof Dt === 'object'){
        let dt=new Date(Dt);
        return dt.toISOString().slice(0, 19).replace('T', ' ')
    }else{
        return Dt
    }
}