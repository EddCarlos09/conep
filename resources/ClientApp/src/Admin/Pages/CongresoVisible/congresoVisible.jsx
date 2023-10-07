import React, { Component } from 'react';
import Spinner from '../../../Components/Spinner';
import congresoVisibleDataService from "../../../Services/Catalogo/CongresoVisible.Service";
import TableReact from "../../../Components/TableReact";
import { ModuloPermiso } from "../../../Permisos/ModuloPermiso";
import ValidarPermiso from "../../../Permisos/ValidarPermiso";
import AuthLogin from "../../../Utils/AuthLogin";

const auth = new AuthLogin();
class congresoVisible extends Component {
    constructor(props) {
        super(props);
        this.tableHandler = this.tableHandler.bind(this);
        this.state = {
            tableInfo: {
                columns: [
                    {
                        Header: "Congreso Visible",
                        columns: [
                            {
                                Header: "id",
                                accessor: "id"
                            },
                            {
                                Header: "Información",
                                accessor: "queEs",
                                Cell: () => {
                                    return (
                                        <p>Información de la entidad corporativa, equipos y aliados</p>
                                    );
                                },
                            },
                            {
                                Header: 'Activo',
                                id: 'activo',
                                accessor: "activo",
                                Cell: (tableProps) => {
                                    return (
                                        <input
                                            type="checkbox"
                                            className="icheckbox"
                                            checked={tableProps.row.values.activo}
                                            readOnly
                                        />
                                    );
                                },
                            }
                        ]
                    },
                    {
                        Header: "Acciones",
                        columns: [
                            auth.tieneModuloPermiso(ModuloPermiso.CongresoVisible.IndexEquipo) ?
                            {
                                Header: 'Equipo',
                                id: 'equipo',
                                accessor: (str) => 'Equipo',
                                Cell: (tableProps) => (
                                    <ValidarPermiso
                                        IdModuloPermisoValidar = {ModuloPermiso.CongresoVisible.IndexEquipo}
                                        DefaultTemplate = {
                                            <a href={`#/equipo-congreso-visible/${tableProps.row.values.id}`} data-id={tableProps.row.values.id}
                                                className="btn btn-primary btn-block">
                                                <i className="fas fa-user-friends"></i> Equipos
                                            </a>
                                        }
                                    />                                    
                                )
                            }:{
                                Header: 'Equipo',
                                id: 'equipo',
                                accessor: (str) => '-',
                            },
                            auth.tieneModuloPermiso(ModuloPermiso.CongresoVisible.IndexAliado) ?
                            {
                                Header: 'Aliado',
                                id: 'aliado',
                                accessor: (str) => 'Aliado',
                                Cell: (tableProps) => (
                                    <ValidarPermiso
                                        IdModuloPermisoValidar = {ModuloPermiso.CongresoVisible.IndexAliado}
                                        DefaultTemplate = {
                                            <a href={`#/aliado-congreso-visible/${tableProps.row.values.id}`} data-id={tableProps.row.values.id}
                                            className="btn btn-primary btn-block">
                                            <i className="fas fa-handshake"></i> Aliados
                                            </a>
                                        }
                                    />                                    
                                )
                            }:{
                                Header: 'Aliado',
                                id: 'aliado',
                                accessor: (str) => '-',
                            },
                            auth.tieneModuloPermiso(ModuloPermiso.CongresoVisible.Obtener) ?
                            {
                                Header: 'Editar',
                                id: 'editar',
                                accessor: (str) => 'editar',
                                Cell: (tableProps) => (
                                    <ValidarPermiso
                                        IdModuloPermisoValidar={ModuloPermiso.CongresoVisible.Obtener}
                                        DefaultTemplate={
                                            <a href={`#/editar-congreso-visible/${tableProps.row.values.id}`} data-id={tableProps.row.values.id}
                                                className="btn btn-info btn-block">
                                                <i className="fa fa-edit"></i> Editar
                                            </a>
                                        }                                       
                                    />
                                )
                            }:{
                                Header: 'Editar',
                                id: 'editar',
                                accessor: (str) => '-',
                            }
                        ]
                    }
                ],
                hiddenColumns: ["id", "activo"],
                data: [],
                page: 1,
                rows: 5,
                search: "",
                totalRows: 0
            },
            loading: true,
            filterActive: { value: 1, label: "Activo" },
            dataSelectActive: [{ value: -1, label: "Filtrar por activo" }, { value: 1, label: "Activo" }, { value: 0, label: "Inactivo" }],
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
            await this.getAll(this.state.filterActive.value, page, rows, search);
        }.bind(this), delayAccion);
    }

    componentDidMount() {
        this.getAll(this.state.filterActive.value, this.state.tableInfo["page"], this.state.tableInfo["rows"], this.state.tableInfo["search"]);
    }

    handleFilterActive = async (selectActive) => {
        this.setState({ filterActive: selectActive });
        await this.getAll(selectActive.value, this.state.tableInfo.page, this.state.tableInfo.rows, this.state.tableInfo.search);
    }
    getAll = async (idFilterActive, page, rows, search) => {
        this.setState({ loading: true });
        let tableInfo = this.state.tableInfo;
        await congresoVisibleDataService.getAll(idFilterActive, page, rows, search)
            .then(response => {
                tableInfo["data"] = response.data;
            })
            .catch(e => {
                console.log(e);
            });

        this.setState({
            tableInfo: tableInfo,
            loading: false
        });
    }
    render() {
        return (
            <div>
                <Spinner show={this.state.loading} />
                <ul className="breadcrumb push-down-0">
                    <li><a href="/">Congreso Visible</a></li>
                </ul>

                <div className="content-frame">
                    <div className="content-frame-top">
                        <div className="rowListado">
                            <div className="panel panel-default ">
                                <div className="panel-heading">
                                    <h3 className="panel-title"><span className="fas fa-landmark"></span> Congreso Visible</h3>
                                </div>
                                <div className="panel-body">
                                    <div>
                                    <ValidarPermiso
                                    IdModuloPermisoValidar={ModuloPermiso.CongresoVisible.ObtenerTodos}
                                    DefaultTemplate={
                                        <TableReact
                                            columns={this.state.tableInfo["columns"]}
                                            data={this.state.tableInfo["data"]}
                                            hiddenColumns={this.state.tableInfo["hiddenColumns"]}
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
        )
    }
}

export default congresoVisible;