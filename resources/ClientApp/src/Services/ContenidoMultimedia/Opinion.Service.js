import http from "../../Http/Http-processcommon";
import http2 from "../../Http/Http-processcommon2";

class OpinionDataService{
    async getAll(idFilter,search='',page=1,rows=4){
        return await http.get(`/opinion?idFilter=${idFilter}&search=${search}&page=${page}&rows=${rows}`);                
    }   
    async create(data) {
        return await http.post(`/opinion`, data);
    }
    async get(id) {
        return await http.get(`/opinion/${id}`);
    }

    async update(id, data) {
        return await http2.post(`/opinion/${id}`, data);
    }
    async delete(id) {
        return await http.delete(`/opinion/${id}`);
    }
}
export default new OpinionDataService();