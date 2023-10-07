import http from "../../Http/Http-processcommon";
import http2 from "../../Http/Http-processcommon2";
import apibase from "../../Http/Http-apibase";
const comisiones = "comisiones";
const Utils = "utils";

class ComisionDataService{
    async getAll(
        idFilter,
        corporacion,
        tipoComision,
        search = "",
        page = 1,
        rows = 4
    ) {
        return await http.get(
            `/comisions?idFilter=${idFilter}&corporacion=${corporacion}&tipoComision=${tipoComision}&search=${search}&page=${page}&rows=${rows}`
        );
    }
    async getTotalRecordsComision(idFilter, corporacion, tipoComision, search) {
        return await http.get(
            `/comisions/totalrecords?idFilter=${idFilter}&corporacion=${corporacion}&tipoComision=${tipoComision}&search=${search}`
        );
    }
    async get(id) {
        return await http.get(`/comisions/${id}`);
    }
    async getControlPoliticoFilter(nombre, comision){
        return await http.get(`comisions/getControlPoliticoFilter?nombre=${nombre}&comision=${comision}`);
    }
    async getProyectoLeyFilter(nombre, comision){
        return await http.get(`comisions/getProyectoLeyFilter?nombre=${nombre}&comision=${comision}`);
    }
    async getSecretariosFilter(nombre, comision){
        return await http.get(`comisions/getSecretariosFilter?nombre=${nombre}&comision=${comision}`);
    }
    async getMiembrosFilter(nombre, comision, partido, mesa){
        return await http.get(`comisions/getMiembrosFilter?nombre=${nombre}&comision=${comision}&partido=${partido}&mesa=${mesa}`);
    }
    async getTotalRecordsAgendaActividad(idFilter, search='',fecha, idactividad=-1,idcomision= -1,idcorporacion=-1) {
        return await http.get(
            `/comisions/totalrecordsAgendaActividad?idFilter=${idFilter}&search=${search}&fecha=${fecha}&idactividad=${idactividad}&idcomision=${idcomision}&idcorporacion=${idcorporacion}`);
    }
    async getAgendaLegislativaByFecha(idFilter, search='', page=1, rows=4,fecha,idactividad=-1,idcomision= -1,idcorporacion=-1){
        return await http.get(`/comisions/getAgendaActividad?idFilter=${idFilter}&search=${search}&page=${page}&rows=${rows}&fecha=${fecha}&idactividad=${idactividad}&idcomision=${idcomision}&idcorporacion=${idcorporacion}`);
    }
    async getDataByYearAndMonth(year, month,idactividad=-1,idcomision= -1,idcorporacion=-1){
        return await http.get(`/comisions/getDataByYearAndMonth?year=${year}&month=${month}&idactividad=${idactividad}&idcomision=${idcomision}&idcorporacion=${idcorporacion}`);                
    }
}

export default new ComisionDataService();

