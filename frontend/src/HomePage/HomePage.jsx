import { useNavigate } from "react-router-dom";
import { 
    Zap, 
    Sparkles, 
    ShieldCheck, 
    Users, 
    ArrowRight, 
    CheckCircle2, 
    Layers, 
    LayoutDashboard 
} from "lucide-react";

export default function HomePage() {
    const navigate = useNavigate();

    const features = [
        {
            icon: Sparkles,
            title: "Say Goodbye to Manual Entry",
            description: "Stop wasting hours copy-pasting flights, hotels, and activities into messy spreadsheets or text files."
        },
        {
            icon: Zap,
            title: "Built for Speed & Simplicity",
            description: "A lightning-fast, distraction-free workspace designed to transform raw trip data into a polished schedule instantly."
        },
        {
            icon: ShieldCheck,
            title: "Flawless Organization",
            description: "Keep every confirmation code, voucher, and timetable structured cleanly in one centralized hub."
        },
        {
            icon: Users,
            title: "Real-Time Collaboration",
            description: "Multiple team members or travel planners can simultaneously collaborate and update itineraries live."
        },
        {
            icon: Layers,
            title: "Client-Ready Handoffs",
            description: "Instantly turn raw operational inputs into stunning, brandable digital schedules ready for your end users."
        }
    ];

    return (
        <div className="min-h-screen  bg-slate-950 text-slate-100 font-sans selection:bg-fuchsia-500 selection:text-white">
            {/* Background Ambient Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-tr from-fuchsia-600/20 via-purple-600/10 to-transparent blur-3xl pointer-events-none -z-10" />

            {/* HERO SECTION */}
            <section className="relative pt-28 sm:pt-40 pb-16 px-6 max-w-7xl mx-auto text-center">
            

                {/* Main Headline */}
                <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight max-w-4xl mx-auto leading-[1.1] mb-6">
                    Automate Your Itinerary{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 via-purple-400 to-indigo-400">
                        Workflow
                    </span>
                </h1>

                {/* Subtitle */}
                <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed mb-8">
                    Empower your team to input, structure, and dispatch complex trip data automatically. Save dozens of hours every week on manual entry.
                </p>

                {/* Call to Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
                    <button
                        onClick={() => navigate("/register")}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-fuchsia-600 to-purple-600 text-white font-semibold text-sm hover:from-fuchsia-500 hover:to-purple-500 shadow-lg shadow-fuchsia-500/25 transition-all active:scale-95 cursor-pointer"
                    >
                        Book a Demo
                        <ArrowRight className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => navigate("/services")}
                        className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 font-semibold text-sm hover:bg-slate-800 hover:text-white transition-all cursor-pointer"
                    >
                        Explore Features
                    </button>
                </div>

                {/* Hero Showcase Image */}
                <div className="relative rounded-2xl border border-slate-800 bg-slate-900/50 p-2 shadow-2xl backdrop-blur-md max-w-5xl mx-auto overflow-hidden">
                    <img 
                        src="/homepageimage.avif" 
                        className="w-full h-[320px] sm:h-[480px] object-cover rounded-xl opacity-90 hover:opacity-100 transition-opacity" 
                        alt="Platform Preview" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60" />
                </div>
            </section>

            {/* METRICS & STATS SECTION */}
            <section className="py-12 border-y border-slate-800/80 bg-slate-900/30">
                <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-3 gap-8 text-center">
                    <div>
                        <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">1,000+</h3>
                        <p className="text-sm font-medium text-slate-400 mt-1">Happy Travel Managers</p>
                    </div>
                    <div>
                        <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">100+</h3>
                        <p className="text-sm font-medium text-slate-400 mt-1">Global Agencies</p>
                    </div>
                    <div className="col-span-2 md:col-span-1">
                        <h3 className="text-3xl sm:text-4xl font-extrabold text-fuchsia-400 tracking-tight">95%</h3>
                        <p className="text-sm font-medium text-slate-400 mt-1">Hours Saved Weekly</p>
                    </div>
                </div>
            </section>

            {/* FEATURES SECTION */}
            <section className="py-24 px-6 max-w-7xl mx-auto">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-xs font-bold tracking-widest text-fuchsia-400 uppercase mb-3">Why Choose Us</h2>
                    <p className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                        Built for speed, efficiency, and modern travel teams
                    </p>
                </div>

                {/* Feature Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((item, idx) => {
                        const Icon = item.icon;
                        return (
                            <div 
                                key={idx} 
                                className="group p-8 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-fuchsia-500/40 hover:bg-slate-900 transition-all duration-300"
                            >
                                <div className="w-12 h-12 rounded-xl bg-fuchsia-500/10 border border-fuchsia-500/20 flex items-center justify-center text-fuchsia-400 mb-6 group-hover:scale-110 group-hover:bg-fuchsia-500 group-hover:text-white transition-all">
                                    <Icon className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-semibold text-white mb-3">{item.title}</h3>
                                <p className="text-slate-400 text-sm leading-relaxed">{item.description}</p>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* CALL TO ACTION BANNER */}
            <section className="pb-24 px-6 max-w-7xl mx-auto">
                <div className="relative rounded-3xl bg-gradient-to-r from-fuchsia-900/40 via-purple-900/30 to-slate-900 border border-fuchsia-500/30 p-10 sm:p-16 text-center overflow-hidden">
                    <div className="relative z-10 max-w-2xl mx-auto">
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
                            Ready to transform your travel operations?
                        </h2>
                        <p className="text-slate-300 text-base mb-8">
                            Join over 1,000+ travel creators and managers streamlining their daily itineraries.
                        </p>
                        <button
                            onClick={() => navigate("/register")}
                            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white text-slate-950 font-bold text-sm hover:bg-slate-100 transition-all shadow-xl active:scale-95 cursor-pointer"
                        >
                            Start Now — It's Free
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
}