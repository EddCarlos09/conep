import React, { Component } from "react";
import TableReactExtends from "../../../Components/TableReactExtends";
import ProyectoLeyDataService from "../../../Services/Congreso/ProyectoLey.Service";
import Spinner from "../../../Components/Spinner";
import Select from "../../../Components/Select";
import ValidForm from "../../../Utils/ValidForm";
import { ModuloPermiso } from "../../../Permisos/ModuloPermiso";
import ValidarPermiso from "../../../Permisos/ValidarPermiso";
import UtilsDataService from "../../../Services/General/Utils.Service";

const validForm = new ValidForm();
const fieldsConst = {
    id: 0,
    titulo: "",
    activo: false,
    esLey: false,
};
const errorsConst = {
    id: "",
    titulo: "",
    activo: "",
    esLey: ""
};

const SelectTipo = { value: '', label: 'Filtrar por tipo' };
const SelectEstado = { value: '', label: 'Filtrar por estado' };
const SelectIniciativa = { value: '', label: 'Filtrar por iniciativa' };
const SelectTema = { value: '', label: 'Filtrar por tema' };
const SelectLegislatura = { value: '', label: 'Filtrar por legislatura' };

class ProyectoLeys extends Component {
    constructor(props) {
        super(props);

        this.tableHandler = this.tableHandler.bind(this);

        this.state = {
            tableInfo: {
                columns: [
                    {
                        Header: "Iniciativas Legislativas",
                        columns: [
                            {
                                Header: "id",
                                accessor: "id",
                            },
                            {
                                Header: "Título",
                                accessor: "titulo",
                            },
                            {
                                Header: "Legislatura",
                                accessor: "legislatura.nombre",
                            },
                            {
                                Header: "Quinquenio",
                                accessor: "cuatrienio.nombre",
                            },
                            // {
                            //     Header: "Tipo de proyecto",
                            //     accessor: "tipo_proyecto_ley.nombre",
                            // },
                            {
                                Header: "¿Es Ley?",
                                id: "esLey",
                                accessor: "esLey",
                                Cell: (tableProps) => {
                                    return (
                                        <input
                                            type="checkbox"
                                            className="icheckbox"
                                            checked={
                                                tableProps.row.values.esLey
                                            }
                                            readOnly
                                        />
                                    );
                                },
                            },
                            {
                                Header: "Activo",
                                id: "activo",
                                accessor: "activo",
                                Cell: (tableProps) => {
                                    return (
                                        <input
                                            type="checkbox"
                                            className="icheckbox"
                                            checked={
                                                tableProps.row.values.activo
                                            }
                                            readOnly
                                        />
                                    );
                                },
                            },
                            {
                                Header: "Número en cámara",
                                accessor: "numero_camara",
                            },
                        ],
                    },
                    {
                        Header: "Acciones",
                        columns: [
                            {
                                Header: "Documentos",
                                id: "documentos",
                                accessor: (str) => "documentos",
                                Cell: (tableProps) => (
                                    <ValidarPermiso
                                        IdModuloPermisoValidar={ModuloPermiso.ProyectoDeLey.Obtener}
                                        DefaultTemplate=
                                            {
                                                <a
                                                    href={`#/proyecto-ley-documentos/${tableProps.row.values.id}`}
                                                    data-id={tableProps.row.values.id}
                                                    className="btn btn-info btn-block"
                                                >
                                                    <i className="fa fa-file"></i> Documentos
                                                </a>
                                            }
                                    />
                                ),
                            },
                            {
                                Header: "Editar",
                                id: "editar",
                                accessor: (str) => "editar",
                                Cell: (tableProps) => (
                                    <ValidarPermiso
                                        IdModuloPermisoValidar={ModuloPermiso.CargoIntegrante.Obtener}
                                        DefaultTemplate=
                                            {
                                                <a
                                                    href={`#/proyecto-ley-editar/${tableProps.row.values.id}`}
                                                    data-id={tableProps.row.values.id}
                                                    className="btn btn-info btn-block"
                                                >
                                                    <i className="fa fa-edit"></i> Editar
                                                </a>
                                            }
                                    />
                                ),
                            },
                            {
                                Header: "Activar/Desactivar",
                                id: "actdesc",
                                accessor: (str) => "actdesc",
                                Cell: (tableProps) => (
                                    <ValidarPermiso
                                        IdModuloPermisoValidar={ModuloPermiso.ProyectoDeLey.Eliminar}
                                        DefaultTemplate=
                                            {
                                                <button
                                                    data-toggle="modal"
                                                    data-target="#modal-activar-desactivar"
                                                    className={`btn ${tableProps.row.values.activo === 1
                                                        ? "btn-danger"
                                                        : "btn-warning"} eliminar`}
                                                    style={{ width: "100%" }}
                                                    data-id={tableProps.row.values.id}
                                                    onClick={() => {
                                                        this.handlerDesactivar(
                                                            tableProps.row.values
                                                        );
                                                    }}
                                                >
                                                    <i className="fa fa-eraser"></i>{" "}
                                                    {tableProps.row.values.activo === 1
                                                        ? "Desactivar"
                                                        : "Activar"}
                                                </button>
                                            }
                                    />

                                ),
                            },
                            {
                                Header: "¿Es ley?",
                                id: "leysino",
                                accessor: (str) => "leysino",
                                Cell: (tableProps) => (
                                    <ValidarPermiso
                                        IdModuloPermisoValidar={ModuloPermiso.ProyectoDeLey.Eliminar}
                                        DefaultTemplate=
                                            {
                                                <button
                                                    data-toggle="modal"
                                                    //data-target="#modal-activar-desactivar"
                                                    data-target="#modal-es-ley"
                                                    className={`btn ${tableProps.row.values.esLey === 1
                                                        ? "btn-danger"
                                                        : "btn-warning"} eliminar`}
                                                    style={{ width: "100%" }}
                                                    data-id={tableProps.row.values.id}
                                                    onClick={() => {
                                                        this.handlerEsLey(
                                                            tableProps.row.values
                                                        );
                                                    }}
                                                >
                                                    <i className="fa fa-book"></i>{" "}
                                                    {tableProps.row.values.esLey === 1
                                                        ? "Revertir ley"
                                                        : "Convertir en ley"}
                                                </button>
                                            }
                                    />

                                ),
                            },
                        ],
                    },
                ],
                hiddenColumns: ["id", "activo", "esLey"],
                data: [],
                page: 1,
                rows: 5,
                search: "",
                totalRows: 0,
            },
            fields: fieldsConst,
            errors: errorsConst,
            loading: true,
            filterActive: { value: 1, label: "Activo" },
            dataSelectActive: [
                { value: '', label: "Filtrar por activo" },
                { value: 1, label: "Activo" },
                { value: 0, label: "Inactivo" },
            ],
            filterTipo: SelectTipo,
            dataSelectTipo: [],
            filterEstado: SelectEstado,
            dataSelectEstado: [],
            filterIniciativa: SelectIniciativa,
            dataSelectIniciativa: [],
            filterTema: SelectTema,
            dataSelectTema: [],
            filterLegislatura: SelectLegislatura,
            dataSelectLegislatura: [],
        };
    }
    async tableHandler(page, rows, search, isDelay) {
        let delayAccion = isDelay ? 1000 : 0;
        let tableInfo = this.state.tableInfo;
        tableInfo.page = page;
        tableInfo.rows = rows;
        tableInfo.search = search;
        if (!isDelay) tableInfo.data = [];
        this.setState({ tableInfo: tableInfo });
        if (this.timeout) clearTimeout(this.timeout);
        this.timeout = setTimeout(
            async function () {
                await this.getAll(
                    this.state.filterActive.value,
                    this.state.filterTipo.value,
                    this.state.filterEstado.value,
                    this.state.filterIniciativa.value,
                    this.state.filterTema.value,
                    this.state.filterLegislatura.value,
                    page,
                    rows,
                    search
                );
            }.bind(this),
            delayAccion
        );
    }

    handleFilterLegislatura = async (selectLegislatura) => {
        this.setState({ filterLegislatura: selectLegislatura }, async ()=>{
            await this.getAll(
                this.state.filterActive.value,
                this.state.filterTipo.value,
                this.state.filterEstado.value,
                this.state.filterIniciativa.value,
                this.state.filterTema.value,
                this.state.filterLegislatura.value,
                this.state.tableInfo["page"],
                this.state.tableInfo["rows"],
                this.state.tableInfo["search"]
            );
        });
    };

    handleFilterTema = async (selectTema) => {
        this.setState({ filterTema: selectTema }, async ()=>{
            await this.getAll(
                this.state.filterActive.value,
                this.state.filterTipo.value,
                this.state.filterEstado.value,
                this.state.filterIniciativa.value,
                selectTema.value,
                this.state.filterLegislatura.value,
                this.state.tableInfo["page"],
                this.state.tableInfo["rows"],
                this.state.tableInfo["search"]
            );
        });
    };

    handleFilterIniciativa = async (selectIniciativa) => {
        this.setState({ filterIniciativa: selectIniciativa }, async()=>{
            await this.getAll(
                this.state.filterActive.value,
                this.state.filterTipo.value,
                this.state.filterEstado.value,
                selectIniciativa.value,
                this.state.filterTema.value,
                this.state.filterLegislatura.value,
                this.state.tableInfo["page"],
                this.state.tableInfo["rows"],
                this.state.tableInfo["search"]
            );
        });
    };

    handleFilterEstado = async (selectEstado) => {
        this.setState({ filterEstado: selectEstado }, async()=>{
            await this.getAll(
                this.state.filterActive.value,
                this.state.filterTipo.value,
                selectEstado.value,
                this.state.filterIniciativa.value,
                this.state.filterTema.value,
                this.state.filterLegislatura.value,
                this.state.tableInfo["page"],
                this.state.tableInfo["rows"],
                this.state.tableInfo["search"]
            );
        });
    };

    handleFilterTipo = async (selectTipo) => {
        this.setState({ filterTipo: selectTipo }, async ()=>{
            await this.getAll(
                this.state.filterActive.value,
                selectTipo.value,
                this.state.filterEstado.value,
                this.state.filterIniciativa.value,
                this.state.filterTema.value,
                this.state.filterLegislatura.value,
                this.state.tableInfo["page"],
                this.state.tableInfo["rows"],
                this.state.tableInfo["search"]
            );
        });
    };

    async componentDidMount() {
        await this.getAll(
            this.state.filterActive.value,
            this.state.filterTipo.value,
            this.state.filterEstado.value,
            this.state.filterIniciativa.value,
            this.state.filterTema.value,
            this.state.filterLegislatura.value,
            this.state.tableInfo["page"],
            this.state.tableInfo["rows"],
            this.state.tableInfo["search"]
        );
        await this.getComboTipo();
        await this.getComboEstado();
        await this.getComboIniciativa();
        await this.getComboTema();
        await this.getComboLegislatura();
    }

    getComboLegislatura = async () => {
        await UtilsDataService.getComboLegislaturaFilter()
            .then(response => {
                this.setState({ loading: true });
                let combo = [];
                response.data.forEach(i => {
                    combo.push({ value: i.id, label: i.nombre })
                })
                combo.unshift({ value: '', label: "Filtrar por legislatura" })
                this.setState({
                    dataSelectLegislatura: combo,
                    loading: false
                })
            });
    }

    getComboTema = async () => {
        await UtilsDataService.getComboTemaFilter()
            .then(response => {
                this.setState({ loading: true });
                let combo = [];
                response.data.forEach(i => {
                    combo.push({ value: i.id, label: i.nombre })
                })
                combo.unshift({ value: '', label: "Filtrar por tema" })
                this.setState({
                    dataSelectTema: combo,
                    loading: false
                })
            });
    }

    getComboIniciativa = async () => {
        await UtilsDataService.getComboIniciativaFilter()
            .then(response => {
                this.setState({ loading: true });
                let combo = [];
                response.data.forEach(i => {
                    combo.push({ value: i.id, label: i.nombre })
                })
                combo.unshift({ value: '', label: "Filtrar por iniciativa" })
                this.setState({
                    dataSelectIniciativa: combo,
                    loading: false
                })
            });
    }

    getComboEstado = async () => {
        await UtilsDataService.getComboEstadoProyecto()
            .then(response => {
                this.setState({ loading: true });
                let combo = [];
                response.data.forEach(i => {
                    combo.push({ value: i.id, label: i.nombre })
                })
                combo.unshift({ value: '', label: "Filtrar por estado" })
                this.setState({
                    dataSelectEstado: combo,
                    loading: false
                })
            });
    }

    getComboTipo = async () => {
        await UtilsDataService.getComboTipoProyecto()
            .then(response => {
                this.setState({ loading: true });
                let combo = [];
                response.data.forEach(i => {
                    combo.push({ value: i.id, label: i.nombre })
                })
                combo.unshift({ value: '', label: "Filtrar por tipo" })
                this.setState({
                    dataSelectTipo: combo,
                    loading: false
                })
            });
    }

    handlerDesactivar = (item) => {
        let desActObj = {
            id: item.id,
            titulo: item.titulo,
            activo: item.activo,
        };
        this.setState({
            fields: desActObj,
        });
    };

    handlerEsLey = (item) => {
        let esLeyObj = {
            id: item.id,
            titulo: item.titulo,
            activo: item.activo,
            esLey : item.esLey,
        };
        this.setState({
            fields: esLeyObj,
        });
    };

    deleteSubmit = async (e) => {
        e.preventDefault();
        let errors = this.state.errors;
        errors = validForm.cleanErrors(errors);
        this.setState({ errors: errors, loading: true });

        let responseData;
        await ProyectoLeyDataService.delete(this.state.fields["id"])
            .then((response) => {
                responseData = response.data;
            })
            .catch(function (error) {
                errors = validForm.displayErrors(
                    error.response.data.errors,
                    errors
                );
            });

        this.setState({ errors: errors, loading: false });
        if (responseData != null) {
            await this.getAll(
                this.state.filterActive.value,
                this.state.filterTipo.value,
                this.state.filterEstado.value,
                this.state.filterIniciativa.value,
                this.state.filterTema.value,
                this.state.filterLegislatura.value,
                this.state.tableInfo["page"],
                this.state.tableInfo["rows"],
                this.state.tableInfo["search"]
            );
            document.querySelector(`#modal-activar-desactivar button[data-dismiss="modal"]`).click();
        }
    };

    esLeySubmit = async (e) => {
        e.preventDefault();
        let errors = this.state.errors;
        errors = validForm.cleanErrors(errors);
        this.setState({ errors: errors, loading: true });

        let responseData;
        await ProyectoLeyDataService.esLey(this.state.fields["id"])
            .then((response) => {
                responseData = response.data;
            })
            .catch(function (error) {
                errors = validForm.displayErrors(
                    error.response.data.errors,
                    errors
                );
            });

        this.setState({ errors: errors, loading: false });
        if (responseData != null) {
            await this.getAll(
                this.state.filterActive.value,
                this.state.filterTipo.value,
                this.state.filterEstado.value,
                this.state.filterIniciativa.value,
                this.state.filterTema.value,
                this.state.filterLegislatura.value,
                this.state.tableInfo["page"],
                this.state.tableInfo["rows"],
                this.state.tableInfo["search"]
            );
            document.querySelector(`#modal-es-ley button[data-dismiss="modal"]`).click();
        }
    };

    getAll = async (idFilterActive, tipo, estado, iniciativa, tema, legislatura, page, rows, search) => {
        this.setState({ loading: true });
        let tableInfo = this.state.tableInfo;
        await ProyectoLeyDataService.getAll(idFilterActive, tipo, estado, iniciativa, tema, legislatura, search, page, rows)
            .then((response) => {
                tableInfo["data"] = response.data;
            })
            .catch((e) => {
                console.log(e);
            });

        await ProyectoLeyDataService.getTotalRecords(idFilterActive, tipo, estado, iniciativa, tema, legislatura, search, page, rows)
            .then((response) => {
                tableInfo["totalRows"] = response.data;
            })
            .catch((e) => {
                console.log(e);
            });

        this.setState({
            tableInfo: tableInfo,
            loading: false,
        });
    };

    resetFiels() {
        let fields = validForm.resetObject(fieldsConst);
        this.setState({
            fields: fields,
            errors: validForm.cleanErrors(this.state.errors),
        });
    }

    handleFilterActive = async (selectActive) => {
        this.setState({ filterActive: selectActive },async ()=>{
            await this.getAll(
                selectActive.value,
                this.state.filterTipo.value,
                this.state.filterEstado.value,
                this.state.filterIniciativa.value,
                this.state.filterTema.value,
                this.state.filterLegislatura.value,
                this.state.tableInfo.page,
                this.state.tableInfo.rows,
                this.state.tableInfo.search
            );
        });
    };
    render() {
        return (
            <div>
                <Spinner show={this.state.loading} />

                <div className={`message-box message-box-${this.state.fields.activo ? "danger" : "info"} animated fadeIn`} id="modal-activar-desactivar">
                    <form>
                        <div className="mb-container">
                            <div className="mb-middle">
                                <div className="mb-title"><span className={`fa fa-${this.state.fields.activo ? "eraser" : "check"}`}></span> {this.state.fields.activo ? "Desactivar" : "Activar"} proyecto de ley</div>
                                <div className="mb-content">
                                    <p>{`¿Está seguro que desea ${this.state.fields.activo ? "desactivar" : "activar"} la iniciativa ${this.state.fields.titulo}? Puede volver a ${this.state.fields.activo ? "activarlo" : "desactivarlo"} en cualquier otro momento.`}</p>
                                </div>
                                <div className="mb-footer">
                                    <ValidarPermiso
                                        IdModuloPermisoValidar={ModuloPermiso.ProyectoDeLey.Eliminar}
                                        DefaultTemplate=
                                            {
                                                <button type="button" className="btn btn-primary btn-lg pull-right" onClick={async (e) => { await this.deleteSubmit(e) }} >{this.state.fields.activo ? "Desactivar" : "Activar"}</button>
                                            }
                                    />
                                    &nbsp;
                                    <button className="btn btn-default btn-lg pull-right" type="button" data-dismiss="modal">Cancelar</button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>

                <div className={`message-box message-box-${this.state.fields.esLey ? "danger" : "info"} animated fadeIn`} id="modal-es-ley">
                    <form>
                        <div className="mb-container">
                            <div className="mb-middle">
                                <div className="mb-title"><span className={`fa fa-${this.state.fields.esLey ? "eraser" : "check"}`}></span> {this.state.fields.esLey ? "Revertir Ley a " : "Convertir en Ley una"} iniciativa</div>
                                <div className="mb-content">
                                    <p>{`¿Está seguro que desea ${this.state.fields.esLey ? "revertir " : "convertir en ley "} la iniciativa ${this.state.fields.titulo}? Puede volver a cambiarlo en cualquier otro momento.`}</p>
                                </div>
                                <div className="mb-footer">
                                    <ValidarPermiso
                                        IdModuloPermisoValidar={ModuloPermiso.ProyectoDeLey.Eliminar}
                                        DefaultTemplate=
                                            {
                                                <button type="button" className="btn btn-primary btn-lg pull-right" onClick={async (e) => { await this.esLeySubmit(e) }} >{this.state.fields.esLey ? "Revertir" : "Convertir en ley"}</button>
                                            }
                                    />
                                    &nbsp;
                                    <button className="btn btn-default btn-lg pull-right" type="button" data-dismiss="modal">Cancelar</button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>

                <ul className="breadcrumb push-down-0">
                    <li>
                        <a href="/">Iniciativas Legislativas</a>
                    </li>
                </ul>
                <div className="content-frame">
                    <div className="content-frame-top">
                        <div className="rowListado">
                            <div className="panel panel-default ">
                                <div className="panel-heading">
                                    <h3 className="panel-title">
                                        <span className="fa fa-list"></span>{" "}
                                        Iniciativas Legislativas
                                    </h3>
                                    <ul className="panel-controls">
                                        <li>
                                            <div style={{ minWidth: "150px" }}>
                                                <Select
                                                    divClass=""
                                                    selectplaceholder="Seleccione"
                                                    selectValue={
                                                        this.state.filterLegislatura
                                                    }
                                                    selectOnchange={
                                                        this.handleFilterLegislatura
                                                    }
                                                    selectoptions={
                                                        this.state.dataSelectLegislatura
                                                    }
                                                    selectIsSearchable={true}
                                                    selectclassNamePrefix="selectReact__value-container"
                                                    spanClass=""
                                                    spanError=""
                                                />
                                            </div>
                                        </li>
                                        <li>
                                            <div style={{ minWidth: "150px" }}>
                                                <Select
                                                    divClass=""
                                                    selectplaceholder="Seleccione"
                                                    selectValue={
                                                        this.state.filterTema
                                                    }
                                                    selectOnchange={
                                                        this.handleFilterTema
                                                    }
                                                    selectoptions={
                                                        this.state.dataSelectTema
                                                    }
                                                    selectIsSearchable={true}
                                                    selectclassNamePrefix="selectReact__value-container"
                                                    spanClass=""
                                                    spanError=""
                                                />
                                            </div>
                                        </li>
                                        <li>
                                            <div style={{ minWidth: "150px" }}>
                                                <Select
                                                    divClass=""
                                                    selectplaceholder="Seleccione"
                                                    selectValue={
                                                        this.state.filterTipo
                                                    }
                                                    selectOnchange={
                                                        this.handleFilterTipo
                                                    }
                                                    selectoptions={
                                                        this.state.dataSelectTipo
                                                    }
                                                    selectIsSearchable={true}
                                                    selectclassNamePrefix="selectReact__value-container"
                                                    spanClass=""
                                                    spanError=""
                                                />
                                            </div>
                                        </li>
                                        <li>
                                            <div style={{ minWidth: "150px" }}>
                                                <Select
                                                    divClass=""
                                                    selectplaceholder="Seleccione"
                                                    selectValue={
                                                        this.state.filterEstado
                                                    }
                                                    selectOnchange={
                                                        this.handleFilterEstado
                                                    }
                                                    selectoptions={
                                                        this.state.dataSelectEstado
                                                    }
                                                    selectIsSearchable={true}
                                                    selectclassNamePrefix="selectReact__value-container"
                                                    spanClass=""
                                                    spanError=""
                                                />
                                            </div>
                                        </li>
                                        <li>
                                            <div style={{ minWidth: "150px" }}>
                                                <Select
                                                    divClass=""
                                                    selectplaceholder="Seleccione"
                                                    selectValue={
                                                        this.state.filterIniciativa
                                                    }
                                                    selectOnchange={
                                                        this.handleFilterIniciativa
                                                    }
                                                    selectoptions={
                                                        this.state.dataSelectIniciativa
                                                    }
                                                    selectIsSearchable={true}
                                                    selectclassNamePrefix="selectReact__value-container"
                                                    spanClass=""
                                                    spanError=""
                                                />
                                            </div>
                                        </li>
                                        <li>
                                            <div style={{ minWidth: "90px" }}>
                                                <Select
                                                    divClass=""
                                                    selectplaceholder="Seleccione"
                                                    selectValue={
                                                        this.state.filterActive
                                                    }
                                                    selectOnchange={
                                                        this.handleFilterActive
                                                    }
                                                    selectoptions={
                                                        this.state
                                                            .dataSelectActive
                                                    }
                                                    selectIsSearchable={true}
                                                    selectclassNamePrefix="selectReact__value-container"
                                                    spanClass=""
                                                    spanError=""
                                                />
                                            </div>
                                        </li>
                                        <li>
                                            <ValidarPermiso
                                                IdModuloPermisoValidar={ModuloPermiso.ProyectoDeLey.Nuevo}
                                                DefaultTemplate=
                                                    {
                                                        <a
                                                        href="#/proyecto-ley-crear"
                                                        className="btn btn-primary"
                                                        >
                                                        <i className="fa fa-plus"></i>{" "}
                                                        Nuevo registro
                                                        </a>
                                                    }
                                            />
                                        </li>
                                    </ul>
                                </div>
                                <div className="panel-body">
                                    <div>
                                        <ValidarPermiso
                                            IdModuloPermisoValidar={ModuloPermiso.ProyectoDeLey.ObtenerTodos}
                                            DefaultTemplate=
                                                {
                                                    <TableReactExtends
                                                        columns={
                                                            this.state.tableInfo["columns"]
                                                        }
                                                        data={this.state.tableInfo["data"]}
                                                        hiddenColumns={
                                                            this.state.tableInfo[
                                                                "hiddenColumns"
                                                                ]
                                                        }
                                                        handler={this.tableHandler}
                                                        pageExtends={
                                                            this.state.tableInfo["page"]
                                                        }
                                                        totalRows={
                                                            this.state.tableInfo[
                                                                "totalRows"
                                                                ]
                                                        }
                                                        search={
                                                            this.state.tableInfo["search"]
                                                        }
                                                    />
                                                }
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default ProyectoLeys;
