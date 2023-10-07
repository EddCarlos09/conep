import http from "../../../Http/Http-processcommon";
import http2 from "../../../Http/Http-processcommon2";

class SucursalCuentaUsuarioRolModuloPermisoRolDataService {
    async getAll(data) {
        return await http.post(
            `/sucursalUsuarioCuentaRolModuloPermisoRol/getAll`, data);
    }
    async postRange(data) {
        return await http.post(`/sucursalUsuarioCuentaRolModuloPermisoRol/postRange`, data);
    }
    async putRange(data, id) {
        return await http2.post(`/sucursalUsuarioCuentaRolModuloPermisoRol/putRange/${id}`, data);
    }
    async delete(id) {
        return await http.delete(`/sucursalCuentaUsuarioRolModuloPermisoRol/${id}`);
    }
}
export default new SucursalCuentaUsuarioRolModuloPermisoRolDataService();
