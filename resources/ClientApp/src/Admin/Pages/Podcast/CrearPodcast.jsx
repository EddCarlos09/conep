import React, { Component } from 'react';
import PodcastDataService from "../../../Services/ContenidoMultimedia/Podcasts.Service";
import Input from '../../../Components/Input';
import DatePicker from '../../../Components/DatePicker';
import ImageForMultipleResolution from '../../../Components/ImageForMultipleResolution';
import SunEditor from 'suneditor-react';
import Spinner from '../../../Components/Spinner';
import ValidForm from "../../../Utils/ValidForm";
import * as FechaMysql from "../../../Utils/FormatDate";
import AuthLogin from "../../../Utils/AuthLogin";
import 'react-dropzone-uploader/dist/styles.css'
import Dropzone from 'react-dropzone-uploader'
import * as FileCfg from "../../../Utils/FileConfig";
import AccordionCheckbox from '../../../Components/AccordionCheckbox';
import { Constantes } from "../../../Constants/Constantes.js"
import { ModuloPermiso } from "../../../Permisos/ModuloPermiso";
import ValidarPermiso from "../../../Permisos/ValidarPermiso";

const auth = new AuthLogin();
let validForm = new ValidForm();
const constFileds = { 
    id: 0,
    titulo: "",
    presentadores: "",
    invitados: "",
    fecha: new Date(),
    resumen: "",
    urlAudio: "",
    audio: {},
    esEnlace: true,
    urlExterno: "",
    imagen: null,
    user:'' 
}
const constErrors = { 
    presentadores: "",
    invitados: "",
    titulo: "",
    fecha: "",
    resumen: "",
    audio: "",
    urlExterno: "",
    user:'' 
}
const buttonList = [
    ['undo', 'redo',
    'font', 'fontSize', 'formatBlock',
    'paragraphStyle', 'blockquote',
    'bold', 'underline', 'italic', 'strike', 'subscript', 'superscript',
    'fontColor', 'hiliteColor', 'textStyle',
    'removeFormat',
    'outdent', 'indent',
    'align', 'horizontalRule', 'list', 'lineHeight',
    'table', 'link', 'image', 'video', 'audio', /** 'math', */ // You must add the 'katex' library at options to use the 'math' plugin.
    /** 'imageGallery', */ // You must add the "imageGalleryUrl".
    'fullScreen', 'showBlocks', 'codeView',
    'preview', 'print', 'save', 'template']
];

class CrearPodcast extends Component {
    constructor(props){
        super(props);
        const id = this.props.match.params.id === undefined ? 0 : this.props.match.params.id;
        this.state = {
            id:id,
            loading: false,
            data: constFileds,
            errors: constErrors,
            dpFecha: new Date(),
            textResumen: "",
            imagesResized: []
        }
    }

    // Handlers

    handlerCheckboxEnlace = (value) => {
        let data = this.state.data;
        data.esEnlace = value;
        this.setState({data});
    }

    handlerOnLoadForImage = async (blob) => {
        let state = this.state;
        state.imagesResized = blob;
        this.setState({
            state
        })
    } 


    async componentDidMount(){
        this.resetFields();
        let id = this.state.id;
        if (id != 0) 
            await this.getByID(id);
    }

    // Methods

    getByID = async (id) => {
        this.setState({ loading: true });
        await PodcastDataService.get(id)
            .then((response) => {
                let state = this.state;
                state.data = response.data;
                Object.assign(state.data, { user: auth.username() });
                state.data.imagen = response.data.podcast_imagen;
                state.dpFecha = state.data.fecha;
                state.textResumen = state.data.resumen;
                state.loading = false;
                this.setState({
                    state
                });
            })
            .catch((e) => {
                this.setState({
                    loading: false,
                });
                console.log(e);
            });
    };

    saveSubmit = async () => {
        let errors = this.state.errors;
        errors = validForm.cleanErrors(errors);
        this.setState({ errors: errors, loading: true });
        let data = this.state.data;
        data.fecha = FechaMysql.DateFormatMySql(this.state.dpFecha);
        data.resumen = this.state.textResumen;
        data.imagen = this.state.imagesResized;
        data.user = auth.username();
        let responseData;
        if (data.id === 0) {
            await PodcastDataService.create(data)
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
            await PodcastDataService.update(data.id, data)
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
                pathname: "/podcast",
            });
        }
    };

    handleChangeStatus = ({ meta, file }, status) => {

        let fields = this.state.data;
        let errors = this.state.errors;
        fields.audio = file;
        var sizefile = parseInt(file.size / 1024);
        errors = validForm.cleanErrors(errors);
        if (fields.audio != null && fields.audio != undefined) {
            if(sizefile > 500000){
                errors.audio = "El tamaño del archivo no debe ser mayor a 500MB";                
            }else{
                let fileext = FileCfg.GetInfoFile(file);
                let typesext = FileCfg.TypesAccepted([FileCfg.Music]);
                if (typesext.indexOf(fileext) === -1) {
                    errors.audio = "Selecciona un archivo válido";

                    this.setState({ errors: errors });
                    return false;
                }
                this.setState({ fields: fields });
            }
            
        } else {
            errors.audio = "Seleccione un archivo";
        }

    }

    resetFields() {
        let fields = validForm.resetObject(constFileds);
        let errors = validForm.resetObject(constErrors);
        fields.esEnlace = true;
        this.setState({ data: fields, errors: errors });
    }
    

    render(){
        return (
            <>
                <Spinner show={this.state.loading} />
                <ul className="breadcrumb">
                    <li>Contenido multimedia</li>
                    <li>Podcast</li>
                    <li>Nuevo podcast</li>
                </ul>
                <div className="page-content-wrap">
                    <div className="row">
                        <div className="col-md-12">

                            <form className="form-horizontal">
                                <div className="panel panel-default">
                                    <div className="panel-heading">
                                        <h3 className="panel-title"><strong><i className="fas fa-microphone-alt"></i> {this.state.data["id"] === 0 ? "Nuevo" : "Editar"} podcast</strong></h3>
                                    </div>
                                    <div className="panel-body">
                                        <div className="row">
                                            <h3>Información general</h3>
                                            <div className="col-md-9">
                                                <div className="form-group">
                                                    <label className="col-md-3 control-label">Título</label>
                                                    <div className="col-md-9">
                                                        <div className="input-group">
                                                            <Input divClass="input-group"
                                                                inputName="nombre"
                                                                inputType="text"
                                                                inputClass="form-control"
                                                                inputplaceholder="..."
                                                                inputValue={this.state.data.titulo || ''}
                                                                inputOnchange={e => {
                                                                    let data = this.state.data;
                                                                    let errors = this.state.errors;
                                                                    data = validForm.handleChangeField("titulo", data, e);
                                                                    errors = validForm.handleChangeErrors("titulo", errors, e);
                                                                    this.setState({ data: data, errors: errors });
                                                                }}
                                                                spanClass="error"
                                                                spanError={this.state.errors["titulo"] || ''}
                                                                divClassSpanType={1}
                                                                divClassSpan="input-group-addon"
                                                                divClassSpanI="fa fa-indent" />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <label className="col-md-3 control-label">Presentador(es)</label>
                                                    <div className="col-md-9">
                                                        <div className="input-group">
                                                            <Input divClass="input-group"
                                                                inputName="nombre"
                                                                inputType="text"
                                                                inputClass="form-control"
                                                                inputplaceholder="..."
                                                                inputValue={this.state.data.presentadores || ''}
                                                                inputOnchange={e => {
                                                                    let data = this.state.data;
                                                                    let errors = this.state.errors;
                                                                    data = validForm.handleChangeField("presentadores", data, e);
                                                                    errors = validForm.handleChangeErrors("presentadores", errors, e);
                                                                    this.setState({ data: data, errors: errors });
                                                                }}
                                                                spanClass="error"
                                                                spanError={this.state.errors["presentadores"] || ''}
                                                                divClassSpanType={1}
                                                                divClassSpan="input-group-addon"
                                                                divClassSpanI="fa fa-indent" />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <label className="col-md-3 control-label">Invitado(s)</label>
                                                    <div className="col-md-9">
                                                        <div className="input-group">
                                                            <Input divClass="input-group"
                                                                inputName="nombre"
                                                                inputType="text"
                                                                inputClass="form-control"
                                                                inputplaceholder="..."
                                                                inputValue={this.state.data.invitados || ''}
                                                                inputOnchange={e => {
                                                                    let data = this.state.data;
                                                                    let errors = this.state.errors;
                                                                    data = validForm.handleChangeField("invitados", data, e);
                                                                    errors = validForm.handleChangeErrors("invitados", errors, e);
                                                                    this.setState({ data: data, errors: errors });
                                                                }}
                                                                spanClass="error"
                                                                spanError={this.state.errors["invitados"] || ''}
                                                                divClassSpanType={1}
                                                                divClassSpan="input-group-addon"
                                                                divClassSpanI="fa fa-indent" />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <label className="col-md-3 control-label">Fecha</label>
                                                    <div className="col-md-9">
                                                        <div className="input-group">
                                                            <DatePicker
                                                                id="dpFecha"
                                                                showInputTime={false}
                                                                divClass="input-group"
                                                                dateSelected={this.state.dpFecha || ''}
                                                                onChangeDate={e => {
                                                                    let fields = this.state;
                                                                    let errors = this.state.errors;
                                                                    fields = validForm.handleChangeDateField("dpFecha", fields, e);
                                                                    errors = validForm.handleChangeErrors("dpFecha", errors, e);
                                                                    this.setState({ fields: fields, errors: errors });
                                                                }}
                                                                spanClass="error"
                                                                spanError={this.state.errors.fecha || ''}
                                                                divClassSpanType={1}
                                                                divClassSpan="input-group-addon"
                                                                divClassSpanI="fa fa-calendar"
                                                                    />
                                                        </div>
                                                    </div>
                                                </div>
                                                {
                                                    this.state.id !== 0 && !this.state.data.esEnlace ?
                                                    <div className="form-group">
                                                        <label className="col-md-3 control-label">Audio actual</label>
                                                        <div className="col-md-9">
                                                            <audio src={auth.pathApi() + this.state.data.urlAudio} controls={true}></audio>
                                                        </div>
                                                    </div> : 
                                                    <div></div>
                                                }
                                                {
                                                    this.state.id !== 0 && this.state.data.esEnlace && this.state.data.urlExterno !== null && this.state.data.urlExterno !== "" ?
                                                    <div className="form-group">
                                                        <label className="col-md-3 control-label">Enlace externo actual</label>
                                                        <div className="col-md-9">
                                                            <a href={this.state.data.urlExterno || ""} className="btn btn-primary btn-block" target="_blank"><i className="fas fa-external-link-alt"></i> Ir a enlace de audio</a>
                                                        </div>
                                                    </div> : 
                                                    <div></div>
                                                }
                                                <AccordionCheckbox handlerCheckboxSelected={this.handlerCheckboxEnlace} label={"¿Es enlace externo?"} open={this.state.data.esEnlace} 
                                                    children={
                                                        <>
                                                        <div className="form-group">
                                                            <label className="col-md-3 control-label">Enlace externo</label>
                                                            <div className="col-md-9">
                                                                <Input divClass="input-group"
                                                                    inputName="nombre"
                                                                    inputType="text"
                                                                    inputClass="form-control"
                                                                    inputplaceholder="https:// ..."
                                                                    inputValue={this.state.data.urlExterno || ''}
                                                                    inputOnchange={e => {
                                                                        let data = this.state.data;
                                                                        let errors = this.state.errors;
                                                                        data = validForm.handleChangeField("urlExterno", data, e);
                                                                        errors = validForm.handleChangeErrors("urlExterno", errors, e);
                                                                        this.setState({ data: data, errors: errors });
                                                                    }}
                                                                    spanClass="error"
                                                                    spanError={this.state.errors["urlExterno"] || ''}
                                                                    divClassSpanType={1}
                                                                    divClassSpan="input-group-addon"
                                                                    divClassSpanI="fa fa-indent" />
                                                            </div>
                                                        </div>
                                                        </>
                                                    }  />
                                                    <span className="error">{this.state.errors.urlExterno || ''}</span>
                                                <div className={`form-group ${this.state.data.esEnlace ? "none" : ""}`}>
                                                    <label className="col-md-3 control-label">Audio</label>
                                                    <div className="col-md-9 ">
                                                        <Dropzone
                                                            maxFiles={1}
                                                            maxSizeBytes={15000000}
                                                            multiple={false}                                                         
                                                            inputContent="Selecciona un archivo de audio"
                                                            onChangeStatus={this.handleChangeStatus.bind(this)}
                                                            accept=".mp3"
                                                        />
                                                    </div>
                                                </div>
                                                <span className="error">{this.state.errors.audio || ''}</span>
                                                {
                                                    this.state.id != 0 ?
                                                    <div className="form-group">
                                                        <label className="col-md-3 control-label">Portada actual de la plática</label>
                                                        <div className="col-md-9">
                                                            <ImageForMultipleResolution key={1} preview={true} previewData={this.state.data.imagen || null} origin={auth.pathApi()} />
                                                        </div>
                                                    </div> : 
                                                    <div></div>
                                                }
                                                <div className="form-group">
                                                    <label className="col-md-3 control-label">Portada de la plática</label>
                                                    <div className="col-md-9">
                                                        <ImageForMultipleResolution key={2} handlerOnLoad={this.handlerOnLoadForImage} resolutions={Constantes.podcastResolutions} handlerOnReset={this.handlerOnResetForImage} prefix="figura" controlName="images-1" />
                                                        <span className="error">{this.state.errors.imagen || ''}</span>
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <label className="col-md-3 control-label">Resumen de la plática</label>
                                                    <div className="col-md-9">
                                                        <SunEditor
                                                            placeholder="..."
                                                            setContents={this.state.textResumen || ""}
                                                            onChange={(e) => {
                                                                let state = this.state;
                                                                let errors = this.state.errors;
                                                                state = validForm.handleChangeFieldJodiEditor("textResumen", state, e);
                                                                errors = validForm.handleChangeErrors("resumen", errors, e);
                                                                this.setState({
                                                                    state,
                                                                    errors: errors,
                                                                });
                                                            }}
                                                            lang="es"
                                                            setOptions={{
                                                                buttonList: buttonList,
                                                                height: 400
                                                            }}
                                                        />
                                                        <span className="error">
                                                            {this.state.errors["resumen"] || ""}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <hr />
                                        </div>
                                    </div>
                                    <div className="panel-body">
                                        <div className="row">
                                            <div className="panel-footer">
                                                <ValidarPermiso IdModuloPermisoValidar={this.state.id !== 0 ? ModuloPermiso.Podcast.Modificar : ModuloPermiso.Podcast.Nuevo} DefaultTemplate={
                                                    <button type="button" onClick={() => { this.saveSubmit() }} className="btn btn-success pull-right"><i className="fa fa-check"></i> Guardar</button>
                                                } />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </form>

                        </div>
                    </div>
                </div>
            </>
        )
    }
}

export default CrearPodcast;