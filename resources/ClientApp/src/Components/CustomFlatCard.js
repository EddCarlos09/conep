import React from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import CardActionArea from '@material-ui/core/CardActionArea';
import Typography from '@material-ui/core/Typography';
import { Hidden } from '@material-ui/core';
import { useHistory } from 'react-router-dom';


const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    details: {
        display: 'flex',
        flexDirection: 'column',
    },
    content: {
        padding: '0px'
    },
    cover: {
        width: 151,
    }
}));

function switchStatus(value) {
    switch (value) {
        case 1:
            return "default"
        case 2:
            return "black"
        case 3:
            return "bluelight"
        case 4:
            return "green"
        case 5:
            return "red"
        default:
    }
}

const CustomFlatCard = ({ tipo, item }) => {
    const classes = useStyles();
    const theme = useTheme();
    const idStatus = item.idStatus;
    let history = useHistory();
    if (tipo === 1) {
        return (
            <Card className={classes.root}>
                <CardActionArea href={`${item.link}`} disabled={idStatus === 5 ? true : false} className="list-group-item" >
                    <label className={"icon {0} sorting_1".format(switchStatus(idStatus))}></label>
                    <div className="fechaTicket pull-left">
                        <span>{item.day}</span>
                        <span>{item.month}</span>
                    </div>
                    <div className={classes.details}>
                        <CardContent className={classes.content}>
                            <Typography component="h5" variant="h6">
                                {item.title}
                            </Typography>
                            <Typography variant="subtitle1" color="textSecondary">
                                {item.text}
                            </Typography>
                        </CardContent>
                    </div>
                </CardActionArea>
            </Card>
        );
    }
    else if (tipo === 2) {
        return (
            <Card>
                <CardActionArea className="list-group-item" href={item.link}>
                    <div className="list-group-status status-online"></div>
                    <CardMedia
                        className={classes.cover}
                        image={item.img}
                        title={item.titleImg}
                    />
                    <div className={classes.details}>
                        <CardContent className={classes.content}>
                            <Typography component="h5" variant="h5">
                                {item.title}
                        </Typography>
                            <Typography variant="subtitle1" color="textSecondary">
                                {item.text}
                        </Typography>
                        </CardContent>
                    </div>
                    <div className="row">
                        {item.buttons.map((action, j) => {
                            return (<>{action["ButtonItem"](item, j)}</>);
                        })}
                    </div>
                </CardActionArea>
            </Card>
        );
    }
}

export default CustomFlatCard;