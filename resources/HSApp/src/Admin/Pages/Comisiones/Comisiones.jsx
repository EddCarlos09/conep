import React from 'react';
import Select from '../../../Components/Select';
import UtilsDataService from "../../../Services/General/Utils.Service";
import ComisionDataService from "../../../Services/Catalogo/Comision.Service";
import ListComisiones from "../../../Components/ListComisiones";
import { Constantes, TypeCombos } from '../../../Constants/Constantes';
import AuthLogin from "../../../Utils/AuthLogin";
const SelectCorporacion = { value: 0, label: 'Seleccione corporacion' };
const SelectTipoComision = { value: 0, label: 'Seleccione tipo comision' };
const SelectCuatrienio = { value: 0, label: 'Seleccione quinquenio' };
const auth = new AuthLogin();
class Comisiones extends React.Component {
    constructor(props) {
        super(props);
        this.tableHandler = this.tableHandler.bind(this);
        this.state = {
            subloader: true,
            tableInfo: {
                data: [],
                totalRows: 0,
                page: 1,
                rows: 8,
                search: '',
            },
            filterCamara: true,
            filterSenado: false,
            selectCorporacion: SelectCorporacion,
            dataSelectCorporacion: [SelectCorporacion],
            selectTipoComision: {},
            dataSelectTipoComision: [SelectTipoComision],
            selectCuatrienio: SelectCuatrienio,
            dataSelectCuatrienio: [SelectCuatrienio]
        }
    }

    async tableHandler(page, rows, search, isDelay) {
        let delayAccion = isDelay ? 1000 : 0;
        let tableInfo = this.state.tableInfo;
        tableInfo.page = page;
        tableInfo.rows = rows;
        tableInfo.search = search;
        if (!isDelay)
            tableInfo.data = [];
        this.setState({ tableInfo: tableInfo });
        if (this.timeout) clearTimeout(this.timeout);
        this.timeout = setTimeout(async function () {
            await this.getAll(this.state.selectTipoComision.value, page, rows, search);
        }.bind(this), delayAccion);
    }

    componentDidMount = async () => {
        await this.getComboTipoComision();
        await this.tableHandler(1, 8, "", false);
    };
    //Combos

    getComboTipoComision = async () => {
        this.setState({ subloader: true });
        let idCorporacion = this.state.filterCamara === true ? 1 : 2;
        await UtilsDataService.getComboTipoComision(idCorporacion)
            .then(response => {
                let combo = [];
                response.data.forEach(i => {
                    combo.push({ value: i.id, label: i.nombre })
                })
                this.state.selectTipoComision = combo[0];
                this.setState({
                    dataSelectTipoComision: combo,
                    subloader: false
                });
            });
    }
    //End combos

    //Metodos

    getAll = async (idTipoComision, page, rows, search) => {
        this.setState({ subloader: true });
        let tableInfo = this.state.tableInfo;
        let idCorporacion = -1;
        await ComisionDataService.getAll(1, idCorporacion, idTipoComision, search, page, rows)
            .then(response => {
                tableInfo["data"] = response.data;
            })
            .catch(e => {
                console.log(e);
            });

        await ComisionDataService.getTotalRecordsComision(1, idCorporacion, idTipoComision, search)
            .then(response => {
                tableInfo["totalRows"] = response.data;
            })
            .catch(e => {
                console.log(e);
            })

        this.setState({
            tableInfo: tableInfo,
            subloader: false
        });
    }
    //End metodos

    handlerTipoComision = async (select) => {
        this.setState({ selectTipoComision: select });
        this.tableHandler(1, 8, "", false);
    }


    render() {
        return (
            <>
                <main className="workspace">
                    <section className="breadcrumb lg:flex items-start">
                        <div>
                            <h1>Comisiones</h1>
                            <ul>
                                <li><a href="#">Página principal</a></li>
                                <li className="divider la la-arrow-right"></li>
                                <li><a href="#">Comisiones</a></li>
                                <li className="divider la la-arrow-right"></li>
                                <li>Listado</li>
                            </ul>
                        </div>
                        <div className="buscador items-center ml-auto mt-5 lg:mt-0 pd-25">
                            <div className="input-group">
                                <input
                                    type="text"
                                    value={this.state.search}
                                    onChange={async (e) => {
                                        this.setState({search: e.target.value});
                                    }}
                                    onKeyUp={async (e) => {
                                        if (e.key === "Enter") {
                                            await this.handlerPagination(this.state.page, this.state.rows, e.target.value);
                                        }
                                    }}
                                    placeholder="Escriba para buscar"
                                    className="form-control"
                                />

                                <span className="input-group-text">
                                    <button
                                        onClick={async () => {
                                            await this.handlerPagination(this.state.page, this.state.rows, this.state.search);
                                        }}
                                        type="button"
                                        className="btn btn_primary uppercase mr-5 mb-5"
                                    >
                                        <span className="icon la la-search"></span>
                                    </button>
                                </span>
                                <span className="input-group-text">
                                    <button
                                        onClick={(e) => {
                                            toggleFilter(e.currentTarget);
                                        }}
                                        type="button"
                                        className="btn btn_secondary uppercase mb-5"
                                    >
                                        <span className="icon la la-filter"></span>
                                    </button>
                                </span>
                            </div>
                            <div className="floatingFilters evenColors">
                                <div className="one-columns relative no-margin">
                                    <div className="item">
                                        <label htmlFor="">Tipo de comisión</label>
                                        <Select
                                            divClass=""
                                            selectplaceholder="Seleccione"
                                            selectValue={this.state.selectTipoComision}
                                            selectOnchange={this.handlerTipoComision}
                                            selectoptions={this.state.dataSelectTipoComision}
                                            selectIsSearchable={true}
                                            selectclassNamePrefix="selectReact__value-container"
                                            spanClass=""
                                            spanError=""
                                        ></Select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                    <div className="relative">
                        <div className={`subloader ${this.state.subloader ? "active" : ""}`}><div className="relative"></div></div>
                        <ListComisiones
                            data={this.state.tableInfo["data"]}
                            handler={this.tableHandler}
                            pageExtends={this.state.tableInfo["page"]}
                            pageSizeExtends={this.state.tableInfo["rows"]}
                            totalRows={this.state.tableInfo["totalRows"]}
                            search={this.state.tableInfo["search"]}
                            defaultImage={Constantes.NoImagen}
                            pathImgOrigen={auth.pathApi()}
                        />
                    </div>
                </main>
            </>
        )
    }
}

function toggleFilter(element) {
    element.parentNode.parentNode.parentNode
        .querySelector(".floatingFilters")
        .classList.toggle("active");
}


export default Comisiones;