import React, { Component } from "react";
import AgendaDataService from "../../../Services/AgendaLegislativa/Agenda.Service";
import UtilsDataService from "../../../Services/General/Utils.Service";
import DatePicker from "../../../Components/DatePicker";
import Spinner from "../../../Components/Spinner";
import Select from "../../../Components/Select";
import Input from "../../../Components/Input";
import ValidForm from "../../../Utils/ValidForm";
import AuthLogin from "../../../Utils/AuthLogin";
import AccordionCheckbox from "../../../Components/AccordionCheckbox";
import * as FechaMysql from "../../../Utils/FormatDate";
import { ModuloPermiso } from "../../../Permisos/ModuloPermiso";
import ValidarPermiso from "../../../Permisos/ValidarPermiso";
import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css";
const auth = new AuthLogin();
const validForm = new ValidForm();
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

const defaultComision = {
    id: 0,
    agenda_legislativa_id: 0,
    corporacion_id:0,
    comision_id: 0,
    activo: 0,
    comision: {
        id: 0,
        nombre: "",
        corporacion: {
            id: 0,
            nombre: ""
        },
        tipo_comision: {
            id: 0,
            nombre: ""
        }
    }
}

const fieldsConst = {
    id: 0,
    fecha:new Date(),
    fecha_realizada:new Date(),
    dpfecha:new Date(),
    dpfechare:new Date(),
    comentarios:"",
    realizado:0,
    chkre:false,    
    cuatrienio_id:0,        
    comisiones: [],
    activo:1,
    user: auth.username()
};
const errorsConst = {
    id: "",
    fecha:"",
    fecha_realizada:"",
    corporacion_id:"",
    realizado:"",
    cuatrienio_id:"",       
    comisiones:"",
    activo: ""
};
const selectCorporacion={
    value: 0,label: "Seleccione la corporación"
}
const selectTComision={
    value: 0,label: "Seleccione el tipo de comisión"
}
const selectComision={
    value: 0,label: "Seleccione la comisión"
}
const selectRealizado={
    value: 0,label: "Seleccione el estatus de la actividad"
}
const selectCuatrienio={
    value: 0,label: "Seleccione el quinquenio"
}
let listaRealizado=[
    {
        value: 1,label: "Establecido"
    },
    {
        value: 2,label: "Realizado"
    },
    {
        value: 3,label: "No Realizado"
    }
]
class AgendaLegislativaCU extends Component{
    constructor(props){
        super(props);
        const id =
        this.props.match.params.id === undefined
                ? 0
                : this.props.match.params.id;
                this.state={
                    id:id,
                    fields:fieldsConst,                    
                    loading:true,
                    errors:errorsConst,
                    dataSelectCorporacion:[],
                    dataSelectTComision:[],
                    dataSelectComision:[],
                    dataSelectRealizado:listaRealizado,
                    dataSelectCuatrienio:[],
                    selectCorporacion:selectCorporacion,
                    selectTComision:selectTComision,
                    selectComision:selectComision,
                    selectRealizado:selectRealizado,
                    selectCuatrienio:selectCuatrienio,
                    txtComentarios:""
                }

    }
    componentDidMount = async ()=>{
        this.resetFiels();
        this.state.fields.id = this.state.id;
        this.state.fields.user = auth.username();
        let id= this.state.id;                  
        if (id != 0) 
            await this.getByID(id);
        this.getComboTComision();
        this.getComboCuatrienio();
    }
    getComboCuatrienio = async () => {
        this.setState({ loading: true });        
            await UtilsDataService.getComboCuatrienio().then(response => {
                let combo = [];
                let selected = { value: -1, label: "Seleccione el quinquenio" };
                response.data.forEach(i => {
                    combo.push({ value: i.id, label: i.nombre })
                    if(this.state.id != 0){
                        let idd = this.state.fields.cuatrienio_id;
                        if(idd === i.id)
                            selected = { value: i.id, label: i.nombre };
                    }
                })
                combo.unshift({ value: -1, label: "Seleccione el quinquenio" })
                this.setState({
                    dataSelectCuatrienio: combo,
                    selectCuatrienio: selected
                })
            })
            this.setState({ loading: false }); 
    }
    handlerSelectTComision = async (selectTComision) => {
        let fields = this.state.fields;
        fields.tipo_comision_id = selectTComision.value;
        this.setState({fields: fields, selectTComision: selectTComision});
        await this.getComboComisiones(this.state.fields.corporacion_id, selectTComision.value)
    }
    handlerSelectComision = async (selectComision) => {
        let fields = this.state.fields;
        fields.comision_id= selectComision.value;
        this.setState({fields: fields, selectComision: selectComision});
    }
    handlerSelectCuatrienio = async (selectCuatrienio) => {
        let fields = this.state.fields;
        fields.cuatrienio_id= selectCuatrienio.value;
        this.setState({fields: fields, selectCuatrienio: selectCuatrienio});
    }
   
    handlerAddComision = () => {
        this.state.errors.comisiones="";
        let comision = this.state.selectComision;
        let tipoComision=this.state.selectTComision;
        let repetido = this.state.fields.comisiones.filter((x) => {return x.comision_id === comision.value});

        if(repetido.length > 0)
            return false;
        let tipo = this.state.selectTComision;

        let newComision = {
            id: 0,
            agenda_legislativa_id: 0,
            tipo_comision_id:tipoComision.value,
            comision_id: comision.value,
            activo: 1,
            comision: {
                id: comision.value,
                nombre: comision.label,                
                tipo_comision: {
                    id: tipo.value,
                    nombre: tipo.label
                }               
            }
           
        };
        
        let fields = this.state.fields;
        fields.comisiones.push(newComision);
        this.setState({fields})
    }
    handlerRemoveComision = (comision, index) => {
        let fields = this.state.fields;
        if(comision.id === 0){
            fields.comisiones.splice(index, 1)
        }else{
            fields.comisiones[index].activo = 0;
        }
        this.setState({fields})
    }
    getComboTComision = async () => {
        this.setState({ loading: true });        
            await UtilsDataService.getComboTipoComision().then(response => {
                let combo = [];
                let selected = { value: -1, label: "Seleccione el tipo de comisión" };
                response.data.forEach(i => {
                    combo.push({ value: i.id, label: i.nombre })
                    if(this.state.id != 0){
                        let idd = this.state.fields.tipo_comision_id!==null?this.state.fields.tipo_comision_id:0;
                        if(idd === i.id)
                            selected = { value: i.id, label: i.nombre };
                    }
                })
                combo.unshift({ value: -1, label: "Seleccione el tipo de comisión" })
                this.setState({
                    dataSelectTComision: combo,
                    selectTComision: selected
                })
            })
            this.setState({ loading: false }); 
    }
    getComboComisiones = async (idTipoComision) => {
        this.setState({loading: true})
        await UtilsDataService.getComboComisiones(0, idTipoComision).then(response => {
            let combo = [];
            let selected = { value: 0, label: "Seleccione la comisión" };
            response.data.forEach(i => {
                combo.push({ value: i.id, label: i.nombre })
                if(this.state.id != 0){
                    let idd = this.state.fields.comision_id !== null ? this.state.fields.comision_id : 0;                    
                    if(idd === i.id)
                        selected = { value: i.id, label: i.nombre };
                                            
                }
            })
            combo.unshift({ value: 0, label: "Seleccione la comisión" })
            this.setState({
                dataSelectComisiones: combo,
                selectComision: selected,
                loading: false
            })
        })
    }
    getByID = async (id) => {
        this.setState({ loading: true });
        await AgendaDataService.get(id)
            .then(response => {
                let fields = this.state.fields;
                fields = response.data[0];
                console.log(fields);
                fields.comisiones=fields.agenda_comision;

                fields.fecha==null?fields.dpfecha=new Date():fields.dpfecha=new Date(fields.fecha);
                fields.dpfechare==null?fields.dpfechare=new Date():fields.dpfechare=new Date(fields.fecha_realizada+"T00:00:00");
                Object.assign(fields, { user: auth.username() });                                         
                this.setState({
                    fields: fields,
                    loading: false
                });
            })
            .catch(e => {
                this.setState({
                    loading: false
                });
                console.log(e);
            });
            if(this.state.fields.esComision){            
            this.getComboTComision(this.state.fields.corporacion_id);
            this.getComboComisiones(this.state.fields.corporacion_id, this.state.fields.tipo_comision_id);
        }
    }
    saveSubmit = async () => {
        
        let errors = this.state.errors;
        errors = validForm.cleanErrors(errors);
        this.setState({ errors: errors, loading: true });
        let responseData;
        let data = this.state.fields;
        data.realizado=data.chkre?1:0;
        data.fecha=FechaMysql.DateTimeFormatMySql(data.dpfecha);
        data.fecha_realizada=FechaMysql.DateFormatMySql(data.dpfechare);
        data.comentarios=this.state.txtComentarios;
        console.log(data);
        if(this.state.fields.comisiones.length>0){
            this.state.errors.comisiones="";
            if (this.state.fields["id"] === 0) {            
                await AgendaDataService.create(data)
                    .then(response => {
                        responseData = response.data;
                    })
                    .catch(function (error) {
                        errors = validForm.displayErrors(error.response.data, errors);
                    });
            }
            else {            
                await AgendaDataService.update(this.state.fields["id"], data)
                    .then(response => {
                        responseData = response.data;
                    })
                    .catch(function (error) {
                        errors = validForm.displayErrors(error.response.data, errors);
                    });
            }
        }else
        {
            this.state.errors.comisiones="Inserte por lo menos una comision";
        }
        
        this.setState({ errors: errors, loading: false });        
        if (responseData != null) {
            this.resetFiels();            
            this.props.history.goBack();            
        }        
    }
    resetFiels() {        
        let fields = fieldsConst;                
        this.setState({ fields: fields, errors: validForm.cleanErrors(this.state.errors) });
    }
    render(){
        return(
            <>
                <Spinner show={this.state.loading} />
                <ul className="breadcrumb">
                    <li>Agenda Legislativa</li>
                    <li>{this.state.fields.id!==0?"Editar":"Nueva"} fecha</li>
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
                                                fecha de la agenda
                                            </strong>
                                        </h3>
                                    </div>
                                    <div className="panel-body">
                                        <div className="row">
                                            <h3>Información de fecha de la agenda legislativa</h3>
                                            <div className="col-md-9">
                                                <div className="form-group">
                                                        <label className="col-md-3 control-label">Fecha</label>
                                                        <div className="col-md-9">
                                                            <div className="input-group">
                                                                <DatePicker
                                                                   showInputTime={true}
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
                                                        <label className="col-md-3 control-label">Fecha realizada</label>
                                                        <div className="col-md-9">
                                                            <div className="input-group">
                                                                <DatePicker
                                                                    id="dateInicio"                                                            
                                                                    divClass="input-group"
                                                                    dateSelected={this.state.fields["dpfechare"] || ''}
                                                                    onChangeDate={e => {
                                                                        let fields = this.state.fields;
                                                                        let errors = this.state.errors;                                                                       
                                                                        fields = validForm.handleChangeDateField("dpfechare", fields, e);
                                                                        errors = validForm.handleChangeErrors("fecha_realizada", errors, e);
                                                                        this.setState({ fields: fields, errors: errors });}}
                                                                    spanClass="error"
                                                                    spanError={this.state.errors["fecha_realizada"] || ''}
                                                                    divClassSpanType={1}
                                                                    divClassSpan="input-group-addon"
                                                                    divClassSpanI="fa fa-calendar"/>
                                                            </div>
                                                        </div>
                                                </div>
                                                <div className="form-group">
                                                    <label className="col-md-3 control-label">¿Realizada?</label>
                                                    <div className="col-md-9">
                                                    <div className="input-group">
                                                        <Input divClass="input-group"
                                                                inputName="Realizdo"
                                                                inputType="checkbox"
                                                                inputClass="form-control"
                                                                inputplaceholder="¿Se realizarón las actividades?"
                                                                checked
                                                                inputValue={this.state.fields.chkre?"checked":""}
                                                                inputOnchange={e => {
                                                                    let fields = this.state.fields;
                                                                    fields.chkre=e.target.checked?true:false;                                                                    
                                                                    this.setState({ fields: fields});                                                                  
                                                                }}
                                                                spanClass="error"
                                                                spanError={this.state.errors["realizado"] || ''}
                                                                divClassSpanType={1}
                                                                divClassSpan="input-group-addon"
                                                                divClassSpanI="fa fa-indent" />                                                      
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <label className="col-md-3 control-label">Quinquenio</label>
                                                    <div className="col-md-9">
                                                        <div className="input-group">
                                                            <Select
                                                                divClass=""
                                                                selectplaceholder="Seleccione"
                                                                selectValue={this.state.selectCuatrienio}
                                                                selectIsSearchable={false}
                                                                selectoptions={this.state.dataSelectCuatrienio}
                                                                selectOnchange={this.handlerSelectCuatrienio}
                                                                selectclassNamePrefix="selectReact__value-container"
                                                                spanClass="error"
                                                                spanError={this.state.errors["cuatrienio_id"] || ''} >
                                                            </Select>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <label className="col-md-3 control-label">Comentarios</label>
                                                    <div className="col-md-9">
                                                        <SunEditor
                                                            placeholder="..."
                                                            setContents={this.state.fields.comentarios || ""}
                                                            onChange={(e) => {
                                                                let fields = this.state;
                                                                let errors = this.state.errors;
                                                                fields = validForm.handleChangeFieldJodiEditor("txtComentarios",fields,e);
                                                                errors = validForm.handleChangeErrors("comentarios",errors,e);
                                                                this.setState({state: fields,errors: errors});
                                                            }}
                                                            lang="es"
                                                            setOptions={{
                                                                buttonList: buttonList,
                                                                height: 400,
                                                            }}
                                                        />
                                                        <span className="error">
                                                            {this.state.errors["comentarios"] || ""}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>      
                                    </div>
                                    <div className="panel-body">
                                        <div className="row">
                                            <h3>Comisiones</h3>
                                            <div className="col-md-6">
                                                <div className="form-group">
                                                    <label htmlFor="">Tipo de comisión</label>
                                                    <div className="input-group">
                                                        <Select
                                                            divClass=""
                                                            selectplaceholder="Seleccione"
                                                            selectValue={this.state.selectTComision}
                                                            selectIsSearchable={false}
                                                            selectoptions={this.state.dataSelectTComision}
                                                            selectOnchange={this.handlerSelectTComision}
                                                            selectclassNamePrefix="selectReact__value-container"
                                                            spanClass="error"
                                                            noOptionsMessage="Debe seleccionar un tipo de corporación"
                                                            spanError={this.state.errors.tipo_comision_id || ''} >
                                                        </Select>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group">
                                                    <label htmlFor="">Comisión</label>
                                                    <div className="input-group">
                                                        <Select
                                                            divClass=""
                                                            selectplaceholder="Seleccione"
                                                            selectValue={this.state.selectComision}
                                                            selectIsSearchable={false}
                                                            selectoptions={this.state.dataSelectComisiones}
                                                            selectOnchange={this.handlerSelectComision}
                                                            selectclassNamePrefix="selectReact__value-container"
                                                            spanClass="error"
                                                            noOptionsMessage="Debe seleccionar un tipo de comisión"
                                                            spanError={this.state.errors.comision_id || ''} >
                                                        </Select>
                                                        <span className="input-group-addon wbtn"><button onClick={this.handlerAddComision} type="button" className="btn btn-primary"><i className="fa fa-plus"></i></button></span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <hr/>
                                        <div className="row">
                                            {
                                                this.state.fields.comisiones.map((item, i) => {
                                                    if (item.activo === 1){
                                                        return (
                                                            <div className="col-md-4" key={i}>
                                                                <div className="comisionItem">
                                                                    <div className="nombre">
                                                                        {item.comision.nombre}
                                                                    </div>
                                                                    <div className="tipo">
                                                                        Tipo - {item.comision.tipo_comision.nombre}
                                                                    </div>
                                                                    <button type="button" onClick={()=>{this.handlerRemoveComision(item, i)}} className="btn btn-danger closeButton"><i className="fas fa-trash"></i></button>
                                                                </div>
                                                            </div>
                                                        )
                                                    }
                                                })
                                                
                                            }
                                            
                                        </div>
                                        <span className="error">
                                                {this.state.errors["comisiones"] || ""}
                                            </span>
                                    </div>
                                    <div className="panel-body">
                                        <div className="panel-footer">
                                            {
                                                this.state.fields["id"] === 0 ?
                                                <ValidarPermiso
                                                    IdModuloPermisoValidar={ModuloPermiso.AgendaLegislativa.Nuevo}
                                                    DefaultTemplate={
                                                        <button
                                                            type="button"
                                                            onClick={() => {this.saveSubmit();}}
                                                            className="btn btn-success pull-right">
                                                            <i className="fa fa-check"></i>{" "}
                                                                    Guardar
                                                        </button>
                                                    }/>
                                                    :
                                                    <ValidarPermiso
                                                    IdModuloPermisoValidar={ModuloPermiso.AgendaLegislativa.Modificar}
                                                    DefaultTemplate={
                                                        <button
                                                            type="button"
                                                            onClick={() => {this.saveSubmit();}}
                                                            className="btn btn-success pull-right">
                                                            <i className="fa fa-check"></i>{" "}
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
                </div>
            </>
        );
    }
}
export default AgendaLegislativaCU;