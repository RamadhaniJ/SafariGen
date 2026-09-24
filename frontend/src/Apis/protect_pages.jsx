import { useContext } from "react";
import { AuthenticationContext } from "./AuthProvider";
import { Navigate } from "react-router-dom";
import GlobalLoader from "../Component/Loader";

export default function ProtectPages({children, allowedRole}) {

    const {userRole, isAuthenticated, loading} = useContext(AuthenticationContext);

    if (loading){
        return <GlobalLoader/>;
    }

    if (!isAuthenticated){
        return <Navigate to="/login" replace />;
    }

    if (allowedRole && allowedRole !== userRole){
        return <Navigate to="/login" replace />
    }

    return children;
    
}