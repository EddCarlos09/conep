import http from "../../Http/Http-processcommon";
import http2 from "../../Http/Http-processcommon2";
const NombreDelModulo = "congresistas";
const Utils = "utils";

class CongresistasDataService {
    async create(data) {
        return await http.post(`/${NombreDelModulo}`, data);
    }
    async update(id, data) {
        return await http2.post(`/${NombreDelModulo}/${id}`, data);
    }
    async getAll(
        idFilter,
        search = "",
        page = 1,
        rows = 4
    ) {
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
    async getByIdCuatrienio(id) {
        return await http.get(`/cuatrienios/${id}`);
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
    async getComboDepartamento() {
        return await http.get(`/${Utils}/getComboDepartamento`);
    }
    async getComboCargoLegislativo() {
        return await http.get(`/${Utils}/getComboCargoLegislativo`);
    }
    async getComboTipoInvestigacion() {
        return await http.get(`/${Utils}/getComboTipoInvestigacion`);
    }
    async getAllPersonasNoCongresistas(idFilter, cuatrienio,search = "",page = 1,rows = 4) {
        return await http.get(
            `/${Utils}/getAllPersonasNoCongresistas?idFilter=${idFilter}&cuatrienio=${cuatrienio}&search=${search}&page=${page}&rows=${rows}`
        );
    }
    async totalrecordsPersonasNoCongresistas(idFilter, cuatrienio, search = "") {
        return await http.get(
            `/${Utils}/totalrecordsPersonasNoCongresistas?idFilter=${idFilter}&cuatrienio=${cuatrienio}&search=${search}`
        );
    }
    async getComboPersonas(idFilter, search = "", page = 1,rows = 4) {
        return await http.get(
            `/${Utils}/getComboPersonas?idFilter=${idFilter}&search=${search}&page=${page}&rows=${rows}`
        );
    }
    async totalrecordsComboPersonas(idFilter, search = "") {
        return await http.get(
            `/${Utils}/totalrecordsComboPersonas?idFilter=${idFilter}&search=${search}`
        );
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
    async getCongresistas(data) {
        return await http.post(`/${NombreDelModulo}/getCongresistas`, data);
    }
}

export default new CongresistasDataService();
