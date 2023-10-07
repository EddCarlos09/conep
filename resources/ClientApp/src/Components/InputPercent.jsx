import React from 'react';
import './InputPercent.css';
// Pendiente: Responsive

const InputPercent = ({ name = "", value = 50, color = "#333", isDinamyc = false, lineCapStroke = "round", fontSize = 3, cls = "", id = "", fontColor = "#333" }) => {
    if (value > 100) {
        console.error("Error: El valor asignado al InputPercent no debe ser mayor a 100");
        return false;
    }

    // Calculating 100 es a 210%
    let offset = calcOffset(value);

    // Getting x for text
    let tx, ty = 90;
    let textSize = 3 * 16; // 1em = 16px
    
    switch (value.toString().length) {
        case 1:
            tx = 75 - (textSize / 3) + 6; // Centro de círculo 75 y el otro + para el residuo de eje sobrante
            break;
        case 2:
            tx = 75 - (textSize / 2) + 0;
            break;
        case 3:
            tx = (textSize) - 3 - 6;
            break;
        default:
    }
    if (!isDinamyc) {
        return (
            <>
                <div className={cls + " InputPercentContainer"} id={id}>
                    <div className="CPercent">
                        <svg viewBox={`0 0 150 150`} version="1.1" xmlns="http://www.w3.org/2000/svg">
                            <circle className="track" cx="75" cy="75" r="50" fill="none" />
                            <circle className="cls" strokeLinecap={lineCapStroke} cx="75" cy="75" r="50" strokeDashoffset={offset + "%"} fill="none" stroke={color} />
                            <text style={{ fontSize: fontSize + "em"}} x={tx} y={ty} fill={fontColor}>{value}</text>
                        </svg>
                    </div>
                </div>
            </>
        )
    } else {
        if (name === "") {
            console.error("Error: Es necesario asignar un name a un InputPercent dinámico");
            return false;
        }
        else {
            return (
                <>
                    <div className={cls + " InputPercentContainer dinamyc"} id={id}>
                        <div className="CPercent">
                            <svg viewBox={`0 0 150 150`} version="1.1" xmlns="http://www.w3.org/2000/svg">
                                <circle className="track" cx="75" cy="75" r="50" fill="none" />
                                <circle className="cls" strokeLinecap={lineCapStroke} cx="75" cy="75" r="50" strokeDashoffset={offset + "%"} fill="none" stroke={color} />
                            </svg>
                        </div>
                        <input style={{ fontSize: fontSize + "em" }} type="text" name={name} value={value} onKeyDown={(e) => { onChangeNumber(e) }} />
                    </div>
                </>
            )
        }
    }
}

function calcOffset(value) {
    let a = ((value * 210) / 100) - 210;
    if (a < 0)
        a = a * (-1);
    return a;
}

function onChangeNumber(e) {
    switch (e.key) {
        case "ArrowUp":
            if (e.currentTarget.value !== 100)
                return e.currentTarget.value++;
            break;
        case "ArrowDown":
            if (e.currentTarget.value !== 0)
                return e.currentTarget.value--;
            break;
        default:
    }
    let parent = e.currentTarget.parentNode;
    parent.querySelector(".cls").setAttribute("stroke-dashoffset", calcOffset(e.currentTarget.value) + "%");
}

export default InputPercent;

