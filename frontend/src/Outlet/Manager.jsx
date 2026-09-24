import { Outlet } from "react-router-dom";
import ManagerSideBar from "../SideBars/ManagerSB";


export default function ManagerOutlets() {
    return(
        <div className="flex">
            <ManagerSideBar/>
            <div className="flex-1 transition-all duration-300" >
                <main className="pt-2 min-h-screen" >
                    <Outlet/>
                </main>

            </div>

        </div>
    )
    
}