import http from "../../Http/Http-processcommon";
import http2 from "../../Http/Http-processcommon2";

class PartidoDataService {
    async create(data) {
        return await http.post('/partidos', data);
    }
    async update(id, data) {
        return await http2.post(`/partidos/${id}`, data);
    }
    async getAll(idFilter, search='', page=1, rows=4) {
        return await http.get(`/partidos?idFilter=${idFilter}&search=${search}&page=${page}&rows=${rows}`);
    }
    async get(id) {
        return await http.get(`/partidos/${id}`);
    }
    async delete(id) {
        return await http.delete(`/partidos/${id}`)
    }
    async patch(id) {
        return await http.patch(`/partidos/patch/${id}`);
    }
    async getTotalRecordsPartido(idFilter, search) {
        return await http.get(`/partidos/totalrecords?idFilter=${idFilter}&search=${search}`);
    }
    async getComboPartido() {
        return await http.get('/partidos/LlenarComboPartido');
    }
}

export default new PartidoDataService();