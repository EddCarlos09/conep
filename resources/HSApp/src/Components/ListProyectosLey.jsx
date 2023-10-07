import React, { useState } from 'react';
import CustomCad from './CustomCard';
import AuthLogin from "../Utils/AuthLogin";
// import './ListCliente.css';
import { Link } from 'react-router-dom';
import { Constantes } from "../Constants/Constantes.js";
import ValidForm from "../Utils/ValidForm";
const validForm = new ValidForm();

const ListProyectosLey = ({ data, origen = "", imgDefault = "", handler, pageExtends = 1, pageSizeExtends = 15, totalRows = 0, pageSizeOptions = [15, 20, 25], search = "", bootstrapClasses = "col-lg-3 col-md-4 col-sm-6" }) => {
    const [pageSize, setPageSize] = useState(pageSizeExtends);
    return (
        <>
            <div >
                <div className="RowNumberContainer">
                    <label htmlFor="">Mostrar</label>
                    <select className="form-control"
                        value={pageSize}
                        onChange={e => {
                            pageExtends = 1;
                            setPageSize(Number(e.target.value));
                            handler(pageExtends, e.target.value, search, false);
                        }}
                    >
                        {pageSizeOptions.map(pageSize => (
                            <option key={pageSize} value={pageSize}>
                                {pageSize}
                            </option>
                        ))}
                    </select>
                    <label htmlFor="">registros por página</label>
                </div>
            </div>
            <>
                {
                    data.map((item, i) => {

                        return (
                            <div className="card card_row card_hoverable customHS">
                                <div className="header">
                                    <h3><a href={`#/detalle-proyecto-de-ley/${item.id}`}>{item.titulo}</a></h3>
                                    <br />

                                    <div className="lg:flex lg:-mx-4">
                                        <div className="lg:w-1/3 lg:px-4">
                                            <div
                                                className="card px-4 py-8 text-center lg:transform hover:scale-110 hover:shadow-lg transition-transform duration-200">
                                                <p className="mt-2">No. De proyecto</p>
                                                <div className="text-primary mt-1 text-xl leading-none">{item.numero_camara || ''}</div>
                                            </div>
                                        </div>
                                        <div className="lg:w-1/3 lg:px-4 pt-5 lg:pt-0">
                                            <div
                                                className="card px-4 py-8 text-center lg:transform hover:scale-110 hover:shadow-lg transition-transform duration-200">
                                                <p className="mt-2">Último estado</p>
                                                <div className="text-primary mt-1 text-xl leading-none">{item.proyecto_ley_estado[item.proyecto_ley_estado.length - 1]?.tipo_estado?.nombre || 'Sin estado'}</div>
                                            </div>
                                        </div>
                                        <div className="lg:w-1/3 lg:px-4 pt-5 lg:pt-0">
                                            <div
                                                className="card px-4 py-8 text-center lg:transform hover:scale-110 hover:shadow-lg transition-transform duration-200">
                                                <p className="mt-2">Fecha de último estado</p>
                                                <div className="text-primary mt-1 text-xl leading-none">{validForm.getColoquialDate(item.proyecto_ley_estado[item.proyecto_ley_estado.length - 1]?.fecha) || 'Sin fecha'}</div>
                                            </div>
                                        </div>
                                        <div className="lg:w-1/3 lg:px-4 pt-5 lg:pt-0">
                                            <div
                                                className="card px-4 py-8 text-center lg:transform hover:scale-110 hover:shadow-lg transition-transform duration-200">
                                                <p className="mt-2">Tipo</p>
                                                <div className="text-primary mt-1 text-xl leading-none">{item.tipo_proyecto_ley?.nombre || ''}</div>
                                            </div>
                                        </div>
                                        <div className="lg:w-1/3 lg:px-4 pt-5 lg:pt-0">
                                            <div
                                                className="card px-4 py-8 text-center lg:transform hover:scale-110 hover:shadow-lg transition-transform duration-200">
                                                <p className="mt-2">Iniciativa</p>
                                                <div className="text-primary mt-1 text-xl leading-none">{item.iniciativa?.nombre || ''}</div>
                                            </div>
                                        </div>
                                    </div>
                                    <br />
                                    <p className="subtitle-autor-list">Autores</p>
                                    <br />
                                    <div className="autor-list-tags">
                                        {
                                            item.proyecto_ley_autor_personas?.map((autor, j) => {
                                                if(j === 6){ // máximo 6
                                                    return(
                                                        <li key={j}>+{item.proyecto_ley_autor_personas.length - 6 < 0 ? (item.proyecto_ley_autor_personas.length - 6) * -1 : item.proyecto_ley_autor_personas.length - 6}...</li>
                                                    );
                                                }else if(j < 6){
                                                    return(
                                                        <div key={j} className="item">
                                                            <div className="avatar w-16 h-16 ml-4">
                                                                <img src={typeof autor.persona.imagenes[0] !== "undefined" ? (origen + autor.persona.imagenes[0].imagen) : imgDefault} alt={autor.persona.nombres}/>
                                                            </div>
                                                            <div className="name">
                                                                <p><a target="_blank" href={`#/perfil-congresista/${autor.persona.id}`}>{autor.persona.nombres || ''}</a></p>
                                                            </div>
                                                        </div>
                                                    );
                                                }
                                            })
                                        }
                                    </div>
                                </div>

                            </div>
                        );
                    })
                }
            </>
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
                        <i className="icon la la-angle-left"></i>
                        <i className="icon la la-angle-left"></i>
                    </button>{" "}
                    <button onClick={() => {
                        if (pageExtends > 1) {
                            pageExtends--;
                            handler(pageExtends, pageSize, search, false);
                        }

                    }} disabled={!(pageExtends > 1)}>
                        <i className="icon la la-angle-left"></i>
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
                        <i className="icon la la-angle-right"></i>
                    </button>{" "}
                    <button onClick={() => handler(Math.ceil(totalRows / pageSize), pageSize, search, false)} disabled={!(pageExtends < Math.ceil(totalRows / pageSize))}>
                        <i className="icon la la-angle-right"></i>
                        <i className="icon la la-angle-right"></i>
                    </button>{" "}
                </div>
            </div>
        </>);
}

function getImgComision(item) {
    if (item.comision_imagen.length > 0) {
        let img = item.comision_imagen[5];
        if (img != undefined)
            return img.imagen;
    }
    return null;
}
export default ListProyectosLey;
