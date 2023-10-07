import React, {Component} from "react";
import ProyectoLeyfieldsService from "../../../Services/Congreso/ProyectoLey.Service";
import Spinner from "../../../Components/Spinner";
import ValidForm from "../../../Utils/ValidForm";
import AuthLogin from "../../../Utils/AuthLogin";
import {ModuloPermiso} from "../../../Permisos/ModuloPermiso";
import ValidarPermiso from "../../../Permisos/ValidarPermiso";

import 'react-dropzone-uploader/dist/styles.css'
import * as FileCfg from "../../../Utils/FileConfig";
import Dropzone from 'react-dropzone-uploader'

const title_lowercase = "documento de proyecto de ley";
const title_sentence = "Documento de Proyecto de ley";
const auth = new AuthLogin();
const fieldsConst = {
    id: 0,                      proyecto_ley_id: "",        url_archivo: "", archivo : "",
    usercreated: "", usermodifed:""
};
const errorsConst = {
    id: 0,                      proyecto_ley_id: "",        urel_archivo: "", archivo: ""
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
const defaultItemSearch = {
    nombre: "",
    corporacion_id: "",
    cuatrienio_id: "",
    tipo_comision_id: "",
};
const default_item_desactivar = { id_item:'', titulo_item: '', activo: ''};
const validForm = new ValidForm();

class CrearDocumentoProyectoLey extends Component {
    constructor(props) {
        super(props);        
        document.addEventListener('click', this.handlerClick, true);

        this.state = {
            loading: false,
            fields: Object.assign({}, fieldsConst),
            errors: Object.assign({}, errorsConst),
            url: "",
            action: "Nuevo",
            title_lowercase: title_lowercase,
            title_sentence: title_sentence,
            autores_otros: [],
            item_desactivar: Object.assign({},default_item_desactivar),

        };
    }


    handleChangeStatus = ({ meta, file }, status) => {

        let item_alerta = this.state.fields;
        let item_error_alerta = this.state.errors;
        item_alerta.archivo = file;
        var sizefile = parseInt(file.size / 1024);
        item_error_alerta = validForm.cleanErrors(item_error_alerta);
        if (item_alerta.archivo != null && item_alerta.archivo != undefined) {
            if(sizefile > 500000){
                item_error_alerta.archivo = "El tamaño del archivo no debe ser mayor a 50MB";
            }else{
                let fileext = FileCfg.GetInfoFile(file);
                let typesext = FileCfg.TypesAccepted([FileCfg.Documents]);
                if (typesext.indexOf(fileext) === -1) {
                    item_error_alerta.archivo = "Selecciona un archivo válido";

                    this.setState({ item_error_alerta: item_error_alerta, });
                    return false;
                }
                this.setState({ item_alerta: item_alerta, });
            }

        } else {
            item_error_alerta.archivo = "Seleccione un archivo";
        }

    }

    componentDidMount = async () => {
        this.setState({ loading: true });
        let id = this.obtenerId();
        console.log(id);
        if(id !== 0)
        {
            let fields = this.state.fields;
            fields.proyecto_ley_id = id;
            this.setState({fields : fields,
            loading: false});
        }
        this.setState({
            loading: false});
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

    // obtenerIdProyectoLey=() => {
    //     let valores = window.location.search;
    //     console.log(valores);
    //     let urlParams = new URLSearchParams(valores);
    //     console.log(urlParams);
    //     let id_proyecto_ley = 0;
    //     var aux = urlParams.get('id_proyecto_ley');
    //     console.log(aux);
    //     if(typeof urlParams.get('id_proyecto_ley') !== "undefined" && Number.isInteger(Number.parseInt(urlParams.get('id_proyecto_ley')))
    //     ) {
    //         id_proyecto_ley = Number.parseInt(urlParams.get('id_proyecto_ley'));
    //     }        
    //     return id_proyecto_ley;
    // }
 
    saveSubmit = async (e) => {
        e.preventDefault();
        let errors = this.state.errors;
        errors = validForm.cleanErrors(errors);
        this.setState({ errors: errors, loading: true });

        let responseData;
        let data = this.state.fields;
        
        if (data.id === 0) {
            console.log(data);
            await ProyectoLeyfieldsService.createDocumento(data)
                .then((response) => {
                    responseData = response.data;
                })
                .catch(function (error) {
                    errors = validForm.displayErrors(error.response.data, errors);
                });
        } 
        // else {
        //     await ProyectoLeyfieldsService.updateDocumento(data.id, data)
        //         .then((response) => {
        //             responseData = response.data;
        //         })
        //         .catch(function (error) {
        //             errors = validForm.displayErrors(error.response.data, errors);
        //         });
        // }
        this.setState({ errors: errors, loading: false });
        if (responseData != null) {
            //this.resetFields();
            this.props.history.push({
                pathname: "/proyecto-ley-documentos/"+ this.state.fields.proyecto_ley_id,
            });
        }
    };

    // createUrl = () => {
    //     let gaceta_url = this.state.item_estado.gaceta_url;
    //     if (!gaceta_url) {
    //         let file = this.state.item_estado.archivo;
    //         if (!file) {
    //             return (<label> Gaceta url </label>);
    //         } else {
    //             let type = file.type;
    //             let blob = new Blob([file], {type: type});
    //             gaceta_url = URL.createObjectURL(blob);
    //         }
    //         return (<a href={gaceta_url}
    //                    target="_blank"
    //                    title="Clic para ir a la gaceta">Gaceta
    //             url</a>)
    //     }
    //     else{
    //         gaceta_url = auth.pathApi() + gaceta_url;
    //         return (<a href={gaceta_url}
    //                    target="_blank"
    //                    title="Clic para ir a la gaceta">Gaceta
    //             url</a>)
    //     }
    // }
    
    //<editor-fold desc="Handlers">
    handlerClick = async (e) => {
        let element = e.target;
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

    
    // getByID = async (id) => {
    //     await ProyectoLeyfieldsService.getd(id)
    //         .then((response) => {
    //             let data = response.data;
    //             let fields = this.state.fields;
    //             fields.id = data.id;
    //             fields.activo = data.activo;
    //             fields.proyecto_ley_id = data.proyecto_ley_id;
    //             fields.url_archivo = data.url_archivo
               

    //             Object.assign(fields, { user: auth.username() });
    //             this.setState({
    //                 fields: fields,
    //                 action: "Editar",
    //             }, async ()=>{
                    
    //             });
    //         })
    //         .catch((e) => {
    //             console.log(e);
    //         });
    // };
   
    //<editor-fold desc="Reset">
    resetFields() {
        let fields = Object.assign({}, fieldsConst);
        let errors = Object.assign({}, errorsConst);
        this.setState({
            fields: fields,
            errors: errors,
        });
    }
    

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
                                                <i className="fa fa-user"/>{" "}
                                                {this.state.action}{" "}
                                            </strong>
                                        </h3>
                                    </div>
                                    <div className="panel-body">
                                        <div className="row">
                                            <h3> Información del {this.state.title_lowercase} </h3>
                                            <div className="col-md-9">


                                                <div className={`form-group`}>
                                                    <label className="col-md-3 control-label">Documento</label>
                                                    <div className="col-md-9 ">
                                                        <Dropzone
                                                        id="DZarchivo"
                                                            maxFiles={1}
                                                            multiple={false}
                                                            inputContent="Selecciona un documento"
                                                            onChangeStatus={this.handleChangeStatus.bind(this)}
                                                            accept=".pdf"
                                                        />
                                                        <span className="error">
                                                            { this.state.errors.archivo || "" }
                                                        </span>
                                                    </div>
                                                    
                                                </div>



                                            </div>
                                        </div>
                                    </div>
                                    <div className="panel-body">
                                        <div className="row">
                                            <div className="panel-footer">
                                                <ValidarPermiso
                                                    IdModuloPermisoValidar={
                                                        ModuloPermiso.ProyectoDeLey.Modificar
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
                                                                <i className="fa fa-check"/>{" "}
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

export default CrearDocumentoProyectoLey;
