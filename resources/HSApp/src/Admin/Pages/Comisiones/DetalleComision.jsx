import React from 'react';
import ComisionDataService from "../../../Services/Catalogo/Comision.Service";
import UtilsDataService from "../../../Services/General/Utils.Service";
import AuthLogin from "../../../Utils/AuthLogin";
import { Constantes } from "../../../Constants/Constantes.js";
import SunEditor from 'suneditor-react';
import { convertToObject, escapeLeadingUnderscores } from 'typescript';
import LittleCalendar from "../../../Components/LittleCalendar";
import ActLegislativaEventosList from "../../../Components/CongresoVisible/ActLegislativaEventosList";
import ActividadesLegislativasDataService from "../../../Services/ActividadesLegislativas/ActividadesLegislativas.Service";
import * as FechaMysql from "../../../Utils/FormatDate";
import Select from '../../../Components/Select';
const auth = new AuthLogin();

const fieldsConst = {
    id: 0,
    tipo_comision_id: 0,
    corporacion_id: 0,
    nombre: "",
    descripcion: "",
    imagen: null,
    datosContacto: [
        {
            id2: 0,
            dato_contacto_id: null,
            comision_id: null,
            cuenta: null,
            activo: 1,
        },
    ],
    comision_miembro: [],
    comision_mesa: [],
    comision_secretario: [],
    tipo_comision: [],
    corporacion: [],
    proyecto_ley_comision: [],
    control_politico: [],
    comision_imagen: [],
    comision_datos_contacto: []
}
const formatDate = () => {
    let dt = new Date()
    let month = dt.getMonth();
    let day = dt.getDate();

    return dt.getFullYear() + "-" + (month < 10 ? "0" + (month + 1) : (month + 1)) + "-" + (day < 10 ? "0" + day : day)
}
const dateCalendar = (e) => {
    return e.year + "-" + (e.month < 10 ? "0" + e.month : e.month) + "-" + (e.day < 10 ? "0" + e.day : e.day)
}

let pos = { top: 0, left: 0, x: 0, y: 0 };
class DetalleComision extends React.Component {
    constructor(props) {
        super(props);
        // this.getControlPoliticoFilter = this.getControlPoliticoFilter.bind(this);
        const id =
            this.props.match.params.id === undefined
                ? 0
                : this.props.match.params.id;
        this.state = {
            id: id,
            fields: fieldsConst,
            searchControlPolitico: '',
            searchProyectoLey: '',
            searchMiembros: '',
            searchMesa: '',
            searchSecretarios: '',
            partidos: [],
            partidosMiembros: [],
            loading: true,
            subloaderControP: true,
            subloaderProyectoL: true,
            subloaderMiembros: true,
            subloaderMesa: true,
            subloaderSecretarios: true,
            partidoIdActive: 0,
            partidoIdActiveMesa: 0,
            imagenes: [],
            subloaderCalendario: true,
            subloaderAgendaActividades: true,
            subloaderFilters: true,
            fechaActual: formatDate(),
            year: new Date().getFullYear(),
            mesActual: new Date().getMonth() < 10 ? "0" + (new Date().getMonth() + 1) : (new Date().getMonth() + 1),
            fechaCalendario: null,
            eventos: [],
            listByFecha: {
                data: [],
                dataCalendar: [],
                totalRows: 0,
                search: "",
                page: 1,
                rows: 5
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
            dataAgendaLegislativa: []
        }
    }
    //Handlers combos
    // handlerFilterActividadAgenda = async (selectActividad) => {
    //     this.setState({ filterTipoActividadA: selectActividad });
    //    await this.getAgendaLegislativa(1,this.state.listByFecha.search, this.state.listByFecha.page, this.state.listByFecha.rows, this.state.fechaActual,selectActividad.value);       
    // }
    // getTipoActividad = async () => {
    //     this.setState({ subloaderFilters: true })
    //     await ActividadesLegislativasDataService.getComboTipoActividadAgenda().then(response => {
    //         let combo = [];
    //         response.data.forEach(i => {
    //             combo.push({ value: i.id, label: i.nombre })
    //         })
    //         combo.unshift({ value: -1, label: "Ver todas" })
    //         this.setState({
    //             dataSelectActividadA: combo,
    //             subloaderFilters: false
    //         })
    //     })
    // }
    // // Handlers Calendario
    // handlerDataSelectDay = async (e) => {
    //     let fecha = dateCalendar(e);
    //     this.setState({ subloader: true,fechaActual:fecha });
    //     await this.getAgendaLegislativa(1, this.state.listByFecha.search, this.state.listByFecha.page, this.state.listByFecha.rows, fecha);
    //     this.setState({ subloader: false, fechaCalendario: e });
    // }

    // handlerPrevAgenda = async (e) => {
    //     this.setState({subloaderCalendario: true})
    //     let monthTemp = e.currentTarget.parentNode.querySelector(".Calendar__monthYear.-shown .Calendar__monthText").innerText;
    //     let yearTemp = e.currentTarget.parentNode.querySelector(".Calendar__monthYear.-shown .Calendar__yearText").innerText;
    //     let month = getMonthNumberByStr(prevNextMonth(monthTemp));
    //     let year = prevNextMonth(monthTemp) === "diciembre" ? Number(yearTemp) - 1 : Number(yearTemp)
    //     await this.getDataByYearAndMonth(year,month);
    //     this.setState({subloaderCalendario: false, year:year,month:month})
    // }
    // handlerNextAgenda = async (e) => {
    //     this.setState({subloaderCalendario: true})
    //     let monthTemp = e.currentTarget.parentNode.querySelector(".Calendar__monthYear.-shown .Calendar__monthText").innerText;
    //     let yearTemp = e.currentTarget.parentNode.querySelector(".Calendar__monthYear.-shown .Calendar__yearText").innerText;
    //     let month = getMonthNumberByStr(prevNextMonth(monthTemp, true));
    //     let year = prevNextMonth(monthTemp, true) === "enero" ? Number(yearTemp) + 1 : Number(yearTemp)
    //     await this.getDataByYearAndMonth(year,month);
    //     this.setState({subloaderCalendario: false, year:year,month:month})
    // }
    // handlerChooseMonth = async (e) => {
    //     let month = getMonthNumberByStr(e.currentTarget.innerText);
    //     this.setState({mesActual: month})
    //     await this.getDataByYearAndMonth(this.state.year,month);

    // }
    // handlerChooseYear = async (e) => {
    //     let year = Number(e.currentTarget.innerText);
    //     this.setState({year: year})
    //     await this.getDataByYearAndMonth(year,this.state.mesActual);
    // }
    // findCalendarElements = async () => {
    //     let valido = true;
    //     if(document.querySelector(".Calendar__monthArrowWrapper"))
    //         valido = false;
    //     if(document.querySelector(".Calendar__monthSelectorItemText"))
    //         valido = false;
    //     if(document.querySelector(".Calendar__yearSelectorText"))
    //         valido = false;
    //     return valido
    // }    
    // handlerPaginationAgendaActividades = async (page, rows, search = "") => {
    //     let listByFecha = this.state.listByFecha;
    //     listByFecha.page = page;
    //     listByFecha.rows = rows;
    //     listByFecha.search = search;
    //     this.setState({ listByFecha });
    //     if (this.timeout) clearTimeout(this.timeout);
    //     this.timeout = setTimeout(
    //         async function () {
    //             await this.getAgendaLegislativa(  
    //                 1 ,
    //                 search,
    //                 page,
    //                 rows,
    //                 this.state.fechaActual,
    //                 this.state.filterTipoActividadA.value,
    //                 this.state.id
    //             );
    //         }.bind(this),
    //         1000
    //     );
    // }
    // 

    componentDidMount = async () => {
        // Proceso para acondicionar calendario. No borrar
        // if(this.findCalendarElements()){
        //     let prevButton = document.querySelector(".Calendar__monthArrowWrapper.-right");
        //     let nextButton = document.querySelector(".Calendar__monthArrowWrapper.-left");
        //     let monthsButton = document.querySelectorAll(".Calendar__monthSelectorItemText");
        //     let yearsButton = document.querySelectorAll(".Calendar__yearSelectorText");
        //     prevButton.addEventListener("click", async (e)=>{
        //         e.preventDefault();
        //         e.target.disabled = true;
        //         await this.handlerPrevAgenda(e);
        //         e.target.disabled = false;
        //     });
        //     nextButton.addEventListener("click", async (e)=>{
        //         e.preventDefault();
        //         e.target.disabled = true;
        //         await this.handlerNextAgenda(e)
        //         e.target.disabled = false;
        //     });
        //     monthsButton.forEach(month =>{month.addEventListener("click", (e)=>{this.handlerChooseMonth(e)})})
        //     yearsButton.forEach(year =>{year.addEventListener("click", (e)=>{this.handlerChooseYear(e)})})

        // }

        let id = this.state.id;
        if (id !== 0) await this.getByID(id);
        // await this.getComboPartido(id);
        // await this.getComboPartidoMesa(id);
        await this.getProyectoLeyFilter();
        // await this.getControlPoliticoFilter();
        await this.getMiembrosFilter(this.state.partidoIdActive, false);
        // await this.getMesaFilter(this.state.partidoIdActiveMesa, false);
        // await this.getSecretariosFilter();
        // await this.getTipoActividad()
        // await this.getAgendaLegislativa(1, this.state.listByFecha.search, this.state.listByFecha.page, this.state.listByFecha.rows, this.state.fechaActual, this.state.filterTipoActividadA.value);
        // await this.getDataByYearAndMonth(this.state.year, this.state.mesActual);
    }

    // Métodos
    getAgendaLegislativa = async (idFilterActive, search, page, rows, fecha, idactividad) => {
        this.setState({ subloaderAgendaActividades: true });
        let listByFecha = this.state.listByFecha;
        let f = FechaMysql.DateTimeFormatMySql(fecha + ' ' + '00:00:00');
        await ComisionDataService.getAgendaLegislativaByFecha(
            idFilterActive,
            search, page, rows, f, idactividad, this.state.id, this.state.fields.corporacion_id)
            .then((response) => {
                listByFecha.data = response.data;
            })
            .catch((e) => {
                console.error(e);
            });
        await ComisionDataService.getTotalRecordsAgendaActividad(
            idFilterActive,
            search, f, idactividad, this.state.id, this.state.fields.corporacion_id)
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

    getDataByYearAndMonth = async (year, month) => {
        this.setState({ subloaderCalendario: true });
        let listByFecha = this.state.listByFecha;
        await ComisionDataService.getDataByYearAndMonth(year, month, this.state.filterTipoActividadA.value, this.state.id, this.state.fields.corporacion_id)
            .then((response) => {
                let data = response.data;
                let dataCalendar = [];
                let f;
                data.forEach(x => {
                    f = x.fecha.slice(0, 10);
                    dataCalendar.push({ year: Number(f.split("-")[0]), month: Number(f.split("-")[1]), day: Number(f.split("-")[2]), className: 'tieneEventos' });
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

    getComboPartido = async (idcomision) => {
        await UtilsDataService.getComboPartidoPorCongresistaEnComision(idcomision, 0).then(response => {
            let combo = [];
            combo = response.data;
            this.setState({
                partidosMiembros: combo

            })
        })
    }

    getComboPartidoMesa = async (idcomision) => {
        await UtilsDataService.getComboPartidoPorCongresistaEnComision(idcomision, 1).then(response => {
            let combo = [];
            combo = response.data;
            this.setState({
                partidos: combo
            })
        })
    }

    getControlPoliticoFilter = async () => {
        this.timeout = setTimeout(async function () {
            this.setState({ subloaderControP: true });
            await ComisionDataService.getControlPoliticoFilter(this.state.searchControlPolitico, this.state.id)
                .then((response) => {
                    let fields = this.state.fields;
                    fields.control_politico = response.data;
                    this.setState({ fields });
                }).catch((e) => {
                    console.log(e);
                });
            this.setState({ subloaderControP: false });
        }.bind(this), 500);
    }

    getSecretariosFilter = async () => {
        this.timeout = setTimeout(async function () {
            this.setState({ subloaderSecretarios: true });
            await ComisionDataService.getSecretariosFilter(this.state.searchSecretarios, this.state.id)
                .then((response) => {
                    let fields = this.state.fields;
                    fields.comision_secretario = response.data;
                    console.log(response.data);
                    this.setState({ fields });
                }).catch((e) => {
                    console.log(e);
                });
            this.setState({ subloaderSecretarios: false });
        }.bind(this), 500);
    }

    getMiembrosFilter = async (partidoId, esSearch) => {
        if (this.state.partidoIdActive === partidoId && esSearch === false)
            partidoId = 0;
        this.timeout = setTimeout(async function () {
            this.setState({ subloaderMiembros: true });
            await ComisionDataService.getMiembrosFilter(this.state.searchMiembros, this.state.id, partidoId, 0)
                .then((response) => {
                    let fields = this.state.fields;
                    fields.comision_miembro = response.data;
                    console.log(response.data);
                    this.setState({ fields });
                }).catch((e) => {
                    console.log(e);
                });
            this.setState({ subloaderMiembros: false, partidoIdActive: partidoId });
        }.bind(this), 500);
    }

    getMesaFilter = async (partidoMesaId, esSearch) => {
        if (this.state.partidoIdActiveMesa === partidoMesaId && esSearch === false)
            partidoMesaId = 0;
        this.timeout = setTimeout(async function () {
            this.setState({ subloaderMesa: true });
            await ComisionDataService.getMiembrosFilter(this.state.searchMesa, this.state.id, partidoMesaId, 1)
                .then((response) => {
                    let fields = this.state.fields;
                    fields.comision_mesa = response.data;
                    this.setState({ fields });
                }).catch((e) => {
                    console.log(e);
                });
            this.setState({ subloaderMesa: false, partidoIdActiveMesa: partidoMesaId });
        }.bind(this), 500);
    }

    getProyectoLeyFilter = async () => {
        this.setState({ subloaderProyectoL: true });
        await ComisionDataService.getProyectoLeyFilter(this.state.searchProyectoLey, this.state.id)
            .then((response) => {
                let fields = this.state.fields;
                fields.proyecto_ley_comision = response.data;
                console.log(response.data);
                this.setState({ fields });
            }).catch((e) => {
                console.log(e);
            });
        this.setState({ subloaderProyectoL: false });
    }

    getByID = async (id) => {
        this.setState({ loading: true });
        await ComisionDataService.get(id)
            .then((response) => {
                let fields = this.state.fields;
                fields = response.data[0];
                fields.comision_mesa = [];
                let imagen = '';
                if (fields.comision_imagen.length > 0) {
                    if (fields.comision_imagen[1] !== undefined) {
                        imagen = auth.pathApi() + fields.comision_imagen[1].imagen;
                    }
                    else
                        imagen = Constantes.NoImagen;
                }
                else
                    imagen = Constantes.NoImagen;
                this.setState({
                    fields: fields,
                    imagenes: imagen
                });
            })
            .catch((e) => {
                console.log(e);
            });
        this.setState({ loading: false });
    };

    getImgComision() {
        let item = this.state.fields;
        if (item.comision_imagen.length > 0) {
            let img = item.comision_imagen[5];
            if (img !== undefined) {
                return auth.pathApi() + img.imagen;
            }
            else {
                return Constantes.NoImagenPicture;

            }
        }
        else {
            return Constantes.NoImagenPicture;
        }
    }

    render() {
        return (
            <>
                <main className="workspace">
                    <section className="breadcrumb lg:flex items-start">
                        <div>
                            <h1>Comisión - {this.state.fields.nombre}</h1>
                            <ul>
                                <li><a href="#">Página principal</a></li>
                                <li className="divider la la-arrow-right"></li>
                                <li><a href="#">Comisiones</a></li>
                                <li className="divider la la-arrow-right"></li>
                                <li>Detalle</li>
                            </ul>
                        </div>
                    </section>

                    <div className="lg:flex pageSection">
                        <div className="info">
                            <div className="itemSection">
                                <h3>Descripción</h3>
                                <SunEditor
                                    disable={true}
                                    enableToolbar={true}
                                    showToolbar={false}
                                    width="100%"
                                    height="100%"
                                    setOptions={{ resizingBar: false, showPathLabel: false, shortcutsDisable: true }}
                                    setContents={this.state.fields?.descripcion || 'Sin descripción'}
                                />
                            </div>
                            <div className="itemSection">
                                <h3>Diputados / Autores que la conforman</h3>
                                <div className="autor-list-tags">
                                    {
                                        this.state.fields.comision_miembro?.map((item, j) => {
                                            return(
                                                <div key={j} className="item">
                                                    <div className="avatar w-16 h-16 ml-4">
                                                        <img src={typeof item.persona.imagenes[0] !== "undefined" ? (auth.pathApi() + item.persona.imagenes[0].imagen) : Constantes.NoImagen} alt={item.persona.nombres}/>
                                                    </div>
                                                    <div className="name">
                                                        <p>{item.persona.nombres + " " + item.persona.apellidos || ''}</p>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    }
                                </div>
                            </div>
                        </div>
                        <div className="itemSection">
                            <figure>
                                <img src={this.getImgComision()} alt={this.state.fields.nombre} />
                            </figure>
                        </div>
                    </div>
                </main>
            </>
        )
    }
}
const mouseDownHandler = function (e) {

    pos = {
        left: e.currentTarget.scrollLeft,
        top: e.currentTarget.scrollTop,
        // Get the current mouse position
        x: e.clientX,
        y: e.clientY,
    };

    e.currentTarget.addEventListener('mousemove', mouseMoveHandler);
    e.currentTarget.addEventListener('mouseup', mouseUpHandler);
};

const mouseMoveHandler = function (e) {
    // How far the mouse has been moved
    const dx = e.clientX - pos.x;
    const dy = e.clientY - pos.y;

    // Scroll the element
    e.currentTarget.scrollTop = pos.top - dy;
    e.currentTarget.scrollLeft = pos.left - dx;
};

const mouseUpHandler = function (e, curul) {
    e.currentTarget.removeEventListener('mousemove', mouseMoveHandler);
    e.currentTarget.removeEventListener('mouseup', mouseUpHandler);
};
function toggleFilter(element) {
    element.parentNode.parentNode.parentNode.querySelector(".floatingFilters").classList.toggle("active");
}
function getMonthNumberByStr(str) {
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
            return !next ? "diciembre" : "febrero"
            break;
        case 'febrero':
            return !next ? "enero" : "marzo"
            break;
        case 'marzo':
            return !next ? "febrero" : "abril"
            break;
        case 'abril':
            return !next ? "marzo" : "mayo"
            break;
        case 'mayo':
            return !next ? "abril" : "junio"
            break;
        case 'junio':
            return !next ? "mayo" : "julio"
            break;
        case 'julio':
            return !next ? "junio" : "agosto"
            break;
        case 'agosto':
            return !next ? "julio" : "septiembre"
            break;
        case 'septiembre':
            return !next ? "agosto" : "octubre"
            break;
        case 'octubre':
            return !next ? "septiembre" : "noviembre"
            break;
        case 'noviembre':
            return !next ? "octubre" : "diciembre"
            break;
        case 'diciembre':
            return !next ? "noviembre" : "enero"
            break;
        default:
            break;
    }
}

export default DetalleComision;