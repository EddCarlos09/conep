import React from 'react';
import './SquareCards.css';


const SquareCards = ({ data, handler, pathImgOrigen = "", defaultImage = "", handlerForLoadModal, disableBGPhoto=false, esModal = false, targetModal = "" ,pageSize = 8, bootstrapClasses = "col-lg-3 col-md-4 col-sm-6", pageExtends = 1, pageSizeExtends = 5, totalRows = 0 }) => {
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
                        {[8, 24, 64, 112, 500].map(pageSize => (
                            <option key={pageSize} value={pageSize}>
                                {pageSize}
                            </option>
                        ))}
                    </select>
                    <label htmlFor="">registros por página</label>
                </div>
                <div className="SquareCards integrantesContainer sm:flex sm:flex-wrap sm:-mx-4">
                    {
                        data.map((x, i) => {
                            return (
                                <div key={i} className="sm:flex sm:w-1/2 xl:w-1/4 mb-5 sm:px-4">
                                    <div className="card card_column card_hoverable">
                                        <div className="image">
                                            <a href={`#/perfil-congresista/${x.id}`}>
                                                <div className="aspect-w-4 aspect-h-3">
                                                    <img src={typeof x.imagenes[2] !== "undefined" ? pathImgOrigen + x.imagenes[2].imagen : defaultImage} alt="" />
                                                </div>
                                            </a>
                                        </div>
                                        <div className="header">
                                            <h5><a href={`#/perfil-congresista/${x.id}`}>{x.nombres || ''} {x.apellidos || ''}</a></h5>
                                        </div>
                                        <div className="body">
                                            <h6 className="uppercase">Comisión</h6>
                                            <p>{x?.comision_miembro?.comision?.nombre || 'Sin comisión asignada'}</p>
                                            <h6 className="uppercase">Partido</h6>
                                            <p>{x?.partido?.nombre || 'Sin partido asignada'}</p>
                                            <h6 className="uppercase mt-4">Redes sociales</h6>
                                            <ul className="social-links text-center">
                                            {
                                                x?.contactos !== null && typeof x?.contactos !== "undefined" ? 
                                                x?.contactos.map((x,j) => {
                                                    if(x.datos_contacto.tipo === 2){
                                                        return (
                                                            <li>
                                                                <a key={j} href={x.cuenta} target="_blank">
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
                            <i className="icon la la-angle-left"></i>
                            <i className="icon la la-angle-left"></i>
                        </button>{" "}
                        <button onClick={async (e) => {
                            if (pageExtends > 1) {
                                pageExtends--;
                                await handler(pageExtends, pageSize);
                            }

                        }} disabled={!(pageExtends > 1)}>
                            <i className="icon la la-angle-left"></i>
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
                            <i className="icon la la-angle-right"></i>
                        </button>{" "}
                        <button onClick={async (e) => await handler(Math.ceil(totalRows / pageSize), pageSize)} disabled={!(pageExtends < Math.ceil(totalRows / pageSize))}>
                            <i className="icon la la-angle-right"></i>
                            <i className="icon la la-angle-right"></i>
                        </button>{" "}
                    </div>
                </div>
            </div>
        </>
    );
}

export default SquareCards;