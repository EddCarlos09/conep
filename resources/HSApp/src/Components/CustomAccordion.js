import React from 'react';
import ReactDOM from 'react-dom'
import { makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import AuthLogin from "../Utils/AuthLogin";
const auth = new AuthLogin();

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
    },
    heading: {
        
    },
    headingSecond: {
        marginLeft: 10
    }
}));

const CustomAccordion = ({ head, element, handler, showButtonDelete }) => {

    const classes = useStyles();
    
    return (
        <div className="faq-element">
        <Accordion >
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                >
                    <Typography variant="h5" >{head.title}</Typography>
                    <Typography variant="h6" className={classes.headingSecond}>{head.secondText}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <div className="faq-text" id="c1">
                        <div className="row">
                            <div className="pull-right">
                                <button
                                    className={`btn btn-danger ${!showButtonDelete ? "none" : "eliminar"}`}
                                    data-id={element.idArchivoComision}
                                    data-target="#message-box-danger"
                                    onClick={() => { handler(element) }}
                                    data-toggle="modal"><i className="fa fa-trash-o"></i> Eliminar</button>
                            </div>
                        </div>
                        <h3>{element.titulo}</h3>
                        <div dangerouslySetInnerHTML={{ __html: element.descripcion }}></div>
                        <h5>Archivos</h5>
                        <div className="panel-body  for-files four-columns">
                            {
                                element.archivoComisionDetalle.map((element2, j) => {
                                    return (
                                        <a href={`${auth.pathApi()}${element2.pathArchivo}`} target="blank">
                                            <div className="element-diario">
                                                <div className="description">
                                                    <div className="info">
                                                        <i className="fa fa-file-archive-o"></i>
                                                    </div>
                                                    <p className="titulo-documento">{element2.nombreArchivo}</p>
                                                </div>
                                            </div>
                                        </a>
                                    )
                                })
                            }
                        </div>
                        </div>
                </AccordionDetails>
            </Accordion>
        </div>
    );
}

export default CustomAccordion;