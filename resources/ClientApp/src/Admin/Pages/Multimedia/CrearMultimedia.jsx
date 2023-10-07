import React, { Component } from 'react';
import AuthLogin from "../../../Utils/AuthLogin";
import MultimediaDataService from "../../../Services/ContenidoMultimedia/Multimedia.Service";
import UtilsDataService from "../../../Services/General/Utils.Service";
import Spinner from "../../../Components/Spinner";
import Select from "../../../Components/Select";
import DatePicker from '../../../Components/DatePicker';
import ValidForm from "../../../Utils/ValidForm";
import SunEditor from "suneditor-react";
import * as FechaMysql from "../../../Utils/FormatDate";
import Input from "../../../Components/Input";
import * as FileCfg from "../../../Utils/FileConfig";
import Dropzone from 'react-dropzone-uploader'
import { ModuloPermiso } from "../../../Permisos/ModuloPermiso";
import ValidarPermiso from "../../../Permisos/ValidarPermiso";

const auth = new AuthLogin();
const constFileds = {
    id: 0,
    titulo: "",
    tipo_multimedia_id:0,
    urlVideo:"",
    urlAudio:"",
    fechaPublicacion:new Date(),
    descripcion:"",
    user: "",
    archivo: null,
};
const constErrors = {
    id: "",
    titulo: "",
    multimedia_id:0,
    tipo_multimedia_id:0,
    descripcion:"",
    fechaPublicacion:"",
    urlVideo: "",
    urlAudio:"",
    user: "",
    archivo: "",
};

const SelectPublicacion = { value: 0, label: 'Seleccione tipo de publicación' };

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
const validForm = new ValidForm();
class CrearMultimedia extends Component {
    constructor(props) {
        super(props);
        const id =
            this.props.match.params.id === undefined
                ? 0
                : this.props.match.params.id;
        this.state = {
            id:id,
            loading: false,
            data: constFileds,
            errors: constErrors,
            url: "",
            txtDescripcion:"",
            selectPublicacion: SelectPublicacion,
            dataSelectPublicacion: [SelectPublicacion],
            file:"",
            multimedia_archivo:[]
        };
    };

    componentDidMount = async () => {
        this.resetFields();

        let id = this.state.id;
        if (id != 0) await this.getByID(id);
        else this.resetFields();
        await this.getcomboPublicacion();
    };

    handleChangeStatus = ({ meta, file }, status) => {

        let data = this.state.data;
        let errors = this.state.errors;
        data.archivo = file;
        var sizefile = parseInt(file.size / 1024);
        errors = validForm.cleanErrors(errors);
        if (data.archivo != null && data.archivo != undefined) {
            if(sizefile > 5000){
                errors.archivo = "El tamaño del archivo no debe ser mayor a 5MB";
            }else{
                let fileext = FileCfg.GetInfoFile(file);
                let typesext = FileCfg.TypesAccepted([FileCfg.Documents]);
                if (typesext.indexOf(fileext) === -1) {
                    errors.archivo = "Selecciona un archivo válido";

                    this.setState({ errors: errors });
                    return false;
                }
                this.setState({ data: data });
            }

        } else {
            errors.archivo = "Seleccione un archivo";
        }

    }
    handlePublicacion = async (selectOption) => {
        this.setState({ selectPublicacion: selectOption });
    };
    getByID = async (id) => {
        this.setState({ loading: true });
        await MultimediaDataService.get(id)
            .then((response) => {
                let data = this.state.data;
                data = response.data[0];
                Object.assign(data, { user: auth.username() });
                this.state.txtDescripcion =  data.descripcion;
                let multimedia = this.state.multimedia_archivo = data.multimedia_archivo[0];
                if(multimedia.archivo != null){
                    var x = this.state.multimedia_archivo.archivo.split("/");
                    this.state.file = x[1];
                }
                data.urlVideo = multimedia.urlVideo;
                data.urlAudio = multimedia.urlAudio;
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

    getcomboPublicacion = async () => {
        this.setState({ loading: true });
        await UtilsDataService.getComboTipoMultimedia().then(response => {
            let combo = [];
            let selected = { value: -1, label: "Seleccione tipo de publicación" };
            response.data.forEach(i => {
                combo.push({ value: i.id, label: i.nombre })
                if(this.state.id !== 0){
                    let idd = this.state.data.tipo_multimedia_id;
                    if(idd === i.id)
                        selected = { value: i.id, label: i.nombre };
                }
            })
            combo.unshift({ value: -1, label: "Seleccione tipo de publicación" })
            this.setState({
                dataSelectPublicacion: combo,
                selectPublicacion:selected,
                loading: false
            });
        });
    };

    saveSubmit = async () => {
        let errors = this.state.errors;
        errors = validForm.cleanErrors(errors);
        this.setState({ errors: errors, loading: true });
        let data = this.state.data;
        data.user = auth.username();
        data.descripcion = this.state.txtDescripcion;
        data.tipo_multimedia_id = this.state.selectPublicacion.value;
        data.multimedia_id = this.state.id;
        data.fechaPublicacion = FechaMysql.DateFormatMySql(data.fechaPublicacion);
        if(this.state.id != 0)
        {
            switch (this.state.selectPublicacion.value) {
                case 1 || 2 || 3:
                    data.urlAudio = null;
                    data.urlVideo = null;
                    break;
                case 4:
                    // data.archivo = null;
                    data.urlAudio = null;
                    break;
                case 5:
                    // data.archivo = null;
                    data.urlVideo = null;
                    break;
                default:
                    break;
            }
        }
        let responseData;
        if (data.id === 0) {
            await MultimediaDataService.create(data)
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
            await MultimediaDataService.update(data.id, data)
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
                pathname: `/multimedia`
            });
        }
    };
    resetFields() {
        let fields = Object.assign({}, constFileds);
        this.setState({
            data: fields,
            errors: validForm.cleanErrors(this.state.errors),
        });
    };

    render() {
        return (
            <div>
                <Spinner show={this.state.loading} />
                <ul className="breadcrumb">
                    <li>Contenido Multimedia</li>
                    <li>{this.state.data["id"] === 0 ? "Nueva" : "Editar"}{" "} recurso multimedia</li>
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
                                                contenido multimedia
                                            </strong>
                                        </h3>
                                    </div>
                                    <div className="panel-body">
                                        <div className="row">
                                            <h3>Información de contenido multimedia</h3>
                                            <div className="col-md-9">
                                                <div className="form-group">
                                                    <label className="col-md-3 control-label">
                                                        Título
                                                    </label>
                                                    <div className="col-md-9">
                                                        <div className="input-group">
                                                            <Input
                                                                divClass="input-group"
                                                                inputName="nombre"
                                                                inputType="text"
                                                                inputClass="form-control"
                                                                inputplaceholder="Ingrese el título"
                                                                inputValue={
                                                                    this.state
                                                                        .data
                                                                        .titulo ||
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
                                                                        "titulo",
                                                                        data,
                                                                        e
                                                                    );
                                                                    errors = validForm.handleChangeErrors(
                                                                        "titulo",
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
                                                                        "titulo"
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
                                                        Tipo de publicación
                                                    </label>
                                                    <div className="col-md-9">
                                                        <div style={{ minWidth: "200px" }}>
                                                        <Select
                                                            divClass=""
                                                            selectplaceholder="Seleccione"
                                                            selectValue={this.state.selectPublicacion}
                                                            selectOnchange={this.handlePublicacion}
                                                            selectoptions={this.state.dataSelectPublicacion}
                                                            selectIsSearchable={true}
                                                            selectclassNamePrefix="selectReact__value-container"
                                                            spanClass="error"
                                                            spanError={this.state.errors["tipo_multimedia_id"] || ""}
                                                        >
                                                        </Select>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <label className="col-md-3 control-label">Fecha de publicacion</label>
                                                    <div className="col-md-9">
                                                        <div className="input-group">
                                                        <DatePicker
                                                                id="fechaPublicacion"
                                                                showInputTime={false}
                                                                divClass="input-group"
                                                                dateSelected={this.state.data.fechaPublicacion ||""}
                                                                onChangeDate={(e) => {
                                                                    let fields = this.state.data;
                                                                    let errors = this.state.errors;
                                                                    fields = validForm.handleChangeDateField("fechaPublicacion",fields, e);
                                                                    errors = validForm.handleChangeErrors("fechaPublicacion",errors,e);
                                                                    this.setState({
                                                                            fields: fields,
                                                                            errors: errors,});
                                                                }}
                                                                spanClass="error"
                                                                spanError={this.state.errors["fechaPublicacion"] || ""}
                                                                divClassSpanType={1}
                                                                divClassSpan="input-group-addon"
                                                                divClassSpanI="fa fa-calendar"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                    <div className={`form-group ${this.state.selectPublicacion.value === 1 || this.state.selectPublicacion.value === 2 ||this.state.selectPublicacion.value === 3 ||this.state.selectPublicacion.value === 5 ||this.state.selectPublicacion.value === -1? 'none':''}`}>
                                                        <label className="col-md-3 control-label">
                                                            Link del video
                                                        </label>
                                                        <div className="col-md-9">
                                                            <Input
                                                                divClass="input-group"
                                                                inputName="urlVideo"
                                                                inputType="text"
                                                                inputClass="form-control"
                                                                inputplaceholder="Ingrese url del video"
                                                                inputValue={
                                                                    this.state
                                                                        .data
                                                                        .urlVideo ||
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
                                                                        "urlVideo",
                                                                        data,
                                                                        e
                                                                    );
                                                                    errors = validForm.handleChangeErrors(
                                                                        "urlVideo",
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
                                                                        "urlVideo"
                                                                    ] || ""
                                                                }
                                                                divClassSpanType={
                                                                    1
                                                                }
                                                                divClassSpan="input-group-addon"
                                                                divClassSpanI="fa fa-link"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className={`form-group ${this.state.selectPublicacion.value ===1 || this.state.selectPublicacion.value === 2 ||this.state.selectPublicacion.value === 3 ||this.state.selectPublicacion.value === 4 ||this.state.selectPublicacion.value === -1? 'none':''}`}>
                                                    <label className="col-md-3 control-label">
                                                        Link del Audio
                                                    </label>
                                                    <div className="col-md-9">
                                                        <Input
                                                            divClass="input-group"
                                                            inputName="urlAudio"
                                                            inputType="text"
                                                            inputClass="form-control"
                                                            inputplaceholder="Ingrese url del Audio"
                                                            inputValue={
                                                                this.state
                                                                    .data
                                                                    .urlAudio ||
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
                                                                    "urlAudio",
                                                                    data,
                                                                    e
                                                                );
                                                                errors = validForm.handleChangeErrors(
                                                                    "urlAudio",
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
                                                                    "urlAudio"
                                                                ] || ""
                                                            }
                                                            divClassSpanType={
                                                                1
                                                            }
                                                            divClassSpan="input-group-addon"
                                                            divClassSpanI="fa fa-link"
                                                        />
                                                    </div>
                                                    </div>

                                                    <div className={`form-group ${this.state.selectPublicacion.value === 4 || this.state.selectPublicacion.value === 5 ? 'none':''}`}>
                                                        <label className="col-md-3 control-label">
                                                            Contenido Multimedia
                                                        </label>
                                                        <div className="col-md-9">
                                                            <Dropzone
                                                                    maxFiles={1}
                                                                    maxSizeBytes={15000000}
                                                                    multiple={false}
                                                                    inputContent="Selecciona un archivo"
                                                                    onChangeStatus={this.handleChangeStatus.bind(this)}
                                                                    accept=".pdf,.docx,.doc,.pptx,.mp3,.mp4,.wma,.webm"
                                                            />
                                                        </div>
                                                    </div>
                                                {
                                                    this.state.data.tipo_multimedia_id == 2 ?
                                                    <div className="form-group">
                                                        <label className="col-md-3 control-label">Audio actual</label>
                                                        <div className="col-md-9">
                                                            <audio src={auth.pathApi() + this.state.multimedia_archivo.archivo} controls={true}></audio>
                                                        </div>
                                                    </div>:
                                                    this.state.data.tipo_multimedia_id == 1 || this.state.data.tipo_multimedia_id == 3?
                                                    <div className="form-group">
                                                        <label className="col-md-3 control-label">Archivo actual</label>
                                                        <div className="col-md-9">
                                                            <div className="alert btn-primary" role="alert">{this.state.file}</div>
                                                        </div>
                                                    </div>:
                                                    <div></div>
                                                }
                                                <div className="form-group">
                                                    <label className="col-md-3 control-label">
                                                        Descripción general
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
                                            </div>
                                            <hr />
                                        </div>
                                        <hr />
                                        <div className="panel-footer">
                                            <ValidarPermiso
                                                IdModuloPermisoValidar = {this.state.id !== 0 ? ModuloPermiso.Multimedia.Modificar : ModuloPermiso.Multimedia.Nuevo}
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

export default CrearMultimedia;
