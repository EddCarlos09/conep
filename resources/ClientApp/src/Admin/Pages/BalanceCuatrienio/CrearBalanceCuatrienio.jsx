import React, { Component } from 'react';
import BalanceCuatrienioDataService from "../../../Services/ContenidoMultimedia/BalanceCuatrienio.Service";
import Input from '../../../Components/Input';
import DatePicker from '../../../Components/DatePicker';
import ImageForMultipleResolution from '../../../Components/ImageForMultipleResolution';
import SunEditor from 'suneditor-react';
import Spinner from '../../../Components/Spinner';
import ValidForm from "../../../Utils/ValidForm";
import * as FechaMysql from "../../../Utils/FormatDate";
import AuthLogin from "../../../Utils/AuthLogin";
import { Constantes } from "../../../Constants/Constantes.js";
import { ModuloPermiso } from "../../../Permisos/ModuloPermiso";
import ValidarPermiso from "../../../Permisos/ValidarPermiso";

const auth = new AuthLogin();
let validForm = new ValidForm();
const constFileds = { 
    id: 0,
    titulo: "",
    yearInicio: 2020,
    yearFin: 2021,
    descripcion: "",
    imagen: [],
    user:'' 
}
const constErrors = { 
    yearInicio: "",
    yearFin: "",
    titulo: "",
    descripcion: "",
    imagen: "",
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

class CrearBalanceCuatrienio extends Component {
    constructor(props){
        super(props);
        const id = this.props.match.params.id === undefined ? 0 : this.props.match.params.id;
        this.state = {
            id:id,
            loading: false,
            data: constFileds,
            errors: constErrors,
            dpYearInicio: new Date(),
            dpYearFin: new Date(),
            textDescripcion: "",
            imagesResized: [],
        }
    }

    // Handlers

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
        await BalanceCuatrienioDataService.get(id)
            .then((response) => {
                let state = this.state;
                state.data = response.data[0];
                Object.assign(state.data, { user: auth.username() });
                state.dpYearInicio = new Date(state.data.yearInicio, 0);
                state.dpYearFin = new Date(state.data.yearFin, 0);
                state.textDescripcion = state.data.descripcion;
                state.data.imagen = state.data.imagen;
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
        data.yearInicio = FechaMysql.YearFormatMySql(this.state.dpYearInicio);
        data.yearFin = FechaMysql.YearFormatMySql(this.state.dpYearFin);
        data.imagen = this.state.imagesResized;
        data.descripcion = this.state.textDescripcion;
        data.user = auth.username();
        let responseData;
        if (data.id === 0) {
            await BalanceCuatrienioDataService.create(data)
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
            await BalanceCuatrienioDataService.update(data.id, data)
                .then((response) => {
                    responseData = response.data;
                    this.props.history.push({
                        pathname: "/balances-cuatrienio",
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
                pathname: "/balances-cuatrienio",
            });
        }
    };

    resetFields() {
        let fields = validForm.resetObject(constFileds);
        let errors = validForm.resetObject(constErrors);
        this.setState({ data: fields, errors: errors });
    }

    render(){
        return (
            <>
                <Spinner show={this.state.loading} />
                <ul className="breadcrumb">
                    <li>Contenido multimedia</li>
                    <li>Balance de cuatrienio</li>
                    <li>Nuevo balance</li>
                </ul>
                <div className="page-content-wrap">
                    <div className="row">
                        <div className="col-md-12">

                            <form className="form-horizontal">
                                <div className="panel panel-default">
                                    <div className="panel-heading">
                                        <h3 className="panel-title"><strong><i className="fa fa-file-alt"></i> {this.state.data["id"] === 0 ? "Nuevo" : "Editar"} balance</strong></h3>
                                    </div>
                                    <div className="panel-body">
                                        <div className="row">
                                            <h3>Información general</h3>
                                            <div className="col-md-9">
                                                <div className="form-group">
                                                    <label className="col-md-3 control-label">Título del balance</label>
                                                    <div className="col-md-9">
                                                        <div className="input-group">
                                                            <Input divClass="input-group"
                                                                inputName="nombre"
                                                                inputType="text"
                                                                inputClass="form-control"
                                                                inputplaceholder="Ingrese el nombre"
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
                                                    <label className="col-md-3 control-label">Año de inicio</label>
                                                    <div className="col-md-9">
                                                        <div className="input-group">
                                                            <DatePicker
                                                                id="dpYearInicio"
                                                                showInputTime={false}
                                                                divClass="input-group"
                                                                dateSelected={this.state.dpYearInicio || ''}
                                                                onChangeDate={e => {
                                                                    let fields = this.state;
                                                                    let errors = this.state.errors;
                                                                    fields = validForm.handleChangeDateField("dpYearInicio", fields, e);
                                                                    errors = validForm.handleChangeErrors("dpYearInicio", errors, e);
                                                                    this.setState({ fields: fields, errors: errors });
                                                                }}
                                                                spanClass="error"
                                                                spanError={this.state.errors.yearInicio || ''}
                                                                divClassSpanType={1}
                                                                divClassSpan="input-group-addon"
                                                                divClassSpanI="fa fa-calendar"
                                                                yearPicker={true}
                                                                    />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <label className="col-md-3 control-label">Año de finalización</label>
                                                    <div className="col-md-9">
                                                        <div className="input-group">
                                                            <DatePicker
                                                                id="dpYearFin"
                                                                showInputTime={false}
                                                                divClass="input-group"
                                                                dateSelected={this.state.dpYearFin || ''}
                                                                onChangeDate={e => {
                                                                    let fields = this.state;
                                                                    let errors = this.state.errors;
                                                                    fields = validForm.handleChangeDateField("dpYearFin", fields, e);
                                                                    errors = validForm.handleChangeErrors("dpYearFin", errors, e);
                                                                    this.setState({ fields: fields, errors: errors });
                                                                }}
                                                                spanClass="error"
                                                                spanError={this.state.errors.yearFin || ''}
                                                                divClassSpanType={1}
                                                                divClassSpan="input-group-addon"
                                                                divClassSpanI="fa fa-calendar"
                                                                yearPicker={true}
                                                                    />
                                                        </div>
                                                    </div>
                                                </div>
                                                {
                                                    this.state.id != 0 ?
                                                    <div className="form-group">
                                                        <label className="col-md-3 control-label">Imagen actual</label>
                                                        <div className="col-md-9">
                                                            <ImageForMultipleResolution key={1} preview={true} previewData={this.state.data.imagen || null} origin={auth.pathApi()} />
                                                        </div>
                                                    </div> : 
                                                    <div></div>
                                                }
                                                <div className="form-group">
                                                    <label className="col-md-3 control-label">Imagen</label>
                                                    <div className="col-md-9">
                                                        <ImageForMultipleResolution key={2} handlerOnLoad={this.handlerOnLoadForImage} resolutions={Constantes.balanceResolutions} handlerOnReset={this.handlerOnResetForImage} prefix="figura" controlName="images-1" />
                                                        <span className="error">{this.state.errors.imagen || ''}</span>
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <label className="col-md-3 control-label">Descripción del balance</label>
                                                    <div className="col-md-9">
                                                        <SunEditor
                                                            placeholder="..."
                                                            setContents={this.state.textDescripcion || ""}
                                                            onChange={(e) => {
                                                                let state = this.state;
                                                                let errors = this.state.errors;
                                                                state = validForm.handleChangeFieldJodiEditor("textDescripcion", state, e);
                                                                errors = validForm.handleChangeErrors("descripcion", errors, e);
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
                                                            {this.state.errors["descripcion"] || ""}
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
                                                <ValidarPermiso IdModuloPermisoValidar={this.state.id !== 0 ? ModuloPermiso.BalanceCuatrienio.Modificar : ModuloPermiso.BalanceCuatrienio.Nuevo} DefaultTemplate={
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

export default CrearBalanceCuatrienio;