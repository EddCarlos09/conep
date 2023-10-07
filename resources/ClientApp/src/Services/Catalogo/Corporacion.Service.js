import http from "../../Http/Http-processcommon";
import http2 from "../../Http/Http-processcommon2";

class CorporacionDataService {
    async create(data) {
        return await http.post('/corporacions', data);
    }
    async update(id, data) {
        return await http2.post(`/corporacions/${id}`, data);
    }
    async getAll(idFilter) {
        return await http.get(`/corporacions?idFilter=${idFilter}`);
    }
    async get(id) {
        return await http.get(`/corporacions/${id}`);
    }
    async delete(id) {
        return await http.delete(`/corporacions/${id}`)
    }
}

export default new CorporacionDataService();