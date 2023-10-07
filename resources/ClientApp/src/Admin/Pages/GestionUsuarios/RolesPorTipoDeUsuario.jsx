import React, { Component } from 'react';
import TableReact from "../../../Components/TableReact";
import RolTipoUsuarioDataService from "../../../Services/Base/Usuario/RolTipoUsuario.Service";
import RolDataService from "../../../Services/Base/Usuario/Rol.Service";
import TipoUsuarioDataService from "../../../Services/Base/Usuario/TipoUsuario.Service";
import Spinner from '../../../Components/Spinner';
import ValidForm from "../../../Utils/ValidForm";
import Select from '../../../Components/Select';
import { ModuloPermiso } from "../../../Permisos/ModuloPermiso";
import ValidarPermiso from "../../../Permisos/ValidarPermiso";
import Input from '../../../Components/Input';
import AuthLogin from "../../../Utils/AuthLogin";

const validForm = new ValidForm();
const auth = new AuthLogin();
const fieldsConst = { id: 0, rol_id: 0, tipo_usuario_id:0, activo: false };
const errorsConst = { id: '', rol_id: '', tipo_usuario_id: '', activo: '' };
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

class RolesPorTipoDeUsuario extends Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
        document.addEventListener('click', this.handleClick, true);

        const search = this.props.location.search;
        const params = new URLSearchParams(search);
        this.tipo_usuario_id = params.get('idTipoUsuario');
        fieldsConst.tipo_usuario_id = this.tipo_usuario_id || "0";

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
                            Header: 'Activar/Desactivar',
                            id: 'actdesc',
                            accessor: (str) => 'actdesc',
                            Cell: (tableProps) => (
                                <ValidarPermiso
                                    IdModuloPermisoValidar={ModuloPermiso.RolesPorTipoDeUsuario.Eliminar}
                                    DefaultTemplate=
                                        {

                                            <button
                                                data-toggle="modal"
                                                data-target="#modal-delete"
                                                className={`btn btn-${tableProps.row.values.activo ? "danger" : "info"} eliminar`}
                                                style={{ width: '100%' }}
                                                data-id={tableProps.row.values.id}
                                                data-nombre={tableProps.row.values.rol_nombre}
                                                data-activo={tableProps.row.values.activo}
                                            >
                                                <i className="fa fa-eraser"></i>
                                                {tableProps.row.values.activo ? "Desactivar" : "Activar"}
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
            filterRoles: SelectRoles,
            dataSelectRolesIndex: [SelectRoles],
            dataSelectRolesModal: [],
            dataSelectActive: [{ value: '', label: "Filtrar por activo" }, { value: 1, label: "Activo" }, { value: 0, label: "Inactivo" }],
            tipoUsuarioNombre: '',
            tipo_usuario_id: this.tipo_usuario_id
        }
    }

    async componentDidMount() {
        await this.getTipoUsuario();
        await this.getSelectRoles();
        await this.getAll(this.state.filterActive.value,
            this.state["tipo_usuario_id"],
            this.state.filterRoles.value);
    }

    handleFilterActive = async (selectActive) => {
        this.setState({ filterActive: selectActive });
        await this.getAll(selectActive.value, this.state["tipo_usuario_id"], this.state.filterRoles.value);
    }

    handlefilterRoles = async (selectRol) => {
        this.setState({ filterRoles: selectRol });
        await this.getAll(this.state.filterActive.value, this.state["tipo_usuario_id"], selectRol.value);
    }

    async handleClick(e) {
        let element = e.target;

        if (element.classList.contains("editar")) {
            let id = Number(element.getAttribute("data-id"));
            let nombre = element.getAttribute("data-nombre");

            this.setState(prevState => ({
                ...prevState,
                fields: {
                    ...prevState.fields,
                    tipo_usuario_id: id,
                    nombre: nombre
                }
            }));
        }
        else if (element.parentNode.classList.contains("editar")) {
            let id = Number(element.getAttribute("data-id"));
            let nombre = element.getAttribute("data-nombre");

            this.setState(prevState => ({
                ...prevState,
                fields: {
                    ...prevState.fields,
                    tipo_usuario_id: id,
                    nombre: nombre
                }
            }));
        }

        if (element.classList.contains("eliminar")) {
            let id = Number(element.getAttribute("data-id"));
            let nombre = element.getAttribute("data-nombre");
            let activo = (element.getAttribute("data-activo") === '1');
            this.setState(prevState => ({
                ...prevState,
                fields: {
                    ...prevState.fields,
                    tipo_usuario_id: id,
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
                    tipo_usuario_id: id,
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
        let tipo_usuario_id = this.state.fields["tipo_usuario_id"];

        await RolTipoUsuarioDataService.delete(tipo_usuario_id)
            .then(response => {
                responseData = response.data;
            })
            .catch(function (error) {
                errors = validForm.displayErrors(error.response.data.errors, errors);
            });

        this.setState({ errors: errors, loading: false });
        if (responseData != null) {
            await this.getAll(this.state.filterActive.value, this.tipo_usuario_id,
                this.state.filterRoles.value);
            await this.getSelectRoles();
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
        data.user = auth.username();

        if (this.state.fields["id"] === 0) {
            await RolTipoUsuarioDataService.create(data)
                .then(response => {
                    responseData = response.data;
                })
                .catch(function (error) {
                    errors = validForm.displayErrors(error.response.data.errors, errors);
                });
        }

        this.setState({ errors: errors, loading: false });
        if (responseData != null) {
            await this.getAll(this.state.filterActive.value, this.tipo_usuario_id,
                this.state.filterRoles.value);
            await this.getSelectRoles();
            this.refs.closemodalSave.click();
        }
    }

    getAll = async (activo, tipo_usuario_id, rol_id) => {
        this.setState({ loading: true });

        await RolTipoUsuarioDataService.getAllDto(
            {
                activo: activo,
                tipo_usuario_id: tipo_usuario_id,
                rol_id: rol_id
            }
        )
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

    getSelectRoles = async () => {
        this.setState({ loading: true });
        let tipo_usuario_id = this.state["tipo_usuario_id"];
        await RolDataService.getAllByIdTipoUsuario(tipo_usuario_id)
            .then(response => {
                if (Object.keys(response.data).length > 0) {
                    this.state.dataSelectRolesIndex = [SelectRoles];
                    response.data.map(SelectRol => {
                        this.state.dataSelectRolesIndex.push({
                            value: SelectRol.id,
                            label: SelectRol.nombre
                        });
                    });


                }
                this.setState({ loading: false });
            })
            .catch(e => {
                console.log(e);
            });
    }

    getTipoUsuario = async () => {
        this.setState({ loading: true });
        let tipo_usuario_id = this.state.fields["tipo_usuario_id"];
        await TipoUsuarioDataService.get(tipo_usuario_id)
            .then(response => {
                if (Object.keys(response.data).length > 0) {
                    this.setState({
                        tipoUsuarioNombre: response.data.nombre
                    });
                }
                this.setState({ loading: false });
            })
            .catch(e => {
                console.log(e);
            });
    }

    getAllRolesSinAsignarATipoDeUsuario = async () => {
        this.setState({ loading: true });
        let tipo_usuario_id = this.state["tipo_usuario_id"];
        await RolDataService.getAllSinAsignarATipoDeUsuario(tipo_usuario_id)
            .then(response => {
                if (response.data.length > 0) {
                    response.data.map(SelecRol => {
                        this.state.dataSelectRolesModal.push({
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

        target. tipo_usuario_id = this.tipo_usuario_id;

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

    resetFields = async () => {
        let fields = validForm.resetObject(Object.assign({}, fieldsConst));
        this.setState({ fields: fields, errors: validForm.cleanErrors(this.state.errors) }, function () {
        });
    }

    resetModal = () => {
        this.resetFields();
    }

    render() {
        return (
            <div>
                <Spinner show={this.state.loading} />

                <div className={`message-box message-box-${this.state.fields.activo ? "danger" : "info"} animated fadeIn`} id="modal-delete">
                    <form name="RolPorUsuarioForm" className="form-horizontal" onSubmit={this.deleteSubmit.bind(this)}>
                        <div className="mb-container">
                            <div className="mb-middle">
                                <div className="mb-title"><span className={`fa fa-${this.state.fields.activo ? "eraser" : "check"}`}></span>{this.state.fields["activo"] ? "Desactivar" : "Activar"} rol para el tipo de usuario: {this.state.tipoUsuarioNombre}</div>
                                <div className="mb-content">
                                    <p>{`¿Está seguro que desea ${this.state.fields["activo"] ? "desactivar" : "activar"} el rol ${this.state.fields["nombre"]} para el tipo de usuario ${this.state.tipoUsuarioNombre}? Puede volver a ${this.state.fields.activo ? "activarla" : "desactivarla"} en cualquier momento.`}</p>
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
                                    this.state.fields["id"] === 0 ? "Nuevo" : "Editar"} rol </h4>
                            </div>
                            <div className="modal-body">
                                <form
                                    name="sucursalCuentaUsuarioForm"
                                    className="form-horizontal"
                                    onSubmit={this.saveSubmit.bind(this)}
                                >

                                    <Input
                                        divClass="col-md-12"
                                        inputName="tipo_usuario_id"
                                        inputType="hidden"
                                        inputValue={this.state.fields["tipo_usuario_id"]}
                                    />

                                    <div className="row">
                                        <div className="form-group">
                                            <div className="col-md-12">
                                                <label htmlFor="">Rol</label>
                                                <Select
                                                    divClass="input-group"
                                                    selectplaceholder="Seleccione un rol"
                                                    selectValue={this.state.fields["rol_idSelect"] || ''}
                                                    selectOnchange={e => {
                                                        let fields = this.state.fields;
                                                        let errors = this.state.errors;
                                                        fields = validForm.handleSelectChangeField(
                                                            "rol_idSelect",
                                                            fields,
                                                            e);
                                                        errors = validForm.handleSelectChangeErrors(
                                                            "rol_idSelect",
                                                            errors,
                                                            e);
                                                        this.setState({ fields: fields, errors: errors });
                                                    }}
                                                    selectoptions={this.state.dataSelectRolesModal}
                                                    selectIsSearchable={true}
                                                    selectclassNamePrefix="selectReact__value-container"
                                                    spanClass="error"
                                                    spanError={this.state.errors["rol_id"] || ''}
                                                    divClassSpanType={1}
                                                    divClassSpan="input-group-addon"
                                                    divClassSpanI="fa fa-indent" />
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
                    <li><a href="#/tipo-usuario">Tipos de usuario</a></li>
                    <li><a href="/">Roles por tipo de usuario</a></li>
                </ul>
                <div className="content-frame">
                    <div className="content-frame-top">
                        <div className="page-title">
                            <h2><span className="fa fa-male"></span> Roles por tipo de usuario</h2>
                        </div>
                        <hr />
                        <div className="row">
                            <div className="panel panel-default ">
                                <div className="panel-heading">
                                    <h3 className="panel-title"><i className="fa fa-building"></i> Roles del tipo de usuario: {this.state.tipoUsuarioNombre}</h3>
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
                                                    selectOnchange={this.handlefilterRoles}
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
                                                IdModuloPermisoValidar={ModuloPermiso.TiposDeUsuario.Nuevo}
                                                DefaultTemplate=
                                                    {
                                                        <button
                                                            data-toggle="modal"
                                                            data-target="#modal"
                                                            className="btn btn-primary pull-right"
                                                            onClick={async () => {
                                                                this.resetModal();
                                                                await this.getAllRolesSinAsignarATipoDeUsuario();
                                                            }}>
                                                            <i className="fa fa-plus"></i>Nuevo rol
                                                        </button>
                                                    }
                                            />
                                        </li>
                                    </ul>
                                </div>
                                <div className="panel-body">
                                    <div>
                                        <ValidarPermiso
                                            IdModuloPermisoValidar={ModuloPermiso.TiposDeUsuario.ObtenerTodos}
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

export default RolesPorTipoDeUsuario;
