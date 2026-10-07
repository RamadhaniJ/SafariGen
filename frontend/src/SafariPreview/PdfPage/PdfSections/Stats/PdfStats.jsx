// ── Stats/PdfStats.jsx ──
import React from "react";

export default function StatCard({ icon, label, value }) {
  return (
    <div className="group relative flex-1 overflow-hidden border border-[#B98B3E]/40 bg-[#F8F4EA] px-4 py-3 shadow-[0_3px_14px_-5px_rgba(0,0,0,0.4)]">
      {/* Gold left rule (gradient) */}
      <div className="absolute inset-y-0 left-0 w-[3px] bg-gradient-to-b from-[#E4C888] via-[#B98B3E] to-[#8A6528]" />

      {/* Top gold hairline */}
      <span className="absolute left-4 right-4 top-0 h-px bg-gradient-to-r from-transparent via-[#B98B3E]/55 to-transparent" />

      {/* Corner flourishes */}
      <span className="absolute right-1.5 top-1.5 h-2 w-2 border-r border-t border-[#B98B3E]/45" />
      <span className="absolute bottom-1.5 right-1.5 h-2 w-2 border-b border-r border-[#B98B3E]/25" />

      {/* Label row */}
      <div className="flex items-center gap-2">
        <span className="flex items-center justify-center text-[#B98B3E] [&>svg]:h-3.5 [&>svg]:w-3.5">
          {icon}
        </span>
        <span className="text-[9px] font-bold uppercase tracking-[0.28em] text-[#0F1A14]/55">
          {label}
        </span>
        <span className="ml-auto h-1 w-1 rotate-45 bg-[#B98B3E]/60" />
      </div>

      {/* Value */}
      <p className="ddw-serif mt-1.5 truncate text-[17px] font-bold leading-tight tracking-tight text-[#0F1A14]">
        {value}
      </p>
    </div>
  );
}