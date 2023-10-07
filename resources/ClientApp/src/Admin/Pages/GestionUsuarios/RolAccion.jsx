import React, { Component } from 'react';
import RolDataService from "../../../Services/Base/Usuario/Rol.Service";
import ModuloPermisoDataService from "../../../Services/Base/Usuario/ModuloPermiso.Service";
import ModuloPermisoRolDataService from "../../../Services/Base/Usuario/ModuloPermisoRol.Service";
import Spinner from '../../../Components/Spinner';
import ValidForm from "../../../Utils/ValidForm";
import CheckboxTree from 'react-checkbox-tree';
import Input from '../../../Components/Input';
import 'react-checkbox-tree/lib/react-checkbox-tree.css';
import { ModuloPermiso } from "../../../Permisos/ModuloPermiso";
import ValidarPermiso from "../../../Permisos/ValidarPermiso";
import AuthLogin from "../../../Utils/AuthLogin";

const validForm = new ValidForm();
const fieldsConst = { id: 0, nombre: '', activo: false };
const errorsConst = { id: '', nombre: '', activo: false};
const auth = new AuthLogin();

class RolAccion extends Component {
    constructor(props) {
        super(props);
        this.onCheck = this.onCheck.bind(this);
        this.onExpand = this.onExpand.bind(this);

        const search = this.props.location.search;
        const params = new URLSearchParams(search);
        this.id = params.get('id');
        fieldsConst.id = this.id || "0";

        this.state = {
            data: [],
            fields:  Object.assign({}, fieldsConst),
            errors:  Object.assign({}, errorsConst),
            loading: true,
            checked: [],
            expanded: [],
            nodes: []
        }
    }

    async componentDidMount() {
        await this.getRol(this.state.fields.id);
        await this.getModulosPermisos();
        await this.getModulosPermisosChecked();
    }

    saveSubmit = async (e) => {
        e.preventDefault();
        let errors = this.state.errors;
        errors = validForm.cleanErrors(errors);
        this.setState({ errors: errors, loading: true });
        let idsModuloPermiso = this.state.checked;
        let data =
            {
                id: this.state.fields.id,
                nombre: this.state.fields.nombre,
                idsModuloPermiso: idsModuloPermiso.join(),
                user: auth.username()
            };

        if (this.state.fields["id"] === "0") {
             await ModuloPermisoRolDataService.createRange(data)
                .then(response => {
                    this.props.history.push({
                        pathname: '/roles'
                    });
                })
                .catch(function (error) {
                    errors = validForm.displayErrors(error.response.data.errors, errors);
                });
        }
        else {
            await ModuloPermisoRolDataService.updateRange(data.id, data)
                .then(response => {
                    this.props.history.push({
                        pathname: '/roles'
                    });
                })
                .catch(function (error) {
                    errors = validForm.displayErrors(error.response.data.errors, errors);
                });
        }
        this.setState({
            loading: false,
            errors: errors
        });
    }

    getModulosPermisos = async () => {
        this.setState({ loading: true });

        await ModuloPermisoDataService.getModulosPermisos()
            .then(response => {
                console.log(response.data)
                this.setState({
                    nodes: response.data,
                    loading: false
                });
            })
            .catch(e => {
                console.log(e);
            });
    }

    getModulosPermisosChecked = async () => {
        if (this.state.fields["id"] !== "0")
        {
            this.setState({ loading: true });
            let checked = this.state["checked"];

            await ModuloPermisoRolDataService.getAll({
                activo: 1,
                rol_id:this.state.fields["id"]
            })
                .then(response => {
                    if (response.data.length > 0) {
                        for (let i = 0; i < response.data.length; i++) {
                            let mpr = "p_" + response.data[i].modulo_permiso_id;
                            checked.push(mpr);
                        }
                    }

                    this.setState({
                        loading: false,
                        checked: checked
                    });
                })
                .catch(e => {
                    console.log(e);
                });
        }
    }

    getRol = async (id) => {
        if (Number.parseInt(id) > 0) {
            this.setState({ loading: true });
            await RolDataService.get(id)
                .then(response => {
                    if (Object.keys(response.data).length > 0) {
                        this.resetFields();
                        let fields = response.data;
                        this.setState({
                            fields: fields,
                            loading: false
                        });
                    }
                })
                .catch(e => {
                    console.log(e);
                });
        }
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

    regresar = async (e) => {
        this.props.history.push({
            pathname: '/roles'
        });
    }

    render() {
        return (
            <div>
                <Spinner show={this.state.loading} />

                <ul className="breadcrumb push-down-0">
                    <li><a href="/">Gestión de usuarios</a></li>
                    <li><a href="/">Roles</a></li>
                </ul>
                <div className="content-frame">
                    <div className="content-frame-top">
                        <div className="page-title">
                            <h2><span className="fa fa-male"></span>  {this.state.fields["id"] === "0" ? "Nuevo rol" : " Rol: " + this.state.fields["nombre"]}</h2>
                        </div>
                        <hr />
                        <div className="row">
                            <div className="panel panel-default ">
                                <div className="panel-heading">
                                    <h3 className="panel-title"><i className="fa fa-building"></i> Rol</h3>
                                    <ul className="panel-controls"> </ul>
                                </div>
                                <div className="panel-body">
                                    <div>
                                        <form
                                            name="form"
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
                                                    <div className="col-md-4">
                                                        <label htmlFor="">Rol</label>
                                                        <Input
                                                            divClass="input-group"
                                                            inputName="nombre"
                                                            inputType="text"
                                                            inputClass="form-control"
                                                            inputplaceholder="Ingrese el nombre"
                                                            inputValue={this.state.fields["nombre"] || ''}
                                                            inputOnchange={e => {
                                                                let fields = this.state.fields;
                                                                let errors = this.state.errors;
                                                                fields = validForm.handleChangeField("nombre", fields, e);
                                                                errors = validForm.handleChangeErrors("nombre", errors, e);
                                                                this.setState({ fields: fields, errors: errors });
                                                            }}
                                                            spanClass="error"
                                                            spanError={this.state.errors["nombre"] || ''}
                                                            divClassSpanType={1}
                                                            divClassSpan="input-group-addon"
                                                            divClassSpanI="fa fa-indent" />
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <div className="col-md-12">
                                                        <CheckboxTree
                                                            nodes={this.state.nodes}
                                                            checked={this.state.checked}
                                                            expanded={this.state.expanded}
                                                            onCheck={ this.onCheck }
                                                            onExpand={ this.onExpand }
                                                            iconsClass="fa5"
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
                                                        this.regresar();
                                                    }}
                                                    ref="closemodalSave">Regresar
                                                </button>


                                                <ValidarPermiso
                                                    IdModuloPermisoValidar={this.state.fields["id"] === "0" ? ModuloPermiso.Roles.Nuevo : ModuloPermiso.Roles.Modificar}
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
        )
    }
}

export default RolAccion;
