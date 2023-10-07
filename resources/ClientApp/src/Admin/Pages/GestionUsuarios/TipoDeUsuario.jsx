import React, { Component } from "react";
import TableReact from "../../../Components/TableReact";
import TipoUsuarioDataService from "../../../Services/Base/Usuario/TipoUsuario.Service";
import UtilsDataService from "../../../Services/General/Utils.Service";
import Spinner from "../../../Components/Spinner";
import ValidForm from "../../../Utils/ValidForm";
import Select from "../../../Components/Select";
import { ModuloPermiso } from "../../../Permisos/ModuloPermiso";
import ValidarPermiso from "../../../Permisos/ValidarPermiso";
import Input from "../../../Components/Input";
import AuthLogin from "../../../Utils/AuthLogin";

const validForm = new ValidForm();
const auth = new AuthLogin();
const fieldsConst = {
    idTipoUsuario: 0,
    nombre: "",
    roles: "",
    activo: false,
    acceso_panel_administrador: false,
    acceso_panel_cliente: false,
};
const errorsConst = {
    idTipoUsuario: "",
    nombre: "",
    roles: "",
    activo: false,
    acceso_panel_administrador: false,
    acceso_panel_cliente: false,
};
const SelectTiposUsuarios = { value: "", label: "Filtrar por tipo de usuario" };
const GetKeys = (obj, prefix = "") =>
    Object.keys(obj).reduce((res, el) => {
        if (Array.isArray(obj[el])) {
            return res;
        } else if (typeof obj[el] === "object" && obj[el] !== null) {
            return [...res, ...GetKeys(obj[el], prefix + el + ".")];
        }
        return [...res, prefix + el];
    }, []);

class TipoDeUsuario extends Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
        document.addEventListener("click", this.handleClick, true);
        this.state = {
            columns: [
                {
                    Header: "Tipos de usuario",
                    columns: [
                        {
                            Header: "idTipoUsuario",
                            accessor: "id",
                        },
                        {
                            Header: "Nombre",
                            accessor: "nombre",
                        },
                        {
                            Header: "Acceso a panel administrativo",
                            id: "acceso_panel_administrador",
                            accessor: "acceso_panel_administrador",
                            Cell: (tableProps) => {
                                return (
                                    <input
                                        type="checkbox"
                                        className="checkbox center-block"
                                        checked={
                                            tableProps.row.values
                                                .acceso_panel_administrador
                                        }
                                        readOnly
                                    />
                                );
                            },
                        },
                        {
                            Header: "Acceso a panel cliente",
                            id: "acceso_panel_cliente",
                            accessor: "acceso_panel_cliente",
                            Cell: (tableProps) => {
                                return (
                                    <input
                                        type="checkbox"
                                        className="checkbox center-block"
                                        checked={
                                            tableProps.row.values
                                                .acceso_panel_cliente
                                        }
                                        readOnly
                                    />
                                );
                            },
                        },
                        {
                            Header: "Roles",
                            id: "roles",
                            accessor: "roles",
                            Cell: (tableProps) => {
                                let roles = tableProps.row.values.roles
                                    ? tableProps.row.values.roles
                                    : "Sin rol";

                                return <div>{roles}</div>;
                            },
                        },
                        {
                            Header: "Activo",
                            id: "activo",
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
                            },
                        },
                    ],
                },
                {
                    Header: "Acciones",
                    columns: [
                        {
                            Header: "Ver roles",
                            id: "verRoles",
                            accessor: (str) => "verRoles",
                            Cell: (tableProps) => {
                                return (
                                    <ValidarPermiso
                                        IdModuloPermisoValidar={
                                            ModuloPermiso.RolesPorTipoDeUsuario
                                                .Index
                                        }
                                        DefaultTemplate={
                                            <button
                                                data-toggle="modal"
                                                data-target="#"
                                                className="btn btn-warning verRoles"
                                                style={{ width: "100%" }}
                                                data-id={
                                                    tableProps.row.values.id
                                                }
                                            >
                                                <i className="fa fa-tasks"></i>{" "}
                                                Ver roles
                                            </button>
                                        }
                                    />
                                );
                            },
                        },
                        {
                            Header: "Editar",
                            id: "editar",
                            accessor: (str) => "editar",
                            Cell: (tableProps) => (
                                <ValidarPermiso
                                    IdModuloPermisoValidar={
                                        ModuloPermiso.TiposDeUsuario.Obtener
                                    }
                                    DefaultTemplate={
                                        <button
                                            data-toggle="modal"
                                            data-target="#modal"
                                            className="btn btn-info editar"
                                            style={{ width: "100%" }}
                                            data-id={tableProps.row.values.id}
                                            data-nombre={
                                                tableProps.row.values.nombre
                                            }
                                            data-acceso-panel-administrador={
                                                tableProps.row.values
                                                    .acceso_panel_administrador
                                            }
                                            data-acceso-panel-cliente={
                                                tableProps.row.values
                                                    .acceso_panel_cliente
                                            }
                                        >
                                            <i className="fa fa-edit"></i>{" "}
                                            Editar
                                        </button>
                                    }
                                />
                            ),
                        },
                        {
                            Header: "Activar/Desactivar",
                            id: "actdesc",
                            accessor: (str) => "actdesc",
                            Cell: (tableProps) => (
                                <ValidarPermiso
                                    IdModuloPermisoValidar={
                                        ModuloPermiso.TiposDeUsuario.Eliminar
                                    }
                                    DefaultTemplate={
                                        <button
                                            data-toggle="modal"
                                            data-target="#modal-delete"
                                            className="btn btn-danger eliminar"
                                            style={{ width: "100%" }}
                                            data-id={
                                                tableProps.row.values
                                                    .idTipoUsuario
                                            }
                                            data-nombre={
                                                tableProps.row.values.nombre
                                            }
                                            data-activo={
                                                tableProps.row.values.activo
                                            }
                                        >
                                            <i className="fa fa-eraser"></i>{" "}
                                            {tableProps.row.values.activo
                                                ? "Desactivar"
                                                : "Activar"}
                                        </button>
                                    }
                                />
                            ),
                        },
                    ],
                },
            ],
            hiddenColumns: ["id"],
            data: [],
            fields: fieldsConst,
            errors: errorsConst,
            loading: true,
            filterActive: { value: 1, label: "Activo" },
            filterTiposUsuarios: SelectTiposUsuarios,
            dataSelectTiposUsuariosIndex: [SelectTiposUsuarios],
            dataSelectActive: [
                { value: "", label: "Filtrar por activo" },
                { value: 1, label: "Activo" },
                { value: 0, label: "Inactivo" },
            ],
        };
    }

    async componentDidMount() {
        await this.getSelectTiposUsuarios();
        await this.getAll(
            this.state.filterActive.value,
            this.state.filterTiposUsuarios.value
        );
    }

    handleFilterActive = async (selectActive) => {
        this.setState({ filterActive: selectActive });
        await this.getAll(
            selectActive.value,
            this.state.filterTiposUsuarios.value
        );
    };

    handleFilterTiposUsuarios = async (selectTipoUsuario) => {
        this.setState({ filterTiposUsuarios: selectTipoUsuario });
        await this.getAll(
            this.state.filterActive.value,
            selectTipoUsuario.value
        );
    };

    async handleClick(e) {
        let element = e.target;

        //Start Ver Roles
        if (element.classList.contains("verRoles")) {
            let id = Number(element.getAttribute("data-id"));
            this.props.history.push({
                pathname: "/rol-tipo-usuario",
                search: `?idTipoUsuario=${id}`,
            });
        } else if (element.parentNode.classList.contains("verRoles")) {
            let id = Number(element.parentNode.getAttribute("data-id"));
            this.props.history.push({
                pathname: "/rol-tipo-usuario",
                search: `?idTipoUsuario=${id}`,
            });
        }
        //End Ver Roles

        //Start Editar
        if (element.classList.contains("editar")) {
            let id = Number(element.getAttribute("data-id"));
            let nombre = element.getAttribute("data-nombre");
            let acceso_panel_administrador = element.getAttribute(
                "data-acceso-panel-administrador"
            );
            let acceso_panel_cliente = element.getAttribute(
                "data-acceso-panel-cliente"
            );

            console.log(acceso_panel_administrador);
            console.log(acceso_panel_cliente);

            this.setState((prevState) => ({
                ...prevState,
                fields: {
                    ...prevState.fields,
                    idTipoUsuario: id,
                    nombre: nombre,
                    acceso_panel_administrador:
                        acceso_panel_administrador === "1" ? true : false,
                    acceso_panel_cliente:
                        acceso_panel_cliente === "1" ? true : false,
                },
            }));
        } else if (element.parentNode.classList.contains("editar")) {
            let id = Number(element.parentNode.getAttribute("data-id"));
            let nombre = element.parentNode.getAttribute("data-nombre");
            let acceso_panel_administrador = element.getAttribute(
                "data-acceso-panel-administrador"
            );
            let acceso_panel_cliente = element.getAttribute(
                "data-acceso-panel-cliente"
            );

            console.log(acceso_panel_administrador);
            console.log(acceso_panel_cliente);

            this.setState((prevState) => ({
                ...prevState,
                fields: {
                    ...prevState.fields,
                    idTipoUsuario: id,
                    nombre: nombre,
                    acceso_panel_administrador:
                        acceso_panel_administrador === "1" ? true : false,
                    acceso_panel_cliente:
                        acceso_panel_cliente === "1" ? true : false,
                },
            }));
        }
        //End Editar

        //Start Eliminar
        if (element.classList.contains("eliminar")) {
            let id = Number(element.getAttribute("data-id"));
            let nombre = element.getAttribute("data-nombre");
            let activo = element.getAttribute("data-activo") === "1";
            this.setState((prevState) => ({
                ...prevState,
                fields: {
                    ...prevState.fields,
                    idTipoUsuario: id,
                    nombre: nombre,
                    activo: activo,
                },
            }));
        } else if (element.parentNode.classList.contains("eliminar")) {
            let id = Number(element.parentNode.getAttribute("data-id"));
            let nombre = element.parentNode.getAttribute("data-nombre");
            let activo = element.parentNode.getAttribute("data-activo") === "1";

            this.setState((prevState) => ({
                ...prevState,
                fields: {
                    ...prevState.fields,
                    idTipoUsuario: id,
                    nombre: nombre,
                    activo: activo,
                },
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
        let idTipoUsuario = this.state.fields["idTipoUsuario"];

        await TipoUsuarioDataService.delete(idTipoUsuario)
            .then((response) => {
                responseData = response.data;
            })
            .catch(function (error) {
                errors = validForm.displayErrors(
                    error.response.data.errors,
                    errors
                );
            });

        this.setState({ errors: errors, loading: false });
        if (responseData != null) {
            await this.getAll(
                this.state.filterActive.value,
                this.state.filterTiposUsuarios.value
            );
            this.refs.closemodalDelete.click();
        }
        if (document.querySelector(".trChild")) {
            document.querySelectorAll(".trChild").forEach((item) => {
                item.remove();
            });
        }
    };

    saveSubmit = async (e) => {
        e.preventDefault();
        let errors = this.state.errors;
        errors = validForm.cleanErrors(errors);
        this.setState({ errors: errors, loading: true });

        let responseData;
        let data = this.getDataFromState();
        data.acceso_panel_administrador = data.acceso_panel_administrador
            ? 1
            : 0;
        data.acceso_panel_cliente = data.acceso_panel_cliente ? 1 : 0;
        data.user = auth.username();

        if (this.state.fields["idTipoUsuario"] === 0) {
            await TipoUsuarioDataService.create(data)
                .then((response) => {
                    responseData = response.data;
                })
                .catch(function (error) {
                    errors = validForm.displayErrors(
                        error.response.data.errors,
                        errors
                    );
                });
        } else {
            await TipoUsuarioDataService.update(
                this.state.fields["idTipoUsuario"],
                data
            )
                .then((response) => {
                    responseData = response.data;
                })
                .catch(function (error) {
                    errors = validForm.displayErrors(
                        error.response.data.errors,
                        errors
                    );
                });
        }

        this.setState({ errors: errors, loading: false });
        if (responseData != null) {
            this.getAll(
                this.state.filterActive.value,
                this.state.filterTiposUsuarios.value
            );
            this.refs.closemodalSave.click();
        }
    };

    getAll = async (activo, tipo_usuario_id) => {
        this.setState({ loading: true });

        await TipoUsuarioDataService.getAllDto({
            activo: activo,
            tipo_usuario_id: tipo_usuario_id,
        })
            .then((response) => {
                this.setState({
                    data: response.data,
                    loading: false,
                });
            })
            .catch((e) => {
                console.log(e);
            });
    };

    getSelectTiposUsuarios = async () => {
        this.setState({ loading: true });
        await UtilsDataService.getComboTipoUsuarioFilter({ activo: 1 })
            .then((response) => {
                if (Object.keys(response.data).length > 0) {
                    response.data.map((SelecTipoUsuario) => {
                        this.state.dataSelectTiposUsuariosIndex.push({
                            value: SelecTipoUsuario.id,
                            label: SelecTipoUsuario.nombre,
                        });
                    });
                }
                this.setState({ loading: false });
            })
            .catch((e) => {
                console.log(e);
            });
    };

    getDataFromState = () => {
        let source = Object.assign({}, this.state.fields);
        let target = Object.assign({}, fieldsConst);
        let keys = GetKeys(target);

        Object.entries(source).forEach((entry) => {
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
    };

    setValueFromObject = (path, value, obj) => {
        let schema = obj; // a moving reference to internal objects within obj
        let pList = path.split(".");
        let len = pList.length;
        for (let i = 0; i < len - 1; i++) {
            let elem = pList[i];
            if (!schema[elem]) schema[elem] = {};
            schema = schema[elem];
        }

        schema[pList[len - 1]] = value;
    };

    resetFields = async () => {
        let fields = validForm.resetObject(Object.assign({}, fieldsConst));
        this.setState(
            {
                fields: fields,
                errors: validForm.cleanErrors(this.state.errors),
            },
            function () {}
        );
    };

    resetModal = () => {
        this.resetFields();
    };

    render() {
        return (
            <div>
                <Spinner show={this.state.loading} />
                <div
                    className={`message-box message-box-${
                        this.state.fields.activo ? "danger" : "info"
                    } animated fadeIn`}
                    id="modal-delete"
                >
                    <form
                        name="UsuarioForm"
                        className="form-horizontal"
                        onSubmit={this.deleteSubmit.bind(this)}
                    >
                        <div className="mb-container">
                            <div className="mb-middle">
                                <div className="mb-title">
                                    <span
                                        className={`fa fa-${
                                            this.state.fields.activo
                                                ? "eraser"
                                                : "check"
                                        }`}
                                    ></span>
                                    {this.state.fields["activo"]
                                        ? " Desactivar"
                                        : " Activar"}{" "}
                                    tipo de usuario
                                </div>
                                <div className="mb-content">
                                    <p>{`¿Está seguro que desea ${
                                        this.state.fields["activo"]
                                            ? "desactivar"
                                            : "activar"
                                    } el tipo de usuario ${
                                        this.state.fields["nombre"]
                                    }? Puede volver a ${
                                        this.state.fields.activo
                                            ? "activarla"
                                            : "desactivarla"
                                    } en cualquier momento.`}</p>
                                    <p style={{ paddingLeft: "5px" }}>
                                        <span className="error">
                                            {this.state.errors[
                                                "errorGenerico"
                                            ] || ""}
                                        </span>
                                    </p>
                                </div>
                                <div className="mb-footer">
                                    <button className="btn btn-primary btn-lg pull-right">
                                        {this.state.fields["activo"]
                                            ? "Desactivar"
                                            : "Activar"}
                                    </button>
                                    &nbsp;
                                    <button
                                        type="button"
                                        className="btn btn-default"
                                        data-dismiss="modal"
                                        onClick={async () => {
                                            this.resetFields();
                                        }}
                                        ref="closemodalDelete"
                                    >
                                        Cancelar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>

                <div
                    className="modal"
                    id="modal"
                    tabIndex="-1"
                    role="dialog"
                    aria-labelledby="largeModalHead"
                    aria-hidden="true"
                >
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <button
                                    type="button"
                                    className="close"
                                    onClick={async () => {
                                        this.resetModal();
                                    }}
                                    data-dismiss="modal"
                                >
                                    <span aria-hidden="true">&times;</span>
                                    <span className="sr-only">Cerrar</span>
                                </button>
                                <h4 className="modal-title" id="largeModalHead">
                                    <i className="fa fa-list"></i>{" "}
                                    {this.state.fields["idTipoUsuario"] === 0
                                        ? "Nuevo"
                                        : "Editar"}{" "}
                                    tipo de usuario{" "}
                                </h4>
                            </div>
                            <div className="modal-body">
                                <form
                                    name="sucursalCuentaUsuarioForm"
                                    className="form-horizontal"
                                    onSubmit={this.saveSubmit.bind(this)}
                                >
                                    <Input
                                        divClass="col-md-12"
                                        inputName="idSucursalCuentaUsuario"
                                        inputType="hidden"
                                        inputValue={
                                            this.state.fields["idTipoUsuario"]
                                        }
                                    />

                                    <div className="row">
                                        <div className="form-group">
                                            <div className="col-md-12">
                                                <label htmlFor="">Nombre</label>
                                                <Input
                                                    divClass="input-group"
                                                    inputName="usuario"
                                                    inputType="text"
                                                    inputClass="form-control"
                                                    inputplaceholder="Ingrese el nombre del tipo de usuario."
                                                    inputValue={
                                                        this.state.fields[
                                                            "nombre"
                                                        ] || ""
                                                    }
                                                    inputOnchange={(e) => {
                                                        let fields =
                                                            this.state.fields;
                                                        let errors =
                                                            this.state.errors;
                                                        fields =
                                                            validForm.handleChangeField(
                                                                "nombre",
                                                                fields,
                                                                e
                                                            );
                                                        errors =
                                                            validForm.handleChangeErrors(
                                                                "nombre",
                                                                errors,
                                                                e
                                                            );
                                                        this.setState({
                                                            fields: fields,
                                                            errors: errors,
                                                        });
                                                    }}
                                                    spanClass="error"
                                                    spanError={
                                                        this.state.errors[
                                                            "nombre"
                                                        ] || ""
                                                    }
                                                    divClassSpanType={1}
                                                    divClassSpan="input-group-addon"
                                                    divClassSpanI="fa fa-indent"
                                                />
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <div className="col-md-6">
                                                <div className="input-group">
                                                    <Input
                                                        divClass="input-group"
                                                        inputName="acceso_panel_administrador"
                                                        inputType="checkbox"
                                                        inputClass="form-control"
                                                        inputplaceholder="¿Puede acceder al panel del administrador?"
                                                        checked
                                                        inputValue={
                                                            this.state.fields
                                                                .acceso_panel_administrador
                                                                ? "checked"
                                                                : ""
                                                        }
                                                        inputOnchange={(e) => {
                                                            let fields =
                                                                this.state
                                                                    .fields;
                                                            fields.acceso_panel_administrador =
                                                                e.target.checked
                                                                    ? 1
                                                                    : 0;
                                                            this.setState({
                                                                fields: fields,
                                                            });
                                                        }}
                                                        spanClass="error"
                                                        spanError={
                                                            this.state.errors[
                                                                "acceso_panel_administrador"
                                                            ] || ""
                                                        }
                                                        divClassSpanType={1}
                                                        divClassSpan="input-group-addon"
                                                        divClassSpanI="fa fa-indent"
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="input-group">
                                                    <Input
                                                        divClass="input-group"
                                                        inputName="acceso_panel_cliente"
                                                        inputType="checkbox"
                                                        inputClass="form-control"
                                                        inputplaceholder="¿Puede acceder al panel del cliente?"
                                                        checked
                                                        inputValue={
                                                            this.state.fields
                                                                .acceso_panel_cliente
                                                                ? "checked"
                                                                : ""
                                                        }
                                                        inputOnchange={(e) => {
                                                            let fields =
                                                                this.state
                                                                    .fields;
                                                            fields.acceso_panel_cliente =
                                                                e.target.checked
                                                                    ? 1
                                                                    : 0;
                                                            this.setState({
                                                                fields: fields,
                                                            });
                                                        }}
                                                        spanClass="error"
                                                        spanError={
                                                            this.state.errors[
                                                                "acceso_panel_cliente"
                                                            ] || ""
                                                        }
                                                        divClassSpanType={1}
                                                        divClassSpan="input-group-addon"
                                                        divClassSpanI="fa fa-indent"
                                                    />
                                                </div>
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
                                            ref="closemodalSave"
                                        >
                                            Cerrar
                                        </button>
                                        <button className="btn btn-primary pull-right">
                                            <i className="fa fa-save"></i>{" "}
                                            Guardar
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>

                <ul className="breadcrumb push-down-0">
                    <li>
                        <a href="/">Gestión de usuarios</a>
                    </li>
                    <li>
                        <a href="/">Tipos de usuario</a>
                    </li>
                </ul>
                <div className="content-frame">
                    <div className="content-frame-top">
                        <div className="row">
                            <div className="panel panel-default ">
                                <div className="panel-heading">
                                    <h3 className="panel-title">
                                        <i className="fa fa-building"></i>Tipos
                                        de usuarios
                                    </h3>
                                    <ul className="panel-controls">
                                        <li>
                                            <div style={{ minWidth: "150px" }}>
                                                <Select
                                                    divClass=""
                                                    selectplaceholder="Seleccione"
                                                    selectValue={
                                                        this.state.filterActive
                                                    }
                                                    selectOnchange={
                                                        this.handleFilterActive
                                                    }
                                                    selectoptions={
                                                        this.state
                                                            .dataSelectActive
                                                    }
                                                    selectIsSearchable={false}
                                                    selectclassNamePrefix="selectReact__value-container"
                                                    spanClass=""
                                                    spanError=""
                                                ></Select>
                                            </div>
                                        </li>
                                        <li>
                                            <div style={{ minWidth: "150px" }}>
                                                <Select
                                                    divClass=""
                                                    selectplaceholder="Seleccione"
                                                    selectValue={
                                                        this.state
                                                            .filterTiposUsuarios
                                                    }
                                                    selectOnchange={
                                                        this
                                                            .handleFilterTiposUsuarios
                                                    }
                                                    selectoptions={
                                                        this.state
                                                            .dataSelectTiposUsuariosIndex
                                                    }
                                                    selectIsSearchable={false}
                                                    selectclassNamePrefix="selectReact__value-container"
                                                    spanClass=""
                                                    spanError=""
                                                ></Select>
                                            </div>
                                        </li>
                                        <li>
                                            <ValidarPermiso
                                                IdModuloPermisoValidar={
                                                    ModuloPermiso.TiposDeUsuario
                                                        .Nuevo
                                                }
                                                DefaultTemplate={
                                                    <button
                                                        data-toggle="modal"
                                                        data-target="#modal"
                                                        className="btn btn-primary pull-right"
                                                        onClick={async () => {
                                                            this.resetModal();
                                                        }}
                                                    >
                                                        <i className="fa fa-plus"></i>{" "}
                                                        Nuevo tipo de usuario
                                                    </button>
                                                }
                                            />
                                        </li>
                                    </ul>
                                </div>
                                <div className="panel-body">
                                    <div>
                                        <ValidarPermiso
                                            IdModuloPermisoValidar={
                                                ModuloPermiso.TiposDeUsuario
                                                    .ObtenerTodos
                                            }
                                            DefaultTemplate={
                                                <TableReact
                                                    columns={this.state.columns}
                                                    data={this.state.data}
                                                    hiddenColumns={
                                                        this.state.hiddenColumns
                                                    }
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

export default TipoDeUsuario;
