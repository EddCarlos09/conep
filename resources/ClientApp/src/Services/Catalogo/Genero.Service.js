import http from "../../Http/Http-processcommon";
import http2 from "../../Http/Http-processcommon2";

class GeneroDataService {
    async create(data) {
        return await http.post('/generos', data);
    }
    async update(id, data) {
        return await http2.post(`/generos/${id}`, data);
    }
    async getAll(idFilter) {
        return await http.get(`/generos?idFilter=${idFilter}`);
    }
    async get(id) {
        return await http.get(`/generos/${id}`);
    }
    async delete(id) {
        return await http.delete(`/generos/${id}`)
    }
}

export default new GeneroDataService();