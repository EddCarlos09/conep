import http from "../../Http/Http-processcommon";
import http2 from "../../Http/Http-processcommon2";

class ComisionDataService {
    async create(data) {
        return await http.post("/comisions", data);
    }
    async update(id, data) {
        return await http2.post(`/comisions/${id}`, data);
    }
    async getAll(
        idFilter,
        corporacion,
        tipoComision,
        search = "",
        page = 1,
        rows = 4
    ) {
        return await http.get(
            `/comisions?idFilter=${idFilter}&corporacion=${corporacion}&tipoComision=${tipoComision}&search=${search}&page=${page}&rows=${rows}`
        );
    }
    async get(id) {
        return await http.get(`/comisions/${id}`);
    }
    async delete(id) {
        return await http.delete(`/comisions/${id}`);
    }
    async patch(id) {
        return await http.patch(`/comisions/patch/${id}`);
    }
    async getTotalRecordsComision(idFilter, corporacion, tipoComision, search) {
        return await http.get(
            `/comisions/totalrecords?idFilter=${idFilter}&corporacion=${corporacion}&tipoComision=${tipoComision}&search=${search}`
        );
    }
    async getCongresistas(data) {
        return await http.post(`/comisions/getCongresistas`, data);
    }

    async getAllPersonas(idFilter,search = "",page = 1,rows = 4) {
        return await http.get(
            `/personas?idFilter=${idFilter}&search=${search}&page=${page}&rows=${rows}`
        );
    }
    async totalrecordsPersonas(idFilter, search = "") {
        return await http.get(
            `/personas/totalrecords?idFilter=${idFilter}&search=${search}`
        );
    }
}

export default new ComisionDataService();
