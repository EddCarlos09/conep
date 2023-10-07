import React from 'react';
import { useCvAliados } from "../../Admin/Hooks/UseCvAliados.js";

const pathApi = () => {
    return "https://api.observatoriolegislativoconep.com/uploads/";
}
let pos = { top: 0, left: 0, x: 0, y: 0 };
const CongresoVisibleAliado = () => {

    const { state } = useCvAliados();
    return (
        <div>
            <div className="container-fluid">
                <div className="row">
                    <div className="col-md-12">
                        <div className="branding">
                            <div className="row flex-nowrap scroll-y brandingContainer justify-content-center" onMouseDown={(e) => { mouseDownHandler(e) }}>
                                {
                                    state !== null && state !== "" ?
                                        state.map(x =>
                                            <figure key={x.id}>
                                                <a href={x.urlexterna} target="_blank">
                                                    <img draggable="false" src={pathApi() + x.aliado_imagen[0].imagen} alt={x.nombre} />
                                                </a>
                                            </figure>
                                        ) : ''
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const mouseDownHandler = function (e) {

    pos = {
        left: e.currentTarget.scrollLeft,
        top: e.currentTarget.scrollTop,
        // Get the current mouse position
        x: e.clientX,
        y: e.clientY,
    };

    e.currentTarget.addEventListener('mousemove', mouseMoveHandler);
    e.currentTarget.addEventListener('mouseup', mouseUpHandler);
};
const mouseMoveHandler = function (e) {
    // How far the mouse has been moved
    const dx = e.clientX - pos.x;
    const dy = e.clientY - pos.y;

    // Scroll the element
    e.currentTarget.scrollTop = pos.top - dy;
    e.currentTarget.scrollLeft = pos.left - dx;
};

const mouseUpHandler = function (e, curul) {
    e.currentTarget.removeEventListener('mousemove', mouseMoveHandler);
    e.currentTarget.removeEventListener('mouseup', mouseUpHandler);
};
export default CongresoVisibleAliado
