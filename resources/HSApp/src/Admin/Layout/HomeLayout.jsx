import React, {useEffect} from "react";
import { useHistory } from "react-router-dom";
import AuthLogin from "../../Utils/AuthLogin";
import NotificacionService from "../../../../HSApp/src/Services/General/Notificacion.Service";
import moment from "moment";
import 'moment/locale/es';

const HomeLayout = ({ children, ...rest }) => {

    const auth = new AuthLogin();
    // const { state, loading, observacionesLegales } = useInfoGeneral();
    // let datosContacto = state?.congreso_visible_datos_contacto;
    const { push } = useHistory();
    const [notificaciones, setNotificaciones] = React.useState([]);
    const [totalNotifications, setTotalNotifications] = React.useState(0);
    const [contTodayNotifications, setContTodayNotifications] = React.useState(0);
    const handleClickLogOut = (e) => {
        auth.logout();
        push({
            pathname: "/login",
        });
    };
    const getNotifications = async (email) => {
        await NotificacionService.getAll(email, 5)
            .then(response => {
                let notificaciones = [];
                let contTodayNotifications = 0;
                let CurrentDate = new Date();
                CurrentDate.setHours(0,0,0,0);

                response.data.map((item) => {
                    notificaciones.push({
                        id: item.id,
                        notificacion: item.notificacion,
                        fecha: new Date(item['created_at']),
                        url: item.url,
                        time: moment(item['created_at']).fromNow()
                    })
                    if(new Date(item['created_at']) >= CurrentDate)
                        contTodayNotifications++;   
                });
                setNotificaciones(notificaciones);
                setTotalNotifications(notificaciones.length);
                setContTodayNotifications(contTodayNotifications);
            })
            .catch(function (error) {
                console.error(error);
            });
    }

    const avatar = () =>{
        let nombreArray = auth.nombre_completo() !== null ? auth.nombre_completo().split(" ") : [];
        let firstChar = nombreArray.length > 0 ? nombreArray[0].charAt(0).toUpperCase() : "";
        let secondChar = nombreArray.length >= 2 ? nombreArray[1].charAt(0).toUpperCase() : "";
        return {
            firstChar,
            secondChar
        };
    }

    useEffect(() => {
        getNotifications(auth.email());
    },[]);

    return (
        <>
            <header className="top-bar">
                <button type="button" className="menu-toggler la la-bars" data-toggle="menu"></button>
                <span className="brand"><img src="assets/images/site/conep.png" alt=""/></span>
                <div className="flex items-center ml-auto">
                    <div className="dropdown self-stretch">
                        <button type="button"
                            className="relative flex items-center h-full btn-link ml-1 px-2 text-2xl leading-none la la-bell"
                            data-toggle="custom-dropdown-menu" data-tippy-arrow="true" data-tippy-placement="bottom-end">
                        <span className="absolute top-0 left-m-10 rounded-full badge badge_outlined badge_primary -mt-1 -mr-1 px-2 leading-tight text-xs font-body text-primary">{totalNotifications}</span>
                        <span className="absolute top-0 right-m-10 rounded-full badge badge_outlined badge_success -mt-1 -mr-1 px-2 leading-tight text-xs font-body text-primary">+{contTodayNotifications}</span>
                        </button>
                        <div className="custom-dropdown-menu notificaciones-container">
                            <div className="flex items-center px-5 py-2">
                                    <h5 className="mb-0 uppercase">Notificaciones</h5>
                                    {/* <button className="btn btn_outlined btn_warning uppercase ml-auto">Limpiar todas</button> */}
                            </div>
                            <hr/>
                            {
                                notificaciones?.map((item, i) => {
                                    return (
                                        <>
                                                <div className="p-5 hover:bg-primary-100 dark:hover:bg-primary-900">
                                                    <a href={`#/detalle-proyecto-de-ley/${item.notificacion.proyecto_ley_id}`}>
                                                        <h6 className="uppercase"><span className={`${item.notificacion.icono}`}></span> {item.notificacion.titulo}</h6>
                                                        <p>{item.notificacion.mensaje}</p>
                                                        <small>{item.time}</small>
                                                    </a>
                                                </div>
                                            <hr/>
                                        </>
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>
                <div className="dropdown ml-8">
                    <button className="flex items-center ml-4 text-gray-700" data-toggle="custom-dropdown-menu"
                        data-tippy-arrow="true" data-tippy-placement="bottom-end">
                        <span className="avatar">{avatar().firstChar + avatar().secondChar}</span>
                    </button>
                    <div className="custom-dropdown-menu w-64">
                        <div className="p-5">
                            <h5 className="uppercase">{auth.nombre_completo() !== null ? `${auth.nombre_completo()}` : ""}</h5>
                            <p>{auth.email() !== null ? `${auth.email()}` : ""}</p>
                        </div>
                        <hr/>
                        <div className="p-5">
                            <a href="/" onClick={handleClickLogOut}
                                className="flex items-center text-gray-700 dark:text-gray-500 hover:text-primary dark:hover:text-primary">
                                <span className="la la-power-off text-2xl leading-none mr-2"></span>
                                Cerrar sesión
                            </a>
                        </div>
                    </div>
                </div>


            </header>
            <aside className="menu-bar menu-sticky">
                    <div className="menu-items">
                        <a href="#/home" className="link" data-toggle="tooltip-menu" data-tippy-content="Página Principal">
                            <span className="icon la la-laptop"></span>
                            <span className="title">Página Principal</span>
                        </a>
                        <a href="#/agenda-legislativa" className="link" data-target="[data-menu=pages]" data-toggle="tooltip-menu"
                            data-tippy-content="Agenda">
                            <span className="icon la la-calendar"></span>
                            <span className="title">Agenda Legislativa</span>
                        </a>
                        <a href="#/congresistas" className="link"
                            data-tippy-content="Diputados / Autores">
                            <span className="icon la la-users"></span>
                            <span className="title">Diputados / Autores</span>
                        </a>
                        <a href="#/iniciativas-de-ley" className="link"
                            data-tippy-content="Proyectos">
                            <span className="icon la la-book"></span>
                            <span className="title">Iniciativas</span>
                        </a>
                        <a href="#/proyectos-de-ley" className="link"
                            data-tippy-content="Proyectos">
                            <span className="icon la la-book"></span>
                            <span className="title">Leyes</span>
                        </a>
                        <a href="#/comisiones" className="link" data-target="[data-menu=ui]" data-toggle="tooltip-menu"
                            data-tippy-content="Comisiones y Plenos">
                            <span className="icon la la-sitemap"></span>
                            <span className="title">Comisiones y Plenos</span>
                        </a>
                        <a href="#/alertas" className="link" data-target="[data-menu=menu]" data-toggle="tooltip-menu"
                            data-tippy-content="Alertas">
                            <span className="icon la la-bell"></span>
                            <span className="title">Alertas</span>
                        </a>

                        <a href="#no-link" className="link btnVerLeyendas" data-toggle="menu-type" data-value="default">
                            <span className="icon la la-arrow-circle-right"></span>
                        </a>
                        <a href="#no-link" className="link btnVerIconos" data-toggle="menu-type" data-value="icon-only">
                            <span className="icon la la-arrow-circle-left"></span>
                        </a>
                    </div>
                </aside>
            {children}
            <footer className="mt-auto">
                <div className="footer">
                    <span className='uppercase'>&copy; Fuente: Asamblea Nacional de Panamá</span>
                    <nav className="ml-auto">
                    </nav>
                </div>
            </footer>
        </>
    );
};

export default HomeLayout;
