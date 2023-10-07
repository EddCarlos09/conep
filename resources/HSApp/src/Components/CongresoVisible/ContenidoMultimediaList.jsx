import React from 'react';
import './ContenidoMultimediaList.css';

const ContenidoMultimediaList = ({ data, propiedades, params = [], link = "#", className= "", handlerPagination, handlerForLoadModal, esModal = false, targetModal = "", pathImgOrigen = "", defaultImage = "", pageSize = 8, pageExtends = 1, totalRows = 0 }) => {
    const handleFocus = (event) => event.target.select();
    return (
        <>
            <div className={`ContenidoMultimediaContainer ${className}`}>
                <div className="RowNumberContainer">
                    <label htmlFor="">Mostrar</label>
                    <select className="form-control"
                        value={pageSize}
                        onChange={async (e) => {
                            let pageSizeT = Number(e.target.value);
                            pageExtends = 1;
                            await handlerPagination(pageExtends, pageSizeT);
                        }}
                    >
                        {[5, 10, 25, 50].map(pageSize => (
                            <option key={pageSize} value={pageSize}>
                                {pageSize}
                            </option>
                        ))}
                    </select>
                    <label htmlFor="">registros por página</label>
                </div>
                <div className="ContenidoMultimedia CMList">
                {
                    data.map((item, i) => {
                        // Ejemplo de propiedades.description
                        /*
                        {
                            title: "", text: "", esImg: false, img: "ruta de imagen", putOnFirstElement: false (pone el atributo text como parte del texto del primero elemento)
                        }

                        */
                        let elemento = {
                            description: propiedades.description,
                            generalIcon: propiedades.generalIcon,
                            eachIcon: getObjectValueByString(propiedades.eachIcon, item),
                            generalActionTitle: propiedades.generalActionTitle,
                            eachActionTitle: getObjectValueByString(propiedades.eachActionTitle, item),
                            data: item
                        }
                        let putOnFirstElementDescriptions = elemento.description.filter((h)=>{return h.putOnFirstElement === true});
                        let putOnFirstElementString = ``;
                        putOnFirstElementDescriptions.forEach((x,k)=> {
                            putOnFirstElementString += ` - ${getObjectValueByString(x.text, elemento.data)}`;
                        })
                        let str = "";
                        if (params.length > 0) {
                            params.forEach(p => {
                                str += `/${item[p] === null ? "" : item[p]}`;
                            });
                        }
                        let href = link + str;
                        if (link != "#") {
                            return (
                                <div key={i} className="CMItem">
                                    {elemento.description.map((val, j) => {
                                        return (
                                            <div key={j} className={`title ${val.putOnFirstElement ? "none" : ""}`}>
                                                {
                                                    val.esImg ?
                                                    <div className="photo avatar center-block">
                                                        <img src={val.img !== "" ? (getObjectValueByString(val.img, elemento.data) !== "Na" ? pathImgOrigen + getObjectValueByString(val.img, elemento.data) : defaultImage) : defaultImage} alt=""/>
                                                    </div> :
                                                    <strong>{val.title}:</strong>
                                                }
                                                <p className={val.esImg ? "text-center" : ""}>{getObjectValueByString(val.text, elemento.data) === null
                                                        || getObjectValueByString(val.text, elemento.data) === ""
                                                        || getObjectValueByString(val.text, elemento.data) === undefined
                                                        ? "No disponible" : getObjectValueByString(val.text, elemento.data)} {" "}
                                                    {
                                                        j === 0 ? // Para poner los elementos sobre el texto del primero
                                                        <strong className="font-condensed-it">{putOnFirstElementString}</strong>
                                                        :
                                                        ""
                                                    }
                                                </p>
                                            </div>
                                        )
                                    })}
                                    {
                                        esModal ? 
                                        <a href={href} data-bs-toggle="modal" data-bs-target={targetModal} onClick={()=>{handlerForLoadModal(elemento)}} className="action">
                                            <i className={
                                                    elemento.generalIcon !== null ? elemento.generalIcon :
                                                    elemento.eachIcon
                                                }></i>
                                            <p>
                                                {
                                                    elemento.generalActionTitle !== null ? elemento.generalActionTitle :
                                                    elemento.eachActionTitle
                                                }
                                            </p>
                                        </a>
                                        :
                                        <a href={href} className="action">
                                            <i className={
                                                    elemento.generalIcon !== null ? elemento.generalIcon :
                                                    elemento.eachIcon
                                                }></i>
                                            <p>
                                                {
                                                    elemento.generalActionTitle !== null ? elemento.generalActionTitle :
                                                    elemento.eachActionTitle
                                                }
                                            </p>
                                        </a>
                                    }
                                </div>
                            );
                        }
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
                        <button onClick={async (e) => await handlerPagination(1, pageSize)} disabled={!(pageExtends > 1)}>
                            <i className="fa fa-caret-left"></i>
                            <i className="fa fa-caret-left"></i>
                        </button>{" "}
                        <button onClick={async (e) => {
                            if (pageExtends > 1) {
                                pageExtends--;
                                await handlerPagination(pageExtends, pageSize);
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
                                        await handlerPagination(pageExtends > Math.ceil(totalRows / pageSize) ? Math.ceil(totalRows / pageSize) : pageExtends, pageSize);
                                    }
                                    else  if (e.target.value === 0){
                                        e.target.value = 1;
                                        pageExtends = 1;
                                        await handlerPagination(pageExtends > Math.ceil(totalRows / pageSize) ? Math.ceil(totalRows / pageSize) : pageExtends, pageSize);
                                    }
                                }}
                                style={{ width: "50px", textAlign: "center", display: "inline-block" }}
                            />
                            {" / " + Math.ceil(totalRows / pageSize)}
                        </span>{" "}
                        <button onClick={async (e) => {
                            if (pageExtends < Math.ceil(totalRows / pageSize)) {
                                pageExtends++;
                                await handlerPagination(pageExtends, pageSize);
                            }
                        }} disabled={!(pageExtends < Math.ceil(totalRows / pageSize))}>
                            <i className="fa fa-caret-right"></i>
                        </button>{" "}
                        <button onClick={async (e) => await handlerPagination(Math.ceil(totalRows / pageSize), pageSize)} disabled={!(pageExtends < Math.ceil(totalRows / pageSize))}>
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
        obj = obj !== null && typeof obj[i] !== "undefined" ? obj[i] : "Na"
        // if(Array.isArray(obj))
    })
    return obj
}

export default ContenidoMultimediaList;