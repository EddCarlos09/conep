import React from 'react';
import './CustomCard.css';
import { Card, CardMedia, CardContent, Typography, CardActionArea  } from '@material-ui/core/';

const CustomCard = ({ item, cardsMaxHeight = "auto", cardsMinHeight = "auto", classes, showImage = true, cardsDescriptionContentColumns = "" }) => {
    let titulo = ''
    if (item != null && item.title != null) {
        titulo = item.maxCardsTitle != 0 && item.title.length > item.maxCardsTitle ? item.title.slice(0, item.maxCardsTitle) + "..." : item.title;
    }
    if (showImage) {
        return (
            <Card style={{ minHeight: cardsMinHeight, maxHeight: cardsMaxHeight }}>
                <div style={{flexDirection: "column", display: "flex"}}>
                    <CardActionArea style={{flex: '1 0 auto'}}>
                        <CardMedia
                            component="img"
                            alt={item.title}
                            height="140"
                            image={item.img}
                            title={item.title}
                        />
                        <CardContent>
                            
                            <Typography gutterBottom component="p" variant="h4">
                                {titulo}
                            </Typography>
                            <div className={cardsDescriptionContentColumns === "" ? "" : cardsDescriptionContentColumns + "-columns"}>
                                {item.description.map((val, i) => {
                                    return (
                                        <div key={i} className={cardsMaxHeight != "auto" ? "cutted" : ""} style={{ maxHeight: (i === (item.description.length - 1) ? cardsMaxHeight : "auto"), minHeight: (i === (item.description.length - 1) ? cardsMinHeight : "auto") }}>
                                            <Typography component="p" variant="h6">
                                                {val.title}:
                                            </Typography>
                                            <Typography component="p">
                                                {getObjectValueByString(val.text, item.data) === null
                                                    || getObjectValueByString(val.text, item.data) === ""
                                                    || getObjectValueByString(val.text, item.data) === undefined
                                                    ? "No disponible" : getObjectValueByString(val.text, item.data)}
                                            </Typography>
                                        </div>)
                                })}
                            </div>
                        </CardContent>
                    </CardActionArea>
                </div>
            </Card>
        );
    } else {
        return (
            <Card style={{ minHeight: cardsMinHeight, maxHeight: cardsMaxHeight }}>
                <CardActionArea>
                    <CardContent>
                        <Typography gutterBottom component="p" variant="h4">
                            {titulo}
                        </Typography>
                        <div className={cardsDescriptionContentColumns === "" ? "" : cardsDescriptionContentColumns + "-columns"}>
                            {item.description.map((val, i) => {
                                return (
                                    <div key={i} className={cardsMaxHeight != "auto" ? "cutted" : ""} style={{ maxHeight: (i === (item.description.length - 1) ? cardsMaxHeight : "auto"), minHeight: (i === (item.description.length - 1) ? cardsMinHeight : "auto") }}>
                                        <Typography component="p" variant="h6">
                                            {val.title}:
                                        </Typography>
                                        <Typography component="p">
                                            {getObjectValueByString(val.text, item.data) === null
                                                || getObjectValueByString(val.text, item.data) === ""
                                                || getObjectValueByString(val.text, item.data) === undefined
                                                ? "No disponible" : getObjectValueByString(val.text, item.data)}
                                        </Typography>
                                    </div>)
                            })}
                        </div>
                    </CardContent>
                </CardActionArea>
            </Card>
        );
    }
}

function getObjectValueByString(s, obj) {
    if (s === null || s === undefined)
        return null
    let properties;
    if (s.includes("."))
        properties = s.split(".");
    else
        properties = [s];
    properties.forEach(i => {
        obj = obj[i]
    })
    return obj
}


export default CustomCard;


