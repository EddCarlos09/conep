export default class Menu
{
    IdMenu;
    IdModulo;
    IdMenuDependiente;
    NombreVisible;
    Url;
    Visible;
    Orden;
    ClassName;
    Icono;
    SubMenus;

    constructor(data) {
        Object.assign(this, data);
    }
}