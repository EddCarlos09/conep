import React from 'react';
import './SelectCheckboxes.css';

const SelectCheckboxes = ({ name = "", handler = "", indexControl = 0, controlId = 1, placeholder = "Seleccione...", checkedStateKey = "checked", displayKey = "name", valueKey = "value", data = [{ "name": "Rol 1", "value": 1, "checked": false }, { "name": "Rol 2", "value": 1, "checked": true }], readOnly = false, hidden = false, cls = "", id = "" }) => {
    if (displayKey === "") {
        console.error("Error: Es necesario especificar el nombre del atributo que servirá para mostrar en el Select.");
        return false;
    }
    if (valueKey === "") {
        console.error("Error: Es necesario especificar el nombre del atributo que servirá como valor en el Select.");
        return false;
    }
    if (checkedStateKey === "") {
        console.error("Error: Es necesario especificar el nombre del atributo que servirá para identificar el estado del checkbox.");
        return false;
    }
    if (data.length === 0 || data === [] || data === "") {
        console.error("Error: Es necesario especificar la data del Select.");
        return false;
    }
    return (
        <>
            <div className={cls + " SelectCheckboxContainer"} id={id}>
                <div onClick={(e) => { showSelectInfo(e.currentTarget) }} className="topInfo">
                    <p>{placeholder}</p>
                    <i className="fa fa-angle-down"></i>
                </div>
                <div className="options">
                    {data.map((val, i) => (
                        <div className="SCItem" key={i}>
                            <input readOnly={readOnly} type="checkbox" onChange={(e) => { handler(indexControl, controlId, val[valueKey], e.currentTarget.checked) }} value={val[valueKey]} checked={val[checkedStateKey]} />
                            <p>{val[displayKey]}</p>
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}

function showSelectInfo(e) {
    let container = e.parentNode;
    document.querySelectorAll(".SelectCheckboxContainer").forEach(item => {
        if (container != item)
            item.classList.remove("show");
    });
    if (container.classList.contains("show"))
        e.parentNode.classList.remove("show");
    else
        e.parentNode.classList.add("show");
}

export default SelectCheckboxes;

