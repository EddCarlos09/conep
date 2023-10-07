import React from 'react';
import './SelectCurul.css';

let pos = { top: 0, left: 0, x: 0, y: 0 };
// handlerQuickSectionSelector, handlerQuickRowSelector, handlerQuickCurulSelector son para los combos de selección rápida.
const SelectCurul = ({handlerCurulSelected, corporacion = 1, curulSelectable = true, linkToClickCurul= "#", curules = [{id: 0, cx: 0, cy: 0, r: 0, seccionAsiento: "", filaAsiento: "", asiento: 0, activo: true}], showButtonProfile= false, curulIdSelected = 0, curulName = "curul-1", origen = "", minimized = true, readOnly = false, filters = [], handlersForEachFilter = [], handlerQuickSectionSelector = null, handlerQuickRowSelector = null, handlerQuickCurulSelector = null}) => {
    if(curules.length === 0){
        console.warn("Se requieren curules. Enviar por parámetros.")
        return false;
    }
    
    return (
        <div className="curulContainer" id={curulName}>
            <div className="filters"></div>
            <div className="screen">
                <div className="curulControls">
                    <ul>
                        {/* <li className="minMax">{minimized ? <i className="fas fa-expand"></i> : <i className="fas fa-compress"></i>}</li> */}
                        <li className="zoomIn" onClick={(e)=>{zoomIn(e, curulName)}}><i className="fa fa-plus"></i></li>
                        <li className="zoomOut" onClick={(e)=>{zoomOut(e, curulName)}}><i className="fa fa-minus"></i></li>
                    </ul>
                </div>
                <div className="infoPreviewContainer">
                    <div className="infoPreview">
                        <button type="button" onClick={(e)=>{closeInfoPreview(e.currentTarget)}} className="infoPreviewCloseButton"><i className="fas fa-times"></i></button>
                        {/* <div className="photo">
                            <img src="https://cdn.domestika.org/c_limit,dpr_auto,f_auto,q_auto,w_820/v1425034585/content-items/001/228/844/sesion-estudio-barcelona-10-original.jpg?1425034585" alt=""/>
                        </div> */}
                        <div className="infoContainer">
                            <div className="info">
                                <h3>Información del congresista</h3>
                                <div className="sub">
                                    <div className="image">
                                        <img src="" alt=""/>
                                    </div>
                                    <div className="text">
                                        <p>Nombre: </p>
                                        <p>Cuatrienio: </p>
                                        <p>Tipo de corporación:</p>
                                        <p>Fecha de nacimiento: </p>
                                    </div>
                                </div>
                            </div>
                            <div className="info">
                                <h3>Partido</h3>
                                <div className="sub">
                                    <div className="image">
                                        <img src="" alt=""/>
                                    </div>
                                    <div className="text">
                                        <p>Nombre: </p>
                                        <p>Fecha de creación: </p>
                                        <p>Lugar: </p>
                                    </div>
                                </div>
                            </div>
                            <div className="info">
                                <a href="#" className={`btn btn-primary btn-block center ${showButtonProfile ? "" : "none"}`} target="_blank">Visitar perfil</a>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="curul" onMouseDown={(e)=>{mouseDownHandler(e, curulName)}}>
                    <svg data-zoom={3} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 776">
                        <defs>
                            <polyline points="2, 5, 5, 8, 10, 2" id="checkShape"/>
                            {/* <clipPath id="clip-path" transform="translate(209 25)">
                                <circle class="circulo-foto" cx="35.5" cy="34.5" r="21" />
                            </clipPath> */}
                        </defs>
                        <g className={`Lines ${Number(corporacion) === 2 ? "" : "none"}`}>
                        <path className="cls-1" d="M120,514.07a555.15,555.15,0,0,1,506,0" />
                        <path className="cls-1" d="M120,450.07a555.15,555.15,0,0,1,506,0" />
                        <path className="cls-1" d="M120,389.07a555.15,555.15,0,0,1,506,0" />
                        <path className="cls-1" d="M120,328.07a555.15,555.15,0,0,1,506,0" />
                        <path className="cls-1" d="M121,268.07a555.15,555.15,0,0,1,506,0" />
                        <path className="cls-1" d="M119,211.07a555.15,555.15,0,0,1,506,0" />
                        <path className="cls-1" d="M118,142.07a555.15,555.15,0,0,1,506,0" />
                        <line className="cls-2" x1="367.5" y1="150.07" x2="367.5" y2="157.07" />
                        </g>
                        <g className={`Lines ${Number(corporacion) === 1 ? "" : "none"}`}>
                            <g id="RightLines">
                                <path className="cls-1" d="M687.38,140.89a589.61,589.61,0,0,0-87.7-48.32A599.19,599.19,0,0,0,393.83,42.45" />
                                <path className="cls-1" d="M687.38,189.89a589.61,589.61,0,0,0-87.7-48.32A599.19,599.19,0,0,0,393.83,91.45" />
                                <path className="cls-1" d="M687.38,243.89a589.61,589.61,0,0,0-87.7-48.32,599.19,599.19,0,0,0-205.85-50.12" />
                                <path className="cls-1" d="M687.38,293.89a589.61,589.61,0,0,0-87.7-48.32,599.19,599.19,0,0,0-205.85-50.12" />
                                <path className="cls-1" d="M687.38,342.89a589.61,589.61,0,0,0-87.7-48.32,599.19,599.19,0,0,0-205.85-50.12" />
                                <path className="cls-1" d="M687.38,396.89a589.61,589.61,0,0,0-87.7-48.32,599.19,599.19,0,0,0-205.85-50.12" />
                                <path className="cls-1" d="M692.38,445.89a589.61,589.61,0,0,0-87.7-48.32,599.19,599.19,0,0,0-205.85-50.12" />
                                <path className="cls-1" d="M692.38,494.89a589.61,589.61,0,0,0-87.7-48.32,599.19,599.19,0,0,0-205.85-50.12" />
                                <path className="cls-1" d="M692.38,548.89a589.61,589.61,0,0,0-87.7-48.32,599.19,599.19,0,0,0-205.85-50.12" />
                                <path className="cls-1" d="M692.38,598.89a589.61,589.61,0,0,0-87.7-48.32,599.19,599.19,0,0,0-205.85-50.12" />
                                <path className="cls-1" d="M692.38,647.89a589.61,589.61,0,0,0-87.7-48.32,599.19,599.19,0,0,0-205.85-50.12" />
                                <path className="cls-1" d="M692.38,701.89a589.61,589.61,0,0,0-87.7-48.32,599.19,599.19,0,0,0-205.85-50.12" />
                                <path className="cls-1" d="M687.38,140.89a589.61,589.61,0,0,0-87.7-48.32A599.19,599.19,0,0,0,393.83,42.45" />
                                <path className="cls-1" d="M687.38,189.89a589.61,589.61,0,0,0-87.7-48.32A599.19,599.19,0,0,0,393.83,91.45" />
                                <path className="cls-1" d="M687.38,243.89a589.61,589.61,0,0,0-87.7-48.32,599.19,599.19,0,0,0-205.85-50.12" />
                                <path className="cls-1" d="M687.38,293.89a589.61,589.61,0,0,0-87.7-48.32,599.19,599.19,0,0,0-205.85-50.12" />
                                <path className="cls-1" d="M687.38,342.89a589.61,589.61,0,0,0-87.7-48.32,599.19,599.19,0,0,0-205.85-50.12" />
                                <path className="cls-1" d="M687.38,396.89a589.61,589.61,0,0,0-87.7-48.32,599.19,599.19,0,0,0-205.85-50.12" />
                                <path className="cls-1" d="M692.38,445.89a589.61,589.61,0,0,0-87.7-48.32,599.19,599.19,0,0,0-205.85-50.12" />
                                <path className="cls-1" d="M692.38,494.89a589.61,589.61,0,0,0-87.7-48.32,599.19,599.19,0,0,0-205.85-50.12" />
                                <path className="cls-1" d="M692.38,548.89a589.61,589.61,0,0,0-87.7-48.32,599.19,599.19,0,0,0-205.85-50.12" />
                                <path className="cls-1" d="M692.38,598.89a589.61,589.61,0,0,0-87.7-48.32,599.19,599.19,0,0,0-205.85-50.12" />
                                <path className="cls-1" d="M692.38,647.89a589.61,589.61,0,0,0-87.7-48.32,599.19,599.19,0,0,0-205.85-50.12" />
                                <path className="cls-1" d="M692.38,701.89a589.61,589.61,0,0,0-87.7-48.32,599.19,599.19,0,0,0-205.85-50.12" />
                            </g>
                            <g id="LeftLines">
                                <path className="cls-1" d="M45.74,140.89a589.61,589.61,0,0,1,87.7-48.32A599.19,599.19,0,0,1,339.28,42.45" />
                                <path className="cls-1" d="M45.74,189.89a589.61,589.61,0,0,1,87.7-48.32A599.19,599.19,0,0,1,339.28,91.45" />
                                <path className="cls-1" d="M45.74,243.89a589.61,589.61,0,0,1,87.7-48.32,599.19,599.19,0,0,1,205.84-50.12" />
                                <path className="cls-1" d="M45.74,293.89a589.61,589.61,0,0,1,87.7-48.32,599.19,599.19,0,0,1,205.84-50.12" />
                                <path className="cls-1" d="M45.74,342.89a589.61,589.61,0,0,1,87.7-48.32,599.19,599.19,0,0,1,205.84-50.12" />
                                <path className="cls-1" d="M45.74,396.89a589.61,589.61,0,0,1,87.7-48.32,599.19,599.19,0,0,1,205.84-50.12" />
                                <path className="cls-1" d="M40.74,445.89a589.61,589.61,0,0,1,87.7-48.32,599.19,599.19,0,0,1,205.84-50.12" />
                                <path className="cls-1" d="M40.74,494.89a589.61,589.61,0,0,1,87.7-48.32,599.19,599.19,0,0,1,205.84-50.12" />
                                <path className="cls-1" d="M40.74,548.89a589.61,589.61,0,0,1,87.7-48.32,599.19,599.19,0,0,1,205.84-50.12" />
                                <path className="cls-1" d="M40.74,598.89a589.61,589.61,0,0,1,87.7-48.32,599.19,599.19,0,0,1,205.84-50.12" />
                                <path className="cls-1" d="M40.74,647.89a589.61,589.61,0,0,1,87.7-48.32,599.19,599.19,0,0,1,205.84-50.12" />
                                <path className="cls-1" d="M40.74,701.89a589.61,589.61,0,0,1,87.7-48.32,599.19,599.19,0,0,1,205.84-50.12" />
                                <path className="cls-1" d="M45.74,140.89a589.61,589.61,0,0,1,87.7-48.32A599.19,599.19,0,0,1,339.28,42.45" />
                                <path className="cls-1" d="M45.74,189.89a589.61,589.61,0,0,1,87.7-48.32A599.19,599.19,0,0,1,339.28,91.45" />
                                <path className="cls-1" d="M45.74,243.89a589.61,589.61,0,0,1,87.7-48.32,599.19,599.19,0,0,1,205.84-50.12" />
                                <path className="cls-1" d="M45.74,293.89a589.61,589.61,0,0,1,87.7-48.32,599.19,599.19,0,0,1,205.84-50.12" />
                                <path className="cls-1" d="M45.74,342.89a589.61,589.61,0,0,1,87.7-48.32,599.19,599.19,0,0,1,205.84-50.12" />
                                <path className="cls-1" d="M45.74,396.89a589.61,589.61,0,0,1,87.7-48.32,599.19,599.19,0,0,1,205.84-50.12" />
                                <path className="cls-1" d="M40.74,445.89a589.61,589.61,0,0,1,87.7-48.32,599.19,599.19,0,0,1,205.84-50.12" />
                                <path className="cls-1" d="M40.74,494.89a589.61,589.61,0,0,1,87.7-48.32,599.19,599.19,0,0,1,205.84-50.12" />
                                <path className="cls-1" d="M40.74,548.89a589.61,589.61,0,0,1,87.7-48.32,599.19,599.19,0,0,1,205.84-50.12" />
                                <path className="cls-1" d="M40.74,598.89a589.61,589.61,0,0,1,87.7-48.32,599.19,599.19,0,0,1,205.84-50.12" />
                                <path className="cls-1" d="M40.74,647.89a589.61,589.61,0,0,1,87.7-48.32,599.19,599.19,0,0,1,205.84-50.12" />
                                <path className="cls-1" d="M40.74,701.89a589.61,589.61,0,0,1,87.7-48.32,599.19,599.19,0,0,1,205.84-50.12" />
                            </g>
                        </g>
                        <g className={`Carpet ${corporacion !== 1 ? "none" : ""}`}>
                            <rect className="cls-1" x="353" y="54.9" width="25" height="548.7" />
                            <rect className="cls-1" x="349.5" y="50.5" width="32" height="557.5" />
                        </g>
                        <g id="PeopleDots">
                            
                            {
                                curules.map((x,i) => {
                                    return (
                                        <g className="curulItem">
                                            <circle 
                                            onMouseOver={(e)=>{
                                                let idd = e.currentTarget.getAttribute("curul_id");
                                                if(document.querySelector(`.popupContainer[curul_id="${idd}"]`)){
                                                    document.querySelector(`.popupContainer[curul_id="${idd}"]`).classList.add("show")
                                                }
                                            }} 
                                            onMouseLeave={(e)=>{
                                                let idd = e.currentTarget.getAttribute("curul_id");
                                                if(document.querySelector(`.popupContainer[curul_id="${idd}"]`)){
                                                    document.querySelector(`.popupContainer[curul_id="${idd}"]`).classList.remove("show")
                                                }
                                            }}
                                            onClick={(e)=>{
                                                if(x.congresista === null && curulSelectable){
                                                    setSelectable(e.currentTarget, x, handlerCurulSelected)
                                                }else if(x.congresista !== null){
                                                    window.open(`#/congresistas-editar/${x.congresista.id}/cuatrienio-${x.congresista.cuatrienio_id}/corporacion-${x.congresista.corporacion_id}`, '_blank');
                                                }
                                            }}
                                            key={i} style={
                                                {fill: x.congresista !== null ? x.congresista.partido.color : "", stroke: x.congresista !== null ? x.congresista.partido.color : ""}
                                            } curul_id={x.id} className={`cls-2 ${x.id === curulIdSelected ? "declared" : ""}`} cx={Number(x.cx)} cy={Number(x.cy)} r={x.r} seccionAsiento={x.seccionAsiento} filaAsiento={x.filaAsiento} asiento={x.asiento} activo={x.activo} />
                                        </g>
                                    )
                                })
                            }

                            {
                                curules.map((x,i) => {
                                    return (
                                        <g className="popupItem">
                                            {x.congresista !== null ?
                                            x.seccionAsiento === "Left" ?  
                                            <g className="popupContainer" curul_id={x.id} data-name="Capa 2">
                                                <g id="bgShape">
                                                    <image className="popup-3" x={Number(x.cx) - 5} y={Number(x.cy) - 100} width="202" height="94" href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMoAAABeCAYAAABikov9AAAACXBIWXMAAAsSAAALEgHS3X78AAAFFUlEQVR4Xu3bS3MTVxBA4TO2jCFACFRIFZVFYJH//5eSkBBj3tgYPyRPFn1bupIfdFhJ9vmqpsbYsrSZ4753JIZxHJF0vcm3HpCGYRjyy2sfKG2OEWAsTIvhusd0cWwRgeQ5D2kTjd1x3p2vjObKUFokW8A2MXkmwE77dx+MtEn6QGbAGTBtxww4vyyWC6G0QDKSHeAOcK87doloMhZpk2QkU+AE+Nodp0Q458Rwmcdx2R5lIKZGBvIQ+Al4BPwI/NB+to1TRZslp8mMiOII+Ax8Aj4CByyCmbXHAiuhdMutO8B94DHwC/CsnX8mYrnLYqpImySnyTERyVvgNbAH7APvaUENwzCfKvNQukh2iEnyGPgVeA78RsTyFHjAYvnlNNGmGVksuw6BN8Ar4rqeECH1x3IoTS65HhIT5DnwO/CCCOUJsfTawT2KNlPuUc6AL8RAyEimxNLrmAhpmlOlD2WrPfgesSd5RkySF0QwT4mAdnF/os3V71MeEtd7RnJALMU+EhHlXiUmSnenK0N5xGJvkkuux92TGok2WcayQ1zHZ8SG/gmLYdBf5xcmSu5PHhEb9wwky3PJpZsi72jtEtuJ++3Y5ZLrPO9aZTnb7YH3iLtbD9qT+N6JbprVN9TzPcMJl2wt+tu7+YuT9gt3iUB8z0Q3WV7XW91x4VpfDWW1Mj+uInHxDcNSXdJt4zvrUoGhSAWGIhUYilRgKFKBoUgFhiIVGIpUYChSgaFIBYYiFRiKVGAoUoGhSAWGIhUYilRgKFKBoUgFhiIVGIpUYChSgaFIBYYiFRiKVGAoUoGhSAWGIhUYilRgKFKBoUgFhiIVGIpUYChSgaFIBYYiFRiKVGAoUoGhSAWGIhUYilRgKFKBoUgFhiIVGIpUYChSgaFIBYYiFRiKVGAoUoGhSAWGIhUYilRgKFKBoUgFhiLB0I6t7sjvAYYirUayzSWxGIoUMWwDE2CnnbdxokjAxWkyAe6083yqDMMwGIpus7H7OpddqxPFpZdutbEdM2AKnAGn7esZyxExWf3t7zCunKV1l5FMgWPgC/AZ+NTOX4lo5sF8bygZxXn7Os95SOuqnyQnwAHwFnjdjvfAYfvZDBjHcRy/J5QMI0dWjq0Zy8FI6yiv3zPgiAjjX+AP4C8ilk/EpMlr+n9NlHyBfJFTYkTlcUJEk7FI6yiXXCfE5HhDhPJnO/aJKZNLL6AeSj+ussQDorxc1x2xvK4zFq2jcxZ7k8/EsmufiGUf+ED84T8DzsdxLO9R+lF1Rmx8PhAlviae/C3xoscspoq0bvo/+KfEH/fcxH8k/vjnRn4eCVwfSgYypf0iEcl7YA942Y49IpTcAE1xmmh99df1Ccvbh1PaJKFwe7jfrJ8RU4J2zkj+IjY/L1mMqyOueBFpjeRU6a/xvCk1Y2WSpNVQ+ic4YbHM2iLG0x7wN7HpeUms6z60x81vp2EoWm8jy8HkmcsigeVQ+pF0zOL+cm5s3hCR/NOOfpL0Sy4j0aYY4eo4equh9G/C7LfvbxOx7AOviA38O2LC5HJrSrzeN19Q2kQZSk6CvPX7DrhL3AkYiaXVOxaBHBJTZ74nMRLdZP1EyY3NIbEnmQK77fvH7fuHLO4OTLli4yPdNBOIcTAMQ06Ur8SUOCGWXRnQCSufrjQS3RZDXuvDMKz+d8gJ8Vn8/NhKvpHoFNGtM/TXfIulP2D5VlrpDoF00wyXXfctmDnj0G13aSiSlv0HqkTq8CKBOyUAAAAASUVORK5CYII=" />
                                                    <path className="popup-4"
                                                        d="M5.19,72.34V10.55c0-3.47,4.11-6.3,9.15-6.3H184.6c5.05,0,9.15,2.83,9.15,6.3V72.33c0,3.48-4.1,6.3-9.15,6.3H14.26L4.77,85.5Z"
                                                        transform={`translate(${Number(x.cx) - 5} ${Number(x.cy) - 100})`} />
                                                    <path className="popup-5"
                                                        d="M184.6,4.5c4.91,0,8.9,2.72,8.9,6.05V72.33c0,3.34-4,6-8.9,6H14.18l-.13.1L8.31,82.63,5,85l.17-5.06.24-7.61V10.55c0-3.33,4-6.05,8.9-6.05H184.6m0-.5H14.34c-5.19,0-9.4,2.93-9.4,6.55V72.33Q4.73,79.17,4.5,86l9.84-7.12H184.6c5.19,0,9.4-2.93,9.4-6.55V10.55C194,6.93,189.79,4,184.6,4Z"
                                                        transform={`translate(${Number(x.cx) - 5} ${Number(x.cy) - 100})`} />
                                                </g>
                                                <g id="partido">
                                                    <line className="popup-6" x1={Number(x.cx) + 10} y1={Number(x.cy) - 35.72} x2={Number(x.cx) + 80} y2={Number(x.cy) - 35.72} />
                                                    <line className="popup-6" x1={Number(x.cx) + 110} y1={Number(x.cy) - 35.72} x2={Number(x.cx) + 180} y2={Number(x.cy) - 35.72} />
                                                    <image width="251" height="249" transform={`translate(${Number(x.cx) + 85} ${Number(x.cy) - 45.72}) scale(0.07)`} href={x.congresista.partido.partido_imagen !== null && x.congresista.partido.partido_imagen.length > 0 ? origen + x.congresista.partido.partido_imagen[1].imagen : ''} />
                                                </g>
                                                <g id="nombre">
                                                    <text x={Number(x.cx) + 60}  y={Number(x.cy) - 65.72} fill="#000" style={{fontFamily: "var(--font-condensed)", fontSize: "0.9em", textTransform: "uppercase"}}>{x.congresista.persona.nombres} </text>
                                                </g>
                                                <g id="grado">
                                                    <text x={Number(x.cx) + 60}  y={Number(x.cy) - 55.72} fill="#000" style={{fontFamily: "var(--font-condensed-it)", fontSize: "0.7em"}}>{x.congresista.persona.profesion !== null ? x.congresista.persona.profesion.nombre : "Sin profesión"}</text>
                                                </g>
                                                <g id="foto">
                                                    <image width="60" height="60" transform={`translate(${Number(x.cx) + 10} ${Number(x.cy) - 85.72}) scale(0.75)`} href={x.congresista.persona.imagenes !== null && x.congresista.persona.imagenes.length > 0 ? origen + x.congresista.persona.imagenes[1].imagen : ""} />
                                                </g>
                                            </g>
                                            :
                                            <g className="popupContainer" curul_id={x.id} data-name="Capa 2">
                                                <g id="bgShape">
                                                    <image className="popup-3" x={Number(x.cx) - 190} y={Number(x.cy) - 100} width="202" height="94" href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMoAAABeCAYAAABikov9AAAACXBIWXMAAAsSAAALEgHS3X78AAAFG0lEQVR4Xu3aW1NTVxiA4XdDwrmitVWcse1Mp///X1Xb2lblJBDI6sW3VvYiWPj0wiHwPjNrEkPAm/1mHXaGUgqSbje56w0AwzAM7emtb5RWSwEoidliuO09NZABWKtj6Ia0qko35nWU24L5bChLgUyAaR3rdRiLVlUL5KqOWR2X3BLMjVBqJGtEEBvAFrBTxyZjMIaiVdQimQHnwGkdZ8BF/dl8OZZroXSRTIhA9oAnwLM6dolYJjiraPW02eSSiOQEeF/HIXBMBHPJUiyLzfxSJNtEID8CL4FXwAHwlJhZpvW90qqZE7PJKfAB+AN4C/wJvCM+/D8Bl8MwLGJZPvVaI2aMPSKSX4Cf63jFGMoEQ9FqmhMzRgvlOfAdsYJqP+8HcD2UfjZ5BrwGfgN+JUJ5wfgH3aNoVbU9yhlwBOwTH/4b9fULxg3+vL4WoXSnXFPGUA6An4hIXhPlbTMuuwxFq6gdCc+IldNGfX0GfCT2K0fE8ms2DMNQSinLM8qUqGuf2Jsc1MfnxJ5lA2cTrb5CXMvT+u8ZsbF/B7whGjgimhhnFMYTrHVij7JLxLJPBNKmJvcmeijah/0OcY23672d7Pb3C0t/0fenXhvEMmuLsbx1jEQPR7tXOGW8X7jN9QlhsXJaDqW/2TjBO/F62PqVVH/N91/XAm7OEH0sy9/vkh6i1DXvUkpKMBQpwVCkBEOREgxFSjAUKcFQpARDkRIMRUowFCnBUKQEQ5ESDEVKMBQpwVCkBEOREgxFSjAUKcFQpARDkRIMRUowFCnBUKQEQ5ESDEVKMBQpwVCkBEOREgxFSjAUKcFQpARDkRIMRUowFCnBUKQEQ5ESDEVKMBQpwVCkBEOREgxFSjAUKcFQpARDkRIMRUowFCnBUKQEQ5ESDEVKMBQpwVCkBEOREgxFSjAUKcFQpARDkRIMRUowFClhOZRSx7wb7TXp0epDaUFcAZfABTCrz/topEdnOZQ5Ecc5cFrHJyKaK5xd9EhN6mML4JKI5Bh4D/wLPAN2iKhK/Z2hDmkVDEuPX2wyPmVOzBwnRCBvgH1gG1gnZpQ9YLP+21h03w3dWKvjq67bCUAppQzDMCdmlFMilN+BLcZIzhhnlynjfyrdRy2I9TqmdUz4imu3n1Ha0usM+Ai8Jf7YFbFP+Qj8wDirtCWYdB+1SKbE9bpTxyawwfVr/06LN3ezSlt+QURyDhwCfxGhPCFmmlamdN+02WRChLELPCVWRN8RH/ZttZQ6zV2uqh0Pn3fPL4AjIpQnRJUbuE/R/bZGzCY7RCQvgIP6+JzYf2+RvFd4LZQ6q8AYSzsuPgU+EBv7tuz64nWe9A2tEdfpNhHKS+IaPmS85bFf3zPjjpnlxjqtlFKAMgxDfwOyxTIlZpKvPj2QvpG2R9kkllr/EKG8J25/fCJmlz3GG+ztXmH7/YX/3dB0e5Y54xKsD8RIdJ+1I+EJsXU4qeOI+NA/q4/fE0GdENd4P6ssrvFbd/51dgG4GmJNdoWBaHW0WC7qOCcCaeOYmFV268+P6+N86W/kj8i6aO48IZDui6VVUVtinRNLr0Pgb2IPMxBLs1PGPctCOhRpFXVbiBk3v/TbDqmeEnuZdg/xnOv7FUPRw9ed5vbfhG831w+JDf0GEccRn4nFUPQofOY0t80ybQk2rW+9YDw+XhwZD+PWQ3oc6sFUfyrWvg8G42xzVUcppRRD0aPVBdOigfEufaFGAs4oUgvmmrIUhqFICf8BwDGCIypzoE0AAAAASUVORK5CYII=" />
                                                    <path className="popup-4" 
                                                        d="M184.24,78.63H13.9c-5.05,0-9.15-2.82-9.15-6.3V10.55c0-3.47,4.1-6.3,9.15-6.3H184.16c5,0,9.15,2.83,9.15,6.3V72.33l.42,13.17Z" 
                                                        transform={`translate(${Number(x.cx) - 190} ${Number(x.cy) - 100})`} />
                                                    <path className="popup-5" 
                                                        d="M184.16,4.5c4.9,0,8.9,2.72,8.9,6.05v61.8L193.47,85l-9-6.52-.13-.1H13.9c-4.91,0-8.9-2.71-8.9-6V10.55C5,7.22,9,4.5,13.9,4.5H184.16m0-.5H13.9C8.71,4,4.5,6.93,4.5,10.55V72.33c0,3.62,4.21,6.55,9.4,6.55H184.16L194,86l-.44-13.67V10.55c0-3.62-4.21-6.55-9.4-6.55Z" 
                                                        transform={`translate(${Number(x.cx) - 190} ${Number(x.cy) - 100})`} />
                                                </g>
                                                <g id="partido">
                                                    <line className="popup-6" x1={Number(x.cx) - 180} y1={Number(x.cy) - 35.72} x2={Number(x.cx) - 100} y2={Number(x.cy) - 35.72} />
                                                    <line className="popup-6" x1={Number(x.cx) - 70} y1={Number(x.cy) - 35.72} x2={Number(x.cx) -5} y2={Number(x.cy) - 35.72} />
                                                    <image width="251" height="249" transform={`translate(${Number(x.cx) - 95} ${Number(x.cy) - 45.72}) scale(0.07)`} href={x.congresista.partido.partido_imagen !== null && x.congresista.partido.partido_imagen.length > 0 ? origen + x.congresista.partido.partido_imagen[1].imagen : ''} />
                                                </g>
                                                <g id="nombre">
                                                    <text x={Number(x.cx) - 130}  y={Number(x.cy) - 65.72} fill="#000" style={{fontFamily: "var(--font-condensed)", fontSize: "0.9em", textTransform: "uppercase"}}>{x.congresista.persona.nombres} </text>
                                                </g>
                                                <g id="grado">
                                                    <text x={Number(x.cx) - 130}  y={Number(x.cy) - 55.72} fill="#000" style={{fontFamily: "var(--font-condensed-it)", fontSize: "0.7em"}}>{x.congresista.persona.profesion !== null ? x.congresista.persona.profesion.nombre : "Sin profesión"}</text>
                                                </g>
                                                <g id="foto">
                                                    <image width="60" height="60" transform={`translate(${Number(x.cx) - 180} ${Number(x.cy) - 85.72}) scale(0.75)`} href={x.congresista.persona.imagenes !== null && x.congresista.persona.imagenes.length > 0 ? origen + x.congresista.persona.imagenes[1].imagen : ""} />
                                                </g>
                                            </g>
                                            :
                                            <g></g>
                                            }
                                        </g>
                                    )
                                })
                            }
                        </g>
                    </svg>
                </div>
            </div>
            <div className="fastSelection"></div>
        </div>
    )
}
    
    
function resetCurul(curulName){
    if(document.querySelector(`#${curulName}`)){
        let container = document.querySelector(`#${curulName}`);
        let curules = container.querySelectorAll("circle");
        curules.forEach(curul => {
            curul.classList.remove("selected");
            curul.classList.remove("declared");
        });
        let useE = container.querySelector("#checkShape");
        if(useE){
            useE.remove();
        }
    }
}
function setSelectable(curul, data, handlerCurulSelected){
    selectCurul(curul, data, handlerCurulSelected)
}

function zoomIn(e, curulName){
    let container = document.querySelector(`#${curulName}`);
    let svg = container.querySelector("svg");
    let zoomAttr = Number(svg.getAttribute("data-zoom"));
    if(zoomAttr === 9)
        return false;
    zoomAttr++;
    svg.setAttribute("data-zoom", zoomAttr);
}

function zoomOut(e, curulName){
    let container = document.querySelector(`#${curulName}`);
    let svg = container.querySelector("svg");
    let zoomAttr = Number(svg.getAttribute("data-zoom"));
    if(zoomAttr === 1)
        return false;
    zoomAttr--;
    svg.setAttribute("data-zoom", zoomAttr);
}

const mouseDownHandler = function(e, curulName) {
    let container = document.querySelector(`#${curulName}`);
    let curul = container.querySelector(".curul");

    pos = {
        left: curul.scrollLeft,
        top: curul.scrollTop,
        // Get the current mouse position
        x: e.clientX,
        y: e.clientY,
    };

    curul.addEventListener('mousemove', mouseMoveHandler);
    curul.addEventListener('mouseup', mouseUpHandler);
};

const mouseMoveHandler = function(e) {
    // How far the mouse has been moved
    const dx = e.clientX - pos.x;
    const dy = e.clientY - pos.y;

    // Scroll the element
    e.currentTarget.scrollTop = pos.top - dy;
    e.currentTarget.scrollLeft = pos.left - dx;
};

const mouseUpHandler = function(e, curul) {
    e.currentTarget.removeEventListener('mousemove', mouseMoveHandler);
    e.currentTarget.removeEventListener('mouseup', mouseUpHandler);
};

function selectCurul(curul, data, handlerCurulSelected){
    let curules = document.querySelectorAll("circle");
    curules.forEach(x => {
        x.classList.remove("selected")
    })
    curul.classList.add("selected")

    // Insertar check
    if(document.querySelector("#checkShape")){
        let uses = document.querySelectorAll("use");
        uses.forEach(x => {
            x.remove()
        })
    }
        
    let useE = document.createElementNS("http://www.w3.org/2000/svg", "use");
    let x = Number(data.cx) - 5.5,
        y = Number(data.cy) - 5.5;
    useE.setAttribute("href", "#checkShape")
    useE.setAttribute("x", x)
    useE.setAttribute("y", y)
    if(document.querySelector("#PeopleDots")){
        document.querySelector("#PeopleDots").appendChild(useE);
    }
    handlerCurulSelected(data)
}

function closeInfoPreview(e){
    e.parentNode.parentNode.classList.remove("active");
}

export default SelectCurul;