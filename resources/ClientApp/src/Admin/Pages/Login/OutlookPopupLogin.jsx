import React from "react";
import { AuthenticatedTemplate, UnauthenticatedTemplate, useMsal, useAccount } from "@azure/msal-react";
import { loginRequest } from "../../../Http/Http-AuthConfig";
import AuthLogin from "../../../Utils/AuthLogin";

const OutlookPopupLogin = ({}) => {
    const { instance, accounts } = useMsal();
    const account = useAccount(accounts[0] || {});
    const auth = new AuthLogin();
    if(account != null)
        auth.handleAuthentication(account);
    else
        auth.logout();
    return (
        <div className="login-container">
            <div className="login-box animated fadeInDown">
                <div className="login-logo"></div>
                <div className="login-body">
                    <div className="login-title text-center"><strong>Bienvenido</strong></div>
                    <h5 className="login-title text-center" style={{textAlign: "center"}}> {account !== null ? `${account.name}` : "Inicia sesión"}</h5>
                    <form className="form-horizontal">
                        <div className="form-group">
                            <div className="col-md-12">
                                <UnauthenticatedTemplate>
                                    <button type="button" onClick={() => instance.loginPopup(loginRequest)} className="btn btn-primary btn-block mt-50 center-block" style={{width: "150px"}}><i className="fa fa-envelope"></i> Iniciar sesión</button>
                                </UnauthenticatedTemplate>
                                <AuthenticatedTemplate>
                                    <button onClick={()=>{window.location.href = "/#/home"}} className="btn btn-primary btn-block mt-50 center-block"><i className="fa fa-user"></i> Acceder al admin</button>
                                    <hr/>
                                    <button type="button" onClick={() =>  instance.logout()} className="btn btn-default btn-block mt-50 center-block"><i className="fa fa-sign-out"></i> Cerrar sesión</button>
                                </AuthenticatedTemplate>
                                <p className="text-center mt-50" style={{}}>&copy; {new Date().getUTCFullYear()} Congreso Visible</p>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

        </div>
    );
};

export default OutlookPopupLogin;