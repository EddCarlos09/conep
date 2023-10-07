import React, { useEffect, useRef } from 'react'
import App from './App'
import { useHistory } from 'react-router-dom'
import AuthLogin from "./Utils/AuthLogin";
import Menu from "./Menu";

const Root = () => {
    const history = useHistory();
    const auth = new AuthLogin();

    let currentPage = useRef(null);
    let pathNameAllowAnonymous = ["login", "forget-password", ""];

    useEffect(() => {
        if (!auth.isAuthenticated()) {
            if (!pathNameAllowAnonymous.includes(currentPage.current)) {
                auth.logout();
                history.push("/");
            }
        }
        return history.listen((location) => {
            if (typeof location.state !== "undefined") {
                currentPage.current = getCurrentPage(history.location.hash);
            } else {
                if (window.location.hash) {
                    currentPage.current = getCurrentPageWithHash(window.location.hash);
                } else {
                    currentPage.current = getCurrentPage(window.location.pathname);
                }
            }
            if (auth.isAuthenticated()) {
                let menuJson = auth.menu();
                let data = JSON.parse(menuJson);
                let menu = new Menu(data);
                if (!validarUrlInMenu(currentPage.current, menu)) {
                    auth.logout();
                    history.push("/");
                }
            } else {
                if (!pathNameAllowAnonymous.includes(currentPage.current)) {
                    history.push("/");
                }
            }
        });
    },
    [history, auth, pathNameAllowAnonymous]);
    return (
        <App/>
    );
}

function getCurrentPage(currentPage) {
    let arrayCurrentPage = currentPage.split('/');
    if (!arrayCurrentPage || arrayCurrentPage.length === 0)
        return false;

    if(arrayCurrentPage[1].includes("?")){
        let arrayParams = arrayCurrentPage[1].split("?");
        currentPage = arrayParams[0];
    }
    else if(arrayCurrentPage[1].includes("/")){
        let arrayParams = arrayCurrentPage[1].split("/");
        currentPage = arrayParams[0];
    }
    else{
        currentPage = arrayCurrentPage[1];
    }

    return currentPage;
}

function getCurrentPageWithHash(currentPageWithHash) {
    let currentPage = currentPageWithHash.replace(/#\/+/g, '');

    if(currentPage.includes("?")){
        let arrayParams = currentPage.split("?");
        currentPage = arrayParams[0];
    }else if(currentPage.includes("/")){
        let arrayParams = currentPage.split("/");
        currentPage = arrayParams[0];
    }

    return currentPage;
}

function validarUrlInMenu(currentPage, menu) {
    if (!menu) return false;    
    for (let i = 0; i < Object.keys(menu).length; i++) {
        if (currentPage === menu[i].url) {
            return true;
        }
        if (menu[i].subMenus != null) {
            for (let ii = 0; ii < menu[i].subMenus.length; ii++) {
                if (validarSubMenu(currentPage, menu[i].subMenus[ii])) {
                    return true;
                }
            }
        }

        if(currentPage === 'getFile') { // Si hay archivos
            return true;
        }
    }
    return false;
}

//Aqui se pasa el objecto y se verifica sus propiedades directamente
function validarSubMenu(currentPage, subMenu) {
    if (currentPage === subMenu.url) {
        return true;
    }

    if (subMenu.subMenus != null && subMenu.subMenus.length > 0) {
        for (let i = 0; i < subMenu.subMenus.length; i++) {
            if (validarSubMenu(currentPage, subMenu.subMenus[i])) {
                return true;
            }
        }
    }
    return false;
}

export default Root;
