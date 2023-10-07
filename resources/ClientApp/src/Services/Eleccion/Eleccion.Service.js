import http from "../../Http/Http-processcommon";
import http2 from "../../Http/Http-processcommon2";

class EleccionDataService {
    async create(data) {
        return await http.post('/eleccion', data);
    }
    async update(id, data) {
        return await http2.post(`/eleccion/${id}`, data);
    }
    async getAll(idFilter, idCorporacion, idTipoComision, idComision, idCuatrienio, search='', page=1, rows=4) {
        return await http.get(`/eleccion?idFilter=${idFilter}&idCorporacion=${idCorporacion}
        &idTipoComision=${idTipoComision}&idComision=${idComision}&idCuatrienio=${idCuatrienio}
        &search=${search}&page=${page}&rows=${rows}`);
    }
    async get(id) {
        return await http.get(`/eleccion/${id}`);
    }
    async delete(id) {
        return await http.delete(`/eleccion/${id}`)
    }
    async patch(id) {
        return await http.patch(`/eleccion/patch/${id}`);
    }
    async getTotalRecordsEleccion(idFilter, idCorporacion, idTipoComision, idComision, idCuatrienio, search) {
        return await http.get(`/eleccion/totalrecords?idFilter=${idFilter}&idCorporacion=${idCorporacion}
        &idTipoComision=${idTipoComision}&idComision=${idComision}&idCuatrienio=${idCuatrienio}&search=${search}`);
    }
}

export default new EleccionDataService();