import { Sparkles, Loader2 } from "lucide-react";

export default function GlobalLoader() {
    return (
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-between bg-slate-950/90 backdrop-blur-md text-slate-100 p-8 select-none transition-all duration-500">
            {/* Top Spacer to keep center balance */}
            <div className="w-full max-w-xs h-8" />


            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-fuchsia-600/20 rounded-full blur-[120px] pointer-events-none animate-pulse" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-purple-600/15 rounded-full blur-[90px] pointer-events-none delay-300 animate-pulse" />

            {/* MAIN CENTERPIECE */}
            <div className="relative z-10 flex flex-col items-center text-center space-y-6">
                {/* Brand Avatar with Rotating Pulsing Glow */}
                <div className="relative flex items-center justify-center">
                    {/* Outer Rotating Gradient Ring */}
                    <div className="absolute w-20 h-20 rounded-2xl bg-gradient-to-tr from-fuchsia-600 via-purple-500 to-indigo-500 animate-spin blur-xs opacity-75" />
                    
                    {/* Inner Glass Card */}
                    <div className="relative w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center shadow-2xl shadow-fuchsia-500/30">
                        <span className="text-3xl font-black tracking-tight text-white">
                            Ip<span className="text-fuchsia-500">s</span>
                        </span>
                    </div>
                </div>

                {/* Status Message */}
                <div className="space-y-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300">
                        <Sparkles className="w-3.5 h-3.5 text-fuchsia-400 animate-spin" />
                        <span>Initializing Workspace</span>
                    </div>
                    <p className="text-xs text-slate-500 font-medium">
                        Preparing your travel itineraries...
                    </p>
                </div>

                {/* Animated Shimmer Progress Bar */}
                <div className="w-48 h-1.5 bg-slate-900 border border-slate-800 rounded-full overflow-hidden relative">
                    <div className="absolute inset-y-0 left-0 w-full bg-gradient-to-r from-fuchsia-600 via-purple-500 to-indigo-500 rounded-full -translate-x-full animate-[shimmer_1.5s_infinite]" />
                </div>
            </div>

            {/* FOOTER METRIC */}
            <div className="relative z-10 flex items-center gap-2 text-[11px] text-slate-500 font-medium tracking-wider uppercase">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-fuchsia-500" />
                <span>Encrypted Connection</span>
            </div>
        </div>
    );
}