import React, { Component } from "react";
import TableReactExtends from "../../../Components/TableReactExtends";
import CircunscripcionDataService from "../../../Services/Catalogo/Circunscripcion.Service";
import Spinner from "../../../Components/Spinner";
import Select from "../../../Components/Select";
import ValidForm from "../../../Utils/ValidForm";
import Input from "../../../Components/Input";
import AuthLogin from "../../../Utils/AuthLogin";
import ValidarPermiso from "../../../Permisos/ValidarPermiso";
import { ModuloPermiso } from "../../../Permisos/ModuloPermiso";
import CircunscripcionService from "../../../Services/Catalogo/Circunscripcion.Service";

const auth = new AuthLogin();
const validForm = new ValidForm();
const fieldsConst = {
    id: 0,
    nombre: "",
    departamento_id: 0,
    activo: 1,
    user: auth.username(),
};
const errorsConst = {
    id: "",
    nombre: "",
    departamento_id: "",
    activo: "",
};
const defaultDepartamento = {value: -1, label: "Seleccione departamento"};
class Circunscripciones extends Component {
    constructor(props) {
        super(props);

        this.tableHandler = this.tableHandler.bind(this);

        this.state = {
            tableInfo: {
                columns: [
                    {
                        Header: "Circunscripciones",
                        columns: [
                            {
                                Header: "id",
                                accessor: "id",
                            },
                            {
                                Header: "Nombre",
                                accessor: "nombre",
                            },
                            {
                                Header: "Departamento",
                                accessor: "departamento.nombre",
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
                                    <ValidarPermiso
                                        IdModuloPermisoValidar={ModuloPermiso.Circunscripcion.Modificar}
                                        DefaultTemplate=
                                            {
                                                <button
                                                    data-toggle="modal"
                                                    data-target="#modal-accion"
                                                    className="btn btn-info"
                                                    style={{ width: "100%" }}
                                                    onClick={async () => {
                                                        this.resetFields();
                                                        await this.getByID(
                                                            tableProps.row.values.id
                                                        );
                                                    }}
                                                >
                                                    <i className="fa fa-edit"></i> Editar
                                                </button>
                                            }
                                    />

                                ),
                            },
                            {
                                Header: "Activar/Desactivar",
                                id: "actdesc",
                                accessor: (str) => "actdesc",
                                Cell: (tableProps) => (
                                    <ValidarPermiso
                                        IdModuloPermisoValidar={ModuloPermiso.Circunscripcion.Eliminar}
                                        DefaultTemplate=
                                            {
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
                                            }
                                    />

                                ),
                            },
                        ],
                    },
                ],
                hiddenColumns: ["id", "activo"],
                data: [],
                page: 1,
                rows: 5,
                search: "",
                totalRows: 0,
            },
            fields: Object.assign({}, fieldsConst),
            errors: Object.assign({}, errorsConst),
            loading: true,
            filterActive: { value: 1, label: "Activo" },
            filterDepartamento: defaultDepartamento,
            departamentoSelected: defaultDepartamento,
            dataSelectActive: [
                { value: -1, label: "Filtrar por activo" },
                { value: 1, label: "Activo" },
                { value: 0, label: "Inactivo" },
            ],
            dataSelectDepartamento: []
        };
    }
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
                    this.state.filterDepartamento.value,
                    page,
                    rows,
                    search
                );
            }.bind(this),
            1000
        );
    }

    async componentDidMount() {
        await this.getAll(
            this.state.filterActive.value,
            this.state.filterDepartamento.value,
            this.state.tableInfo.page,
            this.state.tableInfo.rows,
            this.state.tableInfo.search
        );

        await this.getComboDepartamento();
    }

    handlerDesactivar = (item) => {
        let desActObj = {
            id: item.id,
            nombre: item.nombre,
            activo: item.activo,
        };
        this.setState({
            fields: desActObj,
        });
    };

    getComboDepartamento = async () => {
        await CircunscripcionService.getComboDepartamento().then(response => {
            let combo = [];
            response.data.forEach(i => {
                combo.push({ value: i.id, label: i.nombre })
            })
            combo.unshift(defaultDepartamento)
            this.setState({
                dataSelectDepartamento: combo
            })
        })
    }

    saveSubmit = async (e) => {
        e.preventDefault();
        let errors = this.state.errors;
        errors = validForm.cleanErrors(errors);
        this.setState({ errors: errors, loading: true });

        let responseData;
        let data = this.state.fields;

        if (this.state.fields["id"] === 0) {
            await CircunscripcionDataService.create(data)
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
            await CircunscripcionDataService.update(
                this.state.fields["id"],
                data
            )
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
            await this.getAll(
                this.state.filterActive.value,
                this.state.filterDepartamento.value,
                this.state.tableInfo.page,
                this.state.tableInfo.rows,
                this.state.tableInfo.search
            );
            this.refs.closemodalSave.click();
            this.resetFields();
        }
    };

    deleteSubmit = async (e) => {
        e.preventDefault();
        let errors = this.state.errors;
        errors = validForm.cleanErrors(errors);
        this.setState({ errors: errors, loading: true });

        let responseData;
        await CircunscripcionDataService.delete(this.state.fields["id"])
            .then((response) => {
                responseData = response.data;
            })
            .catch(function (error) {
                errors = validForm.displayErrors(
                    error.response.data.errors,
                    errors
                );
            });

        this.setState({ errors: errors, loading: false });
        if (responseData != null) {
            await this.getAll(
                this.state.filterActive.value,
                this.state.filterDepartamento.value,
                this.state.tableInfo.page,
                this.state.tableInfo.rows,
                this.state.tableInfo.search
            );
            document.querySelector(`#modal-activar-desactivar button[data-dismiss="modal"]`).click();
        }
    };

    getAll = async (idFilterActive, idDepartamento, page, rows, search) => {
        this.setState({ loading: true });
        let tableInfo = this.state.tableInfo;
        await CircunscripcionDataService.getAll(
            idFilterActive,
            idDepartamento,
            search,
            page,
            rows
        )
            .then((response) => {
                tableInfo["data"] = response.data;
            })
            .catch((e) => {
                console.log(e);
            });

        await CircunscripcionDataService.getTotalRecords(idFilterActive, idDepartamento, search)
            .then((response) => {
                tableInfo["totalRows"] = response.data;
            })
            .catch((e) => {
                console.log(e);
            });

        this.setState({
            tableInfo: tableInfo,
            loading: false,
        });
    };

    getByID = async (id) => {
        this.setState({ loading: true });
        await CircunscripcionDataService.get(id)
            .then((response) => {
                let fields = response.data;
                Object.assign(fields, { user: auth.username() });
                let departamentoSelected = this.state.dataSelectDepartamento.filter((x)=>{return x.value === fields.departamento_id})[0];
                this.setState({
                    fields: fields,
                    loading: false,
                    departamentoSelected
                });
            })
            .catch((e) => {
                this.setState({
                    loading: false,
                });
                console.log(e);
            });
    };

    resetFields() {
        let fields = Object.assign({}, fieldsConst);
        this.setState({
            fields: fields,
            errors: validForm.cleanErrors(this.state.errors),
        });
    }

    handleFilterActive = async (selectActive) => {
        this.setState({ filterActive: selectActive });
        await this.getAll(
            selectActive.value,
            this.state.filterActive.value,
            this.state.tableInfo.page,
            this.state.tableInfo.rows,
            this.state.tableInfo.search
        );
    };

    handleFilterDepartamento = async (selectDepartamento) => {
        this.setState({ filterDepartamento: selectDepartamento });
        await this.getAll(
            this.state.filterActive.value,
            selectDepartamento.value,
            this.state.tableInfo.page,
            this.state.tableInfo.rows,
            this.state.tableInfo.search
        );
    };

    handlerDepartamentoModal = async (selectDepartamento) => {
        let fields = this.state.fields;
        fields.departamento_id = selectDepartamento.value;
        this.setState({ departamentoSelected: selectDepartamento, fields });
    };

    render() {
        return (
            <div>
                <Spinner show={this.state.loading} />

                <ul className="breadcrumb push-down-0">
                    <li>Catálogos</li>
                    <li>Circunscripciones</li>
                </ul>
                <div className="content-frame">
                    <div className="content-frame-top">
                        <div className="rowListado">
                            <div className="panel panel-default ">
                                <div className="panel-heading">
                                    <h3 className="panel-title">
                                        <span className="fa fa-list"></span>{" "}
                                        Listado de circunscripciones
                                    </h3>
                                    <ul className="panel-controls">
                                        <li>
                                            <div style={{ minWidth: "150px" }}>
                                                <Select
                                                    divClass=""
                                                    selectplaceholder="Seleccione"
                                                    selectValue={this.state.filterDepartamento}
                                                    selectOnchange={this.handleFilterDepartamento}
                                                    selectoptions={this.state.dataSelectDepartamento}
                                                    selectIsSearchable={false}
                                                    selectclassNamePrefix="selectReact__value-container"
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
                                            <ValidarPermiso
                                                IdModuloPermisoValidar={ModuloPermiso.Circunscripcion.Nuevo}
                                                DefaultTemplate=
                                                    {
                                                        <button
                                                            style={{ minHeight: "37px" }}
                                                            data-toggle="modal"
                                                            data-target="#modal-accion"
                                                            className="btn btn-primary"
                                                            onClick={() => {
                                                                this.resetFields();
                                                            }}
                                                        >
                                                            <i className="fa fa-plus"></i> Nuevo registro
                                                        </button>
                                                    }
                                            />

                                        </li>
                                    </ul>
                                </div>
                                <div className="panel-body">
                                    <div>
                                        <ValidarPermiso
                                            IdModuloPermisoValidar={ModuloPermiso.Circunscripcion.ObtenerTodos}
                                            DefaultTemplate=
                                                {
                                                    <TableReactExtends
                                                        columns={
                                                            this.state.tableInfo["columns"]
                                                        }
                                                        data={this.state.tableInfo["data"]}
                                                        hiddenColumns={
                                                            this.state.tableInfo[
                                                                "hiddenColumns"
                                                                ]
                                                        }
                                                        handler={this.tableHandler}
                                                        pageExtends={
                                                            this.state.tableInfo["page"]
                                                        }
                                                        totalRows={
                                                            this.state.tableInfo[
                                                                "totalRows"
                                                                ]
                                                        }
                                                        search={
                                                            this.state.tableInfo["search"]
                                                        }
                                                    />
                                                }
                                        />

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div
                    className="modal"
                    id="modal-accion"
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
                                    onClick={async () => {
                                        this.resetFields();
                                    }}
                                >
                                    <span aria-hidden="true">&times;</span>
                                    <span className="sr-only">Cerrar</span>
                                </button>
                                <h4 className="modal-title" id="largeModalHead">
                                    <i className="fa fa-list"></i>{" "}
                                    {this.state.fields["id"] === 0
                                        ? "Nueva"
                                        : "Editar"}{" "}
                                        circunscripción{" "}
                                </h4>
                            </div>

                            <div className="modal-body">
                                <form
                                    name="formAccion"
                                    className="form-horizontal"
                                    onSubmit={async (e) => {
                                        await this.saveSubmit(e);
                                    }}
                                >
                                    <Input
                                        divClass="col-md-12"
                                        inputName="id"
                                        inputType="hidden"
                                        inputValue={this.state.fields["id"]}
                                    />
                                    <div className="row">
                                        <div className="col-md-12">
                                            <div className="form-group">
                                                <div className="col-md-12">
                                                    <label htmlFor="">Nombre</label>
                                                    <Input
                                                        divClass="input-group"
                                                        inputName="nombre"
                                                        inputType="text"
                                                        inputClass="form-control"
                                                        inputplaceholder="Ingrese el nombre de la circunscripción"
                                                        inputValue={this.state.fields["nombre"] || ""}
                                                        inputOnchange={(e) => {
                                                            let fields = this.state.fields;
                                                            let errors = this.state.errors;
                                                            fields = validForm.handleChangeField("nombre",fields,e);
                                                            errors = validForm.handleChangeErrors("nombre",errors,e);
                                                            this.setState({
                                                                fields: fields,
                                                                errors: errors,
                                                            });
                                                        }}
                                                        spanClass="error"
                                                        spanError={
                                                            this.state.errors[
                                                                "nombre"
                                                            ] || ""
                                                        }
                                                        divClassSpanType={1}
                                                        divClassSpan="input-group-addon"
                                                        divClassSpanI="fa fa-indent"
                                                    />
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <div className="col-md-12">
                                                    <label htmlFor="">Departamento</label>
                                                    <Select
                                                        divClass=""
                                                        selectplaceholder="Seleccione"
                                                        selectValue={this.state.departamentoSelected}
                                                        selectOnchange={this.handlerDepartamentoModal}
                                                        selectoptions={this.state.dataSelectDepartamento}
                                                        selectIsSearchable={false}
                                                        selectclassNamePrefix="selectReact__value-container"
                                                        spanClass=""
                                                        spanError=""
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-md-12 push-up-30">
                                            <button
                                                type="button"
                                                className="btn btn-default"
                                                data-dismiss="modal"
                                                ref="closemodalSave"
                                                onClick={() => {
                                                    this.resetFields();
                                                }}
                                            >
                                                Cerrar
                                            </button>
                                            <ValidarPermiso
                                                IdModuloPermisoValidar={
                                                    this.state.fields["id"] === 0 ?
                                                        ModuloPermiso.Circunscripcion.Nuevo
                                                        : ModuloPermiso.Circunscripcion.Modificar
                                                }
                                                DefaultTemplate=
                                                    {
                                                        <button className="btn btn-success pull-right">
                                                            Guardar
                                                        </button>
                                                    }
                                            />
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={`message-box message-box-${this.state.fields.activo ? "danger" : "info"} animated fadeIn`} id="modal-activar-desactivar">
                    <form>
                        <div className="mb-container">
                            <div className="mb-middle">
                                <div className="mb-title"><span className={`fa fa-${this.state.fields.activo ? "eraser" : "check"}`}></span> {this.state.fields.activo ? "Desactivar" : "Activar"} circunscripción</div>
                                <div className="mb-content">
                                    <p>{`¿Está seguro que desea ${this.state.fields.activo ? "desactivar" : "activar"} la circunscripción ${this.state.fields.nombre}? Puede volver a ${this.state.fields.activo ? "activarlo" : "desactivarlo"} en cualquier otro momento.`}</p>
                                </div>
                                <div className="mb-footer">
                                    <ValidarPermiso
                                        IdModuloPermisoValidar={ModuloPermiso.Circunscripcion.Eliminar}
                                        DefaultTemplate=
                                            {
                                                <button type="button" className="btn btn-primary btn-lg pull-right" onClick={async (e) => { await this.deleteSubmit(e) }} >{this.state.fields.activo ? "Desactivar" : "Activar"}</button>
                                            }
                                    />
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

export default Circunscripciones;
