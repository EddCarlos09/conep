import React, { Component } from "react";
import TableReactExtends from "../../../Components/TableReactExtends";
import AgendaDataService from "../../../Services/AgendaLegislativa/Agenda.Service";
import UtilsDataService from "../../../Services/General/Utils.Service";
import Spinner from "../../../Components/Spinner";
import Select from "../../../Components/Select";
import ValidForm from "../../../Utils/ValidForm";
import AuthLogin from "../../../Utils/AuthLogin";
import * as FechaMysql from "../../../Utils/FormatDate";
import { ModuloPermiso } from "../../../Permisos/ModuloPermiso";
import Input from "../../../Components/Input";
import ValidarPermiso from "../../../Permisos/ValidarPermiso";
const auth = new AuthLogin();
const fieldsConst = {
    id: 0,
    fecha: new Date(),
    activo: 1,
    user: auth.username(),
};
const errorsConst = {
    id: "",
    fecha: "",
    activo: "",
};
const selectCorporacion={
    value: -1,label: "Seleccione la corporación"
}
const selectTComision={
    value: -1,label: "Seleccione el tipo de comisión"
}
const selectComision={
    value: -1,label: "Seleccione la comisión"
}
class AgendaLegislativa extends Component {
    constructor(props) {
        super(props);

        this.tableHandler = this.tableHandler.bind(this);

        this.state = {
            tableInfo: {
                columns: [
                    {
                        Header: "Agenda Legislativa",
                        columns: [
                            {
                                Header: "id",
                                accessor: "id",
                            },
                            {
                                Header: "Fecha",
                                accessor: "fecha",
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
                            auth.tieneModuloPermiso(ModuloPermiso.AgendaLegislativa.Obtener)?
                            {
                                Header: "Editar",
                                id: "editar",
                                accessor: (str) => "editar",
                                Cell: (tableProps) => (
                                    <a  href={`#/agenda-legislativa-editar/${tableProps.row.values.id}`} data-id={tableProps.row.values.id}
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
                            auth.tieneModuloPermiso(ModuloPermiso.AgendaLegislativa.Eliminar)?
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
                                Header: 'Comisiones',
                                id: 'comisiones',
                                accessor: (str) => 'comisiones',
                                Cell: (tableProps) => (
                                    <a href={`#/agenda-legislativa-actividades/${tableProps.row.values.id}`} data-id={tableProps.row.values.id}
                                        className="btn btn-primary btn-block">
                                        <i className="fab fa-slideshare"></i> Actividades
                                    </a>
                                )
                            }:
                            {
                                Header: 'Comisiones',
                                id: 'comisiones',
                                accessor: (str) => '-',
                            }
                        ],
                    },
                ],
                hiddenColumns: ["id", "activo"],
                data: [],
                page: 1,
                rows: 5,
                search: '',
                dpFecha:new Date(),
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
            dataSelectCorporacion:[selectCorporacion],
            dataSelectTComision:[selectTComision],
            dataSelectComision:[selectComision],
            selectCorporacion:selectCorporacion,
            selectTComision:selectTComision,
            selectComision:selectComision,
            esComision:false,
            errors:[]
        };
    }
    async tableHandler(page, rows, search) {
        let tableInfo = this.state.tableInfo;
        tableInfo.page = page;
        tableInfo.rows = rows;
       // tableInfo.dpFecha = search;
        //tableInfo.search=FechaMysql.DateFormatMySql(search);
        tableInfo.search=search;
        console.log(tableInfo.search);          
        this.setState({ tableInfo: tableInfo });
        if (this.timeout) clearTimeout(this.timeout);
        this.timeout = setTimeout(
            async function () {
                await this.getAll(
                    this.state.filterActive.value,                    
                    page,
                    rows,
                    tableInfo.search
                );
            }.bind(this),
            1000
        );
    }

   /* getComboCorporacion = async () => {
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
    handlerSelectCorporacion = async (selectCorporacion) => {
        let fields = this.state.fields;
        fields.corporacion_id= selectCorporacion.value;
        this.setState({fields: fields, selectCorporacion: selectCorporacion});
        if(this.state.esComision){
            this.getComboTComision(selectCorporacion.value)
        }else{
            this.setState({selectTComision:selectTComision});
            await this.getAll(
                this.state.filterActive.value,
                selectCorporacion.value,
                this.state.selectTComision.value,
                this.state.selectComision.value,
                this.state.esComision,                
                this.state.tableInfo.page,
                this.state.tableInfo.rows,
                this.state.tableInfo.search
            );
        }       
        
    }
    handlerSelectTComision = async (selectTComision) => {
        let fields = this.state.fields;
        fields.tipo_comision_id= selectTComision.value;
        this.setState({fields: fields, selectTComision: selectTComision});
        if(this.state.esComision){
            this.getComboComisiones(selectTComision.value)
        }else{
            this.setState({selectComision:selectComision});
        }
        
    }
    handlerSelectComision = async (selectComision) => {
        let fields = this.state.fields;
        fields.comision_id= selectComision.value;
        this.setState({fields: fields, selectComision: selectComision});
        await this.getAll(
            this.state.filterActive.value,
            this.state.selectCorporacion.value,
            this.state.selectTComision.value,
            selectComision.value,
            this.state.esComision,           
            this.state.tableInfo.page,
            this.state.tableInfo.rows,
            this.state.tableInfo.search
        );
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
    getComboComisiones = async (idTipoComision) => {
        this.setState({loading: true})
        await UtilsDataService.getComboComisiones(idTipoComision).then(response => {
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
    }*/
    async componentDidMount() {        
        this.getAll(
            this.state.filterActive.value,           
            this.state.tableInfo["page"],
            this.state.tableInfo["rows"],
            this.state.tableInfo["search"]
        );
    }

    handlerDesactivar = (item) => {
        let desActObj = {
            id: item.id,
            fecha: item.fecha,
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

    getAll = async (idFilterActive, page, rows, search) => {
        this.setState({ loading: true });
        let tableInfo = this.state.tableInfo;        
        await AgendaDataService.getAll(
            idFilterActive,            
            search,
            page,
            rows
        )
            .then((response) => {
                tableInfo["data"] = response.data; 
                 console.log(response.data);          
            })
            .catch((e) => {
                console.log(e);
            });

        await AgendaDataService.getTotalRecords(
            idFilterActive,            
            search)
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
                    <li>Agenda Legislativa</li>                    
                </ul>
                <div className="content-frame">
                    <div className="content-frame-top">
                        <div className="rowListado">
                            <div className="panel panel-default ">
                                <div className="panel-heading">
                                    <h3 className="panel-title">
                                        <span className="fa fa-list"></span>{" "}
                                        Listado de fechas de la agenda
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
                                                 IdModuloPermisoValidar={ModuloPermiso.AgendaLegislativa.Nuevo}
                                                 DefaultTemplate={
                                                    <a href="#/agenda-legislativa-crear" className="btn btn-primary">
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
                                            IdModuloPermisoValidar={ModuloPermiso.AgendaLegislativa.Index}
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
                                    <div className="mb-title"><span className={`fa fa-${this.state.fields.activo ? "eraser" : "check"}`}></span> {this.state.fields.activo ? "Desactivar" : "Activar"} fecha de la agenda</div>
                                    <div className="mb-content">
                                        <p>{`¿Está seguro que desea ${this.state.fields.activo ? "desactivar" : "activar"} la fecha de la agenda ${this.state.fields.fecha}? Puede volver a ${this.state.fields.activo ? "activarla" : "desactivarla"} en cualquier otro momento.`}</p>
                                    </div>
                                    <div className="mb-footer">
                                        <ValidarPermiso
                                            IdModuloPermisoValidar={ModuloPermiso.AgendaLegislativa.Eliminar}
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

export default AgendaLegislativa;
