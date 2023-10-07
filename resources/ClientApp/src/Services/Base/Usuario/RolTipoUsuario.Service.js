import http from "../../../Http/Http-processcommon";

class RolTipoUsuarioDataService {
    async getAllDto(data) {
        return await http.post(
            `/rolTipoUsuario/getAllDto`, data);
    }
    async create(data) {
        return await http.post(`/rolTipoUsuario`, data);
    }
    async delete(id) {
        return await http.delete(`/rolTipoUsuario/${id}`);
    }
}
export default new RolTipoUsuarioDataService();
