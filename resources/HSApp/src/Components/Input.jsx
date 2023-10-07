import React from 'react';
import './ErrorField.css';

const Input = ({ divClass, inputName, inputType, inputClass, inputplaceholder, inputValue,
    inputOnchange, spanClass, spanError, divClassSpanType = 1, divClassSpan = '',
    divClassSpanI = '', buttonClass = '', buttonText = '', divClassButton = '', spanIcon = '',
    buttonOnClick, labelClass, labelText, span2Class, spanClassError, div2Class, readOnly = false}) => {
    let autoComplete = inputType === "password" ? "off" : "on";
    if(readOnly){
        return (
            <div className={"input-group " + divClass}>
                <span className="input-group-addon"><span className={spanIcon}></span></span>
                <p readonly className={"form-control readonly" + inputClass}>{inputValue}</p>
            </div>
        )
    }
    switch (inputType) {
        case "hidden":
            return (
                <input name={inputName} type={inputType} value={inputValue} />
            )
        case "checkbox":
            return (
                <div className={divClass}>
                    <label><input autoComplete={autoComplete} className="checkbox" name={inputName} type={inputType} checked={inputValue} onChange={inputOnchange} /><span>{inputplaceholder}</span></label>
                    <span className={spanClass}>{spanError}</span>
                </div>
            )
        default:
            if (divClassSpan === '')
                return (
                    <div className={divClass}>
                        <input autoComplete={autoComplete} name={inputName} type={inputType} className={inputClass} placeholder={inputplaceholder} value={inputValue} onChange={inputOnchange} />
                        <span className={spanClass}>{spanError}</span>
                    </div>
                )
            else {
                if (divClassSpanType === 1) {
                    return (
                        <div>
                            <div className={divClass}>
                                <span className={divClassSpan}><i className={divClassSpanI}></i></span>
                                <input autoComplete={autoComplete} name={inputName} type={inputType} className={inputClass} placeholder={inputplaceholder} value={inputValue} onChange={inputOnchange} />
                            </div>
                            <span className={spanClass}>{spanError}</span>
                        </div>
                    )
                }
                else if (divClassSpanType === 2) {
                    return (
                        <div>
                            <div className={divClass}>
                                <input autoComplete={autoComplete} name={inputName} type={inputType} className={inputClass} placeholder={inputplaceholder} value={inputValue} onChange={inputOnchange} />
                                <span className={divClassSpan}><i className={divClassSpanI}></i></span>
                            </div>
                            <span className={spanClass}>{spanError}</span>
                        </div>
                    )
                }
                else if (divClassSpanType === 3) {
                    return (
                        <div>
                            <div className={divClass}>
                                <input autoComplete={autoComplete} name={inputName} type={inputType} className={inputClass} placeholder={inputplaceholder} value={inputValue} onChange={inputOnchange} />
                                <span className={divClassSpan}>{divClassSpanI}</span>
                            </div>
                            <span className={spanClass}>{spanError}</span>
                        </div>
                    )
                }
                else if (divClassSpanType === 4) {
                    return (
                        <div>
                            <div className={divClass}>
                                <span className={divClassSpan}>{divClassSpanI}</span>
                                <input autoComplete={autoComplete} name={inputName} type={inputType} className={inputClass} placeholder={inputplaceholder} value={inputValue} onChange={inputOnchange} />
                            </div>
                            <span className={spanClass}>{spanError}</span>
                        </div>
                    )
                }
                else if (divClassSpanType === 5) {
                    return (
                        <div>
                            <div className={divClass}>
                                <div className={divClassSpan}>
                                    <span className={spanIcon}></span>
                                </div>
                                <input autoComplete={autoComplete}
                                    type={inputType}
                                    className={inputClass}
                                    name={inputName}
                                    placeholder={inputplaceholder}
                                    value={inputValue}
                                    onChange={inputOnchange} />
                                <div className={divClassButton}>
                                    <button
                                        className={buttonClass}
                                        onClick={buttonOnClick}
                                    >{buttonText}</button>
                                </div>
                                <span className={spanClass}>{spanError}</span>
                            </div>
                            
                        </div>
                    )
                }
                else if (divClassSpanType === 6) {
                    return (
                        <div>
                            <label className={labelClass}> {labelText} </label>
                            <div className={divClass}>
                                <div className={div2Class}>
                                    <span className={spanClass}>
                                        <span className={span2Class}></span>
                                    </span>
                                    <input autoComplete={autoComplete}
                                        type={inputType}
                                        className={inputClass}
                                        name={inputName}
                                        placeholder={inputplaceholder}
                                        value={inputValue}
                                        onChange={inputOnchange}
                                    />
                                </div>
                                <span className={spanClassError}>{spanError}</span>
                            </div>
                        </div>
                    )
                }
                else {
                    return (
                        <div>
                        </div>
                    )
                }
            }
    }
}
export default Input;