import React, { Component } from "react";
import PersonaService from "../../../Services/Persona/Persona.Service";
import UtilsService from "../../../Services/General/Utils.Service";
import Input from "../../../Components/Input";
import DatePicker from "../../../Components/DatePicker";
import Spinner from "../../../Components/Spinner";
import Select from "../../../Components/Select";
import ValidForm from "../../../Utils/ValidForm";
import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css"; // Import Sun Editor's CSS File
import * as FechaMysql from "../../../Utils/FormatDate";
import AuthLogin from "../../../Utils/AuthLogin";
import { Constantes } from "../../../Constants/Constantes.js";
import { ModuloPermiso } from "../../../Permisos/ModuloPermiso";
import ValidarPermiso from "../../../Permisos/ValidarPermiso";
import UtilsDataService from "../../../Services/General/Utils.Service";
import ImageForMultipleResolution from "../../../Components/ImageForMultipleResolution";

const title_lowercase = "diputado / autor";
const title_sentence = "Diputado / Autor";
const auth = new AuthLogin();
const fieldsConst = {
    id: 0, nombres: "", apellidos: "", fechaNacimiento: FechaMysql.DateFormatMySql(new Date()), municipio_id_nacimiento: "", nombreSuplente: "",
    profesion_id: "", genero_id: "", fecha_fallecimiento: '', perfil_educativo: "", partido_id: 0,
    grado_estudio_id: "", persona_trayectoria_publica: [], persona_trayectoria_privada: [],
    persona_dato_contactos: [], imagen: [], user: auth.username()
};
const errorsConst = {
    id: 0, nombres: "", apellidos: "", fechaNacimiento: "", municipio_id_nacimiento: "", nombreSuplente: "", partido_id: "",
    profesion_id: "", genero_id: "", fecha_fallecimiento: "", perfil_educativo: "",
    grado_estudio_id: "", persona_trayectoria_publica: [], persona_trayectoria_privada: [],
    persona_dato_contactos: [], imagen: [], submit: ''
};
const default_item_select_lugar_nacimiento = { value: "", label: "Seleccione circuito" };
const default_item_select_profesion = { value: "", label: "Seleccione una profesión" };
const default_item_select_genero = { value: "", label: "Seleccione una género" };
const default_item_select_grado_estudio = { value: "", label: "Seleccione un grado de estudio" };
const default_item_select_partido = { value: "", label: "Seleccione un partido" };
const default_item_select_tipo_contacto = { value: "", label: "Seleccione un tipo de contacto" };

const default_item_error_persona_trayectoria_publica = {
    id: "",
    persona_id: "",
    partido_id: "",
    cargo: "",
    fecha: "",
    fecha_final: "",
    activo: "",
    partido: {
        id: '',
        nombre: ''
    },
    partido_select: ''
};
const default_item_persona_trayectoria_publica = {
    id: 0,
    persona_id: 0,
    partido_id: '',
    cargo: "",
    fecha: FechaMysql.DateFormatMySql(new Date()),
    fecha_final: '',
    activo: 1,
    partido: {
        id: '',
        nombre: ''
    },
    partido_select: Object.assign({}, default_item_select_partido)
};
const default_item_error_persona_trayectoria_privada = {
    id: "",
    persona_id: "",
    cargo: "",
    fecha: "",
    fecha_final: "",
    activo: ""
};
const default_item_persona_trayectoria_privada = {
    id: 0,
    persona_id: 0,
    cargo: "",
    fecha: FechaMysql.DateFormatMySql(new Date()),
    fecha_final: '',
    activo: 1
};
const default_item_error_persona_dato_contacto = {
    id: '',
    persona_id: '',
    dato_contacto_id: '',
    cuenta: '',
    activo: ''
};
const default_item_persona_dato_contacto = {
    id: 0,
    persona_id: 0,
    dato_contacto_id: 0,
    cuenta: '',
    activo: 1
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

const validForm = new ValidForm();

class CrearPersona extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            fields: Object.assign({}, fieldsConst),
            errors: Object.assign({}, errorsConst),
            action: "Nuevo",
            title_lowercase: title_lowercase,
            title_sentence: title_sentence,
            imagesResized: [],

            item_error_dato_contacto: Object.assign({}, default_item_error_persona_dato_contacto),
            item_dato_contacto: Object.assign({}, default_item_persona_dato_contacto),

            item_error_trayectoria_publica: Object.assign({}, default_item_error_persona_trayectoria_publica),
            item_trayectoria_publica: Object.assign({}, default_item_persona_trayectoria_publica),

            item_error_trayectoria_privada: Object.assign({}, default_item_error_persona_trayectoria_privada),
            item_trayectoria_privada: Object.assign({}, default_item_persona_trayectoria_privada),

            data_select_lugar_nacimiento: [],
            item_select_lugar_nacimiento: [default_item_select_lugar_nacimiento],

            data_select_partido: [],
            item_select_partido: [default_item_select_partido],

            data_select_profesion: [],
            item_select_profesion: [default_item_select_profesion],

            data_select_genero: [],
            item_select_genero: [default_item_select_genero],

            data_select_grado_estudio: [],
            item_select_grado_estudio: [default_item_select_grado_estudio],

            data_select_partido: [],

            data_select_tipo_contacto: [],
            item_select_tipo_contacto: [default_item_select_tipo_contacto]
        };
    }

    //<editor-fold desc="Generales">
    componentDidMount = async () => {

        let id = this.obtenerId();
        if (id !== 0) {
            await this.getByID(id);
        } else {
            this.resetFields();
        }

        await this.getComboLugarNacimiento();
        await this.getComboProfesion();
        await this.getComboGenero();
        await this.getComboGradoEstudio();
        await this.getComboTipoContacto();
        await this.getComboPartido();
    };
    getComboPartido = async () => {
        await UtilsDataService.getComboPartido().then(response => {
            let combo = [];
            let selected = Object.assign({}, default_item_select_partido);
            response.data.forEach(i => {
                combo.push({ value: i.id, label: i.nombre })
                if(this.state.fields.partido_id === i.id)
                    selected = { value: i.id, label: i.nombre };
            })
            combo.unshift({ value: -1, label: "Seleccione un partido" })
            this.setState({
                data_select_partido: combo,
                item_select_partido: selected
            })
        })
    }
    saveSubmit = async (e) => {
        e.preventDefault();
        let errors = this.state.errors;
        errors = validForm.cleanErrors(errors);

        let hasError = await this.isValid();

        if(hasError) return;

        this.setState({ errors: errors, loading: true });

        let responseData;
        let data = this.state.fields;
        data.imagen = this.state.imagesResized;

        if (data.id === 0) {
            await PersonaService.create(data)
                .then((response) => {
                    responseData = response.data;
                })
                .catch(function (error) {
                    errors = validForm.displayErrors(error.response.data, errors);
                });
        }
        else {
            await PersonaService.update(data.id, data)
                .then((response) => {
                    responseData = response.data;
                })
                .catch(function (error) {
                    errors = validForm.displayErrors(error.response.data, errors);
                });
        }
        this.setState({ errors: errors, loading: false });
        if (responseData != null) {
            this.resetFields();
            this.props.history.push({
                pathname: "/personas",
            });
        }
    };
    obtenerId = () => {
        let url = this.props.location.pathname;
        let urlArray = url.split("/");
        let id = 0;
        if (
            typeof urlArray[urlArray.length - 1] !== "undefined" &&
            Number.isInteger(Number.parseInt(urlArray[urlArray.length - 1]))
        ) {
            id = Number.parseInt(urlArray[urlArray.length - 1]);
        }
        return id;
    };
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
    renderDatoContacto = (dato_contacto_id) => {
        let datosContacto = this.state.data_select_tipo_contacto;
        let elemento = datosContacto.find(x => x.id === dato_contacto_id);
        if(elemento !== undefined){
            return elemento.imagen;
        }
    }
    isValid = async () => {
        // Validamos a trayectoria pública
        let persona_trayectoria_publica = this.state.fields.persona_trayectoria_publica;
        let persona_error_trayectoria_publica = this.state.errors.persona_trayectoria_publica;
        let hasError = false;

        persona_trayectoria_publica.forEach(function callback(item, i, array){
            if(!item.cargo) {
                hasError = true;
                persona_error_trayectoria_publica[i].cargo = "Escriba su cargo.";
            }else{
                persona_error_trayectoria_publica[i].cargo = '';
            }
            if(!item.fecha) {
                hasError = true;
                persona_error_trayectoria_publica[i].fecha = "Seleccione una fecha.";
            }else{
                persona_error_trayectoria_publica[i].fecha = '';
            }
        });

        // Validamos a trayectoria privada
        let persona_trayectoria_privada = this.state.fields.persona_trayectoria_privada;
        let persona_error_trayectoria_privada = this.state.errors.persona_trayectoria_privada;

        persona_trayectoria_privada.forEach(function callback(item, i, array){
            if(!item.cargo) {
                hasError = true;
                persona_error_trayectoria_privada[i].cargo = "Escriba su cargo.";
            }else{
                persona_error_trayectoria_privada[i].cargo = '';
            }
            if(!item.fecha) {
                hasError = true;
                persona_error_trayectoria_privada[i].fecha = "Seleccione una fecha.";
            }else{
                persona_error_trayectoria_privada[i].fecha = '';
            }
        });

        if(hasError){
            this.setState((prevState) => ({
                ...prevState,
                errors: {
                    ...prevState.errors,
                    submit: 'No se pudo guardar los datos, hay errores encontrados, verifiquelos para poder enviar.',
                    persona_trayectoria_publica: persona_error_trayectoria_publica,
                    persona_trayectoria_privada: persona_error_trayectoria_privada,
                },
            }));
        }

        return hasError;
    }
    //</editor-fold>

    //<editor-fold desc="Handlers">
    handlerSelectLugarNacimiento = (item) => {
        let fields = this.state.fields;
        fields.municipio_id_nacimiento = item.value;
        this.setState({
            fields: fields,
            item_select_lugar_nacimiento: item,
        });
    };

    handlerSelectPartido = (item) => {
        let fields = this.state.fields;
        fields.partido_id = item.value;
        this.setState({
            fields: fields,
            item_select_partido: item,
        });
    };
    handlerSelectProfesion = (item) => {
        let fields = this.state.fields;
        fields.profesion_id = item.value;
        this.setState({
            fields: fields,
            item_select_profesion: item,
        });
    };
    handlerSelectGenero = (item) => {
        let fields = this.state.fields;
        fields.genero_id = item.value;
        this.setState({
            fields: fields,
            item_select_genero: item,
        });
    };
    handlerSelectGradoEstudio = (item) => {
        let fields = this.state.fields;
        fields.grado_estudio_id = item.value;
        this.setState({
            fields: fields,
            item_select_grado_estudio: item,
        });
    };
    handlerSelectTipoContacto = (item) => {
        this.setState((prevState) => ({
            ...prevState,
            item_dato_contacto: {
                ...prevState.item_dato_contacto,
                dato_contacto_id: item.value,
                dato_contaco: {
                    ...prevState.item_dato_contacto.dato_contaco,
                    id: item.value,
                    nombre: item.label,
                },
            },
            item_select_tipo_contacto: item,
        }));
    };
    handlerCrearDatosContacto = () => {

        let hasError = false;
        let item = Object.assign({}, this.state.item_dato_contacto);
        let itemError = Object.assign({}, default_item_error_persona_dato_contacto);

        if (!item.dato_contacto_id) {
            hasError = true;
            itemError.dato_contacto_id =
                "Seleccione un tipo de contacto.";
        }
        if (!item.cuenta) {
            hasError = true;
            itemError.cuenta = "Escriba su cuenta.";
        }

        if (hasError) {
            this.setState((prevState) => ({
                ...prevState,
                item_error_dato_contacto: itemError,
            }));
        } else {
            this.setState((prevState) => ({
                ...prevState,
                item_error_dato_contacto: itemError,
                item_dato_contacto: Object.assign({}, default_item_persona_dato_contacto),
                fields: {
                    ...prevState.fields,
                    persona_dato_contactos: [
                        ...prevState.fields.persona_dato_contactos,
                        item,
                    ],
                },
                item_select_tipo_contacto: Object.assign({}, default_item_select_tipo_contacto)
            }));
        }

    }
    handlerEliminarDatosContacto = (itemToRemove) => {
        let items = this.state.fields.persona_dato_contactos;
        items[itemToRemove]["activo"] = 0;

        this.setState(prevState => ({
            ...prevState,
            fields: {
                ...prevState.fields,
                persona_dato_contactos: items,
            },
        }));
    }
    handlerEliminarItemTrayectoriaPublica = (index) => {
        let items = this.state.fields.persona_trayectoria_publica;
        items[index].activo = 0;
        this.setState((prevState) => ({
                ...prevState,
                fields: {
                    ...prevState.fields,
                    persona_trayectoria_publica: items,
                },
            })
        );
    };
    handlerEliminarItemTrayectoriaPrivada = (index) => {
        let items = this.state.fields.persona_trayectoria_privada;
        items[index].activo = 0;
        this.setState((prevState) => ({
                ...prevState,
                fields: {
                    ...prevState.fields,
                    persona_trayectoria_privada: items,
                },
            })
        );
    };
    handlerCrearElementToTrayectoriaPublica = async () => {
        let item = Object.assign({}, default_item_persona_trayectoria_publica);
        let itemError = Object.assign({}, default_item_error_persona_trayectoria_publica);

        this.setState((prevState) => ({
            ...prevState,
            fields: {
                ...prevState.fields,
                persona_trayectoria_publica: [
                    ...prevState.fields.persona_trayectoria_publica,
                    item,
                ],
            },
            errors: {
                ...prevState.errors,
                persona_trayectoria_publica: [
                    ...prevState.errors.persona_trayectoria_publica,
                    itemError,
                ],
            }
        }));
    }
    handlerCrearElementToTrayectoriaPrivada = async () => {
        let item = Object.assign({}, default_item_persona_trayectoria_privada);
        let itemError = Object.assign({}, default_item_error_persona_trayectoria_privada);

        this.setState((prevState) => ({
            ...prevState,
            fields: {
                ...prevState.fields,
                persona_trayectoria_privada: [
                    ...prevState.fields.persona_trayectoria_privada,
                    item,
                ],
            },
            errors: {
                ...prevState.errors,
                persona_trayectoria_privada: [
                    ...prevState.errors.persona_trayectoria_privada,
                    itemError,
                ],
            }
        }));
    }
    handlerOnLoadForImage = async (blob) => {
        let state = this.state;
        state.imagesResized = blob;
        this.setState({
            state
        })
    }
    //</editor-fold>

    //<editor-fold desc="Gets">
    getComboLugarNacimiento = async () => {
        this.setState({ loading: true });
        await UtilsService.getComboMunicipioFilter({
            activo: 1,
            incluir_departamento: 0
        }).then((response) => {
            let combo = [];
            let selected = Object.assign({}, default_item_select_lugar_nacimiento);
            response.data.forEach((i) => {
                combo.push({ value: i.id, label: i.nombre});
                if(this.state.fields.municipio_id_nacimiento === i.id)
                    selected = { value: i.id, label: i.nombre };
            });
            combo.unshift(Object.assign({}, default_item_select_lugar_nacimiento));
            this.setState({
                data_select_lugar_nacimiento: combo,
                item_select_lugar_nacimiento: selected,
                loading: false,
            });
        });
    };
    getComboProfesion = async () => {
        this.setState({ loading: true });
        await UtilsService.getComboProfesionFilter({
            activo: 1
        }).then((response) => {
            let combo = [];
            let selected = Object.assign({}, default_item_select_profesion);
            response.data.forEach((i) => {
                combo.push({ value: i.id, label: i.nombre });
                if(this.state.fields.profesion_id === i.id)
                    selected = { value: i.id, label: i.nombre };
            });
            combo.unshift(Object.assign({}, default_item_select_profesion));
            this.setState({
                data_select_profesion: combo,
                item_select_profesion: selected,
                loading: false,
            });
        });
    };
    getComboGenero = async () => {
        this.setState({ loading: true });
        await UtilsService.getComboGeneroFilter({
            activo: 1
        }).then((response) => {
            let combo = [];
            let selected = Object.assign({}, default_item_select_genero);
            response.data.forEach((i) => {
                combo.push({ value: i.id, label: i.nombre });
                if(this.state.fields.genero_id === i.id)
                    selected = { value: i.id, label: i.nombre };
            });
            combo.unshift(Object.assign({}, default_item_select_genero));
            this.setState({
                data_select_genero: combo,
                item_select_genero: selected,
                loading: false,
            });
        });
    };
    getComboGradoEstudio = async () => {
        this.setState({ loading: true });
        await UtilsService.getComboGradoEstudioFilter({
            activo: 1
        }).then((response) => {
            let combo = [];
            let selected = Object.assign({}, default_item_select_grado_estudio);
            response.data.forEach((i) => {
                combo.push({ value: i.id, label: i.nombre });
                if(this.state.fields.grado_estudio_id === i.id)
                    selected = { value: i.id, label: i.nombre };
            });
            combo.unshift(Object.assign({}, selected));
            this.setState({
                data_select_grado_estudio: combo,
                item_select_grado_estudio: selected,
                loading: false,
            });
        });
    };
    getComboTipoContacto = async () => {
        this.setState({ loading: true });
        await UtilsDataService.getComboDatosContacto()
            .then(response => {
                let combo = [];
                let selected = Object.assign({}, default_item_select_partido);
                response.data.forEach((i) => {
                    combo.push({ value: i.id, label: i.nombre });
                });
                combo.unshift(Object.assign({}, selected));
                this.setState({
                    data_select_tipo_contacto: combo,
                    loading: false,
                });
            });
    }
    getByID = async (id) => {
        this.setState({ loading: true });
        await PersonaService.get(id)
            .then((response) => {
                let data = response.data;
                let fields = this.state.fields;
                let errors = this.state.errors;

                fields.id = data.id;
                fields.nombres = data.nombres;
                fields.apellidos = data.apellidos;
                fields.fechaNacimiento = data.fechaNacimiento;
                fields.municipio_id_nacimiento = data.municipio_id_nacimiento;
                fields.profesion_id = data.profesion_id;
                fields.genero_id = data.genero_id;
                fields.fecha_fallecimiento = data.fecha_fallecimiento;
                fields.perfil_educativo = data.perfil_educativo;
                fields.grado_estudio_id = data.grado_estudio_id;
                fields.nombreSuplente = data.nombreSuplente;
                fields.partido_id = data.partido_id;
                fields.activo = data.activo;
                fields.imagen = data.imagenes;
                fields.persona_dato_contactos = data.contactos;
                if(data.persona_trayectoria_publica.length > 0){
                    let persona_trayectoria_publica = [];
                    let errors_persona_trayectoria_publica = [];

                    data.persona_trayectoria_publica.forEach(function callback(item, i, array){
                        let item_publica = Object.assign({}, default_item_persona_trayectoria_publica);
                        let itemError = Object.assign({}, default_item_error_persona_trayectoria_publica);

                        item_publica.id = item.id;
                        item_publica.persona_id = item.persona_id;
                        item_publica.partido_id = item.partido_id;
                        item_publica.cargo = item.cargo;
                        item_publica.fecha = item.fecha;
                        item_publica.fecha_final = item.fecha_final !== null && item.fecha_final !== "0000-00-00"
                                                    ? item.fecha_final
                                                    : null;
                        item_publica.activo = item.activo;
                        if(item.hasOwnProperty('partido') && item.partido){
                            item_publica.partido = Object.assign({}, {id: item.partido.id, nombre: item.partido.nombre})
                            item_publica.partido_select = Object.assign({}, {value: item.partido.id, label: item.partido.nombre})
                        }
                        persona_trayectoria_publica.push(item_publica);
                        errors_persona_trayectoria_publica.push(itemError);
                    });
                    fields.persona_trayectoria_publica = persona_trayectoria_publica;
                    errors.persona_trayectoria_publica = errors_persona_trayectoria_publica;
                }

                if(data.persona_trayectoria_privada.length > 0){
                    let persona_trayectoria_privada = [];
                    let errors_persona_trayectoria_privada = [];
                    data.persona_trayectoria_privada.forEach(function callback(item, i, array){
                        let item_privada = Object.assign({}, default_item_persona_trayectoria_privada);
                        let itemError = Object.assign({}, default_item_error_persona_trayectoria_privada);

                        item_privada.id = item.id;
                        item_privada.persona_id = item.persona_id;
                        item_privada.cargo = item.cargo;
                        item_privada.fecha = item.fecha;
                        item_privada.fecha_final = item.fecha_final !== null && item.fecha_final !== "0000-00-00"
                                                    ? item.fecha_final
                                                    : null;
                        item_privada.activo = item.activo;

                        persona_trayectoria_privada.push(item_privada);
                        errors_persona_trayectoria_privada.push(itemError);
                    });
                    fields.persona_trayectoria_privada = persona_trayectoria_privada;
                    errors.persona_trayectoria_privada = errors_persona_trayectoria_privada;
                }
                Object.assign(fields, { user: auth.username() });
                this.setState({
                    fields: fields,
                    errors: errors,
                    loading: false,
                    action: "Editar",
                }, async ()=>{
                    this.setSelectValue(
                        this.state.fields.municipio_id_nacimiento,
                        "data_select_lugar_nacimiento",
                        "item_select_lugar_nacimiento"
                    );
                    this.setSelectValue(
                        this.state.fields.profesion_id,
                        "data_select_profesion",
                        "item_select_profesion"
                    );
                    this.setSelectValue(
                        this.state.fields.genero_id,
                        "data_select_genero",
                        "item_select_genero"
                    );
                    this.setSelectValue(
                        this.state.fields.grado_estudio_id,
                        "data_select_grado_estudio",
                        "item_select_grado_estudio"
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
    //</editor-fold>

    //<editor-fold desc="Reset">
    resetFields() {
        let fields = Object.assign({}, fieldsConst);
        this.setState({
            fields: fields,
            errors: validForm.cleanErrors(this.state.errors),
        });
    }
    //</editor-fold>

    render() {
        return (
            <>
                <Spinner show={this.state.loading} />
                <ul className="breadcrumb">
                    <li>{this.state.title_sentence}</li>
                    <li>
                        {this.state.action} {this.state.title_lowercase}
                    </li>
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
                                                {this.state.action}{" "}
                                            </strong>
                                        </h3>
                                    </div>
                                    <div className="panel-body">
                                        <div className="row">
                                            <h3> Información del {this.state.title_lowercase} </h3>
                                            <div className="col-md-9">
                                                <div className="form-group">
                                                    <label className="col-md-3 control-label"> Nombre(s) </label>
                                                    <div className="col-md-9">
                                                        <div className="input-group">
                                                            <Input
                                                                divClass="input-group"
                                                                inputName="nombres"
                                                                inputType="text"
                                                                inputClass="form-control"
                                                                inputplaceholder="Ingrese el/los nombre(s)"
                                                                inputValue={ this.state.fields.nombres || "" }
                                                                inputOnchange={(e) => {
                                                                    let fields = this.state.fields;
                                                                    let errors = this.state.errors;

                                                                    fields = validForm.handleChangeField("nombres", fields, e);
                                                                    errors = validForm.handleChangeErrors("nombres", errors,e);
                                                                    this.setState({
                                                                        fields: fields,
                                                                        errors: errors,
                                                                    });
                                                                }}
                                                                spanClass="error"
                                                                spanError={ this.state.errors.nombres || "" }
                                                                divClassSpanType={ 1 }
                                                                divClassSpan="input-group-addon"
                                                                divClassSpanI="fa fa-indent"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <label className="col-md-3 control-label"> Apellidos </label>
                                                    <div className="col-md-9">
                                                        <div className="input-group">
                                                            <Input
                                                                divClass="input-group"
                                                                inputName="apellidos"
                                                                inputType="text"
                                                                inputClass="form-control"
                                                                inputplaceholder="Ingrese los apellidos"
                                                                inputValue={ this.state.fields.apellidos || "" }
                                                                inputOnchange={(e) => {
                                                                    let fields = this.state.fields;
                                                                    let errors = this.state.errors;

                                                                    fields = validForm.handleChangeField("apellidos", fields, e);
                                                                    errors = validForm.handleChangeErrors("apellidos", errors, e);
                                                                    this.setState({
                                                                        fields: fields,
                                                                        errors: errors,
                                                                    });
                                                                }}
                                                                spanClass="error"
                                                                spanError={ this.state.errors.apellidos || "" }
                                                                divClassSpanType={ 1 }
                                                                divClassSpan="input-group-addon"
                                                                divClassSpanI="fa fa-indent"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <label className="col-md-3 control-label"> Género </label>
                                                    <div className="col-md-9">
                                                        <div className="input-group">
                                                            <Select
                                                                divClass=""
                                                                selectplaceholder="Seleccione"
                                                                selectValue={ this.state.item_select_genero }
                                                                selectOnchange={ this.handlerSelectGenero }
                                                                selectoptions={ this.state.data_select_genero }
                                                                selectIsSearchable={ false }
                                                                selectclassNamePrefix="selectReact__value-container"
                                                                spanClass="error"
                                                                spanError={ this.state.errors.genero_id || "" }
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <label className="col-md-3 control-label"> Fecha nacimiento </label>
                                                    <div className="col-md-9">
                                                        <div className="input-group">
                                                            <DatePicker
                                                                id="fechaNacimiento"
                                                                showInputTime={ false }
                                                                divClass="input-group"
                                                                dateSelected={ FechaMysql.DateFormatMySql(this.state.fields.fechaNacimiento) || "" }
                                                                onChangeDate={(e) => {
                                                                    let fechaNacimiento = e;

                                                                    if (!fechaNacimiento) {
                                                                        fechaNacimiento = FechaMysql.DateFormatMySql(new Date());
                                                                    }
                                                                    fechaNacimiento = FechaMysql.DateFormatMySql(fechaNacimiento);

                                                                    this.setState(
                                                                        (prevState) => ({
                                                                            ...prevState,
                                                                            fields: {
                                                                                ...prevState.fields,
                                                                                fechaNacimiento: fechaNacimiento,
                                                                            },
                                                                        })
                                                                    );
                                                                }}
                                                                spanClass="error"
                                                                spanError={ this.state.errors.fechaNacimiento || "" }
                                                                divClassSpanType={ 1 }
                                                                divClassSpan="input-group-addon"
                                                                divClassSpanI="fa fa-calendar"
                                                                maxDate={new Date()}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <label className="col-md-3 control-label"> Departamento </label>
                                                    <div className="col-md-9">
                                                        <div className="input-group">
                                                            <Select
                                                                divClass=""
                                                                selectplaceholder="Seleccione"
                                                                selectValue={ this.state.item_select_lugar_nacimiento }
                                                                selectOnchange={ this.handlerSelectLugarNacimiento }
                                                                selectoptions={ this.state.data_select_lugar_nacimiento }
                                                                selectIsSearchable={ true }
                                                                selectclassNamePrefix="selectReact__value-container"
                                                                spanClass="error"
                                                                spanError={ this.state.errors.municipio_id_nacimiento || "" }
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <label className="col-md-3 control-label"> Partido </label>
                                                    <div className="col-md-9">
                                                        <div className="input-group">
                                                            <Select
                                                                divClass=""
                                                                selectplaceholder="Seleccione"
                                                                selectValue={ this.state.item_select_partido }
                                                                selectOnchange={ this.handlerSelectPartido }
                                                                selectoptions={ this.state.data_select_partido }
                                                                selectIsSearchable={ true }
                                                                selectclassNamePrefix="selectReact__value-container"
                                                                spanClass="error"
                                                                spanError={ this.state.errors.partido_id || "" }
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <label className="col-md-3 control-label"> Nombre del suplente </label>
                                                    <div className="col-md-9">
                                                        <div className="input-group">
                                                            <Input
                                                                divClass="input-group"
                                                                inputName="nombreSuplente"
                                                                maxLength={100}
                                                                inputType="text"
                                                                inputClass="form-control"
                                                                inputplaceholder="Ingrese nombre de suplente"
                                                                inputValue={ this.state.fields.nombreSuplente || "" }
                                                                inputOnchange={(e) => {
                                                                    let fields = this.state.fields;
                                                                    let errors = this.state.errors;

                                                                    fields = validForm.handleChangeField("nombreSuplente", fields, e);
                                                                    errors = validForm.handleChangeErrors("nombreSuplente", errors,e);
                                                                    this.setState({
                                                                        fields: fields,
                                                                        errors: errors,
                                                                    });
                                                                }}
                                                                spanClass="error"
                                                                spanError={ this.state.errors.nombreSuplente || "" }
                                                                divClassSpanType={ 1 }
                                                                divClassSpan="input-group-addon"
                                                                divClassSpanI="fa fa-indent"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                {
                                                    this.state.fields.id !== 0 ?
                                                        <div className="form-group">
                                                            <label className="col-md-3 control-label">Fotografía actual</label>
                                                            <div className="col-md-9">
                                                                <ImageForMultipleResolution
                                                                    key={1}
                                                                    preview={true}
                                                                    previewData={this.state.fields.imagen || null}
                                                                    origin={auth.pathApi()}
                                                                />
                                                            </div>
                                                        </div> :
                                                        <div></div>
                                                }
                                                <div className="form-group">
                                                    <label className="col-md-3 control-label">Fotografía</label>
                                                    <div className="col-md-9">
                                                        <ImageForMultipleResolution
                                                            key={2}
                                                            handlerOnLoad={this.handlerOnLoadForImage}
                                                            resolutions={Constantes.congresistaResolutions}
                                                            prefix="figura" controlName="images-1"
                                                        />
                                                        <span className="error">{this.state.errors.imagen || ''}</span>
                                                    </div>
                                                </div>

                                            </div>
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
                                                            selectValue={this.state.item_select_tipo_contacto}
                                                            selectOnchange={this.handlerSelectTipoContacto}
                                                            selectoptions={this.state.data_select_tipo_contacto}
                                                            selectIsSearchable={false}
                                                            selectclassNamePrefix="selectReact__value-container"
                                                            spanClass=""
                                                            spanError="" >
                                                        </Select>
                                                    </div>
                                                    <div className="col-md-5">
                                                        <div className="input-group">
                                                            <span className="input-group-addon"><i className="fa fa-link"/></span>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                placeholder="http://..."
                                                                value = {this.state.item_dato_contacto.cuenta}
                                                                onChange={(e) => {
                                                                    let cuenta = e.currentTarget.value;

                                                                    this.setState((prevState) => ({
                                                                        ...prevState,
                                                                        item_dato_contacto: {
                                                                            ...prevState.item_dato_contacto,
                                                                            cuenta: cuenta
                                                                        }
                                                                    }));
                                                                }} />
                                                            <span className="input-group-addon wbtn">
                                                                <button type="button"
                                                                        onClick={() => {
                                                                            this.handlerCrearDatosContacto();
                                                                        }} className="btn btn-primary"><i className="fa fa-plus"/>
                                                                </button>
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <hr />
                                                <div className="redes-sociales-container">
                                                    {this.state.fields.persona_dato_contactos.map((item, i) => {
                                                        if (item.activo) {
                                                            return (
                                                                <div key={i} className="form-group">
                                                                    <label className="col-md-3 control-label"/>
                                                                    <div className="col-md-9">
                                                                        <div className="input-group">
                                                                            <span className="input-group-addon">
                                                                                <img
                                                                                    style={{ width: "100%" }}
                                                                                    alt='tipo_red_social'
                                                                                    src = {
                                                                                         this.renderDatoContacto(item.dato_contacto_id) != null
                                                                                             ? auth.pathApi() + this.renderDatoContacto(item.dato_contacto_id) || ""
                                                                                             : Constantes.NoImagenPicture
                                                                                     } />
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
                                                                                        onClick={() => { this.handlerEliminarDatosContacto(i) }}
                                                                                        className="btn btn-danger"
                                                                                ><i className="fa fa-trash-alt"/></button>
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                    <span className="error">{this.state.errors["persona_dato_contactos"][i]
                                                                        ? this.state.errors["persona_dato_contactos"][i].cuenta
                                                                        : ''}
                                                                    </span>
                                                                </div>
                                                            )
                                                        }
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="panel-body">
                                        <h3>Perfil</h3>
                                        <div className="col-md-12">
                                                    <div className="form-group">
                                                        <label className="col-md-3 control-label"> Grado de estudio </label>
                                                        <div className="col-md-9">
                                                            <div className="input-group">
                                                                <Select
                                                                    divClass=""
                                                                    selectplaceholder="Seleccione"
                                                                    selectValue={ this.state.item_select_grado_estudio }
                                                                    selectOnchange={ this.handlerSelectGradoEstudio }
                                                                    selectoptions={ this.state.data_select_grado_estudio }
                                                                    selectIsSearchable={ false }
                                                                    selectclassNamePrefix="selectReact__value-container"
                                                                    spanClass="error"
                                                                    spanError={ this.state.errors.grado_estudio_id || "" }
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="form-group">
                                                        <label className="col-md-3 control-label"> Profesión </label>
                                                        <div className="col-md-9">
                                                            <div className="input-group">
                                                                <Select
                                                                    divClass=""
                                                                    selectplaceholder="Seleccione"
                                                                    selectValue={ this.state.item_select_profesion }
                                                                    selectIsSearchable={ true }
                                                                    selectoptions={ this.state.data_select_profesion }
                                                                    selectOnchange={ this.handlerSelectProfesion }
                                                                    selectclassNamePrefix="selectReact__value-container"
                                                                    spanClass="error"
                                                                    spanError={ this.state.errors.profesion_id || "" }
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="form-group">
                                                        <label className="col-md-3 control-label">
                                                            Biografía
                                                        </label>
                                                        <div className="col-md-9">
                                                            <SunEditor
                                                                placeholder="..."
                                                                setContents={ this.state.fields.perfil_educativo || "" }
                                                                onChange={(e) => {
                                                                    let fields = this.state.fields;
                                                                    let errors = this.state.errors;

                                                                    fields = validForm.handleChangeFieldJodiEditor("perfil_educativo", fields, e);
                                                                    errors = validForm.handleChangeErrors("perfil_educativo", errors, e);
                                                                    this.setState({
                                                                        fields: fields,
                                                                        errors: errors,
                                                                    });
                                                                }}
                                                                lang="es"
                                                                setOptions={{
                                                                    buttonList: buttonList,
                                                                    height: 400,
                                                                }}
                                                            />
                                                            <span className="error">
                                                            { this.state.errors.perfil_educativo || "" }
                                                        </span>
                                                        </div>
                                                    </div>
                                                </div>
                                </div>
                                <div className="panel-body">
                                    <div className="row">
                                        <div className="panel-footer">
                                            <span className="error">
                                                { this.state.errors.submit || "" }
                                            </span>
                                            <ValidarPermiso
                                                IdModuloPermisoValidar={
                                                    this.state.fields["id"] === 0 ?
                                                        ModuloPermiso.Persona.Nuevo
                                                        : ModuloPermiso.Persona.Modificar
                                                }
                                                DefaultTemplate=
                                                    {
                                                        <button
                                                            type="button"
                                                            onClick={async (e) => {
                                                                await this.saveSubmit(e);
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
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            </>
        );
    }
}

export default CrearPersona;
