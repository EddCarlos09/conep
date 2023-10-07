import React from 'react';
import AwesomeSlider from 'react-awesome-slider';
import CVDataService from "../../../Services/CongresoVisible/CongresoVisible.Service";
import SlideDataService from "../../../Services/General/informacionSitio.Service";
import 'react-awesome-slider/dist/styles.css';
import CongresoVisibleEquipo from '../../../Components/CongresoVisible/congresoVisibleEquipo';
import QueEsCongresoVisible from '../../../Components/CongresoVisible/QueEsCongresoVisible';
import AuthLogin from "../../../Utils/AuthLogin";
import CongresoVisibleAliado from '../../../Components/CongresoVisible/CongresoVisibleAliado';


const auth = new AuthLogin();
let pos = { top: 0, left: 0, x: 0, y: 0 };
const constFileds = {
    id: 0,
    queEs: "",
    objetivos: "",
    historiaymision: "",
    nuestroFuturo: "",
    nuestroReto: ""
};
const mediaCarousel = {
    slide_Principal:[],
    slide_secundario:[]
};
class CongresoVisible extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            subloader: false,
            mediaCarouselPrincipal: [],
            mediaCarouselSecundario:[],
            data: constFileds,
            slideCV : mediaCarousel,
            dataEquipo: []
        }
    }
    componentDidMount = async () => {
        await this.getAll();
        await this.getAllSlide();
        await this.getAllEquipo();
    }
    handlerLoadAgenda = async () => {
        this.setState({ subloader: true })
        setTimeout(() => {
            this.setState({ subloader: false })
        }, 1500);
    }
    getAll = async () => {
        this.setState({ loading: true });
        let congresoVisible = this.state.data;
        await CVDataService.getAll()
            .then((response) => {
                congresoVisible = response.data[0];
            })
            .catch((e) => {
                console.error(e);
            });
        this.setState({
            data: congresoVisible
        });
    };
    getAllEquipo = async () => {
        this.setState({ loading: true })
        let equipo = this.state.dataEquipo;
        await CVDataService.getAllEquipo()
            .then((response) => {
                equipo = response.data;
            }).catch((e) => { console.log(e); })

        this.setState({
            dataEquipo: equipo
        });
    }  
    getAllSlide = async () => {
        this.setState({ loading: true })
        let data = this.state.slideCV;
        await SlideDataService.getslideCongresoVisible()
            .then((response) => {
                data = response.data[0];
                
                Object.entries(data.slide_principal).forEach(([key, value]) => {
                    this.state.mediaCarouselPrincipal.push({'source': auth.pathApi() + value.imagen});
                }); 

                Object.entries(data.slide_secundario).forEach(([key, value]) => {
                    this.state.mediaCarouselSecundario.push({'source': auth.pathApi() + value.imagen});
                });   
                
            }).catch((e) => { console.log(e); })

        this.setState({
            slideCV: data
        });
    }
    render() {
        return (
            <>
                <section className="CongresoVisibleSection">
                    <AwesomeSlider
                        mobileTouch={true}
                        infinite={true}
                        media={this.state.mediaCarouselPrincipal}
                    />
                </section>

                <QueEsCongresoVisible
                    data = {this.state.data}
                    dataSlide= {this.state.mediaCarouselSecundario} 
                    button = {false}
                />

                <CongresoVisibleEquipo
                    Equipos = {this.state.dataEquipo}
                />
                <CongresoVisibleAliado
                />
            </>
        )
    }
}
export default CongresoVisible;