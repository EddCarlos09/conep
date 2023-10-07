import React from 'react';
import './ErrorField.css';

const ListaDeArchivos = ({ title, divClass, selectedFiles, pathApi, propiedadTitulo, propiedadUrl, onClickEliminar, mostrarEliminar = true }) => {

    pathApi = !pathApi ? "/" : pathApi;

    function RenderArchivos(archivos, pathApi, propiedadTitulo, propiedadUrl, onClickEliminar, mostrarEliminar){
        if (!archivos) return;
        return archivos.map((archivo, index) => {
            let pathArchivo = archivo.hasOwnProperty(propiedadUrl) ? archivo[`${propiedadUrl}`] : '#';
            let href = pathApi + pathArchivo;
            return (
                <div
                    key={index}
                    className="item-diario">
                    <div
                        className="controls"
                    >
                        <button
                            type="button"
                            className={mostrarEliminar ? "btn btn-danger" : " hidden"}
                            onClick={e => {
                                onClickEliminar(e, archivo);
                            }}
                        >
                            <i
                                className="fa fa-trash-alt"
                            ></i>
                        </button>
                    </div>
                    <a key={index}
                       href={href}
                       target="blank">
                        <div className="description">
                            <div className="info">
                                <i className="fa fa-file-archive-o"></i>
                            </div>
                            <p
                                className="titulo-documento">{archivo.hasOwnProperty(propiedadTitulo)
                                    ? archivo[`${propiedadTitulo}`]
                                    : 'Documento'}
                            </p>
                        </div>
                    </a>
                </div>
            );
        });
        
    }

    return (
        <div>
            <h3>{title}</h3>
            <div className={divClass}>
                {RenderArchivos(selectedFiles, pathApi, propiedadTitulo, propiedadUrl, onClickEliminar, mostrarEliminar)}
            </div>
        </div>
    );
}
export default ListaDeArchivos;