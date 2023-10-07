import http from "../../Http/Http-processcommon";
import http2 from "../../Http/Http-processcommon2";
const NombreDelModulo = "circunscripcion";

class CircunscripcionDataService {
    async create(data) {
        return await http.post(`/${NombreDelModulo}`, data);
    }
    async update(id, data) {
        return await http2.post(`/${NombreDelModulo}/${id}`, data);
    }
    async getAll(idFilter, idDepartamento, search = "", page = 1, rows = 4) {
        return await http.get(
            `/${NombreDelModulo}?idFilter=${idFilter}&idDepartamento=${idDepartamento}&search=${search}&page=${page}&rows=${rows}`
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
    async getTotalRecords(idFilter, idDepartamento, search) {
        return await http.get(
            `/${NombreDelModulo}/totalrecords?idFilter=${idFilter}&idDepartamento=${idDepartamento}&search=${search}`
        );
    }
    async getCombo() {
        return await http.get(`/${NombreDelModulo}/LlenarCombo`);
    }
    async getComboDepartamento() {
        return await http.post(`/utils/getComboDepartamentoFilter`);
    }
}

export default new CircunscripcionDataService();
