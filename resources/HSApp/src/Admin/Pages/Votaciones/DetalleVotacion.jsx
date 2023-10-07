import React from 'react';
import Select from '../../../Components/Select';
import SelectCurul from '../../../Components/SelectCurul';
import VotacionesDataService from "../../../Services/Votaciones/Votaciones.Service";
import AuthLogin from "../../../Utils/AuthLogin";
import { Constantes } from "../../../Constants/Constantes.js"
import InputPercent from "../../../Components/InputPercent";
import SunEditor from 'suneditor-react';
const auth = new AuthLogin();

class DetalleVotacion extends React.Component {
    constructor(props) {
        super(props);
        const id = this.props.match.params.id === undefined ? 0 : this.props.match.params.id;
        this.state = {
            id: id,
            subloader: true,
            data: {},
            tiposRespuestas: [],
            curulData: []
        }
    }

    // Handlers

    //
    componentDidMount = async () => {
        await this.getByID(this.state.id);
        await this.getComboTipoRespuestaVotacion();
        if (this.state.data.esPlenaria === 1) {
            await this.getCurulesInVotacion(this.state.id, this.state.data.cuatrienio_id, this.state.data.votacion_plenaria.corporacion_id);
        }
        this.setState({ subloader: false })
    }
    //

    // Métodos
    getByID = async (id) => {
        this.setState({ subloader: true });
        await VotacionesDataService.get(id)
            .then(response => {
                console.log(response.data);
                this.setState({
                    data: response.data,
                });
            })
            .catch(e => {
                this.setState({
                    subloader: false
                });
                console.log(e);
            });
    }
    getComboTipoRespuestaVotacion = async () => {
        this.setState({ subloader: true })
        await VotacionesDataService.getComboTipoRespuestaVotacion().then(response => {
            this.setState({ tiposRespuestas: response.data });
        })
    }
    getCurulesInVotacion = async (idvotacion, cuatrienio, corporacion) => {
        this.setState({ subloader: true })
        let curulData = [];
        await VotacionesDataService.getCurulesInVotacion(idvotacion, cuatrienio, corporacion).then(response => {
            let curules = response.data;
            curules.forEach(x => {
                if (x.congresista !== null) {
                    let tipo = this.state.data.votacion_congresista.find((c) => { return c.congresista_id === x.congresista.id });
                    if(typeof tipo !== "undefined")
                        Object.assign(x.congresista, { tipo_respuesta_votacion_id: tipo.tipo_respuesta_votacion_id })
                }
            })
            curulData = curules;
        })
        this.setState({ curulData: curulData })
    }

    //
    render() {
        return (
            <>
                {/* <Spinner show={this.state.loading} /> */}
                <div className="topPanel">
                    <div className="pageTitle">
                        <h3>Detalles de la votación</h3>
                    </div>
                </div>
                <div className="listadoPageContainer">
                    <div className="container">

                        {
                            !this.state.subloader ?
                                <div className="row">
                                    <div className="col-md-12">
                                        <h4>Proyecto: {this.state.data.proyecto_de_ley.titulo || "Sin título"}</h4>
                                    </div><div className="col-md-12">
                                        <strong>Estado del proyecto: </strong>
                                        <p>{this.state.data.votacion_estado.estado.tipo_estado.nombre || "Sin acta"}</p>
                                    </div>
                                    <div className="col-md-12">
                                        <strong>Síntesis:</strong>
                                        <SunEditor
                                            disable={true}
                                            enableToolbar={true}
                                            showToolbar={false}
                                            width="100%"
                                            height="100%"
                                            setOptions={{ resizingBar: false, showPathLabel: false, shortcutsDisable: true }}
                                            setContents={this.state.data.proyecto_de_ley.sinopsis || 'Sin resumen'}
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <strong>Acta: </strong>
                                        <p>{this.state.data.acta || "Sin acta"}</p>
                                    </div>
                                    <div className="col-md-6">
                                        <strong>Cuatrienio: </strong>
                                        <p>{this.state.data.cuatrienio.nombre || "Sin quinquenio"}</p>
                                    </div>
                                    <div className="col-md-6">
                                        <strong>Legislatura: </strong>
                                        <p>{this.state.data.legislatura.nombre || "Sin legislatura"}</p>
                                    </div>
                                    <div className="col-md-6">
                                        <strong>Tipo de votación: </strong>
                                        <p>{this.state.data.tipo_votacion.nombre || "Sin tipo"}</p>
                                    </div>
                                    <div className="col-md-6">
                                        <strong>Clase de votación: </strong>
                                        <p>{this.state.data.clase_votacion.nombre || "Sin clase"}</p>
                                    </div>
                                    {
                                        this.state.data.esPlenaria === 1 ?
                                            <div className="col-md-6">
                                                <strong>Corporación: </strong>
                                                <p>{this.state.data.votacion_plenaria.corporacion.nombre || "Sin corporacion"}</p>
                                            </div>
                                            :
                                            <div className="col-md-6">
                                                <strong>Corporación: </strong>
                                                <p>{this.state.data.votacion_comision.corporacion.nombre || "Sin corporación"}</p>
                                            </div>

                                    }
                                    {
                                        this.state.data.esComision === 1 ?
                                            <div className="col-md-6">
                                                <strong>Comisión: </strong>
                                                <p>{this.state.data.votacion_comision.comision.nombre || "Sin comisión"}</p>
                                            </div> : ""
                                    }
                                    <div className="col-md-6">
                                        <strong>Motivo: </strong>
                                        <p>{this.state.data.motivo || "Sin motivo"}</p>
                                    </div>
                                    <div className="col-md-12">
                                        <strong>Observaciones:</strong>
                                        <SunEditor
                                            disable={true}
                                            enableToolbar={true}
                                            showToolbar={false}
                                            width="100%"
                                            height="100%"
                                            setOptions={{ resizingBar: false, showPathLabel: false, shortcutsDisable: true }}
                                            setContents={this.state.data.observaciones || 'Sin onservación'}
                                        />
                                    </div>
                                </div>
                                : ""
                        }
                        <hr />
                        {
                            !this.state.subloader ?
                                this.state.data.voto_general === 1 ?
                                    <>
                                        <div className="row datosVotaciones">
                                            <div className="col-md-4 ">
                                                <div className="dato">
                                                    <InputPercent value={100} noShowValue={true} color={"var(--circle-chart-color-two)"} fontColor="#000" fontSize="2.6" />
                                                    <div className="desc">
                                                        <p className="text-center">{'SI'}: {this.state.data.votosFavor}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-4 ">
                                                <div className="dato">
                                                    <InputPercent value={100} noShowValue={true} color={"var(--circle-chart-color-two)"} fontColor="#000" fontSize="2.6" />
                                                    <div className="desc">
                                                        <p className="text-center">{'NO'}: {this.state.data.votosContra}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-4 ">
                                                <div className="dato">
                                                    <InputPercent value={100} noShowValue={true} color={"var(--circle-chart-color-two)"} fontColor="#000" fontSize="2.6" />
                                                    <div className="desc">
                                                        <p className="text-center">{'Abstención'}: {this.state.data.votosAbstencion}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-4 ">
                                                <div className="dato">
                                                    <InputPercent value={100} noShowValue={true} color={"var(--circle-chart-color-two)"} fontColor="#000" fontSize="2.6" />
                                                    <div className="desc">
                                                        <p className="text-center">{'Ausentes'}: {this.state.data.numero_no_asistencias}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-4 ">
                                                <div className="dato">
                                                    <InputPercent value={100} noShowValue={true} color={"var(--circle-chart-color-two)"} fontColor="#000" fontSize="2.6" />
                                                    <div className="desc">
                                                        <p className="text-center">{'Asistencias'}: {this.state.data.numero_asistencias}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-4 ">
                                                <div className="dato">
                                                    <InputPercent value={100} noShowValue={true} color={"var(--circle-chart-color-two)"} fontColor="#000" fontSize="2.6" />
                                                    <div className="desc">
                                                        <p className="text-center">{'Aprobada'}: {this.state.data.aprobada}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        
                                    </>
                                    :  <div className="row datosVotaciones">
                                    {
                                        !this.state.subloader && this.state.tiposRespuestas !== null && this.state.tiposRespuestas.length !== 0 && typeof this.state.tiposRespuestas !== 'undefined' ?
                                            this.state.tiposRespuestas.map((res, y) => {
                                                let conteo = this.state.data.votacion_congresista.filter((v) => { return v.tipo_respuesta_votacion_id === res.id }).length;
                                                let total = this.state.data.votacion_congresista.length;
                                                let color = getColor(res.id);
                                                return (
                                                    <div key={y} className="col-md-4 ">
                                                        <div className="dato">
                                                            <InputPercent value={(conteo / total) * 100} color={color} fontColor="#000" fontSize="2.6" />
                                                            <div className="desc">
                                                                <p className="text-center">{res.nombre}: {conteo} ({((conteo / total) * 100).toFixed(2)}%)</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            })
                                            : <p>No hay votaciones</p>
                                    }
                                </div>
                                : ""
                        }
                        <div className="row">
                            <div className="col-md-12">
                                {
                                    !this.state.subloader && this.state.data.urlGaceta !== null ?
                                        <a target="_blank" className="btn btn-primary center-block" href={this.state.data.urlGaceta !== "" ? auth.pathApi() + this.state.data.urlGaceta : "/#"}>
                                            <i className="fas fa-download"></i> Descargar gaceta
                                    </a> :
                                        <button type="button" className="btn btn-primary center-block">Sin gaceta</button>
                                }
                            </div>
                        </div>
                        <hr />
                        {
                            !this.state.subloader ?
                                this.state.data.voto_general === 0 ?
                                    <>
                                        <div className="centerTabs">
                                            <ul>
                                                {
                                                    !this.state.subloader ?
                                                        (this.state.data.esPlenaria === 1 ? <li onClick={(e) => { changeTab(e) }} className="active" data-ref="1">Curules</li> : "")
                                                        : ""
                                                }
                                                <li onClick={(e) => { changeTab(e) }} className={!this.state.subloader ? (this.state.data.esComision === 1 ? "active" : "") : ""} data-ref="2">Lista</li>
                                            </ul>
                                        </div>
                                        <div className="contentForCenterTabs">
                                            <div className={`subloader ${this.state.subloader ? "active" : ""}`}></div>
                                            {
                                                this.state.data.esPlenaria === 1 ?
                                                    <div className="contentTab active" data-ref="1">
                                                        <h3 className="text-center tabsTitle">{!this.state.subloader ? this.state.data.votacion_plenaria.corporacion.nombre : ""}</h3>
                                                        <SelectCurul corporacion={!this.state.subloader ? this.state.data.votacion_plenaria.corporacion_id : ""} esVotacion={true} linkToClickCurul={"#/perfil-congresista"} data={this.state.curulData} curules={this.state.curulData} curulSelectable={false} origen={auth.pathApi()} />
                                                    </div>
                                                    : ""
                                            }
                                            <div className={`contentTab ${this.state.data.esComision === 1 ? "active" : ""}`} data-ref="2">
                                                <div className="container-fluid">
                                                    <div className="row">
                                                        <div className="col-lg-12 col-md-12">
                                                            <div className="listadoPageContainer">
                                                                <div className="container-fluid">
                                                                    <div className="listadoWPhotoContainer">
                                                                        <div className="row">
                                                                            <div className="col-lg-12 col-md-12">
                                                                                {
                                                                                    !this.state.subloader && typeof this.state.data.votacion_congresista !== "undefined" && this.state.data.votacion_congresista !== null ?
                                                                                        this.state.data.votacion_congresista.map((x, i) => {
                                                                                            return (
                                                                                                <div className="listadoItem evenColors">
                                                                                                    <div className="rightSide bigContent md">
                                                                                                        <div className="title">
                                                                                                            <div className="photo avatar center-block">
                                                                                                                <img src={x.congresista !== null ? (typeof x.congresista.persona.imagenes[1] !== "undefined" ? auth.pathApi() + x.congresista.persona.imagenes[1].imagen : Constantes.NoImagen) : Constantes.NoImagen} alt="" />
                                                                                                            </div>
                                                                                                            <h4>{x.congresista.persona.nombres || ""} {x.congresista.persona.apellidos || ""}</h4>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                    <div className="rightSide bigContent">
                                                                                                        <div className="vertical-text">
                                                                                                            {/* <small>Profesión</small>
                                                                                        <p>{x.congresista !== null ? x.congresista.congresista_perfil.grado_estudio.nombre : "" || ''}</p>
                                                                                        <small>Edad</small>
                                                                                        <p>{x.congresista !== null ? auth.getAge(x.congresista.fechaNacimiento+"T00:00:00") : "" || ''}</p> */}
                                                                                                            <small>Partido</small>
                                                                                                            <p>{x.congresista !== null ? x.congresista.partido.nombre : "" || ''}</p>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                    <div className="tagVotaciones">
                                                                                                        <div className="votacion">
                                                                                                            <p>
                                                                                                                {
                                                                                                                    x.tipo_respuesta_votacion === null ? "---"
                                                                                                                    :
                                                                                                                    this.state.tiposRespuestas.find((v) => { return v.id === x.tipo_respuesta_votacion_id }).nombre
                                                                                                                }
                                                                                                            </p>
                                                                                                            <p>Voto</p>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                    <div className="link">
                                                                                                        <a href={`#/perfil-congresista/${x.congresista.id}`} target="_blank" className="linkButton right"><i className="fas fa-chevron-right"></i></a>
                                                                                                    </div>
                                                                                                </div>
                                                                                            )
                                                                                        })
                                                                                        :
                                                                                        <p>Sin congresistas involucrados</p>
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
                                    </>
                                    : ""
                                : ""
                        }
                    </div>
                </div>
            </>
        )
    }
}
function changeTab(e) {
    let tabs = document.querySelectorAll(".centerTabs ul li");
    tabs.forEach(y => {
        y.classList.remove("active");
    })
    tabs.forEach(z => {
        if (document.querySelector(`.contentForCenterTabs .contentTab[data-ref="${z.getAttribute("data-ref")}"]`)) {
            document.querySelector(`.contentForCenterTabs .contentTab[data-ref="${z.getAttribute("data-ref")}"]`).classList.remove("active")
        }
    })
    e.currentTarget.classList.add("active");
    if (document.querySelector(`.contentForCenterTabs .contentTab[data-ref="${e.currentTarget.getAttribute("data-ref")}"]`)) {
        document.querySelector(`.contentForCenterTabs .contentTab[data-ref="${e.currentTarget.getAttribute("data-ref")}"]`).classList.add("active")
    }
}
function getColor(id){
    if(id === 1)
        return "#00b963"
    else if (id === 2)
        return "#e44e44"
    else
        return "#c9c043"
}
export default DetalleVotacion;