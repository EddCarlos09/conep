import React from 'react';
import './ErrorField.css';

const TextArea = ({ labelClass, labelText, divClass, div2Class, spanClass, span2Class,
    textAreaName, textAreaId, textAreaCol, textAreaPlaceHolder, textAreaRows,
    textAreaClass, spanClassError, spanError, onChange, textAreaValue, readOnly}) =>
{
    return (
        <div>
            <label
                className={labelClass}>{labelText}
            </label>
            <div
                className={divClass}
            >
                <div
                    className={div2Class}
                >
                    <span
                        className={spanClass}
                    >
                        <span
                            className={span2Class}
                        >
                        </span>
                    </span>
                    <textarea
                        name={textAreaName}
                        id={textAreaId}
                        cols={textAreaCol}
                        placeholder={textAreaPlaceHolder}
                        rows={textAreaRows}
                        className={textAreaClass}
                        onChange={onChange}
                        value={textAreaValue}
                        readOnly={readOnly}
                    >
                    </textarea>
                </div>
            </div>
            <span className={spanClassError}>{spanError}</span>
        </div>
    );
}
export default TextArea;