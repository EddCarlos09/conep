import http from "../../../Http/Http-processcommon";

class ModuloPermisoDataService {

    async getModulosPermisos() {
        return await http.get(
            `/moduloPermiso/getModulosPermisos`);
    }
}
export default new ModuloPermisoDataService();
