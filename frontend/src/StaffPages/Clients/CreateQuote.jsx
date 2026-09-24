import React from "react"
import { History, Sparkles, UserPlus, ArrowRight } from "lucide-react"
import { useNavigate } from "react-router-dom"

export default function CreateQuotePage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 lg:p-12 font-sans selection:bg-fuchsia-500 selection:text-white ">
      <div className="max-w-5xl w-full space-y-16">
        
        {/* HEADER SECTION */}
        <div className="text-center max-w-2xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Manage Your Safari in Seconds
          </h1>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Select your workflow below to build high-converting custom safari itineraries instantly.
          </p>
        </div>



        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* CARD 1: NEW CLIENT */}
          <div
            onClick={() => navigate("/staff/dashboard/create/client/information")}
            className="group relative p-8 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl hover:border-fuchsia-500/50 hover:bg-slate-900/90 transition-all duration-300 cursor-pointer flex flex-col justify-between space-y-6 shadow-xl hover:shadow-fuchsia-500/5"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-fuchsia-500/10 border border-fuchsia-500/20 flex items-center justify-center text-fuchsia-400 group-hover:scale-110 group-hover:bg-fuchsia-500 group-hover:text-white transition-all duration-300">
                <UserPlus className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white group-hover:text-fuchsia-400 transition-colors">
                  New Client Request
                </h2>
                <p className="text-slate-400 text-sm mt-1 leading-relaxed">
                  Enter new traveler details, capture safari preferences, and auto-generate dynamic itineraries.
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800/60 flex items-center justify-between text-xs font-semibold text-slate-400 group-hover:text-slate-200">
              <span className="flex items-center gap-1.5 text-slate-500">
                <span className="w-1.5 h-1.5 rounded-full bg-fuchsia-500" />
                Est. ~3 seconds setup
              </span>
              <span className="inline-flex items-center gap-1 text-fuchsia-400 font-medium group-hover:translate-x-1 transition-transform">
                Start Now <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </div>

          {/* CARD 2: EXISTING CLIENT */}
          <div
            onClick={() => navigate("/staff/dashboard/list/clients/information/")}
            className="group relative p-8 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl hover:border-slate-700 hover:bg-slate-900/90 transition-all duration-300 cursor-pointer flex flex-col justify-between space-y-6 shadow-xl"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 group-hover:scale-110 group-hover:bg-slate-700 group-hover:text-white transition-all duration-300">
                <History className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white group-hover:text-slate-200 transition-colors">
                  Returning Client
                </h2>
                <p className="text-slate-400 text-sm mt-1 leading-relaxed">
                  Select a saved client profile from your database to build a quick trip request or duplicate quotes.
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800/60 flex items-center justify-between text-xs font-semibold text-slate-400 group-hover:text-slate-200">
              <span className="flex items-center gap-1.5 text-slate-500">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
                Instant lookup
              </span>
              <span className="inline-flex items-center gap-1 text-slate-300 font-medium group-hover:translate-x-1 transition-transform">
                Select Profile <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </div>

        </div>

        {/* FOOTER METRIC */}
        <div className="text-center">
          <p className="text-xs text-slate-500 font-medium tracking-wide">
            Your security & simplicity is our  <span className="text-slate-400 font-semibold">priority</span>
          </p>
        </div>

      </div>
    </div>
  )
}