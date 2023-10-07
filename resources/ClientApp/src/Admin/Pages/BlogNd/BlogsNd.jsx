import React, { Component } from "react";
import TableReactExtends from "../../../Components/TableReactExtends";
import BlogNdDataService from "../../../Services/BlogNd/BlogNd.Service";
import Spinner from "../../../Components/Spinner";
import Select from "../../../Components/Select";
import ValidForm from "../../../Utils/ValidForm";
import Input from "../../../Components/Input";
import AuthLogin from "../../../Utils/AuthLogin";
import { ModuloPermiso } from "../../../Permisos/ModuloPermiso";
import ValidarPermiso from "../../../Permisos/ValidarPermiso";
import UtilsDataService from "../../../Services/General/Utils.Service";
const auth = new AuthLogin();
const validForm = new ValidForm();
const SelectAnno = { value: '', label: 'Filtrar por año' };

const fieldsConst = {
    id: 0,
    titulo: "",
    activo: 1,
    user: auth.username(),
};
const errorsConst = {
    id: "",
    titulo: "",
    activo: "",
};

class BlogsNd extends Component {
    constructor(props) {
        super(props);

        this.tableHandler = this.tableHandler.bind(this);

        this.state = {
            tableInfo: {
                columns: [
                    {
                        Header: "Blog Nuestra Democracia",
                        columns: [
                            {
                                Header: "id",
                                accessor: "id",
                            },
                            {
                                Header: "Título",
                                accessor: "titulo",
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
                            auth.tieneModuloPermiso(ModuloPermiso.BlogNuestraDemocracia.Obtener)?
                            {
                                Header: "Editar",
                                id: "editar",
                                accessor: (str) => "editar",
                                Cell: (tableProps) => (
                                    <a  href={`#/blog-nd-editar/${tableProps.row.values.id}`} data-id={tableProps.row.values.id}
                                     className="btn btn-info btn-block">
                                                <i className="fa fa-edit"></i> Editar
                                    </a>
                                ),
                            }:
                            {
                                Header: 'Editar',
                                id: 'editar',
                                accessor: (str) => '-',
                            }
                            ,
                            auth.tieneModuloPermiso(ModuloPermiso.BlogNuestraDemocracia.Eliminar)?
                            {
                                Header: "Activar/Desactivar",
                                id: "actdesc",
                                accessor: (str) => "actdesc",
                                Cell: (tableProps) => (
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
                                ),
                            }
                            :
                            {
                                Header: 'Activar/Desactivar',
                                id: 'actdesc',
                                accessor: (str) => '-',
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
            fields:fieldsConst,
            loading: true,
            filterActive: { value: 1, label: "Activo" },
            dataSelectActive: [
                { value: '', label: "Filtrar por activo" },
                { value: 1, label: "Activo" },
                { value: 0, label: "Inactivo" },
            ],
            filterAnno: SelectAnno,
            dataSelectAnno: [],
            errors:[]
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
                    this.state.filterAnno.value,
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
            this.state.filterAnno.value,
            this.state.tableInfo["page"],
            this.state.tableInfo["rows"],
            this.state.tableInfo["search"]
        );
        await this.getComboAnno();
    }

    getComboAnno= async () => {
        await UtilsDataService.getComboBlogNdAnno()
            .then(response => {
                this.setState({ loading: true });
                let combo = [];
                response.data.forEach(i => {
                    combo.push({ value: i.fecha_publicacion, label: i.fecha_publicacion })
                })
                combo.unshift({ value: '', label: "Filtrar por año" })
                this.setState({
                    dataSelectAnno: combo,
                    loading: false
                })
            });
    }

    handlerDesactivar = (item) => {
        let desActObj = {
            id: item.id,
            titulo: item.titulo,
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
        await BlogNdDataService.delete(this.state.fields["id"])
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
                this.state.filterAnno.value,
                this.state.tableInfo.page,
                this.state.tableInfo.rows,
                this.state.tableInfo.search
            );
            document.querySelector(`#message-box-danger button[data-dismiss="modal"]`).click();
        }
    };

    getAll = async (idFilterActive, anno_publicacion, page, rows, search) => {
        this.setState({ loading: true });
        let tableInfo = this.state.tableInfo;
        await BlogNdDataService.getAll(
            idFilterActive,
            anno_publicacion,
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

        await BlogNdDataService.getTotalRecords(idFilterActive, search)
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

    handleFilterActive = async (selectActive) => {
        this.setState({ filterActive: selectActive });
        await this.getAll(
            selectActive.value,
            this.state.filterAnno.value,
            this.state.tableInfo.page,
            this.state.tableInfo.rows,
            this.state.tableInfo.search
        );
    };

    handleFilterAnno = async (selectAnno) => {
        this.setState({ filterAnno: selectAnno });
        await this.getAll(
            this.state.filterActive.value,
            selectAnno.value,
            this.state.tableInfo.page,
            this.state.tableInfo.rows,
            this.state.tableInfo.search
        );
    };

    render() {
        return (
            <div>
                <Spinner show={this.state.loading} />

                <ul className="breadcrumb push-down-0">
                    <li>Nuestra Democracia</li>
                    <li>Blog</li>
                </ul>
                <div className="content-frame">
                    <div className="content-frame-top">
                        <div className="rowListado">
                            <div className="panel panel-default ">
                                <div className="panel-heading">
                                    <h3 className="panel-title">
                                        <span className="fa fa-list"></span>{" "}
                                        Listado de entradas del blog
                                    </h3>
                                    <ul className="panel-controls">
                                        <li>
                                            <div style={{ minWidth: "200px" }}>
                                                <Select
                                                    divClass=""
                                                    selectplaceholder="Seleccione"
                                                    selectValue={this.state.filterAnno}
                                                    selectOnchange={this.handleFilterAnno}
                                                    selectoptions={this.state.dataSelectAnno}
                                                    selectIsSearchable={false}
                                                    selectclassNamePrefix="selectReact__value-container"
                                                    noOptionsMessage="Seleccione año"
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
                                                IdModuloPermisoValidar={ModuloPermiso.BlogNuestraDemocracia.Nuevo}
                                                DefaultTemplate={
                                                    <a href="#/blog-nd-crear" className="btn btn-primary">
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
                                            IdModuloPermisoValidar={ModuloPermiso.BlogNuestraDemocracia.Index}
                                            DefaultTemplate={
                                                <TableReactExtends
                                                columns={this.state.tableInfo["columns"]}
                                                data={this.state.tableInfo["data"]}
                                                hiddenColumns={this.state.tableInfo["hiddenColumns"]}
                                                handler={this.tableHandler}
                                                pageExtends={this.state.tableInfo["page"]}
                                                totalRows={this.state.tableInfo["totalRows"]}
                                                search={this.state.tableInfo["search"]}
                                            />}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={`message-box message-box-${this.state.fields.activo ? "danger" : "info"} animated fadeIn`} id="message-box-danger">
                        <form action="">
                            <div className="mb-container">
                                <div className="mb-middle">
                                    <div className="mb-title"><span className={`fa fa-${this.state.fields.activo ? "eraser" : "check"}`}></span> {this.state.fields.activo ? "Desactivar" : "Activar"} entrada del blog</div>
                                    <div className="mb-content">
                                        <p>{`¿Está seguro que desea ${this.state.fields.activo ? "desactivar" : "activar"} la entrada del blog ${this.state.fields.titulo}? Puede volver a ${this.state.fields.activo ? "activarla" : "desactivarla"} en cualquier otro momento.`}</p>
                                    </div>
                                    <div className="mb-footer">
                                     <ValidarPermiso
                                        IdModuloPermisoValidar={ModuloPermiso.BlogNuestraDemocracia.Eliminar}
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
            </div>
        );
    }
}

export default BlogsNd;
