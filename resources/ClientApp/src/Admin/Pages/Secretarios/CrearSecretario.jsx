import React, { Component } from 'react';
import SecretariosDataService from "../../../Services/Catalogo/Secretarios.Service";
import UtilsDataService from "../../../Services/General/Utils.Service";
import Input from '../../../Components/Input';
import ImageForMultipleResolution from '../../../Components/ImageForMultipleResolution';
import DatePicker from '../../../Components/DatePicker';
import Spinner from '../../../Components/Spinner';
import Select from '../../../Components/Select';
import SelectCurul from '../../../Components/SelectCurul';
import ValidForm from "../../../Utils/ValidForm";
import SunEditor from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css'; // Import Sun Editor's CSS File
import * as FechaMysql from "../../../Utils/FormatDate";
import AuthLogin from "../../../Utils/AuthLogin";
import { Constantes } from "../../../Constants/Constantes.js"
import ValidarPermiso from "../../../Permisos/ValidarPermiso";
import { ModuloPermiso } from "../../../Permisos/ModuloPermiso";

const auth = new AuthLogin();
const constFileds = { 
    id: 0,
    nombre: "",
    // corporacion_id: 0,
    // cuatrienio_id: 0,
    // partido_id: 0,
    // curul_id: 0,
    genero_id: 0,
    // circunscripcion_id: 0,
    fechaNacimiento: new Date(),
    lugarNacimiento: "",
    imagen: null,
    // congresista_perfil: {
    //     congresista_id: 0,
    //     grado_estudio_id: 0,
    //     descripcion: "",
    //     profesion: ""
    // },
    // congresista_trayectoria_publica: [
    //     // {id: 0, congresista_id: 0, cargo: "", partido_id: 0, fecha: new Date(), aplica: 0, activo: 1, partidoSelected: {value: 0, label: "Seleccione partido"} }
    // ],
    // congresista_trayectoria_privada: [
    //     // {id: 0, congresista_id: 0, cargo: "", fecha: new Date(), aplica: 0, activo: 0 }
    // ],
    datosContacto:[], user:'' 
}
const constErrors = { 
    id: "",
    nombre: "",
    // corporacion_id: "",
    genero_id: "",
    // circunscripcion_id: "",
    // cuatrienio_id: "",
    // partido_id: "",
    // curul_id: "",
    fechaNacimiento: "",
    lugarNacimiento: "",
    imagen: "",
    secretario_id: "",
    // grado_estudio_id: "",
    // descripcion: "",
    // profesion: "",
    // trayectoriaPrivada: "",
    // trayectoriaPublica: "",
    datosContacto:[], user:'' 
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
const SelectDatosContacto = { value: 0, label: "Seleccione un dato de contacto" };
let validForm = new ValidForm();


class CrearSecretario extends Component {
    constructor(props) {
        super(props);
        const id = this.props.match.params.id === undefined ? 0 : this.props.match.params.id;
        validForm = new ValidForm();
        this.state = {
            id:id,
            loading: false,
            data: constFileds,
            errors: constErrors,
            selectDatosContacto: SelectDatosContacto,
            dataSelectDatosContacto: [SelectDatosContacto],
            url: '',
            datosContactoDetalle: [],
            imagesResized: [],
            // filterTipoLegislativo: {value: 0, label: "Seleccione tipo de corporación"},
            // filterCuatrienio: {value: 0, label: "Seleccione cuatrienio"},
            // filterPartido: {value: 0, label: "Seleccione partido"},
            // filterGradoEstudio: {value: 0, label: "Seleccione grado de estudio"},
            filterGenero: {value: 0, label: "Seleccione género"},
            // filterCircunscripcion: {value: 0, label: "Seleccione circunscripción"},
            // textDescripcion: "",
            // textProfesion: "",
            // dataSelectTipoLegislativo: [],
            // dataSelectCuatrienio: [],
            // dataSelectPartido: [],
            // dataSelectGradoEstudio: [],
            dataSelectGenero: [],
            // dataSelectCircunscripcion: [],
            dpFechaNacimiento: new Date(),
            // curulData: [],
            // curulSelected: {curul_id: 0},
            // windowCuatrienio: false
        }
    }

    handlerAddElementToTrayectoriaPublica = async () => {
        let data = this.state.data;
        data.congresista_trayectoria_publica.push({id: 0, cargo: "", partido_id: 0, fecha: new Date(), aplica: 0, activo: 1, partidoSelected: {value: 0, label: "Seleccione partido"} });
        this.setState({data})
    }
    handlerAddElementToTrayectoriaPrivada = async () => {
        let data = this.state.data;
        data.congresista_trayectoria_privada.push({id: 0, cargo: "", fecha: new Date(), aplica: 0, activo: 1});
        this.setState({data})
    }
   
    handlerFilterTipoLegislativo = async (selectTipoLegislativo) => {
        let data = this.state.data;
        data.corporacion_id = selectTipoLegislativo.value;
        this.setState({data: data, filterTipoLegislativo: selectTipoLegislativo});
    }
    handlerFilterCuatrienio = async (selectCuatrienio) => {
        let data = this.state.data;
        data.cuatrienio_id = selectCuatrienio.value;
        this.setState({data: data, filterCuatrienio: selectCuatrienio});
    }
    handlerPartido = async (selectPartido) => {
        let data = this.state.data;
        data.partido_id = selectPartido.value;
        this.setState({data: data, filterPartido: selectPartido});
    }
    handlerGenero = async (selectGenero) => {
        let data = this.state.data;
        data.genero_id = selectGenero.value;
        this.setState({data: data, filterGenero: selectGenero});
    }
    handlerCircunscripcion = async (selectCircunscripcion) => {
        let data = this.state.data;
        data.circunscripcion_id = selectCircunscripcion.value;
        this.setState({data: data, filterCircunscripcion: selectCircunscripcion});
    }
    handlerGradoEstudio = async (selectGradoEstudio) => {
        let data = this.state.data;
        data.congresista_perfil.grado_estudio_id = selectGradoEstudio.value;
        this.setState({data: data, filterGradoEstudio: selectGradoEstudio})
    }
    componentDidMount = async() =>{
        
        this.resetFields();
        this.state.data.id = this.state.id;
        this.state.data.user = auth.username();
        let id= this.state.id;          

        if (id !== 0) 
            await this.getByID(id);
            
        this.getComboDatosContacto();
        // this.getComboCuatrienio();
        // this.getComboPartido();
        // this.getComboCorporacion();
        // this.getComboGradoEstudio();
        this.getComboGenero(this.state.data.genero_id);
        // this.getComboCircunscripcion(this.state.data.circunscripcion_id);
    }

    fillCombosTrayectoriaPublica = async (partidos) => {
        let data = this.state.data;
        let publicas = data.congresista_trayectoria_publica;
        publicas.forEach(x => {
            let partidoSelected = partidos.filter((p)=>{return p.value === x.partido_id})[0];
            Object.assign(x, {partidoSelected: partidoSelected});
        })
        this.setState({data})
    }
    getComboGradoEstudio = async () => {
        await SecretariosDataService.getComboGradoEstudio().then(response => {
            let combo = [];
            let selected = { value: 0, label: "Seleccione grado de estudio" };
            response.data.forEach(i => {
                combo.push({ value: i.id, label: i.nombre })
                if(this.state.id !== 0){
                    let perfil = this.state.data.congresista_perfil;
                    if(perfil != null){
                        if(perfil.grado_estudio_id === i.id)
                            selected = { value: i.id, label: i.nombre };
                    }
                }
            })
            combo.unshift({ value: 0, label: "Seleccione grado de estudio" })
            this.setState({
                dataSelectGradoEstudio: combo,
                filterGradoEstudio: selected
            })
        })
    }
    getComboCircunscripcion = async (idCircunscripcion) => {
        await SecretariosDataService.getComboCircunscripcion().then(response => {
            let combo = [];
            let selected = { value: 0, label: "Seleccione circunscripción" };
            response.data.forEach(i => {
                combo.push({ value: i.id, label: i.nombre })
                if(this.state.id !== 0){
                    if(idCircunscripcion === i.id)
                            selected = { value: i.id, label: i.nombre };
                }
            })
            combo.unshift({ value: 0, label: "Seleccione circunscripción" })
            this.setState({
                dataSelectCircunscripcion: combo,
                filterCircunscripcion: selected
            })
        })
    }
    getComboGenero = async (idGenero) => {
        await SecretariosDataService.getComboGenero().then(response => {
            let combo = [];
            let selected = { value: 0, label: "Seleccione género" };
            response.data.forEach(i => {
                combo.push({ value: i.id, label: i.nombre })
                if(this.state.id !== 0){
                    if(idGenero === i.id)
                            selected = { value: i.id, label: i.nombre };
                }
            })
            combo.unshift({ value: 0, label: "Seleccione género" })
            this.setState({
                dataSelectGenero: combo,
                filterGenero: selected
            })
        })
    }
    getComboCorporacion = async () => {
        await SecretariosDataService.getComboCorporacion().then(response => {
            let combo = [];
            let selected = { value: 0, label: "Seleccione tipo de corporación" };
            response.data.forEach(i => {
                combo.push({ value: i.id, label: i.nombre })
                if(this.state.id !== 0){
                    let idd = this.state.data.corporacion_id;
                    if(idd === i.id)
                        selected = { value: i.id, label: i.nombre };
                }
            })
            combo.unshift({ value: 0, label: "Seleccione tipo de corporación" })
            this.setState({
                dataSelectTipoLegislativo: combo,
                filterTipoLegislativo: selected
            })
        })
    }
    getComboCuatrienio = async () => {
        await SecretariosDataService.getComboCuatrienio().then(response => {
            let combo = [];
            let selected = { value: 0, label: "Seleccione quinquenio" };
            response.data.forEach(i => {
                combo.push({ value: i.id, label: i.nombre })
                if(this.state.id !== 0){
                    let idd = this.state.data.cuatrienio_id;
                    if(idd === i.id)
                        selected = { value: i.id, label: i.nombre };
                }
            })
            combo.unshift({ value: 0, label: "Seleccione quinquenio" })
            this.setState({
                dataSelectCuatrienio: combo,
                filterCuatrienio: selected
            })
        })
    }
    getComboPartido = async () => {
        await SecretariosDataService.getComboPartido().then(response => {
            let combo = [];
            let selected = { value: 0, label: "Seleccione partido" };
            response.data.forEach(i => {
                combo.push({ value: i.id, label: i.nombre })
                if(this.state.id !== 0){
                    let idd = this.state.data.partido_id;
                    if(idd === i.id)
                        selected = { value: i.id, label: i.nombre };
                }
            })
            combo.unshift({ value: 0, label: "Seleccione partido" })
            this.setState({
                dataSelectPartido: combo,
                filterPartido: selected
            })
            if(this.state.id !== 0)
                this.fillCombosTrayectoriaPublica(combo);
        })

      
    }
    getByID = async (id) => {
        this.setState({ loading: true });
        await SecretariosDataService.get(id)
            .then(response => {
                let state = this.state;
                let errors = this.state.errors;
                state.data = response.data[0];
                Object.assign(state.data, { user: auth.username() });
                state.data.imagen = state.data.secretario_imagen;
                state.dpFechaNacimiento = state.data.fechaNacimiento;
                state.data.datosContacto = state.data.secretario_datos_contacto;
                // state.data.congresista_perfil = response.data[0].congresista_perfil === null ? constFileds.congresista_perfil : response.data[0].congresista_perfil;
                // state.data.congresista_trayectoria_publica = response.data[0].congresista_trayectoria_publica === null ? constFileds.congresista_trayectoria_publica : response.data[0].congresista_trayectoria_publica;
                // state.data.congresista_trayectoria_privada = response.data[0].congresista_trayectoria_privada === null ? constFileds.congresista_trayectoria_privada : response.data[0].congresista_trayectoria_privada;
                // state.textDescripcion = response.data[0].congresista_perfil.descripcion;
                // state.textProfesion = response.data[0].congresista_perfil.profesion;
                // state.curulSelected.id = response.data[0].curul_id;
                state.data.datosContacto.map((item, i) => {
                    errors.datosContacto.push({id:"", dato_contacto_id: "", secretario_id: "", cuenta: "", activo: "" });
                    return null;
                });
                this.setState({
                    data: state.data,
                    loading: false
                });
            })
            .catch(e => {
                this.setState({
                    loading: false
                });
                console.log(e);
            });
    }

    handleDatosContacto = async (selectOption) => {
        this.setState({ selectDatosContacto: selectOption });
    }
    
    handlerAddDatosContacto = () => {
        let dato_contacto_id = this.state.selectDatosContacto.value;
        let url = this.state.url;
        if(url !== '' && dato_contacto_id !== 0){
            let item = { id:0, dato_contacto_id: dato_contacto_id, secretario_id: this.state.data.id, cuenta: url, activo: 1 }
            let itemError = { id:"", dato_contacto_id:"", secretario_id:"", cuenta:"", activo:"" }
            this.setState(prevState => ({
                ...prevState,
                data: {
                    ...prevState.data,
                    datosContacto: [
                        ...prevState.data.datosContacto,
                        item
                    ]
                },
                errors: {
                    ...prevState.errors,
                    datosContacto: [
                        ...prevState.errors.datosContacto,
                        itemError
                    ]
                }
            }));
        }
    }

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


        this.setState(prevState => ({
            ...prevState,
            data: {
                ...prevState.data,
                datosContacto: datosContacto
            }
        }));
    }

    renderDatoContacto = (idTipoContacto) => {
        let datosContacto = this.state.datosContactoDetalle;
        let elemento = datosContacto.find(x => x.id == idTipoContacto);
        if(elemento !== undefined){
            return elemento.imagen;
        }
    }
    // Métodos asíncronos

    getComboDatosContacto = async () => {
        this.setState({ loading: true });
        await UtilsDataService.getComboDatosContacto()
            .then(response => {
                response.data.map(item => {
                    this.state.dataSelectDatosContacto.push({
                        value: item.id,
                        label: item.nombre
                    });
                });
                let data = response.data;
                this.setState({ loading: false, datosContactoDetalle: data });
            });
    }

    saveSubmit = async () => {
        let errors = this.state.errors;
        errors = validForm.cleanErrors(errors);
        this.setState({ errors: errors, loading: true });
        let data = this.state.data;
        data.fechaNacimiento = FechaMysql.DateFormatMySql(this.state.dpFechaNacimiento);
        // data.congresista_trayectoria_publica.forEach(x => {
        //     x.fecha = FechaMysql.DateFormatMySql(x.fecha);
        // })
        // data.congresista_trayectoria_privada.forEach(x => {
        //     x.fecha = FechaMysql.DateFormatMySql(x.fecha);
        // })
        data.imagen = this.state.imagesResized;
        data.user = auth.username();
        // data.curul_id = this.state.curulSelected.id;
        // data.congresista_perfil.descripcion = this.state.textDescripcion;
        // data.congresista_perfil.profesion = this.state.textProfesion;
        // data.curul_id = 78;
        let responseData;

        if(data.id===0)
        {
            await SecretariosDataService.create(data)
                .then(response => {
                    responseData = response.data;
                })
                .catch(function (error) {
                    errors = validForm.displayErrors(error.response.data, errors);
                });
        }
        else
        {
            await SecretariosDataService.update(data.id, data)
                .then(response => {
                    responseData = response.data;
                })
                .catch(function (error) {
                    errors = validForm.displayErrors(error.response.data, errors);
                });
        }
        
        this.setState({ errors: errors, loading: false });
        if (responseData !== null && responseData !== undefined) {
            this.resetFields();
            this.props.history.push({
                pathname: '/secretarios'
            });
        }
    }

    // getDataCuruls = async () => {
    //     let cuatrienio = this.state.data.cuatrienio_id;
    //     let corporacion = this.state.data.corporacion_id;
    //     if(cuatrienio !== 0 && corporacion !== 0){
    //         this.setState({loading: true, windowCuatrienio: false})
    //         let curulData = [];
    //         await SecretariosDataService.getCurules(cuatrienio, corporacion).then(response => {
    //             curulData = response.data;
    //         })
    //         this.setState({loading: false, curulData: curulData})
    //     }
    //     else{
    //         this.setState({windowCuatrienio: true})
    //     }
    // }
    handlerCurulSelected = async (curulSelected) => {
        this.setState({curulSelected: curulSelected})
    }
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
                    <li>Congresista</li>
                    <li>{this.state.data["id"] === 0 ? "Nuevo" : "Editar"} secretario</li>
                </ul>
                <div className="page-content-wrap">
                    <div className="row">
                        <div className="col-md-12">

                            <form className="form-horizontal">
                                <div className="panel panel-default">
                                    <div className="panel-heading">
                                        <h3 className="panel-title"><strong><i className="fa fa-user"></i> {this.state.data["id"] === 0 ? "Nuevo" : "Editar"} secretario</strong></h3>
                                    </div>
                                    <div className="panel-body">
                                        <div className="row">
                                            <h3>Información general</h3>
                                            <div className="col-md-9">
                                                <div className="form-group">
                                                    <label className="col-md-3 control-label">Nombre del secretario</label>
                                                    <div className="col-md-9">
                                                        <div className="input-group">
                                                            <Input divClass="input-group"
                                                                inputName="nombre"
                                                                inputType="text"
                                                                inputClass="form-control"
                                                                inputplaceholder="Ingrese el nombre"
                                                                inputValue={this.state.data.nombre || ''}
                                                                inputOnchange={e => {
                                                                    let data = this.state.data;
                                                                    let errors = this.state.errors;
                                                                    data = validForm.handleChangeField("nombre", data, e);
                                                                    errors = validForm.handleChangeErrors("nombre", errors, e);
                                                                    this.setState({ data: data, errors: errors });
                                                                }}
                                                                spanClass="error"
                                                                spanError={this.state.errors["nombre"] || ''}
                                                                divClassSpanType={1}
                                                                divClassSpan="input-group-addon"
                                                                divClassSpanI="fa fa-indent" />
                                                        </div>
                                                    </div>
                                                </div>
                                                {/* <div className="form-group">
                                                    <label className="col-md-3 control-label">Tipo de corporación</label>
                                                    <div className="col-md-9">
                                                        <div className="input-group">
                                                            <Select
                                                                divClass=""
                                                                selectplaceholder="Seleccione"
                                                                selectValue={this.state.filterTipoLegislativo}
                                                                selectIsSearchable={false}
                                                                selectoptions={this.state.dataSelectTipoLegislativo}
                                                                selectOnchange={this.handlerFilterTipoLegislativo}
                                                                selectclassNamePrefix="selectReact__value-container"
                                                                spanClass="error"
                                                                spanError={this.state.errors["corporacion_id"] || ''} >
                                                            </Select>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <label className="col-md-3 control-label">Cuatrienio</label>
                                                    <div className="col-md-9">
                                                        <div className="input-group">
                                                            <Select
                                                                divClass=""
                                                                selectplaceholder="Seleccione"
                                                                selectValue={this.state.filterCuatrienio}
                                                                selectIsSearchable={false}
                                                                selectoptions={this.state.dataSelectCuatrienio}
                                                                selectOnchange={this.handlerFilterCuatrienio}
                                                                selectclassNamePrefix="selectReact__value-container"
                                                                spanClass="error"
                                                                spanError={this.state.errors["cuatrienio_id"] || ''} >
                                                            </Select>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <label className="col-md-3 control-label">Partido</label>
                                                    <div className="col-md-9">
                                                        <div className="input-group">
                                                            <Select
                                                                divClass=""
                                                                selectplaceholder="Seleccione"
                                                                selectValue={this.state.filterPartido}
                                                                selectIsSearchable={false}
                                                                selectoptions={this.state.dataSelectPartido}
                                                                selectOnchange={this.handlerPartido}
                                                                selectclassNamePrefix="selectReact__value-container"
                                                                spanClass="error"
                                                                spanError={this.state.errors.partido_id || ''} >
                                                            </Select>
                                                        </div>
                                                    </div>
                                                </div> */}
                                                <div className="form-group">
                                                    <label className="col-md-3 control-label">Género</label>
                                                    <div className="col-md-9">
                                                        <div className="input-group">
                                                            <Select
                                                                divClass=""
                                                                selectplaceholder="Seleccione"
                                                                selectValue={this.state.filterGenero}
                                                                selectIsSearchable={false}
                                                                selectoptions={this.state.dataSelectGenero}
                                                                selectOnchange={this.handlerGenero}
                                                                selectclassNamePrefix="selectReact__value-container"
                                                                spanClass="error"
                                                                spanError={this.state.errors.genero_id || ''} >
                                                            </Select>
                                                        </div>
                                                    </div>
                                                </div>
                                                {/* <div className="form-group">
                                                    <label className="col-md-3 control-label">Circunscripción</label>
                                                    <div className="col-md-9">
                                                        <div className="input-group">
                                                            <Select
                                                                divClass=""
                                                                selectplaceholder="Seleccione"
                                                                selectValue={this.state.filterCircunscripcion}
                                                                selectIsSearchable={false}
                                                                selectoptions={this.state.dataSelectCircunscripcion}
                                                                selectOnchange={this.handlerCircunscripcion}
                                                                selectclassNamePrefix="selectReact__value-container"
                                                                spanClass="error"
                                                                spanError={this.state.errors.circunscripcion_id || ''} >
                                                            </Select>
                                                        </div>
                                                    </div>
                                                </div> */}
                                                <div className="form-group">
                                                    <label className="col-md-3 control-label">Fecha de nacimiento</label>
                                                    <div className="col-md-9">
                                                        <div className="input-group">
                                                            <DatePicker
                                                                id="dateFechaNacimiento"
                                                                showInputTime={false}
                                                                divClass="input-group"
                                                                dateSelected={this.state.dpFechaNacimiento || ''}
                                                                onChangeDate={e => {
                                                                    let fields = this.state;
                                                                    let errors = this.state.errors;
                                                                    fields = validForm.handleChangeDateField("dpFechaNacimiento", fields, e);
                                                                    errors = validForm.handleChangeErrors("dpFechaNacimiento", errors, e);
                                                                    this.setState({ state: fields, errors: errors });
                                                                }}
                                                                spanClass="error"
                                                                spanError={this.state.errors["dpFechaNacimiento"] || ''}
                                                                divClassSpanType={1}
                                                                divClassSpan="input-group-addon"
                                                                divClassSpanI="fa fa-calendar"
                                                                    />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <label className="col-md-3 control-label">Lugar de nacimiento</label>
                                                    <div className="col-md-9">
                                                        <div className="input-group">
                                                            <Input divClass="input-group"
                                                                inputName="lugar"
                                                                inputType="text"
                                                                inputClass="form-control"
                                                                inputplaceholder="Ingrese el lugar"
                                                                inputValue={this.state.data.lugarNacimiento || ''}
                                                                inputOnchange={e => {
                                                                    let data = this.state.data;
                                                                    let errors = this.state.errors;
                                                                    data = validForm.handleChangeField("lugarNacimiento", data, e);
                                                                    errors = validForm.handleChangeErrors("lugarNacimiento", errors, e);
                                                                    this.setState({ data: data, errors: errors });
                                                                }}
                                                                spanClass="error"
                                                                spanError={this.state.errors.lugarNacimiento || ''}
                                                                divClassSpanType={1}
                                                                divClassSpan="input-group-addon"
                                                                divClassSpanI="fa fa-indent" />
                                                        </div>
                                                    </div>
                                                </div>
                                                {
                                                    this.state.id != 0 ?
                                                    <div className="form-group">
                                                        <label className="col-md-3 control-label">Fotografía actual</label>
                                                        <div className="col-md-9">
                                                            <ImageForMultipleResolution key={1} preview={true} previewData={this.state.data.imagen || null} origin={auth.pathApi()} />
                                                        </div>
                                                    </div> : 
                                                    <div></div>
                                                }
                                                <div className="form-group">
                                                    <label className="col-md-3 control-label">Fotografía</label>
                                                    <div className="col-md-9">
                                                        <ImageForMultipleResolution key={2} handlerOnLoad={this.handlerOnLoadForImage} resolutions={Constantes.secretarioResolutions} handlerOnReset={this.handlerOnResetForImage} prefix="figura" controlName="images-1" />
                                                        <span className="error">{this.state.errors.imagen || ''}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <hr />
                                        </div>
                                    </div>
                                    <div className="panel-body">
                                        <div className="row">
                                        <h3>Datos de contacto</h3>
                                            <div className="col-md-9">
                                                <div className="form-group">
                                                    <label className="col-md-3 control-label">&nbsp;</label>
                                                    <div className="col-md-4">
                                                        <Select
                                                            divClass=""
                                                            selectplaceholder="Seleccione"
                                                            selectValue={this.state.selectDatosContacto}
                                                            selectOnchange={this.handleDatosContacto}
                                                            selectoptions={this.state.dataSelectDatosContacto}
                                                            selectIsSearchable={false}
                                                            selectclassNamePrefix="selectReact__value-container"
                                                            spanClass=""
                                                            spanError="" >
                                                        </Select>
                                                    </div>
                                                    <div className="col-md-5">
                                                        <div className="input-group">
                                                            <span className="input-group-addon"><i className="fa fa-link"></i></span>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                placeholder="http://..."
                                                                onChange={(e) => {
                                                                    this.setState({ url: e.currentTarget.value });
                                                                }} />
                                                            <span className="input-group-addon wbtn">
                                                                <button type="button"
                                                                    onClick={() => {
                                                                        this.handlerAddDatosContacto();
                                                                    }} className="btn btn-primary"><i className="fa fa-plus"></i></button></span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <hr />
                                                <div className="redes-sociales-container">
                                                    {this.state.data.datosContacto.map((item, i) => {
                                                        if (item.activo) {
                                                            return (
                                                                <div key={i} className="form-group">
                                                                    <label className="col-md-3 control-label"></label>
                                                                    <div className="col-md-9">
                                                                        <div className="input-group">                               
                                                                            <span className="input-group-addon">
                                                                                <img style={{ width: "100%" }}  src={this.renderDatoContacto(item.dato_contacto_id) != null ? auth.pathApi() + this.renderDatoContacto(item.dato_contacto_id) || "" : Constantes.NoImagenPicture} />
                                                                                {/* <i className={this.renderDatoContacto(item.dato_contacto_id)}></i> */}
                                                                            </span>
                                                                            <input
                                                                                type="text"
                                                                                name={"cuenta" + i.toString()}
                                                                                className="form-control"
                                                                                placeholder="Ingrese la cuenta"
                                                                                value={item.cuenta || ''}
                                                                                readOnly={true}
                                                                            />
                                                                            <span className="input-group-addon wbtn">
                                                                                <button type="button"
                                                                                    onClick={() => { this.removeDatoContacto(i) }}
                                                                                    className="btn btn-danger"
                                                                                ><i className="fa fa-trash-alt"></i></button>
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                    <span className="error">{this.state.errors["datosContacto"][i] ? this.state.errors["datosContacto"][i].cuenta : ''}</span>
                                                                </div>
                                                            )
                                                        }
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* <div className="panel-body">
                                        <div className="row">
                                            <h3>Perfil</h3>
                                            <div className="col-md-12">
                                                <div className="panel panel-default tabs">
                                                    <ul className="nav nav-tabs nav-justified">
                                                        <li className="active"><a href={`#tab-educacion`} data-toggle="tab">Educación</a></li>
                                                        <li><a href={`#tab-profesion`} data-toggle="tab">Profesión</a></li>
                                                        <li><a href={`#tab-trayectoria-publica`} data-toggle="tab">Trayectoria pública</a></li>
                                                        <li><a href={`#tab-trayectoria-privada`} data-toggle="tab">Trayectoria privada</a></li>
                                                    </ul>
                                                    <div className="panel-body tab-content">
                                                        <div className={`tab-pane active`} id={`tab-educacion`}>
                                                        <div className="form-group">
                                                            <div className="col-md-12">
                                                                <label htmlFor="">Nivel máximo de grado de estudio</label>
                                                                <Select
                                                                    divClass=""
                                                                    selectplaceholder="Seleccione"
                                                                    selectValue={this.state.filterGradoEstudio}
                                                                    selectIsSearchable={false}
                                                                    selectoptions={this.state.dataSelectGradoEstudio}
                                                                    selectOnchange={this.handlerGradoEstudio}
                                                                    selectclassNamePrefix="selectReact__value-container"
                                                                    spanClass="error"
                                                                    spanError={this.state.errors.grado_estudio_id || ''} >
                                                                </Select>
                                                            </div>
                                                        </div>
                                                        <div className="form-group">
                                                            <div className="col-md-12">
                                                                <label htmlFor="">Descrición académica</label>
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
                                                        <div className={`tab-pane`} id={`tab-profesion`}>
                                                            <div className="form-group">
                                                                <div className="col-md-12">
                                                                    <label htmlFor="">Descrición de profesión</label>
                                                                    <SunEditor
                                                                        placeholder="..."
                                                                        setContents={this.state.textProfesion || ""}
                                                                        onChange={(e) => {
                                                                            let state = this.state;
                                                                            let errors = this.state.errors;
                                                                            state = validForm.handleChangeFieldJodiEditor("textProfesion", state, e);
                                                                            errors = validForm.handleChangeErrors("profesion", errors, e);
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
                                                                        {this.state.errors["profesion"] || ""}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className={`tab-pane`} id={`tab-trayectoria-publica`}>
                                                            <div className="form-group">
                                                                <div className="col-md-12">
                                                                    <label htmlFor="">Agregue elementos a la descripción pública</label>
                                                                    <hr/>
                                                                    <div className="formCardsContainer three-columns">
                                                                        {
                                                                            this.state.data.congresista_trayectoria_publica.map((x, i) => {
                                                                                if(x.activo === 1){
                                                                                    return (
                                                                                        <div className="formCard">
                                                                                            <button onClick={()=>{
                                                                                                     let data = this.state.data;
                                                                                                     let item = data.congresista_trayectoria_publica[i];
                                                                                                     if(item.id === 0){
                                                                                                         data.congresista_trayectoria_publica.splice(i, 1);
                                                                                                     }else{
                                                                                                        item.activo = 0;
                                                                                                     }
                                                                                                     this.setState({data});
                                                                                            }} type="button" className="deleteFormCard"><i className="fas fa-trash-alt"></i></button>
                                                                                            <div className="form-group">
                                                                                                <div className="col-md-12">
                                                                                                    <label htmlFor="">Cargo en ese entonces</label>
                                                                                                    <Input divClass="input-group"
                                                                                                        inputName="nombre"
                                                                                                        inputType="text"
                                                                                                        inputClass="form-control"
                                                                                                        inputplaceholder="Escriba cargo"
                                                                                                        inputValue={x.cargo || ''}
                                                                                                        inputOnchange={e => {
                                                                                                            let data = this.state.data;
                                                                                                            let item = data.congresista_trayectoria_publica[i];
                                                                                                            item.cargo = e.currentTarget.value;
                                                                                                            this.setState({data});
                                                                                                        }}
                                                                                                        spanClass="error"
                                                                                                        spanError={ ''}
                                                                                                        divClassSpanType={1}
                                                                                                        divClassSpan="input-group-addon"
                                                                                                        divClassSpanI="fa fa-indent" />
                                                                                                </div>
                                                                                            </div>
                                                                                            <div className="form-group">
                                                                                                <div className="col-md-12">
                                                                                                    <label htmlFor="">Partido</label>
                                                                                                    <Select
                                                                                                        divClass=""
                                                                                                        selectplaceholder="Seleccione"
                                                                                                        selectValue={x.partidoSelected}
                                                                                                        selectIsSearchable={false}
                                                                                                        selectoptions={this.state.dataSelectPartido}
                                                                                                        selectOnchange={(selected)=>{
                                                                                                            let data = this.state.data;
                                                                                                            let item = data.congresista_trayectoria_publica[i];
                                                                                                            item.partido_id = selected.value;
                                                                                                            item.partidoSelected = selected;
                                                                                                            this.setState({data});
                                                                                                        }}
                                                                                                        selectclassNamePrefix="selectReact__value-container"
                                                                                                        spanClass="error"
                                                                                                        spanError={''} >
                                                                                                    </Select>
                                                                                                </div>
                                                                                            </div>
                                                                                            <div className="form-group">
                                                                                                <div className="col-md-12">
                                                                                                    <label htmlFor="">Fecha de ocupación</label>
                                                                                                    <DatePicker
                                                                                                    id="dateFechaNacimiento"
                                                                                                    showInputTime={false}
                                                                                                    divClass="input-group"
                                                                                                    dateSelected={x.fecha || ''}
                                                                                                    onChangeDate={e => {
                                                                                                        let data = this.state.data;
                                                                                                        let item = data.congresista_trayectoria_publica[i];
                                                                                                        item.fecha = e;
                                                                                                        this.setState({data});
                                                                                                    }}
                                                                                                    spanClass="error"
                                                                                                    spanError={this.state.errors["dpFechaNacimiento"] || ''}
                                                                                                    divClassSpanType={1}
                                                                                                    divClassSpan="input-group-addon"
                                                                                                    divClassSpanI="fa fa-calendar"
                                                                                                        />
                                                                                                </div>
                                                                                            </div>
                                                                                            <div className="form-group">
                                                                                                <div className="col-md-12">
                                                                                                    <label htmlFor="" className="flexCheckbox">
                                                                                                        <input type="checkbox" onChange={(e)=>{
                                                                                                            let data = this.state.data;
                                                                                                            let item = data.congresista_trayectoria_publica[i];
                                                                                                            item.aplica = e.currentTarget.checked ? 1 : 0;
                                                                                                            this.setState({data});
                                                                                                        }} checked={x.aplica === 1 ? "checked" : ""} className="checkbox"/>
                                                                                                        ¿Aplica a partido?
                                                                                                    </label>
                                                                                                </div>
                                                                                            </div>
                                                                                            
                                                                                        </div>
                                                                                    )
                                                                                }
                                                                            })
                                                                        }
                                                                        <div className="formCard addMore" onClick={()=>{
                                                                            this.handlerAddElementToTrayectoriaPublica();
                                                                        }}>
                                                                            <i className="fas fa-plus-circle"></i>
                                                                            <p>Agregar</p>
                                                                        </div>
                                                                    </div>
                                                                    <span className="error">
                                                                        {this.state.errors["trayectoriaPublica"] || ""}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className={`tab-pane`} id={`tab-trayectoria-privada`}>
                                                            <div className="form-group">
                                                                <div className="col-md-12">
                                                                    <label htmlFor="">Agregue elementos a la descripción privada</label>
                                                                    <hr/>
                                                                    <div className="formCardsContainer three-columns">
                                                                        {
                                                                            this.state.data.congresista_trayectoria_privada.map((x, i) => {
                                                                                if(x.activo === 1){
                                                                                    return (
                                                                                        <div className="formCard">
                                                                                            <button onClick={()=>{
                                                                                                 let data = this.state.data;
                                                                                                 let item = data.congresista_trayectoria_privada[i];
                                                                                                 if(item.id === 0){
                                                                                                     data.congresista_trayectoria_privada.splice(i, 1);
                                                                                                 }else{
                                                                                                    item.activo = 0;
                                                                                                 }
                                                                                                 this.setState({data});
                                                                                            }} type="button" className="deleteFormCard"><i className="fas fa-trash-alt"></i></button>
                                                                                            <div className="form-group">
                                                                                                <div className="col-md-12">
                                                                                                    <label htmlFor="">Cargo en ese entonces</label>
                                                                                                    <Input divClass="input-group"
                                                                                                        inputName="nombre"
                                                                                                        inputType="text"
                                                                                                        inputClass="form-control"
                                                                                                        inputplaceholder="Escriba cargo"
                                                                                                        inputValue={x.cargo || ''}
                                                                                                        inputOnchange={e => {
                                                                                                            let data = this.state.data;
                                                                                                            let item = data.congresista_trayectoria_privada[i];
                                                                                                            item.cargo = e.currentTarget.value;
                                                                                                            this.setState({data});
                                                                                                        }}
                                                                                                        spanClass="error"
                                                                                                        spanError={ ''}
                                                                                                        divClassSpanType={1}
                                                                                                        divClassSpan="input-group-addon"
                                                                                                        divClassSpanI="fa fa-indent" />
                                                                                                </div>
                                                                                            </div>
                                                                                            <div className="form-group">
                                                                                                <div className="col-md-12">
                                                                                                    <label htmlFor="">Fecha de ocupación</label>
                                                                                                    <DatePicker
                                                                                                    id="dateFechaNacimiento"
                                                                                                    showInputTime={false}
                                                                                                    divClass="input-group"
                                                                                                    dateSelected={x.fecha || ''}
                                                                                                    onChangeDate={e => {
                                                                                                        let data = this.state.data;
                                                                                                        let item = data.congresista_trayectoria_privada[i];
                                                                                                        item.fecha = e;
                                                                                                        this.setState({data});
                                                                                                    }}
                                                                                                    spanClass="error"
                                                                                                    spanError={this.state.errors["dpFechaNacimiento"] || ''}
                                                                                                    divClassSpanType={1}
                                                                                                    divClassSpan="input-group-addon"
                                                                                                    divClassSpanI="fa fa-calendar"
                                                                                                        />
                                                                                                </div>
                                                                                            </div>
                                                                                            <div className="form-group">
                                                                                                <div className="col-md-12">
                                                                                                    <label htmlFor="" className="flexCheckbox">
                                                                                                        <input type="checkbox" onChange={(e)=>{
                                                                                                            let data = this.state.data;
                                                                                                            let item = data.congresista_trayectoria_privada[i];
                                                                                                            item.aplica = e.currentTarget.checked ? 1 : 0;
                                                                                                            this.setState({data});
                                                                                                        }} checked={x.aplica === 1 ? "checked" : ""} className="checkbox"/>
                                                                                                        ¿Aplica a partido?
                                                                                                    </label>
                                                                                                </div>
                                                                                            </div>
                                                                                            
                                                                                        </div>
                                                                                    )
                                                                                }
                                                                            })
                                                                        }
                                                                        <div className="formCard addMore" onClick={()=>{
                                                                            this.handlerAddElementToTrayectoriaPrivada();
                                                                        }}>
                                                                            <i className="fas fa-plus-circle"></i>
                                                                            <p>Agregar</p>
                                                                        </div>
                                                                    </div>
                                                                    <span className="error">
                                                                        {this.state.errors["trayectoriaPrivada"] || ""}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="panel-body">
                                        <div className="row">
                                            <h3>Curul</h3>
                                            <div className="col-md-12">
                                                <div className="linkCardsContainer">
                                                    <a href="#" onClick={()=>{this.getDataCuruls()}} data-toggle="modal" data-target="#select-curul" className="linkItem">
                                                        <div className="title"><h4>Curul</h4></div>
                                                        <div className="icon"><i className="fa fa-circle"></i></div>
                                                        <div className="description">
                                                            <p>Elija un curul para el congresista</p><br/>
                                                            <span className="error">{this.state.errors.curul_id || ''}</span>
                                                        </div>
                                                    </a>
                                                    {/* <a href="#" data-toggle="modal" data-target="#select-map" className="linkItem">
                                                        <div className="title"><h4>Localización</h4></div>
                                                        <div className="icon"><i className="fa fa-map"></i></div>
                                                        <div className="description">
                                                            <p>Elija una localización en el mapa</p><br/>
                                                            <span className="error">{''}</span>
                                                        </div>
                                                    </a> 
                                                </div>
                                            </div>
                                        </div>
                                    </div> */}
                                    <div className="panel-body">
                                        <div className="row">
                                            <div className="panel-footer">
                                            <ValidarPermiso
                                                IdModuloPermisoValidar={this.state.id === 0 ? ModuloPermiso.Secretario.Nuevo : ModuloPermiso.Secretario.Modificar}
                                                DefaultTemplate={
                                                    <button type="button" onClick={() => { this.saveSubmit() }} className="btn btn-success pull-right"><i className="fa fa-check"></i> Guardar</button>
                                                }
                                            />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </form>

                        </div>
                    </div>
                    <div className="modal footer-fixed" id="select-curul" tabIndex="-1" role="dialog" aria-labelledby="largeModalHead" aria-hidden="true">
                        <div className="modal-dialog modal-xl">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <button type="button" className="close" data-dismiss="modal">
                                        <span aria-hidden="true">&times;</span>
                                        <span className="sr-only">Cerrar</span>
                                    </button>
                                    <h4 className="modal-title" id="largeModalHead">
                                        <i className="fa fa-circle"></i>{" "}
                                        Seleccionar curul
                                    </h4>
                                </div>

                                <div className="modal-body no-padding no-scroll">
                                    <div className={`windowCuatrienio ${this.state.data.cuatrienio_id === 0 || this.state.data.corporacion_id === 0 ? "" : "none"}`}>
                                        <div className="boxAlert">
                                            <div className="icon"><i className="fas fa-exclamation-circle"></i></div>
                                            <div className="title">!Atención!</div>
                                            <div className="message"><p>Debe seleccionar un cuatrienio y un tipo de corporación</p></div>
                                        </div>
                                    </div>
                                    <form name="formCurul" className="form-horizontal">
                                        <div className="row">
                                            <div className="col-md-12">
                                                {/* <SelectCurul linkToClickCurul={"#/congresistas-editar"} data={this.state.curulData} curules={this.state.curulData} handlerCurulSelected={this.handlerCurulSelected} origen={auth.pathApi()} curulIdSelected={this.state.data.curul_id}/> */}
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

export default CrearSecretario;
