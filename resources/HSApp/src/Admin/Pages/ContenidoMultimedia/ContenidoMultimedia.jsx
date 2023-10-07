import React from 'react';
import ContenidoMultimediaList from "../../../Components/CongresoVisible/ContenidoMultimediaList";
import ContenidoMultimediaDataService from "../../../Services/ContenidoMultimedia/ContenidoMultimedia.Service";
import { Constantes, TypeCombos } from "../../../Constants/Constantes.js";
import AuthLogin from "../../../Utils/AuthLogin";
import Select from '../../../Components/Select';
import SunEditor from 'suneditor-react';

const auth = new AuthLogin();
class ContenidoMultimedia extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            subloaderInformesPNUD: true,
            subloaderBalanceCuatrienio: true,
            subloaderOpiniones: true,
            subloaderOpinionesCongresistas: true,
            subloaderPodcast: true,
            subloaderMultimedia: true,
            subloaderModal: false,
            subloaderFilters: false,
            listInformesPNUD: {
                data: [],
                propiedades:
                {
                    id: 'id',
                    description:
                        [
                            { title: "Título", text: "nombre", esImg: false, img: "", putOnFirstElement: false }
                        ],
                    generalActionTitle: "Documentos",
                    generalIcon: "fas fa-file-alt"
                },
                esModal: true,
                targetModal: "#modal-informes-pnud",
                totalRows: 0,
                search: "",
                page: 1,
                rows: 5
            },
            listBalanceCuatrienio: {
                data: [],
                propiedades:
                {
                    id: 'id',
                    description:
                        [
                            { title: "Título", text: "titulo", esImg: false, img: "", putOnFirstElement: false },
                            { title: "Año de inicio", text: "yearInicio", esImg: false, img: "", putOnFirstElement: false },
                            { title: "Año de finalización", text: "yearFin", esImg: false, img: "", putOnFirstElement: false },
                        ],
                    generalActionTitle: "Informes",
                    generalIcon: "fas fa-file-alt"
                },
                totalRows: 0,
                search: "",
                page: 1,
                rows: 5
            },
            listOpiniones: {
                data: [],
                propiedades:
                {
                    id: 'id',
                    description:
                        [
                            { title: "Título", text: "titulo", esImg: false, img: "", putOnFirstElement: false },
                            { title: "Autor", text: "equipo.nombre", esImg: true, img: "equipo.equipo_imagen.1.imagen", putOnFirstElement: false },
                            { title: "Fecha de publicación", text: "fechaPublicacion", esImg: false, img: "", putOnFirstElement: false },
                        ],
                    generalActionTitle: null,
                    generalIcon: null,
                    eachActionTitle: "tipo_publicacion.nombre",
                    eachIcon: "tipo_publicacion.icono"
                },
                totalRows: 0,
                search: "",
                page: 1,
                rows: 5
            },
            listOpinionesCongresistas: {
                data: [],
                propiedades:
                {
                    id: 'id',
                    description:
                        [
                            { title: "Título", text: "titulo", esImg: false, img: "", putOnFirstElement: false },
                            { title: "Autor", text: "persona.nombres", esImg: true, img: "persona.imagenes.0.imagen", putOnFirstElement: false },
                            { title: "Fecha de publicación", text: "fechaPublicacion", esImg: false, img: "", putOnFirstElement: false },
                        ],
                    generalActionTitle: null,
                    generalIcon: null,
                    eachActionTitle: "tipo_publicacion.nombre",
                    eachIcon: "tipo_publicacion.icono"
                },
                totalRows: 0,
                search: "",
                page: 1,
                rows: 5
            },
            listPodcast: {
                data: [],
                propiedades:
                {
                    id: 'id',
                    description:
                        [
                            { title: "Título", text: "titulo", esImg: false, img: "", putOnFirstElement: false },
                            { title: "Presentadores", text: "presentadores", esImg: false, img: "", putOnFirstElement: false },
                            { title: "Invitados", text: "invitados", esImg: false, img: "", putOnFirstElement: false },
                            { title: "fecha", text: "fecha", esImg: false, img: "", putOnFirstElement: true },
                        ],
                    generalActionTitle: "Ver",
                    generalIcon: "fas fa-volume-up"
                },
                esModal: true,
                targetModal: "#modal-podcast",
                totalRows: 0,
                search: "",
                page: 1,
                rows: 5
            },
            listMultimedia: {
                data: [],
                propiedades:
                {
                    id: 'id',
                    description:
                        [
                            { title: "Título", text: "titulo", esImg: false, img: "", putOnFirstElement: false },
                            { title: "Fecha de publicación", text: "fechaPublicacion", esImg: false, img: "", putOnFirstElement: false }
                        ],
                    generalActionTitle: null,
                    generalIcon: null,
                    eachActionTitle: "tipo_multimedia.nombre",
                    eachIcon: "tipo_multimedia.icono"
                },
                esModal: true,
                targetModal: "#modal-multimedia",
                totalRows: 0,
                search: "",
                page: 1,
                rows: 5
            },
            // Balance cuatrienio
            filterYearInicio: { value: -1, label: "Filtrar por año de inicio" },
            dataSelectYearInicio: [],
            // Opiniones
            filterEquipoCV: { value: -1, label: "Filtrar equipo" },
            filterTipoPublicacionOpiniones: { value: -1, label: "Filtrar por tipo de publicación" },
            dataSelectEquipoCV: [],
            dataSelectTipoPublicacion: [], // Se usará para opiniones y op congresistas
            // Opiniones congresistas
            filterCongresistas: { value: -1, label: "Filtrar por congresista" },
            filterTipoPublicacionOpinionesCongresistas: { value: -1, label: "Filtrar por tipo de publicación" },
            dataSelectOpCongresistas: [],
            //informes pnud
            informeSelected: {},
            // Podcast
            podcastSelected: {},
            // Multimedia
            multimediaSelected: {},
            filterTipoMultimedia: { value: -1, label: "Filtrar tipo de multimedia" },
            dataSelectTipoMultimedia: [],
        }
    }

    // Handlers
    handlerForLoadModalInformesPNUD = async (item) => {
        this.setState({ subloaderModal: true })
        let informeSelected = this.state.informeSelected;
        informeSelected = item.data;
        this.setState({ subloaderModal: false, informeSelected });
    }
    handlerPaginationInformesPNUD = async (page, rows, search = "") => {
        let listInformesPNUD = this.state.listInformesPNUD;
        listInformesPNUD.page = page;
        listInformesPNUD.rows = rows;
        listInformesPNUD.search = search;
        this.setState({ listInformesPNUD });
        if (this.timeout) clearTimeout(this.timeout);
        this.timeout = setTimeout(
            async function () {
                await this.getAllInformesPNUD(1, search, page, rows);
            }.bind(this),
            1000
        );
    }

    handlerPaginationBalanceCuatrienio = async (page, rows, search = "") => {
        let listBalanceCuatrienio = this.state.listBalanceCuatrienio;
        listBalanceCuatrienio.page = page;
        listBalanceCuatrienio.rows = rows;
        listBalanceCuatrienio.search = search;
        this.setState({ listBalanceCuatrienio });
        if (this.timeout) clearTimeout(this.timeout);
        this.timeout = setTimeout(
            async function () {
                await this.getAllBalanceCuatrienio(1, this.state.filterYearInicio.value, search, page, rows);
            }.bind(this),
            1000
        );
    }
    handlerFilterYearInicio = async (selectYearInicio) => {
        this.setState({ filterYearInicio: selectYearInicio });
        await this.getAllBalanceCuatrienio(1, selectYearInicio.value, this.state.listBalanceCuatrienio.search, this.state.listBalanceCuatrienio.page, this.state.listBalanceCuatrienio.rows);
    }

    handlerPaginationOpiniones = async (page, rows, search = "") => {
        let listOpiniones = this.state.listOpiniones;
        listOpiniones.page = page;
        listOpiniones.rows = rows;
        listOpiniones.search = search;
        this.setState({ listOpiniones });
        if (this.timeout) clearTimeout(this.timeout);
        this.timeout = setTimeout(
            async function () {
                await this.getAllOpiniones(1, this.state.filterEquipoCV.value, this.state.filterTipoPublicacionOpiniones.value, search, page, rows);
            }.bind(this),
            1000
        );
    }
    handlerFilterEquipoCV = async (selectEquipoCV) => {
        this.setState({ filterEquipoCV: selectEquipoCV });
        await this.getAllOpiniones(1, selectEquipoCV.value, this.state.filterTipoPublicacionOpiniones.value, this.state.listOpiniones.search, this.state.listOpiniones.page, this.state.listOpiniones.rows);
    }
    handlerTipoPublicacionOpiniones = async (selectTipoPublicacion) => {
        this.setState({ filterTipoPublicacionOpiniones: selectTipoPublicacion });
        await this.getAllOpiniones(1, this.state.filterEquipoCV.value, selectTipoPublicacion.value, this.state.listOpiniones.search, this.state.listOpiniones.page, this.state.listOpiniones.rows);
    };

    handlerPaginationOpinionesCongresistas = async (page, rows, search = "") => {
        let listOpinionesCongresistas = this.state.listOpinionesCongresistas;
        listOpinionesCongresistas.page = page;
        listOpinionesCongresistas.rows = rows;
        listOpinionesCongresistas.search = search;
        this.setState({ listOpinionesCongresistas });
        if (this.timeout) clearTimeout(this.timeout);
        this.timeout = setTimeout(
            async function () {
                await this.getAllOpinionesCongresistas(1, this.state.filterCongresistas.value, this.state.filterTipoPublicacionOpinionesCongresistas.value, search, page, rows);
            }.bind(this),
            1000
        );
    }
    handlerFilterCongresistas = async (selectCongresistas) => {
        this.setState({ filterCongresistas: selectCongresistas });
        await this.getAllOpinionesCongresistas(1, selectCongresistas.value, this.state.filterTipoPublicacionOpinionesCongresistas.value, this.state.listOpinionesCongresistas.search, this.state.listOpinionesCongresistas.page, this.state.listOpinionesCongresistas.rows);
    }
    handlerTipoPublicacionOpinionesCongresistas = async (selectTipoPublicacionCongresista) => {
        this.setState({ filterTipoPublicacionOpinionesCongresistas: selectTipoPublicacionCongresista });
        await this.getAllOpinionesCongresistas(1, this.state.filterCongresistas.value, selectTipoPublicacionCongresista.value, this.state.listOpinionesCongresistas.search, this.state.listOpinionesCongresistas.page, this.state.listOpinionesCongresistas.rows);
    };

    handlerForLoadModalPodcast = async (item) => {
        this.setState({ subloaderModal: true });
        let podcastSelected = this.state.podcastSelected;
        podcastSelected = item.data;
        this.setState({ subloaderModal: false, podcastSelected });
    }
    handlerPaginationPodcast = async (page, rows, search = "") => {
        let listPodcast = this.state.listPodcast;
        listPodcast.page = page;
        listPodcast.rows = rows;
        listPodcast.search = search;
        this.setState({ listPodcast });
        if (this.timeout) clearTimeout(this.timeout);
        this.timeout = setTimeout(
            async function () {
                await this.getAllPodcast(1, search, page, rows);
            }.bind(this),
            1000
        );
    }

    handlerForLoadModalMultimedia = async (item) => {
        this.setState({ subloaderModal: true });
        let multimediaSelected = this.state.multimediaSelected;
        multimediaSelected = item.data;
        this.setState({ subloaderModal: false, multimediaSelected });
    }
    handlerPaginationMultimedia = async (page, rows, search = "") => {
        let listMultimedia = this.state.listMultimedia;
        listMultimedia.page = page;
        listMultimedia.rows = rows;
        listMultimedia.search = search;
        this.setState({ listMultimedia });
        if (this.timeout) clearTimeout(this.timeout);
        this.timeout = setTimeout(
            async function () {
                await this.getAllMultimedia(1, this.state.filterTipoMultimedia.value, search, page, rows);
            }.bind(this),
            1000
        );
    }
    handlerFilterTipoMultimedia = async (selectTipoMultimedia) => {
        this.setState({ filterTipoMultimedia: selectTipoMultimedia });
        await this.getAllMultimedia(1, selectTipoMultimedia.value, this.state.listMultimedia.search, this.state.listMultimedia.page, this.state.listMultimedia.rows);
    }
    // 

    componentDidMount = async () => {
        // estheticIn(); // No remover. Estética de la página actual
        await this.getAllInformesPNUD(1, this.state.listInformesPNUD.search, this.state.listInformesPNUD.page, this.state.listInformesPNUD.rows);
        await this.getAllBalanceCuatrienio(1, this.state.filterYearInicio.value, this.state.listBalanceCuatrienio.search, this.state.listBalanceCuatrienio.page, this.state.listBalanceCuatrienio.rows);
        await this.getAllOpiniones(1, this.state.filterEquipoCV.value, this.state.filterTipoPublicacionOpiniones.value, this.state.listOpiniones.search, this.state.listOpiniones.page, this.state.listOpiniones.rows);
        await this.getAllOpinionesCongresistas(1, this.state.filterCongresistas.value, this.state.filterTipoPublicacionOpinionesCongresistas.value, this.state.listOpinionesCongresistas.search, this.state.listOpinionesCongresistas.page, this.state.listOpinionesCongresistas.rows);
        await this.getAllPodcast(1, this.state.listPodcast.search, this.state.listPodcast.page, this.state.listPodcast.rows);
        await this.getAllMultimedia(1, this.state.filterTipoMultimedia.value, this.state.listMultimedia.search, this.state.listMultimedia.page, this.state.listMultimedia.rows);
    }
    // componentWillUnmount() {
    //     estheticOut(); // No remover. Estética de la página actual
    // }

    // Methods
    getAllInformesPNUD = async (idFilterActive, search, page, rows) => {
        this.setState({ subloaderInformesPNUD: true });
        let listInformesPNUD = this.state.listInformesPNUD;
        await ContenidoMultimediaDataService.getAllInformesPNUD(
            idFilterActive,
            search, page, rows
        )
            .then((response) => {
                listInformesPNUD.data = response.data;
            })
            .catch((e) => {
                console.error(e);
            });
        await ContenidoMultimediaDataService.getTotalRecordsInformesPNUD(
            idFilterActive,
            search
        )
            .then((response) => {
                listInformesPNUD.totalRows = response.data;
            })
            .catch((e) => {
                console.error(e);
            });

        this.setState({
            listInformesPNUD,
            subloaderInformesPNUD: false
        });
    };
    getAllBalanceCuatrienio = async (idFilterActive, yearInicio, search, page, rows) => {
        this.setState({ subloaderBalanceCuatrienio: true });
        let listBalanceCuatrienio = this.state.listBalanceCuatrienio;
        await ContenidoMultimediaDataService.getAllBalanceCuatrienio(
            idFilterActive,
            yearInicio,
            search, page, rows
        )
            .then((response) => {
                listBalanceCuatrienio.data = response.data;
            })
            .catch((e) => {
                console.error(e);
            });
        await ContenidoMultimediaDataService.getTotalRecordsBalanceCuatrienio(
            idFilterActive,
            yearInicio,
            search
        )
            .then((response) => {
                listBalanceCuatrienio.totalRows = response.data;
            })
            .catch((e) => {
                console.error(e);
            });

        this.setState({
            listBalanceCuatrienio,
            subloaderBalanceCuatrienio: false
        });
    };
    getComboYearInicio = async () => {
        if (this.state.dataSelectYearInicio.length === 0 || this.state.dataSelectYearInicio === null || typeof this.state.dataSelectYearInicio === 'undefined') {
            this.setState({ subloaderFilters: true })
            await ContenidoMultimediaDataService.getComboBalanceCuatrienioYearInicio().then(response => {
                let combo = [];
                response.data.forEach(i => {
                    combo.push({ value: i.id, label: i.yearInicio })
                })
                combo.unshift({ value: -1, label: "Filtrar por año de inicio" })
                this.setState({
                    dataSelectYearInicio: combo,
                    subloaderFilters: false
                })
            })
        }
    }
    getAllOpiniones = async (idFilterActive, equipo, tipopublicacion, search, page, rows) => {
        this.setState({ subloaderOpiniones: true });
        let listOpiniones = this.state.listOpiniones;
        await ContenidoMultimediaDataService.getAllOpiniones(
            idFilterActive,
            equipo, tipopublicacion,
            search, page, rows
        )
            .then((response) => {
                listOpiniones.data = response.data;
            })
            .catch((e) => {
                console.error(e);
            });
        await ContenidoMultimediaDataService.getTotalRecordsOpiniones(
            idFilterActive,
            equipo, tipopublicacion,
            search
        )
            .then((response) => {
                listOpiniones.totalRows = response.data;
            })
            .catch((e) => {
                console.error(e);
            });

        this.setState({
            listOpiniones,
            subloaderOpiniones: false
        });
    };
    getComboEquipoCVByType = async () => {
        if (this.state.dataSelectEquipoCV.length === 0 || this.state.dataSelectEquipoCV === null || typeof this.state.dataSelectEquipoCV === 'undefined') {
            this.setState({ subloaderFilters: true })
            await ContenidoMultimediaDataService.getComboEquipoCVByType(TypeCombos.EquipoOpiniones).then(response => {
                let combo = [];
                response.data.forEach(i => {
                    combo.push({ value: i.id, label: i.nombre })
                })
                combo.unshift({ value: -1, label: "Filtrar equipo CV" })
                this.setState({
                    dataSelectEquipoCV: combo,
                    subloaderFilters: false
                })
            })
        }
    }
    getComboTipoPublicacion = async () => {
        if (this.state.dataSelectTipoPublicacion.length === 0 || this.state.dataSelectTipoPublicacion === null || typeof this.state.dataSelectTipoPublicacion === 'undefined') {
            this.setState({ subloaderFilters: true })
            await ContenidoMultimediaDataService.getComboTipoPublicacion().then(response => {
                let combo = [];
                response.data.forEach(i => {
                    combo.push({ value: i.id, label: i.nombre })
                })
                combo.unshift({ value: -1, label: "Filtrar tipo publicación" })
                this.setState({
                    dataSelectTipoPublicacion: combo,
                    subloaderFilters: false
                })
            })
        }
    }
    getAllOpinionesCongresistas = async (idFilterActive, congresista, tipopublicacion, search, page, rows) => {
        this.setState({ subloaderOpinionesCongresistas: true });
        let listOpinionesCongresistas = this.state.listOpinionesCongresistas;
        await ContenidoMultimediaDataService.getAllOpinionesCongresistas(
            idFilterActive,
            congresista, tipopublicacion,
            search, page, rows
        )
            .then((response) => {
                listOpinionesCongresistas.data = response.data;
                console.log(listOpinionesCongresistas.data);
            })
            .catch((e) => {
                console.error(e);
            });
        await ContenidoMultimediaDataService.getTotalRecordsOpinionesCongresistas(
            idFilterActive,
            congresista, tipopublicacion,
            search
        )
            .then((response) => {
                listOpinionesCongresistas.totalRows = response.data;
            })
            .catch((e) => {
                console.error(e);
            });

        this.setState({
            listOpinionesCongresistas,
            subloaderOpinionesCongresistas: false
        });
    };
    getComboCongresistaByType = async () => {
        if (this.state.dataSelectOpCongresistas.length === 0 || this.state.dataSelectOpCongresistas === null || typeof this.state.dataSelectOpCongresistas === 'undefined') {
            this.setState({ subloaderFilters: true })
            await ContenidoMultimediaDataService.getComboCongresistaByType(TypeCombos.CongresistasEnOpinionesCongresista).then(response => {
                let combo = [];
                response.data.forEach(i => {
                    combo.push({ value: i.id, label: i.nombre })
                })
                combo.unshift({ value: -1, label: "Filtrar congresista" })
                this.setState({
                    dataSelectOpCongresistas: combo,
                    subloaderFilters: false
                })
            })
        }
    }
    getAllPodcast = async (idFilterActive, search, page, rows) => {
        this.setState({ subloaderPodcast: true });
        let listPodcast = this.state.listPodcast;
        await ContenidoMultimediaDataService.getAllPodcast(
            idFilterActive,
            search, page, rows
        )
            .then((response) => {
                listPodcast.data = response.data;
            })
            .catch((e) => {
                console.error(e);
            });
        await ContenidoMultimediaDataService.getTotalRecordsPodcast(
            idFilterActive,
            search
        )
            .then((response) => {
                listPodcast.totalRows = response.data;
            })
            .catch((e) => {
                console.error(e);
            });

        this.setState({
            listPodcast,
            subloaderPodcast: false
        });
    };
    getAllMultimedia = async (idFilterActive, tipopublicacion, search, page, rows) => {
        this.setState({ subloaderMultimedia: true });
        let listMultimedia = this.state.listMultimedia;
        await ContenidoMultimediaDataService.getAllMultimedia(
            idFilterActive,
            tipopublicacion,
            search, page, rows
        )
            .then((response) => {
                listMultimedia.data = response.data;
            })
            .catch((e) => {
                console.error(e);
            });
        await ContenidoMultimediaDataService.getTotalRecordsMultimedia(
            idFilterActive,
            tipopublicacion,
            search
        )
            .then((response) => {
                listMultimedia.totalRows = response.data;
            })
            .catch((e) => {
                console.error(e);
            });

        this.setState({
            listMultimedia,
            subloaderMultimedia: false
        });
    };
    getComboTipoMultimedia = async () => {
        if (this.state.dataSelectTipoMultimedia.length === 0 || this.state.dataSelectTipoMultimedia === null || typeof this.state.dataSelectTipoMultimedia === 'undefined') {
            this.setState({ subloaderFilters: true })
            await ContenidoMultimediaDataService.getComboTipoMultimedia().then(response => {
                let combo = [];
                response.data.forEach(i => {
                    combo.push({ value: i.id, label: i.nombre })
                })
                combo.unshift({ value: -1, label: "Filtrar tipo multimedia" })
                this.setState({
                    dataSelectTipoMultimedia: combo,
                    subloaderFilters: false
                })
            })
        }
    }

    // 
    render() {
        return (
            <>
                <section className="nuestraDemocraciaSection pd-top-35">
                    <div className="container-fluid">
                        <div className="centerTabs small-icons lg min-height-85">
                            <ul>
                                <li onClick={(e) => { changeTab(e); }} className="active" data-ref="1"><i className="fas fa-photo-video"></i> Multimedia</li>
                                <li onClick={(e) => { changeTab(e); }} data-ref="2"><i className="fas fa-comment-dots"></i> Opiniones</li>
                                <li onClick={(e) => { changeTab(e); }} data-ref="3"><i className="fas fa-comments"></i> Opinión de congresistas</li>
                                <li onClick={(e) => { changeTab(e); }} data-ref="4"><i className="fas fa-microphone-alt"></i> Podcast</li>
                                <li onClick={(e) => { changeTab(e); }} data-ref="5"><i className="fas fa-balance-scale"></i> Balances cuatrienio</li>
                                <li onClick={(e) => { changeTab(e); }} data-ref="6"><i className="fas fa-file-alt"></i> Informes regionales</li>
                            </ul>
                        </div>
                        <div className="contentForCenterTabs">
                            <div className="contentTab active" data-ref="1">
                                {/* <div className="CMTitle">
                                    <h3><i className="fas fa-photo-video"></i> Multimedia</h3>
                                </div> */}
                                <div className="relative">
                                    <div className={`subloader ${this.state.subloaderMultimedia ? "active" : ""}`}></div>
                                    <div className="buscador pd-25">
                                        <div class="input-group">
                                            <input type="text" value={this.state.listMultimedia.search}
                                                onChange={async (e) => {
                                                    let data = this.state.listMultimedia;
                                                    data.search = e.target.value;
                                                    this.setState({ listMultimedia: data })
                                                }}
                                                onKeyUp={async (e) => {
                                                    if (e.key === "Enter") {
                                                        await this.handlerPaginationMultimedia(this.state.listMultimedia.page, this.state.listMultimedia.rows, e.target.value);
                                                    }
                                                }}
                                                placeholder="Escriba para buscar" className="form-control" />

                                            <span className="input-group-text"><button onClick={async () => { await this.handlerPaginationMultimedia(this.state.listMultimedia.page, this.state.listMultimedia.rows, this.state.listMultimedia.search) }} type="button" className="btn btn-primary"><i className="fa fa-search"></i></button></span>
                                            <span className="input-group-text"><button onClick={(e) => { toggleFilter(e.currentTarget); this.getComboTipoMultimedia(); }} type="button" className="btn btn-primary"><i className="fa fa-filter"></i></button></span>
                                        </div>
                                        <div className="floatingFilters evenColors">
                                            <div className="one-columns relative no-margin">
                                                <div className={`subloader ${this.state.subloaderFilters ? "active" : ""}`}></div>
                                                <div className="item">
                                                    <label htmlFor="">Filtrar tipo multimedia</label>
                                                    <Select
                                                        divClass=""
                                                        selectplaceholder="Seleccione"
                                                        selectValue={this.state.filterTipoMultimedia}
                                                        selectoptions={this.state.dataSelectTipoMultimedia}
                                                        selectOnchange={this.handlerFilterTipoMultimedia}
                                                        selectIsSearchable={false}
                                                        selectclassNamePrefix="selectReact__value-container"
                                                        spanClass=""
                                                        spanError="" >
                                                    </Select>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <ContenidoMultimediaList
                                        propiedades={this.state.listMultimedia.propiedades}
                                        data={this.state.listMultimedia.data}
                                        handlerPagination={this.handlerPaginationMultimedia}
                                        defaultImage={Constantes.NoImagenPicture}
                                        link="#/multimedia" params={["id"]}
                                        pageExtends={this.state.listMultimedia.page}
                                        totalRows={this.state.listMultimedia.totalRows}
                                        pageSize={this.state.listMultimedia.rows}
                                        pathImgOrigen={auth.pathApi()}
                                        className="pd-25"
                                        esModal={this.state.listMultimedia.esModal}
                                        targetModal={this.state.listMultimedia.targetModal}
                                        handlerForLoadModal={this.handlerForLoadModalMultimedia}
                                    />
                                </div>
                                {/* End Multimedia */}
                            </div>
                            <div className="contentTab" data-ref="2">
                                {/* <div className="CMTitle">
                                    <h3><i className="fas fa-comment-dots"></i> Opiniones</h3>
                                </div> */}
                                <div className="relative">
                                    <div className={`subloader ${this.state.subloaderOpiniones ? "active" : ""}`}></div>
                                    <div className="buscador pd-25">
                                        <div class="input-group">
                                            <input type="text" value={this.state.listOpiniones.search}
                                                onChange={async (e) => {
                                                    let data = this.state.listOpiniones;
                                                    data.search = e.target.value;
                                                    this.setState({ listOpiniones: data })
                                                }}
                                                onKeyUp={async (e) => {
                                                    if (e.key === "Enter") {
                                                        await this.handlerPaginationOpiniones(this.state.listOpiniones.page, this.state.listOpiniones.rows, e.target.value)
                                                    }
                                                }}
                                                placeholder="Escriba para buscar" className="form-control" />

                                            <span className="input-group-text"><button onClick={async () => { await this.handlerPaginationOpiniones(this.state.listOpiniones.page, this.state.listOpiniones.rows, this.state.listOpiniones.search) }} type="button" className="btn btn-primary"><i className="fa fa-search"></i></button></span>
                                            <span className="input-group-text"><button onClick={(e) => { toggleFilter(e.currentTarget); this.getComboEquipoCVByType(); this.getComboTipoPublicacion(); }} type="button" className="btn btn-primary"><i className="fa fa-filter"></i></button></span>
                                        </div>
                                        <div className="floatingFilters evenColors">
                                            <div className="one-columns relative no-margin">
                                                <div className={`subloader ${this.state.subloaderFilters ? "active" : ""}`}></div>
                                                <div className="item">
                                                    <label htmlFor="">Filtrar por tipo de publicación</label>
                                                    <Select
                                                        divClass=""
                                                        selectplaceholder="Seleccione"
                                                        selectValue={this.state.filterTipoPublicacionOpiniones}
                                                        selectOnchange={this.handlerTipoPublicacionOpiniones}
                                                        selectoptions={this.state.dataSelectTipoPublicacion}
                                                        selectIsSearchable={false}
                                                        selectclassNamePrefix="selectReact__value-container"
                                                        spanClass=""
                                                        spanError="" >
                                                    </Select>
                                                </div>
                                                <div className="item">
                                                    <label htmlFor="">Filtrar equipo CV</label>
                                                    <Select
                                                        divClass=""
                                                        selectplaceholder="Seleccione"
                                                        selectValue={this.state.filterEquipoCV}
                                                        selectOnchange={this.handlerFilterEquipoCV}
                                                        selectoptions={this.state.dataSelectEquipoCV}
                                                        selectIsSearchable={false}
                                                        selectclassNamePrefix="selectReact__value-container"
                                                        spanClass=""
                                                        spanError="" >
                                                    </Select>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <ContenidoMultimediaList
                                        propiedades={this.state.listOpiniones.propiedades}
                                        data={this.state.listOpiniones.data}
                                        handlerPagination={this.handlerPaginationOpiniones}
                                        defaultImage={Constantes.NoImagenPicture}
                                        link="#/detalle-opinion" params={["id"]}
                                        pageExtends={this.state.listOpiniones.page}
                                        totalRows={this.state.listOpiniones.totalRows}
                                        pageSize={this.state.listOpiniones.rows}
                                        pathImgOrigen={auth.pathApi()}
                                        className="pd-25"
                                    />
                                </div>
                                {/* End Opiniones */}
                            </div>
                            <div className="contentTab" data-ref="3">
                                {/* <div className="CMTitle">
                                    <h3><i className="fas fa-comments"></i> Opiniones de congresistas</h3>
                                </div> */}
                                <div className="relative">
                                    <div className={`subloader ${this.state.subloaderOpinionesCongresistas ? "active" : ""}`}></div>
                                    <div className="buscador pd-25">
                                        <div class="input-group">
                                            <input type="text" value={this.state.listOpinionesCongresistas.search}
                                                onChange={async (e) => {
                                                    let data = this.state.listOpinionesCongresistas;
                                                    data.search = e.target.value;
                                                    this.setState({ listOpinionesCongresistas: data })
                                                }}
                                                onKeyUp={async (e) => {
                                                    if (e.key === "Enter") {
                                                        await this.handlerPaginationOpinionesCongresistas(this.state.listOpinionesCongresistas.page, this.state.listOpinionesCongresistas.rows, e.target.value)
                                                    }
                                                }}
                                                placeholder="Escriba para buscar" className="form-control" />

                                            <span className="input-group-text"><button onClick={async () => { await this.handlerPaginationOpinionesCongresistas(this.state.listOpinionesCongresistas.page, this.state.listOpinionesCongresistas.rows, this.state.listOpinionesCongresistas.search) }} type="button" className="btn btn-primary"><i className="fa fa-search"></i></button></span>
                                            <span className="input-group-text"><button onClick={(e) => { toggleFilter(e.currentTarget); this.getComboTipoPublicacion(); this.getComboCongresistaByType() }} type="button" className="btn btn-primary"><i className="fa fa-filter"></i></button></span>
                                        </div>
                                        <div className="floatingFilters evenColors">
                                            <div className="one-columns relative no-margin">
                                                <div className={`subloader ${this.state.subloaderFilters ? "active" : ""}`}></div>
                                                <div className="item">
                                                    <label htmlFor="">Filtrar por tipo de publicación</label>
                                                    <Select
                                                        divClass=""
                                                        selectplaceholder="Seleccione"
                                                        selectValue={this.state.filterTipoPublicacionOpinionesCongresistas}
                                                        selectOnchange={this.handlerTipoPublicacionOpinionesCongresistas}
                                                        selectoptions={this.state.dataSelectTipoPublicacion}
                                                        selectIsSearchable={false}
                                                        selectclassNamePrefix="selectReact__value-container"
                                                        spanClass=""
                                                        spanError="" >
                                                    </Select>
                                                </div>
                                                <div className="item">
                                                    <label htmlFor="">Filtrar por congresista</label>
                                                    <Select
                                                        divClass=""
                                                        selectplaceholder="Seleccione"
                                                        selectValue={this.state.filterCongresistas}
                                                        selectOnchange={this.handlerFilterCongresistas}
                                                        selectoptions={this.state.dataSelectOpCongresistas}
                                                        selectIsSearchable={false}
                                                        selectclassNamePrefix="selectReact__value-container"
                                                        spanClass=""
                                                        spanError="" >
                                                    </Select>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <ContenidoMultimediaList
                                        propiedades={this.state.listOpinionesCongresistas.propiedades}
                                        data={this.state.listOpinionesCongresistas.data}
                                        handlerPagination={this.handlerPaginationOpinionesCongresistas}
                                        defaultImage={Constantes.NoImagen}
                                        link="#/detalle-opinion-congresista" params={["id"]}
                                        pageExtends={this.state.listOpinionesCongresistas.page}
                                        totalRows={this.state.listOpinionesCongresistas.totalRows}
                                        pageSize={this.state.listOpinionesCongresistas.rows}
                                        pathImgOrigen={auth.pathApi()}
                                        className="pd-25"
                                    />
                                </div>
                                {/* End Opiniones congresistas */}
                            </div>
                            <div className="contentTab" data-ref="4">
                                {/* <div className="CMTitle">
                                    <h3><i className="fas fa-microphone-alt"></i> Podcast</h3>
                                </div> */}
                                <div className="relative">
                                    <div className={`subloader ${this.state.subloaderPodcast ? "active" : ""}`}></div>
                                    <div className="buscador pd-25">
                                        <div class="input-group">
                                            <input type="text" value={this.state.listPodcast.search}
                                                onChange={async (e) => {
                                                    let data = this.state.listPodcast;
                                                    data.search = e.target.value;
                                                    this.setState({ listPodcast: data })
                                                }}
                                                onKeyUp={async (e) => {
                                                    if (e.key === "Enter") {
                                                        await this.handlerPaginationPodcast(this.state.listPodcast.page, this.state.listPodcast.rows, e.target.value)
                                                    }
                                                }}
                                                placeholder="Escriba para buscar" className="form-control" />

                                            <span className="input-group-text"><button onClick={async () => { await this.handlerPaginationPodcast(this.state.listPodcast.page, this.state.listPodcast.rows, this.state.listPodcast.search) }} type="button" className="btn btn-primary"><i className="fa fa-search"></i></button></span>
                                        </div>
                                    </div>
                                    <ContenidoMultimediaList
                                        propiedades={this.state.listPodcast.propiedades}
                                        data={this.state.listPodcast.data}
                                        handlerPagination={this.handlerPaginationPodcast}
                                        defaultImage={Constantes.NoImagenPicture}
                                        link="#/podcast" params={["id"]}
                                        pageExtends={this.state.listPodcast.page}
                                        totalRows={this.state.listPodcast.totalRows}
                                        pageSize={this.state.listPodcast.rows}
                                        pathImgOrigen={auth.pathApi()}
                                        className="pd-25"
                                        esModal={this.state.listPodcast.esModal}
                                        targetModal={this.state.listPodcast.targetModal}
                                        handlerForLoadModal={this.handlerForLoadModalPodcast}
                                    />
                                </div>
                                {/* End PodCast */}
                            </div>
                            <div className="contentTab" data-ref="5">
                                {/* <div className="CMTitle">
                                    <h3><i className="fas fa-balance-scale"></i> Balances de cuatrienio</h3>
                                </div> */}
                                <div className="relative">
                                    <div className={`subloader ${this.state.subloaderBalanceCuatrienio ? "active" : ""}`}></div>
                                    <div className="buscador pd-25">
                                        <div class="input-group">
                                            <input type="text" value={this.state.listBalanceCuatrienio.search}
                                                onChange={async (e) => {
                                                    let data = this.state.listBalanceCuatrienio;
                                                    data.search = e.target.value;
                                                    this.setState({ listBalanceCuatrienio: data })
                                                }}
                                                onKeyUp={async (e) => {
                                                    if (e.key === "Enter") {
                                                        await this.handlerPaginationBalanceCuatrienio(this.state.listBalanceCuatrienio.page, this.state.listBalanceCuatrienio.rows, e.target.value)
                                                    }
                                                }}
                                                placeholder="Escriba para buscar" className="form-control" />

                                            <span className="input-group-text"><button onClick={async () => { await this.handlerPaginationBalanceCuatrienio(this.state.listBalanceCuatrienio.page, this.state.listBalanceCuatrienio.rows, this.state.listBalanceCuatrienio.search) }} type="button" className="btn btn-primary"><i className="fa fa-search"></i></button></span>
                                            <span className="input-group-text"><button onClick={(e) => { toggleFilter(e.currentTarget); this.getComboYearInicio(); }} type="button" className="btn btn-primary"><i className="fa fa-filter"></i></button></span>
                                        </div>
                                        <div className="floatingFilters evenColors">
                                            <div className="one-columns relative no-margin">
                                                <div className={`subloader ${this.state.subloaderFilters ? "active" : ""}`}></div>
                                                <div className="item">
                                                    <label htmlFor="">Filtrar por año de inicio</label>
                                                    <Select
                                                        divClass=""
                                                        selectplaceholder="Seleccione"
                                                        selectValue={this.state.filterYearInicio}
                                                        selectOnchange={this.handlerFilterYearInicio}
                                                        selectoptions={this.state.dataSelectYearInicio}
                                                        selectIsSearchable={true}
                                                        selectclassNamePrefix="selectReact__value-container"
                                                        spanClass=""
                                                        spanError="" >
                                                    </Select>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <ContenidoMultimediaList
                                        propiedades={this.state.listBalanceCuatrienio.propiedades}
                                        data={this.state.listBalanceCuatrienio.data}
                                        handlerPagination={this.handlerPaginationBalanceCuatrienio}
                                        defaultImage={Constantes.NoImagenPicture}
                                        link="#/detalle-balance-cuatrienio" params={["id"]}
                                        pageExtends={this.state.listBalanceCuatrienio.page}
                                        totalRows={this.state.listBalanceCuatrienio.totalRows}
                                        pageSize={this.state.listBalanceCuatrienio.rows}
                                        pathImgOrigen={auth.pathApi()}
                                        className="pd-25"
                                    />
                                </div>
                                {/* End Balances cuatrienios */}
                            </div>
                            <div className="contentTab" data-ref="6">
                                {/* <div className="CMTitle">
                                    <h3><i className="fas fa-file-alt"></i> Informes Regionales</h3>
                                </div> */}
                                <div className="relative">
                                    <div className={`subloader ${this.state.subloaderInformesPNUD ? "active" : ""}`}></div>
                                    <div className="buscador pd-25">
                                        <div class="input-group">
                                            <input type="text" value={this.state.listInformesPNUD.search}
                                                onChange={async (e) => {
                                                    let data = this.state.listInformesPNUD;
                                                    data.search = e.target.value;
                                                    this.setState({ listInformesPNUD: data })
                                                }}
                                                onKeyUp={async (e) => {
                                                    if (e.key === "Enter") {
                                                        await this.handlerPaginationInformesPNUD(this.state.listInformesPNUD.page, this.state.listInformesPNUD.rows, e.target.value)
                                                    }
                                                }}
                                                placeholder="Escriba para buscar" className="form-control" />

                                            <span className="input-group-text"><button onClick={async () => { await this.handlerPaginationInformesPNUD(this.state.listInformesPNUD.page, this.state.listInformesPNUD.rows, this.state.listInformesPNUD.search) }} type="button" className="btn btn-primary"><i className="fa fa-search"></i></button></span>
                                        </div>
                                    </div>
                                    <ContenidoMultimediaList
                                        propiedades={this.state.listInformesPNUD.propiedades}
                                        data={this.state.listInformesPNUD.data}
                                        defaultImage={Constantes.NoImagenPicture}
                                        handlerPagination={this.handlerPaginationInformesPNUD}
                                        link="#/detalle" params={["id"]}
                                        pageExtends={this.state.listInformesPNUD.page}
                                        totalRows={this.state.listInformesPNUD.totalRows}
                                        pageSize={this.state.listInformesPNUD.rows}
                                        pathImgOrigen={auth.pathApi()}
                                        className="pd-25"
                                        esModal={this.state.listInformesPNUD.esModal}
                                        targetModal={this.state.listInformesPNUD.targetModal}
                                        handlerForLoadModal={this.handlerForLoadModalInformesPNUD}
                                    />
                                </div>
                                {/* End Informes PNUD */}
                            </div>
                        </div>
                    </div>







                </section>
                <div style={{ clear: "both" }}></div>

                {/* Modal section */}

                <div className="modal fade" id="modal-informes-pnud" tabindex="-1" aria-labelledby="modal-informes-pnud" aria-hidden="true">
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="estudios"><i className="fas fa-file-alt"></i> Informes Regionales {`- ${this.state.informeSelected.nombre || ''}`}</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <div className={`subloader ${this.state.subloaderModal ? "active" : ""}`}></div>
                                <div className="container">
                                    <div className="listDocumentos">
                                        {
                                            this.state.informeSelected.documentos_informe ?
                                                this.state.informeSelected.documentos_informe.map((item, i) =>
                                                    <a key={i} href={auth.pathApi() + item.documento} className="btn btn-primary center-block mb-2" target="_blank"><i className="fas fa-file-alt"></i>{" " + item.documento.split("/")[1]}</a>
                                                ) : ""
                                        }
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                {/* <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                <button type="button" className="btn btn-primary">Save changes</button> */}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="modal fade" id="modal-podcast" tabindex="-1" aria-labelledby="modal-podcast" aria-hidden="true">
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="estudios"><i className="fas fa-microphone-alt"></i> Podcast {`- ${this.state.podcastSelected.titulo || ''}`}</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <div className="portrait">
                                    <img src={this.state.podcastSelected.podcast_imagen ? auth.pathApi() + this.state.podcastSelected.podcast_imagen[1].imagen : ""} alt={this.state.podcastSelected.titulo || ''} />
                                </div>
                                <div className={`subloader ${this.state.subloaderModal ? "active" : ""}`}></div>
                                <p><strong>Presentadores:</strong> {this.state.podcastSelected.presentadores || ''}</p>
                                <p><strong>Invitados:</strong> {this.state.podcastSelected.invitados || ''}</p>
                                <p><strong>Fecha de publicación:</strong> {this.state.podcastSelected.fecha || ''}</p>
                                {
                                    this.state.podcastSelected.esEnlace ?
                                        <a href={this.state.podcastSelected.urlExterno} className="btn btn-primary center-block" target="_blank"><i className="fas fa-play-circle"></i> Ir a audio</a>
                                        :
                                        <audio className="center-block w-100" src={auth.pathApi() + this.state.podcastSelected.urlAudio} controls={true}></audio>
                                }
                                <strong>Resumen:</strong>
                                <SunEditor
                                    disable={true}
                                    enableToolbar={true}
                                    showToolbar={false}
                                    width="100%"
                                    height="100%"
                                    setOptions={{ resizingBar: false, showPathLabel: false, shortcutsDisable: true }}
                                    setContents={this.state.podcastSelected.resumen || 'Sin resumen'}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="modal fade" id="modal-multimedia" tabindex="-1" aria-labelledby="modal-opiniones" aria-hidden="true">
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="estudios"><i className="fas fa-photo-video"></i> Contenido Multimedia {`- ${this.state.multimediaSelected.titulo || ''}`}</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <div className={`subloader ${this.state.subloaderModal ? "active" : ""}`}></div>
                                <div className="container">
                                    {
                                        this.state.multimediaSelected.tipo_multimedia_id === 2 ?
                                            <audio src={auth.pathApi() + this.state.multimediaSelected.multimedia_archivo[0].archivo} controls={true} style={{ width: 730 }}></audio>
                                            : this.state.multimediaSelected.tipo_multimedia_id === 3 ?
                                                <video src={auth.pathApi() + this.state.multimediaSelected.multimedia_archivo[0].archivo} width="730" height="380" controls></video>
                                                : this.state.multimediaSelected.tipo_multimedia_id === 1 ?
                                                    <a href={auth.pathApi() + this.state.multimediaSelected.multimedia_archivo[0].archivo} className="btn btn-primary center-block" target="_blank"><i className="fas fa-paperclip"></i> Ir documento</a>
                                                    : this.state.multimediaSelected.tipo_multimedia_id === 4 ?
                                                        <a href={auth.pathApi() + this.state.multimediaSelected.multimedia_archivo[0].urlVideo} className="btn btn-primary center-block" target="_blank"><i className="fas fa-link"></i> Ir a Video</a>
                                                        : this.state.multimediaSelected.tipo_multimedia_id === 5 ?
                                                            <a href={auth.pathApi() + this.state.multimediaSelected.multimedia_archivo[0].urlAudio} className="btn btn-primary center-block" target="_blank"><i className="fas fa-link"></i> Ir a Audio</a>
                                                            : ""
                                    }
                                    {/* <p><strong>Fecha de publicación:</strong> {this.state.multimediaSelected.fechaPublicacion || ''}</p>                                                    
                                    <p><strong>Descripción:</strong> {<p dangerouslySetInnerHTML={{ __html: this.state.multimediaSelected.descripcion || ''}}/>}</p>  */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}

function estheticIn() {
    let header = document.querySelector("header");
    let mainP = document.querySelector(".mainPublicationContainer");
    let pubSide = document.querySelector(".publicationsSide");
    if (header)
        header.classList.add("small")

    if (mainP && pubSide) {
        setTimeout(() => {
            mainP.classList.add("active");
            pubSide.classList.add("active");
        }, 500);
    }
}

function estheticOut() {
    let header = document.querySelector("header");
    let mainP = document.querySelector(".mainPublicationContainer");
    let pubSide = document.querySelector(".publicationsSide");
    if (header)
        header.classList.remove("small")

    if (mainP && pubSide) {
        mainP.classList.remove("active");
        pubSide.classList.remove("active");
    }
}

function toggleFilter(element) {
    element.parentNode.parentNode.parentNode.querySelector(".floatingFilters").classList.toggle("active");
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

export default ContenidoMultimedia;
