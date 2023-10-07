import React, { Component } from 'react';
import TableReact from "../../../Components/TableReact";
import RolesPorUsuarioDataService from "../../../Services/Base/Usuario/RolesPorUsuario.Service";
import CuentaUsuarioDataService from "../../../Services/Base/Usuario/UsuarioCuenta.Service";
import SucursalCuentaUsuarioRolModuloPermisoRolDataService from "../../../Services/Base/Usuario/SucursalCuentaUsuarioRolModuloPermisoRol.Service";
import Spinner from '../../../Components/Spinner';
import Input from '../../../Components/Input';
import ValidForm from "../../../Utils/ValidForm";
import Select from '../../../Components/Select';
import { ModuloPermiso } from "../../../Permisos/ModuloPermiso";
import ValidarPermiso from "../../../Permisos/ValidarPermiso";
import RolDataService from "../../../Services/Base/Usuario/Rol.Service";

const validForm = new ValidForm();
const fieldsConst = { id: 0, idSucursalCuentaUsuario: '', idRol: '', activo: false };
const errorsConst = { id: 0, idSucursalCuentaUsuario: '', idRol: '', activo: false };
const SelectRoles = { value: '', label: "Filtrar por rol" };
const GetKeys = (obj, prefix = '') =>
    Object.keys(obj).reduce((res, el) => {
        if (Array.isArray(obj[el])) {
            return res;
        } else if (typeof obj[el] === 'object' && obj[el] !== null) {
            return [...res, ...GetKeys(obj[el], prefix + el + '.')];
        }
        return [...res, prefix + el];
    }, []);

class RolesPorUsuario extends Component {
    constructor(props) {
        super(props);

        this.idSucursalCuentaUsuario = this.getSucursalUsuarioCuentaIdFromUrl();
        fieldsConst.idSucursalCuentaUsuario = this.idSucursalCuentaUsuario;
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
                            Header: "idRol",
                            accessor: "rol_id"
                        },
                        {
                            Header: "Rol",
                            accessor: "rol_nombre"
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
                            Cell: (tableProps) => {
                                return (
                                    <ValidarPermiso
                                        IdModuloPermisoValidar={ModuloPermiso.RolesPorUsuario.Obtener}
                                        DefaultTemplate=
                                            {
                                                <a
                                                    href={`#/rol-usuario-accion?idSucursalCuentaUsuario=${this.state.idSucursalCuentaUsuario}&idSucursalCuentaUsuarioRol=${tableProps.row.values.id}`}
                                                    className="btn btn-info editar"
                                                    style={{width: '100%'}}
                                                >
                                                    <i className="fa fa-edit"></i> Editar
                                                </a>
                                            }
                                    />
                                );
                            }
                        },
                        {
                            Header: 'Activar/Desactivar',
                            id: 'actdesc',
                            accessor: (str) => 'actdesc',
                            Cell: (tableProps) => (
                                <ValidarPermiso
                                    IdModuloPermisoValidar={ModuloPermiso.RolesPorUsuario.Eliminar}
                                    DefaultTemplate=
                                        {

                                            <button
                                                data-toggle="modal"
                                                data-target="#modal-delete"
                                                className={`btn btn-${tableProps.row.values.activo ? "danger" : "info"} eliminar`}
                                                style={{ width: '100%' }}
                                                data-id={tableProps.row.values.id}
                                                data-rolnombre={tableProps.row.values.rol_nombre}
                                                data-activo={tableProps.row.values.activo}
                                            >
                                                <i className="fa fa-eraser"></i> {tableProps.row.values.activo  ? "Desactivar" : "Activar"}
                                            </button>
                                        }
                                />
                            )
                        }
                    ]
                }
            ],
            hiddenColumns: ["id", "rol_id"],
            data: [],
            fields: fieldsConst,
            errors: errorsConst,
            loading: true,
            idSucursalCuentaUsuario: this.idSucursalCuentaUsuario,
            usuario: '',
            email: '',
            tipoUsuario: '',
            idTipoUsuario: '',
            filterRoles: SelectRoles,
            filterActive: { value: 1, label: "Activo" },
            dataSelectRolesIndex: [SelectRoles],
            dataSelectRolesModal:[],
            dataSelectActive: [{ value: '', label: "Filtrar por activo" }, { value: 1, label: "Activo" }, { value: 0, label: "Inactivo" }],
            checked: [],
            expanded: [],
            rolNombre: ''
        }
    }

    getSucursalUsuarioCuentaIdFromUrl(){
        const search = this.props.location.search;
        const params = new URLSearchParams(search);
        return params.get('sucursal_usuario_cuenta_id');
    }

    async componentDidMount() {
        await this.getUsuario();
        await this.getSelectRoles();
        let idSucursalCuentaUsuario = this.getSucursalUsuarioCuentaIdFromUrl();
        await this.getAll(this.state.filterActive.value, this.state.filterRoles.value, idSucursalCuentaUsuario);
    }
    componentWillUnmount() {
        this.setState({ loading: false });
    }

    async handleClick(e) {
        let element = e.target;
        //Start Ver Usuario
        if (element.classList.contains("verUsuarios")) {
            let id = Number(element.getAttribute("data-id"));
            let sucursalNombre = element.getAttribute("data-sucursalnombre");

            this.props.history.push({
                pathname: '/usuario-sucursal',
                search: `?idSucursal=${id}&sucursalNombre=${sucursalNombre}`
            });
        }
        else if (element.parentNode.classList.contains("verUsuarios")) {
            let id = Number(element.parentNode.getAttribute("data-id"));
            let sucursalNombre = element.parentNode.getAttribute("data-sucursalnombre");

            this.props.history.push({
                pathname: '/usuario-sucursal',
                search: `?idSucursal=${id}&sucursalNombre=${sucursalNombre}`
            });
        }
        //End Ver Usuario

        //Start Eliminar
        if (element.classList.contains("eliminar")) {
            let idSucursalCuentaUsuarioRol = Number(element.getAttribute("data-id"));
            let rolNombre = element.getAttribute("data-rolnombre");
            let activo = (element.getAttribute("data-activo") === '1');

            this.setState(prevState => ({
                ...prevState,
                rolNombre: rolNombre,
                fields: {
                    ...prevState.fields,
                    id: idSucursalCuentaUsuarioRol,
                    activo: activo
                }
            }));
        }
        else if (element.parentNode.classList.contains("eliminar")) {
            let idSucursalCuentaUsuarioRol = Number(element.parentNode.getAttribute("data-id"));
            let rolNombre = element.parentNode.getAttribute("data-rolnombre");
            let activo = (element.parentNode.getAttribute("data-activo") === '1');

            this.setState(prevState => ({
                ...prevState,
                rolNombre: rolNombre,
                fields: {
                    ...prevState.fields,
                    id: idSucursalCuentaUsuarioRol,
                    activo: activo
                }
            }));
        }
        //End Eliminar
    }

    saveSubmit = async (e) => {
        e.preventDefault();
        let errors = this.state.errors;
        errors = validForm.cleanErrors(errors);
        this.setState({ errors: errors, loading: true });

        let responseData;
        let data = this.getDataFromState();

        if (this.state.fields["idSucursal"] === 0) {
            await RolesPorUsuarioDataService.create(data)
                .then(response => {
                    responseData = response.data;
                })
                .catch(function (error) {
                    errors = validForm.displayErrors(error.response.data.errors, errors);
                });
        }
        else {
            await RolesPorUsuarioDataService.update(data)
                .then(response => {
                    responseData = response.data;
                })
                .catch(function (error) {
                    errors = validForm.displayErrors(error.response.data.errors, errors);
                });
        }
        this.setState({ errors: errors, loading: false });
        if (responseData != null) {
            this.getAll(this.state.filterActive.value
                , this.state.filterTipoSucursal.value
                , this.state.filterPais.value
                , this.state.filterEstado.value
                , this.state.filterMunicipio.value);
            this.refs.closemodalSave.click();
            this.resetFields();
        }
    }

    deleteSubmit = async (e) => {
        e.preventDefault();
        let errors = this.state.errors;
        errors = validForm.cleanErrors(errors);
        this.setState({ errors: errors, loading: true });

        let responseData;
        await SucursalCuentaUsuarioRolModuloPermisoRolDataService.delete(this.state.fields["id"])
            .then(response => {
                responseData = response.data;
            })
            .catch(function (error) {
                errors = validForm.displayErrors(error.response.data.errors, errors);
            });

        this.setState({ errors: errors, loading: false });
        if (responseData != null) {
            await this.getAll(this.state.filterActive.value, this.state.filterRoles.value, this.state.idSucursalCuentaUsuario);
            this.refs.closemodalDelete.click();
        }
        if(document.querySelector(".trChild")){
            document.querySelectorAll(".trChild").forEach(item => {
                item.remove();
            });
        }
    }

    getAll = async (activo, rol_id, sucursal_usuario_cuenta_id) => {
        this.setState({ loading: true });
        await RolesPorUsuarioDataService.getAllRoles({
            activo: activo,
            rol_id: rol_id,
            sucursal_usuario_cuenta_id: sucursal_usuario_cuenta_id
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

    getUsuario = async () => {
        this.setState({ loading: true });
        var idSucursalCuentaUsuario = this.state.idSucursalCuentaUsuario;
        await CuentaUsuarioDataService.getDto({
            sucursal_usuario_cuenta_id: idSucursalCuentaUsuario
        })
            .then(response => {
                if (Object.keys(response.data).length > 0) {
                    let usuario = response.data;
                    this.setState({
                        usuario: usuario.nombre_completo,
                        email: usuario.email,
                        tipoUsuario: usuario.tipo_usuario,
                        idTipoUsuario: usuario.tipo_usuario_id
                    });
                }
                this.setState({ loading: false });
            })
            .catch(e => {
                console.log(e);
            });
    }

    getSelectRoles = async () => {
        this.setState({ loading: true });
        let idTipoUsuario = this.state.idTipoUsuario;
        await RolDataService.getAllByIdTipoUsuario(idTipoUsuario)
            .then(response => {
                console.log(response.data)
                if (response.data.length > 0) {
                    response.data.map(SelecRol => {
                        this.state.dataSelectRolesIndex.push({
                            value: SelecRol.id,
                            label: SelecRol.nombre
                        });

                    });
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

        target.idSucursal = this.idSucursal;

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

        fields["idRolSelect"] = '';

        this.setState({ fields: fields });
    }

    resetSelectOptionsModal = () => {
        let fields = this.state.fields;

        this.setState({ fields: fields, dataSelectUsuarioModal: [] });
    }

    resetModal = () => {
        this.resetFields();
    }

    handleFilterActive = async (selectActive) => {
        this.setState({ filterActive: selectActive });
        await this.getAll(selectActive.value, this.state.filterRoles.value, this.state.idSucursalCuentaUsuario);
    }

    handleFilterRoles = async (selectRol) => {
        this.setState({ filterRoles: selectRol });
        await this.getAll(this.state.filterActive.value, selectRol.value, this.state.idSucursalCuentaUsuario);
    }

    nuevo = () => {
        this.setState({ loading: true });
        let idSucursalCuentaUsuario = this.state.idSucursalCuentaUsuario;
        this.props.history.push({
            pathname: '/rol-usuario-accion',
            search: `?idSucursalCuentaUsuario=${idSucursalCuentaUsuario}`
        });
        this.setState({ loading: false });
    }

    render() {
        return (
            <div className="paginaRolPorUsuario">
                <Spinner show={this.state.loading} />

                <div className={`message-box message-box-${this.state.fields.activo ? "danger" : "info"} animated fadeIn`} id="modal-delete">
                    <form name="RolPorUsuarioForm" className="form-horizontal" onSubmit={this.deleteSubmit.bind(this)}>
                        <div className="mb-container">
                            <div className="mb-middle">
                                <div className="mb-title"><span className={`fa fa-${this.state.fields.activo ? "eraser" : "check"}`}></span>{this.state.fields["activo"] ? "Desactivar" : "Activar"} rol del usuario</div>
                                <div className="mb-content">
                                    <p>{`¿Está seguro que desea ${this.state.fields["activo"] === true ? "desactivar" : "activar"} el rol ${this.state["rolNombre"]} para el usuario ${this.state["usuario"]}? Puede volver a ${this.state.fields.activo ? "activarla" : "desactivarla"} en cualquier momento.`}</p>
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
                    <li><a href="/">Usuarios por sucursal</a></li>
                    <li><a href="/">Roles por usuario</a></li>
                </ul>
                <div className="content-frame">
                    <div className="content-frame-top">
                        <div className="page-title">
                            <h2><span className="fa fa-male"></span> Roles por usuario</h2>
                        </div>
                        <hr />
                        <div className="row">
                            <div className="panel panel-default ">
                                <div className="panel-heading">
                                    <h3 className="panel-title"><i className="fa fa-building"></i>Roles del usuario: {
                                        this.state.usuario}</h3>
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
                                            <div style={{ minWidth: "150px" }}>
                                                <Select
                                                    divClass=""
                                                    selectplaceholder="Seleccione"
                                                    selectValue={this.state.filterRoles}
                                                    selectOnchange={this.handleFilterRoles}
                                                    selectoptions={this.state.dataSelectRolesIndex}
                                                    selectIsSearchable={false}
                                                    selectclassNamePrefix="selectReact__value-container"
                                                    spanClass=""
                                                    spanError=""
                                                />
                                            </div>
                                        </li>
                                        <li>
                                            <ValidarPermiso
                                                IdModuloPermisoValidar={ModuloPermiso.RolesPorUsuario.Nuevo}
                                                DefaultTemplate=
                                                    {
                                                        <button
                                                            data-toggle="modal"
                                                            data-target="#modal"
                                                            className="btn btn-primary pull-right"
                                                            onClick={async () => {
                                                                this.nuevo();
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
                                            IdModuloPermisoValidar={ModuloPermiso.RolesPorUsuario.ObtenerTodos}
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
        );
    }
}

export default RolesPorUsuario;
