import React from 'react';
import './CustomBuscador.css';

const CustomBuscador = (
    {
        info_columns,
        selectMultiple = false,
        data = [],
        imgDefault,
        imgOrigin = "",
        selectableProperty = "id",
        selected,
        handler,
        pageSize = 8,
        pageExtends = 1,
        totalRows = 0,
        search = "",
        handlerSelect,
        handlerChangeSearch,
        handlerDeleteSelect
    }) => {

    const handleFocus = (event) => event.target.select();

    const showSelectItem = (selected) =>{
        if(!selected || selected.length === 0){
            return ( <p>Ninguna elemento seleccionado</p>);
        }

        let columns = [];
        for(const property in info_columns) {
            if(info_columns[property].show) {
                columns.push(info_columns[property].accessor);
            }
        }

        return (
            selected.map((item_data, index) => {
                return (
                    <div key={index} className={`item`}>
                        {
                            columns.map((item_column, index_column) => {
                                return(
                                    <div key={index_column} className={item_column}>
                                        <p>{`${ find_prop(item_data, item_column) || ''}`}</p>
                                    </div>
                                )
                            })
                        }

                        <div className={'accion'}>
                            {
                                <button
                                    type="button"
                                    onClick={async (e) => {
                                        handlerDeleteSelect(item_data, selectableProperty);
                                    }}
                                    className="btn btn-danger pull-right"
                                >
                                    <i className="fa fa-trash"/>{" "}
                                    Eliminar
                                </button>
                            }
                        </div>
                    </div>
                );
            })
        );
    }

    const search_in_array = (key_find, value_find, array) => {
        for(let i = 0; i < array.length; i++){
            for (let key in array[i]) {
                if(key === key_find){
                    if(array[i][key] === value_find){
                        return true;
                    }
                }
            }
        }
        return false;
    }

    const showColumns = () =>{
        let columns = [];
        for(const property in info_columns) {
            if(info_columns[property].show) {
                columns.push(info_columns[property].column_name);
            }
        }
        columns.push('Acción');

        return (
            columns.map((item, index) => {
                return(
                    <li key={index}>
                        <p>{`${item || ""}`}</p>
                    </li>
                );
            })
        );
    }

    const find_prop = (o, s) => {
        s = s.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
        s = s.replace(/^\./, '');           // strip a leading dot
        let a = s.split('.');
        for (let i = 0, n = a.length; i < n; ++i) {
            let k = a[i];
            if(!o){
                return;
            }
            if (k in o) {
                o = o[k];
            } else {
                return;
            }
        }
        return o;
    }

    const showData = () =>{
        let columns = [];
        for(const property in info_columns) {
            if(info_columns[property].show) {
                columns.push(info_columns[property].accessor);
            }
        }

        return (
            data.map((item_data, index) => {
                    return (
                        <div key={index} className={`item ${search_in_array(selectableProperty, item_data[selectableProperty], selected) === item_data[selectableProperty] ? "selected" : ""}`}>
                            {
                                columns.map((item_column, index_column) => {
                                    return(
                                        <div key={index_column} className={item_column}>
                                            <p>{`${ find_prop(item_data, item_column) || ''}`}</p>
                                        </div>
                                    )
                                })
                            }

                            <div className={'accion'}>
                                {
                                    search_in_array(selectableProperty, item_data[selectableProperty], selected)
                                        ? ''
                                        : <button
                                            type="button"
                                            onClick={async (e) => {
                                                handlerSelect(item_data, selectMultiple);
                                            }}
                                            className="btn btn-success pull-right"
                                        >
                                            <i className="fa fa-check"/>{" "}
                                            Agregar
                                        </button>
                                }
                            </div>
                        </div>
                    );
            })
        );
    }

    return (
        <div className="BuscadorComponent">
            <div className="TopFilterContainer">
                <div className="RowNumberContainer">
                    <label htmlFor="">Mostrar</label>
                    <select className="form-control"
                        value={pageSize}
                        onChange={async (e) => {
                            let pageSizeT = Number(e.target.value);
                            pageExtends = 1;
                            await handler(pageExtends, pageSizeT, search);
                        }}
                    >
                        {[5,10,24, 64, 112, 500, 1000].map(pageSize => (
                            <option key={pageSize} value={pageSize}>
                                {pageSize}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="RowSearcherContainer">
                    <input type="text" value={search || ""}
                        onChange={async (e) => {
                            pageExtends = 1;
                            await handlerChangeSearch(e.target.value);
                        }}
                        onKeyUp={async (e) => {
                            if (e.key === "Enter") {
                                pageExtends = 1;
                                await handler(pageExtends, pageSize, e.target.value);
                            }
                        }}
                        placeholder="Buscar" className="form-control" />
                    <span className="input-group-text">
                        <button
                            onClick= {
                                async () => {
                                    pageExtends = 1;
                                    await handler(pageExtends, pageSize, search); }
                            }
                            type="button" className="btn btn-primary"><i className="fa fa-search"/></button></span>
                </div>
            </div>
            <div className="buscadorHeaders">
                <ul>
                    {showColumns(info_columns)}
                </ul>
            </div>
            <div className="buscadorChoosed">
                { showSelectItem(selected) }
            </div>
            <div className="buscadorHeaders">
                <ul>
                    {showColumns(info_columns)}
                </ul>
            </div>
            <div className="BuscadorContainer">
                {
                    data.length > 0
                        ? showData()
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
                    <button type="button" onClick={async (e) => await handler(1, pageSize, search)} disabled={!(pageExtends > 1)}>
                        <i className="fa fa-caret-left"></i>
                        <i className="fa fa-caret-left"></i>
                    </button>{" "}
                    <button type="button" onClick={async (e) => {
                        if (pageExtends > 1) {
                            pageExtends--;
                            await handler(pageExtends, pageSize, search);
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
                                    await handler(pageExtends > Math.ceil(totalRows / pageSize) ? Math.ceil(totalRows / pageSize) : pageExtends, pageSize, search);
                                }
                                else  if (e.target.value === 0){
                                    e.target.value = 1;
                                    pageExtends = 1;
                                    await handler(pageExtends > Math.ceil(totalRows / pageSize) ? Math.ceil(totalRows / pageSize) : pageExtends, pageSize, search);
                                }
                            }}
                            style={{ width: "50px", textAlign: "center", display: "inline-block" }}
                        />
                        {" / " + Math.ceil(totalRows / pageSize)}
                    </span>{" "}
                    <button type="button" onClick={async (e) => {
                        if (pageExtends < Math.ceil(totalRows / pageSize)) {
                            pageExtends++;
                            await handler(pageExtends, pageSize, search);
                        }
                    }} disabled={!(pageExtends < Math.ceil(totalRows / pageSize))}>
                        <i className="fa fa-caret-right"></i>
                    </button>{" "}
                    <button type="button" onClick={async (e) => await handler(Math.ceil(totalRows / pageSize), pageSize, search)} disabled={!(pageExtends < Math.ceil(totalRows / pageSize))}>
                        <i className="fa fa-caret-right"></i>
                        <i className="fa fa-caret-right"></i>
                    </button>{" "}
                </div>
            </div>
        </div>

    );
}
export default CustomBuscador;
