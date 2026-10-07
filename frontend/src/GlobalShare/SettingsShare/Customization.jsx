import { useState, useRef, useEffect } from "react";
import {
  Quote,
  Upload,
  Image as ImageIcon,
  Trash2,
  Save,
  Loader2,
  Sparkles,
  Check,
  PenTool,
  Eye,
} from "lucide-react";
import { toast } from "sonner";

/* ─────────────────────────────────────────────────────────────
   REPLACE WITH REAL DATA FROM BACKEND LATER
   ───────────────────────────────────────────────────────────── */
const DUMMY_DATA = {
  quote:
    "Every journey with SafariGen is crafted with care — from the first sunrise over the Serengeti to the final sunset on the coast. We hope this itinerary brings you closer to the wild.",
  signatureUrl: null, // e.g. "https://cdn.safarigen.io/signatures/james-smith.png"
};
/* ───────────────────────────────────────────────────────────── */

export default function CustomizationComponentGlobal({ onSave }) {
  // ── Later: fetch from backend and hydrate
  const [quote, setQuote] = useState(DUMMY_DATA.quote);
  const [signatureFile, setSignatureFile] = useState(null);
  const [signaturePreview, setSignaturePreview] = useState(DUMMY_DATA.signatureUrl);
  const [isSaving, setIsSaving] = useState(false);

  const fileInputRef = useRef(null);
  // Cleanup blob URLs on unmount to avoid memory leaks
  useEffect(() => {
    return () => {
      if (signaturePreview && signaturePreview.startsWith("blob:")) {
        URL.revokeObjectURL(signaturePreview);
      }
    };
  }, [signaturePreview]);

  /* ── Signature upload ── */
  const handleSignatureUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type
    const validTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp", "image/svg+xml"];
    if (!validTypes.includes(file.type)) {
      toast.error("Please upload a PNG, JPG, WEBP, or SVG file.");
      return;
    }

    // Validate size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Signature must be under 2 MB.");
      return;
    }

    // Clean up previous blob URL
    if (signaturePreview && signaturePreview.startsWith("blob:")) {
      URL.revokeObjectURL(signaturePreview);
    }

    setSignatureFile(file);
    setSignaturePreview(URL.createObjectURL(file));
    toast.success("Signature uploaded");
  };

  const handleRemoveSignature = () => {
    if (signaturePreview && signaturePreview.startsWith("blob:")) {
      URL.revokeObjectURL(signaturePreview);
    }
    setSignatureFile(null);
    setSignaturePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    toast.info("Signature removed");
  };

  /* ── Save ── */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!quote.trim() && !signatureFile && !DUMMY_DATA.signatureUrl) {
      toast.error("Add a quote or signature before saving.");
      return;
    }

    setIsSaving(true);
    try {
      // Later: replace with real API call
      // const formData = new FormData();
      // formData.append("quote", quote);
      // if (signatureFile) formData.append("signature", signatureFile);
      // await api.post("staff/customization/", formData);

      await new Promise((res) => setTimeout(res, 800)); // simulated save

      if (onSave) onSave({ quote, signatureFile, signaturePreview });
      toast.success("Customization saved successfully");
    } catch (err) {
      toast.error("Failed to save. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F1E7] text-[#0F2A2E] font-sans selection:bg-[#E8772E] selection:text-[#0F2A2E] relative overflow-x-hidden">

      {/* Ambient brand washes */}
      <div className="pointer-events-none fixed -top-40 -right-40 w-[520px] h-[520px] bg-[#E8772E]/10 blur-[150px] rounded-full" />
      <div className="pointer-events-none fixed -bottom-40 -left-40 w-[520px] h-[520px] bg-[#F2B544]/12 blur-[150px] rounded-full" />

      <div className="max-w-3xl relative z-10 space-y-8">

        {/* ── Header ── */}
        <div className="space-y-3">

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0F2A2E]">
            Personalize your itinerary
          </h1>
          <p className="text-sm text-[#6B6459] max-w-lg leading-relaxed">
            Add a personal quote and signature that will appear on client-facing
            itineraries and PDF exports.
          </p>
        </div>

        {/* ── Form ── */}
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* ── Quote card ── */}
          <div className="bg-white border border-[#E4DCCB] rounded-2xl p-6 shadow-[0_1px_2px_rgba(15,42,46,0.04)] space-y-4">

            {/* Section header */}
            <div className="flex items-start gap-3 pb-4 border-b border-[#E4DCCB]">
              <div className="w-9 h-9 rounded-xl bg-[#FCE9DA] flex items-center justify-center shrink-0">
                <Quote className="w-4 h-4 text-[#B34F12]" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-[#0F2A2E]">Personal quote</h2>
                <p className="text-[11px] text-[#6B6459] mt-0.5">
                  This quote will appear on the guest itinerary.
                </p>
              </div>
            </div>

            {/* Textarea */}
            <div className="relative group">
              <textarea
                rows={4}
                value={quote}
                onChange={(e) => setQuote(e.target.value)}
                maxLength={280}
                placeholder="Write a warm, personal message to your travellers…"
                className="w-full bg-white border border-[#E4DCCB] rounded-xl p-4 pr-14 text-sm text-[#0F2A2E] placeholder:text-[#6B6459]/50
                           focus:outline-none focus:border-[#E8772E] focus:ring-2 focus:ring-[#E8772E]/20
                           transition-all duration-200 resize-none"
              />
              {/* Character counter */}
              <span
                className={`absolute bottom-3 right-4 text-[10px] font-mono font-bold transition-colors ${
                  quote.length > 250 ? "text-[#8E2A1F]" : "text-[#6B6459]/60"
                }`}
              >
                {quote.length}/280
              </span>
            </div>

            {/* Preview hint */}
            {quote.trim() && (
              <div className="flex items-start gap-2 p-3 rounded-xl bg-[#FDF4DD] border border-[#F2B544]/30">
                <Eye className="w-3.5 h-3.5 text-[#7A4E08] shrink-0 mt-0.5" />
                <p className="text-[11px] text-[#7A4E08] leading-relaxed">
                  This message will be shown at the top of every itinerary you generate.
                </p>
              </div>
            )}
          </div>

          {/* ── Signature card ── */}
          <div className="bg-white border border-[#E4DCCB] rounded-2xl p-6 shadow-[0_1px_2px_rgba(15,42,46,0.04)] space-y-4">

            {/* Section header */}
            <div className="flex items-start gap-3 pb-4 border-b border-[#E4DCCB]">
              <div className="w-9 h-9 rounded-xl bg-[#FCE9DA] flex items-center justify-center shrink-0">
                <PenTool className="w-4 h-4 text-[#B34F12]" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-[#0F2A2E]">Signature</h2>
                <p className="text-[11px] text-[#6B6459] mt-0.5">
                  This signature will appear on the guest PDF itinerary.
                </p>
              </div>
            </div>

            {/* Upload area */}
            {!signaturePreview ? (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full flex flex-col items-center justify-center gap-3 p-8 rounded-2xl border-2 border-dashed border-[#E4DCCB] bg-[#F6F1E7]/40
                           hover:border-[#E8772E]/50 hover:bg-[#FCE9DA]/40
                           transition-all duration-200 cursor-pointer
                           focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8772E]"
              >
                <div className="relative">
                  <div className="absolute inset-0 rounded-2xl bg-[#E8772E]/20 blur-md" />
                  <div className="relative w-14 h-14 rounded-2xl bg-[#FCE9DA] border border-[#E8772E]/25 flex items-center justify-center">
                    <Upload className="w-6 h-6 text-[#B34F12]" />
                  </div>
                </div>
                <div className="text-center space-y-1">
                  <p className="text-sm font-bold text-[#0F2A2E]">
                    Click to upload signature
                  </p>
                  <p className="text-[11px] text-[#6B6459]">
                    PNG, JPG, WEBP, or SVG · Max 2 MB
                  </p>
                </div>
              </button>
            ) : (
              <div className="space-y-4">
                {/* Preview */}
                <div className="relative flex items-center justify-center p-6 rounded-2xl bg-[#F6F1E7]/60 border border-[#E4DCCB] min-h-[140px]">
                  <img
                    src={signaturePreview}
                    alt="Signature preview"
                    className="max-h-24 max-w-full object-contain"
                    onError={() => toast.error("Failed to load signature preview")}
                  />
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-[#E4DCCB] text-[#0F2A2E] text-xs font-bold
                               hover:bg-[#F6F1E7] hover:border-[#E8772E]/40 hover:text-[#B34F12]
                               transition-all duration-200 cursor-pointer
                               focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8772E]"
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                    Replace
                  </button>

                  <button
                    type="button"
                    onClick={handleRemoveSignature}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-[#E4DCCB] text-[#6B6459] text-xs font-bold
                               hover:bg-[#FBE5E2] hover:border-[#8E2A1F]/30 hover:text-[#8E2A1F]
                               transition-all duration-200 cursor-pointer
                               focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8772E]"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Remove
                  </button>
                </div>
              </div>
            )}

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/jpg,image/webp,image/svg+xml"
              onChange={handleSignatureUpload}
              className="hidden"
            />
          </div>

          {/* ── Live preview card ── */}
          {(quote.trim() || signaturePreview) && (
            <div className="bg-white border border-[#E4DCCB] rounded-2xl p-6 shadow-[0_1px_2px_rgba(15,42,46,0.04)] space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-[#E4DCCB]">
                <div className="w-8 h-8 rounded-lg bg-[#FCE9DA] flex items-center justify-center">
                  <Sparkles className="w-3.5 h-3.5 text-[#B34F12]" />
                </div>
                <h3 className="text-[11px] font-bold uppercase tracking-widest text-[#0F2A2E]">
                  Live preview
                </h3>
              </div>

              <div className="rounded-xl bg-[#F6F1E7]/60 border border-[#E4DCCB] p-5 space-y-4">
                {quote.trim() && (
                  <p className="text-sm text-[#0F2A2E] italic leading-relaxed">
                    "{quote}"
                  </p>
                )}

                {signaturePreview && (
                  <div className="pt-3 border-t border-[#E4DCCB]">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#6B6459] mb-2">
                      Signed by
                    </p>
                    <img
                      src={signaturePreview}
                      alt="Signature"
                      className="max-h-16 object-contain"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── Save button ── */}
          <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
            <button
              type="submit"
              disabled={isSaving}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-[#E8772E] text-[#0F2A2E] text-sm font-bold
                         shadow-lg shadow-[#E8772E]/25 transition-all duration-300
                         hover:bg-[#D4661F] hover:shadow-xl hover:shadow-[#E8772E]/30 hover:-translate-y-0.5
                         active:bg-[#B34F12] active:text-white active:translate-y-0 active:scale-[0.99]
                         disabled:bg-[#E9E3D6] disabled:text-[#A39C8F] disabled:shadow-none disabled:translate-y-0 disabled:cursor-not-allowed disabled:hover:bg-[#E9E3D6]
                         focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8772E]"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving changes...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save customization
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}