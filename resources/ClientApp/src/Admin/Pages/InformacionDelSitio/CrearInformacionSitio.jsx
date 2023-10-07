import React, { Component } from 'react';
import Spinner from '../../../Components/Spinner';
import infoSitioDataService from "../../../Services/InformacionSitio/infoSitio.Service";
import Dropzone from 'react-dropzone-uploader';
import * as FileCfg from "../../../Utils/FileConfig";
import ValidForm from "../../../Utils/ValidForm";
import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css";
import AuthLogin from "../../../Utils/AuthLogin";
import ImageForMultipleResolution from "../../../Components/ImageForMultipleResolution";
import { Constantes } from "../../../Constants/Constantes.js";
import { ModuloPermiso } from "../../../Permisos/ModuloPermiso";
import ValidarPermiso from "../../../Permisos/ValidarPermiso";

const auth = new AuthLogin();
const constFileds = {
    id: 0,
    imgPrincipal:"",
    congresistas: "",
    nuestraDemocracia: "",
    actividadLegislativa: "",
    igmActividadLegislativa:"",
    comisiones: "",
    contenidoMultimedia: "",
    proyectosDeLey: "",
    datos: "",
    observacionesLegales : "",
    slide_principal: [],
    newSlidePrincipal: [],
    slide_secundario: [],
    newSlideSecundario: [],
    newimgPrincipal:null,
    newigmActividadLegislativa:null,
    fechaDeCreacion: "",
    user: "",
};
const constErrors = {
    id: 0,
    imgPrincipal:[],
    congresistas: "",
    nuestraDemocracia: "",
    actividadLegislativa: "",
    igmActividadLegislativa:[],
    comisiones: "",
    contenidoMultimedia: "",
    proyectosDeLey: "",
    datos: "",
    observacionesLegales : "",
    slide_principal: [],
    newSlidePrincipal: [],
    slide_secundario: [],
    newSlideSecundario: [],
    imagenesInforme: [],
    fechaDeCreacion: "",
    user: "",
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
const imagenesSlide = {
    guardarSlide_principal: [],
    guardarSlide_sucundario: [],
    imagenesInforme: [],
    imgPrincipal: [],
    igmActividadLegislativa: []

};
const validForm = new ValidForm();

class CrearInformacionSitio extends Component {
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
            imgSlide: imagenesSlide,
            errors: constErrors,
            txtcongresistas: "",
            txtnuestraDemocracia: "",
            txtactividadLegislativa: "",
            txtcomisiones: "",
            txtcontenidoMultimedia: "",
            txtproyectosDeLey: "",
            txtdatos: "",    
            txtobservacionesLegales: "",    
            imagesResized: [],
            imagesResizedAL: []

        }
    }    

    componentDidMount = async () => {
        this.resetFields();
        this.state.data.id = this.state.id;
        this.state.data.user = auth.username();

        let id = this.state.id;
        if (id != 0) await this.getByID(id);
        else this.resetFields();
    };
    handleChangeStatusP = ({ meta, file }, status) => {
        let data = this.state.imgSlide;
        let errors = this.state.errors;
        data.imagenesInforme.push(file);
        var sizefile = parseInt(file.size / 1024);
        errors = validForm.cleanErrors(errors);
        if (data.imagenesInforme != null && data.imagenesInforme != undefined) {
            if (sizefile > 5000) {
                errors.imagenesInforme = "El tamaño del archivo no debe ser mayor a 5MB";
            } else {
                let fileext = FileCfg.GetInfoFile(file);
                let typesext = FileCfg.TypesAccepted([FileCfg.Images]);
                if (typesext.indexOf(fileext) === -1) {
                    data.imagenesInforme = "Selecciona un archivo válido";

                    this.setState({ errors: errors });
                    return false;
                }
                this.setState({ imgSlide: data });
            }

        } else {
            data.imagenesInforme = "Seleccione una imagen";
        }

    }
    handleChangeStatusAL = ({ meta, file }, status) => {
        let data = this.state.imgSlide;
        let errors = this.state.errors;
        data.imagenesInforme.push(file);
        var sizefile = parseInt(file.size / 1024);
        errors = validForm.cleanErrors(errors);
        if (data.imagenesInforme != null && data.imagenesInforme != undefined) {
            if (sizefile > 5000) {
                errors.imagenesInforme = "El tamaño del archivo no debe ser mayor a 5MB";
            } else {
                let fileext = FileCfg.GetInfoFile(file);
                let typesext = FileCfg.TypesAccepted([FileCfg.Images]);
                if (typesext.indexOf(fileext) === -1) {
                    data.imagenesInforme = "Selecciona un archivo válido";

                    this.setState({ errors: errors });
                    return false;
                }
                this.setState({ imgSlide: data });
            }

        } else {
            data.imagenesInforme = "Seleccione una imagen";
        }

    }
    handleChangeStatusSldP = ({ meta, file }, status) => {
        let data = this.state.imgSlide;
        let errors = this.state.errors;
        data.guardarSlide_principal.push(file);
        var sizefile = parseInt(file.size / 1024);
        errors = validForm.cleanErrors(errors);
        if (data.guardarSlide_principal != null && data.guardarSlide_principal != undefined) {
            if (sizefile > 5000) {
                errors.guardarSlide_principal = "El tamaño del archivo no debe ser mayor a 5MB";
            } else {
                let fileext = FileCfg.GetInfoFile(file);
                let typesext = FileCfg.TypesAccepted([FileCfg.Images]);
                if (typesext.indexOf(fileext) === -1) {
                    data.guardarSlide_principal = "Selecciona un archivo válido";
                    this.setState({ errors: errors });
                    return false;
                }
                this.setState({ imgSlide: data });
            }

        } else {
            data.guardarSlide_principal = "Seleccione una imagen";
        }

    }
    handleChangeStatusSldS = ({ meta, file }, status) => {
        let data = this.state.imgSlide;
        let errors = this.state.errors;
        data.guardarSlide_sucundario.push(file);
        var sizefile = parseInt(file.size / 1024);
        errors = validForm.cleanErrors(errors);
        if (data.guardarSlide_sucundario != null && data.guardarSlide_sucundario != undefined) {
            if (sizefile > 5000) {
                errors.guardarSlide_sucundario = "El tamaño del archivo no debe ser mayor a 5MB";
            } else {
                let fileext = FileCfg.GetInfoFile(file);
                let typesext = FileCfg.TypesAccepted([FileCfg.Images]);
                if (typesext.indexOf(fileext) === -1) {
                    data.guardarSlide_sucundario = "Selecciona un archivo válido";

                    this.setState({ errors: errors });
                    return false;
                }
                this.setState({ imgSlide: data });
            }

        } else {
            data.guardarSlide_sucundario = "Seleccione una imagen";
        }

    }
    getByID = async (id) => {
        this.setState({ loading: true });
        this.state.imgSlide.guardarSlide_principal.length = 0;
        this.state.imgSlide.guardarSlide_sucundario.length = 0; 
        await infoSitioDataService.get(id)
            .then((response) => {
                let data = this.state.data;
                data = response.data[0];
                Object.assign(data, { user: auth.username() });
                data.slide_principal = response.data[0].slide_principal;
                data.slide_secundario = response.data[0].slide_secundario;
                this.state.txtcongresistas = response.data[0].congresistas;
                this.state.txtnuestraDemocracia = response.data[0].nuestraDemocracia;
                this.state.txtactividadLegislativa = response.data[0].actividadLegislativa;
                this.state.txtcomisiones = response.data[0].comisiones;
                this.state.txtcontenidoMultimedia = response.data[0].contenidoMultimedia;
                this.state.txtproyectosDeLey = response.data[0].proyectosDeLey;
                this.state.txtdatos = response.data[0].datos;
                this.state.txtobservacionesLegales = response.data[0].observacionesLegales;
                
                console.log(response.data[0]);
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

    handlerOnLoadForImage = async (blob) => {
        let state = this.state.data;
        state.newimgPrincipal = blob;
        this.setState({
            data : state
        })
    }
    handlerOnLoadForImageAL = async (blob) => {
        let state = this.state.data;
        state.newigmActividadLegislativa = blob;
        this.setState({
            data : state
        })
    }
    // Métodos asíncronos

    saveSubmit = async () => {
        let errors = this.state.errors;
        errors = validForm.cleanErrors(errors);
        this.setState({ errors: errors, loading: true });
        let data = this.state.data;
        let dataUpdate = this.state.imgSlide;
        // data.imgPrincipal = [...new Set(dataUpdate.imagenPrincipal)]; // elimina elemtos de un array que se repiten                  
        data.congresistas = this.state.txtcongresistas != null ? this.state.txtcongresistas.replace(/<[^>]*>?/g, '') : this.state.txtcongresistas;
        data.nuestraDemocracia = this.state.txtnuestraDemocracia != null ? this.state.txtnuestraDemocracia.replace(/<[^>]*>?/g, '') : this.state.txtnuestraDemocracia;
        data.actividadLegislativa = this.state.txtactividadLegislativa != null ? this.state.txtactividadLegislativa.replace(/<[^>]*>?/g, '') : this.state.txtactividadLegislativa;
        data.comisiones = this.state.txtcomisiones != null ? this.state.txtcomisiones.replace(/<[^>]*>?/g, '') : this.state.txtcomisiones;
        data.contenidoMultimedia = this.state.txtcontenidoMultimedia != null ? this.state.txtcontenidoMultimedia.replace(/<[^>]*>?/g, '') : this.state.txtcontenidoMultimedia;
        data.proyectosDeLey = this.state.txtproyectosDeLey != null ? this.state.txtproyectosDeLey.replace(/<[^>]*>?/g, '') : this.state.txtproyectosDeLey;
        data.datos = this.state.txtdatos != null ? this.state.txtdatos.replace(/<[^>]*>?/g, '') : this.state.txtdatos;
        data.observacionesLegales = this.state.txtobservacionesLegales != null ? this.state.txtobservacionesLegales.replace(/<[^>]*>?/g, '') : this.state.txtobservacionesLegales;
        data.imgPrincipal = data.newimgPrincipal;
        data.igmActividadLegislativa = data.newigmActividadLegislativa;
        let _principal = [...new Set(dataUpdate.guardarSlide_principal)];
        let _sucundario = [...new Set(dataUpdate.guardarSlide_sucundario)];
        data.newSlidePrincipal = _principal;
        data.newSlideSecundario = _sucundario;

        console.log();

        let responseData;

        await infoSitioDataService.update(data.id, data)
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
            this.state.imgSlide.guardarSlide_principal.length = 0;
            this.state.imgSlide.guardarSlide_sucundario.length = 0;
            this.resetFields();
            this.props.history.push({
                pathname: "/informacion-del-sitio",
            });
        }
    };

    resetFields() {
        let fields = Object.assign({}, constFileds);
        let imgslide = Object.assign({}, imagenesSlide);
        this.setState({
            data: fields,
            imgSlide: imgslide,
            errors: validForm.cleanErrors(this.state.errors),
        });
    }

    render() {
        return (
            <div>
                <Spinner show={this.state.loading} />
                <ul className="breadcrumb">
                    <li>Información del sitio</li>
                    <li>Editar Información del sitio</li>
                </ul>
                <div className="page-content-wrap">
                    <div className="row">
                        <div className="col-md-12">
                            <form className="form-horizontal">
                                <div className="panel panel-default">
                                    <div className="panel-heading">
                                        <h3 className="panel-title">
                                            <strong>
                                                <i className="fa fa-info-circle"></i>{" "}Editar Información del sitio
                                            </strong>
                                        </h3>
                                    </div>
                                    <div className="panel-body">
                                        <div className="row">
                                            <h3>Información general del sitio</h3>
                                            <div className="col-md-9">
                                                <div className="form-group">
                                                    <label className="col-md-3 control-label">
                                                        Imagen actual
                                                    </label>
                                                    {
                                                        this.state.data.imgPrincipal !== null && this.state.data.imgPrincipal !== "" ?
                                                        <div className="col-md-9 control-label">
                                                        <div className="formCardsContainer three-columns">
                                                            <div className="formCard">
                                                                <div className="form-group">
                                                                    <img src={auth.pathApi() + this.state.data.imgPrincipal} className="img-fluid" alt="img slide" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>:''
                                                    }
                                                    
                                                </div>
                                                <div className="form-group">
                                                    <label className="col-md-3 control-label">
                                                        Imagen principal
                                                    </label>                                                    
                                                    <div className="col-md-9">
                                                    <ImageForMultipleResolution
                                                            key={1}
                                                            handlerOnLoad={
                                                                this
                                                                    .handlerOnLoadForImage
                                                            }
                                                            resolutions={
                                                                Constantes.InfoHomeResolutions
                                                            }
                                                            handlerOnReset={
                                                                this
                                                                    .handlerOnResetForImage
                                                            }
                                                            prefix="figuraP"
                                                            controlName="images-1"
                                                        />
                                                        <span className="error">
                                                            {this.state.errors[
                                                                "imgPrincipal"
                                                            ] || ""}
                                                        </span>
                                                        {/* <Dropzone
                                                            maxFiles={1}
                                                            maxSizeBytes={15000000}
                                                            multiple={false}
                                                            inputContent="Selecciona una imagen"
                                                            onChangeStatus={this.handleChangeStatusP.bind(this)}
                                                            accept=".jpg,.jpeg,.gif,.png"
                                                        /> */}
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <label className="col-md-3 control-label">
                                                        Texto en menú de Congresistas
                                                        {/* 368 caracteres */}
                                                    </label>
                                                    <div className="col-md-9">
                                                        <textarea value={this.state.txtcongresistas || ""} className="form-control" rows="10" maxLength={368} onChange={(e) => {
                                                            let state = this.state;
                                                            let errors = this.state.errors;
                                                            state = validForm.handleChangeFieldJodiEditor("txtcongresistas", state, e.currentTarget.value);
                                                            errors = validForm.handleChangeErrors("congresistas", errors, e.currentTarget.value);
                                                            this.setState({
                                                                state,
                                                                errors: errors,
                                                            });
                                                        }} />
                                                        <span className="error">
                                                            {this.state.errors["congresistas" || ""]}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <label className="col-md-3 control-label">
                                                        Texto en menú de Nuestra democracia
                                                    </label>
                                                    <div className="col-md-9">
                                                        <textarea value={this.state.txtnuestraDemocracia || ""} className="form-control" rows="10" maxLength={368} onChange={(e) => {
                                                            let state = this.state;
                                                            let errors = this.state.errors;
                                                            state = validForm.handleChangeFieldJodiEditor("txtnuestraDemocracia", state, e.currentTarget.value);
                                                            errors = validForm.handleChangeErrors("nuestraDemocracia", errors, e.currentTarget.value);
                                                            this.setState({
                                                                state,
                                                                errors: errors,
                                                            });
                                                        }} />
                                                        <span className="error">
                                                            {this.state.errors["nuestraDemocracia"] || ""}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <label className="col-md-3 control-label">
                                                        Texto en menú de Actividades legislativas
                                                    </label>
                                                    <div className="col-md-9">
                                                        <textarea value={this.state.txtactividadLegislativa || ""} className="form-control" rows="10" maxLength={368} onChange={(e) => {
                                                            let state = this.state;
                                                            let errors = this.state.errors;
                                                            state = validForm.handleChangeFieldJodiEditor("txtactividadLegislativa", state, e.currentTarget.value);
                                                            errors = validForm.handleChangeErrors("actividadLegislativa", errors, e.currentTarget.value);
                                                            this.setState({
                                                                state,
                                                                errors: errors,
                                                            });
                                                        }} />
                                                        
                                                        <span className="error">
                                                            {this.state.errors["actividadLegislativa"] || ""}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <label className="col-md-3 control-label">
                                                        Imagen actual
                                                    </label>
                                                    {
                                                        this.state.data.igmActividadLegislativa !== null && this.state.data.igmActividadLegislativa !== "" ?
                                                        <div className="col-md-9 control-label">
                                                        <div className="formCardsContainer three-columns">
                                                            <div className="formCard">
                                                                <div className="form-group">
                                                                    <img src={auth.pathApi() + this.state.data.igmActividadLegislativa} className="img-fluid" alt="img slide" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>:''
                                                    }
                                                    
                                                </div>
                                                <div className="form-group">
                                                    <label className="col-md-3 control-label">
                                                        Actividad legislativa imagen
                                                    </label>
                                                    <div className="col-md-9">
                                                    <ImageForMultipleResolution
                                                            key={2}
                                                            handlerOnLoad={
                                                                this
                                                                    .handlerOnLoadForImageAL
                                                            }
                                                            resolutions={
                                                                Constantes.InfoHomeResolutions
                                                            }
                                                            handlerOnReset={
                                                                this
                                                                    .handlerOnResetForImage
                                                            }
                                                            prefix="figuraS"
                                                            controlName="images-2"
                                                        />
                                                        <span className="error">
                                                            {this.state.errors[
                                                                "igmActividadLegislativa"
                                                            ] || ""}
                                                        </span>
                                                        {/* <Dropzone
                                                            maxFiles={1}
                                                            maxSizeBytes={15000000}
                                                            multiple={false}
                                                            inputContent="Selecciona una imagen"
                                                            onChangeStatus={this.handleChangeStatusAL.bind(this)}
                                                            accept=".jpg,.jpeg,.gif,.png"
                                                        /> */}
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <label className="col-md-3 control-label">
                                                        Texto en menú de Comisiones
                                                    </label>
                                                    <div className="col-md-9">
                                                        <textarea value={this.state.txtcomisiones || ""} className="form-control" rows="10" maxLength={368} onChange={(e) => {
                                                            let state = this.state;
                                                            let errors = this.state.errors;
                                                            state = validForm.handleChangeFieldJodiEditor("txtcomisiones", state, e.currentTarget.value);
                                                            errors = validForm.handleChangeErrors("comisiones", errors, e.currentTarget.value);
                                                            this.setState({
                                                                state,
                                                                errors: errors,
                                                            });
                                                        }} />
                                                        <span className="error">
                                                            {this.state.errors["comisiones"] || ""}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <label className="col-md-3 control-label">
                                                        Texto en menú de Contenido multimedia
                                                    </label>
                                                    <div className="col-md-9">
                                                        <textarea value={this.state.txtcontenidoMultimedia || ""} className="form-control" rows="10" maxLength={368} onChange={(e) => {
                                                            let state = this.state;
                                                            let errors = this.state.errors;
                                                            state = validForm.handleChangeFieldJodiEditor("txtcontenidoMultimedia", state, e.currentTarget.value);
                                                            errors = validForm.handleChangeErrors("contenidoMultimedia", errors, e.currentTarget.value);
                                                            this.setState({
                                                                state,
                                                                errors: errors,
                                                            });
                                                        }} />
                                                        
                                                        <span className="error">
                                                            {this.state.errors["contenidoMultimedia"] || ""}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <label className="col-md-3 control-label">
                                                        Texto en menú de Proyectos de ley
                                                    </label>
                                                    <div className="col-md-9">
                                                        <textarea value={this.state.txtproyectosDeLey || ""} className="form-control" rows="10" maxLength={368} onChange={(e) => {
                                                            let state = this.state;
                                                            let errors = this.state.errors;
                                                            state = validForm.handleChangeFieldJodiEditor("txtproyectosDeLey", state, e.currentTarget.value);
                                                            errors = validForm.handleChangeErrors("proyectosDeLey", errors, e.currentTarget.value);
                                                            this.setState({
                                                                state,
                                                                errors: errors,
                                                            });
                                                        }} />
                                                        <span className="error">
                                                            {this.state.errors["proyectosDeLey"] || ""}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <label className="col-md-3 control-label">
                                                        Texto en menú de Datos
                                                    </label>
                                                    <div className="col-md-9">
                                                        <textarea value={this.state.txtdatos || ""} className="form-control" rows="10" maxLength={368} onChange={(e) => {
                                                            let state = this.state;
                                                            let errors = this.state.errors;
                                                            state = validForm.handleChangeFieldJodiEditor("txtdatos", state, e.currentTarget.value);
                                                            errors = validForm.handleChangeErrors("datos", errors, e.currentTarget.value);
                                                            this.setState({
                                                                state,
                                                                errors: errors,
                                                            });
                                                        }} />
                                                        <span className="error">
                                                            {this.state.errors["datos"] || ""}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <label className="col-md-3 control-label">
                                                        Observaciones Legales
                                                    </label>
                                                    <div className="col-md-9">
                                                        <SunEditor
                                                            setContents={this.state.txtobservacionesLegales || ""}
                                                            onChange={(e) => {
                                                                let state = this.state;
                                                                let errors = this.state.errors;
                                                                state = validForm.handleChangeFieldJodiEditor("txtobservacionesLegales", state, e);
                                                                errors = validForm.handleChangeErrors("observacionesLegales", errors, e);
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
                                                            {this.state.errors["observacionesLegales"] || ""}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <hr />
                                        </div>
                                        <hr />
                                        <div className="row">
                                            <h3>Slide de Congreso Visible</h3>
                                            <div className="col-md-9">
                                                <div className="form-group">
                                                    <label className=" col-md-3 control-label">
                                                        Imagen actual
                                                        </label>
                                                    <div className="col-md-9 control-label">
                                                        <div className="formCardsContainer three-columns">
                                                            {
                                                                this.state.data.slide_principal.map((x) => {
                                                                    if (x.activo === 1) {
                                                                        return (
                                                                            <div className="formCard" key={x.id}>
                                                                                <button onClick={() => {
                                                                                    let data = this.state.data;
                                                                                    x.activo = 0;
                                                                                    // let indexOfArray = data.slide_principal.findIndex(array => array.id == x.id);                                                                                    
                                                                                    // data.slide_principal.splice(indexOfArray, 1);
                                                                                    this.setState({ data });
                                                                                }} type="button" className="deleteFormCard"><i className="fas fa-trash-alt"></i></button>
                                                                                <div className="form-group mt-50">
                                                                                    <img src={auth.pathApi() + x.imagen} className="img-fluid mt-50" alt="img slide" />
                                                                                </div>
                                                                            </div>
                                                                        )
                                                                    }
                                                                })
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <label className="col-md-3 control-label">
                                                        Slide principal
                                                    </label>
                                                    <div className="col-md-9">
                                                        <Dropzone
                                                            // maxFiles={1}
                                                            maxSizeBytes={15000000}
                                                            multiple={true}
                                                            inputContent="Selecciona varias imagenes"
                                                            onChangeStatus={this.handleChangeStatusSldP.bind(this)}
                                                            accept=".jpg,.jpeg,.gif,.png"
                                                            inputWithFilesContent="Agregar"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <label className=" col-md-3 control-label">
                                                        Imagen actual
                                                        </label>
                                                    <div className="col-md-9 control-label">
                                                        <div className="formCardsContainer three-columns">
                                                            {
                                                                this.state.data.slide_secundario.map((x) => {
                                                                    if (x.activo === 1) {
                                                                        return (
                                                                            <div className="formCard" key={x.id}>
                                                                                <button onClick={() => {
                                                                                    let data = this.state.data;
                                                                                    x.activo = 0;
                                                                                    // let indexOfArray = data.slide_secundario.findIndex(array => array.id == x.id);
                                                                                    // data.slide_secundario.splice(indexOfArray, 1);
                                                                                    this.setState({ data });
                                                                                }} type="button" className="deleteFormCard"><i className="fas fa-trash-alt"></i></button>
                                                                                <div className="form-group mt-50">
                                                                                    <img src={auth.pathApi() + x.imagen} className="img-fluid mt-50" alt="img slide" />
                                                                                </div>
                                                                            </div>
                                                                        )
                                                                    }
                                                                })
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <label className="col-md-3 control-label">
                                                        Slide secundario
                                                    </label>
                                                    <div className="col-md-9">
                                                        <Dropzone
                                                            // maxFiles={2}
                                                            maxSizeBytes={15000000}
                                                            multiple={true}
                                                            inputContent="Selecciona varias imagenes"
                                                            onChangeStatus={this.handleChangeStatusSldS.bind(this)}
                                                            accept=".jpg,.jpeg,.gif,.png"
                                                            inputWithFilesContent="Agregar"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <hr />
                                        <div className="panel-footer">
                                            <ValidarPermiso
                                                IdModuloPermisoValidar= {ModuloPermiso.InformacionSitio.Modificar}
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
export default CrearInformacionSitio;