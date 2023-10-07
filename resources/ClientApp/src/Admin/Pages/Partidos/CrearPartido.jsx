import React, { Component } from "react";
import PartidoDataService from "../../../Services/Catalogo/Partido.Service";
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
import Dropzone from 'react-dropzone-uploader'
import * as FileCfg from "../../../Utils/FileConfig";
import { ModuloPermiso } from "../../../Permisos/ModuloPermiso";
import ValidarPermiso from "../../../Permisos/ValidarPermiso";

const auth = new AuthLogin();
const constFileds = {
    id: 0,
    nombre: "",
    resenaHistorica: "",
    lineamientos: "",
    lugar: "",
    color: "#000000",
    estatutos: "",
    fileEstatutos: "",
    imagen: null,
    datosContacto: [
        {
            id2: 0,
            dato_contacto_id: null,
            partido_id: null,
            cuenta: null,
            activo: 1,
        },
    ],
    dpfechaCreacion: new Date(),
    fechaDeCreacion: "",
    user: "",
};
const constErrors = {
    id: "",
    nombre: "",
    resenaHistorica: "",
    lineamientos: "",
    lugar: "",
    color: "",
    estatutos: "",
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

class CrearPartido extends Component {
    constructor(props) {
        super(props);
        const id =
            this.props.match.params.id === undefined
                ? 0
                : this.props.match.params.id;
        this.state = {
            id: id,
            loading: false,
            data: constFileds,
            errors: constErrors,
            selectDatosContacto: SelectDatosContanto,
            dataSelectDatosContanto: [SelectDatosContanto],
            textResenaHistorica: "",
            textLineamientos: "",
            textEstatutos: "",
            url: "",
            datosContactoDetalle: [],
            imagesResized: [],
        };
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
        await PartidoDataService.get(id)
            .then((response) => {
                let state = this.state;
                let errors = this.state.errors;
                state.data = response.data[0];
                Object.assign(state.data, { user: auth.username() });
                state.data.imagen = state.data.partido_imagen;
                state.data.dpfechaCreacion = state.data.fechaDeCreacion;
                state.data.datosContacto = state.data.partido_datos_contacto;
                state.textLineamientos = state.data.lineamientos;
                state.textResenaHistorica = state.data.resenaHistorica;
                state.textEstatutos = state.data.estatutos;
                state.data.datosContacto.map((item, i) => {
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
                    state,
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
    // Color picker
    changeColorPicker = (color) => {
        // Para el control y data
        let data = this.state.data;
        data.color = `${color.hex}`;
        this.setState({ data: data });
    };
    // End color picker

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
    handleChangeStatus = ({ meta, file }, status) => {

        let fields = this.state.data;
        let errors = this.state.errors;
        fields.fileEstatutos = file;
        var sizefile = parseInt(file.size / 1024);
        errors = validForm.cleanErrors(errors);
        if (fields.fileEstatutos != null && fields.fileEstatutos != undefined) {
            if (sizefile > 15000000) {
                errors.estatutos = "El tamaño del archivo no debe ser mayor a 15MB";
            } else {
                let fileext = FileCfg.GetInfoFile(file);
                let typesext = FileCfg.TypesAccepted([FileCfg.Documents]);
                if (typesext.indexOf(fileext) === -1) {
                    errors.estatutos = "Selecciona un archivo válido";

                    this.setState({ errors: errors });
                    return false;
                }
                this.setState({ fields: fields });
            }

        } else {
            errors.estatutos = "Seleccione un archivo";
        }

    }
    saveSubmit = async () => {
        let errors = this.state.errors;
        errors = validForm.cleanErrors(errors);
        this.setState({ errors: errors, loading: true });
        let data = this.state.data;
        data.fechaDeCreacion = FechaMysql.DateFormatMySql(data.dpfechaCreacion);
        data.imagen = this.state.imagesResized;
        data.user = auth.username();
        data.lineamientos = this.state.textLineamientos;
        data.resenaHistorica = this.state.textResenaHistorica;
        data.estatutos = this.state.textEstatutos;
        let responseData;
        if (data.id === 0) {
            await PartidoDataService.create(data)
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
            await PartidoDataService.update(data.id, data)
                .then((response) => {
                    responseData = response.data;
                    this.props.history.push({
                        pathname: "/partidos",
                    });
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
                pathname: "/partidos",
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
            <>
                <Spinner show={this.state.loading} />
                <ul className="breadcrumb">
                    <li>Partidos</li>
                    <li>Nuevo partido</li>
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
                                                partido
                                            </strong>
                                        </h3>
                                    </div>
                                    <div className="panel-body">
                                        <div className="row">
                                            <h3>Información del partido</h3>
                                            <div className="col-md-9">
                                                <div className="form-group">
                                                    <label className="col-md-3 control-label">
                                                        Nombre del partido
                                                    </label>
                                                    <div className="col-md-9">
                                                        <div className="input-group">
                                                            <Input
                                                                divClass="input-group"
                                                                inputName="nombre"
                                                                inputType="text"
                                                                inputClass="form-control"
                                                                inputplaceholder="Ingrese el nombre"
                                                                inputValue={this.state.data.nombre || ""}
                                                                inputOnchange={(e) => {
                                                                    let data = this.state.data;
                                                                    let errors = this.state.errors;
                                                                    data = validForm.handleChangeField("nombre",data,e);
                                                                    errors = validForm.handleChangeErrors("nombre",errors,e);
                                                                    this.setState({data: data,errors: errors,});}}
                                                                spanClass="error"
                                                                spanError={this.state.errors["nombre"] || ""}
                                                                divClassSpanType={1}
                                                                divClassSpan="input-group-addon"
                                                                divClassSpanI="fa fa-indent"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                {
                                                    this.state.data.id !== 0 ?
                                                        <div className="form-group">
                                                            <label className="col-md-3 control-label">
                                                                Imagen actual
                                                            </label>
                                                            <div className="col-md-9">
                                                                <ImageForMultipleResolution
                                                                    key={1}
                                                                    preview={true}
                                                                    previewData={this.state.data.imagen || null}
                                                                    origin={auth.pathApi()}
                                                                />
                                                            </div>
                                                        </div>
                                                        :
                                                        <div></div>
                                                }
                                                <div className="form-group">
                                                    <label className="col-md-3 control-label">
                                                        Imagen
                                                    </label>
                                                    <div className="col-md-9">
                                                        <ImageForMultipleResolution
                                                            key={2}
                                                            handlerOnLoad={this.handlerOnLoadForImage}
                                                            resolutions={Constantes.partidoResolutions}
                                                            handlerOnReset={this.handlerOnResetForImage}
                                                            prefix="figura"
                                                            controlName="images-1"
                                                        />
                                                        <span className="error">
                                                            {this.state.errors["imagen"] || ""}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <hr />
                                        </div>
                                        <hr />
                                        <div className="panel-footer">
                                            <ValidarPermiso
                                                IdModuloPermisoValidar={this.state.id === 0 ?
                                                    ModuloPermiso.Partidos.Nuevo
                                                    : ModuloPermiso.Partidos.Modificar}
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
            </>
        );
    }
}

export default CrearPartido;
