import apibase from "../../Http/Http-apibase";
const NombreDelModulo = "utils";

class UtilsDataService{

    async getComboDatosContacto(){
        return await apibase.get(`/${NombreDelModulo}/getComboDatosContacto`);
    }

    async getComboComisionTipoCongresista(){
        return await apibase.get(`/${NombreDelModulo}/getComboComisionTipoCongresista`);
    }

    async getComboCorporacion(){
        return await apibase.get(`/${NombreDelModulo}/getComboCorporacion`);
    }

    async getComboTipoComision(corporacion){
        return await apibase.get(`/${NombreDelModulo}/getComboTipoComision?idcorporacion=${corporacion}`);
    }

    async getComboComisiones(idCorporacion, idTipoComision){
        return await apibase.get(`/${NombreDelModulo}/getComboComisiones?idcorporacion=${idCorporacion}&idtipocomision=${idTipoComision}`);
    }

    async getComboCuatrienio(){
        return await apibase.get(`/${NombreDelModulo}/getComboCuatrienio`);
    }

    async getComboCargoCongresista(){
        return await apibase.get(`/${NombreDelModulo}/getComboCargoCongresista`);
    }
    async getComboCongresistasComision(corporacion, cuatrienio){
        return await apibase.get(
            `/${NombreDelModulo}/getComboCongresistasComision?corporacion=${corporacion}&cuatrienio=${cuatrienio}`);
    }
    async getComboNivelBlog(){
        return await apibase.get(`/${NombreDelModulo}/getComboNivelBlog`);
    }
    async getComboTemaBlog(){
        return await apibase.get(`/${NombreDelModulo}/getComboTemaBlog`);
    }
    async getComboPartido(){
        return await apibase.get(`/${NombreDelModulo}/getComboPartido`);
    }
    async getComboPartidoPorCongresistaEnComision(idcomision, mesa){
        return await apibase.get(`/${NombreDelModulo}/getComboPartidoPorCongresistaEnComision?idcomision=${idcomision}&mesa=${mesa}`);
    }
    async getComboPartidoPorCongresistaEnProyecto(proyecto){
        return await apibase.get(`/${NombreDelModulo}/getComboPartidoPorCongresistaEnProyecto?proyecto=${proyecto}`);
    }
    async getComboTipoProyecto() {
        return await apibase.get(`/${NombreDelModulo}/getComboTipoProyecto`);
    }
    async getComboEstadoProyecto() {
        return await apibase.get(`/${NombreDelModulo}/getComboEstadoProyecto`);
    }
    async getComboIniciativaFilter(data) {
        return await apibase.post(`/${NombreDelModulo}/getComboIniciativaFilter`, data);
    }
    async getComboTipoPublicacionProyectoLeyFilter(data) {
        return await apibase.post(`/${NombreDelModulo}/getComboTipoPublicacionProyectoLeyFilter`, data);
	}
    async getComboLegislaturaFilter(data) {
        return await apibase.post(`/${NombreDelModulo}/getComboLegislaturaFilter`, data);
    }
    async getComboTemaProyectoLeyFilter(data) {
        return await apibase.post(`/${NombreDelModulo}/getComboTemaProyectoLeyFilter`, data);
	}
   
}

export default new UtilsDataService();
