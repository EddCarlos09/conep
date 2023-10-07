import React, { Component } from "react";
import TableReactExtends from "../../../Components/TableReactExtends";
import ProyectoLeyDataService from "../../../Services/Congreso/ProyectoLey.Service";
import Spinner from "../../../Components/Spinner";
import Select from "../../../Components/Select";
import ValidForm from "../../../Utils/ValidForm";
import { ModuloPermiso } from "../../../Permisos/ModuloPermiso";
import ValidarPermiso from "../../../Permisos/ValidarPermiso";
import UtilsDataService from "../../../Services/General/Utils.Service";
import AuthLogin from "../../../Utils/AuthLogin";

const validForm = new ValidForm();
const auth = new AuthLogin();
const fieldsConst = {
    id: 0,                      proyecto_ley_id: 0,     
    url_archivo : ""
};
const errorsConst = {
    id: "",                      proyecto_ley_id: 0,     
    url_archivo : ""
};



class DocumentosProyectoLey extends Component {
    constructor(props) {
        super(props);

        this.tableHandler = this.tableHandler.bind(this);

        this.state = {
            tableInfo: {
                columns: [
                    {
                        Header: "Documentos",
                        columns: [
                            {
                                Header: "Archivo",
                                accessor: "url_archivo"
                            },                            
                            {
                                Header: "id",
                                accessor: "id",
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
                            // {
                            //     Header: "Editar",
                            //     id: "editar",
                            //     accessor: (str) => "editar",
                            //     Cell: (tableProps) => (
                            //         <ValidarPermiso
                            //             IdModuloPermisoValidar={ModuloPermiso.ProyectoDeLey.Modificar}
                            //             DefaultTemplate=
                            //                 {
                            //                     <a
                            //                         href={`#/proyecto-ley-editar-alertas/${tableProps.row.values.id}`}
                            //                         data-id={tableProps.row.values.id}
                            //                         className="btn btn-info btn-block"
                            //                     >
                            //                         <i className="fa fa-edit"></i> Editar
                            //                     </a>
                            //                 }
                            //         />
                            //     ),
                            // },
                            {
                                Header: "Activar/Desactivar",
                                id: "actdesc",
                                accessor: (str) => "actdesc",
                                Cell: (tableProps) => (
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
            fields: fieldsConst,
            errors: errorsConst,
            loading: true,
            // filterActive: { value: 1, label: "Activo" },
            // dataSelectActive: [
            //     { value: '', label: "Filtrar por activo" },
            //     { value: 1, label: "Activo" },
            //     { value: 0, label: "Inactivo" },
            // ],
            proyecto_ley_id : 0,
        };
    }
    async tableHandler(page, rows, search, isDelay) {
        let delayAccion = isDelay ? 1000 : 0;
        let tableInfo = this.state.tableInfo;
        tableInfo.page = page;
        tableInfo.rows = rows;
        tableInfo.search = search;
        if (!isDelay) tableInfo.data = [];
        this.setState({ tableInfo: tableInfo });
        if (this.timeout) clearTimeout(this.timeout);
        this.timeout = setTimeout(
            async function () {
                await this.getAll(
                    this.state.fields.id,
                    // this.state.filterActive.value,
                    1,
                    page,
                    rows,
                    search
                );
            }.bind(this),
            delayAccion
        );
    }

    async componentDidMount() {
        let id = this.obtenerId();
        await this.getByID(id);

        await this.getAll(
            id,
            // this.state.filterActive.value,
            1,
            this.state.tableInfo["page"],
            this.state.tableInfo["rows"],
            this.state.tableInfo["search"]
        );
    }
    componentDidUpdate = async () =>{
        let id = this.obtenerId();
        let currentId = this.state.fields.id;
        if(currentId > 0 && currentId !== id){
            await this.getByID(id);
        }
    }

    obtenerId = () => {
        let url = this.props.location.pathname;
        let urlArray = url.split("/");
        let id = 0;
        if (
            typeof urlArray[urlArray.length - 1] !== "undefined" &&
            Number.isInteger(Number.parseInt(urlArray[urlArray.length - 1]))
        ) {
            id = Number.parseInt(urlArray[urlArray.length - 1]);
        }
        return id;
    };
    getByID = async (id) => {

        await ProyectoLeyDataService.get(id)
            .then((response) => {
                let data = response.data;
                let fields = this.state.fields;
                fields.id = data.id;
                // fields.cuatrienio_id = data.cuatrienio_id;
                // fields.legislatura_id = data.legislatura_id;
                // fields.corporacion_id = data.corporacion_id;
                fields.titulo = data.titulo;
                fields.alias = data.alias;
                // fields.fecha_radicacion = data.fecha_radicacion;
                // fields.numero_camara = data.numero_camara;
                // fields.iniciativa_id = data.iniciativa_id;
                // fields.tipo_proyecto_id = data.tipo_proyecto_id;
                // fields.tema_id_principal = data.tema_id_principal;
                // fields.tema_id_secundario = data.tema_id_secundario;
                // fields.sinopsis = data.sinopsis;
                // fields.se_acumula_a_id = data.se_acumula_a_id;
                // fields.alcance_id = data.alcance_id;
                // fields.activo = data.activo;
                // fields.proyecto_ley_estado = data.proyecto_ley_estado;
                // fields.proyecto_ley_autor_personas = [];
                // fields.comision_asamblea_id = data.comision_asamblea_id;
                // fields.comision_uccaeps_id = data.comision_uccaeps_id;
                // fields.fecha_cuatrienal = data.fecha_cuatrienal;
                // fields.fecha_dictamen = data.fecha_dictamen;    
              
                Object.assign(fields, { user: auth.username() });
                this.setState({
                    fields: fields,
                    action: "Editar",
                }, async ()=>{
                    
                });
            })
            .catch((e) => {
                console.log(e);
            });
    };
    handlerDesactivar = (item) => {
        console.log("handlerDesactivar");
        console.log(item);
        let desActObj = {
            id: this.state.fields.id,
            idDelete: item.id,
            url_archivo: item.url_archivo,
            activo: item.activo,
        };
        this.setState({
            fields: desActObj,
        });
    };

    deleteSubmit = async (e) => {
        e.preventDefault();

        console.log(e);
        let errors = this.state.errors;
        errors = validForm.cleanErrors(errors);
        this.setState({ errors: errors, loading: true });
        console.log("erros cleaned");
        let responseData;

        console.log(this.state.fields);
        await ProyectoLeyDataService.deleteDocumento(this.state.fields["idDelete"])
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
                this.state.fields.id,
                // this.state.filterActive.value,
                1,
                this.state.tableInfo["page"],
                this.state.tableInfo["rows"],
                this.state.tableInfo["search"]
            );
            document.querySelector(`#modal-activar-desactivar button[data-dismiss="modal"]`).click();
        }
    };

    getAll = async (id, idFilterActive, page, rows, search) => {
        this.setState({ loading: true });
        let tableInfo = this.state.tableInfo;
        await ProyectoLeyDataService.getAllDocumentos(id, idFilterActive, search, page, rows)
            .then((response) => {
                tableInfo["data"] = response.data;
                console.log(response.data);
            })
            .catch((e) => {
                console.log(e);
            });

        await ProyectoLeyDataService.getTotalRecordsDocumentos(id, idFilterActive, search, page, rows)
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

    resetFiels() {
        let fields = validForm.resetObject(fieldsConst);
        this.setState({
            fields: fields,
            errors: validForm.cleanErrors(this.state.errors),
        });
    }

    // handleFilterActive = async (selectActive) => {
    //     this.setState({ filterActive: selectActive },async ()=>{
    //         await this.getAll(
    //             this.state.fields.id,
    //             selectActive.value,
    //             this.state.tableInfo.page,
    //             this.state.tableInfo.rows,
    //             this.state.tableInfo.search
    //         );
    //     });
    // };
    render() {
        return (
            <div>
                <Spinner show={this.state.loading} />

                <div className={`message-box message-box-${this.state.fields.activo ? "danger" : "info"} animated fadeIn`} id="modal-activar-desactivar">
                    <form>
                        <div className="mb-container">
                            <div className="mb-middle">
                                <div className="mb-title"><span className={`fa fa-${this.state.fields.activo ? "eraser" : "check"}`}></span> {this.state.fields.activo ? "Desactivar" : "Activar"} el documento</div>
                                <div className="mb-content">
                                    <p>{`¿Está seguro que desea ${this.state.fields.activo ? "eliminar" : "activar"} el documento ${this.state.fields.url_archivo }?`}</p>
                                </div>
                                <div className="mb-footer">
                                   
                                                <button type="button" className="btn btn-primary btn-lg pull-right" onClick={async (e) => { await this.deleteSubmit(e) }} >{this.state.fields.activo ? "Eliminar" : "Activar"}</button>
                                           
                                    <button className="btn btn-default btn-lg pull-right" type="button" data-dismiss="modal">Cancelar</button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
                <ul className="breadcrumb push-down-0">
                    <li>
                        <a href="/">Documentos</a>
                    </li>
                </ul>
                <div className="content-frame">
                    <div className="content-frame-top">
                        <div className="rowListado">
                            <div className="panel panel-default ">
                                <div className="panel-heading">
                                    <h3 className="panel-title">
                                        <span className="fa fa-list"></span>{" "}
                                        Listado de documento del proyecto de ley
                                    </h3>
                                    <h4 className="panel-title">{this.state.fields.titulo}</h4>
                                    <ul className="panel-controls">
                                        {/* <li>
                                            <div style={{ minWidth: "90px" }}>
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
                                        </li> */}
                                        <li>
                                            <ValidarPermiso
                                                IdModuloPermisoValidar={ModuloPermiso.ProyectoDeLey.Nuevo}
                                                DefaultTemplate=
                                                    {
                                                        <a
                                                        //href="#/proyecto-ley-crear-alertas?id_proyecto_ley=" + this.state.fields.proyecto_ley_id
                                                        href={`#/proyecto-ley-crear-documento/${this.obtenerId()}`}
                                                        className="btn btn-primary"
                                                        >
                                                        <i className="fa fa-plus"></i>
                                                        Nuevo documento
                                                        </a>
                                                    }
                                            />
                                        </li>
                                    </ul>
                                </div>
                                <div className="panel-body">
                                    <div>
                                        <ValidarPermiso
                                            IdModuloPermisoValidar={ModuloPermiso.ProyectoDeLey.ObtenerTodos}
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
            </div>
        );
    }
}

export default DocumentosProyectoLey;
