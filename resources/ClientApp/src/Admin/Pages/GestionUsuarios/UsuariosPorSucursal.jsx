import React, { Component } from 'react';
import TableReact from "../../../Components/TableReact";
import UsuariosPorSucursalDataService from "../../../Services/Base/Usuario/UsuariosPorSucursal.Service";
import UsuarioCuentaDataService from "../../../Services/Base/Usuario/UsuarioCuenta.Service";
import SucursalDataService from "../../../Services/Base/Catalogo/Sucursal.Service";
import Spinner from '../../../Components/Spinner';
import ValidForm from "../../../Utils/ValidForm";
import Input from '../../../Components/Input';
import Select from '../../../Components/Select';
import { ModuloPermiso } from "../../../Permisos/ModuloPermiso";
import ValidarPermiso from "../../../Permisos/ValidarPermiso";
import AuthLogin from "../../../Utils/AuthLogin";
const auth = new AuthLogin();

const validForm = new ValidForm();
const fieldsConst = { sucursal_id: '', usuario_cuenta_id: '', nombre_completo: '', email: '', roles: '', activo: false};
const errorsConst = { sucursal_id: '', usuario_cuenta_id: '', nombre_completo: '', email: '', roles: '', activo: ''};
const GetKeys = (obj, prefix = '') =>
    Object.keys(obj).reduce((res, el) => {
        if (Array.isArray(obj[el])) {
            return res;
        } else if (typeof obj[el] === 'object' && obj[el] !== null) {
            return [...res, ...GetKeys(obj[el], prefix + el + '.')];
        }
        return [...res, prefix + el];
    }, []);

class UsuariosPorSucursal extends Component {
    constructor(props) {
        super(props);
        const search = this.props.location.search;
        const params = new URLSearchParams(search);
        this.sucursal_id = params.get('sucursal_id');
        fieldsConst.sucursal_id = this.sucursal_id;

        this.handleClick = this.handleClick.bind(this);
        document.addEventListener('click', this.handleClick, true);
        this.state = {
            columns: [
                {
                    Header: "Sucursal",
                    columns: [
                        {
                            Header: "sucursal_usuario_cuenta_id",
                            accessor: "sucursal_usuario_cuenta_id"
                        },
                        {
                            Header: "sucursal_id",
                            accessor: "sucursal_id"
                        },
                        {
                            Header: "Usuario",
                            accessor: "nombre_completo"
                        },
                        {
                            Header: "Email",
                            accessor: "email"
                        },
                        {
                            Header: "Roles",
                            id: 'roles',
                            accessor: "roles",
                            Cell: (tableProps) => {
                                let roles = tableProps.row.values.roles
                                    ? tableProps.row.values.roles
                                    : "Sin rol";

                                return (
                                    <div>{roles}</div>
                                );
                            }
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
                            Header: 'Ver roles',
                            id: 'verRoles',
                            accessor: (str) => 'verRoles',
                            Cell: (tableProps) => (
                                <ValidarPermiso
                                    IdModuloPermisoValidar={ModuloPermiso.RolesPorUsuario.Index}
                                    DefaultTemplate=
                                        {
                                            <a href={`#/rol-usuario?sucursal_usuario_cuenta_id=${tableProps.row.values.sucursal_usuario_cuenta_id}`}
                                               className="btn btn-warning verRoles"
                                               style={{ width: '100%' }}>
                                                <i className="fa fa-tasks"></i> Ver Roles
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
                                    IdModuloPermisoValidar={ModuloPermiso.UsuariosPorSucursal.Eliminar}
                                    DefaultTemplate=
                                        {
                                            <button
                                                data-toggle="modal"
                                                data-target="#modal-delete"
                                                className={`btn btn-${tableProps.row.values.activo ? "danger" : "info"} eliminar`}
                                                style={{ width: '100%' }}
                                                data-id={tableProps.row.values.sucursal_usuario_cuenta_id}
                                                data-nombre_completo={tableProps.row.values.nombre_completo}
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
            hiddenColumns: ["sucursal_usuario_cuenta_id", "sucursal_id"],
            data: [],
            fields: Object.assign({}, fieldsConst),
            errors: Object.assign({}, errorsConst),
            loading: true,
            sucursal_id: this.sucursal_id,
            sucursalNombre: '',
            filterActive: { value: 1, label: "Activo" },
            dataSelectActive: [{ value: '', label: "Filtrar por activo" }, { value: 1, label: "Activo" }, { value: 0, label: "Inactivo" }],
            dataSelectUsuarioModal: []

        }
    }
    async componentDidMount() {
        await this.getSucursal(this.state.sucursal_id);
        await this.getAll(this.state.filterActive.value, this.state.sucursal_id);
    }

    async handleClick(e) {
        let element = e.target;

        // Start Eliminar
        if (element.classList.contains("eliminar")) {
            let id = Number(element.getAttribute("data-id"));
            let nombre_completo = element.getAttribute("data-nombre_completo");
            let activo = (element.getAttribute("data-activo") === '1');
            this.setState(prevState => ({
                ...prevState,
                fields: {
                    ...prevState.fields,
                    sucursal_usuario_cuenta_id: id,
                    nombre_completo: nombre_completo,
                    activo: activo
                }
            }));
        }
        else if (element.parentNode.classList.contains("eliminar")) {
            let id = Number(element.parentNode.getAttribute("data-id"));
            let nombre_completo = element.parentNode.getAttribute("data-nombre_completo");
            let activo = (element.getAttribute("data-activo") === '1');

            this.setState(prevState => ({
                ...prevState,
                fields: {
                    ...prevState.fields,
                    sucursal_usuario_cuenta_id: id,
                    nombre_completo: nombre_completo,
                    activo: activo
                }
            }));

        }
        //End Eliminar
    }

    deleteSubmit = async (e) => {
        e.preventDefault();
        let errors = this.state.errors;
        errors = validForm.cleanErrors(errors);
        this.setState({ errors: errors, loading: true });

        let responseData;
        await UsuariosPorSucursalDataService.deleteAll(this.state.fields["sucursal_usuario_cuenta_id"])
            .then(response => {
                responseData = response.data;
            })
            .catch(function (error) {
                errors = validForm.displayErrors(error.response.data.errors, errors);
            });

        this.setState({ errors: errors, loading: false });
        if (responseData != null) {
            await this.getAll(this.state.filterActive.value, this.state.sucursal_id);
            this.refs.closemodalDelete.click();
        }
        if(document.querySelector(".trChild")){
            document.querySelectorAll(".trChild").forEach(item => {
                item.remove();
            });
        }
    }

    saveSubmit = async (e) => {
        e.preventDefault();
        let errors = this.state.errors;
        errors = validForm.cleanErrors(errors);
        this.setState({ errors: errors, loading: true });

        let responseData;
        let data = this.getDataFromState();
        if (this.state.fields["usuario_cuenta_id"]) {
            Object.assign(data, { user: auth.username() });
            await UsuariosPorSucursalDataService.create(data)
                .then(response => {
                    responseData = response.data;
                })
                .catch(function(error) {
                    errors = validForm.displayErrors(error.response.data.errors, errors);
                });
        }

        this.setState({ errors: errors, loading: false });
        if (responseData != null) {
            this.getAll(this.state.filterActive.value, this.state.sucursal_id);
            this.refs.closemodalSave.click();
        }
    }

    getAll = async (idFilterActive, sucursal_id) => {
        this.setState({ loading: true });

        await UsuariosPorSucursalDataService.getAll({
            activo: idFilterActive,
            sucursal_id: sucursal_id

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

    getSelectUsuarios = async (sucursal_id) => {
        this.setState({ loading: true });
        await UsuariosPorSucursalDataService.getUsuariosFaltantesEnSucursal({
            activo: 1,
            sucursal_id: sucursal_id
        })
            .then(response => {
                if (response.data.length > 0) {
                    let responseData =response.data;

                    responseData.map(SelectUsuario => {
                        let value, label, email,tipoUsuario;
                        value = SelectUsuario.usuario_cuenta_id;
                        label = SelectUsuario.nombre_completo;
                        email = SelectUsuario.email;
                        tipoUsuario = SelectUsuario.tipo_usuario;

                        this.state.dataSelectUsuarioModal.push({
                            value: value,
                            label: label,
                            email: email,
                            tipoUsuario: tipoUsuario
                        });

                    });
                }
                this.setState({ loading: false });
            })
            .catch(e => {
                console.log(e);
            });
    }

    getSucursal = async (sucursal_id) => {
        this.setState({ loading: true });
        await SucursalDataService.get(sucursal_id)
            .then(response => {
                if (Object.keys(response.data).length > 0) {
                    this.setState({ sucursalNombre: response.data.nombre });
                }
                this.setState({ loading: false });
            })
            .catch(e => {
                console.log(e);
            });
    }

    getDataFromState = () => {
        let source = Object.assign({}, this.state.fields);
        let target = Object.assign({}, fieldsConst);
        let keys = GetKeys(target);

        Object.entries(source).forEach(entry => {
            const [key, value] = entry;

            for (let i = 0; i < keys.length; i++) {
                if (key === keys[i]) {
                    this.setValueFromObject(keys[i], value, target);
                    keys.splice(i, 1);
                    break;
                }
            }
        });

        target.sucursal_id = this.sucursal_id;

        return target;
    }

    setValueFromObject = (path, value, obj) => {
        let schema = obj;  // a moving reference to internal objects within obj
        let pList = path.split('.');
        let len = pList.length;
        for (let i = 0; i < len - 1; i++) {
            let elem = pList[i];
            if (!schema[elem]) schema[elem] = {}
            schema = schema[elem];
        }

        schema[pList[len - 1]] = value;
    }

    resetFields() {
        let fields = validForm.resetObject(Object.assign({}, fieldsConst));

        this.setState({ fields: fields, errors: validForm.cleanErrors(this.state.errors) }, function () {
            //el metodo setState es asyncrono se tiene que poner aqui el resto de las funciones para que se ejecute en orden.
            this.resetSelectValueModal();
            this.resetSelectOptionsModal();
        });
    }

    resetSelectValueModal = () => {
        let fields = this.state.fields;

        fields["idUsuarioSelect"] = '';

        this.setState({ fields: fields });
    }

    resetSelectOptionsModal = () => {
        let fields = this.state.fields;

        this.setState({ fields: fields, dataSelectUsuarioModal: [] });
    }

    handleFilterActive = async (selectActive) => {
        this.setState({ filterActive: selectActive });
        await this.getAll(selectActive.value, this.state.sucursal_id);
    }

    resetModal = () => {
        this.resetFields();
    }

    openModal = async () => {
        await this.getSelectUsuarios(this.state.sucursal_id);
    }

    render() {
        return (
            <div>
                <Spinner show={this.state.loading} />

                <div className={`message-box message-box-${this.state.fields["activo"] ? "danger" : "info"} animated fadeIn`} id="modal-delete">
                    <form name="UsuarioForm" className="form-horizontal" onSubmit={this.deleteSubmit.bind(this)}>
                        <div className="mb-container">
                            <div className="mb-middle">
                                <div className="mb-title"><span className={`fa fa-${this.state.fields["activo"] ? "eraser" : "check"}`}></span>{this.state.fields["activo"] ? "Desactivar" : "Activar"} usuario en la sucursal</div>
                                <div className="mb-content">
                                    <p>{`¿Está seguro que desea ${this.state.fields["activo"] ? "desactivar" : "activar"} al usuario ${this.state.fields["nombre_completo"]} en esta sucursal? Puede volver a ${this.state.fields["activo"] ? "activarla" : "desactivarla"} en cualquier momento.`}</p>
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


                <div className="modal" id="modal" tabIndex="-1" role="dialog" aria-labelledby="largeModalHead" aria-hidden="true">
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <button
                                    type="button"
                                    className="close"
                                    onClick={async () => {
                                        this.resetModal();
                                    }}
                                    data-dismiss="modal">
                                    <span aria-hidden="true">&times;</span><span className="sr-only">Cerrar</span></button>
                                <h4 className="modal-title" id="largeModalHead"><i className="fa fa-list"></i> {
                                    this.state.fields["sucursal_usuario_cuenta_id"] ? "Nuevo" : "Editar"} usuario </h4>
                            </div>
                            <div className="modal-body">
                                <form
                                    name="sucursalCuentaUsuarioForm"
                                    className="form-horizontal"
                                    onSubmit={this.saveSubmit.bind(this)}
                                >
                                    <div className="row">
                                        <div className="form-group">
                                            <div className="col-md-4">
                                                <label htmlFor="">Usuario</label>
                                                <Select
                                                    divClass="input-group"
                                                    selectplaceholder="Seleccione"
                                                    selectValue={this.state.fields["usuario_cuenta_idSelect"] || ''}
                                                    selectOnchange={e => {
                                                        let fields = this.state.fields;
                                                        let errors = this.state.errors;
                                                        fields = validForm.handleSelectChangeField(
                                                            "usuario_cuenta_idSelect",
                                                            fields,
                                                            e);
                                                        errors = validForm.handleSelectChangeErrors(
                                                            "usuario_cuenta_idSelect",
                                                            errors,
                                                            e);
                                                        this.setState({ fields: fields, errors: errors });

                                                        this.setState(prevState => ({
                                                            ...prevState,
                                                            fields: {
                                                                ...prevState.fields,
                                                                usuario_cuenta_id: e.value,
                                                                nombre_completo: e.label,
                                                                email: e.email,
                                                                tipoUsuario: e.tipoUsuario
                                                            }
                                                        }));
                                                    }}
                                                    selectoptions={this.state.dataSelectUsuarioModal}
                                                    selectIsSearchable={true}
                                                    selectclassNamePrefix="selectReact__value-container"
                                                    spanClass="error"
                                                    spanError={this.state.errors["usuario_cuenta_id"] || ''}
                                                    divClassSpanType={1}
                                                    divClassSpan="input-group-addon"
                                                    divClassSpanI="fa fa-indent" />
                                            </div>
                                            <div className="col-md-4">
                                                <label htmlFor="">Email</label>
                                                <Input
                                                    divClass="input-group"
                                                    inputName="nombre_completo"
                                                    inputType="text"
                                                    inputClass="form-control"
                                                    inputplaceholder="Email"
                                                    inputValue={this.state.fields["email"] || ''}
                                                    inputOnchange={e => {
                                                        let fields = this.state.fields;
                                                        let errors = this.state.errors;
                                                        fields = validForm.handleChangeField("email", fields, e);
                                                        errors = validForm.handleChangeErrors("email", errors, e);
                                                        this.setState({ fields: fields, errors: errors });
                                                    }}
                                                    spanClass="error"
                                                    spanError={this.state.errors["email"] || ''}
                                                    divClassSpanType={1}
                                                    divClassSpan="input-group-addon"
                                                    divClassSpanI="fa fa-indent"
                                                    readOnly="true"
                                                />
                                            </div>
                                            <div className="col-md-4">
                                                <label htmlFor="">Tipo de usuario</label>
                                                <Input
                                                    divClass="input-group"
                                                    inputName="nombre_completo"
                                                    inputType="text"
                                                    inputClass="form-control"
                                                    inputplaceholder="Nombre de nombre_completo"
                                                    inputValue={this.state.fields["tipoUsuario"] || ''}
                                                    inputOnchange={e => {
                                                        let fields = this.state.fields;
                                                        let errors = this.state.errors;
                                                        fields = validForm.handleChangeField("tipoUsuario", fields, e);
                                                        errors = validForm.handleChangeErrors("tipoUsuario", errors, e);
                                                        this.setState({ fields: fields, errors: errors });
                                                    }}
                                                    spanClass="error"
                                                    spanError={this.state.errors["tipoUsuario"] || ''}
                                                    divClassSpanType={1}
                                                    divClassSpan="input-group-addon"
                                                    divClassSpanI="fa fa-indent"
                                                    readOnly="true"
                                                />
                                            </div>

                                        </div>
                                    </div>
                                    <hr />
                                    <div className="panel-footer">
                                        <button
                                            type="button"
                                            className="btn btn-default"
                                            data-dismiss="modal"
                                            onClick={async () => {
                                                this.resetModal();
                                            }}
                                            ref="closemodalSave">Cerrar
                                        </button>
                                        <button className="btn btn-primary pull-right">
                                            <i className="fa fa-save"></i> Guardar
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>

                <ul className="breadcrumb push-down-0">
                    <li><a href="/">Gestión de usuarios</a></li>
                    <li><a href="/">Asignación de usuarios</a></li>
                    <li><a href="/">Usuarios por sucursal</a></li>
                </ul>
                <div className="content-frame">
                    <div className="content-frame-top">
                        <div className="page-title">
                            <h2><span className="fa fa-male"></span> Usuarios por sucursal</h2>
                        </div>
                        <hr />
                        <div className="row">
                            <div className="panel panel-default ">
                                <div className="panel-heading">
                                    <h3 className="panel-title"><i className="fa fa-building"></i>Sucursal: {this.state.sucursalNombre }</h3>
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
                                                />
                                            </div>
                                        </li>
                                        <li>
                                            <ValidarPermiso
                                                IdModuloPermisoValidar={ModuloPermiso.UsuariosPorSucursal.Nuevo}
                                                DefaultTemplate=
                                                    {
                                                        <button
                                                            data-toggle="modal"
                                                            data-target="#modal"
                                                            className="btn btn-primary pull-right"
                                                            onClick={async () => {
                                                                this.resetModal();
                                                                await this.openModal();
                                                            }}>
                                                            <i className="fa fa-plus"></i> Nuevo registro
                                                        </button>
                                                    }
                                            />
                                        </li>
                                    </ul>
                                </div>
                                <div className="panel-body">
                                    <div>
                                        <ValidarPermiso
                                            IdModuloPermisoValidar={ModuloPermiso.UsuariosPorSucursal.ObtenerTodos}
                                            DefaultTemplate=
                                                {
                                                    <TableReact
                                                        columns={this.state.columns}
                                                        data={this.state.data}
                                                        hiddenColumns={this.state.hiddenColumns}
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

export default UsuariosPorSucursal;
