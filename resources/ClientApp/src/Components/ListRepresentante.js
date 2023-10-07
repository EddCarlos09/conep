import React, { useState } from 'react';
import CustomCardRepresentante from './CustomCardRepresentante';
import './ListCliente.css';
import { Link } from 'react-router-dom';

const ListRepresentante = ({ data, propiedades, handler, pageExtends = 1, pageSizeExtends = 4, totalRows = 0, search = "", link = "#", params = [], cardsMaxHeight = "auto", cardsMinHeight = "auto" }) => {
    const [pageSize, setPageSize] = useState(pageSizeExtends);

    return (
        <div>
            <div className="topListActions" >
                <p style={{ display: "inline" }}>Mostrar </p>
                <select name="DataTables_Table_0_length" aria-controls="DataTables_Table_0" className="form-control" style={{ width: "50px", display: "inline-block" }}
                    value={pageSize}
                    onChange={e => {
                        pageExtends = 1;
                        setPageSize(Number(e.target.value));
                        handler(pageExtends, e.target.value, search);
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
            <div className="row">
                {data.map((item, i) => {
                    let elemnto = {
                        img: item[propiedades.img] ? item[propiedades.img] : 'assets/images/users/no-image.jpg',
                        title: item[propiedades.title],
                        description: propiedades.description,
                        data: item
                    }
                    let str = "";
                    if (params.length > 0) {
                        params.forEach(p => {
                            str += `/${item[p] === null ? "" : item[p]}`;
                        });
                    }
                    let href = link + str;
                    if (link != "#") {
                        return (

                            <div key={i} className="col-md-3">
                                <Link key={i} to={href}>
                                    <CustomCardRepresentante key={i} item={elemnto} cardsMaxHeight={cardsMaxHeight} cardsMinHeight={cardsMinHeight} />
                                </Link>
                            </div>
                        );
                    } else {
                        return (

                            <div key={i} className="col-md-3">
                                <CustomCardRepresentante key={i} item={elemnto} />
                            </div>
                        );
                    }
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
                                    handler(e.target.value, pageSize, search, true);
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
        </div>
    );
}

export default ListRepresentante;