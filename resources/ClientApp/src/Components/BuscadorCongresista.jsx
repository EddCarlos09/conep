import React from 'react';
import './BuscadorPersona.css';
const defaultCongresista = {id: 0, nombres: "Sin datos", apellidos: "", imagenes: [], lugar_nacimiento: {} };
const BuscadorCongresista = ({ selectMultiple = false, data = [defaultCongresista], imgDefault, imgOrigin = "", selectableProperty = "id", selected = defaultCongresista, arraySelected = [defaultCongresista], handler, pageSize = 8, pageExtends = 1, totalRows = 0, search = "", handlerSelectCongresista, handlerChangeSearch}) => {
    const handleFocus = (event) => event.target.select();
    return (
        <div className="BuscadorPersonaComponent">
            <div className="TopFilterContainer">
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
                        {[15, 30, 64, 112, 500, 1000].map(pageSize => (
                            <option key={pageSize} value={pageSize}>
                                {pageSize}
                            </option>
                        ))}
                    </select>
                    {/* <label htmlFor="">registros por página</label> */}
                </div>
                <div className="RowSearcherContainer">
                    <input type="text" value={search || ""}
                        onChange={async (e) => {
                            pageExtends = 1;
                            await handlerChangeSearch(e.target.value);
                        }}
                        onKeyUp={async (e) => {
                            if (e.key === "Enter") {
                                await handler(pageExtends, pageSize, e.target.value);
                            }
                        }}
                        placeholder="Buscar persona" className="form-control" />
                    <span className="input-group-text"><button onClick={async () => { await handler(pageExtends, pageSize, search); }} type="button" className="btn btn-primary"><i className="fa fa-search"></i></button></span>
                </div>
            </div>
            <div className="personaChoosed">
            {
                selected.id !== 0 ?
                <div className="personaItem">
                    <div className="photo">
                        <img src={selected.imagenes[0] !== undefined ? imgOrigin + selected.imagenes[0].imagen : imgDefault || ""} />
                    </div>
                    <div className="name">
                        <p>{`${selected.nombres || ""} ${selected.apellidos || ""}`}</p>
                    </div>
                    <div className="estate">
                        <p>{`${selected.lugar_nacimiento?.nombre || ""}`}</p>
                    </div>
                </div>
                :
                <p>Ninguna persona seleccionada</p>
            }
            </div>
            <div className="buscadorHeaders">
                <ul>
                    <li>Foto</li>
                    <li>Nombre</li>
                    <li>Lugar de nacimiento</li>
                </ul>
            </div>
            <div className="BuscadorPersonaContainer">
                {
                    data !== null && data !== undefined && data.length > 0 ?
                    data.map((congresista, i) => {
                        // console.log(congresista)
                        return (
                            <div onClick={()=>{
                                handlerSelectCongresista(congresista);
                            }} key={i} className={`personaItem ${selected.id === congresista.id ? "selected" : ""}`}>
                                <div className="photo">
                                    <img src={congresista.persona.imagenes[0] !== undefined ? imgOrigin + congresista.persona.imagenes[0].imagen : imgDefault || ""} />
                                </div>
                                <div className="name">
                                    <p>{`${congresista.persona.nombres || ""} ${congresista.persona.apellidos || ""}`}</p>
                                </div>
                                <div className="estate">
                                    <p>{`${congresista.persona.lugar_nacimiento?.nombre || ""}`}</p>
                                </div>
                            </div>
                        );
                    })
                    : ""
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
                    <button type="button" onClick={async (e) => await handler(1, pageSize)} disabled={!(pageExtends > 1)}>
                        <i className="fa fa-caret-left"></i>
                        <i className="fa fa-caret-left"></i>
                    </button>{" "}
                    <button type="button" onClick={async (e) => {
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
                    <button type="button" onClick={async (e) => {
                        if (pageExtends < Math.ceil(totalRows / pageSize)) {
                            pageExtends++;
                            await handler(pageExtends, pageSize);
                        }
                    }} disabled={!(pageExtends < Math.ceil(totalRows / pageSize))}>
                        <i className="fa fa-caret-right"></i>
                    </button>{" "}
                    <button type="button" onClick={async (e) => await handler(Math.ceil(totalRows / pageSize), pageSize)} disabled={!(pageExtends < Math.ceil(totalRows / pageSize))}>
                        <i className="fa fa-caret-right"></i>
                        <i className="fa fa-caret-right"></i>
                    </button>{" "}
                </div>
            </div>
        </div>

    );
}
export default BuscadorCongresista;
