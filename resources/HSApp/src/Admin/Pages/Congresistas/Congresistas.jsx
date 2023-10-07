import React from "react";
import Select from "../../../Components/Select";
import SelectCurul from "../../../Components/SelectCurul";
import CongresistasDataService from "../../../Services/Catalogo/Congresistas.Service";
import AuthLogin from "../../../Utils/AuthLogin";
import SquareCards from "../../../Components/CongresoVisible/SquareCards";
import { Constantes } from "../../../Constants/Constantes.js";

const auth = new AuthLogin();
const defaultTipoComision = { value: -1, label: "Seleccione tipo de comisión" };
const defaultComision = { value: -1, label: "Seleccione comisión" };
class Congresistas extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            subloader: true,
            filterCorporacion: {},
            filterCuatrienio: {},
            filterActive: { value: 1, label: "Activo" },
            filterPartido: { value: -1, label: "Ver todos" },
            filterDepartamento: { value: -1, label: "Ver todos" },
            filterGradoEstudio: { value: -1, label: "Ver todos" },
            filterProfesion: {value: -1, label: "Ver todas"},
            filterGenero: { value: -1, label: "Ver todos" },
            filterTipoComision: { value: -1, label: "Elegir tipo de comisión" },
            filterComision: { value: -1, label: "Ver todas" },
            filterCircunscripcion: { value: -1, label: "Ver todas" },
            filterGrupoEdad: { value: -1, label: "Ver todos" },
            dataSelectCorporacion: [],
            dataSelectCuatrienio: [],
            dataSelectPartido: [],
            dataSelectDepartamento: [],
            dataSelectGradoEstudio: [],
            dataSelectProfesion: [],
            dataSelectGenero: [],
            dataSelectCircunscripcion: [],
            dataSelectGrupoEdad: [],
            dataSelectTipoComisiones: [],
            dataSelectComisiones: [],
            listData: [],
            curulData: [],
            page: 1,
            rows: 8,
            search: "",
            totalRows: 0,
            esCurul: true,
            esLista: false,
        };
    }
    handlerFilterTipoComision = async (tipoComisionSelected) => {
        let state = this.state;
        state.filterTipoComision = tipoComisionSelected;
        state.filterComision = defaultComision;
        state.dataSelectComisiones = [];
        await this.getComboComisiones(tipoComisionSelected.value);
        this.setState({ state, subloader: false });
    };
    handlerFilterComision = async (comisionSelected) => {
        if (this.state.esLista) {
            this.setState({
                filterComision: comisionSelected,
                subloader: true,
            });
            await this.getAll(
                1,
                this.state.filterCorporacion.value,
                this.state.filterCuatrienio.value,
                this.state.filterPartido.value,
                this.state.filterGradoEstudio.value,
                this.state.filterGenero.value,
                this.state.filterCircunscripcion.value,
                this.state.filterGrupoEdad.value,
                comisionSelected.value,
                this.state.filterDepartamento.value,
                this.state.filterProfesion.value,
                this.state.page,
                this.state.rows,
                this.state.search
            );
        }
    };
    handlerGenero = async (selectGenero) => {
        if (this.state.esLista) {
            this.setState({ filterGenero: selectGenero, subloader: true });
            await this.getAll(
                1,
                this.state.filterCorporacion.value,
                this.state.filterCuatrienio.value,
                this.state.filterPartido.value,
                this.state.filterGradoEstudio.value,
                selectGenero.value,
                this.state.filterCircunscripcion.value,
                this.state.filterGrupoEdad.value,
                this.state.filterComision.value,
                this.state.filterDepartamento.value,
                this.state.filterProfesion.value,
                this.state.page,
                this.state.rows,
                this.state.search
            );
        }
    };
    handlerGradoEstudio = async (selectGradoEstudio) => {
        if (this.state.esLista) {
            this.setState({
                filterGradoEstudio: selectGradoEstudio,
                subloader: true,
            });
            await this.getAll(
                1,
                this.state.filterCorporacion.value,
                this.state.filterCuatrienio.value,
                this.state.filterPartido.value,
                selectGradoEstudio.value,
                this.state.filterGenero.value,
                this.state.filterCircunscripcion.value,
                this.state.filterGrupoEdad.value,
                this.state.filterComision.value,
                this.state.filterDepartamento.value,
                this.state.filterProfesion.value,
                this.state.page,
                this.state.rows,
                this.state.search
            );
        }
    };
    handlerPartido = async (selectPartido) => {
        if (this.state.esLista) {
            this.setState({
                filterPartido: selectPartido,
                subloader: true,
            });
            await this.getAll(
                1,
                this.state.filterCorporacion.value,
                this.state.filterCuatrienio.value,
                selectPartido.value,
                this.state.filterGradoEstudio.value,
                this.state.filterGenero.value,
                this.state.filterCircunscripcion.value,
                this.state.filterGrupoEdad.value,
                this.state.filterComision.value,
                this.state.filterDepartamento.value,
                this.state.filterProfesion.value,
                this.state.page,
                this.state.rows,
                this.state.search
            );
        }
    };
    handlerGrupoEdad = async (selectGrupoEdad) => {
        if (this.state.esLista) {
            this.setState({
                filterGrupoEdad: selectGrupoEdad,
                subloader: true,
            });
            await this.getAll(
                1,
                this.state.filterCorporacion.value,
                this.state.filterCuatrienio.value,
                this.state.filterPartido.value,
                this.state.filterGradoEstudio.value,
                this.state.filterGenero.value,
                this.state.filterCircunscripcion.value,
                selectGrupoEdad.value,
                this.state.filterComision.value,
                this.state.filterDepartamento.value,
                this.state.filterProfesion.value,
                this.state.page,
                this.state.rows,
                this.state.search
            );
        }
    };

    handlerPagination = async (page, rows, search = "") => {
        this.setState({ page, rows, search });
        if (this.timeout) clearTimeout(this.timeout);
        this.timeout = setTimeout(
            async function () {
                await this.getAll(
                    1,
                    this.state.filterCorporacion.value,
                    this.state.filterCuatrienio.value,
                    this.state.filterPartido.value,
                    this.state.filterGradoEstudio.value,
                    this.state.filterGenero.value,
                    this.state.filterCircunscripcion.value,
                    this.state.filterGrupoEdad.value,
                    this.state.filterComision.value,
                    this.state.filterDepartamento.value,
                    this.state.filterProfesion.value,
                    page,
                    rows,
                    search
                );
            }.bind(this),
            1000
        );
    };

    componentDidMount = async () => {
        await this.getListadoCongresistas();
    };

    getAll = async (
        idFilterActive,
        corporacion,
        cuatrienio,
        partido,
        gradoEstudio,
        genero,
        circunscripcion,
        grupoEdad,
        comision,
        departamento,
        profesion,
        page,
        rows,
        search
    ) => {
        this.setState({ subloader: true, esCurul: false, esLista: true });
        let listData = this.state.listData;
        await CongresistasDataService.getAll(
            idFilterActive,
            corporacion,
            cuatrienio,
            partido,
            gradoEstudio,
            genero,
            circunscripcion,
            grupoEdad,
            comision,
            departamento,
            profesion,
            search,
            page,
            rows
        )
            .then((response) => {
                listData = response.data;
            })
            .catch((e) => {
                console.error(e);
            });
        let totalRows = 0;
        await CongresistasDataService.getTotalRecords(
            idFilterActive,
            corporacion,
            cuatrienio,
            partido,
            gradoEstudio,
            genero,
            circunscripcion,
            grupoEdad,
            comision,
            departamento,
            profesion,
            search
        )
            .then((response) => {
                totalRows = response.data;
            })
            .catch((e) => {
                console.error(e);
            });

        this.setState({
            listData,
            totalRows,
            subloader: false,
        });
    };

    getComboGradoEstudio = async () => {
        await CongresistasDataService.getComboGradoEstudio().then(
            (response) => {
                let combo = [];
                let selected = { value: -1, label: "Ver todos" };
                response.data.forEach((i) => {
                    combo.push({ value: i.id, label: i.nombre });
                });
                combo.unshift({ value: -1, label: "Ver todos" });
                this.setState({
                    dataSelectGradoEstudio: combo,
                    filterGradoEstudio: selected,
                });
            }
        );
    };
    getComboPartido = async () => {
        await CongresistasDataService.getComboPartido({activo: 1}).then(
            (response) => {
                let combo = [];
                let selected = { value: -1, label: "Ver todas" };
                response.data.forEach((i) => {
                    combo.push({ value: i.id, label: i.nombre });
                });
                combo.unshift({ value: -1, label: "Ver todas" });
                this.setState({
                    dataSelectPartido: combo,
                    filterPartido: selected,
                });
            }
        );
    };
    getComboGenero = async () => {
        await CongresistasDataService.getComboGenero().then((response) => {
            let combo = [];
            let selected = { value: -1, label: "Ver todos" };
            response.data.forEach((i) => {
                combo.push({ value: i.id, label: i.nombre });
            });
            combo.unshift({ value: -1, label: "Ver todos" });
            this.setState({
                dataSelectGenero: combo,
                filterGenero: selected,
            });
        });
    };
    getComboGruposEdad = async () => {
        await CongresistasDataService.getComboGruposEdad().then((response) => {
            let combo = [];
            let selected = { value: -1, label: "Ver todos" };
            response.data.forEach((i) => {
                combo.push({ value: i.id, label: i.nombre });
            });
            combo.unshift({ value: -1, label: "Ver todos" });
            this.setState({
                dataSelectGrupoEdad: combo,
                filterGrupoEdad: selected,
            });
        });
    };
    getComboTipoComision = async () => {
        this.setState({ loading: true });
        await CongresistasDataService.getComboTipoComision().then(
            (response) => {
                let combo = [];
                let selected = { value: -1, label: "Ver todos" };
                response.data.forEach((i) => {
                    combo.push({ value: i.id, label: i.nombre });
                });
                combo.unshift({ value: -1, label: "Ver todos" });
                this.setState({
                    dataSelectTipoComisiones: combo,
                    filterTipoComision: selected,
                });
            }
        );
    };
    getComboComisiones = async (idTipoComision) => {
        this.setState({ subloader: true });
        await CongresistasDataService.getComboComisiones(idTipoComision).then(
            (response) => {
                let combo = [];
                let selected = { value: -1, label: "Ver todas" };
                response.data.forEach((i) => {
                    combo.push({ value: i.id, label: i.nombre });
                });
                combo.unshift({ value: -1, label: "Ver todas" });
                this.setState({
                    dataSelectComisiones: combo,
                    filterComision: selected,
                    subloader: false,
                });
            }
        );
    };
    getListadoCongresistas = async () => {
        this.setState({ subloader: true });
        // Verificamos si cada combo tiene datos, sino, se mandan a traer.
        
        if (
            this.state.dataSelectGradoEstudio.length === 0 ||
            typeof this.state.dataSelectGradoEstudio === "undefined" ||
            this.state.dataSelectGradoEstudio === null
        )
            await this.getComboGradoEstudio();
        if (
            this.state.dataSelectProfesion.length === 0 ||
            typeof this.state.dataSelectProfesion === "undefined" ||
            this.state.dataSelectProfesion === null
        )
            await this.getComboPartido();
        if (
            this.state.dataSelectGenero.length === 0 ||
            typeof this.state.dataSelectGenero === "undefined" ||
            this.state.dataSelectGenero === null
        )
            await this.getComboGenero();
        if (
            this.state.dataSelectTipoComisiones.length === 0 ||
            typeof this.state.dataSelectTipoComisiones === "undefined" ||
            this.state.dataSelectTipoComisiones === null
        )
            await this.getComboTipoComision();
        if (
            this.state.dataSelectGrupoEdad.length === 0 ||
            typeof this.state.dataSelectGrupoEdad === "undefined" ||
            this.state.dataSelectGrupoEdad === null
        )
            await this.getComboGruposEdad();

        await this.getAll(
            this.state.filterActive.value,
            this.state.filterCorporacion.value,
            this.state.filterCuatrienio.value,
            this.state.filterPartido.value,
            this.state.filterGradoEstudio.value,
            this.state.filterGenero.value,
            this.state.filterCircunscripcion.value,
            this.state.filterGrupoEdad.value,
            this.state.filterComision.value,
            this.state.filterDepartamento.value,
            this.state.filterProfesion.value,
            this.state.page,
            this.state.rows,
            this.state.search
        );
    };

    render() {
        return (
            <>
                <main className="workspace">
                    <section className="breadcrumb lg:flex items-start">
                        <div>
                            <h1>Diputados / Autores</h1>
                            <ul>
                                <li><a href="#">Página principal</a></li>
                                <li className="divider la la-arrow-right"></li>
                                <li><a href="#">Diputados / Autores</a></li>
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
                                            await this.handlerPagination(this.state.page, this.state.rows, e.target.value);
                                        }
                                    }}
                                    placeholder="Escriba para buscar"
                                    className="form-control"
                                />

                                <span className="input-group-text">
                                    <button
                                        onClick={async () => {
                                            await this.handlerPagination(this.state.page, this.state.rows, this.state.search);
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
                                        <label htmlFor="">Tipo de comisión</label>
                                        <Select
                                            divClass=""
                                            selectplaceholder="Seleccione"
                                            selectValue={this.state.filterTipoComision}
                                            selectOnchange={this.handlerFilterTipoComision}
                                            selectoptions={this.state.dataSelectTipoComisiones}
                                            selectIsSearchable={true}
                                            selectclassNamePrefix="selectReact__value-container"
                                            spanClass=""
                                            spanError=""
                                        ></Select>
                                    </div>
                                    <div className="item">
                                        <label htmlFor="">Comisión</label>
                                        <Select
                                            divClass=""
                                            selectplaceholder="Seleccione"
                                            selectValue={this.state.filterComision}
                                            selectOnchange={this.handlerFilterComision}
                                            selectoptions={this.state.dataSelectComisiones}
                                            selectIsSearchable={true}
                                            selectclassNamePrefix="selectReact__value-container"
                                            spanClass=""
                                            spanError=""
                                        ></Select>
                                    </div>
                                    <div className="item">
                                        <label htmlFor="">Género</label>
                                        <Select
                                            divClass=""
                                            selectplaceholder="Seleccione"
                                            selectValue={this.state.filterGenero}
                                            selectOnchange={this.handlerGenero}
                                            selectoptions={this.state.dataSelectGenero}
                                            selectIsSearchable={true}
                                            selectclassNamePrefix="selectReact__value-container"
                                            spanClass=""
                                            spanError=""
                                        ></Select>
                                    </div>
                                    <div className="item">
                                        <label htmlFor="">Grado de estudio</label>
                                        <Select
                                            divClass=""
                                            selectplaceholder="Seleccione"
                                            selectValue={this.state.filterGradoEstudio}
                                            selectOnchange={this.handlerGradoEstudio}
                                            selectoptions={this.state.dataSelectGradoEstudio}
                                            selectIsSearchable={true}
                                            selectclassNamePrefix="selectReact__value-container"
                                            spanClass=""
                                            spanError=""
                                        ></Select>
                                    </div>
                                    <div className="item">
                                        <label htmlFor="">Partido</label>
                                        <Select
                                            divClass=""
                                            selectplaceholder="Seleccione"
                                            selectValue={this.state.filterPartido}
                                            selectOnchange={this.handlerPartido}
                                            selectoptions={this.state.dataSelectPartido}
                                            selectIsSearchable={true}
                                            selectclassNamePrefix="selectReact__value-container"
                                            spanClass=""
                                            spanError=""
                                        ></Select>
                                    </div>
                                    <div className="item">
                                        <label htmlFor="">Grupo de edad</label>
                                        <Select
                                            divClass=""
                                            selectplaceholder="Seleccione"
                                            selectValue={this.state.filterGrupoEdad}
                                            selectOnchange={this.handlerGrupoEdad}
                                            selectoptions={this.state.dataSelectGrupoEdad}
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
                        <SquareCards
                                data={!this.state.subloader? this.state.listData: []}
                                handler={this.handlerPagination}
                                pageExtends={this.state.page}
                                pageSize={this.state.rows}
                                totalRows={this.state.totalRows}
                                defaultImage={Constantes.NoImagen}
                                pathImgOrigen={auth.pathApi()}
                            />
                    </div>
                </main>
            </>
        );
    }
}

function toggleFilter(element) {
    element.parentNode.parentNode.parentNode
        .querySelector(".floatingFilters")
        .classList.toggle("active");
}

export default Congresistas;
