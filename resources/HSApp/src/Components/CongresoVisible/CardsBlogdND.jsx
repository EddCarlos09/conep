import React from 'react';
const CardsBlogND = ({ data, handler,handlerClickTag ,pathImgOrigen = "", defaultImage = "", pageSize = 8, bootstrapClasses = "col-lg-3 col-md-4 col-sm-6", pageExtends = 1, pageSizeExtends = 5, totalRows = 0 }) => {
    const handleFocus = (event) => event.target.select();
    return (
        <>
            <div className="SquareCardsContainer">
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
                        {[4,8, 24, 64, 112, 500].map(pageSize => (
                            <option key={pageSize} value={pageSize}>
                                {pageSize}
                            </option>
                        ))}
                    </select>
                    <label htmlFor="">registros por página</label>
                </div>
                <div className="PostInformes two-columns">
                    {
                        data.map((item, i) => {
                            return (                                
                                <div className="publication" key={i}>
                                    <div className="title">
                                        <h5>{item.titulo}</h5>
                                        <span><i className={item.tipo_publicacion.icono}></i></span>
                                    </div>
                                    <div className="date">
                                        <p>{new Date(item.fecha_publicacion).toLocaleDateString()}</p>
                                    </div>
                                    <div className="description">
                                        <figure>
                                            <img src={ item.blog_nd_portada !== "undefined" ? pathImgOrigen + item.blog_nd_portada[3].portada : pathImgOrigen + defaultImage || pathImgOrigen + defaultImage} alt=""/>
                                        </figure>
                                    </div>
                                    <div className="publicationTags">
                                        {
                                            item.conceptos !== null && typeof item.conceptos !== undefined ?
                                            item.conceptos.map((c, j) => {
                                                return (
                                                    <button key={j} onClick={()=>{handlerClickTag(c.glosario_legislativo)}} type="button">{c.glosario_legislativo[0].palabra}</button>
                                                )
                                            })
                                            :
                                            <></>
                                        }
                                    </div>
                                    <div className="link">
                                        <a href={`#/detalle-nuestra-democracia/${item.id}`} className="linkButton right"><i className="fas fa-chevron-right"></i></a>
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

export default CardsBlogND;