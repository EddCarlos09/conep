import React from 'react';
import './TableReact.css';
import { useTable, usePagination, useGlobalFilter, useSortBy } from "react-table";
import { render } from 'react-dom';

let classTh = "";
const TableReactExtends = ({ columns, data, hiddenColumns, handler, pageExtends = 1, pageSizeExtends = 5, totalRows = 0, search = "", handlerForEachRow = "", handlerForEachCell = "" }) => {
    const handleFocus = (event) => event.target.select();
    const props = useTable(
        {
            columns,
            data,
            initialState: {
                hiddenColumns: hiddenColumns,
                pageSize: pageSizeExtends
            }
        },
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
  
    if (document.querySelector(".TableContainer")) {
        if(document.querySelector(".trChild")){
            document.querySelectorAll(".trChild").forEach(item => {
                item.remove();
            });
        }
        new ResizeObserver(() => (setResponsive(document.querySelector(".TableContainer"), true))).observe(document.querySelector(".TableContainer"));
    }
    React.useEffect(() => {
    }, [globalFilter]);

    return (
        <>
            <div className="TableContainer">
                <div className="dataTables_length" id="DataTables_Table_0_length">
                    <p style={{ display: "inline" }}>Mostrar </p>
                    <select name="DataTables_Table_0_length" aria-controls="DataTables_Table_0" className="form-control" style={{ display: "inline-block", border: "1px solid #eaeaea", backgroundColor: "#fff", boxShadow: "0px 1px 2px 0px rgba(0,0,0,.4)" }}
                        value={pageSize}
                        onChange={async (e) => {
                            let pageSizeT = Number(e.target.value);
                            pageExtends = 1;
                            await handler(pageExtends, pageSizeT, "", false);
                            setPageSize(pageSizeT);
                        }}
                    >
                        {[5, 10, 25, 50, 100, 500].map(pageSize => (
                            <option key={pageSize} value={pageSize}>
                                {pageSize}
                            </option>
                        ))}
                    </select>
                    <p style={{ display: "inline" }}> registros por página</p>
                </div>
                <div id="DataTables_Table_0_filter" className="dataTables_filter">
                    <label><i className="fa fa-search"></i>
                    <input
                            type="text"
                            value={search || ""}
                            className="form-control tableInputSearch"
                            placeholder="Escriba aquí para buscar ..."
                            onChange={async (e) => {
                                pageExtends = 1;
                                await handler(pageExtends, pageSize, e.target.value, true);
                            }}
                        />
                    </label>
                </div>
                <table className="TableReactResponsive table table-responsive table-striped" {...getTableProps()}>
                    <thead>
                        {headerGroups.map(headerGroup => (
                            <tr {...headerGroup.getHeaderGroupProps()}>
                                <th className="ExTh none"></th>
                                {headerGroup.headers.map((column) => {
                                    if (column.Header === "Acciones") {
                                        classTh = "AccionesTh";
                                    } else if (column.parent !== undefined) {
                                        if (column.parent.Header === "Acciones") {
                                            classTh = "AccionesTh-child";
                                        } else {
                                            classTh = "";
                                        }
                                    }
                                    else {
                                        classTh = "";
                                    }
                                    return <th className={classTh} {...column.getHeaderProps(column.getSortByToggleProps())}>
                                        <p>{column.render("Header")}</p>
                                        <span>
                                            {column.isSorted
                                                ? column.isSortedDesc
                                                    ? <i className="fa fa-caret-down"></i>
                                                    : <i className="fa fa-caret-up"></i>
                                                : ""}
                                        </span>
                                    </th>
                                })}
                            </tr>
                        ))}
                    </thead>
                    <tbody {...getTableBodyProps()}>
                        {page.map((row, i) => {
                            prepareRow(row);
                            if (handlerForEachRow != "")
                                row = handlerForEachRow(row)
                            return (
                                <tr {...row.getRowProps()}>
                                    <td onClick={(e) => { AppendTrChild(e.currentTarget.parentNode, document.querySelector(".TableContainer")) }} className="ExpandButton none"><i className="fa fa-caret-right"></i></td>
                                    {row.cells.map(cell => {
                                        
                                        if (handlerForEachCell != "")
                                            cell = handlerForEachCell(cell)
                                        return (
                                            <td {...cell.getCellProps({ className: cell.column.className })}>{cell.render("Cell")}</td>
                                        );
                                    })}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                <div className="pagination">
                    <div style={{ float: "left" }}>
                        <span>
                            Página{" "}
                            <strong>
                                {pageExtends} de {Math.ceil(totalRows / pageSize)}
                            </strong>{" (Mostrando "}{rows.length}{" registros)"}
                        </span>
                    </div>
                    <div style={{ float: "right" }}>
                        <button onClick={async (e) => await handler(1, pageSize, search, false)} disabled={!(pageExtends > 1)}>
                            <i className="fa fa-caret-left"></i>
                            <i className="fa fa-caret-left"></i>
                        </button>{" "}
                        <button onClick={async (e) => {
                            if (pageExtends > 1) {
                                pageExtends--;
                                await handler(pageExtends, pageSize, search, false);
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
                                        await handler(pageExtends > Math.ceil(totalRows / pageSize) ? Math.ceil(totalRows / pageSize) : pageExtends, pageSize, search, true);
                                    }
                                    else  if (e.target.value === 0){
                                        e.target.value = 1;
                                        pageExtends = 1;
                                        await handler(pageExtends > Math.ceil(totalRows / pageSize) ? Math.ceil(totalRows / pageSize) : pageExtends, pageSize, search, true);
                                    }
                                }}
                                style={{ width: "50px", textAlign: "center", display: "inline-block" }}
                            />
                            {" / " + Math.ceil(totalRows / pageSize)}
                        </span>{" "}
                        <button onClick={async (e) => {
                            if (pageExtends < Math.ceil(totalRows / pageSize)) {
                                pageExtends++;
                                await handler(pageExtends, pageSize, search, false);
                            }
                        }} disabled={!(pageExtends < Math.ceil(totalRows / pageSize))}>
                            <i className="fa fa-caret-right"></i>
                        </button>{" "}
                        <button onClick={async (e) => await handler(Math.ceil(totalRows / pageSize), pageSize, search, false)} disabled={!(pageExtends < Math.ceil(totalRows / pageSize))}>
                            <i className="fa fa-caret-right"></i>
                            <i className="fa fa-caret-right"></i>
                        </button>{" "}
                    </div>
                </div>
            </div>
        </>
    );
}
function setResponsive(tableContainer, isDelay) {
   
    let delay = isDelay ? 500 : 0;
    let widthThForExpandButton = 20;
    if (document.querySelector(".TableReactResponsive")) {
        setTimeout(() => {
            let table = tableContainer.querySelector(".TableReactResponsive");
            table.querySelectorAll(".ExTh").forEach(i => {
                i.classList.add("none");
            });
            table.querySelectorAll(".ExpandButton").forEach(i => {
                i.classList.add("none");
            });
            table.querySelectorAll("th:not(.ExTh), td:not(.ExpandButton)").forEach(item => {
                item.classList.remove("trRemove");
                item.style.display = "table-cell"
            });

            if (table.clientWidth > tableContainer.clientWidth + widthThForExpandButton) {
                let THElements = table.querySelectorAll("thead tr:first-child th");
                for (let i = THElements.length - 1; i > 0; i--) {
                    let item = THElements[i];
                    let thWidthPrincipal = item.clientWidth;
                    item.classList.add("trRemove");

                    // Buscamos las celdas que estén dentro de las medidas del encabezado principal para removerlas
                    let BodyRowsElements = table.querySelectorAll("tbody tr:not(.trChild)");
                    BodyRowsElements.forEach(row => {
                        let tmpWidth = 0;
                        let tds = row.querySelectorAll("td");
                        let forCondition = i !== 1 ? 0 : 3;
                        for (let j = tds.length - 1; j > forCondition; j--) {
                            let td = tds[j];
                            tmpWidth += td.clientWidth;
                            td.classList.add("trRemove");
                            if (tmpWidth >= thWidthPrincipal)
                                break;
                        }
                    });

                    // Buscamos siguientes encabezados que completen la medida del th principal removido
                    let HeadRowsElements = table.querySelectorAll("thead tr:not(:first-child)");
                    HeadRowsElements.forEach(row => {
                        let tmpWidth = 0;
                        let ths = row.querySelectorAll("th");
                        let forCondition = i !== 1 ? 0 : 3;
                        for (let j = ths.length - 1; j > forCondition; j--) {
                            let th = ths[j];
                            tmpWidth += th.clientWidth;
                            th.classList.add("trRemove");
                            if (tmpWidth >= thWidthPrincipal)
                                break;
                        }
                    });

                    let elementsToRemove = tableContainer.querySelectorAll(".trRemove");
                    elementsToRemove.forEach(x => {
                        x.style.display = "none"
                    })

                    if (table.clientWidth > tableContainer.clientWidth)
                        setResponsive(tableContainer, false);
                    else
                        break;
                }
                // Habilitamos botones exp.
                table.querySelectorAll(".ExTh").forEach(i => {
                    i.classList.remove("none");
                });
                table.querySelectorAll(".ExpandButton").forEach(i => {
                    i.classList.remove("none");
                });
            } else {
                document.querySelectorAll(".trChild").forEach(item => {
                    item.remove();
                });
            }
        }, delay);
    }
}
function AppendTrChild(row, tableContainer) {
    document.querySelectorAll(".trChild").forEach(item => {
        item.remove();
    });
    let table = tableContainer.querySelector(".TableReactResponsive");
    let trFinal = document.createElement("tr");
    let tdFinal = document.createElement("td");
    let ul = document.createElement("ul");
    // Getting total cells from last tr in table for new colspan
    let NumHeaders = table.querySelectorAll("thead tr:last-child th:not(.trRemove)").length;
    trFinal.setAttribute("class", "trChild");
    trFinal.setAttribute("role", "row");
    tdFinal.setAttribute("colspan", NumHeaders);

    // Creating li according headers
    table.querySelectorAll("thead tr:last-child th.trRemove").forEach(item => {
        let li = document.createElement("li");
        let span = document.createElement("span");
        span.innerHTML = item.innerHTML;
        li.appendChild(span);
        ul.appendChild(li);
    });

    row.querySelectorAll("td.trRemove").forEach((item, i) => {
        let span = document.createElement("span");
        span.innerHTML = item.innerHTML;
        ul.querySelectorAll("li")[i].appendChild(span);
    });

    // Adding elements to tdFinal and trFinal
    tdFinal.appendChild(ul);
    trFinal.appendChild(tdFinal);
    row.after(trFinal);
}

export default TableReactExtends;