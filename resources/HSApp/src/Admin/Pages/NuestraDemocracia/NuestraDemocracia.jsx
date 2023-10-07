import React from 'react';
import BlogNdService from '../../../Services/BlogNd/BlogNd.Service';
import Select from '../../../Components/Select';
import { Constantes, TypeCombos } from "../../../Constants/Constantes.js";
import CardsBlogdND from "../../../Components/CongresoVisible/CardsBlogdND";

import AuthLogin from "../../../Utils/AuthLogin";
const fields={
    'titulo':'',
    'tema_blog_id':0,
    'tipo_publicacion_id':0,
    'descripcion':'', 
    'activo':1,
}
const defaultTema = { value: 0, label: "Seleccione tema del blog" };
const defaultTipoPublicacion = { value: 0, label: "Seleccione tipo de comisión" };
const auth = new AuthLogin();
class NuestraDemocracia extends React.Component {
    constructor(props){
        super(props);
        this.state={
            loading:false,
            listBlog:[],
            filterTema: { value: -1, label: "Seleccione tema del blog" },
            filterTipoPublicacion: { value: -1, label: "Seleccione tipo de publicacion" },
            dataSelectTema: [],
            dataSelectTipoPublicacion: [],
            blogDest:{},
            portada:{},
            page: 1,
            rows: 4,
            search: "",
            totalRows: 0,
            subloader:false            
        }
    }
    getDestacado=async()=>{
        this.setState({ subloader: true});
        await BlogNdService.getBlogDestacado()
            .then((response) => {
               let destacado=response.data[0];
               let portada=destacado.blog_nd_portada[3];
                this.setState({blogDest:destacado,portada:portada});            
            })
            .catch((e) => {                
                console.error(e);
            });
            this.setState({subloader:false});
    }
    getAll = async (tema,tipo, page, rows, search) => {
        this.setState({ subloader: true});
        let listBlog = this.state.listBlog;
        await BlogNdService.getAll(tema,tipo,search,page,rows)
            .then((response) => {
                listBlog = response.data;
               
            })
            .catch((e) => {
                console.error(e);
            });
        let totalRows = 0;
        await BlogNdService.getTotalRecords(tema,tipo, search)
            .then((response) => {
                totalRows = response.data;
            })
            .catch((e) => {
                console.error(e);
            });
        this.setState({
            listBlog,
            totalRows,
            subloader: false
        });
    };
    handlerPagination = async (page, rows, search = "") => {
        this.setState({ page, rows, search });
        if (this.timeout) clearTimeout(this.timeout);
        this.timeout = setTimeout(
            async function () {
                await this.getAll(                  
                    this.state.filterTema.value,
                    this.state.filterTipoPublicacion.value,                    
                    page,
                    rows,
                    search
                );
            }.bind(this),
            1000
        );
    }
    handlerTema = async (selectTema) => {
        this.setState({ filterTema: selectTema, subloader: true })
            await this.getAll(
                selectTema.value,
                this.state.filterTipoPublicacion.value,                
                this.state.page,
                this.state.rows,
                this.state.search
            );
    }
    handlerTipo = async (selectTipo) => {
        this.setState({ filterTipoPublicacion: selectTipo, subloader: true })
            await this.getAll(
                this.state.filterTema.value,
                selectTipo.value,                                
                this.state.page,
                this.state.rows,
                this.state.search
            );
    }
    getComboTema = async () => {
        let combo = [];
        await BlogNdService.getComboTema().then(response => {
            let selected = {};
            response.data.forEach(i => {
                combo.push({ value: i.id, label: i.nombre })
            })
            selected = combo[0];
            this.setState({
                dataSelectTema: combo,
                filterTema: selected
            })
        })
      
    }
    getComboTipo = async () => {
        let combo = [];
        await BlogNdService.getComboTipo().then(response => {
            let selected = {};
            response.data.forEach(i => {
                combo.push({ value: i.id, label: i.nombre })
            })
            selected = combo[0];
            this.setState({
                dataSelectTipoPublicacion: combo,
                filterTipoPublicacion: selected
            })
        })
        
    }
    componentDidMount() {
        let header = document.querySelector("header");
        let mainP = document.querySelector(".mainPublicationContainer");
        let pubSide = document.querySelector(".publicationsSide");
        if(header)
            header.classList.add("small")

        if(mainP && pubSide){
            setTimeout(() => {
                mainP.classList.add("active");
                pubSide.classList.add("active");
            }, 500);
        }
        this.getDestacado();
        this.getAll(this.state.filterTema.value,this.state.filterTipoPublicacion.value,this.state.page,this.state.rows,this.state.search);
        
    }
    componentWillUnmount(){
        let header = document.querySelector("header");
        let mainP = document.querySelector(".mainPublicationContainer");
        let pubSide = document.querySelector(".publicationsSide");
        if(header)
            header.classList.remove("small")

        if(mainP && pubSide){
            mainP.classList.remove("active");
            pubSide.classList.remove("active");
        }
    }
    render(){
        return(
            <>
                <section className="nuestraDemocraciaSection">
                    <div className="mainPublicationContainer">
                        <div className="photo">
                        <img src={this.state.portada !== "undefined" ? auth.pathApi() + this.state.portada.portada : auth.pathApi() + Constantes.NoImagen || auth.pathApi() + Constantes.NoImagen} alt=""/>                        
                        </div>
                        <div className="subinfo">
                           <div className="title">
                                <h5>{this.state.blogDest.titulo}</h5>
                            </div>
                            <a href={`#/detalle-nuestra-democracia/${this.state.blogDest.id}`} className="enlace">
                                <p href="">Ver más</p>
                            </a>
                            <div className="date">
                                <p>{new Date(this.state.blogDest.fecha_publicacion).toLocaleDateString()}</p>
                            </div>
                        </div>
                        
                    </div>
                    <div className="publicationsSide">
                        <div className="lineShadow"></div>
                        <div className="CMTitle">
                            <h3><i className="fas fa-comment-dots"></i> Nuestra democracia</h3>
                        </div>
                        <div className="relative">
                            <div className={`subloader ${this.state.subloader ? "active" : ""}`}></div>
                            <div className="buscador pd-25">
                                <div className="input-group">
                                    <input type="text" value={this.state.search}
                                        onChange={async (e) => {
                                            let data = this.state;
                                            data.search = e.target.value;
                                            this.setState({ search: data.search })
                                        }}
                                        onKeyUp={async (e) => {
                                            if (e.key === "Enter") {
                                                await this.handlerPagination(this.state.page, this.state.rows, e.target.value)
                                            }
                                        }}
                                        placeholder="¿Qué quieres aprender hoy?" className="form-control" />

                                    <span className="input-group-text"><button onClick={async () => { await this.handlerPagination(this.state.page, this.state.rows, this.state.search) }} type="button" className="btn btn-primary"><i className="fa fa-search"></i></button></span>
                                    <span className="input-group-text"><button onClick={(e) => { toggleFilter(e.currentTarget); this.getComboTema(); this.getComboTipo(); }} type="button" className="btn btn-primary"><i className="fa fa-filter"></i></button></span>
                                </div>
                                <div className="floatingFilters evenColors">
                                    <div className="one-columns relative no-margin">
                                        <div className={`subloader ${this.state.subloader ? "active" : ""}`}></div>
                                        <div className="item">
                                            <label htmlFor="">Filtrar por tipo de publicación</label>
                                            <Select
                                                divClass=""
                                                selectplaceholder="Seleccione"
                                                selectValue={this.state.filterTipoPublicacion}
                                                selectOnchange={this.handlerTipo}
                                                selectoptions={this.state.dataSelectTipoPublicacion}
                                                selectIsSearchable={false}
                                                selectclassNamePrefix="selectReact__value-container"
                                                spanClass=""
                                                spanError="" >
                                            </Select>
                                        </div>
                                        <div className="item">
                                            <label htmlFor="">Filtrar por tema</label>
                                            <Select
                                                divClass=""
                                                selectplaceholder="Seleccione"
                                                selectValue={this.state.filterTema}
                                                selectOnchange={this.handlerTema}
                                                selectoptions={this.state.dataSelectTema}
                                                selectIsSearchable={false}
                                                selectclassNamePrefix="selectReact__value-container"
                                                spanClass=""
                                                spanError="" >
                                            </Select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <CardsBlogdND 
                                data={this.state.listBlog} 
                                handler={this.handlerPagination} 
                                pageExtends={this.state.page} 
                                pageSize={this.state.rows} 
                                totalRows={this.state.totalRows} 
                                defaultImage={Constantes.NoImagen} 
                                pathImgOrigen={auth.pathApi()} />  
                        </div>
                    </div>
                </section>
                <div style={{clear:"both"}}></div>
            </>
        )
    }
}
function toggleFilter(element) {
    element.parentNode.parentNode.parentNode.querySelector(".floatingFilters").classList.toggle("active");
}
export default NuestraDemocracia;