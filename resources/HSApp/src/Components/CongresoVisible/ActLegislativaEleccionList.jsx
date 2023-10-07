import React from 'react';

const ActLegislativaEleccionList = ({ data, pathImgOrigen = "", defaultImage = "", handler, pageSize = 8, pageExtends = 1, totalRows = 0 }) => {
    const handleFocus = (event) => event.target.select();
    return (
        <>
            <div className="ActLegislativaEleccionListContainer">
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
                <div className="ActLegislativaEleccionList">
                    {
                        data.map((eleccion, i) => {
                            return (
                                <div key={i} className="listadoItem evenColors">
                                    <div className="rightSide bigContent flex-start w-scroll">
                                        <div className="title">
                                            <h4><i class="fas fa-vote-yea"></i> {eleccion.titulo || 'No disponible'}</h4>
                                        </div>
                                        <div className="estatus onTop">
                                            <p>{eleccion.fechaDeEleccion || ''}</p>
                                        </div>
                                        <div className="estatus md">
                                            <p>{eleccion.corporacion !== null ? eleccion.corporacion.nombre : "Corp. no disponible" || ''}</p>
                                        </div>
                                    </div>
                                    <div className="rightSide bigContent relative">
                                        <div className="title">
                                            <div className="photo avatar center-block">
                                                <img src={eleccion.funcionario_actual !== null ? (typeof eleccion.funcionario_actual.congresista_elecciones.persona_elecciones.imagenes[1] !== "undefined" ? pathImgOrigen + eleccion.funcionario_actual.congresista_elecciones.persona_elecciones.imagenes[1].imagen : defaultImage) : defaultImage} alt=""/>
                                            </div>
                                            <h4>{eleccion.funcionario_actual !== null ? eleccion.funcionario_actual.congresista_elecciones.persona_elecciones.nombres + " " + eleccion.funcionario_actual.congresista_elecciones.persona_elecciones.apellidos : "Nombre no disponible"}</h4>
                                        </div>
                                        <div className="estatus">
                                            <p>{eleccion.cargo_proveer !== null ? eleccion.cargo_proveer.nombre : "Cargo no disponible" || ''}</p>
                                        </div>
                                    </div>
                                    <div className="rightSide bigContent">
                                        <div className="vertical-text">
                                            <small>Cuatrienio</small>
                                            <p>{eleccion.cuatrienio !== null ? eleccion.cuatrienio.nombre : "" || ''}</p>
                                            <small>Comisión</small>
                                            <p>{eleccion.comision !== null ? eleccion.comision.nombre : "" || ''}</p>
                                        </div>
                                    </div>
                                    <div className="tagVotaciones">
                                        <div className="votacion">
                                            <p>{eleccion.resultadoVotacion}</p>
                                            <p>Resultado</p>
                                        </div>
                                    </div>
                                    <div className="link">
                                        <a href={`#/detalle-eleccion/${eleccion.id}`} className="linkButton right"><i class="fas fa-chevron-right"></i></a>
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

export default ActLegislativaEleccionList;