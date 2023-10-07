import React from "react";
import { Route, Redirect } from "react-router-dom";
import HomeLayout from "./HomeLayout";
import AuthLogin from "../../Utils/AuthLogin";

const auth = new AuthLogin();

const RouteLayout = ({ component: Component, ...rest }) => {
    if (auth.isAuthenticated()) {
        return (
            <Route
                {...rest}
                render={(matchProps) => (
                    <HomeLayout>
                        <Component {...matchProps} />
                    </HomeLayout>
                )}
            />
        );
    } else {
        return <Redirect to="/" />;
    }
};

export default RouteLayout;
