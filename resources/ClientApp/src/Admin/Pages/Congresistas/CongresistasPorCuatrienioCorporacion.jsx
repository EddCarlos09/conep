import React, { Component } from "react";
import TableReactExtends from "../../../Components/TableReactExtends";
import CongresistasDataService from "../../../Services/Catalogo/Congresistas.Service";
import Spinner from "../../../Components/Spinner";
import Select from "../../../Components/Select";
import AuthLogin from "../../../Utils/AuthLogin";
import { ModuloPermiso } from "../../../Permisos/ModuloPermiso";
import ValidarPermiso from "../../../Permisos/ValidarPermiso";

const auth = new AuthLogin();

class CongresistasPorCuatrienioCorporacion extends Component {
    constructor(props){
        super(props);
        const idCuatrienio = this.props.match.params.idCuatrienio === undefined ? 0 : this.props.match.params.idCuatrienio;
        const idCorporacion = this.props.match.params.idCorporacion === undefined ? 0 : this.props.match.params.idCorporacion;
        this.tableHandler = this.tableHandler.bind(this);
        this.state = {
            idCuatrienio: idCuatrienio,
            idCorporacion: idCorporacion,
            tableInfo: {
                columns: [
                    {
                        Header: "Congresistas",
                        columns: [
                            {
                                Header: "id",
                                accessor: "id",
                            },
                            {
                                Header: "Nombres",
                                accessor: "persona.nombres",
                            },
                            {
                                Header: "Apellidos",
                                accessor: "persona.apellidos",
                            },
                            {
                                Header: "Hoja de vida",
                                id: "urlHojaVida",
                                accessor: "urlHojaVida",
                                Cell: (tableProps) => {
                                    return (
                                        typeof tableProps.row.values !== "undefined" && tableProps.row.values.urlHojaVida !== "" && tableProps.row.values.urlHojaVida !== null ?
                                        <a className="btn btn-primary center-block" target="_blank" href={(auth.pathApi() + tableProps.row.values.urlHojaVida)}>Ver hoja</a>
                                        : <button type="button" className="btn btn-primary">Sin hoja</button>
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
                            auth.tieneModuloPermiso(ModuloPermiso.Congresistas.Obtener) ?
                            {
                                Header: "Editar",
                                id: "editar",
                                accessor: (str) => "editar",
                                Cell: (tableProps) => (
                                    <ValidarPermiso IdModuloPermisoValidar={ModuloPermiso.Congresistas.Obtener} DefaultTemplate={
                                        <a href={`#/congresistas-editar/${tableProps.row.values.id}/cuatrienio-${idCuatrienio}/corporacion-${idCorporacion}`} className="btn btn-info" style={{ width: "100%" }}>
                                            <i className="fa fa-edit"></i> Editar
                                        </a>
                                    } />
                                ),
                            } : {
                                Header: 'Editar',
                                id: 'editar',
                                accessor: (str) => '-',
                            },
                            auth.tieneModuloPermiso(ModuloPermiso.Congresistas.Eliminar) ?
                            {
                                Header: "Activar/Desactivar",
                                id: "actdesc",
                                accessor: (str) => "actdesc",
                                Cell: (tableProps) => (
                                    <ValidarPermiso IdModuloPermisoValidar={ModuloPermiso.Congresistas.Eliminar} DefaultTemplate={
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
            infoCuatrienio: {nombre: "", fechaInicio: "", fechaFin: ""},
            filterActive: { value: 1, label: "Activo" },
            filterPartido: {value: -1, label: "Seleccione partido"},
            dataSelectActive: [
                { value: -1, label: "Filtrar por activo" },
                { value: 1, label: "Activo" },
                { value: 0, label: "Inactivo" },
            ],
            dataSelectPartido: [],
            desactivarCongresista: { id: 0, nombre: "", enabled: true }
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
                    this.state.idCorporacion,
                    this.state.idCuatrienio,
                    this.state.filterPartido.value,
                    page,
                    rows,
                    search
                );
            }.bind(this),
            1000
        );
    }
    handlerDesactivar = (congresista) => {
        let desObj = { id: congresista.id, nombre: congresista.nombre, enabled: congresista.activo }
        this.setState({
            desactivarCongresista: desObj
        })
    }
    handleFilterActive = async (selectActive) => {
        this.setState({ filterActive: selectActive });
        await this.getAll(
            selectActive.value,
            this.state.idCorporacion,
            this.state.idCuatrienio,
            this.state.filterPartido.value,
            this.state.tableInfo.page,
            this.state.tableInfo.rows,
            this.state.tableInfo.search
        );
    };
    handlerPartido = async (selectPartido) => {
        this.setState({filterPartido: selectPartido});
        await this.getAll(
            this.state.filterActive.value,
            this.state.idCorporacion,
            this.state.idCuatrienio,
            selectPartido.value,
            this.state.tableInfo.page,
            this.state.tableInfo.rows,
            this.state.tableInfo.search
        );
    }
    async componentDidMount() {
        await this.getAll(
            this.state.filterActive.value,
            this.state.idCorporacion,
            this.state.idCuatrienio,
            this.state.filterPartido.value,
            this.state.tableInfo.page,
            this.state.tableInfo.rows,
            this.state.tableInfo.search
        );
        await this.getComboPartido();
        await this.getByIdCuatrienio(this.state.idCuatrienio);
    }

    getByIdCuatrienio = async (id) => {
        await CongresistasDataService.getByIdCuatrienio(id).then(response => {
           this.setState({infoCuatrienio: response.data})
        })
    }
    getComboPartido = async () => {
        await CongresistasDataService.getComboPartido().then(response => {
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
        this.setState({loading: true });

        let responseData;
        await CongresistasDataService.delete(this.state.desactivarCongresista.id)
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
                this.state.idCorporacion,
                this.state.idCuatrienio,
                this.state.filterPartido.value,
                this.state.tableInfo.page,
                this.state.tableInfo.rows,
                this.state.tableInfo.search
            );
        }
        document.querySelector(`#message-box-danger button[data-dismiss="modal"]`).click(); // Accionamos el click del cancelar para cerrar
    };

    getAll = async (idFilterActive, Corporacion, cuatrienio, partido, page, rows, search) => {
        this.setState({ loading: true });
        let tableInfo = this.state.tableInfo;
        await CongresistasDataService.getAll(
            idFilterActive,
            Corporacion, cuatrienio, partido,
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

        await CongresistasDataService.getTotalRecords(idFilterActive, Corporacion, cuatrienio, partido, search)
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
                    <li>Catálogos</li>
                    <li>Congresistas</li>
                    <li>Listado de congresistas por quinquenio</li>
                </ul>
                <div className="content-frame">
                    <div className="content-frame-top">
                        <div className="rowListado">
                            <div className="panel panel-default ">
                                <div className="panel-heading">
                                    <h3 className="panel-title">
                                        <span className="fa fa-users"></span>{" "}
                                        Listado de congresistas en quinquenio {this.state.infoCuatrienio.nombre}
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
                                        </li>
                                        <li>
                                            <ValidarPermiso IdModuloPermisoValidar={ModuloPermiso.Congresistas.Nuevo}
                                            DefaultTemplate={
                                                <a href={`#/congresistas-crear/cuatrienio-${this.state.idCuatrienio}/corporacion-${this.state.idCorporacion}`} style={{ minHeight: "37px" }} className="btn btn-primary">
                                                    <i className="fa fa-plus"></i> Nuevo registro
                                                </a>
                                            } />
                                        </li>
                                    </ul>
                                </div>
                                <div className="panel-body">
                                    <div>
                                        <ValidarPermiso IdModuloPermisoValidar={ModuloPermiso.Congresistas.ObtenerTodos} DefaultTemplate={
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

                <div className={`message-box message-box-${this.state.desactivarCongresista.enabled ? "danger" : "info"} animated fadeIn`} id="message-box-danger">
                        <form action="">
                            <div className="mb-container">
                                <div className="mb-middle">
                                    <div className="mb-title"><span className={`fa fa-${this.state.desactivarCongresista.enabled ? "eraser" : "check"}`}></span> {this.state.desactivarCongresista.enabled ? "Desactivar" : "Activar"} congresista</div>
                                    <div className="mb-content">
                                        <p>{`¿Está seguro que desea ${this.state.desactivarCongresista.enabled ? "desactivar" : "activar"} al congresista ${this.state.desactivarCongresista.nombre}? Puede volver a ${this.state.desactivarCongresista.enabled ? "activarla" : "desactivarla"} en cualquier otro momento.`}</p>
                                    </div>
                                    <div className="mb-footer">
                                    <button type="button" className="btn btn-primary btn-lg pull-right" onClick={(e) => { this.deleteSubmit(e) }} >{this.state.desactivarCongresista.enabled ? "Desactivar" : "Activar"}</button>
                                        
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

export default CongresistasPorCuatrienioCorporacion;