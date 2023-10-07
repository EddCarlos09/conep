import React, { Component } from "react";
import TableReactExtends from "../../../Components/TableReactExtends";
import PodcastDataService from "../../../Services/ContenidoMultimedia/Podcasts.Service";
import Spinner from "../../../Components/Spinner";
import Select from "../../../Components/Select";
import AuthLogin from "../../../Utils/AuthLogin";
import { ModuloPermiso } from "../../../Permisos/ModuloPermiso";
import ValidarPermiso from "../../../Permisos/ValidarPermiso";

const auth = new AuthLogin();

class Podcast extends Component {
    constructor(props){
        super(props);
        this.tableHandler = this.tableHandler.bind(this);
        this.state = {
            tableInfo: {
                columns: [
                    {
                        Header: "Podcast",
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
                                Header: "Fecha de publicación",
                                accessor: "fecha",
                                className: "text-center"
                            },
                            {
                                Header: "Presentadores",
                                accessor: "presentadores"
                            },
                            {
                                Header: "Invitados",
                                accessor: "invitados"
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
                            auth.tieneModuloPermiso(ModuloPermiso.Podcast.Obtener) ?
                            {
                                Header: "Editar",
                                id: "editar",
                                accessor: (str) => "editar",
                                Cell: (tableProps) => (
                                    <ValidarPermiso IdModuloPermisoValidar={ModuloPermiso.Podcast.Obtener} DefaultTemplate={
                                        <a
                                            href={`#/podcast-editar/${tableProps.row.values.id}`}
                                            className="btn btn-info"
                                            style={{ width: "100%" }}
                                        >
                                            <i className="fa fa-edit"></i> Editar
                                        </a>
                                    } />
                                ),
                            }: {
                                Header: "Editar",
                                id: "editar",
                                accessor: (str) => "-",
                            },
                            auth.tieneModuloPermiso(ModuloPermiso.Podcast.Eliminar) ?
                            {
                                Header: "Activar/Desactivar",
                                id: "actdesc",
                                accessor: (str) => "actdesc",
                                Cell: (tableProps) => (
                                    <ValidarPermiso IdModuloPermisoValidar={ModuloPermiso.Podcast.Eliminar} DefaultTemplate={
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
            dataSelectActive: [
                { value: -1, label: "Filtrar por activo" },
                { value: 1, label: "Activo" },
                { value: 0, label: "Inactivo" },
            ],
            desactivarPodcast: { id: 0, titulo: "", enabled: true }
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
                    page,
                    rows,
                    search
                );
            }.bind(this),
            1000
        );
    }
    handlerDesactivar = (podcast) => {
        let desObj = { id: podcast.id, titulo: podcast.titulo, enabled: podcast.activo }
        this.setState({
            desactivarPodcast: desObj
        })
    }
    handleFilterActive = async (selectActive) => {
        this.setState({ filterActive: selectActive });
        await this.getAll(
            selectActive.value,
            this.state.tableInfo.page,
            this.state.tableInfo.rows,
            this.state.tableInfo.search
        );
    };
    async componentDidMount() {
        this.getAll(
            this.state.filterActive.value,
            this.state.tableInfo.page,
            this.state.tableInfo.rows,
            this.state.tableInfo.search
        );
    }
    
    deleteSubmit = async (e) => {
        e.preventDefault();
        this.setState({loading: true });

        let responseData;
        await PodcastDataService.delete(this.state.desactivarPodcast.id)
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
                this.state.tableInfo.page,
                this.state.tableInfo.rows,
                this.state.tableInfo.search
            );
        }
        document.querySelector(`#message-box-danger button[data-dismiss="modal"]`).click(); // Accionamos el click del cancelar para cerrar
    };

    getAll = async (idFilterActive, page, rows, search) => {
        this.setState({ loading: true });
        let tableInfo = this.state.tableInfo;
        await PodcastDataService.getAll(
            idFilterActive,
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

        await PodcastDataService.getTotalRecords(idFilterActive, search)
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
                    <li>Podcast</li>
                </ul>
                <div className="content-frame">
                    <div className="content-frame-top">
                        <div className="rowListado">
                            <div className="panel panel-default ">
                                <div className="panel-heading">
                                    <h3 className="panel-title">
                                        <span className="fas fa-microphone-alt"></span>{" "}
                                        Listado de podcast
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
                                            <ValidarPermiso IdModuloPermisoValidar={ModuloPermiso.Podcast.Nuevo} DefaultTemplate={
                                                <a
                                                    href={"#/podcast-crear"}
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
                                        <ValidarPermiso IdModuloPermisoValidar={ModuloPermiso.Podcast.ObtenerTodos} DefaultTemplate={
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

                <div className={`message-box message-box-${this.state.desactivarPodcast.enabled ? "danger" : "info"} animated fadeIn`} id="message-box-danger">
                        <form action="">
                            <div className="mb-container">
                                <div className="mb-middle">
                                    <div className="mb-title"><span className={`fa fa-${this.state.desactivarPodcast.enabled ? "eraser" : "check"}`}></span> {this.state.desactivarPodcast.enabled ? "Desactivar" : "Activar"} podcast</div>
                                    <div className="mb-content">
                                        <p>{`¿Está seguro que desea ${this.state.desactivarPodcast.enabled ? "desactivar" : "activar"} el podcast ${this.state.desactivarPodcast.titulo}? Puede volver a ${this.state.desactivarPodcast.enabled ? "activarla" : "desactivarla"} en cualquier otro momento.`}</p>
                                    </div>
                                    <div className="mb-footer">
                                    <ValidarPermiso IdModuloPermisoValidar={ModuloPermiso.Podcast.Eliminar} DefaultTemplate={
                                        <button type="button" className="btn btn-primary btn-lg pull-right" onClick={(e) => { this.deleteSubmit(e) }} >{this.state.desactivarPodcast.enabled ? "Desactivar" : "Activar"}</button>
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

export default Podcast;