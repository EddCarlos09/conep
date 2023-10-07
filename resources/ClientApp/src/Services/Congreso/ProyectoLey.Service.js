import http from "../../Http/Http-processcommon";
import http2 from "../../Http/Http-processcommon2";
const NombreDelModulo = "proyectoLey";

class ProyectoLeyDataService {
    async create(data) {
        return await http.post(`/${NombreDelModulo}`, data);
    }
    async update(id, data) {
        return await http2.post(`/${NombreDelModulo}/${id}`, data);
    }
    async getAll(idFilter, tipo, estado, iniciativa, tema, legislatura, search = "", page = 1, rows = 4) {
        return await http.get(
            `/${NombreDelModulo}?idFilter=${idFilter}&tipo_id=${tipo}&estado_id=${estado}&iniciativa_id=${iniciativa}&tema_id=${tema}&legislatura_id=${legislatura}&search=${search}&page=${page}&rows=${rows}`
        );
    }
    async get(id) {
        return await http.get(`/${NombreDelModulo}/${id}`);
    }
    async delete(id) {
        return await http.delete(`/${NombreDelModulo}/${id}`);
    }

    async esLey(id) {
        return await http.patch(`/${NombreDelModulo}/${id}`);
    }
    
    // async patch(id) {
    //     return await http.patch(`/${NombreDelModulo}/patch/${id}`);
    // }
    async getTotalRecords(idFilter, tipo, estado, iniciativa, tema, legislatura, search = "") {
        return await http.get(
            `/${NombreDelModulo}/totalrecords??idFilter=${idFilter}&tipo_id=${tipo}&estado_id=${estado}&iniciativa_id=${iniciativa}&tema_id=${tema}&legislatura_id=${legislatura}&search=${search}`
        );
    }
    async getCombo() {
        return await http.get(`/${NombreDelModulo}/LlenarCombo`);
    }
    async getObservacionesIniciativa(proyecto_id){
        return await http.get(`/observacionesIniciativa?proyecto_id=${proyecto_id}`);
    }  

    async getAllDocumentos(idProyecto, idFilter, search = "", page = 1, rows = 4) {
        return await http.get(
            `/${NombreDelModulo}/getAllDocumentos?idFilter=${idFilter}&proyecto_ley_id=${idProyecto}&search=${search}&page=${page}&rows=${rows}`
        );
    }

    async getTotalRecordsDocumentos(idProyecto, idFilter, search = "") {
        return await http.get(
            `/${NombreDelModulo}/totalrecordsDocumentos?idFilter=${idFilter}&proyecto_ley_id=${idProyecto}&search=${search}`
        );
    }

    async createDocumento(data) {
        return await http.post(`/${NombreDelModulo}/storeDocumento`, data);
    }

    async deleteDocumento(id) {
        return await http.delete(`/${NombreDelModulo}/deleteDocumento/${id}`);
    }
}

export default new ProyectoLeyDataService();
