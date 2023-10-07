import React, { Component } from 'react';
import TableReactExtends from "../../../Components/TableReactExtends";
import ControlPoliticoDataService from "../../../Services/Congreso/ControlPolitico.Service";
import UtilsDataService from "../../../Services/General/Utils.Service";
import Spinner from '../../../Components/Spinner';
import Select from '../../../Components/Select';
import ValidForm from "../../../Utils/ValidForm";
import { ModuloPermiso } from "../../../Permisos/ModuloPermiso";
import ValidarPermiso from "../../../Permisos/ValidarPermiso";
import AuthLogin from "../../../Utils/AuthLogin";

const auth = new AuthLogin();

const validForm = new ValidForm();

const fieldsConst = {
    id: 0,
    legislatura_id: 0,
    cuatrienio_id: 0,
    estado_control_politico_id: 0,
    comision_id: 0,
    titulo: "",
    fecha: "",
};

const errorsConst = {
    id: '',
    legislatura_id: '',
    cuatrienio_id: '',
    estado_control_politico_id: '',
    comision_id: '',
    titulo: "",
    fecha: "",
};
const SelectLegislatura = { value: -1, label: 'Filtrar por legislatura' };
const SelectCuatrienio = { value: -1, label: 'Filtrar por quinquenio' };
const SelectComision = { value: -1, label: 'Filtrar por comisión' };
const SelectEstado = { value: -1, label: 'Filtrar por estado' };
const SelectCorporacion = { value: -1, label: 'Seleccione corporacion' };

class ControlPoliticoIndex extends Component {
    constructor(props) {
        super(props);

        this.tableHandler = this.tableHandler.bind(this);

        this.state = {
            tableInfo: {
                columns: [
                    {
                        Header: "Control político",
                        columns: [
                            {
                                Header: "id",
                                accessor: "id"
                            },
                            {
                                Header: "Título",
                                accessor: "titulo"
                            },
                            {
                                Header: "Fecha",
                                accessor: "fecha"
                            },
                            {
                                Header: "Legislatura",
                                accessor: "legislatura.nombre"
                            },
                            {
                                Header: "Quinquenio",
                                accessor: "cuatrienio.nombre"
                            },
                            {
                                Header: "Estado",
                                accessor: "estado_control_politico.nombre"
                            },
                            {
                                Header: "Corporación",
                                accessor: "corporacion.nombre"
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
                            auth.tieneModuloPermiso(ModuloPermiso.ControlPolitico.Obtener) ?
                                {
                                    Header: 'Editar',
                                    id: 'editar',
                                    accessor: (str) => 'editar',
                                    Cell: (tableProps) => (
                                        <ValidarPermiso
                                            IdModuloPermisoValidar={ModuloPermiso.ControlPolitico.Obtener}
                                            DefaultTemplate={
                                                <a href={`#/control-politico-editar/${tableProps.row.values.id}`} data-id={tableProps.row.values.id}
                                                    className="btn btn-info btn-block">
                                                    <i className="fa fa-edit"></i> Editar
                                        </a>
                                            }
                                        />
                                    )
                                }
                                : {
                                    Header: 'Editar',
                                    id: 'editar',
                                    accessor: (str) => '-',
                                },
                            auth.tieneModuloPermiso(ModuloPermiso.ControlPolitico.Eliminar) ?
                                {
                                    Header: "Activar/Desactivar",
                                    id: "actdesc",
                                    clickHandler: (values) => (
                                        () => {
                                            this.handlerDesactivar(
                                                values
                                            );
                                        }
                                    ),
                                    accessor: (str) => "actdesc",
                                    Cell: (tableProps) => (
                                        <ValidarPermiso
                                            IdModuloPermisoValidar={ModuloPermiso.ControlPolitico.Eliminar}
                                            DefaultTemplate={
                                                <button
                                                    data-toggle="modal"
                                                    data-target="#message-box-danger"
                                                    className={`btn ${tableProps.row.values.activo === 1
                                                        ? "btn-danger"
                                                        : "btn-warning"} eliminar`}
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
                                    ),
                                }
                                : {
                                    Header: "Activar/Desactivar",
                                    id: "actdesc",
                                    accessor: (str) => "-",
                                },
                            auth.tieneModuloPermiso(ModuloPermiso.ControlPolitico.IndexProposiciones) ?
                                {
                                    Header: 'Cuestionario',
                                    id: 'cuestionario',
                                    accessor: (str) => 'cuestionario',
                                    Cell: (tableProps) => (
                                        <ValidarPermiso
                                            IdModuloPermisoValidar={ModuloPermiso.ControlPolitico.IndexProposiciones}
                                            DefaultTemplate={
                                                <a href={`#/control-politico-cuestionarios/${tableProps.row.values.id}`} data-id={tableProps.row.values.id}
                                                    className="btn btn-primary btn-block">
                                                    <i class="fab fa-slideshare"></i> Cuestionario
                                        </a>
                                            }
                                        />
                                    )
                                }
                                : {
                                    Header: 'Cuestionario',
                                    id: 'Cuestionario',
                                    accessor: (str) => '-',
                                },
                            auth.tieneModuloPermiso(ModuloPermiso.ControlPolitico.IndexCitantes) ?
                                {
                                    Header: 'Citantes',
                                    id: 'citantes',
                                    accessor: (str) => 'citantes',
                                    Cell: (tableProps) => (
                                        <ValidarPermiso
                                            IdModuloPermisoValidar={ModuloPermiso.ControlPolitico.IndexCitantes}
                                            DefaultTemplate={
                                                <a href={`#/control-politico-citantes/${tableProps.row.values.id}`} data-id={tableProps.row.values.id}
                                                    className="btn btn-primary btn-block">
                                                    <i className="fa fa-users"></i> Citantes
                                            </a>
                                            }
                                        />
                                    )
                                }
                                : {
                                    Header: 'Citantes',
                                    id: 'Sin permiso para citantes',
                                    accessor: (str) => '-',
                                },
                            auth.tieneModuloPermiso(ModuloPermiso.ControlPolitico.IndexCitados) ?
                                {
                                    Header: 'Citados',
                                    id: 'citados',
                                    accessor: (str) => 'citados',
                                    Cell: (tableProps) => (
                                        <ValidarPermiso
                                            IdModuloPermisoValidar={ModuloPermiso.ControlPolitico.IndexCitados}
                                            DefaultTemplate={
                                                <a href={`#/control-politico-citados/${tableProps.row.values.id}`} data-id={tableProps.row.values.id}
                                                    className="btn btn-primary btn-block">
                                                    <i className="fa fa-users"></i> Citados
                                                </a>
                                            }
                                        />
                                    )
                                }
                                : {
                                    Header: 'Citados',
                                    id: 'Sin permiso para citados',
                                    accessor: (str) => '-',
                                },
                            auth.tieneModuloPermiso(ModuloPermiso.ControlPolitico.IndexRespuestas) ?
                                {
                                    Header: 'Respuestas',
                                    id: 'respuestas',
                                    accessor: (str) => 'respuestas',
                                    Cell: (tableProps) => (
                                        <ValidarPermiso
                                            IdModuloPermisoValidar={ModuloPermiso.ControlPolitico.IndexRespuestas}
                                            DefaultTemplate={
                                                <a href={`#/control-politico-respuestas/${tableProps.row.values.id}`} data-id={tableProps.row.values.id}
                                                    className="btn btn-primary btn-block">
                                                    <i class="fa fa-reply-all"></i> Respuestas
                                                </a>
                                            }
                                        />
                                    )
                                }
                                : {
                                    Header: 'Respuestas',
                                    id: 'Sin permiso para respuestas',
                                    accessor: (str) => '-',
                                },
                            auth.tieneModuloPermiso(ModuloPermiso.ControlPolitico.IndexDocumentos) ?
                                {
                                    Header: 'Gacetas',
                                    id: 'gacetas',
                                    accessor: (str) => 'gacetas',
                                    Cell: (tableProps) => (
                                        <ValidarPermiso
                                            IdModuloPermisoValidar={ModuloPermiso.ControlPolitico.IndexDocumentos}
                                            DefaultTemplate={
                                                <a href={`#/control-politico-gacetas/${tableProps.row.values.id}`} data-id={tableProps.row.values.id}
                                                    className="btn btn-primary btn-block">
                                                    <i class="fa fa-file-upload"></i> Gacetas
                                    </a>
                                            }
                                        />
                                    )
                                }
                                : {
                                    Header: 'Documentos',
                                    id: 'gacetas',
                                    accessor: (str) => '-',
                                },
                        ]
                    }
                ],
                hiddenColumns: ["id", "activo"],
                data: [],
                page: 1,
                rows: 5,
                search: "",
                totalRows: 0
            },
            fields: {},
            errors: errorsConst,
            loading: true,
            filterActive: { value: 1, label: "Activo" },
            dataSelectActive: [{ value: -1, label: "Filtrar por activo" }, { value: 1, label: "Activo" }, { value: 0, label: "Inactivo" }],
            filterLegislatura: SelectLegislatura,
            dataSelectLegislatura: [SelectLegislatura],
            filterCuatrienio: SelectCuatrienio,
            dataSelectCuatrienio: [SelectCuatrienio],
            filterComision: SelectComision,
            dataSelectComision: [SelectComision],
            filterEstado: SelectEstado,
            dataSelectEstado: [SelectEstado],
            filterCorporacion: SelectCorporacion,
            dataSelectCorporacion: [SelectCorporacion],
            desactivarControlPolitico: { id: 0, titulo: "", fecha: "", activo: true }
        }
    }
    async tableHandler(page, rows, search, isDelay) {
        let delayAccion = isDelay ? 1000 : 0;
        let tableInfo = this.state.tableInfo;
        tableInfo.page = page;
        tableInfo.rows = rows;
        tableInfo.search = search;
        if (!isDelay)
            tableInfo.data = [];
        this.setState({ tableInfo: tableInfo });
        if (this.timeout) clearTimeout(this.timeout);
        this.timeout = setTimeout(async function () {
            await this.getAll(this.state.filterActive.value, page, rows, search);
        }.bind(this), delayAccion);
    }
    componentDidMount = async () => {
        await this.getAll(this.state.filterActive.value, this.state.tableInfo["page"], this.state.tableInfo["rows"], this.state.tableInfo["search"]);
        await this.getComboCuatrienio();
        await this.getComboComision();
        await this.getComboEstado();
        await this.getComboCorporacion();
    }
    handlerDesactivar = (controlPolitico) => {
        let desActObj = { id: controlPolitico.id, titulo: controlPolitico.titulo, fecha: controlPolitico.fecha, activo: controlPolitico.activo }
        this.setState({
            desactivarControlPolitico: desActObj
        })
    }

    //Combos
    getComboCorporacion = async () => {
        this.setState({ loading: true });
        await UtilsDataService.getComboCorporacion().then(response => {
            let combo = [];
            response.data.forEach(i => {
                combo.push({ value: i.id, label: i.nombre })
            })
            combo.unshift(SelectCorporacion)
            this.setState({
                dataSelectCorporacion: combo,
                loading: false
            });
        });
    }
    getComboComision = async () => {
        this.setState({ loading: true });
        await UtilsDataService.getComboComisiones()
            .then(response => {
                let combo = [];
                response.data.forEach(i => {
                    combo.push({ value: i.id, label: i.nombre })
                })
                combo.unshift({ value: -1, label: "Filtrar por comisión" })
                this.setState({
                    dataSelectComision: combo,
                    loading: false
                });
            })
            .catch(error => {
                console.log("Error:" + error.message);
                this.setState({ loading: false });
            });

    }

    getComboLegislatura = async (value) => {
        this.setState({ loading: true });
        await UtilsDataService.getComboLegislatura(value)
            .then(response => {
                let combo = [];
                response.data.forEach(i => {
                    combo.push({ value: i.id, label: i.nombre })
                })
                combo.unshift({ value: -1, label: "Filtrar por legislatura" })
                this.setState({
                    dataSelectLegislatura: combo,
                    loading: false
                })
            })
            .catch(function (error) {
                console.log(error);

            });
        this.setState({ loading: false });
    }

    getComboCuatrienio = async () => {
        this.setState({ loading: true });
        await UtilsDataService.getComboCuatrienio()
            .then(response => {
                let combo = [];
                response.data.forEach(i => {
                    combo.push({ value: i.id, label: i.nombre })
                })
                combo.unshift({ value: -1, label: "Filtrar por quinquenio" })
                this.setState({
                    dataSelectCuatrienio: combo,
                    loading: false
                })
            })
            .catch(function (error) {
                console.log(error);

            });
        this.setState({ loading: false });
    }

    getComboEstado = async () => {
        this.setState({ loading: true });
        await UtilsDataService.getComboEstadoControlPolitico()
            .then(response => {
                let combo = [];
                response.data.forEach(i => {
                    combo.push({ value: i.id, label: i.nombre })
                })
                combo.unshift({ value: -1, label: "Filtrar por estado" })
                this.setState({
                    dataSelectEstado: combo,
                    loading: false
                })
            })
            .catch(function (error) {
                console.log(error);
                this.setState({ loading: false });
            });
    }

    //End combos

    deleteSubmit = async (e) => {
        e.preventDefault();
        let errors = this.state.errors;
        errors = validForm.cleanErrors(errors);
        this.setState({ errors: errors, loading: true });

        let responseData;
        await ControlPoliticoDataService.delete(this.state.desactivarControlPolitico["id"])
            .then(response => {
                responseData = response.data;
            })
            .catch(function (error) {
                errors = validForm.displayErrors(error.response.data.errors, errors);
            });

        this.setState({ errors: errors, loading: false });
        if (responseData != null) {
            await this.getAll(this.state.filterActive.value, this.state.tableInfo.page, this.state.tableInfo.rows, this.state.tableInfo.search);
        }

        document.querySelector(`#message-box-danger button[data-dismiss="modal"]`).click(); // Accionamos el click del cancelar para cerrar
    }

    getAll = async (idFilterActive, page, rows, search) => {
        this.setState({ loading: true });
        let tableInfo = this.state.tableInfo;
        let legislatura = this.state.filterLegislatura;
        let cuatrienio = this.state.filterCuatrienio;
        let comision = this.state.filterComision;
        let estado = this.state.filterEstado;
        let corporacion = this.state.filterCorporacion
        await ControlPoliticoDataService.getAll(
            idFilterActive, corporacion.value, legislatura.value, cuatrienio.value, comision.value, estado.value, search, page, rows)
            .then(response => {
                tableInfo["data"] = response.data;
            })
            .catch(e => {
                console.log(e);
            });

        await ControlPoliticoDataService.getTotalRecordsControlPolitico(idFilterActive, corporacion.value, legislatura.value, cuatrienio.value, comision.value, estado.value, search)
            .then(response => {
                tableInfo["totalRows"] = response.data;
            })
            .catch(e => {
                console.log(e);
            })

        this.setState({
            tableInfo: tableInfo,
            loading: false
        });
    }

    resetFiels() {
        let fields = validForm.resetObject(fieldsConst);
        this.setState({ fields: fields, errors: validForm.cleanErrors(this.state.errors) });
    }
    handleFilterActive = async (selectActive) => {
        this.setState({ filterActive: selectActive });
        await this.tableHandler(1, 5, this.state.tableInfo.search, false)
    }
    handleFilterComision = async (selectComision) => {
        this.setState({ filterComision: selectComision });
        await this.tableHandler(1, 5, this.state.tableInfo.search, false)
    }
    handleFilterCuatrienio = async (selectCuatrienio) => {
        this.setState({ filterCuatrienio: selectCuatrienio, filterLegislatura: SelectLegislatura });
        await this.tableHandler(1, 5, this.state.tableInfo.search, false)
        await this.getComboLegislatura(selectCuatrienio.value);
    }
    handleFilterLegislatura = async (selectLegislatura) => {
        this.setState({ filterLegislatura: selectLegislatura });
        await this.tableHandler(1, 5, this.state.tableInfo.search, false)
    }
    handleFilterEstado = async (selectEstado) => {
        this.setState({ filterEstado: selectEstado });
        await this.tableHandler(1, 5, this.state.tableInfo.search, false)
    }
    handleFilterCorporacion = async (selectCorporacion) => {
        this.setState({ filterCorporacion: selectCorporacion });
        await this.tableHandler(1, 5, this.state.tableInfo.search, false)
    }
    render() {
        return (
            <div>
                <Spinner show={this.state.loading} />

                <div className={`message-box message-box-${this.state.desactivarControlPolitico.activo ? "danger" : "info"} animated fadeIn`} id="message-box-danger">
                    <form action="">
                        <div className="mb-container">
                            <div className="mb-middle">
                                <div className="mb-title"><span className={`fa fa-${this.state.desactivarControlPolitico.activo ? "eraser" : "check"}`}></span> {this.state.desactivarControlPolitico.activo ? "Desactivar" : "Activar"} control político</div>
                                <div className="mb-content">
                                    <p>{`¿Está seguro que desea ${this.state.desactivarControlPolitico.activo ? "desactivar" : "activar"} el control político ${this.state.desactivarControlPolitico.titulo}? Puede volver a ${this.state.desactivarControlPolitico.activo ? "activarlo" : "desactivarlo"} en cualquier otro momento.`}</p>
                                </div>
                                <div className="mb-footer">
                                    <button type="button" className="btn btn-primary btn-lg pull-right" onClick={(e) => { this.deleteSubmit(e) }} >{this.state.desactivarControlPolitico.activo ? "Desactivar" : "Activar"}</button>

                                    &nbsp;
                                    <button className="btn btn-default btn-lg pull-right" type="button" data-dismiss="modal">Cancelar</button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>

                <div className="modal" id="modal-delete-partido" tabIndex="-1" role="dialog" aria-labelledby="largeModalHead" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered">
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
                                <h4 className="modal-title" id="largeModalHead"><i className="fa fa-list"></i> {this.state.fields["activo"] === 1 ? "Desactivar" : "Activar"} partido </h4>
                            </div>
                            <div style={{ marginLeft: "20px", marginRight: "20px" }}>
                                <p style={{ paddingLeft: "5px", textAlign: "center" }}>¿Desea {this.state.fields["activo"] === 1 ? "desactivar" : "activar"} el registro del partido?</p>
                                <p style={{ paddingLeft: "5px", textAlign: "center" }}><span>Partido: </span> {this.state.fields["nombre"]}</p>
                            </div>

                            <div className="modal-body">
                                <form name="nutrienteForm" className="form-horizontal" onSubmit={this.deleteSubmit.bind(this)}>
                                    <div className="row">
                                        <div className="col-md-12 push-up-30">
                                            <button
                                                type="button"
                                                className="btn btn-default"
                                                data-dismiss="modal"
                                                onClick={async () => {
                                                    this.resetFiels();
                                                }}
                                                ref="closemodalDelete">Cerrar</button>
                                            <button className="btn btn-primary pull-right"><i className="fa fa-check"></i> Aceptar</button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
                <ul className="breadcrumb push-down-0">
                    <li><a href="/">Catálogos</a></li>
                    <li><a href="/">Control político</a></li>
                </ul>
                <div className="content-frame">
                    <div className="content-frame-top">
                        <div className="rowListado">
                            <div className="panel panel-default ">
                                <div className="panel-heading">
                                    <h3 className="panel-title"><span className="fa fa-list"></span> Listado de control político</h3>
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
                                            <div style={{ minWidth: "170px" }}>
                                                <Select
                                                    divClass=""
                                                    selectplaceholder="Seleccione"
                                                    selectValue={this.state.filterCuatrienio}
                                                    selectOnchange={this.handleFilterCuatrienio}
                                                    selectoptions={this.state.dataSelectCuatrienio}
                                                    selectIsSearchable={false}
                                                    selectclassNamePrefix="selectReact__value-container"
                                                    spanClass=""
                                                    spanError="" >
                                                </Select>
                                            </div>
                                        </li>
                                        <li>
                                            <div style={{ minWidth: "170px" }}>
                                                <Select
                                                    divClass=""
                                                    selectplaceholder="Seleccione"
                                                    selectValue={this.state.filterLegislatura}
                                                    selectOnchange={this.handleFilterLegislatura}
                                                    selectoptions={this.state.dataSelectLegislatura}
                                                    selectIsSearchable={false}
                                                    selectclassNamePrefix="selectReact__value-container"
                                                    noOptionsMessage="Seleccione quinquenio"
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
                                                    selectValue={this.state.filterCorporacion}
                                                    selectOnchange={this.handleFilterCorporacion}
                                                    selectoptions={this.state.dataSelectCorporacion}
                                                    selectIsSearchable={false}
                                                    selectclassNamePrefix="selectReact__value-container"
                                                    spanClass=""
                                                    spanError="" >
                                                </Select>
                                            </div>
                                        </li>
                                        <li>
                                            <div style={{ minWidth: "150px" }}>
                                                <Select
                                                    divClass=""
                                                    selectplaceholder="Seleccione"
                                                    selectValue={this.state.filterEstado}
                                                    selectOnchange={this.handleFilterEstado}
                                                    selectoptions={this.state.dataSelectEstado}
                                                    selectIsSearchable={false}
                                                    selectclassNamePrefix="selectReact__value-container"
                                                    spanClass=""
                                                    spanError="" >
                                                </Select>
                                            </div>
                                        </li>
                                        <li>
                                            <ValidarPermiso
                                                IdModuloPermisoValidar={ModuloPermiso.ControlPolitico.Nuevo}
                                                DefaultTemplate={
                                                    <a href="#/control-politico-crear" className="btn btn-primary">
                                                        <i className="fa fa-plus"></i> Nuevo registro
                                                    </a>
                                                }
                                            />
                                        </li>
                                    </ul>
                                </div>
                                <div className="panel-body">
                                    <ValidarPermiso
                                        IdModuloPermisoValidar={ModuloPermiso.ControlPolitico.Index}
                                        DefaultTemplate={
                                            <TableReactExtends
                                                columns={this.state.tableInfo["columns"]}
                                                data={this.state.tableInfo["data"]}
                                                hiddenColumns={this.state.tableInfo["hiddenColumns"]}
                                                handler={this.tableHandler}
                                                pageExtends={this.state.tableInfo["page"]}
                                                totalRows={this.state.tableInfo["totalRows"]}
                                                search={this.state.tableInfo["search"]}
                                            />
                                        }
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default ControlPoliticoIndex;