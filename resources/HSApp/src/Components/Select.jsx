import React from 'react';
import './Select.css';
import './ErrorField.css';
import ReactSelect from 'react-select';

const Select = ({ divClass = '', noOptionsMessage="Ningún elemento disponible", selectplaceholder, selectValue, selectOnchange, selectoptions, selectIsSearchable, selectclassNamePrefix, spanClass, spanError, divClassSpan = '', divClassSpanI = '', disabled = false }) => {
    if(typeof selectValue === 'function' && typeof selectOnchange === 'function'){
        return (
            <div className={divClass}>
                <ReactSelect isDisabled={disabled} placeholder={selectplaceholder} value={selectValue()} onChange={(e)=>{selectOnchange(e)}} options={selectoptions} isSearchable={selectIsSearchable} classNamePrefix={selectclassNamePrefix}></ReactSelect>
                <span className={spanClass}>{spanError}</span>
            </div>
        )
    }
    else if (divClassSpan === '')
        return (
            <div className={divClass}>
                <ReactSelect noOptionsMessage={()=>{return noOptionsMessage}} isDisabled={disabled} placeholder={selectplaceholder} value={selectValue} onChange={selectOnchange} options={selectoptions} isSearchable={selectIsSearchable} classNamePrefix={selectclassNamePrefix}></ReactSelect>
                <span className={spanClass}>{spanError}</span>
            </div>
        )
    else
        return (
            <div>
                <div className={divClass}>
                    <span className={divClassSpan}><i className={divClassSpanI}></i></span>
                    <ReactSelect noOptionsMessage={()=>{return noOptionsMessage}} isDisabled={disabled} placeholder={selectplaceholder} value={selectValue} onChange={selectOnchange} options={selectoptions} classNamePrefix={selectclassNamePrefix}></ReactSelect>
                </div>
                <span className={spanClass}>{spanError}</span>
            </div>
        )
}
export default Select;