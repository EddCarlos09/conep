import React from 'react';
import './ErrorField.css';

const CheckBox = ({ divClass, divStyle, div2Class, inputText,  onChange, spanClassError, spanTextError }) => {
    return (
        <div>
            <div
                style={divStyle}
                className={divClass}
            >
                <div
                    className={div2Class}
                >
                    <input
                        type="checkbox"
                        className="checkbox"
                        onChange={onChange}
                    /> <p>{inputText}</p>
                </div>
            </div>
            <span className={spanClassError}>{spanTextError}</span>
        </div>
    );
}
export default CheckBox;