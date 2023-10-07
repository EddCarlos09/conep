import React, { useState } from 'react';
import CustomCad from './CustomCard';
import AuthLogin from "../Utils/AuthLogin";
// import './ListCliente.css';
import { Link } from 'react-router-dom';
import { Constantes } from "../Constants/Constantes.js";

const auth = new AuthLogin();

const ListComisiones = ({ data, propiedades, pathImgOrigen = "", defaultImage = "", handler, pageExtends = 1, pageSizeExtends = 5, totalRows = 0, pageSizeOptions = [8, 24, 64, 112, 500], search = "", bootstrapClasses = "col-lg-3 col-md-4 col-sm-6" }) => {
    const [pageSize, setPageSize] = useState(pageSizeExtends);
    return (
        <>
            <div >
                <div className="RowNumberContainer">
                    <label htmlFor="">Mostrar</label>
                    <select className="form-control"
                        value={pageSize}
                        onChange={e => {
                            pageExtends = 1;
                            setPageSize(Number(e.target.value));
                            handler(pageExtends, e.target.value, search, false);
                        }}
                    >
                        {pageSizeOptions.map(pageSize => (
                            <option key={pageSize} value={pageSize}>
                                {pageSize}
                            </option>
                        ))}
                    </select>
                    <label htmlFor="">registros por página</label>
                </div>
            </div>
            <div className="sm:flex sm:flex-wrap sm:-mx-4">
                {
                    data.map((item, i) => {
                        let path = getImgComision(item) !== null ? 
                        auth.pathApi()+ getImgComision(item) || ""
                        : Constantes.NoImagenPicture;
                        return (
                            <div key={i} className="sm:flex sm:w-1/2 xl:w-1/4 mb-5 sm:px-4">
                                    <div className="card card_column card_hoverable">
                                        <div className="image">
                                        <a href={`#/detalle-comision/${item.id}`}>
                                                <div className="aspect-w-4 aspect-h-3">
                                                    <img src={path} alt={item.nombre} />
                                                </div>
                                            </a>
                                        </div>
                                        <div className="header">
                                            <h5><a href={`#/detalle-comision/${item.id}`}>{item.nombre}</a></h5>
                                        </div>
                                        <div className="body">
                                            <h6 className="uppercase">Tipo</h6>
                                            <p>{item.tipo_comision.nombre}</p>
                                            <h6 className="uppercase mt-4">Redes sociales</h6>
                                            <ul className="social-links text-center">
                                            {
                                                item?.comision_datos_contacto !== null && typeof item?.comision_datos_contacto !== "undefined" ? 
                                                item?.comision_datos_contacto.map((x,i) => {
                                                    if(x.datos_contacto.tipo === 2){
                                                        return (
                                                            <li>
                                                                <a key={i} href={x.cuenta} target="_blank">
                                                                    <img src={typeof x.datos_contacto.datos_contacto_imagen[0] !== 'undefined' ? (pathImgOrigen + x.datos_contacto.datos_contacto_imagen[0].imagen) : defaultImage} alt=""/>
                                                                </a>
                                                            </li>
                                                        )
                                                    }
                                                })
                                                :
                                                <></>
                                            }
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                        );
                    })
                }
            </div>
            <div className="pagination">
                <div style={{ float: "left" }}>
                    <span>
                        Página{" "}
                        <strong>
                            {pageExtends} de {Math.ceil(totalRows / pageSize)}
                        </strong>{" (Mostrando "}{data.length}{" registros)"}
                    </span>
                </div>
                <div style={{ float: "right" }}>
                    <button onClick={() => handler(1, pageSize, search, false)} disabled={!(pageExtends > 1)}>
                        <i className="icon la la-angle-left"></i>
                        <i className="icon la la-angle-left"></i>
                    </button>{" "}
                    <button onClick={() => {
                        if (pageExtends > 1) {
                            pageExtends--;
                            handler(pageExtends, pageSize, search, false);
                        }

                    }} disabled={!(pageExtends > 1)}>
                        <i className="icon la la-angle-left"></i>
                    </button>{" "}
                    <span>
                        <input
                            type="number"
                            value={pageExtends}
                            className="form-control"
                            onChange={e => {
                                if (e.target.value > 0)
                                    handler(e.target.value > Math.ceil(totalRows / pageSize) ? Math.ceil(totalRows / pageSize) : e.target.value, pageSize, search, true);
                                else
                                    e.target.value = 1;
                            }}
                            style={{ width: "50px", textAlign: "center", display: "inline-block" }}
                        />
                        {" / " + Math.ceil(totalRows / pageSize)}
                    </span>{" "}
                    <button onClick={(e) => {
                        if (pageExtends < Math.ceil(totalRows / pageSize)) {
                            pageExtends++;
                            handler(pageExtends, pageSize, search, false);
                        }
                    }} disabled={!(pageExtends < Math.ceil(totalRows / pageSize))}>
                        <i className="icon la la-angle-right"></i>
                    </button>{" "}
                    <button onClick={() => handler(Math.ceil(totalRows / pageSize), pageSize, search, false)} disabled={!(pageExtends < Math.ceil(totalRows / pageSize))}>
                        <i className="icon la la-angle-right"></i>
                        <i className="icon la la-angle-right"></i>
                    </button>{" "}
                </div>
            </div>
        </>);
}

function getImgComision(item){
    if(item.comision_imagen.length > 0){
        let img = item.comision_imagen[5];
        if(img != undefined)
            return img.imagen;
    }
    return null;
}
export default ListComisiones;