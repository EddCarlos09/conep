import React, { Component } from "react";
import VotacionesDataService from "../../../Services/Catalogo/Votaciones.Service";
import ValidForm from "../../../Utils/ValidForm";
import TableReact from "../../../Components/TableReact";
import AuthLogin from "../../../Utils/AuthLogin";
import { Constantes } from "../../../Constants/Constantes.js";
import Spinner from "../../../Components/Spinner";
import Select from "../../../Components/Select";
import { ModuloPermiso } from "../../../Permisos/ModuloPermiso";
import ValidarPermiso from "../../../Permisos/ValidarPermiso";

const auth = new AuthLogin();
let validForm = new ValidForm();
const seleccioneVoto = {value: 0, label: "Seleccione voto"};
class Votar extends Component{
    constructor(props){
        super(props);
        const id = this.props.match.params.id === undefined ? 0 : this.props.match.params.id;
        this.state = {
            id: id,
            loading: true,
            tableInfo: {
                columns: [
                    {
                        Header: "Congresista",
                        columns: [
                            {
                                Header: "id",
                                accessor: "id",
                            },
                            {
                                Header: "Foto",
                                id: "persona",
                                accessor: "persona",
                                Cell: (tableProps) => {
                                    return (
                                        <>
                                            <img className="m32px center-block" src={typeof tableProps.row.values.persona.imagenes[0] !== 'undefined' ? auth.pathApi() + tableProps.row.values.persona.imagenes[0].imagen : Constantes.NoImagen} alt=""/>
                                        </>
                                    );
                                },
                            },
                            {
                                Header: "Nombre",
                                id:"nombres",
                                accessor: "persona",
                                Cell: (tableProps) => {
                                    return (
                                        <p>{tableProps.row.values.persona.nombres} {tableProps.row.values.persona.apellidos}</p>
                                    );
                                },
                            },
                            {
                                Header: "Votar",
                                id: "votar",
                                accessor: "votar",
                                Cell: (tableProps) => {
                                    return (
                                        <div style={{ minWidth: "150px" }}>
                                            <Select
                                                divClass=""
                                                selectplaceholder="Seleccione voto"
                                                selectValue={()=>{
                                                    let idCongresista = tableProps.row.values.id;
                                                    let votacion = this.state.votacion;
                                                    let congresista = votacion.votacion_congresista.filter((x)=>{ return x.congresista_id === idCongresista })[0];
                                                    
                                                    if(typeof congresista === 'undefined'){
                                                        return seleccioneVoto;
                                                    }
                                                    let t = congresista.tipo_respuesta_votacion;
                                                    if(typeof t === 'undefined' || t === null)
                                                        return seleccioneVoto;
                                                    else
                                                        return {value: t.id, label: t.nombre}
                                                }}
                                                selectOnchange={(e)=>{
                                                    if(typeof e !== 'undefined'){
                                                        let idCongresista = tableProps.row.values.id;
                                                        let votacion = this.state.votacion;
                                                        let congresista = votacion.votacion_congresista.filter((x)=>{ return x.congresista_id === idCongresista })[0];
                                                        if(typeof congresista === 'undefined'){
                                                            let voto = {
                                                                id: 0,
                                                                votacion_id: this.state.id,
                                                                congresista_id: idCongresista,
                                                                tipo_respuesta_votacion_id: typeof e !== 'undefined' ? e.value : null,
                                                                tipo_respuesta_votacion: {id: e.value, nombre: e.label, activo: 1}, 
                                                                activo: 1
                                                            }
                                                            votacion.votacion_congresista.push(voto);
                                                        }else{
                                                            votacion.votacion_congresista.forEach(x => {
                                                                if(x.congresista_id === idCongresista){
                                                                    x.tipo_respuesta_votacion_id = typeof e !== 'undefined' ? e.value : null
                                                                    x.tipo_respuesta_votacion = {id: e.value, nombre: e.label, activo: 1}
                                                                }
                                                            })
                                                        }
                                                        this.setState({votacion})
                                                    }
                                                }}
                                                selectoptions={this.state.tiposRespuesta}
                                                selectIsSearchable={false}
                                                selectclassNamePrefix="selectReact__value-container"
                                                spanClass=""
                                                spanError=""
                                            ></Select>
                                        </div>
                                    );
                                },
                            },
                            
                        ],
                    }
                ],
                hiddenColumns: ["id"],
                data: [],
                page: 1,
                rows: 5,
                search: "",
                totalRows: 0,
            },
            tiposRespuesta: [],
            votacion: {
                proyecto_de_ley: {
                    titulo: ""
                }
            }
        }
    }

    handlerSelectSi = () => {
        let tiposRespuesta = this.state.tiposRespuesta;
        if(tiposRespuesta !== null){
            let respuesta = tiposRespuesta.filter((x)=>{ return x.value === 1 })[0];
            let votacion = this.state.votacion;
            votacion.votacion_congresista.forEach(x => {
                x.tipo_respuesta_votacion_id = respuesta.value;
                x.tipo_respuesta_votacion = {id: respuesta.value, nombre: respuesta.label, activo: 1};
            })
            this.setState({votacion: votacion})
        }
    }
    handlerSelectNo = () => {
        let tiposRespuesta = this.state.tiposRespuesta;
        if(tiposRespuesta !== null){
            let respuesta = tiposRespuesta.filter((x)=>{ return x.value === 2 })[0];
            let votacion = this.state.votacion;
            votacion.votacion_congresista.forEach(x => {
                x.tipo_respuesta_votacion_id = respuesta.value;
                x.tipo_respuesta_votacion = {id: respuesta.value, nombre: respuesta.label, activo: 1};
            })
            this.setState({votacion: votacion})
        }
    }
    handlerSelectAusente = () => {
        let tiposRespuesta = this.state.tiposRespuesta;
        if(tiposRespuesta !== null){
            let respuesta = tiposRespuesta.filter((x)=>{ return x.value === 3 })[0];
            let votacion = this.state.votacion;
            votacion.votacion_congresista.forEach(x => {
                x.tipo_respuesta_votacion_id = respuesta.value;
                x.tipo_respuesta_votacion = {id: respuesta.value, nombre: respuesta.label, activo: 1};
            })
            this.setState({votacion: votacion})
        }
    }
    
    componentDidMount = async () =>{
        await this.getById(this.state.id);
    }

    getById = async (id) => {
        this.setState({ loading: true });
        let tableInfo = this.state.tableInfo;
        let tiposRespuesta = [];
        let votacion = {};
        await VotacionesDataService.getDataVotarById(id).then(response => {
            let congresistas = response.data.congresistas;
            tableInfo.data = congresistas;
            votacion = response.data.votacion;
            response.data.tipos_respuesta.forEach(i => {
                tiposRespuesta.push({ value: i.id, label: i.nombre })
            })
            tiposRespuesta.unshift({ value: null, label: "Seleccione voto" })
            // Se asignan objetos vacíos
            congresistas.forEach(congresista => {
                let finded = votacion.votacion_congresista.filter((x)=>{ return x.congresista_id === congresista.id })[0];
                if(typeof finded === 'undefined'){
                    let voto = {
                        id: 0,
                        votacion_id: this.state.id,
                        congresista_id: congresista.id,
                        tipo_respuesta_votacion_id: null,
                        tipo_respuesta_votacion: {id: 0, nombre: "Seleccione voto", activo: 1},
                        activo: 1
                    }
                    votacion.votacion_congresista.push(voto);
                }
            });
        })
        this.setState({loading: false, tableInfo: tableInfo, votacion: votacion, tiposRespuesta: tiposRespuesta});
    }
    

    saveSubmit = async () => {
        // let errors = this.state.errors;
        // errors = validForm.cleanErrors(errors);
        this.setState({ 
            // errors: errors, 
            loading: true 
        });
        let data = this.state.votacion;
        let id = this.state.id;
        let responseData = null;
        await VotacionesDataService.updateVotaciones(id, data)
                .then(response => {
                    responseData = response.data;
                })
                .catch(function (error) {
                    // errors = validForm.displayErrors(error.response.data, errors);
                });

        this.setState({ 
            // errors: errors, 
            loading: false 
        });
        if (responseData !== null) {
            this.props.history.push({
                pathname: '/votaciones'
            });
        }
    }

    render(){
        return (
            <div>
                <Spinner show={this.state.loading} />

                <ul className="breadcrumb push-down-0">
                    <li>Votaciones</li>
                    <li>Votar</li>
                </ul>
                <div className="content-frame">
                    <div className="content-frame-top">
                        <div className="rowListado">
                            <div className="panel panel-default ">
                                <div className="panel-heading">
                                    <h3 className="panel-title">
                                        <span className="fa fa-list"></span>{" "}
                                        Votaciones para <strong>{typeof this.state.votacion.proyecto_de_ley.titulo !== "undefined" ? this.state.votacion.proyecto_de_ley.titulo : "Sin título"}</strong>
                                    </h3>
                                    <ul className="panel-controls">
                                        <li>
                                            <ValidarPermiso IdModuloPermisoValidar={ModuloPermiso.Votaciones.Nuevo} DefaultTemplate={
                                                <button onClick={()=>{this.saveSubmit()}} type="button" className="btn btn-success"><i className="fa fa-check"></i> Guardar</button>
                                            } />
                                        </li>
                                    </ul>
                                </div>
                                <div className="panel-body">
                                    <ul className="panel-controls">
                                        <li>
                                            <button onClick={()=>{this.handlerSelectNo()}} type="button" className="btn btn-primary"><i className="fa fa-arrow-down"></i> Seleccionar todos No</button>
                                        </li>
                                        <li>
                                            <button onClick={()=>{this.handlerSelectAusente()}} type="button" className="btn btn-primary"><i className="fa fa-exclamation-circle"></i> Seleccionar todos Ausente</button>
                                        </li>
                                        <li>
                                            <button onClick={()=>{this.handlerSelectSi()}} type="button" className="btn btn-primary"><i className="fa fa-arrow-up"></i> Seleccionar todos Sí</button>
                                        </li>
                                    </ul>
                                </div>
                                <div className="panel-body">
                                    <div>
                                        <ValidarPermiso IdModuloPermisoValidar={ModuloPermiso.Votaciones.ObtenerTodos} DefaultTemplate={
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

export default Votar;