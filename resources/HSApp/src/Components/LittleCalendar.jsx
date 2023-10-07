import React from 'react';
import "react-modern-calendar-datepicker/lib/DatePicker.css";
import { Calendar } from "react-modern-calendar-datepicker";
import './LittleCalendar.css';

const myCustomLocale = {
    // months list by order
    months: [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
    ],
  
    // week days by order
    weekDays: [
      {
        name: 'Domingo', // used for accessibility 
        short: 'D', // displayed at the top of days' rows
        isWeekend: true, // is it a formal weekend or not?
      },
      {
        name: 'Lunes',
        short: 'L',
      },
      {
        name: 'Martes',
        short: 'M',
      },
      {
        name: 'Miércoles',
        short: 'X',
      },
      {
        name: 'Jueves',
        short: 'J',
      },
      {
        name: 'Viernes',
        short: 'V',
      },
      {
        name: 'Sábado',
        short: 'S',
        isWeekend: true,
      },
    ],
  
    // just play around with this number between 0 and 6
    weekStartingIndex: 0,
  
    // return a { year: number, month: number, day: number } object
    getToday(gregorainTodayObject) {
      return gregorainTodayObject;
    },
  
    // return a native JavaScript date here
    toNativeDate(date) {
      return new Date(date.year, date.month - 1, date.day);
    },
  
    // return a number for date's month length
    getMonthLength(date) {
      return new Date(date.year, date.month, 0).getDate();
    },
  
    // return a transformed digit to your locale
    transformDigit(digit) {
      return digit;
    },
  
    // texts in the date picker
    nextMonth: 'Siguiente mes',
    previousMonth: 'Mes anterior',
    openMonthSelector: 'Abrir selector de mes',
    openYearSelector: 'Abrir selector de año',
    closeMonthSelector: 'Cerrar selector de mes',
    closeYearSelector: 'Cerrar selector de año',
    defaultPlaceholder: 'Seleccione...',
  
    // for input range value
    from: 'Desde',
    to: 'hasta',
  
  
    // used for input value when multi dates are selected
    digitSeparator: ',',
  
    // if your provide -2 for example, year will be 2 digited
    yearLetterSkip: 0,
  
    // is your language rtl or ltr?
    isRtl: false,
  }

const LittleCalendar = ({ value = "", onChange = null ,customDaysClassName=[]}) => {
    if(onChange === null){
        console.error("Falta definir onChange y value")
        return false;
    }
    return (
        <div>
            <Calendar                
                value={value}
                onChange={(e)=>{onChange(e)}}
                locale={myCustomLocale} // custom locale object
                shouldHighlightWeekends
                customDaysClassName = {customDaysClassName}
                />
        </div>
    );
}
export default LittleCalendar;