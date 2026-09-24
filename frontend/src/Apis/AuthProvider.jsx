import { createContext, useEffect, useState } from "react";
import api from "./api";
import { replace, useNavigate } from "react-router-dom";


export const AuthenticationContext = createContext();
    

export default function AuthProvider({children}) {
    const [userRole, setUserRole] = useState(null);
    const [email, setEmail] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const [loading, setLoading] = useState(true);
    const navigate = useNavigate

    const authenticator = async ()=>{
        try{
            const resp = await api.get("account/users/isauthenticated")
            if (resp.status === 200){
                setIsAuthenticated(true);
                setUserRole(resp.data.user.role)
                setEmail(resp.data.user.email)


                console.log(".......is pass here? .........")
                console.log("here is a  role ", resp.data.user.role)
                return resp.data.user;

            }
        }catch(error){
            setIsAuthenticated(false);
            setUserRole(null);
            setEmail(null);
        }finally{
            setLoading(false);
        }
    }

    useEffect(()=>{
        authenticator();
    }, []);

    const Logout = async ()=>{
        try{
            const resp = await api.post("account/users/logout")
        }catch(error){
            navigate("/login", {replace: true})
            setIsAuthenticated(false);
            setUserRole(null);
            setEmail(null);
        }

    }
    return(
        <AuthenticationContext.Provider value={{email, userRole, isAuthenticated, Logout, loading, refreshAuth: authenticator}}>
            {children}
        </AuthenticationContext.Provider>
    )
    
}