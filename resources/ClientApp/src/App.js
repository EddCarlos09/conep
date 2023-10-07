import React, { Component } from "react";
import {
    HashRouter as Router,
    Route,
    Switch,
    Redirect,
} from "react-router-dom";
import RouteLayout from "./Admin/Layout/RouteLayout";
import Home from "./Admin/Pages/Home/Home";
import Login from "./Admin/Pages/Login/Login";
import Partidos from "./Admin/Pages/Partidos/Partidos";
import CrearPartido from "./Admin/Pages/Partidos/CrearPartido";
import GrupoEdades from "./Admin/Pages/GrupoDeEdades/GrupoEdades";
import Circunscripciones from "./Admin/Pages/Circunscripciones/Circunscripciones";
import Cargos from "./Admin/Pages/Cargos/Cargos";
import DatosContacto from "./Admin/Pages/DatosContacto/DatosContacto";
import Generos from "./Admin/Pages/Generos/Generos";
import Departamentos from "./Admin/Pages/Departamentos/Departamentos";
import GradoEstudios from "./Admin/Pages/GradoEstudios/GradoEstudios";
import Profesion from "./Admin/Pages/Profesion/Profesion";
import Cuatrienios from "./Admin/Pages/Cuatrienios/Cuatrienios";
import Geografia from "./Admin/Pages/Geografia/Geografia";
import Iniciativas from "./Admin/Pages/Iniciativas/Iniciativas";
import Legislaturas from "./Admin/Pages/Legislaturas/Legislaturas";
import EstadoProyectoLeys from "./Admin/Pages/EstadoProyectoLeys/EstadoProyectoLeys";
import Congresistas from "./Admin/Pages/Congresistas/Congresistas";
import CongresistasPorCuatrienioCorporacion from "./Admin/Pages/Congresistas/CongresistasPorCuatrienioCorporacion";
import CrearCongresista from "./Admin/Pages/Congresistas/CrearCongresista";
import TemaProyectoLeys from "./Admin/Pages/TemaProyectoLeys/TemaProyectoLeys";
import TipoPublicacionProyectoLeys from "./Admin/Pages/TipoPublicacionProyectoLeys/TipoPublicacionProyectoLeys";
import TipoFechaProyectoLeys from "./Admin/Pages/TipoFechaProyectoLeys/TipoFechaProyectoLeys";
import EstadoControlPoliticos from "./Admin/Pages/EstadoControlPolitico/EstadoControlPoliticos";
import GlosarioLegislativos from "./Admin/Pages/GlosarioLegislativos/GlosarioLegislativos";
import NivelDificultadBlogND from "./Admin/Pages/NivelDificultadBlogND/NivelDificultadBlogND";
import TemaBlogND from "./Admin/Pages/TemaBlogND/TemaBlogND";
import Comisiones from "./Admin/Pages/Comision/Comisiones";
import EditarComision from "./Admin/Pages/Comision/EditarComision";
import Corporacion from "./Admin/Pages/Corporacion/Corporacion";
import CrearCorporacion from "./Admin/Pages/Corporacion/CrearCorporacion";
import TipoActividadAgendaLegislativas from "./Admin/Pages/TipoActividadAgendaLegislativas/TipoActividadAgendaLegislativas";
import PaseListas from "./Admin/Pages/PaseListas/PaseListas";
import BlogNdCU from "./Admin/Pages/BlogNd/BlogNdCU";
import BlogsNd from "./Admin/Pages/BlogNd/BlogsNd";
import TipoCitacion from "./Admin/Pages/TipoCitacion/TipoCitacion";
import CrearPaseLista from "./Admin/Pages/PaseListas/CrearPaseLista";
import Votaciones from "./Admin/Pages/Votaciones/Votaciones";
import CrearVotacion from "./Admin/Pages/Votaciones/CrearVotacion";
import congresoVisible from "./Admin/Pages/CongresoVisible/congresoVisible";
import EditarCongresoVisible from "./Admin/Pages/CongresoVisible/EditarCongresoVisible";
import EquipoCongresoVisible from "./Admin/Pages/CongresoVisible/EquipoCongresoVisible";
import AliadoCongresoVisible from "./Admin/Pages/CongresoVisible/AliadoCongresoVisible";
import CrearEquipo from "./Admin/Pages/CongresoVisible/CrearEquipo";
import CrearAliado from "./Admin/Pages/CongresoVisible/CrearAliado";
import IntegranteEquipo from "./Admin/Pages/CongresoVisible/IntegranteEquipo";
import CrearIntegrante from "./Admin/Pages/CongresoVisible/CrearIntegrante";
import Votar from "./Admin/Pages/Votaciones/Votar";
import CargoIntegrante from "./Admin/Pages/CargoIntegrantes/CargoIntegrante";
import ProyectoLeys from "./Admin/Pages/ProyectoLeys/ProyectoLeys";
import ProyectoLeyCrear from "./Admin/Pages/ProyectoLeys/CrearProyectoLey";
import InformesPNUD from "./Admin/Pages/InformesPNUD/InformesPNUD";
import ControlPoliticoIndex from './Admin/Pages/ControlPolitico/ControlPoliticoIndex';
import ControlPolitico from './Admin/Pages/ControlPolitico/ControlPoliticoAddUpd';
import ControlPoliticoProposiciones from './Admin/Pages/ControlPolitico/ControlPoliticoProposiciones';
import ControlPoliticoDocumentos from './Admin/Pages/ControlPolitico/ControlPoliticoDocumentos';
import ControlPoliticoRespuestas from './Admin/Pages/ControlPolitico/ControlPoliticoRespuestas';
import ControlPoliticoCitantes from './Admin/Pages/ControlPolitico/ControlPoliticoCitante';
import ControlPoliticoCitados from './Admin/Pages/ControlPolitico/ControlPoliticoCitados';
import BalanceCuatrienio from "./Admin/Pages/BalanceCuatrienio/BalanceCuatrienio";
import CrearBalanceCuatrienio from "./Admin/Pages/BalanceCuatrienio/CrearBalanceCuatrienio";
import BalanceCuatrienioInforme from "./Admin/Pages/BalanceCuatrienioInforme/BalanceCuatrienioInforme";
import CrearBalanceCuatrienioInforme from "./Admin/Pages/BalanceCuatrienioInforme/CrearBalanceCuatrienioInforme";
import DocumentosPNUD from "./Admin/Pages/InformesPNUD/DocumentosPNUD";
import Opinion from "./Admin/Pages/Opinion/Opinion";
import CrearOpinion from "./Admin/Pages/Opinion/CrearOpinion";
import AgendaLegislativa from "./Admin/Pages/AgendaLegislativa/AgendaLegislativa";
import AgendaLegislativaCU from "./Admin/Pages/AgendaLegislativa/AgendaLegislativaCU";
import OpinionCongresista from "./Admin/Pages/OpinionCongresista/OpinionCongresista";
import CrearOpinionCongresista from "./Admin/Pages/OpinionCongresista/CrearOpinionCongresista";
import Podcast from "./Admin/Pages/Podcast/Podcast";
import CrearPodcast from "./Admin/Pages/Podcast/CrearPodcast";
import Multimedia from "./Admin/Pages/Multimedia/Multimedia";
import CrearMultimedia from "./Admin/Pages/Multimedia/CrearMultimedia";
import AgendaActividades from "./Admin/Pages/AgendaLegislativa/AgendaActividades";
import AgendaComision from "./Admin/Pages/AgendaLegislativa/AgendaComision";
import AgendaActividadesCU from "./Admin/Pages/AgendaLegislativa/AgendaActividadesCU";
import Elecciones from "./Admin/Pages/Elecciones/Elecciones";
import EleccionCrear from "./Admin/Pages/Elecciones/CrearEleccion";
import Secretarios from "./Admin/Pages/Secretarios/Secretarios";
import CrearSecretario from "./Admin/Pages/Secretarios/CrearSecretario";
import InformacionSitio from "./Admin/Pages/InformacionDelSitio/InformacionSitio";
import CrearInformacionSitio from "./Admin/Pages/InformacionDelSitio/CrearInformacionSitio";
import TemaControlPolitico from "./Admin/Pages/TemaControlPolitico/TemaControlPoliticos";
import Personas from "./Admin/Pages/Persona/Personas";
import CrearPersonas from "./Admin/Pages/Persona/CrearPersona";
import Regiones from "./Admin/Pages/Region/Regiones";
import TInvestigacions from "./Admin/Pages/TipoInvestigacions/TipoInvestigacions";
import Municipios from "./Admin/Pages/Municipio/Municipios";

//INICIA Gestión de usuarios
 import AsignacionUsuario from './Admin/Pages/GestionUsuarios/AsignacionUsuario';
 import Usuario from './Admin/Pages/Usuario/Usuario';
 import UsuariosPorSucursal from './Admin/Pages/GestionUsuarios/UsuariosPorSucursal';
 import RolesPorUsuario from './Admin/Pages/GestionUsuarios/RolesPorUsuario';
 import RolesPorUsuarioAccion from './Admin/Pages/GestionUsuarios/RolesPorUsuarioAccion';
 import Rol from './Admin/Pages/GestionUsuarios/Rol';
 import RolAccion from './Admin/Pages/GestionUsuarios/RolAccion';
 import TipoDeUsuario from './Admin/Pages/GestionUsuarios/TipoDeUsuario';
 import RolesPorTipoDeUsuario from './Admin/Pages/GestionUsuarios/RolesPorTipoDeUsuario';

 import DocumentosProyectoLey from './Admin/Pages/ProyectoLeys/DocumentosProyectoLey'
 import CrearDocumentosProyectoLey from './Admin/Pages/ProyectoLeys/CrearDocumentoProyectoLey'


 //TERMINA Gestión de usuarios

export default class App extends Component {
    static displayName = App.name;

    render() {
        return (
            <div className="App">
                <Router>
                    <Switch>
                        <Route exact path="/">
                            <Redirect to="/login" />
                        </Route>

                        <Route path="/login" component={Login} />
                        <RouteLayout path="/home" component={Home} />
                        <RouteLayout path="/partidos" component={Partidos} />
                        <RouteLayout
                            path="/partidos-crear"
                            component={CrearPartido}
                        />
                        <RouteLayout
                            path="/partidos-editar/:id"
                            component={CrearPartido}
                        />
                        <RouteLayout
                            path="/datos-contacto"
                            component={DatosContacto}
                        />
                        <RouteLayout
                            path="/grupo-de-edad"
                            component={GrupoEdades}
                        />
                        <RouteLayout
                            path="/circunscripcion"
                            component={Circunscripciones}
                        />
                        <RouteLayout path="/cargo" component={Cargos} />
                        {/* End cargos */}
                        {/* Congresistas */}
                        <RouteLayout
                            path="/congresistas"
                            component={Congresistas}
                        />
                        <RouteLayout
                            path="/congresistas-por-cuatrienio/cuatrienio-:idCuatrienio/corporacion-:idCorporacion"
                            component={CongresistasPorCuatrienioCorporacion}
                        />
                        <RouteLayout
                            path="/congresistas-crear/cuatrienio-:idCuatrienio/corporacion-:idCorporacion"
                            component={CrearCongresista}
                        />
                        <RouteLayout
                            path="/congresistas-editar/:id/cuatrienio-:idCuatrienio/corporacion-:idCorporacion"
                            component={CrearCongresista}
                        />
                        {/* End congresistas */}

                        {/* Comisiones */}
                        <RouteLayout
                            path="/comisiones"
                            component={Comisiones}
                        />
                        <RouteLayout
                            path="/comision-editar/:id"
                            component={EditarComision}
                        />
                        <RouteLayout
                            path="/comision-crear"
                            component={EditarComision}
                        />
                        {/* End comisiones */}

                        <RouteLayout path="/home" component={Home} />

                        <RouteLayout
                            path="/grado-estudios"
                            component={GradoEstudios}
                        />
                        <RouteLayout
                            path="/profesion"
                            component={Profesion}
                        />
                        <RouteLayout
                            path="/departamento"
                            component={Departamentos}
                        />
                        <RouteLayout
                            path="/quinquenios"
                            component={Cuatrienios}
                        />
                        <RouteLayout path="/geografia" component={Geografia} />
                        <RouteLayout
                            path="/iniciativas"
                            component={Iniciativas}
                        />
                        <RouteLayout
                            path="/tema-proyecto-ley"
                            component={TemaProyectoLeys}
                        />
                        <RouteLayout
                            path="/tema-control-politico"
                            component={TemaControlPolitico}
                        />
                        <RouteLayout
                            path="/legislaturas"
                            component={Legislaturas}
                        />
                        <RouteLayout
                            path="/estado-proyecto-ley"
                            component={EstadoProyectoLeys}
                        />
                        <RouteLayout path="/generos" component={Generos} />
                        <RouteLayout
                            path="/tipo-publicacion-proyecto-ley"
                            component={TipoPublicacionProyectoLeys}
                        />
                        <RouteLayout
                            path="/tipo-fecha-proyecto-ley"
                            component={TipoFechaProyectoLeys}
                        />
                        <RouteLayout
                            path="/glosario-legislativo"
                            component={GlosarioLegislativos}
                        />
                        <RouteLayout
                            path="/nivel-dificultad-blog-nuestra-democracia"
                            component={NivelDificultadBlogND}
                        />
                        <RouteLayout
                            path="/tema-blog-nuestra-democracia"
                            component={TemaBlogND}
                        />
                        <RouteLayout
                            path="/tipo-actividad-agenda-legislativa"
                            component={TipoActividadAgendaLegislativas}
                        />
                        {/* Corporación */}
                        <RouteLayout
                            path="/corporacion"
                            component={Corporacion}
                        />
                        <RouteLayout
                            path="/corporacion-editar/:id"
                            component={CrearCorporacion}
                        />
                        {/* End Corporación */}
                        {/* Pase lista */}
                        <RouteLayout
                            path="/pase-lista"
                            component={PaseListas}
                        />
                        <RouteLayout path="/blog-nd" component={BlogsNd} />
                        <RouteLayout
                            path="/blog-nd-crear"
                            component={BlogNdCU}
                        />
                        <RouteLayout
                            path="/blog-nd-editar/:id"
                            component={BlogNdCU}
                        />
                        <RouteLayout
                            path="/crear-pase-lista"
                            component={CrearPaseLista}
                        />
                        <RouteLayout
                            path="/editar-pase-lista/:id"
                            component={CrearPaseLista}
                        />
                        {/* End pase lista */}
                        {/* Votaciones */}
                        <RouteLayout
                            path="/votaciones"
                            component={Votaciones}
                        />
                        <RouteLayout
                            path="/crear-votacion"
                            component={CrearVotacion}
                        />
                        <RouteLayout
                            path="/editar-votacion/:id"
                            component={CrearVotacion}
                        />
                        <RouteLayout path="/votar/:id" component={Votar} />
                        {/* End votaciones */}
                        {/* Tipo citación */}
                        <RouteLayout
                            path="/tipoCitacion"
                            component={TipoCitacion}
                        />
                        {/* End Tipo citación */}

                        <RouteLayout path="/congreso-visible" component={congresoVisible} />
                        <RouteLayout path="/editar-congreso-visible/:id" component={EditarCongresoVisible}/>
                        <RouteLayout path="/equipo-congreso-visible/:idcv" component={EquipoCongresoVisible}/>
                        <RouteLayout path="/aliado-congreso-visible/:idcv" component={AliadoCongresoVisible}/>
                        <RouteLayout path="/equipo-crear/:idcv" component={CrearEquipo}/>
                        <RouteLayout path="/equipo-editar/:idcv/:idequipo" component={CrearEquipo}/>
                        <RouteLayout path="/integrante-equipo/:idequipo" component={IntegranteEquipo}/>
                        <RouteLayout path="/integrante-crear/:id" component={CrearIntegrante}/>
                        <RouteLayout path="/integrante-editar/:idequipo/:idintegrante" component={CrearIntegrante}/>
                        <RouteLayout path="/aliado-crear/:idcv" component={CrearAliado}/>
                        <RouteLayout path="/aliado-editar/:idcv/:idaliado" component={CrearAliado}/>

                        <RouteLayout path="/cargo-integrante" component={CargoIntegrante}/>

                        <RouteLayout
                            path="/congreso-visible"
                            component={congresoVisible}
                        />
                        <RouteLayout
                            path="/proyectos-ley"
                            component={ProyectoLeys}
                        />
                        <RouteLayout
                            path="/proyecto-ley-crear"
                            component={ProyectoLeyCrear}
                        />
                        <RouteLayout
                            path="/proyecto-ley-editar"
                            component={ProyectoLeyCrear}
                        />
                        <RouteLayout path="/informes-regionales" component={InformesPNUD}/>
                        {/* <RouteLayout path="/informe-crear" component={CrearInfomesPNUD}/> */}

                        <RouteLayout path="/informe-documentos/:id" component={DocumentosPNUD}/>

                        <RouteLayout path="/opinion" component={Opinion}/>
                        <RouteLayout path="/opinion-crear" component={CrearOpinion}/>
                        <RouteLayout path="/opinion-editar/:id" component={CrearOpinion}/>

                        {/* Balances de cuatrienio */}
                        <RouteLayout
                            path="/balances-cuatrienio"
                            component={BalanceCuatrienio}
                        />
                        <RouteLayout
                            path="/balances-cuatrienio-crear"
                            component={CrearBalanceCuatrienio}
                        />
                        <RouteLayout
                            path="/balances-cuatrienio-editar/:id"
                            component={CrearBalanceCuatrienio}
                        />

                        {/* End balances de cuatrienio informes */}

                        {/* Balances de cuatrienio */}
                        <RouteLayout
                            path="/balances-cuatrienio-informes/:idBalance"
                            component={BalanceCuatrienioInforme}
                        />
                        <RouteLayout
                            path="/balances-cuatrienio-informe-crear/:idBalance"
                            component={CrearBalanceCuatrienioInforme}
                        />
                        <RouteLayout
                            path="/balances-cuatrienio-informe-editar/:idBalance/:idInforme"
                            component={CrearBalanceCuatrienioInforme}
                        />

                        {/* End balances de cuatrienio informes */}
                         {/* Agenda Legislativa */}
                        
                         <RouteLayout
                            path="/agenda-legislativa-actividades/:id"
                            component={AgendaActividades}
                        />
                        <RouteLayout
                            path="/agenda-legislativa-actividades-crear/:idAgenda"
                            component={AgendaActividadesCU}
                        />
                        <RouteLayout
                            path="/agenda-legislativa-actividades-editar/:idAgenda/:idActividad"
                            component={AgendaActividadesCU}
                        />
                         <RouteLayout
                            path="/agenda-legislativa"
                            component={AgendaLegislativa}
                        />
                        <RouteLayout
                            path="/agenda-legislativa-crear"
                            component={AgendaLegislativaCU}
                        />
                        <RouteLayout
                            path="/agenda-legislativa-editar/:id"
                            component={AgendaLegislativaCU}
                        />
                         <RouteLayout
                            path="/agenda-legislativa-comision/:id"
                            component={AgendaComision}
                        />
                        {/* End balances de cuatrienio informes */}

                        {/* Podcast */}
                        <RouteLayout
                            path="/podcast"
                            component={Podcast}
                        />
                        <RouteLayout
                            path="/podcast-crear"
                            component={CrearPodcast}
                        />
                        <RouteLayout
                            path="/podcast-editar/:id"
                            component={CrearPodcast}
                        />
                        {/* End podcast */}

                        {/* opinon congresistas*/}
                        <RouteLayout path="/opinion-congresista" component={OpinionCongresista}/>
                        <RouteLayout path="/opinion-congresista-crear" component={CrearOpinionCongresista}/>
                        <RouteLayout path="/opinion-congresista-editar/:id" component={CrearOpinionCongresista}/>
                        {/* end ipinion congresistas */}

                        {/* control politico */}

                        <RouteLayout
                            path="/estado-control-politico"
                            component={EstadoControlPoliticos}
                        />
                        <RouteLayout path="/control-politico" component={ControlPoliticoIndex}/>
                        <RouteLayout path="/control-politico-crear" component={ControlPolitico}/>
                        <RouteLayout path="/control-politico-editar/:id" component={ControlPolitico}/>
                        <RouteLayout path="/control-politico-cuestionarios/:id" component={ControlPoliticoProposiciones}/>
                        <RouteLayout path="/control-politico-gacetas/:id" component={ControlPoliticoDocumentos}/>
                        <RouteLayout path="/control-politico-respuestas/:id" component={ControlPoliticoRespuestas}/>
                        <RouteLayout path="/control-politico-citantes/:id" component={ControlPoliticoCitantes}/>
                        <RouteLayout path="/control-politico-citados/:id" component={ControlPoliticoCitados}/>
                        {/* End control politico */}
                        {/* Multimedia */}
                        <RouteLayout path="/multimedia" component={Multimedia}/>
                        <RouteLayout path="/multimedia-crear" component={CrearMultimedia}/>
                        <RouteLayout path="/multimedia-editar/:id" component={CrearMultimedia}/>
                        {/* edn multimedia */}

                        {/* End Agenda Legislativa */}

                        {/*INICIA Gestion de usuarios*/}
                        {<RouteLayout path="/asignacion-usuario" component={AsignacionUsuario} />}
                        <RouteLayout path="/usuarios" component={Usuario} />
                        {<RouteLayout path="/usuario-sucursal" component={UsuariosPorSucursal} />}
                        {<RouteLayout path="/rol-usuario" component={RolesPorUsuario} />}
                        {<RouteLayout path="/rol-usuario-accion" component={RolesPorUsuarioAccion} />}
                        {<RouteLayout path="/roles" component={Rol} />}
                        {<RouteLayout path="/rol-accion" component={RolAccion} />}
                        {<RouteLayout path="/tipo-usuario" component={TipoDeUsuario} />}
                        {<RouteLayout path="/rol-tipo-usuario" component={RolesPorTipoDeUsuario} />}
                        {/*TERMINA Gestion de usuarios*/}
                        {/* End Agenda Legislativa */}
                        {/* Elecciones */}
                        <RouteLayout path="/elecciones" component={Elecciones}/>
                        <RouteLayout path="/elecciones-crear" component={EleccionCrear}/>
                        <RouteLayout path="/elecciones-editar/:id" component={EleccionCrear}/>
                        {/* edn multimedia */}
                        {/* Secretarios */}
                        <RouteLayout
                            path="/secretarios"
                            component={Secretarios}
                        />
                        <RouteLayout
                            path="/secretarios-crear"
                            component={CrearSecretario}
                        />
                        <RouteLayout
                            path="/secretarios-editar/:id"
                            component={CrearSecretario}
                        />
                        {/* End Secretarios */}
                        {/* informacion del sitio */}
                        <RouteLayout path="/informacion-del-sitio" component={InformacionSitio} />
                        <RouteLayout path="/crear-informacion" component={CrearInformacionSitio} />
                        <RouteLayout path="/editar-informacion/:id" component={CrearInformacionSitio} />
                        {/* end informacion del sitio */}

                        {/* Personas */}
                        <RouteLayout path="/personas" component={Personas} />
                        <RouteLayout path="/persona-crear" component={CrearPersonas} />
                        <RouteLayout path="/persona-editar" component={CrearPersonas} />
                        {/* end Personas */}

                        {/* Regiones */}
                        <RouteLayout path="/regiones" component={Regiones} />
                        {/* end Personas */}
                        {/* Tipo de investigación */}
                        <RouteLayout path="/tipo-investigacion" component={TInvestigacions} />
                        {/* end Tipo investigacion */}

                        {/* Municipios */}
                        <RouteLayout path="/circuitos" component={Municipios} />
                        {/* end Municipios */}

                        <RouteLayout
                            path="/proyecto-ley-documentos/:id"
                            component={DocumentosProyectoLey}
                        />
                        <RouteLayout
                            path="/proyecto-ley-crear-documento/:id"
                            component={CrearDocumentosProyectoLey}
                        />

                    </Switch>
                </Router>
            </div>
        );
    }
}
