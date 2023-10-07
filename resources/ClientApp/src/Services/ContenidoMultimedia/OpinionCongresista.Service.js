import http from "../../Http/Http-processcommon";
import http2 from "../../Http/Http-processcommon2";

class OpinionCongresistaDataService{
    async getAll(idFilter, annoPublicacion, congresista, search='',page=1,rows=4){
        return await http.get(`/opinionCongresista?idFilter=${idFilter}&annoPublicacion=${annoPublicacion}&congresista=${congresista}&search=${search}&page=${page}&rows=${rows}`);
    }
    async create(data) {
        return await http.post(`/opinionCongresista`, data);
    }
    async get(id) {
        return await http.get(`/opinionCongresista/${id}`);
    }

    async update(id, data) {
        return await http2.post(`/opinionCongresista/${id}`, data);
    }
    async delete(id) {
        return await http.delete(`/opinionCongresista/${id}`);
    }
    async getComboPersonas(idFilter, search = "", page = 1,rows = 4) {
        return await http.get(
            `/utils/getComboPersonas?idFilter=${idFilter}&search=${search}&page=${page}&rows=${rows}`
        );
    }
    async totalrecordsComboPersonas(idFilter, search = "") {
        return await http.get(
            `/utils/totalrecordsComboPersonas?idFilter=${idFilter}&search=${search}`
        );
    }
}
export default new OpinionCongresistaDataService();
