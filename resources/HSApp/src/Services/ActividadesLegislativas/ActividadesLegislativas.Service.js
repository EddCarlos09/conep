import http from "../../Http/Http-processcommon";
import http2 from "../../Http/Http-processcommon2";
import apibase from "../../Http/Http-apibase";
const NombreDelModulo = "actividadeslegislativas";
const Utils = "utils";

class ActividadesLegislativasDataService {
    async getAllAgenda(idFilter, fecha,search='', page=1, rows=4,idtactividad=-1,idcomision= -1){
        return await http.get(`/${NombreDelModulo}/getAgenda?idFilter=${idFilter}&fecha=${fecha}&search=${search}&page=${page}&rows=${rows}&idtactividad=${idtactividad}&idcomision=${idcomision}`);                
    } 
    async getAgendaDetalle(id){
        return await http.get(`/actividadeslegislativas/getDetalle/${id}`);                
    } 
    async getTotalRecordsAgenda(idFilter, fecha,search='', idtactividad=-1,idcomision= -1) {
        return await http.get(
            `/${NombreDelModulo}/totalrecordsAgenda?idFilter=${idFilter}&fecha=${fecha}&search=${search}&idtactividad=${idtactividad}&idcomision=${idcomision}`
        );
    }
    async getAllVotaciones(idFilter, corporacion, legislatura, cuatrienio, comision, search='', page=1, rows=4){
        return await http.get(`/${NombreDelModulo}/getVotaciones?idFilter=${idFilter}&corporacion=${corporacion}&legislatura=${legislatura}&cuatrienio=${cuatrienio}&comision=${comision}&search=${search}&page=${page}&rows=${rows}`);
    } 
    async getTotalRecordsVotaciones(idFilter, corporacion, legislatura, cuatrienio, comision, search='') {
        return await http.get(
            `/${NombreDelModulo}/totalrecordsVotaciones?idFilter=${idFilter}&corporacion=${corporacion}&legislatura=${legislatura}&cuatrienio=${cuatrienio}&comision=${comision}&search=${search}`
        );
    }
    async getAllControlPolitico(idFilter, corporacion, legislatura, cuatrienio, comision, tema, estado, search='', page=1, rows=4){
        return await http.get(`/${NombreDelModulo}/getControlPolitico?idFilter=${idFilter}&corporacion=${corporacion}&legislatura=${legislatura}&cuatrienio=${cuatrienio}&comision=${comision}&estado=${estado}&tema=${tema}&search=${search}&page=${page}&rows=${rows}`);                
    } 
    async getTotalRecordsControlPolitico(idFilter, corporacion, legislatura, cuatrienio, comision, tema, estado, search='') {
        return await http.get(
            `/${NombreDelModulo}/totalrecordsControlPolitico?idFilter=${idFilter}&corporacion=${corporacion}&legislatura=${legislatura}&cuatrienio=${cuatrienio}&comision=${comision}&estado=${estado}&tema=${tema}&search=${search}`
        );
    }
    async getAllElecciones(idFilter, corporacion, cuatrienio, comision, search='', page=1, rows=4){
        return await http.get(`/${NombreDelModulo}/getElecciones?idFilter=${idFilter}&corporacion=${corporacion}&cuatrienio=${cuatrienio}&comision=${comision}&search=${search}&page=${page}&rows=${rows}`);                
    } 
    async getTotalRecordsElecciones(idFilter, corporacion, cuatrienio, comision, search='') {
        return await http.get(
            `/${NombreDelModulo}/totalrecordsElecciones?idFilter=${idFilter}&corporacion=${corporacion}&cuatrienio=${cuatrienio}&comision=${comision}&search=${search}`
        );
    }
    async getAllPartidos(idFilter, search='', page=1, rows=4){
        return await http.get(`/${NombreDelModulo}/getPartidos?idFilter=${idFilter}&search=${search}&page=${page}&rows=${rows}`);                
    } 
    async getTotalRecordsPartidos(idFilter, search='') {
        return await http.get(
            `/${NombreDelModulo}/totalrecordsPartidos?idFilter=${idFilter}&search=${search}`
        );
    }
    async getComboTipoRespuestaVotacion() {
        return await apibase.get(`/${Utils}/getComboTipoRespuestaVotacion`);
    }
    async getComboLegislatura(cuatrienio) {
        return await apibase.get(`/${Utils}/getComboLegislatura?cuatrienio=${cuatrienio}`);
    }
    async getComboCuatrienio() {
        return await apibase.get(`/${Utils}/getComboCuatrienio`);
    }
    async getComboTipoComision(idCorporacion) {
        return await apibase.get(`/${Utils}/getComboTipoComision?idcorporacion=${idCorporacion}`);
    }
    async getComboComisiones(idTipoComision) {
        return await apibase.get(`/${Utils}/getComboComisiones?idtipocomision=${idTipoComision}`);
    }
    async getComboCorporacion() {
        return await apibase.get(`/${Utils}/getComboCorporacion`);
    }
    async getComboEstadoControlPolitico() {
        return await apibase.get(`/${Utils}/getComboEstadoControlPolitico`);
    }
    async getComboTemaControlPolitico() {
        let data = {nombre: ''}
        return await apibase.post(`/${Utils}/getComboTemaControlPoliticoFilter`,data);
    }    
    async getTotalRecordsAgendaActividad(idFilter, search='',fecha, idtactividad=-1,idcomision= -1) {
        return await http.get(
            `/actividadeslegislativas/totalrecordsAgendaActividad?idFilter=${idFilter}&search=${search}&fecha=${fecha}&idtactividad=${idtactividad}&idcomision=${idcomision}`);
    }
    async getAgendaLegislativaByFecha(idFilter, search='', page=1, rows=4,fecha,idtactividad=-1,idcomision= -1){
        return await http.get(`/actividadeslegislativas/getAgendaActividad?idFilter=${idFilter}&search=${search}&page=${page}&rows=${rows}&fecha=${fecha}&idtactividad=${idtactividad}&idcomision=${idcomision}`);
    }
    async getDataByYearAndMonth(year, month,destacado = 0){
        return await http.get(`/${NombreDelModulo}/getDataByYearAndMonth?year=${year}&month=${month}&destacado=${destacado}`);                
    }
    async getComboTipoActividadAgenda() {
        return await apibase.get(`/utils/getComboTipoActividadAgenda`);
    }
}

export default new ActividadesLegislativasDataService();
