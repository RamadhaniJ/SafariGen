export default function GlobalLoader() {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-between bg-[#0F2A2E] text-[#F6F1E7] p-8 select-none transition-all duration-500 overflow-hidden">
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] h-[420px] bg-[#E8772E]/20 rounded-full blur-[130px] animate-pulse" />
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] h-[280px] bg-[#F2B544]/15 rounded-full blur-[100px] animate-pulse [animation-delay:300ms]" />

      <div className="w-full max-w-xs h-8" />

      <div className="relative z-10 flex flex-col items-center text-center space-y-8">

        <div className="relative flex items-center justify-center">
          <div className="absolute w-24 h-24 rounded-3xl bg-gradient-to-tr from-[#E8772E] via-[#F2B544] to-[#E8772E] animate-spin blur-[6px] opacity-70" />


          <div className="absolute w-20 h-20 rounded-3xl bg-[#E8772E]/25 blur-xl" />

          <div className="relative w-20 h-20 rounded-3xl bg-[#1C3B40] border border-[#E4DCCB]/15 flex items-center justify-center shadow-2xl shadow-[#E8772E]/30 backdrop-blur-sm">
            <span className="text-4xl font-black tracking-tight text-[#E8772E]">
              Safari<span className="text-[#F6F1E7]">Gen</span>
            </span>
          </div>
        </div>
      </div>

      <div className="relative z-10 flex items-center gap-2 text-[11px] text-[#F6F1E7]/50 font-medium tracking-wider uppercase">
      </div>
    </div>
  );
}