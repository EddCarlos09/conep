import React, { Component } from "react";
import AgendaActividadDataService from "../../../Services/AgendaLegislativa/AgendaActividad.Service"
import UtilsDataService from "../../../Services/General/Utils.Service";
import Spinner from "../../../Components/Spinner";
import Select from "../../../Components/Select";
import Input from "../../../Components/Input";
import ValidForm from "../../../Utils/ValidForm";
import AuthLogin from "../../../Utils/AuthLogin";
import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css"; // Import Sun Editor's CSS File
import { ModuloPermiso } from "../../../Permisos/ModuloPermiso";
import ValidarPermiso from "../../../Permisos/ValidarPermiso";
import CustomBuscador from "../../../Components/CustomBuscador";
import {Constantes} from "../../../Constants/Constantes.js";

const auth = new AuthLogin();
const validForm = new ValidForm();

const fieldsConst = {
    id: 0,agenda_legislativa_id:0,titulo:'',descripcion:'',tipo_actividad_id:0
    ,destacado:0,chkdest:false,proyecto_ley_id:0,activo:1,user: auth.username(),selected:""
};
const errorsConst = {
    id: "",agenda_legislativa_id:"",titulo:"",descripcion:"",tipo_actividad_id:"",
    proyecto_ley_id:""
};
const selectTActividad={
    value: 0,label: "Seleccione el tipo de actividad"
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
class AgendaLegislativaActividadesCU extends Component
{
    constructor(props){
        super(props);               
        const id =
        this.props.match.params.idAgenda === undefined
                ? 0
                : this.props.match.params.idAgenda;
        const id2 =
                this.props.match.params.idActividad === undefined
                        ? 0
                        : this.props.match.params.idActividad;
        this.tableHandlerProyecto = this.tableHandlerProyecto.bind(this);                                
                this.state={
                    id:id2,
                    idAgenda:id,
                    fields:fieldsConst,                    
                    loading:true,
                    errors:errorsConst,
                    dataSelectTActividad:[selectTActividad],                                     
                    selectTActividad:selectTActividad,                   
                    txtDescripcion:'',
                    buscadorProyecto: {
                        data: [],
                        selected: [],
                        imgOrigin: auth.pathApi(),
                        search: "",
                        page: 1,
                        rows: 5,
                        totalRows: 0,
                        info_columns: [
                            {column_name: 'id', accessor: 'id', show: false},
                            {column_name: 'Título', accessor: 'titulo', show: true},
                            {column_name: 'Alias', accessor: 'alias', show: true},
                            {column_name: 'Número en cámara', accessor: 'numero_camara', show: true},
                            {column_name: 'Número en senado', accessor: 'numero_senado', show: true},
                        ],
                        default_item: ''
                    }
                }

    }
    componentDidMount = async ()=>{
        this.resetFiels();
        this.state.fields.titulo="";
        this.state.fields.id = this.state.id;
        this.state.fields.user = auth.username();
        let id= this.state.id;               
        if (id != 0) 
            await this.getByID(id);
        await this.getComboTActividad();
        await this.getAllProyectos(this.state.buscadorProyecto.page, this.state.buscadorProyecto.rows, this.state.buscadorProyecto.search);        
    }
    async tableHandlerProyecto(page, rows, search) {        
        let buscador = this.state.buscadorProyecto;        
       buscador.page = page;
       buscador.rows = rows;
       buscador.search = search;
        console.log(buscador);
       this.setState({ buscadorProyecto: buscador });
       if (this.timeout) clearTimeout(this.timeout);
       this.timeout = setTimeout(
           async function () {
               await this.getAllProyectos(page, rows, search);
           }.bind(this),
           1000
       );
   }
   handlerChangeSearchForProyecto = (value) =>{
    let buscador = this.state.buscadorProyecto;
    buscador.search = value;
    this.setState({buscadorProyecto: buscador});
    }
handlerSelectProyecto = (item, selectMultiple) =>{
    if(selectMultiple){
        this.setState((prevState) => ({
            ...prevState,
            buscadorProyecto:{
                ...prevState.buscadorProyecto,
                selected: [
                    ...prevState.buscadorProyecto.selected,
                    item
                ]
            }
        }));
    }
    else{
        this.setState((prevState) => ({
            ...prevState,
            buscadorProyecto:{
                ...prevState.buscadorProyecto,
                selected: [item]
            }
        }));
    }
    console.log(item);
}
handlerSelectDeleteProyecto = (item, selectableProperty) => {
    let array = [...this.state.buscadorProyecto.selected];
    let index = this.get_index_in_array(selectableProperty, item[selectableProperty], array);
    if (index !== -1) {
        array.splice(index, 1);
        this.setState((prevState) => ({
            ...prevState,
            buscadorProyecto: {
                ...prevState.buscadorProyecto,
                selected: array
            }
        }));
    }
}
get_index_in_array = (key_find, value_find, array) => {
    for(let i = 0; i < array.length; i++){
        for (let key in array[i]) {
            if(key === key_find){
                if(array[i][key] === value_find){
                    return i;
                }
            }
        }
    }
    return -1;
}
    getAllProyectos = async (page, rows, search) => {
        this.setState({ loading: true });
        let tableInfo = this.state.buscadorProyecto;
        await AgendaActividadDataService.getAllProyectosLeySearch(            
            search,
            page,
            rows
        ).then((response) => {
            tableInfo.data = response.data;            
        })
        .catch((e) => {
            console.log(e);
        });

        await AgendaActividadDataService.getAllProyectosLeySearchtotalrecords(search)
            .then((response) => {
                tableInfo.totalRows = response.data;
            })
            .catch((e) => {
                console.log(e);
            });
        this.setState({
            buscadorProyecto: tableInfo,
            loading: false
        });
       
    };
    
    handlerSelectTActividad = async (selectTActividad) => {
        let fields = this.state.fields;
        fields.tipo_actividad_id= selectTActividad.value;
        this.setState({fields: fields, selectTActividad: selectTActividad});        
    }
    getComboTActividad = async () => {
        this.setState({ loading: true });        
            await UtilsDataService.getComboTipoActividadAgenda().then(response => {
                let combo = [];
                let selected = { value: -1, label: "Seleccione el tipo de actividad" };
                response.data.forEach(i => {
                    combo.push({ value: i.id, label: i.nombre })
                    if(this.state.id !== 0){
                        let idd = this.state.fields.tipo_actividad_id;
                        if(idd === i.id)
                            selected = { value: i.id, label: i.nombre };
                    }
                })
                combo.unshift({ value: -1, label: "Seleccione el tipo de actividad" })
                this.setState({
                    dataSelectTActividad: combo,
                    selectTActividad: selected
                })
            })
        this.setState({ loading: false }); 
    }
    getByID = async (id) => {
        this.setState({ loading: true });
        await AgendaActividadDataService.get(id)
            .then(response => {
                let fields = this.state.fields;
                let buscador=this.state.buscadorProyecto;
                let txtDescripcion = this.state.txtDescripcion;
                fields = response.data[0];                   
                txtDescripcion = fields.descripcion; 
                fields.chkdest=fields.destacado!=0?true:false;
                if(fields.proyecto_ley_id!=null){
                    buscador.selected.push(fields.selected);
                }
                
                Object.assign(fields, { user: auth.username() });                                         
                this.setState({
                    fields: fields,
                    loading: false,
                    buscadorProyecto:buscador,
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
        data.agenda_legislativa_id=this.state.idAgenda;
        data.destacado=data.chkdest?1:0;   
        data.proyecto_ley_id = this.state.buscadorProyecto.selected
        ? this.state.buscadorProyecto.selected.length > 0
            ? this.state.buscadorProyecto.selected[0].id
            : ''
        : '';                                                           
        if (this.state.fields["id"] === 0) {            
            await AgendaActividadDataService.create(data)
                .then(response => {
                    responseData = response.data;
                })
                .catch(function (error) {
                    errors = validForm.displayErrors(error.response.data, errors);
                });
        }
        else {            
            await AgendaActividadDataService.update(this.state.fields["id"], data)
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
        console.log("lorem");
        let field = fieldsConst;                
        this.setState({ fields: field, errors: validForm.cleanErrors(this.state.errors) });
    }
    render()
    {
        return(
            <>
                <Spinner show={this.state.loading} />
                <ul className="breadcrumb">
                    <li>Actividad de Agenda Legislativa</li>
                    <li>{this.state.fields.id!==0?"Editar":"Nueva"} actividad</li>
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
                                                    actividad de la agenda
                                                </strong>
                                            </h3>
                                    </div>
                                    <div className="panel-body">
                                        <div className="row">
                                            <h3>Información de la actividad de la agenda legislativa</h3>
                                            <div className="col-md-9">
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
                                                    <label className="col-md-3 control-label">Actividad  destacada</label>
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
                                                    <label className="col-md-3 control-label">Tipo actividad de agenda</label>
                                                    <div className="col-md-9">
                                                        <Select
                                                            divClass=""
                                                            selectplaceholder="Seleccione"
                                                            selectValue={this.state.selectTActividad}
                                                            selectOnchange={this.handlerSelectTActividad}
                                                            selectoptions={
                                                                this.state.dataSelectTActividad}
                                                            selectIsSearchable={false}
                                                            selectclassNamePrefix="selectReact__value-container"
                                                            spanClass="error"
                                                            spanError={this.state.errors["tipo_actividad_id"] || ""}                                                    
                                                        ></Select>
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <label className="col-md-3 control-label"> Proyecto relacionado </label>
                                                    <div className="col-md-9">
                                                        <div className="input-group">
                                                            <CustomBuscador
                                                                info_columns = { this.state.buscadorProyecto.info_columns }
                                                                default_item = {this.state.buscadorProyecto.default_item}
                                                                handler={this.tableHandlerProyecto}
                                                                handlerChangeSearch={this.handlerChangeSearchForProyecto}
                                                                handlerSelect={this.handlerSelectProyecto}
                                                                handlerDeleteSelect={this.handlerSelectDeleteProyecto}
                                                                data={this.state.buscadorProyecto.data}
                                                                imgDefault={Constantes.NoImagen}
                                                                imgOrigin={this.state.buscadorProyecto.imgOrigin}
                                                                pageExtends={this.state.buscadorProyecto.page}
                                                                pageSize={this.state.buscadorProyecto.rows}
                                                                totalRows={this.state.buscadorProyecto.totalRows}
                                                                search={this.state.buscadorProyecto.search}
                                                                selected={this.state.buscadorProyecto.selected}
                                                            />
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
                                                    IdModuloPermisoValidar={ModuloPermiso.AgendaLegislativa.NuevaActividad}
                                                    DefaultTemplate={
                                                        <button
                                                            type="button"
                                                            onClick={() => {this.saveSubmit();}}
                                                            className="btn btn-success pull-right">
                                                            <i className="fa fa-edit"></i>{" "}
                                                                    Guardar
                                                        </button>
                                                    }
                                                 />
                                                 :
                                                 <ValidarPermiso
                                                    IdModuloPermisoValidar={ModuloPermiso.AgendaLegislativa.ModificarActividad}
                                                    DefaultTemplate={
                                                        <button
                                                            type="button"
                                                            onClick={() => {this.saveSubmit();}}
                                                            className="btn btn-success pull-right">
                                                            <i className="fa fa-edit"></i>{" "}
                                                                    Guardar
                                                        </button>
                                                    }
                                                 />
                                            }
                                            
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
export default AgendaLegislativaActividadesCU