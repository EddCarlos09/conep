import React, { Component } from 'react';
import OpinionDataService from "../../../Services/ContenidoMultimedia/Opinion.Service";
import { Constantes, TypeCombos } from "../../../Constants/Constantes.js";
import AuthLogin from "../../../Utils/AuthLogin";
import SunEditor from "suneditor-react";

const auth = new AuthLogin();
class DetalleOpinionCongresista extends Component {
    constructor(props) {
        super(props);
        const id =
            this.props.match.params.id === undefined
                ? 0
                : this.props.match.params.id;
        this.state = {
            id: id,
            loading: false,
            data: {},
            imagenes:[],
            icono:"",
            imagenEquipo:[]
        }
    }
    componentDidMount = async () => {
        let header = document.querySelector("header");
        let mainP = document.querySelector(".mainPublicationContainer");
        let pubSide = document.querySelector(".publicationsSide");
        if (header)
            header.classList.add("small")

        if (mainP && pubSide) {
            setTimeout(() => {
                mainP.classList.add("active");
                pubSide.classList.add("active");
            }, 500);
        }
        let id = this.state.id;
        if (id != 0)
            await this.getById(id);
    }
    componentWillUnmount() {
        let header = document.querySelector("header");
        let mainP = document.querySelector(".mainPublicationContainer");
        let pubSide = document.querySelector(".publicationsSide");
        if (header)
            header.classList.remove("small")

        if (mainP && pubSide) {
            mainP.classList.remove("active");
            pubSide.classList.remove("active");
        }
    }

    // metodos
    getById = async (id) => {
        this.setState({ loading: true });      
        await OpinionDataService.getOpinionCongresista(id)
            .then((response) => {               
                let data = this.state.data;                
                data = response.data[0];  
                this.state.imagenes = data.opinion_congresista_imagen[0];
                this.state.icono = data.tipo_publicacion.icono;                
                // this.state.imagenEquipo = data.equipo.equipo_imagen[0];
                console.log(response.data[0]);
                this.setState({
                    data: data,
                    loading: false,
                });
            })
            .catch((e) => {
                console.error(e);
            });         
    }

    render() {
        return (
            <>
                <section className="nuestraDemocraciaSection">
                    <div className="mainPublicationContainer">
                        <div className="photo">
                            <img src={auth.pathApi() + this.state.imagenes.imagen} alt="opinion imagen" />                            
                        </div>
                        <div className="subinfo">
                            <div className="date">
                                <p>{this.state.data.fechaPublicacion}</p>
                            </div>
                        </div>

                    </div>
                    <div className="publicationsSide">
                        <div className="lineShadow"></div>
                        <div className="publicationDetail">
                            <div className="CMTitle">                                
                                <h3>{!this.state.loading ? " "+this.state.data.titulo : ""}</h3>
                            </div> 
                            <div className="autor">
                                <div className="photo avatar">                                    
                                    <img src={!this.state.loading ? (typeof this.state.data.persona?.imagenes[0] !== "undefined" ? auth.pathApi() + this.state.data.persona.imagenes[0].imagen : Constantes.NoImagen): ""} alt="congresista" />
                                </div>
                                {!this.state.loading ? this.state.data.persona?.nombres + " " + this.state.data.persona?.apellidos :""}
                            </div>                          
                            <div className="description pd-25">  
                                <strong>Resumen:</strong>
                                <SunEditor
                                    disable = {true}
                                    enableToolbar = {true} 
                                    showToolbar = {false}
                                    width = "100%" 
                                    height = "100%"                                                              
                                    setOptions = {{resizingBar: false, showPathLabel: false }}
                                    setContents={!this.state.loading ? (this.state.data.resumen): "Sin resumen"}
                                />           
                                <hr/>                                                                                                                       
                                <SunEditor
                                    disable = {true}
                                    enableToolbar = {true} 
                                    showToolbar = {false}
                                    width = "100%" 
                                    height = "100%"                                                              
                                    setOptions = {{resizingBar: false, showPathLabel: false }}
                                    setContents={!this.state.loading ? (this.state.data.opinion ): "Sin descripción"}
                                />                                                                                                                         
                            </div>
                        </div>
                    </div>
                </section>
                <div style={{ clear: "both" }}></div>
            </>
        )
    }
}

export default DetalleOpinionCongresista;
