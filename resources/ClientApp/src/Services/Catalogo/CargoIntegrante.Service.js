import http from "../../Http/Http-processcommon";
import http2 from "../../Http/Http-processcommon2";

class CargoIntegranteDataService{
    async getAll(idFilter,search='',page=1,rows=4){
        return await http.get(`/cargoIntegrante?idFilter=${idFilter}&search=${search}&page=${page}&rows=${rows}`);                
    }   
    async create(data) {
        return await http.post(`/cargoIntegrante`, data);
    }
    async get(id) {
        return await http.get(`/cargoIntegrante/${id}`);
    }

    async update(id, data) {
        return await http2.post(`/cargoIntegrante/${id}`, data);
    }
    async delete(id) {
        return await http.delete(`/cargoIntegrante/${id}`);
    }
}

export default new CargoIntegranteDataService();