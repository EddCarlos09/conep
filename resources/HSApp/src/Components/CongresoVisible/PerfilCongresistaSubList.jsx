import React from 'react';

const PerfilCongresistaSubList = ({ data = [1,2], propiedades, params = [], link = "#", bootstrapClass = "col-md-6", handler, pageSize = 8, pageExtends = 1, totalRows = 0 }) => {
    const handleFocus = (event) => event.target.select();
    return (
        <>
            <div className="SubListContainer">
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
                <div className="row">
                    {
                        data.map((item, i) => {
                            let elemento = {
                                title: getObjectValueByString(propiedades.title, item),
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
                            return (
                                <div className="subItemSection type-list" key={i} >
                                    <h3><a href={href} target="_blank">{elemento.title}</a></h3>
                                    <div className="lg:flex lg:-mx-4">
                                        {elemento.description.map((val, j) => {
                                            return (
                                                <div className="lg:w-1/2 lg:px-4">
                                                    <div
                                                        className="card px-4 py-8 text-center lg:transform hover:scale-110 hover:shadow-lg transition-transform duration-200">
                                                        <p className="mt-2">{val.title}</p>
                                                        <div className="text-primary mt-1 text-xl leading-none">{getObjectValueByString(val.text, elemento.data) === null
                                                    || getObjectValueByString(val.text, elemento.data) === ""
                                                    || getObjectValueByString(val.text, elemento.data) === undefined
                                                    ? "No disponible" : getObjectValueByString(val.text, elemento.data)}</div>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                    <hr />
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
function getObjectValueByString(s, obj) {
    if (s === null || s === undefined)
        return null
    let properties;
    if (s.includes("."))
        properties = s.split(".");
    else
        properties = [s];
    
    properties.forEach(i => {
        obj = obj !== null ? obj[i] : "Na"
        // if(Array.isArray(obj))
    })
    return obj
}
export default PerfilCongresistaSubList;