import React from 'react';
import './SquareCards.css';


const SquareCardsPartidos = ({ data, handler, pathImgOrigen = "", defaultImage = "", handlerForLoadModal, disableBGPhoto=false, esModal = false, targetModal = "" ,pageSize = 8, bootstrapClasses = "col-lg-3 col-md-4 col-sm-6", pageExtends = 1, pageSizeExtends = 5, totalRows = 0 }) => {
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
                <div className="SquareCards integrantesContainer four-columns">
                    {
                        data.map((x, i) => {
                            return (
                                <div key={i} className={``}>
                                    <div className="integrante">
                                        <div className="topInfo" ></div>
                                        <div className="photo">
                                            <img src={typeof x.partido_imagen[2] !== "undefined" ? pathImgOrigen + x.partido_imagen[2].imagen : defaultImage} alt="" />
                                        </div>
                                        <div className="bottomInfo">
                                            <div className="tagDescriptions no-icons text-center">
                                                <ul>
                                                    <li><strong>{x.nombre || ''}</strong></li>
                                                    <li>{x.fechaDeCreacion || ''}</li>
                                                </ul>
                                            </div>
                                            {
                                                esModal ? 
                                                <div className="link">
                                                    <a href={`#/`} data-bs-toggle="modal" data-bs-target={targetModal} onClick={()=>{handlerForLoadModal(x)}} className="linkButton center"><i className="fas fa-chevron-right"></i></a>
                                                </div> :
                                                <div className="link">
                                                    <a href={`#/detalle-partido/${x.id}`} className="linkButton center"><i className="fas fa-chevron-right"></i></a>
                                                </div>
                                            }
                                            
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

export default SquareCardsPartidos;