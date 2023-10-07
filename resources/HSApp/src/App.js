import React, { Component } from "react";
import {
    HashRouter as Router,
    Route,
    Switch,
    Redirect,
} from "react-router-dom";
import RouteLayout from "./Admin/Layout/RouteLayout";
import ActividadesLegislativas from "./Admin/Pages/ActividadesLegislativas/ActividadesLegislativas";
import Comisiones from "./Admin/Pages/Comisiones/Comisiones";
import DetalleComision from "./Admin/Pages/Comisiones/DetalleComision";
import Congresistas from "./Admin/Pages/Congresistas/Congresistas";
import PerfilCongresista from "./Admin/Pages/Congresistas/PerfilCongresista";
import CongresoVisible from "./Admin/Pages/CongresoVisible/CongresoVisible";
import DetalleEquipoCV from "./Admin/Pages/CongresoVisible/DetalleEquipoCV";
import ContenidoMultimedia from "./Admin/Pages/ContenidoMultimedia/ContenidoMultimedia";
import DetalleControlPolitico from "./Admin/Pages/ControlPolitico/DetalleControlPolitico";
import Home from "./Admin/Pages/Home/Home";
import NuestraDemocracia from "./Admin/Pages/NuestraDemocracia/NuestraDemocracia";
import DetalleNuestraDemocracia from "./Admin/Pages/NuestraDemocracia/DetalleNuestraDemocracia";
import DetalleOrdenDia from "./Admin/Pages/OrdenDia/DetalleOrdenDia";
import Partidos from "./Admin/Pages/Partidos/Partidos";
import DetallePartidos from "./Admin/Pages/Partidos/DetallePartidos";
import ProyectoLeys from "./Admin/Pages/ProyectoLeys/ProyectoLeys";
import IniciativaLeys from "./Admin/Pages/ProyectoLeys/IniciativaLeys";
import DetalleProyectoLey from "./Admin/Pages/ProyectoLeys/DetalleProyectoLey";
import AgendaLegislativa from "./Admin/Pages/AgendaLegislativa/AgendaLegislativa";
import Alertas from "./Admin/Pages/Alertas/Alertas";
import DetalleVotacion from "./Admin/Pages/Votaciones/DetalleVotacion";
import DetalleEleccion from "./Admin/Pages/Elecciones/DetalleEleccion";
import DetalleBalanceCuatrienio from "./Admin/Pages/BalanceCuatrienio/DetalleBalanceCuatrienio";
import DetalleOpinion from "./Admin/Pages/ContenidoMultimedia/DetalleOpinio";
import DetalleOpinionCongresista from "./Admin/Pages/ContenidoMultimedia/DetalleOpinionCongresista";
import DetalleBalanceInforme from "./Admin/Pages/BalanceCuatrienio/DetalleBalanceInforme";
import Login from "./Admin/Pages/Login/Login";
export default class App extends Component {
    static displayName = App.name;

    render() {
        return (
            <div className="App">
                <Router>
                    <Switch>
                        {/* Login */}
                        <Route exact path="/">
                            <Redirect to="/login" />
                        </Route>
                        <Route path="/login" component={Login} />
                        {/* End Login */}

                        {/* Home */}
                        <RouteLayout path="/home" component={Home} />
                        {/* End home */}

                        {/* Actividades legislativas */}
                        <RouteLayout path="/agenda-legislativa" component={AgendaLegislativa} />
                        {/* End actividades legislativas */}

                        {/* Actividades legislativas */}
                        <RouteLayout path="/alertas" component={Alertas} />
                        {/* End actividades legislativas */}

                        {/* Comisiones */}
                        <RouteLayout
                            path="/comisiones"
                            component={Comisiones}
                        />
                        <RouteLayout
                            path="/detalle-comision/:id"
                            component={DetalleComision}
                        />
                        {/* End comisiones */}

                        {/* Congresistas */}
                        <RouteLayout
                            path="/congresistas"
                            component={Congresistas}
                        />
                        <RouteLayout
                            path="/perfil-congresista/:id"
                            component={PerfilCongresista}
                        />
                        {/* End congresistas */}

                        {/* Congreso visible */}
                        <RouteLayout
                            path="/que-es-congreso-visible"
                            component={CongresoVisible}
                        />
                        <RouteLayout
                            path="/detalle-equipo-cv/:id"
                            component={DetalleEquipoCV}
                        />
                        {/* End congreso visible */}

                        {/* Contenido multimedia */}
                        <RouteLayout
                            path="/contenido-multimedia"
                            component={ContenidoMultimedia}
                        />
                        {/* End cnotenido multimedia */}

                        {/* Control político */}
                        <RouteLayout
                            path="/detalle-control-politico/:id"
                            component={DetalleControlPolitico}
                        />
                        {/* End control político */}

                        {/* Nuestra democracia */}
                        <RouteLayout
                            path="/nuestra-democracia"
                            component={NuestraDemocracia}
                        />
                        <RouteLayout
                            path="/detalle-nuestra-democracia/:id"
                            component={DetalleNuestraDemocracia}
                        />
                        {/* End nuestra democracia */}

                        {/* Orden del día */}
                        <RouteLayout
                            path="/detalle-orden-dia/:id"
                            component={DetalleOrdenDia}
                        />
                        {/* End orden del día */}

                        {/* Partidos */}
                        <RouteLayout path="/partidos" component={Partidos} />
                        <RouteLayout
                            path="/detalle-partido/:id"
                            component={DetallePartidos}
                        />
                        {/* End partidos */}

                        {/* Proyectos de ley */}
                        <RouteLayout
                            path="/proyectos-de-ley"
                            component={ProyectoLeys}
                        />
                        <RouteLayout
                            path="/iniciativas-de-ley"
                            component={IniciativaLeys}
                        />
                        <RouteLayout
                            path="/detalle-proyecto-de-ley/:id"
                            component={DetalleProyectoLey}
                        />
                        {/* End proyectos de ley */}

                        {/* Votaciones */}
                        <RouteLayout
                            path="/detalle-votacion/:id"
                            component={DetalleVotacion}
                        />
                        {/* End votaciones */}

                        {/* Elecciones */}
                        <RouteLayout
                            path="/detalle-eleccion/:id"
                            component={DetalleEleccion}
                        />
                        {/* End elecciones */}

                        {/* Balance cuatrienio */}
                        <RouteLayout
                            path="/detalle-balance-cuatrienio/:id"
                            component={DetalleBalanceCuatrienio}
                        />
                        <RouteLayout
                            path="/detalle-balance-informe/:id"
                            component={DetalleBalanceInforme}
                        />
                        {/* End balance cuatrienio */}

                        {/* opinion */}
                        <RouteLayout
                            path="/detalle-opinion/:id"
                            component={DetalleOpinion}
                        />
                        {/* end opinion */}

                        {/* opinion congresiata detalle */}
                        <RouteLayout
                            path="/detalle-opinion-congresista/:id"
                            component={DetalleOpinionCongresista}
                        />
                        {/* end opinion congresiata detalle*/}
                    </Switch>
                </Router>
            </div>
        );
    }
}
