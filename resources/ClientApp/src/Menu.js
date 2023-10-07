export default class Menu
{
    id;
    modulo_id;
    menu_dependiente_id;
    nombre_visible;
    url;
    visible;
    orden;
    class_name;
    icono;
    subMenus;

    constructor(data) {
        Object.assign(this, data);
    }
}
