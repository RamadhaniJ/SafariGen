import StaffSideBar from "../SideBars/StaffSideBar";
import { Outlet } from "react-router-dom";

export default function StaffOutlets() {
    return(
        <div className="flex">
                 <StaffSideBar/>
                 <div className="flex-1 transition-all duration-300 bg-slate-950" >
                     <main className="pt-2 min-h-screen" >
                         <Outlet/>
                     </main>
     
                 </div>
     
        </div>
    )
    
}