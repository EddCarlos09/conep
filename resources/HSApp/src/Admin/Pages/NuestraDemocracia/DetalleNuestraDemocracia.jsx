import React from 'react';
import BlogNdService from '../../../Services/BlogNd/BlogNd.Service';
import { Constantes, TypeCombos } from "../../../Constants/Constantes.js";
import AuthLogin from "../../../Utils/AuthLogin";
import SunEditor from 'suneditor-react';
const auth = new AuthLogin();
const fieldsConst = {
    'titulo': '',
    'tema_blog_id': 0,
    'tipo_publicacion_id': 0,
    'descripcion': '',
    'activo': 1,
}
class DetalleNuestraDemocracia extends React.Component {
    constructor(props) {
        super(props);
        const id =
            this.props.match.params.id === undefined
                ? 0
                : this.props.match.params.id;
        this.state = {
            id: id,
            loading: true,
            fields: {}
        }
    }
    getBloga = async (id) => {
        this.setState({ loading: true });
        await BlogNdService.get(id)
            .then((response) => {
                let fields = this.state.fields;
                fields = response.data[0];
                fields.icono = fields.tipo_publicacion.icono;
                this.setState({ fields: fields, loading: false });
            })
            .catch((e) => {
                console.error(e);
            });
    };
    componentDidMount = async () => {
        let id = this.state.id;
        if (id != 0)
            await this.getBloga(id);
    }
    render() {
        return (
            <>
                <section className="CVBannerMenuContainer no-full-height bg-blue" style={{ backgroundImage: `url(${!this.state.loading ? (typeof this.state.fields.blog_nd_portada[3] !== "undefined" ? auth.pathApi() + this.state.fields.blog_nd_portada[3].portada : Constantes.NoImagenPicture) : ""})` }}>
                    <div className="CVBannerCentralInfo">
                        <div className="CVBanerIcon littleIcon"><i className="fas fa-file-alt"></i></div>
                        <div className="CVBannerTitle text-center">
                            <h3>{!this.state.loading ? (this.state.fields.titulo) : ""}</h3>
                        </div>
                    </div>
                </section>
                <section className="nuestraDemocraciaSection">
                    <div className="listadoPageContainer">
                        <div className="container">
                            <div className={`subloader ${this.state.loading ? "active" : ""}`}></div>
                            <div className="row">
                                <div className="col-md-12">
                                    {/* <div className="autor" style={{
                                        display: "flex",
                                        justifyContent: "flex-start",
                                        alignItems: "center",
                                        margin: "15px 0"
                                    }}>
                                        <div className="photo avatar" style={{ marginRight: "13px" }}>
                                            <img src={!this.state.loading ? (typeof this.state.data.equipo.equipo_imagen[0] !== "undefined" ? auth.pathApi() + this.state.data.equipo.equipo_imagen[0].imagen : Constantes.NoImagen) : ""} alt="CV" />
                                        </div>
                                        {!this.state.loading ? this.state.data.equipo.nombre : ""}
                                    </div> */}
                                    <strong>Fecha de publicación:</strong>
                                    <p>{!this.state.loading ? this.state.fields.fecha_publicacion : ""}</p>
                                    <strong>Tipo de publicación:</strong>
                                    <p>{!this.state.loading ? (this.state.fields.tipo_publicacion.nombre) : "Sin autores"}</p>
                                    <strong>Tema:</strong>
                                    <p>{!this.state.loading ? (this.state.fields.tema_blog.nombre) : "Sin autores"}</p>
                                    <strong>Tags</strong>
                                    <div className="publicationTags">
                                        {
                                            !this.state.loading ? this.state.fields.conceptos?.map((item, i) =>{
                                                return (
                                                    <p>{item.glosario_legislativo[0].palabra}</p>
                                                );
                                            }): ""
                                        }
                                    </div>
                                    <hr />
                                    <SunEditor
                                        disable={true}
                                        enableToolbar={true}
                                        showToolbar={false}
                                        width="100%"
                                        height="100%"
                                        setOptions={{ resizingBar: false, showPathLabel: false, shortcutsDisable: true }}
                                        setContents={!this.state.loading ? (this.state.fields.descripcion) : "Sin descripción"}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                </section>
            </>
        )
    }
}

export default DetalleNuestraDemocracia;