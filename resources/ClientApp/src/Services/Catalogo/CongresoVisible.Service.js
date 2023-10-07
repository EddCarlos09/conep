import http from "../../Http/Http-processcommon";
import http2 from "../../Http/Http-processcommon2";

class CongresoVisibleDataService{
    async getAll(idFilter,search='',page=1,rows=4){
        return await http.get(`/congresoVisible?idFilter=${idFilter}&search=${search}&page=${page}&rows=${rows}`);                
    }   

    async get(id) {
        return await http.get(`/congresoVisible/${id}`);
    }

    async update(id, data) {
        return await http2.post(`/congresoVisible/${id}`, data);
    }
    
    async getAllEquipo(idFilter,search='',page=1,rows=4){
        return await http.get(`/congresoVisibleEquipo?idFilter=${idFilter}&search=${search}&page=${page}&rows=${rows}`);                
    }

    async getEquipo(idequipo) {
        return await http.get(`/congresoVisibleEquipo/${idequipo}`);
    }

    async createEquipo(data) {
        return await http.post(`/congresoVisibleEquipo`, data);
    }

    async updateEquipo(id, data) {
        return await http2.post(`/congresoVisibleEquipo/${id}`, data);
    }
    async deleteEquipo(id) {
        return await http.delete(`/congresoVisibleEquipo/${id}`);
    }
    async getAllAliado(idFilter,search='',page=1,rows=4){
        return await http.get(`/congresoVisibleAliado?idFilter=${idFilter}&search=${search}&page=${page}&rows=${rows}`);                
    }

    async getAliado(idaliado) {
        return await http.get(`/congresoVisibleAliado/${idaliado}`);
    }

    async createAliado(data) {
        return await http.post(`/congresoVisibleAliado`, data);
    }

    async updateAliado(id, data) {
        return await http2.post(`/congresoVisibleAliado/${id}`, data);
    }
    async deleteAliado(id) {
        return await http.delete(`/congresoVisibleAliado/${id}`);
    }

    async getAllIntegrante(idFilter,search='',page=1,rows=4){
        return await http.get(`/congresoVisibleEquipoIntegrante?idFilter=${idFilter}&search=${search}&page=${page}&rows=${rows}`);                
    }

    async getIntegrante(integrante) {
        return await http.get(`/congresoVisibleEquipoIntegrante/${integrante}`);
    }

    async createIntegrante(data) {
        return await http.post(`/congresoVisibleEquipoIntegrante`, data);
    }

    async updateIntegrante(id, data) {
        return await http2.post(`/congresoVisibleEquipoIntegrante/${id}`, data);
    }
    async deleteIntregrante(id) {
        return await http.delete(`/congresoVisibleEquipoIntegrante/${id}`);
    }
}
export default new CongresoVisibleDataService();