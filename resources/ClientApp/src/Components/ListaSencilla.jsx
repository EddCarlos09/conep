import React from 'react';
import './ErrorField.css';

const hasOwnProperty = (obj, key) => {
    return key.split(".").reduce(function (o, x) {
        return (typeof o === "undefined" || o === null) ? o : o[x];
    }, obj);
}

/*objPath :{
 *  pathApi:{
 *      baseApi: "",
 *      propiedadApi: "",
 *      esBase: true
 *  },
 *  pathDirectorio:{
 *      baseDirectorio: "",
 *      propiedadDirectorio: "",
 *      esBase: true
 *  },
 *  pathParametros:{
 *      baseParametros: "",
 *      propiedadParametro: "",
 *      esBase: true
 *  }
 * }
 */

const ObtenerUrlArchivo = (objPath, archivo) => {
    let urlArchivo = "", pathApi = "", pathDirectorio = "", pathParametros = "";
    if (!objPath) return "";

    let pathApiEsBase = hasOwnProperty(objPath, "pathApi.esBase");
    let pathDirectorioEsBase = hasOwnProperty(objPath, "pathDirectorio.esBase");
    let pathParametrosEsBase = hasOwnProperty(objPath, "pathParametros.esBase");

    if (typeof pathApiEsBase !== 'undefined') {
        if (pathApiEsBase) {
            pathApi = hasOwnProperty(objPath, "pathApi.baseApi");
        } else {
            let propiedadApi = hasOwnProperty(objPath, "pathParametros.propiedadApi");
            pathApi = hasOwnProperty(archivo, propiedadApi);
        }
    }

    if (typeof pathDirectorioEsBase !== 'undefined') {
        if (pathDirectorioEsBase) {
            pathDirectorio = hasOwnProperty(objPath, "pathDirectorio.baseDirectorio");
        } else {
            let propiedadDirectorio = hasOwnProperty(objPath, "pathParametros.propiedadDirectorio");
            pathDirectorio = hasOwnProperty(archivo, propiedadDirectorio);
        }
    }
    if (typeof pathParametrosEsBase !== 'undefined') {
        if (pathParametrosEsBase) {
            pathParametros = hasOwnProperty(objPath, "pathParametros.baseParametros");
        } else {
            let propiedadParametro = hasOwnProperty(objPath, "pathParametros.propiedadParametro");
            pathParametros = hasOwnProperty(archivo, propiedadParametro);
        }
    }

    urlArchivo = pathApi + pathDirectorio + pathParametros;

    return urlArchivo;
}

const RenderArchivos = (archivos, propiedadTitulo, objPath) => {
    if (!archivos) return;
    return archivos.map((archivo, index) => {
        let urlArchivo = ObtenerUrlArchivo(objPath, archivo);
        let titulo = hasOwnProperty(archivo, propiedadTitulo);
        return (
            <div key={index}
                className="item">
                <div className="views-field views-field-title">
                    <span className="field-content">
                        <a href={urlArchivo}
                        > 
                            {titulo ? titulo : 'Documento'}
                        </a>
                    </span>
                </div>
            </div>
        );
    });
}

const ListaSencilla = ({ title, divClass, selectedFiles, propiedadTitulo, objPath }) => {
    return (
        <div>
            <h3>{title}</h3>
            <div className={divClass}>
                {RenderArchivos(selectedFiles, propiedadTitulo, objPath)}
            </div>
        </div>
    );
}
export default ListaSencilla;