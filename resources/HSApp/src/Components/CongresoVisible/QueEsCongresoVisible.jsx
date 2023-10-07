import React from 'react';
import AwesomeSlider from 'react-awesome-slider';

class QueEsCongresoVisible extends React.Component {    
    constructor(props){        
        super(props);
        this.state = {
            showButton: true
        }
    }   
    componentDidMount = () =>{
        
    }
    componentWillUnmount = () =>{
        estheticOut();
    }
    handlerShowButton = async () =>{
        let data = this.props.data;
        this.setState({showButton: false})
    }
    handlerLoadAgenda = async () => {
        this.setState({ subloader: true })
        setTimeout(() => {
            this.setState({ subloader: false })
        }, 1500);
    }  
    render(){
        return (
            <div>
                <section className="CongresoVisibleSection" style={{ backgroundColor: "transparent" }}>
                    <div className="background gradient">
                        <ul className="bg-bubbles">
                            <li></li>
                            <li></li>
                            <li></li>
                            <li></li>
                            <li></li>
                            <li></li>
                            <li></li>
                            <li></li>
                            <li></li>
                            <li></li>
                        </ul>
                    </div>                    
                    <div className="centerTabs lg">
                        <ul>
                            <li className={!this.props.subloader && this.props.data.queEs !== null && this.props.data.queEs !== "" ? "active" : "none"} onClick={(e) => { changeTab(e); this.handlerLoadAgenda() }} data-ref="1"><i className="fas fa-question"></i></li>
                            <li className={!this.props.subloader && this.props.data.objetivos !== null && this.props.data.objetivos !== "" ? "" : "none"} onClick={(e) => { changeTab(e); this.handlerLoadAgenda() }} data-ref="2"><i className="fas fa-flag-checkered"></i></li>
                            <li className={!this.props.subloader && this.props.data.historiaymision !== null && this.props.data.historiaymision !== "" ? "" : "none"} onClick={(e) => { changeTab(e); this.handlerLoadAgenda() }} data-ref="3"><i className="fas fa-check-circle"></i></li>
                            <li className={!this.props.subloader && this.props.data.nuestroFuturo !== null && this.props.data.nuestroFuturo !== "" ? "" : "none"} onClick={(e) => { changeTab(e); this.handlerLoadAgenda() }} data-ref="4" ><i className="fas fa-eye"></i></li>
                            <li className={!this.props.subloader && this.props.data.nuestroReto !== null && this.props.data.nuestroReto !== "" ? "" : "none"} onClick={(e) => { changeTab(e); this.handlerLoadAgenda() }} data-ref="5"><i className="fas fa-stopwatch"></i></li>
                        </ul>                                           
                    </div>                              
                    <hr />
                    <div className="container">
                        <div className="row">
                            <div className="col-md-8">
                                <div className="contentForCenterTabs">
                                    <div className={`subloader ${this.state.subloader ? "active" : ""}`}></div>
                                    <div className="contentTab text-justify active" data-ref="1">
                                        <h3>Qué es Congreso Visible</h3>
                                        {/* style={this.props.data.objetivos != "" ? {} : { display: 'none' }} */}
                                        <div className="info">                                                                 
                                            <p dangerouslySetInnerHTML={{ __html:this.props.data.queEs }} />                                            
                                            <a href="#/que-es-congreso-visible" style={this.props.button != false ? {} : { display: 'none' }} className="btn btn-primary top-uppercase min-width-190"><i className="fa fa-caret-right"></i> Ver más</a>                                                
                                        </div>  
                                    </div>                                                             
                                    <div className="contentTab text-justify" data-ref="2">
                                        <h3>Objetivos</h3>
                                        <div className="info">
                                            <p dangerouslySetInnerHTML={{ __html: this.props.data.objetivos }} />
                                            <a href="#/que-es-congreso-visible" style={this.props.button != false ? {} : { display: 'none' }} className="btn btn-primary top-uppercase min-width-190"><i className="fa fa-caret-right"></i> Ver más</a>                                                
                                        </div>
                                    </div>
                                    <div className="contentTab text-justify" data-ref="3">
                                        <h3>Nuestra Historia y Misión</h3>
                                        <div className="info">
                                            <p dangerouslySetInnerHTML={{ __html: this.props.data.historiaymision }} />
                                            <a href="#/que-es-congreso-visible" style={this.props.button != false ? {} : { display: 'none' }} className="btn btn-primary top-uppercase min-width-190"><i className="fa fa-caret-right"></i> Ver más</a>                                                
                                        </div>
                                    </div>
                                    <div className="contentTab text-justify" data-ref="4">
                                        <h3>Nuestro Futuro</h3>
                                        <div className="info">
                                            <p dangerouslySetInnerHTML={{ __html: this.props.data.nuestroFuturo }} />
                                            <a href="#/que-es-congreso-visible" style={this.props.button != false ? {} : { display: 'none' }} className="btn btn-primary top-uppercase min-width-190"><i className="fa fa-caret-right"></i> Ver más</a>                                                
                                        </div>
                                    </div>
                                    <div className="contentTab text-justify" data-ref="5">
                                        <h3>Nuestro Reto</h3>
                                        <div className="info">
                                            <p dangerouslySetInnerHTML={{ __html: this.props.data.nuestroReto }} />
                                            <a href="#/que-es-congreso-visible" style={this.props.button != false ? {} : { display: 'none' }} className="btn btn-primary top-uppercase min-width-190"><i className="fa fa-caret-right"></i> Ver más</a>                                                
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-4" style={{ position: "relative" }}>
                                <div className="awesomeSliderContainer">
                                {
                                    typeof this.props.dataSlide !== "undefined" && this.props.dataSlide.length > 0 ?
                                    <AwesomeSlider
                                        fillParent={true}
                                        media={this.props.dataSlide}
                                    />
                                    : ""
                                }
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        )
    }
}
function changeTab(e) {
    let tabs = document.querySelectorAll(".centerTabs ul li");
    tabs.forEach(y => {
        y.classList.remove("active");
    })
    tabs.forEach(z => {
        if (document.querySelector(`.contentForCenterTabs .contentTab[data-ref="${z.getAttribute("data-ref")}"]`)) {
            document.querySelector(`.contentForCenterTabs .contentTab[data-ref="${z.getAttribute("data-ref")}"]`).classList.remove("active")
        }
    })
    e.currentTarget.classList.add("active");
    if (document.querySelector(`.contentForCenterTabs .contentTab[data-ref="${e.currentTarget.getAttribute("data-ref")}"]`)) {
        document.querySelector(`.contentForCenterTabs .contentTab[data-ref="${e.currentTarget.getAttribute("data-ref")}"]`).classList.add("active")
    }
}

function estheticOut(){
    // if(tabs.length > 0){
    //     changeTab(tabs[0]);
    // }    
}
export default QueEsCongresoVisible;