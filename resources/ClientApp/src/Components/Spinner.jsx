import React from 'react';
import './Spinner.css';

const Spinner = ({ show }) => {

    if (show){
        removeNone();
        return (
            <div className="spinner-box-login show-spinner">
                <div className="loading-icon-login">
                </div>
                <button onClick={()=>{window.location.reload()}} className="reloadLate btn btn-primary none"><i className="fa fa-undo"></i> Recargar</button>
            </div>
        )
    }
    else
        return (
            <div className="spinner-box-login">
                <div className="loading-icon-login">
                </div>
            </div>
        )
}
function removeNone(){
    setTimeout(() => {
        if(document.querySelector(".reloadLate"))
            document.querySelector(".reloadLate").classList.remove('none')
    }, 10000);
}

export default Spinner;