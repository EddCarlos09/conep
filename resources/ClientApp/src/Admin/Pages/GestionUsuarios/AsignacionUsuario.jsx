import React, { Component } from 'react';
import TableReact from "../../../Components/TableReact";
import UtilsDataService from "../../../Services/General/Utils.Service";
import AsignacionUsuarioDataService from "../../../Services/Base/Usuario/AsignacionUsuario.Service";
import Spinner from '../../../Components/Spinner';
import ValidForm from "../../../Utils/ValidForm";
import Select from '../../../Components/Select';
import { ModuloPermiso } from "../../../Permisos/ModuloPermiso";
import ValidarPermiso from "../../../Permisos/ValidarPermiso";

const validForm = new ValidForm();
const fieldsConst = { sucursal_id: 0, nombre_sucursal: '', activo: 0 };
const errorsConst = { sucursal_id: '', nombre_sucursal: '', activo: '' };
const SelectTipoSucursal = { value: "", label: "Filtrar por tipo" };

class AsignacionUsuario extends Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
        document.addEventListener('click', this.handleClick, true);
        this.state = {
            columns: [
                {
                    Header: "Sucursales",
                    columns: [
                        {
                            Header: "sucursal_id",
                            accessor: "sucursal_id"
                        },
                        {
                            Header: "Nombre",
                            accessor: "nombre_sucursal"
                        },
                        {
                            Header: "Tipo de sucursal",
                            accessor: "tipo_sucursal"
                        },
                        {
                            Header: "Cantidad de cuentas",
                            accessor: "cantidad_cuentas"
                        },
                        {
                            Header: 'Activo',
                            id: 'activo',
                            accessor: "activo",
                            Cell: (tableProps) => {
                                return (
                                    <input
                                        type="checkbox"
                                        className="checkbox center-block"
                                        checked={tableProps.row.values.activo}
                                        readOnly
                                    />
                                );
                            }
                        }
                    ]
                },
                {
                    Header: "Acciones",
                    columns: [
                        {
                            Header: 'Ver usuarios',
                            id: 'verUsuarios',
                            accessor: (str) => 'verUsuarios',
                            Cell: (tableProps) => (
                                <ValidarPermiso
                                    IdModuloPermisoValidar={ModuloPermiso.AsignacionDeUsuario.Index}
                                    DefaultTemplate=
                                        {
                                            <button
                                                data-toggle="modal"
                                                data-target="#"
                                                className="btn btn-warning verUsuarios"
                                                style={{ width: '100%' }}
                                                data-id={tableProps.row.values.sucursal_id}
                                            ><i className="fa fa-eye"></i> Ver usuarios
                                            </button>
                                        }
                                />

                            )
                        },
                        {
                            Header: 'Activar/Desactivar',
                            id: 'actdesc',
                            accessor: (str) => 'actdesc',
                            Cell: (tableProps) => (
                                <ValidarPermiso
                                    IdModuloPermisoValidar={ModuloPermiso.AsignacionDeUsuario.Eliminar}
                                    DefaultTemplate=
                                        {
                                            <button
                                                data-toggle="modal"
                                                data-target="#modal-delete"
                                                className="btn btn-danger eliminar"
                                                style={{ width: '100%' }}
                                                data-id={tableProps.row.values.sucursal_id}
                                                data-sucursalnombre={tableProps.row.values.nombre_sucursal}
                                                data-activo={tableProps.row.values.activo}
                                            ><i className="fa fa-eraser"></i> {tableProps.row.values.activo ? "Desactivar" : "Activar"}
                                            </button>
                                        }
                                />
                            )
                        }
                    ]
                }
            ],
            hiddenColumns: ["sucursal_id"],
            data: [],
            fields: fieldsConst,
            errors: errorsConst,
            loading: true,
            filterTipoSucursal: SelectTipoSucursal,
            filterActive: { value: 1, label: "Activo" },
            dataSelectTipoSucursalIndex: [SelectTipoSucursal],
            dataSelectActive: [{ value: "", label: "Filtrar por activo" }, { value: 1, label: "Activo" }, { value: 0, label: "Inactivo" }]
        }
    }

    async componentDidMount() {
        await this.getAll(this.state.filterActive.value, this.state.filterTipoSucursal.value);
        await this.getSelectTipoSucursal();
    }
    async handleClick(e) {
        let element = e.target;
        if (element.classList.contains("verUsuarios")) {
            let id = Number(element.getAttribute("data-id"));

            this.props.history.push({
                pathname: '/usuario-sucursal',
                search: `?sucursal_id=${id}`
            });
        }
        else if (element.parentNode.classList.contains("verUsuarios")) {
            let id = Number(element.parentNode.getAttribute("data-id"));

            this.props.history.push({
                pathname: '/usuario-sucursal',
                search: `?sucursal_id=${id}`
            });
        }

        if (element.classList.contains("eliminar")) {
            let sucursal_id = Number(element.getAttribute("data-id"));
            let nombre_sucursal = element.getAttribute("data-sucursalnombre");
            let activo = (element.getAttribute("data-activo") === '1');

            this.setState(prevState => ({
                ...prevState,
                fields: {
                    ...prevState.fields,
                    sucursal_id: sucursal_id,
                    nombre_sucursal: nombre_sucursal,
                    activo: activo
                }
            }));
        }
        else if (element.parentNode.classList.contains("eliminar")) {
            let sucursal_id = Number(element.parentNode.parentNode.getAttribute("data-id"));
            let nombre_sucursal = element.parentNode.getAttribute("data-sucursalnombre");
            let activo = (element.parentNode.getAttribute("data-activo") === '1');

            this.setState(prevState => ({
                ...prevState,
                fields: {
                    ...prevState.fields,
                    sucursal_id: sucursal_id,
                    nombre_sucursal: nombre_sucursal,
                    activo: activo
                }
            }));
        }
    }

    deleteSubmit = async (e) => {
        e.preventDefault();
        let errors = this.state.errors;
        errors = validForm.cleanErrors(errors);
        this.setState({ errors: errors, loading: true });

        let responseData;
        await AsignacionUsuarioDataService.delete(this.state.fields["sucursal_id"])
            .then(response => {
                responseData = response.data;
            })
            .catch(function (error) {
                errors = validForm.displayErrors(error.response.data.errors, errors);
            });

        this.setState({ errors: errors, loading: false });
        if (responseData != null) {
            this.getAll(this.state.filterActive.value, this.state.filterTipoSucursal.value);
            this.refs.closemodalDelete.click();
        }
        if(document.querySelector(".trChild")){
            document.querySelectorAll(".trChild").forEach(item => {
                item.remove();
            });
        }
    }

    getAll = async (activo, tipo_sucursal_id) => {
        this.setState({ loading: true });

        await AsignacionUsuarioDataService.getAll({
            activo: activo,
            tipo_sucursal_id: tipo_sucursal_id
        })
            .then(response => {
                this.setState({
                    data: response.data,
                    loading: false
                });
            })
            .catch(e => {
                console.log(e);
            });
    }

    getSelectTipoSucursal = async () => {
        this.setState({ loading: true });
        await UtilsDataService.getComboTipoSucursalFilter({
            activo: 1
        })
            .then(response => {
                if (response.data.length > 0) {
                    response.data.map(SelectTipoSucursal => {
                        this.state.dataSelectTipoSucursalIndex.push({
                            value: SelectTipoSucursal.idTipoSucursal,
                            label: SelectTipoSucursal.nombre
                        });
                    });
                }
                this.setState({ loading: false });
            })
            .catch(e => {
                console.log(e);
            });
    }

    resetFields() {
        let fields = validForm.resetObject(fieldsConst);
        this.setState({ fields: fields, errors: validForm.cleanErrors(this.state.errors) });
    }

    handleFilterActive = async (selectActive) => {
        this.setState({ filterActive: selectActive });
        await this.getAll(selectActive.value, this.state.filterTipoSucursal.value);
    }

    handleFilterTipoSucursal = async (selectTipoSucursal) => {
        this.setState({ filterTipoSucursal: selectTipoSucursal });
        await this.getAll(this.state.filterActive.value, selectTipoSucursal.value);
    }

    render() {
        return (
            <div>
                <Spinner show={this.state.loading} />

                <div className={`message-box message-box-${this.state.fields.activo ? "danger" : "info"} animated fadeIn`} id="modal-delete">
                    <form name="form" className="form-horizontal" onSubmit={this.deleteSubmit.bind(this)}>
                        <div className="mb-container">
                            <div className="mb-middle">
                                <div className="mb-title"><span className={`fa fa-${this.state.fields.activo ? "eraser" : "check"}`}></span>{this.state.fields["activo"] ? "Desactivar" : "Activar"} sucursal</div>
                                <div className="mb-content">
                                    <p>{`¿Está seguro que desea ${this.state.fields["activo"] ? "desactivar" : "activar"} la sucursal ${this.state.fields["nombre_sucursal"]}? Puede volver a ${this.state.fields.activo ? "activarla" : "desactivarla"} en cualquier momento.`}</p>
                                    <p style={{ paddingLeft: "5px" }}><span className="error">{this.state.errors["errorGenerico"] || ''}</span></p>
                                </div>
                                <div className="mb-footer">

                                    <button className="btn btn-primary btn-lg pull-right">{this.state.fields["activo"] ? "Desactivar" : "Activar"}</button>
                                    &nbsp;
                                    <button
                                        type="button"
                                        className="btn btn-default"
                                        data-dismiss="modal"
                                        onClick={async () => {
                                            this.resetFields();
                                        }}
                                        ref="closemodalDelete">Cancelar</button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>

                <ul className="breadcrumb push-down-0">
                    <li><a href="/">Gestión de usuarios</a></li>
                    <li><a href="/">Asignación de usuario</a></li>
                </ul>
                <div className="content-frame">
                    <div className="content-frame-top">
                        <div className="row">
                            <div className="panel panel-default ">
                                <div className="panel-heading">
                                    <h3 className="panel-title"><i className="fa fa-building"></i> Asignación de personal por sucursal</h3>
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
                                                    spanClass="" spanError=""
                                                />
                                            </div>
                                        </li>
                                        <li>
                                            <div style={{ minWidth: "150px" }}>
                                                <Select
                                                    divClass=""
                                                    selectplaceholder="Seleccione"
                                                    selectValue={this.state.filterTipoSucursal}
                                                    selectOnchange={this.handleFilterTipoSucursal}
                                                    selectoptions={this.state.dataSelectTipoSucursalIndex}
                                                    selectIsSearchable={false}
                                                    selectclassNamePrefix="selectReact__value-container"
                                                    spanClass=""
                                                    spanError=""
                                                />
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                                <div className="panel-body">
                                    <div>
                                        <ValidarPermiso
                                            IdModuloPermisoValidar={ModuloPermiso.AsignacionDeUsuario.ObtenerTodos}
                                            DefaultTemplate=
                                                {
                                                    <TableReact
                                                        columns={this.state.columns}
                                                        data={this.state.data}
                                                        hiddenColumns={this.state.hiddenColumns} />
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

export default AsignacionUsuario;
