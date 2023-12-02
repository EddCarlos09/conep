import React, { Component } from 'react';
import Spinner from '../../../Components/Spinner';





class Home extends Component {
  

    static displayName = Home.name;
    constructor(props) {
        super(props);

        this.state = {
            loading: true
        }
    }
    componentDidMount() {
        this.timer = setInterval(() => {
            this.setState({ loading: false });
        }, 3000);

        const carousel = document.querySelector(".carousel");
        const slides = document.querySelectorAll(".slide");

        setInterval(nextSlide, 3000, carousel, slides);
    }

    componentWillUnmount() {
        clearInterval(this.timer)
    }
    render() {
        if(window.location.href.includes("/?#/home"))            
                window.location.href = "/#/home";

                const carousel = {
                    overflow:'hidden',
                    width: '100%',
                
                
                    height: '100%', 
                    margin: '0 auto'
                };
                
                const casu2 = {
                    display: 'flex',
                    transition: 'transform 0.5s ease',
                    marginTop:'5em',
                }
                
                const slide = {
                    flex: '0 0 100%',
                    display: 'flex',
                    justifyContent: 'center',
                }  


        return (
            

            <div>
                
                <Spinner show={this.state.loading} />
                <ul className="breadcrumb">
                    <li><a href="#/">Página principal</a></li>
                </ul>
                <div className="page-content-wrap">
                    <div className="row menuHome mainPageDescription">
                        <div className="col-md-12 mainPageDescription">
                            <div className="row">
                            <div className='col-md-12'>
                                <div className="carousel-container">
                                    <div className="carousel" style={casu2}>
                                        <div className="slide" style={slide}>
                                            <img width={700} src="/img/imagen1.jpg" alt="Imagen 1" />
                                        </div>
                                        <div className="slide" style={slide}>
                                            <img  width={700} src="/img/imagen2.jpg" alt="Imagen 2" />
                                        </div>
                                        <div  className="slide" style={slide}>
                                            <img width={1200} src="/img/banner.jpg" alt="Imagen 3" />
                                        </div>
                                    </div>
                                </div>  
                                <script src="script.js"></script>
                            </div>   
                            
{/*                         
                                <div className="col-md-12 ">
                                    <div className="row slogan">
                                        <div className="col-md-12">
                                            <img src="/img/conep-people.jpeg" alt="" />
                                        </div>
                                        <div className="col-md-12 ">
                                            <p className='sloganDesc'>El observatorio legislativo brinda información permanente y actualizada sobre las iniciativas legislativas presentadas y estatus de las mismas permitiendo al sector privado una participación activa en el proceso de análisis y evaluación de las iniciativas, enriqueciendo las mismas e impactando de manera positiva a los distintos sectores productivos del país</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-12 resumen">
                                    <p>El Consejo Nacional de la Empresa Privada “CoNEP” firmo el pasado 28 de julio de 2021 un convenio de cooperación con la Asamblea Nacional de Panamá con el propósito de sentar las bases para identificar un nuevo mecanismo y accionar en la relación entre ambas instancias tratando de establecer un proceso institucional claro y robusto que tenga como bases sustantivas una comunicación efectiva que permita que el CoNEP pueda participar con la antelación suficiente en el proceso de análisis y evaluación de las iniciativas legislativas y realizar aportes que enriquezcan las mismas. </p>
                                    <p>Con este objetivo en mente el CoNEP pone a disposición la herramienta Observatorio Legislativo que permitirá al sector privado del país tener acceso de manera actualizada al perfil de los diputados que conforman la asamblea, partido político, circuito que representan, agenda e iniciativas legislativas presentadas, así como estatus de las mismas y otra información relevante. </p>
                                    <p>Esperamos que esta herramienta que ponemos a la disposición del sector privado contribuya a lograr legislación y políticas encaminadas al desarrollo integral, económico y social del país para elevar sistemáticamente el nivel de vida de nuestra población. </p>
                                    <p>Agradecemos nos comparta sus comentarios en el uso de la herramienta al correo: <strong>dejecutiva@conep.org.pa</strong></p>
                                </div> */}
                            </div>
                        </div>
                       
                        {/* <div className="col-md-3">
                            <a href="#/agenda" className="tile tile-danger"><span className="fa fa-calendar-alt"></span> <p>Agenda legislativa</p></a>
                        </div>
                        <div className="col-md-3">
                            <a href="#/alerta" className="tile tile-success"><span className="fa fa-bell"></span> <p>Alertas</p></a>
                        </div>
                        <div className="col-md-3">
                            <a href="#/proyectos" className="tile tile-info"><span className="fa fa-book"></span> <p>Proyectos de ley</p></a>
                        </div>
                        <div className="col-md-3">
                            <a href="#/representantes" className="tile tile-primary"><span className="fa fa-users"></span> <p>Congresistas</p></a>
                        </div>
                        <div className="col-md-3">
                            <a href="#/comisiones" className="tile tile-warning"><span className="fa fa-university"></span> <p>Comisiones</p></a>
                        </div>
                        <div className="col-md-3">
                            <a href="#/contacto-tickets" className="tile tile-danger"><span className="fa fa-ticket-alt"></span> <p>Tickets</p></a>
                        </div>
                        <div className="col-md-3">
                            <a href="#/contacto-avisos" className="tile tile-danger"><span className="fa fa-exclamation"></span> <p>Avisos</p></a>
                        </div> */}
                    </div>
                </div>
            </div>
        );
    }
}

export default Home;


    let currentIndex = 0;

    function showSlide(index, carousel, slides) {
        if (index < 0) {
            index = slides.length - 1;
        } else if (index >= slides.length) {
            index = 0;
        }

        carousel.style.transition = "transform 0.5s ease"; // Agregar transición
        carousel.style.transform = `translateX(-${index * 100}%)`;
        currentIndex = index;
    }

    function nextSlide(carousel, slides) {
        
        currentIndex++;
     
    
        if (currentIndex >= slides.length) {
            currentIndex = 0;
            
        }
        showSlide(currentIndex, carousel, slides);
    }