import React, { Component } from "react";
import TableReactExtends from "../../../Components/TableReactExtends";
import PersonaDataService from "../../../Services/Persona/Persona.Service";
import Spinner from "../../../Components/Spinner";
import Select from "../../../Components/Select";
import ValidForm from "../../../Utils/ValidForm";
import AuthLogin from "../../../Utils/AuthLogin";
import ValidarPermiso from "../../../Permisos/ValidarPermiso";
import { ModuloPermiso } from "../../../Permisos/ModuloPermiso";
import UtilsService from "../../../Services/General/Utils.Service";

const auth = new AuthLogin();
const validForm = new ValidForm();
const fieldsConst = {
    id: 0,
    nombres: '',
    apellidos: '',
    fechaNacimiento: new Date(),
    municipio_id_nacimiento: '',
    grado_estudios: '',
    partido_id: '',
    genero_id: '',
    fecha_fallecimiento: '',
    activo: 1,
    user: auth.username(),
};
const errorsConst = {
    id: '',
    nombres: '',
    apellidos: '',
    fechaNacimiento: '',
    municipio_id_nacimiento: '',
    grado_estudios: '',
    partido_id: '',
    genero_id: '',
    fecha_fallecimiento: '',
    activo: '',
    user: '',
};

const default_item_select_lugar_nacimiento = { value: "", label: "Seleccione circuito" };
const default_item_select_partido = { value: "", label: "Seleccione un partido" };
const default_item_select_genero = { value: "", label: "Seleccione un género" };
const default_item_select_grado_estudio = { value: "", label: "Seleccione un grado de estudio" };

class Personas extends Component {
    constructor(props) {
        super(props);
        this.tableHandler = this.tableHandler.bind(this);
        this.state = {
            tableInfo: {
                columns: [
                    {
                        Header: "Personas",
                        columns: [
                            {
                                Header: "id",
                                accessor: "id",
                            },
                            {
                                Header: "Nombres",
                                accessor: "nombres",
                            },
                            {
                                Header: "Apellidos",
                                accessor: "apellidos",
                            },
                            // {
                            //     Header: "Fecha nacimiento",
                            //     accessor: "fechaNacimiento",
                            // },
                            {
                                Header: "Nació en",
                                accessor: "lugar_nacimiento.nombre",
                            },
                            {
                                Header: "Suplente",
                                accessor: "nombreSuplente",
                            },
                            {
                                Header: "Partido",
                                accessor: "partido.nombre",
                            },
                            {
                                Header: "Genero",
                                accessor: "genero.nombre",
                            },
                            // {
                            //     Header: "Grado de estudio",
                            //     accessor: "grado_estudio.nombre",
                            // },
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
                        ],
                    },
                    {
                        Header: "Acciones",
                        columns: [
                            {
                                Header: "Editar",
                                id: "editar",
                                accessor: (str) => "editar",
                                Cell: (tableProps) => (
                                    <ValidarPermiso
                                        IdModuloPermisoValidar={ModuloPermiso.Persona.Obtener}
                                        DefaultTemplate=
                                            {
                                                <a
                                                    href={`#/persona-editar/${tableProps.row.values.id}`}
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
                                        IdModuloPermisoValidar={ModuloPermiso.Persona.Eliminar}
                                        DefaultTemplate=
                                            {
                                                <button
                                                    data-toggle="modal"
                                                    data-target="#message-box-danger"
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
                        ],
                    },
                ],
                hiddenColumns: ["id", "activo"],
                data: [],
                page: 1,
                rows: 5,
                search: "",
                totalRows: 0,
            },
            fields: Object.assign({}, fieldsConst),
            errors: Object.assign({}, errorsConst),
            loading: true,
            filterActive: { value: 1, label: "Activo" },
            dataSelectActive: [
                { value: '', label: "Filtrar por activo" },
                { value: 1, label: "Activo" },
                { value: 0, label: "Inactivo" },
            ],
            data_select_lugar_nacimiento: [],
            item_select_lugar_nacimiento: Object.assign({}, default_item_select_lugar_nacimiento),

            data_select_partido: [],
            item_select_partido: Object.assign({}, default_item_select_partido),

            data_select_genero: [],
            item_select_genero: Object.assign({}, default_item_select_genero),

            data_select_grado_estudio: [],
            item_select_grado_estudio: Object.assign({}, default_item_select_grado_estudio)
        };
    }


    async componentDidMount() {
        await this.getAll(
            this.state.item_select_lugar_nacimiento.value,
            this.state.item_select_partido.value,
            this.state.item_select_grado_estudio.value,
            this.state.item_select_genero.value,
            this.state.filterActive.value,
            this.state.tableInfo["page"],
            this.state.tableInfo["rows"],
            this.state.tableInfo["search"]
        );
        await this.getComboLugarNacimiento();
        await this.getComboPartido();
        await this.getComboGenero();
        await this.getComboGradoEstudio();
    }

    getComboLugarNacimiento = async () => {
        this.setState({ loading: true });
        await UtilsService.getComboMunicipioFilter({
            activo: 1
        }).then((response) => {
            let combo = [];
            let selected = Object.assign({}, default_item_select_lugar_nacimiento);
            response.data.forEach((i) => {
                combo.push({ value: i.id, label: i.nombre });
            });
            combo.unshift(Object.assign({}, selected));
            this.setState({
                data_select_lugar_nacimiento: combo,
                loading: false,
            });
        });
    };

    getComboPartido = async () => {
        this.setState({ loading: true });
        await UtilsService.getComboPartido({
            activo: 1
        }).then((response) => {
            let combo = [];
            let selected = Object.assign({}, default_item_select_partido);
            response.data.forEach((i) => {
                combo.push({ value: i.id, label: i.nombre });
            });
            combo.unshift(Object.assign({}, selected));
            this.setState({
                data_select_partido: combo,
                loading: false,
            });
        });
    };

    getComboGenero = async () => {
        this.setState({ loading: true });
        await UtilsService.getComboGeneroFilter({
            activo: 1
        }).then((response) => {
            let combo = [];
            let selected = Object.assign({}, default_item_select_genero);
            response.data.forEach((i) => {
                combo.push({ value: i.id, label: i.nombre });
            });
            combo.unshift(Object.assign({}, selected));
            this.setState({
                data_select_genero: combo,
                loading: false,
            });
        });
    };

    getComboGradoEstudio = async () => {
        this.setState({ loading: true });
        await UtilsService.getComboGradoEstudioFilter({
            activo: 1
        }).then((response) => {
            let combo = [];
            let selected = Object.assign({}, default_item_select_grado_estudio);
            response.data.forEach((i) => {
                combo.push({ value: i.id, label: i.nombre });
            });
            combo.unshift(Object.assign({}, selected));
            this.setState({
                data_select_grado_estudio: combo,
                loading: false,
            });
        });
    };

    handlerDesactivar = (item) => {
        let desActObj = {
            id: item.id,
            nombres: item.nombres + ' ' + item.apellidos,
            activo: item.activo,
        };
        this.setState({
            fields: desActObj,
        });
    };

    saveSubmit = async (e) => {
        e.preventDefault();
        let errors = this.state.errors;
        errors = validForm.cleanErrors(errors);
        this.setState({ errors: errors, loading: true });

        let responseData;
        let data = this.state.fields;

        if (this.state.fields["id"] === 0) {
            await PersonaDataService.create(data)
                .then((response) => {
                    responseData = response.data;
                })
                .catch(function (error) {
                    errors = validForm.displayErrors(
                        error.response.data,
                        errors
                    );
                });
        } else {
            await PersonaDataService.update(
                this.state.fields["id"],
                data
            )
                .then((response) => {
                    responseData = response.data;
                })
                .catch(function (error) {
                    errors = validForm.displayErrors(
                        error.response.data,
                        errors
                    );
                });
        }
        this.setState({ errors: errors, loading: false });
        if (responseData != null) {
            await this.getAll(
                this.state.filterActive.value,
                this.state.tableInfo.page,
                this.state.tableInfo.rows,
                this.state.tableInfo.search
            );
            this.refs.closemodalSave.click();
            this.resetFields();
        }
    };

    deleteSubmit = async (e) => {
        e.preventDefault();
        let errors = this.state.errors;
        errors = validForm.cleanErrors(errors);
        this.setState({ errors: errors, loading: true });

        let responseData;
        await PersonaDataService.delete(this.state.fields["id"])
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
                this.state.tableInfo.page,
                this.state.tableInfo.rows,
                this.state.tableInfo.search
            );
            document.querySelector(`#message-box-danger button[data-dismiss="modal"]`).click();
        }
    };

    getAll = async (
                        lugar_nacimiento_id,
                        partido_id,
                        grado_estudio_id,
                        genero_id,
                        idFilter,
                        page,
                        rows,
                        search
                    ) => {
        this.setState({ loading: true });
        let tableInfo = this.state.tableInfo;
        await PersonaDataService.getAll(
                lugar_nacimiento_id,
                partido_id,
                grado_estudio_id,
                genero_id,
                idFilter,
                page,
                rows,
                search
        ).then((response) => {
            tableInfo["data"] = response.data;
        })
        .catch((e) => {
            console.log(e);
        });

        await PersonaDataService.totalrecords(
            lugar_nacimiento_id,
            partido_id,
            grado_estudio_id,
            genero_id,
            idFilter,
            search
            ).then((response) => {
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

    resetFields() {
        let fields = Object.assign({}, fieldsConst);
        this.setState({
            fields: fields,
            errors: validForm.cleanErrors(this.state.errors),
        });
    }

    handleFilterActive = async (selectActive) => {
        this.setState({ filterActive: selectActive });
        await this.getAll(
            this.state.item_select_lugar_nacimiento.value,
            this.state.item_select_partido.value,
            this.state.item_select_grado_estudio.value,
            this.state.item_select_genero.value,
            selectActive.value,
            this.state.tableInfo.page,
            this.state.tableInfo.rows,
            this.state.tableInfo.search
        );
    };

    handlerSelectGenero = async (select) => {
        this.setState({
            item_select_genero: select,
        }, async ()=>{
            await this.getAll(
                this.state.item_select_lugar_nacimiento.value,
                this.state.item_select_partido.value,
                this.state.item_select_grado_estudio.value,
                select.value,
                this.state.filterActive.value,
                this.state.tableInfo.page,
                this.state.tableInfo.rows,
                this.state.tableInfo.search
            );
        });
    };
    handlerSelectLugarNacimiento = async (select) => {
        this.setState({
            item_select_lugar_nacimiento: select,
        }, async() =>{
            await this.getAll(
                select.value,
                this.state.item_select_partido.value,
                this.state.item_select_grado_estudio.value,
                this.state.item_select_genero.value,
                this.state.filterActive.value,
                this.state.tableInfo.page,
                this.state.tableInfo.rows,
                this.state.tableInfo.search
            );
        });
    };
    handlerSelectPartido = async (select) => {
        this.setState({
            item_select_partido: select,
        }, async()=>{
            await this.getAll(
                this.state.item_select_lugar_nacimiento.value,
                select.value,
                this.state.item_select_grado_estudio.value,
                this.state.item_select_genero.value,
                this.state.filterActive.value,
                this.state.tableInfo.page,
                this.state.tableInfo.rows,
                this.state.tableInfo.search
            );
        });
    };
    handlerSelectGradoEstudio = async (select) => {
        this.setState({
            item_select_grado_estudio: select,
        }, async()=>{
            await this.getAll(
                this.state.item_select_lugar_nacimiento.value,
                this.state.item_select_partido.value,
                select.value,
                this.state.item_select_genero.value,
                this.state.filterActive.value,
                this.state.tableInfo.page,
                this.state.tableInfo.rows,
                this.state.tableInfo.search
            );
        });
    };

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
                    this.state.item_select_lugar_nacimiento.value,
                    this.state.item_select_partido.value,
                    this.state.item_select_grado_estudio.value,
                    this.state.item_select_genero.value,
                    this.state.filterActive.value,
                    page,
                    rows,
                    search
                );
            }.bind(this),
            delayAccion
        );
    }

    render() {
        return (
            <div>
                <Spinner show={this.state.loading} />

                <ul className="breadcrumb push-down-0">
                    <li>Catálogos</li>
                    <li>Diputados / Autores</li>
                </ul>
                <div className="content-frame">
                    <div className="content-frame-top">
                        <div className="rowListado">
                            <div className="panel panel-default ">
                                <div className="panel-heading">
                                    <h3 className="panel-title">
                                        <span className="fas fa-users"/>{" "}
                                        Listado de diputados / autores
                                    </h3>
                                    <ul className="panel-controls">
                                        <li>
                                            <div style={{ minWidth: "190px" }}>
                                                <Select
                                                    divClass=""
                                                    selectplaceholder="Seleccione"
                                                    selectValue={ this.state.item_select_lugar_nacimiento }
                                                    selectOnchange={ this.handlerSelectLugarNacimiento }
                                                    selectoptions={ this.state.data_select_lugar_nacimiento }
                                                    selectIsSearchable={true}
                                                    selectclassNamePrefix="selectReact__value-container"
                                                    spanClass=""
                                                    spanError=""
                                                />
                                            </div>
                                        </li>
                                        <li>
                                            <div style={{ minWidth: "190px" }}>
                                                <Select
                                                    divClass=""
                                                    selectplaceholder="Seleccione"
                                                    selectValue={ this.state.item_select_partido }
                                                    selectOnchange={ this.handlerSelectPartido }
                                                    selectoptions={ this.state.data_select_partido }
                                                    selectIsSearchable={true}
                                                    selectclassNamePrefix="selectReact__value-container"
                                                    spanClass=""
                                                    spanError=""
                                                />
                                            </div>
                                        </li>
                                        {/* <li>
                                            <div style={{ minWidth: "190px" }}>
                                                <Select
                                                    divClass=""
                                                    selectplaceholder="Seleccione"
                                                    selectValue={ this.state.item_select_grado_estudio }
                                                    selectOnchange={ this.handlerSelectGradoEstudio }
                                                    selectoptions={ this.state.data_select_grado_estudio }
                                                    selectIsSearchable={true}
                                                    selectclassNamePrefix="selectReact__value-container"
                                                    spanClass=""
                                                    spanError=""
                                                />
                                            </div>
                                        </li> */}
                                        <li>
                                            <div style={{ minWidth: "165px" }}>
                                                <Select
                                                    divClass=""
                                                    selectplaceholder="Seleccione"
                                                    selectValue={ this.state.item_select_genero }
                                                    selectOnchange={ this.handlerSelectGenero }
                                                    selectoptions={ this.state.data_select_genero }
                                                    selectIsSearchable={true}
                                                    selectclassNamePrefix="selectReact__value-container"
                                                    spanClass=""
                                                    spanError=""
                                                />
                                            </div>
                                        </li>
                                        <li>
                                            <div style={{ minWidth: "120px" }}>
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
                                                IdModuloPermisoValidar={ModuloPermiso.Persona.Nuevo}
                                                DefaultTemplate=
                                                    {
                                                        <a
                                                            href="#/persona-crear"
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
                                            IdModuloPermisoValidar={ModuloPermiso.Persona.ObtenerTodos}
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

                <div className={`message-box message-box-${this.state.fields.activo ? "danger" : "info"} animated fadeIn`} id="message-box-danger">
                    <form action="">
                        <div className="mb-container">
                            <div className="mb-middle">
                                <div className="mb-title"><span className={`fa fa-${this.state.fields.activo ? "eraser" : "check"}`}></span> {this.state.fields.activo ? "Desactivar" : "Activar"} diputado / autor</div>
                                <div className="mb-content">
                                    <p>{`¿Está seguro que desea ${this.state.fields.activo ? "desactivar" : "activar"} el diputado / autor ${this.state.fields.nombres}? Puede volver a ${this.state.fields.activo ? "activarla" : "desactivarla"} en cualquier otro momento.`}</p>
                                </div>
                                <div className="mb-footer">
                                    <ValidarPermiso
                                        IdModuloPermisoValidar={ModuloPermiso.Persona.Eliminar}
                                        DefaultTemplate=
                                            {
                                                <button type="button" className="btn btn-primary btn-lg pull-right" onClick={(e) => { this.deleteSubmit(e) }} >{this.state.fields.activo ? "Desactivar" : "Activar"}</button>
                                            }
                                    />
                                    &nbsp;
                                    <button className="btn btn-default btn-lg pull-right" type="button" data-dismiss="modal">Cancelar</button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>

            </div>
        );
    }
}

export default Personas;
