import http from "../../Http/Http-processcommon";
import http2 from "../../Http/Http-processcommon2";
import apibase from "../../Http/Http-apibase";
const NombreDelModulo = "votaciones";
const Utils = "utils";

class VotacionesDataService {
    async get(id) {
        return await http.get(`/${NombreDelModulo}/${id}`);
    }
    async getComboTipoRespuestaVotacion() {
        return await apibase.get(`/${Utils}/getComboTipoRespuestaVotacion`);
    }
    async getCurulesInVotacion(idvotacion, cuatrienio, corporacion) {
        return await apibase.get(`/${Utils}/getCurulesInVotacion?votacion=${idvotacion}&cuatrienio=${cuatrienio}&corporacion=${corporacion}`);
    }
}

export default new VotacionesDataService();
