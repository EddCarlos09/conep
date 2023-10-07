import http from "../../../Http/Http-processcommon";
import http2 from "../../../Http/Http-processcommon2";

class SucursalDataService {
    async create(data) {
        return await http.post(`/sucursal`, data);
    }
    async update(id, data) {
        return await http2.post(`/sucursal/${id}`, data);
    }
    async get(id) {
        return await http.get(`/sucursal/${id}`);
    }
    async getAll(idFilterActive, idTipoSucursal, idPais, idEstado, idMunicipio) {
        return await http.get(
            `/Sucursal?idFilterActive=${idFilterActive}&idTipoSucursal=${idTipoSucursal}&idPais=${idPais}&idEstado=${
                idEstado}&idMunicipio=${idMunicipio}`);
    }
    async delete(id) {
        return await http.delete(`/sucursal/${id}`);
    }
}

export default new SucursalDataService();
