import React, { Component } from 'react'
import AuthLogin from "../../../Utils/AuthLogin";
import congresoVisibleDataService from "../../../Services/Catalogo/CongresoVisible.Service";
import Spinner from "../../../Components/Spinner";
import ValidForm from "../../../Utils/ValidForm";
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
    urlexterna:"",  
    congreso_visible_id:0,
    imagen: null,  
    user: "",
};
const constErrors = {
    id: "",
    nombre: "", 
    urlexterna:"",  
    imagen: "",
    fechaCreacion: "",
    pathFoto: "",
};

const validForm = new ValidForm();

class CrearAliado extends Component {
    constructor(props) {
        super(props);
        const idcv =
            this.props.match.params.idcv === undefined
                ? 0
                : this.props.match.params.idcv;
        const idaliado =
            this.props.match.params.idaliado === undefined
                ? 0
                : this.props.match.params.idaliado;
        this.state = {
            idcv: idcv,
            idaliado:idaliado,
            loading: false,
            data: constFileds,
            errors: constErrors,         
            url: "",
            imagesResized: [],
        };
    };

    componentDidMount = async () => {
        this.resetFields();      

        let idaliado = this.state.idaliado;
        if (idaliado != 0) await this.getByID(idaliado);
        else this.resetFields();      
    };
    handlerOnLoadForImage = async (blob) => {
        let state = this.state;
        state.imagesResized = blob;
        this.setState({
            state
        })
    }
    getByID = async (idaliado) => {
        this.setState({ loading: true });
        await congresoVisibleDataService.getAliado(idaliado)
            .then((response) => {
                let data = this.state.data;                
                data = response.data[0];               
                Object.assign(data, { user: auth.username() });
                data.imagen = data.aliado_imagen;
        
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
        data.user = auth.username();
        let responseData;   
        if (data.id === 0) {
            await congresoVisibleDataService.createAliado(data)
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
            await congresoVisibleDataService.updateAliado(data.id, data)
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
                pathname: `/aliado-congreso-visible/${this.state.idcv}`                
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
                    <li>Aliado</li>
                    <li>{this.state.data["id"] === 0 ? "Nuevo" : "Editar"}{" "} Aliado</li>
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
                                                aliado
                                            </strong>
                                        </h3>
                                    </div>
                                    <div className="panel-body">
                                        <div className="row">
                                            <h3>Información del aliado</h3>
                                            <div className="col-md-9">
                                                <div className="form-group">
                                                    <label className="col-md-3 control-label">
                                                        Nombre del aliado
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
                                                        Sitio Web
                                                    </label>
                                                    <div className="col-md-9">
                                                        <div className="input-group">
                                                            <Input
                                                                divClass="input-group"
                                                                inputName="urlexterna"
                                                                inputType="text"
                                                                inputClass="form-control"
                                                                inputplaceholder="Ingrese el sitio web"
                                                                inputValue={
                                                                    this.state
                                                                        .data
                                                                        .urlexterna ||
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
                                                                        "urlexterna",
                                                                        data,
                                                                        e
                                                                    );
                                                                    errors = validForm.handleChangeErrors(
                                                                        "urlexterna",
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
                                                                        "urlexterna"
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
                                                                Constantes.CongresoVisibleAliadoResolutions
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
                                            </div>
                                            <hr />
                                        </div>
                                        <hr />
                                        <div className="panel-footer">
                                            <ValidarPermiso
                                                IdModuloPermisoValidar = {this.state.data["id"] !== 0 ? ModuloPermiso.CongresoVisible.ModificarAliado : ModuloPermiso.CongresoVisible.NuevoAliado}
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

export default CrearAliado;