
// // src/Components/Itinerary/shared/StatCard.jsx
// import React from "react";

// export default function StatCard({ icon, label, value }) {
//   return (
//     <div className="group relative overflow-hidden bg-white/5 backdrop-blur-md rounded-xl p-3.5 border border-white/10 hover:border-emerald-500/30 hover:bg-white/10 transition-all duration-300 shadow-sm hover:shadow-emerald-500/5">
//       {/* Dynamic Glow Background (Unapo-hover) */}
//       <div className="absolute -right-4 -top-4 w-16 h-16 bg-emerald-500/10 rounded-full blur-xl group-hover:bg-emerald-500/20 transition-all duration-500" />

//       <div className="flex items-center gap-2.5 mb-1.5">
//         {/* Icon Container: Ndogo, Nadhifu na ya Kishua */}
//         <div className="p-1.5 bg-emerald-500/10 rounded-md text-emerald-400 group-hover:bg-emerald-500 group-hover:text-slate-950 transition-all duration-300 flex items-center justify-center [&>svg]:w-4 [&>svg]:h-4">
//           {icon}
//         </div>
        
//         {/* Label Text */}
//         <span className="text-emerald-200/70 text-[10px] font-semibold uppercase tracking-widest">
//           {label}
//         </span>
//       </div>

//       {/* Main Value */}
//       <p className="text-white font-bold text-lg md:text-xl tracking-tight pl-0.5">
//         {value}
//       </p>
//     </div>
//   );
// }




// src/Components/Itinerary/shared/StatCard.jsx
import React from "react";

export default function StatCard({ icon, label, value }) {
  return (
    <div className="group relative overflow-hidden bg-slate-900/60 backdrop-blur-md rounded-xl p-3.5 border border-white/10 hover:border-amber-500/30 hover:bg-slate-900/80 transition-all duration-300 shadow-sm hover:shadow-amber-500/5">
      {/* Subtle Warm Amber Glow on Hover */}
      <div className="absolute -right-4 -top-4 w-16 h-16 bg-amber-500/10 rounded-full blur-xl group-hover:bg-amber-500/20 transition-all duration-500" />

      <div className="flex items-center gap-2.5 mb-1.5">
        {/* Icon Container: Soft Amber Accent */}
        <div className="p-1.5 bg-amber-500/10 rounded-md text-amber-400 group-hover:bg-amber-400 group-hover:text-slate-950 transition-all duration-300 flex items-center justify-center [&>svg]:w-4 [&>svg]:h-4">
          {icon}
        </div>
        
        {/* Label Text */}
        <span className="text-amber-200/70 text-[10px] font-semibold uppercase tracking-widest">
          {label}
        </span>
      </div>

      {/* Main Value */}
      <p className="text-white font-bold text-lg md:text-xl tracking-tight pl-0.5">
        {value}
      </p>
    </div>
  );
}



