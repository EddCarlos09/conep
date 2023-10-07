import React, { Component } from 'react';
import TableReact from "../../../Components/TableReact";
import DatosContactoDataService from "../../../Services/Catalogo/DatosContacto.Service";
import ImageForMultipleResolution from '../../../Components/ImageForMultipleResolution';
import Input from '../../../Components/Input';
import Dropzone from 'react-dropzone-uploader';
import Spinner from '../../../Components/Spinner';
import Select from '../../../Components/Select';
import ValidForm from "../../../Utils/ValidForm";
import AuthLogin from "../../../Utils/AuthLogin";
import { Constantes } from "../../../Constants/Constantes.js"
import ValidarPermiso from "../../../Permisos/ValidarPermiso";
import { ModuloPermiso } from "../../../Permisos/ModuloPermiso";

const auth = new AuthLogin();
const validForm = new ValidForm();
const fieldsConst = { id: 0, nombre: '', tipo: 0, imagen: [], user:''};
const fieldsDeleteConst = { id: 0, nombre: '', tipo: 0, imagen: [], user:'', activo: 0};
const errorsConst = { id: '', nombre: '', tipo: '', imagen: '', activo: '' };

class DatosContacto extends Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
        this.state = {
            tableInfo: {
                columns: [
                    {
                        Header: "Datos contacto",
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
                                Header: 'Tipo de dato',
                                accessor: "tipo",
                                Cell: (tableProps) => {
                                    return (
                                        <p className="text-center">{tableProps.row.values.tipo === 1 ? "Texto" : "Enlace"}</p>
                                    );
                                },
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
                                Header: 'Editar',
                                id: 'editar',
                                accessor: (str) => 'editar',
                                Cell: (tableProps) => (
                                    <ValidarPermiso
                                        IdModuloPermisoValidar={ModuloPermiso.DatosContacto.Obtener}
                                        DefaultTemplate=
                                            {
                                                <button
                                                    data-toggle="modal"
                                                    data-target="#add-datocontacto"
                                                    className="btn btn-info editar"
                                                    style={{ width: '100%' }}
                                                    data-id={tableProps.row.values.id}>
                                                    <i className="fa fa-edit"></i> Editar
                                                </button>
                                            }
                                    />
                                )
                            },
                            {
                                Header: "Activar/Desactivar",
                                id: "actdesc",
                                accessor: (str) => "actdesc",
                                Cell: (tableProps) => (
                                    <ValidarPermiso
                                        IdModuloPermisoValidar={ModuloPermiso.DatosContacto.Eliminar}
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
                                )
                            }
                        ]
                    }
                ],
                hiddenColumns: ["id","activo"],
                data: []
            },
            fields: fieldsConst,
            fieldsDelete: {},
            errors: errorsConst,
            loading: true,
            filterActive: { value: 1, label: "Activo" },
            dataSelectActive: [{ value: -1, label: "Filtrar por activo" }, { value: 1, label: "Activo" }, { value: 0, label: "Inactivo" }],
            filterTipoDatoContacto: {value: 0, label: "Seleccione tipo de dato"},
            dataSelectTipoDatoContacto: [
                {value: 0, label: "Seleccione tipo de dato"},
                {value: 1, label: "Texto"},
                {value: 2, label: "Enlace"},
            ],
            imagesResized: []
        }
    }
    componentDidMount() {
        this.state.fields.user = auth.username();
        this.getAll(this.state.filterActive.value);
    }
    handlerDesactivar = (datoscontacto) => {
        let desActObj = { id: datoscontacto.id, nombre: datoscontacto.nombre, activo: datoscontacto.activo  }
        this.setState({
            fieldsDelete: desActObj
        })
    }

    async handleClick(e) {
        let element = e.target;
        // Editar
        if (element.classList.contains("editar")) {
            let id = Number(element.getAttribute("data-id"));
            await this.getByID(id);
        }
        else if (element.parentNode.classList.contains("editar")) {
            let id = Number(element.parentNode.getAttribute("data-id"));
            await this.getByID(id);
        }
        // End editar

        // Reset en backdrop
        if (element.classList.contains("modal-backdrop")) {
            this.resetFiels();
        }
    }

    handleChangeStatus = async ({ file }, status) => {
        let fields = this.state.fields;
        fields.imagen = file;
        if (status === "removed")
        fields.imagen = null;
        this.setState({
            fields: fields
        })
    }

    handlerOnLoadForImage = async (blob) => {
        let state = this.state;
        state.imagesResized = blob;
        this.setState({
            state
        })
    }

    getByID = async (id) => {
        this.setState({ loading: true });
        await DatosContactoDataService.get(id)
            .then(response => {
                let fields = this.state.fields;
                fields = response.data[0];
                Object.assign(fields, { user: auth.username() });
                fields.imagen = fields.datos_contacto_imagen;
                let tipoDatoSelected = this.state.dataSelectTipoDatoContacto.filter((x)=>{ return x.value === response.data[0].tipo})[0];
                this.setState({
                    fields: fields,
                    filterTipoDatoContacto: tipoDatoSelected,
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
        data.tipo = this.state.filterTipoDatoContacto.value;
        data.imagen = this.state.imagesResized;
        if (this.state.fields["id"] === 0) {
            await DatosContactoDataService.create(data)
                .then(response => {
                    responseData = response.data;
                })
                .catch(function (error) {
                    errors = validForm.displayErrors(error.response.data, errors);
                });
        }
        else {
            await DatosContactoDataService.update(this.state.fields["id"], data)
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
        await DatosContactoDataService.delete(this.state.fieldsDelete["id"])
            .then(response => {
                responseData = response.data;
            })
            .catch(function (error) {
                errors = validForm.displayErrors(error.response.data, errors);
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
        await DatosContactoDataService.getAll(idFilterActive)
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

    resetFiels() {
        let fields = validForm.resetObject(fieldsConst);
        if(document.querySelector(".ImageForMultipleResolutionCloseButton")){
            document.querySelector(".ImageForMultipleResolutionCloseButton").click();
        }
        this.setState({ fields: fields, imagesResized: [], fieldsConst: {}, errors: validForm.cleanErrors(this.state.errors) });
    }
    handleFilterActive = async (selectActive) => {
        this.setState({ filterActive: selectActive });
        await this.getAll(selectActive.value);
    }
    handlerTipoDatoContacto = async (selectTipoDato) => {
        this.setState({ filterTipoDatoContacto: selectTipoDato });
    }
    render() {
        return (
            <div>
                <Spinner show={this.state.loading} />
                <div className="modal" id="add-datocontacto" role="dialog" aria-labelledby="largeModalHead" aria-hidden="true">
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
                                <h4 className="modal-title" id="largeModalHead"><i className="fa fa-user"></i> {this.state.fields["id"] === 0 ? "Nuevo" : "Editar"} dato contacto</h4>
                            </div>
                            <div className="modal-body">
                                <form className="form-horizontal custom" onSubmit={this.saveSubmit.bind(this)}>
                                    <Input divClass="col-md-12" inputName="idDatoContacto" inputType="hidden" inputValue={this.state.fields["id"]} />
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
                                            <div className="form-group">
                                                <div className="col-md-12">
                                                    <label htmlFor="">Tipo de dato de contacto</label>
                                                    <Select
                                                        divClass=""
                                                        selectplaceholder="Seleccione"
                                                        selectValue={this.state.filterTipoDatoContacto}
                                                        selectOnchange={this.handlerTipoDatoContacto}
                                                        selectoptions={this.state.dataSelectTipoDatoContacto}
                                                        selectIsSearchable={false}
                                                        selectclassNamePrefix="selectReact__value-container"
                                                        spanClass=""
                                                        spanError="" >
                                                    </Select>
                                                </div>
                                            </div>
                                            {
                                                this.state.fields["id"] !== 0 ?
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
                                                        resolutions={Constantes.datoContactoResolutions}
                                                        prefix="datoContacto" controlName="images-1" />
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
                                                    this.resetFiels();
                                                }} ref="closemodalSave">Cerrar</button>
                                            <ValidarPermiso
                                                IdModuloPermisoValidar={
                                                    this.state.fields["id"] === 0 ?
                                                        ModuloPermiso.DatosContacto.Nuevo
                                                        : ModuloPermiso.DatosContacto.Modificar
                                                }
                                                DefaultTemplate=
                                                    {
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
                <div className={`message-box message-box-${this.state.fieldsDelete.activo ? "danger" : "info"} animated fadeIn`} id="message-box-danger">
                    <form action="">
                        <div className="mb-container">
                            <div className="mb-middle">
                                <div className="mb-title"><span className={`fa fa-${this.state.fieldsDelete.activo ? "eraser" : "check"}`}></span> {this.state.fieldsDelete.activo ? "Desactivar" : "Activar"} dato de contacto</div>
                                <div className="mb-content">
                                    <p>{`¿Está seguro que desea ${this.state.fieldsDelete.activo ? "desactivar" : "activar"} el dato de contacto ${this.state.fieldsDelete.nombre}? Puede volver a ${this.state.fieldsDelete.activo ? "activarlo" : "desactivarlo"} en cualquier otro momento.`}</p>
                                </div>
                                <div className="mb-footer">
                                    <ValidarPermiso
                                        IdModuloPermisoValidar={ModuloPermiso.DatosContacto.Eliminar}
                                        DefaultTemplate=
                                            {
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
                    <li><a href="/">Catálogos</a></li>
                    <li><a href="/">Datos contacto</a></li>
                </ul>
                <div className="content-frame" onClick={this.handleClick}>
                    <div className="content-frame-top">
                        <div className="rowListado">
                            <div className="panel panel-default ">
                                <div className="panel-heading">
                                    <h3 className="panel-title"><span className="fa fa-list"></span> Listado de datos contacto</h3>
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
                                        <button type="button" data-toggle="modal" data-target="#add-datocontacto" className="btn btn-primary btn-block"><i className="fa fa-plus"></i> Nuevo registro</button>
                                        </li>
                                    </ul>
                                </div>
                                <div className="panel-body">
                                    <div>
                                        <ValidarPermiso
                                            IdModuloPermisoValidar={ModuloPermiso.DatosContacto.ObtenerTodos}
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

export default DatosContacto;
