import React from 'react';
import Select from '../../../Components/Select';
import ProyectoLeyDataService from '../../../Services/CongresoVisible/ProyectoLey.Service';
import UtilsDataService from "../../../Services/General/Utils.Service";
import ListProyectosLey from "../../../Components/ListProyectosLey";
import { Constantes } from '../../../Constants/Constantes';
import AuthLogin from "../../../Utils/AuthLogin";
const defaultLegislatura = { value: 0, label: "Ver todas" };
const defaultCorporacion = { value: 0, label: "Ver todos" };
const defaultCuatrienio = { value: 0, label: "Ver todos" };
const defaultTipoProyecto = { value: 0, label: "Ver todos" };
const defaultItemSelectPublicacion = { value: 0, label: "Ver todos" };
const defaultItemSelectIniciativa = { value: 0, label: "Ver todas" };
const defaultItemSelectEstado = { value: 0, label: "Ver todos" };
const defaultItemSelectTema = { value: 0, label: "Ver todos" };
const auth = new AuthLogin();

class IniciativaLeys extends React.Component {
    constructor(props) {
        super(props);
        this.tableHandler = this.tableHandler.bind(this);
        this.state = {
            subloader: true,
            tableInfo: {
                data: [],
                totalRows: 0,
                page: 1,
                rows: 15,
                search: '',
            },
            filterCamara: true,
            filterSenado: false,
            itemLegislatura: defaultLegislatura,
            itemFilterCuatrienio: defaultCuatrienio,
            itemFilterCorporacion: defaultCorporacion,
            itemSelectTipoProyecto: defaultTipoProyecto,
            itemSelectEstado: defaultItemSelectEstado,
            itemSelectIniciativa: defaultItemSelectIniciativa,
            itemSelectPublicacion: defaultItemSelectPublicacion,
            itemSelectTema: defaultItemSelectTema,
            dataSelectLegislatura: [],
            dataSelectCuatrienio: [],
            dataSelectCorporacion: [],
            dataSelectTipoProyecto: [],
            dataSelectEstadoProyecto: [],
            dataSelectTipoPublicacionProyectoLeyProyecto: [],
            dataSelectIniciativa: [],
            dataSelectTema: []
        }
    }

    async tableHandler(page, rows, search, isDelay) {
        let delayAccion = isDelay ? 1000 : 0;
        let tableInfo = this.state.tableInfo;
        tableInfo.page = page;
        tableInfo.rows = rows;
        tableInfo.search = search;
        if (!isDelay)
            tableInfo.data = [];
        this.setState({ tableInfo: tableInfo });
        if (this.timeout) clearTimeout(this.timeout);
        this.timeout = setTimeout(async function () {
            await this.getAll(page, rows, search);
        }.bind(this), delayAccion);
    }

    componentDidMount = async () => {
        await this.getComboTipoProyecto();
        await this.getComboEstadoProyecto();
        await this.getIniciativa(null, null, 1);
        await this.getComboTema(null, null, 1);
        await this.tableHandler(1, 15, "", false);
    };

    getAll = async (page, rows, search) => {
        this.setState({ subloader: true });
        let tableInfo = this.state.tableInfo;
        //let idCorporacion = this.state.filterCamara === true ? 1 : 2;
        await ProyectoLeyDataService.getAll(
            this.state.itemFilterCorporacion.value,
            this.state.itemFilterCuatrienio.value,
            this.state.itemLegislatura.value,
            this.state.itemSelectIniciativa.value,
            this.state.itemSelectTema.value,
            this.state.itemSelectEstado.value,
            this.state.itemSelectTipoProyecto.value,
            search, page, rows, 0)
            .then((response) => {
                tableInfo["data"] = response.data;
            })
            .catch((e) => {
                console.log(e);
            });

        await ProyectoLeyDataService.getTotalRecords(
            this.state.itemFilterCorporacion.value,
            this.state.itemFilterCuatrienio.value,
            this.state.itemLegislatura.value,
            this.state.itemSelectIniciativa.value,
            this.state.itemSelectTema.value,
            this.state.itemSelectEstado.value,
            this.state.itemSelectTipoProyecto.value,
            search, 0)
            .then((response) => {
                tableInfo["totalRows"] = response.data;
            })
            .catch((e) => {
                console.log(e);
            });

        this.setState({
            tableInfo: tableInfo,
            subloader: false,
        });
    };

    getTipoPublicacionProyectoLeyProyecto = async (id, nombre, activo) => {
        this.setState({ subloader: true });

        await UtilsDataService.getComboTipoPublicacionProyectoLeyFilter({
            id: id,
            nombre: nombre,
            activo: activo,
        }).then((response) => {
            let combo = [];
            response.data.forEach((i) => {
                combo.push({ value: i.id, label: i.nombre });
            });
            combo.unshift(Object.assign({}, defaultItemSelectPublicacion));
            this.setState({
                dataSelectTipoPublicacionProyectoLeyProyecto: combo,
                subloader: false,
            });
        });
    }

    getIniciativa = async (id, nombre, activo) => {
        this.setState({ subloader: true });

        await UtilsDataService.getComboIniciativaFilter({
            id: id,
            nombre: nombre,
            activo: activo,
        }).then((response) => {
            let combo = [];
            response.data.forEach((i) => {
                combo.push({ value: i.id, label: i.nombre });
            });
            combo.unshift(Object.assign({}, defaultItemSelectIniciativa));
            this.setState({
                dataSelectIniciativa: combo,
                subloader: false,
            });
        });
    }
    getComboTipoProyecto = async () => {
        this.setState({ subloader: true });
        await UtilsDataService.getComboTipoProyecto().then((response) => {
            let combo = [];
            response.data.forEach((i) => {
                combo.push({ value: i.id, label: i.nombre });
            });
            combo.unshift(Object.assign({}, defaultTipoProyecto));
            this.setState({
                dataSelectTipoProyecto: combo,
                subloader: false,
            });
        });
    };
    getComboEstadoProyecto = async () => {
        this.setState({ subloader: true });
        await UtilsDataService.getComboEstadoProyecto().then((response) => {
            let combo = [];
            response.data.forEach((i) => {
                combo.push({ value: i.id, label: i.nombre });
            });
            combo.unshift(Object.assign({}, defaultItemSelectEstado));
            this.setState({
                dataSelectEstadoProyecto: combo,
                subloader: false,
            });
        });
    };

    getComboTema = async (id, nombre, activo) => {
        this.setState({ subloader: true });
        await UtilsDataService.getComboTemaProyectoLeyFilter({ id: id, nombre: nombre, activo: activo }).then((response) => {
            let combo = [];
            response.data.forEach((i) => {
                combo.push({ value: i.id, label: i.nombre });
            });
            combo.unshift(Object.assign({}, defaultItemSelectTema));
            this.setState({
                dataSelectTema: combo,
                subloader: false,
            });
        });
    };

    handleTipoProyecto = async (select) => {
        let tableInfo = this.state.tableInfo;
        this.setState({ itemSelectTipoProyecto: select });
        await this.tableHandler(1, 15, tableInfo.search, false);
    }

    hanldeEstado = async (select) => {
        let tableInfo = this.state.tableInfo;
        this.setState({ itemSelectEstado: select });
        await this.tableHandler(1, 15, tableInfo.search, false);
    }

    handleTema = async (select) => {
        let tableInfo = this.state.tableInfo;
        this.setState({ itemSelectTema: select });
        await this.tableHandler(1, 15, tableInfo.search, false);
    }

    handleIniciativa = async (select) => {
        let tableInfo = this.state.tableInfo;
        this.setState({ itemSelectIniciativa: select });
        await this.tableHandler(1, 15, tableInfo.search, false);
    }

    render() {
        return (
            <>
                <main className="workspace">
                    <section className="breadcrumb lg:flex items-start">
                        <div>
                            <h1>Iniciativas Legislativas</h1>
                            <ul>
                                <li><a href="#">Página principal</a></li>
                                <li className="divider la la-arrow-right"></li>
                                <li><a href="#">Iniciativas Legislativas</a></li>
                                <li className="divider la la-arrow-right"></li>
                                <li>Listado</li>
                            </ul>
                        </div>
                        <div className="buscador items-center ml-auto mt-5 lg:mt-0 pd-25">
                            <div className="input-group">
                                <input
                                    type="text"
                                    value={this.state.search}
                                    onChange={async (e) => {
                                        this.setState({search: e.target.value});
                                    }}
                                    onKeyUp={async (e) => {
                                        if (e.key === "Enter") {
                                            await this.tableHandler(this.state.page, this.state.rows, e.target.value);
                                        }
                                    }}
                                    placeholder="Escriba para buscar"
                                    className="form-control"
                                />

                                <span className="input-group-text">
                                    <button
                                        onClick={async () => {
                                            await this.tableHandler(this.state.page, this.state.rows, this.state.search);
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
                                        <label htmlFor="">Tipo de proyecto</label>
                                        <Select
                                            divClass=""
                                            selectplaceholder="Seleccione"
                                            selectValue={this.state.itemSelectTipoProyecto}
                                            selectOnchange={this.handleTipoProyecto}
                                            selectoptions={this.state.dataSelectTipoProyecto}
                                            selectIsSearchable={true}
                                            selectclassNamePrefix="selectReact__value-container"
                                            spanClass=""
                                            spanError=""
                                        ></Select>
                                    </div>
                                    <div className="item">
                                        <label htmlFor="">Estado</label>
                                        <Select
                                            divClass=""
                                            selectplaceholder="Seleccione"
                                            selectValue={this.state.itemSelectEstado}
                                            selectOnchange={this.hanldeEstado}
                                            selectoptions={this.state.dataSelectEstadoProyecto}
                                            selectIsSearchable={true}
                                            selectclassNamePrefix="selectReact__value-container"
                                            spanClass=""
                                            spanError=""
                                        ></Select>
                                    </div>
                                    <div className="item">
                                        <label htmlFor="">Tema</label>
                                        <Select
                                            divClass=""
                                            selectplaceholder="Seleccione"
                                            selectValue={this.state.itemSelectTema}
                                            selectOnchange={this.handleTema}
                                            selectoptions={this.state.dataSelectTema}
                                            selectIsSearchable={true}
                                            selectclassNamePrefix="selectReact__value-container"
                                            spanClass=""
                                            spanError=""
                                        ></Select>
                                    </div>
                                    <div className="item">
                                        <label htmlFor="">Iniciativa</label>
                                        <Select
                                            divClass=""
                                            selectplaceholder="Seleccione"
                                            selectValue={this.state.itemSelectIniciativa}
                                            selectOnchange={this.handleIniciativa}
                                            selectoptions={this.state.dataSelectIniciativa}
                                            selectIsSearchable={true}
                                            selectclassNamePrefix="selectReact__value-container"
                                            spanClass=""
                                            spanError=""
                                        ></Select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                    <div className="relative">
                        <div className={`subloader ${this.state.subloader ? "active" : ""}`}><div className="relative"></div></div>
                        <ListProyectosLey
                            data={this.state.tableInfo["data"]}
                            handler={this.tableHandler}
                            pageExtends={this.state.tableInfo["page"]}
                            pageSizeExtends={this.state.tableInfo["rows"]}
                            totalRows={this.state.tableInfo["totalRows"]}
                            search={this.state.tableInfo["search"]}
                            imgDefault={Constantes.NoImagen}
                            origen={auth.pathApi()}
                        />
                    </div>
                </main>
            </>
        )
    }
}
function toggleFilter(element) {
    element.parentNode.parentNode.parentNode
        .querySelector(".floatingFilters")
        .classList.toggle("active");
}

export default IniciativaLeys;
