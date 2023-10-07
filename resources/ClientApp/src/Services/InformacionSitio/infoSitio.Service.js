import http from "../../Http/Http-processcommon";
import http2 from "../../Http/Http-processcommon2";

class InfoSitioDataService{
    async getAll(idFilter,search='',page=1,rows=4){
        return await http.get(`/informacionSitio?idFilter=${idFilter}&search=${search}&page=${page}&rows=${rows}`);                
    }   

    async get(id) {
        return await http.get(`/informacionSitio/${id}`);
    }

    async update(id, data,dataUpdate) {
        return await http2.post(`/informacionSitio/${id}`, data, dataUpdate);
    }
}

export default new InfoSitioDataService();