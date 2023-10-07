import http from "../../Http/Http-processcommon";
import http2 from "../../Http/Http-processcommon2";
const NombreDelModulo = "municipio";

class MunicipioDataService {
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
    async totalrecords(idFilter, search = "") {
        return await http.post(
            `/${NombreDelModulo}/totalrecords?idFilter=${idFilter}&search=${search}`
        );
    }
}

export default new MunicipioDataService();
