import React, { useState } from 'react';
import CustomFlatCard from './CustomFlatCard';
import TitleCustomCard from './TitleCustomCard';
import AuthLogin from "../Utils/AuthLogin";
import { ModuloPermiso } from '../Permisos/ModuloPermiso';
import { Divider } from '@material-ui/core';

const auth = new AuthLogin();

const ListTickets = ({ data = [], dataAvisos = [], propiedades = {}, propiedadesAvisos = {}, tipo, tickets = false, avisos = false, handler, pageExtends = 1, pageSizeExtends = 4, totalRows = 0, search = "" }) => {
    const [pageSize, setPageSize] = useState(pageSizeExtends);
    return (
        <>
            
            <div className="panel-body posts">
            <div className="row" >
                <p style={{ display: "inline" }}>Mostrar </p>
                <select name="DataTables_Table_0_length" aria-controls="DataTables_Table_0" className="form-control" style={{margin: "0 7px", width: "50px", display: "inline-block", border: "1px solid #eaeaea", backgroundColor: "#fff", boxShadow: "0px 1px 2px 0px rgba(0,0,0,.4)" }}
                    value={pageSize}
                    onChange={e => {
                        pageExtends = 1;
                        setPageSize(Number(e.target.value));
                        handler(pageExtends, e.target.value, search, false);
                    }}
                >
                    {[4, 8, 12, 16, 24, 32].map(pageSize => (
                        <option key={pageSize} value={pageSize}>
                            {pageSize}
                        </option>
                    ))}
                </select>
                <p style={{ display: "inline" }}> registros por página</p>
            </div>
                {
                    tickets ? 
                    <>
                    <h2 style={{marginTop: "17px"}}>Mis tickets</h2>
                    <div className="panel-body list-group list-group-contacts two-columns tickets">
                        {data.map((item, i) => {
                            let ticket = { idTicket: item[propiedades.id], admin: 0 }
                            let elemnto = {
                                id: item[propiedades.id],
                                idStatus: item[propiedades.idStatus],
                                status: item.status,
                                link: auth.tieneModuloPermiso(ModuloPermiso.ContactoTickets.VerConversacion) ? `${propiedades.link}${0}/${item[propiedades.id]}` : '',
                                day: item[propiedades.day],
                                month: item[propiedades.month],
                                img: item[propiedades.image.img],
                                titleImg: item[propiedades.image.title],
                                title: item[propiedades.title],
                                text: item[propiedades.text],
                                linkAction: auth.tieneModuloPermiso(ModuloPermiso.ContactoTickets.VerConversacion) ? `${propiedades.action.linkAction}${0}/${item[propiedades.id]}` : '',
                                titleAction: item[propiedades.action.titleAction],
                                activo: item["activo"],
                                buttons: propiedades.buttons
                            }
                            return (
                                <div key={i}>
                                    <CustomFlatCard tipo={tipo} item={elemnto} key={i} />
                                </div>
                            );
                        })
                        }
                    </div>
                    <hr />
                </> : ""
                }
                {
                    avisos ? 
                    <>
                        <div className="row">
                            {
                                dataAvisos.map((itemA, j) => {
                                    let element = {
                                        title: itemA[propiedadesAvisos.title],
                                        subtitle: itemA[propiedadesAvisos.subtitle],
                                        text: itemA[propiedadesAvisos.text],
                                        photo: itemA[propiedadesAvisos.photo] === null ? 'assets/images/users/no-image.jpg' : itemA[propiedadesAvisos.photo] === '' ? 'assets/images/users/no-image.jpg' : `${auth.pathApi()}${itemA[propiedadesAvisos.photo]}`,
                                        altPhoto: itemA[propiedadesAvisos.altPhoto],
                                        link: auth.tieneModuloPermiso(ModuloPermiso.ContactoAvisos.VerAviso) ? `${propiedadesAvisos.link}${itemA[propiedadesAvisos.id]}` : ''
                                    }
                                    return (
                                        <div className="col-md-6" key={j}>
                                            <TitleCustomCard item={element} />
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </> : ""
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
                        <i className="fa fa-caret-left"></i>
                        <i className="fa fa-caret-left"></i>
                    </button>{" "}
                    <button onClick={() => {
                        if (pageExtends > 1) {
                            pageExtends--;
                            handler(pageExtends, pageSize, search, false);
                        }

                    }} disabled={!(pageExtends > 1)}>
                        <i className="fa fa-caret-left"></i>
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
                        <i className="fa fa-caret-right"></i>
                    </button>{" "}
                    <button onClick={() => handler(Math.ceil(totalRows / pageSize), pageSize, search, false)} disabled={!(pageExtends < Math.ceil(totalRows / pageSize))}>
                        <i className="fa fa-caret-right"></i>
                        <i className="fa fa-caret-right"></i>
                    </button>{" "}
                </div>
            </div>
        </>);
}

export default ListTickets;