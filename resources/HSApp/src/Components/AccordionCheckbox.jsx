import React from 'react';
import './AccordionCheckbox.css';
const AccordionCheckbox = ({ children, open = false, handlerCheckboxSelected = null, label,  }) => {
    if(handlerCheckboxSelected === null){
        console.error("Debe asignar un manejador para el checkbox seleccionado (handlerCheckboxSelected)");
        return false;
    }
    
    return (
        <div>
            <div className="accordionCheckboxContainer">
                <div className={`topCheckbox`}>
                    <input type="checkbox" name={label} checked={open ? "checked" : ""} onChange={(e)=>{handlerCheckboxSelected(e.currentTarget.checked)}}/>
                    <label htmlFor="">{label}</label>
                </div>
                <div className={`bodyContent ${open ? "active" : ""}`}>
                    {children}
                </div>
            </div>
        </div>
    );
}
export default AccordionCheckbox;