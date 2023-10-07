import http from "../../../Http/Http-processcommon";
import http2 from "../../../Http/Http-processcommon2";

class UsuariosPorSucursalDataService {
    async create(data) {
        return await http.post(`/usuariosPorSucursal`, data);
    }
    async update(id, data) {
        return await http2.post(`/usuariosPorSucursal/${id}`, data);
    }
    async get(id) {
        return await http.get(`/usuariosPorSucursal/${id}`);
    }
    async getAll(data) {
        return await http.post(
            `/usuariosPorSucursal/showAll`, data);
    }
    async delete(id) {
        return await http.delete(`/usuariosPorSucursal/${id}`);
    }
    async deleteAll(id) {
        return await http.delete(`/usuariosPorSucursal/destroyAll/${id}`);
    }
    async showFilter(data) {
        return await http.post(
            `/usuariosPorSucursal/showFilter`, data);
    }
    async getUsuariosFaltantesEnSucursal(data) {
        return await http.post(
            `/usuariosPorSucursal/getUsuariosFaltantesEnSucursal`, data);
    }
}

export default new UsuariosPorSucursalDataService();
