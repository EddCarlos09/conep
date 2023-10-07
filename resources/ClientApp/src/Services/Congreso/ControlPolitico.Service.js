import http from "../../Http/Http-processcommon";
import http2 from "../../Http/Http-processcommon2";

class ControlPoliticoDataService {
    async create(data) {
        return await http.post("/controlPolitico", data);
    }
    async createProposicion(data) {
        return await http.post("/controlPoliticoProposicion", data);
    }
    async createCitante(data) {
        return await http.post("/controlPoliticoCitante", data);
    }
    async createCitado(data) {
        return await http.post("/controlPoliticoCitado", data);
    }
    async createRespuesta(data) {
        return await http.post("/controlPoliticoRespuesta", data);
    }
    async createDocumento(data) {
        return await http.post("/controlPoliticoDocumento", data);
    }
    async update(id, data) {
        return await http2.post(`/controlPolitico/${id}`, data);
    }
    async updateProposicion(id, data) {
        return await http2.post(`/controlPoliticoProposicion/${id}`, data);
    }
    async updateCitante(id, data) {
        return await http2.post(`/controlPoliticoCitante/${id}`, data);
    }
    async updateCitado(id, data) {
        return await http2.post(`/controlPoliticoCitado/${id}`, data);
    }
    async updateRespuesta(id, data) {
        return await http2.post(`/controlPoliticoRespuesta/${id}`, data);
    }
    async updateDocumento(id, data) {
        return await http2.post(`/controlPoliticoDocumento/${id}`, data);
    }
    async getAll(
        idFilter,
        corporacion,
        legislatura,
        cuatrienio,
        comision,
        estado,
        search = "",
        page = 1,
        rows = 4
    ) {
        return await http.get(
            `/controlPolitico?idFilter=${idFilter}&corporacion=${corporacion}&legislatura=${legislatura}&cuatrienio=${cuatrienio}&comision=${comision}&estado=${estado}&search=${search}&page=${page}&rows=${rows}`
        );
    }
    async getAllProposicion(
        idFilter,
        controlpolitico,
        search = "",
        page = 1,
        rows = 4
    ) {
        return await http.get(
            `/controlPoliticoProposicion?idFilter=${idFilter}&controlpolitico=${controlpolitico}&search=${search}&page=${page}&rows=${rows}`
        );
    }
    async getAllRespuesta(
        idFilter,
        controlpolitico,
        search = "",
        page = 1,
        rows = 4
    ) {
        return await http.get(
            `/controlPoliticoRespuesta?idFilter=${idFilter}&controlpolitico=${controlpolitico}&search=${search}&page=${page}&rows=${rows}`
        );
    }
    async getAllDocumento(
        idFilter,
        controlpolitico,
        search = "",
        page = 1,
        rows = 4
    ) {
        return await http.get(
            `/controlPoliticoDocumento?idFilter=${idFilter}&controlpolitico=${controlpolitico}&search=${search}&page=${page}&rows=${rows}`
        );
    }
    async getAllCitante(
        idFilter,
        controlpolitico,
        search = "",
        page = 1,
        rows = 4
    ) {
        return await http.get(
            `/controlPoliticoCitante?idFilter=${idFilter}&controlpolitico=${controlpolitico}&search=${search}&page=${page}&rows=${rows}`
        );
    }
    async getAllCitado(
        idFilter,
        controlpolitico,
        asistencia,
        tipo,
        search = "",
        page = 1,
        rows = 4
    ) {
        return await http.get(
            `/controlPoliticoCitado?idFilter=${idFilter}&controlpolitico=${controlpolitico}&asistencia=${asistencia}&tipo=${tipo}&search=${search}&page=${page}&rows=${rows}`
        );
    }
    
    async get(id) {
        return await http.get(`/controlPolitico/${id}`);
    }
    async getProposicion(id) {
        return await http.get(`/controlPoliticoProposicion/${id}`);
    }
    async getCitante(id) {
        return await http.get(`/controlPoliticoCitante/${id}`);
    }
    async getCitado(id) {
        return await http.get(`/controlPoliticoCitado/${id}`);
    }
    async getRespuesta(id) {
        return await http.get(`/controlPoliticoRespuesta/${id}`);
    }
    async getDocumento(id) {
        return await http.get(`/controlPoliticoDocumento/${id}`);
    }
    async delete(id) {
        return await http.delete(`/controlPolitico/${id}`);
    }
    async deleteProposicion(id) {
        return await http.delete(`/controlPoliticoProposicion/${id}`);
    }
    async deleteCitante(id) {
        return await http.delete(`/controlPoliticoCitante/${id}`);
    }
    async deleteCitado(id) {
        return await http.delete(`/controlPoliticoCitado/${id}`);
    }
    async deleteRespuesta(id) {
        return await http.delete(`/controlPoliticoRespuesta/${id}`);
    }
    async deleteDocumento(id) {
        return await http.delete(`/controlPoliticoDocumento/${id}`);
    }
    async patch(id) {
        return await http.patch(`/controlPolitico/patch/${id}`);
    }
    async getTotalRecordsControlPolitico(idFilter,corporacion, legislatura, cuatrienio, comision, estado, search) {
        return await http.get(
            `/controlPolitico/totalrecords?idFilter=${idFilter}&corporacion=${corporacion}&legislatura=${legislatura}&cuatrienio=${cuatrienio}&comision=${comision}&estado=${estado}&search=${search}`
        );
    }
    async getTotalRecordsControlPoliticoProposicion(idFilter, controlpolitico, search) {
        return await http.get(
            `/controlPoliticoProposicion/totalrecords?idFilter=${idFilter}&controlpolitico=${controlpolitico}&search=${search}`
        );
    }
    async getTotalRecordsControlPoliticoRespuesta(idFilter, controlpolitico, search) {
        return await http.get(
            `/controlPoliticoRespuesta/totalrecords?idFilter=${idFilter}&controlpolitico=${controlpolitico}&search=${search}`
        );
    }
    async getTotalRecordsControlPoliticoDocumento(idFilter, controlpolitico, search) {
        return await http.get(
            `/controlPoliticoDocumento/totalrecords?idFilter=${idFilter}&controlpolitico=${controlpolitico}&search=${search}`
        );
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

export default new ControlPoliticoDataService();
