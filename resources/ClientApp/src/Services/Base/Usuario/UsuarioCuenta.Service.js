import http from "../../../Http/Http-processcommon";
import http2 from "../../../Http/Http-processcommon2";

const NombreDelModulo = "usuarioCuenta";

class usuarioCuentaDataService {
    async create(data) {
        return await http.post(`/${NombreDelModulo}`, data);
    }
    async update(id, data) {
        return await http2.post(`/${NombreDelModulo}/${id}`, data);
    }
    async get(id) {
        return await http.get(`/${NombreDelModulo}/${id}`);
    }
    async index(data) {
        return await http.post(
            `/${NombreDelModulo}/index`, data);
    }
    async delete(id) {
        return await http.delete(`/${NombreDelModulo}/${id}`);
    }
    async desbloquear(id) {
        return await http.get(`/${NombreDelModulo}/desbloquear/${id}`);
    }

    async getDto(data) {
        return await http.post(`/${NombreDelModulo}/getDto`, data);
    }

    async updatePerfil(data) {
        return await http.put(`/${NombreDelModulo}/Perfil`, data);
    }
}

export default new usuarioCuentaDataService();
