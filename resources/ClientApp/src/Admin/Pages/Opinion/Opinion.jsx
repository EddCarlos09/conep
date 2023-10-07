import React, { Component } from 'react';
import Spinner from "../../../Components/Spinner";
import AuthLogin from "../../../Utils/AuthLogin";
import TableReact from "../../../Components/TableReact";
import OpinionDataService from "../../../Services/ContenidoMultimedia/Opinion.Service";
import Select from '../../../Components/Select';
import { ModuloPermiso } from "../../../Permisos/ModuloPermiso";
import ValidarPermiso from "../../../Permisos/ValidarPermiso";

const auth = new AuthLogin();
const fieldsConst = {
    id: 0,
    titulo: "",
    activo: 1,
    fechaPublicacion:"",
    user: auth.username(),
};
class Opinion extends Component {
    constructor(props){
        super(props);
        this.state = {
            tableInfo: {
                columns: [
                    {
                        Header: "Opiniones",
                        columns: [
                            {
                                Header: "id",
                                accessor: "id"
                            },
                            {
                                Header: "Titulo",
                                accessor: "titulo",
                            },
                            {
                                Header: "Fecha de Publicacion",
                                accessor: "fechaPublicacion",
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
                            {
                                Header: 'Editar',
                                id: 'editar',
                                accessor: (str) => 'editar',
                                Cell: (tableProps) => (
                                    <ValidarPermiso
                                    IdModuloPermisoValidar={ModuloPermiso.Opinion.Obtener}
                                    DefaultTemplate={
                                        <a  href={`#/opinion-editar/${tableProps.row.values.id}`} data-id={tableProps.row.values.id}
                                            className="btn btn-info btn-block">
                                            <i className="fa fa-edit"></i> Editar
                                        </a>
                                    }
                                    />
                                )
                            },
                            {
                                Header: "Activar/Desactivar",
                                id: "actdesc",
                                accessor: (str) => "actdesc",
                                Cell: (tableProps) => (
                                    <ValidarPermiso
                                        IdModuloPermisoValidar={ModuloPermiso.Opinion.Eliminar}
                                        DefaultTemplate={
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
                            }
                        ]
                    }
                ],
                hiddenColumns: ["id","activo"],
                data: [],
                page: 1,
                rows: 5,
                search: "",
                totalRows: 0
            },
            loading: true,
            data:fieldsConst,
            filterActive: { value: 1, label: "Activo" },
            dataSelectActive: [{ value: -1, label: "Filtrar por activo" }, { value: 1, label: "Activo" }, { value: 0, label: "Inactivo" }],
        }
    };
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

    componentDidMount(){
        this.getAll(this.state.filterActive.value,this.state.tableInfo["page"],this.state.tableInfo["rows"],this.state.tableInfo["search"]);
    }
    handlerDesactivar = (item) => {
        let desActObj = {
            id: item.id,
            titulo: item.titulo,
            activo: item.activo,
        };
        this.setState({
            data: desActObj,
        });
    };
    deleteSubmit = async (e) => {
        e.preventDefault();

        this.setState({ loading: true });

        let responseData;
        await OpinionDataService.delete(this.state.data["id"])
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
    handleFilterActive = async (selectActive) => {
        this.setState({ filterActive: selectActive });
        await this.getAll(selectActive.value,  this.state.tableInfo.page, this.state.tableInfo.rows, this.state.tableInfo.search);
    }
    getAll = async (idFilterActive,page,rows,search)=>{
        this.setState({loading:true});
        let tableInfo = this.state.tableInfo;
        await OpinionDataService.getAll(idFilterActive,page,rows,search)
            .then(response =>{
                tableInfo["data"] = response.data;
            })
            .catch(e=>{
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
                    <li><a href="/">Contenido Multimedia</a></li>
                    <li><a href="/">Opiníon</a></li>
                </ul>

                <div className="content-frame">
                    <div className="content-frame-top">
                        <div className="rowListado">
                            <div className="panel panel-default ">
                                <div className="panel-heading">
                                    <h3 className="panel-title"><span className="fa fa-list"></span> Listado de opinión</h3>
                                    <ul className="panel-controls">
                                        <li>
                                            <div style={{ minWidth: "150px" }}>
                                                <Select
                                                    divClass=""
                                                    selectplaceholder="Seleccione"
                                                    selectValue={this.state.filterActive}
                                                    selectOnchange={this.handleFilterActive}
                                                    selectoptions={this.state.dataSelectActive}
                                                    selectIsSearchable={false}
                                                    selectclassNamePrefix="selectReact__value-container"
                                                    spanClass=""
                                                    spanError="" >
                                                </Select>
                                            </div>
                                        </li>
                                        <li>
                                            <ValidarPermiso
                                                IdModuloPermisoValidar = {ModuloPermiso.Opinion.Nuevo}
                                                DefaultTemplate = {
                                                    <a href={`#/opinion-crear`} className="btn btn-primary">
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
                                        IdModuloPermisoValidar={ModuloPermiso.Opinion.ObtenerTodos}
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

                <div className={`message-box message-box-${this.state.data.activo ? "danger" : "info"} animated fadeIn`} id="message-box-danger">
                        <form action="">
                            <div className="mb-container">
                                <div className="mb-middle">
                                    <div className="mb-title"><span className={`fa fa-${this.state.data.activo ? "eraser" : "check"}`}></span> {this.state.data.activo ? "Desactivar" : "Activar"} Publicación</div>
                                    <div className="mb-content">
                                        <p>{`¿Está seguro que desea ${this.state.data.activo ? "desactivar" : "activar"} la publicación ${this.state.data.titulo}? Puede volver a ${this.state.data.activo ? "activarla" : "desactivarla"} en cualquier otro momento.`}</p>
                                    </div>
                                    <div className="mb-footer">
                                    <button type="button" className="btn btn-primary btn-lg pull-right" onClick={(e) => { this.deleteSubmit(e) }} >{this.state.data.activo ? "Desactivar" : "Activar"}</button>

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

export default Opinion;
