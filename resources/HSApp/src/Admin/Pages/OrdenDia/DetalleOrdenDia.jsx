import React from 'react';
import ActividadesLegislativasDataService from "../../../Services/ActividadesLegislativas/ActividadesLegislativas.Service";
import SunEditor from 'suneditor-react';
class DetalleOrdenDia extends React.Component {
    constructor(props) {
        super(props);
        const id =
            this.props.match.params.id === undefined
                ? 0
                : this.props.match.params.id;
        this.state = {
            id: id,
            loading: false,
            fields: {
                fecha: new Date(),
                realizado: false,
                tipo_actividad_id: null,
                numero_camara: "N/D",
                numero_senado: "N/D",
                tituloproyecto: "N/D",
                proyecto: false,
                citac: false,
                agendaComision: []
            }
        }
    }
    getDetalleAgenda = async (id) => {
        this.setState({ loading: true });
        await ActividadesLegislativasDataService.getAgendaDetalle(id)
            .then((response) => {
                let fields = this.state.fields;
                fields = response.data[0];

                fields.fecha = fields.agenda.fecha;
                //fields.realizado=fields.agenda.realizado; 
                fields.agendaComision = fields.agenda.agenda_comision;
                if (fields.selected != null) {
                    fields.proyecto = true;
                    fields.numero_camara = fields.selected.numero_camara;
                    fields.numero_senado = fields.selected.numero_senado;
                    fields.tituloproyecto = fields.selected.titulo;
                }
                if (fields.citacion != null) {
                    fields.citac = true;
                    fields.citaciontitulo = fields.citacion.titulo;
                    fields.numprop = fields.citacion.numero_proposicion;
                    fields.legislatura = fields.citacion.legislatura.nombre;
                }

                console.log(fields);
                this.setState({ fields: fields });
            })
            .catch((e) => {
                console.error(e);
            });
        this.setState({ loading: false });
    };
    componentDidMount = async () => {

        let id = this.state.id;

        if (id != 0)
            await this.getDetalleAgenda(id);
    }
    render() {
        return (
            <>
                <main className="workspace">
                    <section className="breadcrumb lg:flex items-start">
                        <div>
                            <h1>Orden - {this.state.fields.titulo}</h1>
                            <ul>
                                <li><a href="#">Página principal</a></li>
                                <li className="divider la la-arrow-right"></li>
                                <li><a href="#">Agenda Legislativa</a></li>
                                <li className="divider la la-arrow-right"></li>
                                <li>Detalle</li>
                            </ul>
                        </div>
                    </section>

                    <div className="lg:flex pageSection justify-center">
                        <div className="info">
                            <div className="itemSection">
                                <div className="lg:flex lg:-mx-4">
                                    <div className="lg:w-1/3 lg:px-4">
                                        <div
                                            className="card px-4 py-8 text-center lg:transform hover:scale-110 hover:shadow-lg transition-transform duration-200">
                                            <p className="mt-2">Fecha</p>
                                            <div className="text-primary mt-1 text-xl leading-none">{new Date(this.state.fields.fecha).toLocaleDateString()}</div>
                                        </div>
                                    </div>
                                    <div className="lg:w-1/3 lg:px-4 pt-5 lg:pt-0">
                                        <div
                                            className="card px-4 py-8 text-center lg:transform hover:scale-110 hover:shadow-lg transition-transform duration-200">
                                            <p className="mt-2">Hora</p>
                                            <div className="text-primary mt-1 text-xl leading-none">{new Date(this.state.fields.fecha).toLocaleTimeString()}</div>
                                        </div>
                                    </div>
                                    <div className="lg:w-1/3 lg:px-4 pt-5 lg:pt-0">
                                        <div
                                            className="card px-4 py-8 text-center lg:transform hover:scale-110 hover:shadow-lg transition-transform duration-200">
                                            <p className="mt-2">¿Realizado?</p>
                                            <div className="text-primary mt-1 text-xl leading-none">{this.state.fields.realizado == 1 ? "Sí" : "No"}</div>
                                        </div>
                                    </div>
                                    <div className="lg:w-1/3 lg:px-4 pt-5 lg:pt-0">
                                        <div
                                            className="card px-4 py-8 text-center lg:transform hover:scale-110 hover:shadow-lg transition-transform duration-200">
                                            <p className="mt-2">Iniciativa</p>
                                            <div className="text-primary mt-1 text-xl leading-none">{this.state.fields.iniciativa?.nombre || 'Sin iniciativa'}</div>
                                        </div>
                                    </div>
                                    <div className="lg:w-1/3 lg:px-4 pt-5 lg:pt-0">
                                        <div
                                            className="card px-4 py-8 text-center lg:transform hover:scale-110 hover:shadow-lg transition-transform duration-200">
                                            <p className="mt-2">Tipo de actividad</p>
                                            <div className="text-primary mt-1 text-xl leading-none">{this.state.fields.tipo_actividad_id !== 0 && this.state.fields.tipo_actividad_id !== null ?
                                                this.state.fields.tipo_actividad.nombre : "N/D"}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="itemSection">
                                <h3>Proyecto: <a href={`#/${this.state.fields.proyecto ? 'detalle-proyecto-de-ley' : 'detalle-control-politico'}/${this.state.fields.proyecto ? this.state.fields.proyecto_ley_id : this.state.fields.citacion_id}`}
                                >  {this.state.fields.proyecto ? this.state.fields.tituloproyecto : this.state.fields.citaciontitulo} - {this.state.fields.numero_camara !== null ? this.state.fields.numero_camara : "N/D"}</a></h3>
                            </div>

                            <div className="itemSection">
                                <h3>Comisiones asociadas</h3>
                                <div className="autor-list-tags">
                                    {
                                        this.state.fields.agendaComision?.map((item, j) => {
                                            return (
                                                <div key={j} className="item">
                                                    <div className="name">
                                                        <p>{item.comision.nombre || ''}</p>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    }
                                </div>
                            </div>
                            <div className="itemSection">
                                <h3>Descripción</h3>
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
                </main>
            </>
        )
    }
}

export default DetalleOrdenDia;