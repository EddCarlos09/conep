import React, { Component } from "react";
import ControlPoliticoDataService from "../../../Services/Congreso/ControlPolitico.Service";
import UtilsDataService from "../../../Services/General/Utils.Service";
import Input from "../../../Components/Input";
import DatePicker from "../../../Components/DatePicker";
import Spinner from "../../../Components/Spinner";
import Select from "../../../Components/Select";
import ValidForm from "../../../Utils/ValidForm";
import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css"; // Import Sun Editor's CSS File
import * as FechaMysql from "../../../Utils/FormatDate";
import AuthLogin from "../../../Utils/AuthLogin";
import { ModuloPermiso } from "../../../Permisos/ModuloPermiso";
import ValidarPermiso from "../../../Permisos/ValidarPermiso";
import { Constantes } from "../../../Constants/Constantes.js";
import { ThemeProvider } from "react-bootstrap";
import Glosario from '../../../Components/Glosario';

const auth = new AuthLogin();
const validForm = new ValidForm();
const constFileds = {
    id: 0,
    legislatura_id: 0,
    cuatrienio_id: 0,
    estado_control_politico_id: 0,
    tema_id_principal: 0,
    tema_id_secundario: 0,
    comision_id: 0,
    corporacion_id: 0,
    plenaria: false,
    control_politico_tags: [],
    tags: "",
    detalles: "",
    numero_proposicion: "",
    titulo: "",
    fecha: new Date(),
    user: ""
};
const constErrors = {
    id: '',
    legislatura_id: '',
    cuatrienio_id: '',
    estado_control_politico_id: '',
    tema_id_principal: '',
    tema_id_secundario: '',
    comision_id: '',
    corporacion_id: '',
    plenaria: '',
    tags: "",
    detalles: "",
    numero_proposicion: "",
    titulo: "",
    fecha: "",
    activo: '',
};

const constErrorsModal = {
    errorCuatrienio: '',
    errorMiembro: '',
    errorCargo: ''
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
const SelectLegislatura = { value: -1, label: 'Seleccione legislatura' };
const SelectCuatrienio = { value: -1, label: 'Seleccione quinquenio' };
const SelectComision = { value: -1, label: 'Seleccione comision' };
const SelectEstado = { value: -1, label: 'Seleccione estado' };
const SelectTemaPrincipal = { value: -1, label: 'Seleccione tema principal' };
const SelectTemaSecundario = { value: -1, label: 'Seleccione tema secundario' };
const SelectCorporacion = { value: -1, label: 'Seleccione corporacion' };
const SelectTipoComision = { value: -1, label: 'Seleccione tipo comision' };

class ControlPoliticoAddUpd extends Component {
    constructor(props) {
        super(props);
        const id =
            this.props.match.params.id === undefined
                ? 0
                : this.props.match.params.id;
        this.state = {
            id: id,
            loading: false,
            fields: constFileds,
            errors: constErrors,
            selectLegislatura: SelectLegislatura,
            dataSelectLegislatura: [SelectLegislatura],
            selectCuatrienio: SelectCuatrienio,
            dataSelectCuatrienio: [SelectCuatrienio],
            selectComision: SelectComision,
            dataSelectComision: [SelectComision],
            selectEstado: SelectEstado,
            dataSelectEstado: [SelectEstado],
            selectTemaPrincipal: SelectTemaPrincipal,
            dataSelectTemaPrincipal: [SelectTemaPrincipal],
            selectTemaSecundario: SelectTemaSecundario,
            dataSelectTemaSecundario: [SelectTemaSecundario],
            selectCorporacion: SelectCorporacion,
            dataSelectCorporacion: [SelectCorporacion],
            selectTipoComision: SelectTipoComision,
            dataSelectTipoComision: [SelectTipoComision],
            glosarioSelected: [],
            glosarioData: [],
            url: "",
            txtDetalles: ""
        };
    }

    componentDidMount = async () => {
        this.resetFields();
        await this.getComboCuatrienio();
        
        await this.getComboEstado();
        await this.getComboTema(-1);
        await this.getComboTemaSecundario(-1);
        await this.getComboCorporacion();
        this.state.fields.id = this.state.id;
        this.state.fields.user = auth.username();

        let id = this.state.id;
        if (id != 0) {
            await this.getByID(id);
        }
        await this.getComboGlosarioLegislativo();
    };

    //Combos
    getComboComision = async (corporacion, tipoComision) => {
        this.setState({ loading: true });
        await UtilsDataService.getComboComisiones(corporacion, tipoComision)
            .then(response => {
                let combo = [];
                response.data.forEach(i => {
                    combo.push({ value: i.id, label: i.nombre })
                })
                combo.unshift(SelectComision)
                this.setState({
                    dataSelectComision: combo,
                    loading: false
                })
            })
            .catch(error => {
                console.log("Error:" + error.message);
                this.setState({ loading: false });
            });
    }

    getComboCorporacion = async () => {
        this.setState({ loading: true });
        await UtilsDataService.getComboCorporacion().then(response => {
            let combo = [];
            response.data.forEach(i => {
                combo.push({ value: i.id, label: i.nombre })
            })
            combo.unshift(SelectCorporacion)
            this.setState({
                dataSelectCorporacion: combo,
                loading: false
            });
        });
    }

    getComboTipoComision = async (idCorporacion) => {
        this.setState({ loading: true });
        await UtilsDataService.getComboTipoComisionFilter({corporacion_id: idCorporacion})
            .then(response => {
                let combo = [];
                response.data.forEach(i => {
                    combo.push({ value: i.id, label: i.nombre })
                })
                combo.unshift(SelectTipoComision)
                this.setState({
                    dataSelectTipoComision: combo,
                    loading: false
                });
            });
    }

    getComboLegislatura = async (select) => {
        this.setState({ loading: true });
        await UtilsDataService.getComboLegislatura(select)
            .then(response => {
                let combo = [];
                response.data.forEach(i => {
                    combo.push({ value: i.id, label: i.nombre })
                })
                combo.unshift(SelectLegislatura)
                this.setState({
                    dataSelectLegislatura: combo,
                    loading: false
                })
            })
            .catch(error => {
                console.log("Error:" + error.message);
                this.setState({ loading: false });
            });
    }

    getComboCuatrienio = async () => {
        this.setState({ loading: true });
        await UtilsDataService.getComboCuatrienio()
            .then(response => {
                let combo = [];
                response.data.forEach(i => {
                    combo.push({ value: i.id, label: i.nombre })
                })
                combo.unshift(SelectCuatrienio)
                this.setState({
                    dataSelectCuatrienio: combo,
                    loading: false
                })
            })
            .catch(error => {
                console.log("Error:" + error.message);
                this.setState({ loading: false });
            });
    }

    getComboEstado = async () => {
        this.setState({ loading: true });
        await UtilsDataService.getComboEstadoControlPolitico()
            .then(response => {
                let combo = [];
                response.data.forEach(i => {
                    combo.push({ value: i.id, label: i.nombre })
                })
                combo.unshift(SelectEstado)
                this.setState({
                    dataSelectEstado: combo,
                    loading: false
                })
            })
            .catch(error => {
                console.log("Error:" + error.message);
                this.setState({ loading: false });
            });
    }

    getComboTema = async (idExcluded) => {
        this.setState({ loading: true });
        await UtilsDataService.getComboTemaControlPoliticoFilter({ id: null, nombre: '', activo: null, idExcluded: idExcluded })
            .then(response => {
                let combo = [];
                response.data.forEach(i => {
                    combo.push({ value: i.id, label: i.nombre })
                })
                combo.unshift(SelectTemaPrincipal)
                this.setState({
                    dataSelectTemaPrincipal: combo,
                    dataSelectTemaSecundario: combo,
                    loading: false
                })
            })
            .catch(error => {
                console.log("Error:" + error.message);
                this.setState({ loading: false });
            });
    }
    getComboTemaSecundario = async (idExcluded) => {
        this.setState({ loading: true });
        await UtilsDataService.getComboTemaControlPoliticoFilter({ id: null, nombre: '', activo: null, idExcluded: idExcluded })
            .then(response => {
                let combo = [];
                response.data.forEach(i => {
                    combo.push({ value: i.id, label: i.nombre })
                })
                combo.unshift(SelectTemaSecundario)
                this.setState({
                    dataSelectTemaSecundario: combo,
                    loading: false
                })
            })
            .catch(error => {
                console.log("Error:" + error.message);
                this.setState({ loading: false });
            });
    }

    setSelectValue = (id, dataSelect, filter) => {
        let select = this.state[`${dataSelect}`];
        id = Number.parseInt(id);
        for (let i = 0; i < select.length; i++) {
            let idSelect = Number.parseInt(select[i].value);

            if (idSelect === id) {
                this.setState({ [filter]: select[i] });
                break;
            }
        }
    };
    getComboGlosarioLegislativo = async () => {
        let glosario = this.state.glosarioData;
        await UtilsDataService.getComboGlosarioLegislativo().then(response => {
            glosario = response.data;
        })
        let fields = this.state.fields;
        let glosarioSelected = [];
        fields.control_politico_tags.forEach(x => {
            glosarioSelected.push(glosario.filter((y)=> { return y.id === x.glosario_legislativo_id })[0])
        });
        this.setState({glosarioData: glosario, glosarioSelected})
    }
    //End combos


    //Handlers

    handleSelectComision = async (selectComision) => {
        this.setState({ selectComision: selectComision });
    }
    handleSelectCuatrienio = async (selectCuatrienio) => {
        this.setState({ selectCuatrienio: selectCuatrienio, selectLegislatura: SelectLegislatura });
        await this.getComboLegislatura(selectCuatrienio.value);
    }
    handleSelectLegislatura = async (selectLegislatura) => {
        this.setState({ selectLegislatura: selectLegislatura });
    }
    handleSelectEstado = async (selectEstado) => {
        this.setState({ selectEstado: selectEstado });
    }
    handleSelectTema = async (selectTema) => {
        this.setState({ selectTemaPrincipal: selectTema });
    }
    handleSelectTemaSecundario = async (selectTema) => {
        this.setState({ selectTemaSecundario: selectTema });
    }
    handleSelectCorporacion = async (selectCorporacion) => {
        this.setState({ selectCorporacion: selectCorporacion, selectTipoComision: SelectTipoComision, selectComision: SelectComision });
        this.getComboTipoComision(selectCorporacion.value);
        this.getComboComision(-1, -1);
    }

    handleSelectTipoComision = async (selectTipoComision) => {
        this.setState({ selectTipoComision: selectTipoComision, selectComision: SelectComision });
        this.getComboComision(this.state.selectCorporacion.value, selectTipoComision.value);
    }

    selectWordHandler = (selectedWord) => {
        let fields = this.state.fields;
        let cFiltred = fields.control_politico_tags.filter((x)=> {return x.glosario_legislativo_id === selectedWord.id})
        if(typeof cFiltred.length === 'undefined' || cFiltred.length === 0){ // Si no hay ninguno igual agregado
            let glosarioSelected = this.state.glosarioSelected;
            let conceptoObject = {
                id: 0,
                control_politico_id: this.state.id,
                glosario_legislativo_id: selectedWord.id,
                nombre: selectedWord.palabra,
                activo: 1
            }
            glosarioSelected.push(selectedWord);
            fields.control_politico_tags.push(conceptoObject);
            this.setState({glosarioSelected, fields})
        }
        else{ // Significa que lo encontró pero en activo 0
            fields.control_politico_tags.forEach(x => {
                if(x.glosario_legislativo_id === selectedWord.id)
                    x.activo = 1
            })
        }
    }
    unselectWordHandler = (unselectedWord) => {
        let fields = this.state.fields;
        let glosarioSelected = this.state.glosarioSelected;

        let cFiltred = fields.control_politico_tags.filter((x)=> {return x.glosario_legislativo_id === unselectedWord.id})[0]
        if(cFiltred.id === 0) // Si tiene 0 de id, entonces lo eliminamos e la lista
            fields.control_politico_tags = fields.control_politico_tags.filter((x)=> {return x.glosario_legislativo_id !== unselectedWord.id})
        else{ // Si no, solo ponemos el activo en falso
            fields.control_politico_tags.forEach(x => {
                if(x.glosario_legislativo_id === unselectedWord.id)
                    x.activo = 0
            })
        }
        glosarioSelected = glosarioSelected.filter((x)=> {return x.id !== unselectedWord.id}) //Aquí si o si lo eliminamos
        this.setState({glosarioSelected, fields})
    }
    //End handlers

    //Metodos

    getByID = async (id) => {
        this.setState({ loading: true });
        let fields = null;
        let txtDetalles = this.state.txtDetalles;
        await ControlPoliticoDataService.get(id)
            .then((response) => {
                fields = this.state.fields;
                let errors = this.state.errors;
                fields = response.data[0];
                txtDetalles = fields.detalles;
                console.log(fields);
                Object.assign(fields, { user: auth.username() });
            })
            .catch((e) => {
                this.setState({
                    loading: false,
                });
                console.log(e);
            });
        if (fields !== null) {
            await this.getComboLegislatura(fields.cuatrienio_id);
            await this.getComboTipoComision(fields.corporacion_id);
            if(fields.comision !== null)
                await this.getComboComision(fields.corporacion_id, fields.comision.tipo_comision_id)
            this.setState({
                fields: fields,
                loading: false,
                txtDetalles: txtDetalles
            }, () => {
                this.setSelectValue(
                    fields.legislatura_id,
                    "dataSelectLegislatura",
                    "selectLegislatura"
                );
                this.setSelectValue(
                    fields.comision !== null ? fields.comision.tipo_comision_id : -1,
                    "dataSelectTipoComision",
                    "selectTipoComision"
                );
                this.setSelectValue(
                    fields.comision_id !== null ? fields.comision_id : -1,
                    "dataSelectComision",
                    "selectComision"
                );
                this.setSelectValue(
                    fields.cuatrienio_id,
                    "dataSelectCuatrienio",
                    "selectCuatrienio"
                );
                this.setSelectValue(
                    fields.estado_control_politico_id,
                    "dataSelectEstado",
                    "selectEstado"
                );
                this.setSelectValue(
                    fields.tema_id_principal,
                    "dataSelectTemaPrincipal",
                    "selectTemaPrincipal"
                );
                this.setSelectValue(
                    fields.tema_id_secundario,
                    "dataSelectTemaSecundario",
                    "selectTemaSecundario"
                );
                this.setSelectValue(
                    fields.corporacion_id,
                    "dataSelectCorporacion",
                    "selectCorporacion"
                )
            });
        }
    };

    saveSubmit = async () => {
        let errors = this.state.errors;
        errors = validForm.cleanErrors(errors);
        this.setState({ errors: errors, loading: true });
        let data = this.state.fields;
        data.fecha = FechaMysql.DateFormatMySql(data.fecha);
        data.legislatura_id = this.state.selectLegislatura.value;
        data.cuatrienio_id = this.state.selectCuatrienio.value;
        data.comision_id = this.state.selectComision.value === -1 ? null : this.state.selectComision.value;
        data.estado_control_politico_id = this.state.selectEstado.value;
        data.tema_id_principal = this.state.selectTemaPrincipal.value;
        data.tema_id_secundario = this.state.selectTemaSecundario.value === -1 ? null : this.state.selectTemaSecundario.value;
        data.corporacion_id = this.state.selectCorporacion.value;
        data.plenaria = this.state.selectComision.value === -1 ? 1 : 0;
        data.detalles = this.state.txtDetalles;
        let control_politico_tags = data.control_politico_tags;
        let tags = '';
        control_politico_tags.map( concepto =>{
            // let cFiltred = fields.control_politico_tags.filter((x)=> {return x.glosario_legislativo_id === concepto.glosario_legislativo_id})
            tags = tags + concepto.nombre + ', ';
        });
        data.tags = tags;
        data.user = auth.username();
        let responseData;
        console.log(data);
        if (data.id === 0) {
            await ControlPoliticoDataService.create(data)
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
            await ControlPoliticoDataService.update(data.id, data)
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
                pathname: "/control-politico",
            });
        }
    };

    resetFields() {
        let fields = Object.assign({}, constFileds);
        let errors = validForm.cleanErrors(this.state.errors);
        this.setState({ fields, errors: validForm.cleanErrors(this.state.errors), txtDetalles: '' });
    }

    render() {
        return (
            <>
                <Spinner show={this.state.loading} />
                <ul className="breadcrumb">
                    <li>Control político</li>
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
                                                {this.state.fields["id"] === 0
                                                    ? "Crear"
                                                    : "Editar"}{" "}
                                                control político
                                            </strong>
                                        </h3>
                                    </div>
                                    <div className="panel-body">
                                        <div className="row">
                                            <h3>Información del control político</h3>
                                            <div className="col-md-9">
                                                <div className="form-group">
                                                    <label className="col-md-3 control-label">
                                                        Título del control político
                                                    </label>
                                                    <div className="col-md-9">
                                                        <div className="input-group">
                                                            <Input
                                                                divClass="input-group"
                                                                inputName="titulo"
                                                                inputType="text"
                                                                inputClass="form-control"
                                                                inputplaceholder="Ingrese el título"
                                                                inputValue={
                                                                    this.state
                                                                        .fields
                                                                        .titulo ||
                                                                    ""
                                                                }
                                                                inputOnchange={(
                                                                    e
                                                                ) => {
                                                                    let fields = this
                                                                        .state
                                                                        .fields;
                                                                    let errors = this
                                                                        .state
                                                                        .errors;
                                                                    fields = validForm.handleChangeField(
                                                                        "titulo",
                                                                        fields,
                                                                        e
                                                                    );
                                                                    errors = validForm.handleChangeErrors(
                                                                        "titulo",
                                                                        errors,
                                                                        e
                                                                    );
                                                                    this.setState(
                                                                        {
                                                                            fields: fields,
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
                                                        Corporación
                                                    </label>
                                                    <div className="col-md-9">
                                                        <div style={{ minWidth: "200px" }}>
                                                            <Select
                                                                divClass=""
                                                                selectplaceholder="Seleccione"
                                                                selectValue={this.state.selectCorporacion}
                                                                selectOnchange={this.handleSelectCorporacion}
                                                                selectoptions={this.state.dataSelectCorporacion}
                                                                selectIsSearchable={false}
                                                                selectclassNamePrefix="selectReact__value-container"
                                                                spanClass="error"
                                                                spanError={this.state.errors["corporacion_id"] || ''} >
                                                            </Select>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <label className="col-md-3 control-label">
                                                        Tipo comisión
                                                    </label>
                                                    <div className="col-md-9">
                                                        <div style={{ minWidth: "200px" }}>
                                                            <Select
                                                                divClass=""
                                                                selectplaceholder="Seleccione"
                                                                selectValue={this.state.selectTipoComision}
                                                                selectOnchange={this.handleSelectTipoComision}
                                                                selectoptions={this.state.dataSelectTipoComision}
                                                                selectIsSearchable={false}
                                                                selectclassNamePrefix="selectReact__value-container"
                                                                spanClass="error"
                                                                spanError={this.state.errors["tipo_comision_id"] || ''} >
                                                            </Select>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <label className="col-md-3 control-label">
                                                        Comisión
                                                    </label>
                                                    <div className="col-md-9">
                                                        <div style={{ minWidth: "200px" }}>
                                                            <Select
                                                                divClass=""
                                                                selectplaceholder="Seleccione"
                                                                selectValue={this.state.selectComision}
                                                                selectOnchange={this.handleSelectComision}
                                                                selectoptions={this.state.dataSelectComision}
                                                                selectIsSearchable={false}
                                                                selectclassNamePrefix="selectReact__value-container"
                                                                spanClass="error"
                                                                spanError={this.state.errors["comision_id"] || ''} >
                                                            </Select>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <label className="col-md-3 control-label">
                                                        Quinquenio
                                                    </label>
                                                    <div className="col-md-9">
                                                        <div style={{ minWidth: "200px" }}>
                                                            <Select
                                                                divClass=""
                                                                selectplaceholder="Seleccione"
                                                                selectValue={this.state.selectCuatrienio}
                                                                selectOnchange={this.handleSelectCuatrienio}
                                                                selectoptions={this.state.dataSelectCuatrienio}
                                                                selectIsSearchable={false}
                                                                selectclassNamePrefix="selectReact__value-container"
                                                                spanClass="error"
                                                                spanError={this.state.errors["cuatrienio_id"] || ''} >
                                                            </Select>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <label className="col-md-3 control-label">
                                                        Legislatura
                                                    </label>
                                                    <div className="col-md-9">
                                                        <div style={{ minWidth: "200px" }}>
                                                            <Select
                                                                divClass=""
                                                                selectplaceholder="Seleccione"
                                                                selectValue={this.state.selectLegislatura}
                                                                selectOnchange={this.handleSelectLegislatura}
                                                                selectoptions={this.state.dataSelectLegislatura}
                                                                selectIsSearchable={false}
                                                                selectclassNamePrefix="selectReact__value-container"
                                                                spanClass="error"
                                                                spanError={this.state.errors["legislatura_id"] || ''} >
                                                            </Select>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <label className="col-md-3 control-label">
                                                        Estado control político
                                                    </label>
                                                    <div className="col-md-9">
                                                        <div style={{ minWidth: "200px" }}>
                                                            <Select
                                                                divClass=""
                                                                selectplaceholder="Seleccione"
                                                                selectValue={this.state.selectEstado}
                                                                selectOnchange={this.handleSelectEstado}
                                                                selectoptions={this.state.dataSelectEstado}
                                                                selectIsSearchable={false}
                                                                selectclassNamePrefix="selectReact__value-container"
                                                                spanClass="error"
                                                                spanError={this.state.errors["estado_control_politico_id"] || ''} >
                                                            </Select>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <label className="col-md-3 control-label">
                                                        Tema principal
                                                    </label>
                                                    <div className="col-md-9">
                                                        <div style={{ minWidth: "200px" }}>
                                                            <Select
                                                                divClass=""
                                                                selectplaceholder="Seleccione"
                                                                selectValue={this.state.selectTemaPrincipal}
                                                                selectOnchange={this.handleSelectTema}
                                                                selectoptions={this.state.dataSelectTemaPrincipal}
                                                                selectIsSearchable={false}
                                                                selectclassNamePrefix="selectReact__value-container"
                                                                spanClass="error"
                                                                spanError={this.state.errors["tema_id_principal"] || ''} >
                                                            </Select>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <label className="col-md-3 control-label">
                                                        Tema secundario
                                                    </label>
                                                    <div className="col-md-9">
                                                        <div style={{ minWidth: "200px" }}>
                                                            <Select
                                                                divClass=""
                                                                selectplaceholder="Seleccione"
                                                                selectValue={this.state.selectTemaSecundario}
                                                                selectOnchange={this.handleSelectTemaSecundario}
                                                                selectoptions={this.state.dataSelectTemaSecundario}
                                                                selectIsSearchable={false}
                                                                selectclassNamePrefix="selectReact__value-container"
                                                                spanClass="error"
                                                                spanError={this.state.errors["tema_id_secundario"] || ''} >
                                                            </Select>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <label className="col-md-3 control-label">
                                                        Fecha
                                                    </label>
                                                    <div className="col-md-9">
                                                        <div className="input-group">
                                                            <DatePicker
                                                                id="date"
                                                                showInputTime={false}
                                                                divClass="input-group"
                                                                dateSelected={this.state.fields["fecha"] || ''}
                                                                onChangeDate={e => {
                                                                    let fields = this.state.fields;
                                                                    let errors = this.state.errors;
                                                                    fields = validForm.handleChangeDateField("fecha", fields, e);
                                                                    errors = validForm.handleChangeErrors("fecha", errors, e);
                                                                    this.setState({ fields: fields, errors: errors });
                                                                }}
                                                                spanClass="error"
                                                                spanError={this.state.errors["fecha"] || ''}
                                                                divClassSpanType={1}
                                                                divClassSpan="input-group-addon"
                                                                divClassSpanI="fa fa-calendar" />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <label className="col-md-3 control-label">Tags asociados</label>
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
                                                <div className="form-group">
                                                    <label className="col-md-3 control-label">
                                                        Número de proposicion
                                                    </label>
                                                    <div className="col-md-9">
                                                        <div className="input-group">
                                                            <Input
                                                                divClass="input-group"
                                                                inputName="numero_proposicion"
                                                                inputType="text"
                                                                inputClass="form-control"
                                                                inputplaceholder="Ingrese el número de proposición"
                                                                inputValue={this.state.fields.numero_proposicion ||""}
                                                                inputOnchange={(e) => {
                                                                    let fields = this.state.fields;
                                                                    let errors = this.state.errors;
                                                                    fields = validForm.handleChangeField("numero_proposicion",fields,e);
                                                                    errors = validForm.handleChangeErrors("numero_proposicion",errors,e);
                                                                    this.setState({
                                                                            fields: fields,
                                                                            errors: errors
                                                                        });
                                                                }}
                                                                spanClass="error"
                                                                spanError={this.state.errors["numero_proposicion"] || ""}
                                                                divClassSpanType={1}
                                                                divClassSpan="input-group-addon"
                                                                divClassSpanI="fa fa-indent"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <label className="col-md-3 control-label">
                                                        Detalles
                                                    </label>
                                                    <div className="col-md-9">
                                                        <SunEditor
                                                            setContents={this.state.txtDetalles || ""}
                                                            onChange={(e) => {
                                                                let fields = this.state;
                                                                let errors = this.state.errors;
                                                                fields = validForm.handleChangeFieldJodiEditor("txtDetalles", fields, e);
                                                                errors = validForm.handleChangeErrors("detalles", errors, e);
                                                                this.setState({ state: fields, errors: errors, });
                                                            }}
                                                            setOptions={{
                                                                buttonList: buttonList,
                                                                height: 400,
                                                            }}
                                                        />
                                                        <span className="error">
                                                            {this.state.errors["descripcion"] || ""}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="panel-body">
                                        <div className="panel-footer">
                                            {
                                                this.state.id !== 0 ?
                                                    <ValidarPermiso
                                                        IdModuloPermisoValidar={ModuloPermiso.ControlPolitico.Modificar}
                                                        DefaultTemplate={<button
                                                            type="button"
                                                            onClick={() => {
                                                                this.saveSubmit();
                                                            }}
                                                            className="btn btn-success pull-right"
                                                        >
                                                            <i className="fa fa-check"></i>{" "}
                                                                Guardar
                                                            </button>}
                                                    />
                                                    :
                                                    <ValidarPermiso
                                                        IdModuloPermisoValidar={ModuloPermiso.ControlPolitico.Nuevo}
                                                        DefaultTemplate={<button
                                                            type="button"
                                                            onClick={() => {
                                                                this.saveSubmit();
                                                            }}
                                                            className="btn btn-success pull-right"
                                                        >
                                                            <i className="fa fa-check"></i>{" "}
                                                                Guardar
                                                            </button>}
                                                    />
                                            }

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
        );
    }
}

export default ControlPoliticoAddUpd;
