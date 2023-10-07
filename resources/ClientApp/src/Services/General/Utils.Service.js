import http from "../../Http/Http-processcommon";
const NombreDelModulo = "utils";

class UtilsDataService {
    async getComboDatosContacto() {
        return await http.get(`/${NombreDelModulo}/getComboDatosContacto`);
    }

    async getComboComisionTipoCongresista() {
        return await http.get(
            `/${NombreDelModulo}/getComboComisionTipoCongresista`
        );
    }

    async getComboCorporacion() {
        return await http.get(`/${NombreDelModulo}/getComboCorporacion`);
    }

    async getComboTipoComision(idCorporacion = 0){
        return await http.get(`/${NombreDelModulo}/getComboTipoComision?idcorporacion=${idCorporacion}`);
    }

    async getComboCuatrienio() {
        return await http.get(`/${NombreDelModulo}/getComboCuatrienio`);
    }

    async getComboCargoCongresista() {
        return await http.get(`/${NombreDelModulo}/getComboCargoCongresista`);
    }

    async getComboCargoMiembrosCongresista() {
        return await http.get(`/${NombreDelModulo}/getComboCargoMiembrosCongresista`);
    }

    async getComboCargoMesaDirectivaCongresista() {
        return await http.get(`/${NombreDelModulo}/getComboCargoMesaDirectivaCongresista`);
    }

    async getComboCongresistasComision(corporacion, cuatrienio) {
        return await http.get(
            `/${NombreDelModulo}/getComboCongresistasComision?corporacion=${corporacion}&cuatrienio=${cuatrienio}`
        );
    }

    async getComboSecretariosComision() {
        return await http.get(
            `/${NombreDelModulo}/getComboSecretariosComision`
        );
    }
    async getComboCongresistas(){
        return await http.get(
            `/${NombreDelModulo}/getComboCongresistas`);
    }

    async getComboComisionMiembro(data){
        return await http.post(`/utils/getComboComisionMiembro`, data);
    }

    async getComboNivelBlog() {
        return await http.get(`/${NombreDelModulo}/getComboNivelBlog`);
    }

    async getComboTemaBlog() {
        return await http.get(`/${NombreDelModulo}/getComboTemaBlog`);
    }

    async getComboLegislatura(cuatrienio) {
        return await http.get(`/${NombreDelModulo}/getComboLegislatura?cuatrienio=${cuatrienio}`);
    }

    async getComboTipoProyecto() {
        return await http.get(`/${NombreDelModulo}/getComboTipoProyecto`);
    }

    async getComboEstadoProyecto() {
        return await http.get(`/${NombreDelModulo}/getComboEstadoProyecto`);
    }

    async getComboCargoIntegrante() {
        return await http.get(`/${NombreDelModulo}/getComboCargoIntegrante`);
    }
    async getComboComisiones(idCorporacion = 0, idTipoComision = 0){
        return await http.get(`/${NombreDelModulo}/getComboComisiones?idcorporacion=${idCorporacion}&idtipocomision=${idTipoComision}`);
    }
    async getComboTipoComisionFilter(data) {
        return await http.post(
            `/${NombreDelModulo}/getComboTipoComisionFilter`,
            data
        );
    }
    async getComboPartido() {
        return await http.get(`/${NombreDelModulo}/getComboPartido`);
    }
    async getCongresistasFilter(data) {
        return await http.post(
            `/${NombreDelModulo}/getCongresistasFilter`,
            data
        );
    }
    async getComboEstadoControlPolitico(){
        return await http.get(`/${NombreDelModulo}/getComboEstadoControlPolitico`);
    }
    async getComboEquipo() {
        return await http.get(`/${NombreDelModulo}/getComboEquipoCV`);
    }
    async getComboTipoPublicaicon() {
        return await http.get(`/${NombreDelModulo}/getComboTipoPublicacion`);
    }
    async getAutoresOtrosFilter(data) {
        return await http.post(`/${NombreDelModulo}/getAutoresOtrosFilter`, data);
    }

    async getComboComisionesFilter(data) {
        return await http.post(`/${NombreDelModulo}/getComboComisionesFilter`, data);
    }

    async getComboTipoPublicacionProyectoLeyFilter(data) {
        return await http.post(`/${NombreDelModulo}/getComboTipoPublicacionProyectoLeyFilter`, data);
	}

    async getComboTipoCitacion() {
        return await http.get(`/${NombreDelModulo}/getComboTipoCitacion`);
    }

    async getComboIniciativaFilter(data) {
        return await http.post(`/${NombreDelModulo}/getComboIniciativaFilter`, data);
    }

    async getComboTipoFechaProyectoLeyFilter(data) {
        return await http.post(`/${NombreDelModulo}/getComboTipoFechaProyectoLeyFilter`, data);
    }

    async getComboTemaFilter(data) {
        return await http.post(`/${NombreDelModulo}/getComboTemaFilter`, data);
	}
    async getComboTemaControlPoliticoFilter(data) {
        return await http.post(`/${NombreDelModulo}/getComboTemaControlPoliticoFilter`, data);
	}
    async getComboTipoMultimedia() {
        return await http.get(`/${NombreDelModulo}/getComboTipoMultimedia`);
    }
    async getComboGlosarioLegislativo() {
        return await http.get(`/${NombreDelModulo}/getComboGlosarioLegislativo`);
    }
    async getComboTipoActividadAgenda() {
        return await http.get(`/${NombreDelModulo}/getComboTipoActividadAgenda`);
    }
    async getComboLegislaturaFilter(data) {
        return await http.post(`/${NombreDelModulo}/getComboLegislaturaFilter`, data);
    }
    async getComboTipoUsuarioFilter(data) {
        return await http.post(`/${NombreDelModulo}/getComboTipoUsuarioFilter`, data);
    }
    async getComboTipoSucursalFilter(data) {
        return await http.post(`/${NombreDelModulo}/getComboTipoSucursalFilter`, data);
    }
    async getComboOpinionCongresistaAnno() {
        return await http.get(`/${NombreDelModulo}/getComboOpinionCongresistaAnno`,);
    }
    async getComboBlogNdAnno() {
        return await http.get(`/${NombreDelModulo}/getComboBlogNdAnno`,);
    }

    async getComboMunicipioFilter(data) {
        return await http.post(`/${NombreDelModulo}/getComboMunicipioFilter`, data);
    }
    async getComboProfesionFilter(data) {
        return await http.post(`/${NombreDelModulo}/getComboProfesionFilter`, data);
    }
    async getComboGeneroFilter(data) {
        return await http.post(`/${NombreDelModulo}/getComboGeneroFilter`, data);
    }
    async getComboGradoEstudioFilter(data) {
        return await http.post(`/${NombreDelModulo}/getComboGradoEstudioFilter`, data);
    }
    async getComboPartidoFilter(data) {
        return await http.post(`/${NombreDelModulo}/getComboPartidoFilter`, data);
    }
    async getComboDepartamentoFilter(data) {
        return await http.post(`/${NombreDelModulo}/getComboDepartamentoFilter`, data);
    }
    async getComboAlcanceFilter(data) {
        return await http.post(`/${NombreDelModulo}/getComboAlcanceFilter`, data);
    }
    async getProyectoLeyFilter(data) {
        return await http.post(`/${NombreDelModulo}/getProyectoLeyFilter`, data);
    }
    async getProyectoLeyFilterTotalRecords(data) {
        return await http.post(`/${NombreDelModulo}/getProyectoLeyFilterTotalRecords`, data);
    }
    async getComisionFilterPagination(data) {
        return await http.post(`/${NombreDelModulo}/getComisionFilterPagination`, data);
    }
    async getComisionFilterPaginationTotalRecord(data) {
        return await http.post(`/${NombreDelModulo}/getComisionFilterPaginationTotalRecord`, data);
    }
    async getPonenteFilterPagination(data) {
        return await http.post(`/${NombreDelModulo}/getPonenteFilterPagination`, data);
    }
    async getPonenteFilterPaginationTotalRecord(data) {
        return await http.post(`/${NombreDelModulo}/getPonenteFilterPaginationTotalRecord`, data);
    }
    async getAutorFilterPagination(data) {
        return await http.post(`/${NombreDelModulo}/getAutorFilterPagination`, data);
    }
    async getAutorFilterPaginationTotalRecord(data) {
        return await http.post(`/${NombreDelModulo}/getAutorFilterPaginationTotalRecord`, data);
    }
}

export default new UtilsDataService();
