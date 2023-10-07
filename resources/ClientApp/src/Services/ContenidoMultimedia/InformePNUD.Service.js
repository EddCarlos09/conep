import http from "../../Http/Http-processcommon";
import http2 from "../../Http/Http-processcommon2";

class InformeDataService{
    async getAll(idFilter,search='',page=1,rows=4){
        return await http.get(`/informesPnud?idFilter=${idFilter}&search=${search}&page=${page}&rows=${rows}`);                
    }   
    async create(data) {
        return await http.post(`/informesPnud`, data);
    }
    async get(id) {
        return await http.get(`/informesPnud/${id}`);
    }

    async update(id, data) {
        return await http2.post(`/informesPnud/${id}`, data);
    }
    async delete(id) {
        return await http.delete(`/informesPnud/${id}`);
    }

    async getAllDocumento(id,idFilter,search='',page=1,rows=4){
        return await http.get(`/documentosInformes/${id}?idFilter=${idFilter}&search=${search}&page=${page}&rows=${rows}`);                
    }   
    async createDocumento(data) {
        return await http.post(`/documentosInforme`, data);
    }
    async getDocumento(id) {
        return await http.get(`/documentosInforme/${id}`);
    }

    async updateDocumento(id, data) {
        return await http2.post(`/documentosInforme/${id}`, data);
    }
    async deleteDocumento(id) {
        return await http.delete(`/documentosInforme/${id}`);
    }
}
export default new InformeDataService();