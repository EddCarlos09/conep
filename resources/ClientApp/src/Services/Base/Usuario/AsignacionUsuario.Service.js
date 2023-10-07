import http from "../../../Http/Http-processcommon";
import http2 from "../../../Http/Http-processcommon2";

class AsignacionUsuarioDataService {
    async create(data) {
        return await http.post(`/asignacionUsuario`, data);
    }
    async update(id, data) {
        return await http2.post(`/asignacionUsuario/${id}`, data);
    }
    async get(id) {
        return await http.get(`/asignacionUsuario/${id}`);
    }
    async getAll(data) {
        return await http.post(
            `/asignacionUsuario/showAll`, data);
    }
    async delete(id) {
        return await http.delete(`/asignacionUsuario/destroyAll/${id}`);
    }
}

export default new AsignacionUsuarioDataService();
