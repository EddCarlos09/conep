import http from "../../Http/Http-processcommon";
import http2 from "../../Http/Http-processcommon2";

class TipoCitacionDataService {
    async create(data) {
        return await http.post('/tipoCitacions', data);
    }
    async update(id, data) {
        return await http2.post(`/tipoCitacions/${id}`, data);
    }
    async getAll(idFilter) {
        return await http.get(`/tipoCitacions?idFilter=${idFilter}`);
    }
    async get(id) {
        return await http.get(`/tipoCitacions/${id}`);
    }
    async delete(id) {
        return await http.delete(`/tipoCitacions/${id}`)
    }
}

export default new TipoCitacionDataService();