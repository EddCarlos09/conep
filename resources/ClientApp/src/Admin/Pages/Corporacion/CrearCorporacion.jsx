import React, { Component } from "react";
import CorporacionDataService from "../../../Services/Catalogo/Corporacion.Service";
import UtilsDataService from "../../../Services/General/Utils.Service";
import Input from "../../../Components/Input";
import ImageForMultipleResolution from "../../../Components/ImageForMultipleResolution";
import DatePicker from "../../../Components/DatePicker";
import Spinner from "../../../Components/Spinner";
import Select from "../../../Components/Select";
import ValidForm from "../../../Utils/ValidForm";
import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css"; // Import Sun Editor's CSS File
import { ChromePicker } from "react-color";
import * as FechaMysql from "../../../Utils/FormatDate";
import AuthLogin from "../../../Utils/AuthLogin";
import { Constantes } from "../../../Constants/Constantes.js";
import ValidarPermiso from "../../../Permisos/ValidarPermiso";
import { ModuloPermiso } from "../../../Permisos/ModuloPermiso";

const auth = new AuthLogin();
const constFileds = {
    id: 0,
    nombre: "",
    descripcion: "",
    imagen: null,
    datosContacto: [
        {
            id2: 0,
            dato_contacto_id: null,
            corporacion_id: null,
            cuenta: null,
            activo: 1,
        },
    ],
    miembros: [
        {
            id2: 0,
            corporacion_id: 0,
            congresista_id: null,
            corporacion_cargo_congresista_id: null,
            nombre: '',
            nombreCargo: '',
            activo: 1
        }
    ],
    user: "",
};
const constErrors = {
    id: "",
    nombre: "",
    descripcion: "",
    imagen: "",
    datosContacto: [
        {
            id2: "",
            dato_contacto_id: "",
            corporacion_id: "",
            cuenta: "",
            activo: "",
        },
    ],
    miembros: [
        {
            id2: "",
            corporacion_id: "",
            congresista_id: "",
            corporacion_cargo_congresista_id: "",
            nombre: '',
            nombreCargo: '',
            activo: ""
        }
    ],
    pathFoto: "",
};
const buttonList = [
    [
        "undo",
        "redo",
        "font",
        "fontSize",
        "formatBlock",
        "paragraphStyle",
        "blockquote",
        "bold",
        "underline",
        "italic",
        "strike",
        "subscript",
        "superscript",
        "fontColor",
        "hiliteColor",
        "textStyle",
        "removeFormat",
        "outdent",
        "indent",
        "align",
        "horizontalRule",
        "list",
        "lineHeight",
        "table",
        "link",
        "image",
        "video",
        "audio" /** 'math', */, // You must add the 'katex' library at options to use the 'math' plugin. // You must add the "imageGalleryUrl".
        /** 'imageGallery', */ "fullScreen",
        "showBlocks",
        "codeView",
        "preview",
        "print",
        "save",
        "template",
    ],
];
const SelectDatosContanto = {
    value: 0,
    label: "Seleccione un dato de contacto",
};
const constErrorsModal = {
    errorCuatrienio: '',
    errorMiembro: '',
};
const SelectDatosContacto = { value: 0, label: 'Seleccione un dato contacto' };
const SelectCongresistas = { value: 0, label: 'Seleccione miembro' };
const SelectCuatrienio = { value: 0, label: 'Seleccione quinquenio' };
const SelectCargo = { value: 0, label: 'Seleccione cargo' };
const validForm = new ValidForm();

class CrearCorporacion extends Component {
    constructor(props) {
        super(props);
        const id =
            this.props.match.params.id === undefined
                ? 0
                : this.props.match.params.id;
        this.state = {
            id: id,
            loading: false,
            fields: constFileds,
            errors: constErrors,
            selectDatosContacto: SelectDatosContanto,
            dataSelectDatosContanto: [SelectDatosContanto],
            selectCuatrienio: SelectCuatrienio,
            dataSelectCuatrienio: [SelectCuatrienio],
            selectCongresista: SelectCongresistas,
            dataSelectCongresistas: [SelectCongresistas],
            selectCargo: SelectCargo,
            dataSelectCargo: [SelectCargo],
            url: "",
            datosContactoDetalle: [],
            imagesResized: [],
            miembrosDetalle: [],
            miembroRepetido: false,
            errorsModal: constErrorsModal,
        };
    }

    componentDidMount = async () => {
        this.resetFields();
        await this.getComboDatosContacto();
        await this.getComboCuatrienio();
        await this.getComboCargoCongresista();

        this.state.fields.id = this.state.id;
        this.state.fields.user = auth.username();

        let id = this.state.id;
        if (id != 0) await this.getByID(id);
        else this.resetFields();
        
    };

    //combos
    getComboCuatrienio = async () => {
        this.setState({ loading: true });
        await UtilsDataService.getComboCuatrienio().then(response => {
            let combo = [];
            response.data.forEach(i => {
                combo.push({ value: i.id, label: i.nombre })
            })
            combo.unshift(SelectCuatrienio)
            this.setState({
                dataSelectCuatrienio: combo,
                loading: false
            });
        });
    }

    getComboCargoCongresista = async () => {
        this.setState({ loading: true });
        await UtilsDataService.getComboCargoCongresista().then(response => {
            let combo = [];
            response.data.forEach(i => {
                combo.push({ value: i.id, label: i.nombre })
            })
            combo.unshift(SelectCargo)
            this.setState({
                dataSelectCargo: combo,
                loading: false
            });
        });
    }
//pendiente
    getComboCongresista = async (cuatrienio) => {
        this.setState({ loading: true });
        let corporacion = this.state.id;//this.state.selectCorporacion.value;
        await UtilsDataService.getComboCongresistasComision(corporacion, cuatrienio)
            .then(response => {
                let combo = [];
                response.data.forEach(i => {
                    combo.push({ value: i.id, label: i.nombre })
                })
                combo.unshift(SelectCongresistas);
                this.setState({
                    dataSelectCongresistas: combo,
                    loading: false
                })

            })
    }

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
    //End combos

    getByID = async (id) => {
        this.setState({ loading: true });
        await CorporacionDataService.get(id)
            .then((response) => {
                let fields = this.state.fields;
                let errors = this.state.errors;
                fields = response.data[0];
                Object.assign(fields, { user: auth.username() });
                fields.imagen = fields.corporacion_imagen;
                fields.datosContacto = fields.corporacion_datos_contacto;
                fields.miembros = [];
                fields.datosContacto.map((item, i) => {
                    errors.datosContacto.push({
                        id: "",
                        dato_contacto_id: "",
                        corporacion_id: "",
                        cuenta: "",
                        activo: "",
                    });
                    return null;
                });
                fields.corporacion_miembro.map(item => {
                    response.data[0].miembros.push({
                        id: item.id,
                        corporacion_id: item.corporacion_id,
                        congresista_id: item.congresista_id,
                        corporacion_cargo_congresista_id: item.corporacion_cargo_congresista_id,
                        nombre: item.congresista.nombre,
                        nombreCargo: item.comision_cargo_congresista.nombre,
                        activo: 1
                    })
                    errors.miembros.push({
                        id: "",
                        corporacion_id: "",
                        congresista_id: "",
                        corporacion_cargo_congresista_id: "",
                        activo: ""
                    })
                });
                this.setState({
                    fields: fields,
                    loading: false,
                });
            })
            .catch((e) => {
                this.setState({
                    loading: false,
                });
                console.log(e);
            });
    };

    handleDatosContacto = async (selectOption) => {
        this.setState({ selectDatosContacto: selectOption });
    };

    handleCongresista = async (selectOption) => {
        this.setState({ selectCongresista: selectOption });
    };

    handleCuatrienio = async (selectOption) => {
        this.setState({ selectCuatrienio: selectOption });
        this.getComboCongresista(selectOption.value);
    };

    handleCargo = async (selectOption) => {
        this.setState({ selectCargo: selectOption });
    };

    handlerAddDatosContacto = () => {
        let dato_contacto_id = this.state.selectDatosContacto.value;
        let url = this.state.url;
        if (url != "" && dato_contacto_id != 0) {
            let item = {
                id: 0,
                dato_contacto_id: dato_contacto_id,
                corporacion_id: this.state.fields.id,
                cuenta: url,
                activo: 1,
            };
            let itemError = {
                id: "",
                dato_contacto_id: "",
                corporacion_id: "",
                cuenta: "",
                activo: "",
            };
            this.setState((prevState) => ({
                ...prevState,
                fields: {
                    ...prevState.fields,
                    datosContacto: [...prevState.fields.datosContacto, item],
                },
                errors: {
                    ...prevState.errors,
                    datosContacto: [
                        ...prevState.errors.datosContacto,
                        itemError,
                    ],
                },
            }));
        }
    };

    handlerOnLoadForImage = async (blob) => {
        let state = this.state;
        state.imagesResized = blob;
        this.setState({
            state
        })
    }
    handlerAddMiembro = () => {
        let errorsModal = validForm.resetObject(constErrorsModal);
        let cuatrienio = this.state.selectCuatrienio;
        let miembro = this.state.selectCongresista;
        let cargo = this.state.selectCargo;
        let errors = 0;
        if (cuatrienio.value === 0) {
            errorsModal.errorCuatrienio = "Seleccione un quinquenio";
            errors++;
        }
        if (miembro.value === 0) {
            errorsModal.errorMiembro = "Seleccione un miembro";
            errors++;
        }
        let repetidos = this.state.fields.miembros.filter(x => x.congresista_id === miembro.value && x.activo != 0);
        if (repetidos.length > 0) {
            errorsModal.errorMiembro = "El miembro ya se encuentra en la lista";
            errors++;
        }
        if (cargo.value === 0) {
            errorsModal.errorCargo = "Seleccione un cargo para el miembro";
            errors++;
        }
        if (errors > 0) {
            this.setState({ errorsModal: errorsModal, loading: false });
            return false;
        }

        let congresista_id = this.state.selectCongresista.value;
        let corporacion_cargo_congresista_id = this.state.selectCargo.value;
        let nombre_cargo = this.state.selectCargo.label;
        let nombre_cuatrienio = this.state.selectCuatrienio.label;
        let nombre_congresista = this.state.selectCongresista.label;
        let item = {
            id: 0,
            corporacion_id: this.state.fields.id,
            congresista_id: congresista_id,
            corporacion_cargo_congresista_id: corporacion_cargo_congresista_id,
            nombreCargo: nombre_cargo,
            nombre: nombre_congresista,
            activo: 1,
        };
        let itemError = {
            id: "",
            corporacion_id: "",
            congresista_id: "",
            corporacion_cargo_congresista_id:"",
            activo: "",
        };
        this.setState((prevState) => ({
            ...prevState,
            fields: {
                ...prevState.fields,
                miembros: [...prevState.fields.miembros, item],
            },
            errors: {
                ...prevState.errors,
                miembros: [
                    ...prevState.errors.miembros,
                    itemError,
                ],
            },
        }));
    }

    handlerRemoveMiembro = (itemToRemove) => {
        let miembros = this.state.fields.miembros;
        let errorsMiembros = this.state.errors.miembros;

        miembros[itemToRemove]["activo"] = 0;

        this.setState((prevState) => ({
            ...prevState,
            fields: {
                ...prevState.fields,
                miembros: miembros,
            },
        }));
    }


    // End handlers for imageForMultipleResolution
    removeDatoContacto = (itemToRemove) => {
        let datosContacto = this.state.fields.datosContacto;
        let errorsdatosContacto = this.state.errors.datosContacto;

        datosContacto[itemToRemove]["activo"] = 0;
        errorsdatosContacto[itemToRemove]["cuenta"] = "";

        this.setState((prevState) => ({
            ...prevState,
            fields: {
                ...prevState.fields,
                datosContacto: datosContacto,
            },
        }));
    };

    renderDatoContacto = (idTipoContacto) => {
        let datosContacto = this.state.datosContactoDetalle;
        let elemento = datosContacto.find((x) => x.id == idTipoContacto);
        if (elemento != undefined) {
            return elemento.imagen;
        }
    };
    // Métodos asíncronos

    getComboDatosContacto = async () => {
        this.setState({ loading: true });
        await UtilsDataService.getComboDatosContacto().then((response) => {
            response.data.map((item) => {
                this.state.dataSelectDatosContanto.push({
                    value: item.id,
                    label: item.nombre,
                });
            });
            let data = response.data;
            this.setState({ loading: false, datosContactoDetalle: data });
        });
    };

    saveSubmit = async () => {
        let errors = this.state.errors;
        errors = validForm.cleanErrors(errors);
        this.setState({ errors: errors, loading: true });
        let fields = this.state.fields;
        fields.imagen = this.state.imagesResized;
        fields.user = auth.username();
        let responseData;
        
        await CorporacionDataService.update(fields.id, fields)
            .then((response) => {
                responseData = response.data;
                this.props.history.push({
                    pathname: "/corporacion",
                });
            })
            .catch(function (error) {
                errors = validForm.displayErrors(
                    error.response.data,
                    errors
                );
            });
        this.setState({ errors: errors, loading: false });
        if (responseData != null) {
            this.resetFields();
            this.props.history.push({
                pathname: "/corporacion",
            });
        }
    };

    resetFields() {
        let fields = validForm.resetObject(constFileds);
        let errors = validForm.resetObject(constErrors);
        this.setState({ fields: fields, errors: errors });
    }

    render() {
        return (
            <>
                <Spinner show={this.state.loading} />
                <ul className="breadcrumb">
                    <li>Corporacion</li>
                    <li>Editar corporación</li>
                </ul>
                <div className="page-content-wrap">
                    <div className="row">
                        <div className="col-md-12">
                            <form className="form-horizontal">
                                <div className="panel panel-default">
                                    <div className="panel-heading">
                                        <h3 className="panel-title">
                                            <strong>
                                                <i className="fa fa-user"></i>{" "}
                                                Editar corporación
                                            </strong>
                                        </h3>
                                    </div>
                                    <div className="panel-body">
                                        <div className="row">
                                            <h3>Información de la corporación</h3>
                                            <div className="col-md-9">
                                                <div className="form-group">
                                                    <label className="col-md-3 control-label">
                                                        Nombre de la corporación
                                                    </label>
                                                    <div className="col-md-9">
                                                        <div className="input-group">
                                                            <Input
                                                                divClass="input-group"
                                                                inputName="nombre"
                                                                inputType="text"
                                                                inputClass="form-control"
                                                                inputplaceholder="Ingrese el nombre"
                                                                inputValue={
                                                                    this.state
                                                                        .fields
                                                                        .nombre ||
                                                                    ""
                                                                }
                                                                inputOnchange={(
                                                                    e
                                                                ) => {
                                                                    let fields = this
                                                                        .state
                                                                        .fields;
                                                                    let errors = this
                                                                        .state
                                                                        .errors;
                                                                        fields = validForm.handleChangeField(
                                                                        "nombre",
                                                                        fields,
                                                                        e
                                                                    );
                                                                    errors = validForm.handleChangeErrors(
                                                                        "nombre",
                                                                        errors,
                                                                        e
                                                                    );
                                                                    this.setState(
                                                                        {
                                                                            fields: fields,
                                                                            errors: errors,
                                                                        }
                                                                    );
                                                                }}
                                                                spanClass="error"
                                                                spanError={
                                                                    this.state
                                                                        .errors[
                                                                        "nombre"
                                                                    ] || ""
                                                                }
                                                                divClassSpanType={
                                                                    1
                                                                }
                                                                divClassSpan="input-group-addon"
                                                                divClassSpanI="fa fa-indent"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <label className="col-md-3 control-label">
                                                        Descripción
                                                    </label>
                                                    <div className="col-md-9">
                                                        <textarea
                                                            name="descripcion"
                                                            value={this.state.fields["descripcion"] || ''}
                                                            className="form-control border"
                                                            rows="5"
                                                            placeholder="Escriba una descripción"
                                                            onChange={e => {
                                                                let fields = this.state.fields;
                                                                let errors = this.state.errors;
                                                                fields = validForm.handleChangeField("descripcion", fields, e);
                                                                errors = validForm.handleChangeErrors("descripcion", errors, e);
                                                                this.setState({ fields: fields, errors: errors });
                                                            }}
                                                        />
                                                        <span className="error">
                                                            {this.state.errors["descripcion"] || ""}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <label className="col-md-3 control-label">
                                                        Imagen actual
                                                    </label>
                                                    <div className="col-md-9">
                                                        <ImageForMultipleResolution
                                                            key={1}
                                                            preview={true}
                                                            previewData={
                                                                this.state.fields
                                                                    .imagen ||
                                                                null
                                                            }
                                                            origin={auth.pathApi()}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <label className="col-md-3 control-label">
                                                        Imagen
                                                    </label>
                                                    <div className="col-md-9">
                                                        <ImageForMultipleResolution
                                                            key={2}
                                                            handlerOnLoad={
                                                                this
                                                                    .handlerOnLoadForImage
                                                            }
                                                            resolutions={
                                                                Constantes.defaultResolutions
                                                            }
                                                            handlerOnReset={
                                                                this
                                                                    .handlerOnResetForImage
                                                            }
                                                            prefix="figura"
                                                            controlName="images-1"
                                                        />
                                                        <span className="error">
                                                            {this.state.errors[
                                                                "imagen"
                                                            ] || ""}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <label className="col-md-3 control-label">
                                                        Datos de contacto
                                                    </label>
                                                    <div className="col-md-4">
                                                        <Select
                                                            divClass=""
                                                            selectplaceholder="Seleccione"
                                                            selectValue={
                                                                this.state
                                                                    .selectDatosContacto
                                                            }
                                                            selectOnchange={
                                                                this
                                                                    .handleDatosContacto
                                                            }
                                                            selectoptions={
                                                                this.state
                                                                    .dataSelectDatosContanto
                                                            }
                                                            selectIsSearchable={
                                                                false
                                                            }
                                                            selectclassNamePrefix="selectReact__value-container"
                                                            spanClass=""
                                                            spanError=""
                                                        ></Select>
                                                    </div>
                                                    <div className="col-md-5">
                                                        <div className="input-group">
                                                            <span className="input-group-addon">
                                                                <i className="fa fa-link"></i>
                                                            </span>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                placeholder="http://..."
                                                                onChange={(
                                                                    e
                                                                ) => {
                                                                    this.setState(
                                                                        {
                                                                            url:
                                                                                e
                                                                                    .currentTarget
                                                                                    .value,
                                                                        }
                                                                    );
                                                                }}
                                                            />
                                                            <span className="input-group-addon wbtn">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => {
                                                                        this.handlerAddDatosContacto();
                                                                    }}
                                                                    className="btn btn-primary"
                                                                >
                                                                    <i className="fa fa-plus"></i>
                                                                </button>
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="redes-sociales-container">
                                                    {this.state.fields[
                                                        "datosContacto"
                                                    ].map((item, i) => {
                                                        if (item.activo) {
                                                            return (
                                                                <div
                                                                    key={i}
                                                                    className="form-group"
                                                                >
                                                                    <label className="col-md-3 control-label"></label>
                                                                    <div className="col-md-9">
                                                                        <div className="input-group">
                                                                            <span className="input-group-addon">
                                                                                <img
                                                                                    style={{
                                                                                        width:
                                                                                            "100%",
                                                                                    }}
                                                                                    src={
                                                                                        this.renderDatoContacto(
                                                                                            item.dato_contacto_id
                                                                                        ) !=
                                                                                        null
                                                                                            ? auth.pathApi() +
                                                                                                  this.renderDatoContacto(
                                                                                                      item.dato_contacto_id
                                                                                                  ) ||
                                                                                              ""
                                                                                            : Constantes.NoImagenPicture
                                                                                    }
                                                                                />
                                                                                {/* <i className={this.renderDatoContacto(item.dato_contacto_id)}></i> */}
                                                                            </span>
                                                                            <input
                                                                                type="text"
                                                                                name={
                                                                                    "cuenta" +
                                                                                    i.toString()
                                                                                }
                                                                                className="form-control"
                                                                                placeholder="Ingrese la cuenta"
                                                                                value={
                                                                                    item.cuenta ||
                                                                                    ""
                                                                                }
                                                                                readOnly={
                                                                                    true
                                                                                }
                                                                            />
                                                                            <span className="input-group-addon wbtn">
                                                                                <button
                                                                                    type="button"
                                                                                    onClick={() => {
                                                                                        this.removeDatoContacto(
                                                                                            i
                                                                                        );
                                                                                    }}
                                                                                    className="btn btn-danger"
                                                                                >
                                                                                    <i className="fa fa-trash-alt"></i>
                                                                                </button>
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                    <span className="error">
                                                                        {this
                                                                            .state
                                                                            .errors[
                                                                            "datosContacto"
                                                                        ][i]
                                                                            ? this
                                                                                  .state
                                                                                  .errors[
                                                                                  "datosContacto"
                                                                              ][
                                                                                  i
                                                                              ]
                                                                                  .cuenta
                                                                            : ""}
                                                                    </span>
                                                                </div>
                                                            );
                                                        }
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="panel-body">
                                        <div className="row">
                                            <h3>Miembros</h3>
                                            <div className="col-md-12">
                                                <button
                                                    type="button"
                                                    // onClick={() => { this.handlerOpenModal(x) }} 
                                                    data-toggle="modal"
                                                    data-target="#modal-add-miembro"
                                                    className="pull-right btn btn-primary"><i className="fa fa-plus"></i> Añadir miembros</button>
                                                <div className="agregados">
                                                <div className="panel-body list-group list-group-contacts list-group-contacts-two-columns">
                                                    {
                                                        this.state.fields.miembros.map((item, i) => {
                                                            if (item.activo) {
                                                                // let path = y.idRepresentanteNavigation.pathFoto === "" || y.idRepresentanteNavigation.pathFoto === null ? "assets/images/users/no-image.jpg" : auth.pathApi() + y.idRepresentanteNavigation.pathFoto;
                                                                let path = "assets/images/users/no-image.jpg";
                                                                // let coordinador = y.idTipoPonente === 1 ? "- Coordinador" : "";
                                                                return (
                                                                    <>
                                                                        <div key={i} className="list-group-item">
                                                                            <div className="origin">{item.nombreCargo}</div>
                                                                            <div className="list-group-status status-online"></div>
                                                                            <img src={path} className="pull-left" alt={item.nombre} />
                                                                            <span className="contacts-title">{item.nombre}</span>
                                                                            <button onClick={() => { this.handlerRemoveMiembro(i) }} className="btn btn-danger pull-right" type="button"><i className="fa fa-trash-alt"></i></button>
                                                                        </div>
                                                                        <span className="error">
                                                                            {this.state.errors["miembros"][i]
                                                                                ? this.state.errors["miembros"][i].congresista_id
                                                                                : ""}
                                                                        </span>
                                                                        <span className="error">
                                                                            {this.state.errors["miembros"][i]
                                                                                ? this.state.errors["miembros"][i].corporacion_cargo_congresista_id
                                                                                : ""}
                                                                        </span>
                                                                    </>
                                                                )
                                                            }
                                                        })
                                                    }
                                                </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="panel-body">
                                        <div className="panel-footer">
                                        <ValidarPermiso
                                            IdModuloPermisoValidar={ModuloPermiso.Corporacion.Nuevo}
                                            DefaultTemplate={
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        this.saveSubmit();
                                                    }}
                                                    className="btn btn-success pull-right"
                                                >
                                                    <i className="fa fa-check"></i>{" "}
                                                    Guardar
                                                </button>
                                            }
                                        />
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                    <div className="modal" id="modal-add-miembro" tabIndex="-1" role="dialog" aria-labelledby="largeModalHead" aria-hidden="true">
                        <div className="modal-dialog modal-lg">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <button
                                        type="button"
                                        className="close"
                                        data-dismiss="modal">
                                        <span aria-hidden="true">&times;</span><span className="sr-only">Cerrar</span></button>
                                    <h4 className="modal-title" id="largeModalHead"><i className="fa fa-list"></i> Añadiendo miembros</h4>
                                </div>
                                <div className="modal-body">
                                    <form className="form-horizontal">
                                        <div className="row">
                                            <div className="col-md-6">
                                                <div className="form-group">
                                                    <div className="input-group">
                                                        <span className="input-group-addon"><i className="fa fa-circle"></i></span>
                                                        <Select
                                                            divClass=""
                                                            selectplaceholder="Seleccione"
                                                            selectValue={this.state.selectCuatrienio}
                                                            selectOnchange={this.handleCuatrienio}
                                                            selectoptions={this.state.dataSelectCuatrienio}
                                                            selectIsSearchable={true}
                                                            selectclassNamePrefix="selectReact__value-container"
                                                            spanClass=""
                                                            spanError=""
                                                        >
                                                        </Select>
                                                    </div>
                                                </div>
                                                <span className={`error`}>{this.state.errorsModal.errorCuatrienio || ''}</span>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group">
                                                    <div className="input-group">
                                                        <span className="input-group-addon"><i className="fa fa-user"></i></span>
                                                        <Select
                                                            divClass=""
                                                            selectplaceholder="Seleccione"
                                                            selectValue={this.state.selectCongresista}
                                                            selectOnchange={this.handleCongresista}
                                                            selectoptions={this.state.dataSelectCongresistas}
                                                            selectIsSearchable={true}
                                                            selectclassNamePrefix="selectReact__value-container"
                                                            spanClass=""
                                                            spanError=""
                                                        >
                                                        </Select>
                                                    </div>
                                                </div>
                                                <span className={`error`}>{this.state.errorsModal.errorMiembro || ''}</span>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group">
                                                    <div className="input-group">
                                                        <span className="input-group-addon"><i className="fa fa-user"></i></span>
                                                        <Select
                                                            divClass=""
                                                            selectplaceholder="Seleccione"
                                                            selectValue={this.state.selectCargo}
                                                            selectOnchange={this.handleCargo}
                                                            selectoptions={this.state.dataSelectCargo}
                                                            selectIsSearchable={true}
                                                            selectclassNamePrefix="selectReact__value-container"
                                                            spanClass=""
                                                            spanError=""
                                                        >
                                                        </Select>
                                                        <span className="input-group-addon wbtn"><button onClick={this.handlerAddMiembro} type="button" className="btn btn-primary"><i className="fa fa-plus"></i></button></span>
                                                    </div>
                                                </div>
                                                <span className={`error`}>{this.state.errorsModal.errorCargo || ''}</span>
                                            </div>
                                            <div className="agregados">
                                                <hr />
                                                <div className="panel-body list-group list-group-contacts list-group-contacts-two-columns">
                                                    {this.state.fields.miembros.map((y, j) => {
                                                        if (y.activo) {
                                                            // let path = y.idRepresentanteNavigation.pathFoto === "" || y.idRepresentanteNavigation.pathFoto === null ? "assets/images/users/no-image.jpg" : auth.pathApi() + y.idRepresentanteNavigation.pathFoto;
                                                            let path = "assets/images/users/no-image.jpg";
                                                            // let coordinador = y.idTipoPonente === 1 ? "- Coordinador" : "";
                                                            return (
                                                                <div key={j} className="list-group-item">
                                                                    <div className="origin">{y.nombreCargo}</div>
                                                                    <div className="list-group-status status-online"></div>
                                                                    <img src={path} className="pull-left" alt={y.nombre} />
                                                                    <span className="contacts-title">{y.nombre}</span>
                                                                    <button type="button" onClick={() => { this.handlerRemoveMiembro(j) }} className="btn btn-danger pull-right" ><i className="fa fa-trash-alt"></i></button>
                                                                </div>
                                                            )
                                                        }
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                        <hr />
                                        <p><i className="fa fa-info-circle"></i> Los miembros agregados en esta etapa aún no se registran en la base de datos. Debe guardar completamente el formulario.</p>
                                        <div className="panel-footer">
                                            <button
                                                type="button"
                                                className="btn btn-default"
                                                data-dismiss="modal"
                                                ref="closemodalSave">Cerrar</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

export default CrearCorporacion;
