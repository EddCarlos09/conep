import React from 'react';
import InputPercent from "../../../Components/InputPercent";
import ProyectoLeyDataService from '../../../Services/CongresoVisible/ProyectoLey.Service';
import AuthLogin from "../../../Utils/AuthLogin";
import { Constantes } from "../../../Constants/Constantes.js";
import SunEditor from "suneditor-react";
import ValidForm from "../../../Utils/ValidForm";
import SinglePagePDFViewer from "../../../Components/pdf/single-page";
import AllPagesPDFViewer from "../../../Components/pdf/all-pages";
import samplePDF from "../../../ComprobanteCompra_3.pdf";

const observacionesConst = {id: 0, proyecto_ley_id: 0, email: '', observacionesIniciativa: ''}
const validForm = new ValidForm();
const auth = new AuthLogin();
const fieldsConst = {
    id: 0, titulo: "", alias: "",
    legislatura_id: "", cuatrienio_id: "", tipo_proyecto_id: "",
    iniciativa_id: "", numero_camara: "", numero_senado: "",
    fecha_radicacion: "", tema_id_principal: "", tema_id_secundario: '',
    corporacion_id: '', alcance_id: '', sinopsis: "",
    proyecto_ley_documentos: [],
    proyecto_ley_estado: [], proyecto_ley_autor_legislativos: [], proyecto_ley_autor_personas: [],
    proyecto_ley_ponente: [], user: auth.username(), se_acumula_a_id: '',
    tema_principal: '', tema_secundario: '', observaciones: Object.assign({}, observacionesConst)
};
let pos = { top: 0, left: 0, x: 0, y: 0 };
const partidos_ids = [];
const comisiones_ids = [];

class DetalleProyectoLey extends React.Component {
    constructor(props) {
        super(props);
        const id =
            this.props.match.params.id === undefined
                ? 0
                : this.props.match.params.id;
        this.state = {
            id: id,
            fields: fieldsConst,
            error: { observaciones : '' },
            partidos: [],
            partidoIdAcive: 0,
            subloaderAutores: false,
            searchAutores: '',
            publicaciones: [],
            tabActive: [],
            partidoPonenteActive: 0,
            subloaderPonentes: false,
            subloaderObservaciones: false,
            promedioSiVotacion: [],
            subloaderVotos: false,
            ponentes_estado_partido: [],
            comisiones: [],
            estado_proyecto_ley_id: 0
        }
    }

    componentDidMount = async () => {
        let id = this.obtenerId();
        if (id !== 0) {
            await this.getByID(id);
            await this.getObservacionesIniciativa(id);
        }
    };

    getObservacionesIniciativa = async (proyecto_id) => {
        if(localStorage.getItem('nombre_completo')){
            let email = localStorage.getItem('nombre_completo')
            await ProyectoLeyDataService.getObservacionesIniciativa(proyecto_id, email)
            .then((response) => {
                console.log(response)
                let data = response.data;
                let fields = this.state.fields;
                if(data.id)
                    fields.observaciones = data
                else
                    fields.observaciones = Object.assign({}, observacionesConst)

                console.log(fields.observaciones)
                this.setState({
                    fields
                });
            })
            .catch((e) => {
                this.setState({loading: false});
                console.log(e);
            });
        }
    }
    saveObservaciones = async (e) => {
        e.preventDefault()
        if(!localStorage.getItem('nombre_completo'))
            this.setState({error: { observaciones: 'Es necesario que vuelvas a iniciar sesión para guardar tu observación'}})
        else if(!this.state.fields.observaciones.observacionesIniciativa && this.state.fields.observaciones.observacionesIniciativa === '')
            this.setState({error: { observaciones: 'La observación no puede estar vacía'}})
        else{
            this.setState({error: {observaciones: ''}, subloaderObservaciones: true})
            let email = localStorage.getItem('nombre_completo')
            let { id, observaciones } = this.state.fields
            let data = this.state.fields.observaciones
            let responseData;
            if (data.id === 0) {
                data.email = email;
                data.proyecto_ley_id = id;
                await ProyectoLeyDataService.createObservacionesIniciativa(data)
                    .then((response) => {
                        responseData = response.data;
                    })
                    .catch(function (error) {
                        console.log(error)
                    });
            }
            else {
                await ProyectoLeyDataService.updategetObservacionesIniciativa(data.id, data)
                    .then((response) => {
                        responseData = response.data;
                    })
                    .catch(function (error) {
                        console.log(error)
                    });
            }
            this.setState({ subloaderObservaciones: false });
            if (responseData != null) {
                window.location.reload()
            }
        }
    }
    obtenerId = () => {
        let url = this.props.location.pathname;
        let urlArray = url.split("/");
        let id = 0;
        if (
            typeof urlArray[urlArray.length - 1] !== "undefined" &&
            Number.isInteger(Number.parseInt(urlArray[urlArray.length - 1]))
        ) {
            id = Number.parseInt(urlArray[urlArray.length - 1]);
        }
        return id;
    };
    getCountVotos = async (votacion) => {
        this.setState({ subloaderVotos: true });
        await ProyectoLeyDataService.getCountVotos(votacion.id)
            .then((response) => {
                let promedios = this.state.promedioSiVotacion;
                let result = response.data;
                let votos_totales = votacion.votacion_congresista.length;
                let promedio = {
                    votacion_id: votacion.id,
                    fecha_votacion: votacion.fecha,
                    count_si: result.length === 0 ? 0 : result[0].conteo,
                    porcentaje: Math.round(((result.length === 0 ? 0 : result[0].conteo) / votos_totales) * 100)
                }
                promedios.push(promedio);
                this.setState({ promedioSiVotacion: promedios, subloaderVotos: false })
            }).catch((e) => {
                console.log(e);
            });
    }
    getByID = async (id) => {
        this.setState({ loading: true, fields: fieldsConst });
        let fields = this.state.fields;
        await ProyectoLeyDataService.get(id)
            .then((response) => {
                let data = response.data;
                fields.id = data.id;
                fields.titulo = data.titulo;
                fields.alias = data.alias;
                fields.legislatura_id = data.legislatura_id;
                fields.cuatrienio_id = data.cuatrienio_id;
                fields.tipo_proyecto_id = data.tipo_proyecto_id;
                fields.tema_proyecto_ley_id = data.tema_proyecto_ley_id;
                fields.iniciativa_id = data.iniciativa_id;
                fields.numero_camara = data.numero_camara;
                fields.numero_senado = data.numero_senado;
                fields.sinopsis = data.sinopsis;
                fields.tema_principal = data.tema_principal;
                fields.tema_secundario = data.tema_secundario;
                fields.activo = data.activo;
                fields.cuatrienio = data.cuatrienio;
                fields.legislatura = data.legislatura;
                fields.iniciativa = data.iniciativa;
                fields.fecha_radicacion = data.fecha_radicacion;
                fields.tipo_proyecto_ley = data.tipo_proyecto_ley;
                fields.proyecto_ley_votacion = data.proyecto_ley_votacion;
                fields.proyecto_ley_estado = [];
                fields.proyecto_ley_documentos = data.proyecto_ley_documentos;
                fields.proyecto_ley_autor_legislativos = data.proyecto_ley_autor_legislativos;
                fields.proyecto_ley_autor_personas = data.proyecto_ley_autor_personas;
                let tabActive = ['active'];
                let partidoPonenteActive = 0;
                let estado_proyecto_ley_id = 0;
                let comisiones = [];
                if (Array.isArray(data.proyecto_ley_estado)) {
                    for (let i = 1; i < data.proyecto_ley_estado.length; i++) {
                        tabActive.push('')
                        if (data.proyecto_ley_estado[i].hasOwnProperty('comisiones') && data.proyecto_ley_estado[i].comisiones) {
                            data.proyecto_ley_estado[i].comisiones.map((item) => {
                                if (!comisiones_ids.some((comision_id) => {
                                    return comision_id === item.comision.id
                                })) {
                                    comisiones_ids.push(item.comision.id);
                                    comisiones.push(item)
                                }
                            })
                        }
                    }
                    data.proyecto_ley_estado.sort((a, b) => {
                        if (a.hasOwnProperty('orden') && b.hasOwnProperty('orden')) {
                            if (a.orden < b.orden) {
                                return -1;
                            }
                            if (a.orden > b.orden) {
                                return 1;
                            }
                        }
                        return 0;
                    });
                    data.proyecto_ley_estado.sort(function (a, b) {
                        return new Date(a.fecha) - new Date(b.fecha)
                    });
                    fields.proyecto_ley_estado = data.proyecto_ley_estado;
                    if (data.hasOwnProperty("proyecto_ley_estado") && data.proyecto_ley_estado) {
                        estado_proyecto_ley_id = data.proyecto_ley_estado[0].id;
                    }
                    for (let i = 0; data.proyecto_ley_estado.length; i++) {
                        if (data.proyecto_ley_estado[i].ponentes.length > 0) {
                            partidoPonenteActive = data.proyecto_ley_estado[i].ponentes[0].congresista?.partido?.id || 0;
                            if (partidoPonenteActive !== 0) {
                                this.show_ponentes_by_estado_partido(i, partidoPonenteActive)
                                break;
                            }
                        }
                    }
                }

                this.setState({
                    fields: fields,
                    tabActive: tabActive,
                    partidoPonenteActive: partidoPonenteActive,
                    loading: false,
                    comisiones: comisiones,
                    estado_proyecto_ley_id: estado_proyecto_ley_id
                });
            })
            .catch((e) => {
                this.setState({
                    loading: false,
                });
                console.log(e);
            });
    };

    show_ponentes_by_estado_partido = (estado_index, partido_id) => {
        let ponentes_estado_partido = [];
        if (estado_index !== undefined && partido_id !== undefined) {
            ponentes_estado_partido = this.state.fields.proyecto_ley_estado[estado_index].ponentes.filter(
                function (item) {
                    return item.congresista.partido.id === partido_id;
                }
            );
        }
        this.setState({ ponentes_estado_partido: ponentes_estado_partido })
    }

    render() {
        return (
            <>
                <main className="workspace">
                    <section className="breadcrumb lg:flex items-start">
                        <div>
                            <h1>Iniciativa - {this.state.fields.titulo}</h1>
                            <h3>Alias: {this.state.fields.alias}</h3>
                            <ul>
                                <li><a href="#">Página principal</a></li>
                                <li className="divider la la-arrow-right"></li>
                                <li><a href="#">Iniciativas Legislativas</a></li>
                                <li className="divider la la-arrow-right"></li>
                                <li>Detalle</li>
                            </ul>
                        </div>
                    </section>

                    <div className="lg:flex pageSection justify-center">
                        <div className="info">
                            <div className="itemSection">
                                <div className="lg:flex lg:-mx-4">
                                    <div className="lg:w-1/3 lg:px-4">
                                        <div
                                            className="card px-4 py-8 text-center lg:transform hover:scale-110 hover:shadow-lg transition-transform duration-200">
                                            <p className="mt-2">No. de proyecto</p>
                                            <div className="text-primary mt-1 text-xl leading-none">{this.state.fields.numero_camara || 'Sin número'}</div>
                                        </div>
                                    </div>
                                    <div className="lg:w-1/3 lg:px-4 pt-5 lg:pt-0">
                                        <div
                                            className="card px-4 py-8 text-center lg:transform hover:scale-110 hover:shadow-lg transition-transform duration-200">
                                            <p className="mt-2">Tema principal</p>
                                            <div className="text-primary mt-1 text-xl leading-none">{this.state.fields.tema_principal?.nombre || 'Sin tema principal'}</div>
                                        </div>
                                    </div>
                                    <div className="lg:w-1/3 lg:px-4 pt-5 lg:pt-0">
                                        <div
                                            className="card px-4 py-8 text-center lg:transform hover:scale-110 hover:shadow-lg transition-transform duration-200">
                                            <p className="mt-2">Tema secundario</p>
                                            <div className="text-primary mt-1 text-xl leading-none">{this.state.fields.tema_secundario?.nombre || 'Sin tema secundario'}</div>
                                        </div>
                                    </div>
                                    <div className="lg:w-1/3 lg:px-4 pt-5 lg:pt-0">
                                        <div
                                            className="card px-4 py-8 text-center lg:transform hover:scale-110 hover:shadow-lg transition-transform duration-200">
                                            <p className="mt-2">Iniciativa</p>
                                            <div className="text-primary mt-1 text-xl leading-none">{this.state.fields.iniciativa?.nombre || 'Sin iniciativa'}</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="lg:flex lg:-mx-4">
                                    <div className="lg:w-1/3 lg:px-4 pt-5 lg:pt-0">
                                        <div
                                            className="card px-4 py-8 text-center lg:transform hover:scale-110 hover:shadow-lg transition-transform duration-200">
                                            <p className="mt-2">Tipo de proyecto de ley</p>
                                            <div className="text-primary mt-1 text-xl leading-none">{this.state.fields.tipo_proyecto_ley?.nombre || 'Sin tipo'}</div>
                                        </div>
                                    </div>
                                    <div className="lg:w-1/3 lg:px-4 pt-5 lg:pt-0">
                                        <div
                                            className="card px-4 py-8 text-center lg:transform hover:scale-110 hover:shadow-lg transition-transform duration-200">
                                            <p className="mt-2">Fecha de introducción</p>
                                            <div className="text-primary mt-1 text-xl leading-none">{validForm.getColoquialDate(this.state.fields.fecha_radicacion) || 'Sin tema principal'}</div>
                                        </div>
                                    </div>
                                    <div className="lg:w-1/3 lg:px-4 pt-5 lg:pt-0">
                                        <div
                                            className="card px-4 py-8 text-center lg:transform hover:scale-110 hover:shadow-lg transition-transform duration-200">
                                            <p className="mt-2">Quinquenio</p>
                                            <div className="text-primary mt-1 text-xl leading-none">{this.state.fields.cuatrienio?.nombre || 'Sin tema secundario'}</div>
                                        </div>
                                    </div>
                                    <div className="lg:w-1/3 lg:px-4 pt-5 lg:pt-0">
                                        <div
                                            className="card px-4 py-8 text-center lg:transform hover:scale-110 hover:shadow-lg transition-transform duration-200">
                                            <p className="mt-2">Año</p>
                                            <div className="text-primary mt-1 text-xl leading-none">{this.state.fields.legislatura?.nombre || 'Sin iniciativa'}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="itemSection">
                                <h3>Sinopsis</h3>
                                <SunEditor
                                    disable={true}
                                    enableToolbar={true}
                                    showToolbar={false}
                                    width="100%"
                                    height="100%"
                                    setOptions={{ resizingBar: false, showPathLabel: false }}
                                    setContents={this.state.fields.sinopsis || ""}
                                />
                            </div>
                            <div className="itemSection">
                                <h3>Proponentes</h3>
                                <div className="autor-list-tags">
                                    {
                                        this.state.fields.proyecto_ley_autor_personas?.map((item, j) => {
                                            return (
                                                <div key={j} className="item">
                                                    <div className="avatar w-16 h-16 ml-4">
                                                        <img src={item.persona.imagenes[2] != undefined ? auth.pathApi() + item.persona.imagenes[2].imagen : Constantes.NoImagen} alt={item.persona.nombres + item.persona.apellidos} />
                                                    </div>
                                                    <div className="name">
                                                        <p><a target="_blank" href={`#/perfil-congresista/${item.persona.id}`}>{item.persona.nombres || ''}{' '}{item.persona.apellidos || ''}</a></p>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    }
                                </div>
                            </div>
                            <div className="itemSection">
                                <h3>Estados</h3>
                                {
                                    this.state.fields.proyecto_ley_estado.map((value, index, array) => {
                                        let url = '';
                                        let className = 'documento'

                                        if (value.gaceta_url) {
                                            url = auth.pathApi() + value.gaceta_url;
                                        }
                                        else {
                                            className += ' invisible'
                                        }

                                        return (
                                            <div className="subItemSection type-list" key={index}>
                                                <div className="lg:flex lg:-mx-4">
                                                    <div className="lg:w-1/2 lg:px-4">
                                                        <div
                                                            className="card px-4 py-8 text-center lg:transform hover:scale-110 hover:shadow-lg transition-transform duration-200">
                                                            <p className="mt-2">Fecha</p>
                                                            <div className="text-primary mt-1 text-xl leading-none">{validForm.getColoquialDate(value.fecha)}</div>
                                                        </div>
                                                    </div>
                                                    <div className="lg:w-1/2 lg:px-4 pt-5 lg:pt-0">
                                                        <div
                                                            className="card px-4 py-8 text-center lg:transform hover:scale-110 hover:shadow-lg transition-transform duration-200">
                                                            <p className="mt-2">Estado</p>
                                                            <div className="text-primary mt-1 text-xl leading-none">{value.tipo_estado?.nombre || ''}</div>
                                                        </div>
                                                    </div>
                                                    {/* <div className="lg:w-1/3 lg:px-4 pt-5 lg:pt-0">
                                                <div
                                                    className="card px-4 py-8 text-center lg:transform hover:scale-110 hover:shadow-lg transition-transform duration-200">
                                                    <p className="mt-2">Gaceta</p>
                                                    <div className="text-primary mt-1 text-xl leading-none">{
                                                    value.gaceta_url ?
                                                    <a href={url} className="gaceta" target="_blank">Descargar</a>
                                                    :
                                                    <p className="gaceta">Sin gaceta</p>
                                                }</div>
                                                </div>
                                            </div> */}
                                                </div>
                                                <hr />
                                                <br />
                                                <p><strong>Observaciones</strong> {value.observaciones || 'Sin observaciones'}</p>
                                            </div>
                                        );
                                    })
                                }
                            </div>

                            <div className="itemSection relative">
                                <div className={`subloader ${this.state.subloaderObservaciones ? "active" : ""}`}><div className="relative"></div></div>
                                <h3>Observaciones de la Iniciativa</h3>
                                <textarea className='form-control' rows={15} value={this.state.fields?.observaciones?.observacionesIniciativa || ''} placeholder="Escribe aquí tus observaciones ..." 
                                onChange={(e) => {
                                    let fields = this.state.fields
                                    fields.observaciones.observacionesIniciativa = e.currentTarget.value
                                    this.setState({ fields })
                                }} />
                                <p className='error'>{this.state.error.observaciones}</p>
                                <br />
                                <button onClick={(e) => {this.saveObservaciones(e)}} className='btn btn_primary uppercase mr-5 mb-5'>Guardar observación</button>
                            </div>

                            <div className="itemSection">
                                <h3>Documentos</h3>
                                {
                                    this.state.fields.proyecto_ley_documentos.map((value, index, array) => {
                                        return (
                                            <div className="subItemSection type-list" key={index}>
                                                <a href={(auth.pathApi() + value.url_archivo) } target="_blank" className="control-label">Ver documento</a>
                                                <SinglePagePDFViewer pdf={(auth.pathApi() + value.url_archivo)} />
                                                {/* <SinglePagePDFViewer pdf={samplePDF} /> */}
                                            </div>
                                        );
                                    })
                                }
                            </div>

                        </div>
                    </div>
                </main>
            </>
        )
    }
}

const mouseDownHandler = function (e) {

    pos = {
        left: e.currentTarget.scrollLeft,
        top: e.currentTarget.scrollTop,
        // Get the current mouse position
        x: e.clientX,
        y: e.clientY,
    };

    e.currentTarget.addEventListener('mousemove', mouseMoveHandler);
    e.currentTarget.addEventListener('mouseup', mouseUpHandler);
};

const mouseMoveHandler = function (e) {
    // How far the mouse has been moved
    const dx = e.clientX - pos.x;
    const dy = e.clientY - pos.y;

    // Scroll the element
    e.currentTarget.scrollTop = pos.top - dy;
    e.currentTarget.scrollLeft = pos.left - dx;
};

const mouseUpHandler = function (e, curul) {
    e.currentTarget.removeEventListener('mousemove', mouseMoveHandler);
    e.currentTarget.removeEventListener('mouseup', mouseUpHandler);
};

function toggleTimelineRow(element, target) {
    if (target.classList.contains('gaceta') || target.parentNode.classList.contains('gaceta'))
        return false;
    let rows = element.parentNode.querySelectorAll(".rowPonentes");
    rows.forEach(x => {
        x.classList.remove("active");
    });
    element.querySelector(".rowPonentes").classList.add("active")
}

export default DetalleProyectoLey;
