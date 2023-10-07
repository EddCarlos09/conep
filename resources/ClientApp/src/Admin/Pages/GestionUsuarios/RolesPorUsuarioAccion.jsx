import React, { Component } from 'react';
import ModuloPermisoRolDataService from "../../../Services/Base/Usuario/ModuloPermisoRol.Service";
import CuentaUsuarioDataService from "../../../Services/Base/Usuario/UsuarioCuenta.Service";
import SucursalCuentaUsuarioRolModuloPermisoRolDataService from "../../../Services/Base/Usuario/SucursalCuentaUsuarioRolModuloPermisoRol.Service";
import Spinner from '../../../Components/Spinner';
import Input from '../../../Components/Input';
import ValidForm from "../../../Utils/ValidForm";
import Select from '../../../Components/Select';
import RolDataService from "../../../Services/Base/Usuario/Rol.Service";
import CheckboxTree from 'react-checkbox-tree';
import 'react-checkbox-tree/lib/react-checkbox-tree.css';
import { ModuloPermiso } from "../../../Permisos/ModuloPermiso";
import ValidarPermiso from "../../../Permisos/ValidarPermiso";
import AuthLogin from "../../../Utils/AuthLogin";

const auth = new AuthLogin();
const validForm = new ValidForm();
const fieldsConst = { idSucursalCuentaUsuarioRol: 0, idSucursalCuentaUsuario: '', idRol: '', activo: false };
const errorsConst = { idSucursalCuentaUsuarioRol: 0, idSucursalCuentaUsuario: '', idRol: '', activo: false };
const SelectRoles = { value: 0, label: "Filtrar por rol" };
const GetKeys = (obj, prefix = '') =>
    Object.keys(obj).reduce((res, el) => {
        if (Array.isArray(obj[el])) {
            return res;
        } else if (typeof obj[el] === 'object' && obj[el] !== null) {
            return [...res, ...GetKeys(obj[el], prefix + el + '.')];
        }
        return [...res, prefix + el];
    }, []);

class RolesPorUsuarioAccion extends Component {
    constructor(props) {
        super(props);

        this.onCheck = this.onCheck.bind(this);
        this.onExpand = this.onExpand.bind(this);

        this.getAndSetValuesFromUrl(false);

        this.state = {
            data: [],
            fields: fieldsConst,
            errors: errorsConst,
            loading: true,
            usuario: '',
            email: '',
            tipoUsuario: '',
            idTipoUsuario: '',
            filterRoles: SelectRoles,
            dataSelectRoles: [],
            checked: [],
            expanded: [],
            nodes: [],
            rolNombre:''
        }

    }

    async componentDidMount() {
        this.getAndSetValuesFromUrl(true);
        await this.getUsuario();
        await this.getSelectRoles();
        await this.getRol();
    }

    saveSubmit = async (e) => {
        e.preventDefault();
        let errors = this.state.errors;
        errors = validForm.cleanErrors(errors);
        this.setState({ errors: errors, loading: true });
        let idsModuloPermiso = this.state.checked;
        let data =
            {
                idSucursalCuentaUsuarioRol: this.state.fields["idSucursalCuentaUsuarioRol"],
                idRol: this.state.fields["idRol"],
                idSucursalCuentaUsuario: this.state.fields["idSucursalCuentaUsuario"],
                idsModuloPermisoRol: idsModuloPermiso.join(),
                user: auth.username()
            };

        if (this.state.fields["idSucursalCuentaUsuarioRol"] === "0") {
            await SucursalCuentaUsuarioRolModuloPermisoRolDataService.postRange(data)
                .then(response => {
                    var idSucursalCuentaUsuario = this.state.fields["idSucursalCuentaUsuario"];
                    this.props.history.push({
                        pathname: '/rol-usuario',
                        search: `?idSucursalCuentaUsuario=${idSucursalCuentaUsuario}`
                    });
                })
                .catch(function (error) {
                    errors = validForm.displayErrors(error.response.data.errors, errors);
                });
        }
        else {
            await SucursalCuentaUsuarioRolModuloPermisoRolDataService.putRange(data, this.state.fields["idSucursalCuentaUsuarioRol"])
                .then(response => {
                    var idSucursalCuentaUsuario = this.state.fields["idSucursalCuentaUsuario"];
                    this.props.history.push({
                        pathname: '/rol-usuario',
                        search: `?idSucursalCuentaUsuario=${idSucursalCuentaUsuario}`
                    });
                })
                .catch(function (error) {
                    errors = validForm.displayErrors(error.response.data.errors, errors);
                });
        }
    }

    getAndSetValuesFromUrl = (updateState) => {
        const search = this.props.location.search;
        const params = new URLSearchParams(search);
        this.idSucursalCuentaUsuario = params.get('idSucursalCuentaUsuario');
        this.idSucursalCuentaUsuarioRol = params.get('idSucursalCuentaUsuarioRol');
        if(updateState){
            let fieldsConst = this.state.fields;
            fieldsConst.idSucursalCuentaUsuario = this.idSucursalCuentaUsuario || "0";
            fieldsConst.idSucursalCuentaUsuarioRol = this.idSucursalCuentaUsuarioRol || "0";

            this.setState({ fields: fieldsConst });
        }
    }

    getUsuario = async () => {
        this.setState({ loading: true });
        let idSucursalCuentaUsuario = this.state.fields.idSucursalCuentaUsuario;
        await CuentaUsuarioDataService.getDto({sucursal_usuario_cuenta_id: idSucursalCuentaUsuario})
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

    getRol = async() => {
        let idSucursalCuentaUsuarioRol = this.state.fields["idSucursalCuentaUsuarioRol"];
        if (idSucursalCuentaUsuarioRol !== "0") {
            this.setState({ loading: true });
            await RolDataService.getByIdSucursalCuentaUsuarioRol(idSucursalCuentaUsuarioRol)
                .then(response => {
                    this.setState(prevState => ({
                        ...prevState,
                        loading: false,
                        rolNombre: response.data["nombre"],
                        fields: {
                            ...prevState.fields,
                            idRol: response.data["id"]
                        }
                    }));
                    this.getPermisosByIdRol(response.data["id"]);
                })
                .catch(e => {
                    console.log(e);
                });
        }
    }

    getSelectRoles = async () => {
        this.setState({ loading: true });
        let idTipoUsuario = this.state.idTipoUsuario;
        let idSucursalCuentaUsuario = this.state.fields.idSucursalCuentaUsuario;
        await RolDataService.getAllByIdTipoUsuarioAndIdSucursalCuentaUsuario(idTipoUsuario, idSucursalCuentaUsuario)
            .then(response => {
                if (Object.keys(response.data).length > 0) {
                    response.data.map(SelecRol => {
                        this.state.dataSelectRoles.push({
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

    getPermisosByIdRol = async (idRol) => {
        this.setState({ loading: true });
        await ModuloPermisoRolDataService.getModulosPermisosRolByIdRol(idRol)
            .then(response => {
                if (Object.keys(response.data).length > 0) {
                    //eliminamos los arreglos "children" que esten vacios, ya que tiene un bug el componente
                    for (let i = 0; i < response.data.length; i++) {
                        Object.entries(response.data[i]).forEach(entry => {
                            const [key, value] = entry;
                            if (Array.isArray(response.data[i][key]) && response.data[i][key].length === 0) {
                                delete response.data[i][key];
                            } else if (Array.isArray(response.data[i][key])) {
                                for (let ii = 0; ii < response.data[i][key].length; ii++) {
                                    Object.entries(response.data[i][key][ii]).forEach(permisoEntry => {
                                        const [permisoKey, permisoValue] = permisoEntry;
                                        if (Array.isArray(response.data[i][key][ii][permisoKey]) && response.data[i][key][ii][permisoKey].length === 0) {
                                            delete response.data[i][key][ii][permisoKey];
                                        }
                                        else if (Array.isArray(response.data[i][key][ii][permisoKey])) {

                                            for (let iii = 0; iii < response.data[i][key][ii][permisoKey].length; iii++) {
                                                Object.entries(response.data[i][key][ii][permisoKey][iii]).forEach(moduloPermisoEntry => {
                                                    const [moduloPermisoKey, moduloPermisoValue] = moduloPermisoEntry;
                                                    if (Array.isArray(response.data[i][key][ii][permisoKey][iii][moduloPermisoKey]) && response.data[i][key][ii][permisoKey][iii][moduloPermisoKey].length === 0) {
                                                        delete response.data[i][key][ii][permisoKey][iii][moduloPermisoKey];
                                                    }
                                                });
                                            }
                                        }
                                    });
                                }
                            }
                        });
                    }
                    this.setState({ checked: [], expanded: [], nodes: response.data }, function () {
                        //el metodo setState es asyncrono se tiene que poner aqui el resto de las funciones para que se ejecute en orden.
                        this.getModulosPermisosChecked();
                    });
                } else {
                    this.setState({ nodes: [] });
                }
                this.setState({ loading: false });
            })
            .catch(e => {
                console.log(e);
            });
    }

    getModulosPermisosChecked = async() => {
        this.setState({ loading: true });
        let idSucursalCuentaUsuarioRol = this.state.fields["idSucursalCuentaUsuarioRol"];

        if (idSucursalCuentaUsuarioRol === "0") {
            let nodes = this.state["nodes"];
            let moduloPermisoIds = [];

            for (let i = 0; i < nodes.length; i++) {
                Object.entries(nodes[i]).forEach(entry => {
                    const [key, value] = entry;
                    if (Array.isArray(nodes[i][key])) {
                        for (let ii = 0; ii < nodes[i][key].length; ii++) {
                            Object.entries(nodes[i][key][ii]).forEach(permisoEntry => {
                                const [permisoKey, permisoValue] = permisoEntry;
                                if (Array.isArray(nodes[i][key][ii][permisoKey])) {

                                    for (let iii = 0; iii < nodes[i][key][ii][permisoKey].length; iii++) {
                                        Object.entries(nodes[i][key][ii][permisoKey][iii]).forEach(moduloPermisoEntry => {
                                            const [moduloPermisoKey, moduloPermisoValue] = moduloPermisoEntry;
                                            if (String(moduloPermisoValue).startsWith("p_", 0)) {
                                                moduloPermisoIds.push(moduloPermisoValue);
                                            }
                                        });
                                    }
                                }
                            });
                        }
                    }
                });
            }
            this.setState({ checked: moduloPermisoIds, loading: false });
        } else {
            await SucursalCuentaUsuarioRolModuloPermisoRolDataService.getAll({
                activo: 1,
                modulo_permiso_rol_id: '',
                sucursal_usuario_cuenta_rol_id: idSucursalCuentaUsuarioRol
            }).then(response => {
                    let moduloPermisoIds = [];
                    for (let i = 0; i < response.data.length; i++) {
                        let id = "p_" + response.data[i]["modulo_permiso_rol_id"];
                        moduloPermisoIds.push(id);
                    }
                    this.setState({ checked: moduloPermisoIds, loading:false });
                })
                .catch(e => {
                    console.log(e);
                });
        }
    }

    onCheck(checked) {
        this.setState({
            checked
        });
    }

    onExpand(expanded) {
        this.setState({
            expanded
        });
    }

    render() {
        return (
            <div>
                <Spinner show={this.state.loading} />

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
                                    this.state.fields["idSucursalCuentaUsuarioRol"] === 0 ? "Nuevo" : "Editar"} roles del usuario. </h4>
                            </div>
                            <div className="modal-body">

                            </div>
                        </div>
                    </div>
                </div>

                <ul className="breadcrumb push-down-0">
                    <li><a href="/">Gestión de usuarios</a></li>
                    <li><a href="/">Asignación de usuario</a></li>
                    <li><a href="/">Usuarios por sucursal</a></li>
                    <li><a href="/">Roles por usuario</a></li>
                    <li><a href="/">Roles por usuario - acción</a></li>
                </ul>
                <div className="content-frame">
                    <div className="content-frame-top">
                        <div className="page-title">
                            <h2><span className="fa fa-male"></span> Roles por usuario - acción</h2>
                        </div>
                        <hr />
                        <div className="row">
                            <div className="panel panel-default ">
                                <div className="panel-heading">
                                    <h3 className="panel-title"><i className="fa fa-building"></i>Roles del usuario: {
                                        this.state.usuario}</h3>
                                    <ul className="panel-controls"> </ul>
                                </div>
                                <div className="panel-body">
                                    <div>
                                        <form
                                            name="sucursalCuentaUsuarioForm"
                                            className="form-horizontal"
                                            onSubmit={this.saveSubmit.bind(this)}
                                        >

                                            <Input
                                                divClass="col-md-12"
                                                inputName="idSucursalCuentaUsuario"
                                                inputType="hidden"
                                                inputValue={this.state.fields["idSucursalCuentaUsuarioRol"]}
                                            />

                                            <div className="row">
                                                <div className="form-group">
                                                    <div className="col-md-4">
                                                        <label htmlFor="">Rol</label>
                                                        {this.state.fields["idSucursalCuentaUsuarioRol"] === "0" ?
                                                            <Select
                                                                divClass="input-group"
                                                                selectplaceholder="Seleccione"
                                                                selectValue={this.state.fields["idRolSelect"] || ''}
                                                                selectOnchange={e => {
                                                                    let fields = this.state.fields;
                                                                    let errors = this.state.errors;
                                                                    fields = validForm.handleSelectChangeField(
                                                                        "idRolSelect",
                                                                        fields,
                                                                        e);
                                                                    errors = validForm.handleSelectChangeErrors(
                                                                        "idRolSelect",
                                                                        errors,
                                                                        e);
                                                                    this.getPermisosByIdRol(this.state.fields["idRolSelect"].value);

                                                                    this.setState({ fields: fields, errors: errors });
                                                                }}
                                                                selectoptions={this.state.dataSelectRoles}
                                                                selectIsSearchable={true}
                                                                selectclassNamePrefix="selectReact__value-container"
                                                                spanClass="error"
                                                                spanError={this.state.errors["idRol"] || ''}
                                                                divClassSpanType={1}
                                                                divClassSpan="input-group-addon"
                                                                divClassSpanI="fa fa-indent" />
                                                            :
                                                            <Input
                                                                divClass="input-group"
                                                                inputName="nombre"
                                                                inputType="text"
                                                                inputClass="form-control"
                                                                inputplaceholder="Nombre del rol"
                                                                inputValue={this.state["rolNombre"] || ''}
                                                                inputOnchange={e => {
                                                                    let fields = this.state.fields;
                                                                    let errors = this.state.errors;
                                                                    fields = validForm.handleChangeField("rolNombre", fields, e);
                                                                    errors = validForm.handleChangeErrors("rolNombre", errors, e);

                                                                    this.setState({ fields: fields, errors: errors });

                                                                }}
                                                                spanClass="error"
                                                                spanError={this.state.errors["rolNombre"] || ''}
                                                                divClassSpanType={1}
                                                                divClassSpan="input-group-addon"
                                                                divClassSpanI="fa fa-indent"
                                                                readOnly="true"
                                                            />
                                                        }

                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <div className="col-md-12">
                                                        <CheckboxTree
                                                            iconsClass="fa5"
                                                            nodes={this.state.nodes}
                                                            checked={this.state.checked}
                                                            expanded={this.state.expanded}
                                                            onCheck={this.onCheck}
                                                            onExpand={this.onExpand}
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
                                                        var idSucursalCuentaUsuario =
                                                            this.state.fields["idSucursalCuentaUsuario"];
                                                        this.props.history.push({
                                                            pathname: '/rol-usuario',
                                                            search: `?idSucursalCuentaUsuario=${idSucursalCuentaUsuario}`
                                                        });
                                                    }}
                                                    ref="closemodalSave">Regresar
                                                </button>

                                                <ValidarPermiso
                                                    IdModuloPermisoValidar={this.state.fields["idSucursalCuentaUsuarioRol"] === "0" ? ModuloPermiso.RolesPorUsuario.Nuevo : ModuloPermiso.RolesPorUsuario.Modificar}
                                                    DefaultTemplate=
                                                        {
                                                            <button className="btn btn-primary pull-right">
                                                                <i className="fa fa-save"></i> Guardar
                                                            </button>
                                                        }
                                                />

                                            </div>
                                        </form>

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
export default RolesPorUsuarioAccion;
