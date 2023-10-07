import React from 'react';
import './ListadoAlertas.css';
import { useTable, usePagination, useGlobalFilter, useSortBy } from "react-table";
import { render } from 'react-dom';

let classTh = "";
const ListadoAlertas = ({ columns, data = [], hiddenColumns, pageSizeExtends = 5, style, handlerForEachRow = "", handlerForEachCell = "", placeHolderText}) => {
    const handleFocus = (event) => event.target.select();
    const props = useTable(
        useGlobalFilter, // useGlobalFilter!
        useSortBy,
        usePagination
    );
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
        setGlobalFilter,
        page, // Instead of using 'rows', we'll use page,
        // which has only the rows for the active page

        // The rest of these things are super handy, too ;)
        canPreviousPage,
        canNextPage,
        pageOptions,
        pageCount,
        gotoPage,
        nextPage,
        previousPage,
        setPageSize,
        state: { pageIndex, pageSize, globalFilter }
    } = props;
   
    React.useEffect(() => {
    }, [globalFilter]);

    return (
        <>
            <div className="SquareCardsContainer">
                <div className="RowNumberContainer">
                    <label htmlFor="">Mostrar</label>
                    <select className="form-control"
                        value={pageSize}
                        onChange={e => {
                            setPageSize(Number(e.target.value));
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
                <div className="SquareCards">
                {
                    data.length !== 0 ?
                    data?.map((item, i)=> {
                        let estatusClass = item.notificacion?.tipo === 1 ? "estatus-green" : (item.notificacion?.tipo === 2 ? "estatus-yellow" : (item.notificacion?.tipo === 3 ? "estatus-red" : "")); 
                        return (
                            <div key={i} className={`card card_row card_hoverable customHS ${estatusClass}`}>
                                <div className="header">
                                    <a href={`#/detalle-proyecto-de-ley/${item.notificacion.proyecto_ley_id}`}>
                                        <h3><span className={`${item.notificacion.icono}`}></span> {item.notificacion.titulo}</h3>
                                        <br />
                                        <p>{item.notificacion.mensaje}</p>
                                        <small>{item.time}</small>
                                    </a>
                                </div>

                            </div>
                        )
                    })
                    :
                    <div className="card card_row card_hoverable customHS">
                        <div className="header">
                            <h3>Sin notificaciones</h3>
                        </div>
                    </div>
                }
                </div>
                <div className="pagination">
                    <div>
                        <span>
                            Página{" "}
                            <strong>
                                {pageIndex + 1} de {pageOptions.length}
                            </strong>{" (Mostrando "}{rows.length - (((pageIndex + 1) * pageSize)) < 0 ? ((((pageOptions.length -1) * pageSize) - rows.length) *-1) : pageSize}{" registros)"}
                        </span>
                    </div>
                    <div>
                        <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
                            <i className="fa fa-caret-left"></i>
                            <i className="fa fa-caret-left"></i>
                        </button>{" "}
                        <button onClick={() => previousPage()} disabled={!canPreviousPage}>
                            <i className="fa fa-caret-left"></i>
                        </button>{" "}
                        <span>
                            <input
                                type="number"
                                value={pageIndex + 1}
                                className="form-control"
                                onFocus={handleFocus}
                                onClick={handleFocus}
                                onChange={e => {
                                    const page = e.target.value ? Number(e.target.value) - 1 : 0;
                                    if (pageOptions.length > page)
                                        gotoPage(page > pageCount ? pageCount : page);
                                    else {
                                        e.target.value = page;
                                    }
                                }}
                                style={{ width: "50px", textAlign: "center", display: "inline-block" }}
                            />
                            {" / " + pageCount}
                        </span>{" "}
                        <button onClick={() => nextPage()} disabled={!canNextPage}>
                            <i className="fa fa-caret-right"></i>
                        </button>{" "}
                        <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
                            <i className="fa fa-caret-right"></i>
                            <i className="fa fa-caret-right"></i>
                        </button>{" "}
                    </div>
                </div>
            </div>
        </>
    );
}

export default ListadoAlertas;