import React, { Component } from 'react';
import Spinner from '../../../Components/Spinner';
import congresoVisibleDataService from "../../../Services/Catalogo/CongresoVisible.Service";
import UtilsDataService from "../../../Services/General/Utils.Service";
import ImageForMultipleResolution from "../../../Components/ImageForMultipleResolution";
import Select from "../../../Components/Select";
import ValidForm from "../../../Utils/ValidForm";
import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css"; // Import Sun Editor's CSS File
import * as FechaMysql from "../../../Utils/FormatDate";
import AuthLogin from "../../../Utils/AuthLogin";
import { Constantes } from "../../../Constants/Constantes.js";
import { ModuloPermiso } from "../../../Permisos/ModuloPermiso";
import ValidarPermiso from "../../../Permisos/ValidarPermiso";

const auth = new AuthLogin();
const constFileds = {
    id: 0,
    queEs: "",
    objetivos: "",
    historiaymision: "",
    nuestroFuturo: "",
    nuestroReto: "",
    imagen: null,
    datosContacto: [],
    dpfechaCreacion: new Date(),
    fechaDeCreacion: "",
    user: "",
};
const constErrors = {
    id: "",
    queEs: "",
    objetivos: "",
    historiaymision: "",
    nuestroFuturo: "",
    nuestroReto: "",
    imagen: "",
    datosContacto: [
        {
            id: "",
            dato_contacto_id: "",
            partido_id: "",
            cuenta: "",
            activo: "",
        },
    ],
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

class EditarCongresoVisible extends Component {
    constructor(props) {
        super(props);

        const id =
            this.props.match.params.id === undefined
                ? 0
                : this.props.match.params.id;
        this.state = {
            id: id,
            loading: true,
            data: constFileds,
            errors: constErrors,
            selectDatosContacto: SelectDatosContanto,
            dataSelectDatosContanto: [SelectDatosContanto],
            url: "",
            datosContactoDetalle: [],
            imagesResized: [],
            txtQueEs: "",
            txtObjetivos: "",
            txtHistoriaYMision: "",
            txtNuestroFuturo: "",
            txtNuestroReto: ""
        }
    }

    componentDidMount = async () => {
        this.resetFields();
        this.state.data.id = this.state.id;
        this.state.data.user = auth.username();

        let id = this.state.id;
        if (id != 0) await this.getByID(id);
        else this.resetFields();

        await this.getComboDatosContacto();
    };

    getByID = async (id) => {
        this.setState({ loading: true });
        await congresoVisibleDataService.get(id)
            .then((response) => {
                let data = this.state.data;
                let errors = this.state.errors;
                data = response.data[0];
                Object.assign(data, { user: auth.username() });
                data.imagen = data.congreso_visible_imagen;
                data.datosContacto = data.congreso_visible_datos_contacto;
                this.state.txtQueEs = response.data[0].queEs;
                this.state.txtObjetivos = response.data[0].objetivos;
                this.state.txtHistoriaYMision = response.data[0].historiaymision;
                this.state.txtNuestroFuturo = response.data[0].nuestroFuturo;
                this.state.txtNuestroReto = response.data[0].nuestroReto;

                data.datosContacto.map((item, i) => {
                    errors.datosContacto.push({
                        id: "",
                        dato_contacto_id: "",
                        partido_id: "",
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

    // End handlers for imageForMultipleResolution
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
        let data = this.state.data;
        data.imagen = this.state.imagesResized;
        data.user = auth.username();
        data.queEs = this.state.txtQueEs != null ? this.state.txtQueEs.replace(/<[^>]*>?/g, '') : this.state.txtQueEs;
        data.historiaymision = this.state.txtHistoriaYMision != null ? this.state.txtHistoriaYMision.replace(/<[^>]*>?/g, '') : this.state.txtHistoriaYMision;
        data.objetivos = this.state.txtObjetivos != null ? this.state.txtObjetivos.replace(/<[^>]*>?/g, '') : this.state.txtObjetivos;
        data.nuestroFuturo = this.state.txtNuestroFuturo != null ? this.state.txtNuestroFuturo.replace(/<[^>]*>?/g, '') : this.state.txtNuestroFuturo;
        data.nuestroReto = this.state.txtNuestroReto != null ? this.state.txtNuestroReto.replace(/<[^>]*>?/g, '') : this.state.txtNuestroReto;

        let responseData;

        await congresoVisibleDataService.update(data.id, data)
            .then((response) => {
                responseData = response.data;
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
                pathname: "/congreso-visible",
            });
        }
    };

    resetFields() {
        let fields = validForm.resetObject(constFileds);
        let errors = validForm.resetObject(constErrors);
        this.setState({ data: fields, errors: errors });
    }

    render() {
        return (
            <div>
                <Spinner show={this.state.loading} />
                <ul className="breadcrumb">
                    <li>Congreso Visible</li>
                    <li>Editar Congreso Visible</li>
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
                                                Congreso Visible
                                            </strong>
                                        </h3>
                                    </div>
                                    <div className="panel-body">
                                        <div className="row">
                                            <h3>Información de congreso Visible</h3>
                                            <div className="col-md-9">
                                                <div className="form-group">
                                                    <label className="col-md-3 control-label">
                                                        ¿Qué es Congreso Visible?
                                                    </label>
                                                    <div className="col-md-9">
                                                        <SunEditor
                                                            placeholder="..."
                                                            setContents={this.state.txtQueEs || ""}
                                                            onChange={(e) => {
                                                                let state = this.state;
                                                                let errors = this.state.errors;
                                                                state = validForm.handleChangeFieldJodiEditor("txtQueEs", state, e);
                                                                errors = validForm.handleChangeErrors("queEs", errors, e);
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
                                                            {this.state.errors["queEs"] || ""}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <label className="col-md-3 control-label">
                                                        Objetivos
                                                    </label>
                                                    <div className="col-md-9">
                                                        <SunEditor
                                                            placeholder="..."
                                                            setContents={this.state.txtObjetivos || ""}
                                                            onChange={(e) => {
                                                                let state = this.state;
                                                                let errors = this.state.errors;
                                                                state = validForm.handleChangeFieldJodiEditor("txtObjetivos", state, e);
                                                                errors = validForm.handleChangeErrors("objetivos", errors, e);
                                                                this.setState({
                                                                    state,
                                                                    errors: errors,
                                                                });
                                                            }}
                                                            setOptions={{
                                                                buttonList: buttonList,
                                                                height: 200,
                                                            }}
                                                        />
                                                        <span className="error">
                                                            {this.state.errors["objetivos"] || ""}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <label className="col-md-3 control-label">
                                                        Nuestra Historia y Misión
                                                    </label>
                                                    <div className="col-md-9">
                                                        <SunEditor
                                                            placeholder="..."
                                                            setContents={this.state.txtHistoriaYMision || ""}
                                                            onChange={(e) => {
                                                                let state = this.state;
                                                                let errors = this.state.errors;
                                                                state = validForm.handleChangeFieldJodiEditor("txtHistoriaYMision", state, e);
                                                                errors = validForm.handleChangeErrors("historiaymision", errors, e);
                                                                this.setState({
                                                                    state,
                                                                    errors: errors,
                                                                });
                                                            }}
                                                            setOptions={{
                                                                buttonList: buttonList,
                                                                height: 200,
                                                            }}
                                                        />
                                                        <span className="error">
                                                            {this.state.errors["historiaymision"] || ""}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <label className="col-md-3 control-label">
                                                        Nuestro Futuro
                                                    </label>
                                                    <div className="col-md-9">
                                                        <SunEditor
                                                            setContents={this.state.txtNuestroFuturo || ""}
                                                            onChange={(e) => {
                                                                let state = this.state;
                                                                let errors = this.state.errors;
                                                                state = validForm.handleChangeFieldJodiEditor("txtNuestroFuturo", state, e);
                                                                errors = validForm.handleChangeErrors("nuestroFuturo", errors, e);
                                                                this.setState({
                                                                    state,
                                                                    errors: errors,
                                                                });
                                                            }}
                                                            setOptions={{
                                                                buttonList: buttonList,
                                                                height: 200,
                                                            }}
                                                        />
                                                        <span className="error">
                                                            {this.state.errors["nuestroFuturo"] || ""}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <label className="col-md-3 control-label">
                                                        Nuestro Reto
                                                    </label>
                                                    <div className="col-md-9">
                                                        <SunEditor
                                                            setContents={this.state.txtNuestroReto || ""}
                                                            onChange={(e) => {
                                                                let state = this.state;
                                                                let errors = this.state.errors;
                                                                state = validForm.handleChangeFieldJodiEditor("txtNuestroReto", state, e);
                                                                errors = validForm.handleChangeErrors("nuestroReto", errors, e);
                                                                this.setState({
                                                                    state,
                                                                    errors: errors,
                                                                });
                                                            }}
                                                            setOptions={{
                                                                buttonList: buttonList,
                                                                height: 200,
                                                            }}
                                                        />
                                                        <span className="error">
                                                            {this.state.errors["nuestroReto"] || ""}
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
                                                                                <i className={this.renderDatoContacto(item.dato_contacto_id)}></i>
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
                                                IdModuloPermisoValidar={ModuloPermiso.CongresoVisible.Modificar}
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
                </div>
            </div>
        )
    }
}

export default EditarCongresoVisible;