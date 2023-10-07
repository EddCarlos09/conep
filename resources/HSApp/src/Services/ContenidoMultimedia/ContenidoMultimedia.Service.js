import http from "../../Http/Http-processcommon";
import http2 from "../../Http/Http-processcommon2";
import apibase from "../../Http/Http-apibase";
const NombreDelModulo = "contenidomultimedia";
const Utils = "utils";

class ContenidoMultimediaDataService {
    async getAllInformesPNUD(idFilter, search='', page=1, rows=4){
        return await http.get(`/${NombreDelModulo}/getInformesPNUD?idFilter=${idFilter}&search=${search}&page=${page}&rows=${rows}`);                
    } 
    async getTotalRecordsInformesPNUD(idFilter, search='') {
        return await http.get(
            `/${NombreDelModulo}/totalrecordsInformesPNUD?idFilter=${idFilter}&search=${search}`
        );
    }
    async getAllBalanceCuatrienio(idFilter, yearInicio, search = "", page = 1, rows = 4) {
        return await http.get(
            `/${NombreDelModulo}/getBalanceCuatrienio?idFilter=${idFilter}&yearInicio=${yearInicio}&search=${search}&page=${page}&rows=${rows}`
        );
    }
    async getTotalRecordsBalanceCuatrienio(idFilter, yearInicio, search) {
        return await http.get(
            `/${NombreDelModulo}/totalrecordsBalanceCuatrienio?idFilter=${idFilter}&yearInicio=${yearInicio}&search=${search}`
        );
    }
    async getAllOpiniones(idFilter, equipo, tipopublicacion, search='', page=1, rows=4){
        return await http.get(`/${NombreDelModulo}/getOpiniones?idFilter=${idFilter}&equipo=${equipo}&tipopublicacion=${tipopublicacion}&search=${search}&page=${page}&rows=${rows}`);                
    }
    async getTotalRecordsOpiniones(idFilter, equipo, tipopublicacion, search) {
        return await http.get(
            `/${NombreDelModulo}/totalrecordsOpiniones?idFilter=${idFilter}&equipo=${equipo}&tipopublicacion=${tipopublicacion}&search=${search}`
        );
    }
    async getAllOpinionesCongresistas(idFilter, congresista, tipopublicacion, search='', page=1, rows=4){
        return await http.get(`/${NombreDelModulo}/getOpinionesCongresistas?idFilter=${idFilter}&congresista=${congresista}&tipopublicacion=${tipopublicacion}&search=${search}&page=${page}&rows=${rows}`);                
    }
    async getTotalRecordsOpinionesCongresistas(idFilter, congresista, tipopublicacion, search) {
        return await http.get(
            `/${NombreDelModulo}/totalrecordsOpinionesCongresistas?idFilter=${idFilter}&congresista=${congresista}&tipopublicacion=${tipopublicacion}&search=${search}`
        );
    }
    async getAllPodcast(idFilter, search = "", page = 1, rows = 4) {
        return await http.get(
            `/${NombreDelModulo}/getPodcast?idFilter=${idFilter}&search=${search}&page=${page}&rows=${rows}`
        );
    }
    async getTotalRecordsPodcast(idFilter, search) {
        return await http.get(
            `/${NombreDelModulo}/totalrecordsPodcast?idFilter=${idFilter}&search=${search}`
        );
    }
    async getAllMultimedia(idFilter, multimedia, search='', page=1, rows=4){
        return await http.get(`/${NombreDelModulo}/getMultimedia?idFilter=${idFilter}&multimedia=${multimedia}&search=${search}&page=${page}&rows=${rows}`);                
    }
    async getTotalRecordsMultimedia(idFilter, multimedia, search) {
        return await http.get(
            `/${NombreDelModulo}/totalrecordsMultimedia?idFilter=${idFilter}&multimedia=${multimedia}&search=${search}`
        );
    }
    async getComboBalanceCuatrienioYearInicio() {
        return await apibase.get(`/${Utils}/getComboBalanceCuatrienioYearInicio`);
    }
    async getComboTipoMultimedia() {
        return await apibase.get(`/${Utils}/getComboTipoMultimedia`);
    }
    async getComboEquipoCVByType(tipo) {
        return await apibase.get(`/${Utils}/getComboEquipoCVByType?tipo=${tipo}`);
    }
    async getComboCongresistaByType(tipo) {
        return await apibase.get(`/${Utils}/getComboCongresistaByType?tipo=${tipo}`);
    }
    async getComboTipoPublicacion() {
        return await apibase.get(`/${Utils}/getComboTipoPublicacion`);
    }
}

export default new ContenidoMultimediaDataService();
