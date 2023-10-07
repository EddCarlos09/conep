import React from "react";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import { makeStyles } from "@material-ui/core/styles";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
    root: {
        width: "100%",
        "& > * + *": {
            marginTop: theme.spacing(2)
        }
    }
}));
const Alerts = (props) => {
    const classes = useStyles();
    return (
        <div className={classes.root}>
            <Snackbar open={props.open} autoHideDuration={props.timeDisplay} >
                <Alert  severity={props.sever}>
                    {props.mensaje}
                </Alert>
            </Snackbar>
        </div>
    );
}

export default Alerts;