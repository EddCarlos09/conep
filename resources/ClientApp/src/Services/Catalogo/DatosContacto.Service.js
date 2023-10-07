import http from "../../Http/Http-processcommon";
import http2 from "../../Http/Http-processcommon2";

class DatosContactoDataService {
    async create(data) {
        return await http.post('/datoscontactos', data);
    }
    async update(id, data) {
        return await http2.post(`/datoscontactos/${id}`, data);
    }
    async getAll(idFilter) {
        return await http.get(`/datoscontactos?idFilter=${idFilter}`);
    }
    async get(id) {
        return await http.get(`/datoscontactos/${id}`);
    }
    async delete(id) {
        return await http.delete(`/datoscontactos/${id}`)
    }
}

export default new DatosContactoDataService();