import React, { Component } from 'react';
import TableReact from "../../../Components/TableReact";
import CorporacionDataService from "../../../Services/Catalogo/Corporacion.Service";
import Spinner from '../../../Components/Spinner';
import Select from '../../../Components/Select';
import ValidForm from "../../../Utils/ValidForm";
import AuthLogin from "../../../Utils/AuthLogin";
import ValidarPermiso from "../../../Permisos/ValidarPermiso";
import { ModuloPermiso } from "../../../Permisos/ModuloPermiso";

const auth = new AuthLogin();
const validForm = new ValidForm();
const fieldsConst = { id: 0, nombre: '', descripcion: '', activo: false};
const errorsConst = { id: '', nombre: '', descripcion: '', activo: '' };

class Corporacion extends Component {
    constructor(props) {
        super(props);
       
        this.state = {
            tableInfo: {
                columns: [
                    {
                        Header: "Corporaciones",
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
                                Header: "Descripción",
                                accessor: "descripcion"
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
                            auth.tieneModuloPermiso(ModuloPermiso.Corporacion.Obtener) ?
                            {
                                Header: 'Editar',
                                id: 'editar',
                                accessor: (str) => 'editar',
                                Cell: (tableProps) => (
                                    <ValidarPermiso
                                            IdModuloPermisoValidar={ModuloPermiso.Citacion.Obtener}
                                            DefaultTemplate={
                                                <a  href={`#/corporacion-editar/${tableProps.row.values.id}`} data-id={tableProps.row.values.id}//#/corporacion-editar/${tableProps.row.values.id}
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
                            // {
                            //     Header: 'Activar/Desactivar',
                            //     id: 'actdesc',
                            //     accessor: (str) => 'actdesc',
                            //     Cell: (tableProps) => (
                            //         <button
                            //         data-toggle="modal"
                            //         data-target="#message-box-danger"
                            //         className={`btn ${tableProps.row.values.activo === 1
                            //             ? "btn-danger"
                            //             : "btn-warning"} eliminar`}
                            //         style={{ width: '100%' }}
                            //         data-id={tableProps.row.values.id}
                            //         onClick={() => { this.handlerDesactivar(tableProps.row.values) }}>
                            //         <i className="fa fa-eraser"></i> {tableProps.row.values.activo === 1 ? "Desactivar" : "Activar"}
                            //     </button>
                            //     )
                            // }
                        ]
                    }
                ],
                hiddenColumns: ["id","activo"],
                data: [],
            },
            fields: fieldsConst,
            errors: errorsConst,
            loading: true,
            filterActive: { value: 1, label: "Activo" },
            dataSelectActive: [{ value: -1, label: "Filtrar por activo" }, { value: 1, label: "Activo" }, { value: 0, label: "Inactivo" }],
        }
    }
    componentDidMount() {
        this.getAll(this.state.filterActive.value);
    }
    handlerDesactivar = (corporacion) => {
        let desActObj = { id: corporacion.id, nombre: corporacion.nombre, descripcion: corporacion.descripcion, activo: corporacion.activo  }
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
        await CorporacionDataService.delete(this.state.fields["id"])
            .then(response => {
                responseData = response.data;
            })
            .catch(function (error) {
                errors = validForm.displayErrors(error.response.data.errors, errors);
            });

        this.setState({ errors: errors, loading: false });
        if (responseData != null) {
            await this.getAll(this.state.filterActive.value);
        }
        document.querySelector(`#message-box-danger button[data-dismiss="modal"]`).click(); // Accionamos el click del cancelar para cerrar
    }
    getAll = async (idFilterActive) => {
        this.setState({ loading: true });
        let tableInfo = this.state.tableInfo;
        await CorporacionDataService.getAll(idFilterActive)
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
    
    resetFiels() {
        let fields = validForm.resetObject(fieldsConst);
        this.setState({ fields: fields, errors: validForm.cleanErrors(this.state.errors) });
    }
    handleFilterActive = async (selectActive) => {
        this.setState({ filterActive: selectActive });
        await this.getAll(selectActive.value);
    }
    render() {
        return (
            <div>
                <Spinner show={this.state.loading} />
                <div className={`message-box message-box-${this.state.fields.activo ? "danger" : "info"} animated fadeIn`} id="message-box-danger">
                        <form action="">
                            <div className="mb-container">
                                <div className="mb-middle">
                                    <div className="mb-title"><span className={`fa fa-${this.state.fields.activo ? "eraser" : "check"}`}></span> {this.state.fields.activo ? "Desactivar" : "Activar"} corporación</div>
                                    <div className="mb-content">
                                        <p>{`¿Está seguro que desea ${this.state.fields.activo ? "desactivar" : "activar"} la corporación ${this.state.fields.nombre}? Puede volver a ${this.state.fields.activo ? "activarla" : "desactivarla"} en cualquier otro momento.`}</p>
                                    </div>
                                    <div className="mb-footer">
                                    <button type="button" className="btn btn-primary btn-lg pull-right" onClick={(e) => { this.deleteSubmit(e) }} >{this.state.fields.activo ? "Desactivar" : "Activar"}</button>
                                        
                                    &nbsp;
                                    <button className="btn btn-default btn-lg pull-right" type="button" data-dismiss="modal">Cancelar</button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                <ul className="breadcrumb push-down-0">
                    <li><a href="/">Catálogos</a></li>
                    <li><a href="/">Corporaciones</a></li>
                </ul>
                <div className="content-frame">
                    <div className="content-frame-top">
                        <div className="rowListado">
                            <div className="panel panel-default ">
                                <div className="panel-heading">
                                    <h3 className="panel-title"><span className="fa fa-list"></span> Listado de corporaciones</h3>
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
                                    </ul>
                                </div>
                                <div className="panel-body">
                                    <div>
                                    <ValidarPermiso
                                            IdModuloPermisoValidar={ModuloPermiso.Corporacion.ObtenerTodos}
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

export default Corporacion;