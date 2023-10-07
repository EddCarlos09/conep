
import http from "../../Http/Http-processcommon";
import http2 from "../../Http/Http-processcommon2";
const NombreDelModulo = "votacion";
const Utils = "utils";

class VotacionesDataService {
    async create(data) {
        return await http.post(`/${NombreDelModulo}`, data);
    }
    async update(id, data) {
        return await http2.post(`/${NombreDelModulo}/${id}`, data);
    }
    async updateVotaciones(id, data) {
        return await http2.post(`/${NombreDelModulo}/updateVotaciones/${id}`, data);
    }
    async getAll(idFilter, legislatura, cuatrienio, corporacion, comision, search = "", page = 1, rows = 4) {
        return await http.get(`/${NombreDelModulo}?idFilter=${idFilter}&legislatura=${legislatura}&cuatrienio=${cuatrienio}&corporacion=${corporacion}&comision=${comision}&search=${search}&page=${page}&rows=${rows}`);
    }
    async getTotalRecords(idFilter, legislatura, cuatrienio, search) {
        return await http.get(
            `/${NombreDelModulo}/totalrecords?idFilter=${idFilter}&legislatura=${legislatura}&cuatrienio=${cuatrienio}&search=${search}`
        );
    }
    async get(id) {
        return await http.get(`/${NombreDelModulo}/${id}`);
    }
    async delete(id) {
        return await http.delete(`/${NombreDelModulo}/${id}`);
    }
    async patch(id) {
        return await http.patch(`/${NombreDelModulo}/patch/${id}`);
    }
    async getComboCorporacion() {
        return await http.get(`/${Utils}/getComboCorporacion`);
    }
    async getComboCuatrienio() {
        return await http.get(`/${Utils}/getComboCuatrienio`);
    }
    async getComboProyectosDeLeyByLegislaturaCuatrienio(legislatura, cuatrienio) {
        return await http.get(`/${Utils}/getComboProyectosDeLeyByLegislaturaCuatrienio?legislatura=${legislatura}&cuatrienio=${cuatrienio}`);
    }
    async getComboTipoVotacion() {
        return await http.get(`/${Utils}/getComboTipoVotacion`);
    }
    async getComboClaseVotacion() {
        return await http.get(`/${Utils}/getComboClaseVotacion`);
    }
    async getComboEstadoByProyectoId(proyectoId) {
        return await http.get(`/${Utils}/getEstadosByProyectoId?proyecto=${proyectoId}`);
    }
    async getComboTipoComision(idCorporacion) {
        return await http.get(`/${Utils}/getComboTipoComision?idcorporacion=${idCorporacion}`);
    }
    async getComboComisiones(idTipoComision) {
        return await http.get(`/${Utils}/getComboComisiones?idtipocomision=${idTipoComision}`);
    }
    async getComboLegislatura(idCuatrienio) {
        return await http.get(`/${Utils}/getComboLegislatura?cuatrienio=${idCuatrienio}`);
    }
    async getDataVotarById(id) {
        return await http.get(`/${NombreDelModulo}/votar/${id}`);
    }
}


export default new VotacionesDataService();
