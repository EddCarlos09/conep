import React from 'react';
import ControlPoliticoDataService from "../../../Services/ControlPolitico/ControlPolitico.Service";
import UtilsDataService from "../../../Services/General/Utils.Service";
import AuthLogin from "../../../Utils/AuthLogin";
import SunEditor from 'suneditor-react';
import { Constantes } from "../../../Constants/Constantes.js";
import { escapeLeadingUnderscores } from 'typescript';

const auth = new AuthLogin();

const controlPoliticoConst = {
    id: 0,
    legislatura_id: 0,
    cuatrienio_id: 0,
    estado_control_politico_id: 0,
    comision_id: 0,
    titulo: "",
    fecha: '',
    cuatrienio: {},
    comision: {},
    corporacion: {},
    legislatura: {},
    estado_control_politico: {},
    tema_principal_control_politico: {},
    tema_secundario_control_politico: {},
    control_politico_proposiciones: [],
    control_politico_respuestas: [],
    control_politico_documentos: [],
    control_politico_citantes: [],
    control_politico_citados: [],
    control_politico_tags: []
}
class DetalleControlPolitico extends React.Component {
    constructor(props) {
        super(props);
        const id =
            this.props.match.params.id === undefined
                ? 0
                : this.props.match.params.id;
        this.state = {
            id: id,
            controlPolitico: controlPoliticoConst,
            loading: false,
            subloaderCitados: false,
            subloaderCitantes: false,
            searchCitados: '',
            searchCitantes: ''
        }
    }

    componentDidMount = async () => {
        let id = this.state.id;
        if (id != 0) await this.getByID(id);
    }

    getByID = async (id) => {
        this.setState({ loading: true });
        await ControlPoliticoDataService.get(id)
            .then((response) => {
                let controlPolitico = this.state.controlPolitico;
                controlPolitico = response.data[0];
                console.log(response.data[0]);
                this.setState({
                    controlPolitico
                });
            })
            .catch((e) => {
                console.log(e);
            });
        this.setState({ loading: false });
    };

    getCitantesFilter = async () => {

        this.timeout = setTimeout(async function () {
            this.setState({ subloaderCitantes: true });
            await ControlPoliticoDataService.getCitantesFilter(this.state.searchCitantes, this.state.id)
                .then((response) => {
                    let controlPolitico = this.state.controlPolitico;
                    controlPolitico.control_politico_citantes = response.data;
                    this.setState({ controlPolitico });
                }).catch((e) => {
                    console.log(e);
                });
            this.setState({ subloaderCitantes: false });
        }.bind(this), 500);
    }

    getCitadosFilter = async () => {

        this.timeout = setTimeout(async function () {
            this.setState({ subloaderCitados: true });
            await ControlPoliticoDataService.getCitadosFilter(this.state.searchCitados, this.state.id)
                .then((response) => {
                    let controlPolitico = this.state.controlPolitico;
                    controlPolitico.control_politico_citados = response.data;
                    this.setState({ controlPolitico });
                }).catch((e) => {
                    console.log(e);
                });
            this.setState({ subloaderCitados: false });
        }.bind(this), 500);
    }

    render() {
        return (
            <>
                <section className="CVBannerMenuContainer no-full-height bg-blue" style={{ backgroundImage: `url(${"https://www.definicionabc.com/wp-content/uploads/politica/Proyecto-de-Ley.jpg"})` }}>
                    <div className="CVBannerCentralInfo">
                        <div className="CVBanerIcon"><i className="fas fa-exclamation-circle"></i></div>
                        <div className="CVBannerTitle text-center">
                            <h3>{this.state.controlPolitico?.titulo}</h3>
                        </div>
                    </div>
                </section>
                <section gtdtarget="1" className="text-justify no-full-height">
                    <div className="container">
                    <div className={`subloader ${this.state.loading ? "active" : ""}`}></div>
                        <div className="row">
                            <div className="col-md-7">
                                <h2>Información general</h2>
                                <hr />
                                <div className="two-columns">
                                    <div className="littleProfileCard">
                                        <div className="icon"><i className="fas fa-graduation-cap"></i></div>
                                        <div className="vertical-text">
                                            <small>Cuatrienio</small>
                                            <p>{this.state.controlPolitico?.cuatrienio.nombre}</p>
                                        </div>
                                    </div>
                                    <div className="littleProfileCard">
                                        <div className="icon"><i className="fas fa-graduation-cap"></i></div>
                                        <div className="vertical-text">
                                            <small>Estado</small>
                                            <p>{this.state.controlPolitico?.estado_control_politico.nombre}</p>
                                        </div>
                                    </div>
                                    <div className="littleProfileCard">
                                        <div className="icon"><i className="fas fa-graduation-cap"></i></div>
                                        <div className="vertical-text">
                                            <small>Tema principal</small>
                                            <p>{this.state.controlPolitico?.tema_principal_control_politico.nombre}</p>
                                        </div>
                                    </div>
                                    <div className="littleProfileCard">
                                        <div className="icon"><i className="fas fa-graduation-cap"></i></div>
                                        <div className="vertical-text">
                                            <small>Tema secundario</small>
                                            <p>{this.state.controlPolitico?.tema_secundario_control_politico.nombre}</p>
                                        </div>
                                    </div>
                                    <div className="littleProfileCard">
                                        <div className="icon"><i className="fas fa-graduation-cap"></i></div>
                                        <div className="vertical-text">
                                            <small>Número de proposición</small>
                                            <p>{this.state.controlPolitico?.numero_proposicion}</p>
                                        </div>
                                    </div>
                                    <div className="littleProfileCard">
                                        <div className="icon"><i className="fas fa-graduation-cap"></i></div>
                                        <div className="vertical-text">
                                            <small>Legislatura</small>
                                            <p>{this.state.controlPolitico?.legislatura.nombre}</p>
                                        </div>
                                    </div>
                                    <div className="littleProfileCard">
                                        <div className="icon"><i className="fas fa-graduation-cap"></i></div>
                                        <div className="vertical-text">
                                            <small>Fecha</small>
                                            <p>{this.state.controlPolitico?.fecha}</p>
                                        </div>
                                    </div>
                                </div>
                                <h2>Detalles</h2>
                                <hr />
                                <SunEditor
                                    disable = {true}
                                    enableToolbar = {true} 
                                    showToolbar = {false}
                                    width = "100%" 
                                    height = "100%"                                                              
                                    setOptions = {{resizingBar: false, showPathLabel: false, shortcutsDisable: true }}
                                    setContents={this.state.controlPolitico?.detalles || 'Sin detalle'}
                                />
                                <hr />
                                <div className="container-fluid">
                                    <div className="row">
                                        <div className="col-md-6">
                                            <h5>Cuestionarios</h5>
                                            <div className="listDocumentos text-left no-icons">
                                                <ul>
                                                    {
                                                        this.state.controlPolitico?.control_politico_proposiciones.map((item, i) => {
                                                            return (
                                                                <a key={i} href={auth.pathApi() + item.url} target="_blank">
                                                                    <li><i className="fa fa-download"></i>{item.nombre}</li>
                                                                </a>
                                                            );
                                                        })
                                                    }
                                                </ul>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <h5>Respuestas</h5>
                                            <div className="listDocumentos text-left no-icons">
                                                <ul>
                                                    {
                                                        this.state.controlPolitico?.control_politico_respuestas.map((item, i) => {
                                                            return (
                                                                <a key={i} href={auth.pathApi() + item.url} target="_blank">
                                                                    <li><i className="fa fa-download"></i>{item.nombre}</li>
                                                                </a>
                                                            );
                                                        })
                                                    }
                                                </ul>
                                            </div>
                                        </div>
                                        <div className="col-md-12">
                                            <hr />
                                            <h5>Gacetas</h5>
                                            <div className="two-columns ">
                                                <div className="listDocumentos text-left no-icons">
                                                    <ul>
                                                        {
                                                            this.state.controlPolitico?.control_politico_documentos.map((item, i) => {
                                                                return (
                                                                    <a key={i} href={auth.pathApi() + item.url} target="_blank">
                                                                        <li><i className="fa fa-download"></i>{item.nombre}</li>
                                                                    </a>
                                                                );
                                                            })
                                                        }
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-5">
                                <h3>Tags</h3>
                                <div className="publicationTags">
                                    {
                                        this.state.controlPolitico?.control_politico_tags.map((item, i) =>{
                                            return (
                                                <p>{item.glosario_legislativo[0].palabra}</p>
                                            );
                                        })
                                    }
                                </div>
                                <h3>Citantes</h3>
                                <div className="miembrosContainer">
                                    <div className={`subloader ${this.state.subloaderCitantes ? "active" : ""}`}></div>
                                    <div className="buscador">
                                        <div className="input-group">
                                            <input
                                                value={this.state.searchCitantes || ""}
                                                type="text"
                                                placeholder="Escriba para buscar"
                                                className="form-control"
                                                aria-label="Dollar amount (with dot and two decimal places)"
                                                onChange={async (e) => {
                                                    let search = e.target.value;
                                                    this.setState({ searchCitantes: search });
                                                }
                                                }
                                                onKeyUp={async (e) => {
                                                    if (e.key === "Enter") {
                                                        await this.getCitantesFilter();
                                                    }
                                                }}
                                            />
                                            <span className="input-group-text"><button onClick={async () => { await this.getCitantesFilter() }} type="button" className="btn btn-primary"><i className="fa fa-search"></i></button></span>
                                        </div>
                                    </div>
                                    <div className="miembros">
                                        {
                                            this.state.controlPolitico?.control_politico_citantes.map((item, i) => {
                                                return (
                                                    <div className="item" key={i}>
                                                        <div className="photo">
                                                            <img src={item.congresista.persona.imagenes[1] != undefined ? auth.pathApi() + item.congresista.persona.imagenes[1].imagen : Constantes.NoImagenPicture} alt={item.congresista.persona.nombres} />
                                                        </div>
                                                        <div className="subphoto">
                                                            <img src={item.congresista.partido.partido_imagen[0] != undefined ? auth.pathApi() + item.congresista.partido.partido_imagen[0].imagen : Constantes.NoImagen} alt={item.congresista.partido.nombre} />
                                                        </div>
                                                        <div className="info">
                                                            <div className="name"><p>{`${item.congresista.persona.nombres} ${item.congresista.persona.apellidos}`}</p></div>
                                                            {/* <div className="job"><p>Presidencia</p></div> */}
                                                        </div>
                                                        <div className="link">
                                                            <a href={`#/perfil-congresista/${item.congresista_id}`} className="linkButton center"><i className="fas fa-chevron-right"></i></a>
                                                        </div>
                                                    </div>
                                                );
                                            })
                                        }
                                    </div>
                                </div>
                                <hr />
                                <h3>Citados</h3>
                                <hr />
                                <div className="miembrosContainer">
                                <div className={`subloader ${this.state.subloaderCitados ? "active" : ""}`}></div>
                                    <div className="buscador">
                                        <div className="input-group">
                                            <input
                                                value={this.state.searchCitados || ""}
                                                type="text"
                                                placeholder="Escriba para buscar"
                                                className="form-control"
                                                aria-label="Dollar amount (with dot and two decimal places)"
                                                onChange={async (e) => {
                                                    let search = e.target.value;
                                                    this.setState({ searchCitados: search });
                                                }
                                                }
                                                onKeyUp={async (e) => {
                                                    if (e.key === "Enter") {
                                                        await this.getCitadosFilter();
                                                    }
                                                }}
                                            />
                                            <span className="input-group-text"><button onClick={async () => { await this.getCitadosFilter() }} type="button" className="btn btn-primary"><i className="fa fa-search"></i></button></span>
                                        </div>
                                    </div>
                                    <div className="miembros">
                                        {
                                            this.state.controlPolitico?.control_politico_citados.map((item, i) => {
                                                return (
                                                    <div className="item" key={i}>
                                                        <div className="photo">
                                                            <img src={item.persona.imagenes[1] != undefined ? auth.pathApi() + item.persona.imagenes[1].imagen : Constantes.NoImagenPicture} alt={item.nombre} />
                                                        </div>
                                                        {/* <div className="subphoto">
                                                            <img src={item.congresista.partido.partido_imagen[0] != undefined ? item.congresista.partido.partido_imagen[0].imagen : Constantes.NoImagen} alt={item.congresista.partido.nombre} />
                                                        </div> */}
                                                        <div className="info">
                                                            <div className="name"><p>{`${item.persona.nombres} ${item.persona.apellidos}`}</p></div>
                                                            {/* <div className="job"><p></p></div> */}
                                                        </div>
                                                    </div>
                                                );
                                            })
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </>
        )
    }
}

export default DetalleControlPolitico;