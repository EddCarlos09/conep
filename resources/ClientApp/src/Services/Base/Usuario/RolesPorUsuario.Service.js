import http from "../../../Http/Http-processcommon";

class RolesPorUsuarioDataService {
    async getAllRoles(data) {
        return await http.post(
            `/rolesPorUsuario/getAllRoles`, data);
    }
}
export default new RolesPorUsuarioDataService();
