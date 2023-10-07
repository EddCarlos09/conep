import React, { Component } from 'react'
import congresoVisibleDataService from "../../../Services/Catalogo/CongresoVisible.Service";
import UtilsDataService from "../../../Services/General/Utils.Service";
import Input from "../../../Components/Input";
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

const auth = new AuthLogin();
const constFileds = {
    id: 0,
    nombre: "",
    descripcion: "",
    cargo_id: 0, 
    equipo_id: 0,
    datosContacto: [],   
    user: "",
};
const constErrors = {
    id: "",
    nombre: "",
    descripcion: "",
    imagen: "",
    datosContacto: [],   
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
const SelectCargo = { value: 0, label: 'Seleccione cargo' };

const validForm = new ValidForm();
class CrearIntegrante extends Component {
    constructor(props) {
        super(props);
        const idequipo =
            this.props.match.params.id === undefined
                ? 0
                : this.props.match.params.id;
        const idintegrante =
            this.props.match.params.idintegrante === undefined
                    ? 0
                    : this.props.match.params.idintegrante;
        this.state = {
            idequipo : idequipo,
            idintegrante: idintegrante,          
            loading: false,
            fields: constFileds,
            errors: constErrors,
            txtDescripcion:"",
            selectDatosContacto: SelectDatosContacto,
            dataSelectDatosContanto: [SelectDatosContacto],            
            selectCargo: SelectCargo,
            dataSelectCargo: [SelectCargo],
            url: "",
            datosContactoDetalle: [],         
            imagesResized: []
        };
    }

    componentDidMount = async () => {
        this.resetFields();       
        this.state.fields.id = this.state.id;
        this.state.fields.user = auth.username();

        let id = this.state.idintegrante;
        if (id != 0) await this.getByID(id);

        await this.getComboDatosContacto();      
        await this.getComboCargoIntegrante();

    };

    // combos
    getComboCargoIntegrante = async () => {
        this.setState({ loading: true });
        await UtilsDataService.getComboCargoIntegrante().then(response => {
            let combo = [];
            let selected = { value: -1, label: "Seleccione partido" };
            response.data.forEach(i => {
                combo.push({ value: i.id, label: i.nombre })     
                if(this.state.idintegrante !== 0){
                    let idd = this.state.fields.cargo_id;
                    if(idd === i.id)
                        selected = { value: i.id, label: i.nombre };
                }
            })
            combo.unshift({ value: -1, label: "Seleccione un cargo" })
            this.setState({
                dataSelectCargo: combo,  
                selectCargo:selected,      
                loading: false
            });
        });
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

    //End combos

    getByID = async (id) => {
        this.setState({ loading: true });
        await congresoVisibleDataService.getIntegrante(id)
            .then((response) => {
                let fields = this.state.fields;
                let errors = this.state.errors;
                fields = response.data[0];
                Object.assign(fields, { user: auth.username() });
                fields.datosContacto = fields.integrantes_contacto;  
                // fields.nombre = fields.nombre;
                // fields.cargo_id = fields.cargo_id;
                this.state.idequipo = fields.equipo_id;
                fields.datosContacto.map((item, i) => {
                    errors.datosContacto.push({
                        id: "",
                        contacto_id: "",
                        cuenta: "",
                        activo: "",
                    });
                    return null;
                });

                this.setState({
                    fields: fields,
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

    handleDatosContacto = async (selectOption) => {
        this.setState({ selectDatosContacto: selectOption });
    };
    handleCargo = async (selectOption) => {
        this.setState({ selectCargo: selectOption });
    };

    handlerAddDatosContacto = () => {
        let dato_contacto_id = this.state.selectDatosContacto.value;
        let url = this.state.url;
        if (url != "" && dato_contacto_id != 0) {
            let item = {
                id: 0,
                contacto_id: dato_contacto_id,
                integrante_id:this.state.idintegrante,
                cuenta: url,
                activo: 1,
            };
            let itemError = {
                id: "",
                contacto_id: "",
                cuenta: "",
                activo: "",
            };
            this.setState((prevState) => ({
                ...prevState,
                fields: {
                    ...prevState.fields,
                    datosContacto: [...prevState.fields.datosContacto, item],
                },
                errors: {

                    ...prevState.errors,
                    datosContacto: [
                        ...prevState.errors.datosContacto,
                        itemError,
                    ],
                },
            }));
        }
    }; 
    // End handlers for imageForMultipleResolution
    removeDatoContacto = (itemToRemove) => {
        let datosContacto = this.state.fields.datosContacto;
        let errorsdatosContacto = this.state.errors.datosContacto;

        datosContacto[itemToRemove]["activo"] = 0;
        errorsdatosContacto[itemToRemove]["cuenta"] = "";

        this.setState((prevState) => ({
            ...prevState,
            data: {
                ...prevState.data,
                datosContacto: datosContacto,
            },
        }));
    };

    renderDatoContacto = (idTipoContacto) => {
        let datosContacto = this.state.datosContactoDetalle;
        let elemento = datosContacto.find((x) => x.id == idTipoContacto);
        if (elemento != undefined) {
            let itemImagen = elemento.datos_contacto_imagen.find((x) => x.id === 1);
            if (itemImagen != undefined)
                return itemImagen.imagen;
        }
    };

    getComboDatosContacto = async () => {
        this.setState({ loading: true });
        await UtilsDataService.getComboDatosContacto()
            .then((response) => {               
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
        let data = this.state.fields;
        data.user = auth.username();
        data.cargo_id = this.state.selectCargo.value;
        data.id = this.state.idintegrante;  
        data.equipo_id = this.state.idequipo;   
        let responseData;

        if (data.id === 0) {
            await congresoVisibleDataService.createIntegrante(data)
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
            await congresoVisibleDataService.updateIntegrante(data.id, data)
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
                pathname: `/integrante-equipo/${data.equipo_id}`
            });
        }
    };

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
                    <li>{" "} {this.state.idintegrante === 0
                        ? "Crear" : "Editar"}{" "} integrante
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
                                                {this.state.idintegrante === 0
                                                    ? "Crear"
                                                    : "Editar"}{" "}
                                                integrante
                                            </strong>
                                        </h3>
                                    </div>
                                    <div className="panel-body">
                                        <div className="row">
                                            <h3>Información del integrante</h3>
                                            <div className="col-md-9">
                                                <div className="form-group">
                                                    <label className="col-md-3 control-label">
                                                        Nombre del integrante
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
                                                                        .fields
                                                                        .nombre ||
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
                                                                        "nombre",
                                                                        fields,
                                                                        e
                                                                    );
                                                                    errors = validForm.handleChangeErrors(
                                                                        "nombre",
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
                                                        Cargo del integrante
                                                    </label>
                                                    <div className="col-md-9">
                                                        <div style={{ minWidth: "200px" }}>
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
                                                        </div>
                                                    </div>
                                                </div>                                                
                                                <div className="form-group">
                                                    <label className="col-md-3 control-label">
                                                        Descripción
                                                    </label>
                                                    <div className="col-md-9">
                                                        <SunEditor
                                                            setContents={this.state.fields.descripcion || ""}
                                                            onChange={(e) => {
                                                                let fields = this.state.fields;
                                                                let errors = this.state.errors;
                                                                fields = validForm.handleChangeFieldJodiEditor("descripcion",fields,e);
                                                                errors = validForm.handleChangeErrors("descripcion",errors,e);
                                                                this.setState({
                                                                    fields:fields,
                                                                    errors: errors
                                                                });
                                                            }}
                                                            setOptions={{
                                                                buttonList: buttonList,
                                                                height: 400,
                                                            }}
                                                        />
                                                        <span className="error">
                                                            {this.state.errors[
                                                                "descripcion"
                                                            ] || ""}
                                                        </span>
                                                    </div>
                                                </div>                                            
                                                <div className="form-group">
                                                    <label className="col-md-3 control-label">
                                                        Datos de contacto
                                                    </label>
                                                    <div className="col-md-4">
                                                        <Select
                                                            divClass=""
                                                            selectplaceholder="Seleccione"
                                                            selectValue={
                                                                this.state
                                                                    .selectDatosContacto
                                                            }
                                                            selectOnchange={
                                                                this
                                                                    .handleDatosContacto
                                                            }
                                                            selectoptions={
                                                                this.state
                                                                    .dataSelectDatosContanto
                                                            }
                                                            selectIsSearchable={
                                                                false
                                                            }
                                                            selectclassNamePrefix="selectReact__value-container"
                                                            spanClass=""
                                                            spanError=""
                                                        ></Select>
                                                    </div>
                                                    <div className="col-md-5">
                                                        <div className="input-group">
                                                            <span className="input-group-addon">
                                                                <i className="fa fa-link"></i>
                                                            </span>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                placeholder="http://..."
                                                                onChange={(
                                                                    e
                                                                ) => {
                                                                    this.setState(
                                                                        {
                                                                            url:
                                                                                e
                                                                                    .currentTarget
                                                                                    .value,
                                                                        }
                                                                    );
                                                                }}
                                                            />
                                                            <span className="input-group-addon wbtn">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => {
                                                                        this.handlerAddDatosContacto();
                                                                    }}
                                                                    className="btn btn-primary"
                                                                >
                                                                    <i className="fa fa-plus"></i>
                                                                </button>
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                {/* <hr /> */}
                                                <div className="redes-sociales-container">
                                                    {this.state.fields[
                                                        "datosContacto"
                                                    ].map((item, i) => {
                                                        if (item.activo) {
                                                            return (
                                                                <div
                                                                    key={i}
                                                                    className="form-group"
                                                                >
                                                                    <label className="col-md-3 control-label"></label>
                                                                    <div className="col-md-9">
                                                                        <div className="input-group">
                                                                            <span className="input-group-addon">
                                                                                <img
                                                                                    style={{
                                                                                        width:
                                                                                            "100%",
                                                                                    }}
                                                                                    src={
                                                                                        this.renderDatoContacto(
                                                                                            item.dato_contacto_id
                                                                                        ) !=
                                                                                            null
                                                                                            ? auth.pathApi() +
                                                                                            this.renderDatoContacto(
                                                                                                item.dato_contacto_id
                                                                                            ) ||
                                                                                            ""
                                                                                            : Constantes.NoImagenPicture
                                                                                    }
                                                                                />
                                                                                {/* <i className={this.renderDatoContacto(item.dato_contacto_id)}></i> */}
                                                                            </span>
                                                                            <input
                                                                                type="text"
                                                                                name={
                                                                                    "cuenta" +
                                                                                    i.toString()
                                                                                }
                                                                                className="form-control"
                                                                                placeholder="Ingrese la cuenta"
                                                                                value={
                                                                                    item.cuenta ||
                                                                                    ""
                                                                                }
                                                                                readOnly={
                                                                                    true
                                                                                }
                                                                            />
                                                                            <span className="input-group-addon wbtn">
                                                                                <button
                                                                                    type="button"
                                                                                    onClick={() => {
                                                                                        this.removeDatoContacto(
                                                                                            i
                                                                                        );
                                                                                    }}
                                                                                    className="btn btn-danger"
                                                                                >
                                                                                    <i className="fa fa-trash-alt"></i>
                                                                                </button>
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                    <span className="error">
                                                                        {this
                                                                            .state
                                                                            .errors[
                                                                            "datosContacto"
                                                                        ][i]
                                                                            ? this
                                                                                .state
                                                                                .errors[
                                                                                "datosContacto"
                                                                            ][
                                                                                i
                                                                            ]
                                                                                .cuenta
                                                                            : ""}
                                                                    </span>
                                                                </div>
                                                            );
                                                        }
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    </div>                               
                                    <div className="panel-body">
                                        <div className="panel-footer">
                                            <ValidarPermiso
                                                IdModuloPermisoValidar = {this.state.idintegrante !== 0 ? ModuloPermiso.CongresoVisible.ModificarIntegranteEquipo : ModuloPermiso.CongresoVisible.NuevoIntegranteEquipo}
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
            </>
        );
    }
}

export default CrearIntegrante;