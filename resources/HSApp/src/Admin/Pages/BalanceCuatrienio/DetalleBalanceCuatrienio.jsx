import React from 'react';
import PostInformesList from "../../../Components/CongresoVisible/PostInformesList";
import { Constantes, TypeCombos } from "../../../Constants/Constantes.js";
import DetalleBalanceCuatrienioDataService from "../../../Services/ContenidoMultimedia/DetalleBalanceCuatrienio.Service";
import AuthLogin from "../../../Utils/AuthLogin";
import Select from '../../../Components/Select';

const auth = new AuthLogin();
class DetalleBalanceCuatrienio extends React.Component {
    constructor(props){
        super(props);
        const id = this.props.match.params.id === undefined ? 0 : this.props.match.params.id;
        this.state = {
            id:id,
            subloader: true,
            subloaderInformes: true,
            subloaderFilters: false,
            data: {},
            listInformes: {
                data: [],
                totalRows: 0,
                search: "",
                page: 1,
                rows: 8
            },
            filterEquipoCV: {value: -1, label: "Filtrar equipo CV"},
            dataSelectEquipoCV: [],
            filterTipoPublicacion: {value: -1, label: "Filtar tipo publicación"},
            dataSelectTipoPublicacion: [],
            filterConcepto: {value: -1, label: "Elegir concepto"},
            dataSelectConcepto: []
        }
    }
    // Handlers
    handlerPaginationInformes = async (page, rows, search = "") => {
        let listInformes = this.state.listInformes;
        listInformes.page = page;
        listInformes.rows = rows;
        listInformes.search = search;
        this.setState({ listInformes });
        if (this.timeout) clearTimeout(this.timeout);
        this.timeout = setTimeout(
            async function () {
                await this.getAllInformes(1, this.state.id, this.state.filterEquipoCV.value, search, page, rows);
            }.bind(this),
            1000
        );
    }
    handlerClickTag = async (tag) => {
        this.setState({ filterConcepto: {value: tag.id, label: tag.palabra} });
        await this.getAllInformes(1, this.state.id, this.state.filterEquipoCV.value, this.state.filterTipoPublicacion.value, tag.id, this.state.listInformes.search, this.state.listInformes.page, this.state.listInformes.rows);
    }
    handlerFilterEquipoCV = async (selectEquipoCV) => {
        this.setState({ filterEquipoCV: selectEquipoCV });
        await this.getAllInformes(1, this.state.id, selectEquipoCV.value, this.state.filterTipoPublicacion.value, this.state.filterConcepto.value, this.state.listInformes.search, this.state.listInformes.page, this.state.listInformes.rows);
    }
    handlerFilterTipoPublicacion = async (selectTipoPublicacion) => {
        this.setState({ filterTipoPublicacion: selectTipoPublicacion });
        await this.getAllInformes(1, this.state.id, this.state.filterEquipoCV.value, selectTipoPublicacion.value, this.state.filterConcepto.value, this.state.listInformes.search, this.state.listInformes.page, this.state.listInformes.rows);
    }
    handlerFilterConcepto = async (selectConcepto) => {
        this.setState({ filterConcepto: selectConcepto });
        await this.getAllInformes(1, this.state.id, this.state.filterEquipoCV.value, this.state.filterTipoPublicacion.value, selectConcepto.value, this.state.listInformes.search, this.state.listInformes.page, this.state.listInformes.rows);
    }
    // 
    componentDidMount = async () => {
        estheticIn(); // No remover. Estética de la página actual
        await this.getByID(this.state.id);
        await this.getAllInformes(1, this.state.id, this.state.filterEquipoCV.value, this.state.filterTipoPublicacion.value, this.state.filterConcepto.value, this.state.listInformes.search, this.state.listInformes.page, this.state.listInformes.rows);
    }
    componentWillUnmount() {
        estheticOut(); // No remover. Estética de la página actual
    }
    // 

    // Métodos
    getByID = async (id) => {
        this.setState({ subloader: true });
        await DetalleBalanceCuatrienioDataService.get(id)
            .then(response => {
                this.setState({
                    data: response.data,
                    subloader: false,
                });
            })
            .catch(e => {
                this.setState({
                    subloader: false
                });
                console.log(e);
            });
    }
    getComboEquipoCVByType = async () => {
        if (this.state.dataSelectEquipoCV.length === 0 || this.state.dataSelectEquipoCV === null || typeof this.state.dataSelectEquipoCV === 'undefined') {
            this.setState({ subloaderFilters: true })
            await DetalleBalanceCuatrienioDataService.getComboEquipoCVByType(TypeCombos.EquiposBalancesInformes).then(response => {
                let combo = [];
                response.data.forEach(i => {
                    combo.push({ value: i.id, label: i.nombre })
                })
                combo.unshift({ value: -1, label: "Filtrar equipo CV" })
                this.setState({
                    dataSelectEquipoCV: combo,
                    subloaderFilters: false
                })
            })
        }
    }
    getComboGlosarioLegislativoByType = async () => {
        if (this.state.dataSelectConcepto.length === 0 || this.state.dataSelectConcepto === null || typeof this.state.dataSelectConcepto === 'undefined') {
            this.setState({ subloaderFilters: true })
            await DetalleBalanceCuatrienioDataService.getComboGlosarioLegislativoByType(TypeCombos.ConceptosInformes).then(response => {
                let combo = [];
                response.data.forEach(i => {
                    combo.push({ value: i.id, label: i.palabra })
                })
                combo.unshift({ value: -1, label: "Filtrar por concepto" })
                this.setState({
                    dataSelectConcepto: combo,
                    subloaderFilters: false
                })
            })
        }
    }
    getComboTipoPublicacion = async () => {
        if (this.state.dataSelectTipoPublicacion.length === 0 || this.state.dataSelectTipoPublicacion === null || typeof this.state.dataSelectTipoPublicacion === 'undefined') {
            this.setState({ subloaderFilters: true })
            await DetalleBalanceCuatrienioDataService.getComboTipoPublicacion().then(response => {
                let combo = [];
                response.data.forEach(i => {
                    combo.push({ value: i.id, label: i.nombre })
                })
                combo.unshift({ value: -1, label: "Filtrar tipo publicación" })
                this.setState({
                    dataSelectTipoPublicacion: combo,
                    subloaderFilters: false
                })
            })
        }
    }
    
    getAllInformes = async (idFilterActive, id, equipo, publicacion, concepto, search, page, rows) => {
        this.setState({ subloaderInformes: true });
        let listInformes = this.state.listInformes;
        await DetalleBalanceCuatrienioDataService.getAllInformes(
            idFilterActive,
            id, equipo, publicacion, concepto,
            search, page, rows
        )
            .then((response) => {
                listInformes.data = response.data;
            })
            .catch((e) => {
                console.error(e);
            });
        await DetalleBalanceCuatrienioDataService.getTotalRecordsInformes(
            idFilterActive,
            id, equipo, publicacion, concepto,
            search
        )
            .then((response) => {
                listInformes.totalRows = response.data;
            })
            .catch((e) => {
                console.error(e);
            });

        this.setState({
            listInformes,
            subloaderInformes: false
        });
    };
    // 
    render(){
        return(
            <>
                <section className="nuestraDemocraciaSection">
                    <div className="mainPublicationContainer">
                        <div className="photo">
                            <img src={typeof this.state.data.imagen !== "undefined" ? auth.pathApi() + this.state.data.imagen[2].imagen : ""} alt=""/>
                        </div>
                        <div className="subinfo">
                           <div className="title">
                                <h5>{this.state.data.titulo || ''}</h5>
                            </div>
                        </div>
                        
                    </div>
                    <div className="publicationsSide ">
                        <div className="lineShadow"></div>
                        <div className="CMTitle">
                            <h3><i className="fas fa-file-alt"></i> Informes de balance</h3>
                        </div>
                        <div className="relative">
                            <div className={`subloader ${this.state.subloaderInformes ? "active" : ""}`}></div>
                            <div className="buscador pd-25">
                                <div class="input-group">
                                    <input type="text" value={this.state.search}
                                        onChange={async (e) => {
                                            this.setState({ search: e.target.value })
                                        }}
                                        onKeyUp={async (e) => {
                                            if (e.key === "Enter") {
                                                await this.handlerPaginationInformes(this.state.page, this.state.rows, e.target.value)
                                            }
                                        }}
                                        placeholder="Escriba para buscar" className="form-control" />

                                    <span className="input-group-text"><button onClick={async () => { await this.handlerPaginationInformes(this.state.page, this.state.rows, this.state.search) }} type="button" className="btn btn-primary"><i className="fa fa-search"></i></button></span>
                                    <span className="input-group-text"><button onClick={(e) => { toggleFilter(e.currentTarget); this.getComboEquipoCVByType(); this.getComboTipoPublicacion(); this.getComboGlosarioLegislativoByType() }} type="button" className="btn btn-primary"><i className="fa fa-filter"></i></button></span>
                                </div>
                                <div className="floatingFilters evenColors">
                                    <div className="one-columns relative no-margin">
                                        <div className={`subloader ${this.state.subloaderFilters ? "active" : ""}`}></div>
                                        <div className="item">
                                            <label htmlFor="">Filtrar por equipo CV</label>
                                            <Select
                                                divClass=""
                                                selectplaceholder="Seleccione"
                                                selectValue={this.state.filterEquipoCV}
                                                selectOnchange={this.handlerFilterEquipoCV}
                                                selectoptions={this.state.dataSelectEquipoCV}
                                                selectIsSearchable={true}
                                                selectclassNamePrefix="selectReact__value-container"
                                                spanClass=""
                                                spanError="" >
                                            </Select>
                                        </div>
                                        <div className="item">
                                            <label htmlFor="">Filtrar tipo publicación</label>
                                            <Select
                                                divClass=""
                                                selectplaceholder="Seleccione"
                                                selectValue={this.state.filterTipoPublicacion}
                                                selectOnchange={this.handlerFilterTipoPublicacion}
                                                selectoptions={this.state.dataSelectTipoPublicacion}
                                                selectIsSearchable={true}
                                                selectclassNamePrefix="selectReact__value-container"
                                                spanClass=""
                                                spanError="" >
                                            </Select>
                                        </div>
                                        <div className="item">
                                            <label htmlFor="">Filtrar por concepto</label>
                                            <Select
                                                divClass=""
                                                selectplaceholder="Seleccione"
                                                selectValue={this.state.filterConcepto}
                                                selectOnchange={this.handlerFilterConcepto}
                                                selectoptions={this.state.dataSelectConcepto}
                                                selectIsSearchable={true}
                                                selectclassNamePrefix="selectReact__value-container"
                                                spanClass=""
                                                spanError="" >
                                            </Select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <PostInformesList 
                                handlerClickTag={this.handlerClickTag} 
                                data={typeof this.state.listInformes.data !== "undefined" ? this.state.listInformes.data : []} 
                                defaultImage={Constantes.NoImagen} 
                                pageExtends={this.state.listInformes.page} 
                                pageSize={this.state.listInformes.rows} 
                                totalRows={this.state.listInformes.totalRows} 
                                pathImgOrigen={auth.pathApi()} 
                                handler={this.handlerPaginationInformes} 
                            />
                        </div>
                    </div>
                </section>
                <div style={{clear:"both"}}></div>
            </>
        )
    }
}

function estheticIn() {
    let header = document.querySelector("header");
    let mainP = document.querySelector(".mainPublicationContainer");
    let pubSide = document.querySelector(".publicationsSide");
    if (header)
        header.classList.add("small")

    if (mainP && pubSide) {
        setTimeout(() => {
            mainP.classList.add("active");
            pubSide.classList.add("active");
        }, 500);
    }
}

function estheticOut() {
    let header = document.querySelector("header");
    let mainP = document.querySelector(".mainPublicationContainer");
    let pubSide = document.querySelector(".publicationsSide");
    if (header)
        header.classList.remove("small")

    if (mainP && pubSide) {
        mainP.classList.remove("active");
        pubSide.classList.remove("active");
    }
}
function toggleFilter(element) {
    element.parentNode.parentNode.parentNode.querySelector(".floatingFilters").classList.toggle("active");
}

export default DetalleBalanceCuatrienio;
