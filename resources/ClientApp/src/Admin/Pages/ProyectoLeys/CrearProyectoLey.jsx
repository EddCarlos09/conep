import React, {Component} from "react";
import ProyectoLeyfieldsService from "../../../Services/Congreso/ProyectoLey.Service";
import UtilsService from "../../../Services/General/Utils.Service";
import Input from "../../../Components/Input";
import DatePicker from "../../../Components/DatePicker";
import Spinner from "../../../Components/Spinner";
import Select from "../../../Components/Select";
import CustomBuscador from "../../../Components/CustomBuscador";
import ValidForm from "../../../Utils/ValidForm";
import SunEditor from "suneditor-react";
import NotificacionService from "../../../Services/Base/General/Notificacion.Service";
import "suneditor/dist/css/suneditor.min.css"; // Import Sun Editor's CSS File
import * as FechaMysql from "../../../Utils/FormatDate";
import AuthLogin from "../../../Utils/AuthLogin";
import {Constantes} from "../../../Constants/Constantes.js";
import {ModuloPermiso} from "../../../Permisos/ModuloPermiso";
import ValidarPermiso from "../../../Permisos/ValidarPermiso";
import TableReact from "../../../Components/TableReact";
import ProyectoLeyService from "../../../Services/Congreso/ProyectoLey.Service";

const title_lowercase = "iniciativa legislativa";
const title_sentence = "iniciativa legislativa";
const auth = new AuthLogin();
const fieldsConst = {
    id: 0,                      titulo: "",                 alias: "",
    legislatura_id: "",         cuatrienio_id: "",          tipo_proyecto_id: "",
    iniciativa_id: "",          numero_camara: "",          numero_senado: "",
    fecha_radicacion: "",       tema_id_principal: "",      tema_id_secundario: '',
    corporacion_id: '',         alcance_id: '',             sinopsis: "",
    proyecto_ley_estado: [],    proyecto_ley_autor_legislativos: [],     proyecto_ley_autor_personas: [],
    proyecto_ley_ponente: [],   user: auth.username(),      se_acumula_a_id: ''
};
const errorsConst = {
    id: '',                     titulo: "",                 alias: "",
    legislatura_id: "",         cuatrienio_id: "",          tipo_proyecto_id: "",
    iniciativa_id: "",          numero_camara: "",          numero_senado: "",
    fecha_radicacion: "",       tema_id_principal: "",      tema_id_secundario: '',
    corporacion_id: '',         alcance_id: '',             sinopsis: "",
    proyecto_ley_estado: '',    proyecto_ley_autor_legislativos: [],     proyecto_ley_autor_personas: [],
    proyecto_ley_ponente: [],   user: '',                   se_acumula_a_id: ''
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
const defaultAutorOtro = { id: "", nombre: "" , activo: true };
const defaultLegislatura = { value: "", label: "Seleccione legislatura" };
const defaultCuatrienio = { value: "", label: "Seleccione quinquenio" };
const defaultTipoProyecto = { value: "", label: "Seleccione tipo de proyecto" };
const defaultCorporacion = { value: "", label: "Seleccione corporación" };
const default_item_select_corporacion = { value: "", label: "Seleccione una corporación" };
const default_item_select_alcance = { value: "", label: "Seleccione un alcance" };
const defaultItemSelectPublicacion = { value: "", label: "Seleccione tipo de publicación" };
const defaultItemPublicacion = { id: "", proyecto_ley_id: "", tipo_publicacion_proyecto_ley_id: "", nombre: "", descripcion: "", archivo: "", activo: true, tipo_publicacion_proyecto_ley: "" };
const defaultItemSelectIniciativa = { value: "", label: "Seleccione una iniciativa" };
const default_item_desactivar = { id_item:'', titulo_item: '', activo: ''};

//<editor-fold desc="Item estado">
const default_item_estado = {
    id: 0,                          proyecto_ley_id: "",            fecha: FechaMysql.DateFormatMySql(new Date()),
    estado_proyecto_ley_id: "",     gaceta_texto: "",               gaceta_url: "",
    nota: '',                       corporacion_id: '',             observaciones: '',
    orden:'',                       activo: true,                   archivo: '',
    comisiones:[],                  tipo_estado: '',                ponentes:[]
};
const default_item_error_estado = {
    id: "",                         proyecto_ley_id: "",            fecha: '',
    estado_proyecto_ley_id: "",     gaceta_texto: "",               gaceta_url: "",
    nota: '',                       corporacion_id: '',             observaciones: '',
    orden:'',                       activo: '',                     archivo: '',
    comisiones:'',                  tipo_estado:'',                 ponentes:''
};
const default_item_estado_comision = {
    id: 0,                          proyecto_ley_id: '',              comision_id: '',
    activo: true
};
const default_item_error_estado_comision = {
    id: '',                          proyecto_ley_id: '',              comision_id: '',
    activo: ''
};
const default_item_estado_ponente = {
    id: "",                 proyecto_ley_estado_id: "",        congresista_id: "",
    activo: true
};
const default_item_error_estado_ponente = {
    id: "",                 proyecto_ley_estado_id: "",        congresista_id: "",
    cuatrienio_id: "",      activo: ''
};
const default_item_select_estado_proyecto_ley = { value: "", label: "Seleccione un estado" };
const default_item_select_estado_corporacion = { value: "", label: "Seleccione una corporación" };
const default_item_select_estado_comision = { value: "", label: "Seleccione una comisión" };
//</editor-fold>

//<editor-fold desc="Item autor">
const default_item_autor = {
    id: "", persona_id: '', nombres: '',
    fechaNacimiento: '', lugar_nacimiento: '', corporacion: '',
    partido: '', activo: true
};
const default_item_error_autor = {
    id: "", persona_id: '', nombres: '',
    fechaNacimiento: '', lugar_nacimiento: '', corporacion: '',
    partido: '', activo: ''
};
//</editor-fold>

//<editor-fold desc="Item Tema">
const default_item_select_tema_principal = { value: "", label: "Seleccione un tema principal" };
const default_item_select_tema_secundario = { value: "", label: "Seleccione un tema secundario" };
//</editor-fold>

const validForm = new ValidForm();

class CrearProyectoLey extends Component {
    constructor(props) {
        super(props);
        this.tableHandlerAcumular = this.tableHandlerAcumular.bind(this);
        this.tableHandlerComision = this.tableHandlerComision.bind(this);
        this.tableHandlerPonente = this.tableHandlerPonente.bind(this);
        this.tableHandlerAutorLegislativo = this.tableHandlerAutorLegislativo.bind(this);
        this.tableHandlerAutorPersona = this.tableHandlerAutorPersona.bind(this);
        document.addEventListener('click', this.handlerClick, true);

        this.state = {
            loading: false,
            fields: Object.assign({}, fieldsConst),
            errors: Object.assign({}, errorsConst),
            itemLegislatura: Object.assign({}, defaultLegislatura),
            itemCuatrienio: Object.assign({}, defaultCuatrienio),
            itemTipoProyecto: Object.assign({}, defaultTipoProyecto),
            itemFilterCorporacion: Object.assign({}, defaultCorporacion),
            itemFilterCuatrienio: Object.assign({}, defaultCuatrienio),
            itemPublicacion: Object.assign({}, defaultItemPublicacion),
            itemAutorOtro: Object.assign({}, defaultAutorOtro),
            itemSelectPublicacion: Object.assign({}, defaultItemSelectPublicacion),
            itemSearch: Object.assign({}, defaultItemSearch),
            itemSelectIniciativa: Object.assign({}, defaultItemSelectIniciativa),
            index_estado:{
                columns: [

                    {
                        Header: "Estados",
                        columns: [
                            {
                                Header: "id",
                                accessor: "id",
                            },
                            {
                                Header: "archivo",
                                accessor: "archivo",
                            },
                            {
                                Header: "gaceta_url",
                                accessor: "gaceta_url",
                            },
                            {
                                Header: "Fecha",
                                accessor: "fecha",
                            },
                            {
                                Header: "Orden",
                                accessor: "orden",
                            },
                            {
                                Header: "Estado",
                                accessor: "tipo_estado.nombre",
                            },
                            {
                                Header: "Activo",
                                id: "activo",
                                accessor: "activo",
                                Cell: (tableProps) => {
                                    return (
                                        <input
                                            type="checkbox"
                                            className="icheckbox"
                                            checked={
                                                tableProps.row.values.activo
                                            }
                                            readOnly
                                        />
                                    );
                                },
                            },
                        ],
                    },
                    {
                        Header: "Acciones",
                        columns: [
                            {
                                Header: "Editar",
                                id: "editar",
                                accessor: (str) => "editar",
                                Cell: (tableProps) => (
                                    <button
                                        type="button"
                                        data-toggle="modal"
                                        data-target="#modal-estado"
                                        className="btn btn-info btn-block editar_estado"
                                        data-id={tableProps.row.values.id}
                                    >
                                        <i className="fa fa-edit"/>{" "}
                                        Editar
                                    </button>
                                ),
                            },
                            {
                                Header: "Activar/Desactivar",
                                id: "actdesc",
                                accessor: (str) => "actdesc",
                                Cell: (tableProps) => (
                                    <button
                                        data-toggle="modal"
                                        data-target="#modal-activar-desactivar-estado"
                                        className={`btn ${tableProps.row.values.activo
                                            ? "btn-danger"
                                            : "btn-warning"} eliminar_estado`}
                                        style={{ width: "100%" }}
                                        data-id={tableProps.row.values.id}
                                        data-titulo={tableProps.row.values["tipo_estado.nombre"] + 'de fecha: ' + tableProps.row.values.fecha }
                                        data-activo={tableProps.row.values.activo}
                                    >
                                        <i className="fa fa-eraser"/>{" "}
                                        {tableProps.row.values.activo
                                            ? "Desactivar"
                                            : "Activar"}
                                    </button>
                                ),
                            },
                        ],
                    },
                ],
                hiddenColumns: ["id", "archivo", 'gaceta_url', 'gaceta_texto'],
                data: [],
                page: 1,
                rows: 5,
                search: "",
                totalRows: 0,
            },
            buscador_acumular: {
                data: [],
                selected: '',
                imgOrigin: auth.pathApi(),
                search: "",
                page: 1,
                rows: 24,
                totalRows: 0,
                info_columns: [
                    {column_name: 'id', accessor: 'id', show: false},
                    {column_name: 'Título', accessor: 'titulo', show: true},
                    {column_name: 'Alias', accessor: 'alias', show: true},
                    {column_name: 'Número en cámara', accessor: 'numero_camara', show: true},
                ],
                default_item: ''
            },
            buscador_comision: {
                data: [],
                selected: '',
                imgOrigin: auth.pathApi(),
                search: "",
                page: 1,
                rows: 24,
                totalRows: 0,
                info_columns: [
                    {column_name: 'id', accessor: 'id', show: false},
                    {column_name: 'Nombre', accessor: 'nombre', show: true},
                    {column_name: 'Descripción', accessor: 'descripcion', show: false},
                    {column_name: 'Corporación', accessor: 'corporacion.nombre', show: true},
                ],
                default_item: ''
            },
            buscador_ponente: {
                data: [],
                selected: '',
                imgOrigin: auth.pathApi(),
                search: "",
                page: 1,
                rows: 24,
                totalRows: 0,
                info_columns: [
                    {column_name: 'id', accessor: 'id', show: false},
                    {column_name: 'Nombres', accessor: 'persona.nombres', show: true},
                    {column_name: 'Apellidos', accessor: 'persona.apellidos', show: true},
                    {column_name: 'Corporación', accessor: 'corporacion.nombre', show: true},
                    {column_name: 'Partido', accessor: 'partido.nombre', show: true},
                ],
                default_item: ''
            },
            buscador_autor_persona: {
                data: [],
                selected: '',
                imgOrigin: auth.pathApi(),
                search: "",
                page: 1,
                rows: 24,
                totalRows: 0,
                info_columns: [
                    {column_name: 'id', accessor: 'id', show: false},
                    {column_name: 'Nombres', accessor: 'nombres', show: true},
                    {column_name: 'Apellidos', accessor: 'apellidos', show: true},
                    {column_name: 'Fecha nacimiento', accessor: 'fechaNacimiento', show: true},
                    {column_name: 'Lugar nacimiento', accessor: 'lugar_nacimiento', show: true},
                ],
                default_item: ''
            },
            dataSelectLegislatura: [],
            dataSelectCuatrienio: [],
            dataSelectTipoProyecto: [],
            dataSelectCorporacion: [],
            dataSelectTipoComision: [],
            dataSelectTipoPublicacionProyectoLeyProyecto: [],
            dataSelectIniciativa: [],
            url: "",
            action: "Nuevo",
            title_lowercase: title_lowercase,
            title_sentence: title_sentence,
            autores_otros: [],
            current_tmp_id_estado: 0,
            current_estado_id_select: '',
            item_desactivar: Object.assign({},default_item_desactivar),

            item_estado: Object.assign({}, default_item_estado),
            item_error_estado: Object.assign({}, default_item_error_estado),
            item_estado_comision: Object.assign({}, default_item_estado_comision),
            item_error_estado_comision: Object.assign({}, default_item_error_estado_comision),
            item_estado_ponente: Object.assign({}, default_item_estado_ponente),
            item_error_estado_ponente: Object.assign({}, default_item_error_estado_ponente),
            item_select_estado_proyecto_ley: Object.assign({}, default_item_select_estado_proyecto_ley),
            item_select_estado_corporacion: Object.assign({}, default_item_select_estado_corporacion),
            item_select_estado_comision: Object.assign({}, default_item_select_estado_comision),
            data_select_estado_proyecto_ley: [],

            data_select_tema_principal:[],
            data_select_tema_secundario:[],
            item_select_tema_principal: [default_item_select_tema_principal],
            item_select_tema_secundario: [default_item_select_tema_secundario],

            data_select_corporacion: [],
            item_select_corporacion: [default_item_select_corporacion],

            data_select_alcance: [],
            item_select_alcance: [default_item_select_alcance],

            item_autor:Object.assign({}, default_item_autor),
            item_error_autor: Object.assign({}, default_item_error_autor),

            iniciativas: [],
            show_autores_legislativos: 'visible',
            show_autores_personas: 'visible',
            active_autores_legislativos: 'active',
            active_autores_personas: '',

            observacionesList: []
        };
    }

    //<editor-fold desc="Generales">
    componentDidMount = async () => {
        this.setState({ loading: true });
        await this.getComboCuatrienio();
        await this.getComboTipoProyecto();
        await this.getComboEstadoProyecto();
        await this.getIniciativa(null, null, 1);
        await this.getComboTema(1);
        await this.getComboAlcance();
        await this.getAutorPagination();
        await this.getProyectosLey(1, this.state.buscador_acumular.page, this.state.buscador_acumular.rows, this.state.buscador_acumular.search);

        let id = this.obtenerId();
        if (id !== 0) {
            await this.getByID(id);
            await this.getObservacionesIniciativa(id)
        } else {
            this.resetFields();
            this.setState({ loading: false });
        }
    };

    getObservacionesIniciativa = async (id) => {
        await ProyectoLeyService.getObservacionesIniciativa(id).then((response) => {
            if(response.data.length)
                this.setState({observacionesList: response.data})
            else
                this.setState({observacionesList: []})
        });
    }

    componentDidUpdate = async () =>{
        let id = this.obtenerId();
        let currentId = this.state.fields.id;
        if(currentId > 0 && currentId !== id){
            await this.getByID(id);
        }
    }

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
    saveSubmit = async (e) => {
        e.preventDefault();
        let errors = this.state.errors;
        errors = validForm.cleanErrors(errors);
        this.setState({ errors: errors, loading: true });

        let responseData;
        let data = this.state.fields;
        data.se_acumula_a_id = this.state.buscador_acumular.selected
            ? this.state.buscador_acumular.selected.length > 0
                ? this.state.buscador_acumular.selected[0].id
                : ''
            : '';

        let tiene_estados = true;
        let tiene_autores = true;

        if(data.proyecto_ley_estado.length === 0 ){
            tiene_estados = false;
            errors.proyecto_ley_estado = 'Debe de agregar un estado';
        }
        if(data.proyecto_ley_autor_personas.length === 0 ){
            tiene_autores = false;
            errors.proyecto_ley_autor_personas = 'Debe de agregar un autor';
        }

        if(!tiene_estados || !tiene_autores){
            this.setState({ errors: errors, loading: false });
            return;
        }

        if (data.id === 0) {
            await ProyectoLeyfieldsService.create(data)
                .then((response) => {
                    responseData = response.data;
                })
                .catch(function (error) {
                    errors = validForm.displayErrors(error.response.data, errors);
                });
        } else {
            await ProyectoLeyfieldsService.update(data.id, data)
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
                pathname: "/proyectos-ley",
            });
        }
    };
    saveSubmitEstado = async () => {
        let hasError = false;
        let item = Object.assign({}, this.state.item_estado);
        let itemError = Object.assign({}, default_item_error_estado);

        if (!item.fecha) {
            hasError = true;
            itemError.fecha = "Ingrese una fecha.";
        }

        if(!item.orden){
            hasError = true;
            itemError.orden = "Ingrese un número de orden.";
        }

        if (!item.estado_proyecto_ley_id) {
            hasError = true;
            itemError.estado_proyecto_ley_id =
                "Seleccione un estado de proyecto de ley.";
        }
        if (hasError) {
            this.setState((prevState) => ({
                ...prevState,
                item_error_estado: itemError,
            }));
        } else {
            // Verificamos si es nuevo o editar
            // Si el id ya se encuentra en el array de proyecto de leys entoces es editar
            let array = [...this.state.fields.proyecto_ley_estado];
            let estado_id = item.id;
            let index = this.get_index_in_array('id', estado_id, array);

            // Si es -1 significa que no lo encontro por lo que es nuevo
            if(index === -1){
                let id = this.state.current_tmp_id_estado + -1;
                item.id = id;
                this.setState((prevState) => ({
                    ...prevState,
                    item_error_estado: itemError,
                    item_estado: Object.assign({}, default_item_estado),
                    current_tmp_id_estado: id,
                    fields: {
                        ...prevState.fields,
                        proyecto_ley_estado: [
                            ...prevState.fields.proyecto_ley_estado,
                            item,
                        ],
                    },
                }), ()=>{
                    this.refs.close_modal_estado.click();
                    let data = this.state.fields.proyecto_ley_estado;
                    this.setState((prevState) => ({
                        ...prevState,
                        index_estado:{
                            ...prevState.index_estado,
                            data:data
                        }
                    }));
                });
            }
            // Como es diferente a -1 es por que fue encontrado en el array de proyectos de ley, por lo que es editar
            else{
                array[index].id = item.id;
                array[index].proyecto_ley_id = item.proyecto_ley_id;
                array[index].fecha = FechaMysql.DateFormatMySql(item.fecha);
                array[index].estado_proyecto_ley_id = item.estado_proyecto_ley_id;
                array[index].corporacion_id = item.corporacion_id;
                array[index].observaciones = item.observaciones;
                array[index].orden = item.orden;
                array[index].activo = item.activo;
                array[index].comisiones = item.comisiones;
                array[index].tipo_estado = item.tipo_estado;

                this.setState((prevState) => ({
                    ...prevState,
                    item_error_estado: itemError,
                    item_estado: Object.assign({}, default_item_estado),
                    fields: {
                        ...prevState.fields,
                        proyecto_ley_estado: array
                    },
                }), ()=>{
                    this.refs.close_modal_estado.click();
                    let data = this.state.fields.proyecto_ley_estado;
                    this.setState((prevState) => ({
                        ...prevState,
                        index_estado:{
                            ...prevState.index_estado,
                            data:data
                        }
                    }));
                });
            }


        }
    };
    saveSubmitEstadoPonente = async () => {
        let proyecto_ley_estado = this.state.fields.proyecto_ley_estado;
        let current_estado_id_select = this.state.current_estado_id_select;
        let selected_ponentes = this.state.buscador_ponente.selected;
        let index = this.get_index_in_array('id', current_estado_id_select, proyecto_ley_estado);

        selected_ponentes.forEach((value, index, array) => {
            value.congresista_id = value.id;
        });

        if (index !== -1) {
            proyecto_ley_estado[index].ponentes = selected_ponentes;
        }

        this.setState((prevState) => ({
            ...prevState,
            buscador_ponente:{
                ...prevState.buscador_ponente,
                data: [],
                selected: '',
                imgOrigin: auth.pathApi(),
                search: "",
                page: 1,
                rows: 24,
                totalRows: 0,
                default_item: ''
            },
            fields: {
                ...prevState.fields,
                proyecto_ley_estado: proyecto_ley_estado,
            },
        }), ()=>{
            this.refs.close_modal_estado_ponente.click();
        });
    };
    setSelectComisionToBuscador = (estado_id) =>{
        let estados = this.state.fields.proyecto_ley_estado;
        let index = this.get_index_in_array('id', estado_id, estados);

        if(index !== -1){
            let estado = estados[index];
            if(estado){
                if(estado.hasOwnProperty('comisiones')){
                    let selected = [];
                    estado.comisiones.forEach((comision, comision_index, array) => {
                        let default_comision = {
                            id: comision.comision_id,
                            corporacion_id: comision.corporacion_id,
                            descripcion: '',
                            nombre: '',
                            activo: comision.activo,
                            corporacion: {
                                id: '',
                                nombre: '',
                                descripcion: '',
                                activo: ''
                            }
                        }

                        if(comision.hasOwnProperty("comision") && comision.comision) {
                            default_comision.descripcion =  comision.comision.descripcion;
                            default_comision.nombre =  comision.comision.nombre;
                            if(comision.comision.hasOwnProperty("corporacion") && comision.comision.corporacion){
                                default_comision.corporacion.id = comision.comision.corporacion.id;
                                default_comision.corporacion.nombre = comision.comision.corporacion.nombre;
                                default_comision.corporacion.descripcion = comision.comision.corporacion.descripcion;
                                default_comision.corporacion.activo = comision.comision.corporacion.activo;
                            }
                        }
                        else {
                            default_comision.descripcion = comision.descripcion;
                            default_comision.nombre = comision.nombre;
                            if(comision.hasOwnProperty("corporacion") && comision.corporacion){
                                default_comision.corporacion.id = comision.corporacion.id;
                                default_comision.corporacion.nombre = comision.corporacion.nombre;
                                default_comision.corporacion.descripcion = comision.corporacion.descripcion;
                                default_comision.corporacion.activo = comision.corporacion.activo;
                            }
                        }

                        selected.push(default_comision);
                    });

                    this.setState((prevState) => ({
                        ...prevState,
                        buscador_comision:{
                            ...prevState.buscador_comision,
                            selected: selected,
                        },
                    }));
                }

            }

        }
    }
    setSelectPonenteToBuscador = (estado_id) =>{
        let estados = this.state.fields.proyecto_ley_estado;
        let index = this.get_index_in_array('id', estado_id, estados);

        if(index !== -1){
            let estado = estados[index];
            if(estado){
                if(estado.hasOwnProperty('ponentes')){
                    let selected = [];
                    estado.ponentes.forEach((ponente, ponente_index, array) => {
                        let default_ponente = {
                            id: ponente.congresista_id,
                            congresista_id: ponente.congresista_id,
                            activo: ponente.activo,
                            persona:{
                                id: '',
                                nombres: '',
                                apellidos: '',
                                activo: '',
                            },
                            corporacion:{
                                id: '',
                                nombre:'',
                            },
                            partido:{
                                id: '',
                                nombre:'',
                            }
                        }

                        if(ponente.hasOwnProperty('congresista') && ponente.congresista ){
                            if(ponente.congresista.hasOwnProperty("persona") && ponente.congresista.persona ) {
                                default_ponente.persona.id = ponente.congresista.persona.id;
                                default_ponente.persona.nombres = ponente.congresista.persona.nombres;
                                default_ponente.persona.apellidos = ponente.congresista.persona.apellidos;
                                default_ponente.persona.activo = ponente.congresista.persona.activo;
                            }
                            if(ponente.congresista.hasOwnProperty("corporacion") && ponente.congresista.corporacion){
                                default_ponente.corporacion.id = ponente.congresista.corporacion.id;
                                default_ponente.corporacion.nombre = ponente.congresista.corporacion.nombre;
                            }
                            if(ponente.congresista.hasOwnProperty("partido") &&  ponente.congresista.partido ){
                                default_ponente.partido.id = ponente.congresista.partido.id;
                                default_ponente.partido.nombre = ponente.congresista.partido.nombre;
                            }
                        }
                        else{
                            if(ponente.hasOwnProperty("persona") && ponente.persona){
                                default_ponente.persona.id = ponente.persona.id;
                                default_ponente.persona.nombres = ponente.persona.nombres;
                                default_ponente.persona.apellidos = ponente.persona.apellidos;
                                default_ponente.persona.activo = ponente.persona.activo;
                                if(ponente.hasOwnProperty("corporacion") && ponente.corporacion){
                                    default_ponente.corporacion.id = ponente.corporacion.id;
                                    default_ponente.corporacion.nombre = ponente.corporacion.nombre;
                                }
                                if(ponente.hasOwnProperty("partido") && ponente.partido){
                                    default_ponente.partido.id = ponente.partido.id;
                                    default_ponente.partido.nombre = ponente.partido.nombre;
                                }
                            }

                        }
                        selected.push(default_ponente);
                    })

                    this.setState((prevState) => ({
                        ...prevState,
                        buscador_ponente:{
                            ...prevState.buscador_ponente,
                            selected: selected,
                        },
                    }));
                }

            }

        }
    }
    deleteSubmitEstado = async (e) => {
        e.preventDefault();
        let array = [...this.state.fields.proyecto_ley_estado];
        let estado_id = this.state.item_desactivar.id;
        let index = this.get_index_in_array('id', estado_id, array);

        if (index !== -1) {
            array.splice(index, 1);
            this.setState((prevState) => ({
                ...prevState,
                fields: {
                    ...prevState.fields,
                    proyecto_ley_estado: array
                },
                index_estado:{
                    ...prevState.index_estado,
                    data:array
                }
            }));
        }
        document.querySelector(`#modal-activar-desactivar-estado button[data-dismiss="modal"]`).click();
    };
    createUrl = () => {
        let gaceta_url = this.state.item_estado.gaceta_url;
        if (!gaceta_url) {
            let file = this.state.item_estado.archivo;
            if (!file) {
                return (<label> Gaceta url </label>);
            } else {
                let type = file.type;
                let blob = new Blob([file], {type: type});
                gaceta_url = URL.createObjectURL(blob);
            }
            return (<a href={gaceta_url}
                       target="_blank"
                       title="Clic para ir a la gaceta">Gaceta
                url</a>)
        }
        else{
            gaceta_url = auth.pathApi() + gaceta_url;
            return (<a href={gaceta_url}
                       target="_blank"
                       title="Clic para ir a la gaceta">Gaceta
                url</a>)
        }
    }
    //</editor-fold>

    //<editor-fold desc="Handlers">
    handlerClick = async (e) => {
        let element = e.target;

        // Abriendo modal comisión
        if (element.classList.contains("open_modal_comision")) {
            let id = Number(element.getAttribute("data-id"));
            await this.handlerResetModalEstadoComision();
            this.setState((prevState) => ({
                ...prevState,
                current_estado_id_select: id
            }), () =>{
                this.setSelectComisionToBuscador(id)
            });
        }
        else if (element.parentNode.classList.contains("open_modal_comision")) {
            let id = Number(element.parentNode.getAttribute("data-id"));
            await this.handlerResetModalEstadoComision();
            this.setState((prevState) => ({
                ...prevState,
                current_estado_id_select: id
            }), () =>{
                this.setSelectComisionToBuscador(id)
            });
        }

        // Abriendo modal ponente
        if (element.classList.contains("open_modal_ponente")) {
            let id = Number(element.getAttribute("data-id"));
            await this.handlerResetModalEstadoPonente();
            this.setState((prevState) => ({
                ...prevState,
                current_estado_id_select: id
            }), () =>{
                this.setSelectPonenteToBuscador(id)
            });
        }
        else if (element.parentNode.classList.contains("open_modal_ponente")) {
            let id = Number(element.parentNode.getAttribute("data-id"));
            await this.handlerResetModalEstadoPonente();
            this.setState((prevState) => ({
                ...prevState,
                current_estado_id_select: id
            }), () =>{
                this.setSelectPonenteToBuscador(id)
            });
        }

        // Abriendo eliminar estado
        if (element.classList.contains("eliminar_estado")) {
            let id = Number(element.getAttribute("data-id"));
            let titulo = element.getAttribute("data-titulo");
            let activo = element.getAttribute("data-activo") === 'true' ? 1 : 0;

            this.handlerDesactivarEstado(id, titulo, activo);
        }
        else if (element.parentNode.classList.contains("eliminar_estado")) {
            let id = Number(element.parentNode.getAttribute("data-id"));
            await this.handlerResetModalEstadoComision();
            this.setState((prevState) => ({
                ...prevState,
                current_estado_id_select: id
            }), () =>{
                this.setSelectComisionToBuscador(id)
            });
        }

        // Abriendo editar estado
        if (element.classList.contains("editar_estado")) {
            let id = Number(element.getAttribute("data-id"));
            this.handlerResetModalEstado();
            let array = [...this.state.fields.proyecto_ley_estado];
            let index = this.get_index_in_array('id', id, array);
            if(index !== -1){
                let estado = this.state.fields.proyecto_ley_estado[index];
                let item_estado = Object.assign({}, default_item_estado);
                item_estado.id = estado.id;
                item_estado.proyecto_ley_id = estado.proyecto_ley_id;
                item_estado.fecha = FechaMysql.DateFormatMySql(estado.fecha);
                item_estado.estado_proyecto_ley_id = estado.estado_proyecto_ley_id;
                item_estado.gaceta_texto = estado.gaceta_texto;
                item_estado.gaceta_url = estado.gaceta_url;
                item_estado.nota = estado.nota;
                item_estado.corporacion_id = estado.corporacion_id;
                item_estado.observaciones = estado.observaciones;
                item_estado.orden = estado.orden;
                item_estado.activo = estado.activo;
                item_estado.archivo = estado.archivo;
                item_estado.comisiones = estado.comisiones;
                item_estado.tipo_estado = estado.tipo_estado;
                this.setState({
                    item_estado: item_estado,
                },()=>{
                    this.setSelectValue(
                        this.state.item_estado.corporacion_id,
                        "data_select_corporacion",
                        "item_select_estado_corporacion"
                    );
                    this.setSelectValue(
                        this.state.item_estado.estado_proyecto_ley_id,
                        "data_select_estado_proyecto_ley",
                        "item_select_estado_proyecto_ley"
                    );
                });
            }
        }
        else if (element.parentNode.classList.contains("editar_estado")) {
            let id = Number(element.parentNode.getAttribute("data-id"));
            this.handlerResetModalEstado();
            let array = [...this.state.fields.proyecto_ley_estado];
            let index = this.get_index_in_array('id', id, array);
            if(index !== -1){
                let estado = this.state.fields.proyecto_ley_estado[index];
                let item_estado = Object.assign({}, default_item_estado);
                item_estado.id = estado.id;
                item_estado.proyecto_ley_id = estado.proyecto_ley_id;
                item_estado.fecha = FechaMysql.DateFormatMySql(estado.fecha);
                item_estado.estado_proyecto_ley_id = estado.estado_proyecto_ley_id;
                item_estado.gaceta_texto = estado.gaceta_texto;
                item_estado.gaceta_url = estado.gaceta_url;
                item_estado.nota = estado.nota;
                item_estado.corporacion_id = estado.corporacion_id;
                item_estado.observaciones = estado.observaciones;
                item_estado.orden = estado.orden;
                item_estado.activo = estado.activo;
                item_estado.archivo = estado.archivo;
                item_estado.comisiones = estado.comisiones;
                item_estado.tipo_estado = estado.tipo_estado;
                this.setState({
                    item_estado: item_estado,
                },()=>{
                    this.setSelectValue(
                        this.state.item_estado.corporacion_id,
                        "data_select_corporacion",
                        "item_select_estado_corporacion"
                    );
                    this.setSelectValue(
                        this.state.item_estado.estado_proyecto_ley_id,
                        "data_select_estado_proyecto_ley",
                        "item_select_estado_proyecto_ley"
                    );
                });
            }
        }
    }
    handlerDesactivarEstado = (id, titulo, activo) => {
        let item_desactivar = Object.assign({},default_item_desactivar);
        item_desactivar.id = id;
        item_desactivar.titulo = titulo;
        item_desactivar.activo = activo;
        this.setState({
            item_desactivar: item_desactivar,
        });
    };
    handlerSelectAcumula = (item, selectMultiple) =>{
        if(selectMultiple){
            this.setState((prevState) => ({
                ...prevState,
                buscador_acumular:{
                    ...prevState.buscador_acumular,
                    selected: [
                        ...prevState.buscador_acumular.selected,
                        item
                    ]
                }
            }));
        }
        else{
            this.setState((prevState) => ({
                ...prevState,
                buscador_acumular:{
                    ...prevState.buscador_acumular,
                    selected: [item]
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
    handlerSelectDeleteAcumula = (item, selectableProperty) => {
        let array = [...this.state.buscador_acumular.selected];
        let index = this.get_index_in_array(selectableProperty, item[selectableProperty], array);
        if (index !== -1) {
            array.splice(index, 1);
            this.setState((prevState) => ({
                ...prevState,
                buscador_acumular: {
                    ...prevState.buscador_acumular,
                    selected: array
                }
            }));
        }
    }
    handlerSelectDeleteAutorLegislativo = (item, selectableProperty) => {
        let array = [...this.state.buscador_autor_legislativo.selected];
        let index = this.get_index_in_array(selectableProperty, item[selectableProperty], array);

        if (index !== -1) {
            array.splice(index, 1);
            this.setState((prevState) => ({
                ...prevState,
                buscador_autor_legislativo: {
                    ...prevState.buscador_autor_legislativo,
                    selected: array
                },
                fields:{
                    ...prevState.fields,
                    proyecto_ley_autor_legislativos: array
                }
            }));
        }
    }
    handlerSelectDeleteAutorPersona = (item, selectableProperty) => {
        let array = [...this.state.buscador_autor_persona.selected];
        let index = this.get_index_in_array(selectableProperty, item[selectableProperty], array);

        if (index !== -1) {
            array.splice(index, 1);
            this.setState((prevState) => ({
                ...prevState,
                buscador_autor_persona: {
                    ...prevState.buscador_autor_persona,
                    selected: array
                },
                fields:{
                    ...prevState.fields,
                    proyecto_ley_autor_personas: array
                }
            }));
        }
    }
    handlerSelectPonente = (item, selectMultiple) =>{
        if(selectMultiple){
            this.setState((prevState) => ({
                ...prevState,
                buscador_ponente:{
                    ...prevState.buscador_ponente,
                    selected: [
                        ...prevState.buscador_ponente.selected,
                        item
                    ]
                }
            }));
        }
        else{
            this.setState((prevState) => ({
                ...prevState,
                buscador_ponente:{
                    ...prevState.buscador_ponente,
                    selected: [item]
                }
            }));
        }
    }
    handlerSelectAutorPersona = (item, selectMultiple) =>{
        let item_autor = Object.assign({}, default_item_autor);
        item_autor.persona_id = item.id;
        item_autor.nombres = item.nombres;
        item_autor.apellidos = item.apellidos;
        item_autor.fechaNacimiento = item.fechaNacimiento;
        item_autor.corporacion = item.corporacion;
        item_autor.partido = item.partido;

        if(selectMultiple){
            this.setState((prevState) => ({
                ...prevState,
                buscador_autor_persona:{
                    ...prevState.buscador_autor_persona,
                    selected: [
                        ...prevState.buscador_autor_persona.selected,
                        item
                    ]
                },
                fields:{
                    ...prevState.fields,
                    proyecto_ley_autor_personas:[
                        ...prevState.fields.proyecto_ley_autor_personas,
                        item_autor
                    ]
                }
            }));
        }
        else{
            this.setState((prevState) => ({
                ...prevState,
                buscador_autor_persona:{
                    ...prevState.buscador_autor_persona,
                    selected: [item]
                },
                fields:{
                    ...prevState.fields,
                    proyecto_ley_autor_personas:[item]
                }
            }));
        }
    }
    handlerChangeSearchForComision = (value) =>{
        let buscador = this.state.buscador_comision;
        buscador.search = value;
        this.setState({buscador_comision: buscador})
    }
    handlerChangeSearchForAutorPersona = (value) =>{
        let buscador = this.state.buscador_autor_persona;
        buscador.search = value;
        this.setState({buscador_autor_persona: buscador})
    }
    async tableHandlerAcumular(page, rows, search) {
         let buscador = this.state.buscador_acumular;
        buscador.page = page;
        buscador.rows = rows;
        buscador.search = search;
        this.setState({ buscador_acumular: buscador });
        if (this.timeout) clearTimeout(this.timeout);
        this.timeout = setTimeout(
            async function () {
                await this.getProyectosLey(1, page, rows, search);
            }.bind(this),
            1000
        );
    }
    async tableHandlerComision(page, rows, search) {
        let buscador = this.state.buscador_comision;
        buscador.page = page;
        buscador.rows = rows;
        buscador.search = search;

        this.setState({ buscador_comision: buscador });
        if (this.timeout) clearTimeout(this.timeout);
        this.timeout = setTimeout(
            async function () {
                await this.getComisionPagination(1, page, rows, search);
            }.bind(this),
            1000
        );
    }
    async tableHandlerPonente(page, rows, search) {
        let cuatrienio_id = this.state.fields.cuatrienio_id;
        let buscador = this.state.buscador_ponente;
        buscador.page = page;
        buscador.rows = rows;
        buscador.search = search;

        this.setState({ buscador_ponente: buscador });
        if (this.timeout) clearTimeout(this.timeout);
        this.timeout = setTimeout(
            async function () {
                await this.getPonentePagination(1,  cuatrienio_id, page, rows, search);
            }.bind(this),
            1000
        );
    }
    async tableHandlerAutorLegislativo(page, rows, search) {
        let cuatrienio_id = this.state.fields.cuatrienio_id;
        let buscador = this.state.buscador_autor_legislativo;

        buscador.page = page;
        buscador.rows = rows;
        buscador.search = search;

        this.setState({ buscador_autor_legislativo: buscador });
        if (this.timeout) clearTimeout(this.timeout);
        this.timeout = setTimeout(
            async function () {
                await this.getAutorPagination('buscador_autor_legislativo', true, cuatrienio_id);
            }.bind(this),
            1000
        );
    }
    async tableHandlerAutorPersona(page, rows, search) {
        let buscador = this.state.buscador_autor_persona;

        buscador.page = page;
        buscador.rows = rows;
        buscador.search = search;

        this.setState({ buscador_autor_persona: buscador });
        if (this.timeout) clearTimeout(this.timeout);
        this.timeout = setTimeout(
            async function () {
                await this.getAutorPagination('buscador_autor_persona', 0, 0);
            }.bind(this),
            1000
        );
    }
    handlerSelectTemaPrincipal = (item) => {
        let fields = this.state.fields;
        fields.tema_id_principal = item.value;
        this.setState({
            fields: fields,
            item_select_tema_principal: item,
        });
    };
    handlerSelectTemaSecundario = (item) => {
        let fields = this.state.fields;
        fields.tema_id_secundario = item.value;
        this.setState({
            fields: fields,
            item_select_tema_secundario: item,
        });
    };
    handlerItemLegislatura = (item) => {
        let fields = this.state.fields;
        fields.legislatura_id = item.value;
        this.setState({
            fields: fields,
            itemLegislatura: item,
        });
    };
    handlerItemIniciativa = async  (item) => {
        let fields = this.state.fields;
        fields.iniciativa_id = item.value;
        this.setState({
            fields: fields,
            itemSelectIniciativa: item,
        });
    };
    handlerItemCuatrienio = (item) => {
        let fields = this.state.fields;
        fields.cuatrienio_id = item.value;

        this.setState({ fields: fields, itemCuatrienio:  item},
            async ()=>{
                await this.getComboLegislatura(null, null, null, null, item.value, 1);
            });
    };
    handlerItemTipoProyecto = (item) => {
        let fields = this.state.fields;
        fields.tipo_proyecto_id = item.value;
        this.setState({ fields: fields, itemTipoProyecto: item });
    };
    handlerSelectAlcance = (item) => {
        let fields = this.state.fields;
        fields.alcance_id = item.value;
        this.setState({ fields: fields, item_select_alcance: item });
    };
    handlerItemSelectFecha = (item) => {
        this.setState((prevState) => ({
            ...prevState,
            itemFecha: {
                ...prevState.itemFecha,
                tipo_fecha_proyecto_ley_id: item.value,
                tipo_fecha_proyecto_ley: {
                    ...prevState.itemFecha.tipo_fecha_proyecto_ley,
                    id: item.value,
                    nombre: item.label,
                },
            },
            itemSelectFecha: item,
        }));
    };
    handlerDeletePonentes = (index) => {
        let items = this.state.fields.proyecto_ley_ponente;
        items[index].activo = 0;
        this.setState((prevState) => ({
                ...prevState,
                fields: {
                    ...prevState.fields,
                    proyecto_ley_ponente: items,
                },
            })
        );
    };
    handlerDeleteFecha = (index) => {
        let items = this.state.fields.proyecto_ley_fecha;
        items[index].activo = 0;
        this.setState((prevState) => ({
                ...prevState,
                fields: {
                    ...prevState.fields,
                    proyecto_ley_fecha: items,
                },
            })
        );
    };
    handlerCorporacionEstado = (item) => {
        this.setState(
            (prevState) => ({
                ...prevState,
                item_estado: {
                    ...prevState.item_estado,
                    corporacion_id: item.value,
                },
                item_select_estado_corporacion: item
            })
        );
    };
    handlerEstadoProyectoDeLeyEstado = (item) => {
        this.setState(
            (prevState) => ({
                ...prevState,
                item_estado: {
                    ...prevState.item_estado,
                    estado_proyecto_ley_id: item.value,
                    tipo_estado:{
                        ...prevState.item_estado.tipo_estado,
                        id: item.value,
                        nombre: item.label
                    }
                },
                item_select_estado_proyecto_ley: item
            })
        );
    };
    handlerResetModalEstado = () => {
        this.setState({
            item_estado: Object.assign({}, default_item_estado),
            item_error_estado: Object.assign({}, default_item_error_estado),
            item_select_estado_proyecto_ley: Object.assign({}, default_item_select_estado_proyecto_ley),
            item_select_estado_corporacion: Object.assign({}, default_item_select_estado_corporacion),
        });
    };
    handlerResetModalEstadoComision = async () => {
        this.setState((prevState) => ({
            ...prevState,
            buscador_comision:{
                ...prevState.buscador_comision,
                data: [],
                selected: '',
                imgOrigin: auth.pathApi(),
                search: "",
                page: 1,
                rows: 24,
                totalRows: 0,
                default_item: ''
            },
        }),async ()=>{
            await this.getComisionPagination(1, this.state.buscador_comision.page, this.state.buscador_comision.rows, this.state.buscador_comision.search);
        });
    };
    handlerResetModalEstadoPonente = async () => {
        this.setState((prevState) => ({
            ...prevState,
            buscador_comision:{
                ...prevState.buscador_comision,
                data: [],
                selected: '',
                imgOrigin: auth.pathApi(),
                search: "",
                page: 1,
                rows: 24,
                totalRows: 0,
                default_item: ''
            },
        }),async ()=>{
            let cuatrienio_id = this.state.fields.cuatrienio_id;
            if(cuatrienio_id){
                this.setState((prevState) => ({
                    ...prevState,
                    item_error_estado_ponente: {
                        ...prevState.item_error_estado_ponente,
                        cuatrienio_id: ''
                    }
                }), async () =>{
                    await this.getPonentePagination(
                        1,
                        cuatrienio_id,
                        this.state.buscador_comision.page,
                        this.state.buscador_comision.rows,
                        this.state.buscador_comision.search
                    );
                });
            }
            else{
                this.setState((prevState) => ({
                    ...prevState,
                    item_error_estado_ponente: {
                        ...prevState.item_error_estado_ponente,
                        cuatrienio_id: 'Cierra este modal y seleccione un quinquenio'
                    }
                }));
            }
        });
    };
    //</editor-fold>

    //<editor-fold desc="Gets">
    getAutorPagination = async() => {
        let buscador = this.state.buscador_autor_persona;

        await UtilsService.getAutorFilterPagination({
            activo: 1,
            page: buscador.page,
            rows: buscador.rows,
            search: buscador.search,
        }).then((response) => {
            buscador.data = response.data;
            this.setState({ buscador: buscador});
        });

        await UtilsService.getAutorFilterPaginationTotalRecord(
            {
                activo: 1,
                page: buscador.page,
                rows: buscador.rows,
                search: buscador.search
            }
        ).then((response) => {
            buscador.totalRows = response.data;
            this.setState({ buscador: buscador});
        })

        this.setState(
            (prevState) => ({
                ...prevState,
                buscador_autor_persona: {
                    ...prevState.buscador_autor_persona,
                    selected: '',
                },
                fields:{
                    ...prevState.fields,
                    proyecto_ley_autor_personas:[],
                }
            })
        );
    }
    getProyectosLey = async (activo, page, rows, search ) => {
        await UtilsService.getProyectoLeyFilter(
        {
            activo: activo,
            page: page,
            rows: rows,
            search: search
        }).then((response) => {
            this.setState(
                (prevState) => ({
                    ...prevState,
                    buscador_acumular: {
                        ...prevState.buscador_acumular,
                        data: response.data,
                    },
                })
            );
        });

        await UtilsService.getProyectoLeyFilterTotalRecords(
            {
                activo: activo,
                page: page,
                rows: rows,
                search: search
            }).then((response) => {
            this.setState(
                (prevState) => ({
                    ...prevState,
                    buscador_acumular: {
                        ...prevState.buscador_acumular,
                        totalRows: response.data,
                    },
                })
            );
        });

    }
    getComisionPagination = async (activo, page, rows, search ) => {
        this.setState({ loading: true });
        await UtilsService.getComisionFilterPagination(
            {
                activo: activo,
                page: page,
                rows: rows,
                search: search
            }).then((response) => {
            this.setState(
                (prevState) => ({
                    ...prevState,
                    loading: false,
                    buscador_comision: {
                        ...prevState.buscador_comision,
                        data: response.data,
                    },
                })
            );
        });

        await UtilsService.getComisionFilterPaginationTotalRecord(
            {
                activo: activo,
                page: page,
                rows: rows,
                search: search
            }
        ).then((response) => {
            this.setState(
                (prevState) => ({
                    ...prevState,
                    loading: false,
                    buscador_comision: {
                        ...prevState.buscador_comision,
                        totalRows: response.data,
                    },
                })
            );
        })
    }
    getPonentePagination = async (activo, cuatrienio_id, page, rows, search ) => {
        this.setState({ loading: true });
        await UtilsService.getPonenteFilterPagination(
            {
                activo: activo,
                cuatrienio_id: cuatrienio_id,
                page: page,
                rows: rows,
                search: search
            }).then((response) => {
            this.setState(
                (prevState) => ({
                    ...prevState,
                    loading: false,
                    buscador_ponente: {
                        ...prevState.buscador_ponente,
                        data: response.data,
                    },
                })
            );
        });

        await UtilsService.getPonenteFilterPaginationTotalRecord(
            {
                activo: activo,
                cuatrienio_id: cuatrienio_id,
                page: page,
                rows: rows,
                search: search
            }
        ).then((response) => {
            this.setState(
                (prevState) => ({
                    ...prevState,
                    loading: false,
                    buscador_ponente: {
                        ...prevState.buscador_ponente,
                        totalRows: response.data,
                    },
                })
            );
        })
    }
    getByID = async (id) => {
        await ProyectoLeyfieldsService.get(id)
            .then((response) => {
                let data = response.data;
                let fields = this.state.fields;
                fields.id = data.id;
                fields.cuatrienio_id = data.cuatrienio_id;
                fields.legislatura_id = data.legislatura_id;
                fields.corporacion_id = data.corporacion_id;
                fields.titulo = data.titulo;
                fields.alias = data.alias;
                fields.fecha_radicacion = data.fecha_radicacion;
                fields.numero_camara = data.numero_camara;
                fields.iniciativa_id = data.iniciativa_id;
                fields.tipo_proyecto_id = data.tipo_proyecto_id;
                fields.tema_id_principal = data.tema_id_principal;
                fields.tema_id_secundario = data.tema_id_secundario;
                fields.sinopsis = data.sinopsis;
                fields.se_acumula_a_id = data.se_acumula_a_id;
                fields.alcance_id = data.alcance_id;
                fields.activo = data.activo;
                fields.proyecto_ley_estado = data.proyecto_ley_estado;
                fields.proyecto_ley_autor_personas = [];

                let item_selected_acumula=[];
                let estados = [];
                estados = data.proyecto_ley_estado;

                if(data.hasOwnProperty('acumula') && data.acumula){
                    item_selected_acumula.push({
                        id: data.acumula.id,
                        titulo: data.acumula.titulo,
                        alias: data.acumula.alias,
                        numero_camara: data.acumula.numero_camara,
                    })
                }

                Object.assign(fields, { user: auth.username() });
                this.setState({
                    fields: fields,
                    action: "Editar",
                }, async ()=>{
                    await this.getComboLegislatura(null, null, null, null, fields.cuatrienio_id, 1);

                    let proyecto_ley_autor_personas = [];
                    if(Array.isArray(data.proyecto_ley_autor_personas)){
                        data.proyecto_ley_autor_personas.sort((a, b) => {
                            if(a.hasOwnProperty('persona') && a.persona && b.hasOwnProperty('persona') &&  b.persona ){
                                if (a.persona.id > b.persona.id){
                                    return -1;
                                }
                                if (a.persona.id <  b.persona.id){
                                    return 1;
                                }
                            }
                            return 0;
                        });

                        data.proyecto_ley_autor_personas.forEach((item_autor_persona, item_autor_persona_index, array) => {
                            let item_autor = Object.assign({}, default_item_autor);
                            if(item_autor_persona.hasOwnProperty('persona')){
                                item_autor.id = item_autor_persona.persona.id;
                                item_autor.persona_id = item_autor_persona.persona.id;
                                item_autor.nombres = item_autor_persona.persona.nombres;
                                item_autor.apellidos = item_autor_persona.persona.apellidos;
                                item_autor.fechaNacimiento = item_autor_persona.persona.fechaNacimiento;
                                if(item_autor_persona.persona.hasOwnProperty('lugar_nacimiento') && item_autor_persona.persona.lugar_nacimiento ){
                                    item_autor.lugar_nacimiento = item_autor_persona.persona.lugar_nacimiento.nombre + ' - ';
                                }
                            }

                            proyecto_ley_autor_personas.push(item_autor);
                        })
                    }

                    this.setSelectValue(
                        this.state.fields.tema_id_principal,
                        "data_select_tema_principal",
                        "item_select_tema_principal"
                    );
                    this.setSelectValue(
                        this.state.fields.tema_id_secundario,
                        "data_select_tema_secundario",
                        "item_select_tema_secundario"
                    );
                    this.setSelectValue(
                        this.state.fields.corporacion_id,
                        "data_select_corporacion",
                        "item_select_corporacion"
                    );
                    this.setSelectValue(
                        this.state.fields.cuatrienio_id,
                        "dataSelectCuatrienio",
                        "itemCuatrienio"
                    );
                    this.setSelectValue(
                        this.state.fields.legislatura_id,
                        "dataSelectLegislatura",
                        "itemLegislatura"
                    );
                    this.setSelectValue(
                        this.state.fields.iniciativa_id,
                        "dataSelectIniciativa",
                        "itemSelectIniciativa"
                    );
                    this.setSelectValue(
                        this.state.fields.tipo_proyecto_id,
                        "dataSelectTipoProyecto",
                        "itemTipoProyecto"
                    );
                    this.setSelectValue(
                        this.state.fields.alcance_id,
                        "data_select_alcance",
                        "item_select_alcance"
                    );
                    this.setState(
                        (prevState) => ({
                            ...prevState,
                            loading: false,
                            buscador_acumular: {
                                ...prevState.buscador_acumular,
                                selected: item_selected_acumula,
                            },
                            index_estado:{
                                ...prevState.index_estado,
                                data: estados
                            },
                            buscador_autor_persona: {
                                ...prevState.buscador_autor_persona,
                                selected: proyecto_ley_autor_personas
                            },
                            fields:{
                                ...prevState.fields,
                                proyecto_ley_autor_personas: proyecto_ley_autor_personas
                            }
                        })
                    );
                });
            })
            .catch((e) => {
                console.log(e);
            });
    };
    getComboTema = async (activo) => {
        await UtilsService.getComboTemaFilter({activo: activo}).then((response) => {
            let combo_principal = [];
            let combo_secundario = [];
            response.data.forEach((i) => {
                combo_principal.push({ value: i.id, label: i.nombre });
                combo_secundario.push({ value: i.id, label: i.nombre });
            });
            combo_principal.unshift(Object.assign({}, default_item_select_tema_principal));
            combo_secundario.unshift(Object.assign({}, default_item_select_tema_secundario));
            this.setState({
                data_select_tema_principal: combo_principal,
                data_select_tema_secundario: combo_secundario,
            });
        });
    };
    getComboLegislatura = async (id, nombre, fechaInicio, fechaFin, cuatrienio_id, activo) => {
        this.setState({ loading: true });

        let ids = [];
        let cuatrienio_ids = [];
        if (id) {
            if(Array.isArray(id))
            {
                for (let i = 0; i < id.length; i++) {
                    ids.push(id[i]);
                }
            }
            else
            {
                ids = JSON.stringify(ids);
            }
        }

        if (cuatrienio_id) {
            if(Array.isArray(cuatrienio_id))
            {
                for (let i = 0; i < cuatrienio_id.length; i++) {
                    cuatrienio_ids.push(cuatrienio_id[i]);
                }
            }
            else
            {
                cuatrienio_ids.push(cuatrienio_id);
            }

            cuatrienio_ids = JSON.stringify(cuatrienio_ids);
        }

        await UtilsService.getComboLegislaturaFilter({
            id: ids,
            nombre: nombre,
            fechaInicio: fechaInicio,
            fechaFin: fechaFin,
            cuatrienio_id: cuatrienio_ids,
            activo: activo
        }).then((response) => {
            let combo = [];
            let selected = Object.assign({}, defaultLegislatura);
            response.data.forEach((i) => {
                combo.push({ value: i.id, label: i.nombre });
            });
            combo.unshift(Object.assign({}, defaultLegislatura));
            this.setState({
                dataSelectLegislatura: combo,
                itemLegislatura: selected,
                loading: false,
            });
        });
    };
    getComboCuatrienio = async () => {
        await UtilsService.getComboCuatrienio().then((response) => {
            let combo = [];
            let selected = Object.assign({}, defaultCuatrienio);
            response.data.forEach((i) => {
                combo.push({ value: i.id, label: i.nombre });
            });
            combo.unshift(Object.assign({}, defaultCuatrienio));
            this.setState({
                dataSelectCuatrienio: combo,
                itemCuatrienio: selected,
            });
        });
    };
    getComboTipoProyecto = async () => {
        await UtilsService.getComboTipoProyecto().then((response) => {
            let combo = [];
            let selected = Object.assign({}, defaultTipoProyecto);
            response.data.forEach((i) => {
                combo.push({ value: i.id, label: i.nombre });
            });
            combo.unshift(Object.assign({}, defaultTipoProyecto));
            this.setState({
                dataSelectTipoProyecto: combo,
                itemTipoProyecto: selected,
            });
        });
    };
    getComboEstadoProyecto = async () => {
        this.setState({ loading: true });
        await UtilsService.getComboEstadoProyecto().then((response) => {
            let combo = [];
            response.data.forEach((i) => {
                combo.push({ value: i.id, label: i.nombre });
            });
            combo.unshift(Object.assign({}, default_item_select_estado_proyecto_ley));
            this.setState({
                data_select_estado_proyecto_ley: combo,
            });
        });
    };
    getComisiones = async ( id, nombre, corporacion_id, tipo_comision_id, cuatrienio_id, activo ) => {
        this.setState({ loading: true });
        let result = [];

        await UtilsService.getComboComisionesFilter({
            id: id,
            nombre: nombre,
            corporacion_id: corporacion_id,
            tipo_comision_id: tipo_comision_id,
            cuatrienio_id: cuatrienio_id,
            activo: activo
        }).then((response) => {
            if (response.data) {
                response.data.forEach((i) => {
                    result.push(i);
                });
            }
            this.setState({
                loading: false,
            });
        });
        return result;
    };
    getTipoPublicacionProyectoLeyProyecto = async (id, nombre, activo) => {
        this.setState({ loading: true });

        await UtilsService.getComboTipoPublicacionProyectoLeyFilter({
            id: id,
            nombre: nombre,
            activo: activo,
        }).then((response) => {
            let combo = [];
            let selected = Object.assign({}, defaultItemSelectPublicacion);
            response.data.forEach((i) => {
                combo.push({ value: i.id, label: i.nombre });
            });
            combo.unshift(Object.assign({}, defaultItemSelectPublicacion));
            this.setState({
                dataSelectTipoPublicacionProyectoLeyProyecto: combo,
                loading: false,
            });
        });
    }
    getIniciativa = async (id, nombre, activo) => {
        await UtilsService.getComboIniciativaFilter({
            id: id,
            nombre: nombre,
            activo: activo,
        }).then((response) => {
            let combo = [];
            let iniciativas = [];
            iniciativas = response.data;
            response.data.forEach((i) => {
                combo.push({ value: i.id, label: i.nombre });
            });
            combo.unshift(Object.assign({}, defaultItemSelectIniciativa));
            this.setState({
                dataSelectIniciativa: combo,
                iniciativas: iniciativas
            });
        });
    }
    getTipoFechaProyectoLey = async (id, nombre, corporacion_id, activo) => {
        this.setState({ loading: true });

        await UtilsService.getComboTipoFechaProyectoLeyFilter({
            id: id,
            nombre: nombre,
            corporacion_id: corporacion_id,
            activo: activo,
        }).then((response) => {
            let combo = [];
            response.data.forEach((i) => {
                combo.push({ value: i.id, label: i.nombre });
            });
            combo.unshift(Object.assign({}, defaultItemSelectIniciativa));
            this.setState({
                dataSelectFecha: combo,
                loading: false,
            });
        });
    }
    getComboAlcance = async () => {
        await UtilsService.getComboAlcanceFilter({activo: 1}).then((response) => {
            let combo = [];
            response.data.forEach((i) => {
                combo.push({ value: i.id, label: i.nombre });
            });
            combo.unshift(Object.assign({}, default_item_select_alcance));
            this.setState({
                data_select_alcance: combo,
            });
        });
    };
    //</editor-fold>

    //<editor-fold desc="Reset">
    resetFields() {
        let fields = Object.assign({}, fieldsConst);
        let errors = Object.assign({}, errorsConst);
        this.setState({
            fields: fields,
            errors: errors,
        });
        this.resetSelectsModal();
    }
    resetSelectsModal = () => {
        this.setState({
            item_select_estado_corporacion: Object.assign({},default_item_select_estado_corporacion),
            item_select_estado_proyecto_ley: Object.assign({}, default_item_select_estado_proyecto_ley),
        });
    };
    //</editor-fold>

    //<editor-fold desc="Render imagen">
    renderImagenAutor = (congresista) => {
        if (congresista !== undefined) {
            let itemImagen = congresista.congresista_imagen[2];
            if (itemImagen !== undefined) {
                return itemImagen.imagen;
            }
        }
    };
    renderImagenComision = (comision) => {
        if (comision !== undefined) {
            if(Array.isArray(comision.comision_imagen) && comision.comision_imagen.length >= 3)
            {
                let itemImagen = comision.comision_imagen[2];
                if (itemImagen !== undefined) {
                    return itemImagen.imagen;
                }
            }
        }
    };
    renderImagenPonente = (ponente) => {
        if (ponente !== undefined) {
            if(Array.isArray(ponente.congresista_imagen) && ponente.congresista_imagen.length >= 3)
            {
                let itemImagen = ponente.congresista_imagen[2];
                if (itemImagen !== undefined) {
                    return itemImagen.imagen;
                }
            }
        }
    };
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
                                                <i className="fa fa-user"/>{" "}
                                                {this.state.action}{" "}
                                            </strong>
                                        </h3>
                                    </div>
                                    <div className="panel-body">
                                        <div className="row">
                                            <h3> Información de la {this.state.title_lowercase} </h3>
                                            <div className="col-md-9">

                                                <div className="form-group">
                                                    <label className="col-md-3 control-label"> Título </label>
                                                    <div className="col-md-9">
                                                        <div className="input-group">
                                                            <Input
                                                                divClass="input-group"
                                                                inputName="nombre"
                                                                inputType="text"
                                                                inputClass="form-control"
                                                                inputplaceholder="Ingrese el título"
                                                                inputValue={ this.state.fields.titulo || "" }
                                                                inputOnchange={(e) => {
                                                                    let fields = this.state.fields;
                                                                    let errors = this.state.errors;

                                                                    fields = validForm.handleChangeField("titulo", fields, e);
                                                                    errors = validForm.handleChangeErrors("titulo", errors,e);
                                                                    this.setState({
                                                                        fields: fields,
                                                                        errors: errors,
                                                                    });
                                                                }}
                                                                spanClass="error"
                                                                spanError={ this.state.errors.titulo || "" }
                                                                divClassSpanType={ 1 }
                                                                divClassSpan="input-group-addon"
                                                                divClassSpanI="fa fa-indent"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <label className="col-md-3 control-label"> Alias </label>
                                                    <div className="col-md-9">
                                                        <div className="input-group">
                                                            <Input
                                                                divClass="input-group"
                                                                inputName="alias"
                                                                inputType="text"
                                                                inputClass="form-control"
                                                                inputplaceholder="Ingrese el alias"
                                                                inputValue={ this.state.fields.alias || "" }
                                                                inputOnchange={(e) => {
                                                                    let fields = this.state.fields;
                                                                    let errors = this.state.errors;

                                                                    fields = validForm.handleChangeField("alias", fields, e);
                                                                    errors = validForm.handleChangeErrors("alias", errors,e);
                                                                    this.setState({
                                                                        fields: fields,
                                                                        errors: errors,
                                                                    });
                                                                }}
                                                                spanClass="error"
                                                                spanError={ this.state.errors.alias || "" }
                                                                divClassSpanType={ 1 }
                                                                divClassSpan="input-group-addon"
                                                                divClassSpanI="fa fa-indent"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <label className="col-md-3 control-label"> Fecha de introducción </label>
                                                    <div className="col-md-9">
                                                        <div className="input-group">
                                                            <DatePicker
                                                                id="fecha_radicacion"
                                                                showInputTime={ false }
                                                                divClass="input-group"
                                                                dateSelected={
                                                                    this.state.fields.fecha_radicacion
                                                                        ? FechaMysql.DateFormatMySql(this.state.fields.fecha_radicacion)
                                                                        : null
                                                                }
                                                                onChangeDate={(e) => {
                                                                    let fecha = e;

                                                                    if (!fecha) {
                                                                        fecha = FechaMysql.DateFormatMySql(new Date());
                                                                    }
                                                                    fecha = FechaMysql.DateFormatMySql(fecha);

                                                                    this.setState(
                                                                        (prevState) => ({
                                                                            ...prevState,
                                                                            fields: {
                                                                                ...prevState.fields,
                                                                                fecha_radicacion: fecha,
                                                                            },
                                                                        })
                                                                    );
                                                                }}
                                                                spanClass="error"
                                                                spanError={ this.state.errors.fecha_radicacion || "" }
                                                                divClassSpanType={ 1 }
                                                                divClassSpan="input-group-addon"
                                                                divClassSpanI="fa fa-calendar"
                                                                maxDate={new Date()}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <label className="col-md-3 control-label"> Número de proyecto </label>
                                                    <div className="col-md-9">
                                                        <div className="input-group">
                                                            <Input
                                                                divClass="input-group"
                                                                inputName="numero_camara"
                                                                inputType="text"
                                                                inputClass="form-control"
                                                                inputplaceholder="Ingrese el número en cámara"
                                                                inputValue={ this.state.fields.numero_camara || "" }
                                                                inputOnchange={(e) => {
                                                                    let fields = this.state.fields;
                                                                    let errors = this.state.errors;

                                                                    fields = validForm.handleChangeField("numero_camara", fields, e);
                                                                    errors = validForm.handleChangeErrors("numero_camara", errors, e);
                                                                    this.setState({
                                                                        fields: fields,
                                                                        errors: errors,
                                                                    });
                                                                }}
                                                                spanClass="error"
                                                                spanError={ this.state.errors.numero_camara || "" }
                                                                divClassSpanType={ 1 }
                                                                divClassSpan="input-group-addon"
                                                                divClassSpanI="fa fa-indent"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <label className="col-md-3 control-label"> Tema principal</label>
                                                    <div className="col-md-9">
                                                        <div className="input-group">
                                                            <Select
                                                                divClass=""
                                                                selectplaceholder="Seleccione"
                                                                selectValue={ this.state.item_select_tema_principal }
                                                                selectOnchange={ this.handlerSelectTemaPrincipal }
                                                                selectoptions={ this.state.data_select_tema_principal }
                                                                selectIsSearchable={ true }
                                                                selectclassNamePrefix="selectReact__value-container"
                                                                spanClass="error"
                                                                spanError={ this.state.errors.tema_id_principal || "" }
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <label className="col-md-3 control-label"> Tema secundario</label>
                                                    <div className="col-md-9">
                                                        <div className="input-group">
                                                            <Select
                                                                divClass=""
                                                                selectplaceholder="Seleccione"
                                                                selectValue={ this.state.item_select_tema_secundario }
                                                                selectOnchange={ this.handlerSelectTemaSecundario }
                                                                selectoptions={ this.state.data_select_tema_secundario }
                                                                selectIsSearchable={ true }
                                                                selectclassNamePrefix="selectReact__value-container"
                                                                spanClass="error"
                                                                spanError={ this.state.errors.tema_id_secundario || "" }
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <label className="col-md-3 control-label"> Periodo legislativo </label>
                                                    <div className="col-md-9">
                                                        <div className="input-group">
                                                            <Select
                                                                divClass=""
                                                                selectplaceholder="Seleccione"
                                                                selectValue={ this.state.itemCuatrienio }
                                                                selectIsSearchable={ false }
                                                                selectoptions={ this.state.dataSelectCuatrienio }
                                                                selectOnchange={ this.handlerItemCuatrienio }
                                                                selectclassNamePrefix="selectReact__value-container"
                                                                spanClass="error"
                                                                spanError={ this.state.errors["cuatrienio_id"] || "" }
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <label className="col-md-3 control-label"> Año </label>
                                                    <div className="col-md-9">
                                                        <div className="input-group">
                                                            <Select
                                                                divClass=""
                                                                selectplaceholder="Seleccione"
                                                                selectValue={ this.state.itemLegislatura }
                                                                selectOnchange={ this.handlerItemLegislatura }
                                                                selectoptions={ this.state.dataSelectLegislatura }
                                                                selectIsSearchable={ false }
                                                                selectclassNamePrefix="selectReact__value-container"
                                                                spanClass="error"
                                                                spanError={ this.state.errors.legislatura_id || "" }
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <label className="col-md-3 control-label"> Iniciativa </label>
                                                    <div className="col-md-9">
                                                        <div className="input-group">
                                                            <Select
                                                                divClass=""
                                                                selectplaceholder="Seleccione"
                                                                selectValue={ this.state.itemSelectIniciativa }
                                                                selectOnchange={ this.handlerItemIniciativa }
                                                                selectoptions={ this.state.dataSelectIniciativa }
                                                                selectIsSearchable={ false }
                                                                selectclassNamePrefix="selectReact__value-container"
                                                                spanClass="error"
                                                                spanError={ this.state.errors.iniciativa_id || "" }
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                {/* <div className="form-group">
                                                    <label className="col-md-3 control-label"> Tipo de iniciativa </label>
                                                    <div className="col-md-9">
                                                        <div className="input-group">
                                                            <Select
                                                                divClass=""
                                                                selectplaceholder="Seleccione"
                                                                selectValue={ this.state.itemTipoProyecto }
                                                                selectIsSearchable={ false }
                                                                selectoptions={ this.state.dataSelectTipoProyecto }
                                                                selectOnchange={ this.handlerItemTipoProyecto }
                                                                selectclassNamePrefix="selectReact__value-container"
                                                                spanClass="error"
                                                                spanError={ this.state.errors.tipo_proyecto_id || "" }
                                                            />
                                                        </div>
                                                    </div>
                                                </div> */}
                                                <div className="form-group">
                                                    <label className="col-md-3 control-label">
                                                        Sinopsis
                                                    </label>
                                                    <div className="col-md-9">
                                                        <SunEditor
                                                            placeholder="..."
                                                            setContents={ this.state.fields.sinopsis || "" }
                                                            onChange={(e) => {
                                                                let fields = this.state.fields;
                                                                let errors = this.state.errors;

                                                                fields = validForm.handleChangeFieldJodiEditor("sinopsis", fields, e);
                                                                errors = validForm.handleChangeErrors("sinopsis", errors, e);
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
                                                            { this.state.errors.sinopsis || "" }
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="panel panel-default tabs">
                                        <ul className="nav nav-tabs nav-justified">
                                            <li className="active">
                                                <a
                                                    href={`#tab-estados`}
                                                    data-toggle="tab"
                                                >
                                                    Estados
                                                </a>
                                            </li>
                                            <li>
                                                <a
                                                    href={`#tab-observaciones`}
                                                    data-toggle="tab"
                                                >
                                                    Observaciones a la Iniciativa
                                                </a>
                                            </li>
                                            <li>
                                                <a
                                                    href={`#tab-autores`}
                                                    data-toggle="tab"
                                                >
                                                    Proponentes
                                                    {/* Proyectistas */}
                                                </a>
                                            </li>
                                        </ul>
                                        <div className="panel-body tab-content row">
                                            <div
                                                className={`tab-pane active`}
                                                id={`tab-estados`}
                                            >
                                                <div className="col-md-12">
                                                    <div className="form-group">
                                                        <span className='error'>{this.state.errors.proyecto_ley_estado}</span>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        data-toggle="modal"
                                                        data-target="#modal-estado"
                                                        className="pull-right btn btn-primary"
                                                        onClick={ async () => {
                                                            this.handlerResetModalEstado();
                                                        }}
                                                    >
                                                        <i className="fa fa-plus"/>{" "}
                                                        Nuevo registro
                                                    </button>
                                                    <div className="panel-body">
                                                        <div>
                                                            <TableReact
                                                                columns={this.state.index_estado.columns}
                                                                data={this.state.index_estado.data}
                                                                hiddenColumns={this.state.index_estado.hiddenColumns}
                                                                pageExtends={this.state.index_estado.page}
                                                                totalRows={this.state.index_estado.totalRows}
                                                                search={this.state.index_estado.search}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>

                                                <div
                                                    className="modal"
                                                    id="modal-estado"
                                                    tabIndex="-1"
                                                    role="dialog"
                                                    aria-labelledby="largeModalHead"
                                                    aria-hidden="true"
                                                >
                                                    <div className="modal-dialog modal-lg">
                                                        <div className="modal-content">
                                                            <div className="modal-header">
                                                                <button
                                                                    type="button"
                                                                    className="close"
                                                                    data-dismiss="modal"
                                                                >
                                                                    <span aria-hidden="true">
                                                                        &times;
                                                                    </span>
                                                                    <span className="sr-only">
                                                                        Cerrar
                                                                    </span>
                                                                </button>
                                                                <h4
                                                                    className="modal-title"
                                                                    id="largeModalHead"
                                                                >
                                                                    <i className="fa fa-list"/>{" "}
                                                                    {this.state.item_estado.id === 0 ? 'Crear' : 'Modificar'} estado
                                                                </h4>
                                                            </div>
                                                            <div className="modal-body">
                                                                <div className="row">
                                                                    <div className="col-md-6">
                                                                        <div className="form-group">
                                                                            <div className="input-group">
                                                                                <label> Fecha </label>
                                                                                <DatePicker
                                                                                    id="item_estado_fecha"
                                                                                    showInputTime={ false }
                                                                                    divClass="input-group"
                                                                                    dateSelected={
                                                                                        this.state.item_estado.fecha
                                                                                            ? FechaMysql.DateFormatMySql(this.state.item_estado.fecha)
                                                                                            : null
                                                                                    }
                                                                                    onChangeDate={(e) => {
                                                                                        let fecha = e;

                                                                                        if (!fecha) {
                                                                                            fecha = FechaMysql.DateFormatMySql(new Date());
                                                                                        }
                                                                                        fecha = FechaMysql.DateFormatMySql(fecha);

                                                                                        this.setState(
                                                                                            (prevState) => ({
                                                                                                ...prevState,
                                                                                                item_estado: {
                                                                                                    ...prevState.item_estado,
                                                                                                    fecha: fecha,
                                                                                                },
                                                                                            })
                                                                                        );
                                                                                    }}
                                                                                    spanClass="error"
                                                                                    spanError={ this.state.item_error_estado.fecha || "" }
                                                                                    divClassSpanType={ 1 }
                                                                                    divClassSpan="input-group-addon"
                                                                                    divClassSpanI="fa fa-calendar"
                                                                                    maxDate={new Date()}
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-md-6">
                                                                        <div className="form-group">
                                                                            <div className="input-group">
                                                                                <label> Orden </label>
                                                                                <Input
                                                                                    divClass="input-group"
                                                                                    inputName="item_estado_orden"
                                                                                    inputType="text"
                                                                                    inputClass="form-control"
                                                                                    inputplaceholder="Ingrese el orden"
                                                                                    inputValue={ this.state.item_estado.orden || "" }
                                                                                    inputOnchange={(e) => {
                                                                                        let value = e.target.value;
                                                                                        let exp_reg = /^[0-9]*$/;

                                                                                        if(exp_reg.test(value)){
                                                                                            let item_estado = this.state.item_estado;
                                                                                            let item_error_estado = this.state.item_error_estado;
                                                                                            item_estado = validForm.handleChangeField("orden", item_estado, e);
                                                                                            item_error_estado = validForm.handleChangeErrors("orden", item_error_estado, e);
                                                                                            this.setState({
                                                                                                item_estado: item_estado,
                                                                                                item_error_estado: item_error_estado,
                                                                                            });
                                                                                        }
                                                                                        else{
                                                                                            let item_error_estado = this.state.item_error_estado;
                                                                                            item_error_estado.orden = 'Solo números mayores a 0';
                                                                                            this.setState({
                                                                                                item_error_estado: item_error_estado,
                                                                                            });
                                                                                        }
                                                                                    }}
                                                                                    spanClass="error"
                                                                                    spanError={ this.state.item_error_estado.orden || ""  }
                                                                                    divClassSpanType={ 1 }
                                                                                    divClassSpan="input-group-addon"
                                                                                    divClassSpanI="fa fa-indent"
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-md-6">
                                                                        <div className="form-group">
                                                                            <div className="input-group">
                                                                                <label> Estado </label>
                                                                                <div className='input-group'>
                                                                                    <span className="input-group-addon">
                                                                                        <i className="fa fa-user"/>
                                                                                    </span>
                                                                                    <Select
                                                                                        divClass=""
                                                                                        selectplaceholder="Seleccione un estado"
                                                                                        selectValue={ this.state.item_select_estado_proyecto_ley }
                                                                                        selectOnchange={(e) => {
                                                                                            this.handlerEstadoProyectoDeLeyEstado(e);
                                                                                        }}
                                                                                        selectoptions={ this.state.data_select_estado_proyecto_ley }
                                                                                        selectIsSearchable={ true }
                                                                                        selectclassNamePrefix="selectReact__value-container"
                                                                                        spanClass="error"
                                                                                        spanError={ this.state.item_error_estado.estado_proyecto_ley_id || "" }
                                                                                    />
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-md-12">
                                                                        <div className="form-group">
                                                                            <div className="input-group">
                                                                                <label> Observaciones </label>
                                                                                <textarea
                                                                                    value={this.state.item_estado.observaciones || ""}
                                                                                    className="form-control"
                                                                                    rows="10"
                                                                                    maxLength={368}
                                                                                    onChange={(e) => {
                                                                                        let item_estado = this.state.item_estado;
                                                                                        let item_error_estado = this.state.item_error_estado;
                                                                                        item_estado = validForm.handleChangeFieldJodiEditor("observaciones", item_estado, e.currentTarget.value);
                                                                                        item_error_estado = validForm.handleChangeErrors("observaciones", item_error_estado, e.currentTarget.value);
                                                                                        this.setState({
                                                                                            item_error: item_estado,
                                                                                            item_error_estado: item_error_estado,
                                                                                        });
                                                                                    }}
                                                                                />
                                                                                <span className="error">
                                                                                    {this.state.item_error_estado.observaciones || ""}
                                                                                </span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <hr />
                                                                <p>
                                                                    <i className="fa fa-info-circle"/>{" "}
                                                                    El estado del proyecto de ley aún no esta registrado en la base de datos.
                                                                    Debe guardar completamente el formulario.
                                                                </p>
                                                                <div className="panel-footer">
                                                                    <button
                                                                        type="button"
                                                                        className="btn btn-default"
                                                                        data-dismiss="modal"
                                                                        ref="close_modal_estado"
                                                                    >
                                                                        Cerrar
                                                                    </button>
                                                                    <button
                                                                        type="button"
                                                                        onClick={async (e) => {
                                                                            await this.saveSubmitEstado(e);
                                                                        }}
                                                                        className="btn btn-success pull-right"
                                                                    >
                                                                        <i className="fa fa-check"/>{" "}
                                                                        Guardar
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className={`tab-pane`} id={`tab-observaciones`}>
                                                <div className="observacionesIniciativaContainer">
                                                {
                                                    this.state.observacionesList.length ?
                                                    this.state.observacionesList.map(x => {
                                                        return (
                                                            <div>
                                                                <h3>{x.email}</h3>
                                                                <p style={{whiteSpace: 'pre-line'}}>{x.observacionesIniciativa}</p>
                                                            </div>
                                                        )
                                                    })
                                                    : <div>Esta iniciativa aún no cuenta con observaciones</div>
                                                }
                                                </div>
                                            </div>
                                            <div
                                                className={`tab-pane`}
                                                id={`tab-autores`}
                                            >
                                                <div className="panel-body">
                                                    <div className="col-md-12">
                                                        <div className="form-group">
                                                            <div className="form-group">
                                                                <span className='error'>{this.state.errors.proyecto_ley_autor_personas}</span>
                                                            </div>
                                                            <div className="input-group">
                                                                <CustomBuscador
                                                                    info_columns = { this.state.buscador_autor_persona.info_columns }
                                                                    default_item = {this.state.buscador_autor_persona.default_item}
                                                                    handler={this.tableHandlerAutorPersona}
                                                                    handlerChangeSearch={this.handlerChangeSearchForAutorPersona}
                                                                    handlerSelect={this.handlerSelectAutorPersona}
                                                                    handlerDeleteSelect={this.handlerSelectDeleteAutorPersona}
                                                                    data={this.state.buscador_autor_persona.data}
                                                                    imgDefault={Constantes.NoImagen}
                                                                    imgOrigin={this.state.buscador_autor_persona.imgOrigin}
                                                                    pageExtends={this.state.buscador_autor_persona.page}
                                                                    pageSize={this.state.buscador_autor_persona.rows}
                                                                    totalRows={this.state.buscador_autor_persona.totalRows}
                                                                    search={this.state.buscador_autor_persona.search}
                                                                    selected={this.state.buscador_autor_persona.selected}
                                                                    selectMultiple={true}
                                                                />
                                                            </div>
                                                        </div>
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
                                                        this.state.fields["id"] === 0 ?
                                                            ModuloPermiso.ProyectoDeLey.Nuevo
                                                            : ModuloPermiso.ProyectoDeLey.Modificar
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
                            <div className={`message-box message-box-${this.state.item_desactivar.activo ? "danger" : "info"} animated fadeIn`} id="modal-activar-desactivar-estado">
                                <form>
                                    <div className="mb-container">
                                        <div className="mb-middle">
                                            <div className="mb-title"><span className={`fa fa-${this.state.item_desactivar.activo ? "eraser" : "check"}`}/> {this.state.item_desactivar.activo ? "Desactivar" : "Activar"} estado</div>
                                            <div className="mb-content">
                                                <p>{`¿Está seguro que desea ${this.state.item_desactivar.activo ? "desactivar" : "activar"} el estado ${this.state.item_desactivar.titulo}? Puede volver a ${this.state.item_desactivar.activo ? "activarlo" : "desactivarlo"} en cualquier otro momento.`}</p>
                                            </div>
                                            <div className="mb-footer">
                                                <button type="button" className="btn btn-primary btn-lg pull-right" onClick={async (e) => { await this.deleteSubmitEstado(e) }} >{this.state.item_desactivar.activo ? "Desactivar" : "Activar"}</button>
                                                &nbsp;
                                                <button className="btn btn-default btn-lg pull-right" type="button" data-dismiss="modal">Cancelar</button>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

export default CrearProyectoLey;
