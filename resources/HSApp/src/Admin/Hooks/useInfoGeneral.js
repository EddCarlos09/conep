import { useState, useEffect } from 'react';
import CVDataService from "../../Services/CongresoVisible/CongresoVisible.Service";
import infoSitioDataService from "../../Services/General/informacionSitio.Service";

export const useInfoGeneral = () => {
    const [state, setState] = useState([]);
    const [loading, setLoading] = useState(false);
    const [observacionesLegales, setobservacionesLegales] = useState("");

    useEffect(() => {
        setLoading(true);
        CVDataService.getAll()
            .then((response) => {
                setState(response.data[0]);
            })
            .catch((e) => {
                console.error(e);
            }).finally(setLoading(false))

        infoSitioDataService.getInformacionSitioHome()
            .then((response) => {
                setobservacionesLegales(response.data[0].observacionesLegales);                
            })
            .catch((e) => {
                console.error(e);
            });
    }, []);
    return { state, loading,observacionesLegales};
}