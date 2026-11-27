import { AlertTriangle } from "lucide-react";

/**
 * Red box listing prices the quote needs that nobody has entered yet.
 * SafariGen no longer guesses these (review issue 4), so the quote can't be
 * saved until they're added.
 */
export default function MissingPricesNotice({ missing = [], className = "" }) {
  if (!missing.length) return null;
  return (
    <div
      role="alert"
      className={`relative z-10 border border-[#DC2626]/40 bg-[#FEF2F2] p-4 text-[#7F1D1D] ${className}`}
    >
      <p className="flex items-center gap-2 text-sm font-bold">
        <AlertTriangle className="h-4 w-4 shrink-0 text-[#DC2626]" />
        {missing.length === 1 ? "1 price is missing" : `${missing.length} prices are missing`} — this quote can't be
        saved until {missing.length === 1 ? "it's" : "they're"} added
      </p>
      <ul className="mt-2 space-y-2 text-[13px] leading-snug">
        {missing.map((m, i) => (
          <li key={i} className="border-l-2 border-[#DC2626]/50 pl-3">
            <span className="font-semibold">{m.message}</span>
            {m.fix && <span className="block text-[12px] text-[#991B1B]/80">Add it in: {m.fix}</span>}
          </li>
        ))}
      </ul>
    </div>
  );
}
