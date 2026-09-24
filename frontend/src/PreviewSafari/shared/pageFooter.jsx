export default function PageFooter({ pageNumber, tourCode, clientName, company }) {
  return (
    <footer className="mt-12 pt-6 border-t border-[#E0D8C8] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#6B6055] font-sans print:mt-6 print:pt-4">
      {/* Left: Metadata & Client Code */}
      <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-center sm:justify-start">
        <span className="font-semibold text-[#2B2620]">
          {company ? `${company} Safaris Ltd.` : "Safari Adventures"}
        </span>
        <span className="text-[#C4BCAE]">•</span>
        <span>
          Ref: <strong className="text-[#2B2620] font-semibold">{tourCode}</strong>
        </span>
        {clientName && (
          <>
            <span className="text-[#C4BCAE] hidden sm:inline">•</span>
            <span className="truncate max-w-[200px] text-[#5C5247]">{clientName}</span>
          </>
        )}
      </div>

      {/* Right: Page Number Badge */}
      <div className="flex items-center gap-2">
        <div className="px-3 py-1 bg-[#EFE9DC] border border-[#E0D8C8] rounded-full shadow-2xs text-[#2B2620] font-serif font-bold text-xs tracking-wider">
          Page {pageNumber || 9 }
        </div>
      </div>
    </footer>
  );
}