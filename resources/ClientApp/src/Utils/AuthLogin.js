export default class AuthLogin {
    handleAuthentication = (resultLogin) => {
        localStorage.setItem('email', resultLogin.email);
        localStorage.setItem('nombre_completo', resultLogin.nombre_completo);
        localStorage.setItem('expireSesion', resultLogin.expireSesion);
        localStorage.setItem('token', resultLogin.token);
        localStorage.setItem('menu', resultLogin.menu);
        localStorage.setItem('reloadHome', "0");
    }

    logout = () => {
        localStorage.removeItem('nombre');
        localStorage.removeItem('email');
        localStorage.removeItem('email');
        localStorage.removeItem('nombre_completo');
        localStorage.removeItem('expireSesion');
        localStorage.removeItem('token');
        localStorage.removeItem('menu');
        localStorage.removeItem('reloadHome');
    }

    isAuthenticated = () => {
        if (this.expireSesion() === null) {
            return false;
        }
        return new Date().getTime() < new Date(this.expireSesion()).getTime();
    }

    nombre_completo = () => {
        let contador = 0;
        let nombre_completo = null;
        while (!nombre_completo && contador <= 1000) {
            nombre_completo = localStorage.getItem("nombre_completo");
            if (nombre_completo) {
                contador = 1000;
            } else {
                contador++;
            }
        }

        return nombre_completo;
    }

    username = () => {
        let contador = 0;
        let username = null;
        while (!username && contador <= 1000) {
            username = localStorage.getItem("email");
            if (username) {
                contador = 1000;
            } else {
                contador++;
            }
        }

        return username;
    }

    email = () => {
        let contador = 0;
        let email = null;
        while (!email && contador <= 1000) {
            email = localStorage.getItem("email");
            if (email) {
                contador = 1000;
            } else {
                contador++;
            }
        }

        return email;
    }

    expireSesion = () => {
        let contador = 0;
        let expireSesion = null;
        while (!expireSesion && contador <= 1000) {
            expireSesion = localStorage.getItem("expireSesion");
            if (expireSesion) {
                contador = 1000;
            } else {
                contador++;
            }
        }

        return expireSesion;
    }
    token = () => {
        let contador = 0;
        let token = null;
        while (!token && contador <= 1000) {
            token = localStorage.getItem("token") || "";
            if (token) {
                contador = 1000;
            } else {
                contador++;
            }
        }

        return token;
    }
    getReloadHome = () => {
        let contador = 0;
        let reloadHome = null;
        while (!reloadHome && contador <= 1000) {
            reloadHome = localStorage.getItem("reloadHome");
            if (reloadHome) {
                contador = 1000;
            } else {
                contador++;
            }
        }

        return reloadHome;
    }
    setReloadHome=(value)=>{
        localStorage.setItem("reloadHome", value);
    }
    menu = () => {
        let contador = 0;
        let menu = null;
        while (!menu && contador <= 1000) {
            menu = localStorage.getItem("menu");
            if (menu) {
                contador = 1000;
            } else {
                contador++;
            }
        }

        return menu;
    }

    parseJwt=(token)=> {
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        var jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        return JSON.parse(jsonPayload);
    }

    permisos = () => {
        var menu = localStorage.getItem("token") || "";
        if (!menu) return null;

        var menuJson = this.parseJwt(menu);
        return menuJson.modulo_permisos_ids;
    }

    tieneModuloPermiso = (idModuloPermiso) => {
        let permisos = this.permisos();
        if (!permisos) return false;
        return permisos.find(idModuloPermisoFromDb => Number.parseInt(idModuloPermisoFromDb) === idModuloPermiso);
    }
    pathApi = () => {
         return "http://localhost:8000/uploads/";
        // return "https://anepobservatorio.com/aservice/uploads/"
        // return "https://api.observatoriolegislativoconep.com/uploads/"
        // return "https://pruebasmorant.com.mx/clienteoit.pruebasmorant.com.mx/aservice/uploads/"
    }
    // pathBaseApi = () => {
    //     return "https://apilegislativoandi.azurewebsites.net/";
    // }

    setEmail = (value) => {
        localStorage.setItem("email", value);
    }
}
