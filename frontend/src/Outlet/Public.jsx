import { Outlet } from "react-router-dom";
import TopNavigationBar from "../Navigations/TopNavigation";


export default function PublicOutlets() {
    return(
        <div className=" flex flex-col min-h-screen bg-slate-950">
            <TopNavigationBar/>
            <div className="flex-1 w-full" >
                <main>
                    <Outlet/>
                </main>

            </div>

        </div>
    )
    
}