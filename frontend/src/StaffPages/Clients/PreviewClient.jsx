import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../Apis/api";
import GlobalLoader from "../../Component/Loader";
import { toast } from "sonner";
import { 
  Edit2, User, Mail, Phone, Globe, Share2, Compass, 
  Calendar, MapPin, Users, BedDouble, FileText, Clock, 
  ArrowRight, Sparkles, Briefcase
} from "lucide-react";

// Reusable minimalist data row component for perfect consistency
const InfoRow = ({ icon: Icon, label, value, isBadge = false }) => (
  <div className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors group">
    <Icon className="w-4 h-4 text-slate-500 shrink-0 mt-0.5 group-hover:text-fuchsia-400 transition-colors duration-200" />
    <div className="min-w-0 flex-1">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-0.5">{label}</p>
      {isBadge ? (
        <span className="inline-block text-xs px-2.5 py-1 rounded-lg bg-fuchsia-500/10 text-fuchsia-400 font-medium border border-fuchsia-500/20">
          {value}
        </span>
      ) : (
        <p className="text-sm text-slate-200 font-medium truncate">{value || "—"}</p>
      )}
    </div>
  </div>
);

export default function PreviewAllInformationOfClientPage() {
  const { clientId } = useParams();
  const navigate = useNavigate();

  const [clientInformation, setClientInformation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        const resp = await api.get(`clients/preview/clients/information/${clientId}/`);
        setClientInformation(resp.data);
      } catch (error) {
        const errorMsg = error.response?.data?.detail || "Failed to load client profile details.";
        toast.error(errorMsg);
      } finally {
        setLoading(false);
      }
    };

    if (clientId) fetchAllData();
  }, [clientId]);

  if (loading) {
    return <GlobalLoader />;
  }

  const countriesList = clientInformation?.country_visited
    ? clientInformation.country_visited.split(",").map((c) => c.trim()).filter(Boolean)
    : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-950 to-zinc-950 text-slate-200 font-sans antialiased selection:bg-fuchsia-500/30 selection:text-fuchsia-200 relative overflow-x-hidden">
      
      {/* Subtle Ambient Glows */}
      <div className="fixed top-0 left-1/4 w-[600px] h-[600px] bg-fuchsia-900/10 blur-[140px] rounded-full pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-[600px] h-[600px] bg-indigo-900/10 blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 relative z-10 space-y-8">
        
        {/* Top Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              {/* <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-fuchsia-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-fuchsia-500"></span>
              </span>
              <p className="text-xs font-semibold uppercase tracking-widest text-fuchsia-400">
                Preview Request
              </p> */}
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold text-white tracking-tight">Preview Client Safari Quote</h1>
          </div>

          <div className="flex items-center gap-3">
            {clientInformation?.tour_code && (
              <span className="font-mono text-xs px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-400 tracking-wider">
                {clientInformation.tour_code}
              </span>
            )}
            <button
              onClick={() => toast.warning("Soon Soon Soon!.")}
              className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-slate-200 font-medium text-sm rounded-xl transition-all duration-200 active:scale-95 cursor-pointer"
            >
              <Edit2 className="w-4 h-4" />
              <span>Edit Record</span>
            </button>
          </div>
        </div>

        {/* Core Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          
          {/* Left Column: Personal Profile */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 backdrop-blur-xl shadow-2xl">
              
              {/* Client Avatar Header */}
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-white/5">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-fuchsia-600 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-fuchsia-900/20 shrink-0">
                  {clientInformation?.first_name?.[0]}{clientInformation?.last_name?.[0]}
                </div>
                <div className="min-w-0">
                  <h3 className="text-lg font-semibold text-white truncate">
                    {clientInformation?.salutation ? `${clientInformation.salutation}. ` : ""}
                    {clientInformation?.first_name} {clientInformation?.last_name}
                  </h3>
                  <p className="text-sm text-slate-500 font-medium">Client Profile</p>
                </div>
              </div>

              {/* Personal Details Grid */}
              <div className="space-y-3">
                <InfoRow 
                  icon={User} 
                  label="Full Name" 
                  value={`${clientInformation?.first_name} ${clientInformation?.last_name}`} 
                />
                <InfoRow 
                  icon={Mail} 
                  label="Email Address" 
                  value={clientInformation?.email} 
                />
                <InfoRow 
                  icon={Phone} 
                  label="Phone Number" 
                  value={clientInformation?.phone} 
                />
                <InfoRow 
                  icon={Globe} 
                  label="Country of Origin" 
                  value={clientInformation?.country} 
                />
                <InfoRow 
                  icon={Share2} 
                  label="Lead Source" 
                  value={clientInformation?.source || "Direct"} 
                  isBadge={true}
                />
              </div>
            </div>
          </div>

          {/* Right Column: Tour Details */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 lg:p-8 backdrop-blur-xl shadow-2xl space-y-8">
              
              {/* Tour Main Highlight */}
              <div className="flex items-center gap-2 mb-2 pb-4 border-b border-white/5">
                <Compass className="w-5 h-5 text-fuchsia-400" />
                <h2 className="text-sm font-semibold text-slate-300 tracking-wider uppercase">
                  Tour Details
                </h2>
              </div>

              <div className="mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-2">
                  <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug">
                    {clientInformation?.tour_title || "Untitled Safari Tour"}
                  </h2>
                  {clientInformation?.tour_type && (
                    <span className="shrink-0 text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                      {clientInformation.tour_type}
                    </span>
                  )}
                </div>
                <p className="text-sm text-slate-500">Overview of the requested itinerary and logistics.</p>
              </div>

              {/* Metrics Ribbon */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5">
                <div className="space-y-1">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-fuchsia-400" /> Duration
                  </span>
                  <p className="text-lg font-semibold text-slate-100">
                    {clientInformation?.tour_length ? `${clientInformation.tour_length} Days` : "N/A"}
                  </p>
                  {clientInformation?.tour_length > 1 && (
                    <p className="text-xs text-slate-500">{clientInformation.tour_length - 1} Nights</p>
                  )}
                </div>

                <div className="space-y-1">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-fuchsia-400" /> Start Date
                  </span>
                  <p className="text-lg font-semibold text-slate-100">
                    {clientInformation?.tour_start_date || "TBD"}
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5 text-fuchsia-400" /> Destination
                  </span>
                  <div className="flex items-center gap-2 text-sm font-medium text-slate-200">
                    <span className="truncate">{clientInformation?.start_destination || "Start"}</span>
                    <ArrowRight className="w-4 h-4 text-slate-600 shrink-0" />
                    <span className="truncate">{clientInformation?.end_destination || "End"}</span>
                  </div>
                </div>
              </div>

              {/* Countries Visited */}
              {countriesList.length > 0 && (
                <div className="space-y-3">
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-indigo-400" /> Countries Visited
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {countriesList.map((country, idx) => (
                      <span
                        key={idx}
                        className="text-xs font-medium px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/10 text-slate-300 flex items-center gap-1.5 hover:border-fuchsia-500/30 hover:text-fuchsia-400 transition-colors duration-200"
                      >
                        <MapPin className="w-3 h-3" /> {country}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Requirements & Notes */}
              {clientInformation?.request_info && (
                <div className="relative p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/10">
                  <FileText className="absolute top-4 right-4 w-4 h-4 text-indigo-400/50" />
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-indigo-400 mb-2 flex items-center gap-1.5">
                    Special Instructions
                  </p>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    {clientInformation.request_info}
                  </p>
                </div>
              )}

              {/* Group Configuration */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-white/5">
                
                {/* Travellers Section */}
                <div className="space-y-3">
                  <h4 className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                    <Users className="w-4 h-4 text-fuchsia-400" /> Travellers
                  </h4>
                  {clientInformation?.travellers?.length > 0 ? (
                    <div className="space-y-2">
                      {clientInformation.travellers.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                              <Users className="w-4 h-4 text-slate-400" />
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-slate-200">{item.age_category}</p>
                              <p className="text-[11px] text-slate-500">{item.is_resident ? "Resident" : "Non-Resident"}</p>
                            </div>
                          </div>
                          <span className="px-3 py-1 rounded-lg bg-fuchsia-500/10 text-fuchsia-400 text-xs font-bold font-mono border border-fuchsia-500/20">
                            x{item.number}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500 italic bg-white/[0.02] p-3 rounded-xl border border-white/5">No traveler composition details provided.</p>
                  )}
                </div>

                {/* Rooms Section */}
                <div className="space-y-3">
                  <h4 className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                    <BedDouble className="w-4 h-4 text-indigo-400" /> Room
                  </h4>
                  {clientInformation?.room_selected?.length > 0 ? (
                    <div className="space-y-2">
                      {clientInformation.room_selected.map((room, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                              <BedDouble className="w-4 h-4 text-slate-400" />
                            </div>
                            <p className="text-sm font-semibold text-slate-200">{room.label}</p>
                          </div>
                          <span className="px-3 py-1 rounded-lg bg-indigo-500/10 text-indigo-400 text-xs font-bold font-mono border border-indigo-500/20">
                            x{room.number}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500 italic bg-white/[0.02] p-3 rounded-xl border border-white/5">No room allocation details specified.</p>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>
 
        {/* Final Action Footer */}
        <div className="flex justify-end pt-4 pb-8">
          <button
            onClick={() => navigate(`/staff/dashboard/itinerary/build/page/${clientId}`)}
            className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-fuchsia-600 to-indigo-600 hover:from-fuchsia-500 hover:to-indigo-500 text-white font-semibold text-sm rounded-2xl shadow-xl shadow-fuchsia-900/20 hover:shadow-fuchsia-900/40 transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            <Sparkles className="w-4 h-4 relative z-10 transition-transform duration-300 group-hover:rotate-12" />
            <span className="relative z-10">All Clear. Create Safari Quote</span>
            <ArrowRight className="w-4 h-4 relative z-10 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </div>

      </div>
    </div>
  );
}