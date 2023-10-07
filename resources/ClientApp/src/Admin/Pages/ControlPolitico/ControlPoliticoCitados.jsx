import React, { Component } from 'react';
import TableReact from "../../../Components/TableReact";
import ControlPoliticoDataService from "../../../Services/Congreso/ControlPolitico.Service";
import ImageForMultipleResolution from '../../../Components/ImageForMultipleResolution';
import UtilsDataService from "../../../Services/General/Utils.Service";
import Spinner from '../../../Components/Spinner';
import Select from '../../../Components/Select';
import ValidForm from "../../../Utils/ValidForm";
import Input from "../../../Components/Input";
import { ModuloPermiso } from "../../../Permisos/ModuloPermiso";
import ValidarPermiso from "../../../Permisos/ValidarPermiso";
import AuthLogin from "../../../Utils/AuthLogin";
import { Constantes } from "../../../Constants/Constantes.js"
import BuscadorPersona from '../../../Components/BuscadorPersona';

const auth = new AuthLogin();
const validForm = new ValidForm();
const fieldsConst = {
    id: 0,
    control_politico_id: 0,
    persona_id: 0,
    tipo_citacion: 0,
    asistencia: 0
};
const errorsConst = {
    id: '',
    control_politico_id: '',
    persona_id: '',
    tipo_citacion: '',
    asistencia: '',
    activo: '',
}

const SelectAsistencia = { value: 0, label: 'Seleccione asistencia' };
const SelectTipoCitacion = { value: 0, label: 'Seleccione tipo de citación' };
class ControlPoliticoCitados extends Component {
    constructor(props) {
        super(props);

        const id =
            this.props.match.params.id === undefined
                ? 0
                : this.props.match.params.id;
        this.tableHandler = this.tableHandler.bind(this);
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
            tableInfo: {
                columns: [
                    {
                        Header: "Citados",
                        columns: [
                            {
                                Header: "id",
                                accessor: "id"
                            },
                            {
                                Header: "Nombres",
                                accessor: "persona.nombres"
                            },
                            {
                                Header: "Apellidos",
                                accessor: "persona.apellidos"
                            },
                            {
                                Header: "Asistencia",
                                id: 'asistencia',
                                accessor: "asistencia",
                                Cell: (tableProps) => {
                                    switch (tableProps.row.values.asistencia) {
                                        case 1:
                                            return "Asiste";
                                            break;
                                        case 2:
                                            return "Delega asistencia";
                                            break;
                                        case 3:
                                            return "Se excusa";
                                            break;
                                        case 4:
                                            return "Se excusa y delega asistencia";
                                            break;
                                        case 5:
                                            return "No asistente, no delega asistencia ni se exusa";
                                            break;
                                        default:
                                            break;
                                    }
                                }
                            },
                            {
                                Header: "Tipo citación",
                                id: "tipo",
                                accessor: "tipo",
                                Cell: (tableProps) => {
                                    switch (tableProps.row.values.tipo_citacion) {
                                        case 1:
                                            return "Control politico";
                                            break;
                                        case 2:
                                            return "Audiencia pública";
                                            break;
                                        case 3:
                                            return "Invitación";
                                            break;
                                        default:
                                            break;
                                    }
                                }
                            },
                            {
                                Header: 'Activo',
                                id: 'activo',
                                accessor: "activo",
                                Cell: (tableProps) => {
                                    return (
                                        <input
                                            type="checkbox"
                                            className="icheckbox"
                                            checked={tableProps.row.values.activo}
                                            readOnly
                                        />
                                    );
                                },
                            }
                        ]
                    },
                    {
                        Header: "Acciones",
                        columns: [
                            // auth.tieneModuloPermiso(ModuloPermiso.ControlPolitico.ObtenerCitados) ?
                            //     {
                            //         Header: 'Editar',
                            //         id: 'editar',
                            //         accessor: (str) => 'editar',
                            //         Cell: (tableProps) => (
                            //             <ValidarPermiso
                            //                 IdModuloPermisoValidar={ModuloPermiso.ControlPolitico.ObtenerCitados}
                            //                 DefaultTemplate={
                            //                     <button
                            //                         data-toggle="modal"
                            //                         data-target="#add-citado"
                            //                         className="btn btn-info editar"
                            //                         style={{ width: '100%' }}
                            //                         onClick={async () => {
                            //                             this.resetFiels();
                            //                             await this.getByID(
                            //                                 tableProps.row.values.id
                            //                             );
                            //                         }}
                            //                     >
                            //                         <i className="fa fa-edit"></i> Editar
                            //                         </button>
                            //                 }
                            //             />
                            //         )
                            //     } :
                            //     {
                            //         Header: 'Editar',
                            //         id: 'editar',
                            //         accessor: (str) => '-'
                            //     },
                            auth.tieneModuloPermiso(ModuloPermiso.ControlPolitico.EliminarCitados) ?
                                {
                                    Header: "Activar/Desactivar",
                                    id: "actdesc",
                                    accessor: (str) => "actdesc",
                                    Cell: (tableProps) => (
                                        <ValidarPermiso
                                            IdModuloPermisoValidar={ModuloPermiso.ControlPolitico.EliminarCitados}
                                            DefaultTemplate={
                                                <button
                                                    data-toggle="modal"
                                                    data-target="#message-box-danger"
                                                    className={`btn ${tableProps.row.values.activo === 1
                                                        ? "btn-danger"
                                                        : "btn-warning"} eliminar`}
                                                    style={{ width: "100%" }}
                                                    data-id={tableProps.row.values.id}
                                                    onClick={() => {
                                                        this.handlerDesactivar(
                                                            tableProps.row.values
                                                        );
                                                    }}
                                                >
                                                    <i className="fa fa-eraser"></i>{" "}
                                                    {tableProps.row.values.activo === 1
                                                        ? "Desactivar"
                                                        : "Activar"}
                                                </button>
                                            }
                                        />
                                    )
                                } :
                                {
                                    Header: "Activar/Desactivar",
                                    id: "actdesc",
                                    accessor: (str) => "-",
                                }
                        ]
                    }
                ],
                hiddenColumns: ["id", "activo"],
                data: [],
                dataTipoCitacion: []
            },
            fields: fieldsConst,
            fieldsDelete: {},
            errors: errorsConst,
            loading: true,
            filterActive: { value: 1, label: "Activo" },
            dataSelectActive: [{ value: -1, label: "Filtrar por activo" }, { value: 1, label: "Activo" }, { value: 0, label: "Inactivo" }],
            selectAsistencia: SelectAsistencia,
            filterAsistecia: SelectAsistencia,
            dataSelectAsistencia: [
                SelectAsistencia,
                { value: 1, label: "Asiste" },
                { value: 2, label: "Delega asistencia" },
                { value: 3, label: "Se excusa" },
                { value: 4, label: "Se excusa y delega asistencia" },
                { value: 5, label: "No asistente, no delega asistencia ni se exusa" }
            ],
            selectTipoCitacion: SelectTipoCitacion,
            filterTipoCitacion: SelectTipoCitacion,
            dataSelectTipoCitacion: [
                SelectTipoCitacion,
                { value: 1, label: "Control politico" },
                { value: 2, label: "Audiencia pública" },
                { value: 3, label: "Invitación" }
            ],
            imagesResized: []

        }
    }
    componentDidMount = async () => {
        // await this.getComboCargoCongresista();

        // await this.getComboTipoCitacion();
        await this.getAllPersonas(1, this.state.buscadorPersona.page, this.state.buscadorPersona.rows, this.state.buscadorPersona.search);
        await this.getAll(this.state.filterActive.value, this.state.filterAsistecia.value, this.state.filterTipoCitacion.value);

    }

    // Todo personas
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
    }

    getAllPersonas = async (idFilterActive, page, rows, search) => {
        this.setState({ loading: true });
        let tableInfo = this.state.buscadorPersona;
        let secretariosDetalle = this.state.secretariosDetalle;
        await ControlPoliticoDataService.getAllPersonas(
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

        await ControlPoliticoDataService.totalrecordsPersonas(idFilterActive, search)
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
    //End todo personas

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

    handlerOnLoadForImage = async (blob) => {
        let state = this.state;
        state.imagesResized = blob;
        this.setState({
            state
        })
    }

    handlerDesactivar = (controlPolitico) => {
        let desActObj = { id: controlPolitico.id, nombre: controlPolitico.nombre, activo: controlPolitico.activo }
        this.setState({
            fieldsDelete: desActObj
        })
    }

    handlerOnLoadForImage = async (blob) => {
        let state = this.state;
        state.imagesResized = blob;
        this.setState({
            state
        })
    }

    // getComboCargoCongresista = async () => {
    //     this.setState({ loading: true });
    //     await UtilsDataService.getComboCargoCongresista().then(response => {
    //         let combo = [];
    //         response.data.forEach(i => {
    //             combo.push({ value: i.id, label: i.nombre })
    //         })
    //         combo.unshift(SelectAsistencia)
    //         this.setState({
    //             dataSelectAsistencia: combo,
    //             loading: false
    //         });
    //     });
    // }

    getComboTipoCitacion = async () => {
        this.setState({ loading: true });
        await UtilsDataService.getComboTipoCitacion().then(response => {
            let combo = [];
            response.data.forEach(i => {
                combo.push({ value: i.id, label: i.nombre })
            })
            combo.unshift(SelectTipoCitacion)
            this.setState({
                dataSelectTipoCitacion: combo,
                loading: false
            });
        });
    }

    saveSubmit = async (e) => {
        e.preventDefault();
        let errors = this.state.errors;
        errors = validForm.cleanErrors(errors);
        this.setState({ errors: errors, loading: true });

        let responseData;
        let data = this.state.fields;
        data.user = auth.username();
        data.asistencia = this.state.selectAsistencia.value;
        data.tipo_citacion = this.state.selectTipoCitacion.value;
        data.control_politico_id = this.state.id;
        data.persona_id = this.state.buscadorPersona.selected.id;

        if (this.state.fields["id"] === 0) {
            await ControlPoliticoDataService.createCitado(data)
                .then(response => {
                    responseData = response.data;
                })
                .catch(function (error) {
                    errors = validForm.displayErrors(error.response.data, errors);
                });
        }
        else {
            await ControlPoliticoDataService.updateCitado(this.state.fields["id"], data)
                .then(response => {
                    responseData = response.data;
                })
                .catch(function (error) {
                    errors = validForm.displayErrors(error.response.data, errors);
                });
        }
        this.setState({ errors: errors, loading: false });
        if (responseData != null) {
            await this.getAll(this.state.filterActive.value);
            this.refs.closemodalSave.click();
            this.resetFiels();
        }
    }

    deleteSubmit = async (e) => {
        e.preventDefault();
        let errors = this.state.errors;
        errors = validForm.cleanErrors(errors);
        this.setState({ errors: errors, loading: true });

        let responseData;
        await ControlPoliticoDataService.deleteCitado(this.state.fieldsDelete["id"])
            .then(response => {
                responseData = response.data;
            })
            .catch(function (error) {
                errors = validForm.displayErrors(error.response.data.errors, errors);
            });

        this.setState({ errors: errors, loading: false });
        if (responseData != null) {
            await this.getAll(this.state.filterActive.value, this.state.filterAsistecia.value, this.state.filterTipoCitacion.value);
            document.querySelector(`#message-box-danger button[data-dismiss="modal"]`).click();
        }
    }

    getAll = async (idFilterActive, asistencia, tipoCitacion) => {
        this.setState({ loading: true });
        let tableInfo = this.state.tableInfo;
        await ControlPoliticoDataService.getAllCitado(
            idFilterActive, this.state.id, asistencia, tipoCitacion)
            .then(response => {
                tableInfo["data"] = response.data;
                tableInfo["dataTipoCitacion"] = this.state.dataSelectTipoCitacion;
            })
            .catch(e => {
                console.log(e);
            });

        this.setState({
            tableInfo: tableInfo,
            loading: false
        });
    }

    getByID = async (id) => {
        this.setState({ loading: true });
        await ControlPoliticoDataService.getCitado(id)
            .then((response) => {
                let fields = response.data[0];
                Object.assign(fields, { user: auth.username() });
                fields.imagen = fields.control_politico_citado_imagenes;
                this.setState(
                    {
                        fields: fields,
                        loading: false,
                    },
                    () => {
                        this.setSelectValue(
                            fields.comision_cargo_congresista_id,
                            "dataSelectAsistencia",
                            "selectAsistencia"
                        );
                        this.setSelectValue(
                            fields.tipo_citacion_id,
                            "dataSelectTipoCitacion",
                            "selectTipoCitacion"
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

    getTipoCitacion(tipo) {
        let tipoCitacions = this.state.dataSelectTipoCitacion;
        let filter = tipoCitacions.filter(x => x.value === tipo)
        if (filter.length > 0)
            return filter[0].label;
    }

    resetFiels() {
        let fields = Object.assign({}, fieldsConst);
        fields.imagen = null;
        if (document.querySelector(".ImageForMultipleResolutionCloseButton")) {
            document.querySelector(".ImageForMultipleResolutionCloseButton").click();
        }
        this.setState({
            fields: fields,
            SelectAsistencia: SelectAsistencia,
            selectTipoCitacion: SelectTipoCitacion,
            fieldsDelete: {},
            imagesResized: [],
            errors: validForm.cleanErrors(this.state.errors)
        });
    }
    handleFilterActive = async (selectActive) => {
        this.setState({ filterActive: selectActive });
        await this.getAll(selectActive.value, this.state.filterAsistecia.value, this.state.filterTipoCitacion.value);
    }
    handleAsistencia = async (selectOption) => {
        this.setState({ selectAsistencia: selectOption });
    };

    handleTipoCitacion = async (selectOption) => {
        this.setState({ selectTipoCitacion: selectOption });
    };

    handleFilterAsistecia = async (selectOption) => {
        this.setState({ filterAsistecia: selectOption });
        await this.getAll(this.state.filterActive.value, selectOption.value, this.state.filterTipoCitacion.value);
    };

    handleFilterTipoCitacion = async (selectOption) => {
        this.setState({ filterTipoCitacion: selectOption });
        await this.getAll(this.state.filterActive.value, this.state.filterAsistecia.value, selectOption.value);
    };
    render() {
        return (
            <div>
                <Spinner show={this.state.loading} />

                <div className="modal" id="add-citado" role="dialog" aria-labelledby="largeModalHead" aria-hidden="true">
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <button
                                    type="button"
                                    className="close"
                                    onClick={async () => {
                                        this.resetFiels();
                                    }}
                                    data-dismiss="modal">
                                    <span aria-hidden="true">&times;</span><span className="sr-only">Cerrar</span></button>
                                <h4 className="modal-title" id="largeModalHead"><i className="fa fa-user"></i> {this.state.fields["id"] === 0 ? "Nuevo" : "Editar"} citado</h4>
                            </div>
                            <div className="modal-body">
                                <form className="form-horizontal custom" onSubmit={this.saveSubmit.bind(this)}>
                                    <Input divClass="col-md-12" inputName="idCitado" inputType="hidden" inputValue={this.state.fields["id"]} />
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <div className="input-group">
                                                    <label htmlFor="">Asistencia</label>
                                                    <Select
                                                        divClass=""
                                                        selectplaceholder="Seleccione"
                                                        selectValue={this.state.selectAsistencia}
                                                        selectOnchange={this.handleAsistencia}
                                                        selectoptions={this.state.dataSelectAsistencia}
                                                        selectIsSearchable={false}
                                                        selectclassNamePrefix="selectReact__value-container"
                                                        spanClass="error"
                                                        spanError={this.state.errors["asistencia"] || ''} >
                                                    </Select>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <div className="input-group">
                                                    <label htmlFor="">Tipo de citación</label>
                                                    <Select
                                                        divClass=""
                                                        selectplaceholder="Seleccione"
                                                        selectValue={this.state.selectTipoCitacion}
                                                        selectOnchange={this.handleTipoCitacion}
                                                        selectoptions={this.state.dataSelectTipoCitacion}
                                                        selectIsSearchable={false}
                                                        selectclassNamePrefix="selectReact__value-container"
                                                        spanClass="error"
                                                        spanError={this.state.errors["tipo_citacion"] || ''} >
                                                    </Select>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <hr />
                                    <div className="row">
                                        <div className="col-md-12">
                                            <div className="form-group">
                                                <div className="col-md-12">
                                                    <label >Persona</label>
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
                                                        selected={this.state.buscadorPersona.selected} />
                                                </div>
                                            </div>
                                            <span className={`error`}>{this.state.errors["persona_id"] || ''}</span>
                                        </div>

                                    </div>
                                    <div className="row ">
                                        <div className="col-md-12 push-up-30">
                                            <button type="button"
                                                className="btn btn-default"
                                                data-dismiss="modal"
                                                onClick={async () => {
                                                    this.resetFiels();
                                                }} ref="closemodalSave">Cerrar</button>
                                            {
                                                this.state.fields["id"] === 0 ?
                                                    <ValidarPermiso
                                                        IdModuloPermisoValidar={ModuloPermiso.ControlPolitico.AgregarCitados}
                                                        DefaultTemplate={
                                                            <button className="btn btn-success pull-right"><i className="fa fa-check"></i> Guardar </button>
                                                        }
                                                    /> :
                                                    <ValidarPermiso
                                                        IdModuloPermisoValidar={ModuloPermiso.ControlPolitico.ModificarCitados}
                                                        DefaultTemplate={
                                                            <button className="btn btn-success pull-right"><i className="fa fa-check"></i> Guardar </button>
                                                        }
                                                    />
                                            }
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={`message-box message-box-${this.state.fieldsDelete.activo ? "danger" : "info"} animated fadeIn`} id="message-box-danger">
                    <form action="">
                        <div className="mb-container">
                            <div className="mb-middle">
                                <div className="mb-title"><span className={`fa fa-${this.state.fieldsDelete.activo ? "eraser" : "check"}`}></span> {this.state.fieldsDelete.activo ? "Desactivar" : "Activar"} citado</div>
                                <div className="mb-content">
                                    <p>{`¿Está seguro que desea ${this.state.fieldsDelete.activo ? "desactivar" : "activar"} al citado ${this.state.fieldsDelete.nombre}? Puede volver a ${this.state.fieldsDelete.activo ? "activarlo" : "desactivarlo"} en cualquier otro momento.`}</p>
                                </div>
                                <div className="mb-footer">
                                    <ValidarPermiso
                                        IdModuloPermisoValidar={ModuloPermiso.ControlPolitico.EliminarCitados}
                                        DefaultTemplate={
                                            <button type="button" className="btn btn-primary btn-lg pull-right" onClick={(e) => { this.deleteSubmit(e) }} >{this.state.fieldsDelete.activo ? "Desactivar" : "Activar"}</button>
                                        }
                                    />

                                    &nbsp;
                                    <button className="btn btn-default btn-lg pull-right" type="button" data-dismiss="modal">Cancelar</button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>

                <ul className="breadcrumb push-down-0">
                    <li><a href="/">Control politico</a></li>
                    <li><a href="/">Citados</a></li>
                </ul>
                <div className="content-frame">
                    <div className="content-frame-top">
                        <div className="rowListado">
                            <div className="panel panel-default ">
                                <div className="panel-heading">
                                    <h3 className="panel-title"><span className="fa fa-list"></span> Listado de citados</h3>
                                    <ul className="panel-controls">
                                        <li>
                                            <div style={{ minWidth: "150px" }}>
                                                <Select
                                                    divClass=""
                                                    selectplaceholder="Seleccione"
                                                    selectValue={this.state.filterActive}
                                                    selectOnchange={this.handleFilterActive}
                                                    selectoptions={this.state.dataSelectActive}
                                                    selectIsSearchable={false}
                                                    selectclassNamePrefix="selectReact__value-container"
                                                    spanClass=""
                                                    spanError="" >
                                                </Select>
                                            </div>
                                        </li>
                                        <li>
                                            <div style={{ minWidth: "200px" }}>
                                                <Select
                                                    divClass=""
                                                    selectplaceholder="Seleccione"
                                                    selectValue={this.state.filterAsistecia}
                                                    selectOnchange={this.handleFilterAsistecia}
                                                    selectoptions={this.state.dataSelectAsistencia}
                                                    selectIsSearchable={false}
                                                    selectclassNamePrefix="selectReact__value-container"
                                                    spanClass=""
                                                    spanError="" >
                                                </Select>
                                            </div>
                                        </li>
                                        <li>
                                            <div style={{ minWidth: "200px" }}>
                                                <Select
                                                    divClass=""
                                                    selectplaceholder="Seleccione"
                                                    selectValue={this.state.filterTipoCitacion}
                                                    selectOnchange={this.handleFilterTipoCitacion}
                                                    selectoptions={this.state.dataSelectTipoCitacion}
                                                    selectIsSearchable={false}
                                                    selectclassNamePrefix="selectReact__value-container"
                                                    spanClass=""
                                                    spanError="" >
                                                </Select>
                                            </div>
                                        </li>
                                        <li>
                                            <ValidarPermiso
                                                IdModuloPermisoValidar={ModuloPermiso.ControlPolitico.AgregarCitados}
                                                DefaultTemplate={
                                                    <button
                                                        type="button"
                                                        data-toggle="modal"
                                                        data-target="#add-citado"
                                                        onClick={() => {
                                                            this.resetFiels();
                                                        }}
                                                        className="btn btn-primary btn-block"
                                                    ><i className="fa fa-plus"></i> Nuevo registro</button>
                                                }
                                            />
                                        </li>
                                    </ul>
                                </div>
                                <div className="panel-body">
                                    <div>
                                        <ValidarPermiso
                                            IdModuloPermisoValidar={ModuloPermiso.ControlPolitico.IndexCitados}
                                            DefaultTemplate={
                                                <TableReact
                                                    columns={this.state.tableInfo["columns"]}
                                                    data={this.state.tableInfo["data"]}
                                                    hiddenColumns={this.state.tableInfo["hiddenColumns"]}
                                                />
                                            }
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default ControlPoliticoCitados;