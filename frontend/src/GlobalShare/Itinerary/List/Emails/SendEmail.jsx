 import { useState, useEffect } from "react";
 import { Mail, X, Loader2, Send, MessageSquare, Check } from "lucide-react";
 import api from "../../../../Apis/api";
//  import { toast } from "sonner";
 import { toast } from "react-toastify";
 import { EmailEditorWrapper } from "./RichEditor";
//  import {useSnackbar} from 'notistack' 
  
 export default function SendEmailToClientGlobalPopUp({
   client_id, version_id, client_name, tour_title, version_number, company_name,
  tour_code, grand_total, price_per_person,
   onClose, onSuccess,
 }) {
   const [channels, setChannels] = useState([]);
   const [selectedChannelId, setSelectedChannelId] = useState("");
   const [templates, setTemplates] = useState([]);
   const [selectedTemplateId, setSelectedTemplateId] = useState("");
   const [isLoading, setIsLoading] = useState(true);
 
   const [subject, setSubject] = useState("");
   const [emailBody, setEmailBody] = useState("");
   const [isSending, setIsSending] = useState(false);


 
   useEffect(() => {
     const onKey = (e) => { if (e.key === "Escape" && !isSending) onClose(); };
     window.addEventListener("keydown", onKey);
     return () => window.removeEventListener("keydown", onKey);
   }, [onClose, isSending]);
 
   useEffect(() => {
     const fetchData = async () => {
       try {
         const [channelsRes, templatesRes] = await Promise.all([
           api.get("communications/list-channels/"),
           api.get("communications/list/templates/"),
         ]);
         setChannels(channelsRes.data);
         setTemplates(templatesRes.data);

         if (channelsRes.data.length > 0){
          const emailChannel = 
          channelsRes.data.find((c)=> c.name?.toUpperCase() === "EMAIL") || channelsRes.data[0];
          setSelectedChannelId(emailChannel.id);
         }
 
        
 
         if (templatesRes.data.length > 0) {
           const first = templatesRes.data[0];
           setSelectedTemplateId(first.id);
 
           setSubject(replacePlaceholders(first.subject));
           // FIX 1: Call replacePlaceholders here!
           setEmailBody(replacePlaceholders(first.body_html)); 
         }
       } catch (error) {
        const data = error.response?.data;
        if (data?.detail) {
          toast.error(data.detail);
        } else if (data && typeof data === "object") {
          Object.entries(data).forEach(([field, msgs]) => {
            const text = Array.isArray(msgs) ? msgs.join(", ") : String(msgs);
            toast.error(`${field}: ${text}`);
          });
        } else {
          toast.error("Something went wrong. Please try again.");
        }
       } finally {
         setIsLoading(false);
       }
     };
     fetchData();
   }, []);
 
   // FIX 2: Accept templateId directly, not the event object
   const handleSelectedTemplate = (templateId) => {
     setSelectedTemplateId(templateId);
     const selected = templates.find((t) => t.id === templateId);
     if (selected) {
       setSubject(replacePlaceholders(selected.subject));
       setEmailBody(replacePlaceholders(selected.body_html)); 
     }
   };


  const formatMoney = (value) => {
    const n = Number(value);
    if (!Number.isFinite(n)) return "0.00";
    return n.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };


   const replacePlaceholders = (htmlString) => {
     if (!htmlString) return "";
     const safeClientName = client_name || "Valued Guest";
     const safeTourTitle = tour_title || "Your Safari";
     const safeCompanyName = company_name || "Our Safari Team";
     const previewLink = `${window.location.origin}/preview/safari/itinerary/${client_id}/${version_id}`;
     
     return htmlString
       .replace(/\{\{client_name\}\}/g, safeClientName)
       .replace(/\{\{tour_title\}\}/g, safeTourTitle)
       .replace(/\{\{company_name\}\}/g, safeCompanyName)
       .replace(/\{\{preview_link\}\}/g, previewLink)
       .replace(/\{\{tour_code\}\}/g,   tour_code   || "SAF-0000")
       .replace(/\{\{grand_total\}\}/g, formatMoney(grand_total))
       .replace(/\{\{price_per_person\}\}/g, formatMoney(price_per_person))

   };
 
   const handleSubmit = async (e) => {
     e.preventDefault();
     if (!selectedChannelId || !selectedTemplateId) {
         toast.error("Please select a valid channel and template.");
       return;
     }
     setIsSending(true);
     try {
       const previewLink = `${window.location.origin}/preview/safari/itinerary/${client_id}/${version_id}`;
       const payload = {
         template_id: selectedTemplateId,
         channel_id: selectedChannelId,
         subject,
         body_html: emailBody,
         preview_link: previewLink,
       };
       await api.post(`communications/send-email/quote/${client_id}/${version_id}/`, payload);
        toast.success("Email sent successfully!");
       onSuccess(); 
     } catch (error) {
        const data = error.response?.data;
 
        if (data?.detail) {
          toast.error(data.detail);
        } else if (data && typeof data === "object") {
          Object.entries(data).forEach(([field, msgs]) => {
            const text = Array.isArray(msgs) ? msgs.join(", ") : String(msgs);
            toast.error(`${field}: ${text}`);
          });
        } else {
          toast.error("Something went wrong. Please try again.");
        }
      } finally {
       setIsSending(false);
     } 
   };
 


   return (
    <>
      <style>{`
        @keyframes lux-fade-in { from { opacity: 0 } to { opacity: 1 } }
        @keyframes lux-pop-in { 0% { opacity: 0; transform: translateY(14px) scale(.965) } 60% { opacity: 1; transform: translateY(-2px) scale(1.003) } 100% { opacity: 1; transform: translateY(0) scale(1) } }
        @keyframes lux-orb { 0%,100% { transform: translate3d(0,0,0) scale(1); opacity:.55 } 50% { transform: translate3d(6%, -4%,0) scale(1.12); opacity:.85 } }
        @keyframes lux-shimmer { 0% { background-position: -200% 0 } 100% { background-position: 200% 0 } }
        @keyframes lux-pulse-ring { 0% { box-shadow: 0 0 0 0 rgba(232,119,46,.45) } 70% { box-shadow: 0 0 0 8px rgba(232,119,46,0) } 100% { box-shadow: 0 0 0 0 rgba(232,119,46,0) } }
        .lux-scrollbar::-webkit-scrollbar { width: 6px }
        .lux-scrollbar::-webkit-scrollbar-track { background: transparent }
        .lux-scrollbar::-webkit-scrollbar-thumb { background: #e4dccb; border-radius: 999px; }
        .lux-scrollbar::-webkit-scrollbar-thumb:hover { background: #d4c9b0; }
      `}</style>

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ animation: "lux-fade-in .2s ease-out both" }}>
        <div className="absolute inset-0 bg-[#0F2A2E]/75 backdrop-blur-md" onClick={() => !isSending && onClose()} />

        {/* Aurora orbs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-32 left-1/4 h-[400px] w-[400px] rounded-full bg-[#E8772E]/20 blur-[100px]" style={{ animation: "lux-orb 9s ease-in-out infinite" }} />
          <div className="absolute -bottom-32 right-1/4 h-[400px] w-[400px] rounded-full bg-[#F2B544]/20 blur-[100px]" style={{ animation: "lux-orb 11s ease-in-out infinite reverse" }} />
        </div>

        {/* Card */}
        <div className="relative flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-[#E4DCCB] bg-white shadow-[0_20px_60px_-15px_rgba(15,42,46,0.3)] backdrop-blur-xl" style={{ animation: "lux-pop-in .4s cubic-bezier(.16,1,.3,1) both" }}>

          {/* Header */}
          <div className="flex items-start gap-4 border-b border-[#E4DCCB] bg-[#F6F1E7]/50 px-6 py-5">
            <div className="min-w-0 flex-1">
              <h3 className="text-base font-bold text-[#0F2A2E]">Send Itinerary</h3>
              <p className="mt-1 truncate text-sm text-[#6B6459]">
                {tour_title} <span className="mx-1.5 text-[#E4DCCB]">·</span> <span className="font-semibold text-[#0F2A2E]">v{version_number}</span>
              </p>
              <p className="mt-1 text-xs text-[#6B6459]">
                To: <span className="font-semibold text-[#B34F12]">{client_name}</span>
              </p>
            </div>
            <button
              onClick={onClose}
              disabled={isSending}
              className="rounded-lg p-2 text-[#6B6459] transition-colors hover:bg-[#F6F1E7] hover:text-[#0F2A2E] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8772E]"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
            {/* 2-Column Layout */}
            <div className="lux-scrollbar flex-1 overflow-y-auto p-6">
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

                {/* LEFT COLUMN: Settings */}
                <div className="space-y-5 lg:col-span-1">
                  <div>
                    <SectionLabel>Channel</SectionLabel>
                    {channels.map((ch, i)=>(
                      <ChannelCard
                      active={selectedChannelId === ch.id}
                      icon={<Mail className="h-4 w-4"/>}
                      label={ch.name}
                      onClick={() => {
                        setSelectedChannelId(ch.id)
                      }}
                    />
                    ))}
                    
                  </div>

                  <div>
                    <SectionLabel>Template</SectionLabel>
                    <div className="space-y-2 max-h-40 overflow-y-auto pr-1 lux-scrollbar">
                      {isLoading ? (
                        <div className="text-sm text-[#6B6459]">Loading templates...</div>
                      ) : (
                        templates.map((t) => (
                          <button
                            key={t.id}
                            type="button"
                            onClick={() => handleSelectedTemplate(t.id)}
                            className={`w-full text-left rounded-lg border px-3 py-2.5 text-sm font-medium transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8772E] ${
                              selectedTemplateId === t.id
                                ? "border-[#E8772E]/50 bg-[#FCE9DA] text-[#0F2A2E] shadow-sm"
                                : "border-[#E4DCCB] bg-white text-[#6B6459] hover:border-[#E8772E]/30 hover:bg-[#F6F1E7]"
                            }`}
                          >
                            {t.name}
                          </button>
                        ))
                      )}
                    </div>
                  </div>

                  <div>
                    <SectionLabel>Subject</SectionLabel>
                    <input
                      type="text"
                      value={subject} // data zitakuja zikiwa na {{subject}} {{full_name}} so we needed to replace it okay
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full rounded-lg border border-[#E4DCCB] bg-white px-3 py-2.5 text-sm text-[#0F2A2E] placeholder:text-[#6B6459]/50 focus:border-[#E8772E] focus:outline-none focus:ring-2 focus:ring-[#E8772E]/20 transition-all"
                      required
                    />
                  </div>
                </div>

                {/* RIGHT COLUMN: Editor */}
                <div className="flex flex-col lg:col-span-2">
                  <SectionLabel>Message Content</SectionLabel>
                  <div className="group relative flex-1 overflow-hidden rounded-xl border border-[#E4DCCB] bg-white transition-all focus-within:border-[#E8772E]/50 focus-within:ring-2 focus-within:ring-[#E8772E]/15">
                    <EmailEditorWrapper
                      value={emailBody}
                      onChange={setEmailBody} // data zitakuja zikiwa na {{subject}} {{full_name}} so we needed to replace it okay
                      placeholder="Start typing your message to the client…"
                    />
                  </div>
                </div>

              </div>
            </div>

            {/* Footer Actions */}
            <div className="flex items-center justify-between border-t border-[#E4DCCB] bg-[#F6F1E7]/50 px-6 py-4">
              <button
                type="button"
                onClick={onClose}
                disabled={isSending}
                className="rounded-lg border border-[#E4DCCB] bg-white px-4 py-2 text-sm font-semibold text-[#0F2A2E] transition-colors hover:bg-[#F6F1E7] disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8772E]"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSending }
                className="group relative flex items-center gap-2 overflow-hidden rounded-lg bg-[#E8772E] px-6 py-2.5 text-sm font-bold text-[#0F2A2E]
                           shadow-lg shadow-[#E8772E]/25 transition-all
                           hover:bg-[#D4661F] hover:shadow-xl hover:shadow-[#E8772E]/30 hover:-translate-y-0.5
                           active:bg-[#B34F12] active:text-white active:translate-y-0 active:scale-[0.98]
                           disabled:bg-[#E9E3D6] disabled:text-[#A39C8F] disabled:shadow-none disabled:translate-y-0 disabled:cursor-not-allowed disabled:hover:bg-[#E9E3D6]
                           focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8772E]"
              >
                {isSending ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /> Sending…</>
                ) : (
                  <>
                    <Send className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    Send to client
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

function SectionLabel({ children }) {
  return (
    <label className="block text-[11px] font-bold uppercase tracking-widest text-[#6B6459] mb-2">
      {children}
    </label>
  );
}

function ChannelCard({ active, icon, label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group flex w-full items-center gap-3 rounded-xl border p-3 text-left transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8772E] ${
        active
          ? "border-[#E8772E]/50 bg-[#FCE9DA] shadow-sm"
          : "border-[#E4DCCB] bg-white hover:border-[#E8772E]/30 hover:bg-[#F6F1E7]"
      }`}
    >
      <span
        className={`flex h-8 w-8 items-center justify-center rounded-lg ${
          active ? "bg-[#E8772E] text-[#0F2A2E]" : "bg-[#F6F1E7] text-[#6B6459]"
        }`}
      >
        {icon}
      </span>
      <span className="flex-1 text-sm font-semibold text-[#0F2A2E]">{label}</span>
      {active && <Check className="h-4 w-4 text-[#B34F12]" />}
    </button>
  );
}
