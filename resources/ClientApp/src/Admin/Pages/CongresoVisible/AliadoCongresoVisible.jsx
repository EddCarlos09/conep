import React, { Component } from 'react';
import Spinner from "../../../Components/Spinner";
import AuthLogin from "../../../Utils/AuthLogin";
import TableReact from "../../../Components/TableReact";
import congresoVisibleDataService from "../../../Services/Catalogo/CongresoVisible.Service";
import Select from '../../../Components/Select';
import { ModuloPermiso } from "../../../Permisos/ModuloPermiso";
import ValidarPermiso from "../../../Permisos/ValidarPermiso";

const auth = new AuthLogin();
const fieldsConst = {
    id: 0,
    nombre: "",
    activo: 1,
    user: auth.username(),
};
class AliadoCongresoVisible extends Component {
    constructor(props){
        super(props);
        const idcv =
        this.props.match.params.idcv === undefined
            ? 0
            : this.props.match.params.idcv;
        this.state = {  
            idcv:idcv,         
            tableInfo: {
                columns: [
                    {
                        Header: "Aliados",
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
                                Header: "Sitio Web",
                                accessor: "urlexterna",                           
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
                            auth.tieneModuloPermiso(ModuloPermiso.CongresoVisible.ObtenerAliado) ?                   
                            {
                                Header: 'Editar',
                                id: 'editar',
                                accessor: (str) => 'editar',
                                Cell: (tableProps) => (
                                    <ValidarPermiso
                                        IdModuloPermisoValidar = {ModuloPermiso.CongresoVisible.ObtenerAliado}
                                        DefaultTemplate = {
                                            <a  href={`#/aliado-editar/${idcv}/${tableProps.row.values.id}`} data-id={tableProps.row.values.id}
                                            className="btn btn-info btn-block">
                                                        <i className="fa fa-edit"></i> Editar                                               
                                            </a>
                                        }
                                    />                                    
                                )
                            }:{
                                Header: 'Editar',
                                id: 'editar',
                                accessor: (str) => '-',
                            },
                            auth.tieneModuloPermiso(ModuloPermiso.CongresoVisible.EliminarAliado) ?                   
                            {
                                Header: "Activar/Desactivar",
                                id: "actdesc",
                                accessor: (str) => "actdesc",
                                Cell: (tableProps) => (
                                    <ValidarPermiso
                                        IdModuloPermisoValidar = {ModuloPermiso.CongresoVisible.EliminarAliado}
                                        DefaultTemplate = {
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
                            }:{
                                Header: "Activar/Desactivar",
                                id: "actdesc",
                                accessor: (str) => "-",
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
            nombre: item.nombre,
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
        await congresoVisibleDataService.deleteAliado(this.state.fields["id"])
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
        await congresoVisibleDataService.getAllAliado(idFilterActive,page,rows,search)
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
    render() {
        return (
            <div>
                <Spinner show={this.state.loading} />
                <ul className="breadcrumb push-down-0">
                    <li><a href="/">Congreso Visible</a></li>
                    <li><a href="/">Aliados</a></li>                   
                </ul> 

                <div className="content-frame">
                    <div className="content-frame-top">
                        <div className="rowListado">
                            <div className="panel panel-default ">
                                <div className="panel-heading">
                                    <h3 className="panel-title"><span className="fas fa-handshake"></span> Listado de Aliados</h3>
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
                                            <a href={`#/aliado-crear/${this.state.idcv}`}  className="btn btn-primary">
                                                <i className="fa fa-plus"></i> Nuevo registro
                                            </a>                                           
                                        </li>
                                    </ul>
                                </div>
                                <div className="panel-body">
                                    <div>   
                                        <ValidarPermiso
                                            IdModuloPermisoValidar = {ModuloPermiso.CongresoVisible.ObtenerTodosAliados}
                                            DefaultTemplate = {
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

                <div className={`message-box message-box-${this.state.fields.activo ? "danger" : "info"} animated fadeIn`} id="message-box-danger">
                        <form action="">
                            <div className="mb-container">
                                <div className="mb-middle">
                                    <div className="mb-title"><span className={`fa fa-${this.state.fields.activo ? "eraser" : "check"}`}></span> {this.state.fields.activo ? "Desactivar" : "Activar"} Aliado</div>
                                    <div className="mb-content">
                                        <p>{`¿Está seguro que desea ${this.state.fields.activo ? "desactivar" : "activar"} el aliado ${this.state.fields.nombre}? Puede volver a ${this.state.fields.activo ? "activarla" : "desactivarla"} en cualquier otro momento.`}</p>
                                    </div>
                                    <div className="mb-footer">
                                    <button type="button" className="btn btn-primary btn-lg pull-right" onClick={(e) => { this.deleteSubmit(e) }} >{this.state.fields.activo ? "Desactivar" : "Activar"}</button>
                                        
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


export default AliadoCongresoVisible;