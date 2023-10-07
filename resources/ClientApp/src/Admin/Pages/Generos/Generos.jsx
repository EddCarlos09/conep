import React, { Component } from 'react';
import TableReact from "../../../Components/TableReact";
import GeneroDataService from "../../../Services/Catalogo/Genero.Service";
import Input from '../../../Components/Input';
import Spinner from '../../../Components/Spinner';
import Select from '../../../Components/Select';
import ValidForm from "../../../Utils/ValidForm";
import AuthLogin from "../../../Utils/AuthLogin";
import { Constantes } from "../../../Constants/Constantes.js"
import ImageForMultipleResolution from '../../../Components/ImageForMultipleResolution';
import ValidarPermiso from "../../../Permisos/ValidarPermiso";
import { ModuloPermiso } from "../../../Permisos/ModuloPermiso";

const auth = new AuthLogin();
const validForm = new ValidForm();
const fieldsConst = { id: 0, nombre: '', imagen: '', user:''};
const errorsConst = { id: '', nombre: '', imagen: '', activo: '' };

class Genero extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tableInfo: {
                columns: [
                    {
                        Header: "Géneros",
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
                            auth.tieneModuloPermiso(ModuloPermiso.Genero.Obtener) ?
                            {
                                Header: 'Editar',
                                id: 'editar',
                                accessor: (str) => 'editar',
                                Cell: (tableProps) => (
                                    <ValidarPermiso
                                        IdModuloPermisoValidar={ModuloPermiso.Genero.Obtener}
                                        DefaultTemplate=
                                            {
                                                <button
                                                    data-toggle="modal"
                                                    data-target="#add-genero"
                                                    className="btn btn-info"
                                                    style={{ width: '100%' }}
                                                    onClick={() => {
                                                        this.resetFields();
                                                        this.getByID(
                                                            tableProps.row.values.id
                                                        );
                                                    }}>
                                                    <i className="fa fa-edit"></i>Editar
                                                </button>
                                            }
                                    />
                                )
                            }: {
                                Header: 'Editar',
                                id: 'editar',
                                accessor: (str) => '-',
                            },
                            auth.tieneModuloPermiso(ModuloPermiso.Genero.Eliminar) ?
                            {
                                Header: 'Activar/Desactivar',
                                id: 'actdesc',
                                accessor: (str) => 'actdesc',
                                Cell: (tableProps) => (
                                    <ValidarPermiso
                                        IdModuloPermisoValidar={ModuloPermiso.Genero.Eliminar}
                                        DefaultTemplate=
                                            {
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
                            }
                        ]
                    }
                ],
                hiddenColumns: ["id","activo"],
                data: []
            },
            fields: fieldsConst,
            errors: errorsConst,
            loading: true,
            filterActive: { value: 1, label: "Activo" },
            dataSelectActive: [{ value: -1, label: "Filtrar por activo" }, { value: 1, label: "Activo" }, { value: 0, label: "Inactivo" }],
            imagesResized: []
        }
    }
    componentDidMount() {
        this.state.fields.user = auth.username();
        this.getAll(this.state.filterActive.value);
    }
    handlerDesactivar = (genero) => {
        let desActObj = { id: genero.id, nombre: genero.nombre, activo: genero.activo  }
        this.setState({
            fields: desActObj
        })
    }

    getByID = async (id) => {
        this.setState({ loading: true });
        await GeneroDataService.get(id)
            .then(response => {
                let fields = this.state.fields;
                fields = response.data[0];
                Object.assign(fields, { user: auth.username() });
                fields.imagen = fields.genero_imagen;
                this.setState({
                    fields: fields,
                    loading: false
                });
            })
            .catch(e => {
                this.setState({
                    loading: false
                });
                console.log(e);
            });
    }

    saveSubmit = async (e) => {
        e.preventDefault();
        let errors = this.state.errors;
        errors = validForm.cleanErrors(errors);
        this.setState({ errors: errors, loading: true });

        let responseData;
        let data = this.state.fields;
        data.imagen = this.state.imagesResized;
        if (this.state.fields["id"] === 0) {
            await GeneroDataService.create(data)
                .then(response => {
                    responseData = response.data;
                })
                .catch(function (error) {
                    errors = validForm.displayErrors(error.response.data, errors);
                });
        }
        else {
            await GeneroDataService.update(this.state.fields["id"], data)
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
            document.querySelector(`button[data-dismiss="modal"]`).click(); // Accionamos el click del cancelar para cerrar
            this.resetFields();
        }
    }

    deleteSubmit = async (e) => {
        e.preventDefault();
        let errors = this.state.errors;
        errors = validForm.cleanErrors(errors);
        this.setState({ errors: errors, loading: true });

        let responseData;
        await GeneroDataService.delete(this.state.fields["id"])
            .then(response => {
                responseData = response.data;
            })
            .catch(function (error) {
                errors = validForm.displayErrors(error.response.data, errors);
            });

        this.setState({ errors: errors, loading: false });
        if (responseData != null) {
            await this.getAll(this.state.filterActive.value);
        }
        this.resetFields();
        document.querySelector(`#message-box-danger button[data-dismiss="modal"]`).click(); // Accionamos el click del cancelar para cerrar
    }
    getAll = async (idFilterActive) => {
        this.setState({ loading: true });
        let tableInfo = this.state.tableInfo;
        await GeneroDataService.getAll(idFilterActive)
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

    resetFields() {
        let fields = validForm.resetObject(fieldsConst);
        if(document.querySelector(".ImageForMultipleResolutionCloseButton")){
            document.querySelector(".ImageForMultipleResolutionCloseButton").click();
        }
        this.setState({ fields: fields, imagesResized: [],
             errors: validForm.cleanErrors(this.state.errors) });
    }
    handleFilterActive = async (selectActive) => {
        this.setState({ filterActive: selectActive });
        await this.getAll(selectActive.value);
    }
    handlerOnLoadForImage = async (blob) => {
        let state = this.state;
        state.imagesResized = blob;
        this.setState({
            state
        })
    }
    handlerOnResetForImage = async (data) => {
        let state = this.state;
        state.imagesResized = [];
        this.setState({
            state
        })
    }
    render() {
        return (
            <div>
                <Spinner show={this.state.loading} />
                <div className="modal" id="add-genero" tabIndex="-1" role="dialog" aria-labelledby="largeModalHead" aria-hidden="true">
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <button
                                    type="button"
                                    className="close"
                                    onClick={async () => {
                                        this.resetFields();
                                    }}
                                    data-dismiss="modal">
                                    <span aria-hidden="true">&times;</span><span className="sr-only">Cerrar</span></button>
                                <h4 className="modal-title" id="largeModalHead"><i className="fa fa-list"></i> {this.state.fields["id"] === 0 ? "Nuevo" : "Editar"} género</h4>
                            </div>
                            <div className="modal-body">
                                <form className="form-horizontal" onSubmit={this.saveSubmit.bind(this)}>
                                    <Input divClass="col-md-12" inputName="id" inputType="hidden" inputValue={this.state.fields["id"]} />
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
                                                        divClassSpanI="fa fa-indent" />
                                                </div>
                                            </div>
                                            {
                                                this.state.fields["id"] != 0 ?
                                                <div className="form-group">
                                                    <label htmlFor="">Imagen actual</label>
                                                    <ImageForMultipleResolution key={1} preview={true} previewData={this.state.fields.imagen || null} origin={auth.pathApi()} />
                                                </div> :
                                                <div></div>
                                            }
                                            <div className="form-group">
                                                <div className="col-md-12">
                                                    <label htmlFor="">Imagen</label>
                                                    <ImageForMultipleResolution
                                                    handlerOnLoad={this.handlerOnLoadForImage}
                                                    handlerOnReset={this.handlerOnResetForImage}
                                                    resolutions={Constantes.generoResolutions}
                                                    prefix="generos" controlName="images-1" />
                                                    <span className="error">{this.state.errors["imagen"] || ''}</span>
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
                                                    this.resetFields();
                                                }} ref="closemodalSave">Cerrar</button>
                                            <ValidarPermiso
                                                IdModuloPermisoValidar={
                                                    this.state.fields["id"] === 0 ?
                                                        ModuloPermiso.Genero.Nuevo
                                                        : ModuloPermiso.Genero.Modificar
                                                }
                                                DefaultTemplate=
                                                    {
                                                        <button className="btn btn-success pull-right">
                                                            <i className="fa fa-check"></i> Guardar
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
                                    <div className="mb-title"><span className={`fa fa-${this.state.fields.activo ? "eraser" : "check"}`}></span> {this.state.fields.activo ? "Desactivar" : "Activar"} género</div>
                                    <div className="mb-content">
                                        <p>{`¿Está seguro que desea ${this.state.fields.activo ? "desactivar" : "activar"} el género ${this.state.fields.nombre}? Puede volver a ${this.state.fields.activo ? "activarla" : "desactivarla"} en cualquier otro momento.`}</p>
                                    </div>
                                    <div className="mb-footer">
                                        <ValidarPermiso
                                            IdModuloPermisoValidar={ModuloPermiso.Genero.Eliminar}
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
                    <li><a href="/">Catálogos</a></li>
                    <li><a href="/">Género</a></li>
                </ul>
                <div className="content-frame">
                    <div className="content-frame-top">
                        <div className="rowListado">
                            <div className="panel panel-default ">
                                <div className="panel-heading">
                                    <h3 className="panel-title"><span className="fa fa-list"></span> Listado de géneros</h3>
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
                                                IdModuloPermisoValidar={ModuloPermiso.Genero.Nuevo}
                                                DefaultTemplate=
                                                    {
                                                        <button
                                                            style={{ minHeight: "37px" }}
                                                            data-toggle="modal" data-target="#add-genero"
                                                            className="btn btn-primary"
                                                            onClick={()=>{this.resetFields();}}>
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
                                            IdModuloPermisoValidar={ModuloPermiso.Genero.ObtenerTodos}
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
            </div>
        )
    }
}

export default Genero;
