import React, { Component } from 'react';
import TableReact from "../../../Components/TableReact";
import CuentaUsuarioDataService from "../../../Services/Base/Usuario/UsuarioCuenta.Service";
import UtilsDataService from "../../../Services/General/Utils.Service";
import Input from '../../../Components/Input';
import Spinner from '../../../Components/Spinner';
import Select from '../../../Components/Select';
import ValidForm from "../../../Utils/ValidForm";
import { ModuloPermiso } from "../../../Permisos/ModuloPermiso";
import ValidarPermiso from "../../../Permisos/ValidarPermiso";
import moment from 'moment';
import AuthLogin from "../../../Utils/AuthLogin";

const auth = new AuthLogin();
const validForm = new ValidForm();
const SelectTipoUsuario = { value: 0, label: "Filtrar por tipo usuario" };
const GetKeys = (obj, prefix = '') =>
    Object.keys(obj).reduce((res, el) => {
        if (Array.isArray(obj[el])) {
            return res;
        } else if (typeof obj[el] === 'object' && obj[el] !== null) {
            return [...res, ...GetKeys(obj[el], prefix + el + '.')];
        }
        return [...res, prefix + el];
    }, []);

const fieldsConst = {
    id: 0,
    tipo_usuario_id: 0,
    nombre_completo: '',
    email: '',
    password: '',
    password_confirmation: '',
    intentos: 0,
    fecha_suspension: '',
    activo: 1,
    user: ''
};
const errorsConst = {
    id: 0,
    tipo_usuario_id: 0,
    nombre_completo: '',
    email: '',
    password: '',
    password_confirmation: '',
    intentos: 0,
    fecha_suspension: '',
    activo: 0,
    user: ''
};

const defaultItemSelectTipoUsuario = { value: "", label: "Seleccione" };

class Usuario extends Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
        document.addEventListener('click', this.handleClick, true);
        moment.locale('es');
        this.state = {
            columns: [
                {
                    Header: "Cuentas de usuarios",
                    columns: [
                        {
                            Header: "id",
                            accessor: "id"
                        },
                        {
                            Header: "Tipo de usuario",
                            accessor: "tipo_usuario.nombre"
                        },
                        {
                            Header: "Usuario",
                            accessor: "usuario"
                        },
                        {
                            Header: "Correo",
                            accessor: "email"
                        },
                        {
                            Header: "Intentos",
                            accessor: "intentos"
                        },
                        {
                            Header: "Fecha de suspensión",
                            accessor: "fecha_suspension",
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
                            Header: 'Desbloquear',
                            id: 'desbloquear',
                            accessor: (str) => 'desbloquear',
                            Cell: (tableProps) => (
                                <ValidarPermiso
                                    IdModuloPermisoValidar={ModuloPermiso.Usuarios.Desbloquear}
                                    DefaultTemplate=
                                        {
                                            !tableProps.row.values.activo ? null :
                                                <button
                                                    data-toggle="modal"
                                                    data-target="#modal-desbloquear"
                                                    className="btn btn-warning desbloquear"
                                                    style={{ width: '100%' }}
                                                    data-id={tableProps.row.values.id}
                                                    data-usuario={tableProps.row.values.usuario}>
                                                    <i
                                                        className="fa fa-unlock">
                                                    </i> Desbloquear
                                                </button>
                                        }
                                />

                            )
                        },
                        {
                            Header: 'Editar',
                            id: 'editar',
                            accessor: (str) => 'editar',
                            Cell: (tableProps) => (
                                <ValidarPermiso
                                    IdModuloPermisoValidar={ModuloPermiso.Usuarios.Obtener}
                                    DefaultTemplate=
                                        {
                                            !tableProps.row.values.activo ? null :
                                                <button
                                                    data-toggle="modal"
                                                    data-target="#modal-usuarioCuenta"
                                                    className="btn btn-info editar"
                                                    style={{ width: '100%' }}
                                                    data-id={tableProps.row.values.id}>
                                                    <i
                                                        className="fa fa-edit">
                                                    </i> Editar
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
                                    IdModuloPermisoValidar={ModuloPermiso.Usuarios.Eliminar}
                                    DefaultTemplate=
                                        {
                                            <button
                                                data-toggle="modal"
                                                data-target="#modal-delete"
                                                className={`btn btn-${tableProps.row.values.activo ? "danger" : "warning"} eliminar`}
                                                style={{ width: '100%' }}
                                                data-id={tableProps.row.values.id}
                                                data-usuario={tableProps.row.values.usuario}>
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
            fields: Object.assign({}, fieldsConst),
            errors: Object.assign({}, errorsConst),
            loading: true,
            filterActive: { value: 1, label: "Activo" },
            filterTipoUsuario: SelectTipoUsuario,
            dataSelectActive: [{ value: '', label: "Filtrar por activo" }, { value: 1, label: "Activo" }, { value: 0, label: "Inactivo" }],
            dataSelectTipoUsuarioIndex: [SelectTipoUsuario],
            dataSelectTipoUsuarioModal: [],
            dataSelectEmpleadoModal: [],
            dataSelectClienteModal: [],
            itemSelectTipoUsuario: Object.assign({}, defaultItemSelectTipoUsuario),
        };
    }

    async handleClick(e) {
        let element = e.target;

        // Editar
        if (element.classList.contains("editar")) {
            this.resetFields();
            await this.openModal();
            let id = Number(element.getAttribute("data-id"));
            await this.getByID(id);
            let tipo_usuario_id = this.state.fields["tipo_usuario_id"];

            this.selectValueToModal(tipo_usuario_id);
        }
        else if (element.parentNode.classList.contains("editar")) {
            this.resetFields();
            await this.openModal();
            let id = Number(element.parentNode.getAttribute("data-id"));
            await this.getByID(id);
            let tipo_usuario_id = this.state.fields["tipo_usuario_id"];

            this.selectValueToModal(tipo_usuario_id);
        }
        // End editar

        // Eliminar
        if (element.classList.contains("eliminar")) {
            let id = Number(element.getAttribute("data-id"));
            await this.getByID(id);
        }
        else if (element.parentNode.classList.contains("eliminar")) {
            let id = Number(element.parentNode.getAttribute("data-id"));
            await this.getByID(id);
        }
        // End Eliminar

        // Desbloquear
        if (element.classList.contains("desbloquear")) {
            let id = Number(element.getAttribute("data-id"));
            let usuario = element.getAttribute("data-usuario");

            this.setState(prevState => ({
                ...prevState,
                loading: false,
                fields: {
                    ...prevState.fields,
                    usuario: usuario,
                    id: id
                }
            }));

        }
        else if (element.parentNode.classList.contains("desbloquear")) {
            let id = Number(element.parentNode.getAttribute("data-id"));
            let usuario = element.parentNode.getAttribute("data-usuario");

            this.setState(prevState => ({
                ...prevState,
                loading: false,
                fields: {
                    ...prevState.fields,
                    usuario: usuario,
                    id: id
                }
            }));

        }
        // End Desbloquear
    }

    saveSubmit = async (e) => {
        e.preventDefault();
        let errors = this.state.errors;
        errors = validForm.cleanErrors(errors);
        this.setState({ errors: errors, loading: true });

        let responseData;
        let data = this.getDataFromState();
        data.user = auth.username();

        if (data.id === 0) {
            await CuentaUsuarioDataService.create(data)
                .then(response => {
                    responseData = response.data;
                })
                .catch(function (error) {
                    errors = validForm.displayErrors(error.response.data, errors);
                });
        }
        else {
            await CuentaUsuarioDataService.update(data.id, data)
                .then(response => {
                    responseData = response.data;
                })
                .catch(function (error) {
                    errors = validForm.displayErrors(error.response.data, errors);
                });
        }
        this.setState({ errors: errors, loading: false });
        if (responseData != null) {
            this.getAll(this.state.filterActive.value, this.state.filterTipoUsuario.value);
            this.refs.closemodalSave.click();
        }
    }

    deleteSubmit = async (e) => {
        e.preventDefault();
        let errors = this.state.errors;
        errors = validForm.cleanErrors(errors);
        this.setState({ errors: errors, loading: true });

        let responseData;
        document.querySelector(`#modal-delete button[data-dismiss="modal"]`).click(); // Accionamos el click del cancelar para cerrar
        await CuentaUsuarioDataService.delete(this.state.fields["id"])
            .then(response => {
                responseData = response.data;
            })
            .catch(function (error) {
                errors = validForm.displayErrors(error.response.data.errors, errors);
            });

        this.setState({ errors: errors, loading: false });
        if (responseData != null) {
            this.getAll(this.state.filterActive.value, this.state.filterTipoUsuario.value);
            this.refs.closemodalDelete.click();
        }
        if(document.querySelector(".trChild")){
            document.querySelectorAll(".trChild").forEach(item => {
                item.remove();
            });
        }
    }

    desbloquearSubmit = async (e) => {
        e.preventDefault();
        let errors = this.state.errors;
        errors = validForm.cleanErrors(errors);
        this.setState({ errors: errors, loading: true });

        let responseData;
        await CuentaUsuarioDataService.desbloquear(this.state.fields["id"])
            .then(response => {
                responseData = response.data;
            })
            .catch(function (error) {
                errors = validForm.displayErrors(error.response.data.errors, errors);
            });

        this.setState({ errors: errors, loading: false });

        if (responseData != null) {
            this.getAll(this.state.filterActive.value, this.state.filterTipoUsuario.value);
            this.refs.closeModalDesbloquear.click();
        }
    }

    async componentDidMount() {
        await this.getSelectTipoUsuario(null, null, 1, true, false);
        await this.getAll(this.state.filterActive.value,
            this.state.filterTipoUsuario.value);
    }

    getAll = async (idFilterActive, tipo_usuario_id) => {
        this.setState({ loading: true });
        let tipo_usuario_ids = [];
        if (tipo_usuario_id) {
            if(Array.isArray(tipo_usuario_id)){
                for (let i = 0; i < tipo_usuario_id.length; i++) {
                    tipo_usuario_ids.push(tipo_usuario_id[i]);
                }
            }
            else{
                tipo_usuario_ids.push(tipo_usuario_id);
            }
            tipo_usuario_ids = JSON.stringify(tipo_usuario_ids);
        }

        await CuentaUsuarioDataService.index({
            tipo_usuario_id: tipo_usuario_ids,
            activo: idFilterActive,
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

    getByID = async (idCuentaUsuario) => {
        this.setState({ loading: true });
        await CuentaUsuarioDataService.get(idCuentaUsuario)
            .then(response => {
                let fields = response.data;
                this.setState({
                    fields: fields,
                    loading: false
                }, ()=>{
                    this.setSelectValue(
                        this.state.fields.tipo_usuario_id,
                        "dataSelectTipoUsuarioModal",
                        "itemSelectTipoUsuario"
                    );
                });
            })
            .catch(e => {
                console.log(e);
            });
    }

    getSelectTipoUsuario = async (id, nombre, activo, isSelectIndex, isSelectModal) => {
        this.setState({ loading: true });
        let ids = [];
        if (id) {
            for (let i = 0; i < id.length; i++) {
                ids.push(id[i]);
            }
            ids = JSON.stringify(ids);
        }
        await UtilsDataService.getComboTipoUsuarioFilter({
            id: ids,
            nombre: nombre,
            activo: activo
        })
            .then(response => {
                if (response.data.length > 0) {
                    if (isSelectIndex) {
                        response.data.map(SelectTipoUsuario => {
                            this.state.dataSelectTipoUsuarioIndex.push({
                                value: SelectTipoUsuario.id,
                                label: SelectTipoUsuario.nombre
                            });
                        });
                    }
                    if (isSelectModal) {
                        response.data.map(SelectTipoUsuario => {
                            this.state.dataSelectTipoUsuarioModal.push({
                                value: SelectTipoUsuario.id,
                                label: SelectTipoUsuario.nombre
                            });
                        });
                    }
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

        return target;
    }

    selectValueToModal = (tipo_usuario_id, idCliente, idEmpleado) => {
        this.setState({ loading: true });

        this.state.dataSelectTipoUsuarioModal.map((item) => {
            if (item.value === tipo_usuario_id) {
                Object.assign(this.state.fields, { tipo_usuario_idSelect: item });
                return true;
            }
            return false;
        });

        this.setState({ loading: false });
    }

    getValueFromObject = (o, s) => {
        s = s.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
        s = s.replace(/^\./, '');           // strip a leading dot
        let a = s.split('.');
        for (let i = 0, n = a.length; i < n; ++i) {
            let k = a[i];

            if (k in o) {
                let ok = o[k];
                if (ok) {
                    o = o[k];
                }
            } else {
                return;
            }
        }
        return o;
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

    handleFilterActive = async (selectActive) => {
        this.setState({ filterActive: selectActive });
        await this.getAll(selectActive.value, this.state.filterTipoUsuario.value);
    }

    handleFilterTipoUsuario = async (selectTipoUsuario) => {
        this.setState({ filterTipoUsuario: selectTipoUsuario });
        await this.getAll(this.state.filterActive.value, selectTipoUsuario.value);
    }

    //<editor-fold desc="Reset">
    resetFields() {
        let fields = Object.assign({}, fieldsConst);
        this.setState({
            fields: fields,
            errors: validForm.cleanErrors(this.state.errors),
        });
        this.resetSelectsModal();
        this.resetSelectOptionsModal();
    }
    resetSelectsModal = () => {
        this.setState({
            itemSelectTipoUsuario: Object.assign({}, defaultItemSelectTipoUsuario),
        });
    };
    resetSelectOptionsModal = () => {
        this.setState({ dataSelectTipoUsuarioModal: [] });
    }
    //</editor-fold>
    //<editor-fold desc="Util">
    setSelectValue = (id, dataSelect, filter) => {
        let select = this.state[`${dataSelect}`];
        id = Number.parseInt(id);
        for (let i = 0; i < select.length; i++) {
            let idSelect = Number.parseInt(select[i].value);

            if (idSelect === id) {
                this.setState({ [filter]: select[i] });
                break;
            }
        }
    };
    openModal= async () => {
        await this.getSelectTipoUsuario(null, null, 1, false, true);
    }
    //</editor-fold>

    handleSelectTipoUsuario = async (item) => {
        let fields = this.state.fields;
        fields.tipo_usuario_id = item.value;
        this.setState({ fields: fields, itemSelectTipoUsuario: item });
    };

    render() {
        return (
            <div className="paginaUsuarios">
                <Spinner show={this.state.loading} />
                <div className="modal" id="modal-usuarioCuenta" tabIndex="-1" role="dialog" aria-labelledby="largeModalHead" aria-hidden="true">
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <button
                                    type="button"
                                    className="close"
                                    onClick={async () => {
                                        this.resetFields();
                                    }}
                                    data-dismiss="modal">
                                    <span aria-hidden="true">&times;</span><span className="sr-only">Cerrar</span></button>
                                <h4 className="modal-title" id="largeModalHead"><i className="fa fa-user"></i> {
                                    this.state.fields["id"] === 0 ? "Nueva" : "Editar"} cuenta de usuario </h4>
                            </div>
                            <div className="modal-body">
                                <form
                                    name="cuentaUsuarioForm"
                                    className="form-horizontal"
                                    onSubmit={this.saveSubmit.bind(this)}
                                >

                                    <Input
                                        divClass="col-md-12"
                                        inputName="id"
                                        inputType="hidden"
                                        inputValue={this.state.fields["id"]}
                                    />
                                    <div className="row">
                                        <div className="form-group">
                                            <div className="col-md-9">
                                                <label htmlFor="">Nombre de usuario</label>
                                                <Input
                                                    divClass="input-group"
                                                    inputName="usuario"
                                                    inputType="text"
                                                    inputClass="form-control"
                                                    inputplaceholder="Ingrese el nombre completo del usuario"
                                                    inputValue={this.state.fields["nombre_completo"] || ''}
                                                    inputOnchange={e => {
                                                        let fields = this.state.fields;
                                                        let errors = this.state.errors;
                                                        fields = validForm.handleChangeField("nombre_completo", fields, e);
                                                        errors = validForm.handleChangeErrors("nombre_completo", errors, e);
                                                        this.setState({ fields: fields, errors: errors });
                                                    }}
                                                    spanClass="error"
                                                    spanError={this.state.errors["nombre_completo"] || ''}
                                                    divClassSpanType={1}
                                                    divClassSpan="input-group-addon"
                                                    divClassSpanI="fa fa-indent" />
                                            </div>
                                            <div className="col-md-3">
                                                <label htmlFor="">Tipo de usuario</label>
                                                <Select
                                                    divClass="input-group"
                                                    selectplaceholder="Seleccione"
                                                    selectValue={this.state.itemSelectTipoUsuario || ''}
                                                    selectOnchange={ this.handleSelectTipoUsuario }
                                                    selectoptions={this.state.dataSelectTipoUsuarioModal}
                                                    selectIsSearchable={ false }
                                                    selectclassNamePrefix="selectReact__value-container"
                                                    spanClass="error"
                                                    spanError={this.state.errors["tipo_usuario_id"] || ''}
                                                    divClassSpanType={1}
                                                    divClassSpan="input-group-addon"
                                                    divClassSpanI="fa fa-indent"
                                                />
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <div className="col-md-4">
                                                <label htmlFor="">Email</label>
                                                <Input
                                                    divClass="input-group"
                                                    inputName="email"
                                                    inputType="text"
                                                    inputClass="form-control"
                                                    inputplaceholder="Ingrese el email"
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
                                                    divClassSpanI="fa fa-indent" />
                                            </div>
                                            <div className="col-md-4">
                                                <label htmlFor="">Password</label>
                                                <Input
                                                    divClass="input-group"
                                                    inputName="password"
                                                    inputType="password"
                                                    inputClass="form-control"
                                                    inputplaceholder="Ingrese password"
                                                    inputValue={this.state.fields["password"] || ''}
                                                    inputOnchange={e => {
                                                        let fields = this.state.fields;
                                                        let errors = this.state.errors;
                                                        fields = validForm.handleChangeField("password", fields, e);
                                                        errors = validForm.handleChangeErrors("password", errors, e);
                                                        this.setState({ fields: fields, errors: errors });
                                                    }}
                                                    spanClass="error"
                                                    spanError={this.state.errors["password"] || ''}
                                                    divClassSpanType={1}
                                                    divClassSpan="input-group-addon"
                                                    divClassSpanI="fa fa-indent" />
                                            </div>
                                            <div className="col-md-4">
                                                <label htmlFor="">Repetir password</label>
                                                <Input
                                                    divClass="input-group"
                                                    inputName="repetirPassword"
                                                    inputType="password"
                                                    inputClass="form-control"
                                                    inputplaceholder="Repita el password"
                                                    inputValue={this.state.fields["password_confirmation"] || ''}
                                                    inputOnchange={e => {
                                                        let fields = this.state.fields;
                                                        let errors = this.state.errors;
                                                        fields = validForm.handleChangeField("password_confirmation", fields, e);
                                                        errors = validForm.handleChangeErrors("password_confirmation", errors, e);
                                                        this.setState({ fields: fields, errors: errors });
                                                    }}
                                                    spanClass="error"
                                                    spanError={this.state.errors["password_confirmation"] || ''}
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
                                                this.resetFields();
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

                <div className={`message-box message-box-${this.state.fields.activo ? "danger" : "info"} animated fadeIn`} id="modal-delete">
                    <form name="UsuarioForm" className="form-horizontal" onSubmit={this.deleteSubmit.bind(this)}>
                        <div className="mb-container">
                            <div className="mb-middle">
                                <div className="mb-title"><span className={`fa fa-${this.state.fields.activo ? "eraser" : "check"}`}></span>{this.state.fields["activo"] ? "Desactivar" : "Activar"} usuario</div>
                                <div className="mb-content">
                                    <p>{`¿Está seguro que desea ${this.state.fields["activo"] ? "desactivar" : "activar"} al usuario ${this.state.fields["nombre_completo"]}? Puede volver a ${this.state.fields.activo ? "activarla" : "desactivarla"} en cualquier momento.`}</p>
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

                <div className={`message-box message-box-info animated fadeIn`} id="modal-desbloquear">
                    <form name="DesbloquearForm" className="form-horizontal" onSubmit={this.desbloquearSubmit.bind(this)}>
                        <div className="mb-container">
                            <div className="mb-middle">
                                <div className="mb-title"><span className="fa fa-unlock"></span> Desbloquear usuario</div>
                                <div className="mb-content">
                                    <p>{`¿Está seguro que desea desbloquear al usuario ${this.state.fields["nombre_completo"]}?`}</p>
                                    <p style={{ paddingLeft: "5px" }}><span className="error">{this.state.errors["errorGenerico"] || ''}</span></p>
                                </div>
                                <div className="mb-footer">
                                    <button className="btn btn-primary btn-lg pull-right">Desbloquear</button>
                                    &nbsp;
                                    <button
                                        type="button"
                                        className="btn btn-default"
                                        data-dismiss="modal"
                                        onClick={async () => {
                                            this.resetFields();
                                        }}
                                        ref="closeModalDesbloquear">Cancelar</button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>


                <ul className="breadcrumb push-down-0">
                    <li><a href="/">Gestión de usuarios</a></li>
                    <li><a href="/">Listado de cuentas de usuario</a></li>
                </ul>
                <div className="content-frame">
                    <div className="content-frame-top">
                        <div className="rowListado">
                            <div className="panel panel-default ">
                                <div className="panel-heading">
                                    <div style={{ display: "flow-root" }}>
                                        <h3 className="panel-title"><span className="fa fa-users"></span> Listado de cuentas de usuarios</h3>
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
                                                        spanError="" />
                                                </div>
                                            </li>
                                            <li>
                                                <div style={{ minWidth: "200px" }}>
                                                    <Select
                                                        divClass=""
                                                        selectplaceholder="Seleccione"
                                                        selectValue={this.state.filterTipoUsuario}
                                                        selectOnchange={this.handleFilterTipoUsuario}
                                                        selectoptions={this.state.dataSelectTipoUsuarioIndex}
                                                        selectIsSearchable={false}
                                                        selectclassNamePrefix="selectReact__value-container"
                                                        spanClass=""
                                                        spanError="" />
                                                </div>
                                            </li>
                                            <li>
                                                <ValidarPermiso
                                                    IdModuloPermisoValidar={ModuloPermiso.Usuarios.Nuevo}
                                                    DefaultTemplate=
                                                        {
                                                            <button
                                                                data-toggle="modal"
                                                                data-target="#modal-usuarioCuenta"
                                                                className="btn btn-primary pull-right"
                                                                onClick={async () => {
                                                                    this.resetFields();
                                                                    await this.openModal();
                                                                }}>
                                                                <i className="fa fa-plus"></i> Nuevo usuario
                                                            </button>
                                                        }
                                                />
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="panel-body">
                                    <div>
                                        <ValidarPermiso
                                            IdModuloPermisoValidar={ModuloPermiso.Usuarios.ObtenerTodos}
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
        );
    }
}
export default Usuario;
