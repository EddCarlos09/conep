import http from "../../Http/Http-processcommon";
import http2 from "../../Http/Http-processcommon2";
const NombreDelModulo = "balanceCuatrienio";
const Utils = "utils";

class BalanceCuatrienioDataService {
    async create(data) {
        return await http.post(`/${NombreDelModulo}`, data);
    }
    async update(id, data) {
        return await http2.post(`/${NombreDelModulo}/${id}`, data);
    }
    async getAll(
        idFilter,
        yearInicio,
        search = "",
        page = 1,
        rows = 4
    ) {
        return await http.get(
            `/${NombreDelModulo}?idFilter=${idFilter}&yearInicio=${yearInicio}&search=${search}&page=${page}&rows=${rows}`
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
    async getTotalRecords(idFilter, yearInicio, search) {
        return await http.get(
            `/${NombreDelModulo}/totalrecords?idFilter=${idFilter}&yearInicio=${yearInicio}&search=${search}`
        );
    }
    async getComboBalanceCuatrienioYearInicio() {
        return await http.get(`/${Utils}/getComboBalanceCuatrienioYearInicio`);
    }
}

export default new BalanceCuatrienioDataService();
