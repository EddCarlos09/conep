import React, { Component } from "react";
import CongresistasDataService from "../../../Services/Catalogo/Congresistas.Service";
import EleccionDataService from "../../../Services/Eleccion/Eleccion.Service";
import UtilsDataService from "../../../Services/General/Utils.Service";
import Input from "../../../Components/Input";
import ImageForMultipleResolution from "../../../Components/ImageForMultipleResolution";
import DatePicker from "../../../Components/DatePicker";
import Spinner from "../../../Components/Spinner";
import Select from "../../../Components/Select";
import ValidForm from "../../../Utils/ValidForm";
import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css"; // Import Sun Editor's CSS File
import { ChromePicker } from "react-color";
import * as FechaMysql from "../../../Utils/FormatDate";
import AuthLogin from "../../../Utils/AuthLogin";
import { Constantes } from "../../../Constants/Constantes.js";
import { ModuloPermiso } from "../../../Permisos/ModuloPermiso";
import ValidarPermiso from "../../../Permisos/ValidarPermiso";

const auth = new AuthLogin();

const constFileds = {
    id: 0,
    tipo_comision_id: 0,
    comision_id: 0,
    corporacion_id: 0,
    cuatrienio_id: 0,
    congresista_id: 0,
    comision_miembro_id: 0,
    comision_cargo_congresista_id: 0,
    titulo: "",
    infoGeneral: "",
    fechaDeEleccion: '',
    resultadoVotacion: '',
    imagen: null,
    candidatos: [],
    user: "",
};

const constErrors = {
    id: '',
    tipo_comision_id: '',
    comision_id: '',
    corporacion_id: '',
    cuatrienio_id: '',
    comision_miembro_id: '',
    congresista_id: '',
    comision_cargo_congresista_id: '',
    titulo: "",
    infoGeneral: "",
    fechaDeEleccion: '',
    resultadoVotacion: '',
    imagen: null,
    candidatos: [
        {
            id: '',
            eleccion_id: '',
            congresista_id: '',
            comision_cargo_congresista_id: '',
            nombreCargo: '',
            nombre: '',
            activo: '',
        },
    ],
    user: "",
};

const constErrorsModal = {
    errorCandidato: '',
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
const SelectDatosContacto = { value: 0, label: 'Seleccione un dato contacto' };
const SelectCorporacion = { value: 0, label: 'Seleccione corporacion' };
const SelectTipoComision = { value: 0, label: 'Seleccione tipo comision' };
const SelectComision = { value: 0, label: 'Seleccione comision' };
const SelectCuatrienio = { value: 0, label: 'Seleccione quinquenio' };
const SelectCongresistas = { value: 0, label: 'Seleccione funcionario', congresista_id: 0 };
const SelectCandidatos = { value: 0, label: 'Seleccione candidato', congresista_id: 0 };
const SelectCargo = { value: 0, label: 'Seleccione cargo' };
const DataCandidatos = {
    id: null,
    eleccion_id: null,
    congresista_id: null,
    comision_cargo_congresista_id: null,
    nombreCargo: null,
    nombre: null,
    activo: null,
};

const validForm = new ValidForm();

class CrearEleccion extends Component {
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
            selectDatosContacto: SelectDatosContacto,
            dataSelectDatosContanto: [SelectDatosContacto],
            selectCorporacion: SelectCorporacion,
            dataSelectCorporacion: [SelectCorporacion],
            selectTipoComision: SelectTipoComision,
            dataSelectTipoComision: [SelectTipoComision],
            selectComision: SelectComision,
            dataSelectComision: [SelectComision],
            selectCuatrienio: SelectCuatrienio,
            dataSelectCuatrienio: [SelectCuatrienio],
            selectCongresista: SelectCongresistas,
            dataSelectCongresistas: [SelectCongresistas],
            selectCandidatos: SelectCandidatos,
            dataSelectCandidatos: [SelectCandidatos],
            selectCargo: SelectCargo,
            dataSelectCargo: [SelectCargo],
            selectCargoProveer: SelectCargo,
            dataSelectCargoProveer: [SelectCargo],
            url: "",
            datosContactoDetalle: [],
            candidatosDetalle: [],
            imagesResized: [],
            miembroRepetido: false,
            errorsModal: constErrorsModal,
            dpFechaDeEleccion: new Date(),
            candidatos : [DataCandidatos],
            txtDescripcion: ""
        };
    }

    componentDidMount = async () => {
        this.resetFields();
        await this.getComboCorporacion();
        await this.getComboCuatrienio();
        await this.getComboCargoCongresista();
        await this.getComboTipoComision();
        this.state.fields.id = this.state.id;
        this.state.fields.user = auth.username();
        let id = this.state.id;
        if (id != 0)
        {
            await this.getByID(id);
        } 
        else 
        {
            await this.getComboComision(null, null);
        }
        
        
        
        

    };

    // combos
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

    getComboTipoComision = async () => {
        this.setState({ loading: true });
        await UtilsDataService.getComboTipoComision(0)
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

    getComboComision = async (tipo_comision_id, corporacion_id) => {
        this.setState({loading: true});
        tipo_comision_id = tipo_comision_id == 0 ? null : tipo_comision_id;
        corporacion_id = corporacion_id == 0 ? null : corporacion_id;
        const data = {tipo_comision_id, corporacion_id};
        await UtilsDataService.getComboComisionesFilter(data)
        .then(response => {
                let combo = [];
                response.data.forEach(i => {
                    combo.push({ value: i.id, label: i.nombre })
                })
                combo.unshift({ value: 0, label: "Filtrar por comisión" })
                this.setState({
                    dataSelectComision: combo,
                    loading: false
                })
            })
            .catch((e) => {
                this.setState({
                    loading: false,
                });
                console.log(e);
            });
    }

    getComboCuatrienio = async () => {
        this.setState({ loading: true });
        await UtilsDataService.getComboCuatrienio().then(response => {
            let combo = [];
            response.data.forEach(i => {
                combo.push({ value: i.id, label: i.nombre })
            })
            combo.unshift(SelectCuatrienio)
            this.setState({
                dataSelectCuatrienio: combo,
                loading: false
            });
        });
    }

    getComboCargoCongresista = async () => {
        this.setState({ loading: true });
        await UtilsDataService.getComboCargoCongresista().then(response => {
            let combo = [];
            response.data.forEach(i => {
                combo.push({ value: i.id, label: i.nombre })
            })
            combo.unshift(SelectCargo)
            this.setState({
                dataSelectCargo: combo,
                dataSelectCargoProveer: combo,
                loading: false
            });
        });
    }

    getComboCongresista = async (idComision, idCuatrienio) => {
        this.setState({loading: true});
        const data = {idComision, idCuatrienio};
        await UtilsDataService.getComboComisionMiembro(data)
            .then(response => {
                let combo = [];
                response.data.forEach(i => {
                    combo.push({ value: i.id, label: i.congresista.persona.nombres+" "+i.congresista.persona.apellidos, congresista_id: i.congresista_id })
                })
                combo.unshift(SelectCongresistas);
                this.setState({
                    dataSelectCongresistas: combo,
                    candidatosDetalle: response.data,
                    loading: false
                })

            })
            .catch((e) => {
                this.setState({
                    loading: false,
                });
                console.log(e);
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

    //End combos

    getComboCandidatos = async (selectOption) =>{
        if(selectOption.value != 0)
        {
            let combo = [];
            this.state.dataSelectCongresistas.forEach(i => {
                if(i.value != selectOption.value && i.value != 0)
                    combo.push({ value: i.value, label: i.label, congresista_id: i.congresista_id })
            })
            combo.unshift(SelectCandidatos);
            this.setState({dataSelectCandidatos: combo});
        }
        else
            this.setState({dataSelectCandidatos: [SelectCandidatos], selectCandidatos: SelectCandidatos});
    };
    //Handlers
    handleCongresista = async (selectOption) => {
        let errors = constErrors;
        let funcionarioAgregado = this.state.fields.candidatos.filter(x => x.congresista_id === selectOption.congresista_id && x.activo === 1);
        if(funcionarioAgregado.length > 0)
        {
            errors.congresista_id = "El funcionario ya se encuentra agregado como candidato.";
            this.setState({ errors: errors});
            return false;
        }
        errors.congresista_id = "";
        this.setState({ selectCongresista: selectOption });
        await this.getComboCandidatos(selectOption);
    };

    handleCandidato = async (selectOption) => {
        this.setState({ selectCandidatos: selectOption });
    };

    handleCargo = async (selectOption) => {
        this.setState({ selectCargo: selectOption });
    };

    handleCargoProveer = async (selectOption) => {
        this.setState({ selectCargoProveer: selectOption });
    };

    handleFilterCuatrienio = async (selectOption) => {
        this.setState({ selectCuatrienio: selectOption });
        if(this.state.selectComision.value != 0)
        {
            await this.getComboCongresista(this.state.selectComision.value, selectOption.value);            
        }
        else
        this.setState({dataSelectCongresistas: [SelectCongresistas], selectCongresista: SelectCongresistas});
    };

    handleFilterCorporacion = async (selectCorporacion) => {
        this.setState({ selectCorporacion: selectCorporacion });
        this.getComboComision(this.state.selectTipoComision.value, selectCorporacion.value);
    }

    handleFilterTipoComision = async (selectTipoComision) => {
        this.setState({ selectTipoComision: selectTipoComision });
        this.getComboComision(selectTipoComision.value, this.state.selectCorporacion.value);
    }

    handleFilterComision = async (selectComision) => {
        this.setState({ selectComision: selectComision });
        if(selectComision.value != 0)
        {
            await this.getComboCongresista(selectComision.value, this.state.selectCuatrienio.value);
            
        }
        else
            this.setState({dataSelectCongresistas: [SelectCongresistas], selectCongresista: SelectCongresistas});
    }

    handlerAddMiembro = () => {
        let errorsModal = validForm.resetObject(constErrorsModal);
        let candidato = this.state.selectCandidatos;
        let cargo = this.state.selectCargo;
        let errors = 0;
        if (candidato.value === 0) {
            errorsModal.errorCandidato = "Seleccione un candidato";
            errors++;
        }
        let repetidos = this.state.fields.candidatos.filter(x => x.congresista_id === candidato.congresista_id && x.activo === 1);
        if (repetidos.length > 0) {
            errorsModal.errorCandidato = "El candidato ya se encuentra en la lista";
            errors++;
        }
        if (cargo.value === 0) {
            errorsModal.errorCargo = "Seleccione un cargo para el candidato";
            errors++;
        }
        if (errors > 0) {
            this.setState({ errorsModal: errorsModal, loading: false });
            return false;
        }

        let congresista_id = this.state.selectCandidatos.congresista_id;
        let comision_cargo_congresista_id = this.state.selectCargo.value;
        let nombre_cargo = this.state.selectCargo.label;
        let nombre_cuatrienio = this.state.selectCuatrienio.label;
        let nombre_congresista = this.state.selectCandidatos.label;
        let item = {
            id: 0,
            eleccion_id: 0,
            congresista_id: congresista_id,
            comision_cargo_congresista_id: comision_cargo_congresista_id,
            nombre: nombre_congresista,
            nombreCargo: nombre_cargo,
            nombreCuatrienio: nombre_cuatrienio,
            activo: 1,
        };
        let itemError = {
            id: "",
            congresista_id: "",
            comision_cargo_congresista_id: "",
            activo: "",
        };
        this.setState((prevState) => ({
            ...prevState,
            fields: {
                ...prevState.fields,
                candidatos: [...prevState.fields.candidatos, item],
            },
            errors: {
                ...prevState.errors,
                candidatos: [
                    ...prevState.errors.candidatos,
                    itemError,
                ],
            },
        }));
    }

    handlerRemoveMiembro = (itemToRemove) => {
        let candidatos = this.state.fields.candidatos;

        candidatos[itemToRemove]["activo"] = 0;

        this.setState((prevState) => ({
            ...prevState,
            fields: {
                ...prevState.fields,
                candidatos: candidatos,
            },
        }));
    }

    handlerOnLoadForImage = async (blob) => {
        let state = this.state;
        state.imagesResized = blob;
        this.setState({
            state
        })
    }
    // End handlers 
    renderImagenMiembro = (idCandidato) => {
        let candidato = this.state.candidatosDetalle;
        let elemento = candidato.find((x) => x.congresista_id === idCandidato);
        if(elemento){
            if (typeof elemento.congresista !== "undefined") {
                let itemImagen = elemento.congresista.persona.imagenes[2];
                if (typeof itemImagen !== "undefined") {
                    return itemImagen.imagen;
                }
            }
        }
    };
    // Métodos asíncronos
    getByID = async (id) => {
        this.setState({ loading: true });
        await EleccionDataService.get(id)
            .then((response) => {
                let fields = this.state.fields;
                let errors = this.state.errors;
                let txtDescripcion = this.state.txtDescripcion;
                let fecha = response.data[0].fechaDeEleccion;
                fields = response.data[0];
                txtDescripcion = fields.infoGeneral;
                fields.candidatos = [];
                Object.assign(fields, { user: auth.username() });
                response.data[0].candidato.map(item => {
                    fields.candidatos.push({
                        id: item.id,
                        eleccion_id: item.eleccion_id,
                        comision_cargo_congresista_id: item.comision_cargo_congresista_id,
                        congresista_id: item.congresista_id,
                        nombre: item.congresista.nombre,
                        nombreCargo: item.comision_cargo_congresista.nombre,
                        activo: 1
                    })
                    errors.candidatos.push({
                        id: '',
                        eleccion_id: '',
                        congresista_id: '',
                        comision_cargo_congresista_id: '',
                        nombreCargo: '',
                        nombre: '',
                        activo: '',
                    })
                });
                this.setState({
                    fields: fields,
                    loading: false,
                    dpFechaDeEleccion: fecha,
                    txtDescripcion: txtDescripcion,
                }, async () => {
                    this.setSelectValue(
                        fields.corporacion_id,
                        "dataSelectCorporacion",
                        "selectCorporacion"
                    );
                    this.setSelectValue(
                        fields.tipo_comision_id,
                        "dataSelectTipoComision",
                        "selectTipoComision"
                    );
                    await this.getComboComision(fields.tipo_comision_id, fields.corporacion_id);
                    this.setSelectValue(
                        fields.comision_id,
                        "dataSelectComision",
                        "selectComision"
                    );
                    this.setSelectValue(
                        fields.cuatrienio_id,
                        "dataSelectCuatrienio",
                        "selectCuatrienio"
                    );
                    await this.getComboCongresista(fields.comision_id, fields.cuatrienio_id);
                    this.setSelectValue(
                        fields.comision_miembro_id,
                        "dataSelectCongresistas",
                        "selectCongresista"
                    );
                    await this.getComboCandidatos(this.state.selectCongresista);                    
                    this.setSelectValue(
                        fields.comision_cargo_congresista_id,
                        "dataSelectCargoProveer",
                        "selectCargoProveer"
                    );
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
        let data = this.state.fields;
        data.fechaDeEleccion = FechaMysql.DateFormatMySql(this.state.dpFechaDeEleccion);
        data.tipo_comision_id = this.state.selectTipoComision.value;
        data.corporacion_id = this.state.selectCorporacion.value;
        data.cuatrienio_id = this.state.selectCuatrienio.value;
        data.comision_id = this.state.selectComision.value;
        data.congresista_id = this.state.selectCongresista.congresista_id;
        data.comision_cargo_congresista_id = this.state.selectCargoProveer.value;
        data.comision_miembro_id = this.state.selectCongresista.value;
        data.infoGeneral = this.state.txtDescripcion;
        data.user = auth.username();
        let contError = 0;
        let responseData;
        this.state.fields.candidatos.map((item, i) =>{
            let a = this.state.dataSelectCongresistas.filter(x => x.congresista_id === item.congresista_id);
            if(a.length == 0)
            {
                errors.candidatos[i].comision_cargo_congresista_id = 'No pertenece al quinquenio.';
                contError++;
            }
        });
        if(contError > 0)
        {
            this.setState({ errors: errors, loading: false });
            return false;
        }
        if (data.id === 0) {
            await EleccionDataService.create(data)
                .then((response) => {
                    responseData = response.data;
                })
                .catch(function (error) {
                    errors = validForm.displayErrors(
                        error.response.data,
                        errors
                    );
                    console.log(errors);
                });
        } 
        else {
            await EleccionDataService.update(data.id, data)
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
                pathname: "/elecciones",
            });
        }
        this.setState({loading: false});
    };

    resetFields() {
        let fields = validForm.resetObject(constFileds);
        let errors = validForm.cleanErrors(constErrors);
        this.setState({ fields: fields, errors: errors });
    }

    handlerOpenModal(){
        let errorsModal = validForm.resetObject(constErrorsModal);
        this.setState({ errorsModal, selectCargo: SelectCargo, selectCandidatos: SelectCandidatos})
    }

    render() {
        return (
            <>
                <Spinner show={this.state.loading} />
                <ul className="breadcrumb">
                    <li>
                        {this.state.fields["id"] === 0
                                                    ? "Crear"
                                                    : "Editar"}{" "}
                                                elección</li>
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
                                                elección
                                            </strong>
                                        </h3>
                                    </div>
                                    <div className="panel-body">
                                        <div className="row">
                                            <h3>Información de la elección</h3>
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
                                                        Descripción
                                                    </label>
                                                    <div className="col-md-9">
                                                        <SunEditor
                                                            setContents={this.state.txtDescripcion || ""}
                                                            onChange={(e) => {
                                                                let fields = this.state;
                                                                let errors = this.state.errors;
                                                                fields = validForm.handleChangeFieldJodiEditor("txtDescripcion",fields,e);
                                                                errors = validForm.handleChangeErrors("infoGeneral", errors, e);
                                                                this.setState({state: fields, errors: errors,});
                                                            }}
                                                            setOptions={{
                                                                buttonList: buttonList,
                                                                height: 400,
                                                            }}
                                                        />
                                                        <span className="error">
                                                            {this.state.errors[
                                                                "infoGeneral"
                                                            ] || ""}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <label className="col-md-3 control-label">Fecha de elección</label>
                                                    <div className="col-md-9">
                                                        <div className="input-group">
                                                            <DatePicker
                                                                id="dateFechaDeEleccion"
                                                                showInputTime={false}
                                                                divClass="input-group"
                                                                dateSelected={this.state.dpFechaDeEleccion || ''}
                                                                onChangeDate={e => {
                                                                    let fields = this.state;
                                                                    let errors = this.state.errors;
                                                                    fields = validForm.handleChangeDateField("dpFechaDeEleccion", fields, e);
                                                                    errors = validForm.handleChangeErrors("dpFechaDeEleccion", errors, e);
                                                                    this.setState({ state: fields, errors: errors });
                                                                }}
                                                                spanClass="error"
                                                                spanError={this.state.errors["fechaDeEleccion"] || ''}
                                                                divClassSpanType={1}
                                                                divClassSpan="input-group-addon"
                                                                divClassSpanI="fa fa-calendar"
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
                                                                selectOnchange={this.handleFilterCorporacion}
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
                                                                selectOnchange={this.handleFilterTipoComision}
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
                                                                selectOnchange={this.handleFilterComision}
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
                                                                selectOnchange={this.handleFilterCuatrienio}
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
                                                        Elegido
                                                    </label>
                                                    <div className="col-md-9">
                                                        <div style={{ minWidth: "200px" }}>
                                                            <Select
                                                                divClass=""
                                                                selectplaceholder="Seleccione"
                                                                selectValue={this.state.selectCongresista}
                                                                selectOnchange={this.handleCongresista}
                                                                selectoptions={this.state.dataSelectCongresistas}
                                                                selectIsSearchable={false}
                                                                selectclassNamePrefix="selectReact__value-container"
                                                                spanClass="error"
                                                                spanError={this.state.errors["congresista_id"] || ''} >
                                                            </Select>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <label className="col-md-3 control-label">
                                                        Cargo a proveer
                                                    </label>
                                                    <div className="col-md-9">
                                                        <div style={{ minWidth: "200px" }}>
                                                            <Select
                                                                divClass=""
                                                                selectplaceholder="Seleccione"
                                                                selectValue={this.state.selectCargoProveer}
                                                                selectOnchange={this.handleCargoProveer}
                                                                selectoptions={this.state.dataSelectCargoProveer}
                                                                selectIsSearchable={false}
                                                                selectclassNamePrefix="selectReact__value-container"
                                                                spanClass="error"
                                                                spanError={this.state.errors["comision_cargo_congresista_id"] || ''} >
                                                            </Select>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <label className="col-md-3 control-label">
                                                        Resultado de la votación
                                                    </label>
                                                    <div className="col-md-9">
                                                        <div className="input-group">
                                                            <Input
                                                                divClass="input-group"
                                                                inputName="nombre"
                                                                inputType="text"
                                                                inputClass="form-control"
                                                                inputplaceholder="Ingrese el resultado de la votación"
                                                                inputValue={
                                                                    this.state
                                                                        .fields
                                                                        .resultadoVotacion ||
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
                                                                        "resultadoVotacion",
                                                                        fields,
                                                                        e
                                                                    );
                                                                    errors = validForm.handleChangeErrors(
                                                                        "resultadoVotacion",
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
                                                                    "resultadoVotacion"
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
                                            </div>
                                        </div>
                                    </div>
                                    <div className="panel-body">
                                        <div className="row">
                                            <h3>Candidatos</h3>
                                            <div className="col-md-12">
                                                <button
                                                    type="button"
                                                    onClick={() => { this.handlerOpenModal() }} 
                                                    data-toggle="modal"
                                                    data-target="#modal-add-miembro"
                                                    className="pull-right btn btn-primary"><i className="fa fa-plus"></i> Añadir candidatos</button>
                                                <div className="agregados">
                                                    <div className="panel-body list-group list-group-contacts list-group-contacts-two-columns">
                                                        {
                                                            this.state.fields.candidatos.map((item, i) => {
                                                                if (item.activo) {
                                                                    // let path = y.idRepresentanteNavigation.pathFoto === "" || y.idRepresentanteNavigation.pathFoto === null ? "assets/images/users/no-image.jpg" : auth.pathApi() + y.idRepresentanteNavigation.pathFoto;
                                                                    let path = this.renderImagenMiembro(item.congresista_id) != null
                                                                        ? auth.pathApi() +
                                                                        this.renderImagenMiembro(
                                                                            item.congresista_id
                                                                        ) ||
                                                                        ""
                                                                        : Constantes.NoImagen
                                                                    // let coordinador = y.idTipoPonente === 1 ? "- Coordinador" : "";
                                                                    return (
                                                                        <div key={i} className="list-group-item">
                                                                                <div className="origin">{item.nombreCargo}</div>
                                                                                <div className="list-group-status status-online"></div>
                                                                                <img src={path} className="pull-left" alt={item.nombre} />
                                                                                <span className="contacts-title">{item.nombre}</span>
                                                                                <button onClick={() => { this.handlerRemoveMiembro(i) }} className="btn btn-danger pull-right" type="button"><i className="fa fa-trash-alt"></i></button>
                                                                            
                                                                            <span className="error">
                                                                                {this.state.errors["candidatos"][i]
                                                                                    ? this.state.errors["candidatos"][i].congresista_id
                                                                                    : ""}
                                                                            </span>
                                                                            <span className="error">
                                                                                {this.state.errors["candidatos"][i]
                                                                                    ? this.state.errors["candidatos"][i].comision_cargo_congresista_id
                                                                                    : ""}
                                                                            </span>
                                                                        </div>
                                                                    )
                                                                }
                                                            })
                                                        }
                                                    </div>
                                                    <p><i className="fa fa-info-circle"></i> Para añadir candidatos antes debe seleccionarse comisión y funcionario elegido.</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="panel-body">
                                        <div className="panel-footer">
                                        <ValidarPermiso
                                                IdModuloPermisoValidar={this.state.id === 0 ?
                                                ModuloPermiso.Elecciones.Nuevo
                                                : ModuloPermiso.Elecciones.Modificar}
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
                    <div className="modal" id="modal-add-miembro" tabIndex="-1" role="dialog" aria-labelledby="largeModalHead" aria-hidden="true">
                        <div className="modal-dialog modal-lg">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <button
                                        type="button"
                                        className="close"
                                        data-dismiss="modal">
                                        <span aria-hidden="true">&times;</span><span className="sr-only">Cerrar</span></button>
                                    <h4 className="modal-title" id="largeModalHead"><i className="fa fa-list"></i> Añadiendo candidatos</h4>
                                </div>
                                <div className="modal-body">
                                    <form className="form-horizontal">
                                        <div className="row">
                                            <div className="col-md-6">
                                                <div className="form-group">
                                                    <div className="input-group">
                                                        <span className="input-group-addon"><i className="fa fa-user"></i></span>
                                                        <Select
                                                            divClass=""
                                                            selectplaceholder="Seleccione"
                                                            selectValue={this.state.selectCandidatos}
                                                            selectOnchange={this.handleCandidato}
                                                            selectoptions={this.state.dataSelectCandidatos}
                                                            selectIsSearchable={true}
                                                            selectclassNamePrefix="selectReact__value-container"
                                                            spanClass=""
                                                            spanError=""
                                                        >
                                                        </Select>
                                                    </div>
                                                </div>
                                                <span className={`error`}>{this.state.errorsModal.errorCandidato || ''}</span>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group">
                                                    <div className="input-group">
                                                        <span className="input-group-addon"><i className="fa fa-user"></i></span>
                                                        <Select
                                                            divClass=""
                                                            selectplaceholder="Seleccione"
                                                            selectValue={this.state.selectCargo}
                                                            selectOnchange={this.handleCargo}
                                                            selectoptions={this.state.dataSelectCargo}
                                                            selectIsSearchable={true}
                                                            selectclassNamePrefix="selectReact__value-container"
                                                            spanClass=""
                                                            spanError=""
                                                        >
                                                        </Select>
                                                        <span className="input-group-addon wbtn"><button onClick={this.handlerAddMiembro} type="button" className="btn btn-primary"><i className="fa fa-plus"></i></button></span>
                                                    </div>
                                                </div>
                                                <span className={`error`}>{this.state.errorsModal.errorCargo || ''}</span>
                                            </div>

                                            <div className="agregados">
                                                <hr />
                                                <div className="panel-body list-group list-group-contacts list-group-contacts-two-columns">
                                                    {this.state.fields.candidatos.map((y, j) => {
                                                        if (y.activo) {
                                                            // let path = y.idRepresentanteNavigation.pathFoto === "" || y.idRepresentanteNavigation.pathFoto === null ? "assets/images/users/no-image.jpg" : auth.pathApi() + y.idRepresentanteNavigation.pathFoto;
                                                            let path = this.renderImagenMiembro(y.congresista_id) != null
                                                                ? auth.pathApi() +
                                                                this.renderImagenMiembro(
                                                                    y.congresista_id
                                                                ) ||
                                                                ""
                                                                : Constantes.NoImagen
                                                            // let coordinador = y.idTipoPonente === 1 ? "- Coordinador" : "";
                                                            return (
                                                                <div key={j} className="list-group-item">
                                                                    <div className="origin">{y.nombreCargo}</div>
                                                                    <div className="list-group-status status-online"></div>
                                                                    <img src={path} className="pull-left" alt={y.nombre} />
                                                                    <span className="contacts-title">{y.nombre}</span>
                                                                    <button type="button" onClick={() => { this.handlerRemoveMiembro(j) }} className="btn btn-danger pull-right" ><i className="fa fa-trash-alt"></i></button>
                                                                </div>
                                                            )
                                                        }
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                        <hr />
                                        <p><i className="fa fa-info-circle"></i> Los candidatos agregados en esta etapa aún no se registran en la base de datos. Debe guardar completamente el formulario.</p>
                                        <div className="panel-footer">
                                            <button
                                                type="button"
                                                className="btn btn-default"
                                                data-dismiss="modal"
                                                ref="closemodalSave">Cerrar</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

export default CrearEleccion;
