import React from 'react';

const ActLegislativaVotacionesList = ({ data, tiposRespuesta = [], origen = "", handler, pageSize = 8, pageExtends = 1, totalRows = 0 }) => {
    const handleFocus = (event) => event.target.select();
    return (
        <>
            <div className="ActLegislativaVotacionesListContainer">
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
                <div className="ActLegislativaVotacionesList">
                    {
                        data.map((votacion, i) => {
                            return (
                                <div key={i} className="listadoItem evenColors">
                                    <div className="rightSide bigContent flex-start w-scroll">
                                        <div className="title">
                                            <h4><i class="fas fa-vote-yea"></i> {votacion.proyecto_de_ley !== null && typeof votacion.proyecto_de_ley !== 'undefined' ? votacion.proyecto_de_ley.titulo : "" || 'No disponible'}</h4>
                                        </div>
                                        <div className="estatus onTop">
                                            <p>{votacion.fecha || ''}</p>
                                        </div>
                                        <div className="estatus">
                                            {
                                                votacion.esPlenaria === 1 ? 
                                                <p>Plenaria</p> : <p className="none"></p>
                                            }
                                            {
                                                votacion.esComision === 1 ? 
                                                <p>Comisión</p> : <p className="none"></p>
                                            }
                                        </div>
                                    </div>
                                    <div className="rightSide bigContent relative">
                                        <div className="vertical-text">
                                            <small>Cuatrienio</small>
                                            <p>{votacion.cuatrienio !== null ? votacion.cuatrienio.nombre : "" || ''}</p>
                                            <small>Legislatura</small>
                                            <p>{votacion.legislatura !== null ? "prueba de legislatura" : "" || ''}</p>
                                        </div>
                                        {
                                                votacion.esComision === 1 ? 
                                                (<div className="estatus">
                                                    <p>{votacion.votacion_comision.comision.nombre || ''}</p> 
                                                </div>)
                                                : <p className="none"></p>
                                        }
                                        
                                    </div>
                                    <div className="tagVotaciones">
                                        {
                                            votacion.voto_general === 0 && (tiposRespuesta !== null || tiposRespuesta.length !== 0 || typeof tiposRespuesta !== 'undefined') ?
                                            tiposRespuesta.map((res, y) => {
                                                let conteo = votacion.votacion_congresista.filter((v)=>{ return v.tipo_respuesta_votacion_id === res.id}).length
                                                return (
                                                    <div key={y} className="votacion">
                                                        <p>{conteo}</p>
                                                        <p>{res.nombre}</p>
                                                    </div>
                                                )
                                            })
                                            : <div className="none"></div>

                                        }
                                        <div className={`votacion ${votacion.voto_general === 0 ? "none" : ""}`}>
                                            <p>{votacion.votosFavor}</p>
                                            <p>Sí</p>
                                        </div>
                                        <div className={`votacion ${votacion.voto_general === 0 ? "none" : ""}`}>
                                            <p>{votacion.votosContra}</p>
                                            <p>No</p>
                                        </div>
                                        <div className={`votacion ${votacion.voto_general === 0 ? "none" : ""}`}>
                                            <p>{votacion.numero_no_asistencias}</p>
                                            <p>Ausente</p>
                                        </div>

                                        {
                                            votacion.urlGaceta !== null ?
                                            <a target="_blank" href={votacion.urlGaceta !== "" ? origen + votacion.urlGaceta : "/#"}>
                                                <div className="votacion">
                                                    <p><i className="fa fa-download"></i></p>
                                                    <p>Gaceta</p>
                                                </div>
                                            </a> :
                                            <div className="votacion">
                                                <p><i className="fa fa-download"></i></p>
                                                <p>Sin gaceta</p>
                                            </div>
                                        }
                                    </div>
                                    <div className="link">
                                        <a href={`#/detalle-votacion/${votacion.id}`} className="linkButton right"><i class="fas fa-chevron-right"></i></a>
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

export default ActLegislativaVotacionesList;