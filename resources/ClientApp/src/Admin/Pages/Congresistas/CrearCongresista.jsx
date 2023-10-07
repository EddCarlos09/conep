import React, { Component } from 'react';
import CongresistasDataService from "../../../Services/Catalogo/Congresistas.Service";
import UtilsDataService from "../../../Services/General/Utils.Service";
import 'react-dropzone-uploader/dist/styles.css'
import * as FileCfg from "../../../Utils/FileConfig";
import Dropzone from 'react-dropzone-uploader'
import BuscadorPersona from '../../../Components/BuscadorPersona';
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
import { Constantes, ResolutionNames } from "../../../Constants/Constantes.js"
import { ModuloPermiso } from "../../../Permisos/ModuloPermiso";
import ValidarPermiso from "../../../Permisos/ValidarPermiso";

const auth = new AuthLogin();
const constFileds = {
    id: 0,
    persona_id: 0,
    corporacion_id: 0,
    cuatrienio_id: 0,
    partido_id: 0,
    curul_id: 0,
    circunscripcion_id: 0,
    departamento_id_mayor_votacion: 0,
    urlHojaVida: "",
    hoja: "",
    investigaciones: [
        // {id: 0, congresista_id: 0, tipo_investigacion_id: 0, descripcion: 0, activo: 0 }
    ],
    cargo: {
        id: 0,
        cuatrienio_id: 0,
        corporacion_id: 0,
        congresista_id: 0,
        cargo_legislativo_id: 0,
        fecha_inicio: "",
        fecha_final: ""
    },
    reemplazo: {
        id: 0,
        persona_id_reemplazado: 0,
        persona_id_reemplaza: 0,
        partido_id: 0,
        fecha_inicio: "",
        fecha_fin: "",
    },
    user:''
}
const constErrors = {
    id: "",
    hoja: "",
    corporacion_id: "",
    circunscripcion_id: "",
    cargo_legislativo_id: "",
    departamento_id_mayor_votacion: "",
    cuatrienio_id: "",
    partido_id: "",
    curul_id: "",
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

let validForm = new ValidForm();


class CrearCongresista extends Component {
    constructor(props) {
        super(props);
        const id = this.props.match.params.id === undefined ? 0 : this.props.match.params.id;
        const idCuatrienio = this.props.match.params.idCuatrienio === undefined ? 0 : this.props.match.params.idCuatrienio;
        const idCorporacion = this.props.match.params.idCorporacion === undefined ? 0 : this.props.match.params.idCorporacion;
        this.tableHandler = this.tableHandler.bind(this);
        this.paginationPersonaReemplazo = this.paginationPersonaReemplazo.bind(this);
        validForm = new ValidForm();
        this.state = {
            id:id,
            idCuatrienio: idCuatrienio,
            idCorporacion: idCorporacion,
            loading: true,
            data: constFileds,
            errors: constErrors,
            url: '',
            buscadorPersona: {
                data: [],
                selected: {id: 0},
                imgOrigin: auth.pathApi(),
                search: "",
                page: 1,
                rows: 15,
                totalRows: 0
            },
            buscadorPersonaReemplazo: {
                data: [],
                selected: {id: 0},
                imgOrigin: auth.pathApi(),
                search: "",
                page: 1,
                rows: 15,
                totalRows: 0
            },
            datosContactoDetalle: [],
            imagesResized: [],
            filterPartido: {value: 0, label: "Seleccione partido"},
            filterCircunscripcion: {value: 0, label: "Seleccione circunscripción"},
            filterCargoLegislativo: {value: 0, label: "Seleccione cargo"},
            filterDepartamento: {value: 0, label: "Departamento de mayor votación"},
            dataSelectDepartamento: [],
            dataSelectPartido: [],
            dataSelectCircunscripcion: [],
            dataSelectTipoInvestigacion: [],
            dataSelectCargoLegislativo: [],
            curulData: [],
            curulSelected: {curul_id: 0},
            windowCuatrienio: false,
            dpFechaInicioCargo: new Date(),
            dpFechaFinCargo: null,
            dpFechaInicioReemplazo: null,
            dpFechaFinReemplazo: null,
            filterPartidoReemplazo: {value: 0, label: "Seleccione partido"}
        }
    }
    async paginationPersonaReemplazo(page, rows, search) {
        let buscadorPersonaReemplazo = this.state.buscadorPersonaReemplazo;
        buscadorPersonaReemplazo.page = page;
        buscadorPersonaReemplazo.rows = rows;
        buscadorPersonaReemplazo.search = search;
        this.setState({ buscadorPersonaReemplazo: buscadorPersonaReemplazo });
        if (this.timeout) clearTimeout(this.timeout);
        this.timeout = setTimeout(
            async function () {
                await this.getAllPersonasForReemplazo(  
                    1,
                    page,
                    rows,
                    search
                );
            }.bind(this),
            1000
        );
    }
    handlerChangeSearchForPersonaReemplazo = (value) =>{
        let buscadorPersonaReemplazo = this.state.buscadorPersonaReemplazo;
        buscadorPersonaReemplazo.search = value;
        this.setState({buscadorPersonaReemplazo})
    }
    handlerSelectPersonaReemplazo = (persona) =>{
        let buscadorPersonaReemplazo = this.state.buscadorPersonaReemplazo;
        buscadorPersonaReemplazo.selected = persona;
        this.setState({buscadorPersonaReemplazo})
    }

    async tableHandler(page, rows, search) {
        let buscadorPersona = this.state.buscadorPersona;
        buscadorPersona.page = page;
        buscadorPersona.rows = rows;
        buscadorPersona.search = search;
        this.setState({ buscadorPersona: buscadorPersona });
        if (this.timeout) clearTimeout(this.timeout);
        this.timeout = setTimeout(
            async function () {
                await this.getAllPersonas(  
                    1,
                    this.state.idCuatrienio,
                    page,
                    rows,
                    search
                );
            }.bind(this),
            1000
        );
    }
    handlerChangeSearchForPersona = (value) =>{
        let buscadorPersona = this.state.buscadorPersona;
        buscadorPersona.search = value;
        this.setState({buscadorPersona})
    }
    handlerSelectPersona = (persona) =>{
        let buscadorPersona = this.state.buscadorPersona;
        buscadorPersona.selected = persona;
        this.setState({buscadorPersona})
    }
    handlerAddElementToInvestigaciones = async () => {
        let data = this.state.data;
        data.investigaciones.push({id: 0, congresista_id: 0, tipo_investigacion_id: 0, descripcion: 0, tipoInvestigacionSelected: {value: 0, label: "Seleccione tipo de investigación"}, activo: 1 });
        this.setState({data})
    }
    handlerCargoLegislativo = async (cargoSelected) => {
        let data = this.state.data;
        data.cargo.cargo_legislativo_id = cargoSelected.value;
        this.setState({data, filterCargoLegislativo: cargoSelected})
    }

    handlerPartido = async (selectPartido) => {
        let data = this.state.data;
        data.partido_id = selectPartido.value;
        this.setState({data: data, filterPartido: selectPartido});
    }

    handlerPartidoReemplazo = async (selectPartido) => {
        let data = this.state.data;
        data.reemplazo.partido_id = selectPartido.value;
        this.setState({data: data, filterPartidoReemplazo: selectPartido});
    }
    
    handlerDepartamento = async (selectDepartamento) => {
        let data = this.state.data;
        data.departamento_id_mayor_votacion = selectDepartamento.value;
        this.setState({data: data, filterDepartamento: selectDepartamento});
    }

    handlerCircunscripcion = async (selectCircunscripcion) => {
        let data = this.state.data;
        data.circunscripcion_id = selectCircunscripcion.value;
        this.setState({data: data, filterCircunscripcion: selectCircunscripcion});
    }
   
    handleChangeStatus = ({ meta, file }, status) => {

        let fields = this.state.data;
        let errors = this.state.errors;
        fields.hoja = file;
        var sizefile = parseInt(file.size / 1024);
        errors = validForm.cleanErrors(errors);
        if (fields.hoja != null && fields.hoja != undefined) {
            if(sizefile > 500000){
                errors.hoja = "El tamaño del archivo no debe ser mayor a 50MB";
            }else{
                let fileext = FileCfg.GetInfoFile(file);
                let typesext = FileCfg.TypesAccepted([FileCfg.Documents]);
                if (typesext.indexOf(fileext) === -1) {
                    errors.hoja = "Selecciona un archivo válido";

                    this.setState({ errors: errors });
                    return false;
                }
                this.setState({ fields: fields });
            }

        } else {
            errors.hoja = "Seleccione un archivo";
        }

    }

    componentDidMount = async () =>{

        this.resetFields();
        let id= this.state.id;

        if (id !== 0)
            await this.getByID(id);
        await this.getAllPersonas(1, this.state.idCuatrienio, this.state.buscadorPersona.page, this.state.buscadorPersona.rows, this.state.buscadorPersona.search);
        await this.getComboPartido();
        await this.getComboCircunscripcion(this.state.data.circunscripcion_id);
        await this.getComboTipoInvestigacion();
        await this.getComboCargoLegislativo();
        await this.getComboDepartamento();
    }
    getAllPersonas = async (idFilterActive, cuatrienio, page, rows, search) => {
        this.setState({ loading: true });
        let tableInfo = this.state.buscadorPersona;
        await CongresistasDataService.getAllPersonasNoCongresistas(
            idFilterActive,
            cuatrienio,
            search,
            page,
            rows
        ).then((response) => {
            tableInfo.data = response.data;
        })
        .catch((e) => {
            console.log(e);
        });

        await CongresistasDataService.totalrecordsPersonasNoCongresistas(idFilterActive, cuatrienio, search)
            .then((response) => {
                tableInfo.totalRows = response.data;
            })
            .catch((e) => {
                console.log(e);
            });
        this.setState({
            buscadorPersona: tableInfo,
            loading: false
        });
    };
    getAllPersonasForReemplazo = async (idFilterActive, page, rows, search) => {
        this.setState({ loading: true });
        let tableInfo = this.state.buscadorPersonaReemplazo;
        await CongresistasDataService.getComboPersonas(
            idFilterActive,
            search,
            page,
            rows
        ).then((response) => {
            tableInfo.data = response.data;
        })
        .catch((e) => {
            console.log(e);
        });

        await CongresistasDataService.totalrecordsComboPersonas(idFilterActive, search)
            .then((response) => {
                tableInfo.totalRows = response.data;
            })
            .catch((e) => {
                console.log(e);
            });
        this.setState({
            buscadorPersonaReemplazo: tableInfo,
            loading: false
        });
    };
    fillCombosTipoInvestigacion = async (tipos) => {
        let data = this.state.data;
        let investigaciones = data.investigaciones;
        investigaciones.forEach(x => {
            let tipoInvestigacionSelected = tipos.filter((p)=>{return p.value === x.tipo_investigacion_id})[0];
            Object.assign(x, {tipoInvestigacionSelected: tipoInvestigacionSelected});
        })
        this.setState({data})
    }
    
    getComboCircunscripcion = async (idCircunscripcion) => {
        await CongresistasDataService.getComboCircunscripcion().then(response => {
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
   
    getComboPartido = async () => {
        await CongresistasDataService.getComboPartido().then(response => {
            let combo = [];
            let selected = { value: 0, label: "Seleccione partido" };
            let selectedPartidoReemplazo = { value: 0, label: "Seleccione partido" };
            response.data.forEach(i => {
                combo.push({ value: i.id, label: i.nombre })
                if(this.state.id !== 0){
                    let idd = this.state.data.partido_id;
                    if(idd === i.id)
                        selected = { value: i.id, label: i.nombre };
                }
                if(this.state.data.reemplazo.id !== 0){
                    let idd = this.state.data.reemplazo.partido_id;
                    if(idd === i.id)
                        selectedPartidoReemplazo = {value: i.id, label: i.nombre}
                }
            })
            combo.unshift({ value: 0, label: "Seleccione partido" })
            this.setState({
                dataSelectPartido: combo,
                filterPartido: selected,
                filterPartidoReemplazo: selectedPartidoReemplazo
            })
        })
    }
    getComboDepartamento = async () => {
        await CongresistasDataService.getComboDepartamento().then(response => {
            let combo = [];
            let selected = { value: 0, label: "Departamento de mayor votación" };
            response.data.forEach(i => {
                combo.push({ value: i.id, label: i.nombre })
                if(this.state.id !== 0){
                    let idd = this.state.data.departamento_id_mayor_votacion;
                    if(idd === i.id)
                        selected = { value: i.id, label: i.nombre };
                }
            })
            combo.unshift({ value: 0, label: "Departamento de mayor votación" })
            this.setState({
                dataSelectDepartamento: combo,
                filterDepartamento: selected
            })
            
        })
    }
    getComboTipoInvestigacion = async () => {
        await CongresistasDataService.getComboTipoInvestigacion().then(response => {
            let combo = [];
            let selected = { value: 0, label: "Seleccione tipo de investigación" };
            response.data.forEach(i => {
                combo.push({ value: i.id, label: i.nombre })
            })
            combo.unshift(selected)
            this.setState({
                dataSelectTipoInvestigacion: combo
            })

            if(this.state.id !== 0){
                this.fillCombosTipoInvestigacion(combo);
            }
        })
    }
    getComboCargoLegislativo = async () => {
        await CongresistasDataService.getComboCargoLegislativo().then(response => {
            let combo = [];
            let selected = { value: 0, label: "Seleccione cargo legislativo" };
            response.data.forEach(i => {
                combo.push({ value: i.id, label: i.nombre })
                let idd = this.state.data.cargo !== null ? this.state.data.cargo.cargo_legislativo_id : 0;
                if(idd === i.id)
                    selected = { value: i.id, label: i.nombre };
            })
            combo.unshift({ value: 0, label: "Seleccione cargo legislativo" })
            this.setState({
                filterCargoLegislativo: selected,
                dataSelectCargoLegislativo: combo
            })
        })
    }
    
    getByID = async (id) => {
        this.setState({ loading: true });
        await CongresistasDataService.get(id)
            .then(response => {
                let state = this.state;
                let errors = this.state.errors;
                state.data = response.data[0];
                Object.assign(state.data, { user: auth.username() });
                state.data.investigaciones = response.data[0].investigaciones === null ? constFileds.investigaciones : response.data[0].investigaciones;
                state.buscadorPersona.selected = response.data[0].persona;
                state.buscadorPersonaReemplazo.selected = response.data[0].reemplazo !== null ? response.data[0].reemplazo.persona : {id: 0};
                state.curulSelected.id = response.data[0].curul_id;
                if(response.data[0].cargo === null){
                    response.data[0].cargo = {
                        id: 0,
                        cuatrienio_id: 0,
                        corporacion_id: 0,
                        congresista_id: 0,
                        cargo_legislativo_id: 0,
                        fecha_inicio: "",
                        fecha_final: ""
                    };
                }else{
                    state.dpFechaInicioCargo = response.data[0].cargo.fecha_inicio === null ? new Date() : response.data[0].cargo.fecha_inicio;
                    state.dpFechaFinCargo = response.data[0].cargo.fecha_final === null ? null : response.data[0].cargo.fecha_final;
                }
                if(response.data[0].reemplazo === null){
                    response.data[0].reemplazo = {
                        id: 0,
                        persona_id_reemplazado: 0,
                        persona_id_reemplaza: 0,
                        partido_id: 0,
                        fecha_inicio: "",
                        fecha_fin: "",
                    };
                }else{
                    state.dpFechaInicioReemplazo = response.data[0].reemplazo.fecha_inicio === null ? new Date() : response.data[0].reemplazo.fecha_inicio;
                    state.dpFechaFinReemplazo = response.data[0].reemplazo.fecha_fin === null ? null : response.data[0].reemplazo.fecha_fin;
                }
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

   
    // Métodos asíncronos

    saveSubmit = async () => {
        let errors = this.state.errors;
        errors = validForm.cleanErrors(errors);
        this.setState({ errors: errors, loading: true });
        let data = this.state.data;
        data.persona_id = this.state.buscadorPersona.selected.id;
        data.corporacion_id = this.state.idCorporacion;
        data.cuatrienio_id = this.state.idCuatrienio;
        data.cargo.corporacion_id = this.state.idCorporacion;
        data.cargo.cuatrienio_id = this.state.idCuatrienio;
        data.user = auth.username();
        data.curul_id = this.state.curulSelected.id;
        data.cargo.fecha_inicio = FechaMysql.DateFormatMySql(this.state.dpFechaInicioCargo);
        data.cargo.fecha_final = FechaMysql.DateFormatMySql(this.state.dpFechaFinCargo);
        data.reemplazo.fecha_inicio = FechaMysql.DateFormatMySql(this.state.dpFechaInicioReemplazo);
        data.reemplazo.fecha_fin = FechaMysql.DateFormatMySql(this.state.dpFechaFinReemplazo);
        data.reemplazo.persona_id_reemplaza = this.state.buscadorPersonaReemplazo.selected.id;
        let responseData;

        if(data.id===0)
        {
            await CongresistasDataService.create(data)
                .then(response => {
                    responseData = response.data;
                    this.props.history.push({
                        pathname: `/congresistas-por-cuatrienio/cuatrienio-${this.state.idCuatrienio}/corporacion-${this.state.idCorporacion}`
                    });
                })
                .catch(function (error) {
                    errors = validForm.displayErrors(error.response.data, errors);
                });
        }
        else
        {
            await CongresistasDataService.update(data.id, data)
                .then(response => {
                    responseData = response.data;
                    this.props.history.push({
                        pathname: `/congresistas-por-cuatrienio/cuatrienio-${this.state.idCuatrienio}/corporacion-${this.state.idCorporacion}`
                    });
                })
                .catch(function (error) {
                    errors = validForm.displayErrors(error.response.data, errors);
                });
        }
    }

    getDataCuruls = async () => {
        let cuatrienio = this.state.idCuatrienio;
        let corporacion = this.state.idCorporacion;
        if(cuatrienio !== 0 && corporacion !== 0){
            this.setState({loading: true, windowCuatrienio: false})
            let curulData = [];
            await CongresistasDataService.getCurules(cuatrienio, corporacion).then(response => {
                curulData = response.data;
            })
            this.setState({loading: false, curulData: curulData})
        }
        else{
            this.setState({windowCuatrienio: true})
        }
    }
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
                    <li>Nuevo congresista</li>
                </ul>
                <div className="page-content-wrap">
                    <div className="row">
                        <div className="col-md-12">

                            <form className="form-horizontal">
                                <div className="panel panel-default">
                                    <div className="panel-heading">
                                        <h3 className="panel-title"><strong><i className="fa fa-user"></i> {this.state.data["id"] === 0 ? "Nuevo" : "Editar"} congresista</strong></h3>
                                    </div>
                                    <div className="panel-body">
                                        <div className="row">
                                            <h3>Información general</h3>
                                            <div className="col-md-9">
                                                <div className="form-group">
                                                    <label className="col-md-3 control-label">Persona</label>
                                                    <div className="col-md-9">
                                                        <BuscadorPersona handler={this.tableHandler} handlerChangeSearch={this.handlerChangeSearchForPersona} handlerSelectPersona={this.handlerSelectPersona} data={this.state.buscadorPersona.data} imgDefault={Constantes.NoImagen} imgOrigin={this.state.buscadorPersona.imgOrigin} pageExtends={this.state.buscadorPersona.page} pageSize={this.state.buscadorPersona.rows} totalRows={this.state.buscadorPersona.totalRows} search={this.state.buscadorPersona.search} selected={this.state.buscadorPersona.selected} />
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
                                                </div>
                                                <div className="form-group">
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
                                                </div>
                                                <div className="form-group">
                                                    <label className="col-md-3 control-label">Departamento de mayor votación</label>
                                                    <div className="col-md-9">
                                                        <div className="input-group">
                                                            <Select
                                                                divClass=""
                                                                selectplaceholder="Seleccione"
                                                                selectValue={this.state.filterDepartamento}
                                                                selectIsSearchable={true}
                                                                selectoptions={this.state.dataSelectDepartamento}
                                                                selectOnchange={this.handlerDepartamento}
                                                                selectclassNamePrefix="selectReact__value-container"
                                                                spanClass="error"
                                                                spanError={this.state.errors.departamento_id_mayor_votacion || ''} >
                                                            </Select>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <label className="col-md-3 control-label">Cargo legislativo</label>
                                                    <div className="col-md-9">
                                                        <div className="input-group">
                                                            <Select
                                                                divClass=""
                                                                selectplaceholder="Seleccione"
                                                                selectValue={this.state.filterCargoLegislativo}
                                                                selectIsSearchable={false}
                                                                selectoptions={this.state.dataSelectCargoLegislativo}
                                                                selectOnchange={this.handlerCargoLegislativo}
                                                                selectclassNamePrefix="selectReact__value-container"
                                                                spanClass="error"
                                                                spanError={this.state.errors.cargo_legislativo_id || ''} >
                                                            </Select>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <label className="col-md-3 control-label">Fecha de inicio del cargo</label>
                                                    <div className="col-md-9">
                                                        <div className="input-group">
                                                            <DatePicker
                                                                id="dateFecha"
                                                                showInputTime={false}
                                                                divClass="input-group"
                                                                dateSelected={this.state.dpFechaInicioCargo || ''}
                                                                onChangeDate={e => {
                                                                    let fields = this.state;
                                                                    let errors = this.state.errors;
                                                                    fields = validForm.handleChangeDateField("dpFechaInicioCargo", fields, e);
                                                                    errors = validForm.handleChangeErrors("dpFechaInicioCargo", errors, e);
                                                                    this.setState({ fields: fields, errors: errors });
                                                                }}
                                                                spanClass="error"
                                                                spanError={this.state.errors["dpFechaInicioCargo"] || ''}
                                                                divClassSpanType={1}
                                                                divClassSpan="input-group-addon"
                                                                divClassSpanI="fa fa-calendar"
                                                                    />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <label className="col-md-3 control-label">Fecha de finalización del cargo</label>
                                                    <div className="col-md-9">
                                                        <div className="input-group">
                                                            <DatePicker
                                                                id="dateFecha"
                                                                showInputTime={false}
                                                                divClass="input-group"
                                                                dateSelected={this.state.dpFechaFinCargo || null}
                                                                onChangeDate={e => {
                                                                    let fields = this.state;
                                                                    let errors = this.state.errors;
                                                                    fields = validForm.handleChangeDateField("dpFechaFinCargo", fields, e);
                                                                    errors = validForm.handleChangeErrors("dpFechaFinCargo", errors, e);
                                                                    this.setState({ fields: fields, errors: errors });
                                                                }}
                                                                spanClass="error"
                                                                spanError={this.state.errors["dpFechaFinCargo"] || ''}
                                                                divClassSpanType={1}
                                                                divClassSpan="input-group-addon"
                                                                divClassSpanI="fa fa-calendar"
                                                                    />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className={`form-group`}>
                                                    <label className="col-md-3 control-label">Hoja de vida</label>
                                                    <div className="col-md-9 ">
                                                        <Dropzone
                                                            maxFiles={1}
                                                            multiple={false}
                                                            inputContent="Selecciona un documento"
                                                            onChangeStatus={this.handleChangeStatus.bind(this)}
                                                            accept=".pdf, .doc, .docx"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <hr />
                                        </div>
                                    </div>
                                    <div className="panel-body">
                                        <div className="row">
                                            <h3>Reemplazo</h3>
                                            <div className="col-md-9">
                                                <div className="form-group">
                                                    <label className="col-md-3 control-label">Reemplazado por:</label>
                                                    <div className="col-md-9">
                                                        <div className="input-group">
                                                            {
                                                                this.state.buscadorPersonaReemplazo.selected.id !== 0 ?
                                                                <div className="reemplazoItem">
                                                                    <div className="photo">
                                                                        <img src={typeof this.state.buscadorPersonaReemplazo.selected.imagenes[1] !== "undefined" ? this.state.buscadorPersonaReemplazo.imgOrigin + this.state.buscadorPersonaReemplazo.selected.imagenes[1].imagen : Constantes.NoImagen || ""} />
                                                                    </div>
                                                                    <div className="name">{this.state.buscadorPersonaReemplazo.selected.nombres} {this.state.buscadorPersonaReemplazo.selected.apellidos}</div>
                                                                    <a target="_blank" href={`#/persona-editar/${this.state.buscadorPersonaReemplazo.selected.id}`} className="btn btn-info seeProfile"><i className="fas fa-external-link-alt"></i> Ver perfil</a>
                                                                </div> :
                                                                <div className="reemplazoItem">
                                                                    <div className="name">No hay reemplazo seleccionado</div>
                                                                </div>

                                                            }
                                                            <br/>
                                                            <a href="#" onClick={()=>{this.getAllPersonasForReemplazo(1, this.state.buscadorPersonaReemplazo.page, this.state.buscadorPersonaReemplazo.rows, this.state.buscadorPersonaReemplazo.search)}} data-toggle="modal" className="btn btn-primary" data-target="#select-reemplazo">Buscar reemplazo</a>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <label className="col-md-3 control-label">Fecha de inicio del reemplazo</label>
                                                    <div className="col-md-9">
                                                        <div className="input-group">
                                                            <DatePicker
                                                                id="dateFecha"
                                                                showInputTime={false}
                                                                divClass="input-group"
                                                                dateSelected={this.state.dpFechaInicioReemplazo || null}
                                                                onChangeDate={e => {
                                                                    let fields = this.state;
                                                                    let errors = this.state.errors;
                                                                    fields = validForm.handleChangeDateField("dpFechaInicioReemplazo", fields, e);
                                                                    errors = validForm.handleChangeErrors("dpFechaInicioReemplazo", errors, e);
                                                                    this.setState({ fields: fields, errors: errors });
                                                                }}
                                                                spanClass="error"
                                                                divClassSpanType={1}
                                                                divClassSpan="input-group-addon"
                                                                divClassSpanI="fa fa-calendar"
                                                                    />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <label className="col-md-3 control-label">Fecha de finalización del reemplazo</label>
                                                    <div className="col-md-9">
                                                        <div className="input-group">
                                                            <DatePicker
                                                                id="dateFecha"
                                                                showInputTime={false}
                                                                divClass="input-group"
                                                                dateSelected={this.state.dpFechaFinReemplazo || null}
                                                                onChangeDate={e => {
                                                                    let fields = this.state;
                                                                    let errors = this.state.errors;
                                                                    fields = validForm.handleChangeDateField("dpFechaFinReemplazo", fields, e);
                                                                    errors = validForm.handleChangeErrors("dpFechaFinReemplazo", errors, e);
                                                                    this.setState({ fields: fields, errors: errors });
                                                                }}
                                                                spanClass="error"
                                                                divClassSpanType={1}
                                                                divClassSpan="input-group-addon"
                                                                divClassSpanI="fa fa-calendar"
                                                                    />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <label className="col-md-3 control-label">Partido del reemplazo</label>
                                                    <div className="col-md-9">
                                                        <div className="input-group">
                                                            <Select
                                                                divClass=""
                                                                selectplaceholder="Seleccione"
                                                                selectValue={this.state.filterPartidoReemplazo}
                                                                selectIsSearchable={false}
                                                                selectoptions={this.state.dataSelectPartido}
                                                                selectOnchange={this.handlerPartidoReemplazo}
                                                                selectclassNamePrefix="selectReact__value-container"
                                                                spanClass="error" >
                                                            </Select>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="panel-body">
                                        <div className="row">
                                            <h3>Investigaciones</h3>
                                            <div className="col-md-12">
                                                <div className="form-group">
                                                    <div className="col-md-12">
                                                        {/* <label htmlFor="">Agregue investigaciones al congresista</label> */}
                                                        <hr/>
                                                        <div className="formCardsContainer two-columns">
                                                            {
                                                                !this.state.loading && typeof this.state.data.investigaciones !== "undefined" ?
                                                                this.state.data.investigaciones.map((x, i) => {
                                                                    if(x.activo === 1){
                                                                        return (
                                                                            <div className="formCard">
                                                                                <button onClick={()=>{
                                                                                    let data = this.state.data;
                                                                                    let item = data.investigaciones[i];
                                                                                    if(item.id === 0){
                                                                                        data.investigaciones.splice(i, 1);
                                                                                    }else{
                                                                                    item.activo = 0;
                                                                                    }
                                                                                    this.setState({data});
                                                                                }} type="button" className="deleteFormCard"><i className="fas fa-trash-alt"></i></button>
                                                                                <div className="form-group">
                                                                                    <div className="col-md-12">
                                                                                        <label htmlFor="">Tipo de investigación</label>
                                                                                        <Select
                                                                                            divClass=""
                                                                                            selectplaceholder="Seleccione"
                                                                                            selectValue={x.tipoInvestigacionSelected}
                                                                                            selectIsSearchable={false}
                                                                                            selectoptions={this.state.dataSelectTipoInvestigacion}
                                                                                            selectOnchange={(selected)=>{
                                                                                                let data = this.state.data;
                                                                                                let item = data.investigaciones[i];
                                                                                                item.tipo_investigacion_id = selected.value;
                                                                                                item.tipoInvestigacionSelected = selected;
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
                                                                                        <label htmlFor="">Descripción</label>
                                                                                        <SunEditor
                                                                                            placeholder="..."
                                                                                            setContents={ x.descripcion || "" }
                                                                                            onChange={(e) => {

                                                                                                let data = this.state.data;
                                                                                                let item = data.investigaciones[i];
                                                                                                item.descripcion = e;
                                                                                                this.setState({data});
                                                                                            }}
                                                                                            lang="es"
                                                                                            setOptions={{
                                                                                                buttonList: buttonList,
                                                                                                height: 400,
                                                                                            }}
                                                                                        />
                                                                                    </div>
                                                                                </div>

                                                                            </div>
                                                                        )
                                                                    }
                                                                })
                                                                : ""
                                                            }
                                                            <div className="formCard addMore" onClick={()=>{
                                                                this.handlerAddElementToInvestigaciones();
                                                            }}>
                                                                <i className="fas fa-plus-circle"></i>
                                                                <p>Agregar</p>
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
                                                    </a> */}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="panel-body">
                                        <div className="row">
                                            <div className="panel-footer">
                                                <ValidarPermiso IdModuloPermisoValidar={this.state.id !== 0 ? ModuloPermiso.Congresistas.Modificar : ModuloPermiso.Congresistas.Nuevo} DefaultTemplate={
                                                    <button type="button" onClick={() => { this.saveSubmit() }} className="btn btn-success pull-right"><i className="fa fa-check"></i> Guardar</button>
                                                } />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </form>

                        </div>
                    </div>
                    <div className="modal footer-fixed" id="select-reemplazo" tabIndex="-1" role="dialog" aria-labelledby="largeModalHead" aria-hidden="true">
                        <div className="modal-dialog modal-lg">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <button type="button" className="close" data-dismiss="modal">
                                        <span aria-hidden="true">&times;</span>
                                        <span className="sr-only">Cerrar</span>
                                    </button>
                                    <h4 className="modal-title" id="largeModalHead">
                                        <i className="fa fa-user"></i>{" "}
                                        Seleccionar reemplazo
                                    </h4>
                                </div>
                                <div className="modal-body">
                                    <BuscadorPersona handler={this.paginationPersonaReemplazo} handlerChangeSearch={this.handlerChangeSearchForPersonaReemplazo} handlerSelectPersona={this.handlerSelectPersonaReemplazo} data={this.state.buscadorPersonaReemplazo.data} imgDefault={Constantes.NoImagen} imgOrigin={this.state.buscadorPersonaReemplazo.imgOrigin} pageExtends={this.state.buscadorPersonaReemplazo.page} pageSize={this.state.buscadorPersonaReemplazo.rows} totalRows={this.state.buscadorPersonaReemplazo.totalRows} search={this.state.buscadorPersonaReemplazo.search} selected={this.state.buscadorPersonaReemplazo.selected} />
                                </div>
                                <div className="modal-footer">
                                    <div className="row">
                                        <div className="col-md-12">
                                            <button type="button" className="btn btn-default pull-left" data-dismiss="modal">Cerrar</button>
                                            {/* <button className="btn btn-primary pull-right" data-dismiss="modal"><i className="fa fa-check"></i> Aceptar</button> */}
                                        </div>
                                    </div>
                                </div>
                            </div>
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

                                <div className="modal-body no-padding no-scroll" style={{minHeight: "80vh"}}>
                                    <div className={`windowCuatrienio ${this.state.idCuatrienio === 0 || this.state.idCorporacion === 0 ? "" : "none"}`}>
                                        <div className="boxAlert">
                                            <div className="icon"><i className="fas fa-exclamation-circle"></i></div>
                                            <div className="title">!Atención!</div>
                                            <div className="message"><p>Debe seleccionar un quinquenio y un tipo de corporación</p></div>
                                        </div>
                                    </div>
                                    <form name="formCurul" className="form-horizontal">
                                        <div className="row">
                                            <div className="col-md-12">
                                                <SelectCurul corporacion={this.state.idCorporacion} linkToClickCurul={"#"} data={this.state.curulData} curules={this.state.curulData} handlerCurulSelected={this.handlerCurulSelected} origen={auth.pathApi()} curulIdSelected={this.state.data.curul_id}/>
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

export default CrearCongresista;
