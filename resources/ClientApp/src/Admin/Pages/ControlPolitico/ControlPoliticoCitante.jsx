import React, { Component } from 'react';
import TableReact from "../../../Components/TableReact";
import Dropzone from 'react-dropzone-uploader';
import ControlPoliticoDataService from "../../../Services/Congreso/ControlPolitico.Service";
import CongresistasDataService from "../../../Services/Catalogo/Congresistas.Service";
import UtilsDataService from "../../../Services/General/Utils.Service";
import Spinner from '../../../Components/Spinner';
import Select from '../../../Components/Select';
import Input from "../../../Components/Input";
import ValidForm from "../../../Utils/ValidForm";
import { ModuloPermiso } from "../../../Permisos/ModuloPermiso";
import { Constantes } from "../../../Constants/Constantes.js";
import ValidarPermiso from "../../../Permisos/ValidarPermiso";
import AuthLogin from "../../../Utils/AuthLogin";
import BuscadorCongresista from '../../../Components/BuscadorCongresista';

const auth = new AuthLogin();
const validForm = new ValidForm();
const fieldsConst = {
    id: 0,
    control_politico_id: 0,
    congresista: '',
    congresista_id: 0
};
const fieldsConstControl = {
    id: 0,
    legislatura_id: 0,
    cuatrienio_id: 0,
    corporacion_id: 0,
    estado_control_politico_id: 0,
    tema_control_politico_id: 0,
    comision_id: 0,
    titulo: "",
    fecha: new Date(),
    comision: null,
    user: ""
};
const errorsConst = {
    id: '',
    control_politico_id: '',
    congresista_id: '',
    activo: '',
}

const SelectCongresistas = { value: 0, label: 'Seleccione congresista' };
class ControlPoliticoCitante extends Component {
    constructor(props) {
        super(props);

        const id =
            this.props.match.params.id === undefined
                ? 0
                : this.props.match.params.id;
        this.tableHandler = this.tableHandler.bind(this);
        this.state = {
            id: id,
            tableInfo: {
                columns: [
                    {
                        Header: "Citantes",
                        columns: [
                            {
                                Header: "id",
                                accessor: "id"
                            },
                            {
                                Header: "Nombres",
                                accessor: "congresista.persona.nombres"
                            },
                            {
                                Header: "Apellidos",
                                accessor: "congresista.persona.apellidos"
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
                            auth.tieneModuloPermiso(ModuloPermiso.ControlPolitico.EliminarCitantes) ?
                                {
                                    Header: "Activar/Desactivar",
                                    id: "actdesc",
                                    accessor: (str) => "actdesc",
                                    Cell: (tableProps) => (
                                        <ValidarPermiso
                                            IdModuloPermisoValidar={ModuloPermiso.ControlPolitico.EliminarCitantes}
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
                                    accessor: (str) => "-"
                                }
                        ]
                    }
                ],
                hiddenColumns: ["id", "activo"],
                data: []
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
            fields: fieldsConst,
            fieldsControl: fieldsConstControl,
            errors: errorsConst,
            loading: true,
            filterActive: { value: 1, label: "Activo" },
            dataSelectActive: [{ value: -1, label: "Filtrar por activo" }, { value: 1, label: "Activo" }, { value: 0, label: "Inactivo" }],
            selectCongresista: SelectCongresistas,
            dataSelectCongresistas: [SelectCongresistas],
            search: ''
        }
    }

    componentDidMount = async () => {
        await this.getByIDControl(this.state.id);
        await this.getAllCongresistas(
            1,
            this.state.fieldsControl.corporacion_id,
            this.state.fieldsControl.cuatrienio_id,
            this.state.buscadorCongresista.page,
            this.state.buscadorCongresista.rows,
            this.state.buscadorCongresista.search
        );
        await this.getAll(this.state.filterActive.value);
    }

    async tableHandler(page, rows, search) {
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
                    this.state.fieldsControl.comision.corporacion_id,
                    this.state.fieldsControl.cuatrienio_id,
                    page,
                    rows,
                    search
                );
            }.bind(this),
            1000
        );
    }

    getAllCongresistas = async (idFilterActive, Corporacion, cuatrienio, page, rows, search) => {
        this.setState({ loading: true });
        let buscadorCongresista = this.state.buscadorCongresista;
        await CongresistasDataService.getAll(
            idFilterActive,
            Corporacion, cuatrienio, -1,
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

        await CongresistasDataService.getTotalRecords(idFilterActive, Corporacion, cuatrienio, -1, search)
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
            nombres: congresista.persona.nombres,
            apellidos: congresista.persona.apellidos,
            imagenes: congresista.persona.imagenes,
            lugar_nacimiento: congresista.persona.lugar_nacimiento
        };
        buscadorCongresista.selected = congresistaSelected;
        this.setState({ buscadorCongresista })
    }

    getByIDControl = async (id) => {
        this.setState({ loading: true });
        let fieldsControl = null;
        await ControlPoliticoDataService.get(id)
            .then((response) => {
                fieldsControl = response.data[0];
            })
            .catch((e) => {
                this.setState({
                    loading: false,
                });
                console.log(e);
            });
        if (fieldsControl !== null) {
            this.setState({
                loading: false,
                fieldsControl: fieldsControl
            });
        }
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

    handlerDesactivar = (controlPolitico) => {
        let desActObj = { id: controlPolitico.id, congresista: controlPolitico["congresista.nombre"], activo: controlPolitico.activo }
        this.setState({
            fields: desActObj
        })
    }

    getComboCongresista = async () => {
        this.setState({ loading: true });
        let search = this.state.search;
        await UtilsDataService.getCongresistasFilter({ nombre: search, corporacion_id: this.state.fieldsControl.legislatura_id, cuatrienio_id: this.state.fieldsControl.cuatrienio_id })
            .then(response => {
                let combo = [];
                response.data.forEach(i => {
                    combo.push({ value: i.id, label: i.nombre })
                })
                combo.unshift(SelectCongresistas);
                this.setState({
                    dataSelectCongresistas: combo,
                    miembrosDetalle: response.data,
                    loading: false
                })

            })
    }

    saveSubmit = async (e) => {
        e.preventDefault();
        let errors = this.state.errors;
        errors = validForm.cleanErrors(errors);
        this.setState({ loading: true });

        let congresistas = this.state.tableInfo;
        let congresista = congresistas.data.find(x => x.congresista_id === this.state.buscadorCongresista.selected.id);
        if (congresista === null || congresista === undefined) {
            let responseData;
            let data = this.state.fields;
            data.user = auth.username();
            data.congresista_id = this.state.buscadorCongresista.selected.id;
            data.control_politico_id = this.state.id;
            console.log(data);
            if (this.state.fields["id"] === 0) {
                await ControlPoliticoDataService.createCitante(data)
                    .then(response => {
                        responseData = response.data;
                    })
                    .catch(function (error) {
                        errors = validForm.displayErrors(error.response.data, errors);
                        console.log(errors);
                    });
            }
            else {
                await ControlPoliticoDataService.updateCitante(this.state.fields["id"], data)
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
        else {
            errors.congresista_id = "El congresista ya esta seleccionado";
            this.setState({ errors: errors, loading: false });
        }

    }

    deleteSubmit = async (e) => {
        e.preventDefault();
        let errors = this.state.errors;
        errors = validForm.cleanErrors(errors);
        this.setState({ errors: errors, loading: true });

        let responseData;
        await ControlPoliticoDataService.deleteCitante(this.state.fields["id"])
            .then(response => {
                responseData = response.data;
            })
            .catch(function (error) {
                errors = validForm.displayErrors(error.response.data.errors, errors);
            });

        this.setState({ errors: errors, loading: false });
        if (responseData != null) {
            await this.getAll(this.state.filterActive.value);
            document.querySelector(`#message-box-danger button[data-dismiss="modal"]`).click();
        }
    }

    getAll = async (idFilterActive) => {
        this.setState({ loading: true });
        let tableInfo = this.state.tableInfo;
        await ControlPoliticoDataService.getAllCitante(
            idFilterActive, this.state.id)
            .then(response => {
                tableInfo["data"] = response.data;
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
        await ControlPoliticoDataService.getCitante(id)
            .then((response) => {
                let fields = response.data;
                Object.assign(fields, { user: auth.username() });
                this.setState(
                    {
                        fields: fields,
                        loading: false,
                    },
                    () => {
                        this.setSelectValue(
                            fields.congresista_id,
                            "dataSelectCongresista",
                            "selectCongresista"
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

    resetFiels() {
        let fields = validForm.resetObject(fieldsConst);

        this.setState({
            fields: fields,
            selectCongresista: SelectCongresistas,
            errors: validForm.cleanErrors(this.state.errors),
            search: ''
        });
    }
    handleFilterActive = async (selectActive) => {
        this.setState({ filterActive: selectActive });
        await this.getAll(this.state.filterActive.value);
    }
    handleCongresista = async (selectOption) => {
        this.setState({ selectCongresista: selectOption });
    }
    handleSearchCongresista = async () => {
        this.setState({ selectCongresista: SelectCongresistas });
        await this.getComboCongresista();
    }
    render() {
        return (
            <div>
                <Spinner show={this.state.loading} />
                <div className="modal" id="add-citante" role="dialog" aria-labelledby="largeModalHead" aria-hidden="true">
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
                                <h4 className="modal-title" id="largeModalHead"><i className="fa fa-ticket"></i> {this.state.fields["id"] === 0 ? "Nuevo" : "Editar"} citante</h4>
                            </div>
                            <div className="modal-body">
                                <form className="form-horizontal custom" onSubmit={this.saveSubmit.bind(this)}>
                                    <Input divClass="col-md-12" inputName="idCitante" inputType="hidden" inputValue={this.state.fields["id"]} />
                                    <div className="row">
                                        <div className="col-md-12">
                                            <div className="form-group">
                                                <div className="col-md-12">
                                                    <label >Congresista</label>
                                                    <BuscadorCongresista
                                                        handler={this.tableHandler}
                                                        handlerChangeSearch={this.handlerChangeSearchForCongresista}
                                                        handlerSelectCongresista={this.handlerSelectCongresista}
                                                        data={this.state.buscadorCongresista.data}
                                                        imgDefault={Constantes.NoImagen}
                                                        imgOrigin={this.state.buscadorCongresista.imgOrigin}
                                                        pageExtends={this.state.buscadorCongresista.page}
                                                        pageSize={this.state.buscadorCongresista.rows}
                                                        totalRows={this.state.buscadorCongresista.totalRows}
                                                        search={this.state.buscadorCongresista.search}
                                                        selected={this.state.buscadorCongresista.selected}
                                                    />
                                                </div>
                                            </div>
                                            <span className={`error`}>{this.state.errors.congresista_id || ''}</span>
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
                                            <ValidarPermiso
                                                IdModuloPermisoValidar={ModuloPermiso.ControlPolitico.AgregarCitantes}
                                                DefaultTemplate={
                                                    <button className="btn btn-success pull-right"><i className="fa fa-check"></i> Guardar </button>
                                                }
                                            />
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={`message-box message-box-${this.state.fields.activo ? "danger" : "info"} animated fadeIn`} id="message-box-danger">
                    <form action="">
                        <div className="mb-container">
                            <div className="mb-middle">
                                <div className="mb-title"><span className={`fa fa-${this.state.fields.activo ? "eraser" : "check"}`}></span> {this.state.fields.activo ? "Desactivar" : "Activar"} citante</div>
                                <div className="mb-content">
                                    <p>{`¿Está seguro que desea ${this.state.fields.activo ? "desactivar" : "activar"} al citante ${this.state.fields.congresista}? Puede volver a ${this.state.fields.activo ? "activarlo" : "desactivarlo"} en cualquier otro momento.`}</p>
                                </div>
                                <div className="mb-footer">
                                    <ValidarPermiso
                                        IdModuloPermisoValidar={ModuloPermiso.ControlPolitico.EliminarCitantes}
                                        DefaultTemplate={
                                            <button type="button" className="btn btn-primary btn-lg pull-right" onClick={(e) => { this.deleteSubmit(e) }} >{this.state.fields.activo ? "Desactivar" : "Activar"}</button>
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
                    <li><a href="/">Citantes</a></li>
                </ul>
                <div className="content-frame">
                    <div className="content-frame-top">
                        <div className="rowListado">
                            <div className="panel panel-default ">
                                <div className="panel-heading">
                                    <h3 className="panel-title"><span className="fa fa-list"></span> Listado de citantes</h3>
                                    <ul className="panel-controls">
                                        {/* <li>
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
                                        </li> */}
                                        <li>
                                            <ValidarPermiso
                                                IdModuloPermisoValidar={ModuloPermiso.ControlPolitico.AgregarCitantes}
                                                DefaultTemplate={
                                                    <button
                                                        type="button"
                                                        data-toggle="modal"
                                                        data-target="#add-citante"
                                                        className="btn btn-primary btn-block"
                                                        onClick={() => {
                                                            this.resetFiels();
                                                        }}
                                                    ><i className="fa fa-plus"></i> Nuevo registro</button>
                                                }
                                            />
                                        </li>
                                    </ul>
                                </div>
                                <div className="panel-body">
                                    <div>
                                        <ValidarPermiso
                                            IdModuloPermisoValidar={ModuloPermiso.ControlPolitico.IndexCitantes}
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

export default ControlPoliticoCitante;