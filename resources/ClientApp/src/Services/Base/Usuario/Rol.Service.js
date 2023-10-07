import http from "../../../Http/Http-processcommon";

class RolDataService {
    async getAllByIdTipoUsuarioAndIdSucursalCuentaUsuario(idTipoUsuario, idSucursalCuentaUsuario) {
        return await http.get(`/rol/getAllByIdTipoUsuarioAndIdSucursalCuentaUsuario/${idTipoUsuario}/${idSucursalCuentaUsuario}`);
    }
    async getAllByIdTipoUsuario(idTipoUsuario) {
        return await http.get(`/rol/getAllByIdTipoUsuario/${idTipoUsuario}`);
    }
    async getAll(data) {
        return await http.post(`/rol/getAll`, data);
    }
    async get(id) {
        return await http.get(`/rol/${id}`);
    }
    async getByIdSucursalCuentaUsuarioRol(idSucursalCuentaUsuarioRol) {
        return await http.get(`/rol/getByIdSucursalCuentaUsuarioRol/${idSucursalCuentaUsuarioRol}`);
    }
    async getAllSinAsignarATipoDeUsuario(idTipoUsuario) {
        return await http.get(`/rol/getAllSinAsignarATipoDeUsuario/${idTipoUsuario}`);
    }
}
export default new RolDataService();
