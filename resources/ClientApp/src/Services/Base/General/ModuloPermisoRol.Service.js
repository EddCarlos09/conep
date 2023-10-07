import http from "../../../Http/Http-processcommon";

class ModuloPermisoRolDataService {
    async getAll(data) {
        return await http.post(
            `/moduloPermisoRol`, data);
    }
    async getAllDto(data) {
        return await http.post(
            `/moduloPermisoRol/GetAllDTO`, data);
    }

}
export default new ModuloPermisoRolDataService();
