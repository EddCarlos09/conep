import React from 'react';

const ActLegislativaControlPoliticoList = ({ data, handler, pageSize = 8, pageExtends = 1, totalRows = 0 }) => {
    const handleFocus = (event) => event.target.select();
    return (
        <>
            <div className="ActLegislativaControlPoliticoListContainer">
                <div className="RowNumberContainer">
                    <label htmlFor="">Mostrar</label>
                    <select className="form-control"
                        value={pageSize}
                        onChange={async (e) => {
                            let pageSizeT = Number(e.target.value);
                            pageExtends = 1;
                            await handler(pageExtends, pageSizeT);
                        }}
                    >
                        {[8, 24, 64, 112, 500].map(pageSize => (
                            <option key={pageSize} value={pageSize}>
                                {pageSize}
                            </option>
                        ))}
                    </select>
                    <label htmlFor="">registros por página</label>
                </div>
                <div className="ActLegislativaControlPoliticoList">
                    {
                        data.map((control, i) => {
                            return (
                                <div key={i} className="listadoItem evenColors">
                                    <div className="rightSide bigContent">
                                        <div className="title">
                                            <h4><i class="fas fa-exclamation-circle"></i> {control.titulo || 'No disponible'}</h4>
                                        </div>
                                        <div className="estatus onTop">
                                            <p>{control.fecha || ''}</p>
                                        </div>
                                        <div className="estatus">
                                            <p>{control.estado_control_politico !== null || typeof control.estado_control_politico !== 'undefined'  ? control.estado_control_politico.nombre : "" || ""}</p>
                                        </div>
                                    </div>
                                    <div className="rightSide bigContent relative">
                                        <div className="title">
                                            <h4><i class="fas fa-university"></i> {control.comision !== null ? control.comision.nombre : "" || "" }</h4>
                                        </div>
                                        <div className="estatus">
                                            <p>{control.tema_principal_control_politico !== null || typeof control.tema_principal_control_politico !== 'undefined'  ? control.tema_principal_control_politico.nombre : "" || ""}</p>
                                        </div>
                                    </div>
                                    <div className="rightSide">
                                        <div className="title">
                                            <h4><i class="fas fa-users"></i> Citantes </h4>
                                        </div>
                                        <div className="tagDescriptions">
                                        <ul>
                                            {
                                                control.control_politico_citantes?.map((citante, j) => {
                                                    return(
                                                        <li key={j}>{citante.congresista.persona.nombres || ''}</li>
                                                    );
                                                })
                                            }
                                        </ul>
                                    </div>
                                    </div>
                                    <div className="rightSide bigContent">
                                        <div className="vertical-text">
                                            <small>Cuatrienio</small>
                                            <p>{control.cuatrienio !== null ? control.cuatrienio.nombre : "" || ''}</p>
                                            <small>Legislatura</small>
                                            <p>{control.legislatura !== null ? control.legislatura.nombre : "" || ''}</p>
                                        </div>
                                    </div>
                                    <div className="link">
                                        <a href={`#/detalle-control-politico/${control.id}`} className="linkButton right"><i class="fas fa-chevron-right"></i></a>
                                    </div>
                                </div>
                            );
                        })
                    }
                </div>
                <div className="pagination">
                    <div>
                        <span>
                            Página{" "}
                            <strong>
                                {pageExtends} de {Math.ceil(totalRows / pageSize)}
                            </strong>{" (Mostrando "}{data.length}{" registros)"}
                        </span>
                    </div>
                    <div>
                        <button onClick={async (e) => await handler(1, pageSize)} disabled={!(pageExtends > 1)}>
                            <i className="fa fa-caret-left"></i>
                            <i className="fa fa-caret-left"></i>
                        </button>{" "}
                        <button onClick={async (e) => {
                            if (pageExtends > 1) {
                                pageExtends--;
                                await handler(pageExtends, pageSize);
                            }

                        }} disabled={!(pageExtends > 1)}>
                            <i className="fa fa-caret-left"></i>
                        </button>{" "}
                        <span>
                            <input
                                type="number"
                                value={pageExtends || ''}
                                className="form-control"
                                onFocus={handleFocus}
                                onClick={handleFocus}
                                onChange={async (e) => {
                                    if (e.target.value > 0) {
                                        pageExtends = Number(e.target.value);
                                        await handler(pageExtends > Math.ceil(totalRows / pageSize) ? Math.ceil(totalRows / pageSize) : pageExtends, pageSize);
                                    }
                                    else  if (e.target.value === 0){
                                        e.target.value = 1;
                                        pageExtends = 1;
                                        await handler(pageExtends > Math.ceil(totalRows / pageSize) ? Math.ceil(totalRows / pageSize) : pageExtends, pageSize);
                                    }
                                }}
                                style={{ width: "50px", textAlign: "center", display: "inline-block" }}
                            />
                            {" / " + Math.ceil(totalRows / pageSize)}
                        </span>{" "}
                        <button onClick={async (e) => {
                            if (pageExtends < Math.ceil(totalRows / pageSize)) {
                                pageExtends++;
                                await handler(pageExtends, pageSize);
                            }
                        }} disabled={!(pageExtends < Math.ceil(totalRows / pageSize))}>
                            <i className="fa fa-caret-right"></i>
                        </button>{" "}
                        <button onClick={async (e) => await handler(Math.ceil(totalRows / pageSize), pageSize)} disabled={!(pageExtends < Math.ceil(totalRows / pageSize))}>
                            <i className="fa fa-caret-right"></i>
                            <i className="fa fa-caret-right"></i>
                        </button>{" "}
                    </div>
                </div>
            </div>
        </>
    );
}

export default ActLegislativaControlPoliticoList;