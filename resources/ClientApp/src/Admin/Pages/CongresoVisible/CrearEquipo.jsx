import React, { Component } from 'react'
import AuthLogin from "../../../Utils/AuthLogin";
import congresoVisibleDataService from "../../../Services/Catalogo/CongresoVisible.Service";
import Spinner from "../../../Components/Spinner";
import Select from "../../../Components/Select";
import ValidForm from "../../../Utils/ValidForm";
import SunEditor from "suneditor-react";
import Input from "../../../Components/Input";
import ImageForMultipleResolution from "../../../Components/ImageForMultipleResolution";
import { Constantes } from "../../../Constants/Constantes.js";
import UtilsDataService from "../../../Services/General/Utils.Service";
import { ModuloPermiso } from "../../../Permisos/ModuloPermiso";
import ValidarPermiso from "../../../Permisos/ValidarPermiso";


const auth = new AuthLogin();

const constFileds = {
    id: 0,
    nombre: "",
    descripcion:"" ,
    congreso_visible_id:0,
    imagen: null,
    datosContacto: [],    
    user: "",
};
const constErrors = {
    id: "",
    nombre: "",
    descripcion:"" ,
    imagen: "",
    datosContacto: [],
    fechaCreacion: "",
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
const validForm = new ValidForm();
class CrearEquipo extends Component {
    constructor(props) {
        super(props);
        const idcv =
            this.props.match.params.idcv === undefined
                ? 0
                : this.props.match.params.idcv;
        const idequipo =
            this.props.match.params.idequipo === undefined
                ? 0
                : this.props.match.params.idequipo;
        this.state = {
            idcv: idcv,
            idequipo:idequipo,
            loading: false,
            data: constFileds,
            errors: constErrors,
            selectDatosContacto: SelectDatosContanto,
            dataSelectDatosContanto: [SelectDatosContanto],
            url: "",
            datosContactoDetalle: [],
            imagesResized: [],
            txtDescripcion:""
        };
    };

    componentDidMount = async () => {
        this.resetFields();      

        let idequipo = this.state.idequipo;
        if (idequipo != 0) await this.getByID(idequipo);
        else this.resetFields();
        await this.getComboDatosContacto();
    };

    handleDatosContacto = async (selectOption) => {
        this.setState({ selectDatosContacto: selectOption });
    };
    handlerAddDatosContacto = () => {
        let dato_contacto_id = this.state.selectDatosContacto.value;
        let url = this.state.url;
        if (url != "" && dato_contacto_id != 0) {
            let item = {
                id: 0,
                dato_contacto_id: dato_contacto_id,
                partido_id: this.state.data.id,
                cuenta: url,
                activo: 1,
            };
            let itemError = {
                id: "",
                dato_contacto_id: "",
                partido_id: "",
                cuenta: "",
                activo: "",
            };
            this.setState((prevState) => ({
                ...prevState,
                data: {
                    ...prevState.data,
                    datosContacto: [...prevState.data.datosContacto, item],
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
    getByID = async (idequipo) => {
        this.setState({ loading: true });
        await congresoVisibleDataService.getEquipo(idequipo)
            .then((response) => {
                let data = this.state.data;
                let errors = this.state.errors;
                data = response.data[0];               
                Object.assign(data, { user: auth.username() });
                data.imagen = data.equipo_imagen;
                data.datosContacto = data.equipo_datos_contacto;
                this.state.txtDescripcion = data.descripcion;
                data.datosContacto.map((item, i) => {
                    errors.datosContacto.push({
                        id: "",
                        dato_contacto_id: "",
                        cuenta: "",
                        activo: "",
                    });
                    return null;
                });
                this.setState({
                    data: data,
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
    
    removeDatoContacto = (itemToRemove) => {
        let datosContacto = this.state.data.datosContacto;
        let errorsdatosContacto = this.state.errors.datosContacto;

        datosContacto[itemToRemove]["activo"] = 0;
        errorsdatosContacto[itemToRemove]["cuenta"] = "";

        this.setState((prevState) => ({
            ...prevState,
            data: {
                ...prevState.data,
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
        let data = this.state.data;
        data.imagen = this.state.imagesResized;
        data.congreso_visible_id = this.state.idcv;
        data.descripcion = this.state.txtDescripcion;
        data.user = auth.username();                
        let responseData;   
        if (data.id === 0) {
            await congresoVisibleDataService.createEquipo(data)
                .then((response) => {
                    responseData = response.data;
                })
                .catch(function (error) {
                    errors = validForm.displayErrors(
                        error.response.data,
                        errors
                    );
                });
        } else {
            await congresoVisibleDataService.updateEquipo(data.id, data)
                .then((response) => {
                    responseData = response.data;               
                })
                .catch(function (error) {
                    errors = validForm.displayErrors(
                        error.response.data,
                        errors
                    );
                });
        }
        this.setState({ errors: errors, loading: false });
        if (responseData != null) {
            this.resetFields();
            this.props.history.push({
                pathname: `/equipo-congreso-visible/${this.state.idcv}`                
            });
        }
    };
    resetFields() {
        let fields = validForm.resetObject(constFileds);
        let errors = validForm.resetObject(constErrors);
        this.setState({ data: fields, errors: errors });
    };

    render() {
        return (
            <div>
                <Spinner show={this.state.loading} />
                <ul className="breadcrumb">
                    <li>Equipo</li>
                    <li>{this.state.data["id"] === 0 ? "Nuevo" : "Editar"}{" "} Equipo</li>
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
                                                {this.state.data["id"] === 0
                                                    ? "Nuevo"
                                                    : "Editar"}{" "}
                                                equipo
                                            </strong>
                                        </h3>
                                    </div>
                                    <div className="panel-body">
                                        <div className="row">
                                            <h3>Información del equipo</h3>
                                            <div className="col-md-9">
                                                <div className="form-group">
                                                    <label className="col-md-3 control-label">
                                                        Nombre del equipo
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
                                                                        .data
                                                                        .nombre ||
                                                                    ""
                                                                }
                                                                inputOnchange={(
                                                                    e
                                                                ) => {
                                                                    let data = this
                                                                        .state
                                                                        .data;
                                                                    let errors = this
                                                                        .state
                                                                        .errors;
                                                                    data = validForm.handleChangeField(
                                                                        "nombre",
                                                                        data,
                                                                        e
                                                                    );
                                                                    errors = validForm.handleChangeErrors(
                                                                        "nombre",
                                                                        errors,
                                                                        e
                                                                    );
                                                                    this.setState(
                                                                        {
                                                                            data: data,
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
                                                        <SunEditor
                                                            placeholder="..."
                                                            setContents={this.state.txtDescripcion || ""}
                                                            onChange={(e) => {
                                                                let state = this.state;
                                                                let errors = this.state.errors;
                                                                state = validForm.handleChangeFieldJodiEditor("txtDescripcion",state,e);
                                                                errors = validForm.handleChangeErrors("descripcion",errors,e);
                                                                this.setState({
                                                                    state,
                                                                    errors: errors,
                                                                });
                                                            }}
                                                            lang="es"
                                                            setOptions={{
                                                                buttonList: buttonList,
                                                                height: 200,
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
                                                                this.state.data
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
                                                                Constantes.equipoCVResolutions
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
                                                <hr />
                                                <div className="redes-sociales-container">
                                                    {this.state.data[
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
                                            <hr />
                                        </div>
                                        <hr />
                                        <div className="panel-footer">
                                            <ValidarPermiso
                                                IdModuloPermisoValidar = {this.state.data["id"] !== 0 ? ModuloPermiso.CongresoVisible.ModificarEquipo : ModuloPermiso.CongresoVisible.NuevoEquipo}
                                                DefaultTemplate = {
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
                </div>
            </div>
        )
    }
}

export default CrearEquipo;
