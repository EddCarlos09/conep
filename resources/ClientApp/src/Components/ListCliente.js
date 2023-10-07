import React, { useState } from 'react';
import CustomCad from './CustomCard';
import './ListCliente.css';
import { Link } from 'react-router-dom';

const ListCliente = ({ data, propiedades, handler, pageExtends = 1, pageSizeExtends = 8, totalRows = 0, pageSizeOptions = [8, 12, 16, 24, 32], search = "", link = "#", params = [], cardsMaxHeight = "auto", cardsMinHeight = "auto", numContentColumns = "four", cardsDescriptionContentColumns = "", cardsActionsContentColumns = "two", showNotifications = false, handlerTextNotification = null, isNotificationClickable = false, handlerClickNotification = null, enableCamaraSenadoBorders = false, showVariablesAndi = false, maxCardsTitle = 0}) => {
    const [pageSize, setPageSize] = useState(pageSizeExtends);
    return (
        <>
            <div className="topListActions" >
                <p style={{ display: "inline" }}>Mostrar </p>
                <select name="DataTables_Table_0_length" aria-controls="DataTables_Table_0" className="form-control" style={{margin: "5px", display: "inline-block", border: "1px solid #eaeaea", backgroundColor: "#fff", boxShadow: "0px 1px 2px 0px rgba(0,0,0,.4)" }}
                    value={pageSize}
                    onChange={e => {
                        pageExtends = 1;
                        setPageSize(Number(e.target.value));
                        handler(pageExtends, e.target.value, search);
                    }}
                >
                    {pageSizeOptions.map(pageSize => (
                        <option key={pageSize} value={pageSize}>
                            {pageSize}
                        </option>
                    ))}
                </select>
                <p style={{ display: "inline" }}> registros por página</p>
            </div>
            <div className={`customCardsContainer ${numContentColumns}-columns`}>
                {data.map((item, i) => {
                    // Específicamente para proyectos de ley
                    let claseLegislativo = "";
                    let claseGravedad = "";
                    let claseProbabilidad = "";
                    if(enableCamaraSenadoBorders){
                        claseLegislativo = getClaseOrigen(item.idTipoLegislativo);
                    }
                    if(showVariablesAndi){
                        claseGravedad = getClaseGravedad(item.proyectoDeLeyElementoAndi === null ? 0 : item.proyectoDeLeyElementoAndi.idGravedadProyectoDeLey);
                        claseProbabilidad = getClaseProbabilidad(item.proyectoDeLeyElementoAndi === null ? 0 : item.proyectoDeLeyElementoAndi.idProbabilidadProyectoDeLey)
                    }
                    let tempImg = getObjectValueByString(propiedades.img, item) ? ( getObjectValueByString(propiedades.img, item) != null && !getObjectValueByString(propiedades.img, item).includes("null") ? getObjectValueByString(propiedades.img, item) : 'assets/images/users/no-image.jpg' ) : 'assets/images/users/no-image.jpg';
                    // End p de ley
                    let elemnto = {
                        img: tempImg,
                        title: getObjectValueByString(propiedades.title, item),
                        description: propiedades.description,
                        data: item,
                        showNotification: showNotifications ? (handlerTextNotification != null ? (handlerTextNotification(item) != "" || handlerTextNotification(item) != null ? true : false) : false) : false,
                        textNotification: handlerTextNotification != null ? handlerTextNotification(item) : "",
                        isNotificationClickable: isNotificationClickable,
                        handlerClickNotification: handlerClickNotification,
                        maxCardsTitle: maxCardsTitle
                    }
                    let str = "";
                    if (params.length > 0) {
                        params.forEach(p => {
                            str += `/${item[p] === null ? "" : item[p]}`;
                        });
                    }
                    let href = link + str;
                    if (link != "#") {
                        return (
                            <div key={i} className={`card-item ${claseLegislativo}`}>
                                <div className="cardControls flex-wrap">
                                    <button onClick={()=>{elemnto.handlerClickNotification(item)}} className={`notificationPDeLey ${elemnto.textNotification != "" || elemnto.textNotification != null ? "hayNotificaciones" : ""} ${!elemnto.showNotification && elemnto.textNotification === "" || elemnto.textNotification === null ? "none": ""}`} type="button"><i className="fa fa-refresh"></i></button>
                                    <button className={`${showVariablesAndi ? "" : "none"} ${claseGravedad}`} type="button">G</button>
                                    <button className={`${showVariablesAndi ? "" : "none"} ${claseProbabilidad}`} type="button">P</button>
                                </div>
                                <Link key={i} to={href}>
                                    <CustomCad key={i} cardsDescriptionContentColumns={cardsDescriptionContentColumns} showImage={propiedades.showImage} key={i} item={elemnto} cardsMaxHeight={cardsMaxHeight} cardsMinHeight={cardsMinHeight} />
                                </Link>
                                <>
                                    <div key={i} className={`actions ${cardsActionsContentColumns}-columns`}>
                                        {propiedades.actions.map((action, j) => {
                                            return (<div key={j}> {action["ButtonItem"](item)}</div>);
                                        })}
                                    </div>
                                </>

                            </div>
                        );
                    } else {
                        return (
                            <div key={i} className="card-item">
                                <div onClick={()=>{elemnto.handlerClickNotification(item)}} className={`customCardIcon ${!elemnto.showNotification && elemnto.textNotification === "" || elemnto.textNotification === null ? "none": ""}`}><i className="fa fa-bell"></i><p>{elemnto.textNotification}</p></div>
                                <CustomCad key={i} cardsDescriptionContentColumns={cardsDescriptionContentColumns} showImage={propiedades.showImage} key={i} item={elemnto} cardsMaxHeight={cardsMaxHeight} cardsMinHeight={cardsMinHeight}  />
                                <>
                                    <div key={i} className={`actions ${cardsActionsContentColumns}-columns`}>
                                        {propiedades.actions.map((action, j) => {
                                            return (<div key={j}> {action["ButtonItem"](item)}</div>);
                                        })}
                                    </div>
                                </>

                            </div>
                        );
                    }
                })
                }
            </div>
            <div className="pagination">
                <div style={{ float: "left" }}>
                    <span>
                        Página{" "}
                        <strong>
                            {pageExtends} de {Math.ceil(totalRows / pageSize)}
                        </strong>{" (Mostrando "}{data.length}{" registros)"}
                    </span>
                </div>
                <div style={{ float: "right" }}>
                    <button onClick={() => handler(1, pageSize, search, false)} disabled={!(pageExtends > 1)}>
                        <i className="fa fa-caret-left"></i>
                        <i className="fa fa-caret-left"></i>
                    </button>{" "}
                    <button onClick={() => {
                        if (pageExtends > 1) {
                            pageExtends--;
                            handler(pageExtends, pageSize, search, false);
                        }

                    }} disabled={!(pageExtends > 1)}>
                        <i className="fa fa-caret-left"></i>
                    </button>{" "}
                    <span>
                        <input
                            type="number"
                            value={pageExtends}
                            className="form-control"
                            onChange={e => {
                                if (e.target.value > 0)
                                    handler(e.target.value > Math.ceil(totalRows / pageSize) ? Math.ceil(totalRows / pageSize) : e.target.value, pageSize, search, true);
                                else
                                    e.target.value = 1;
                            }}
                            style={{ width: "50px", textAlign: "center", display: "inline-block" }}
                        />
                        {" / " + Math.ceil(totalRows / pageSize)}
                    </span>{" "}
                    <button onClick={(e) => {
                        if (pageExtends < Math.ceil(totalRows / pageSize)) {
                            pageExtends++;
                            handler(pageExtends, pageSize, search, false);
                        }
                    }} disabled={!(pageExtends < Math.ceil(totalRows / pageSize))}>
                        <i className="fa fa-caret-right"></i>
                    </button>{" "}
                    <button onClick={() => handler(Math.ceil(totalRows / pageSize), pageSize, search, false)} disabled={!(pageExtends < Math.ceil(totalRows / pageSize))}>
                        <i className="fa fa-caret-right"></i>
                        <i className="fa fa-caret-right"></i>
                    </button>{" "}
                </div>
            </div>
        </>);
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
        obj = obj[i]
    })
    return obj
}

function getClaseOrigen(id){
    switch (id) {
        case 1:
            return "camara"
            break;
        case 2:
            return "senado"
            break;
        default:
            break;
    }
}

function getClaseGravedad(id){
    switch (id) {
        case 1:
            return "azul"
            break;
        case 2:
            return "verde"
            break;
        case 3:
            return "amarillo"
            break;
        case 4:
            return "rojo"
            break;
        case 5:
            return "morado"
            break;
        default:
            break;
    }
}
function getClaseProbabilidad(id){
    switch (id) {
        case 1:
            return "verde"
            break;
        case 2:
            return "amarillo"
            break;
        case 3:
            return "rojo"
            break;
        default:
            break;
    }
}

export default ListCliente;