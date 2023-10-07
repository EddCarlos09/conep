import React, { Component } from "react";
import PaseListasDataService from "../../../Services/Catalogo/PaseLista.Service";
import ComisionDataService from "../../../Services/Catalogo/Comision.Service";
import CongresistaDataService from "../../../Services/Catalogo/Congresistas.Service";
import DatePicker from "../../../Components/DatePicker";
import Spinner from "../../../Components/Spinner";
import Select from "../../../Components/Select";
import AccordionCheckbox from "../../../Components/AccordionCheckbox";
import ValidForm from "../../../Utils/ValidForm";
import * as FechaMysql from "../../../Utils/FormatDate";
import AuthLogin from "../../../Utils/AuthLogin";
import UtilsService from "../../../Services/General/Utils.Service";

const auth = new AuthLogin();
let validForm = new ValidForm();
const fieldsConst = {
    id: 0,
    fecha: new Date(),
    legislatura_id: "",
    cuatrienio_id: "",
    tipo_pase_lista_id: "",
    corporacion_id: "",
    tipo_comision_id: "",
    comision_id: "",
    user: auth.username(),
    pase_lista_congresista: [],
};
const errorsConst = {
    fecha: "",
    legislatura_id: "",
    cuatrienio_id: "",
    tipo_pase_lista_id: "",
    corporacion_id: "",
    tipo_comision_id: "",
    comision_id: "",
    user: "",
    pase_lista_congresista: "",
};

const defaultLegislatura = { value: "", label: "Seleccione legislatura" };
const defaultCuatrienio = { value: "", label: "Seleccione quinquenio" };
const defaultCorporacion = {
    value: "",
    label: "Seleccione tipo de corporación",
};
const defaultTipoComision = { value: "", label: "Seleccione tipo de comisión" };
const defaultComision = { value: "", label: "Seleccione comisión" };

class CrearPaseLista extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            fields: Object.assign({}, fieldsConst),
            errors: Object.assign({}, errorsConst),
            filterLegislatura: defaultLegislatura,
            filterCuatrienio: defaultCuatrienio,
            filterCorporacion: defaultCorporacion,
            filterTipoComision: defaultTipoComision,
            filterComision: defaultComision,
            dataSelectLegislatura: [],
            dataSelectCuatrienio: [],
            dataSelectCorporacion: [],
            dataSelectTipoComisiones: [],
            dataSelectComisiones: [],
        };
    }

    // Handlers
    handlerFilterLegislatura = (legislaturaSelected) => {
        let fields = this.state.fields;
        fields.legislatura_id = legislaturaSelected.value;
        this.setState({
            fields: fields,
            filterLegislatura: legislaturaSelected,
        });
    };

    handlerFilterCuatrienio = (cuatrienioSelected) => {
        let fields = this.state.fields;
        fields.cuatrienio_id = cuatrienioSelected.value;
        this.setState(
            { fields: fields, filterCuatrienio: cuatrienioSelected },
            async () => {
                await this.getCongresistas(
                    this.state.fields.corporacion_id,
                    this.state.fields.cuatrienio_id,
                    0
                );
            }
        );
    };

    handlerFilterCorporacion = async (corporacionSelected) => {
        let state = this.state;
        state.fields.corporacion_id = corporacionSelected.value;
        state.filterCorporacion = corporacionSelected;
        state.filterTipoComision = defaultTipoComision;
        state.filterComision = defaultComision;
        state.dataSelectComisiones = [];
        state.dataSelectTipoComisiones = [];

        this.getComboTipoComision(corporacionSelected.value);
        this.setState({ state }, async () => {
            if (this.state.fields.tipo_pase_lista_id === 1) {
                await this.getCongresistas(
                    this.state.fields.corporacion_id,
                    this.state.fields.cuatrienio_id,
                    0
                );
            }
        });
    };

    handlerFilterTipoComision = (tipoComisionSelected) => {
        let state = this.state;
        state.fields.tipo_comision_id = tipoComisionSelected.value;
        state.fields.comision_id = 0;
        state.filterTipoComision = tipoComisionSelected;
        state.filterComision = defaultComision;
        state.dataSelectComisiones = [];
        this.getComboComisiones(tipoComisionSelected.value);
        this.setState({ state });
    };

    handlerFilterComision = (comisionSelected) => {
        let fields = this.state.fields;
        fields.comision_id = comisionSelected.value;
        this.setState(
            { fields: fields, filterComision: comisionSelected },
            async () => {
                if (this.state.fields.tipo_pase_lista_id === 2) {
                    await this.getCongresistas(
                        0,
                        0,
                        this.state.fields.comision_id
                    );
                }
            }
        );
    };

    handlerCheckboxPlenaria = (value) => {
        this.setState((prevState) => ({
            ...prevState,
            fields: {
                ...prevState.fields,
                tipo_pase_lista_id: 1,
                pase_lista_congresista: [],
            },
        }));
    };

    handlerCheckboxComision = (value) => {
        this.setState(
            (prevState) => ({
                ...prevState,
                fields: {
                    ...prevState.fields,
                    tipo_pase_lista_id: 2,
                    pase_lista_congresista: [],
                },
            }),
            () => {
                this.getComboTipoComision(this.state.fields.corporacion_id);
            }
        );
    };

    componentDidMount = async () => {
        await this.getComboCorporacion();
        await this.getComboCuatrienio();
        await this.getComboLegislatura();
        let id = this.obtenerId();
        if (id !== 0) {
            await this.getByID(id);
        } else {
            this.resetFields();
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

    getByID = async (id) => {
        this.setState({ loading: true });
        await PaseListasDataService.get(id)
            .then(async (response) => {
                let data = response.data;
                let fields = this.state.fields;
                fields.id = data.id;
                fields.fecha = data.fecha;
                fields.legislatura_id = data.legislatura.id;
                fields.cuatrienio_id = data.cuatrienio.id;
                fields.tipo_pase_lista_id = data.tipo_pase_lista.id;
                fields.corporacion_id = data.corporacion.id;
                fields.pase_lista_congresista = data.pase_lista_congresista;

                if (
                    data.tipo_comision_id !== null &&
                    !isNaN(data.tipo_comision.id)
                ) {
                    fields.tipo_comision_id = data.tipo_comision.id;
                    await this.getComboTipoComision(fields.corporacion_id);
                }

                if (data.comision !== null && !isNaN(data.comision.id)) {
                    fields.comision_id = data.comision.id;
                    await this.getComboComisiones(fields.tipo_comision_id);
                }

                Object.assign(fields, { user: auth.username() });
                this.setState(
                    {
                        fields: fields,
                        loading: false,
                    },
                    () => {
                        this.setSelectValue(
                            this.state.fields.legislatura_id,
                            "dataSelectLegislatura",
                            "filterLegislatura"
                        );
                        this.setSelectValue(
                            this.state.fields.cuatrienio_id,
                            "dataSelectCuatrienio",
                            "filterCuatrienio"
                        );
                        this.setSelectValue(
                            this.state.fields.corporacion_id,
                            "dataSelectCorporacion",
                            "filterCorporacion"
                        );
                        this.setSelectValue(
                            this.state.fields.tipo_comision_id,
                            "dataSelectTipoComisiones",
                            "filterTipoComision"
                        );
                        this.setSelectValue(
                            this.state.fields.comision_id,
                            "dataSelectComisiones",
                            "filterComision"
                        );
                    }
                );
            })
            .catch((e) => {
                this.setState({
                    loading: false,
                });
                console.log(e);
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

    getComboCorporacion = async () => {
        this.setState({ loading: true });
        await PaseListasDataService.getComboCorporacion().then((response) => {
            let combo = [];
            let selected = defaultCorporacion;
            response.data.forEach((i) => {
                combo.push({ value: i.id, label: i.nombre });
                if (this.state.id !== 0) {
                    let idd = this.state.fields.corporacion_id;
                    if (idd === i.id)
                        selected = { value: i.id, label: i.nombre };
                }
            });
            combo.unshift(defaultCorporacion);
            this.setState({
                dataSelectCorporacion: combo,
                filterCorporacion: selected,
            });
        });
    };

    getComboCuatrienio = async () => {
        await PaseListasDataService.getComboCuatrienio().then((response) => {
            let combo = [];
            let selected = defaultCuatrienio;
            response.data.forEach((i) => {
                combo.push({ value: i.id, label: i.nombre });
                if (this.state.id !== 0) {
                    let idd = this.state.fields.cuatrienio_id;
                    if (idd === i.id)
                        selected = { value: i.id, label: i.nombre };
                }
            });
            combo.unshift(defaultCuatrienio);
            this.setState({
                dataSelectCuatrienio: combo,
                filterCuatrienio: selected,
            });
        });
    };

    getComboLegislatura = async () => {
        await UtilsService.getComboLegislatura().then((response) => {
            let combo = [];
            let selected = defaultLegislatura;
            response.data.forEach((i) => {
                combo.push({ value: i.id, label: i.nombre });
                if (this.state.id !== 0) {
                    let idd = this.state.fields.cuatrienio_id;
                    if (idd === i.id)
                        selected = { value: i.id, label: i.nombre };
                }
            });
            combo.unshift(defaultLegislatura);
            this.setState({
                dataSelectLegislatura: combo,
                filterLegislatura: selected,
                loading: false,
            });
        });
    };

    getComboTipoComision = async (idCorporacion) => {
        this.setState({ loading: true });
        await PaseListasDataService.getComboTipoComision(idCorporacion).then(
            (response) => {
                let combo = [];
                let selected = defaultTipoComision;
                response.data.forEach((i) => {
                    combo.push({ value: i.id, label: i.nombre });
                    if (this.state.id !== 0) {
                        let idd = this.state.fields.tipo_comision_id;
                        if (idd === i.id)
                            selected = { value: i.id, label: i.nombre };
                    }
                });
                combo.unshift(defaultTipoComision);
                this.setState({
                    dataSelectTipoComisiones: combo,
                    filterTipoComision: selected,
                    loading: false,
                });
            }
        );
    };

    getComboComisiones = async (idTipoComision) => {
        this.setState({ loading: true });
        await PaseListasDataService.getComboComisiones(idTipoComision).then(
            (response) => {
                let combo = [];
                let selected = defaultComision;
                response.data.forEach((i) => {
                    combo.push({ value: i.id, label: i.nombre });
                    if (this.state.id !== 0) {
                        let idd = this.state.fields.cuatrienio_id;
                        if (idd === i.id)
                            selected = { value: i.id, label: i.nombre };
                    }
                });
                combo.unshift(defaultComision);
                this.setState({
                    dataSelectComisiones: combo,
                    filterComision: selected,
                    loading: false,
                });
            }
        );
    };

    getCongresistas = async (corporacion_id, cuatrienio_id, comision_id) => {
        if (
            corporacion_id > 0 &&
            cuatrienio_id > 0 &&
            this.state.fields.tipo_pase_lista_id === 1
        ) {
            this.setState((prevState) => ({
                ...prevState,
                loading: true,
                fields: {
                    ...prevState.fields,
                    pase_lista_congresista: [],
                },
            }));
            await CongresistaDataService.getCongresistas({
                corporacion_id: corporacion_id,
                cuatrienio_id: cuatrienio_id,
                activo: 1,
            }).then((response) => {
                let congresistas = response.data;
                let pase_lista_congresista = [];
                for (let i = 0; i < congresistas.length; i++) {
                    let item_pase_lista_congresista = {
                        pase_lista_id: this.state.fields.id,
                        congresista_id: congresistas[i].id,
                        tipo_respuesta_pase_lista_id: 1,
                        congresista: congresistas[i],
                    };
                    pase_lista_congresista.push(item_pase_lista_congresista);
                }

                this.setState((prevState) => ({
                    ...prevState,
                    loading: false,
                    fields: {
                        ...prevState.fields,
                        pase_lista_congresista: pase_lista_congresista,
                    },
                }));
            });
        } else if (
            comision_id > 0 &&
            this.state.fields.tipo_pase_lista_id === 2
        ) {
            this.setState((prevState) => ({
                ...prevState,
                loading: true,
                fields: {
                    ...prevState.fields,
                    pase_lista_congresista: [],
                },
            }));
            await ComisionDataService.getCongresistas({
                comision_id: comision_id,
                activo: 1,
            }).then((response) => {
                let congresistas = response.data;
                let pase_lista_congresista = [];
                for (let i = 0; i < congresistas.length; i++) {
                    let item_pase_lista_congresista = {
                        pase_lista_id: this.state.fields.id,
                        congresista_id: congresistas[i].congresista.id,
                        tipo_respuesta_pase_lista_id: 1,
                        congresista: congresistas[i].congresista,
                    };
                    pase_lista_congresista.push(item_pase_lista_congresista);
                }

                this.setState((prevState) => ({
                    ...prevState,
                    loading: false,
                    fields: {
                        ...prevState.fields,
                        pase_lista_congresista: pase_lista_congresista,
                    },
                }));
            });
        }
    };

    saveSubmit = async (e) => {
        e.preventDefault();
        let errors = this.state.errors;
        errors = validForm.cleanErrors(errors);
        this.setState({ errors: errors, loading: true });

        let responseData;
        let data = this.state.fields;
        data.fecha = FechaMysql.DateFormatMySql(data.fecha);
        if (this.state.fields["id"] === 0) {
            await PaseListasDataService.create(data)
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
            await PaseListasDataService.update(this.state.fields["id"], data)
                .then((response) => {
                    responseData = response.data;
                })
                .catch(function (error) {
                    errors = validForm.displayErrors(
                        error.response.data.errors,
                        errors
                    );
                });
        }
        this.setState({ errors: errors, loading: false });
        if (responseData != null) {
            this.resetFields();
            this.props.history.push({
                pathname: "/pase-lista",
            });
        }
    };

    resetFields() {
        let fields = Object.assign({}, fieldsConst);
        this.setState({
            fields: fields,
            errors: validForm.cleanErrors(this.state.errors),
        });
        this.resetSelectsModal();
    }

    resetSelectsModal = () => {
        this.setState({
            filterLegislatura: defaultLegislatura,
            filterCuatrienio: defaultCuatrienio,
            filterCorporacion: defaultCorporacion,
            filterTipoComision: defaultTipoComision,
            filterComision: defaultComision,
        });
    };

    handleInputChange = (event, index) => {
        let target = event.target;
        let value = target.type === "checkbox" ? target.checked : target.value;
        value = value ? 1 : 2;

        let pase_lista_congresista = [
            ...this.state.fields.pase_lista_congresista,
        ];
        pase_lista_congresista[index] = {
            ...pase_lista_congresista[index],
            tipo_respuesta_pase_lista_id: value,
        };

        this.setState((prevState) => ({
            ...prevState,
            fields: {
                ...prevState.fields,
                pase_lista_congresista: pase_lista_congresista,
            },
        }));
    };

    render() {
        return (
            <>
                <Spinner show={this.state.loading} />
                <ul className="breadcrumb">
                    <li>Congresista</li>
                    <li>Nuevo pase de lista</li>
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
                                                    ? "Nuevo"
                                                    : "Editar"}{" "}
                                                pase de lista
                                            </strong>
                                        </h3>
                                    </div>
                                    <div className="panel-body">
                                        <div className="row">
                                            <h3>Información general</h3>
                                            <div className="col-md-9">
                                                <div className="form-group">
                                                    <label className="col-md-3 control-label">
                                                        Fecha
                                                    </label>
                                                    <div className="col-md-9">
                                                        <div className="input-group">
                                                            <DatePicker
                                                                id="fecha"
                                                                showInputTime={
                                                                    false
                                                                }
                                                                divClass="input-group"
                                                                dateSelected={
                                                                    this.state
                                                                        .fields
                                                                        .fecha ||
                                                                    ""
                                                                }
                                                                onChangeDate={(
                                                                    e
                                                                ) => {
                                                                    let fields = this
                                                                        .state
                                                                        .fields;
                                                                    let errors = this
                                                                        .state
                                                                        .errors;
                                                                    fields = validForm.handleChangeDateField(
                                                                        "fecha",
                                                                        fields,
                                                                        e
                                                                    );
                                                                    errors = validForm.handleChangeErrors(
                                                                        "fecha",
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
                                                                        "fecha"
                                                                    ] || ""
                                                                }
                                                                divClassSpanType={
                                                                    1
                                                                }
                                                                divClassSpan="input-group-addon"
                                                                divClassSpanI="fa fa-calendar"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <label className="col-md-3 control-label">
                                                        Legislatura
                                                    </label>
                                                    <div className="col-md-9">
                                                        <div className="input-group">
                                                            <Select
                                                                divClass=""
                                                                selectplaceholder="Seleccione"
                                                                selectValue={
                                                                    this.state
                                                                        .filterLegislatura
                                                                }
                                                                selectIsSearchable={
                                                                    false
                                                                }
                                                                selectoptions={
                                                                    this.state
                                                                        .dataSelectLegislatura
                                                                }
                                                                selectOnchange={
                                                                    this
                                                                        .handlerFilterLegislatura
                                                                }
                                                                selectclassNamePrefix="selectReact__value-container"
                                                                spanClass="error"
                                                                spanError={
                                                                    this.state
                                                                        .errors[
                                                                        "legislatura_id"
                                                                    ] || ""
                                                                }
                                                            ></Select>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <label className="col-md-3 control-label">
                                                        Quinquenio
                                                    </label>
                                                    <div className="col-md-9">
                                                        <div className="input-group">
                                                            <Select
                                                                divClass=""
                                                                selectplaceholder="Seleccione"
                                                                selectValue={
                                                                    this.state
                                                                        .filterCuatrienio
                                                                }
                                                                selectIsSearchable={
                                                                    false
                                                                }
                                                                selectoptions={
                                                                    this.state
                                                                        .dataSelectCuatrienio
                                                                }
                                                                selectOnchange={
                                                                    this
                                                                        .handlerFilterCuatrienio
                                                                }
                                                                selectclassNamePrefix="selectReact__value-container"
                                                                spanClass="error"
                                                                spanError={
                                                                    this.state
                                                                        .errors[
                                                                        "cuatrienio_id"
                                                                    ] || ""
                                                                }
                                                            ></Select>
                                                        </div>
                                                    </div>
                                                </div>

                                                <AccordionCheckbox
                                                    handlerCheckboxSelected={
                                                        this
                                                            .handlerCheckboxPlenaria
                                                    }
                                                    label={"Plenaria"}
                                                    open={
                                                        this.state.fields
                                                            .tipo_pase_lista_id ===
                                                        1
                                                    }
                                                    children={
                                                        <>
                                                            <div className="form-group">
                                                                <label className="col-md-3 control-label">
                                                                    Tipo de
                                                                    corporación
                                                                </label>
                                                                <div className="col-md-9">
                                                                    <div className="input-group">
                                                                        <Select
                                                                            divClass=""
                                                                            selectplaceholder="Seleccione"
                                                                            selectValue={
                                                                                this
                                                                                    .state
                                                                                    .filterCorporacion
                                                                            }
                                                                            selectIsSearchable={
                                                                                false
                                                                            }
                                                                            selectoptions={
                                                                                this
                                                                                    .state
                                                                                    .dataSelectCorporacion
                                                                            }
                                                                            selectOnchange={
                                                                                this
                                                                                    .handlerFilterCorporacion
                                                                            }
                                                                            selectclassNamePrefix="selectReact__value-container"
                                                                            spanClass="error"
                                                                            spanError={
                                                                                this
                                                                                    .state
                                                                                    .errors[
                                                                                    "corporacion_id"
                                                                                ] ||
                                                                                ""
                                                                            }
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </>
                                                    }
                                                />

                                                <AccordionCheckbox
                                                    handlerCheckboxSelected={
                                                        this
                                                            .handlerCheckboxComision
                                                    }
                                                    label={"Comisión"}
                                                    open={
                                                        this.state.fields
                                                            .tipo_pase_lista_id ===
                                                        2
                                                    }
                                                    children={
                                                        <>
                                                            <div className="form-group">
                                                                <label className="col-md-3 control-label">
                                                                    Tipo de
                                                                    corporación
                                                                </label>
                                                                <div className="col-md-9">
                                                                    <div className="input-group">
                                                                        <Select
                                                                            divClass=""
                                                                            selectplaceholder="Seleccione"
                                                                            selectValue={
                                                                                this
                                                                                    .state
                                                                                    .filterCorporacion
                                                                            }
                                                                            selectIsSearchable={
                                                                                false
                                                                            }
                                                                            selectoptions={
                                                                                this
                                                                                    .state
                                                                                    .dataSelectCorporacion
                                                                            }
                                                                            selectOnchange={
                                                                                this
                                                                                    .handlerFilterCorporacion
                                                                            }
                                                                            selectclassNamePrefix="selectReact__value-container"
                                                                            spanClass="error"
                                                                            spanError={
                                                                                this
                                                                                    .state
                                                                                    .errors[
                                                                                    "corporacion_id"
                                                                                ] ||
                                                                                ""
                                                                            }
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="form-group">
                                                                <label className="col-md-3 control-label">
                                                                    Tipo de
                                                                    comisión
                                                                </label>
                                                                <div className="col-md-9">
                                                                    <div className="input-group">
                                                                        <Select
                                                                            divClass=""
                                                                            selectplaceholder="Seleccione"
                                                                            selectValue={
                                                                                this
                                                                                    .state
                                                                                    .filterTipoComision
                                                                            }
                                                                            selectIsSearchable={
                                                                                false
                                                                            }
                                                                            selectoptions={
                                                                                this
                                                                                    .state
                                                                                    .dataSelectTipoComisiones
                                                                            }
                                                                            selectOnchange={
                                                                                this
                                                                                    .handlerFilterTipoComision
                                                                            }
                                                                            selectclassNamePrefix="selectReact__value-container"
                                                                            spanClass="error"
                                                                            spanError={
                                                                                this
                                                                                    .state
                                                                                    .errors[
                                                                                    "tipo_comision_id"
                                                                                ] ||
                                                                                ""
                                                                            }
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="form-group">
                                                                <label className="col-md-3 control-label">
                                                                    Comisión
                                                                </label>
                                                                <div className="col-md-9">
                                                                    <div className="input-group">
                                                                        <Select
                                                                            divClass=""
                                                                            selectplaceholder="Seleccione"
                                                                            selectValue={
                                                                                this
                                                                                    .state
                                                                                    .filterComision
                                                                            }
                                                                            selectIsSearchable={
                                                                                false
                                                                            }
                                                                            selectoptions={
                                                                                this
                                                                                    .state
                                                                                    .dataSelectComisiones
                                                                            }
                                                                            selectOnchange={
                                                                                this
                                                                                    .handlerFilterComision
                                                                            }
                                                                            selectclassNamePrefix="selectReact__value-container"
                                                                            spanClass="error"
                                                                            spanError={
                                                                                this
                                                                                    .state
                                                                                    .errors[
                                                                                    "comision_id"
                                                                                ] ||
                                                                                ""
                                                                            }
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </>
                                                    }
                                                />
                                            </div>
                                            <hr />
                                        </div>
                                    </div>
                                    <div className="panel-body">
                                        <div className="row">
                                            <h3>Congresistas</h3>
                                            <div>
                                                <table>
                                                    <thead>
                                                        <tr>
                                                            <td>
                                                                Nombre del
                                                                congresista
                                                            </td>
                                                            <td>Asistencia</td>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {this.state.fields.pase_lista_congresista.map(
                                                            (
                                                                item,
                                                                index,
                                                                array
                                                            ) => {
                                                                return (
                                                                    <tr
                                                                        key={
                                                                            item
                                                                        }
                                                                    >
                                                                        <td>
                                                                            {
                                                                                item[
                                                                                    "congresista"
                                                                                ][
                                                                                    "nombre"
                                                                                ]
                                                                            }
                                                                        </td>
                                                                        <td>
                                                                            {
                                                                                <input
                                                                                    name="tipo_respuesta_pase_lista_id"
                                                                                    type="checkbox"
                                                                                    checked={
                                                                                        item[
                                                                                            "tipo_respuesta_pase_lista_id"
                                                                                        ] ===
                                                                                        1
                                                                                            ? true
                                                                                            : false
                                                                                    }
                                                                                    onChange={(
                                                                                        e
                                                                                    ) => {
                                                                                        this.handleInputChange(
                                                                                            e,
                                                                                            index
                                                                                        );
                                                                                    }}
                                                                                />
                                                                            }
                                                                        </td>
                                                                    </tr>
                                                                );
                                                            }
                                                        )}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="panel-body">
                                        <div className="row">
                                            <div className="panel-footer">
                                                <button
                                                    type="button"
                                                    onClick={async (e) => {
                                                        await this.saveSubmit(
                                                            e
                                                        );
                                                    }}
                                                    className="btn btn-success pull-right"
                                                >
                                                    <i className="fa fa-check"></i>{" "}
                                                    Guardar
                                                </button>
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

export default CrearPaseLista;
