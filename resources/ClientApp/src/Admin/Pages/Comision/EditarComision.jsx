import React, { Component } from "react";
import CongresistasDataService from "../../../Services/Catalogo/Congresistas.Service";
import ComisionDataService from "../../../Services/Catalogo/Comision.Service";
import UtilsDataService from "../../../Services/General/Utils.Service";
import CuatrienioDataService from "../../../Services/Catalogo/Cuatrienio.Service";
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
import BuscadorPersona from '../../../Components/BuscadorPersona';
import BuscadorCongresista from '../../../Components/BuscadorCongresista';

const auth = new AuthLogin();
const constFileds = {
    id: 0,
    tipo_comision_id: 0,
    nombre: "",
    descripcion: "",
    imagen: null,
    datosContacto: [
        {
            id2: 0,
            dato_contacto_id: null,
            comision_id: null,
            cuenta: null,
            activo: 1,
        },
    ],
    miembros: [
        {
            id2: 0,
            comision_id: 0,
            persona_id: null,
            fecha_inicio: '',
            fecha_fin: '',
            nombre: '',
            path: Constantes.NoImagen,
            activo: 1
        }
    ],
    secretarios: [
        {
            id2: 0,
            comision_id: 0,
            persona_id: null,
            fecha_inicio: '',
            fecha_final: '',
            nombre: '',
            path: Constantes.NoImagen,
            activo: 1
        }
    ],
    user: "",
};
const constErrors = {
    id: "",
    nombre: "",
    descripcion: "",
    imagen: "",
    tipo_comision_id: '',
    datosContacto: [
        {
            id2: "",
            dato_contacto_id: "",
            comision_id: "",
            cuenta: "",
            activo: "",
        },
    ],
    miembros: [
        {
            id2: "",
            comision_id: "",
            persona_id: "",
            fecha_inicio: '',
            fecha_fin: '',
            activo: ""
        }
    ],
    secretarios: [
        {
            id2: '',
            comision_id: '',
            persona_id: '',
            nombre: '',
            fecha_inicio: '',
            fecha_final: '',
            activo: 1
        }
    ],
};

const constErrorsModal = {
    errorCuatrienio: '',
    errorMiembro: '',
    errorCargo: '',
    errorTipoCongresista: '',
    errorFechaInicio: '',
    errorFechaFin: ''
};

const constErrorsModalSecretarios = {
    errorSecretario: '',
    errorFechaInicio: '',
    errorFechaFin: ''
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
const SelectDatosContacto = { value: 0, label: 'Seleccione un dato contacto' };
const SelectTipoComision = { value: 0, label: 'Seleccione tipo comision' };
const SelectCuatrienio = { value: 0, label: 'Seleccione quinquenio' };
const SelectCongresistas = { value: 0, label: 'Seleccione miembro' };
const SelectSecretario = { value: 0, label: 'Seleccione secretario' };
const SelectCargo = { value: 0, label: 'Seleccione cargo' };
const SelectTipoCongresista = { value: 0, label: 'Seleccione el tipo' };

const validForm = new ValidForm();

class EditarComision extends Component {
    constructor(props) {
        super(props);
        const id =
            this.props.match.params.id === undefined
                ? 0
                : this.props.match.params.id;
        this.tableHandler = this.tableHandler.bind(this);
        this.tableHandlerCongresista = this.tableHandlerCongresista.bind(this);
        this.state = {
            id: id,
            buscadorPersona: {
                data: [],
                selected: { id: 0 },
                imgOrigin: auth.pathApi(),
                search: "",
                page: 1,
                rows: 15,
                totalRows: 0
            },
            buscadorCongresista: {
                data: [],
                selected: { id: 0 },
                imgOrigin: auth.pathApi(),
                search: "",
                page: 1,
                rows: 15,
                totalRows: 0
            },
            loading: false,
            fields: constFileds,
            errors: constErrors,
            selectDatosContacto: SelectDatosContacto,
            dataSelectDatosContanto: [SelectDatosContacto],
            selectTipoComision: SelectTipoComision,
            dataSelectTipoComision: [SelectTipoComision],
            selectCuatrienio: SelectCuatrienio,
            dataSelectCuatrienio: [SelectCuatrienio],
            selectCongresista: SelectCongresistas,
            dataSelectCongresistas: [SelectCongresistas],
            selectCargo: SelectCargo,
            dataSelectCargo: [SelectCargo],
            selectSecretario: SelectSecretario,
            dataSelectSecretario: [SelectSecretario],
            selectTipoCongresista: SelectTipoCongresista,
            dataSelectTipoCongresista: [
                { value: 0, label: 'Seleccione el tipo' },
                { value: 1, label: 'Mesa directiva' },
                { value: 3, label: 'Miembro' },
            ],
            url: "",
            datosContactoDetalle: [],
            miembrosDetalle: [],
            secretariosDetalle: [],
            imagesResized: [],
            miembroRepetido: false,
            secretarioRepetido: false,
            errorsModal: constErrorsModal,
            errorsModalSecretarios: constErrorsModalSecretarios,
            txtDescripcion: "",
            fechasSecretario: {
                fecha_inicio: new Date(),
                fecha_fin: new Date()
            },
            fechasMiembro: {
                fecha_inicio: new Date(),
                fecha_fin: new Date()
            },
            cuatrienioItemSelected: null
        };
    }
    // Todo de persona
    async tableHandler(page, rows, search) {
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

    handlerChangeSearchForPersona = (value) => {
        let buscadorPersona = this.state.buscadorPersona;
        buscadorPersona.search = value;
        this.setState({ buscadorPersona })
    }
    handlerSelectPersona = (persona) => {
        let buscadorPersona = this.state.buscadorPersona;
        buscadorPersona.selected = persona;
        this.setState({ buscadorPersona })
        this.handlerAddSecretario()
    }

    getAllPersonas = async (idFilterActive, page, rows, search) => {
        this.setState({ loading: true });
        let tableInfo = this.state.buscadorPersona;
        let secretariosDetalle = this.state.secretariosDetalle;
        await ComisionDataService.getAllPersonas(
            idFilterActive,
            search,
            page,
            rows
        ).then((response) => {
            tableInfo.data = response.data;
            secretariosDetalle = response.data;
        })
            .catch((e) => {
                console.log(e);
            });

        await ComisionDataService.totalrecordsPersonas(idFilterActive, search)
            .then((response) => {
                tableInfo.totalRows = response.data;
            })
            .catch((e) => {
                console.log(e);
            });
        this.setState({
            buscadorPersona: tableInfo,
            secretariosDetalle,
            loading: false
        });
    };
    // End todo de persona

    //Todo congresistas

    async tableHandlerCongresista(page, rows, search) {
        let buscadorCongresista = this.state.buscadorCongresista;
        buscadorCongresista.page = page;
        buscadorCongresista.rows = rows;
        buscadorCongresista.search = search;
        this.setState({ buscadorCongresista: buscadorCongresista });
        if (this.timeout) clearTimeout(this.timeout);
        this.timeout = setTimeout(
            async function () {
                await this.getAllCongresistas(
                    1,
                    page,
                    rows,
                    search
                );
            }.bind(this),
            1000
        );
    }

    getAllCongresistas = async (idFilterActive,  page, rows, search) => {
        this.setState({ loading: true });
        let buscadorCongresista = this.state.buscadorCongresista;
        await CongresistasDataService.getAll(
            idFilterActive,
            search,
            page,
            rows
        )
            .then((response) => {
                buscadorCongresista.data = response.data;
            })
            .catch((e) => {
                console.error(e);
            });

        await CongresistasDataService.getTotalRecords(idFilterActive, search)
            .then((response) => {
                buscadorCongresista.totalRows = response.data;
            })
            .catch((e) => {
                console.error(e);
            });

        this.setState({
            buscadorCongresista: buscadorCongresista,
            loading: false,
        });
    };

    handlerChangeSearchForCongresista = (value) => {
        let buscadorCongresista = this.state.buscadorCongresista;
        buscadorCongresista.search = value;
        this.setState({ buscadorCongresista })
    }
    handlerSelectCongresista = (congresista) => {
        let buscadorCongresista = this.state.buscadorCongresista;
        let congresistaSelected = {
            id: congresista.id,
            nombres: congresista.nombres,
            apellidos: congresista.apellidos,
            imagenes: congresista.imagenes,
            lugar_nacimiento: congresista.lugar_nacimiento
        };
        buscadorCongresista.selected = congresistaSelected;
        this.setState({ buscadorCongresista })
    }
    //End congresistas 

    componentDidMount = async () => {
        this.resetFields();
        await this.getComboDatosContacto();
        await this.getAllPersonas(1, this.state.buscadorPersona.page, this.state.buscadorPersona.rows, this.state.buscadorPersona.search);
        this.state.fields.id = this.state.id;
        this.state.fields.user = auth.username();

        let id = this.state.id;
        if (id != 0) await this.getByID(id);
        else this.resetFields();
    };

    // combos

    getComboCargoCongresista = async (selectTipoCongresista) => {
        this.setState({ loading: true });
        if (selectTipoCongresista.value === 0) {
            await UtilsDataService.getComboCargoCongresista().then(response => {
                let combo = [];
                response.data.forEach(i => {
                    combo.push({ value: i.id, label: i.nombre })
                })
                combo.unshift(SelectCargo)
                this.setState({
                    dataSelectCargo: combo,
                    loading: false
                });
            });
        }
        else if (selectTipoCongresista.value === 1) {
            await UtilsDataService.getComboCargoMesaDirectivaCongresista().then(response => {
                let combo = [];
                response.data.forEach(i => {
                    combo.push({ value: i.id, label: i.nombre })
                })
                combo.unshift(SelectCargo)
                this.setState({
                    dataSelectCargo: combo,
                    loading: false
                });
            });
        }
        else if (selectTipoCongresista.value === 3) {
            await UtilsDataService.getComboCargoMiembrosCongresista().then(response => {
                let combo = [];
                response.data.forEach(i => {
                    combo.push({ value: i.id, label: i.nombre })
                })
                combo.unshift(SelectCargo)
                this.setState({
                    dataSelectCargo: combo,
                    loading: false
                });
            });
        }
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

    getByID = async (id) => {
        this.setState({ loading: true });
        await ComisionDataService.get(id)
            .then((response) => {
                let fields = this.state.fields;
                let txtDescripcion = this.state.txtDescripcion;
                let errors = this.state.errors;
                fields = response.data[0];
                console.log(fields);
                Object.assign(fields, { user: auth.username() });
                txtDescripcion = fields.descripcion;
                fields.imagen = fields.comision_imagen;
                fields.datosContacto = fields.comision_datos_contacto;
                fields.miembros = [];
                fields.secretarios = [];
                fields.datosContacto.map((item, i) => {
                    errors.datosContacto.push({
                        id: "",
                        dato_contacto_id: "",
                        partido_id: "",
                        cuenta: "",
                        activo: "",
                    });
                    return null;
                });
                fields.comision_miembro.map(item => {
                    console.log(item);
                    response.data[0].miembros.push({
                        id: item.id,
                        comision_id: item.comision_id,
                        persona_id: item.persona_id,
                        nombre: item.persona.nombres + ' ' + item.persona.apellidos,
                        fecha_inicio: item.fecha_inicio,
                        fecha_fin: item.fecha_fin,
                        path: item.persona.imagenes.length > 0 ? auth.pathApi() + item.persona.imagenes[2].imagen : Constantes.NoImagen,
                        activo: 1
                    })
                    errors.miembros.push({
                        id: "",
                        comision_id: "",
                        persona_id: "",
                        fecha_inicio: "",
                        fecha_fin: "",
                        activo: ""
                    })
                });

                fields.comision_secretario.map(item => {
                    response.data[0].secretarios.push({
                        id: item.id,
                        comision_id: item.comision_id,
                        persona_id: item.persona_id,
                        nombre: item.persona.nombres + ' ' + item.persona.apellidos,
                        fecha_inicio: item.fecha_inicio,
                        fecha_final: item.fecha_final,
                        path: item.persona.imagenes.length > 0 ? auth.pathApi() + item.persona.imagenes[2].imagen : Constantes.NoImagen,
                        activo: 1
                    })
                    errors.miembros.push({
                        id: "",
                        comision_id: "",
                        persona_id: "",
                        fecha_inicio: "",
                        fecha_final: "",
                        activo: ""
                    })
                });
                this.setState({
                    fields: fields,
                    loading: false,
                    txtDescripcion: txtDescripcion,
                }, () => {
                    this.setSelectValue(
                        fields.tipo_comision_id,
                        "dataSelectTipoComision",
                        "selectTipoComision"
                    );
                });
                // this.getComboCongresista(fields.cuatrienio_id);
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

    handleCongresista = async (selectOption) => {
        this.setState({ selectCongresista: selectOption });
    };

    handleCargo = async (selectOption) => {
        this.setState({ selectCargo: selectOption });
    };


    handleSecretario = async (select) => {
        this.setState({ selectSecretario: select });
    }

    handleCuatrienio = async (selectOption) => {
        this.setState({ selectCuatrienio: selectOption, selectCongresista: SelectCongresistas });
        this.tableHandlerCongresista(1, 15, "");
        this.getCuatrienio(selectOption.value);
    };

    handleFilterTipoComision = async (selectTipoComision) => {
        this.setState({ selectTipoComision: selectTipoComision });
    }

    handlerAddDatosContacto = () => {
        let dato_contacto_id = this.state.selectDatosContacto.value;
        let url = this.state.url;
        if (url != "" && dato_contacto_id != 0) {
            let item = {
                id: 0,
                dato_contacto_id: dato_contacto_id,
                comision_id: this.state.fields.id,
                cuenta: url,
                activo: 1,
            };
            let itemError = {
                id: "",
                dato_contacto_id: "",
                comision_id: "",
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

    handlerAddMiembro = () => {
        let errorsModal = validForm.resetObject(constErrorsModal);
        let fechas = this.state.fechasMiembro;
        let miembro = this.state.buscadorPersona.selected;
        let errors = 0;
        if (miembro.id === 0) {
            errorsModal.errorMiembro = "Seleccione un miembro";
            errors++;
        }
        let repetidos = this.state.fields.miembros.filter(x => x.persona_id === miembro.id && x.activo === 1);
        
        if (repetidos.length > 0) {
            errorsModal.errorMiembro = "El miembro ya se encuentra en la lista";
            errors++;
        }
        if (errors > 0) {
            this.setState({ errorsModal: errorsModal, loading: false });
            return false;
        }

        let persona_id = miembro.id;
        let nombre_congresista = miembro.nombres + miembro.apellidos;
        let path = this.renderImagenMiembro(persona_id) != null
            ? auth.pathApi() +
            this.renderImagenMiembro(
                persona_id
            ) ||
            ""
            : Constantes.NoImagen
        let item = {
            id: 0,
            comision_id: this.state.fields.id,
            persona_id: persona_id,
            fecha_inicio: FechaMysql.DateFormatMySql(this.state.fechasMiembro.fecha_inicio),
            fecha_fin: FechaMysql.DateFormatMySql(this.state.fechasMiembro.fecha_fin),
            nombre: nombre_congresista,
            path: path,
            activo: 1,
        };
        let itemError = {
            id: "",
            comision_id: "",
            persona_id: "",
            fecha_inicio: "",
            fecha_fin: "",
            activo: "",
        };
        this.setState((prevState) => ({
            ...prevState,
            fields: {
                ...prevState.fields,
                miembros: [...prevState.fields.miembros, item],
            },
            errors: {
                ...prevState.errors,
                miembros: [
                    ...prevState.errors.miembros,
                    itemError,
                ],
            },
        }));
        this.refs.closemodalMiembro.click();
    }

    handlerAddSecretario = () => {
        let errorsModalSecretarios = validForm.resetObject(constErrorsModalSecretarios);
        let secretario = this.state.buscadorPersona.selected;
        let fechas = this.state.fechasSecretario;
        let errors = 0;
        if (secretario.id === 0 || (secretario.id === null || secretario.id === undefined)) {
            errorsModalSecretarios.errorSecretario = "Seleccione una persona";
            errors++;
        }
        let repetidos = this.state.fields.secretarios.filter(x => x.persona_id === secretario.id && x.activo === 1);
        if (repetidos.length > 0) {
            errorsModalSecretarios.errorSecretario = "El secretario ya se encuentra en la lista";
            errors++;
        }
        if (fechas.fecha_fin <= fechas.fecha_inicio) {
            errorsModalSecretarios.errorFechaFin = "La fecha final no puede ser menor o igual a la fecha de inicio.";
            errors++;
        }
        if (errors > 0) {
            this.setState({ errorsModalSecretarios: errorsModalSecretarios, loading: false });
            return false;
        }

        let persona_id = secretario.id;
        let secretarioFind = this.state.buscadorPersona.data.find(x => x.id === secretario.id);
        let nombre_secretario = '';
        if (secretarioFind !== null)
            nombre_secretario = secretarioFind.nombres + ' ' + secretarioFind.apellidos;
        let path = this.renderImagenSecretarios(persona_id) != null
            ? auth.pathApi() +
            this.renderImagenSecretarios(
                persona_id
            ) ||
            ""
            : Constantes.NoImagen
        let item = {
            id: 0,
            comision_id: this.state.fields.id,
            persona_id: persona_id,
            nombre: nombre_secretario,
            fecha_inicio: FechaMysql.DateFormatMySql(this.state.fechasSecretario.fecha_inicio),
            fecha_final: FechaMysql.DateFormatMySql(this.state.fechasSecretario.fecha_fin),
            path: path,
            activo: 1,
        };
        let itemError = {
            id: "",
            comision_id: "",
            persona_id: "",
            fecha_inicio: "",
            fecha_final: "",
            activo: "",
        };
        this.setState((prevState) => ({
            ...prevState,
            fields: {
                ...prevState.fields,
                secretarios: [...prevState.fields.secretarios, item],
            },
            errors: {
                ...prevState.errors,
                secretarios: [
                    ...prevState.errors.secretarios,
                    itemError,
                ],
            },
        }));
    }

    handlerRemoveMiembro = (itemToRemove) => {
        let miembros = this.state.fields.miembros;
        let errorsMiembros = this.state.errors.miembros;

        miembros[itemToRemove]["activo"] = 0;

        this.setState((prevState) => ({
            ...prevState,
            fields: {
                ...prevState.fields,
                miembros: miembros,
            },
        }));
    }

    handlerRemoveSecretario = (itemToRemove) => {
        let secretarios = this.state.fields.secretarios;
        let errorsSecretarios = this.state.errors.secretarios;

        secretarios[itemToRemove]["activo"] = 0;

        this.setState((prevState) => ({
            ...prevState,
            fields: {
                ...prevState.fields,
                secretarios: secretarios,
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

    renderImagenMiembro = (idMiembro) => {
        let miembro = this.state.buscadorPersona.selected;
        console.log(this.state.buscadorPersona);
        // let elemento = miembro.data.find((x) => x.id == idMiembro);
        if (miembro != undefined || miembro != null) {
            let itemImagen = miembro.imagenes[2];
            if (itemImagen != undefined) {
                return itemImagen.imagen;
            }
        }
    };

    renderImagenSecretarios = (idSecretario) => {
        let secretarios = this.state.secretariosDetalle;
        let elemento = secretarios.find((x) => x.id == idSecretario);
        if (elemento != undefined) {
            let itemImagen = elemento.imagenes[2];
            if (itemImagen != undefined) {
                return itemImagen.imagen;
            }
        }
    };
    // Métodos asíncronos

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
        data.descripcion = this.state.txtDescripcion;
        data.fechaDeCreacion = FechaMysql.DateFormatMySql(data.dpfechaCreacion);
        data.imagen = this.state.imagesResized;
        // data.tipo_comision_id = this.state.selectTipoComision.value;
        // data.corporacion_id = this.state.selectCorporacion.value;
        data.user = auth.username();
        let responseData;
        console.log(data);
        if (data.id === 0) {
            await ComisionDataService.create(data)
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
            await ComisionDataService.update(data.id, data)
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
                pathname: "/comisiones",
            });
        }
    };

    resetFields() {
        let fields = validForm.resetObject(constFileds);
        let errors = validForm.resetObject(constErrors);
        this.setState({ fields: fields, errors: constErrors });
    }

    handlerOpenModal() {
        let errorsModal = validForm.resetObject(constErrorsModal);
        let fechasMiembro = this.state.fechasMiembro;
        fechasMiembro.fecha_inicio = new Date();
        fechasMiembro.fecha_fin = new Date();
        let personas = this.state.buscadorPersona;
        personas.selected = { id: 0 };
        this.setState({ errorsModal, selectCargo: SelectCargo, selectCongresista: SelectCongresistas, selectTipoCongresista: SelectTipoCongresista, fechasMiembro: fechasMiembro, buscadorPersona: personas })
    }

    handlerOpenModalSecretario() {
        let errorsModal = validForm.resetObject(constErrorsModalSecretarios);
        let fechasSecretario = this.state.fechasSecretario;
        fechasSecretario.fecha_inicio = new Date();
        fechasSecretario.fecha_fin = new Date();
        this.setState({ errorsModalSecretarios: errorsModal, selectSecretario: SelectSecretario, fechasSecretario: fechasSecretario });
    }

    render() {
        return (
            <>
                <Spinner show={this.state.loading} />
                <ul className="breadcrumb">
                    <li>Editar comisión</li>
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
                                                comisión
                                            </strong>
                                        </h3>
                                    </div>
                                    <div className="panel-body">
                                        <div className="row">
                                            <h3>Información de la comsión</h3>
                                            <div className="col-md-9">
                                                <div className="form-group">
                                                    <label className="col-md-3 control-label">
                                                        Nombre de la comision
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
                                                        Descripción
                                                    </label>
                                                    <div className="col-md-9">
                                                        <SunEditor
                                                            setContents={this.state.txtDescripcion || ""}
                                                            onChange={(e) => {
                                                                let fields = this.state;
                                                                let errors = this.state.errors;
                                                                fields = validForm.handleChangeFieldJodiEditor("txtDescripcion", fields, e);
                                                                errors = validForm.handleChangeErrors("descripcion", errors, e);
                                                                this.setState({ state: fields, errors: errors, });
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
                                                        Imagen actual
                                                    </label>
                                                    <div className="col-md-9">
                                                        <ImageForMultipleResolution
                                                            key={1}
                                                            preview={true}
                                                            previewData={
                                                                this.state.fields
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
                                                            handlerOnLoad={
                                                                this
                                                                    .handlerOnLoadForImage
                                                            }
                                                            resolutions={
                                                                Constantes.comisionsResolutions
                                                            }
                                                            handlerOnReset={
                                                                this
                                                                    .handlerOnResetForImage
                                                            }
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
                                        <div className="row">
                                            <h3>Diputados que la conforman</h3>
                                            <div className="col-md-12">
                                                <button
                                                    type="button"
                                                    onClick={() => { this.handlerOpenModal() }}
                                                    data-toggle="modal"
                                                    data-target="#modal-add-miembro"
                                                    className="pull-right btn btn-primary"><i className="fa fa-plus"></i> Añadir miembros</button>
                                                <div className="agregados">
                                                    <div className="panel-body list-group list-group-contacts list-group-contacts-two-columns">
                                                        {
                                                            this.state.fields.miembros.map((item, i) => {
                                                                if (item.activo) {
                                                                    return (
                                                                        <>
                                                                            <div key={i} className="list-group-item">
                                                                                {/* <div className="origin">{item.nombreCargo}</div> */}
                                                                                <div className="list-group-status status-online"></div>
                                                                                <img src={item.path} className="pull-left" alt={item.nombre} />
                                                                                <span className="contacts-title">{item.nombre}</span>
                                                                                {/* <span className="contacts-title">{item.nombreCuatrienio}</span> */}
                                                                                <button onClick={() => { this.handlerRemoveMiembro(i) }} className="btn btn-danger pull-right" type="button"><i className="fa fa-trash-alt"></i></button>
                                                                            </div>
                                                                           
                                                                        </>
                                                                    )
                                                                }
                                                            })
                                                        }
                                                    </div>
                                                    {/* <p><i className="fa fa-info-circle"></i> Para añadir miembros antes debe seleccionarse corporacion y cuatrienio.</p> */}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="panel-body">
                                        <div className="panel-footer">
                                            <ValidarPermiso
                                                IdModuloPermisoValidar={ModuloPermiso.Comision.Modificar}
                                                DefaultTemplate={
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            this.saveSubmit();
                                                        }}
                                                        className="btn btn-success pull-right">
                                                        <i className="fa fa-check"></i>{" "} Guardar</button>
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
                                    <h4 className="modal-title" id="largeModalHead"><i className="fa fa-list"></i>{` Añadiendo miembros para la comisión: ${this.state.fields["nombre"]}`}</h4>
                                </div>
                                <div className="modal-body">
                                    <form className="form-horizontal">
                                        <div className="row">
                                            
                                            
                                            <div className="col-md-6">
                                                <div className="form-group">
                                                    <div className="input-group">
                                                        <label htmlFor="">Fecha inicio</label>
                                                        <DatePicker
                                                            id="date"
                                                            showInputTime={false}
                                                            divClass="input-group"
                                                            dateSelected={this.state.fechasMiembro["fecha_inicio"] || ''}
                                                            onChangeDate={e => {
                                                                let fechasMiembro = this.state.fechasMiembro;
                                                                fechasMiembro = validForm.handleChangeDateField("fecha_inicio", fechasMiembro, e);
                                                                this.setState({ fechasMiembro: fechasMiembro });
                                                            }}
                                                            spanClass=""
                                                            spanError=""
                                                            divClassSpanType={1}
                                                            divClassSpan="input-group-addon"
                                                            divClassSpanI="fa fa-calendar" />
                                                    </div>
                                                </div>
                                                <span className={`error`}>{this.state.errorsModal.errorFechaInicio || ''}</span>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group">
                                                    <div className="input-group">
                                                        <label htmlFor="">Fecha fin</label>
                                                        <DatePicker
                                                            id="date"
                                                            showInputTime={false}
                                                            divClass="input-group"
                                                            dateSelected={this.state.fechasMiembro["fecha_fin"] || ''}
                                                            onChangeDate={e => {
                                                                let fechasMiembro = this.state.fechasMiembro;
                                                                fechasMiembro = validForm.handleChangeDateField("fecha_fin", fechasMiembro, e);
                                                                this.setState({ fechasMiembro: fechasMiembro });
                                                            }}
                                                            spanClass=""
                                                            spanError=""
                                                            divClassSpanType={1}
                                                            divClassSpan="input-group-addon"
                                                            divClassSpanI="fa fa-calendar" />
                                                    </div>
                                                </div>
                                                <span className={`error`}>{this.state.errorsModal.errorFechaFin || ''}</span>
                                            </div>
                                        </div>
                                        <hr />
                                        <div className="row">
                                            <div className="col-md-12">
                                                <div className="form-group">
                                                    <div className="col-md-12">
                                                        <label >Congresista</label>
                                                        <BuscadorPersona
                                                            handler={this.tableHandler}
                                                            handlerChangeSearch={this.handlerChangeSearchForPersona}
                                                            handlerSelectPersona={this.handlerSelectPersona}
                                                            data={this.state.buscadorPersona.data}
                                                            imgDefault={Constantes.NoImagen}
                                                            imgOrigin={this.state.buscadorPersona.imgOrigin}
                                                            pageExtends={this.state.buscadorPersona.page}
                                                            pageSize={this.state.buscadorPersona.rows}
                                                            totalRows={this.state.buscadorPersona.totalRows}
                                                            search={this.state.buscadorPersona.search}
                                                            selected={this.state.buscadorPersona.selected}
                                                        />
                                                    </div>
                                                </div>
                                                <span className={`error`}>{this.state.errorsModal.errorMiembro || ''}</span>
                                            </div>

                                        </div>

                                        <p><i className="fa fa-info-circle"></i> Los legisladores agregados en esta etapa aún no se registran en la base de datos. Debe guardar completamente el formulario.</p>
                                        <div className="panel-footer">
                                            <button type="button" className="btn btn-default" data-dismiss="modal" ref="closemodalMiembro">Cerrar</button>
                                            <button type="button" className="btn btn-primary pull-right" onClick={this.handlerAddMiembro} >Aceptar</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="modal" id="modal-add-secretario" tabIndex="-1" role="dialog" aria-labelledby="largeModalHead" aria-hidden="true">
                        <div className="modal-dialog modal-lg">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <button
                                        type="button"
                                        className="close"
                                        data-dismiss="modal">
                                        <span aria-hidden="true">&times;</span><span className="sr-only">Cerrar</span></button>
                                    <h4 className="modal-title" id="largeModalHead"><i className="fa fa-list"></i> {` Añadiendo secretarios para la comisión: ${this.state.fields["nombre"]}`}</h4>
                                </div>
                                <div className="modal-body">
                                    <form className="form-horizontal">
                                        <div className="row">
                                            <div className="col-md-12">
                                                <div className="form-group">
                                                    <div className="col-md-12">
                                                        <label htmlFor="">Fecha inicio</label>
                                                        <DatePicker
                                                            id="date"
                                                            showInputTime={false}
                                                            divClass="input-group"
                                                            dateSelected={this.state.fechasSecretario["fecha_inicio"] || ''}
                                                            onChangeDate={e => {
                                                                let fechasSecretario = this.state.fechasSecretario;
                                                                fechasSecretario = validForm.handleChangeDateField("fecha_inicio", fechasSecretario, e);
                                                                this.setState({ fechasSecretario: fechasSecretario });
                                                            }}
                                                            spanClass=""
                                                            spanError=""
                                                            divClassSpanType={1}
                                                            divClassSpan="input-group-addon"
                                                            divClassSpanI="fa fa-calendar" />
                                                    </div>
                                                </div>
                                                <span className={`error`}>{this.state.errorsModalSecretarios.errorFechaInicio || ''}</span>
                                            </div>
                                            <div className="col-md-12">
                                                <div className="form-group">
                                                    <div className="col-md-12">
                                                        <label htmlFor="">Fecha fin</label>
                                                        <DatePicker
                                                            id="date"
                                                            showInputTime={false}
                                                            divClass="input-group"
                                                            dateSelected={this.state.fechasSecretario["fecha_fin"] || ''}
                                                            onChangeDate={e => {
                                                                let fechasSecretario = this.state.fechasSecretario;
                                                                fechasSecretario = validForm.handleChangeDateField("fecha_fin", fechasSecretario, e);
                                                                this.setState({ fechasSecretario: fechasSecretario });
                                                            }}
                                                            spanClass=""
                                                            spanError=""
                                                            divClassSpanType={1}
                                                            divClassSpan="input-group-addon"
                                                            divClassSpanI="fa fa-calendar" />
                                                    </div>
                                                </div>
                                                <span className={`error`}>{this.state.errorsModalSecretarios.errorFechaFin || ''}</span>
                                            </div>
                                            <div className="col-md-12">
                                                <div className="form-group">
                                                    <div className="col-md-12">
                                                        <label >Persona</label>
                                                        <BuscadorPersona handler={this.tableHandler} handlerChangeSearch={this.handlerChangeSearchForPersona} handlerSelectPersona={this.handlerSelectPersona} data={this.state.buscadorPersona.data} imgDefault={Constantes.NoImagen} imgOrigin={this.state.buscadorPersona.imgOrigin} pageExtends={this.state.buscadorPersona.page} pageSize={this.state.buscadorPersona.rows} totalRows={this.state.buscadorPersona.totalRows} search={this.state.buscadorPersona.search} selected={this.state.buscadorPersona.selected} />
                                                        {/* <span className="input-group-addon wbtn"><button onClick={this.handlerAddSecretario} type="button" className="btn btn-primary"><i className="fa fa-plus"></i></button></span> */}
                                                    </div>
                                                </div>
                                                <span className={`error`}>{this.state.errorsModalSecretarios.errorSecretario || ''}</span>
                                            </div>

                                            <div className="agregados">
                                                <hr />
                                                <div className="panel-body list-group list-group-contacts list-group-contacts-two-columns">
                                                    {this.state.fields.secretarios.map((y, j) => {
                                                        if (y.activo) {
                                                            return (
                                                                <div key={j} className="list-group-item">
                                                                    <div className="origin">Secretario</div>
                                                                    <div className="list-group-status status-online"></div>
                                                                    <img src={y.path} className="pull-left" alt={y.nombre} />
                                                                    <span className="contacts-title">{y.nombre}</span>
                                                                    <button type="button" onClick={() => { this.handlerRemoveSecretario(j) }} className="btn btn-danger pull-right" ><i className="fa fa-trash-alt"></i></button>
                                                                </div>
                                                            )
                                                        }
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                        <hr />
                                        <p><i className="fa fa-info-circle"></i> Los secretarios agregados en esta etapa aún no se registran en la base de datos. Debe guardar completamente el formulario.</p>
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

export default EditarComision;
