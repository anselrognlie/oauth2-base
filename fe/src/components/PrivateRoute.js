import { Redirect, Route } from "react-router-dom";

const PrivateRoute = ({ isLoggedIn, redirectTo, children, ...props }, ) => {
    return (
        <Route {...props}>
            {isLoggedIn ? children : (
                <Redirect to={redirectTo} />
            )}
        </Route>
    )
};

export default PrivateRoute;
