import React, { Component } from 'react';
import VotacionesDataService from "../../../Services/Catalogo/Votaciones.Service";
import DatePicker from '../../../Components/DatePicker';
import Spinner from '../../../Components/Spinner';
import Select from '../../../Components/Select';
import 'react-dropzone-uploader/dist/styles.css';
import Dropzone from 'react-dropzone-uploader';
import AccordionCheckbox from '../../../Components/AccordionCheckbox';
import ValidForm from "../../../Utils/ValidForm";
import Input from "../../../Components/Input";
import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css"; // Import Sun Editor's CSS File
import * as FechaMysql from "../../../Utils/FormatDate";
import AuthLogin from "../../../Utils/AuthLogin";
import * as FileCfg from "../../../Utils/FileConfig";
import { ModuloPermiso } from "../../../Permisos/ModuloPermiso";
import ValidarPermiso from "../../../Permisos/ValidarPermiso";
import StateManager from 'react-select';

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

const auth = new AuthLogin();
let validForm = new ValidForm();
const constFileds = {
    id: 0,
    fecha: "",
    legislatura_id: 0,
    cuatrienio_id: 0,
    proyecto_de_ley_id: 0,
    esPlenaria: false,
    esComision: false,
    urlGaceta: "",
    gaceta: "",
    motivo: "",
    tipo_votacion_id: 0,
    votosFavor: 0, // i
    votosContra: 0, // i
    acta: "",
    observaciones: "",
    aprobada: 0, // i
    votosAbstencion: 0, // i
    numero_no_asistencias: 0, // i
    clase_votacion_id: 0,
    numero_asistencias: 0, // i
    voto_general: true,
    votacion_estado: {
        id: 0,
        votacion_id: 0,
        proyecto_ley_estado_id: 0
    },
    votacion_plenaria: {
        id: 0,
        votacion_id: 0,
        corporacion_id: 0
    },
    votacion_comision: {
        id: 0,
        votacion_id: 0,
        corporacion_id: 0,
        tipo_comision_id: 0,
        comision_id: 0
    },
    user: ''
}
const constErrors = {
    dpFecha: "",
    gaceta: "",
    legislatura_id: "",
    cuatrienio_id: "",
    proyecto_de_ley_id: "",
    esPlenaria: "",
    esComision: "",
    corporacion_id: "",
    tipo_comision_id: "",
    comision_id: "",
    motivo: "",
    tipo_votacion_id: "",
    clase_votacion_id: "",
    observaciones: "",
    votosFavor: "",
    votosContra: "",
    aprobada: "",
    votosAbstencion: "",
    estado_proyecto_ley_id: "",
    acta: "",
    user: ''
}

const defaultTipoComision = { value: 0, label: "Seleccione tipo de comisión" };
const defaultComision = { value: 0, label: "Seleccione comisión" };
const defaultProyectoDeLey = { value: 0, label: "Seleccione proyecto de ley" };
const defaultLegislatura = { value: 0, label: "Seleccione legislatura" };
class CrearCongresista extends Component {
    constructor(props) {
        super(props);
        const id = this.props.match.params.id === undefined ? 0 : this.props.match.params.id;
        this.state = {
            id: id,
            loading: true,
            data: constFileds,
            errors: constErrors,
            filterLegislatura: { value: 0, label: "Seleccione legislatura" },
            filterCuatrienio: { value: 0, label: "Seleccione quinquenio" },
            filterCorporacion: { value: 0, label: "Seleccione tipo de corporación" },
            filterCorporacionPlenaria: { value: 0, label: "Seleccione tipo de corporación" },
            filterTipoComision: { value: 0, label: "Seleccione tipo de comisión" },
            filterComision: { value: 0, label: "Seleccione comisión" },
            filterProyectoLey: { value: 0, label: "Seleccione proyecto de ley" },
            filterTipoVotacion: { value: 0, label: "Seleccione tipo de votación" },
            filterClaseVotacion: { value: 0, label: "Seleccione clase de votación" },
            filterEstadoProyectoLey: {value: 0, label: "Seleccione estado de proyecto de ley"},
            dataSelectEstadoProyectoLey: [],
            dataSelectTipoVotacion: [],
            dataSelectClaseVotacion: [],
            dataSelectLegislatura: [],
            dataSelectCuatrienio: [],
            dataSelectCorporacion: [],
            dataSelectCorporacionPlenaria: [],
            dataSelectTipoComisiones: [],
            dataSelectComisiones: [],
            dataSelectProyectoLey: [],
            textObservaciones: "",
            dpFecha: new Date()
        }
    }

    // Handlers
    handlerFilterEstadoProyectoLey = async (estado) => {
        let data = this.state.data;
        data.votacion_estado.proyecto_ley_estado_id = estado.value;
        this.setState({ data: data, filterEstadoProyectoLey: estado});
    }
    handlerFilterTipoVotacion = async (tipoVotacion) => {
        let data = this.state.data;
        data.tipo_votacion_id = tipoVotacion.value;
        this.setState({ data: data, filterTipoVotacion: tipoVotacion });
    }
    handlerFilterClaseVotacion = async (claseVotacion) => {
        let data = this.state.data;
        data.clase_votacion_id = claseVotacion.value;
        this.setState({ data: data, filterClaseVotacion: claseVotacion });
    }
    handlerFilterLegislatura = async (legislaturaSelected) => {
        let data = this.state.data;
        data.legislatura_id = legislaturaSelected.value;
        data.proyecto_de_ley_id = 0;
        this.setState({ data: data, filterLegislatura: legislaturaSelected, filterProyectoLey: defaultProyectoDeLey, dataSelectProyectoLey: [] });
        if (legislaturaSelected.value !== 0 && this.state.filterCuatrienio.value !== 0)
            await this.getComboProyectosDeLey(legislaturaSelected.value, this.state.filterCuatrienio.value);
    }
    handlerFilterCuatrienio = async (cuatrienioSelected) => {
        let data = this.state.data;
        data.cuatrienio_id = cuatrienioSelected.value;
        data.proyecto_de_ley_id = 0;
        this.setState({ data: data, filterCuatrienio: cuatrienioSelected, filterProyectoLey: defaultProyectoDeLey, dataSelectProyectoLey: [], filterLegislatura: defaultLegislatura });
        await this.getComboLegislatura(cuatrienioSelected.value);
        if (cuatrienioSelected.value !== 0 && this.state.filterLegislatura.value !== 0)
            await this.getComboProyectosDeLey(this.state.filterLegislatura.value, cuatrienioSelected.value);
    }
    handlerFilterProyectoLey = async (proyectoSelected) => {
        let data = this.state.data;
        data.proyecto_de_ley_id = proyectoSelected.value;
        this.setState({ data: data, filterProyectoLey: proyectoSelected, filterEstadoProyectoLey: {value: 0, label: "Seleccione estado de proyecto de ley"} });
        await this.getComboEstadoByProyectoId(proyectoSelected.value);
    }
    handlerFilterCorporacion = async (corporacionSelected) => {
        let state = this.state;
        state.data.votacion_comision.corporacion_id = corporacionSelected.value;
        state.data.votacion_plenaria.corporacion_id = corporacionSelected.value;
        state.data.votacion_comision.tipo_comision_id = 0;
        state.data.votacion_comision.comision_id = 0;
        state.filterCorporacion = corporacionSelected;
        state.filterTipoComision = defaultTipoComision;
        state.filterComision = defaultComision;
        state.dataSelectTipoComisiones = [];
        state.dataSelectComisiones = [];
        await this.getComboTipoComision(corporacionSelected.value)
        this.setState({ state });
    }
    handlerFilterCorporacionPlenaria = (corporacionSelected) => {
        let state = this.state;
        state.data.votacion_plenaria.corporacion_id = corporacionSelected.value;
        state.filterCorporacionPlenaria = corporacionSelected;
        this.setState({ state });
    }
    handlerFilterTipoComision = async (tipoComisionSelected) => {
        let state = this.state;
        state.data.votacion_comision.tipo_comision_id = tipoComisionSelected.value;
        state.data.votacion_comision.comision_id = 0;
        state.filterTipoComision = tipoComisionSelected;
        state.filterComision = defaultComision;
        state.dataSelectComisiones = [];
        await this.getComboComisiones(tipoComisionSelected.value)
        this.setState({ state });
    }
    handlerFilterComision = (comisionSelected) => {
        let data = this.state.data;
        data.votacion_comision.comision_id = comisionSelected.value;
        this.setState({ data: data, filterComision: comisionSelected });
    }
    handlerCheckboxPlenaria = (value) => {
        let data = this.state.data;
        data.esPlenaria = value;
        data.esComision = false;
        this.setState({ data });
    }
    handlerCheckboxComision = (value) => {
        let data = this.state.data;
        data.esComision = value;
        data.esPlenaria = false;
        this.setState({ data });
    }
    handlerCheckboxVotoGeneral = (value) => {
        let data = this.state.data;
        data.voto_general = value;
        this.setState({ data });
    }

    handleChangeStatus = ({ meta, file }, status) => {

        let fields = this.state.data;
        let errors = this.state.errors;
        fields.gaceta = file;
        var sizefile = parseInt(file.size / 1024);
        errors = validForm.cleanErrors(errors);
        if (fields.gaceta != null && fields.gaceta != undefined) {
            if (sizefile > 500000) {
                errors.gaceta = "El tamaño del archivo no debe ser mayor a 50MB";
            } else {
                let fileext = FileCfg.GetInfoFile(file);
                let typesext = FileCfg.TypesAccepted([FileCfg.Documents]);
                if (typesext.indexOf(fileext) === -1) {
                    errors.gaceta = "Selecciona un archivo válido";

                    this.setState({ errors: errors });
                    return false;
                }
                this.setState({ fields: fields });
            }

        } else {
            errors.gaceta = "Seleccione un archivo";
        }

    }

    async componentDidMount() {
        this.resetFields();
        let id = this.state.id;
        if (id != 0)
            await this.getByID(id);
        await this.getComboTipoVotacion();
        await this.getComboClaseVotacion();
        await this.getComboCorporacion();
        await this.getComboCuatrienio();
        await this.getComboEstadoByProyectoId(this.state.data.proyecto_de_ley_id === null ? 0 : this.state.data.proyecto_de_ley_id);
    }

    // Methods

    getByID = async (id) => {
        this.setState({ loading: true });
        await VotacionesDataService.get(id)
            .then(async (response) => {
                let state = this.state;
                state.data = response.data[0];
                Object.assign(state.data, { user: auth.username() });
                state.dpFecha = state.data.fecha;
                state.textObservaciones = state.data.observaciones;
                state.loading = false;
                if (state.data.votacion_comision === null) {
                    state.data.votacion_comision = {
                        id: 0,
                        votacion_id: state.data.id,
                        corporacion_id: 0,
                        tipo_comision_id: 0,
                        comision_id: 0
                    };
                }

                if (state.data.votacion_plenaria === null) {
                    state.data.votacion_plenaria = {
                        id: 0,
                        votacion_id: 0,
                        corporacion_id: 0
                    };
                }
                this.setState({
                    state
                });
                await this.getComboLegislatura(state.data.cuatrienio_id);
                await this.getComboProyectosDeLey(state.data.legislatura_id, state.data.cuatrienio_id);
            })
            .catch((e) => {
                this.setState({
                    loading: false,
                });
                console.log(e);
            });
        await this.getComboTipoComision(this.state.data.votacion_comision.corporacion_id)
        await this.getComboComisiones(this.state.data.votacion_comision.tipo_comision_id)
    };
    getComboTipoVotacion = async () => {
        await VotacionesDataService.getComboTipoVotacion().then(response => {
            let combo = [];
            let selected = { value: 0, label: "Seleccione tipo de votación" };
            response.data.forEach(i => {
                combo.push({ value: i.id, label: i.nombre })
                if (this.state.id != 0) {
                    let idd = this.state.data.tipo_votacion_id;
                    if (idd === i.id)
                        selected = { value: i.id, label: i.nombre };
                }
            })
            combo.unshift({ value: 0, label: "Seleccione tipo de votación" })
            this.setState({
                dataSelectTipoVotacion: combo,
                filterTipoVotacion: selected
            })
        })
    }
    getComboEstadoByProyectoId = async (proyectoId) => {
        if(proyectoId !== 0){
            this.setState({ loading: true })
            await VotacionesDataService.getComboEstadoByProyectoId(proyectoId).then(response => {
                let combo = [];
                let selected = { value: 0, label: "Seleccione estado de proyecto de ley" };
                response.data.forEach(i => {
                    combo.push({ value: i.id, label: i.tipo_estado.nombre })
                    if (this.state.id != 0) {
                        let idd = this.state.data.votacion_estado.proyecto_ley_estado_id;
                        if (idd === i.id)
                            selected = { value: i.id, label: i.tipo_estado.nombre };
                    }
                })
                combo.unshift({ value: 0, label: "Seleccione estado de proyecto de ley" })
                this.setState({
                    dataSelectEstadoProyectoLey: combo,
                    filterEstadoProyectoLey: selected,
                    loading: false
                })
            })
        }
    }
    getComboClaseVotacion = async () => {
        await VotacionesDataService.getComboClaseVotacion().then(response => {
            let combo = [];
            let selected = { value: 0, label: "Seleccione clase de votación" };
            response.data.forEach(i => {
                combo.push({ value: i.id, label: i.nombre })
                if (this.state.id != 0) {
                    let idd = this.state.data.clase_votacion_id;
                    if (idd === i.id)
                        selected = { value: i.id, label: i.nombre };
                }
            })
            combo.unshift({ value: 0, label: "Seleccione clase de votación" })
            this.setState({
                dataSelectClaseVotacion: combo,
                filterClaseVotacion: selected
            })
        })
    }
    getComboProyectosDeLey = async (legislatura, cuatrienio) => {
        this.setState({ loading: true })
        await VotacionesDataService.getComboProyectosDeLeyByLegislaturaCuatrienio(legislatura, cuatrienio).then(response => {
            let combo = [];
            let selected = { value: 0, label: "Seleccione proyecto de ley" };
            response.data.forEach(i => {
                combo.push({ value: i.id, label: i.titulo })
                if (this.state.id != 0) {
                    let idd = this.state.data.proyecto_de_ley_id;
                    if (idd === i.id)
                        selected = { value: i.id, label: i.titulo };
                }
            })
            combo.unshift({ value: 0, label: "Seleccione proyecto de ley" })
            this.setState({
                dataSelectProyectoLey: combo,
                filterProyectoLey: selected,
                loading: false
            })
        })
    }
    getComboCuatrienio = async () => {
        await VotacionesDataService.getComboCuatrienio().then(response => {
            let combo = [];
            let selected = { value: 0, label: "Seleccione quinquenio" };
            response.data.forEach(i => {
                combo.push({ value: i.id, label: i.nombre })
                if (this.state.id != 0) {
                    let idd = this.state.data.cuatrienio_id;
                    if (idd === i.id)
                        selected = { value: i.id, label: i.nombre };
                }
            })
            combo.unshift({ value: 0, label: "Seleccione quinquenio" })
            this.setState({
                dataSelectCuatrienio: combo,
                filterCuatrienio: selected,
                loading: false
            })
        })
    }
    getComboLegislatura = async (idCuatrienio) => {
        this.setState({ loading: true })
        await VotacionesDataService.getComboLegislatura(idCuatrienio).then(response => {
            let combo = [];
            let selected = { value: 0, label: "Seleccione legislatura" };
            response.data.forEach(i => {
                combo.push({ value: i.id, label: i.nombre })
                if (this.state.id != 0) {
                    let idd = this.state.data.legislatura_id;
                    if (idd === i.id)
                        selected = { value: i.id, label: i.nombre };
                }
            })
            combo.unshift({ value: 0, label: "Seleccione legislatura" })
            this.setState({
                dataSelectLegislatura: combo,
                filterLegislatura: selected,
                loading: false
            })
        })
    }
    getComboCorporacion = async () => {
        this.setState({ loading: true })
        await VotacionesDataService.getComboCorporacion().then(response => {
            let combo = [];
            let selected = { value: 0, label: "Seleccione tipo de corporación" };
            let selected2 = selected;

            response.data.forEach(i => {
                combo.push({ value: i.id, label: i.nombre })
                if (this.state.id != 0) {
                    let idd = this.state.data.votacion_comision !== null ? this.state.data.votacion_comision.corporacion_id : 0;
                    let idd2 = this.state.data.votacion_plenaria !== null ? this.state.data.votacion_plenaria.corporacion_id : 0;
                    if (idd === i.id)
                        selected = { value: i.id, label: i.nombre };
                    if (idd2 === i.id)
                        selected2 = { value: i.id, label: i.nombre };
                }
            })
            combo.unshift({ value: 0, label: "Seleccione tipo de corporación" })
            this.setState({
                dataSelectCorporacion: combo,
                dataSelectCorporacionPlenaria: combo,
                filterCorporacion: selected,
                filterCorporacionPlenaria: selected2
            })
        })
    }
    getComboTipoComision = async (idCorporacion) => {
        this.setState({ loading: true })
        await VotacionesDataService.getComboTipoComision(idCorporacion).then(response => {
            let combo = [];
            let selected = { value: 0, label: "Seleccione tipo de comisión" };
            response.data.forEach(i => {
                combo.push({ value: i.id, label: i.nombre })
                if (this.state.id != 0) {
                    let idd = this.state.data.votacion_comision !== null ? this.state.data.votacion_comision.tipo_comision_id : 0;
                    if (idd === i.id)
                        selected = { value: i.id, label: i.nombre };
                }
            })
            combo.unshift({ value: 0, label: "Seleccione tipo de comisión" })
            this.setState({
                dataSelectTipoComisiones: combo,
                filterTipoComision: selected,
                loading: false
            })
        })
    }
    getComboComisiones = async (idTipoComision) => {
        this.setState({ loading: true })
        await VotacionesDataService.getComboComisiones(idTipoComision).then(response => {
            let combo = [];
            let selected = { value: 0, label: "Seleccione comisión" };
            response.data.forEach(i => {
                combo.push({ value: i.id, label: i.nombre })
                if (this.state.id != 0) {
                    let idd = this.state.data.votacion_comision !== null ? this.state.data.votacion_comision.comision_id : 0;
                    if (idd === i.id)
                        selected = { value: i.id, label: i.nombre };
                }
            })
            combo.unshift({ value: 0, label: "Seleccione comisión" })
            this.setState({
                dataSelectComisiones: combo,
                filterComision: selected,
                loading: false
            })
        })
    }

    saveSubmit = async () => {
        let errors = this.state.errors;
        errors = validForm.cleanErrors(errors);
        this.setState({ errors: errors, loading: true });
        let data = this.state.data;
        data.fecha = FechaMysql.DateFormatMySql(this.state.dpFecha);
        data.observaciones = this.state.textObservaciones;
        data.user = auth.username();
        let responseData;
        if (data.id === 0) {
            await VotacionesDataService.create(data)
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
            await VotacionesDataService.update(data.id, data)
                .then((response) => {
                    responseData = response.data;
                    this.props.history.push({
                        pathname: "/votaciones",
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
                pathname: "/votaciones",
            });
        }
    };

    resetFields() {
        let fields = validForm.resetObject(constFileds);
        let errors = validForm.resetObject(constErrors);
        fields.voto_general = true;
        this.setState({ data: fields, errors: errors });
    }

    render() {
        return (
            <>
                <Spinner show={this.state.loading} />
                <ul className="breadcrumb">
                    <li>Votaciones</li>
                    <li>Nueva votación</li>
                </ul>
                <div className="page-content-wrap">
                    <div className="row">
                        <div className="col-md-12">

                            <form className="form-horizontal">
                                <div className="panel panel-default">
                                    <div className="panel-heading">
                                        <h3 className="panel-title"><strong><i className="fa fa-user"></i> {this.state.data["id"] === 0 ? "Nueva" : "Editar"} votación</strong></h3>
                                    </div>
                                    <div className="panel-body">
                                        <div className="row">
                                            <h3>Información general</h3>
                                            <div className="col-md-9">
                                                <div className="form-group">
                                                    <label className="col-md-3 control-label">Fecha</label>
                                                    <div className="col-md-9">
                                                        <div className="input-group">
                                                            <DatePicker
                                                                id="dateFecha"
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
                                                                spanError={this.state.errors["dpFecha"] || ''}
                                                                divClassSpanType={1}
                                                                divClassSpan="input-group-addon"
                                                                divClassSpanI="fa fa-calendar"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <label className="col-md-3 control-label"> Acta </label>
                                                    <div className="col-md-9">
                                                        <div className="input-group">
                                                            <Input
                                                                divClass="input-group"
                                                                inputName="acta"
                                                                inputType="text"
                                                                inputClass="form-control"
                                                                inputplaceholder="..."
                                                                inputValue={this.state.data.acta || ""}
                                                                inputOnchange={(e) => {
                                                                    let fields = this.state.data;
                                                                    let errors = this.state.errors;

                                                                    fields = validForm.handleChangeField("acta", fields, e);
                                                                    errors = validForm.handleChangeErrors("acta", errors, e);
                                                                    this.setState({
                                                                        data: fields,
                                                                        errors: errors,
                                                                    });
                                                                }}
                                                                spanClass="error"
                                                                spanError={this.state.errors.acta || ""}
                                                                divClassSpanType={1}
                                                                divClassSpan="input-group-addon"
                                                                divClassSpanI="fa fa-pen"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <label className="col-md-3 control-label">Cuatrienio</label>
                                                    <div className="col-md-9">
                                                        <div className="input-group">
                                                            <Select
                                                                divClass=""
                                                                disabled={this.state.id !== 0 ? true : false}
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
                                                    <label className="col-md-3 control-label">Legislatura</label>
                                                    <div className="col-md-9">
                                                        <div className="input-group">
                                                            <Select
                                                                divClass=""
                                                                disabled={this.state.id !== 0 ? true : false}
                                                                selectplaceholder="Seleccione"
                                                                selectValue={this.state.filterLegislatura}
                                                                selectIsSearchable={false}
                                                                selectoptions={this.state.dataSelectLegislatura}
                                                                selectOnchange={this.handlerFilterLegislatura}
                                                                selectclassNamePrefix="selectReact__value-container"
                                                                spanClass="error"
                                                                noOptionsMessage="Seleccione un cuatrienio"
                                                                spanError={this.state.errors["legislatura_id"] || ''} >
                                                            </Select>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <label className="col-md-3 control-label">Tipo de iniciativa</label>
                                                    <div className="col-md-9">
                                                        <div className="input-group">
                                                            <Select
                                                                divClass=""
                                                                selectplaceholder="Seleccione"
                                                                selectValue={this.state.filterProyectoLey}
                                                                selectIsSearchable={false}
                                                                selectoptions={this.state.dataSelectProyectoLey}
                                                                selectOnchange={this.handlerFilterProyectoLey}
                                                                selectclassNamePrefix="selectReact__value-container"
                                                                spanClass="error"
                                                                noOptionsMessage="Debe elegir un cuatrienio y legislatura"
                                                                spanError={this.state.errors.proyecto_de_ley_id || ''} >
                                                            </Select>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <label className="col-md-3 control-label">Estado de proyecto</label>
                                                    <div className="col-md-9">
                                                        <div className="input-group">
                                                            <Select
                                                                divClass=""
                                                                selectplaceholder="Seleccione"
                                                                selectValue={this.state.filterEstadoProyectoLey}
                                                                selectIsSearchable={false}
                                                                selectoptions={this.state.dataSelectEstadoProyectoLey}
                                                                selectOnchange={this.handlerFilterEstadoProyectoLey}
                                                                selectclassNamePrefix="selectReact__value-container"
                                                                spanClass="error"
                                                                noOptionsMessage="Debe elegir un tipo de iniciativa"
                                                                spanError={this.state.errors.estado_proyecto_ley_id || ''} >
                                                            </Select>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <label className="col-md-3 control-label">Tipo de votación</label>
                                                    <div className="col-md-9">
                                                        <div className="input-group">
                                                            <Select
                                                                divClass=""
                                                                selectplaceholder="Seleccione"
                                                                selectValue={this.state.filterTipoVotacion}
                                                                selectIsSearchable={false}
                                                                selectoptions={this.state.dataSelectTipoVotacion}
                                                                selectOnchange={this.handlerFilterTipoVotacion}
                                                                selectclassNamePrefix="selectReact__value-container"
                                                                spanClass="error"
                                                                spanError={this.state.errors.tipo_votacion_id || ''} >
                                                            </Select>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <label className="col-md-3 control-label">Clase de votación</label>
                                                    <div className="col-md-9">
                                                        <div className="input-group">
                                                            <Select
                                                                divClass=""
                                                                selectplaceholder="Seleccione"
                                                                selectValue={this.state.filterClaseVotacion}
                                                                selectIsSearchable={false}
                                                                selectoptions={this.state.dataSelectClaseVotacion}
                                                                selectOnchange={this.handlerFilterClaseVotacion}
                                                                selectclassNamePrefix="selectReact__value-container"
                                                                spanClass="error"
                                                                spanError={this.state.errors.clase_votacion_id || ''} >
                                                            </Select>
                                                        </div>
                                                    </div>
                                                </div>

                                                <AccordionCheckbox handlerCheckboxSelected={this.handlerCheckboxPlenaria} label={"Plenaria"} open={this.state.data.esPlenaria}
                                                    children={
                                                        <>
                                                            <div className="form-group">
                                                                <label className="col-md-3 control-label">Tipo de corporación</label>
                                                                <div className="col-md-9">
                                                                    <div className="input-group">
                                                                        <Select
                                                                            divClass=""
                                                                            disabled={this.state.id !== 0 ? true : false}
                                                                            selectplaceholder="Seleccione"
                                                                            selectValue={this.state.filterCorporacionPlenaria}
                                                                            selectIsSearchable={false}
                                                                            selectoptions={this.state.dataSelectCorporacionPlenaria}
                                                                            selectOnchange={this.handlerFilterCorporacionPlenaria}
                                                                            selectclassNamePrefix="selectReact__value-container"
                                                                            spanClass="error"
                                                                            spanError={this.state.errors.corporacion_id || ''} >
                                                                        </Select>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </>
                                                    } />
                                                <span className="error center-block text-center">{this.state.errors.esComision || ''}</span>
                                                <AccordionCheckbox handlerCheckboxSelected={this.handlerCheckboxComision} label={"Comisión"} open={this.state.data.esComision}
                                                    children={
                                                        <>
                                                            <div className="form-group">
                                                                <label className="col-md-3 control-label">Tipo de corporación</label>
                                                                <div className="col-md-9">
                                                                    <div className="input-group">
                                                                        <Select
                                                                            divClass=""
                                                                            disabled={this.state.id !== 0 ? true : false}
                                                                            selectplaceholder="Seleccione"
                                                                            selectValue={this.state.filterCorporacion}
                                                                            selectIsSearchable={false}
                                                                            selectoptions={this.state.dataSelectCorporacion}
                                                                            selectOnchange={this.handlerFilterCorporacion}
                                                                            selectclassNamePrefix="selectReact__value-container"
                                                                            spanClass="error"
                                                                            spanError={this.state.errors.corporacion_id || ''} >
                                                                        </Select>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="form-group">
                                                                <label className="col-md-3 control-label">Tipo de comisión</label>
                                                                <div className="col-md-9">
                                                                    <div className="input-group">
                                                                        <Select
                                                                            divClass=""
                                                                            disabled={this.state.id !== 0 ? true : false}
                                                                            selectplaceholder="Seleccione"
                                                                            selectValue={this.state.filterTipoComision}
                                                                            selectIsSearchable={false}
                                                                            selectoptions={this.state.dataSelectTipoComisiones}
                                                                            selectOnchange={this.handlerFilterTipoComision}
                                                                            selectclassNamePrefix="selectReact__value-container"
                                                                            spanClass="error"
                                                                            spanError={this.state.errors.tipo_comision_id || ''} >
                                                                        </Select>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="form-group">
                                                                <label className="col-md-3 control-label">Comisión</label>
                                                                <div className="col-md-9">
                                                                    <div className="input-group">
                                                                        <Select
                                                                            divClass=""
                                                                            disabled={this.state.id !== 0 ? true : false}
                                                                            selectplaceholder="Seleccione"
                                                                            selectValue={this.state.filterComision}
                                                                            selectIsSearchable={false}
                                                                            selectoptions={this.state.dataSelectComisiones}
                                                                            selectOnchange={this.handlerFilterComision}
                                                                            selectclassNamePrefix="selectReact__value-container"
                                                                            spanClass="error"
                                                                            spanError={this.state.errors.comision_id || ''} >
                                                                        </Select>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </>
                                                    } />
                                                <span className="error center-block text-center">{this.state.errors.esComision || ''}</span>

                                                <div className={`form-group`}>
                                                    <label className="col-md-3 control-label">Gaceta</label>
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
                                                <div className="form-group">
                                                    <label className="col-md-3 control-label"> Motivo </label>
                                                    <div className="col-md-9">
                                                        <div className="input-group">
                                                            <Input
                                                                divClass="input-group"
                                                                inputName="acta"
                                                                inputType="text"
                                                                inputClass="form-control"
                                                                inputplaceholder="..."
                                                                inputValue={this.state.data.motivo || ""}
                                                                inputOnchange={(e) => {
                                                                    let fields = this.state.data;
                                                                    let errors = this.state.errors;

                                                                    fields = validForm.handleChangeField("motivo", fields, e);
                                                                    errors = validForm.handleChangeErrors("motivo", errors, e);
                                                                    this.setState({
                                                                        data: fields,
                                                                        errors: errors,
                                                                    });
                                                                }}
                                                                spanClass="error"
                                                                spanError={this.state.errors.motivo || ""}
                                                                divClassSpanType={1}
                                                                divClassSpan="input-group-addon"
                                                                divClassSpanI="fa fa-pen"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <label className="col-md-3 control-label">Observaciones</label>
                                                    <div className="col-md-9">
                                                        <SunEditor
                                                            placeholder="..."
                                                            setContents={this.state.textObservaciones || ""}
                                                            onChange={(e) => {
                                                                let state = this.state;
                                                                let errors = this.state.errors;
                                                                state = validForm.handleChangeFieldJodiEditor("textObservaciones", state, e);
                                                                errors = validForm.handleChangeErrors("motivo", errors, e);
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
                                                            {this.state.errors["observaciones"] || ""}
                                                        </span>
                                                    </div>
                                                </div>

                                                <AccordionCheckbox handlerCheckboxSelected={this.handlerCheckboxVotoGeneral} label={"¿Voto general?"} open={this.state.data.voto_general}
                                                    children={
                                                        <>
                                                            <div className="form-group">
                                                                <label className="col-md-3 control-label"> Votos a favor </label>
                                                                <div className="col-md-9">
                                                                    <div className="input-group">
                                                                        <Input
                                                                            divClass="input-group"
                                                                            inputName="acta"
                                                                            inputType="number"
                                                                            inputClass="form-control"
                                                                            inputplaceholder="..."
                                                                            inputValue={this.state.data.votosFavor || ""}
                                                                            inputOnchange={(e) => {
                                                                                let fields = this.state.data;
                                                                                let errors = this.state.errors;

                                                                                fields = validForm.handleChangeField("votosFavor", fields, e);
                                                                                errors = validForm.handleChangeErrors("votosFavor", errors, e);
                                                                                this.setState({
                                                                                    data: fields,
                                                                                    errors: errors,
                                                                                });
                                                                            }}
                                                                            spanClass="error"
                                                                            spanError={this.state.errors.votosFavor || ""}
                                                                            divClassSpanType={1}
                                                                            divClassSpan="input-group-addon"
                                                                            divClassSpanI="fas fa-vote-yea"
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="form-group">
                                                                <label className="col-md-3 control-label"> Votos en contra </label>
                                                                <div className="col-md-9">
                                                                    <div className="input-group">
                                                                        <Input
                                                                            divClass="input-group"
                                                                            inputName="acta"
                                                                            inputType="number"
                                                                            inputClass="form-control"
                                                                            inputplaceholder="..."
                                                                            inputValue={this.state.data.votosContra || ""}
                                                                            inputOnchange={(e) => {
                                                                                let fields = this.state.data;
                                                                                let errors = this.state.errors;

                                                                                fields = validForm.handleChangeField("votosContra", fields, e);
                                                                                errors = validForm.handleChangeErrors("votosContra", errors, e);
                                                                                this.setState({
                                                                                    data: fields,
                                                                                    errors: errors,
                                                                                });
                                                                            }}
                                                                            spanClass="error"
                                                                            spanError={this.state.errors.votosContra || ""}
                                                                            divClassSpanType={1}
                                                                            divClassSpan="input-group-addon"
                                                                            divClassSpanI="fas fa-vote-yea"
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="form-group">
                                                                <label className="col-md-3 control-label"> Aprobadas </label>
                                                                <div className="col-md-9">
                                                                    <div className="input-group">
                                                                        <Input
                                                                            divClass="input-group"
                                                                            inputName="acta"
                                                                            inputType="number"
                                                                            inputClass="form-control"
                                                                            inputplaceholder="..."
                                                                            inputValue={this.state.data.aprobada || ""}
                                                                            inputOnchange={(e) => {
                                                                                let fields = this.state.data;
                                                                                let errors = this.state.errors;

                                                                                fields = validForm.handleChangeField("aprobada", fields, e);
                                                                                errors = validForm.handleChangeErrors("aprobada", errors, e);
                                                                                this.setState({
                                                                                    data: fields,
                                                                                    errors: errors,
                                                                                });
                                                                            }}
                                                                            spanClass="error"
                                                                            spanError={this.state.errors.aprobada || ""}
                                                                            divClassSpanType={1}
                                                                            divClassSpan="input-group-addon"
                                                                            divClassSpanI="fas fa-vote-yea"
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="form-group">
                                                                <label className="col-md-3 control-label"> Votos abstenidos </label>
                                                                <div className="col-md-9">
                                                                    <div className="input-group">
                                                                        <Input
                                                                            divClass="input-group"
                                                                            inputName="acta"
                                                                            inputType="number"
                                                                            inputClass="form-control"
                                                                            inputplaceholder="..."
                                                                            inputValue={this.state.data.votosAbstencion || ""}
                                                                            inputOnchange={(e) => {
                                                                                let fields = this.state.data;
                                                                                let errors = this.state.errors;

                                                                                fields = validForm.handleChangeField("votosAbstencion", fields, e);
                                                                                errors = validForm.handleChangeErrors("votosAbstencion", errors, e);
                                                                                this.setState({
                                                                                    data: fields,
                                                                                    errors: errors,
                                                                                });
                                                                            }}
                                                                            spanClass="error"
                                                                            spanError={this.state.errors.votosAbstencion || ""}
                                                                            divClassSpanType={1}
                                                                            divClassSpan="input-group-addon"
                                                                            divClassSpanI="fas fa-vote-yea"
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="form-group">
                                                                <label className="col-md-3 control-label"> Número de <strong>in</strong>asistencias </label>
                                                                <div className="col-md-9">
                                                                    <div className="input-group">
                                                                        <Input
                                                                            divClass="input-group"
                                                                            inputName="acta"
                                                                            inputType="number"
                                                                            inputClass="form-control"
                                                                            inputplaceholder="..."
                                                                            inputValue={this.state.data.numero_no_asistencias || ""}
                                                                            inputOnchange={(e) => {
                                                                                let fields = this.state.data;
                                                                                let errors = this.state.errors;

                                                                                fields = validForm.handleChangeField("numero_no_asistencias", fields, e);
                                                                                errors = validForm.handleChangeErrors("numero_no_asistencias", errors, e);
                                                                                this.setState({
                                                                                    data: fields,
                                                                                    errors: errors,
                                                                                });
                                                                            }}
                                                                            spanClass="error"
                                                                            spanError={this.state.errors.numero_no_asistencias || ""}
                                                                            divClassSpanType={1}
                                                                            divClassSpan="input-group-addon"
                                                                            divClassSpanI="fas fa-vote-yea"
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="form-group">
                                                                <label className="col-md-3 control-label"> Número de asistencias </label>
                                                                <div className="col-md-9">
                                                                    <div className="input-group">
                                                                        <Input
                                                                            divClass="input-group"
                                                                            inputName="acta"
                                                                            inputType="number"
                                                                            inputClass="form-control"
                                                                            inputplaceholder="..."
                                                                            inputValue={this.state.data.numero_asistencias || ""}
                                                                            inputOnchange={(e) => {
                                                                                let fields = this.state.data;
                                                                                let errors = this.state.errors;

                                                                                fields = validForm.handleChangeField("numero_asistencias", fields, e);
                                                                                errors = validForm.handleChangeErrors("numero_asistencias", errors, e);
                                                                                this.setState({
                                                                                    data: fields,
                                                                                    errors: errors,
                                                                                });
                                                                            }}
                                                                            spanClass="error"
                                                                            spanError={this.state.errors.numero_asistencias || ""}
                                                                            divClassSpanType={1}
                                                                            divClassSpan="input-group-addon"
                                                                            divClassSpanI="fas fa-vote-yea"
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </>
                                                    } />


                                            </div>
                                            <hr />
                                        </div>
                                    </div>
                                    <div className="panel-body">
                                        <div className="row">
                                            <div className="panel-footer">
                                                <ValidarPermiso IdModuloPermisoValidar={this.state.id !== 0 ? ModuloPermiso.Votaciones.Modificar : ModuloPermiso.Votaciones.Nuevo} DefaultTemplate={
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

export default CrearCongresista;