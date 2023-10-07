import React, { Component } from 'react';
import TableReact from "../../../Components/TableReact";
import RolDataService from "../../../Services/Base/Usuario/Rol.Service";
import ModuloPermisoRolDataService from "../../../Services/Base/Usuario/ModuloPermisoRol.Service";
import Spinner from '../../../Components/Spinner';
import ValidForm from "../../../Utils/ValidForm";
import Select from '../../../Components/Select';
import { ModuloPermiso } from "../../../Permisos/ModuloPermiso";
import ValidarPermiso from "../../../Permisos/ValidarPermiso";

const validForm = new ValidForm();
const fieldsConst = { id: 0, nombre: '', activo: false };
const errorsConst = { id: '', nombre: '', activo: false };

class Rol extends Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
        document.addEventListener('click', this.handleClick, true);
        this.state = {
            columns: [
                {
                    Header: "Roles",
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
                            Header: 'Editar',
                            id: 'editar',
                            accessor: (str) => 'editar',
                            Cell: (tableProps) => (
                                <ValidarPermiso
                                    IdModuloPermisoValidar={ModuloPermiso.Roles.Obtener}
                                    DefaultTemplate=
                                        {
                                            <a
                                                href={`#/rol-accion?id=${tableProps.row.values.id}`}
                                                className="btn btn-info editar"
                                                style={{ width: '100%' }}
                                            >
                                                <i className="fa fa-edit"></i> Editar
                                            </a>
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
                                    IdModuloPermisoValidar={ModuloPermiso.Roles.Eliminar}
                                    DefaultTemplate=
                                        {

                                            <button
                                                data-toggle="modal"
                                                data-target="#modal-delete"
                                                className={`btn btn-${tableProps.row.values.activo ? "danger" : "info"} eliminar`}
                                                style={{ width: '100%' }}
                                                data-id={tableProps.row.values.id}
                                                data-nombre={tableProps.row.values.nombre}
                                                data-activo={tableProps.row.values.activo}
                                            >
                                                <i className="fa fa-eraser"></i> {tableProps.row.values.activo ? "Desactivar" : "Activar"}
                                            </button>
                                        }
                                />
                            )
                        }
                    ]
                }
            ],
            hiddenColumns: ["id"],
            data: [],
            fields: fieldsConst,
            errors: errorsConst,
            loading: true,
            filterActive: { value: 1, label: "Activo" },
            dataSelectActive: [{ value: '', label: "Filtrar por activo" }, { value: 1, label: "Activo" }, { value: 0, label: "Inactivo" }]
        }
    }

    async componentDidMount() {
        await this.getAll(this.state.filterActive.value);
    }

    handleFilterActive = async (selectActive) => {
        this.setState({ filterActive: selectActive });
        await this.getAll(selectActive.value);
    }

    async handleClick(e) {
        let element = e.target;

        if (element.classList.contains("eliminar")) {
            let id = Number(element.getAttribute("data-id"));
            let nombre = element.getAttribute("data-nombre");
            let activo = (element.getAttribute("data-activo") === '1');

            this.setState(prevState => ({
                ...prevState,
                fields: {
                    ...prevState.fields,
                    id: id,
                    nombre: nombre,
                    activo: activo
                }
            }));
        }
        else if (element.parentNode.classList.contains("eliminar")) {
            let id = Number(element.parentNode.getAttribute("data-id"));
            let nombre = element.parentNode.getAttribute("data-nombre");
            let activo = (element.parentNode.getAttribute("data-activo") === '1');

            this.setState(prevState => ({
                ...prevState,
                fields: {
                    ...prevState.fields,
                    id: id,
                    nombre: nombre,
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
        await ModuloPermisoRolDataService.delete(this.state.fields["id"])
            .then(response => {
                responseData = response.data;
            })
            .catch(function (error) {
                errors = validForm.displayErrors(error.response.data.errors, errors);
            });

        this.setState({ errors: errors, loading: false });
        if (responseData != null) {
            this.getAll(this.state.filterActive.value);
            this.refs.closemodalDelete.click();
        }
        if(document.querySelector(".trChild")){
            document.querySelectorAll(".trChild").forEach(item => {
                item.remove();
            });
        }
    }

    getAll = async (activo) => {
        this.setState({ loading: true });

        await RolDataService.getAll({activo: activo})
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

    resetFields() {
        let fields = validForm.resetObject(Object.assign({}, fieldsConst));

        this.setState({ fields: fields, errors: validForm.cleanErrors(this.state.errors) }, function () {

        });
    }

    Nuevo = () => {
        this.props.history.push({
            pathname: '/rol-accion',
            search: ``
        });
    }

    render() {
        return (
            <div className="paginaRol">
                <Spinner show={this.state.loading} />

                <div className={`message-box message-box-${this.state.fields.activo ? "danger" : "info"} animated fadeIn`} id="modal-delete">
                    <form name="UsuarioForm" className="form-horizontal" onSubmit={this.deleteSubmit.bind(this)}>
                        <div className="mb-container">
                            <div className="mb-middle">
                                <div className="mb-title"><span className={`fa fa-${this.state.fields.activo ? "eraser" : "check"}`}></span>{this.state.fields["activo"] ? "Desactivar" : "Activar"} Rol</div>
                                <div className="mb-content">
                                    <p>{`¿Está seguro que desea ${this.state.fields["activo"] ? "desactivar" : "activar"} al rol ${this.state.fields["nombre"]}? Puede volver a ${this.state.fields.activo ? "activarla" : "desactivarla"} en cualquier momento.`}</p>
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
                    <li><a href="/">Roles</a></li>
                </ul>
                <div className="content-frame">
                    <div className="content-frame-top">
                        <div className="row">
                            <div className="panel panel-default ">
                                <div className="panel-heading">
                                    <h3 className="panel-title"><i className="fa fa-male"></i> Roles</h3>
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
                                                    spanError=""
                                                ></Select>
                                            </div>
                                        </li>
                                        <li>
                                            <ValidarPermiso
                                                IdModuloPermisoValidar={ModuloPermiso.Roles.Nuevo}
                                                DefaultTemplate=
                                                    {
                                                        <button
                                                            data-toggle="modal"
                                                            data-target="#modal"
                                                            className="btn btn-primary pull-right"
                                                            onClick={async () => {
                                                                this.Nuevo();
                                                            }}>
                                                            <i className="fa fa-plus"></i> Nuevo rol
                                                        </button>
                                                    }
                                            />
                                        </li>
                                    </ul>
                                </div>
                                <div className="panel-body">
                                    <div>
                                        <ValidarPermiso
                                            IdModuloPermisoValidar={ModuloPermiso.Roles.ObtenerTodos}
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

export default Rol;
