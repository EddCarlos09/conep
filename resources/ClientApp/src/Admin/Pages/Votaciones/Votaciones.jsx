import React, { Component } from "react";
import TableReactExtends from "../../../Components/TableReactExtends";
import VotacionesDataService from "../../../Services/Catalogo/Votaciones.Service";
import Spinner from "../../../Components/Spinner";
import Select from "../../../Components/Select";
import AuthLogin from "../../../Utils/AuthLogin";
import { ModuloPermiso } from "../../../Permisos/ModuloPermiso";
import ValidarPermiso from "../../../Permisos/ValidarPermiso";
import UtilsDataService from "../../../Services/General/Utils.Service";
import ValidForm from "../../../Utils/ValidForm";

const validForm = new ValidForm();
const auth = new AuthLogin();
const SelectCorporacion = { value: '', label: 'Filtrar por corporación' };
const SelectCuatrienio = { value: '', label: 'Filtrar por cuatrienio' };
const SelectComision = { value: '', label: 'Filtrar por comisión' };

class Votaciones extends Component {
    constructor(props) {
        super(props);

        this.tableHandler = this.tableHandler.bind(this);

        this.state = {
            tableInfo: {
                columns: [
                    {
                        Header: "Votaciones",
                        columns: [
                            {
                                Header: "id",
                                accessor: "id",
                            },
                            {
                                Header: "voto_general",
                                accessor: "voto_general",
                            },
                            {
                                Header: "Proyecto de ley",
                                accessor: "proyecto_de_ley.titulo",
                                className: "tdMedium text-justify"
                            },
                            {
                                Header: "Fecha",
                                accessor: "fecha",
                            },
                            {
                                Header: "Legislatura",
                                accessor: "legislatura.nombre",
                            },
                            {
                                Header: "Cuatrienio",
                                accessor: "cuatrienio.nombre",
                            },
                            {
                                Header: "Gaceta",
                                id: "urlGaceta",
                                accessor: "urlGaceta",
                                Cell: (tableProps) => {
                                    return (
                                        typeof tableProps.row.values !== "undefined" && tableProps.row.values.urlGaceta !== "" && tableProps.row.values.urlGaceta !== null ?
                                        <a className="btn btn-primary" target="_blank" href={(auth.pathApi() + tableProps.row.values.urlGaceta)}>Ver gaceta</a>
                                        : <button type="button" className="btn btn-primary">Sin gaceta</button>
                                    );
                                },
                            },
                            {
                                Header: "¿Es plenaria?",
                                id: "esPlenaria",
                                accessor: "esPlenaria",
                                Cell: (tableProps) => {
                                    return (
                                        <input
                                            type="checkbox"
                                            className="checkbox"
                                            checked={
                                                tableProps.row.values.esPlenaria
                                            }
                                            readOnly
                                        />
                                    );
                                },
                            },
                            {
                                Header: "¿Es comisión?",
                                id: "esComision",
                                accessor: "esComision",
                                Cell: (tableProps) => {
                                    return (
                                        <input
                                            type="checkbox"
                                            className="checkbox"
                                            checked={
                                                tableProps.row.values.esComision
                                            }
                                            readOnly
                                        />
                                    );
                                },
                            },
                            {
                                Header: "Activo",
                                id: "activo",
                                accessor: "activo",
                                Cell: (tableProps) => {
                                    return (
                                        <input
                                            type="checkbox"
                                            className="checkbox"
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
                            auth.tieneModuloPermiso(ModuloPermiso.Votaciones.Obtener) ?
                            {
                                Header: "Votar",
                                id: "votar",
                                accessor: (str) => "votar",
                                Cell: (tableProps) => (
                                    <ValidarPermiso IdModuloPermisoValidar={ModuloPermiso.Votaciones.Obtener} DefaultTemplate={
                                        tableProps.row.values.voto_general === 1 ?
                                        <p className="btn btn-default disabled" style={{ width: "100%" }} >
                                            <i class="fas fa-vote-yea"></i> Votar
                                        </p>
                                        : 
                                        <a href={`#/votar/${tableProps.row.values.id}`} className="btn btn-info" style={{ width: "100%" }} >
                                            <i class="fas fa-vote-yea"></i> Votar
                                        </a>
                                    } />
                                ),
                            } : {
                                Header: "Votar",
                                id: "votar",
                                accessor: (str) => '-',
                            },
                            auth.tieneModuloPermiso(ModuloPermiso.Votaciones.Obtener) ?
                            {
                                Header: "Editar",
                                id: "editar",
                                accessor: (str) => "editar",
                                Cell: (tableProps) => (
                                    <ValidarPermiso IdModuloPermisoValidar={ModuloPermiso.Votaciones.Obtener} DefaultTemplate={
                                        <a href={`#/editar-votacion/${tableProps.row.values.id}`} className="btn btn-info" style={{ width: "100%" }} >
                                            <i className="fa fa-edit"></i> Editar
                                        </a>
                                    } />
                                ),
                            } : {
                                Header: "Editar",
                                id: "editar",
                                accessor: (str) => '-',
                            },
                            auth.tieneModuloPermiso(ModuloPermiso.Votaciones.Eliminar) ?
                            {
                                Header: "Activar/Desactivar",
                                id: "actdesc",
                                accessor: (str) => "actdesc",
                                Cell: (tableProps) => (
                                    <ValidarPermiso IdModuloPermisoValidar={ModuloPermiso.Votaciones.Eliminar} DefaultTemplate={
                                        <button
                                            data-toggle="modal"
                                            data-target="#modal-activar-desactivar"
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
                                    } />
                                ),
                            } : {
                                Header: "Activar/Desactivar",
                                id: "actdesc",
                                accessor: (str) => '-',
                            },
                        ],
                    },
                ],
                hiddenColumns: ["id", "activo", "voto_general"],
                data: [],
                page: 1,
                rows: 5,
                search: "",
                totalRows: 0,
            },
            loading: true,
            filterActive: { value: 1, label: "Activo" },
            dataSelectActive: [
                { value: '', label: "Filtrar por activo" },
                { value: 1, label: "Activo" },
                { value: 0, label: "Inactivo" },
            ],
            desactivarVotacion: { id: 0, fecha: "", enabled: true },
            filterCorporacion: SelectCorporacion,
            dataSelectCorporacion: [],
            filterCuatrienio: SelectCuatrienio,
            dataSelectCuatrienio: [],
            filterComision: SelectComision,
            dataSelectComision: [],
        };
    }

    // Handlers

    async tableHandler(page, rows, search) {
        let tableInfo = this.state.tableInfo;
        tableInfo.page = page;
        tableInfo.rows = rows;
        tableInfo.search = search;
        this.setState({ tableInfo: tableInfo });
        if (this.timeout) clearTimeout(this.timeout);
        this.timeout = setTimeout(
            async function () {
                await this.getAll(
                    this.state.filterActive.value,
                    '',
                    this.state.filterCuatrienio.value,
                    this.state.filterCorporacion.value,
                    this.state.filterComision.value,
                    page,
                    rows,
                    search
                );
            }.bind(this),
            1000
        );
    }

    handleFilterCorporacion = async (selectCorporacion) => {
        this.setState({ filterCorporacion: selectCorporacion, filterComision: SelectComision });
        await this.getAll(
            this.state.filterActive.value,
            '',
            this.state.filterCuatrienio.value,
            selectCorporacion.value,
            this.state.filterComision.value,
            this.state.tableInfo.search,
            this.state.tableInfo.page,
            this.state.tableInfo.rows,
        );

        await this.getComboComision(selectCorporacion.value);
    };

    handleFilterCuatrienio = async (selectCuatrienio) => {
        this.setState({ filterCuatrienio: selectCuatrienio });
        await this.getAll(
            this.state.filterActive.value,
            '',
            selectCuatrienio.value,
            this.state.filterCorporacion.value,
            this.state.filterComision.value,
            this.state.tableInfo.search,
            this.state.tableInfo.page,
            this.state.tableInfo.rows,
        );
    };

    handleFilterComision = async (selectComision) => {
        this.setState({ filterComision: selectComision });
        await this.getAll(
            this.state.filterActive.value,
            '',
            this.state.filterCuatrienio.value,
            this.state.filterCorporacion.value,
            selectComision.value,
            this.state.tableInfo.search,
            this.state.tableInfo.page,
            this.state.tableInfo.rows,
        );
    };

    handleFilterActive = async (selectActive) => {
        this.setState({ filterActive: selectActive });
        await this.getAll(
            selectActive.value,
            '',
            this.state.filterCuatrienio.value,
            this.state.filterCorporacion.value,
            this.state.tableInfo.search,
            this.state.tableInfo.page,
            this.state.tableInfo.rows,
        );
    };

    handlerDesactivar = (votacion) => {
        let desObj = { id: votacion.id, fecha: votacion.fecha, enabled: votacion.activo }
        this.setState({
            desactivarVotacion: desObj
        });
    }


    async componentDidMount() {
        await this.getAll(
            this.state.filterActive.value,
            '',
            this.state.filterCuatrienio.value,
            this.state.filterComision.value,
            this.state.tableInfo.search,
            this.state.tableInfo.page,
            this.state.tableInfo.rows
        )
        await this.getComboCorporacion();
        await this.getComboCuatrienio();
        await this.getComboComision();
    }

    // Methods
    getComboCorporacion = async () => {
        await UtilsDataService.getComboCorporacion()
            .then(response => {
                let combo = [];
                response.data.forEach(i => {
                    combo.push({ value: i.id, label: i.nombre })
                })
                combo.unshift({ value: '', label: "Filtrar por corporación" })
                this.setState({
                    dataSelectCorporacion: combo
                })
            });
    }

    getComboCuatrienio = async () => {
        await UtilsDataService.getComboCuatrienio()
            .then(response => {
                let combo = [];
                response.data.forEach(i => {
                    combo.push({ value: i.id, label: i.nombre })
                })
                combo.unshift({ value: '', label: "Filtrar por cuatrienio" })
                this.setState({
                    dataSelectCuatrienio: combo
                })
            });
    }

    getComboComision = async (corporacion_id) => {
        await UtilsDataService.getComboComisionesFilter({
            corporacion_id: corporacion_id
        })
            .then(response => {
                let combo = [];
                response.data.forEach(i => {
                    combo.push({ value: i.id, label: i.nombre })
                })
                combo.unshift({ value: '', label: "Filtrar por corporación" })
                this.setState({
                    dataSelectComision: combo
                })
            });
    }

    getAll = async (idFilterActive, legislatura, cuatrienio, corporacion, comision, search, page, rows) =>{
        this.setState({ loading: true });
        let tableInfo = this.state.tableInfo;

        await VotacionesDataService.getAll(
            idFilterActive,
            '',
            cuatrienio,
            corporacion,
            comision,
            search,
            page,
            rows
        )
            .then((response) => {
                tableInfo.data = response.data;
            })
            .catch((e) => {
                console.log(e);
            });

        await VotacionesDataService.getTotalRecords(idFilterActive, legislatura, cuatrienio, search)
            .then((response) => {
                tableInfo.totalRows = response.data;
            })
            .catch((e) => {
                console.log(e);
            });

        this.setState({
            tableInfo: tableInfo,
            loading: false,
        });
    }

    deleteSubmit = async (e) => {
        e.preventDefault();
        this.setState({ loading: true });

        let responseData;

        await VotacionesDataService.delete(this.state.desactivarVotacion.id)
            .then((response) => {
                responseData = response.data;
            })
            .catch(function (error) {

            });

        this.setState({ loading: false });
        if (responseData != null) {
            await this.getAll(
                this.state.filterActive.value,
                '',
                this.state.filterCuatrienio.value,
                this.state.filterComision.value,
                this.state.tableInfo.search,
                this.state.tableInfo.page,
                this.state.tableInfo.rows
            )
            document.querySelector(`#modal-activar-desactivar button[data-dismiss="modal"]`).click();
        }
    };

    render() {
        return (
            <div>
                <Spinner show={this.state.loading} />

                <ul className="breadcrumb push-down-0">
                    <li>Catálogos</li>
                    <li>Votaciones</li>
                </ul>
                <div className="content-frame">
                    <div className="content-frame-top">
                        <div className="rowListado">
                            <div className="panel panel-default ">
                                <div className="panel-heading">
                                    <h3 className="panel-title">
                                        <span className="fa fa-list"></span>{" "}
                                        Listado de votaciones
                                    </h3>
                                    <ul className="panel-controls">
                                        <li>
                                            <div style={{ minWidth: "200px" }}>
                                                <Select
                                                    divClass=""
                                                    selectplaceholder="Seleccione"
                                                    selectValue={this.state.filterCuatrienio}
                                                    selectOnchange={this.handleFilterCuatrienio}
                                                    selectoptions={this.state.dataSelectCuatrienio}
                                                    selectIsSearchable={false}
                                                    selectclassNamePrefix="selectReact__value-container"
                                                    noOptionsMessage="Seleccione cuatrienio"
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
                                                    noOptionsMessage="Seleccione corporación"
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
                                                    selectValue={this.state.filterComision}
                                                    selectOnchange={this.handleFilterComision}
                                                    selectoptions={this.state.dataSelectComision}
                                                    selectIsSearchable={false}
                                                    selectclassNamePrefix="selectReact__value-container"
                                                    noOptionsMessage="Seleccione comisión"
                                                    spanClass=""
                                                    spanError=""
                                                />
                                            </div>
                                        </li>
                                        <li>
                                            <div style={{ minWidth: "150px" }}>
                                                <Select
                                                    divClass=""
                                                    selectplaceholder="Seleccione"
                                                    selectValue={
                                                        this.state.filterActive
                                                    }
                                                    selectOnchange={
                                                        this.handleFilterActive
                                                    }
                                                    selectoptions={
                                                        this.state
                                                            .dataSelectActive
                                                    }
                                                    selectIsSearchable={false}
                                                    selectclassNamePrefix="selectReact__value-container"
                                                    spanClass=""
                                                    spanError=""
                                                />
                                            </div>
                                        </li>
                                        <li>
                                            <ValidarPermiso IdModuloPermisoValidar={ModuloPermiso.Votaciones.Nuevo} DefaultTemplate={
                                                <a href="#/crear-votacion" style={{ minHeight: "37px" }} className="btn btn-primary">
                                                    <i className="fa fa-plus"></i> Nuevo registro
                                                </a>
                                            } />
                                        </li>
                                    </ul>
                                </div>
                                <div className="panel-body">
                                    <div>
                                        <ValidarPermiso IdModuloPermisoValidar={ModuloPermiso.Votaciones.ObtenerTodos} DefaultTemplate={
                                            <TableReactExtends
                                                columns={this.state.tableInfo.columns}
                                                data={this.state.tableInfo.data}
                                                hiddenColumns={this.state.tableInfo.hiddenColumns}
                                                handler={this.tableHandler}
                                                pageExtends={this.state.tableInfo.page}
                                                totalRows={this.state.tableInfo.totalRows}
                                                search={this.state.tableInfo.search}
                                            />
                                        } />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={`message-box message-box-${this.state.desactivarVotacion.enabled ? "danger" : "info"} animated fadeIn`} id="modal-activar-desactivar">
                        <form action="">
                            <div className="mb-container">
                                <div className="mb-middle">
                                    <div className="mb-title"><span className={`fa fa-${this.state.desactivarVotacion.enabled ? "eraser" : "check"}`}></span> {this.state.desactivarVotacion.enabled ? "Desactivar" : "Activar"} votación</div>
                                    <div className="mb-content">
                                        <p>{`¿Está seguro que desea ${this.state.desactivarVotacion.enabled ? "desactivar" : "activar"} la votación con fecha ${this.state.desactivarVotacion.fecha}? Puede volver a ${this.state.desactivarVotacion.enabled ? "activarla" : "desactivarla"} en cualquier otro momento.`}</p>
                                    </div>
                                    <div className="mb-footer">
                                    <ValidarPermiso IdModuloPermisoValidar={ModuloPermiso.Votaciones.Eliminar} DefaultTemplate={
                                        <button
                                            type="button"
                                            className="btn btn-primary btn-lg pull-right"
                                            onClick={(e) => { this.deleteSubmit(e) }}
                                        >
                                            {this.state.desactivarVotacion.enabled ? "Desactivar" : "Activar"}
                                        </button>
                                    } />

                                    &nbsp;
                                    <button className="btn btn-default btn-lg pull-right" type="button" data-dismiss="modal">Cancelar</button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
            </div>
        );
    }
}

export default Votaciones;
