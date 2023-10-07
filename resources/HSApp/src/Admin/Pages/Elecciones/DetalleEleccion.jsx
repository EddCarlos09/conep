import React from 'react';
import InputPercent from "../../../Components/InputPercent";
import EleccionDataService from "../../../Services/Elecciones/Elecciones.Service";
import Spinner from "../../../Components/Spinner";
import AuthLogin from "../../../Utils/AuthLogin";
import { Constantes } from "../../../Constants/Constantes.js";
import SunEditor from "suneditor-react";
import ValidForm from "../../../Utils/ValidForm";

const auth = new AuthLogin();
const validForm = new ValidForm();

const constFileds = {
    id: 0,
    tipo_comision_id: 0,
    comision_id: 0,
    corporacion_id: 0,
    cuatrienio_id: 0,
    congresista_id: 0,
    comision_miembro_id: 0,
    comision_cargo_congresista_id: 0,
    titulo: "",
    infoGeneral: "",
    fechaDeEleccion: '',
    resultadoVotacion: '',
    imagen: null,
    candidato: [],
    user: "",
};

const DataCandidatos = {
    id: null,
    eleccion_id: null,
    congresista_id: null,
    comision_cargo_congresista_id: null,
    nombreCargo: null,
    nombre: null,
    activo: null,
};

const EstudiosModal = {
    profesion: '',
    grado_estudio : '',
    perfil_educativo: ''
};
const CongresistaDetalleModal = {
    congresista_trayectoria_publica : null,
};
const HojavidaModal = {};

class DetalleEleccion extends React.Component {
    constructor(props) {
        super(props);
        const id =
            this.props.match.params.id === undefined
                ? 0
                : this.props.match.params.id;
        this.state = {
            id: id,
            subloader: true,
            fields: constFileds,
            url: "",
            datosContactoDetalle: [],
            funcionarioDetalle: [],
            candidatosDetalle: [],
            imagesResized: [],
            dpFechaDeEleccion: new Date(),
            candidatos : [DataCandidatos],
            estudiosModal: EstudiosModal,
            congresistaDetalle: [CongresistaDetalleModal],
        };
    }

    componentDidMount = async () => {
        //this.resetFields();
        this.state.fields.id = this.state.id;
        //this.state.fields.user = auth.username();
        let id = this.state.id;
        if (id != 0)
        {
            await this.getByID(id);
        } 
        else 
        {
            //await this.getComboComision(null, null);
        }
    };

    getByID = async (id) => {
        this.setState({ subloader: true });
        await EleccionDataService.get(id)
            .then((response) => {
                let fields = this.state.fields;
                let candidatosDetalle = [];
                let funcionarioDetalle;
                console.log(response.data[0]);
                fields = response.data[0];
                funcionarioDetalle = response.data[0].funcionario_actual.congresista_elecciones.persona_elecciones;
                funcionarioDetalle.nombres = funcionarioDetalle.nombres + " " + funcionarioDetalle.apellidos;
                candidatosDetalle = fields.candidato;
                candidatosDetalle.map((item, i) =>{
                    item.congresista.persona_elecciones.nombres = item.congresista.persona_elecciones.nombres + " " + item.congresista.persona_elecciones.apellidos;  
                });
                this.setState({
                    fields: fields,
                    candidatosDetalle : candidatosDetalle,
                    funcionarioDetalle : funcionarioDetalle,
                    subloader: false,
                });
            })
            .catch((e) => {
                this.setState({
                    subloader: false,
                });
                console.log(e);
            });
    };

    renderImagenMiembro = (idCandidato) => {
        let candidato = this.state.candidatosDetalle;
        let elemento = candidato.find((x) => x.congresista_id == idCandidato);
        if (elemento != undefined) {
            let itemImagen = elemento.congresista.persona_elecciones.imagenes[2];
            if (itemImagen != undefined) {
                return itemImagen.imagen;
            }
        }
    };

    renderImagenFuncionario = (idCandidato) => {
        let funcionario = this.state.fields.funcionario_actual;
        if (funcionario != undefined) {
            let itemImagen = funcionario.congresista_elecciones.persona_elecciones.imagenes[2];
            if (itemImagen != undefined) {
                return itemImagen.imagen;
            }
        }
    };

    handlerEstudio = async (tipo , id) =>{
        let estudios = validForm.resetObject(this.state.estudiosModal);
        if(tipo === 1){
            if(this.state.funcionarioDetalle.profesion !== null)
                estudios.profesion = this.state.funcionarioDetalle.profesion.nombre;
            if(this.state.funcionarioDetalle.grado_estudio !== null)
                estudios.grado_estudio = this.state.funcionarioDetalle.grado_estudio.nombre;
            if(this.state.funcionarioDetalle.perfil_educativo !== null)
                estudios.perfil_educativo = this.state.funcionarioDetalle.perfil_educativo;
        }
        else{
            let candidato = this.state.candidatosDetalle.find((x) => x.congresista_id === id);
            console.log(candidato);
            if(candidato.congresista.persona_elecciones.profesion !== null)
                estudios.profesion = candidato.congresista.persona_elecciones.profesion.nombre;
            if(candidato.congresista.persona_elecciones.grado_estudio !== null)
                estudios.grado_estudio = candidato.congresista.persona_elecciones.grado_estudio.nombre;
            if(candidato.congresista.persona_elecciones.perfil_educativo !== null)
                estudios.perfil_educativo = candidato.congresista.persona_elecciones.perfil_educativo;

        }
        this.setState({estudiosModal: estudios});
    };

    handlerCargos = async (tipo, id) =>{
        let congresistaDetalle = [];
        if(tipo === 1){   
            if(typeof this.state.fields.funcionario_actual.congresista_elecciones !== undefined)
                congresistaDetalle = this.state.fields.funcionario_actual.congresista_elecciones.persona_elecciones;
            else
                return congresistaDetalle;
        }
        else{
            let candidato = this.state.candidatosDetalle.find((x) => x.congresista_id === id);
            if(candidato){
                if(typeof candidato.congresista !== undefined)
                    congresistaDetalle = candidato.congresista.persona_elecciones;
                else
                    return congresistaDetalle;
            }
        }
        this.setState({ congresistaDetalle : congresistaDetalle});
    };

    render() {
        return (
            <>
                <section className="CVBannerMenuContainer no-full-height bg-blue" style={{ backgroundImage: `url(${"https://www.elheraldo.co/sites/default/files/styles/width_860/public/articulo/2018/11/01/salarios_2.jpg?itok=bTPnZO68"})` }}>
                    <div className="CVBannerCentralInfo">
                        <div className="CVBanerIcon"><i className="fas fa-vote-yea"></i></div>
                        <div className="CVBannerTitle">
                            <h3>Detalles de la función electoral</h3>
                        </div>
                    </div>
                </section>
                <section gtdtarget="1" className="DetalleComisionSection text-justify no-full-height">
                <div className={`subloader ${this.state.subloader ? "active" : ""}`}></div>
                    <div className="container">
                        <div className="row">
                            <div className="col-md-8">
                                <h2>Información general</h2>
                                <hr />
                                <p>
                                <SunEditor
                                        disable = {true}
                                        enableToolbar = {true} 
                                        showToolbar = {false}
                                        width = "100%" 
                                        height = "100%"                                                              
                                        setOptions = {{resizingBar: false, showPathLabel: false }}
                                        setContents={this.state.fields.infoGeneral || ""}
                                    />
                                </p>
                            </div>
                            <div className="col-md-4 datosVotaciones">
                                <div className="dateTitle">
                                    <p>{this.state.fields.fechaDeEleccion}</p>
                                </div>
                                <div className="dato">
                                    <InputPercent noShowValue={true} value="100" color={"var(--circle-chart-color-two)"} fontColor="#000"  fontSize="2.6" />
                                    <div className="award"><i className="fas fa-trophy"></i></div>
                                    <div className="result">{!this.state.subloader ? this.state.fields.resultadoVotacion : ""}</div>
                                </div>
                                <h4 className="text-center">{!this.state.subloader ? this.state.fields.funcionario_actual.congresista_elecciones.persona_elecciones.nombres || "" : ""}</h4>
                            </div>
                        </div>
                        <div className="row">
                            <h2>Elegido</h2>
                            <div className="col-lg-12 col-md-12">
                                <div className="listadoPageContainer">
                                    <div className="container-fluid">
                                        <div className="listadoWPhotoContainer">
                                            <div className="row">
                                                <div className="col-lg-12 col-md-12">
                                                    <div className="listadoItem evenColors">
                                                        <div className="rightSide bigContent relative">
                                                            <div className="title">
                                                                <div className="photo avatar center-block">
                                                                    <img src={!this.state.subloader ? (typeof this.state.fields.funcionario_actual.congresista_elecciones.persona_elecciones.imagenes[2] !== "undefined" ? 
                                                                        auth.pathApi() + this.state.fields.funcionario_actual.congresista_elecciones.persona_elecciones.imagenes[2].imagen : Constantes.NoImagen ) : "" || ''} alt='algo anda mal' />
                                                                </div>
                                                                <h4>{!this.state.subloader ? this.state.fields.funcionario_actual.congresista_elecciones.persona_elecciones.nombres || "" : ""}</h4>
                                                            </div>
                                                            <div className="estatus md">
                                                                <p>{!this.state.subloader ? this.state.fields.funcionario_actual.comision_cargo_congresista.nombre || "Cargo no disponible" : 'Cargo no disponible'}</p>
                                                            </div>
                                                        </div>
                                                        <div className="rightSide">
                                                            <div className="tagVotaciones border-black no-full-height">
                                                                <button data-bs-toggle="modal" 
                                                                    data-bs-target="#estudios"
                                                                    onClick={() => { this.handlerEstudio(1, 0) }}>
                                                                    <div className="votacion">
                                                                        <p><i className="fas fa-graduation-cap"></i></p>
                                                                        <p>Estudios</p>
                                                                    </div>
                                                                </button>
                                                                <button data-bs-toggle="modal" 
                                                                    data-bs-target="#cargos"
                                                                    onClick={() => { this.handlerCargos(1, this.state.id) }}>
                                                                        <div className="votacion">
                                                                            <p><i className="fas fa-user-tie"></i></p>
                                                                            <p>Cargos</p>
                                                                        </div>
                                                                </button>
                                                                {/* <button data-bs-toggle="modal" 
                                                                    data-bs-target="#hojavida"
                                                                    onClick={() => { this.handlerHVidaFuncionario() }}>
                                                                        <div className="votacion">
                                                                            <p><i className="fas fa-leaf"></i></p>
                                                                            <p>H. de vida</p>
                                                                        </div>
                                                                </button> */}
                                                                {
                                                                    !this.state.subloader ? (this.state.fields.funcionario_actual.congresista_elecciones.urlHojaVida !== null ?
                                                                        <a target="_blank" href={auth.pathApi() + this.state.fields.funcionario_actual.congresista_elecciones.urlHojaVida} >
                                                                            <div className="votacion">
                                                                                <p><i className="fas fa-leaf"></i></p>
                                                                                <p>H. de vida</p>
                                                                            </div>
                                                                        </a>
                                                                    : 
                                                                    <div className="votacion">
                                                                        <p><i className="fas fa-leaf"></i></p>
                                                                        <p>Sin hoja</p>
                                                                    </div>)
                                                                    : ""
                                                                }
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <h2>Candidatos</h2>
                            <div className="col-lg-12 col-md-12">
                                <div className="listadoPageContainer">
                                    <div className="container-fluid">
                                        <div className="listadoWPhotoContainer">
                                            <div className="row">
                                                <div className="col-lg-12 col-md-12">
                                                    {
                                                        this.state.fields.candidato.map((item, i) =>{
                                                            let path = this.renderImagenMiembro(item.congresista_id) != null
                                                                        ? auth.pathApi() +
                                                                        this.renderImagenMiembro(
                                                                            item.congresista_id
                                                                        ) ||
                                                                        ""
                                                                        : Constantes.NoImagen
                                                        return(
                                                            <div key={i} className="listadoItem evenColors">
                                                                <div className="rightSide bigContent relative">
                                                                    <div className="title">
                                                                        <div className="photo avatar center-block">
                                                                            <img src={path} alt={item.congresista.nombre || ""} />
                                                                        </div>
                                                                        <h4>{item.congresista.persona_elecciones.nombres || ""}</h4>
                                                                    </div>
                                                                    <div className="estatus md">
                                                                        <p>{item.comision_cargo_congresista.nombre || 'Cargo no disponible'}</p>
                                                                    </div>
                                                                </div>
                                                                <div className="rightSide">
                                                                    
                                                                    <div className="tagVotaciones border-black no-full-height">
                                                                        <button data-bs-toggle="modal" 
                                                                            data-bs-target="#estudios"
                                                                            onClick={() => { this.handlerEstudio(2, item.congresista_id) }}>
                                                                            <div className="votacion">
                                                                                <p><i className="fas fa-graduation-cap"></i></p>
                                                                                <p>Estudios</p>
                                                                            </div>
                                                                        </button>
                                                                        <button data-bs-toggle="modal" 
                                                                            data-bs-target="#cargos"
                                                                            onClick={() => { this.handlerCargos(2, item.congresista_id) }}>
                                                                                <div className="votacion">
                                                                                    <p><i className="fas fa-user-tie"></i></p>
                                                                                    <p>Cargos</p>
                                                                                </div>
                                                                        </button>
                                                                        {
                                                                            (item.congresista.urlHojaVida !== null ?
                                                                                <a target="_blank" href={auth.pathApi() + item.congresista.urlHojaVida} >
                                                                                    <div className="votacion">
                                                                                        <p><i className="fas fa-leaf"></i></p>
                                                                                        <p>H. de vida</p>
                                                                                    </div>
                                                                                </a>
                                                                            : 
                                                                            <div className="votacion">
                                                                                <p><i className="fas fa-leaf"></i></p>
                                                                                <p>Sin hoja</p>
                                                                            </div>)
                                                                        }
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )
                                                        })
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="modal fade" id="estudios" tabIndex="-1" aria-labelledby="estudios" aria-hidden="true">
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="estudios"><i className="fas fa-graduation-cap"></i> Descripción académica</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <SunEditor
                                        disable = {true}
                                        enableToolbar = {true} 
                                        showToolbar = {false}
                                        width = "100%" 
                                        height = "100%"                                                              
                                        setOptions = {{resizingBar: false, showPathLabel: false }}
                                        setContents={this.state.estudiosModal.perfil_educativo !== "" ?
                                             this.state.estudiosModal.perfil_educativo : "Sin descripción académica"}
                                    />
                                     <div className="littleProfileCard">
                                        <div className="icon"><i className="fas fa-graduation-cap"></i></div>
                                        <div className="vertical-text">
                                        <small>Grado de estudio</small>
                                        <p>{this.state.estudiosModal.grado_estudio !== "" ? this.state.estudiosModal.grado_estudio : "Sin grado de estudio"}</p>
                                        <small>Profesión</small>
                                        <p>{this.state.estudiosModal.profesion !== "" ?  this.state.estudiosModal.profesion : "Sin profesión"}</p>
                                        </div>
                                    </div>
                                </div>
                        </div>
                    </div>
                </div>

                <div className="modal fade" id="cargos" tabIndex="-1" aria-labelledby="cargos" aria-hidden="true">
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="cargos"><i className="fas fa-user-tie"></i> Cargos</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                            <div className="verticalTab" data-ref="2">
                                <div className="info one-columns">
                                    <div className="littleSection">
                                        <div className="title"><h5>Trayectoria pública</h5></div>
                                        <hr/>
                                    </div>
                                </div>
                                <div className="info three-columns">
                                    {
                                        this.state.congresistaDetalle.persona_trayectoria_publica !== null && typeof this.state.congresistaDetalle.persona_trayectoria_publica !== "undefined" && this.state.congresistaDetalle.persona_trayectoria_publica.length > 0 ?
                                        this.state.congresistaDetalle.persona_trayectoria_publica.map((x, i) => {
                                            return (
                                                <div key={i} className="littleProfileCard wpadding relative">
                                                    <div className="icon"><img src={typeof x.partido.partido_imagen[0] !== 'undefined' && x.partido.partido_imagen.length > 0 ? auth.pathApi() + x.partido.partido_imagen[0].imagen : ""} alt=""/></div>
                                                    <div className="description">
                                                        <p><strong>Partido:</strong> {x.partido !== null ? x.partido.nombre : ""}</p>
                                                        <p><strong>Cargo:</strong> {x.cargo || ''}</p>
                                                        <p><strong>Fecha de ocupación:</strong> {x.fecha || ''}</p>
                                                    </div>
                                                    <div className={`aplicaPartido ${x.aplica === 0 ? "no" : "si"}`}>
                                                        <p><i className={`fas fa-${x.aplica === 0 ? "times" : "check"}`}></i> {x.aplica === 0 ? "No aplica cargo" : "Aplica cargo"}</p>
                                                    </div>
                                                </div>
                                            )
                                        })
                                        :
                                        <p>Sin trayectoria asignada</p>
                                    }
                                </div>

                                <div className="info one-columns">
                                    <div className="littleSection">
                                        <div className="title"><h5>Trayectoria privada</h5></div>
                                        <hr/>
                                    </div>
                                </div>
                                <div className="info three-columns">
                                    {
                                        this.state.congresistaDetalle.persona_trayectoria_privada !== null && typeof this.state.congresistaDetalle.persona_trayectoria_privada !== "undefined" && this.state.congresistaDetalle.persona_trayectoria_privada.length > 0?
                                        this.state.congresistaDetalle.persona_trayectoria_privada.map((x, i) => {
                                            return (
                                                <div key={i} className="littleProfileCard wpadding relative">
                                                    <div className="description">
                                                        <p><strong>Cargo:</strong> {x.cargo || ''}</p>
                                                        <p><strong>Fecha de ocupación:</strong> {x.fecha || ''}</p>
                                                    </div>
                                                    <div className={`aplicaPartido ${x.aplica === 0 ? "no" : "si"}`}>
                                                        <p><i className={`fas fa-${x.aplica === 0 ? "times" : "check"}`}></i> {x.aplica === 0 ? "No aplica cargo" : "Aplica cargo"}</p>
                                                    </div>
                                                </div>
                                            )
                                        })
                                        :
                                        <p>Sin trayectoria asignada</p>
                                    }
                                </div>
                            </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="modal fade" id="hojavida" tabIndex="-1" aria-labelledby="hojavida" aria-hidden="true">
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="hojavida"><i className="fas fa-leaf"></i> Hoja de vida</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Corrupti possimus sapiente eveniet sed nulla quibusdam perferendis ipsum delectus. Sit magnam odio laudantium, fugiat corrupti impedit voluptatibus error obcaecati placeat quis.
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}

export default DetalleEleccion;