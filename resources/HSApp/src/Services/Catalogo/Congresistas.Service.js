import http from "../../Http/Http-processcommon";
import http2 from "../../Http/Http-processcommon2";
import apibase from "../../Http/Http-apibase";
const NombreDelModulo = "congresistas";
const Utils = "utils";

class CongresistasDataService {
    async getAll(
        idFilter,
        corporacion,
        cuatrienio,
        partido,
        gradoEstudio,
        genero,
        circunscripcion,
        grupoEdad,
        comision,
        departamento,
        profesion,
        search = "",
        page = 1,
        rows = 4
    ) {
        return await http.get(
            `/${NombreDelModulo}?idFilter=${idFilter}&corporacion=${corporacion}&cuatrienio=${cuatrienio}&partido=${partido}&gradoEstudio=${gradoEstudio}&genero=${genero}&circunscripcion=${circunscripcion}&grupoEdad=${grupoEdad}&comision=${comision}&departamento=${departamento}&profesion=${profesion}&search=${search}&page=${page}&rows=${rows}`
        );
    }
    async getTotalRecords(idFilter, corporacion, cuatrienio, partido, gradoEstudio, genero, circunscripcion, grupoEdad, comision, departamento, profesion, search) {
        return await http.get(
            `/${NombreDelModulo}/totalrecords?idFilter=${idFilter}&corporacion=${corporacion}&cuatrienio=${cuatrienio}&partido=${partido}&gradoEstudio=${gradoEstudio}&genero=${genero}&circunscripcion=${circunscripcion}&grupoEdad=${grupoEdad}&comision=${comision}&departamento=${departamento}&profesion=${profesion}&search=${search}`
        );
    }
    async get(id) {
        return await http.get(`/${NombreDelModulo}/${id}`);
    }
    async getComboDepartamento() {
        return await apibase.get(`/${Utils}/getComboDepartamento`);
    }
    async getAutoriasByIdCongresista(id, search = "", page = 1, rows = 4) {
        return await http.get(`/${NombreDelModulo}/getAutoriasByIdCongresista/${id}?search=${search}&page=${page}&rows=${rows}`);
    }
    async totalrecordsAutorias(id, search = "") {
        return await http.get(`/${NombreDelModulo}/totalrecordsAutoriasByIdCongresista/${id}?search=${search}`);
    }
    async getPonenciasByIdCongresista(id, search = "", page = 1, rows = 4) {
        return await http.get(`/${NombreDelModulo}/getPonenciasByIdCongresista/${id}?search=${search}&page=${page}&rows=${rows}`);
    }
    async totalrecordsPonenciasByIdCongresista(id, search = "") {
        return await http.get(`/${NombreDelModulo}/totalrecordsPonenciasByIdCongresista/${id}?search=${search}`);
    }
    async getCitantesByIdCongresista(id, search = "", page = 1, rows = 4) {
        return await http.get(`/${NombreDelModulo}/getCitantesByIdCongresista/${id}?search=${search}&page=${page}&rows=${rows}`);
    }
    async totalrecordsCitantesByIdCongresista(id, search = "") {
        return await http.get(`/${NombreDelModulo}/totalrecordsCitantesByIdCongresista/${id}?search=${search}`);
    }
    async getComboGenero() {
        return await apibase.get(`/${Utils}/getComboGenero`);
    }
    async getComboCircunscripcion() {
        return await apibase.get(`/${Utils}/getComboCircunscripcion`);
    }
    async getComboCorporacion() {
        return await apibase.get(`/${Utils}/getComboCorporacion`);
    }
    async getComboProfesionFilter(data) {
        return await apibase.post(`/${Utils}/getComboProfesionFilter`, data);
    }
    async getComboCuatrienio() {
        return await apibase.get(`/${Utils}/getComboCuatrienio`);
    }
    async getComboPartido() {
        return await apibase.get(`/${Utils}/getComboPartido`);
    }
    async getComboGradoEstudio() {
        return await apibase.get(`/${Utils}/getComboGradoEstudio`);
    }
    async getCurules(idCuatrienio, idCorporacion) {
        return await apibase.get(
            `/${Utils}/getCurules?corporacion=${idCorporacion}&cuatrienio=${idCuatrienio}`
        );
    }
    async getComboTipoComision(idCorporacion = 0) {
        return await apibase.get(`/${Utils}/getComboTipoComision?idcorporacion=${idCorporacion}`);
    }
    async getComboComisiones(idTipoComision) {
        return await apibase.get(`/${Utils}/getComboComisiones?idtipocomision=${idTipoComision}`);
    }
    async getComboGruposEdad() {
        return await apibase.get(`/${Utils}/getComboGruposEdad`);
    }
}

export default new CongresistasDataService();
