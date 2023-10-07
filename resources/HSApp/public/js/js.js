window.addEventListener("load", () => {
    let body = document.querySelector("body");
    if(body){
        let menu = body.querySelector(".menu-bar");
        body.addEventListener("click", (e) => {
            // tags events
            let element = e.target;
            switch(e.target.tagName){
                case "A":
                    let href = element.getAttribute("href");
                    if(href === "#" || href.includes("no-link") || href === "#no-link"){
                        e.preventDefault();
                        e.stopPropagation();
                    }
                    break;
                default:
                    break;
            }

            // components events by click
            if(menu){
                if(menu.contains(element)){
                    if (element.classList.contains("btnVerLeyendas")) {
                        hideMenuLeyendas(menu)
                    }
                    else if(element.classList.contains("btnVerIconos")){
                        hideMenuIconos(menu)
                    }
                }
            }
        });
        
        if(menu){ // seteo para almacenar en localstorage
            if(
                (!localStorage.getItem("menu-leyendas") && !localStorage.getItem("menu-iconos")) ||
                (localStorage.getItem("menu-leyendas"))
            ){
                hideMenuLeyendas(menu)
            }else{
                hideMenuIconos(menu)
            }
            setResponsive(body, menu);
            let menuToggler = body.querySelector(".menu-toggler");
            if(menuToggler){
                menuToggler.addEventListener("click", (c) => {
                    menu.classList.toggle("menu-hidden")       
                })
            }
        }
    }
})

function hideMenuLeyendas(menu){
    menu.querySelector(".btnVerLeyendas").classList.add("none");
    menu.querySelector(".btnVerIconos").classList.remove("none");
    localStorage.setItem("menu-leyendas", true);
    localStorage.setItem("menu-iconos", false);
    menu.setAttribute("class", "menu-bar menu-sticky");
}

function hideMenuIconos(menu){
    menu.querySelector(".btnVerIconos").classList.add("none");
    menu.querySelector(".btnVerLeyendas").classList.remove("none");
    localStorage.setItem("menu-iconos", true);
    localStorage.setItem("menu-leyendas", false);
    menu.setAttribute("class", "menu-bar menu-sticky menu-icon-only");
}

function setResponsive(body, menu){
    let width = body.clientWidth,
        height = body.clientHeight;
    console.log(width, height)
    if(width <= 800)
        menu.classList.toggle("menu-hidden")

}