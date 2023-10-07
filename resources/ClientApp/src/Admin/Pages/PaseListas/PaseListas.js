import React, { Component } from "react";
import TableReactExtends from "../../../Components/TableReactExtends";
import PaseListaDataService from "../../../Services/Catalogo/PaseLista.Service";
import UtilsDataService from "../../../Services/General/Utils.Service";
import Spinner from "../../../Components/Spinner";
import Select from "../../../Components/Select";
import ValidForm from "../../../Utils/ValidForm";
import Input from "../../../Components/Input";
import AuthLogin from "../../../Utils/AuthLogin";

const auth = new AuthLogin();
const validForm = new ValidForm();
const fieldsConst = {
    id: 0,
    nombre: "",
    activo: 1,
    comision_tipo_congresista_id: 0,
    user: auth.username(),
};
const errorsConst = {
    id: "",
    nombre: "",
    comision_tipo_congresista_id: "",
    activo: "",
};
const SelectTipo = {
    value: 0,
    label: "Seleccione un tipo",
};

class PaseListas extends Component {
    constructor(props) {
        super(props);

        this.tableHandler = this.tableHandler.bind(this);

        this.state = {
            tableInfo: {
                columns: [
                    {
                        Header: "Pase de lista",
                        columns: [
                            {
                                Header: "id",
                                accessor: "id",
                            },
                            {
                                Header: "Fecha",
                                id: "fecha",
                                accessor: "fecha",
                                Cell: (tableProps) => {
                                    const date = new Date(
                                        tableProps.row.values.fecha
                                    );
                                    var options = {
                                        year: "numeric",
                                        month: "2-digit",
                                        day: "2-digit",
                                    };
                                    return date.toLocaleDateString(
                                        "fr-CA",
                                        options
                                    );
                                },
                            },
                            {
                                Header: "Legislatura",
                                accessor: "legislatura.nombre",
                            },
                            {
                                Header: "Quinquenio",
                                accessor: "cuatrienio.nombre",
                            },
                            {
                                Header: "Tipo pase de lista",
                                accessor: "tipo_pase_lista.nombre",
                            },
                            {
                                Header: "Corporación",
                                accessor: "corporacion.nombre",
                            },
                            {
                                Header: "Tipo de comisión",
                                accessor: "tipo_comision.nombre",
                            },
                            {
                                Header: "Comisión",
                                accessor: "comision.nombre",
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
                                    <a
                                        href={`#/crear-pase-lista/${tableProps.row.values.id}`}
                                        data-id={tableProps.row.values.id}
                                        className="btn btn-info btn-block"
                                    >
                                        <i className="fa fa-edit"></i> Editar
                                    </a>
                                ),
                            },
                            {
                                Header: "Activar/Desactivar",
                                id: "actdesc",
                                accessor: (str) => "actdesc",
                                Cell: (tableProps) => (
                                    <button
                                        data-toggle="modal"
                                        data-target="#modal-activar-desactivar"
                                        className={`btn ${
                                            tableProps.row.values.activo === 1
                                                ? "btn-danger"
                                                : "btn-warning"
                                        } eliminar`}
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
            dataSelectActive: [
                { value: -1, label: "Filtrar por activo" },
                { value: 1, label: "Activo" },
                { value: 0, label: "Inactivo" },
            ],
            selectTipo: SelectTipo,
            dataSelectTipo: [SelectTipo],
            filterTipo: SelectTipo,
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
            this.state.tableInfo["page"],
            this.state.tableInfo["rows"],
            this.state.tableInfo["search"]
        );
    }

    handlerDesactivar = (item) => {
        const date = new Date(item.fecha);
        var options = {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        };

        let desActObj = {
            id: item.id,
            fecha: date.toLocaleDateString("fr-CA", options),
            activo: item.activo,
        };
        this.setState({
            fields: desActObj,
        });
    };

    saveSubmit = async (e) => {
        e.preventDefault();
        let errors = this.state.errors;
        errors = validForm.cleanErrors(errors);
        this.setState({ errors: errors, loading: true });

        let responseData;
        let data = this.state.fields;

        if (this.state.fields["id"] === 0) {
            await PaseListaDataService.create(data)
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
            await PaseListaDataService.update(this.state.fields["id"], data)
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
            await this.getAll(
                this.state.filterActive.value,
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
        await PaseListaDataService.delete(this.state.fields["id"])
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
                this.state.tableInfo.page,
                this.state.tableInfo.rows,
                this.state.tableInfo.search
            );
            document
                .querySelector(
                    `#modal-activar-desactivar button[data-dismiss="modal"]`
                )
                .click();
        }
    };

    getAll = async (idFilterActive, page, rows, search) => {
        this.setState({ loading: true });
        let tableInfo = this.state.tableInfo;
        await PaseListaDataService.getAll(idFilterActive, search, page, rows)
            .then((response) => {
                tableInfo["data"] = response.data;
            })
            .catch((e) => {
                console.log(e);
            });

        await PaseListaDataService.getTotalRecords(idFilterActive, search)
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
        await PaseListaDataService.get(id)
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
                            this.state.fields.comision_tipo_congresista_id,
                            "dataSelectTipo",
                            "filterTipo"
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
            filterTipo: SelectTipo,
            dataSelectTipo: [SelectTipo],
        });
    };

    getComboTipo = async () => {
        this.setState({ loading: true });

        await UtilsDataService.getComboComisionTipoCongresista().then(
            (response) => {
                response.data.forEach(function (currentValue, index, array) {
                    this.state.dataSelectTipo.push({
                        value: currentValue.id,
                        label: currentValue.nombre,
                    });
                }, this);
                this.setState({ loading: false });
            }
        );
    };

    handleFilterActive = async (selectActive) => {
        this.setState({ filterActive: selectActive });
        await this.getAll(
            selectActive.value,
            this.state.tableInfo.page,
            this.state.tableInfo.rows,
            this.state.tableInfo.search
        );
    };

    handleTipo = async (selectOption) => {
        this.setState((prevState) => ({
            ...prevState,
            filterTipo: selectOption,
            fields: {
                ...prevState.fields,
                comision_tipo_congresista_id: selectOption.value,
            },
        }));
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

    render() {
        return (
            <div>
                <Spinner show={this.state.loading} />

                <ul className="breadcrumb push-down-0">
                    <li>Catálogos</li>
                    <li>Cargos</li>
                </ul>
                <div className="content-frame">
                    <div className="content-frame-top">
                        <div className="rowListado">
                            <div className="panel panel-default ">
                                <div className="panel-heading">
                                    <h3 className="panel-title">
                                        <span className="fa fa-list"></span>{" "}
                                        Listado de cargos
                                    </h3>
                                    <ul className="panel-controls">
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
                                            <a
                                                href="#/crear-pase-lista"
                                                style={{ minHeight: "37px" }}
                                                className="btn btn-primary"
                                            >
                                                <i className="fa fa-plus"></i>{" "}
                                                Nuevo registro
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                                <div className="panel-body">
                                    <div>
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
                                        ? "Nuevo"
                                        : "Editar"}{" "}
                                    cargo{" "}
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
                                        <div className="form-group">
                                            <div className="col-md-12">
                                                <div className="col-md-6">
                                                    <label htmlFor="">
                                                        Nombre
                                                    </label>
                                                    <Input
                                                        divClass="input-group"
                                                        inputName="nombre"
                                                        inputType="text"
                                                        inputClass="form-control"
                                                        inputplaceholder="Ingrese el nombre del cargo"
                                                        inputValue={
                                                            this.state.fields[
                                                                "nombre"
                                                            ] || ""
                                                        }
                                                        inputOnchange={(e) => {
                                                            let fields = this
                                                                .state.fields;
                                                            let errors = this
                                                                .state.errors;
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
                                                <div className="col-md-6">
                                                    <label htmlFor="">
                                                        Tipo
                                                    </label>
                                                    <Select
                                                        divClass=""
                                                        selectplaceholder="Seleccione un tipo"
                                                        selectValue={
                                                            this.state
                                                                .filterTipo
                                                        }
                                                        selectOnchange={
                                                            this.handleTipo
                                                        }
                                                        selectoptions={
                                                            this.state
                                                                .dataSelectTipo
                                                        }
                                                        selectIsSearchable={
                                                            false
                                                        }
                                                        selectclassNamePrefix="selectReact__value-container"
                                                        spanClass="error"
                                                        spanError={
                                                            this.state.errors[
                                                                "comision_tipo_congresista_id"
                                                            ] || ""
                                                        }
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
                                                onClick={async () => {
                                                    this.resetFields();
                                                }}
                                            >
                                                Cerrar
                                            </button>
                                            <button className="btn btn-success pull-right">
                                                Guardar
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>

                <div
                    className={`message-box message-box-${
                        this.state.fields.activo ? "danger" : "info"
                    } animated fadeIn`}
                    id="modal-activar-desactivar"
                >
                    <form>
                        <div className="mb-container">
                            <div className="mb-middle">
                                <div className="mb-title">
                                    <span
                                        className={`fa fa-${
                                            this.state.fields.activo
                                                ? "eraser"
                                                : "check"
                                        }`}
                                    ></span>{" "}
                                    {this.state.fields.activo
                                        ? "Desactivar"
                                        : "Activar"}{" "}
                                    pase de lista
                                </div>
                                <div className="mb-content">
                                    <p>{`¿Está seguro que desea ${
                                        this.state.fields.activo
                                            ? "desactivar"
                                            : "activar"
                                    } el pase de lista ${
                                        this.state.fields.fecha
                                    }? Puede volver a ${
                                        this.state.fields.activo
                                            ? "activarlo"
                                            : "desactivarlo"
                                    } en cualquier otro momento.`}</p>
                                </div>
                                <div className="mb-footer">
                                    <button
                                        type="button"
                                        className="btn btn-primary btn-lg pull-right"
                                        onClick={async (e) => {
                                            await this.deleteSubmit(e);
                                        }}
                                    >
                                        {this.state.fields.activo
                                            ? "Desactivar"
                                            : "Activar"}
                                    </button>
                                    &nbsp;
                                    <button
                                        className="btn btn-default btn-lg pull-right"
                                        type="button"
                                        data-dismiss="modal"
                                    >
                                        Cancelar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

export default PaseListas;
