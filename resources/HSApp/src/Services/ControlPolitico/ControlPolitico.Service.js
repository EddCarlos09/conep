import http from "../../Http/Http-processcommon";
import http2 from "../../Http/Http-processcommon2";
import apibase from "../../Http/Http-apibase";
const comisiones = "controlpolitico";
const Utils = "utils";

class ControlPoliticoDataService{
    async getAll(
        idFilter,
        legislatura,
        cuatrienio,
        comision,
        estado,
        search = "",
        page = 1,
        rows = 4
    ) {
        return await http.get(
            `/controlpolitico?idFilter=${idFilter}&legislatura=${legislatura}&cuatrienio=${cuatrienio}&comision=${comision}&estado=${estado}&search=${search}&page=${page}&rows=${rows}`
        );
    }
    async getTotalRecordsControlPolitico(idFilter, legislatura, cuatrienio, comision, estado, search) {
        return await http.get(
            `/controlpolitico/totalrecords?idFilter=${idFilter}&legislatura=${legislatura}&cuatrienio=${cuatrienio}&comision=${comision}&estado=${estado}&search=${search}`
        );
    }
    async get(id) {
        return await http.get(`/controlpolitico/${id}`);
    }

    async getCitantesFilter(nombre, controlPolitico){
        return await http.get(`controlpolitico/getCitantesFilter?nombre=${nombre}&controlPolitico=${controlPolitico}`);
    }
    async getCitadosFilter(nombre, controlPolitico){
        return await http.get(`controlpolitico/getCitadosFilter?nombre=${nombre}&controlPolitico=${controlPolitico}`);
    }
}

export default new ControlPoliticoDataService();

