import React from "react";
import NotificacionService from "../../../Services/General/Notificacion.Service";
import AuthLogin from "../../../Utils/AuthLogin";
import moment from "moment";
import 'moment/locale/es';
import ListadoAlertas from "../../../Components/HS/ListadoAlertas";

const auth = new AuthLogin();

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            subloader: true,
            notificaciones: []
        }
    }

    componentDidMount = async () => {
        await this.getNotifications(auth.email())
    }
    getNotifications = async (email) => {
        await NotificacionService.getAll(email)
            .then(response => {
                let notificaciones = [];

                response.data.map(item => (
                    notificaciones.push({
                        id: item.id,
                        notificacion: item.notificacion,
                        fecha: new Date(item['created_at']),
                        url: item.url,
                        time: moment(item['created_at']).fromNow()
                    })
                ));
                
                this.setState({notificaciones, subloader: false})
            })
            .catch(function (error) {
                console.error(error);
            });
    }
    render() {
        return (
            <>
                <main className="workspace overflow-hidden">
                    <section className="breadcrumb">
                        <h1>Alertas</h1>
                        <ul>
                            <li><a href="#">Página principal</a></li>
                            <li className="divider la la-arrow-right"></li>
                            <li><a href="#">Alertas</a></li>
                            <li className="divider la la-arrow-right"></li>
                            <li>Listado</li>
                        </ul>
                    </section>
                    <div className="lg:mx-12">
                        <div className="relative">
                            <div className={`subloader ${this.state.subloader ? "active" : ""}`}><div className="relative"></div></div>
                            {
                                this.state.notificaciones.length !== 0 ?
                                this.state.notificaciones?.map((item, i)=> {
                                    let estatusClass = item.notificacion?.tipo === 1 ? "estatus-green" : (item.notificacion?.tipo === 2 ? "estatus-yellow" : (item.notificacion?.tipo === 3 ? "estatus-red" : "")); 
                                    return (
                                        <div key={i} className={`card card_row card_hoverable customHS ${estatusClass}`}>
                                            <div className="header">
                                                <a href={`#/detalle-proyecto-de-ley/${item.notificacion.proyecto_ley_id}`}>
                                                    <h3><span className={`${item.notificacion.icono}`}></span> {item.notificacion.titulo}</h3>
                                                    <br />
                                                    <p>{item.notificacion.mensaje}</p>
                                                    <small>{item.time}</small>
                                                </a>
                                            </div>

                                        </div>
                                    )
                                })
                                :
                                <div className="card card_row card_hoverable customHS">
                                    <div className="header">
                                        <h3>Sin notificaciones</h3>
                                    </div>
                                </div>
                            }
                        </div>
                    </div>
                </main>
            </>
        );
    }
}

export default Home;
