import React, { Component } from "react";
import TableReactExtends from "../../../Components/TableReactExtends";
import AgendaDataService from "../../../Services/AgendaLegislativa/AgendaComision.Service";
import UtilsDataService from "../../../Services/General/Utils.Service";
import Spinner from "../../../Components/Spinner";
import Select from "../../../Components/Select";
import Input from "../../../Components/Input";
import ValidForm from "../../../Utils/ValidForm";
import AuthLogin from "../../../Utils/AuthLogin";
import { ModuloPermiso } from "../../../Permisos/ModuloPermiso";
import ValidarPermiso from "../../../Permisos/ValidarPermiso";
const auth = new AuthLogin();
const validForm = new ValidForm();
const fieldsConst = {
    id: 0,
    agenda_legislativa_id:'',
    corporacion_id:'',
    tipo_comision_id:'',
    comision_id:'',
    user: auth.username(),
};
const errorsConst = {
    id: "",
    fecha: "",
    activo: "",
};
const selectCorporacion={
    value: 0,label: "Seleccione la corporación"
}
const selectTComision={
    value: 0,label: "Seleccione el tipo de comisión"
}
const selectComision={
    value: 0,label: "Seleccione la comisión"
}
class AgendaComision extends Component {
    constructor(props) {
        super(props);
        const id =
            this.props.match.params.id === undefined
                ? 0
                : this.props.match.params.id;
        this.tableHandler = this.tableHandler.bind(this);

        this.state = {
            id: id,
            tableInfo: {
                columns: [
                    {
                        Header: "Agenda Legislativa Comisiones",
                        columns: [
                            {
                                Header: "id",
                                accessor: "id",
                            },
                            {
                                Header: "Corporacion",
                                accessor: "corporacion.nombre",
                            },
                            {
                                Header: "Comision",
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
                            auth.tieneModuloPermiso(ModuloPermiso.AgendaLegislativa.ModificarActividad)?
                            {
                                Header: "Editar",
                                id: "editar",
                                accessor: (str) => "editar",
                                Cell: (tableProps) => (
                                    <ValidarPermiso
                                        IdModuloPermisoValidar={ModuloPermiso.AgendaLegislativa.ModificarActividad}
                                        DefaultTemplate={
                                            <button
                                                data-toggle="modal"
                                                data-target="#modal-accion"
                                                className="btn btn-info"
                                                style={{ width: "100%" }}
                                                onClick={() => {
                                                    this.resetFields();
                                                    this.getByID(
                                                        tableProps.row.values.id
                                                    );
                                                    this.getComboCorporacion();
                                                    this.getComboTComision(this.state.fields.corporacion_id);
                                                    this.getComboComisiones(this.state.fields.corporacion_id,this.state.fields.tipo_comision_id);
                                                }}
                                            >
                                                <i className="fa fa-edit"></i> Editar
                                            </button>
                                        }
                                    />
                                ),
                            }:
                            {
                                Header: 'Editar',
                                id: 'editar',
                                accessor: (str) => '-',
                            }
                            ,
                            auth.tieneModuloPermiso(ModuloPermiso.AgendaLegislativa.EliminarActividad)?
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
                            }:
                            {
                                Header: 'Activar/Desactivar',
                                id: 'actdesc',
                                accessor: (str) => '-',
                            },
                            auth.tieneModuloPermiso(ModuloPermiso.AgendaLegislativa.IndexActividad) ?
                            {
                                Header: 'Actividades',
                                id: 'actividades',
                                accessor: (str) => 'actividades',
                                Cell: (tableProps) => (
                                    <a href={`#/agenda-legislativa-actividades/${tableProps.row.values.id}`} data-id={tableProps.row.values.id}
                                        className="btn btn-primary btn-block">
                                        <i className="fab fa-slideshare"></i> Actividades
                                    </a>
                                )
                            }:
                            {
                                Header: 'Actividades',
                                id: 'actividades',
                                accessor: (str) => '-',
                            }
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
                { value: -1, label: "Filtrar por activo" },
                { value: 1, label: "Activo" },
                { value: 0, label: "Inactivo" },
            ],
            dataSelectCorporacion:[],
            dataSelectTComision:[],
            dataSelectComision:[],
            selectCorporacion:selectCorporacion,
            selectTComision:selectTComision,
            selectComision:selectComision,
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
                    page,
                    rows,
                    search
                );
            }.bind(this),
            1000
        );
    }

    async componentDidMount() {
        this.getAll(
            this.state.filterActive.value,
            this.state.tableInfo["page"],
            this.state.tableInfo["rows"],
            this.state.tableInfo["search"]
        );
        this.getComboCorporacion();
    }

    handlerDesactivar = (item) => {
        let desActObj = {
            id: item.id,           
            activo: item.activo,
        };
        this.setState({
            fields: desActObj,
        });
    };

    handlerSelectCorporacion = async (selectCorporacion) => {
        let fields = this.state.fields;
        fields.corporacion_id= selectCorporacion.value;
        this.setState({fields: fields, selectCorporacion: selectCorporacion});
        this.getComboTComision(selectCorporacion.value)
    }
   
    handlerSelectTComision = async (selectTComision) => {
        let fields = this.state.fields;
        fields.tipo_comision_id = selectTComision.value;
        this.setState({fields: fields, selectTComision: selectTComision});
        await this.getComboComisiones(this.state.fields.corporacion_id, selectTComision.value)
    }
    handlerSelectComision = async (selectComision) => {
        let fields = this.state.fields;
        fields.comision_id= selectComision.value;
        this.setState({fields: fields, selectComision: selectComision});
    }
  
    deleteSubmit = async (e) => {
        e.preventDefault();
        
        this.setState({ loading: true });

        let responseData;
        await AgendaDataService.delete(this.state.fields["id"])
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

    getComboCorporacion = async () => {
        this.setState({ loading: true });        
            await UtilsDataService.getComboCorporacion().then(response => {
                let combo = [];
                let selected = { value: -1, label: "Seleccione la corporación" };
                response.data.forEach(i => {
                    combo.push({ value: i.id, label: i.nombre })
                    if(this.state.id != 0){
                        let idd = this.state.fields.corporacion_id;
                        if(idd === i.id)
                            selected = { value: i.id, label: i.nombre };
                    }
                })
                combo.unshift({ value: -1, label: "Seleccione la corporación" })
                this.setState({
                    dataSelectCorporacion: combo,
                    selectCorporacion: selected
                })
            })
            this.setState({ loading: false }); 
    }
    getComboTComision = async (idCorporacion) => {
        this.setState({ loading: true });        
            await UtilsDataService.getComboTipoComision(idCorporacion).then(response => {
                let combo = [];
                let selected = { value: -1, label: "Seleccione el tipo de comisión" };
                response.data.forEach(i => {
                    combo.push({ value: i.id, label: i.nombre })
                    if(this.state.id != 0){
                        let idd = this.state.fields.tipo_comision_id!==null?this.state.fields.tipo_comision_id:0;
                        if(idd === i.id)
                            selected = { value: i.id, label: i.nombre };
                    }
                })
                combo.unshift({ value: -1, label: "Seleccione el tipo de comisión" })
                this.setState({
                    dataSelectTComision: combo,
                    selectTComision: selected
                })
            })
            this.setState({ loading: false }); 
    }
    getComboComisiones = async (idCorporacion, idTipoComision) => {
        this.setState({loading: true})
        await UtilsDataService.getComboComisiones(idCorporacion, idTipoComision).then(response => {
            let combo = [];
            let selected = { value: 0, label: "Seleccione la comisión" };
            response.data.forEach(i => {
                combo.push({ value: i.id, label: i.nombre })
                if(this.state.id != 0){
                    let idd = this.state.fields.comision_id !== null ? this.state.fields.comision_id : 0;                    
                    if(idd === i.id)
                        selected = { value: i.id, label: i.nombre };
                                            
                }
            })
            combo.unshift({ value: 0, label: "Seleccione la comisión" })
            this.setState({
                dataSelectComision: combo,
                selectComision: selected,
                loading: false
            })
        })
    }
    getAll = async (idFilterActive, page, rows, search) => {
        this.setState({ loading: true });
        let tableInfo = this.state.tableInfo;
        await AgendaDataService.getAll(
            this.state.id,
            idFilterActive,
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

        await AgendaDataService.getTotalRecords(idFilterActive, this.state.id, search)
            .then((response) => {
                tableInfo["totalRows"] = response.data;
                console.log(response.data);
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
            this.state.tableInfo.page,
            this.state.tableInfo.rows,
            this.state.tableInfo.search
        );
    };
    getByID = async (id) => {
        this.setState({ loading: true });
        await AgendaDataService.get(id)
            .then(response => {
                let fields = this.state.fields;               
                fields = response.data[0];
                fields.tipo_comision_id=fields.comision.tipo_comision_id;                                                   
                console.log(fields);
                
                Object.assign(fields, { user: auth.username() });                                         
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
        data.agenda_legislativa_id=this.state.id;
        if (this.state.fields["id"] === 0) {
            await AgendaDataService.create(data)
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
            await AgendaDataService.update(
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
                    <li>Comisiones que sesionan </li>                    
                </ul>
                <div className="content-frame">
                    <div className="content-frame-top">
                        <div className="rowListado">
                            <div className="panel panel-default ">
                                <div className="panel-heading">
                                    <h3 className="panel-title">
                                        <span className="fa fa-list"></span>{" "}
                                        Listado de comisiones de la agenda
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
                                                ></Select>
                                            </div>
                                        </li>
                                        <li>
                                            <ValidarPermiso
                                                IdModuloPermisoValidar={ModuloPermiso.AgendaLegislativa.NuevaActividad}
                                                DefaultTemplate={
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
                                            IdModuloPermisoValidar={ModuloPermiso.AgendaLegislativa.IndexActividad}
                                            DefaultTemplate={
                                            <TableReactExtends
                                            columns={this.state.tableInfo["columns"]}
                                            data={this.state.tableInfo["data"]}
                                            hiddenColumns={this.state.tableInfo["hiddenColumns"]}
                                            handler={this.tableHandler}
                                            pageExtends={this.state.tableInfo["page"]}
                                            totalRows={this.state.tableInfo["totalRows"]}
                                            search={this.state.tableInfo["search"]}/>
                                            }
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
                                    <div className="mb-title"><span className={`fa fa-${this.state.fields.activo ? "eraser" : "check"}`}></span> {this.state.fields.activo ? "Desactivar" : "Activar"} comision de la agenda</div>
                                    <div className="mb-content">
                                        <p>{`¿Está seguro que desea ${this.state.fields.activo ? "desactivar" : "activar"} la comision de la agenda ${this.state.fields.fecha}? Puede volver a ${this.state.fields.activo ? "activarla" : "desactivarla"} en cualquier otro momento.`}</p>
                                    </div>
                                    <div className="mb-footer">
                                        <ValidarPermiso
                                            IdModuloPermisoValidar={ModuloPermiso.AgendaLegislativa.EliminarActividad}
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
                                    comision de la agenda{" "}
                                </h4>
                            </div>

                            <div className="modal-body">
                                <form
                                    name="formAccion"
                                    className="form-horizontal"
                                    onSubmit={(e) => {
                                        this.saveSubmit(e);
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
                                            <label>Corporación</label>
                                                    <Select
                                                    divClass=""
                                                    selectplaceholder="Seleccione"
                                                    selectValue={this.state.selectCorporacion}
                                                    selectOnchange={this.handlerSelectCorporacion}
                                                    selectoptions={
                                                        this.state.dataSelectCorporacion}
                                                    selectIsSearchable={false}
                                                    selectclassNamePrefix="selectReact__value-container"
                                                    spanClass="error"
                                                    spanError={this.state.errors["corporacion_id"] || ""}                                                    
                                                ></Select>
                                            </div>
                                            <div className="form-group">
                                            <label>Tipo comisión</label>
                                                    <Select
                                                    divClass=""
                                                    selectplaceholder="Seleccione"
                                                    selectValue={this.state.selectTComision}
                                                    selectOnchange={this.handlerSelectTComision}
                                                    selectoptions={
                                                        this.state.dataSelectTComision}
                                                    selectIsSearchable={false}
                                                    selectclassNamePrefix="selectReact__value-container"
                                                    spanClass="error"
                                                    spanError={this.state.errors["comision_id"] || ""}                                                    
                                                ></Select>
                                            </div>
                                            <div className="form-group">
                                            <label>Comisión</label>
                                                    <Select
                                                    divClass=""
                                                    selectplaceholder="Seleccione"
                                                    selectValue={this.state.selectComision}
                                                    selectOnchange={this.handlerSelectComision}
                                                    selectoptions={
                                                        this.state.dataSelectComision}
                                                    selectIsSearchable={false}
                                                    selectclassNamePrefix="selectReact__value-container"
                                                    spanClass="error"
                                                    spanError={this.state.errors["comision_id"] || ""}                                                    
                                                ></Select>
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
                                                IdModuloPermisoValidar={this.state.fields.id === 0 ? ModuloPermiso.TipoFechaProyectoLey.Nuevo 
                                                    : ModuloPermiso.TipoFechaProyectoLey.Modificar}
                                                DefaultTemplate={
                                                    <button className="btn btn-success pull-right">
                                                        <i className="fa fa-check">
                                                            </i> Guardar
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
            </div>
        );
    }
}

export default AgendaComision;
