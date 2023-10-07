import React, { Component } from "react";
import TableReactExtends from "../../../Components/TableReactExtends";
import SecretariosDataService from "../../../Services/Catalogo/Secretarios.Service";
import Spinner from "../../../Components/Spinner";
import Select from "../../../Components/Select";
import AuthLogin from "../../../Utils/AuthLogin";
import ValidarPermiso from "../../../Permisos/ValidarPermiso";
import { ModuloPermiso } from "../../../Permisos/ModuloPermiso";

const auth = new AuthLogin();

class Secretarios extends Component {
    constructor(props) {
        super(props);
        this.tableHandler = this.tableHandler.bind(this);
        this.state = {
            tableInfo: {
                columns: [
                    {
                        Header: "Secretarios",
                        columns: [
                            {
                                Header: "id",
                                accessor: "id",
                            },
                            {
                                Header: "Nombre",
                                accessor: "nombre",
                            },
                            {
                                Header: "Activo",
                                id: "activo",
                                accessor: "activo",
                                Cell: (tableProps) => {
                                    return (
                                        <input
                                            type="checkbox"
                                            className="checkbox"
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
                            auth.tieneModuloPermiso(ModuloPermiso.Secretario.Obtener) ?
                            {
                                Header: "Editar",
                                id: "editar",
                                accessor: (str) => "editar",
                                Cell: (tableProps) => (
                                    <ValidarPermiso
                                        IdModuloPermisoValidar={ModuloPermiso.Secretario.Obtener}
                                        DefaultTemplate={
                                            <a
                                                href={`#/secretarios-editar/${tableProps.row.values.id}`}
                                                className="btn btn-info"
                                                style={{ width: "100%" }}
                                            >
                                                <i className="fa fa-edit"></i> Editar
                                            </a>
                                        }
                                    />
                                ),
                            }: {
                                Header: 'Editar',
                                id: 'editar',
                                accessor: (str) => '-',
                            },
                            auth.tieneModuloPermiso(ModuloPermiso.Secretario.Eliminar) ?
                            {
                                Header: "Activar/Desactivar",
                                id: "actdesc",
                                accessor: (str) => "actdesc",
                                Cell: (tableProps) => (
                                    <ValidarPermiso
                                        IdModuloPermisoValidar={ModuloPermiso.Secretario.Eliminar}
                                        DefaultTemplate={
                                            <button
                                                data-toggle="modal"
                                                data-target="#message-box-danger"
                                                className={`btn ${tableProps.row.values.activo === 1
                                                    ? "btn-danger"
                                                    : "btn-warning"} eliminar`}
                                                style={{ width: "100%" }}
                                                data-id={tableProps.row.values.id}
                                                onClick={() => { this.handlerDesactivar(tableProps.row.values); }}
                                            >
                                                <i className="fa fa-eraser"></i>{" "}
                                                {tableProps.row.values.activo === 1
                                                    ? "Desactivar"
                                                    : "Activar"}
                                            </button>
                                        }
                                    />
                                ),
                            }: {
                                Header: "Activar/Desactivar",
                                id: "actdesc",
                                accessor: (str) => "-",
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
            loading: true,
            filterActive: { value: 1, label: "Activo" },
            // filterCorporacion: {value: -1, label: "Seleccione tipo de corporación"},
            // filterCuatrienio: {value: -1, label: "Seleccione cuatrienio"},
            // filterPartido: {value: -1, label: "Seleccione partido"},
            dataSelectActive: [
                { value: -1, label: "Filtrar por activo" },
                { value: 1, label: "Activo" },
                { value: 0, label: "Inactivo" },
            ],
            // dataSelectCorporacion: [],
            // dataSelectCuatrienio: [],
            // dataSelectPartido: [],
            desactivarSecretario: { id: 0, nombre: "", enabled: true }
        }
    }

    async tableHandler(page, rows, search) {
        let tableInfo = this.state.tableInfo;
        tableInfo.page = page;
        tableInfo.rows = rows;
        tableInfo.search = search;
        this.setState({ tableInfo: tableInfo });
        if (this.timeout) clearTimeout(this.timeout);
        this.timeout = setTimeout(
            async function () {
                await this.getAll(
                    this.state.filterActive.value,
                    // this.state.filterCorporacion.value,
                    // this.state.filterCuatrienio.value,
                    // this.state.filterPartido.value,
                    page,
                    rows,
                    search
                );
            }.bind(this),
            1000
        );
    }
    handlerDesactivar = (secretario) => {
        let desObj = { id: secretario.id, nombre: secretario.nombre, enabled: secretario.activo }
        this.setState({
            desactivarSecretario: desObj
        })
    }
    handleFilterActive = async (selectActive) => {
        this.setState({ filterActive: selectActive });
        await this.getAll(
            selectActive.value,
            // this.state.filterCorporacion.value,
            // this.state.filterCuatrienio.value,
            // this.state.filterPartido.value,
            this.state.tableInfo.page,
            this.state.tableInfo.rows,
            this.state.tableInfo.search
        );
    };
    handlerFilterCorporacion = async (selectCorporacion) => {
        this.setState({ filterCorporacion: selectCorporacion });
        await this.getAll(
            this.state.filterActive.value,
            selectCorporacion.value,
            this.state.filterCuatrienio.value,
            this.state.filterPartido.value,
            this.state.tableInfo.page,
            this.state.tableInfo.rows,
            this.state.tableInfo.search
        );
    }
    handlerFilterCuatrienio = async (selectCuatrienio) => {
        this.setState({ filterCuatrienio: selectCuatrienio });
        await this.getAll(
            this.state.filterActive.value,
            this.state.filterCorporacion.value,
            selectCuatrienio.value,
            this.state.filterPartido.value,
            this.state.tableInfo.page,
            this.state.tableInfo.rows,
            this.state.tableInfo.search
        );
    }
    handlerPartido = async (selectPartido) => {
        this.setState({ filterPartido: selectPartido });
        await this.getAll(
            this.state.filterActive.value,
            this.state.filterCorporacion.value,
            this.state.filterCuatrienio.value,
            selectPartido.value,
            this.state.tableInfo.page,
            this.state.tableInfo.rows,
            this.state.tableInfo.search
        );
    }
    async componentDidMount() {
        this.getAll(
            this.state.filterActive.value,
            // this.state.filterCorporacion.value,
            // this.state.filterCuatrienio.value,
            // this.state.filterPartido.value,
            this.state.tableInfo.page,
            this.state.tableInfo.rows,
            this.state.tableInfo.search
        );
        // this.getComboCorporacion();
        // this.getComboCuatrienio();
        // this.getComboPartido();
    }

    getComboCorporacion = async () => {
        await SecretariosDataService.getComboCorporacion().then(response => {
            let combo = [];
            response.data.forEach(i => {
                combo.push({ value: i.id, label: i.nombre })
            })
            combo.unshift({ value: -1, label: "Filtrar por tipo de corporación" })
            this.setState({
                dataSelectCorporacion: combo
            })
        })
    }
    getComboCuatrienio = async () => {
        await SecretariosDataService.getComboCuatrienio().then(response => {
            let combo = [];
            response.data.forEach(i => {
                combo.push({ value: i.id, label: i.nombre })
            })
            combo.unshift({ value: -1, label: "Filtrar por cuatrienio" })
            this.setState({
                dataSelectCuatrienio: combo
            })
        })
    }
    getComboPartido = async () => {
        await SecretariosDataService.getComboPartido().then(response => {
            let combo = [];
            response.data.forEach(i => {
                combo.push({ value: i.id, label: i.nombre })
            })
            combo.unshift({ value: -1, label: "Filtrar por partido" })
            this.setState({
                dataSelectPartido: combo
            })
        })
    }
    deleteSubmit = async (e) => {
        e.preventDefault();
        this.setState({ loading: true });

        let responseData;
        await SecretariosDataService.delete(this.state.desactivarSecretario.id)
            .then((response) => {
                responseData = response.data;
            })
            .catch(function (error) {
                console.error(error)
            });

        this.setState({ loading: false });
        if (responseData != null) {
            await this.getAll(
                this.state.filterActive.value,
                // this.state.filterCorporacion.value,
                // this.state.filterCuatrienio.value,
                // this.state.filterPartido.value,
                this.state.tableInfo.page,
                this.state.tableInfo.rows,
                this.state.tableInfo.search
            );
        }
        document.querySelector(`#message-box-danger button[data-dismiss="modal"]`).click(); // Accionamos el click del cancelar para cerrar
    };

    getAll = async (idFilterActive,
        // Corporacion,
        //  cuatrienio, 
        //  partido, 
        page,
        rows, search) => {
        this.setState({ loading: true });
        let tableInfo = this.state.tableInfo;
        await SecretariosDataService.getAll(
            idFilterActive,
            // Corporacion, cuatrienio, partido,
            search,
            page,
            rows
        )
            .then((response) => {
                tableInfo.data = response.data;
            })
            .catch((e) => {
                console.error(e);
            });

        await SecretariosDataService.getTotalRecords(
            idFilterActive,
            // Corporacion, cuatrienio, partido, 
            search)
            .then((response) => {
                tableInfo.totalRows = response.data;
            })
            .catch((e) => {
                console.error(e);
            });

        this.setState({
            tableInfo: tableInfo,
            loading: false,
        });
    };

    render() {
        return (
            <div>
                <Spinner show={this.state.loading} />

                <ul className="breadcrumb push-down-0">
                    <li>Catálogos</li>
                    <li>Secretarios</li>
                </ul>
                <div className="content-frame">
                    <div className="content-frame-top">
                        <div className="rowListado">
                            <div className="panel panel-default ">
                                <div className="panel-heading">
                                    <h3 className="panel-title">
                                        <span className="fa fa-users"></span>{" "}
                                        Listado de secretarios
                                    </h3>
                                    <ul className="panel-controls">
                                        <li>
                                            <div style={{ minWidth: "150px" }}>
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
                                                    selectIsSearchable={false}
                                                    selectclassNamePrefix="selectReact__value-container"
                                                    spanClass=""
                                                    spanError=""
                                                ></Select>
                                            </div>
                                        </li>
                                        {/* <li>
                                            <div style={{ minWidth: "250px" }}>
                                                <Select
                                                    divClass=""
                                                    selectplaceholder="Seleccione"
                                                    selectValue={
                                                        this.state.filterCorporacion
                                                    }
                                                    selectOnchange={
                                                        this.handlerFilterCorporacion
                                                    }
                                                    selectoptions={
                                                        this.state.dataSelectCorporacion
                                                    }
                                                    selectIsSearchable={false}
                                                    selectclassNamePrefix="selectReact__value-container"
                                                    spanClass=""
                                                    spanError=""
                                                ></Select>
                                            </div>
                                        </li>
                                        <li>
                                            <div style={{ minWidth: "190px" }}>
                                                <Select
                                                    divClass=""
                                                    selectplaceholder="Seleccione"
                                                    selectValue={
                                                        this.state.filterCuatrienio
                                                    }
                                                    selectOnchange={
                                                        this.handlerFilterCuatrienio
                                                    }
                                                    selectoptions={
                                                        this.state.dataSelectCuatrienio
                                                    }
                                                    selectIsSearchable={false}
                                                    selectclassNamePrefix="selectReact__value-container"
                                                    spanClass=""
                                                    spanError=""
                                                ></Select>
                                            </div>
                                        </li>
                                        <li>
                                            <div style={{ minWidth: "150px" }}>
                                                <Select
                                                    divClass=""
                                                    selectplaceholder="Seleccione"
                                                    selectValue={
                                                        this.state.filterPartido
                                                    }
                                                    selectOnchange={
                                                        this.handlerPartido
                                                    }
                                                    selectoptions={
                                                        this.state.dataSelectPartido
                                                    }
                                                    selectIsSearchable={false}
                                                    selectclassNamePrefix="selectReact__value-container"
                                                    spanClass=""
                                                    spanError=""
                                                ></Select>
                                            </div>
                                        </li> */}
                                        <li>
                                        <ValidarPermiso
                                            IdModuloPermisoValidar={ModuloPermiso.Secretario.Nuevo}
                                            DefaultTemplate={
                                                <a
                                                    href={"#/secretarios-crear"}
                                                    style={{ minHeight: "37px" }}
                                                    className="btn btn-primary"
                                                >
                                                    <i className="fa fa-plus"></i> Nuevo registro
                                                </a>
                                            }
                                        />
                                        </li>
                                    </ul>
                                </div>
                                <div className="panel-body">
                                    <div>
                                    <ValidarPermiso
                                            IdModuloPermisoValidar={ModuloPermiso.Secretario.ObtenerTodos}
                                            DefaultTemplate={
                                                <TableReactExtends
                                                    columns={this.state.tableInfo.columns}
                                                    data={this.state.tableInfo.data}
                                                    hiddenColumns={this.state.tableInfo.hiddenColumns}
                                                    handler={this.tableHandler}
                                                    pageExtends={this.state.tableInfo.page}
                                                    totalRows={this.state.tableInfo.totalRows}
                                                    search={this.state.tableInfo.search}
                                                />
                                            }
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={`message-box message-box-${this.state.desactivarSecretario.enabled ? "danger" : "info"} animated fadeIn`} id="message-box-danger">
                    <form action="">
                        <div className="mb-container">
                            <div className="mb-middle">
                                <div className="mb-title"><span className={`fa fa-${this.state.desactivarSecretario.enabled ? "eraser" : "check"}`}></span> {this.state.desactivarSecretario.enabled ? "Desactivar" : "Activar"} secretario</div>
                                <div className="mb-content">
                                    <p>{`¿Está seguro que desea ${this.state.desactivarSecretario.enabled ? "desactivar" : "activar"} al secretario ${this.state.desactivarSecretario.nombre}? Puede volver a ${this.state.desactivarSecretario.enabled ? "activarla" : "desactivarla"} en cualquier otro momento.`}</p>
                                </div>
                                <div className="mb-footer">
                                    <ValidarPermiso
                                            IdModuloPermisoValidar={ModuloPermiso.Secretario.Eliminar}
                                            DefaultTemplate={
                                                <button type="button" className="btn btn-primary btn-lg pull-right" onClick={(e) => { this.deleteSubmit(e) }} >{this.state.desactivarSecretario.enabled ? "Desactivar" : "Activar"}</button>
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
        )
    }
}

export default Secretarios;