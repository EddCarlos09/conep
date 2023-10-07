import React, { Component } from 'react';
import AuthLogin from "../../../Utils/AuthLogin";
import OpinionCongresistaDataService from "../../../Services/ContenidoMultimedia/OpinionCongresista.Service";
import UtilsDataService from "../../../Services/General/Utils.Service";
import BuscadorPersona from '../../../Components/BuscadorPersona';
import Spinner from "../../../Components/Spinner";
import Select from "../../../Components/Select";
import DatePicker from '../../../Components/DatePicker';
import ValidForm from "../../../Utils/ValidForm";
import SunEditor from "suneditor-react";
import * as FechaMysql from "../../../Utils/FormatDate";
import Input from "../../../Components/Input";
import ImageForMultipleResolution from "../../../Components/ImageForMultipleResolution";
import { Constantes } from "../../../Constants/Constantes.js";
import { ModuloPermiso } from "../../../Permisos/ModuloPermiso";
import ValidarPermiso from "../../../Permisos/ValidarPermiso";

const auth = new AuthLogin();
const constFileds = {
    id: 0,
    titulo: "",
    persona_id: 0,
    tipo_publicacion_id:0,
    resumen:"",
    fechaPublicacion:new Date(),
    opinion: "",
    imagen: null,
    user: "",
};
const constErrors = {
    id: "",
    titulo: "",
    persona_id: "",
    tipo_publicacion_id: "",
    resumen:"",
    fechaPublicacion:"",
    opinion: "",
    imagen: "",
    pathFoto: "",
};
const SelectPublicacion = { value: 0, label: 'Seleccione tipo de publicación' };

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
class CrearOpinionCongresista extends Component {
    constructor(props) {
        super(props);
        const id =
            this.props.match.params.id === undefined
                ? 0
                : this.props.match.params.id;
        this.state = {
            id:id,
            loading: false,
            data: constFileds,
            errors: constErrors,
            url: "",
            imagesResized: [],
            txtResumen:"",
            txtOpinion:"",
            buscadorPersona: {
                data: [],
                selected: {id: 0},
                imgOrigin: auth.pathApi(),
                search: "",
                page: 1,
                rows: 15,
                totalRows: 0
            },
            selectPublicacion: SelectPublicacion,
            dataSelectPublicacion: [SelectPublicacion],
        };
    };
    async paginationPersona(page, rows, search) {
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

    componentDidMount = async () => {
        this.resetFields();

        let id = this.state.id;
        if (id != 0) await this.getByID(id);
        else this.resetFields();
        await this.getAllPersonas(1, this.state.buscadorPersona.page, this.state.buscadorPersona.rows, this.state.buscadorPersona.search);
        await this.getComboCongresista();
        await this.getcomboPublicacion();
    };
    handlerOnLoadForImage = async (blob) => {
        let state = this.state;
        state.imagesResized = blob;
        this.setState({
            state
        })
    }
    handleCongresista = async (selectOption) => {
        this.setState({ selectCongresista: selectOption });
    };
    handlePublicacion = async (selectOption) => {
        this.setState({ selectPublicacion: selectOption });
    };
    getAllPersonas = async (idFilterActive, page, rows, search) => {
        this.setState({ loading: true });
        let tableInfo = this.state.buscadorPersona;
        await OpinionCongresistaDataService.getComboPersonas(
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

        await OpinionCongresistaDataService.totalrecordsComboPersonas(idFilterActive, search)
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
    getByID = async (id) => {
        this.setState({ loading: true });
        await OpinionCongresistaDataService.get(id)
            .then((response) => {
                let state = this.state;
                let errors = this.state.errors;
                state.data = response.data[0];
                state.buscadorPersona.selected = response.data[0].persona;
                Object.assign(state.data, { user: auth.username() });
                state.data.imagen = state.data.opinion_congresista_imagen;
                state.txtResumen = state.data.resumen;
                state.txtOpinion = state.data.opinion;
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
    getComboCongresista = async () => {
        this.setState({ loading: true });
        await UtilsDataService.getComboCargoCongresista().then(response => {
            let combo = [];
            let selected = { value: -1, label: "Seleccione un congresista" };
            response.data.forEach(i => {
                combo.push({ value: i.id, label: i.nombre })
                if(this.state.id !== 0){
                    let idd = this.state.data.congresista_id;
                    if(idd === i.id)
                        selected = { value: i.id, label: i.nombre };
                }
            })
            combo.unshift({ value: -1, label: "Seleccione un congresista" })
            this.setState({
                dataSelectCongresista: combo,
                selectCongresista:selected,
                loading: false
            });
        });
    };
    getcomboPublicacion = async () => {
        this.setState({ loading: true });
        await UtilsDataService.getComboTipoPublicaicon().then(response => {
            let combo = [];
            let selected = { value: -1, label: "Seleccione tipo de publicación" };
            response.data.forEach(i => {
                combo.push({ value: i.id, label: i.nombre })
                if(this.state.id !== 0){
                    let idd = this.state.data.tipo_publicacion_id;
                    if(idd === i.id)
                        selected = { value: i.id, label: i.nombre };
                }
            })
            combo.unshift({ value: -1, label: "Seleccione tipo de publicación" })
            this.setState({
                dataSelectPublicacion: combo,
                selectPublicacion:selected,
                loading: false
            });
        });
    };
    saveSubmit = async () => {
        let errors = this.state.errors;
        errors = validForm.cleanErrors(errors);
        this.setState({ errors: errors, loading: true });
        let data = this.state.data;
        data.imagen = this.state.imagesResized;
        data.persona_id = this.state.buscadorPersona.selected.id;
        data.user = auth.username();
        data.resumen = this.state.txtResumen;
        data.opinion = this.state.txtOpinion;
        data.congresista_id = this.state.selectCongresista.value;
        data.tipo_publicacion_id = this.state.selectPublicacion.value;
        data.fechaPublicacion = FechaMysql.DateFormatMySql(data.fechaPublicacion);
        let responseData;
        if (data.id === 0) {
            await OpinionCongresistaDataService.create(data)
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
            await OpinionCongresistaDataService.update(data.id, data)
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
                pathname: `/opinion-congresista`
            });
        }
    };
    resetFields() {
        let fields = Object.assign({}, constFileds);
        this.setState({
            data: fields,
            errors: validForm.cleanErrors(this.state.errors),
        });
    };

    render() {
        return (
            <div>
                <Spinner show={this.state.loading} />
                <ul className="breadcrumb">
                    <li>Contenido Multimedia</li>
                    <li>{this.state.data["id"] === 0 ? "Nueva" : "Editar"}{" "} Opinión de Congresistas</li>
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
                                                    ? "Nueva"
                                                    : "Editar"}{" "}
                                                Opinión de Congresistas
                                            </strong>
                                        </h3>
                                    </div>
                                    <div className="panel-body">
                                        <div className="row">
                                            <h3>Información de la opinión de Congresistas</h3>
                                            <div className="col-md-9">
                                                <div className="form-group">
                                                    <label className="col-md-3 control-label">Título</label>
                                                    <div className="col-md-9">
                                                        <div className="input-group">
                                                            <Input
                                                                divClass="input-group"
                                                                inputName="nombre"
                                                                inputType="text"
                                                                inputClass="form-control"
                                                                inputplaceholder="Ingrese el título"
                                                                inputValue={this.state.data.titulo || ""}
                                                                inputOnchange={(e) => {
                                                                    let data = this.state.data;
                                                                    let errors = this.state.errors;
                                                                    data = validForm.handleChangeField("titulo",data,e);
                                                                    errors = validForm.handleChangeErrors("titulo",errors,e);
                                                                    this.setState({
                                                                            data: data,
                                                                            errors: errors,
                                                                        });
                                                                }}
                                                                spanClass="error"
                                                                spanError={this.state.errors["titulo"] || ""}
                                                                divClassSpanType={1}
                                                                divClassSpan="input-group-addon"
                                                                divClassSpanI="fa fa-indent"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <label className="col-md-3 control-label">Persona autor</label>
                                                    <div className="col-md-9">
                                                        <BuscadorPersona handler={this.paginationPersona} handlerChangeSearch={this.handlerChangeSearchForPersona} handlerSelectPersona={this.handlerSelectPersona} data={this.state.buscadorPersona.data} imgDefault={Constantes.NoImagen} imgOrigin={this.state.buscadorPersona.imgOrigin} pageExtends={this.state.buscadorPersona.page} pageSize={this.state.buscadorPersona.rows} totalRows={this.state.buscadorPersona.totalRows} search={this.state.buscadorPersona.search} selected={this.state.buscadorPersona.selected} />
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <label className="col-md-3 control-label">Tipo de publicación</label>
                                                    <div className="col-md-9">
                                                        <div style={{ minWidth: "200px" }}>
                                                        <Select
                                                            divClass=""
                                                            selectplaceholder="Seleccione"
                                                            selectValue={this.state.selectPublicacion}
                                                            selectOnchange={this.handlePublicacion}
                                                            selectoptions={this.state.dataSelectPublicacion}
                                                            selectIsSearchable={true}
                                                            selectclassNamePrefix="selectReact__value-container"
                                                            spanClass="error"
                                                            spanError={this.state.errors["tipo_publicacion_id"] || ""}
                                                        >
                                                        </Select>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <label className="col-md-3 control-label">Fecha de publicacion</label>
                                                    <div className="col-md-9">
                                                        <div className="input-group">
                                                        <DatePicker
                                                                id="fechaPublicacion"
                                                                showInputTime={false}
                                                                divClass="input-group"
                                                                dateSelected={this.state.data.fechaPublicacion ||""}
                                                                onChangeDate={(e) => {
                                                                    let fields = this.state.data;
                                                                    let errors = this.state.errors;
                                                                    fields = validForm.handleChangeDateField("fechaPublicacion",fields, e);
                                                                    errors = validForm.handleChangeErrors("fechaPublicacion",errors,e);
                                                                    this.setState({
                                                                            fields: fields,
                                                                            errors: errors,});
                                                                }}
                                                                spanClass="error"
                                                                spanError={this.state.errors["fechaPublicacion"] || ""}
                                                                divClassSpanType={1}
                                                                divClassSpan="input-group-addon"
                                                                divClassSpanI="fa fa-calendar"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <label className="col-md-3 control-label">
                                                        Resumen
                                                    </label>
                                                    <div className="col-md-9">
                                                        <SunEditor
                                                            placeholder="..."
                                                            setContents={this.state.txtResumen || ""}
                                                            onChange={(e) => {
                                                                let state = this.state;
                                                                let errors = this.state.errors;
                                                                state = validForm.handleChangeFieldJodiEditor("txtResumen",state,e);
                                                                errors = validForm.handleChangeErrors("resumen",errors,e);
                                                                this.setState({
                                                                    state,
                                                                    errors: errors,
                                                                });
                                                            }}
                                                            lang="es"
                                                            setOptions={{
                                                                buttonList: buttonList,
                                                                height: 100,
                                                            }}
                                                        />
                                                        <span className="error">
                                                            {this.state.errors["resumen"] || ""}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <label className="col-md-3 control-label">
                                                        Opinión
                                                    </label>
                                                    <div className="col-md-9">
                                                        <SunEditor
                                                            placeholder="..."
                                                            setContents={this.state.txtOpinion || ""}
                                                            onChange={(e) => {
                                                                let state = this.state;
                                                                let errors = this.state.errors;
                                                                state = validForm.handleChangeFieldJodiEditor("txtOpinion",state,e);
                                                                errors = validForm.handleChangeErrors("opinion",errors,e);
                                                                this.setState({
                                                                    state,
                                                                    errors: errors,
                                                                });
                                                            }}
                                                            lang="es"
                                                            setOptions={{
                                                                buttonList: buttonList,
                                                                height: 200,
                                                            }}
                                                        />
                                                        <span className="error">
                                                            {this.state.errors["opinion"] || ""}
                                                        </span>
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
                                                            handlerOnLoad={this.handlerOnLoadForImage}
                                                            resolutions={Constantes.opinionResolutions}
                                                            handlerOnReset={this.handlerOnResetForImage}
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
                                                IdModuloPermisoValidar = {this.state.id !== 0 ? ModuloPermiso.OpinionCongresista.Modificar : ModuloPermiso.OpinionCongresista.Nuevo }
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

export default CrearOpinionCongresista;
