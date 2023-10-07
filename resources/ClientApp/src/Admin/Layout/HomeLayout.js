import React, {useEffect, useState, useCallback, useRef} from "react";
import { NavItem, NavLink } from "reactstrap";
import { useHistory } from "react-router-dom";
import AuthLogin from "../../Utils/AuthLogin";
import { Link } from "react-router-dom";
import Spinner from "../../Components/Spinner";
import Menu from "../../Menu";
import NotificacionService from "../../Services/Base/General/Notificacion.Service";
import moment from "moment";
import 'moment/locale/es';

const HomeLayout = ({ children, ...rest }) => {
    const { push } = useHistory();
    const auth = new AuthLogin();
    let menuJson = auth.menu();
    let data = JSON.parse(menuJson);
    let menu = new Menu(data);
    let customMenu = [];
    let currentId = useRef(0);

    const [loading, setLoading] = React.useState(false);
    const [notificaciones, setNotificaciones] = React.useState([]);
    const [classLi, setClassLi] = useState('pull-right notification');
    const [has_notification, setHasNotification] = useState(0);

    if (auth.username() == null) {
        auth.logout();
        push({
            pathname: "/login",
        });
    }

    if (auth.getReloadHome() === "0") {
        auth.setReloadHome(1);
        window.location.reload(false);
    }

    const handleClickLogOut = (e) => {
        auth.logout();
        push({
            pathname: "/login",
        });
    };

    useEffect(() => {
        getNotifications(auth.email());
    },[]);

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
                setHasNotification(notificaciones.length);
            })
            .catch(function (error) {
                console.error(error);
            });
    }
    const [isSending, setIsSending] = useState(false)
    const sendRequest = useCallback(async (id) => {
        // don't send again while we are sending
        let email = auth.email();
        let proyecto_ley_id = id;

        if (isSending) return
        // update state
        setIsSending(true)
        // send the actual request
        await NotificacionService.destroy(email, proyecto_ley_id).then(getNotifications(email));
        // once the request is sent, update state again
        setIsSending(false)
    }, [isSending]) // update the callback if the state changes

    return (
        <div>
            <Spinner show={loading} />
            <div className="page-container">
                <div className="page-sidebar">
                    <ul className="x-navigation">
                        <li className="xn-profile">
                            <a href="#/" className="profile-mini">
                            </a>
                            <div className="profile">
                            <a
                                    href="#/"
                                    className="x-navigation-control"
                                />
                                <div className="profile-image">
                                    <img
                                        src="/img/conep.png"
                                        alt="CONEP"
                                    />
                                </div>
                                <div className="profile-data">
                                    <div className="profile-data-name">
                                        CONEP
                                    </div>
                                    <div className="profile-data-title">
                                        Administrador
                                    </div>
                                </div>
                            </div>
                        </li>
                        {/* <li className="nav-item active">
                            <a className="nav-link" href="#/home"><span className="fa fa-home"></span><span className="xn-text">Página Principal</span></a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#/personas"><span className="fa fa-users"></span><span className="xn-text">Legisladores</span></a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#/proyectos-ley"><span className="fa fa-gavel"></span><span className="xn-text">Proyectos de ley</span></a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#/comisiones"><span className="fa fa-university"></span><span className="xn-text">Comisiones y Plenos</span></a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#/agenda-legislativa"><span className="fa fa-calendar"></span><span className="xn-text">Agenda Legislativa</span></a>
                        </li>
                        <li className="xn-openable nav-item">
                            <a href="/#"><span className="fa fa-th-list"></span><span className="xn-text">Gestión de usuarios</span></a>
                            <ul>
                                <li className="nav-item">
                                    <a className="nav-link" href="#/usuarios"><span className="fa fa-user"></span><span className="xn-text">Usuarios</span></a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" href="#/asignacion-usuario"><span className="fa fa-th-list"></span><span className="xn-text">Asignación de usuario</span></a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" href="#/roles"><span className="fa fa-th-list"></span><span className="xn-text">Roles</span></a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" href="#/tipo-usuario"><span className="fa fa-th-list"></span><span className="xn-text">Tipos de usuario</span></a>
                                </li>
                            </ul>
                        </li>
                        <li className="xn-openable nav-item">
                            <a href="/#"><span className="fa fa-th-list"></span><span className="xn-text">Catálogos</span></a>
                            <ul>
                                <li className="nav-item">
                                    <a className="nav-link" href="#/cuatrienio"><span className="fa fa-user"></span><span className="xn-text">Cuatrienio</span></a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" href="#/tipo-actividad-agenda-legislativa"><span className="fa fa-user"></span><span className="xn-text">Tipo actividad (Agenda)</span></a>
                                </li>
                            </ul>
                        </li> */}
                        {
                            getMenuPrincipal(menu, customMenu)
                        }
                    </ul>
                </div>
                <div
                    className="page-content"
                    style={{ height: "auto !important" }}
                >
                    <ul className="x-navigation x-navigation-horizontal x-navigation-panel">
                        <li className="xn-icon-button bar">
                            <a
                                href="#/"
                                className="x-navigation-minimize"
                                style={{ width: "auto" }}
                            >
                                <span
                                    className="fa fa-bars"
                                    style={{
                                        width: "30px",
                                        textAlign: "center",
                                    }}
                                />
                            </a>
                        </li>

                        <li className="xn-icon-button pull-right">
                            <a
                                href="#/"
                                className="mb-control"
                                data-box="#mb-signout"
                            >
                                <span className="fa fa-sign-out-alt"></span>{" "}
                                Cerrar sesión
                            </a>
                        </li>

                        <li onClick={(e) => { setVisto( e.currentTarget) }} className={classLi} >
                            <button type="button"><i className="fa fa-bell"/> {has_notification > 0 ? <div className="informer informer-danger"/> : <div/>}</button>
                            <div  className="panel panel-primary animated zoomIn xn-drop-left xn-panel-dragging">
                                <div className="panel-heading">
                                    <h3 className="panel-title"><span className="fa fa-bell"/> Notificaciones</h3>
                                </div>
                                <div className="panel-body list-group list-group-contacts" style={{ height: "350px", overflowY: "auto" }}>
                                    {
                                        notificaciones.map((item, i) => {
                                            return (
                                                <div className="list-group-item" key={i} style={{color: 'black'}}>
                                                    <div className="list-group-status status-online"/>
                                                    <span className="contacts-title">{item.nombre}</span>
                                                    <p>{item['notificacion']['mensaje'] + " - " + item.time}</p>

                                                    <a href = {'#/proyecto-ley-editar/' + item['notificacion']['proyecto_ley_id']}>
                                                        <button
                                                            style={{ transform: "translateY(-35px)" }}
                                                            className="btn btn-danger pull-right"
                                                            onClick={()=>sendRequest(item['notificacion']['proyecto_ley_id'])}
                                                        >Ir</button>
                                                    </a>

                                                </div>
                                            );
                                        })
                                    }
                                </div>
                            </div>
                        </li>

                        <li className="xn-icon-button pull-right">
                            <h5
                                className="login-title text-center"
                                style={{
                                    textAlign: "center",
                                    color: "var(--blue-secondary)",
                                    marginBottom: "0px",
                                    marginTop: "7px",
                                    fontSize: "12px",
                                }}
                            >
                                {" "}
                                {auth.nombre_completo() !== null ? `${auth.nombre_completo()}` : ""}
                            </h5>
                            <h5
                                className="login-title text-center"
                                style={{
                                    textAlign: "center",
                                    color: "var(--blue-secondary)",
                                    marginBottom: "0px",
                                    marginTop: "7px",
                                    fontSize: "12px",
                                }}
                            >
                                {" "}
                                {auth.email() !== null
                                    ? `${auth.email()}`
                                    : ""}
                            </h5>
                        </li>
                    </ul>
                    {children}
                </div>
            </div>

            <div
                className="message-box animated fadeIn"
                data-sound="alert"
                id="mb-signout"
            >
                <div className="mb-container">
                    <div className="mb-middle">
                        <div className="mb-title">
                            <span className="fa fa-sign-out"></span> ¿Cerrar
                            sesión?
                        </div>
                        <div className="mb-content">
                            <p>¿Desea cerrar la sesión?</p>
                            <p>Sí desea cerrar la sesión presione sí.</p>
                        </div>
                        <div className="mb-footer">
                            <div className="pull-right">
                                <button className="btn btn-default btn-lg mb-control-close">
                                    No
                                </button>
                                <NavLink
                                    to="/"
                                    onClick={handleClickLogOut}
                                    className="btn btn-success btn-lg"
                                >
                                    Sí
                                </NavLink>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <audio
                id="audio-alert"
                src="audio/alert.mp3"
                preload="auto"
            ></audio>
            <audio id="audio-fail" src="audio/fail.mp3" preload="auto"></audio>
        </div>
    );
};

function getMenuPrincipal(menu, customMenu) {
    if (!menu) return customMenu;
    for (let i = 0; i < Object.keys(menu).length; i++) {
        if (
            menu[i].subMenus != null &&
            menu[i].subMenus.filter((x) => x.visible > 0).length > 0
        ) {
            customMenu.push(
                <NavItem key={i} className="xn-openable">
                    <a href="/#">
                        <span className={menu[i].icono} />
                        <span className={menu[i].class_name}>
                            {menu[i].nombre_visible}
                        </span>
                    </a>
                    <ul>{getSubMenu(menu[i])}</ul>
                </NavItem>
            );
        }
        else if (menu[i].visible) {
            if (!menu[i].url) {
                menu[i].url = "/";
            }
            customMenu.push(
                <NavItem key={i}>
                    <NavLink key={i} tag={Link} to={"/" + menu[i].url} replace>
                        <span className={menu[i].icono} />
                        <span className={menu[i].class_name}>
                            {menu[i].nombre_visible}
                        </span>
                    </NavLink>
                </NavItem>
            );
        }
    }

    return customMenu;
}

function getSubMenu(menu) {
    let subMenu = [];
    for (let i = 0; i < menu.subMenus.length; i++) {
        if (menu.subMenus[i].visible) {
            subMenu.push(
                <NavItem key={i}>
                    <NavLink tag={Link} to={"/" + menu.subMenus[i].url} replace>
                        <span className={menu.subMenus[i].icono} />
                        <span className={menu.subMenus[i].class_name}>
                            {menu.subMenus[i].nombre_visible}
                        </span>
                    </NavLink>
                </NavItem>
            );
        }
    }
    return subMenu;
}

async function setVisto(li) {
    if (li.classList.contains("active"))
        li.classList.remove("active")
    else
        li.classList.add("active")
}

export default HomeLayout;
