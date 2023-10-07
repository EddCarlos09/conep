import http from "../../Http/Http-processcommon";
import apibase from "../../Http/Http-apibase";
const Utils = "utils";

class BlogNdDataService{
    
    async getAll(tema,tipo,search = "",page = 1,rows = 4) {
        return await http.get(
            `/blognd?tema=${tema}&tipo=${tipo}&search=${search}&page=${page}&rows=${rows}`
        );
    }
    async getTotalRecords(tema,tipo, search) {
        return await http.get(
            `/blognd/totalrecords?tema=${tema}&tipo=${tipo}&search=${search}`
        );
    }
    async getUltimasPub(){
        return await http.get(`/blogndultpub`);                
    }
    async getBlogDestacado(){
        return await http.get(`/blogndest`);                
    }
    async get(id) {
        return await http.get(`/blognd/${id}`);
    }
    async getComboTema(){
        return await apibase.get(`/${Utils}/getComboTemaBlog`);                
    }
    async getComboTipo(){
        return await apibase.get(`/${Utils}/getComboTipoPublicacion`);                
    }
}

export default new BlogNdDataService();