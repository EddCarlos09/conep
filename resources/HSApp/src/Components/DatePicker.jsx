import React from 'react';
import './ErrorField.css';
import './DatePicker.css';
import ReactDatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import es from 'date-fns/locale/es';
registerLocale("es", es);

const DatePicker = ({ divClass, dateSelected, onChangeDate, spanClass, spanError, divClassSpan, divClassSpanI ,showInputTime, id="", filter = null, disabled=false,monthpicker=false}) => {
    if (dateSelected != null)
        if (typeof dateSelected === 'string') // Sí no es cadena, es de tipo date (cuando cambias de fecha en el control)
            dateSelected = getDateFromDefaultFormat(dateSelected)
        if(dateSelected === null)
            dateSelected = "";

    if (divClassSpan === '') {
        return (
            <div className={divClass}>
                <ReactDatePicker disabled={disabled} showTimeInput={showInputTime} filterDate={filter} className={"form-control"} selected={dateSelected} onChange={onChangeDate} locale="es" dateFormat={monthpicker?"MM/yyyy":"yyyy-MM-dd"} />
                <span className={spanClass}>{spanError}</span>
            </div>
        )
    }
    else {
        return (
            <>
                <div className={divClass}>
                    <span className={divClassSpan}><i className={divClassSpanI}></i></span>
                    <ReactDatePicker disabled={disabled}  showTimeInput={showInputTime} filterDate={filter} className={"form-control"} selected={dateSelected} onChange={onChangeDate} locale="es" dateFormat={monthpicker?"MM/yyyy":"yyyy-MM-dd"}
                                                            showMonthYearPicker={monthpicker} />
                </div>
                <span className={spanClass}>{spanError}</span>
            </>
        )
    }
}

function getDateFromDefaultFormat(date) { // Def format: yyyy-MM-ddT00:00:00Z
    let d = date.slice(0, 10);
    let [year, month, day] = d.split("-");
    month = parseInt(month);
    day = parseInt(day)
    return new Date(Date.UTC(year, month - 1, day + 1))
}
export default DatePicker;