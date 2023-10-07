import http from "../../Http/Http-processcommon";
import http2 from "../../Http/Http-processcommon2";
const NombreDelModulo = "personas";

class PersonaDataService {
    async create(data) {
        return await http.post(`/${NombreDelModulo}`, data);
    }
    async update(id, data) {
        return await http2.post(`/${NombreDelModulo}/${id}`, data);
    }
    async getAll(lugar_nacimiento_id,
        partido_id,
        grado_estudio_id,
        genero_id,
        idFilter,
        page,
        rows,
        search) {
        return await http.get(`/${NombreDelModulo}?lugar_nacimiento_id=${lugar_nacimiento_id}&partido_id=${partido_id}&grado_estudio_id=${grado_estudio_id}&genero_id=${genero_id}&idFilter=${idFilter}&page=${page}&rows=${rows}&search=${search}`);
    }
    async get(id) {
        return await http.get(`/${NombreDelModulo}/${id}`);
    }
    async delete(id) {
        return await http.delete(`/${NombreDelModulo}/${id}`);
    }
    async totalrecords(lugar_nacimiento_id,
        partido_id,
        grado_estudio_id,
        genero_id,
        idFilter,
        search) {
        return await http.get(`/${NombreDelModulo}/totalrecords?lugar_nacimiento_id=${lugar_nacimiento_id}&partido_id=${partido_id}&grado_estudio_id=${grado_estudio_id}&genero_id=${genero_id}&idFilter=${idFilter}&search=${search}`);
    }
}

export default new PersonaDataService();
