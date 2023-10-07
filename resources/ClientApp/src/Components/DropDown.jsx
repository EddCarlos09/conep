import React from 'react';
import './ErrorField.css';

const getItemsLi = (itemsLi, onClick) => {
    let auxItemsLi = [];
    itemsLi.map(function (item, index, array) {
        let auxItemLi = <li key={index}><a href="#" onClick={onClick} data-id={item.value}>{item.label}</a></li>;
        auxItemsLi.push(auxItemLi);
    });
    return auxItemsLi;
}
const DropDown = ({ divClass, divStyle, aStyle, aHref, aClass, aText, spanClass, ulClass, options, onClick, spanClassError, spanTextError}) => {
    return (
        <div
            style={divStyle}
            className={divClass}>
            <a
                style={aStyle}
                href={aHref}
                data-toggle="dropdown"
                className={aClass}>
                {aText}
                <span
                    className={spanClass}>
                </span>
            </a>
            <ul
                className={ulClass}
                role="menu"
            >
                {getItemsLi(options, onClick)}
            </ul>
            <span className={spanClassError}>{spanTextError}</span>
        </div>
    );
}
export default DropDown;