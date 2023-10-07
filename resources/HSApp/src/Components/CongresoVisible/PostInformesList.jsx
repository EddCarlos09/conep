import React from 'react';

const PostInformesList = ({ data, handler, handlerClickTag, pathImgOrigen = "", defaultImage = "", pageSize = 8, pageExtends = 1, totalRows = 0 }) => {
    const handleFocus = (event) => event.target.select();
    return (
        <>
            <div className="PostInformesContainer pd-25">
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
                <div className="PostInformes two-columns">
                    {
                        data.map((x, i) => {
                            return (
                                <div key={i} className="publication">
                                    <div className="title">
                                        <h5>{x.titulo || ''}</h5>
                                        <span><i className={x.tipo_publicacion !== null ? x.tipo_publicacion.icono : ""}></i></span>
                                    </div>
                                    <div className="date">
                                        <p>{new Date(x.fechaPublicacion + "T00:00:00").toLocaleString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' }) || 'Sin fecha'}</p>
                                    </div>
                                    <div className="publicationDetail">
                                        <div className="autor no-padding">
                                            <div className="photo avatar">
                                                <img src={typeof x.equipo.equipo_imagen !== "undefined" ? pathImgOrigen + x.equipo.equipo_imagen[0].imagen : pathImgOrigen + defaultImage || pathImgOrigen + defaultImage} alt="CV" />
                                            </div>
                                            {x.equipo.nombre || ''}
                                        </div>
                                    </div>
                                    <div className="description">
                                        <figure>
                                            <img src={typeof x.imagen[0] !== "undefined" ? pathImgOrigen + x.imagen[0].imagen : pathImgOrigen + defaultImage} alt=""/>
                                        </figure>
                                    </div>
                                    <div className="publicationTags">
                                        {
                                            x.conceptos !== null && typeof x.conceptos !== "undefined" ?
                                            x.conceptos.map((c, j) => {
                                                return (
                                                    <button key={j} onClick={()=>{handlerClickTag(c.glosario_legislativo)}} type="button">{c.glosario_legislativo.palabra}</button>
                                                )
                                            }) 
                                            :
                                            <></>
                                        }
                                    </div>
                                    <div className="link">
                                        <a href={`#/detalle-balance-informe/${x.id}`} className="linkButton right"><i className="fas fa-chevron-right"></i></a>
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

export default PostInformesList;