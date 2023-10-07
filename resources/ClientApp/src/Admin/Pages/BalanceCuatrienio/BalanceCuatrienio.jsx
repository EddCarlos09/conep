import React, { Component } from "react";
import TableReactExtends from "../../../Components/TableReactExtends";
import BalanceCuatrienioDataService from "../../../Services/ContenidoMultimedia/BalanceCuatrienio.Service";
import Spinner from "../../../Components/Spinner";
import Select from "../../../Components/Select";
import AuthLogin from "../../../Utils/AuthLogin";
import { ModuloPermiso } from "../../../Permisos/ModuloPermiso";
import ValidarPermiso from "../../../Permisos/ValidarPermiso";

const auth = new AuthLogin();

class BalanceCuatrienio extends Component {
    constructor(props){
        super(props);
        this.tableHandler = this.tableHandler.bind(this);
        this.state = {
            tableInfo: {
                columns: [
                    {
                        Header: "Balances de cuatrienio",
                        columns: [
                            {
                                Header: "id",
                                accessor: "id",
                            },
                            {
                                Header: "Título",
                                accessor: "titulo"
                            },
                            {
                                Header: "Año de inicio",
                                accessor: "yearInicio",
                                className: "text-center"
                            },
                            {
                                Header: "Año de finalización",
                                accessor: "yearFin",
                                className: "text-center"
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
                            }
                        ],
                    },
                    {
                        Header: "Acciones",
                        columns: [
                            auth.tieneModuloPermiso(ModuloPermiso.BalanceCuatrienio.Obtener) ?
                            {
                                Header: "Informes",
                                id: "informes",
                                accessor: (str) => "informes",
                                Cell: (tableProps) => (
                                    <ValidarPermiso IdModuloPermisoValidar={ModuloPermiso.BalanceCuatrienio.Obtener} DefaultTemplate={
                                    <a
                                        href={`#/balances-cuatrienio-informes/${tableProps.row.values.id}`}
                                        className="btn btn-info"
                                        style={{ width: "100%" }}
                                    >
                                        <i className="fa fa-file-alt"></i> Informes
                                    </a>
                                    } />
                                ),
                            }: {
                                Header: "Informes",
                                id: "informes",
                                accessor: (str) => '-',
                            },
                            auth.tieneModuloPermiso(ModuloPermiso.BalanceCuatrienio.Obtener) ?
                            {
                                Header: "Editar",
                                id: "editar",
                                accessor: (str) => "editar",
                                Cell: (tableProps) => (
                                    <ValidarPermiso IdModuloPermisoValidar={ModuloPermiso.BalanceCuatrienio.Obtener} DefaultTemplate={
                                        <a
                                            href={`#/balances-cuatrienio-editar/${tableProps.row.values.id}`}
                                            className="btn btn-info"
                                            style={{ width: "100%" }}
                                        >
                                            <i className="fa fa-edit"></i> Editar
                                        </a>
                                    } />
                                ),
                            }: {
                                Header: 'Editar',
                                id: 'editar',
                                accessor: (str) => '-',
                            },
                            auth.tieneModuloPermiso(ModuloPermiso.BalanceCuatrienio.Eliminar) ?
                            {
                                Header: "Activar/Desactivar",
                                id: "actdesc",
                                accessor: (str) => "actdesc",
                                Cell: (tableProps) => (
                                    <ValidarPermiso IdModuloPermisoValidar={ModuloPermiso.BalanceCuatrienio.Eliminar} DefaultTemplate={
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
                                    } />
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
            filterYearInicio: {value: -1, label: "Filtrar por año de inicio"},
            dataSelectActive: [
                { value: -1, label: "Filtrar por activo" },
                { value: 1, label: "Activo" },
                { value: 0, label: "Inactivo" },
            ],
            dataSelectYearInicio: [],
            desactivarBalanceCuatrienio: { id: 0, titulo: "", enabled: true }
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
                    this.state.filterYearInicio.value,
                    page,
                    rows,
                    search
                );
            }.bind(this),
            1000
        );
    }
    handlerDesactivar = (balanceCuatrienio) => {
        let desObj = { id: balanceCuatrienio.id, titulo: balanceCuatrienio.titulo, enabled: balanceCuatrienio.activo }
        this.setState({
            desactivarBalanceCuatrienio: desObj
        })
    }
    handleFilterActive = async (selectActive) => {
        this.setState({ filterActive: selectActive });
        await this.getAll(
            selectActive.value,
            this.state.filterYearInicio.value,
            this.state.tableInfo.page,
            this.state.tableInfo.rows,
            this.state.tableInfo.search
        );
    };
    handlerFilterYearInicio = async (selectYearInicio) => {
        this.setState({filterYearInicio: selectYearInicio});
        await this.getAll(
            this.state.filterActive.value,
            selectYearInicio.value,
            this.state.tableInfo.page,
            this.state.tableInfo.rows,
            this.state.tableInfo.search
        );
    }
    async componentDidMount() {
        this.getAll(
            this.state.filterActive.value,
            this.state.filterYearInicio.value,
            this.state.tableInfo.page,
            this.state.tableInfo.rows,
            this.state.tableInfo.search
        );
        this.getComboYearInicio();
    }
    
    getComboYearInicio = async () => {
        await BalanceCuatrienioDataService.getComboBalanceCuatrienioYearInicio().then(response => {
            let combo = [];
            response.data.forEach(i => {
                combo.push({ value: i.id, label: i.yearInicio })
            })
            combo.unshift({ value: -1, label: "Filtrar por año de inicio" })
            this.setState({
                dataSelectYearInicio: combo
            })
        })
    }
    deleteSubmit = async (e) => {
        e.preventDefault();
        this.setState({loading: true });

        let responseData;
        await BalanceCuatrienioDataService.delete(this.state.desactivarBalanceCuatrienio.id)
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
                this.state.filterYearInicio.value,
                this.state.tableInfo.page,
                this.state.tableInfo.rows,
                this.state.tableInfo.search
            );
        }
        document.querySelector(`#message-box-danger button[data-dismiss="modal"]`).click(); // Accionamos el click del cancelar para cerrar
    };

    getAll = async (idFilterActive, yearInicio, page, rows, search) => {
        this.setState({ loading: true });
        let tableInfo = this.state.tableInfo;
        await BalanceCuatrienioDataService.getAll(
            idFilterActive,
            yearInicio,
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

        await BalanceCuatrienioDataService.getTotalRecords(idFilterActive, yearInicio, search)
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

    render(){
        return (
            <div>
                <Spinner show={this.state.loading} />

                <ul className="breadcrumb push-down-0">
                    <li>Contenido multimedia</li>
                    <li>Balance de cuatrienio</li>
                </ul>
                <div className="content-frame">
                    <div className="content-frame-top">
                        <div className="rowListado">
                            <div className="panel panel-default ">
                                <div className="panel-heading">
                                    <h3 className="panel-title">
                                        <span className="fa fa-file-alt"></span>{" "}
                                        Listado de balances de cuatrienio
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
                                        <li>
                                            <div style={{ minWidth: "250px" }}>
                                                <Select
                                                    divClass=""
                                                    selectplaceholder="Seleccione"
                                                    selectValue={
                                                        this.state.filterYearInicio
                                                    }
                                                    selectOnchange={
                                                        this.handlerFilterYearInicio
                                                    }
                                                    selectoptions={
                                                        this.state.dataSelectYearInicio
                                                    }
                                                    selectIsSearchable={false}
                                                    selectclassNamePrefix="selectReact__value-container"
                                                    spanClass=""
                                                    spanError=""
                                                ></Select>
                                            </div>
                                        </li>
                                        <li>
                                            <ValidarPermiso IdModuloPermisoValidar={ModuloPermiso.BalanceCuatrienio.Nuevo} DefaultTemplate={
                                            <a
                                            href={"#/balances-cuatrienio-crear"}
                                            style={{ minHeight: "37px" }}
                                            className="btn btn-primary"
                                            >
                                                <i className="fa fa-plus"></i> Nuevo registro
                                            </a>
                                            } />
                                        </li>
                                    </ul>
                                </div>
                                <div className="panel-body">
                                    <div>
                                        <ValidarPermiso IdModuloPermisoValidar={ModuloPermiso.BalanceCuatrienio.ObtenerTodos} DefaultTemplate={
                                            <TableReactExtends
                                                columns={this.state.tableInfo.columns}
                                                data={this.state.tableInfo.data}
                                                hiddenColumns={this.state.tableInfo.hiddenColumns}
                                                handler={this.tableHandler}
                                                pageExtends={this.state.tableInfo.page}
                                                totalRows={this.state.tableInfo.totalRows}
                                                search={this.state.tableInfo.search}
                                            />
                                        } />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={`message-box message-box-${this.state.desactivarBalanceCuatrienio.enabled ? "danger" : "info"} animated fadeIn`} id="message-box-danger">
                        <form action="">
                            <div className="mb-container">
                                <div className="mb-middle">
                                    <div className="mb-title"><span className={`fa fa-${this.state.desactivarBalanceCuatrienio.enabled ? "eraser" : "check"}`}></span> {this.state.desactivarBalanceCuatrienio.enabled ? "Desactivar" : "Activar"} balance de cuatrienio</div>
                                    <div className="mb-content">
                                        <p>{`¿Está seguro que desea ${this.state.desactivarBalanceCuatrienio.enabled ? "desactivar" : "activar"} el balance de cuatrienio ${this.state.desactivarBalanceCuatrienio.titulo}? Puede volver a ${this.state.desactivarBalanceCuatrienio.enabled ? "activarla" : "desactivarla"} en cualquier otro momento.`}</p>
                                    </div>
                                    <div className="mb-footer">
                                    <ValidarPermiso IdModuloPermisoValidar={ModuloPermiso.BalanceCuatrienio.Eliminar} DefaultTemplate={
                                        <button type="button" className="btn btn-primary btn-lg pull-right" onClick={(e) => { this.deleteSubmit(e) }} >{this.state.desactivarBalanceCuatrienio.enabled ? "Desactivar" : "Activar"}</button>
                                    } />
                                        
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

export default BalanceCuatrienio;