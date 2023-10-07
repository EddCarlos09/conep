import React, { Component } from 'react';
import TableReactExtends from "../../../Components/TableReactExtends";
import EleccionDataService from "../../../Services/Eleccion/Eleccion.Service";
import UtilsDataService from "../../../Services/General/Utils.Service";
import Spinner from '../../../Components/Spinner';
import Select from '../../../Components/Select';
import ValidForm from "../../../Utils/ValidForm";
import { ModuloPermiso } from "../../../Permisos/ModuloPermiso";
import ValidarPermiso from "../../../Permisos/ValidarPermiso";
import AuthLogin from "../../../Utils/AuthLogin";
const auth = new AuthLogin();

const validForm = new ValidForm();
const fieldsConst = { id: 0, nombre: '', corporacion_id: 0, tipo_comision_id: 0, descripcion: '', activo: false };
const errorsConst = { id: '', nombre: '', corporacion_id: '', descripcion: '', activo: '' };
const SelectCorporacion = {value: 0, label: 'Filtrar por corporacion'};
const SelectTipoComision = {value: 0, label: 'Filtrar por tipo comision'};
const SelectComision = {value: 0, label: 'Filtrar por comision'};
const SelectCuatrienio = {value: 0, label: 'Filtrar por quinquenio'};

class Elecciones extends Component {
    constructor(props) {
        super(props);

        this.tableHandler = this.tableHandler.bind(this);

        this.state = {
            tableInfo: {
                columns: [
                    {
                        Header: "Elecciones",
                        columns: [
                            {
                                Header: "id",
                                accessor: "id"
                            },
                            {
                                Header: "Titulo",
                                accessor: "titulo"
                            },
                            {
                                Header: "Quinquenio",
                                accessor: "cuatrienio.nombre"
                            },
                            {
                                Header: "Fecha de elección",
                                accessor: "fechaDeEleccion"
                            },
                            {
                                Header: "Funcionario actual",
                                accessor: d=> `${d.funcionario_actual.congresista_elecciones.persona_elecciones.nombres} ${d.funcionario_actual.congresista_elecciones.persona_elecciones.apellidos}`
                            },
                            {
                                Header: "Activo",
                                accessor: "activo"
                            }
                        ]
                    },
                    {
                        Header: "Acciones",
                        columns: [
                            auth.tieneModuloPermiso(ModuloPermiso.Elecciones.Obtener) ?
                            {
                                Header: 'Editar',
                                id: 'editar',
                                accessor: (str) => 'editar',
                                Cell: (tableProps) => (
                                    <ValidarPermiso
                                            IdModuloPermisoValidar={ModuloPermiso.Elecciones.Obtener}
                                            DefaultTemplate={
                                                <a  href={`#/elecciones-editar/${tableProps.row.values.id}`} data-id={tableProps.row.values.id}
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
                            auth.tieneModuloPermiso(ModuloPermiso.Elecciones.Eliminar) ?
                            {
                                Header: 'Activar/Desactivar',
                                id: 'actdesc',
                                accessor: (str) => 'actdesc',
                                Cell: (tableProps) => (
                                    <ValidarPermiso
                                            IdModuloPermisoValidar={ModuloPermiso.Elecciones.Obtener}
                                            DefaultTemplate={
                                            <button
                                                data-toggle="modal"
                                                data-target="#message-box-danger"
                                                className={`btn ${tableProps.row.values.activo === 1
                                                    ? "btn-danger"
                                                    : "btn-warning"} eliminar`}
                                                style={{ width: '100%' }}
                                                data-id={tableProps.row.values.id}
                                                onClick={() => { this.handlerDesactivar(tableProps.row.values) }}>
                                                <i className="fa fa-eraser"></i> {tableProps.row.values.activo === 1 ? "Desactivar" : "Activar"}
                                            </button>
                                            }
                                            />
                                )
                                }: {
                                    Header: "Activar/Desactivar",
                                    id: "actdesc",
                                    accessor: (str) => "-",
                                },
                        ]
                    }
                ],
                hiddenColumns: ["id","activo"],
                data: [],
                page: 1,
                rows: 5,
                search: "",
                totalRows: 0
            },
            fields: fieldsConst,
            errors: errorsConst,
            loading: true,
            filterActive: { value: 1, label: "Activo" },
            dataSelectActive: [{ value: -1, label: "Filtrar por activo" }, { value: 1, label: "Activo" }, { value: 0, label: "Inactivo" }],
            filterCorporacion: SelectCorporacion,
            dataSelectCorporacion: [],
            filterTipoComision: SelectTipoComision,
            dataSelectTipoComision: [],
            filterComision: SelectComision,
            dataSelectComision: [],
            filterCuatrienio: SelectCuatrienio,
            dataSelectCuatrienio: []
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
            await this.getAll(this.state.filterActive.value, this.state.filterCorporacion.value,
                this.state.filterTipoComision.value, this.state.filterComision.value,
                this.state.filterCuatrienio.value, search, page, rows);
        }.bind(this), delayAccion);
    }
    componentDidMount() {
        this.getAll(this.state.filterActive.value, this.state.filterCorporacion.value,
             this.state.filterTipoComision.value, this.state.filterComision.value,
             this.state.filterCuatrienio.value, this.state.tableInfo["search"],
             this.state.tableInfo["page"], this.state.tableInfo["rows"]);
        this.getComboCorporacion();
        this.getComboTipoComision(this.state.filterCorporacion.value);
        this.getComboComision(this.state.filterTipoComision.value);
        this.getComboCuatrienio();
    }

    handlerDesactivar = (eleccion) => {
        let desActObj = { id: eleccion.id, titulo: eleccion.titulo, activo: eleccion.activo}
        this.setState({
            fields: desActObj
        })
    }

    deleteSubmit = async (e) => {
        e.preventDefault();
        let errors = this.state.errors;
        errors = validForm.cleanErrors(errors);
        this.setState({ errors: errors, loading: true });

        let responseData;
        await EleccionDataService.delete(this.state.fields["id"])
            .then(response => {
                responseData = response.data;
            })
            .catch(function (error) {
                errors = validForm.displayErrors(error.response.data.errors, errors);
            });

        this.setState({ errors: errors, loading: false });
        if (responseData != null) {
            await this.getAll(this.state.filterActive.value, this.state.filterCorporacion.value,
                this.state.filterTipoComision.value, this.state.filterComision.value, 
                this.state.filterCuatrienio.value, this.state.tableInfo["search"], 
                this.state.tableInfo["page"], this.state.tableInfo["rows"]);
                document.querySelector(`#message-box-danger button[data-dismiss="modal"]`).click();
        }
    }

    getComboCorporacion = async () => {
        await UtilsDataService.getComboCorporacion()
        .then(response => {
                let combo = [];
                response.data.forEach(i => {
                    combo.push({ value: i.id, label: i.nombre })
                })
                combo.unshift({ value: 0, label: "Filtrar por corporación" })
                this.setState({
                    dataSelectCorporacion: combo
                })
            });
    }

    getComboTipoComision = async (idCorporacion) => {
        await UtilsDataService.getComboTipoComision(idCorporacion)
        .then(response => {
                let combo = [];
                response.data.forEach(i => {
                    combo.push({ value: i.id, label: i.nombre })
                })
                combo.unshift({ value: 0, label: "Filtrar por tipo de comisión" })
                this.setState({
                    dataSelectTipoComision: combo
                })
            });
    }

    getComboComision = async (idTipoComision) => {
        await UtilsDataService.getComboComisiones(idTipoComision)
        .then(response => {
                let combo = [];
                response.data.forEach(i => {
                    combo.push({ value: i.id, label: i.nombre })
                })
                combo.unshift({ value: 0, label: "Filtrar por comisión" })
                this.setState({
                    dataSelectComision: combo
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
                combo.unshift({ value: 0, label: "Filtrar por quinquenio" })
                this.setState({
                    dataSelectCuatrienio: combo
                })
            });
    }

    getAll = async (idFilterActive, idCorporacion, idTipoComision, idComision, idCuatrienio, search, page, rows) => {
        this.setState({ loading: true });
        let tableInfo = this.state.tableInfo;
        await EleccionDataService.getAll(idFilterActive, idCorporacion, idTipoComision, idComision,
           idCuatrienio, search, page, rows)
            .then(response => {
                tableInfo["data"] = response.data;
            })
            .catch(e => {
                console.log(e);
            });

        await EleccionDataService.getTotalRecordsEleccion(idFilterActive, idCorporacion, idTipoComision,
            idComision, idCuatrienio, search)
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
        await this.getAll(
            selectActive.value, this.state.filterCorporacion.value, this.state.filterTipoComision.value,
            this.state.filterComision.value, this.state.filterCuatrienio.value,
            this.state.tableInfo.search, this.state.tableInfo.page, this.state.tableInfo.rows);
    }

    handleFilterCorporacion = async (selectCorporacion) => {
        this.setState({ filterCorporacion: selectCorporacion });
        await this.getAll(
            this.state.filterActive.value, selectCorporacion.value, this.state.filterTipoComision.value,  
            this.state.filterComision.value, this.state.filterCuatrienio.value,
            this.state.tableInfo.search, this.state.tableInfo.page, this.state.tableInfo.rows);
    }

    handleFilterTipoComision = async (selectTipoComision) => {
        this.setState({ filterTipoComision: selectTipoComision });
        await this.getAll(
            this.state.filterActive.value, this.state.filterCorporacion.value, selectTipoComision.value,  
            this.state.filterComision.value, this.state.filterCuatrienio.value,
            this.state.tableInfo.search, this.state.tableInfo.page, this.state.tableInfo.rows);
    }

    handleFilterComision = async (selectComision) => {
        this.setState({ filterComision: selectComision });
        await this.getAll(
            this.state.filterActive.value, this.state.filterCorporacion.value, this.state.filterTipoComision.value,  
            selectComision.value, this.state.filterCuatrienio.value,
            this.state.tableInfo.search, this.state.tableInfo.page, this.state.tableInfo.rows);
    }

    handleFilterCuatrienio = async (selectCuatrienio) => {
        this.setState({ filterCuatrienio: selectCuatrienio });
        await this.getAll(
            this.state.filterActive.value, this.state.filterCorporacion.value, this.state.filterTipoComision.value,  
            this.state.filterComision.value, selectCuatrienio.value, this.state.tableInfo.search, this.state.tableInfo.page, this.state.tableInfo.rows);
    }

    render() {
        return (
            <div>
                <Spinner show={this.state.loading} />
                <div className={`message-box message-box-${this.state.fields.activo ? "danger" : "info"} animated fadeIn`} id="message-box-danger">
                        <form action="">
                            <div className="mb-container">
                                <div className="mb-middle">
                                    <div className="mb-title"><span className={`fa fa-${this.state.fields.activo ? "eraser" : "check"}`}></span> {this.state.fields.activo ? "Desactivar" : "Activar"} elección</div>
                                    <div className="mb-content">
                                        <p>{`¿Está seguro que desea ${this.state.fields.activo ? "desactivar" : "activar"} la elección ${this.state.fields.titulo}? Puede volver a ${this.state.fields.activo ? "activarla" : "desactivarla"} en cualquier otro momento.`}</p>
                                    </div>
                                    <div className="mb-footer">
                                    <ValidarPermiso
                                            IdModuloPermisoValidar={ModuloPermiso.Elecciones.Eliminar}
                                            DefaultTemplate=
                                                {
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
                    <li><a href="/">Elecciones</a></li>
                </ul>
                <div className="content-frame">
                    <div className="content-frame-top">
                        <div className="rowListado">
                            <div className="panel panel-default ">
                                <div className="panel-heading">
                                    <h3 className="panel-title"><span className="fa fa-list"></span> Listado de elecciones</h3>
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
                                            <div style={{ minWidth: "200px" }}>
                                                <Select
                                                    divClass=""
                                                    selectplaceholder="Seleccione"
                                                    selectValue={this.state.filterTipoComision}
                                                    selectOnchange={this.handleFilterTipoComision}
                                                    selectoptions={this.state.dataSelectTipoComision}
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
                                                    selectValue={this.state.filterComision}
                                                    selectOnchange={this.handleFilterComision}
                                                    selectoptions={this.state.dataSelectComision}
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
                                        <ValidarPermiso
                                                IdModuloPermisoValidar={ModuloPermiso.Elecciones.Nuevo}
                                                DefaultTemplate={
                                                <a
                                                    href={"#/elecciones-crear"}
                                                    style={{ minHeight: "37px" }}
                                                    className="btn btn-primary"
                                                >
                                                    <i className="fa fa-plus"></i> Nuevo registro
                                                </a>
                                                }
                                                />
                                        </li>
                                    </ul>
                                </div>
                                <div className="panel-body">
                                    <div>
                                    <ValidarPermiso
                                            IdModuloPermisoValidar={ModuloPermiso.Elecciones.ObtenerTodos}
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
            </div>
        )
    }
}

export default Elecciones;
