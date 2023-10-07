import http from "../../Http/Http-processcommon";
import http2 from "../../Http/Http-processcommon2";
import apibase from "../../Http/Http-apibase";
const NombreDelModulo = "balancecuatrienio";
const Utils = "utils";

class DetalleBalanceCuatrienioDataService {
    async get(id) {
        return await http.get(`/${NombreDelModulo}/${id}`);
    }
    async getInformeById(id) {
        return await http.get(`/${NombreDelModulo}/getInformeById/${id}`);
    }
    async getAllInformes(idFilter, id, equipo, publicacion, concepto, search='', page=1, rows=4){
        return await http.get(`/${NombreDelModulo}/getInformes/${id}?idFilter=${idFilter}&equipo=${equipo}&publicacion=${publicacion}&concepto=${concepto}&search=${search}&page=${page}&rows=${rows}`);                
    } 
    async getTotalRecordsInformes(idFilter, id, equipo, publicacion, concepto, search='') {
        return await http.get(
            `/${NombreDelModulo}/totalrecordsInformes/${id}?idFilter=${idFilter}&equipo=${equipo}&publicacion=${publicacion}&concepto=${concepto}&search=${search}`
        );
    }
    async getComboEquipoCVByType(tipo) {
        return await apibase.get(`/${Utils}/getComboEquipoCVByType?tipo=${tipo}`);
    }
    async getComboTipoPublicacion() {
        return await apibase.get(`/${Utils}/getComboTipoPublicacion`);
    }
    async getComboGlosarioLegislativoByType(tipo) {
        return await apibase.get(`/${Utils}/getComboGlosarioLegislativoByType?tipo=${tipo}`);
    }
}

export default new DetalleBalanceCuatrienioDataService();
