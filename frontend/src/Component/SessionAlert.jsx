import { AlertTriangle, ShieldAlert, Loader2, X } from "lucide-react";

export default function SessionAlertModal({ isOpen, onClose, type = "expired", title, message }) {
  if (!isOpen) return null;

  const isExpired = type === "expired";
  const isError = type === "error";
  const isLoading = type === "loading";

  // Dynamic colors based on type
  const iconBoxClass = isExpired
    ? "bg-[#FCE9DA] border-[#E8772E]/25 text-[#B34F12]"
    : isError
    ? "bg-[#FBE5E2] border-[#8E2A1F]/25 text-[#8E2A1F]"
    : "bg-blue-50 border-blue-200 text-blue-600";

  const glowClass = isExpired
    ? "bg-[#E8772E]/20"
    : isError
    ? "bg-[#8E2A1F]/20"
    : "bg-blue-400/20";

  const Icon = isExpired ? ShieldAlert : isError ? AlertTriangle : Loader2;
  const buttonText = isExpired ? "Go to Login" : "Okay, Got it";

  return (
    <div className="fixed inset-0 z-[100] bg-[#0F2A2E]/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white border border-[#E4DCCB] p-6 max-w-sm w-full shadow-[0_20px_60px_-15px_rgba(15,42,46,0.3)] space-y-4 animate-in zoom-in-95 duration-200 relative">
        
        {/* Close Button (if not loading) */}
        {!isLoading && (
          <button 
            onClick={onClose} 
            className="absolute top-3 right-3 text-[#6B6459] hover:text-[#0F2A2E] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
               )}

        {/* Icon with Glow Effect */}
        <div className="flex justify-center">
          <div className="relative">
            <div className={`absolute inset-0 blur-md ${glowClass}`} />
            <div className={`relative w-12 h-12 flex items-center justify-center border rounded-full ${iconBoxClass}`}>
              <Icon className={`w-5 h-5 ${isLoading ? "animate-spin" : ""}`} />
            </div>
          </div>
        </div>

        {/* Text Content */}
        <div className="text-center space-y-1.5">
          <h3 className="text-base font-bold text-[#0F2A2E]">{title}</h3>
          <p className="text-xs text-[#6B6459] leading-relaxed">{message}</p>
        </div>

        {/* Action Button */}
        {!isLoading && (
          <button
            onClick={onClose}
            className="w-full mt-2 bg-[#0F2A2E] hover:bg-[#1a3d42] text-white text-sm font-medium py-2.5 rounded-sm transition-colors duration-200 shadow-sm"
          >
            {buttonText}
          </button>
        )}
      </div>
    </div>
  );
}