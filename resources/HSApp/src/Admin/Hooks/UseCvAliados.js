import { useState, useEffect } from 'react';
import CVDataService from "../../Services/CongresoVisible/CongresoVisible.Service";

export const useCvAliados = () => {
    const [state, setState] = useState([]);
    
    useEffect(() => {                          
        CVDataService.getAliado()
            .then((response) => {
                setState(response.data);
            }).catch((e) => { console.log(e); })       
    }, []);
    return { state};
}