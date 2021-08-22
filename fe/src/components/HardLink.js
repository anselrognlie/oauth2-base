import { Link, useLocation } from "react-router-dom";

const HardLink = ({ to, children, ...props }) => {
    const location = useLocation();

    const reload = location.pathname === to;

    return (
        reload ? (
            <a href={to} {...props}>{children}</a>
        ) : (
            <Link to={to} {...props}>{children}</Link>
        )
    );
};

export default HardLink;
