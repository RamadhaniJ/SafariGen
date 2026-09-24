import { useState, useEffect } from "react";
import { Mail, X, Loader2, Send, MessageSquare, Check } from "lucide-react";
import api from "../../../Apis/api";
import { toast } from "sonner";
import { EmailEditorWrapper } from "./Editor/textEditor";

export default function SendEmailToClientPopUp({
  client_id, version_id, client_name, tour_title, version_number, company_name = "Our Safari Team",
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

  const isEmailSelected = channels.find((c) => c.id === selectedChannelId)?.name?.toUpperCase() === "EMAIL";

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

        const emailChannel = channelsRes.data.find((ch) => ch.name.toUpperCase() === "EMAIL");
        if (emailChannel) setSelectedChannelId(emailChannel.id);

        if (templatesRes.data.length > 0) {
          const first = templatesRes.data[0];
          setSelectedTemplateId(first.id);

          setSubject(replacePlaceholders(first.subject));
          // FIX 1: Call replacePlaceholders here!
          setEmailBody(replacePlaceholders(first.body_html)); 
        }
      } catch (error) {
        console.error("Failed to fetch data", error);
        toast.error("Failed to load email options");
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
      setEmailBody(replacePlaceholders(selected.body_html)); // FIX 1: Call it here too!
    }
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
      .replace(/\{\{tour_code\}\}/g, "SAF-2024") 
      .replace(/\{\{grand_total\}\}/g, "0.00") 
      .replace(/\{\{preview_link\}\}/g, previewLink)
      .replace(/\{\{custom_note_html\}\}/g, ""); 
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
        edited_body: emailBody,
        preview_link: previewLink,
      };
      await api.post(`communications/send-email/quote/${client_id}/${version_id}/`, payload);
      toast.success("Email sent successfully!");
      onSuccess(); 
    } catch (error) {
      const errorMsg = error.response?.data?.error || error.response?.data?.detail || "Failed to send email.";
      toast.error(errorMsg);
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
        @keyframes lux-pulse-ring { 0% { box-shadow: 0 0 0 0 rgba(217,70,239,.45) } 70% { box-shadow: 0 0 0 8px rgba(217,70,239,0) } 100% { box-shadow: 0 0 0 0 rgba(217,70,239,0) } }
        .lux-scrollbar::-webkit-scrollbar { width: 6px }
        .lux-scrollbar::-webkit-scrollbar-track { background: transparent }
        .lux-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,.1); border-radius: 999px; }
        .lux-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,.2); }
      `}</style>

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ animation: "lux-fade-in .2s ease-out both" }}>
        <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={() => !isSending && onClose()} />
        
        {/* Aurora orbs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-32 left-1/4 h-[400px] w-[400px] rounded-full bg-fuchsia-600/20 blur-[100px]" style={{ animation: "lux-orb 9s ease-in-out infinite" }} />
          <div className="absolute -bottom-32 right-1/4 h-[400px] w-[400px] rounded-full bg-indigo-600/20 blur-[100px]" style={{ animation: "lux-orb 11s ease-in-out infinite reverse" }} />
        </div>

        {/* Card: IMPROVED to be wider for 2-column layout */}
        <div className="relative flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-slate-950/90 shadow-2xl backdrop-blur-xl" style={{ animation: "lux-pop-in .4s cubic-bezier(.16,1,.3,1) both" }}>
          
          {/* Header */}
          <div className="flex items-start gap-4 border-b border-white/[0.06] px-6 py-5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-fuchsia-500 to-indigo-600 shadow-lg shadow-fuchsia-500/20">
              <Mail className="h-5 w-5 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-base font-semibold text-white">Send Itinerary</h3>
              <p className="mt-1 truncate text-sm text-slate-400">
                {tour_title} <span className="mx-1.5 text-slate-600">·</span> <span className="text-slate-300">v{version_number}</span>
              </p>
              <p className="mt-1 text-xs text-slate-500">To: <span className="font-medium text-fuchsia-400">{client_name}</span></p>
            </div>
            <button onClick={onClose} disabled={isSending} className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-white/10 hover:text-white">
              <X className="h-4 w-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
            {/* IMPROVED: 2-Column Layout (Settings Left, Editor Right) */}
            <div className="lux-scrollbar flex-1 overflow-y-auto p-6">
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                
                {/* LEFT COLUMN: Settings */}
                <div className="space-y-5 lg:col-span-1">
                  <div>
                    <SectionLabel>Channel</SectionLabel>
                    <ChannelCard active={isEmailSelected} icon={<Mail className="h-4 w-4" />} label="Email" onClick={() => {
                      const emailCh = channels.find((c) => c.name.toUpperCase() === "EMAIL");
                      if (emailCh) setSelectedChannelId(emailCh.id);
                    }} />
                  </div>

                  <div>
                    <SectionLabel>Template</SectionLabel>
                    <div className="space-y-2 max-h-40 overflow-y-auto pr-1 lux-scrollbar">
                      {isLoading ? (
                        <div className="text-sm text-slate-500">Loading templates...</div>
                      ) : (
                        templates.map((t) => (
                          <button
                            key={t.id}
                            type="button"
                            onClick={() => handleSelectedTemplate(t.id)} // FIXED: Pass ID directly
                            className={`w-full text-left rounded-lg border px-3 py-2.5 text-sm transition-all ${
                              selectedTemplateId === t.id
                                ? "border-fuchsia-500/50 bg-fuchsia-500/10 text-white"
                                : "border-white/5 bg-white/[0.02] text-slate-400 hover:border-white/10 hover:bg-white/[0.04]"
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
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-slate-600 focus:border-fuchsia-500/50 focus:outline-none focus:ring-1 focus:ring-fuchsia-500/20"
                      required
                    />
                  </div>
                </div>

                {/* RIGHT COLUMN: Editor */}
                <div className="flex flex-col lg:col-span-2">
                  <SectionLabel>Message Content</SectionLabel>
                  <div className="group relative flex-1 overflow-hidden rounded-xl border border-white/10 bg-white/[0.02] transition-all focus-within:border-fuchsia-500/40 focus-within:ring-1 focus-within:ring-fuchsia-500/10">
                    <EmailEditorWrapper
                      value={emailBody}
                      onChange={setEmailBody}
                      placeholder="Start typing your message to the client…"
                    />
                  </div>
                </div>

              </div>
            </div>

            {/* Footer Actions */}
            <div className="flex items-center justify-between border-t border-white/[0.06] bg-white/[0.02] px-6 py-4">
              <button type="button" onClick={onClose} disabled={isSending} className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-300 transition-colors hover:bg-white/10 hover:text-white disabled:opacity-50">
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSending || !selectedChannelId}
                className="group relative flex items-center gap-2 overflow-hidden rounded-lg bg-gradient-to-r from-fuchsia-600 to-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-fuchsia-500/25 transition-all hover:brightness-110 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSending ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /> Sending…</>
                ) : (
                  <><Send className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /> Send to Client</>
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
  return <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500">{children}</label>;
}

function ChannelCard({ active, icon, label, onClick }) {
  return (
    <button type="button" onClick={onClick} className={`group flex w-full items-center gap-3 rounded-xl border p-3 text-left transition-all ${active ? "border-fuchsia-500/40 bg-fuchsia-500/10" : "border-white/5 bg-white/[0.02] hover:border-white/10 hover:bg-white/[0.04]"}`}>
      <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${active ? "bg-fuchsia-500/20 text-fuchsia-400" : "bg-white/5 text-slate-500"}`}>{icon}</span>
      <span className="flex-1 text-sm font-medium text-white">{label}</span>
      {active && <Check className="h-4 w-4 text-fuchsia-400" />}
    </button>
  );
}