import http from "../../Http/Http-processcommon";
import http2 from "../../Http/Http-processcommon2";
const NombreDelModulo = "secretarios";
const Utils = "utils";

class SecretariosDataService {
    async create(data) {
        return await http.post(`/${NombreDelModulo}`, data);
    }
    async update(id, data) {
        return await http2.post(`/${NombreDelModulo}/${id}`, data);
    }
    async getAll(
        idFilter,
        // corporacion,
        // cuatrienio,
        // partido,
        search = "",
        page = 1,
        rows = 4
    ) {
        return await http.get(
            // `/${NombreDelModulo}?idFilter=${idFilter}&corporacion=${corporacion}&cuatrienio=${cuatrienio}&partido=${partido}&search=${search}&page=${page}&rows=${rows}`
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
    async getTotalRecords(
        idFilter, 
        // corporacion, cuatrienio, partido, 
        search) {
        return await http.get(
            // `/${NombreDelModulo}/totalrecords?idFilter=${idFilter}&corporacion=${corporacion}&cuatrienio=${cuatrienio}&partido=${partido}&search=${search}`
            `/${NombreDelModulo}/totalrecords?idFilter=${idFilter}&search=${search}`
        );
    }
    async getComboGenero() {
        return await http.get(`/${Utils}/getComboGenero`);
    }
    async getComboCircunscripcion() {
        return await http.get(`/${Utils}/getComboCircunscripcion`);
    }
    async getComboCorporacion() {
        return await http.get(`/${Utils}/getComboCorporacion`);
    }
    async getComboCuatrienio() {
        return await http.get(`/${Utils}/getComboCuatrienio`);
    }
    async getComboPartido() {
        return await http.get(`/${Utils}/getComboPartido`);
    }
    async getComboGradoEstudio() {
        return await http.get(`/${Utils}/getComboGradoEstudio`);
    }
    async getDataCuruls(idCuatrienio, idCorporacion) {
        return await http.get(
            `/${Utils}/getDataCuruls?corporacion=${idCorporacion}&cuatrienio=${idCuatrienio}`
        );
    }
    async getCurules(idCuatrienio, idCorporacion) {
        return await http.get(
            `/${Utils}/getCurules?corporacion=${idCorporacion}&cuatrienio=${idCuatrienio}`
        );
    }
}

export default new SecretariosDataService();
