import React, { Component } from "react";
import BlogNdDataService from "../../../Services/BlogNd/BlogNd.Service";
import UtilsDataService from "../../../Services/General/Utils.Service";
import Input from "../../../Components/Input";
import ImageForMultipleResolution from "../../../Components/ImageForMultipleResolution";
import DatePicker from "../../../Components/DatePicker";
import Glosario from '../../../Components/Glosario';
import Spinner from "../../../Components/Spinner";
import Checkbox from "../../../Components/CheckBox";
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
const validForm = new ValidForm();
const fieldsConst = {
    id: 0,portada:null, conceptos: [],titulo:"",nivel_dificultad_blog_id:0,
    tema_blog_id:0, tipo_publicacion_id: 0, descripcion:"",destacado:0,chkdest:false,activo:1,
    fecha_publicacion:new Date(),dpfecha:new Date(),user: auth.username()
};
const errorsConst = {
    id: "",portada:"", conceptos: "", titulo:"",nivel_dificultad_blog_id:"",tema_blog_id:"",
    tipo_publicacion_id: "", descripcion:"",destacado:"",activo: ""
};
const selectNivel={
    value: 0,label: "Seleccione un nivel de dificultad"
}
const selectTema={
    value: 0,label: "Seleccione un tema blog"
}

const SelectTipoPublicacion={
    value: 0,label: "Seleccione un tipo de publicación"
}
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

class BlogNdCU extends Component{
    constructor(props){
        super(props);
        const id =
            this.props.match.params.id === undefined
                ? 0
                : this.props.match.params.id;
        this.state={
            id:id,
            fields:fieldsConst,
            filedsDelete: fieldsConst,
            loading:true,
            errors:errorsConst,
            dataSelectNivel:[selectNivel],
            dataSelectTema:[selectTema],
            selectNivel:selectNivel,
            selectTema:selectTema,
            selectTipoPublicacion: SelectTipoPublicacion,
            dataSelectTipoPublicacion: [SelectTipoPublicacion],
            imagesResized: [],
            glosarioSelected: [],
            glosarioData: [],
            txtDescripcion: ""
            
        }
    }
    componentDidMount = async() =>{
        this.resetFiels();
        this.state.fields.id = this.state.id;
        this.state.fields.user = auth.username();
        let id= this.state.id;                 
        if (id != 0) 
            await this.getByID(id);

        this.getComboTipoPublicacion();        
        this.getComboTema();
        this.getComboGlosarioLegislativo();
    }
    handleChangeStatus = async ({ file }, status) => {
        let fields = this.state.fields;
        fields.portada = file;
        if (status === "removed")
        fields.portada = null;
        this.setState({
            fields: fields
        })
    }
    handlerSelectTema = async (selectTema) => {
        let fields = this.state.fields;
        fields.tema_blog_id= selectTema.value;
        this.setState({fields: fields, selectTema: selectTema});
    }
    handlerSelectNivel = async (selectNivel) => {
        let fields = this.state.fields;
        fields.nivel_dificultad_blog_id= selectNivel.value;
        this.setState({fields: fields, selectNivel: selectNivel});
    }

    handlerSelectTipoPublicacion = async (selectTipoPublicacion) => {
        let fields = this.state.fields;
        fields.tipo_publicacion_id = selectTipoPublicacion.value;
        this.setState({fields: fields, selectTipoPublicacion: selectTipoPublicacion});
    }

    handlerOnLoadForImage = async (blob) => {
        let state = this.state;
        state.imagesResized = blob;
        this.setState({
            state
        })
    }


    selectWordHandler = (selectedWord) => {
        let fields = this.state.fields;
        let cFiltred = fields.conceptos.filter((x)=> {return x.glosario_legislativo_id === selectedWord.id})
        if(typeof cFiltred.length === 'undefined' || cFiltred.length === 0){ // Si no hay ninguno igual agregado
            let glosarioSelected = this.state.glosarioSelected;
            let conceptoObject = {
                id: 0,
                blog_nd_id: this.state.id,
                glosario_legislativo_id: selectedWord.id,
                activo: 1
            }
            glosarioSelected.push(selectedWord);
            fields.conceptos.push(conceptoObject);
            this.setState({glosarioSelected, fields})
        }
        else{ // Significa que lo encontró pero en activo 0
            fields.conceptos.forEach(x => {
                if(x.glosario_legislativo_id === selectedWord.id)
                    x.activo = 1
            })
        }
    }
    unselectWordHandler = (unselectedWord) => {
        let fields = this.state.fields;
        let glosarioSelected = this.state.glosarioSelected;

        let cFiltred = fields.conceptos.filter((x)=> {return x.glosario_legislativo_id === unselectedWord.id})[0]
        if(cFiltred.id === 0) // Si tiene 0 de id, entonces lo eliminamos e la lista
            fields.conceptos = fields.conceptos.filter((x)=> {return x.glosario_legislativo_id !== unselectedWord.id})
        else{ // Si no, solo ponemos el activo en falso
            fields.conceptos.forEach(x => {
                if(x.glosario_legislativo_id === unselectedWord.id)
                    x.activo = 0
            })
        }
        glosarioSelected = glosarioSelected.filter((x)=> {return x.id !== unselectedWord.id}) //Aquí si o si lo eliminamos
        this.setState({glosarioSelected, fields})
    }

    
    getComboTema = async () => {
        this.setState({ loading: true });        
            await UtilsDataService.getComboTemaBlog().then(response => {
                let combo = [];
                let selected = { value: -1, label: "Seleccione tema blog" };
                response.data.forEach(i => {
                    combo.push({ value: i.id, label: i.nombre })
                    if(this.state.id != 0){
                        let idd = this.state.fields.tema_blog_id;
                        if(idd === i.id)
                            selected = { value: i.id, label: i.nombre };
                    }
                })
                combo.unshift({ value: -1, label: "Seleccione tema blog" })
                this.setState({
                    dataSelectTema: combo,
                    selectTema: selected
                })
            })
            this.setState({ loading: false }); 
    }

    getComboTipoPublicacion = async () => {
        await UtilsDataService.getComboTipoPublicaicon().then(response => {
            let combo = [];
            let selected = SelectTipoPublicacion;
            response.data.forEach(i => {
                combo.push({ value: i.id, label: i.nombre })
                if(this.state.id !== 0){
                    let fields = this.state.fields;
                    if(fields != null){
                        if(fields.tipo_publicacion_id === i.id)
                            selected = { value: i.id, label: i.nombre };
                    }
                }
            })
            combo.unshift(SelectTipoPublicacion)
            this.setState({
                dataSelectTipoPublicacion: combo,
                selectTipoPublicacion: selected,
            })
        })
    }

    getComboGlosarioLegislativo = async () => {
        let glosario = this.state.glosarioData;
        await UtilsDataService.getComboGlosarioLegislativo().then(response => {
            glosario = response.data;
        })
        let fields = this.state.fields;
        let glosarioSelected = [];
        fields.conceptos.forEach(x => {
            glosarioSelected.push(glosario.filter((y)=> { return y.id === x.glosario_legislativo_id })[0])
        });
        this.setState({glosarioData: glosario, glosarioSelected})
    }

    getByID = async (id) => {
        this.setState({ loading: true });
        await BlogNdDataService.get(id)
            .then(response => {
                let fields = this.state.fields;
                fields=response.data[0];
                let txtDescripcion = this.state.txtDescripcion;                
                fields.chkdest=fields.destacado!=0?true:false;
                Object.assign(fields, { user: auth.username() });
                fields.portada = fields.blog_nd_portada;      
                txtDescripcion = fields.descripcion;  
                fields.dpfecha=fields.fecha_publicacion;
                this.setState({
                    fields: fields,
                    loading: false,
                    txtDescripcion
                });
            })
            .catch(e => {
                this.setState({
                    loading: false
                });
                console.log(e);
            });
    }
    saveSubmit = async () => {
        
        let errors = this.state.errors;
        errors = validForm.cleanErrors(errors);
        this.setState({ errors: errors, loading: true });

        let responseData;
        let data = this.state.fields;
        data.descripcion = this.state.txtDescripcion;
        data.destacado=data.chkdest?1:0;
        data.fecha_publicacion=FechaMysql.DateFormatMySql(data.dpfecha);
        if(this.state.imagesResized.length!==0){            
            data.portada = this.state.imagesResized;
        }        
        data.activo=1;
        console.log(data);
            
        if (this.state.fields["id"] === 0) {            
            await BlogNdDataService.create(data)
                .then(response => {
                    responseData = response.data;
                })
                .catch(function (error) {
                    errors = validForm.displayErrors(error.response.data, errors);
                });
        }
        else {
            
            await BlogNdDataService.update(this.state.fields["id"], data)
                .then(response => {
                    responseData = response.data;
                })
                .catch(function (error) {
                    errors = validForm.displayErrors(error.response.data, errors);
                });
        }
        this.setState({ errors: errors, loading: false });        
        if (responseData != null) {
            this.resetFiels();            
            this.props.history.goBack();            
        }
    }
    resetFiels() {
        let fields = fieldsConst;
        fields.conceptos = [];
        let filedsDelete = validForm.resetObject(fieldsConst);
        if(document.querySelector(".ImageForMultipleResolutionCloseButton")){
            document.querySelector(".ImageForMultipleResolutionCloseButton").click();
        }            
        this.setState({ fields: fields, imagesResized: [], filedsDelete: filedsDelete, errors: validForm.cleanErrors(this.state.errors) });
    }
    render(){
        return(
            <>
            <Spinner show={this.state.loading} />
                <ul className="breadcrumb">
                    <li>Blog Nuestra Democracia</li>
                    <li>{this.state.fields.id!==0?"Editar":"Nueva"} entrada</li>
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
                                                    ? "Nueva"
                                                    : "Editar"}{" "}
                                                entrada del blog
                                            </strong>
                                        </h3>
                                    </div>
                                    <div className="panel-body">
                                        <div className="row">
                                            <h3>Información de entrada del blog</h3>
                                            <div className="col-md-9">
                                            <div className="form-group">
                                                        <label className="col-md-3 control-label">
                                                            Fecha
                                                        </label>
                                                        <div className="col-md-9">
                                                            <div className="input-group">
                                                                <DatePicker
                                                                    id="dateInicio"                                                                    
                                                                    divClass="input-group"
                                                                    dateSelected={this.state.fields["dpfecha"] || ''}
                                                                    onChangeDate={e => {
                                                                        let fields = this.state.fields;
                                                                        let errors = this.state.errors;
                                                                        fields = validForm.handleChangeDateField("dpfecha", fields, e);
                                                                        errors = validForm.handleChangeErrors("fecha", errors, e);
                                                                        this.setState({ fields: fields, errors: errors });}}
                                                                    spanClass="error"
                                                                    spanError={this.state.errors["fecha"] || ''}
                                                                    divClassSpanType={1}
                                                                    divClassSpan="input-group-addon"
                                                                    divClassSpanI="fa fa-calendar"/>
                                                            </div>
                                                        </div>
                                                </div>    
                                            <div className="form-group">
                                                    <label className="col-md-3 control-label">
                                                        Portada actual
                                                    </label>
                                                    <div className="col-md-9">
                                                        <ImageForMultipleResolution
                                                            key={1}
                                                            preview={true}
                                                            previewData={this.state.fields.portada ||null}
                                                            previewImageKey={"portada"}
                                                            origin={auth.pathApi()}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <label className="col-md-3 control-label">Portada</label>
                                                    <div className="col-md-9">
                                                        <ImageForMultipleResolution
                                                            key={2}
                                                            handlerOnLoad={this.handlerOnLoadForImage}
                                                            resolutions={Constantes.blogNdResolutions}
                                                            handlerOnReset={this.handlerOnResetForImage}
                                                            prefix="figura"
                                                            controlName="images-1"
                                                        />
                                                        <span className="error">
                                                            {this.state.errors["portada"] || ""}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <label className="col-md-3 control-label">Título</label>
                                                    <div className="col-md-9">
                                                    <div className="input-group">
                                                            <Input divClass="input-group"
                                                                inputName="titulo"
                                                                inputType="text"
                                                                inputClass="form-control"
                                                                inputplaceholder="Ingrese el titulo"
                                                                inputValue={this.state.fields.titulo || ''}
                                                                inputOnchange={e => {
                                                                    let fields = this.state.fields;
                                                                    let errors = this.state.errors;
                                                                    fields = validForm.handleChangeField("titulo", fields, e);
                                                                    errors = validForm.handleChangeErrors("titulo", errors, e);
                                                                    this.setState({ fields: fields, errors: errors });
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
                                                    <label className="col-md-3 control-label">Post destacado</label>
                                                    <div className="col-md-9">
                                                        <div className="input-group">
                                                        <Input divClass="input-group"
                                                                inputName="Destacado"
                                                                inputType="checkbox"
                                                                inputClass="form-control"
                                                                inputplaceholder="¿Destacar esta publicación?"
                                                                checked
                                                                inputValue={this.state.fields.chkdest?"checked":""}
                                                                inputOnchange={e => {
                                                                    let fields = this.state.fields;
                                                                    fields.chkdest=e.target.checked?true:false;                                                                    
                                                                    this.setState({ fields: fields});                                                                  
                                                                }}
                                                                spanClass="error"
                                                                spanError={this.state.errors["destacado"] || ''}
                                                                divClassSpanType={1}
                                                                divClassSpan="input-group-addon"
                                                                divClassSpanI="fa fa-indent" /> 
                                                        
                                                        </div>
                                                    </div>
                                                </div> 
                                                <div className="form-group">
                                                    <label className="col-md-3 control-label">Tema de la entrada del blog</label>
                                                    <div className="col-md-9">
                                                        <div className="input-group">
                                                            <Select
                                                                divClass=""
                                                                selectplaceholder="Seleccione"
                                                                selectValue={this.state.selectTema}
                                                                selectIsSearchable={false}
                                                                selectoptions={this.state.dataSelectTema}
                                                                selectOnchange={this.handlerSelectTema}
                                                                selectclassNamePrefix="selectReact__value-container"
                                                                spanClass="error"
                                                                spanError={this.state.errors["tema_blog_id"] || ''} >
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
                                                                selectValue={this.state.selectTipoPublicacion}
                                                                selectIsSearchable={false}
                                                                selectoptions={this.state.dataSelectTipoPublicacion}
                                                                selectOnchange={this.handlerSelectTipoPublicacion}
                                                                selectclassNamePrefix="selectReact__value-container"
                                                                spanClass="error"
                                                                spanError={this.state.errors["tipo_publicacion_id"] || ''} >
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
                                                <div className="form-group">
                                                    <label className="col-md-3 control-label">Descripción</label>
                                                    <div className="col-md-9">
                                                        <SunEditor
                                                            placeholder="..."
                                                            setContents={this.state.txtDescripcion || ""}
                                                            onChange={(e) => {
                                                                let fields = this.state;
                                                                let errors = this.state.errors;
                                                                fields = validForm.handleChangeFieldJodiEditor("txtDescripcion",fields,e);
                                                                errors = validForm.handleChangeErrors("descripcion",errors,e);
                                                                this.setState({state: fields,errors: errors});
                                                            }}
                                                            lang="es"
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
                                        <div className="panel-footer">
                                            {
                                                 this.state.fields["id"] === 0 ?
                                                 <ValidarPermiso
                                                 IdModuloPermisoValidar={ModuloPermiso.BlogNuestraDemocracia.Nuevo}
                                                 DefaultTemplate={
                                                    <button
                                                        type="button"
                                                        onClick={() => {this.saveSubmit();}}
                                                        className="btn btn-success pull-right">
                                                        <i className="fa fa-edit"></i>{" "}
                                                        Guardar
                                                    </button>
                                                 }/>
                                                 :
                                                 <ValidarPermiso
                                                 IdModuloPermisoValidar={ModuloPermiso.BlogNuestraDemocracia.Modificar}
                                                 DefaultTemplate={
                                                    <button
                                                        type="button"
                                                        onClick={() => {this.saveSubmit();}}
                                                        className="btn btn-success pull-right">
                                                        <i className="fa fa-edit"></i>{" "}
                                                            Guardar
                                                        </button>
                                                 }/>
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
export default BlogNdCU;