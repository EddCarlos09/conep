import React, { Component } from "react";
import TableReact from "../../../Components/TableReact";
import CongresistasDataService from "../../../Services/Catalogo/Congresistas.Service";
import Spinner from "../../../Components/Spinner";
import AuthLogin from "../../../Utils/AuthLogin";
import { ModuloPermiso } from "../../../Permisos/ModuloPermiso";
import ValidarPermiso from "../../../Permisos/ValidarPermiso";

const auth = new AuthLogin();

class Congresistas extends Component {
    constructor(props){
        super(props);
        this.state = {
            tableInfo: {
                columns: [
                    {
                        Header: "Quinquenios",
                        columns: [
                            {
                                Header: "cuatrienio_id",
                                accessor: "cuatrienio_id",
                            },
                            {
                                Header: "corporacion_id",
                                accessor: "corporacion_id",
                            },
                            {
                                Header: "Cuatrienio",
                                accessor: "cuatrienio_nombre",
                            },
                            {
                                Header: "Corporación",
                                accessor: "corporacion_nombre",
                            },
                        ],
                    },
                    {
                        Header: "Acciones",
                        columns: [
                            auth.tieneModuloPermiso(ModuloPermiso.Congresistas.Obtener) ?
                            {
                                Header: "Congresistas",
                                id: "congresistas",
                                accessor: (str) => "congresistas",
                                Cell: (tableProps) => (
                                    <ValidarPermiso IdModuloPermisoValidar={ModuloPermiso.Congresistas.Obtener} DefaultTemplate={
                                        <a href={`#/congresistas-por-cuatrienio/cuatrienio-${tableProps.row.values.cuatrienio_id}/corporacion-${tableProps.row.values.corporacion_id}`} className="btn btn-info" style={{ width: "100%" }}>
                                            <i className="fa fa-users"></i> Congresistas
                                        </a>
                                    } />
                                ),
                            } : {
                                Header: 'Congresistas',
                                id: 'congresistas',
                                accessor: (str) => '-',
                            },
                        ],
                    },
                ],
                hiddenColumns: ["cuatrienio_id", "corporacion_id"],
                data: []
            },
            loading: true,
            dataSelectCorporacion: [],
            dataSelectCuatrienio: [],
        }
    }

    async componentDidMount() {
        let corporaciones = await this.getComboCorporacion();
        let cuatrienios = await this.getComboCuatrienio();
        await this.generateData(corporaciones, cuatrienios);
    }

    getComboCorporacion = async () => {
        let combo = [];
        await CongresistasDataService.getComboCorporacion().then(response => {
            response.data.forEach(i => {
                combo.push({ value: i.id, label: i.nombre })
            })
            this.setState({
                dataSelectCorporacion: combo
            })
        })
        return combo;
    }
    getComboCuatrienio = async () => {
        let combo = [];
        await CongresistasDataService.getComboCuatrienio().then(response => {
            response.data.forEach(i => {
                combo.push({ value: i.id, label: i.nombre })
            })
            this.setState({
                dataSelectCuatrienio: combo
            })
        })
        return combo;
    }

    generateData = async (corporaciones = [], cuatrienios = []) =>{
        let data = [];

        corporaciones.forEach(corporacion => {
            cuatrienios.forEach(cuatrienio => {
                data.push(
                    {
                        cuatrienio_id: cuatrienio.value,
                        cuatrienio_nombre: cuatrienio.label,
                        corporacion_id: corporacion.value,
                        corporacion_nombre: corporacion.label
                    }
                )
            })
        });

        let table = this.state.tableInfo;
        table.data = data;
        this.setState({tableInfo: table, loading: false})
    }


    render(){
        return (
            <div>
                <Spinner show={this.state.loading} />

                <ul className="breadcrumb push-down-0">
                    <li>Catálogos</li>
                    <li>Congresistas</li>
                </ul>
                <div className="content-frame">
                    <div className="content-frame-top">
                        <div className="rowListado">
                            <div className="panel panel-default ">
                                <div className="panel-heading">
                                    <h3 className="panel-title">
                                        <span className="fa fa-users"/>{" "}
                                        Listado de quinquenios por corporación
                                    </h3>
                                </div>
                                <div className="panel-body">
                                    <div>
                                        <ValidarPermiso IdModuloPermisoValidar={ModuloPermiso.Congresistas.ObtenerTodos} DefaultTemplate={
                                            <TableReact
                                            columns={this.state.tableInfo.columns}
                                            data={this.state.tableInfo.data}
                                            hiddenColumns={this.state.tableInfo.hiddenColumns}
                                            handler={this.tableHandler}
                                            pageExtends={this.state.tableInfo.page}
                                            totalRows={this.state.tableInfo.totalRows}
                                            search={this.state.tableInfo.search}
                                            />
                                        } />
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

export default Congresistas;
