import { AuthenticationContext } from "./AuthProvider";
import GlobalLoader from "../Component/Loader";
import { useContext } from "react";
import { Navigate } from "react-router-dom";


export default function AutoRedirectorAuthenticatedUsers({ children }) {

    const { userRole, isAuthenticated, loading} = useContext(AuthenticationContext);

    if (loading){
        return <GlobalLoader/>;
    }

    if (isAuthenticated){

        if (userRole === "MANAGER"){
            return <Navigate to="/dashboard/manager" replace />;
        }

        if (userRole === "STAFF"){
            return <Navigate to="/staff/dashboard" replace />
        }
    }

    return children;
    
}