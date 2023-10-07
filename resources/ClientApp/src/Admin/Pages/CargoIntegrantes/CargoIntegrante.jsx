import React, { Component } from 'react'
import Spinner from "../../../Components/Spinner";
import AuthLogin from "../../../Utils/AuthLogin";
import TableReact from "../../../Components/TableReact";
import cargoIntegranteDataService from "../../../Services/Catalogo/CargoIntegrante.Service";
import Select from '../../../Components/Select';
import Input from "../../../Components/Input";
import ValidForm from "../../../Utils/ValidForm";
import ValidarPermiso from "../../../Permisos/ValidarPermiso";
import { ModuloPermiso } from "../../../Permisos/ModuloPermiso";

const auth = new AuthLogin();
const validForm = new ValidForm();
const errorsConst = {
    id: "",
    nombre: "",
    activo: ""
};
const fieldsConst = {
    id: 0,
    nombre: "",
    activo: 1,
    user: auth.username(),
};
class CargoIntegrante extends Component {
    constructor(props){
        super(props);
        this.state = {
            tableInfo: {
                columns: [
                    {
                        Header: "Cargos de Integrantes de Equipo",
                        columns: [
                            {
                                Header: "id",
                                accessor: "id"
                            },
                            {
                                Header: "Nombre",
                                accessor: "nombre",
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
                            {
                                Header: "Editar",
                                id: "editar",
                                accessor: (str) => "editar",
                                Cell: (tableProps) => (
                                    <ValidarPermiso
                                        IdModuloPermisoValidar={ModuloPermiso.CargoIntegrante.Obtener}
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
                                        IdModuloPermisoValidar={ModuloPermiso.CargoIntegrante.Eliminar}
                                        DefaultTemplate=
                                            {
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
                                ),
                            }
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
            errors: Object.assign({}, errorsConst),
            loading: true,
            fields:fieldsConst,
            filterActive: { value: 1, label: "Activo" },
            dataSelectActive: [{ value: -1, label: "Filtrar por activo" }, { value: 1, label: "Activo" }, { value: 0, label: "Inactivo" }],
        }
    };

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

    componentDidMount(){
        this.getAll(this.state.filterActive.value,this.state.tableInfo["page"],this.state.tableInfo["rows"],this.state.tableInfo["search"]);
    }
    handlerDesactivar = (item) => {
        let desActObj = {
            id: item.id,
            titulo: item.nombre,
            activo: item.activo,
        };
        this.setState({
            fields: desActObj,
        });
    };
    deleteSubmit = async (e) => {
        e.preventDefault();

        this.setState({ loading: true });

        let responseData;
        await cargoIntegranteDataService.delete(this.state.fields["id"])
            .then((response) => {
                responseData = response.data;
            })
            .catch((e) => {
                console.log(e);
            });

        this.setState({  loading: false });
        if (responseData != null) {
            await this.getAll(
                this.state.filterActive.value,
                this.state.tableInfo.page,
                this.state.tableInfo.rows,
                this.state.tableInfo.search
            );
            document.querySelector(`#message-box-danger button[data-dismiss="modal"]`).click();
        }
    };
    handleFilterActive = async (selectActive) => {
        this.setState({ filterActive: selectActive });
        await this.getAll(selectActive.value,  this.state.tableInfo.page, this.state.tableInfo.rows, this.state.tableInfo.search);
    }
    getAll = async (idFilterActive,page,rows,search)=>{
        this.setState({loading:true});
        let tableInfo = this.state.tableInfo;
        await cargoIntegranteDataService.getAll(idFilterActive,page,rows,search)
            .then(response =>{
                tableInfo["data"] = response.data;
            })
            .catch(e=>{
                console.log(e);
            });

        this.setState({
            tableInfo: tableInfo,
            loading: false
        });
    }
    getByID = async (id) => {
        this.setState({ loading: true });
        await cargoIntegranteDataService.get(id)
            .then((response) => {
                let fields = response.data[0];
                Object.assign(fields, { user: auth.username() });
                this.setState(
                    {
                        fields: fields,
                        loading: false,
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
    saveSubmit = async (e) => {
        e.preventDefault();
        let errors = this.state.errors;
        let data = this.state.fields;
        errors = validForm.cleanErrors(errors);
        this.setState({ errors: errors, loading: true });
        let responseData;

        if (data.id === 0) {
            await cargoIntegranteDataService.create(data)
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
            await cargoIntegranteDataService.update(data.id,data)
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
    resetFields() {
        let fields = Object.assign({}, fieldsConst);
        this.setState({
            fields: fields,
            errors: validForm.cleanErrors(this.state.errors),
        });
    }
    render() {
        return (
            <div>
                <Spinner show={this.state.loading} />
                <ul className="breadcrumb push-down-0">
                    <li><a href="/">Cargo Integrante</a></li>
                </ul>

                <div className="content-frame">
                    <div className="content-frame-top">
                        <div className="rowListado">
                            <div className="panel panel-default ">
                                <div className="panel-heading">
                                    <h3 className="panel-title"><span className="fas fa-user-friends"></span> Listado de cargos de integrantes</h3>
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
                                            <ValidarPermiso
                                                IdModuloPermisoValidar={ModuloPermiso.CargoIntegrante.Nuevo}
                                                DefaultTemplate=
                                                    {
                                                        <button style={{ minHeight: "37px" }} data-toggle="modal" data-target="#modal-accion"
                                                                className="btn btn-primary"
                                                                onClick={async () => {
                                                                    this.resetFields();
                                                                }}>
                                                            <i className="fa fa-plus"></i>{" "}
                                                            Nuevo registro
                                                        </button>
                                                    }
                                            />
                                        </li>
                                    </ul>
                                </div>
                                <div className="panel-body">
                                    <div>

                                        <ValidarPermiso
                                            IdModuloPermisoValidar={ModuloPermiso.CargoIntegrante.ObtenerTodos}
                                            DefaultTemplate=
                                                {
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
                <div className="modal" id="modal-accion" tabIndex="-1" role="dialog" aria-labelledby="largeModalHead" aria-hidden="true">
                    <div className="modal-dialog">
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
                                                <div className="col-md-12">
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
                                            <ValidarPermiso
                                                IdModuloPermisoValidar={
                                                    this.state.fields["id"] === 0 ?
                                                        ModuloPermiso.CargoIntegrante.Nuevo
                                                        : ModuloPermiso.CargoIntegrante.Modificar
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
                <div className={`message-box message-box-${this.state.fields.activo ? "danger" : "info"} animated fadeIn`} id="message-box-danger">
                        <form action="">
                            <div className="mb-container">
                                <div className="mb-middle">
                                    <div className="mb-title"><span className={`fa fa-${this.state.fields.activo ? "eraser" : "check"}`}></span> {this.state.fields.activo ? "Desactivar" : "Activar"} Equipo</div>
                                    <div className="mb-content">
                                        <p>{`¿Está seguro que desea ${this.state.fields.activo ? "desactivar" : "activar"} el cargo ${this.state.fields.titulo}? Puede volver a ${this.state.fields.activo ? "activarla" : "desactivarla"} en cualquier otro momento.`}</p>
                                    </div>
                                    <div className="mb-footer">
                                        <ValidarPermiso
                                            IdModuloPermisoValidar={ModuloPermiso.CargoIntegrante.ObtenerTodos}
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
            </div>
        )
    }
}

export default CargoIntegrante;
