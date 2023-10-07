import React from "react";
import SpinnerLogin from "../../../Components/SpinnerLogin";
import Input from "../../../Components/Input";
import Select from "../../../Components/Select";
import ValidForm from "../../../Utils/ValidForm";
import AuthLogin from "../../../Utils/AuthLogin";
import { Link } from "react-router-dom";
import LoginDataService from "../../../Services/Base/General/Login.Service";

const validForm = new ValidForm();
const errorsConst = { email: "", password: "", sucursal_id: 0, message: "" };
const defaultItemSelectSucursal = {
    value: 0,
    label: "Seleccione una sucursal",
};
const fieldsConst = { email: "", password: "" };
const auth = new AuthLogin();

class Login extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            fields: fieldsConst,
            errors: errorsConst,
            loading: false,
            datadefaultItemSelectSucursal: [defaultItemSelectSucursal],
            itemSelectSucursal: Object.assign({}, defaultItemSelectSucursal),
            selectClass: "col-md-12 hidden",
        };

        if (auth.isAuthenticated()) {
            this.props.history.push("/home");
        }
    }

    cleanErrors() {
        let errors = this.state.errors;
        Object.keys(errors).forEach(function (key) {
            errors[key] = "";
        });
        this.setState({ errors: errors });
    }

    loginSubmit = async (e) => {
        e.preventDefault();
        this.setState({ loading: true });
        let errors = this.state.errors;
        let responseData;
        let data = this.state.fields;
        data.tipo_login = 1;

        this.cleanErrors();
        await LoginDataService.create(data)
            .then((response) => {
                responseData = response.data;
                if (Array.isArray(response.data)) {
                    let datadefaultItemSelectSucursalResponse = [
                        defaultItemSelectSucursal,
                    ];
                    let fieldsResponse = this.state.fields;
                    fieldsResponse.sucursal_id = 0;

                    response.data.map((defaultItemSelectSucursal) => {
                        datadefaultItemSelectSucursalResponse.push({
                            value: defaultItemSelectSucursal.sucursal.id,
                            label: defaultItemSelectSucursal.sucursal.nombre,
                        });
                    });
                    this.setState({
                        datadefaultItemSelectSucursal:
                            datadefaultItemSelectSucursalResponse,
                        fields: fieldsResponse,
                        errors: errors,
                        loading: false,
                        selectClass: "col-md-12",
                    });
                } else {
                    auth.handleAuthentication(responseData);
                    this.setState({ errors: errors, loading: false });
                    this.props.history.push("/home");
                }
            })
            .catch((error) => {
                errors = validForm.displayErrors(error.response.data, errors);
                this.setState({ loading: false });
            });
    };

    handlerSucursal = (item) => {
        this.setState((prevState) => ({
            ...prevState,
            itemSelectSucursal: item,
            fields: {
                ...prevState.fields,
                sucursal_id: item.value,
            },
        }));
    };

    render() {
        return (
            <div className="login-container">
                <SpinnerLogin show={this.state.loading} />
                <div className="login-box animated fadeInDown">
                    <div className="login-logo"></div>
                    <div className="login-body">
                        <div className="login-title text-center">
                            <strong>Bienvenido</strong>
                        </div>
                        <p className="text-center mt-45">Inicia sesión</p>
                        <form
                            name="loginform"
                            className="form-horizontal"
                            onSubmit={this.loginSubmit.bind(this)}
                        >
                            <div className="form-group">
                                <Input
                                    divClass="col-md-12 mt-45"
                                    inputName="email"
                                    inputType="text"
                                    inputClass="form-control"
                                    inputplaceholder="Correo o nombre de usuario"
                                    inputValue={this.state.fields["email"]}
                                    inputOnchange={(e) => {
                                        let fields = this.state.fields;
                                        let errors = this.state.errors;
                                        fields = validForm.handleChangeField(
                                            "email",
                                            fields,
                                            e
                                        );
                                        errors = validForm.handleChangeErrors(
                                            "email",
                                            errors,
                                            e
                                        );
                                        this.setState({
                                            fields: fields,
                                            errors: errors,
                                        });
                                    }}
                                    spanClass="error"
                                    spanError={this.state.errors["email"] || ""}
                                />
                            </div>
                            <div className="form-group">
                                <Input
                                    divClass="col-md-12 mt-45"
                                    inputName="password"
                                    inputType="Password"
                                    inputClass="form-control"
                                    inputplaceholder="Contraseña"
                                    inputValue={this.state.fields["password"]}
                                    inputOnchange={(e) => {
                                        let fields = this.state.fields;
                                        let errors = this.state.errors;
                                        fields = validForm.handleChangeField(
                                            "password",
                                            fields,
                                            e
                                        );
                                        errors = validForm.handleChangeErrors(
                                            "password",
                                            errors,
                                            e
                                        );
                                        this.setState({
                                            fields: fields,
                                            errors: errors,
                                        });
                                    }}
                                    spanClass="error"
                                    spanError={
                                        this.state.errors["password"] || ""
                                    }
                                />
                            </div>
                            <div className="form-group">
                                <Select
                                    divClass={this.state.selectClass + " mt-45"}
                                    selectplaceholder="Seleccione"
                                    selectValue={
                                        this.state.itemSelectSucursal || ""
                                    }
                                    selectOnchange={(e) => {
                                        this.handlerSucursal(e);
                                    }}
                                    selectoptions={
                                        this.state.datadefaultItemSelectSucursal
                                    }
                                    selectIsSearchable={true}
                                    selectclassNamePrefix="selectReact__value-container"
                                    spanClass="error"
                                    spanError={
                                        this.state.errors["sucursal_id"] || ""
                                    }
                                />
                            </div>
                            <div className="form-group">
                                <div className="col-md-12">
                                    <button
                                        type="submit"
                                        className="btn btn-success btn-block mt-50 center-block"
                                        style={{ width: "150px" }}
                                    >
                                        Iniciar sesión
                                    </button>
                                    <span className="error">
                                        {this.state.errors["message"]}
                                    </span>
                                </div>
                                {/* <div className="col-md-12">
                                    <Link to="/forget-password" className="btn btn-block mt-50">¿Olvidaste tu contraseña?</Link>
                                </div> */}
                            </div>
                            <p
                                className="text-center mt-50"
                                style={{ marginTop: "75px" }}
                            >
                                {" "}
                                &copy; 2022 Panamá
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}
export default Login;
