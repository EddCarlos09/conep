import http from "../../Http/Http-processcommon";
import http2 from "../../Http/Http-processcommon2";
const NombreDelModulo = "paseLista";
const Utils = "utils";

class PaseListaDataService {
    async create(data) {
        return await http.post(`/${NombreDelModulo}`, data);
    }
    async update(id, data) {
        return await http2.post(`/${NombreDelModulo}/${id}`, data);
    }
    async getAll(idFilter, search = "", page = 1, rows = 4) {
        return await http.get(
            `/${NombreDelModulo}?idFilter=${idFilter}&search=${search}&page=${page}&rows=${rows}`
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
    async getTotalRecords(idFilter, search) {
        return await http.get(
            `/${NombreDelModulo}/totalrecords?idFilter=${idFilter}&search=${search}`
        );
    }
    async getCombo() {
        return await http.get(`/${NombreDelModulo}/LlenarCombo`);
    }
    async getComboCorporacion() {
        return await http.get(`/${Utils}/getComboCorporacion`);
    }
    async getComboCuatrienio() {
        return await http.get(`/${Utils}/getComboCuatrienio`);
    }
    async getComboTipoComision(idCorporacion) {
        return await http.get(
            `/${Utils}/getComboTipoComision?idcorporacion=${idCorporacion}`
        );
    }
    async getComboComisiones(idTipoComision) {
        return await http.get(
            `/${Utils}/getComboComisiones?idtipocomision=${idTipoComision}`
        );
    }
    async getComboLegislatura() {
        return await http.get(`/${Utils}/getComboLegislatura`);
    }
}

export default new PaseListaDataService();
