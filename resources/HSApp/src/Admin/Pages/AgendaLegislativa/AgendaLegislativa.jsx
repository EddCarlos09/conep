import React from 'react';
import LittleCalendar from "../../../Components/LittleCalendar";
import Select from '../../../Components/Select';
import ActLegislativaEventosList from "../../../Components/CongresoVisible/ActLegislativaEventosList";
import ActividadesLegislativasDataService from "../../../Services/ActividadesLegislativas/ActividadesLegislativas.Service";
import * as FechaMysql from "../../../Utils/FormatDate";
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
            //Agenda
            filterTipoActividadA: { value: -1, label: "Filtrar tipo de actividad" },
            dataSelectActividadA: [],
            filterTComisionA: { value: -1, label: "Filtrar por tipo de comisión" },
            dataSelecTComisionA: [],
            filterComisionA: { value: -1, label: "Filtrar por comisión" },
            dataSelectComisionA: [],
            dataAgendaLegislativa: []
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
                    this.state.filterComisionA.value  
                );
            }.bind(this),
            1000
        );
    }
    
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
        await this.getAgendaLegislativa(1, this.state.listByFecha.search, this.state.listByFecha.page, this.state.listByFecha.rows, this.state.fechaActual);
        await this.getDataByYearAndMonth(this.state.year,this.state.mesActual);
    }
    // Métodos
    getAgendaLegislativa = async (idFilterActive, search, page, rows, fecha,tipoactividad,comision) => {
        this.setState({ subloaderAgendaActividades: true });
        let listByFecha = this.state.listByFecha;
        let f=FechaMysql.DateTimeFormatMySql(fecha+' '+'00:00:00');
        await ActividadesLegislativasDataService.getAgendaLegislativaByFecha(
            idFilterActive,            
            search, page, rows, f,tipoactividad,comision)
            .then((response) => {
                listByFecha.data = response.data;
               
            })
            .catch((e) => {
                console.error(e);
            });
            await ActividadesLegislativasDataService.getTotalRecordsAgendaActividad(
                idFilterActive,            
                search, f,tipoactividad,comision)
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
    
    render() {
        return (
            <>
                <main className="workspace overflow-hidden">
                    <section className="breadcrumb">
                        <h1>Agenda Legislativa</h1>
                        <ul>
                            <li><a href="#">Página principal</a></li>
                            <li className="divider la la-arrow-right"></li>
                            <li><a href="#">Agenda Legislativa</a></li>
                            <li className="divider la la-arrow-right"></li>
                            <li>Listado</li>
                        </ul>
                    </section>
                    <div className="lg:flex">
                        <div className="lg:w-1/2 lg:px-4">
                            <div className="relative">
                                <div className={`subloader ${this.state.subloaderCalendario? "active": ""}`}><div className="relative"></div></div>
                                <LittleCalendar
                                    value={this.state.fechaCalendario}
                                    onChange={(e) => {
                                        this.handlerDataSelectDay(e);
                                    }}
                                    customDaysClassName={this.state.listByFecha.dataCalendar}
                                />
                            </div>
                        </div>
                        <div className="lg:w-1/2 lg:px-4">
                            <h3>Eventos en el día</h3>
                            <div className="container-fluid">
                            <div className="row">                               
                                <div className="col-md-7">
                                    <div className="buscador pd-25">
                                        <div className="input-group">
                                            <input
                                                type="text"
                                                value={this.state.listByFecha.search}
                                                onChange={async (e) => {
                                                    let data =this.state.listByFecha;
                                                    data.search =e.target.value;
                                                    this.setState({listByFecha: data});
                                                }}
                                                onKeyUp={async (e) => {
                                                    if (e.key === "Enter") {
                                                        await this.handlerPaginationAgendaActividades(
                                                            this.state.listByFecha.page,
                                                            this.state.listByFecha.rows,
                                                            e.target.value
                                                        );
                                                    }
                                                }}
                                                placeholder="Escriba para buscar"
                                                className="form-control"
                                            />

                                            <span className="input-group-text">
                                                <button onClick={async () => {
                                                        await this.handlerPaginationAgendaActividades(
                                                            this.state.listByFecha.page,
                                                            this.state.listByFecha.rows,
                                                            this.state.listByFecha.search
                                                        );
                                                    }}
                                                    type="button"
                                                    className="btn btn_primary uppercase mr-5 mb-5"
                                                >
                                                    <span className="icon la la-search"></span>
                                                </button>
                                            </span>
                                            <span className="input-group-text">
                                                <button
                                                    onClick={(e) => {
                                                        toggleFilter(e.currentTarget);
                                                    }}
                                                    type="button"
                                                    className="btn btn_secondary uppercase mb-5"
                                                >
                                                    <span className="icon la la-filter"></span>
                                                </button>
                                            </span>
                                        </div>
                                        <div className="floatingFilters evenColors">
                                            <div className="one-columns relative no-margin">
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
                                                        spanError=""
                                                    ></Select>
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
                                                        spanError=""
                                                    ></Select>
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
                                                        spanError=""
                                                    ></Select>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="relative">
                                        <div className={`subloader ${this.state.subloaderAgendaActividades? "active": ""}`}><div className="relative"></div></div>
                                        <ActLegislativaEventosList
                                            data={this.state.listByFecha.data}
                                            handler={this.handlerPaginationAgendaActividades}
                                            pageExtends={this.state.listByFecha.page}
                                            pageSize={this.state.listByFecha.rows}
                                            totalRows={this.state.listByFecha.totalRows}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>               
                        </div>
                    </div>
                    <div className="lg:mx:12">

                    </div>
                </main>
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