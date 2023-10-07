import http from "../../Http/Http-processcommon";

class InfoSitioDataService {
    async getInformacionSitioHome() {
        return await http.get(`/informacionSitio`);
    }
    async getslideCongresoVisible() {
        return await http.get(`/slideCongresoVisible`);
    }
}

export default new InfoSitioDataService();
