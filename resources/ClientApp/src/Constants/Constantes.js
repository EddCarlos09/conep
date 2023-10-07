// Aquí se declaran todos los nombres
export const ResolutionNames = {
    Icono: 64,
    FotoCongresistaEnVistaCurules: 95,
    FotoCongresistaPerfilDesktop: 510, 
    FotoPartidoEnVistaCurules: 67,
    FotoPartidoFondoListaCurules: 190,
    FotoVistaModalPodcastCelular: 416,
    FotoVistaModalPodcastTablet: 466,
    FotoVistaModalPodcastDesktop: 766,
    FotoVistaBanerComisionesDesktop: 1361,
    FotoVistaBanerComisionesCelular: 500,
    FotoItemListaComisionDesktop: 300,
    FotoItemListaComisionCelular: 421,
    FotoItemListaComisionTablet: 686,
    FotoEquipoQueEsCVDesktop: 250,
    FotoEquipoQueEsCVTablet: 215,
    FotoEquipoQueEsCVCelular: 110,
    FotoOpinonDesktop:1130,
    FotoInformeDestacadoDesktop: 957,
    FotoInformeDestacadoTablet: 750,
    FotoInformeDestacadoCelular: 480,
    FotoInformeMiniaturaPost: 400,
    FotoCongresoVisibleAliado:268,
    FotoBlogNdDestacadoDesktop: 957,
    FotoBlogNdDestacadoTablet: 750,
    FotoBlogNdDestacadoCelular: 480,
    FotoBlogNdMiniaturaPost: 400,
 };
 Object.freeze(ResolutionNames);

export const Constantes = {
    NoImagen: "assets/images/users/no-image.jpg",
    NoImagenPicture: "assets/images/default_large.png",
    defaultResolutions: [ // Todas
        ResolutionNames.Icono,
        ResolutionNames.FotoCongresistaEnVistaCurules
    ],
    congresistaResolutions: [
        ResolutionNames.Icono,
        ResolutionNames.FotoCongresistaEnVistaCurules,
        ResolutionNames.FotoCongresistaPerfilDesktop
    ],
    secretarioResolutions: [
        ResolutionNames.Icono,
        ResolutionNames.FotoCongresistaEnVistaCurules,
        ResolutionNames.FotoCongresistaPerfilDesktop
    ],
    partidoResolutions: [
        ResolutionNames.Icono,
        ResolutionNames.FotoPartidoEnVistaCurules,
        ResolutionNames.FotoPartidoFondoListaCurules
    ],
    podcastResolutions: [
        ResolutionNames.FotoVistaModalPodcastCelular,
        ResolutionNames.FotoVistaModalPodcastTablet,
        ResolutionNames.FotoVistaModalPodcastDesktop
    ],
    comisionsResolutions: [
        ResolutionNames.Icono,
        ResolutionNames.FotoVistaBanerComisionesDesktop,
        ResolutionNames.FotoVistaBanerComisionesCelular,
        ResolutionNames.FotoItemListaComisionDesktop,
        ResolutionNames.FotoItemListaComisionCelular,
        ResolutionNames.FotoItemListaComisionTablet
    ],
    equipoCVResolutions: [
        ResolutionNames.FotoEquipoQueEsCVDesktop,
        ResolutionNames.FotoEquipoQueEsCVTablet,
        ResolutionNames.FotoEquipoQueEsCVCelular
    ],
    opinionResolutions: [
        ResolutionNames.FotoInformeDestacadoCelular,
        ResolutionNames.FotoInformeDestacadoTablet,
        ResolutionNames.FotoInformeDestacadoDesktop
    ],
    datoContactoResolutions: [
        ResolutionNames.Icono
    ],
    generoResolutions: [
        ResolutionNames.Icono
    ],
    balanceResolutions: [
        ResolutionNames.FotoInformeDestacadoCelular,
        ResolutionNames.FotoInformeDestacadoTablet,
        ResolutionNames.FotoInformeDestacadoDesktop
    ],
    informeResolutions: [
        ResolutionNames.FotoInformeMiniaturaPost,
        ResolutionNames.FotoInformeDestacadoCelular,
        ResolutionNames.FotoInformeDestacadoTablet,
        ResolutionNames.FotoInformeDestacadoDesktop
    ],
    InfoHomeResolutions: [        
        ResolutionNames.FotoOpinonDesktop       
    ],
    CongresoVisibleAliadoResolutions: [        
        ResolutionNames.FotoCongresoVisibleAliado       
    ],
    blogNdResolutions: [
        ResolutionNames.FotoBlogNdMiniaturaPost,
        ResolutionNames.FotoBlogNdDestacadoCelular,
        ResolutionNames.FotoBlogNdDestacadoTablet,
        ResolutionNames.FotoBlogNdDestacadoDesktop
    ]
}
