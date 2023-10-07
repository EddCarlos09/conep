/* Control de menú */
window.addEventListener('load', function() {
    let toggleButtonMenu = document.querySelector(".toggleMenu");
    let closeButtonMenu = document.querySelector(".closeMenu");
    let blackCap = document.querySelector(".blackCap");
    if(toggleButtonMenu && closeButtonMenu){
        toggleButtonMenu.addEventListener("click", ()=>{showMenu(toggleButtonMenu)});
        closeButtonMenu.addEventListener("click", ()=>{hideMenu(closeButtonMenu)});
        blackCap.addEventListener("click", ()=>{hideMenu(closeButtonMenu)});
    }

    // Deshabilitando a con #
    
    let aTags = document.querySelectorAll("a[href='#']");
    aTags.forEach(x => {x.addEventListener("click", (e) => {
        e.stopPropagation();
        e.preventDefault();
        return false
    })})
});


function showMenu(button){
    let menu = document.querySelector(".cv-navbar");
    let blackCap = document.querySelector(".blackCap");
    if(menu && blackCap){
        menu.classList.add("active");
        blackCap.classList.add("active");
    }else{
        console.warn("Falta definir el menú o la blackCap");
    }
    // button.classList.toggle("active");
}

function hideMenu(button){
    let menu = document.querySelector(".cv-navbar");
    let blackCap = document.querySelector(".blackCap");
    if(menu && blackCap){
        menu.classList.remove("active");
        blackCap.classList.remove("active");
    }else{
        console.warn("Falta definir el menú o la blackCap");
    }
}

/* End control de menú */