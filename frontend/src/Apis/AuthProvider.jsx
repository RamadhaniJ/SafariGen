import { createContext, useEffect, useState } from "react";
import api, { setSessionExpiredHandler } from "./api";
import { useNavigate } from "react-router-dom";
import SessionAlertModal from "../Component/SessionAlert";
 

export const AuthenticationContext = createContext(); 
    

export default function AuthProvider({children}) {
    const [userRole, setUserRole] = useState(null);
    const [email, setEmail] = useState(null);
    const [fullName, setFullName] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate()
    
    const [showSessionModal, setShowSessionModal] = useState(false);

    const authenticator = async ()=>{
        try{
            const resp = await api.get("account/users/isauthenticated")
            if (resp.status === 200){
                setIsAuthenticated(true);
                setUserRole(resp.data.user.role)
                setEmail(resp.data.user.email)
                setFullName(resp.data.user.full_name)

                return resp.data.user;

            }
        }catch(error){
            setIsAuthenticated(false);
            setUserRole(null);
            setEmail(null);
            setFullName(null);
        }finally{
            setLoading(false);
        }
    }

    useEffect(()=>{
        authenticator();

        setSessionExpiredHandler(()=>{
            setIsAuthenticated(false);
            setShowSessionModal(true);
        });

        return ()=>{
            setSessionExpiredHandler(null);
        };

    }, []);

    const Logout = async ()=>{
        try{
            const resp = await api.post("account/users/logout", {}, { _skipInterceptor: true });
        }catch(error){
           console.log("logout ignore: ", error)

        }finally{
             setIsAuthenticated(false);
            setUserRole(null);
            setEmail(null);
            setFullName(null);
            navigate("/", {replace: true})
        }

    }
    return(
        <AuthenticationContext.Provider value={{email,fullName, userRole, isAuthenticated, Logout, loading, refreshAuth: authenticator}}>
            {children}

            <SessionAlertModal
            isOpen={showSessionModal}
            title="Session Ended"
            message="You have been signed in on another device. For your security, please log in again."
            onClose={()=> {
                setShowSessionModal(false);
                navigate("/", {replace : true});
            }}
             />
        </AuthenticationContext.Provider>
    )
    
}