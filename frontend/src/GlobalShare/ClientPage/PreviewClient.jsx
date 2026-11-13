import { useEffect, useState, useContext, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../Apis/api";
import GlobalLoader from "../../Component/Loader";
import { toast } from "react-toastify";
import { AuthenticationContext } from "../../Apis/AuthProvider";
import {
  Edit2, User, Mail, Phone, Globe, Share2, Compass,
  Calendar, MapPin, Users, BedDouble, FileText, Clock,
  ArrowRight, Sparkles, Briefcase
} from "lucide-react";



const InfoRow = ({ icon: Icon, label, value, isBadge = false }) => (
  <div className="flex items-start gap-3 p-3  bg-[#F6F1E7]/60 border border-[#E4DCCB] hover:border-[#E8772E]/40 transition-colors group">
    <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shrink-0 border border-[#E4DCCB] group-hover:bg-[#FCE9DA] transition-colors">
      <Icon className="w-4 h-4 text-[#B34F12]" />
    </div>
    <div className="min-w-0 flex-1">
      <p className="text-[10px] font-bold uppercase tracking-widest text-[#6B6459] mb-0.5">{label}</p>
      {isBadge ? (
        <span className="inline-block text-xs px-2.5 py-1 rounded-lg bg-[#FDF4DD] text-[#7A4E08] font-semibold border border-[#F2B544]/30">
          {value}
        </span>
      ) : (
        <p className="text-sm text-[#0F2A2E] font-semibold truncate">{value || "—"}</p>
      )}
    </div>
  </div>
);

export default function PreviewClientInformationGlobal() {
  const { clientId } = useParams();
  const navigate = useNavigate();
  const { refreshAuth } = useContext(AuthenticationContext);
  

  const [clientInformation, setClientInformation] = useState(null);
  const [loading, setLoading] = useState(true);

  const [userRole, setUserRole] = useState(null);
 
  const navigateHelper = useMemo(()=>{
        if (userRole === "MANAGER") return '/dashboard/manager';
        if (userRole === "STAFF") return '/staff/dashboard';
        return null;
    }, [userRole])



  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        const resp = await api.get(`clients/preview/clients/information/${clientId}/`);
        setClientInformation(resp.data);

        const user = await  refreshAuth();
        if (user?.role === "MANAGER" || user?.role === "STAFF"){
              setUserRole(user.role);
        }else{
            navigate("/", {replace: true});
        }

      } catch (error) {
        const errorMsg = error.response?.data;
        if (errorMsg?.detail){
            toast.error(errorMsg?.detail);
        }else if (errorMsg && typeof errorMsg === "object"){
            Object.entries(errorMsg).forEach(([val, msg])=>{
                const text = Array.isArray(msg) ? msg.join(", ") : String(msg);
                toast.error(`${val} : ${text}`)

            })
        }else{
          toast.error("Failed to load client profile details.");

        }
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
    <div className="min-h-screen bg-[#F6F1E7] text-[#0F2A2E] font-sans antialiased selection:bg-[#E8772E] selection:text-[#0F2A2E] relative overflow-x-hidden">

      {/* Ambient brand washes */}
      <div className="fixed top-0 left-1/4 w-[600px] h-[600px] bg-[#E8772E]/10 blur-[140px] rounded-full pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-[600px] h-[600px] bg-[#F2B544]/12 blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 relative z-10 space-y-8">

        {/* Top Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E4DCCB]">
          <div className="space-y-2">
            <h1 className="text-2xl lg:text-3xl font-bold text-[#0F2A2E] tracking-tight">
              Preview Client Safari Quote
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {clientInformation?.tour_code && (
              <span className="font-mono text-xs px-3 py-1.5  bg-white border border-[#E4DCCB] text-[#B34F12] tracking-wider font-semibold">
                {clientInformation.tour_code}
              </span>
            )}
            <button
              onClick={() => toast.warning("Soon Soon Soon!.")}
              className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-[#FCE9DA] border border-[#E4DCCB] hover:border-[#E8772E]/40 text-[#0F2A2E] font-semibold text-sm  transition-all duration-200 active:scale-95 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8772E]"
            >
              <Edit2 className="w-4 h-4 text-[#B34F12]" />
              <span>Edit Record</span>
            </button>
          </div>
        </div>

        {/* Core Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">

          {/* Left Column: Personal Profile */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white border border-[#E4DCCB] l p-6 shadow-[0_1px_2px_rgba(15,42,46,0.04)]">

              {/* Client Avatar Header */}
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-[#E4DCCB]">
                <div className="relative shrink-0">
                  <div className="absolute inset-0 rounded-full bg-[#E8772E]/25 blur-md" />
                  <div className="relative w-14 h-14 rounded-full bg-[#E8772E] flex items-center justify-center text-[#0F2A2E] font-black text-lg shadow-md shadow-[#E8772E]/25">
                    {clientInformation?.first_name?.[0]}{clientInformation?.last_name?.[0]}
                  </div>
                </div>
                <div className="min-w-0">
                  <h3 className="text-lg font-bold text-[#0F2A2E] truncate">
                    {clientInformation?.salutation ? `${clientInformation.salutation}. ` : ""}
                    {clientInformation?.first_name} {clientInformation?.last_name}
                  </h3>
                  <p className="text-sm text-[#6B6459] font-medium">Client Profile</p>
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
            <div className="bg-white border border-[#E4DCCB] l p-6 lg:p-8 shadow-[0_1px_2px_rgba(15,42,46,0.04)] space-y-8">

              {/* Tour Main Highlight */}
              <div className="flex items-center gap-2 pb-4 border-b border-[#E4DCCB]">
                <div className="w-9 h-9 rounded-full  bg-[#FCE9DA] flex items-center justify-center">
                  <Compass className="w-4 h-4 text-[#B34F12]" />
                </div>
                <h2 className="text-xs font-bold text-[#6B6459] tracking-widest uppercase">
                  Tour Details
                </h2>
              </div>

              <div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-2">
                  <h2 className="text-xl sm:text-2xl font-bold text-[#0F2A2E] tracking-tight leading-snug">
                    {clientInformation?.tour_title || "Untitled Safari Tour"}
                  </h2>
                  {clientInformation?.tour_type && (
                    <span className="shrink-0 text-[10px] font-bold uppercase tracking-widest px-3 py-1 ll bg-[#FDF4DD] text-[#7A4E08] border border-[#F2B544]/30">
                      {clientInformation.tour_type}
                    </span>
                  )}
                </div>
                <p className="text-sm text-[#6B6459]">Overview of the requested itinerary and logistics.</p>
              </div>

              {/* Metrics Ribbon */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 l bg-[#F6F1E7]/60 border border-[#E4DCCB]">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#6B6459] flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#E8772E]" /> Duration
                  </span>
                  <p className="text-lg font-bold text-[#0F2A2E]">
                    {clientInformation?.tour_length ? `${clientInformation.tour_length} Days` : "N/A"}
                  </p>
                  {clientInformation?.tour_length > 1 && (
                    <p className="text-xs text-[#6B6459]">{clientInformation.tour_length - 1} Nights</p>
                  )}
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#6B6459] flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#E8772E]" /> Start Date
                  </span>
                  <p className="text-lg font-bold text-[#0F2A2E]">
                    {clientInformation?.tour_start_date || "TBD"}
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#6B6459] flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5 text-[#E8772E]" /> Destination
                  </span>
                  <div className="flex items-center gap-2 text-sm font-semibold text-[#0F2A2E]">
                    <span className="truncate">{clientInformation?.start_destination || "Start"}</span>
                    <ArrowRight className="w-4 h-4 text-[#B34F12] shrink-0" />
                    <span className="truncate">{clientInformation?.end_destination || "End"}</span>
                  </div>
                </div>
              </div>

              {/* Countries Visited */}
              {countriesList.length > 0 && (
                <div className="space-y-3">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-[#6B6459] flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-[#1D4E68]" /> Countries Visited
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {countriesList.map((country, idx) => (
                      <span
                        key={idx}
                        className="text-xs font-semibold px-3 py-1.5  bg-[#E2EEF4] border border-[#1D4E68]/25 text-[#1D4E68] flex items-center gap-1.5 hover:bg-[#D3E4EC] transition-colors duration-200"
                      >
                        <MapPin className="w-3 h-3" /> {country}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Requirements & Notes */}
              {clientInformation?.request_info && (
                <div className="relative p-4 l bg-[#FDF4DD] border border-[#F2B544]/30">
                  <FileText className="absolute top-4 right-4 w-4 h-4 text-[#7A4E08]/40" />
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#7A4E08] mb-2 flex items-center gap-1.5">
                    Special Instructions
                  </p>
                  <p className="text-sm text-[#0F2A2E] leading-relaxed">
                    {clientInformation.request_info}
                  </p>
                </div>
              )}

              {/* Group Configuration */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-[#E4DCCB]">

                {/* Travellers Section */}
                <div className="space-y-3">
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#6B6459] flex items-center gap-2">
                    <Users className="w-4 h-4 text-[#E8772E]" /> Travellers
                  </h4>
                  {clientInformation?.travellers?.length > 0 ? (
                    <div className="space-y-2">
                      {clientInformation.travellers.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-3 rounded-xl bg-[#F6F1E7]/60 border border-[#E4DCCB] hover:border-[#E8772E]/40 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-[#FCE9DA] flex items-center justify-center">
                              <Users className="w-4 h-4 text-[#B34F12]" />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-[#0F2A2E]">{item.age_category}</p>
                              <p className="text-[11px] text-[#6B6459]">{item.is_resident ? "Resident" : "Non-Resident"}</p>
                            </div>
                          </div>
                          <span className="px-3 py-1 rounded-lg bg-[#FCE9DA] text-[#B34F12] text-xs font-bold font-mono border border-[#E8772E]/25">
                            x{item.number}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-[#6B6459] italic bg-[#F6F1E7]/60 p-3 rounded-xl border border-[#E4DCCB]">
                      No traveler composition details provided.
                    </p>
                  )}
                </div>

                {/* Rooms Section */}
                <div className="space-y-3">
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#6B6459] flex items-center gap-2">
                    <BedDouble className="w-4 h-4 text-[#F2B544]" /> Rooms
                  </h4>
                  {clientInformation?.room_selected?.length > 0 ? (
                    <div className="space-y-2">
                      {clientInformation.room_selected.map((room, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-3 rounded-xl bg-[#F6F1E7]/60 border border-[#E4DCCB] hover:border-[#F2B544]/50 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-[#FDF4DD] flex items-center justify-center">
                              <BedDouble className="w-4 h-4 text-[#7A4E08]" />
                            </div>
                            <p className="text-sm font-bold text-[#0F2A2E]">{room.label}</p>
                          </div>
                          <span className="px-3 py-1 rounded-lg bg-[#FDF4DD] text-[#7A4E08] text-xs font-bold font-mono border border-[#F2B544]/30">
                            x{room.number}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-[#6B6459] italic bg-[#F6F1E7]/60 p-3 rounded-xl border border-[#E4DCCB]">
                      No room allocation details specified.
                    </p>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Final Action Footer */}
        <div className="flex justify-end pt-4 pb-8">
          <button
            onClick={() => navigate(`${navigateHelper}/itinerary/create/${clientId}`)}
            className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#E8772E] text-[#0F2A2E] font-semibold text-sm
                       shadow-lg shadow-[#E8772E]/25 transition-all duration-300
                       hover:bg-[#D4661F] hover:shadow-xl hover:shadow-[#E8772E]/30 hover:-translate-y-0.5
                       active:bg-[#B34F12] active:text-white active:translate-y-0 active:scale-[0.99]
                       overflow-hidden cursor-pointer
                       focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8772E]"
          >
            <Sparkles className="w-4 h-4 relative z-10 transition-transform duration-300 group-hover:rotate-12" />
            <span className="relative z-10">All Clear. Create Safari Quote</span>
            <ArrowRight className="w-4 h-4 relative z-10 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </div>

      </div>
    </div>
  );
}