import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import { red } from '@material-ui/core/colors';
import AuthLogin from "../Utils/AuthLogin";
import './CustomCalendar.css';
const auth = new AuthLogin();
const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        overflow: 'hidden',
        backgroundColor: theme.palette.background.paper,
    },
    gridList: {
        width: '100%',
        height: '100%',
    },
    item: {
        width: '100%',
        background: red
    },
    itemHeader: {
        width: '100%',
        height: '50%'
    }
}));

function getCalendarIndexes(columns, rows, data, elementNull, classess, fecha, meses, dias, handlerDeleteFromAgenda) {
    //var dias = ["Domingo", "Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado"];
    var conteoRomano = ["0", "I", "II", "III", "IV", "V", "VI", "VII", "VIII"];
    let mitad = columns.length/2;
    let calendarIndexes = [];
    for (var i = 0; i < rows.length+1; i++) {
        let plenaria = i;
        for (var j = 0; j < columns.length+1; j++) {
            let day = j;
            if (plenaria === 0 && day === 0) {
                calendarIndexes.push(renderItem(calendarIndexes.length, classess, 1, null, "", 1, handlerDeleteFromAgenda, ""))
            }
            else if (plenaria === 0 && day > 0) {
                let clasee = day > mitad ? "camara" : "senado";
                let nombre = `${dias[day - 1]} ${columns[day - 1]} de ${meses[day - 1]}`;
                calendarIndexes.push(renderItem(calendarIndexes.length, classess, 2, null, nombre, 1, handlerDeleteFromAgenda, clasee))
            }
            else if (plenaria > 0 && day === 0) {
                if (rows[plenaria - 1] === -1)
                    calendarIndexes.push(renderItem(calendarIndexes.length, classess, 2, null, "Plenaria", 1, handlerDeleteFromAgenda))
                else if (rows[plenaria - 1] === 0)
                    calendarIndexes.push(renderItem(calendarIndexes.length, classess, 2, null, "Agenda", 1, handlerDeleteFromAgenda))
                else
                    calendarIndexes.push(renderItem(calendarIndexes.length, classess, 2, null, `${conteoRomano[plenaria - 1]}`, 1, handlerDeleteFromAgenda))
            }
            else if (plenaria > 0 && day > 0) {
                let clasee = day > mitad ? "camara" : "senado";
                if (rows[plenaria - 1] === -1) {
                    let item = day > mitad ? data.find(x => x.fecha === columns[day - 1] && x.plenaria === true && x.idTipoActividad === 2) :
                        data.find(x => x.fecha === columns[day - 1] && x.plenaria === true && x.idTipoActividad === 1);
                    if (item != null) {
                        calendarIndexes.push(renderItem(calendarIndexes.length, classess, 3, item, "", 1, handlerDeleteFromAgenda, clasee));
                    }
                    else
                        calendarIndexes.push(renderItem(calendarIndexes.length, classess, 2, null, "-", 1, handlerDeleteFromAgenda, clasee));
                }
                else if (rows[plenaria - 1] === 0) {
                    if (day < mitad && columns[day - 1] === columns[0]) {
                        let item = data.find(x => x.fecha === columns[day - 1] && x.agenda === true && x.idTipoActividad === 1);
                        if (item != null) {
                            calendarIndexes.push(renderItem(calendarIndexes.length, classess, 3, item, "", mitad, handlerDeleteFromAgenda, clasee));
                        }
                        else
                            calendarIndexes.push(renderItem(calendarIndexes.length, classess, 2, null, "-", mitad, handlerDeleteFromAgenda, clasee));
                    }
                    else if (day > mitad && columns[day - 1] === columns[columns.length / 2]) {
                        let item = data.find(x => x.agenda === true && x.idTipoActividad === 2);
                        if (item != null) {
                            calendarIndexes.push(renderItem(calendarIndexes.length, classess, 3, item, "", mitad, handlerDeleteFromAgenda, clasee));
                        }
                        else
                            calendarIndexes.push(renderItem(calendarIndexes.length, classess, 2, null, "-", mitad, handlerDeleteFromAgenda, clasee));
                    }
                }
                else {

                    let item = day > mitad ? data.find(x => x.fecha === columns[day - 1] && x.comision === rows[plenaria - 1] && x.idTipoActividad === 2) :
                        data.find(x => x.fecha === columns[day - 1] && x.comision === rows[plenaria - 1] && x.idTipoActividad === 1);

                    if (item != null)
                        calendarIndexes.push(renderItem(calendarIndexes.length, classess, 3, item, "", 1, handlerDeleteFromAgenda, clasee));
                    else
                        calendarIndexes.push(renderItem(calendarIndexes.length, classess, 2, null, "-", 1, handlerDeleteFromAgenda, clasee));
                }
            }
        }
    }
    return calendarIndexes;
}

function renderItem(index, classess, tipo, item, nombre, col, handlerDeleteFromAgenda, claseCuadro="") {
    switch (tipo) {
        case 1: return (<GridListTile key={index} cols={col}>
            <div className={classess.itemHeader}><span> </span></div>
        </GridListTile>)
        case 2: return (<GridListTile key={index} cols={col} className={claseCuadro}>
            <div className={classess.itemHeader}><span >{nombre}</span></div>
        </GridListTile>)
        case 3: return (
            <GridListTile key={index} cols={col} className={claseCuadro}>
            <button type="button" onClick={()=>{
                if(handlerDeleteFromAgenda !== null){
                    handlerDeleteFromAgenda(item)
                }else
                    return false
                }} className="agendaNewEliminar"><i className="fa fa-trash-o"></i></button>
            <a target="_blank" href={`${auth.pathApi()}${item.archivo}`} className="agendaFile">
                <div className={classess.item}><i className="fa fa-file-text"></i></div>
            </a>
        </GridListTile>
        )
        default:
    }
    
}

const CustomCalendar = ({ data, columns, rows, fecha, meses, dias, handlerDeleteFromAgenda }) => {
    const classes = useStyles();
    const elementNull = {
        titulo: '',
        archivo: '',
        fecha: '',
        plenaria: 0,
        idTipoActividad: 0
    }

    const calendar = getCalendarIndexes(columns, rows, data, elementNull, classes, fecha, meses, dias, handlerDeleteFromAgenda);

    return (
        <div className={classes.root}>
            <GridList cellHeight={100} className={classes.gridList + " agendaContainer"} cols={columns.length+1}>
                {calendar.map((item, j) => {
                    return (
                        item
                        )
                })}
            </GridList>
        </div>
    )
}

export default CustomCalendar;