import React, { useState, useEffect, useRef } from "react";
import NotificacionService from "../../src/Services/Base/General/Notificacion.Service";
import { Link, useHistory } from 'react-router-dom';
import moment from 'moment';
import 'moment/locale/es';
import AuthLogin from "../Utils/AuthLogin";

const Notificacion = ({user}) => {
    let email = user;

    const auth = new AuthLogin();
    const[notificaciones, setNotificaciones] = useState([]);
    const [countx, setCountcountx] = useState(0);
    const [has_notification, setHasNotification] = useState(0);
    const history = useHistory();
    let currentId = useRef(0);
    const [classLi, setClassLi] = useState('pull-right notification');

    useEffect(() => {
        getNotificaciones();

        return history.listen((location) => {
            alert(currentId.current)
            if(currentId.current > 0){
                let email = auth.email();
                let proyecto_ley_id = currentId.current;
                NotificacionService.destroy(email, proyecto_ley_id).then(getNotificaciones());
                setClassLi('pull-right notification');
            }
        });
    },[]);

    async function setVisto(li) {
        if (li.classList.contains("active"))
            li.classList.remove("active")
        else
            li.classList.add("active")
    }

    const getNotificaciones = async () => {
        await NotificacionService.getAll(email)
            .then(response => {
                let notificaciones = [];
                setHasNotification(response.data.length);

                response.data.map(item => (
                    notificaciones.push({
                        id: item.id,
                        notificacion: item.notificacion,
                        fecha: new Date(item['created_at']),
                        url: item.url,
                        time: moment(item['created_at']).fromNow()
                    })
                ));
                setNotificaciones(notificaciones);
            })
            .catch(function (error) {
                console.error(error);
            });
    }

    return (
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
                                    <Link
                                        to={'proyecto-ley-editar/' + item['notificacion']['proyecto_ley_id']}
                                        onClick={ ()=>{
                                            alert(item['notificacion']['proyecto_ley_id'])
                                        }}
                                    >
                                        <button
                                            style={{ transform: "translateY(-35px)" }}
                                            className="btn btn-danger pull-right"
                                            onClick={ () => {

                                                currentId.current = item['notificacion']['proyecto_ley_id']
                                                alert("nwe: " + item['notificacion']['proyecto_ley_id'])
                                            }
                                            }
                                        >Ir</button>
                                    </Link>
                                </div>
                            );
                        })
                    }
                </div>
                <div className="panel-footer text-center">
                    <Link to="/notificaciones"
                    >Ver todas las notificaciones</Link>
                </div>
            </div>
        </li>
    );
}

export default Notificacion;
