import http from "../../Http/Http-processcommon";
import http2 from "../../Http/Http-processcommon2";

class MultimediaDataService{
    async getAll(idFilter,search='',page=1,rows=4){
        return await http.get(`/multimedia?idFilter=${idFilter}&search=${search}&page=${page}&rows=${rows}`);                
    }   
    async create(data) {
        return await http.post(`/multimedia`, data);
    }
    async get(id) {
        return await http.get(`/multimedia/${id}`);
    }

    async update(id, data) {
        return await http2.post(`/multimedia/${id}`, data);
    }
    async delete(id) {
        return await http.delete(`/multimedia/${id}`);
    }
}
export default new MultimediaDataService();