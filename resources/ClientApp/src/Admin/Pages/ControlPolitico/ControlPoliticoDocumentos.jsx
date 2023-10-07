import React, { Component } from 'react';
import TableReactExtends from "../../../Components/TableReactExtends";
import Dropzone from 'react-dropzone-uploader';
import ControlPoliticoDataService from "../../../Services/Congreso/ControlPolitico.Service";
import UtilsDataService from "../../../Services/General/Utils.Service";
import Spinner from '../../../Components/Spinner';
import Select from '../../../Components/Select';
import ValidForm from "../../../Utils/ValidForm";
import Input from "../../../Components/Input";
import { ModuloPermiso } from "../../../Permisos/ModuloPermiso";
import ValidarPermiso from "../../../Permisos/ValidarPermiso";
import AuthLogin from "../../../Utils/AuthLogin";

const auth = new AuthLogin();
const validForm = new ValidForm();
const fieldsConst = {
    id: 0,
    control_politico_id: 0,
    nombre: '',
    archivo: null,
    url: ''
};
const errorsConst = {
    id: '',
    control_politico_id: '',
    nombre: '',
    archivo: '',
    url: '',
    activo: '',
}
class ControlPoliticoDocumentos extends Component {
    constructor(props) {
        super(props);

        this.tableHandler = this.tableHandler.bind(this);

        const id =
            this.props.match.params.id === undefined
                ? 0
                : this.props.match.params.id;
        this.state = {
            id: id,
            tableInfo: {
                columns: [
                    {
                        Header: "Gacetas",
                        columns: [
                            {
                                Header: "id",
                                accessor: "id"
                            },
                            {
                                Header: "Nombre",
                                accessor: "nombre"
                            },
                            {
                                Header: "Url",
                                accessor: "url"
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
                            auth.tieneModuloPermiso(ModuloPermiso.ControlPolitico.ObtenerDocumentos) ?
                                {
                                    Header: 'Editar',
                                    id: 'editar',
                                    accessor: (str) => 'editar',
                                    Cell: (tableProps) => (
                                        <ValidarPermiso
                                            IdModuloPermisoValidar={ModuloPermiso.ControlPolitico.ObtenerDocumentos}
                                            DefaultTemplate={
                                                <button
                                                    data-toggle="modal"
                                                    data-target="#add-documento"
                                                    className="btn btn-info editar"
                                                    style={{ width: '100%' }}
                                                    onClick={async () => {
                                                        this.resetFiels();
                                                        await this.getByID(
                                                            tableProps.row.values.id
                                                        );
                                                    }}
                                                >
                                                    <i className="fa fa-edit"></i> Editar
                                    </button>
                                            }
                                        />
                                    )
                                } :
                                {
                                    Header: 'Editar',
                                    id: 'editar',
                                    accessor: (str) => '-',
                                },
                            auth.tieneModuloPermiso(ModuloPermiso.ControlPolitico.EliminarDocumentos) ?
                                {
                                    Header: "Activar/Desactivar",
                                    id: "actdesc",
                                    accessor: (str) => "actdesc",
                                    Cell: (tableProps) => (
                                        <ValidarPermiso
                                            IdModuloPermisoValidar={ModuloPermiso.ControlPolitico.EliminarDocumentos}
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
                hiddenColumns: ["id", "url"],
                data: [],
                page: 1,
                rows: 5,
                search: "",
                totalRows: 0
            },
            fields: fieldsConst,
            archivoActual: '',
            errors: errorsConst,
            loading: true,
            filterActive: { value: 1, label: "Activo" },
            dataSelectActive: [{ value: -1, label: "Filtrar por activo" }, { value: 1, label: "Activo" }, { value: 0, label: "Inactivo" }],
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
    componentDidMount() {
        this.getAll(this.state.filterActive.value, this.state.tableInfo["page"], this.state.tableInfo["rows"], this.state.tableInfo["search"]);
    }

    handleChangeStatus = async ({ file }, status) => {
        let fields = this.state.fields;
        fields.archivo = file;
        if (status === "removed")
            fields.archivo = null;
        this.setState({
            fields: fields
        })
    }

    handlerDesactivar = (controlPolitico) => {
        let desActObj = { id: controlPolitico.id, nombre: controlPolitico.nombre, url: controlPolitico.url, activo: controlPolitico.activo }
        this.setState({
            fields: desActObj
        })
    }

    saveSubmit = async (e) => {
        e.preventDefault();
        let errors = this.state.errors;
        errors = validForm.cleanErrors(errors);
        this.setState({ errors: errors, loading: true });

        let responseData;
        let data = this.state.fields;
        data.control_politico_id = this.state.id;
        data.user = auth.username();
        if (this.state.fields["id"] === 0) {
            await ControlPoliticoDataService.createDocumento(data)
                .then(response => {
                    responseData = response.data;
                })
                .catch(function (error) {
                    errors = validForm.displayErrors(error.response.data, errors);
                });
        }
        else {
            await ControlPoliticoDataService.updateDocumento(this.state.fields["id"], data)
                .then(response => {
                    responseData = response.data;
                })
                .catch(function (error) {
                    errors = validForm.displayErrors(error.response.data, errors);
                });
        }
        this.setState({ errors: errors, loading: false });
        if (responseData != null) {
            await this.tableHandler(1, 5, '', false);
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
        await ControlPoliticoDataService.deleteDocumento(this.state.fields["id"])
            .then(response => {
                responseData = response.data;
            })
            .catch(function (error) {
                errors = validForm.displayErrors(error.response.data.errors, errors);
            });

        this.setState({ errors: errors, loading: false });
        if (responseData != null) {
            await this.tableHandler(1, 5, '', false);
            document.querySelector(`#message-box-danger button[data-dismiss="modal"]`).click();
        }
    }

    getAll = async (idFilterActive, page, rows, search) => {
        this.setState({ loading: true });
        let tableInfo = this.state.tableInfo;
        await ControlPoliticoDataService.getAllDocumento(
            idFilterActive, this.state.id, search, page, rows)
            .then(response => {
                tableInfo["data"] = response.data;
            })
            .catch(e => {
                console.log(e);
            });

        await ControlPoliticoDataService.getTotalRecordsControlPoliticoDocumento(idFilterActive, this.state.id, search)
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

    getByID = async (id) => {
        this.setState({ loading: true });
        await ControlPoliticoDataService.getDocumento(id)
            .then((response) => {
                let fields = response.data[0];
                let urlArray = fields.url.split('/');
                Object.assign(fields, { user: auth.username() });
                this.setState(
                    {
                        fields: fields,
                        archivoActual: urlArray[4],
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

    resetFiels() {
        let fields = validForm.resetObject(fieldsConst);
        let archivos = document.querySelectorAll(".dzu-previewButton");
        archivos.forEach(x => x.click())
        this.setState({ fields: fields, errors: validForm.cleanErrors(this.state.errors) });
    }
    handleFilterActive = async (selectActive) => {
        this.setState({ filterActive: selectActive });
        await this.tableHandler(1, 5, this.state.tableInfo.search, false)
    }
    render() {
        return (
            <div>
                <Spinner show={this.state.loading} />
                <div className="modal" id="add-documento" role="dialog" aria-labelledby="largeModalHead" aria-hidden="true">
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
                                <h4 className="modal-title" id="largeModalHead"><i className="fa fa-ticket"></i> {this.state.fields["id"] === 0 ? "Nuevo" : "Editar"} gacetas</h4>
                            </div>
                            <div className="modal-body">
                                <form className="form-horizontal custom" onSubmit={this.saveSubmit.bind(this)}>
                                    <Input divClass="col-md-12" inputName="idDocumento" inputType="hidden" inputValue={this.state.fields["id"]} />
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
                                                        inputplaceholder="Ingrese el nombre"
                                                        inputValue={this.state.fields["nombre"] || ''}
                                                        inputOnchange={e => {
                                                            let fields = this.state.fields;
                                                            let errors = this.state.errors;
                                                            fields = validForm.handleChangeField("nombre", fields, e);
                                                            errors = validForm.handleChangeErrors("nombre", errors, e);
                                                            this.setState({ fields: fields, errors: errors });
                                                        }}
                                                        spanClass="error"
                                                        spanError={this.state.errors["nombre"] || ''}
                                                        divClassSpanType={1}
                                                        divClassSpan="input-group-addon"
                                                        divClassSpanI="fa fa-pencil" />
                                                </div>
                                            </div>
                                            {
                                                this.state.fields["id"] != 0 ?
                                                    <div className="form-group">
                                                        <label htmlFor="">Archivo actual</label>
                                                        <a className="alert btn-primary" href={auth.pathApi() + this.state.fields.url}>
                                                            {this.state.archivoActual}
                                                        </a>
                                                    </div> :
                                                    <div></div>
                                            }
                                            <div className="form-group">
                                                <div className="col-md-12">
                                                    <label htmlFor="">Archivo</label>
                                                    <Dropzone
                                                        id="myDropzone"
                                                        maxFiles={1}
                                                        maxSizeBytes={15000000}
                                                        multiple={false}
                                                        onChangeStatus={this.handleChangeStatus}
                                                        onClick={this.handlerResetDropzone}
                                                        accept="*"
                                                        inputContent={"Arrastre su archivo o de click para buscar"}
                                                    />
                                                    <span className="error">{this.state.errors["archivo"] || ''}</span>
                                                </div>
                                            </div>
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
                                                        IdModuloPermisoValidar={ModuloPermiso.ControlPolitico.AgregarDocumentos}
                                                        DefaultTemplate={
                                                            <button className="btn btn-success pull-right"><i className="fa fa-check"></i> Guardar </button>
                                                        }
                                                    /> :
                                                    <ValidarPermiso
                                                        IdModuloPermisoValidar={ModuloPermiso.ControlPolitico.ModificarDocumentos}
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

                <div className={`message-box message-box-${this.state.fields.activo ? "danger" : "info"} animated fadeIn`} id="message-box-danger">
                    <form action="">
                        <div className="mb-container">
                            <div className="mb-middle">
                                <div className="mb-title"><span className={`fa fa-${this.state.fields.activo ? "eraser" : "check"}`}></span> {this.state.fields.activo ? "Desactivar" : "Activar"} gaceta</div>
                                <div className="mb-content">
                                    <p>{`¿Está seguro que desea ${this.state.fields.activo ? "desactivar" : "activar"} la gaceta ${this.state.fields.nombre}? Puede volver a ${this.state.fields.activo ? "activarlo" : "desactivarlo"} en cualquier otro momento.`}</p>
                                </div>
                                <div className="mb-footer">
                                    <ValidarPermiso
                                        IdModuloPermisoValidar={ModuloPermiso.ControlPolitico.EliminarDocumentos}
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
                    <li><a href="#/control-politico">Control politico</a></li>
                    <li><a href="/">Gacetas</a></li>
                </ul>
                <div className="content-frame">
                    <div className="content-frame-top">
                        <div className="rowListado">
                            <div className="panel panel-default ">
                                <div className="panel-heading">
                                    <h3 className="panel-title"><span className="fa fa-list"></span> Listado de gacetas</h3>
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
                                                IdModuloPermisoValidar={ModuloPermiso.ControlPolitico.AgregarDocumentos}
                                                DefaultTemplate={
                                                    <button
                                                        type="button"
                                                        data-toggle="modal"
                                                        data-target="#add-documento"
                                                        className="btn btn-primary btn-block"
                                                        onClick={() => {
                                                            this.resetFiels();
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
                                            IdModuloPermisoValidar={ModuloPermiso.ControlPolitico.IndexDocumentos}
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

export default ControlPoliticoDocumentos;