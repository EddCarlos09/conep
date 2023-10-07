import http from "../../Http/Http-processcommon";
import http2 from "../../Http/Http-processcommon2";
import apibase from "../../Http/Http-apibase";
const NombreDelModulo = "contenidomultimedia";

class opinionDataService { 
    async getOpinion(id) {
        return await http.get(`/contenidomultimedia/getOpinion/${id}`);
    }    
    
    async getOpinionCongresista(id) {
        return await http.get(`/contenidomultimedia/getOpinionCongresista/${id}`);
    }   
}

export default new opinionDataService();