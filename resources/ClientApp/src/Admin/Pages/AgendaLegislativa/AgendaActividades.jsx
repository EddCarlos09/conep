import React, { Component } from "react";
import TableReactExtends from "../../../Components/TableReactExtends";
import AgendaDataService from "../../../Services/AgendaLegislativa/AgendaActividad.Service";
import Spinner from "../../../Components/Spinner";
import Select from "../../../Components/Select";
import ValidForm from "../../../Utils/ValidForm";
import AuthLogin from "../../../Utils/AuthLogin";
import { ModuloPermiso } from "../../../Permisos/ModuloPermiso";
import ValidarPermiso from "../../../Permisos/ValidarPermiso";
const auth = new AuthLogin();
const validForm = new ValidForm();
const fieldsConst = {
    id: 0,
    agenda_legislativa_id:'',
    titulo: '',
    descripcion:'',
    tipo_actividad_agenda_id:'',
    actividad_id:'',
    titulo_actividad:'',
    user: auth.username(),
};
const errorsConst = {
    id: "",
    fecha: "",
    activo: "",
};

class AgendaActividades extends Component {
    constructor(props) {
        super(props);
        const id =
            this.props.match.params.id === undefined
                ? 0
                : this.props.match.params.id;
        this.tableHandler = this.tableHandler.bind(this);

        this.state = {
            id: id,
            tableInfo: {
                columns: [
                    {
                        Header: "Agenda Legislativa",
                        columns: [
                            {
                                Header: "id",
                                accessor: "id",
                            },
                            {
                                Header: "Titulo",
                                accessor: "titulo",
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
                        ],
                    },
                    {
                        Header: "Acciones",
                        columns: [
                            auth.tieneModuloPermiso(ModuloPermiso.AgendaLegislativa.ModificarActividad)?
                            {
                                Header: "Editar",
                                id: "editar",
                                accessor: (str) => "editar",
                                Cell: (tableProps) => (
                                    <a  href={`#/agenda-legislativa-actividades-editar/${id}/${tableProps.row.values.id}`} data-id={tableProps.row.values.id}
                                     className="btn btn-info btn-block">
                                                <i className="fa fa-edit"></i> Editar
                                    </a>
                                ),
                            }:
                            {
                                Header: 'Editar',
                                id: 'editar',
                                accessor: (str) => '-',
                            }
                            ,
                            auth.tieneModuloPermiso(ModuloPermiso.AgendaLegislativa.EliminarActividad)?
                            {
                                Header: "Activar/Desactivar",
                                id: "actdesc",
                                accessor: (str) => "actdesc",
                                Cell: (tableProps) => (
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
                                ),
                            }:
                            {
                                Header: 'Activar/Desactivar',
                                id: 'actdesc',
                                accessor: (str) => '-',
                            }
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
            fields:fieldsConst,
            loading: true,
            filterActive: { value: 1, label: "Activo" },
            dataSelectActive: [
                { value: -1, label: "Filtrar por activo" },
                { value: 1, label: "Activo" },
                { value: 0, label: "Inactivo" },
            ],
            errors:[]
        };
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

    async componentDidMount() {
        this.getAll(
            this.state.filterActive.value,
            this.state.tableInfo["page"],
            this.state.tableInfo["rows"],
            this.state.tableInfo["search"]
        );
    }

    handlerDesactivar = (item) => {
        let desActObj = {
            id: item.id,
            fecha: item.fecha,
            activo: item.activo,
        };
        this.setState({
            fields: desActObj,
        });
    };

  
    deleteSubmit = async (e) => {
        e.preventDefault();
        
        this.setState({ loading: true });

        let responseData;
        await AgendaDataService.delete(this.state.fields["id"])
            .then((response) => {
                responseData = response.data;
            })
            .catch((e) => {
                console.log(e);
            });

        this.setState({  loading: false });
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

    getAll = async (idFilterActive, page, rows, search) => {
        this.setState({ loading: true });
        let tableInfo = this.state.tableInfo;
        await AgendaDataService.getAll(
            this.state.id,
            idFilterActive,
            search,
            page,
            rows
        )
            .then((response) => {
                tableInfo["data"] = response.data;
            })
            .catch((e) => {
                console.log(e);
            });

        await AgendaDataService.getTotalRecords(idFilterActive,this.state.id, search)
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

    
    handleFilterActive = async (selectActive) => {
        this.setState({ filterActive: selectActive });
        await this.getAll(
            selectActive.value,
            this.state.tableInfo.page,
            this.state.tableInfo.rows,
            this.state.tableInfo.search
        );
    };

    render() {
        return (
            <div>
                <Spinner show={this.state.loading} />

                <ul className="breadcrumb push-down-0">
                    <li>Actividades de la agenda </li>                    
                </ul>
                <div className="content-frame">
                    <div className="content-frame-top">
                        <div className="rowListado">
                            <div className="panel panel-default ">
                                <div className="panel-heading">
                                    <h3 className="panel-title">
                                        <span className="fa fa-list"></span>{" "}
                                        Listado de actividades de la agenda
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
                                            <ValidarPermiso
                                                IdModuloPermisoValidar={ModuloPermiso.AgendaLegislativa.NuevaActividad}
                                                DefaultTemplate={
                                                    <a href={`#/agenda-legislativa-actividades-crear/${this.state.id}`} className="btn btn-primary">
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
                                            IdModuloPermisoValidar={ModuloPermiso.AgendaLegislativa.IndexActividad}
                                            DefaultTemplate={
                                            <TableReactExtends
                                            columns={this.state.tableInfo["columns"]}
                                            data={this.state.tableInfo["data"]}
                                            hiddenColumns={this.state.tableInfo["hiddenColumns"]}
                                            handler={this.tableHandler}
                                            pageExtends={this.state.tableInfo["page"]}
                                            totalRows={this.state.tableInfo["totalRows"]}
                                            search={this.state.tableInfo["search"]}/>
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
                                    <div className="mb-title"><span className={`fa fa-${this.state.fields.activo ? "eraser" : "check"}`}></span> {this.state.fields.activo ? "Desactivar" : "Activar"} actividad de la agenda</div>
                                    <div className="mb-content">
                                        <p>{`¿Está seguro que desea ${this.state.fields.activo ? "desactivar" : "activar"} la actividad de la agenda ${this.state.fields.fecha}? Puede volver a ${this.state.fields.activo ? "activarla" : "desactivarla"} en cualquier otro momento.`}</p>
                                    </div>
                                    <div className="mb-footer">
                                        <ValidarPermiso
                                            IdModuloPermisoValidar={ModuloPermiso.AgendaLegislativa.EliminarActividad}
                                            DefaultTemplate={
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

export default AgendaActividades;
