import React from 'react';
import DetalleBalanceCuatrienioDataService from "../../../Services/ContenidoMultimedia/DetalleBalanceCuatrienio.Service";
import { Constantes, TypeCombos } from "../../../Constants/Constantes.js";
import AuthLogin from "../../../Utils/AuthLogin";
import SunEditor from 'suneditor-react';

const auth = new AuthLogin();
class DetalleBalanceInforme extends React.Component {
    constructor(props) {
        super(props);
        const id = this.props.match.params.id === undefined ? 0 : this.props.match.params.id;
        this.state={
            id: id,
            subloader: true,
            data: {}
        }
    }
    // Handlers

    // 
    componentDidMount = async() =>{
        // estheticIn();
        await this.getByID(this.state.id);
    }
    // componentWillUnmount() {
    //     estheticOut();
    // }
    //  
    // Métodos
    getByID = async (id) => {
        this.setState({ subloader: true });
        await DetalleBalanceCuatrienioDataService.getInformeById(id)
            .then(response => {
                console.log(response.data);
                this.setState({
                    data: response.data,
                    subloader: false,
                });
            })
            .catch(e => {
                this.setState({
                    subloader: false
                });
                console.log(e);
            });
    }
    // 
    render() {
        return (
            <>
                <section className="CVBannerMenuContainer no-full-height bg-blue" style={{ backgroundImage: `url(${!this.state.subloader ? (typeof this.state.data.imagen[3] !== undefined ? auth.pathApi() + this.state.data.imagen[3].imagen : Constantes.NoImagenPicture) : ""})` }}>
                    <div className="CVBannerCentralInfo">
                        <div className="CVBanerIcon littleIcon"><i className="fas fa-file-alt"></i></div>
                        <div className="CVBannerTitle text-center">
                            <h3>{!this.state.subloader ? (this.state.data.titulo) : ""}</h3>
                        </div>
                    </div>
                </section>
                
                <section className="nuestraDemocraciaSection">
                    <div className="listadoPageContainer">
                    <div className="container">
                        <div className={`subloader ${this.state.loading ? "active" : ""}`}></div>
                        <div className="row">
                            <div className="col-md-12">
                            <div className="autor" style={{
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    margin: "15px 0"
                    }}>
                    <div className="photo avatar" style={{marginRight: "13px"}}>
                        <img src={!this.state.subloader ? (typeof this.state.data.equipo.equipo_imagen[0] !== "undefined" ? auth.pathApi() + this.state.data.equipo.equipo_imagen[0].imagen : Constantes.NoImagen) : ""} alt="CV" />
                    </div>
                    {!this.state.subloader ? this.state.data.equipo.nombre : ""}
                    </div>
                            <strong>Autores:</strong>
                            <p>{!this.state.subloader ? (this.state.data.autores) : "Sin autores"}</p>
                            <strong>Fecha de publicación:</strong>
                            <p>{!this.state.subloader ? this.state.data.fechaPublicacion : ""}</p>
                            <strong>Fuente:</strong>
                            <p>{!this.state.subloader ? (this.state.data.fuente) : "Sin fuente"}</p>
                            <strong>Resumen:</strong>
                            <SunEditor
                                disable = {true}
                                enableToolbar = {true} 
                                showToolbar = {false}
                                width = "100%" 
                                height = "100%"                                                              
                                setOptions = {{resizingBar: false, showPathLabel: false, shortcutsDisable: true }}
                                setContents={!this.state.subloader ? (this.state.data.resumen) : "Sin resumen"}
                            />
                            <hr/>
                            <SunEditor
                                disable = {true}
                                enableToolbar = {true} 
                                showToolbar = {false}
                                width = "100%" 
                                height = "100%"                                                              
                                setOptions = {{resizingBar: false, showPathLabel: false, shortcutsDisable: true }}
                                setContents={!this.state.subloader ? (this.state.data.textoPublicacion) : "Sin descripción"}
                            />
                            </div>
                        </div>
                    </div>
                </div>
                   
                </section>
                <div style={{ clear: "both" }}></div>
            </>
        )
    }
}

function estheticIn() {
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
}

function estheticOut() {
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

export default DetalleBalanceInforme;