import React, { useState } from 'react';
import CustomAccordion from './CustomAccordion';
import AuthLogin from "../Utils/AuthLogin";
import { ModuloPermiso } from '../Permisos/ModuloPermiso';
import { Divider } from '@material-ui/core';

const auth = new AuthLogin();

const ListArchivosComision = ({ data = [], propiedades = {}, handler, handlerButtonNew, handlerButtonDelete, pageExtends = 1, pageSizeExtends = 5, totalRows = 0, search = "", showButtonDelete = true }) => {
    const [pageSize, setPageSize] = useState(pageSizeExtends);
    return (
        <>
            <div className="row" >
                <p style={{ display: "inline" }}>Mostrar </p>
                <select name="DataTables_Table_0_length" aria-controls="DataTables_Table_0" className="form-control" style={{ width: "50px", display: "inline-block" }}
                    value={pageSize}
                    onChange={e => {
                        pageExtends = 1;
                        setPageSize(Number(e.target.value));
                        handler(pageExtends, e.target.value, search, false);
                    }}
                >
                    {[5, 10, 15, 20, 25, 30].map(pageSize => (
                        <option key={pageSize} value={pageSize}>
                            {pageSize}
                        </option>
                    ))}
                </select>
                <p style={{ display: "inline" }}> registros por página</p>
            </div>
            <div className="row">
                <div className="panel-body faq">
                    {
                        data.map((item, i) => {
                            let head = {
                                title: item.titulo,
                                secondText: item.fecha
                            }
                            return (
                                <CustomAccordion key={i} head={head} element={item} handler={handlerButtonDelete} showButtonDelete={showButtonDelete}/>
                                )
                        })
                    }
                </div>
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

export default ListArchivosComision;