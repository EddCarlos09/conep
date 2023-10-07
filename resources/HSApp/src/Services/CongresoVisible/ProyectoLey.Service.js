import http from "../../Http/Http-processcommon";
import http2 from "../../Http/Http-processcommon2";
import apibase from "../../Http/Http-apibase";

const NombreDelModulo = "proyectoley";

class ProyectoLeyDataService {
    async getAll(corporacion, cuatrienio, legislatura, iniciativa, tema, estado, tipo, search = "", page = 1, rows = 4, esLey) {
        return await http.get(
            `/${NombreDelModulo}?corporacion=${corporacion}&cuatrienio=${cuatrienio}&legislatura=${legislatura}&iniciativa=${iniciativa}&tema=${tema}&estado=${estado}&tipo=${tipo}&search=${search}&page=${page}&rows=${rows}&esLey=${esLey}`
        );
    }
    async getProyectosRecientesEditados() {
        return await http.get(`/${NombreDelModulo}/getRecientesEditados`);
    }
    async get(id) {
        return await http.get(`/${NombreDelModulo}/${id}`);
    }
    async getTotalRecords(corporacion, cuatrienio, legislatura, iniciativa, tema, estado, tipo, search, esLey) {
        return await http.get(
            `/${NombreDelModulo}/totalrecords?corporacion=${corporacion}&cuatrienio=${cuatrienio}&legislatura=${legislatura}&iniciativa=${iniciativa}&tema=${tema}&estado=${estado}&tipo=${tipo}&search=${search}&esLey=${esLey}`
        );
    }
    async getAutoresFilter(nombre, proyecto, partido){
        return await http.get(`/${NombreDelModulo}/getAutoresFilter?nombre=${nombre}&proyecto=${proyecto}&partido=${partido}`);
    }
    async getPonentesFilter(tipo, proyecto, partido){
        return await http.get(`/${NombreDelModulo}/getPonentesFilter?tipo=${tipo}&proyecto=${proyecto}&partido=${partido}`);
    }
    async getCountVotos(votacion){
        return await http.get(`/${NombreDelModulo}/getCountVotos?votacion=${votacion}`);
    }
    async getObservacionesIniciativa(proyecto_id, email){
        return await http.get(`/observacionesIniciativa?proyecto_id=${proyecto_id}&email=${email}`);
    }    
    async createObservacionesIniciativa(data) {
        return await http.post(`/observacionesIniciativa`, data);
    }
    async updategetObservacionesIniciativa(id, data) {
        return await http2.post(`/observacionesIniciativa/${id}`, data);
    }
}

export default new ProyectoLeyDataService();
