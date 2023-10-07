import React, { Component } from 'react';
import BalanceCuatrienioInformeDataService from "../../../Services/ContenidoMultimedia/BalanceCuatrienioInforme.Service";
import Input from '../../../Components/Input';
import DatePicker from '../../../Components/DatePicker';
import ImageForMultipleResolution from '../../../Components/ImageForMultipleResolution';
import SunEditor from 'suneditor-react';
import Spinner from '../../../Components/Spinner';
import ValidForm from "../../../Utils/ValidForm";
import * as FechaMysql from "../../../Utils/FormatDate";
import AuthLogin from "../../../Utils/AuthLogin";
import { Constantes } from "../../../Constants/Constantes.js";
import Select from '../../../Components/Select';
import Glosario from '../../../Components/Glosario';
import { ModuloPermiso } from "../../../Permisos/ModuloPermiso";
import ValidarPermiso from "../../../Permisos/ValidarPermiso";

const auth = new AuthLogin();
let validForm = new ValidForm();
const constFileds = { 
    id: 0,
    titulo: "",
    balance_cuatrienio_id: 0,
    equipo_id: 0,
    tipo_publicacion_id: 0,
    fuente: "",
    fechaPublicacion: new Date(),
    autores: "",
    resumen: "",
    textoPublicacion: "",
    imagen: [],
    conceptos: [],
    user:'' 
}
const constErrors = { 
    titulo: "",
    equipo_id: "",
    tipo_publicacion_id: "",
    fuente: "",
    fechaPublicacion: "",
    autores: "",
    resumen: "",
    textoPublicacion: "",
    imagen: "",
    conceptos: "",
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

class CrearBalanceCuatrienioInforme extends Component {
    constructor(props){
        super(props);
        const idBalance = this.props.match.params.idBalance === undefined ? 0 : this.props.match.params.idBalance;
        const idInforme = this.props.match.params.idInforme === undefined ? 0 : this.props.match.params.idInforme;
        this.state = {
            idBalance:idBalance,
            idInforme: idInforme,
            loading: true,
            data: constFileds,
            errors: constErrors,
            dpFechaPublicacion: new Date(),
            textResumen: "",
            textPublicacion: "",
            imagesResized: [],
            glosarioSelected: [],
            glosarioData: [],
            filterEquipoCV: {value: 0, label: "Seleccione un equipo CV"},
            dataSelectEquipoCV: [],
            filterTipoPublicacion: {value: 0, label: "Seleccione un tipo de publicación"},
            dataSelectTipoPublicacion: []
        }
    }

    // Handlers

    handlerFilterEquipoCV = async (selectEquipoCV) => {
        let data = this.state.data;
        data.equipo_id = selectEquipoCV.value;
        this.setState({data: data, filterEquipoCV: selectEquipoCV});
    }
    handlerFilterTipoPublicacion = async (selectTipoPublicacion) => {
        let data = this.state.data;
        data.tipo_publicacion_id = selectTipoPublicacion.value;
        this.setState({data: data, filterTipoPublicacion: selectTipoPublicacion});
    }

    handlerOnLoadForImage = async (blob) => {
        let state = this.state;
        state.imagesResized = blob;
        this.setState({
            state
        })
    } 

    selectWordHandler = (selectedWord) => {
        let data = this.state.data;
        let cFiltred = data.conceptos.filter((x)=> {return x.glosario_legislativo_id === selectedWord.id})
        if(typeof cFiltred.length === 'undefined' || cFiltred.length === 0){ // Si no hay ninguno igual agregado
            let glosarioSelected = this.state.glosarioSelected;
            let conceptoObject = {
                id: 0,
                balance_informe_id: this.state.idBalance,
                glosario_legislativo_id: selectedWord.id,
                activo: 1
            }
            glosarioSelected.push(selectedWord);
            data.conceptos.push(conceptoObject);
            this.setState({glosarioSelected, data})
        }
        else{ // Significa que lo encontró pero en activo 0
            data.conceptos.forEach(x => {
                if(x.glosario_legislativo_id === selectedWord.id)
                    x.activo = 1
            })
        }
    }
    unselectWordHandler = (unselectedWord) => {
        let data = this.state.data;
        let glosarioSelected = this.state.glosarioSelected;

        let cFiltred = data.conceptos.filter((x)=> {return x.glosario_legislativo_id === unselectedWord.id})[0]
        if(cFiltred.id === 0) // Si tiene 0 de id, entonces lo eliminamos e la lista
            data.conceptos = data.conceptos.filter((x)=> {return x.glosario_legislativo_id !== unselectedWord.id})
        else{ // Si no, solo ponemos el activo en falso
            data.conceptos.forEach(x => {
                if(x.glosario_legislativo_id === unselectedWord.id)
                    x.activo = 0
            })
        }
        glosarioSelected = glosarioSelected.filter((x)=> {return x.id !== unselectedWord.id}) //Aquí si o si lo eliminamos
        this.setState({glosarioSelected, data})
    }

    async componentDidMount(){
        this.resetFields();
        let idInforme = this.state.idInforme;
        if (idInforme != 0) 
            await this.getByID(idInforme);

        this.getComboTipoPublicacion();
        this.getComboEquipoCV();
        this.getComboGlosarioLegislativo();
    }
    getComboGlosarioLegislativo = async () => {
        let glosario = this.state.glosarioData;
        await BalanceCuatrienioInformeDataService.getComboGlosarioLegislativo().then(response => {
            glosario = response.data;
        })
        let data = this.state.data;
        let glosarioSelected = [];
        data.conceptos.forEach(x => {
            glosarioSelected.push(glosario.filter((y)=> { return y.id === x.glosario_legislativo_id })[0])
        });
        this.setState({glosarioData: glosario, glosarioSelected})
    }
    // Methods
    getComboTipoPublicacion = async () => {
        await BalanceCuatrienioInformeDataService.getComboTipoPublicacion().then(response => {
            let combo = [];
            let selected = { value: 0, label: "Seleccione tipo de publicación" };
            response.data.forEach(i => {
                combo.push({ value: i.id, label: i.nombre })
                if(this.state.id !== 0){
                    let data = this.state.data;
                    if(data != null){
                        if(data.tipo_publicacion_id === i.id)
                            selected = { value: i.id, label: i.nombre };
                    }
                }
            })
            combo.unshift({ value: 0, label: "Seleccione tipo de publicación" })
            this.setState({
                dataSelectTipoPublicacion: combo,
                filterTipoPublicacion: selected,
            })
        })
    }
    getComboEquipoCV = async () => {
        await BalanceCuatrienioInformeDataService.getComboEquipoCV().then(response => {
            let combo = [];
            let selected = { value: 0, label: "Seleccione un equipo CV" };
            response.data.forEach(i => {
                combo.push({ value: i.id, label: i.nombre })
                if(this.state.id !== 0){
                    let data = this.state.data;
                    if(data != null){
                        if(data.equipo_id === i.id)
                            selected = { value: i.id, label: i.nombre };
                    }
                }
            })
            combo.unshift({ value: 0, label: "Seleccione un equipo CV" })
            this.setState({
                dataSelectEquipoCV: combo,
                filterEquipoCV: selected,
                loading: false
            })
        })
    }
    getByID = async (id) => {
        this.setState({ loading: true });
        await BalanceCuatrienioInformeDataService.get(id)
            .then((response) => {
                let state = this.state;
                state.data = response.data[0];
                Object.assign(state.data, { user: auth.username() });
                state.dpFechaPublicacion = state.data.fechaPublicacion;
                state.textResumen = state.data.resumen;
                state.textPublicacion = state.data.textoPublicacion;
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
        data.fechaPublicacion = FechaMysql.DateFormatMySql(this.state.dpFechaPublicacion);
        data.imagen = this.state.imagesResized;
        data.resumen = this.state.textResumen;
        data.textoPublicacion = this.state.textPublicacion;
        data.balance_cuatrienio_id = this.state.idBalance;
        data.user = auth.username();
        let responseData;
        if (data.id === 0) {
            await BalanceCuatrienioInformeDataService.create(data)
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
            await BalanceCuatrienioInformeDataService.update(data.id, data)
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
                pathname: `/balances-cuatrienio-informes/${this.state.idBalance}`,
            });
        }
    };

    resetFields() {
        let fields = validForm.resetObject(constFileds);
        let errors = validForm.resetObject(constErrors);
        fields.conceptos = []
        this.setState({ data: fields, errors: errors });
    }

    render(){
        return (
            <>
                <Spinner show={this.state.loading} />
                <ul className="breadcrumb">
                    <li>Contenido multimedia</li>
                    <li>Balances de cuatrienio</li>
                    <li>Informes</li>
                    <li>Nuevo informe</li>
                </ul>
                <div className="page-content-wrap">
                    <div className="row">
                        <div className="col-md-12">

                            <form className="form-horizontal">
                                <div className="panel panel-default">
                                    <div className="panel-heading">
                                        <h3 className="panel-title"><strong><i className="fa fa-file-alt"></i> {this.state.data["id"] === 0 ? "Nuevo" : "Editar"} informe</strong></h3>
                                    </div>
                                    <div className="panel-body">
                                        <div className="row">
                                            <h3>Información general</h3>
                                            <div className="col-md-9">
                                                <div className="form-group">
                                                    <label className="col-md-3 control-label">Título del informe</label>
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
                                                    <label className="col-md-3 control-label">Equipo autor de Congreso Visible</label>
                                                    <div className="col-md-9">
                                                        <div className="input-group">
                                                            <Select
                                                                divClass=""
                                                                selectplaceholder="Seleccione"
                                                                selectValue={this.state.filterEquipoCV}
                                                                selectIsSearchable={false}
                                                                selectoptions={this.state.dataSelectEquipoCV}
                                                                selectOnchange={this.handlerFilterEquipoCV}
                                                                selectclassNamePrefix="selectReact__value-container"
                                                                spanClass="error"
                                                                spanError={this.state.errors["corporacion_id"] || ''} >
                                                            </Select>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <label className="col-md-3 control-label">Tipo de publicación</label>
                                                    <div className="col-md-9">
                                                        <div className="input-group">
                                                            <Select
                                                                divClass=""
                                                                selectplaceholder="Seleccione"
                                                                selectValue={this.state.filterTipoPublicacion}
                                                                selectIsSearchable={false}
                                                                selectoptions={this.state.dataSelectTipoPublicacion}
                                                                selectOnchange={this.handlerFilterTipoPublicacion}
                                                                selectclassNamePrefix="selectReact__value-container"
                                                                spanClass="error"
                                                                spanError={this.state.errors["corporacion_id"] || ''} >
                                                            </Select>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <label className="col-md-3 control-label">Conceptos asociados</label>
                                                    <div className="col-md-9">
                                                        <div className="input-group">
                                                           <div className="conceptosContainer">
                                                               <div className="conceptos">
                                                                   {this.state.glosarioSelected !== null && typeof this.state.glosarioSelected.length !== 'undefined' && this.state.glosarioSelected.length > 0
                                                                   ?
                                                                    this.state.glosarioSelected.map((x,i) => {
                                                                      return (
                                                                          <div key={i} className="item">
                                                                              <p>{x.palabra}</p>
                                                                              <button onClick={()=>{this.unselectWordHandler(x)}} type="button" className="btn btn-danger"><i className="fas fa-trash-alt"></i></button>
                                                                          </div>
                                                                      )  
                                                                    })
                                                                   :
                                                                   <p className="no-conceptos">No hay conceptos seleccionados</p>
                                                                }
                                                               </div>
                                                               <span className="error">{this.state.errors.conceptos || ''}</span>
                                                               <div className="actions">
                                                                   <button type="button" data-toggle="modal" data-target="#select-concepto" className="btn btn-primary"><i className="fas fa-plus"></i> Agregar conceptos</button>
                                                               </div>
                                                           </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                {
                                                    this.state.idInforme != 0 ?
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
                                                        <ImageForMultipleResolution key={2} handlerOnLoad={this.handlerOnLoadForImage} resolutions={Constantes.informeResolutions} handlerOnReset={this.handlerOnResetForImage} prefix="figura" controlName="images-1" />
                                                        <span className="error">{this.state.errors.imagen || ''}</span>
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <label className="col-md-3 control-label">Fuente de la imagen</label>
                                                    <div className="col-md-9">
                                                        <div className="input-group">
                                                            <Input divClass="input-group"
                                                                inputName="nombre"
                                                                inputType="text"
                                                                inputClass="form-control"
                                                                inputplaceholder="Ingrese el nombre"
                                                                inputValue={this.state.data.fuente || ''}
                                                                inputOnchange={e => {
                                                                    let data = this.state.data;
                                                                    let errors = this.state.errors;
                                                                    data = validForm.handleChangeField("fuente", data, e);
                                                                    errors = validForm.handleChangeErrors("fuente", errors, e);
                                                                    this.setState({ data: data, errors: errors });
                                                                }}
                                                                spanClass="error"
                                                                spanError={this.state.errors["fuente"] || ''}
                                                                divClassSpanType={1}
                                                                divClassSpan="input-group-addon"
                                                                divClassSpanI="fa fa-indent" />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <label className="col-md-3 control-label">Fecha de publicación</label>
                                                    <div className="col-md-9">
                                                        <div className="input-group">
                                                            <DatePicker
                                                                id="dpFechaPublicacion"
                                                                showInputTime={false}
                                                                divClass="input-group"
                                                                dateSelected={this.state.dpFechaPublicacion || ''}
                                                                onChangeDate={e => {
                                                                    let fields = this.state;
                                                                    let errors = this.state.errors;
                                                                    fields = validForm.handleChangeDateField("dpFechaPublicacion", fields, e);
                                                                    errors = validForm.handleChangeErrors("dpFechaPublicacion", errors, e);
                                                                    this.setState({ fields: fields, errors: errors });
                                                                }}
                                                                spanClass="error"
                                                                spanError={this.state.errors.fechaPublicacion || ''}
                                                                divClassSpanType={1}
                                                                divClassSpan="input-group-addon"
                                                                divClassSpanI="fa fa-calendar"
                                                                    />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <label className="col-md-3 control-label">Autores</label>
                                                    <div className="col-md-9">
                                                        <div className="input-group">
                                                            <Input divClass="input-group"
                                                                inputName="nombre"
                                                                inputType="text"
                                                                inputClass="form-control"
                                                                inputplaceholder="Ingrese el nombre"
                                                                inputValue={this.state.data.autores || ''}
                                                                inputOnchange={e => {
                                                                    let data = this.state.data;
                                                                    let errors = this.state.errors;
                                                                    data = validForm.handleChangeField("autores", data, e);
                                                                    errors = validForm.handleChangeErrors("autores", errors, e);
                                                                    this.setState({ data: data, errors: errors });
                                                                }}
                                                                spanClass="error"
                                                                spanError={this.state.errors["autores"] || ''}
                                                                divClassSpanType={1}
                                                                divClassSpan="input-group-addon"
                                                                divClassSpanI="fa fa-indent" />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <label className="col-md-3 control-label">Resumen</label>
                                                    <div className="col-md-9">
                                                        <SunEditor
                                                            placeholder="..."
                                                            setContents={this.state.textResumen || ""}
                                                            onChange={(e) => {
                                                                let state = this.state;
                                                                let errors = this.state.errors;
                                                                state = validForm.handleChangeFieldJodiEditor("textResumen", state, e);
                                                                errors = validForm.handleChangeErrors("textResumen", errors, e);
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
                                                <div className="form-group">
                                                    <label className="col-md-3 control-label">Texto de la publicación</label>
                                                    <div className="col-md-9">
                                                        <SunEditor
                                                            placeholder="..."
                                                            setContents={this.state.textPublicacion || ""}
                                                            onChange={(e) => {
                                                                let state = this.state;
                                                                let errors = this.state.errors;
                                                                state = validForm.handleChangeFieldJodiEditor("textPublicacion", state, e);
                                                                errors = validForm.handleChangeErrors("textPublicacion", errors, e);
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
                                                            {this.state.errors["textoPublicacion"] || ""}
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
                                                <ValidarPermiso IdModuloPermisoValidar={this.state.idInforme !== 0 ? ModuloPermiso.BalanceCuatrienio.Modificar : ModuloPermiso.BalanceCuatrienio.Nuevo} DefaultTemplate={
                                                    <button type="button" onClick={() => { this.saveSubmit() }} className="btn btn-success pull-right"><i className="fa fa-check"></i> Guardar</button>
                                                } />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </form>

                        </div>
                    </div>
                    <div className="modal footer-fixed" id="select-concepto" tabIndex="-1" role="dialog" aria-labelledby="largeModalHead" aria-hidden="true">
                        <div className="modal-dialog modal-xl">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <button type="button" className="close" data-dismiss="modal">
                                        <span aria-hidden="true">&times;</span>
                                        <span className="sr-only">Cerrar</span>
                                    </button>
                                    <h4 className="modal-title" id="largeModalHead">
                                    <i class="fas fa-font"></i>{" "}
                                        Seleccionar conceptos
                                    </h4>
                                </div>

                                <div className="modal-body">
                                    <form name="formCurul" className="form-horizontal">
                                        <div className="row">
                                            <div className="col-md-12">
                                                <Glosario 
                                                accesableKey="palabra" 
                                                glosarioData={this.state.glosarioData} 
                                                selectWordHandler={this.selectWordHandler}
                                                unselectWordHandler={this.unselectWordHandler}
                                                glosarioSelected={this.state.glosarioSelected} />
                                            </div>
                                        </div>
                                    </form>
                                </div>
                                <div className="modal-footer">
                                    <div className="row">
                                        <div className="col-md-12">
                                            {/* <button type="button" className="btn btn-default pull-left" data-dismiss="modal">Cerrar</button> */}
                                            <button className="btn btn-primary pull-right" data-dismiss="modal"><i className="fa fa-check"></i> Aceptar</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}

export default CrearBalanceCuatrienioInforme;