import React, { Component } from 'react';
import TableReactExtends from "../../../Components/TableReactExtends";
import PartidoDataService from "../../../Services/Catalogo/Partido.Service";
import Spinner from '../../../Components/Spinner';
import Select from '../../../Components/Select';
import ValidForm from "../../../Utils/ValidForm";
import AuthLogin from "../../../Utils/AuthLogin";
import { ModuloPermiso } from "../../../Permisos/ModuloPermiso";
import ValidarPermiso from "../../../Permisos/ValidarPermiso";

const validForm = new ValidForm();
const fieldsConst = { id: 0, nombre: '', activo: false };
const errorsConst = { id: '', nombre: '', activo: '' };
const auth = new AuthLogin();
class Partidos extends Component {
    constructor(props) {
        super(props);
       
        this.tableHandler = this.tableHandler.bind(this);
       
        this.state = {
            tableInfo: {
                columns: [
                    {
                        Header: "Partidos",
                        columns: [
                            {
                                Header: "id",
                                accessor: "id"
                            },
                            {
                                Header: "Nombre",
                                accessor: "nombre"
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
                            auth.tieneModuloPermiso(ModuloPermiso.Partidos.Obtener) ?
                            {
                                Header: 'Editar',
                                id: 'editar',
                                accessor: (str) => 'editar',
                                Cell: (tableProps) => (
                                    <ValidarPermiso
                                            IdModuloPermisoValidar={ModuloPermiso.Partidos.Obtener}
                                            DefaultTemplate={
                                            <a  href={`#/partidos-editar/${tableProps.row.values.id}`} data-id={tableProps.row.values.id}
                                            className="btn btn-info btn-block">
                                                        <i className="fa fa-edit"></i> Editar
                                            </a>
                                            }
                                    />
                                )
                            }: {
                                Header: 'Editar',
                                id: 'editar',
                                accessor: (str) => '-',
                            },
                            auth.tieneModuloPermiso(ModuloPermiso.Partidos.Eliminar) ?
                            {
                                Header: 'Activar/Desactivar',
                                id: 'actdesc',
                                accessor: (str) => 'actdesc',
                                Cell: (tableProps) => (
                                    <ValidarPermiso
                                            IdModuloPermisoValidar={ModuloPermiso.Partidos.Eliminar}
                                            DefaultTemplate={
                                            <button
                                            data-toggle="modal"
                                            data-target="#message-box-danger"
                                            className={`btn ${tableProps.row.values.activo === 1
                                                ? "btn-danger"
                                                : "btn-warning"} eliminar`}
                                            style={{ width: '100%' }}
                                            data-id={tableProps.row.values.id}
                                            onClick={() => { this.handlerDesactivar(tableProps.row.values) }}>
                                            <i className="fa fa-eraser"></i> {tableProps.row.values.activo === 1 ? "Desactivar" : "Activar"}
                                        </button>
                                            }
                                    />
                                )
                            }: {
                                Header: "Activar/Desactivar",
                                id: "actdesc",
                                accessor: (str) => "-",
                            },
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
            fields: fieldsConst,
            errors: errorsConst,
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
    handlerDesactivar = (partido) => {
        let desActObj = { id: partido.id, nombre: partido.nombre, resenaHistorica: partido.resenaHistorica, lineamientos: partido.lineamientos, fechaDeCreacion: partido.fechaDeCreacion, estatutos: partido.estatutos, activo: partido.activo  }
        this.setState({
            fields: desActObj
        })
    }

    deleteSubmit = async (e) => {
        e.preventDefault();
        let errors = this.state.errors;
        errors = validForm.cleanErrors(errors);
        this.setState({ errors: errors, loading: true });

        let responseData;
        await PartidoDataService.delete(this.state.fields["id"])
            .then(response => {
                responseData = response.data;
            })
            .catch(function (error) {
                errors = validForm.displayErrors(error.response.data.errors, errors);
            });

        this.setState({ errors: errors, loading: false });
        if (responseData != null) {
            await this.getAll(this.state.filterActive.value,  this.state.tableInfo.page, this.state.tableInfo.rows, this.state.tableInfo.search);
            document.querySelector(`#message-box-danger button[data-dismiss="modal"]`).click();
        }
    }
    getAll = async (idFilterActive, page, rows, search) => {
        this.setState({ loading: true });
        let tableInfo = this.state.tableInfo;
        await PartidoDataService.getAll(idFilterActive,search, page, rows)
            .then(response => {
                tableInfo["data"] = response.data;
            })
            .catch(e => {
                console.log(e);
            });

        await PartidoDataService.getTotalRecordsPartido(idFilterActive, search)
            .then(response => {
                tableInfo["totalRows"] = response.data;
            })
            .catch(e => {
                console.log(e);
            })

        this.setState({
            tableInfo: tableInfo,
            loading: false
        });
    }
    
    resetFiels() {
        let fields = validForm.resetObject(fieldsConst);
        this.setState({ fields: fields, errors: validForm.cleanErrors(this.state.errors) });
    }
    handleFilterActive = async (selectActive) => {
        this.setState({ filterActive: selectActive });
        await this.getAll(selectActive.value,  this.state.tableInfo.page, this.state.tableInfo.rows, this.state.tableInfo.search);
    }
    render() {
        return (
            <div>
                <Spinner show={this.state.loading} />
                
                <div className={`message-box message-box-${this.state.fields.activo ? "danger" : "info"} animated fadeIn`} id="message-box-danger">
                        <form action="">
                            <div className="mb-container">
                                <div className="mb-middle">
                                    <div className="mb-title"><span className={`fa fa-${this.state.fields.activo ? "eraser" : "check"}`}></span> {this.state.fields.activo ? "Desactivar" : "Activar"} partido</div>
                                    <div className="mb-content">
                                        <p>{`¿Está seguro que desea ${this.state.fields.activo ? "desactivar" : "activar"} el partido ${this.state.fields.nombre}? Puede volver a ${this.state.fields.activo ? "activarla" : "desactivarla"} en cualquier otro momento.`}</p>
                                    </div>
                                    <div className="mb-footer">
                                    <ValidarPermiso
                                            IdModuloPermisoValidar={ModuloPermiso.Partidos.Eliminar}
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
                <ul className="breadcrumb push-down-0">
                    <li><a href="/">Catálogos</a></li>
                    <li><a href="/">Partidos</a></li>
                </ul>
                <div className="content-frame">
                    <div className="content-frame-top">
                        <div className="rowListado">
                            <div className="panel panel-default ">
                                <div className="panel-heading">
                                    <h3 className="panel-title"><span className="fa fa-list"></span> Listado de partidos</h3>
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
                                            IdModuloPermisoValidar={ModuloPermiso.Partidos.Nuevo}
                                            DefaultTemplate={
                                                <a href="#/partidos-crear" className="btn btn-primary">
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
                                            IdModuloPermisoValidar={ModuloPermiso.Partidos.ObtenerTodos}
                                            DefaultTemplate=
                                                {                                   
                                        <TableReactExtends
                                                        columns={this.state.tableInfo["columns"]}
                                                        data={this.state.tableInfo["data"]}
                                                        hiddenColumns={this.state.tableInfo["hiddenColumns"]}
                                                        handler={this.tableHandler}
                                                        pageExtends={this.state.tableInfo["page"]}
                                                        totalRows={this.state.tableInfo["totalRows"]}
                                                        search={this.state.tableInfo["search"]}
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

export default Partidos;