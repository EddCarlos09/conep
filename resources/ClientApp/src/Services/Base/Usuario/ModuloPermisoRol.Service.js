import http from "../../../Http/Http-processcommon";
import http2 from "../../../Http/Http-processcommon2";

class ModuloPermisoRolDataService {
    async createRange(data) {
        return await http.post(`/moduloPermisoRol/postRange`, data);
    }
    async updateRange(id, data) {
        return await http2.post(`/moduloPermisoRol/putRange/${id}`, data);
    }

    async delete(id) {
        return await http.delete(`/moduloPermisoRol/${id}`);
    }
    async getModulosPermisosRolByIdRol(idRol) {
        return await http.get(
            `/moduloPermisoRol/getModulosPermisosRolByIdRol/${idRol}`);
    }
    async getAll(data) {
        return await http.post(
            `/moduloPermisoRol/getAll`, data);
    }
}
export default new ModuloPermisoRolDataService();
