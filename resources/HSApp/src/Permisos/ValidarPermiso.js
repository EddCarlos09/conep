import AuthLogin from "../Utils/AuthLogin"

const ValidarPermiso = ({ IdModuloPermisoValidar, DefaultTemplate }) => {
    const idModuloPermisoValidar = IdModuloPermisoValidar;
    const defaultTemplate = DefaultTemplate;
    const auth = new AuthLogin();

    return auth.tieneModuloPermiso(idModuloPermisoValidar)
        ? defaultTemplate
        : null;
};

export default ValidarPermiso;