import http from "../../Http/Http-processcommon";
import apibase from "../../Http/Http-apibase";
const Utils = "utils";

class CongresoVisibleDataService{
    async getAll() {
        return await http.get(`/congresoVisible`);
    }
    async getAllEquipo(){
        return await http.get(`/congresoVisibleEquipo`);                
    }
    async getAliado(){
        return await http.get(`/congresoVisibleAliado`);
    }
}

export default new CongresoVisibleDataService();