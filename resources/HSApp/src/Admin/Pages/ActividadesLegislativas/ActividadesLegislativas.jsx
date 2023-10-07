import React from 'react';
import LittleCalendar from "../../../Components/LittleCalendar";
import Select from '../../../Components/Select';
import ActLegislativaVotacionesList from "../../../Components/CongresoVisible/ActLegislativaVotacionesList";
import SquareCardsPartidos from "../../../Components/CongresoVisible/SquareCardsPartidos";
import ActLegislativaControlPoliticoList from "../../../Components/CongresoVisible/ActLegislativaControlPoliticoList";
import ActLegislativaEleccionList from "../../../Components/CongresoVisible/ActLegislativaEleccionList";
import ActLegislativaEventosList from "../../../Components/CongresoVisible/ActLegislativaEventosList";
import ActividadesLegislativasDataService from "../../../Services/ActividadesLegislativas/ActividadesLegislativas.Service";
import infoSitioDataService from "../../../Services/General/informacionSitio.Service";
import { Constantes } from "../../../Constants/Constantes.js";
import AuthLogin from "../../../Utils/AuthLogin";
import SunEditor from 'suneditor-react';
import * as FechaMysql from "../../../Utils/FormatDate";
const auth = new AuthLogin();
const formatDate = () => {
    let dt = new Date()
    let month = dt.getMonth();
    let day = dt.getDate();

    return dt.getFullYear() + "-" + (month < 10 ? "0" + (month + 1) : (month + 1)) + "-" + (day < 10 ? "0" + day : day)
}
const dateCalendar = (e) => {
    return e.year + "-" + (e.month < 10 ? "0" + e.month : e.month) + "-" + (e.day < 10 ? "0" + e.day : e.day)
}
class ActividadesLegislativas extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            subloaderCalendario: true,
            subloaderAgendaActividades: true,
            subloaderFilters:false,
            subloader: false,
            imgPrincipal: null,
            fechaActual: formatDate(),
            year:new Date().getFullYear(),
            mesActual:new Date().getMonth() < 10 ? "0" + (new Date().getMonth() + 1) : (new Date().getMonth() + 1),            
            fechaCalendario: null,
            eventos: [],
            listByFecha: {
                data: [],
                dataCalendar:[],
                totalRows: 0,
                search: "",
                page: 1,
                rows: 5
            },
            listVotaciones: {
                data: [],
                tiposRespuestas: [],
                totalRows: 0,
                search: "",
                page: 1,
                rows: 5
            },
            listControlPolitico: {
                data: [],
                totalRows: 0,
                search: "",
                page: 1,
                rows: 5
            },
            listElecciones: {
                data: [],
                totalRows: 0,
                search: "",
                page: 1,
                rows: 5
            },
            listPartidos: {
                data: [],
                totalRows: 0,
                search: "",
                page: 1,
                rows: 8,
                esModal: true,
                targetModal: '#modal-partido'
            },
            //Agenda
            filterTipoActividadA: { value: -1, label: "Filtrar tipo de actividad" },
            dataSelectActividadA: [],
            filterCorporacionA: { value: -1, label: "Filtrar por corporación" },
            dataSelectCorporacionA: [],
            filterTComisionA: { value: -1, label: "Filtrar por tipo de comisión" },
            dataSelecTComisionA: [],
            filterComisionA: { value: -1, label: "Filtrar por comisión" },
            dataSelectComisionA: [],
            dataAgendaLegislativa: [],  
            //General
            dataSelectCuatrienio: [], // Se puede compartir solo las opciones del combo
            dataSelectTipoCorporacion: [],
            // Votaciones
            filterCuatrienioVotaciones: { value: -1, label: "Ver todos" },
            filterLegislaturaVotaciones: { value: -1, label: "Ver todas" },
            dataSelectLegislaturaVotaciones: [],
            filterTipoComisionVotaciones: { value: -1, label: "Elija tipo de comisión" },
            dataSelectTipoComisionVotaciones: [],
            filterComisionVotaciones: { value: -1, label: "Ver todas" },
            dataSelectComisionVotaciones: [],
            filterTipoCorporacionVotaciones: { value: -1, label: "Ver cámara y senado" },
            // Contro político
            filterCuatrienioControlPolitico: { value: -1, label: "Ver todos" },
            filterLegislaturaControlPolitico: { value: -1, label: "Ver todos" },
            dataSelectLegislaturaControlPolitico: [],
            filterTipoComisionControlPolitico: { value: -1, label: "Elija tipo de comisión" },
            dataSelectTipoComisionControlPolitico: [],
            filterComisionControlPolitico: { value: -1, label: "Ver todas" },
            dataSelectComisionControlPolitico: [],
            filterTipoCorporacionControlPolitico: { value: -1, label: "Ver cámara y senado" },
            filterEstadoControlPolitico: { value: -1, label: "Ver todos" },
            dataSelectEstadoControlPolitico: [],
            filterTemaControlPolitico: { value: -1, label: "Ver todos" },
            dataSelectTemaControlPolitico: [],
            // Elecciones
            filterCuatrienioElecciones: { value: -1, label: "Ver todos" },
            filterTipoComisionElecciones: { value: -1, label: "Elija tipo de comisión" },
            dataSelectTipoComisionElecciones: [],
            filterComisionElecciones: { value: -1, label: "Ver todas" },
            dataSelectComisionElecciones: [],
            filterTipoCorporacionElecciones: { value: -1, label: "Ver cámara y senado" },
                     
            //Partidos
            filterSelectActivoPartidos: { value: -1, label: "Ver todos" },
            dataSelectActivoPartidos: [{ value: -1, label: "Ver todos" }, { value: 1, label: "Activo" }, { value: 0, label: "Inactivo" }],
            selectPartido: {},
            subloaderModalPartido: false,
            subloaderFilters: false,
        }
    }
    // Handlers
    
    handlerDataSelectDay = async (e) => {
        let fecha = dateCalendar(e);
        this.setState({fechaActual:fecha});
        this.setState({ subloader: true });
        await this.getAgendaLegislativa(1, this.state.listByFecha.search, this.state.listByFecha.page, this.state.listByFecha.rows, fecha);
        this.setState({ subloader: false, fechaCalendario: e });
    }
    handlerFilterActividadAgenda = async (selectActividad) => {
        this.setState({ filterTipoActividadA: selectActividad });
       await this.getAgendaLegislativa(1,this.state.listByFecha.search, this.state.listByFecha.page, this.state.listByFecha.rows, this.state.fechaActual,selectActividad.value,this.state.filterCorporacionA.value,this.state.filterComisionA.value);
       
    }
    handlerFilterCorporacionAgenda = async (selectCorporacion) => {
        this.setState({ filterCorporacionA: selectCorporacion });
    
        await this.getComboTipoComision("dataSelecTComisionA", selectCorporacion.value);
        await this.getAgendaLegislativa(1, this.state.listByFecha.search, this.state.listByFecha.page, this.state.listByFecha.rows, this.state.fechaActual,this.state.filterTipoActividadA.value,selectCorporacion.value,this.state.filterComisionA.value);       
       
    }
    handlerFilterTComisionAgenda = async (selectTComision) => {
        this.setState({ filterTComisionA: selectTComision });
        await this.getComboComisiones("dataSelectComisionA", selectTComision.value);               
    }
    handlerFilterComisionAgenda = async (selectComision) => {
        this.setState({ filterComisionA: selectComision });
        await this.getAgendaLegislativa(1, this.state.listByFecha.search, this.state.listByFecha.page, this.state.listByFecha.rows, this.state.fechaActual,this.state.filterTipoActividadA.value,this.state.filterCorporacionA.value,selectComision.value);        
    }
    handlerPrevAgenda = async (e) => {
        this.setState({subloaderCalendario: true})
        let monthTemp = e.currentTarget.parentNode.querySelector(".Calendar__monthYear.-shown .Calendar__monthText").innerText;
        let yearTemp = e.currentTarget.parentNode.querySelector(".Calendar__monthYear.-shown .Calendar__yearText").innerText;
        let month = getMonthNumberByStr(prevNextMonth(monthTemp));
        let year = prevNextMonth(monthTemp) === "diciembre" ? Number(yearTemp) - 1 : Number(yearTemp)
        await this.getDataByYearAndMonth(year,month);
        this.setState({subloaderCalendario: false, year:year,month:month})
    }
    handlerNextAgenda = async (e) => {
        this.setState({subloaderCalendario: true})
        let monthTemp = e.currentTarget.parentNode.querySelector(".Calendar__monthYear.-shown .Calendar__monthText").innerText;
        let yearTemp = e.currentTarget.parentNode.querySelector(".Calendar__monthYear.-shown .Calendar__yearText").innerText;
        let month = getMonthNumberByStr(prevNextMonth(monthTemp, true));
        let year = prevNextMonth(monthTemp, true) === "enero" ? Number(yearTemp) + 1 : Number(yearTemp)
        await this.getDataByYearAndMonth(year,month);
        this.setState({subloaderCalendario: false, year:year,month:month})
    }
    handlerChooseMonth = async (e) => {
        let month = getMonthNumberByStr(e.currentTarget.innerText);
        this.setState({mesActual: month})
        await this.getDataByYearAndMonth(this.state.year,month);
        
    }
    handlerChooseYear = async (e) => {
        let year = Number(e.currentTarget.innerText);
        this.setState({year: year})
        await this.getDataByYearAndMonth(year,this.state.mesActual);
    }
    findCalendarElements = async () => {
        let valido = true;
        if(document.querySelector(".Calendar__monthArrowWrapper"))
            valido = false;
        if(document.querySelector(".Calendar__monthSelectorItemText"))
            valido = false;
        if(document.querySelector(".Calendar__yearSelectorText"))
            valido = false;
        return valido
    }    
    handlerPaginationAgendaActividades = async (page, rows, search = "") => {
        let listByFecha = this.state.listByFecha;
        listByFecha.page = page;
        listByFecha.rows = rows;
        listByFecha.search = search;
        this.setState({ listByFecha });
        if (this.timeout) clearTimeout(this.timeout);
        this.timeout = setTimeout(
            async function () {
                await this.getAgendaLegislativa(  
                    1 ,
                    search,
                    page,
                    rows,
                    this.state.fechaActual,
                    this.state.filterTipoActividadA.value,
                    this.state.filterCorporacionA.value,
                    this.state.filterComisionA.value  
                );
            }.bind(this),
            1000
        );
    }
    handlerFilterCuatrienioVotaciones = async (selectCuatrienio) => {
        this.setState({ filterCuatrienioVotaciones: selectCuatrienio });
        await this.getAllVotaciones(1, this.state.filterTipoCorporacionVotaciones.value, this.state.filterLegislaturaVotaciones.value, selectCuatrienio.value, this.state.filterComisionVotaciones.value, this.state.listVotaciones.search, this.state.listVotaciones.page, this.state.listVotaciones.rows);
        await this.getComboLegislatura("dataSelectLegislaturaVotaciones", selectCuatrienio.value);
    }
    handlerFilterLegislaturaVotaciones = async (selectLegislatura) => {
        this.setState({ filterLegislaturaVotaciones: selectLegislatura });
        await this.getAllVotaciones(1, this.state.filterTipoCorporacionVotaciones.value, selectLegislatura.value, this.state.filterCuatrienioVotaciones.value, this.state.filterComisionVotaciones.value, this.state.listVotaciones.search, this.state.listVotaciones.page, this.state.listVotaciones.rows);
    }
    handlerFilterTipoComisionVotaciones = async (selectTipoComision) => {
        this.setState({ filterTipoComisionVotaciones: selectTipoComision, dataSelectComisionVotaciones: [], filterComisionVotaciones: { value: -1, label: "Seleccione comisión" } });
        await this.getComboComisiones("dataSelectComisionVotaciones", selectTipoComision.value)
    }
    handlerFilterComisionVotaciones = async (selectComision) => {
        this.setState({ filterComisionVotaciones: selectComision });
        await this.getAllVotaciones(1, this.state.filterTipoCorporacionVotaciones.value, this.state.filterLegislaturaVotaciones.value, this.state.filterCuatrienioVotaciones.value, selectComision.value, this.state.listVotaciones.search, this.state.listVotaciones.page, this.state.listVotaciones.rows);
    }
    handlerFilterTipoCorporacionVotaciones = async (selectTipoCorporacion) => {
        this.setState({ filterTipoCorporacionVotaciones: selectTipoCorporacion });
        await this.getComboTipoComision("dataSelectTipoComisionVotaciones", selectTipoCorporacion.value);
        await this.getAllVotaciones(1, selectTipoCorporacion.value, this.state.filterLegislaturaVotaciones.value, this.state.filterCuatrienioVotaciones.value, this.state.filterComisionVotaciones.value, this.state.listVotaciones.search, this.state.listVotaciones.page, this.state.listVotaciones.rows);
    }
    handlerPaginationVotaciones = async (page, rows, search = "") => {
        let listVotaciones = this.state.listVotaciones;
        listVotaciones.page = page;
        listVotaciones.rows = rows;
        listVotaciones.search = search;
        this.setState({ listVotaciones });
        if (this.timeout) clearTimeout(this.timeout);
        this.timeout = setTimeout(
            async function () {
                await this.getAllVotaciones(
                    1,
                    this.state.filterTipoCorporacionVotaciones.value,
                    this.state.filterLegislaturaVotaciones.value,
                    this.state.filterCuatrienioVotaciones.value,
                    this.state.filterComisionVotaciones.value,
                    search,
                    page,
                    rows
                );
            }.bind(this),
            1000
        );
    }


    handlerFilterCuatrienioControlPolitico = async (selectCuatrienio) => {
        this.setState({ filterCuatrienioControlPolitico: selectCuatrienio });
        await this.getAllControlPolitico(1, this.state.filterTipoCorporacionControlPolitico.value, this.state.filterLegislaturaControlPolitico.value, selectCuatrienio.value, this.state.filterComisionControlPolitico.value, this.state.filterEstadoControlPolitico.value, this.state.filterTemaControlPolitico.value, this.state.listControlPolitico.search, this.state.listControlPolitico.page, this.state.listControlPolitico.rows);
        await this.getComboLegislatura("dataSelectLegislaturaControlPolitico", selectCuatrienio.value);
    }
    handlerFilterLegislaturaControlPolitico = async (selectLegislatura) => {
        this.setState({ filterLegislaturaControlPolitico: selectLegislatura });
        await this.getAllControlPolitico(1, this.state.filterTipoCorporacionControlPolitico.value, selectLegislatura.value, this.state.filterCuatrienioControlPolitico.value, this.state.filterComisionControlPolitico.value, this.state.filterEstadoControlPolitico.value, this.state.filterTemaControlPolitico.value, this.state.listControlPolitico.search, this.state.listControlPolitico.page, this.state.listControlPolitico.rows);
    }
    handlerFilterTipoComisionControlPolitico = async (selectTipoComision) => {
        this.setState({ filterTipoComisionControlPolitico: selectTipoComision, dataSelectComisionControlPolitico: [], filterComisionControlPolitico: { value: -1, label: "Seleccione comisión" } });
        await this.getComboComisiones("dataSelectComisionControlPolitico", selectTipoComision.value)
    }
    handlerFilterComisionControlPolitico = async (selectComision) => {
        this.setState({ filterComisionControlPolitico: selectComision });
        await this.getAllControlPolitico(1, this.state.filterTipoCorporacionControlPolitico.value, this.state.filterLegislaturaControlPolitico.value, this.state.filterCuatrienioControlPolitico.value, selectComision.value, this.state.filterEstadoControlPolitico.value, this.state.filterTemaControlPolitico.value, this.state.listControlPolitico.search, this.state.listControlPolitico.page, this.state.listControlPolitico.rows);
    }
    handlerFilterTipoCorporacionControlPolitico = async (selectTipoCorporacion) => {
        this.setState({ filterTipoCorporacionControlPolitico: selectTipoCorporacion });
        await this.getComboTipoComision("dataSelectTipoComisionControlPolitico", selectTipoCorporacion.value);
        await this.getAllControlPolitico(1, selectTipoCorporacion.value, this.state.filterLegislaturaControlPolitico.value, this.state.filterCuatrienioControlPolitico.value, this.state.filterComisionControlPolitico.value, this.state.filterEstadoControlPolitico.value, this.state.filterTemaControlPolitico.value, this.state.listControlPolitico.search, this.state.listControlPolitico.page, this.state.listControlPolitico.rows);
    }
    handlerFilterTemaControlPolitico = async (selectTema) => {
        this.setState({ filterTemaControlPolitico: selectTema });
        await this.getAllControlPolitico(1, this.state.filterTipoCorporacionControlPolitico.value, this.state.filterLegislaturaControlPolitico.value, this.state.filterCuatrienioControlPolitico.value, this.state.filterComisionControlPolitico.value, this.state.filterEstadoControlPolitico.value, selectTema.value, this.state.listControlPolitico.search, this.state.listControlPolitico.page, this.state.listControlPolitico.rows);
    }
    handlerFilterEstadoControlPolitico = async (selectEstado) => {
        this.setState({ filterEstadoControlPolitico: selectEstado });
        await this.getAllControlPolitico(1, this.state.filterTipoCorporacionControlPolitico.value, this.state.filterLegislaturaControlPolitico.value, this.state.filterCuatrienioControlPolitico.value, this.state.filterComisionControlPolitico.value, selectEstado.value, this.state.filterTemaControlPolitico.value, this.state.listControlPolitico.search, this.state.listControlPolitico.page, this.state.listControlPolitico.rows);
    }
    handlerPaginationControlPolitico = async (page, rows, search = "") => {
        let listControlPolitico = this.state.listControlPolitico;
        listControlPolitico.page = page;
        listControlPolitico.rows = rows;
        listControlPolitico.search = search;
        this.setState({ listControlPolitico });
        if (this.timeout) clearTimeout(this.timeout);
        this.timeout = setTimeout(
            async function () {
                await this.getAllControlPolitico(
                    1,
                    this.state.filterTipoCorporacionControlPolitico.value,
                    this.state.filterLegislaturaControlPolitico.value,
                    this.state.filterCuatrienioControlPolitico.value,
                    this.state.filterComisionControlPolitico.value,
                    this.state.filterEstadoControlPolitico.value,
                    this.state.filterTemaControlPolitico.value,
                    search,
                    page,
                    rows);
            }.bind(this),
            1000
        );
    }    
    handlerFilterCuatrienioElecciones = async (selectCuatrienio) => {
        this.setState({ filterCuatrienioElecciones: selectCuatrienio });
        await this.getAllElecciones(1, this.state.filterTipoCorporacionElecciones.value, selectCuatrienio.value, this.state.filterComisionElecciones.value, this.state.listElecciones.search, this.state.listElecciones.page, this.state.listElecciones.rows);
    }
    handlerFilterTipoComisionElecciones = async (selectTipoComision) => {
        this.setState({ filterTipoComisionElecciones: selectTipoComision, dataSelectComisionElecciones: [], filterComisionElecciones: { value: -1, label: "Seleccione comisión" } });
        await this.getComboComisiones("dataSelectComisionElecciones", selectTipoComision.value)
    }
    handlerFilterComisionElecciones = async (selectComision) => {
        this.setState({ filterComisionElecciones: selectComision });
        await this.getAllElecciones(1, this.state.filterTipoCorporacionElecciones.value, this.state.filterCuatrienioElecciones.value, selectComision.value, this.state.listElecciones.search, this.state.listElecciones.page, this.state.listElecciones.rows);
    }
    handlerFilterTipoCorporacionElecciones = async (selectTipoCorporacion) => {
        this.setState({ filterTipoCorporacionElecciones: selectTipoCorporacion });
        await this.getComboTipoComision("dataSelectTipoComisionElecciones", selectTipoCorporacion.value);
        await this.getAllElecciones(1, selectTipoCorporacion.value, this.state.filterCuatrienioElecciones.value, this.state.filterComisionElecciones.value, this.state.listElecciones.search, this.state.listElecciones.page, this.state.listElecciones.rows);
    }

    handlerPaginationElecciones = async (page, rows, search = "") => {
        let listElecciones = this.state.listElecciones;
        listElecciones.page = page;
        listElecciones.rows = rows;
        listElecciones.search = search;
        this.setState({ listElecciones });
        if (this.timeout) clearTimeout(this.timeout);
        this.timeout = setTimeout(
            async function () {
                await this.getAllElecciones(
                    1,
                    this.state.filterTipoCorporacionElecciones.value,
                    this.state.filterCuatrienioElecciones.value,
                    this.state.filterComisionElecciones.value,
                    search,
                    page,
                    rows);
            }.bind(this),
            1000
        );
    }

    
    //     
    //Partidos handler
    handlerForLoadModalPartido = async (item) => {
        this.setState({ subloaderModalPartido: true });
        let selectPartido = this.state.selectPartido;
        selectPartido = item;
        this.setState({ subloaderModalPartido: false, selectPartido });
    }

    handlerFilterActivoPartido = async (select) => {
        this.setState({ filterSelectActivoPartidos: select });
        await this.handlerPaginationPartidos(1, 8, this.state.listPartidos.search)
    }

    handlerPaginationPartidos = async (page, rows, search = "") => {
        let listPartidos = this.state.listPartidos;
        listPartidos.page = page;
        listPartidos.rows = rows;
        listPartidos.search = search;
        this.setState({ listPartidos });
        if (this.timeout) clearTimeout(this.timeout);
        this.timeout = setTimeout(
            async function () {
                await this.getAllPartidos(
                    this.state.filterSelectActivoPartidos.value,
                    search,
                    page,
                    rows);
            }.bind(this),
            1000
        );
    }

    //
    componentDidMount = async () => {
        // Proceso para acondicionar calendario. No borrar
        if(this.findCalendarElements()){
            let prevButton = document.querySelector(".Calendar__monthArrowWrapper.-right");
            let nextButton = document.querySelector(".Calendar__monthArrowWrapper.-left");
            let monthsButton = document.querySelectorAll(".Calendar__monthSelectorItemText");
            let yearsButton = document.querySelectorAll(".Calendar__yearSelectorText");
            prevButton.addEventListener("click", async (e)=>{
                e.preventDefault();
                e.target.disabled = true;
                await this.handlerPrevAgenda(e);
                e.target.disabled = false;
            });
            nextButton.addEventListener("click", async (e)=>{
                e.preventDefault();
                e.target.disabled = true;
                await this.handlerNextAgenda(e)
                e.target.disabled = false;
            });
            monthsButton.forEach(month =>{month.addEventListener("click", (e)=>{this.handlerChooseMonth(e)})})
            yearsButton.forEach(year =>{year.addEventListener("click", (e)=>{this.handlerChooseYear(e)})})
            
        }
        // Cargar primero agenda     
        // await this.getAgendaLegislativa(this.state.fechaActual);
        await this.getTipoActividad();
        await this.getComboCorporacion();
        await this.getAgendaLegislativa(1, this.state.listByFecha.search, this.state.listByFecha.page, this.state.listByFecha.rows, this.state.fechaActual);
        await this.getDataByYearAndMonth(this.state.year,this.state.mesActual);
        await this.getInfoSitio();
        
    }
    // Métodos
    getAgendaLegislativa = async (idFilterActive, search, page, rows, fecha,tipoactividad,corporacion,comision) => {
        this.setState({ subloaderAgendaActividades: true });
        let listByFecha = this.state.listByFecha;
        let f=FechaMysql.DateTimeFormatMySql(fecha+' '+'00:00:00');
        await ActividadesLegislativasDataService.getAgendaLegislativaByFecha(
            idFilterActive,            
            search, page, rows, f,tipoactividad,corporacion,comision)
            .then((response) => {
                listByFecha.data = response.data;
               
            })
            .catch((e) => {
                console.error(e);
            });
            await ActividadesLegislativasDataService.getTotalRecordsAgendaActividad(
                idFilterActive,            
                search, f,tipoactividad,corporacion,comision)
                .then((response) => {
                    listByFecha.totalRows = response.data;
                })
                .catch((e) => {
                    console.error(e);
                });

        this.setState({
            subloaderAgendaActividades: false,
            listByFecha
        });
    }

    getDataByYearAndMonth = async (year,month)=>{
        this.setState({ subloaderCalendario: true });
        let listByFecha = this.state.listByFecha;   
        await ActividadesLegislativasDataService.getDataByYearAndMonth(year,month,0)
            .then((response) => {
                let data = response.data;
                let dataCalendar = [];
               
                let f;
                data.forEach(x=> {
                    f = x.fecha.slice(0,10);
                    dataCalendar.push({ year: Number(f.split("-")[0]), month: Number(f.split("-")[1]),day:Number(f.split("-")[2]), className:'tieneEventos'});
                });
                listByFecha.dataCalendar = dataCalendar;
               
            })
            .catch((e) => {
                console.error(e);
            });

        this.setState({
            listByFecha,
            subloaderCalendario: false
        });
    }
    getInfoSitio = async () => {
        this.setState({ loading: true });
        let imgPrincipal = this.state.imgPrincipal;
        await infoSitioDataService.getInformacionSitioHome()
            .then((response) => {
                imgPrincipal = response.data[0].imgPrincipal;
            })
            .catch((e) => {
                console.error(e);
            });

        this.setState({
            imgPrincipal: imgPrincipal
        });
    };

    getComboTipoRespuestaVotacion = async () => {
        let listVotaciones = this.state.listVotaciones;
        if (listVotaciones.tiposRespuestas.length === 0 || listVotaciones.tiposRespuestas === null || typeof listVotaciones.tiposRespuestas === 'undefined') {
            this.setState({ subloader: true })
            await ActividadesLegislativasDataService.getComboTipoRespuestaVotacion().then(response => {
                listVotaciones.tiposRespuestas = response.data;
                this.setState({ listVotaciones });
            })
        }
    }
    getComboTipoComision = async (prop, idCorporacion) => {
        this.setState({ subloaderFilters: true })
        await ActividadesLegislativasDataService.getComboTipoComision(idCorporacion).then(response => {
            let combo = [];
            let selected = { value: -1, label: "Elija tipo de comisión" };
            let selectedComision = { value: -1, label: "Ver todas" };
            response.data.forEach(i => {
                combo.push({ value: i.id, label: i.nombre })
            })
            combo.unshift({ value: -1, label: "Elija tipo de comisión" })
            this.setState({
                [prop]: combo,
                filterTipoComisionVotaciones: selected,
                filterTipoComisionControlPolitico: selected,
                filterTipoComisionElecciones: selected,
                filterComisionControlPolitico: selectedComision,
                filterComisionElecciones: selectedComision,
                filterComisionVotaciones: selectedComision,
                dataSelectComisionControlPolitico: [],
                dataSelectComisionElecciones: [],
                dataSelectComisionVotaciones: [],
                subloaderFilters: false
            })
        })
    }
    getComboComisiones = async (prop, idTipoComision) => {
        this.setState({ subloaderFilters: true })
        await ActividadesLegislativasDataService.getComboComisiones(idTipoComision).then(response => {
            let combo = [];
            response.data.forEach(i => {
                combo.push({ value: i.id, label: i.nombre })
            })
            combo.unshift({ value: -1, label: "Ver todas" })
            this.setState({
                [prop]: combo,
                subloaderFilters: false
            })
        })
    }
    getTipoActividad = async () => {
        this.setState({ subloaderFilters: true })
        await ActividadesLegislativasDataService.getComboTipoActividadAgenda().then(response => {
            let combo = [];
            response.data.forEach(i => {
                combo.push({ value: i.id, label: i.nombre })
            })
            combo.unshift({ value: -1, label: "Ver todas" })
            this.setState({
                dataSelectActividadA: combo,
                subloaderFilters: false
            })
        })
    }
    getComboCorporacion = async () => {
        this.setState({ subloaderFilters: true })
        await ActividadesLegislativasDataService.getComboCorporacion().then(response => {
            let combo = [];
            response.data.forEach(i => {
                combo.push({ value: i.id, label: i.nombre })
            })
            combo.unshift({ value: -1, label: "Ver cámara y senado" })
            this.setState({
                dataSelectTipoCorporacion: combo,
                dataSelectCorporacionA:combo,
                subloaderFilters: false
            })
        })
    }
    getComboCuatrienio = async () => {
        await ActividadesLegislativasDataService.getComboCuatrienio().then(response => {
            let combo = [];
            response.data.forEach(i => {
                combo.push({ value: i.id, label: i.nombre })
            })
            combo.unshift({ value: -1, label: "Ver todos" })
            this.setState({
                dataSelectCuatrienio: combo
            })
        })
    }
    getComboLegislatura = async (prop, cuatrienio) => {
        await ActividadesLegislativasDataService.getComboLegislatura(cuatrienio).then(response => {
            let combo = [];
            response.data.forEach(i => {
                combo.push({ value: i.id, label: i.nombre })
            })
            combo.unshift({ value: -1, label: "Ver todas" })
            this.setState({
                [prop]: combo
            })
        })
    }
    getDataVotaciones = async () => {
        this.setState({subloader: true})
        if (this.state.dataSelectTipoCorporacion.length === 0 || this.state.dataSelectTipoCorporacion === null || typeof this.state.dataSelectTipoCorporacion === 'undefined')
            await this.getComboCorporacion();
        if (this.state.dataSelectCuatrienio.length === 0 || this.state.dataSelectCuatrienio === null || typeof this.state.dataSelectCuatrienio === 'undefined')
            await this.getComboCuatrienio();

        await this.getComboTipoRespuestaVotacion();
        await this.getAllVotaciones(1, this.state.filterTipoCorporacionVotaciones.value, this.state.filterLegislaturaVotaciones.value, this.state.filterCuatrienioVotaciones.value, this.state.filterComisionVotaciones.value, this.state.listVotaciones.search, this.state.listVotaciones.page, this.state.listVotaciones.rows);
    }

    getAllVotaciones = async (idFilterActive, corporacion, legislatura, cuatrienio, comision, search, page, rows) => {
        this.setState({ subloader: true });
        let listVotaciones = this.state.listVotaciones;
        await ActividadesLegislativasDataService.getAllVotaciones(
            idFilterActive,
            corporacion, legislatura, cuatrienio, comision,
            search, page, rows
        )
            .then((response) => {
                listVotaciones.data = response.data;
            })
            .catch((e) => {
                console.error(e);
            });
        await ActividadesLegislativasDataService.getTotalRecordsVotaciones(
            idFilterActive,
            corporacion, legislatura, cuatrienio, comision,
            search
        )
            .then((response) => {
                listVotaciones.totalRows = response.data;
            })
            .catch((e) => {
                console.error(e);
            });

        this.setState({
            listVotaciones,
            subloader: false
        });
    };

    getDataControlPolitico = async () => {
        this.setState({subloader: true})
        if (this.state.dataSelectTipoCorporacion.length === 0 || this.state.dataSelectTipoCorporacion === null || typeof this.state.dataSelectTipoCorporacion === 'undefined')
            await this.getComboCorporacion();
        if (this.state.dataSelectCuatrienio.length === 0 || this.state.dataSelectCuatrienio === null || typeof this.state.dataSelectCuatrienio === 'undefined')
            await this.getComboCuatrienio();
        if (this.state.dataSelectEstadoControlPolitico.length === 0 || this.state.dataSelectEstadoControlPolitico === null || typeof this.state.dataSelectEstadoControlPolitico === 'undefined')
            await this.getComboEstadoControlPolitico();
        if (this.state.dataSelectTemaControlPolitico.length === 0 || this.state.dataSelectTemaControlPolitico === null || typeof this.state.dataSelectTemaControlPolitico === 'undefined')
            await this.getComboTemaControlPolitico();

        await this.getAllControlPolitico(1, this.state.filterTipoCorporacionControlPolitico.value, this.state.filterLegislaturaControlPolitico.value, this.state.filterCuatrienioControlPolitico.value, this.state.filterComisionControlPolitico.value, this.state.filterEstadoControlPolitico.value, this.state.filterTemaControlPolitico.value, this.state.listControlPolitico.search, this.state.listControlPolitico.page, this.state.listControlPolitico.rows);
    }
    getComboEstadoControlPolitico = async () => {
        await ActividadesLegislativasDataService.getComboEstadoControlPolitico().then(response => {
            let combo = [];
            response.data.forEach(i => {
                combo.push({ value: i.id, label: i.nombre })
            })
            combo.unshift({ value: -1, label: "Ver todos" })
            this.setState({
                dataSelectEstadoControlPolitico: combo
            })
        })
    }
    getComboTemaControlPolitico = async () => {
        await ActividadesLegislativasDataService.getComboTemaControlPolitico().then(response => {
            let combo = [];
            response.data.forEach(i => {
                combo.push({ value: i.id, label: i.nombre })
            })
            combo.unshift({ value: -1, label: "Ver todos" })
            this.setState({
                dataSelectTemaControlPolitico: combo
            })
        })
    }
    getAllControlPolitico = async (idFilterActive, corporacion, legislatura, cuatrienio, comision, estado, tema, search, page, rows) => {
        this.setState({ subloader: true });
        let listControlPolitico = this.state.listControlPolitico;
        await ActividadesLegislativasDataService.getAllControlPolitico(
            idFilterActive,
            corporacion, legislatura, cuatrienio, comision, estado, tema,
            search, page, rows
        )
            .then((response) => {
                listControlPolitico.data = response.data;
            })
            .catch((e) => {
                console.error(e);
            });
        await ActividadesLegislativasDataService.getTotalRecordsControlPolitico(
            idFilterActive,
            corporacion, legislatura, cuatrienio, comision, estado, tema,
            search
        )
            .then((response) => {
                listControlPolitico.totalRows = response.data;
            })
            .catch((e) => {
                console.error(e);
            });

        this.setState({
            listControlPolitico,
            subloader: false
        });
    };

    getDataElecciones = async () => {
        this.setState({subloader: true})
        if (this.state.dataSelectTipoCorporacion.length === 0 || this.state.dataSelectTipoCorporacion === null || typeof this.state.dataSelectTipoCorporacion === 'undefined')
            await this.getComboCorporacion();
        if (this.state.dataSelectCuatrienio.length === 0 || this.state.dataSelectCuatrienio === null || typeof this.state.dataSelectCuatrienio === 'undefined')
            await this.getComboCuatrienio();

        await this.getAllElecciones(1, this.state.filterTipoCorporacionElecciones.value, this.state.filterCuatrienioElecciones.value, this.state.filterComisionElecciones.value, this.state.listElecciones.search, this.state.listElecciones.page, this.state.listElecciones.rows);
    }
    getAllElecciones = async (idFilterActive, corporacion, cuatrienio, comision, search, page, rows) => {
        this.setState({ subloader: true });
        let listElecciones = this.state.listElecciones;
        await ActividadesLegislativasDataService.getAllElecciones(
            idFilterActive,
            corporacion, cuatrienio, comision,
            search, page, rows
        )
            .then((response) => {
                listElecciones.data = response.data;
            })
            .catch((e) => {
                console.error(e);
            });
        await ActividadesLegislativasDataService.getTotalRecordsElecciones(
            idFilterActive,
            corporacion, cuatrienio, comision,
            search
        )
            .then((response) => {
                listElecciones.totalRows = response.data;
            })
            .catch((e) => {
                console.error(e);
            });

        this.setState({
            listElecciones,
            subloader: false
        });
    };

    //Partidos data

    getDataPartidos = async () => {
        this.setState({subloader: true})
        await this.handlerPaginationPartidos(1, 8, '');
    };

    getAllPartidos = async (idFilterActive, search, page, rows) => {
        this.setState({ subloader: true });
        let listPartidos = this.state.listPartidos;
        await ActividadesLegislativasDataService.getAllPartidos(
            idFilterActive,
            search, page, rows
        )
            .then((response) => {
                listPartidos.data = response.data;
            })
            .catch((e) => {
                console.error(e);
            });
        await ActividadesLegislativasDataService.getTotalRecordsPartidos(
            idFilterActive,
            search
        )
            .then((response) => {
                listPartidos.totalRows = response.data;
            })
            .catch((e) => {
                console.error(e);
            });

        this.setState({
            listPartidos,
            subloader: false
        });
    };
    //
    render() {
        return (
            <>
                <section className="CVBannerMenuContainer no-full-height bg-blue" style={{ backgroundImage: `url(${auth.pathApi() + this.state.imgPrincipal})` }}>
                    <div className="CVBannerCentralInfo">
                        <div className="CVBanerIcon"><i class="fas fa-file-contract"></i></div>
                        <div className="CVBannerTitle text-center">
                            <h3>Actividades legislativas</h3>
                        </div>
                    </div>
                </section>
                <div className="listadoPageContainer">
                    <div className="container-fluid">
                        <div className="centerTabs lg min-height-85">
                            <ul>
                                <li onClick={(e) => { changeTab(e);}} className="active" data-ref="1">Agenda legislativa</li>
                                <li onClick={(e) => { changeTab(e); this.getDataVotaciones(); }} data-ref="2">Votaciones</li>
                                <li onClick={(e) => { changeTab(e); this.getDataControlPolitico(); }} data-ref="3">Control político</li>
                                <li onClick={(e) => { changeTab(e); this.getDataElecciones(); }} data-ref="4">Función electoral</li>
                                <li onClick={(e) => { changeTab(e); this.getDataPartidos(); }} data-ref="5">Partidos</li>
                            </ul>
                        </div>
                        <div className="contentForCenterTabs">
                            <div className={`subloader ${this.state.subloader ? "active" : ""}`}></div>
                            <div className="contentTab active" data-ref="1">
                                <section gtdtarget="3" className="no-full-height agendaSection">
                                    <div className="calendarContainerCV">
                                        <div className="container-fluid">
                                            <div className="row">
                                                <div className="col-md-5">
                                                    <div className="relative">
                                                        <div className={`subloader ${this.state.subloaderCalendario ? "active" : ""}`}></div>
                                                        <LittleCalendar value={this.state.fechaCalendario} onChange={(e) => { this.handlerDataSelectDay(e) }} customDaysClassName = {this.state.listByFecha.dataCalendar}/>
                                                    </div>
                                                </div>
                                                <div className="col-md-7">
                                                    <div className="buscador pd-25">
                                                        <div class="input-group">
                                                            <input type="text" value={this.state.listByFecha.search}
                                                                onChange={async (e) => {
                                                                    let data = this.state.listByFecha;
                                                                    data.search = e.target.value;
                                                                    this.setState({ listByFecha: data })
                                                                }}
                                                                onKeyUp={async (e) => {
                                                                    if (e.key === "Enter") {
                                                                        await this.handlerPaginationAgendaActividades(this.state.listByFecha.page, this.state.listByFecha.rows, e.target.value)
                                                                    }
                                                                }}
                                                                placeholder="Escriba para buscar" className="form-control" />

                                                            <span className="input-group-text"><button onClick={async () => { await this.handlerPaginationAgendaActividades(this.state.listByFecha.page, this.state.listByFecha.rows, this.state.listByFecha.search) }} type="button" className="btn btn-primary"><i className="fa fa-search"></i></button></span>
                                                            <span className="input-group-text"><button onClick={(e) => { toggleFilter(e.currentTarget); }} type="button" className="btn btn-primary"><i className="fa fa-filter"></i></button></span>
                                                        </div>
                                                        <div className="floatingFilters evenColors">
                                                            <div className="one-columns relative no-margin">
                                                                <div className={`subloader ${this.state.subloaderFilters ? "active" : ""}`}></div>
                                                                <div className="item">
                                                                    <label htmlFor="">Filtrar por tipo de actividad</label>
                                                                    <Select
                                                                        divClass=""
                                                                        selectplaceholder="Seleccione"
                                                                        selectValue={this.state.filterTipoActividadA}
                                                                        selectOnchange={this.handlerFilterActividadAgenda}
                                                                        selectoptions={this.state.dataSelectActividadA}
                                                                        selectIsSearchable={true}
                                                                        selectclassNamePrefix="selectReact__value-container"
                                                                        spanClass=""
                                                                        spanError="" >
                                                                    </Select>
                                                                </div>                                                            
                                                                <div className="item">
                                                                    <label htmlFor="">Filtrar por Corporación</label>
                                                                    <Select
                                                                        divClass=""
                                                                        selectplaceholder="Seleccione"
                                                                        selectValue={this.state.filterCorporacionA}
                                                                        selectOnchange={this.handlerFilterCorporacionAgenda}
                                                                        selectoptions={this.state.dataSelectCorporacionA}
                                                                        selectIsSearchable={true}
                                                                        selectclassNamePrefix="selectReact__value-container"
                                                                        spanClass=""
                                                                        spanError="" >
                                                                    </Select>
                                                                </div>
                                                                <div className="item">
                                                                    <label htmlFor="">Filtrar por Tipo de Comisión</label>
                                                                    <Select
                                                                        divClass=""
                                                                        selectplaceholder="Seleccione"
                                                                        selectValue={this.state.filterTComisionA}
                                                                        selectOnchange={this.handlerFilterTComisionAgenda}
                                                                        selectoptions={this.state.dataSelecTComisionA}
                                                                        selectIsSearchable={true}
                                                                        selectclassNamePrefix="selectReact__value-container"
                                                                        spanClass=""
                                                                        spanError="" >
                                                                    </Select>
                                                                </div>
                                                                <div className="item">
                                                                    <label htmlFor="">Filtrar por Comision</label>
                                                                    <Select
                                                                        divClass=""
                                                                        selectplaceholder="Seleccione"
                                                                        selectValue={this.state.filterComisionA}
                                                                        selectOnchange={this.handlerFilterComisionAgenda}
                                                                        selectoptions={this.state.dataSelectComisionA}
                                                                        selectIsSearchable={true} 
                                                                        selectclassNamePrefix="selectReact__value-container"
                                                                        spanClass=""
                                                                        spanError="" >
                                                                    </Select>
                                                                </div>
                                                               
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="relative">
                                                    <div className={`subloader ${this.state.subloaderAgendaActividades ? "active" : ""}`}></div>
                                                    <ActLegislativaEventosList
                                                        data={this.state.listByFecha.data}
                                                        handler = {this.handlerPaginationAgendaActividades}
                                                        pageExtends = {this.state.listByFecha.page}
                                                        pageSize = {this.state.listByFecha.rows}
                                                        totalRows = {this.state.listByFecha.totalRows}
                                                    />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            </div>
                            <div className="contentTab" data-ref="2"> {/* Votaciones */}
                                <div className="listadoPageContainer">
                                    <div className="container-fluid">
                                        <div className="listadoWPhotoContainer">
                                            <div className="row">
                                                <div className="col-lg-3 col-md-12">
                                                    <div className="filtros-vertical evenColors">
                                                        <h3><i className="fa fa-filter"></i> Filtros de información</h3>
                                                        <div className="one-columns">
                                                            <div className="item">
                                                                <label htmlFor="">Tipo de corporación</label>
                                                                <Select
                                                                    divClass=""
                                                                    selectplaceholder="Seleccione"
                                                                    selectValue={this.state.filterTipoCorporacionVotaciones}
                                                                    selectoptions={this.state.dataSelectTipoCorporacion}
                                                                    selectOnchange={this.handlerFilterTipoCorporacionVotaciones}
                                                                    selectIsSearchable={false}
                                                                    selectclassNamePrefix="selectReact__value-container"
                                                                    spanClass=""
                                                                    spanError="" >
                                                                </Select>
                                                            </div>
                                                            <div className="item">
                                                                <label htmlFor="">Cuatrienio</label>
                                                                <Select
                                                                    divClass=""
                                                                    selectplaceholder="Seleccione"
                                                                    selectValue={this.state.filterCuatrienioVotaciones}
                                                                    selectoptions={this.state.dataSelectCuatrienio}
                                                                    selectOnchange={this.handlerFilterCuatrienioVotaciones}
                                                                    selectIsSearchable={false}
                                                                    selectclassNamePrefix="selectReact__value-container"
                                                                    spanClass=""
                                                                    spanError="" >
                                                                </Select>
                                                            </div>
                                                            <div className="item">
                                                                <label htmlFor="">Legislatura</label>
                                                                <Select
                                                                    divClass=""
                                                                    selectplaceholder="Seleccione"
                                                                    selectValue={this.state.filterLegislaturaVotaciones}
                                                                    selectoptions={this.state.dataSelectLegislaturaVotaciones}
                                                                    selectOnchange={this.handlerFilterLegislaturaVotaciones}
                                                                    selectIsSearchable={false}
                                                                    selectclassNamePrefix="selectReact__value-container"
                                                                    noOptionsMessage="Debe elegir un cuatrienio"
                                                                    spanClass=""
                                                                    spanError="" >
                                                                </Select>
                                                            </div>
                                                            <div className="item">
                                                                <label htmlFor="">Tipo de comisión</label>
                                                                <Select
                                                                    divClass=""
                                                                    selectplaceholder="Seleccione"
                                                                    selectValue={this.state.filterTipoComisionVotaciones}
                                                                    selectoptions={this.state.dataSelectTipoComisionVotaciones}
                                                                    selectOnchange={this.handlerFilterTipoComisionVotaciones}
                                                                    selectIsSearchable={false}
                                                                    selectclassNamePrefix="selectReact__value-container"
                                                                    noOptionsMessage="Debe elegir una corporación"
                                                                    spanClass=""
                                                                    spanError="" >
                                                                </Select>
                                                            </div>
                                                            <div className="item">
                                                                <label htmlFor="">Comisión</label>
                                                                <Select
                                                                    divClass=""
                                                                    selectplaceholder="Seleccione"
                                                                    selectValue={this.state.filterComisionVotaciones}
                                                                    selectoptions={this.state.dataSelectComisionVotaciones}
                                                                    selectOnchange={this.handlerFilterComisionVotaciones}
                                                                    selectIsSearchable={false}
                                                                    selectclassNamePrefix="selectReact__value-container"
                                                                    noOptionsMessage="Debe elegir un tipo de comisión"
                                                                    spanClass=""
                                                                    spanError="" >
                                                                </Select>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-lg-9 col-md-12">
                                                    <div className="buscador">
                                                        <div class="input-group">
                                                            <input type="text" value={this.state.listVotaciones.search}
                                                                onChange={async (e) => {
                                                                    let data = this.state.listVotaciones;
                                                                    data.search = e.target.value;
                                                                    this.setState({ listVotaciones: data })
                                                                }}
                                                                onKeyUp={async (e) => {
                                                                    if (e.key === "Enter") {
                                                                        await this.handlerPaginationVotaciones(this.state.listVotaciones.page, this.state.listVotaciones.rows, e.target.value)
                                                                    }
                                                                }}
                                                                placeholder="Escriba para buscar" className="form-control" />

                                                            <span className="input-group-text"><button onClick={async () => { await this.handlerPaginationVotaciones(this.state.listVotaciones.page, this.state.listVotaciones.rows, this.state.listVotaciones.search) }} type="button" className="btn btn-primary"><i className="fa fa-search"></i></button></span>
                                                        </div>
                                                    </div>
                                                    <ActLegislativaVotacionesList data={this.state.listVotaciones.data} origen={auth.pathApi()} pageExtends={this.state.listVotaciones.page} pageSize={this.state.listVotaciones.rows} totalRows={this.state.listVotaciones.rows} tiposRespuesta={this.state.listVotaciones.tiposRespuestas} handler={this.handlerPaginationVotaciones} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="contentTab" data-ref="3">
                                <div className="listadoPageContainer">
                                    <div className="container-fluid">
                                        <div className="listadoWPhotoContainer">
                                            <div className="row">
                                                <div className="col-lg-3 col-md-12">
                                                    <div className="filtros-vertical evenColors">
                                                        <h3><i className="fa fa-filter"></i> Filtros de información</h3>
                                                        <div className="one-columns">
                                                            <div className="item">
                                                                <label htmlFor="">Tipo de corporación</label>
                                                                <Select
                                                                    divClass=""
                                                                    selectplaceholder="Seleccione"
                                                                    selectValue={this.state.filterTipoCorporacionControlPolitico}
                                                                    selectoptions={this.state.dataSelectTipoCorporacion}
                                                                    selectOnchange={this.handlerFilterTipoCorporacionControlPolitico}
                                                                    selectIsSearchable={false}
                                                                    selectclassNamePrefix="selectReact__value-container"
                                                                    spanClass=""
                                                                    spanError="" >
                                                                </Select>
                                                            </div>
                                                            <div className="item">
                                                                <label htmlFor="">Tipo de comisión</label>
                                                                <Select
                                                                    divClass=""
                                                                    selectplaceholder="Seleccione"
                                                                    selectValue={this.state.filterTipoComisionControlPolitico}
                                                                    selectoptions={this.state.dataSelectTipoComisionControlPolitico}
                                                                    selectOnchange={this.handlerFilterTipoComisionControlPolitico}
                                                                    selectIsSearchable={false}
                                                                    selectclassNamePrefix="selectReact__value-container"
                                                                    noOptionsMessage="Debe elegir una corporación"
                                                                    spanClass=""
                                                                    spanError="" >
                                                                </Select>
                                                            </div>
                                                            <div className="item">
                                                                <label htmlFor="">Comisión</label>
                                                                <Select
                                                                    divClass=""
                                                                    selectplaceholder="Seleccione"
                                                                    selectValue={this.state.filterComisionControlPolitico}
                                                                    selectoptions={this.state.dataSelectComisionControlPolitico}
                                                                    selectOnchange={this.handlerFilterComisionControlPolitico}
                                                                    selectIsSearchable={false}
                                                                    selectclassNamePrefix="selectReact__value-container"
                                                                    noOptionsMessage="Debe elegir un tipo de comisión"
                                                                    spanClass=""
                                                                    spanError="" >
                                                                </Select>
                                                            </div>
                                                            <div className="item">
                                                                <label htmlFor="">Estado</label>
                                                                <Select
                                                                    divClass=""
                                                                    selectplaceholder="Seleccione"
                                                                    selectValue={this.state.filterEstadoControlPolitico}
                                                                    selectoptions={this.state.dataSelectEstadoControlPolitico}
                                                                    selectOnchange={this.handlerFilterEstadoControlPolitico}
                                                                    selectIsSearchable={false}
                                                                    selectclassNamePrefix="selectReact__value-container"
                                                                    spanClass=""
                                                                    spanError="" >
                                                                </Select>
                                                            </div>
                                                            <div className="item">
                                                                <label htmlFor="">Tema</label>
                                                                <Select
                                                                    divClass=""
                                                                    selectplaceholder="Seleccione"
                                                                    selectValue={this.state.filterTemaControlPolitico}
                                                                    selectoptions={this.state.dataSelectTemaControlPolitico}
                                                                    selectOnchange={this.handlerFilterTemaControlPolitico}
                                                                    selectIsSearchable={false}
                                                                    selectclassNamePrefix="selectReact__value-container"
                                                                    spanClass=""
                                                                    spanError="" >
                                                                </Select>
                                                            </div>
                                                            <div className="item">
                                                                <label htmlFor="">Quinquenio</label>
                                                                <Select
                                                                    divClass=""
                                                                    selectplaceholder="Seleccione"
                                                                    selectValue={this.state.filterCuatrienioControlPolitico}
                                                                    selectoptions={this.state.dataSelectCuatrienio}
                                                                    selectOnchange={this.handlerFilterCuatrienioControlPolitico}
                                                                    selectIsSearchable={false}
                                                                    selectclassNamePrefix="selectReact__value-container"
                                                                    spanClass=""
                                                                    spanError="" >
                                                                </Select>
                                                            </div>
                                                            <div className="item">
                                                                <label htmlFor="">Legislatura</label>
                                                                <Select
                                                                    divClass=""
                                                                    selectplaceholder="Seleccione"
                                                                    selectValue={this.state.filterLegislaturaControlPolitico}
                                                                    selectoptions={this.state.dataSelectLegislaturaControlPolitico}
                                                                    selectOnchange={this.handlerFilterLegislaturaControlPolitico}
                                                                    selectIsSearchable={false}
                                                                    selectclassNamePrefix="selectReact__value-container"
                                                                    noOptionsMessage="Debe elegir un quinquenio"
                                                                    spanClass=""
                                                                    spanError="" >
                                                                </Select>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-lg-9 col-md-12">
                                                    <div className="buscador">
                                                        <   div class="input-group">
                                                            <input type="text" value={this.state.listControlPolitico.search}
                                                                onChange={async (e) => {
                                                                    let data = this.state.listControlPolitico;
                                                                    data.search = e.target.value;
                                                                    this.setState({ listControlPolitico: data })
                                                                }}
                                                                onKeyUp={async (e) => {
                                                                    if (e.key === "Enter") {
                                                                        await this.handlerPaginationControlPolitico(this.state.listControlPolitico.page, this.state.listControlPolitico.rows, e.target.value)
                                                                    }
                                                                }}
                                                                placeholder="Escriba para buscar" className="form-control" />

                                                            <span className="input-group-text"><button onClick={async () => { await this.handlerPaginationControlPolitico(this.state.listControlPolitico.page, this.state.listControlPolitico.rows, this.state.listControlPolitico.search) }} type="button" className="btn btn-primary"><i className="fa fa-search"></i></button></span>
                                                        </div>
                                                    </div>
                                                    <ActLegislativaControlPoliticoList data={this.state.listControlPolitico.data} handler={this.handlerPaginationControlPolitico} pageExtends={this.state.listControlPolitico.page} pageSize={this.state.listControlPolitico.rows} totalRows={this.state.listControlPolitico.totalRows} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="contentTab" data-ref="4">
                                <div className="listadoPageContainer">
                                    <div className="container-fluid">
                                        <div className="listadoWPhotoContainer">
                                            <div className="row">
                                                <div className="col-lg-3 col-md-12">
                                                    <div className="filtros-vertical evenColors">
                                                        <h3><i className="fa fa-filter"></i> Filtros de información</h3>
                                                        <div className="one-columns">
                                                            <div className="item">
                                                                <label htmlFor="">Quinquenio</label>
                                                                <Select
                                                                    divClass=""
                                                                    selectplaceholder="Seleccione"
                                                                    selectValue={this.state.filterCuatrienioElecciones}
                                                                    selectoptions={this.state.dataSelectCuatrienio}
                                                                    selectOnchange={this.handlerFilterCuatrienioElecciones}
                                                                    selectIsSearchable={false}
                                                                    selectclassNamePrefix="selectReact__value-container"
                                                                    spanClass=""
                                                                    spanError="" >
                                                                </Select>
                                                            </div>
                                                            <div className="item">
                                                                <label htmlFor="">Tipo de corporación</label>
                                                                <Select
                                                                    divClass=""
                                                                    selectplaceholder="Seleccione"
                                                                    selectValue={this.state.filterTipoCorporacionElecciones}
                                                                    selectoptions={this.state.dataSelectTipoCorporacion}
                                                                    selectOnchange={this.handlerFilterTipoCorporacionElecciones}
                                                                    selectIsSearchable={false}
                                                                    selectclassNamePrefix="selectReact__value-container"
                                                                    spanClass=""
                                                                    spanError="" >
                                                                </Select>
                                                            </div>
                                                            <div className="item">
                                                                <label htmlFor="">Tipo de comisión</label>
                                                                <Select
                                                                    divClass=""
                                                                    selectplaceholder="Seleccione"
                                                                    selectValue={this.state.filterTipoComisionElecciones}
                                                                    selectoptions={this.state.dataSelectTipoComisionElecciones}
                                                                    selectOnchange={this.handlerFilterTipoComisionElecciones}
                                                                    selectIsSearchable={false}
                                                                    selectclassNamePrefix="selectReact__value-container"
                                                                    noOptionsMessage="Debe elegir una corporación"
                                                                    spanClass=""
                                                                    spanError="" >
                                                                </Select>
                                                            </div>
                                                            <div className="item">
                                                                <label htmlFor="">Comisión</label>
                                                                <Select
                                                                    divClass=""
                                                                    selectplaceholder="Seleccione"
                                                                    selectValue={this.state.filterComisionElecciones}
                                                                    selectoptions={this.state.dataSelectComisionElecciones}
                                                                    selectOnchange={this.handlerFilterComisionElecciones}
                                                                    selectIsSearchable={false}
                                                                    selectclassNamePrefix="selectReact__value-container"
                                                                    noOptionsMessage="Debe elegir un tipo de comisión"
                                                                    spanClass=""
                                                                    spanError="" >
                                                                </Select>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-lg-9 col-md-12">
                                                    <div className="buscador">
                                                        <div class="input-group">
                                                            <input type="text" value={this.state.listElecciones.search}
                                                                onChange={async (e) => {
                                                                    let data = this.state.listElecciones;
                                                                    data.search = e.target.value;
                                                                    this.setState({ listElecciones: data })
                                                                }}
                                                                onKeyUp={async (e) => {
                                                                    if (e.key === "Enter") {
                                                                        await this.handlerPaginationElecciones(this.state.listElecciones.page, this.state.listElecciones.rows, e.target.value)
                                                                    }
                                                                }}
                                                                placeholder="Escriba para buscar" className="form-control" />

                                                            <span className="input-group-text"><button onClick={async () => { await this.handlerPaginationElecciones(this.state.listElecciones.page, this.state.listElecciones.rows, this.state.listElecciones.search) }} type="button" className="btn btn-primary"><i className="fa fa-search"></i></button></span>
                                                        </div>
                                                    </div>
                                                    <ActLegislativaEleccionList data={this.state.listElecciones.data} handler={this.handlerPaginationElecciones} defaultImage={Constantes.NoImagen} pageExtends={this.state.listElecciones.page} pageSize={this.state.listElecciones.rows} totalRows={this.state.listElecciones.totalRows} pathImgOrigen={auth.pathApi()} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="contentTab" data-ref="5">
                                <div className="listadoPageContainer">
                                    <div className="container-fluid">
                                        <div className="listadoWPhotoContainer">
                                            <div className="row">
                                                <div className="col-lg-3 col-md-12">
                                                    <div className="filtros-vertical evenColors">
                                                        <h3><i className="fa fa-filter"></i> Filtros de información</h3>
                                                        <div className="one-columns">
                                                            <div className="item">
                                                                <label htmlFor="">Filtrar por activo</label>
                                                                <Select
                                                                    divClass=""
                                                                    selectplaceholder="Seleccione"
                                                                    selectValue={this.state.filterSelectActivoPartidos}
                                                                    selectoptions={this.state.dataSelectActivoPartidos}
                                                                    selectOnchange={this.handlerFilterActivoPartido}
                                                                    selectIsSearchable={false}
                                                                    selectclassNamePrefix="selectReact__value-container"
                                                                    spanClass=""
                                                                    spanError="" >
                                                                </Select>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-lg-9 col-md-12">
                                                    <div className="buscador">
                                                        <div class="input-group">
                                                            <input type="text" value={this.state.listPartidos.search}
                                                                onChange={async (e) => {
                                                                    let data = this.state.listPartidos;
                                                                    data.search = e.target.value;
                                                                    this.setState({ listPartidos: data })
                                                                }}
                                                                onKeyUp={async (e) => {
                                                                    if (e.key === "Enter") {
                                                                        await this.handlerPaginationPartidos(this.state.listPartidos.page, this.state.listPartidos.rows, e.target.value)
                                                                    }
                                                                }}
                                                                placeholder="Escriba para buscar" className="form-control" />

                                                            <span className="input-group-text"><button onClick={async () => { await this.handlerPaginationPartidos(this.state.listPartidos.page, this.state.listPartidos.rows, this.state.listPartidos.search) }} type="button" className="btn btn-primary"><i className="fa fa-search"></i></button></span>
                                                        </div>
                                                    </div>
                                                    <SquareCardsPartidos
                                                        data={this.state.listPartidos.data}
                                                        handler={this.handlerPaginationPartidos}
                                                        defaultImage={Constantes.NoImagenPicture}
                                                        pageExtends={this.state.listPartidos.page}
                                                        pageSize={this.state.listPartidos.rows}
                                                        totalRows={this.state.listPartidos.totalRows}
                                                        pathImgOrigen={auth.pathApi()}
                                                        esModal={this.state.listPartidos.esModal}
                                                        targetModal={this.state.listPartidos.targetModal}
                                                        handlerForLoadModal={this.handlerForLoadModalPartido}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="modal fade" id="modal-partido" tabindex="-1" aria-labelledby="modal-partido" aria-hidden="true">
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="estudios">
                                    {/* <i className="fas fa-microphone-alt"></i> */}
                                Partido {`- ${this.state.selectPartido.nombre || ''}`}</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <div className="portrait">
                                    <img src={this.state.selectPartido.partido_imagen ? this.state.selectPartido.partido_imagen[2] !== undefined ? auth.pathApi() + this.state.selectPartido.partido_imagen[2].imagen : Constantes.NoImagenPicture : Constantes.NoImagenPicture} alt={this.state.selectPartido.nombre || ''} />
                                </div>
                                <div className={`subloader ${this.state.subloaderModalPartido ? "active" : ""}`}></div>
                                <p><strong>Fecha de creacion:</strong> {this.state.selectPartido.fechaDeCreacion || ''}</p>
                                <p><strong>Lugar:</strong> {this.state.selectPartido.lugar || ''}</p>
                                <strong>Reseña historica:</strong>
                                <SunEditor
                                    disable={true}
                                    enableToolbar={true}
                                    showToolbar={false}
                                    width="100%"
                                    height="100%"
                                    setOptions={{ resizingBar: false, showPathLabel: false, shortcutsDisable: true }}
                                    setContents={this.state.selectPartido.resenaHistorica || 'Sin reseña'}
                                />
                                <strong>Lineamientos:</strong>
                                <SunEditor
                                    disable={true}
                                    enableToolbar={true}
                                    showToolbar={false}
                                    width="100%"
                                    height="100%"
                                    setOptions={{ resizingBar: false, showPathLabel: false, shortcutsDisable: true }}
                                    setContents={this.state.selectPartido.lineamientos || 'Sin lineamientos'}
                                />
                                <strong>Datos de contacto:</strong>
                                <div className="social-links text-left circle-icons">
                                    {
                                        this.state.selectPartido.partido_datos_contacto ?
                                            this.state.selectPartido.partido_datos_contacto.map((item, i) => {
                                                if (item.datos_contacto.tipo === 2) {
                                                    return (
                                                        <a key={i} href={item.cuenta}>
                                                            <div className="icon">
                                                                <img src={typeof item.datos_contacto.datos_contacto_imagen ? item.datos_contacto.datos_contacto_imagen[0] !== undefined ? auth.pathApi() + item.datos_contacto.datos_contacto_imagen[0].imagen : Constantes.NoImagenPicture : Constantes.NoImagenPicture} alt="" />
                                                            </div>
                                                            <p>{item.datos_contacto.nombre}</p>
                                                        </a>
                                                    );
                                                } else {
                                                    return (
                                                        <div key={i}>
                                                            <div className="icon">
                                                                <img src={typeof item.datos_contacto.datos_contacto_imagen ? item.datos_contacto.datos_contacto_imagen[0] !== undefined ? auth.pathApi() + item.datos_contacto.datos_contacto_imagen[0].imagen : Constantes.NoImagenPicture : Constantes.NoImagenPicture} alt="" />
                                                            </div>
                                                            <p>{item.cuenta}</p>
                                                        </div>
                                                    )
                                                }
                                            }) :
                                            <></>
                                    }
                                </div>
                                <br />
                                {/* <a href={this.state.selectPartido.estatutos} className="btn btn-primary center-block" target="_blank"><i className="fa fa-download"></i> Estatutos</a> */}
                                {
                                    this.state.selectPartido.estatutos !== null ?
                                        <a href={auth.pathApi() + this.state.selectPartido.estatutos} target="_blank">
                                            <i className="fa fa-download"></i> Estatutos
                                        </a>
                                        :
                                        <a target="_blank">
                                            <i className="fa fa-download"></i> Sin estatutos
                                        </a>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}
function changeTab(e) {
    let tabs = document.querySelectorAll(".centerTabs ul li");
    tabs.forEach(y => {
        y.classList.remove("active");
    })
    tabs.forEach(z => {
        if (document.querySelector(`.contentForCenterTabs .contentTab[data-ref="${z.getAttribute("data-ref")}"]`)) {
            document.querySelector(`.contentForCenterTabs .contentTab[data-ref="${z.getAttribute("data-ref")}"]`).classList.remove("active")
        }
    })
    e.currentTarget.classList.add("active");
    if (document.querySelector(`.contentForCenterTabs .contentTab[data-ref="${e.currentTarget.getAttribute("data-ref")}"]`)) {
        document.querySelector(`.contentForCenterTabs .contentTab[data-ref="${e.currentTarget.getAttribute("data-ref")}"]`).classList.add("active")
    }
}

function toggleFilter(element) {
    element.parentNode.parentNode.parentNode.querySelector(".floatingFilters").classList.toggle("active");
}

function getMonthNumberByStr(str){
    let month = str.toString().toLowerCase();
    switch (month) {
        case 'enero':
            return 1
            break;
        case 'febrero':
            return 2
            break;
        case 'marzo':
            return 3
            break;
        case 'abril':
            return 4
            break;
        case 'mayo':
            return 5
            break;
        case 'junio':
            return 6
            break;
        case 'julio':
            return 7
            break;
        case 'agosto':
            return 8
            break;
        case 'septiembre':
            return 9
            break;
        case 'octubre':
            return 10
            break;
        case 'noviembre':
            return 11
            break;
        case 'diciembre':
            return 12
            break;
        default:
            break;
    }
}
function prevNextMonth(str, next = false) {
    str = str.toString().toLowerCase();
    switch (str) {
        case 'enero':
            return !next ? "diciembre": "febrero"
            break;
        case 'febrero':
            return !next ? "enero": "marzo"
            break;
        case 'marzo':
            return !next ? "febrero": "abril"
            break;
        case 'abril':
            return !next ? "marzo": "mayo"
            break;
        case 'mayo':
            return !next ? "abril": "junio"
            break;
        case 'junio':
            return !next ? "mayo": "julio"
            break;
        case 'julio':
            return !next ? "junio": "agosto"
            break;
        case 'agosto':
            return !next ? "julio": "septiembre"
            break;
        case 'septiembre':
            return !next ? "agosto": "octubre"
            break;
        case 'octubre':
            return !next ? "septiembre": "noviembre"
            break;
        case 'noviembre':
            return !next ? "octubre": "diciembre"
            break;
        case 'diciembre':
            return !next ? "noviembre": "enero"
            break;
        default:
            break;
    }
}
export default ActividadesLegislativas;