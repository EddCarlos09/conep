import http from "../../Http/Http-processcommon";
import http2 from "../../Http/Http-processcommon2";
const NombreDelModulo = "balanceCuatrienioInforme";
const Utils = "utils";

class BalanceCuatrienioInformeDataService {
    async create(data) {
        return await http.post(`/${NombreDelModulo}`, data);
    }
    async update(id, data) {
        return await http2.post(`/${NombreDelModulo}/${id}`, data);
    }
    async getAll(
        idFilter,
        balance,
        equipo,
        search = "",
        page = 1,
        rows = 4
    ) {
        return await http.get(
            `/${NombreDelModulo}?idFilter=${idFilter}&balance=${balance}&equipo=${equipo}&search=${search}&page=${page}&rows=${rows}`
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
    async getTotalRecords(idFilter, balance, equipo, search) {
        return await http.get(
            `/${NombreDelModulo}/totalrecords?idFilter=${idFilter}&balance=${balance}&equipo=${equipo}&search=${search}`
        );
    }
    async getComboEquipoCV() {
        return await http.get(`/${Utils}/getComboEquipoCV`);
    }
    async getComboGlosarioLegislativo() {
        return await http.get(`/${Utils}/getComboGlosarioLegislativo`);
    }
    async getComboTipoPublicacion() {
        return await http.get(`/${Utils}/getComboTipoPublicacion`);
    }
}

export default new BalanceCuatrienioInformeDataService();