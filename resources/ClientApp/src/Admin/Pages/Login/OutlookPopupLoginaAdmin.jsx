import React from "react";
import {  AuthenticatedTemplate, useMsal, useAccount } from "@azure/msal-react";

const OutlookPopupLogin = ({}) => {
    const { instance, accounts } = useMsal();
    const account = useAccount(accounts[0] || {});
    return (

    <div className="page-content" style={{ height: "auto !important" }}>
        <ul className="x-navigation x-navigation-horizontal x-navigation-panel">
            <li className="xn-icon-button">
                <a href="#/" className="x-navigation-minimize"><span className="fa fa-bars"></span></a>
            </li>
            <li className="xn-icon-button pull-right">
                <a href="#/" className="mb-control" data-box="#mb-signout"><span className="fa fa-sign-out"></span> Cerrar sesión</a>
            </li>
            <li className="xn-icon-button pull-right">
                <h5 className="login-title text-center" style={{textAlign: "center", color: "white", marginBottom: "0px", marginTop: "7px", fontSize: "12px"}}> {account !== null ? `${account.name}` : ""}</h5>
                <h5 className="login-title text-center" style={{textAlign: "center", color: "white", marginBottom: "0px", marginTop: "7px", fontSize: "12px"}}> {account !== null ? `${account.username}` : ""}</h5>
            </li>
        </ul>


        <div className="message-box animated fadeIn" data-sound="alert" id="mb-signout">
                <div className="mb-container">
                    <div className="mb-middle">
                        <div className="mb-title"><span className="fa fa-sign-out"></span> ¿Cerrar sesión?</div>
                        <div className="mb-content">
                            <p>¿Desea cerrar la sesión?</p>
                            <p>Sí desea cerrar la sesión presione sí.</p>
                        </div>
                        <AuthenticatedTemplate>
                        <div className="mb-footer">
                            <div className="pull-right">
                                <button className="btn btn-default btn-lg mb-control-close">No</button>
                                <button onClick={() =>  instance.logout()} className="btn btn-success btn-lg">Sí</button>
                            </div>
                        </div>
                        </AuthenticatedTemplate>
                    </div>
                </div>
            </div>               
    </div>
    );
};

export default OutlookPopupLogin;