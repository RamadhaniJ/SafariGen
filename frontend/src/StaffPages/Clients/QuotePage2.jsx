import React from "react"
import { User, ClipboardList, Compass, Check, MoveLeftIcon } from "lucide-react"
import CreateClientRequestInformationPage from "./AddRequestInfo";
import { useNavigate } from "react-router-dom"


export default function QuoteClientRequestPage() {
    const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 lg:p-12 font-sans selection:bg-fuchsia-500 selection:text-white">
      <div className="max-w-6xl mx-auto space-y-6">
        
        <button
                    type="button"
                    onClick={() => navigate(-1)} // Optional navigation handler
                    className="group inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer"
                    >
        <MoveLeftIcon className="w-4 h-4 text-slate-400 group-hover:text-fuchsia-400 group-hover:-translate-x-1 transition-transform duration-200" />
        <span>Back</span>
         </button>

        {/* STEPPER HEADER */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl shadow-xl">
        
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative">
            
            {/* STEP 1 (ACTIVE / FOCUS) */}


            {/* STEP 2 (UPCOMING) */}
            <div className="flex items-center gap-4 p-3 rounded-xl bg-slate-900/40 border border-slate-800/60 opacity-60">
              <div className="w-10 h-10 rounded-lg bg-slate-800 border border-slate-700 text-slate-400 flex items-center justify-center font-semibold text-sm shrink-0">
                1
              </div>
              <div className="min-w-0">
                <span className="text-[10px] uppercase font-semibold tracking-wider text-slate-500 block">Previous Step</span>
                <h2 className="text-sm font-semibold text-slate-300 truncate"> Client Information</h2>
              </div>
            </div>

            <div className="flex items-center gap-4 p-3 rounded-xl bg-fuchsia-500/10 border border-fuchsia-500/30 shadow-lg shadow-fuchsia-500/5 transition-all">
              <div className="w-10 h-10 rounded-lg bg-fuchsia-500 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-md shadow-fuchsia-500/30">
                2
              </div>
              <div className="min-w-0">
                <span className="text-[10px] uppercase font-bold tracking-wider text-fuchsia-400 block">Current Step</span>
                <h2 className="text-sm font-bold text-white truncate">Safari Preferences</h2>
              </div>
            </div>


            {/* STEP 3 (UPCOMING) */}
            <div className="flex items-center gap-4 p-3 rounded-xl bg-slate-900/40 border border-slate-800/60 opacity-60">
              <div className="w-10 h-10 rounded-lg bg-slate-800 border border-slate-700 text-slate-400 flex items-center justify-center font-semibold text-sm shrink-0">
                3
              </div>
              <div className="min-w-0">
                <span className="text-[10px] uppercase font-semibold tracking-wider text-slate-500 block">Final Step</span>
                <h2 className="text-sm font-semibold text-slate-300 truncate">Preview & Create</h2>
              </div>
            </div>

          </div>
        </div>

        {/* STEP 1 FORM CONTENT */}
        {/* <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl shadow-xl"> */}
          <CreateClientRequestInformationPage />
        {/* </div> */}

      </div>
    </div>
  )
}