import http from "../../../Http/Http-processcommon";
import http2 from "../../../Http/Http-processcommon2";

class TipoUsuarioDataService {
    async getAllDto(data) {
        return await http.post(
            `/tipoUsuario/getAllDto`, data);
    }
    async create(data) {
        return await http.post(`/tipoUsuario`, data);
    }
    async update(id, data) {
        return await http2.post(`/tipoUsuario/${id}`, data);
    }
    async delete(id) {
        return await http.delete(`/tipoUsuario/${id}`);
    }

    async get(id) {
        return await http.get(`/tipoUsuario/${id}`);
    }
}
export default new TipoUsuarioDataService();
