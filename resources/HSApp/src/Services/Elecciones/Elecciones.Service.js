import http from "../../Http/Http-processcommon";
import apibase from "../../Http/Http-apibase";
const NombreDelModulo = "elecciones";
const Utils = "utils";

class EleccionesDataService{
    async getAll(idFilter,corporacion,estado,cuatrienio,tipoComision,comision,search = "",page = 1,rows = 4) {
        return await http.get(
            `/${NombreDelModulo}?idFilter=${idFilter}&corporacion=${corporacion}&estado=${estado}&cuatrienio=${cuatrienio}&tipoComision=${tipoComision}&comision=${comision}&search=${search}&page=${page}&rows=${rows}`
        );
    }
    async get(id) {
        return await http.get(`/${NombreDelModulo}/${id}`);
    }
}

export default new EleccionesDataService();