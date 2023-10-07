import React from 'react';
import { isTemplateTail } from 'typescript';
import { DeviceResolutions } from "../../Constants/Constantes.js";

const pathApi = () => {
    return "https://api.observatoriolegislativoconep.com/uploads/";
}
const CongresoVisibleEquipo = (props) => {
    let body = document.querySelector("body");
    let clientWidth = 0;
    let imageChoosedIndex = 0;
    if (body) {
        clientWidth = body.clientWidth;
        if (clientWidth !== 0) {
            if (clientWidth < DeviceResolutions.DesktopHD && clientWidth >= DeviceResolutions.TabletSecondary) {
                imageChoosedIndex = 1
            }
            else if (clientWidth < DeviceResolutions.TabletSecondary && clientWidth >= DeviceResolutions.PhoneSecondary) {
                imageChoosedIndex = 2
            }
        }
    }

    return (
        <div>
            <section className="no-full-height">
                <h3 className="text-center"><i className="far fa-handshake" style={{ color: "var(--bg-header)" }}></i> Nuestro equipo</h3>
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="equiposContainer">
                                {
                                    props.Equipos !== null && typeof props.Equipos !== "undefined" ? 
                                    props.Equipos.map((value, index) => {
                                        return (
                                            <div className="equipo">
                                                <div className="info" key={index}>
                                                    <div className="name" >{value.nombre}</div>
                                                    <div className="desc">
                                                        <p dangerouslySetInnerHTML={{ __html: value.descripcion }} />
                                                    </div>
                                                    <div className="social-links right">
                                                        {                                                            
                                                            value.equipo_datos_contacto.map((item, i) => {
                                                                if (item.datos_contacto.tipo === 2) {
                                                                    return (
                                                                        <a key={i} href={item.cuenta} target="_blank">
                                                                            <img src={typeof item.datos_contacto.datos_contacto_imagen[0] !== 'undefined' ? pathApi() + item.datos_contacto.datos_contacto_imagen[0].imagen : ""} alt="" />
                                                                            {/* <i className="fab fa-facebook-f">{item.datos_contacto.nombre}</i> */}
                                                                        </a>
                                                                    )
                                                                }
                                                                else {
                                                                    return(
                                                                    <span>
                                                                        <img src={typeof item.datos_contacto.datos_contacto_imagen[0] !== 'undefined' ? pathApi() + item.datos_contacto.datos_contacto_imagen[0].imagen : ""} alt="" />
                                                                        <small>{" " + item.cuenta}</small>                                                                       
                                                                    </span>
                                                                    )
                                                                }
                                                            })
                                                        }
                                                    </div>
                                                </div>
                                                <div className="photo">
                                                    {
                                                        <img src={pathApi() + value.equipo_imagen[imageChoosedIndex].imagen} alt="Equipo CV" />
                                                    }
                                                </div>
                                            </div>
                                        )
                                    }):""
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default CongresoVisibleEquipo;