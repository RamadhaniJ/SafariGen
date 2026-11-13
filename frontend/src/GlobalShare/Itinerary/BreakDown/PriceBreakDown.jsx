// import { useState, useEffect } from "react";
// import { 
//   DollarSign, 
//   TrendingUp, 
//   Users, 
//   MapPin, 
//   Building2, 
//   Sparkles, 
//   Utensils, 
//   Bus,
//   Calculator,
//   FileText,
//   ChevronDown,
//   Printer,
//   Save,
//   Calendar,
//   ShieldCheck,
//   Percent,
//   X, 
//   CheckCircle,
//   CheckCircle2Icon
// } from "lucide-react";
// import useItineraryPricingGlobal from "../Hooks/useItineraryPrice";

// export default function SmartPricingBreakdownGlobal({ 
//   dayConfigs, 
//   clientInfo, 
//   officeCommission,       
//   setOfficeCommission,    
//   customCommission,       
//   setCustomCommission,    
//   onClose,                
// }) {
//   const [showDetailedBreakdown, setShowDetailedBreakdown] = useState(false);
//   const pricing = useItineraryPricingGlobal(dayConfigs, clientInfo);

//   // Close modal on ESC key
//   useEffect(() => {
//     const handleKeyDown = (e) => {
//       if (e.key === "Escape" && onClose) onClose();
//     };
//     window.addEventListener("keydown", handleKeyDown);
//     return () => window.removeEventListener("keydown", handleKeyDown);
//   }, [onClose]);

//   // Safe commission calculations
//   const commissionPercentage = officeCommission === "custom" 
//     ? parseFloat(customCommission) || 0 
//     : parseFloat(officeCommission) || 0;

//   const commissionAmount = (pricing.subtotal * commissionPercentage) / 100;
//   const grandTotal = pricing.subtotal + commissionAmount;
//   const perPerson = pricing.totalTravellers > 0 ? grandTotal / pricing.totalTravellers : 0;



//   const handleSaveAndClose = () => {
//     if (onClose) onClose();
//   };

  





// const presetCommissions = ["0", "10", "15", "20", "25", "30", "custom"];

// return ( // i want this pop up to be responsive ?. 
//     <div className="fixed inset-0 z-50 overflow-y-auto bg-[#0F2A2E]/75 backdrop-blur-md animate-in fade-in duration-200 p-4 sm:p-6 md:p-10 flex justify-center items-start sm:items-center print:p-0 print:bg-white">

//       {/* Card wrapper */}
//       <div className="relative w-full max-w-2xl my-auto bg-white border border-[#E4DCCB]  p-6 md:p-8 shadow-[0_20px_60px_-15px_rgba(15,42,46,0.35)] text-[#0F2A2E] space-y-8 print:max-h-none print:shadow-none print:bg-white print:text-black print:border-none">

//         {/* Ambient brand washes */}
//         <div className="pointer-events-none absolute -top-20 -left-20 w-96 h-96 bg-[#E8772E]/10 l blur-3xl" />
//         <div className="pointer-events-none absolute -bottom-20 -right-20 w-96 h-96 bg-[#F2B544]/12 l blur-3xl" />

//         {/* ========================================== */}
//         {/* 1. TOP BAR & TRIP METRICS                  */}
//         {/* ========================================== */}
//         <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E4DCCB] pb-6 relative z-10">
//           <div className="flex items-center gap-4">
//             <div className="w-12 h-12 rounded-2xl bg-[#E8772E]  flex items-center justify-center shadow-md shadow-[#E8772E]/25">
//               <Calculator className="w-6 h-6 text-[#0F2A2E]" />
//             </div>
//             <div>
//               <div className="flex items-center gap-2">
//                 <h2 className="text-xl md:text-2xl font-extrabold text-[#0F2A2E] tracking-tight">Pricing Calculator</h2>
//               </div>
//               <p className="text-xs text-[#6B6459] mt-0.5">Dynamic price modeling, park taxes & margin optimization</p>
//             </div>
//           </div>

//           <div className="flex items-center gap-3">
//             <div className="flex items-center gap-3 bg-[#F6F1E7] border border-[#E4DCCB]  px-4 py-2.5">
//               <div className="flex items-center gap-2 pr-3 border-r border-[#E4DCCB]">
//                 <Users className="w-4 h-4 text-[#E8772E]" />
//                 <div>
//                   <p className="text-[9px] uppercase tracking-widest text-[#6B6459] font-bold">Pax</p>
//                   <p className="text-xs font-bold text-[#0F2A2E]">{pricing.totalTravellers} <span className="text-[#6B6459] font-medium">Paying</span></p>
//                 </div>
//               </div>
//               <div className="flex items-center gap-2 pl-1">
//                 <Calendar className="w-4 h-4 text-[#1E5A3B]" />
//                 <div>
//                   <p className="text-[9px] uppercase tracking-widest text-[#6B6459] font-bold">Duration</p>
//                   <p className="text-xs font-bold text-[#0F2A2E]">{pricing.vehicleDetails?.totalDays || 0} Days</p>
//                 </div>
//               </div>
//             </div>

//             {/* Modal Close Button */}
//             {onClose && (
//               <button
//                 onClick={onClose}
//                 className="w-10 h-10  rounded-2xl bg-white hover:bg-[#F6F1E7] border border-[#E4DCCB] flex items-center justify-center text-[#6B6459] hover:text-[#0F2A2E] transition-all duration-200 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8772E] print:hidden"
//               >
//                 <X className="w-5 h-5" />
//               </button>
//             )}
//           </div>
//         </div>

//         {/* ========================================== */}
//         {/* 2. COST CATEGORIES GRID                    */}
//         {/* ========================================== */}
//         <div className="space-y-3 relative z-10">
//           <h3 className="text-[11px] font-bold uppercase tracking-widest text-[#6B6459]">Core cost components</h3>
//           <div className="grid grid-cols-2 md:grid-cols-3  gap-3">
//             <CostCard icon={MapPin} color="blue" label="Park/Rescue Fees" amount={pricing.subtotals.parkFees} />
//             <CostCard icon={Building2} color="ember" label="Accommodation" amount={pricing.subtotals.accommodationFees} />
//             <CostCard icon={ShieldCheck} color="gold" label="Concession" amount={pricing.subtotals.concessionFees} />
//             <CostCard icon={Sparkles} color="ember" label="Opt. Activities" amount={pricing.subtotals.optionalActivities} />
//             <CostCard icon={Utensils} color="link" label="Opt. Meals" amount={pricing.subtotals.optionalMeals} />
//             <CostCard icon={Bus} color="blue" label="Vehicle Rental" amount={pricing.subtotals.vehicleRental} />
//           </div>
//         </div>

//         {/* ========================================== */}
//         {/* 3. DYNAMIC FLEET CALCULATION HIGHLIGHT     */}
//         {/* ========================================== */}
//         <div className="relative overflow-hidden bg-[#F6F1E7]/60 border border-[#E4DCCB]  p-5 space-y-4">
//           <div className="flex items-center justify-between border-b border-[#E4DCCB] pb-3">
//             <div className="flex items-center gap-2.5">
//               <div className="p-2 rounded-xl bg-[#E2EEF4] border border-[#1D4E68]/20 text-[#1D4E68]">
//                 <Bus className="w-4 h-4" />
//               </div>
//               <div>
//                 <h3 className="text-[11px] font-bold uppercase tracking-widest text-[#0F2A2E]">Land Cruiser Allocation</h3>
//                 <p className="text-[11px] text-[#6B6459] mt-0.5">Automated vehicle scale based on total passenger volume</p>
//               </div>
//             </div>
//             <span className="text-xs font-mono font-bold text-[#1D4E68] bg-white px-3 py-1 rounded-lg border border-[#1D4E68]/20">
//               ${(pricing.vehicleDetails?.totalCost || 0).toFixed(2)}
//             </span>
//           </div>

//           <div className="grid grid-cols-3 gap-3 text-center">
//             <div className="bg-white  p-3 border border-[#E4DCCB]">
//               <p className="text-[10px] uppercase tracking-widest text-[#6B6459] font-bold mb-1">Vehicles</p>
//               <p className="text-xl font-black text-[#1D4E68]">{pricing.vehicleDetails?.vehiclesNeeded || 0}</p>
//               <p className="text-[9px] text-[#6B6459] mt-0.5">Max 6 pax / 4WD</p>
//             </div>

//             <div className="bg-white  p-3 border border-[#E4DCCB]">
//               <p className="text-[10px] uppercase tracking-widest text-[#6B6459] font-bold mb-1">Operating Days</p>
//               <p className="text-xl font-black text-[#1D4E68]">{pricing.vehicleDetails?.totalDays || 0}</p>
//               <p className="text-[9px] text-[#6B6459] mt-0.5">Calculated Route</p>
//             </div>

//             <div className="bg-white  p-3 border border-[#E4DCCB]">
//               <p className="text-[10px] uppercase tracking-widest text-[#6B6459] font-bold mb-1">Daily Rate</p>
//               <p className="text-xl font-black text-[#1D4E68]">${pricing.vehicleDetails?.dailyRate || 0}</p>
//               <p className="text-[9px] text-[#6B6459] mt-0.5">Per Vehicle</p>
//             </div>
//           </div>
//         </div>

//         {/* ========================================== */}
//         {/* 4. DAY-BY-DAY BREAKDOWN ACCORDION          */}
//         {/* ========================================== */}
//         <div className="border border-[#E4DCCB]  overflow-hidden bg-white">
//           <button
//             onClick={() => setShowDetailedBreakdown(!showDetailedBreakdown)}
//             className="w-full bg-[#F6F1E7]/60 hover:bg-[#F6F1E7] p-4 flex items-center justify-between transition-all cursor-pointer group focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#E8772E]"
//           >
//             <span className="text-[11px] font-bold uppercase tracking-widest text-[#0F2A2E] flex items-center gap-2">
//               <FileText className="w-4 h-4 text-[#E8772E]" />
//               {showDetailedBreakdown ? "Hide" : "Show"} Day-by-Day Financial Breakdown
//             </span>
//             <div className={`p-1.5 rounded-xl bg-white border border-[#E4DCCB] text-[#6B6459] group-hover:text-[#B34F12] group-hover:border-[#E8772E]/40 transition-all duration-300 ${showDetailedBreakdown ? 'rotate-180' : ''}`}>
//               <ChevronDown className="w-4 h-4" />
//             </div>
//           </button>

//           {showDetailedBreakdown && (
//             <div className="p-5 space-y-6 border-t border-[#E4DCCB] bg-[#F6F1E7]/30">
//               {pricing.breakdown.length === 0 ? (
//                 <p className="text-center text-xs text-[#6B6459] py-4">No specific itinerary item charges configured yet.</p>
//               ) : (
//                 pricing.breakdown.map((day, index) => (
//                   <div key={index} className="relative pl-4 border-l-2 border-[#E8772E]/40">
//                     <div className="flex items-center gap-2 mb-2.5">
//                       <span className="text-xs font-bold text-[#B34F12]">Day {day.dayIndex}</span>
//                       {day.nights > 1 && (
//                         <span className="text-[9px] font-bold uppercase tracking-widest bg-[#E2EEF4] text-[#1D4E68] px-2 py-0.5 rounded-full border border-[#1D4E68]/20">
//                           {day.nights} Nights
//                         </span>
//                       )}
//                     </div>

//                     <div className="space-y-2">
//                       {day.items.map((item, idx) => (
//                         <div key={idx} className="flex items-center justify-between text-xs py-2.5 px-3.5 rounded-xl bg-white border border-[#E4DCCB] hover:border-[#E8772E]/40 transition-colors">
//                           <div className="min-w-0 pr-3">
//                             <p className="font-semibold text-[#0F2A2E] truncate">{item.label}</p>
//                             <p className="text-[#6B6459] text-[10px] mt-0.5 truncate">{item.description}</p>
//                           </div>
//                           <span className="font-mono font-bold text-[#1E5A3B] shrink-0">
//                             ${item.amount.toFixed(2)}
//                           </span>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 ))
//               )}
//             </div>
//           )}
//         </div>

//         {/* ========================================== */}
//         {/* 5. COMMISSION & TOTAL CALCULATION          */}
//         {/* ========================================== */}
//         <div className="space-y-4">

//           {/* Base Subtotal Bar */}
//           <div className="flex items-center justify-between p-4 bg-white  border border-[#E4DCCB]">
//             <span className="text-[11px] font-bold uppercase tracking-widest text-[#6B6459]">Subtotal (Net Cost)</span>
//             <span className="text-xl font-bold text-[#0F2A2E] font-mono">${pricing.subtotal.toFixed(2)}</span>
//           </div>

//           {/* Segmented Commission Controller */}
//           <div className="bg-[#F6F1E7]/60 border border-[#E4DCCB]  p-5 space-y-4">
//             <div className="flex items-center justify-between">
//               <div className="flex items-center gap-2">
//                 <TrendingUp className="w-4 h-4 text-[#E8772E]" />
//                 <h3 className="text-[11px] font-bold uppercase tracking-widest text-[#0F2A2E]">Agency Commission Margin</h3>
//               </div>
//               <span className="text-xs font-mono font-bold text-[#B34F12]">
//                 +${commissionAmount.toFixed(2)}
//               </span>
//             </div>

//             {/* Segmented Selector Buttons */}
//             <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
//               {presetCommissions.map((val) => {
//                 const isActive = officeCommission === val;
//                 const label = val === "custom" ? "Custom" : `${val}%`;
//                 return (
//                   <button
//                     key={val}
//                     type="button"
//                     onClick={() => setOfficeCommission(val)}
//                     className={`py-2 px-1 text-xs font-bold rounded-xl border transition-all cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8772E] ${
//                       isActive
//                         ? "bg-[#E8772E] text-[#0F2A2E] border-[#E8772E] shadow-md shadow-[#E8772E]/25"
//                         : "bg-white text-[#6B6459] border-[#E4DCCB] hover:bg-[#FCE9DA] hover:text-[#B34F12] hover:border-[#E8772E]/40"
//                     }`}
//                   >
//                     {label}
//                   </button>
//                 );
//               })}
//             </div>

//             {/* Custom Input Field */}
//             {officeCommission === "custom" && (
//               <div className="pt-2 animate-in fade-in slide-in-from-top-2 duration-150">
//                 <div className="relative">
//                   <input
//                     type="number"
//                     min="0"
//                     max="100"
//                     step="0.1"
//                     placeholder="Enter custom percentage (e.g. 22.5)"
//                     value={customCommission}
//                     onChange={(e) => setCustomCommission(e.target.value)}
//                     className="w-full bg-white border border-[#E8772E]/40 rounded-xl px-4 py-2.5 pr-10 text-xs font-semibold text-[#0F2A2E] placeholder:text-[#6B6459]/50 focus:outline-none focus:border-[#E8772E] focus:ring-2 focus:ring-[#E8772E]/20 transition-all"
//                   />
//                   <Percent className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-[#B34F12]" />
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Grand Total Card — dark anchor moment */}
//           <div className="relative overflow-hidden bg-[#0F2A2E] border border-[#E4DCCB]/15  p-6 shadow-[0_20px_50px_-20px_rgba(15,42,46,0.4)]">
//             {/* Ambient glows */}
//             <div className="pointer-events-none absolute -top-24 -left-20 w-56 h-56 bg-[#E8772E]/15 rounded-full blur-3xl" />
//             <div className="pointer-events-none absolute -bottom-24 -right-20 w-56 h-56 bg-[#F2B544]/12 rounded-full blur-3xl" />

//             <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
//               <div className="flex items-center gap-3">
//                 <div className="w-12 h-12 bg-[#E8772E] rounded-2xl flex items-center justify-center shadow-md shadow-[#E8772E]/30">
//                   <DollarSign className="w-6 h-6 text-[#0F2A2E]" />
//                 </div>
//                 <div>
//                   <h3 className="text-lg font-extrabold text-[#F6F1E7] tracking-tight">Client Quoted Price</h3>
//                   <p className="text-xs text-[#F6F1E7]/60 mt-0.5">Net cost + agency commission breakdown</p>
//                 </div>
//               </div>
//               <div className="text-right">
//                 <span className="text-4xl font-black tracking-tight text-[#F2B544]">
//                   ${grandTotal.toFixed(2)}
//                 </span>
//               </div>
//             </div>

//             <div className="relative mt-5 pt-4 border-t border-[#E4DCCB]/15 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
//               <span className="text-xs text-[#F6F1E7]/80 flex items-center gap-2">
//                 <Users className="w-4 h-4 text-[#F2B544]" />
//                 Cost Per Person <span className="text-[#F6F1E7]/50">({pricing.totalTravellers} paying travellers)</span>
//               </span>
//               <span className="text-lg font-extrabold text-[#0F2A2E] bg-[#F2B544] px-4 py-1.5  font-mono">
//                 ${perPerson.toFixed(2)} <span className="text-xs font-bold text-[#0F2A2E]/70">/ pax</span>
//               </span>
//             </div>
//           </div>
//         </div>

//         {/* ========================================== */}
//         {/* 6. MODAL ACTION BUTTONS                    */}
//         {/* ========================================== */}
//         <div className="flex flex-col sm:flex-row gap-3 pt-2 print:hidden relative z-10">

//           <button
//             type="button"
//             onClick={handleSaveAndClose}
//             className="flex-[2] bg-[#E8772E] text-[#0F2A2E]  py-3.5 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all
//                        shadow-lg shadow-[#E8772E]/25
//                        hover:bg-[#D4661F] hover:shadow-xl hover:shadow-[#E8772E]/30 hover:-translate-y-0.5
//                        active:bg-[#B34F12] active:text-white active:translate-y-0 active:scale-[0.99]
//                        cursor-pointer
//                        focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8772E]"
//           >
//             <CheckCircle2Icon className="w-4 h-4" />
//             Close
//           </button>
//         </div>

//       </div>
//     </div>
//   );
// }

// // ==========================================
// // Sub-Component: Compact Cost Card
// // ==========================================
// function CostCard({ icon: Icon, color, label, amount }) {
//   const colorClasses = {
//     ember: "text-[#B34F12] bg-[#FCE9DA] border-[#E8772E]/25",
//     blue:  "text-[#1D4E68] bg-[#E2EEF4] border-[#1D4E68]/25",
//     gold:  "text-[#7A4E08] bg-[#FDF4DD] border-[#F2B544]/30",
//     link:  "text-[#B34F12] bg-[#FCE9DA] border-[#E8772E]/25",
//     green: "text-[#1E5A3B] bg-[#E3F1E8] border-[#1E5A3B]/25",
//     error: "text-[#8E2A1F] bg-[#FBE5E2] border-[#8E2A1F]/25",
//   };

//   return (
//     <div className="bg-white border border-[#E4DCCB]  p-3 hover:border-[#E8772E]/40 hover:shadow-[0_4px_16px_-8px_rgba(232,119,46,0.25)] transition-all duration-200">
//       <div className="flex items-center gap-2 mb-2">
//         <div className={`p-1.5 border ${colorClasses[color] || colorClasses.ember}`}>
//           <Icon className="w-3.5 h-3.5" />
//         </div>
//         <span className="text-[10px] font-bold text-[#6B6459] uppercase tracking-wider truncate">{label}</span>
//       </div>
//       <p className="text-base font-black text-[#0F2A2E] font-mono">
//         ${(amount || 0).toFixed(2)}
//       </p>
//     </div>
//   );
// }





import { useState, useEffect } from "react";
import {
  DollarSign,
  TrendingUp,
  Users,
  MapPin,
  Building2,
  Sparkles,
  Utensils,
  Bus,
  Calculator,
  FileText,
  ChevronDown,
  Calendar,
  ShieldCheck,
  Percent,
  X,
  CheckCircle2Icon,
} from "lucide-react";
import useItineraryPricingGlobal from "../Hooks/useItineraryPrice";

const PRESET_COMMISSIONS = ["0", "10", "15", "20", "25", "30", "custom"];

export default function SmartPricingBreakdownGlobal({
  dayConfigs,
  clientInfo,
  officeCommission,
  setOfficeCommission,
  customCommission,
  setCustomCommission,
  onClose,
}) {
  const [showDetailedBreakdown, setShowDetailedBreakdown] = useState(false);
  const pricing = useItineraryPricingGlobal(dayConfigs, clientInfo);

  // Close modal on ESC key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && onClose) onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // Safe commission calculations
  const commissionPercentage =
    officeCommission === "custom"
      ? parseFloat(customCommission) || 0
      : parseFloat(officeCommission) || 0;

  const commissionAmount = (pricing.subtotal * commissionPercentage) / 100;
  const grandTotal = pricing.subtotal + commissionAmount;
  const perPerson =
    pricing.totalTravellers > 0 ? grandTotal / pricing.totalTravellers : 0;

  const handleSaveAndClose = () => {
    if (onClose) onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Pricing calculator"
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto overscroll-contain bg-[#0F2A2E]/75 p-3 backdrop-blur-md animate-in fade-in duration-200 sm:p-6 md:p-10 print:bg-white print:p-0 print:backdrop-blur-none"
    >
      {/* Card wrapper — my-auto + items-start keeps it centered when it fits
          and top-aligned/scrollable when it doesn't (no clipped top on desktop) */}
      <div className="relative my-auto w-full max-w-2xl overflow-hidden border border-[#E4DCCB] bg-white p-4 text-[#0F2A2E] shadow-[0_20px_60px_-15px_rgba(15,42,46,0.35)] space-y-6 sm:p-6 md:p-8 md:space-y-8 print:my-0 print:max-w-none print:border-none print:bg-white print:text-black print:shadow-none">
        {/* Ambient brand washes (now clipped by overflow-hidden) */}
        <div className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-[#E8772E]/10 blur-3xl sm:h-96 sm:w-96" />
        <div className="pointer-events-none absolute -bottom-20 -right-20 h-72 w-72 rounded-full bg-[#F2B544]/[0.12] blur-3xl sm:h-96 sm:w-96" />

        {/* ========================================== */}
        {/* 1. TOP BAR & TRIP METRICS                  */}
        {/* ========================================== */}
        <div className="relative z-10 flex flex-col gap-4 border-b border-[#E4DCCB] pb-5 sm:pb-6 md:flex-row md:items-center md:justify-between">
          <div className="flex min-w-0 items-center gap-3 sm:gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#E8772E] shadow-md shadow-[#E8772E]/25 sm:h-12 sm:w-12">
              <Calculator className="h-5 w-5 text-[#0F2A2E] sm:h-6 sm:w-6" />
            </div>
            <div className="min-w-0">
              <h2 className="text-lg font-extrabold leading-tight tracking-tight text-[#0F2A2E] sm:text-xl md:text-2xl">
                Pricing Calculator
              </h2>
              <p className="mt-0.5 text-[11px] leading-snug text-[#6B6459] sm:text-xs">
                Dynamic price modeling, park taxes &amp; margin optimization
              </p>
            </div>
          </div>

          <div className="flex w-full items-center gap-3 md:w-auto">
            <div className="flex min-w-0 flex-1 items-center gap-3 border border-[#E4DCCB] bg-[#F6F1E7] px-3 py-2.5 sm:px-4 md:flex-none">
              <div className="flex min-w-0 items-center gap-2 border-r border-[#E4DCCB] pr-3">
                <Users className="h-4 w-4 shrink-0 text-[#E8772E]" />
                <div className="min-w-0">
                  <p className="text-[9px] font-bold uppercase leading-none tracking-widest text-[#6B6459]">
                    Pax
                  </p>
                  <p className="mt-0.5 truncate text-xs font-bold text-[#0F2A2E]">
                    {pricing.totalTravellers}{" "}
                    <span className="font-medium text-[#6B6459]">Paying</span>
                  </p>
                </div>
              </div>
              <div className="flex min-w-0 items-center gap-2 pl-1">
                <Calendar className="h-4 w-4 shrink-0 text-[#1E5A3B]" />
                <div className="min-w-0">
                  <p className="text-[9px] font-bold uppercase leading-none tracking-widest text-[#6B6459]">
                    Duration
                  </p>
                  <p className="mt-0.5 truncate text-xs font-bold text-[#0F2A2E]">
                    {pricing.vehicleDetails?.totalDays || 0} Days
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Close Button */}
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                aria-label="Close pricing calculator"
                className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-2xl border border-[#E4DCCB] bg-white text-[#6B6459] transition-all duration-200 hover:bg-[#F6F1E7] hover:text-[#0F2A2E] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8772E] print:hidden"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>

        {/* ========================================== */}
        {/* 2. COST CATEGORIES GRID                    */}
        {/* ========================================== */}
        <div className="relative z-10 space-y-3">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#6B6459] sm:text-[11px]">
            Core cost components
          </h3>
          <div className="grid grid-cols-2 gap-2.5 sm:gap-3 md:grid-cols-3">
            <CostCard icon={MapPin} color="blue" label="Park/Rescue Fees" amount={pricing.subtotals.parkFees} />
            <CostCard icon={Building2} color="ember" label="Accommodation" amount={pricing.subtotals.accommodationFees} />
            <CostCard icon={ShieldCheck} color="gold" label="Concession" amount={pricing.subtotals.concessionFees} />
            <CostCard icon={Sparkles} color="ember" label="Opt. Activities" amount={pricing.subtotals.optionalActivities} />
            <CostCard icon={Utensils} color="link" label="Opt. Meals" amount={pricing.subtotals.optionalMeals} />
            <CostCard icon={Bus} color="blue" label="Vehicle Rental" amount={pricing.subtotals.vehicleRental} />
          </div>
        </div>

        {/* ========================================== */}
        {/* 3. DYNAMIC FLEET CALCULATION HIGHLIGHT     */}
        {/* ========================================== */}
        <div className="relative z-10 space-y-4 overflow-hidden border border-[#E4DCCB] bg-[#F6F1E7]/60 p-4 sm:p-5">
          <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[#E4DCCB] pb-3">
            <div className="flex min-w-0 items-start gap-2.5">
              <div className="shrink-0 rounded-xl border border-[#1D4E68]/20 bg-[#E2EEF4] p-2 text-[#1D4E68]">
                <Bus className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#0F2A2E] sm:text-[11px]">
                  Land Cruiser Allocation
                </h3>
                <p className="mt-0.5 text-[10px] leading-snug text-[#6B6459] sm:text-[11px]">
                  Automated vehicle scale based on total passenger volume
                </p>
              </div>
            </div>
            <span className="shrink-0 rounded-lg border border-[#1D4E68]/20 bg-white px-2.5 py-1 font-mono text-[11px] font-bold text-[#1D4E68] sm:px-3 sm:text-xs">
              ${(pricing.vehicleDetails?.totalCost || 0).toFixed(2)}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center sm:gap-3">
            <div className="min-w-0 border border-[#E4DCCB] bg-white p-2.5 sm:p-3">
              <p className="mb-1 text-[9px] font-bold uppercase tracking-wider text-[#6B6459] sm:text-[10px] sm:tracking-widest">
                Vehicles
              </p>
              <p className="text-lg font-black text-[#1D4E68] sm:text-xl">
                {pricing.vehicleDetails?.vehiclesNeeded || 0}
              </p>
              <p className="mt-0.5 text-[9px] leading-snug text-[#6B6459]">Max 6 pax / 4WD</p>
            </div>

            <div className="min-w-0 border border-[#E4DCCB] bg-white p-2.5 sm:p-3">
              <p className="mb-1 text-[9px] font-bold uppercase tracking-wider text-[#6B6459] sm:text-[10px] sm:tracking-widest">
                Operating Days
              </p>
              <p className="text-lg font-black text-[#1D4E68] sm:text-xl">
                {pricing.vehicleDetails?.totalDays || 0}
              </p>
              <p className="mt-0.5 text-[9px] leading-snug text-[#6B6459]">Calculated Route</p>
            </div>

            <div className="min-w-0 border border-[#E4DCCB] bg-white p-2.5 sm:p-3">
              <p className="mb-1 text-[9px] font-bold uppercase tracking-wider text-[#6B6459] sm:text-[10px] sm:tracking-widest">
                Daily Rate
              </p>
              <p className="text-lg font-black text-[#1D4E68] sm:text-xl">
                ${pricing.vehicleDetails?.dailyRate || 0}
              </p>
              <p className="mt-0.5 text-[9px] leading-snug text-[#6B6459]">Per Vehicle</p>
            </div>
          </div>
        </div>

        {/* ========================================== */}
        {/* 4. DAY-BY-DAY BREAKDOWN ACCORDION          */}
        {/* ========================================== */}
        <div className="relative z-10 overflow-hidden border border-[#E4DCCB] bg-white">
          <button
            type="button"
            onClick={() => setShowDetailedBreakdown(!showDetailedBreakdown)}
            className="group flex w-full cursor-pointer items-center justify-between gap-3 bg-[#F6F1E7]/60 p-3.5 text-left transition-all hover:bg-[#F6F1E7] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#E8772E] sm:p-4"
          >
            <span className="flex items-center gap-2 text-[10px] font-bold uppercase leading-snug tracking-widest text-[#0F2A2E] sm:text-[11px]">
              <FileText className="h-4 w-4 shrink-0 text-[#E8772E]" />
              {showDetailedBreakdown ? "Hide" : "Show"} Day-by-Day Financial Breakdown
            </span>
            <div
              className={`shrink-0 rounded-xl border border-[#E4DCCB] bg-white p-1.5 text-[#6B6459] transition-all duration-300 group-hover:border-[#E8772E]/40 group-hover:text-[#B34F12] ${
                showDetailedBreakdown ? "rotate-180" : ""
              }`}
            >
              <ChevronDown className="h-4 w-4" />
            </div>
          </button>

          {showDetailedBreakdown && (
            <div className="space-y-5 border-t border-[#E4DCCB] bg-[#F6F1E7]/30 p-4 sm:space-y-6 sm:p-5">
              {pricing.breakdown.length === 0 ? (
                <p className="py-4 text-center text-xs text-[#6B6459]">
                  No specific itinerary item charges configured yet.
                </p>
              ) : (
                pricing.breakdown.map((day, index) => (
                  <div key={index} className="relative border-l-2 border-[#E8772E]/40 pl-3 sm:pl-4">
                    <div className="mb-2.5 flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold text-[#B34F12]">Day {day.dayIndex}</span>
                      {day.nights > 1 && (
                        <span className="rounded-full border border-[#1D4E68]/20 bg-[#E2EEF4] px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest text-[#1D4E68]">
                          {day.nights} Nights
                        </span>
                      )}
                    </div>

                    <div className="space-y-2">
                      {day.items.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between gap-2 rounded-xl border border-[#E4DCCB] bg-white px-3 py-2.5 text-xs transition-colors hover:border-[#E8772E]/40 sm:px-3.5"
                        >
                          <div className="min-w-0 pr-2">
                            <p className="truncate font-semibold text-[#0F2A2E]">{item.label}</p>
                            <p className="mt-0.5 truncate text-[10px] text-[#6B6459]">
                              {item.description}
                            </p>
                          </div>
                          <span className="shrink-0 font-mono font-bold text-[#1E5A3B]">
                            ${item.amount.toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* ========================================== */}
        {/* 5. COMMISSION & TOTAL CALCULATION          */}
        {/* ========================================== */}
        <div className="relative z-10 space-y-4">
          {/* Base Subtotal Bar */}
          <div className="flex items-center justify-between gap-3 border border-[#E4DCCB] bg-white p-3.5 sm:p-4">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#6B6459] sm:text-[11px]">
              Subtotal (Net Cost)
            </span>
            <span className="shrink-0 font-mono text-lg font-bold text-[#0F2A2E] sm:text-xl">
              ${pricing.subtotal.toFixed(2)}
            </span>
          </div>

          {/* Segmented Commission Controller */}
          <div className="space-y-4 border border-[#E4DCCB] bg-[#F6F1E7]/60 p-4 sm:p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex min-w-0 items-center gap-2">
                <TrendingUp className="h-4 w-4 shrink-0 text-[#E8772E]" />
                <h3 className="text-[10px] font-bold uppercase leading-snug tracking-widest text-[#0F2A2E] sm:text-[11px]">
                  Agency Commission Margin
                </h3>
              </div>
              <span className="shrink-0 font-mono text-xs font-bold text-[#B34F12]">
                +${commissionAmount.toFixed(2)}
              </span>
            </div>

            {/* Segmented Selector Buttons */}
            <div className="grid grid-cols-4 gap-1.5 sm:grid-cols-7 sm:gap-2">
              {PRESET_COMMISSIONS.map((val) => {
                const isActive = officeCommission === val;
                const label = val === "custom" ? "Custom" : `${val}%`;
                return (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setOfficeCommission(val)}
                    className={`cursor-pointer rounded-lg border px-1 py-2 text-[11px] font-bold transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8772E] sm:rounded-xl sm:text-xs ${
                      isActive
                        ? "border-[#E8772E] bg-[#E8772E] text-[#0F2A2E] shadow-md shadow-[#E8772E]/25"
                        : "border-[#E4DCCB] bg-white text-[#6B6459] hover:border-[#E8772E]/40 hover:bg-[#FCE9DA] hover:text-[#B34F12]"
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>

            {/* Custom Input Field */}
            {officeCommission === "custom" && (
              <div className="animate-in fade-in slide-in-from-top-2 pt-2 duration-150">
                <div className="relative">
                  <input
                    type="number"
                    inputMode="decimal"
                    min="0"
                    max="100"
                    step="0.1"
                    placeholder="Enter custom percentage (e.g. 22.5)"
                    value={customCommission}
                    onChange={(e) => setCustomCommission(e.target.value)}
                    className="w-full rounded-xl border border-[#E8772E]/40 bg-white px-4 py-2.5 pr-10 text-xs font-semibold text-[#0F2A2E] transition-all placeholder:text-[#6B6459]/50 focus:border-[#E8772E] focus:outline-none focus:ring-2 focus:ring-[#E8772E]/20"
                  />
                  <Percent className="absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#B34F12]" />
                </div>
              </div>
            )}
          </div>

          {/* Grand Total Card — dark anchor moment */}
          <div className="relative overflow-hidden border border-[#E4DCCB]/[0.15] bg-[#0F2A2E] p-5 shadow-[0_20px_50px_-20px_rgba(15,42,46,0.4)] sm:p-6">
            {/* Ambient glows */}
            <div className="pointer-events-none absolute -left-20 -top-24 h-56 w-56 rounded-full bg-[#E8772E]/[0.15] blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -right-20 h-56 w-56 rounded-full bg-[#F2B544]/[0.12] blur-3xl" />

            <div className="relative flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#E8772E] shadow-md shadow-[#E8772E]/30 sm:h-12 sm:w-12">
                  <DollarSign className="h-5 w-5 text-[#0F2A2E] sm:h-6 sm:w-6" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-base font-extrabold leading-tight tracking-tight text-[#F6F1E7] sm:text-lg">
                    Client Quoted Price
                  </h3>
                  <p className="mt-0.5 text-[11px] leading-snug text-[#F6F1E7]/60 sm:text-xs">
                    Net cost + agency commission breakdown
                  </p>
                </div>
              </div>
              <div className="text-left sm:text-right">
                <span className="text-3xl font-black tracking-tight text-[#F2B544] sm:text-4xl">
                  ${grandTotal.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="relative mt-4 flex flex-col justify-between gap-3 border-t border-[#E4DCCB]/[0.15] pt-4 sm:mt-5 sm:flex-row sm:items-center">
              <span className="flex min-w-0 flex-wrap items-center gap-2 text-[11px] leading-snug text-[#F6F1E7]/80 sm:text-xs">
                <Users className="h-4 w-4 shrink-0 text-[#F2B544]" />
                Cost Per Person{" "}
                <span className="text-[#F6F1E7]/50">
                  ({pricing.totalTravellers} paying travellers)
                </span>
              </span>
              <span className="self-start rounded bg-[#F2B544] px-3 py-1.5 text-center font-mono text-sm font-extrabold text-[#0F2A2E] sm:self-auto sm:px-4 sm:text-lg">
                ${perPerson.toFixed(2)}{" "}
                <span className="text-xs font-bold text-[#0F2A2E]/70">/ pax</span>
              </span>
            </div>
          </div>
        </div>

        {/* ========================================== */}
        {/* 6. MODAL ACTION BUTTONS                    */}
        {/* ========================================== */}
        <div className="relative z-10 flex flex-col gap-3 pt-2 sm:flex-row print:hidden">
          <button
            type="button"
            onClick={handleSaveAndClose}
            className="flex flex-[2] cursor-pointer items-center justify-center gap-2 bg-[#E8772E] py-3.5 text-xs font-bold uppercase tracking-widest text-[#0F2A2E] shadow-lg shadow-[#E8772E]/25 transition-all hover:-translate-y-0.5 hover:bg-[#D4661F] hover:shadow-xl hover:shadow-[#E8772E]/30 active:translate-y-0 active:scale-[0.99] active:bg-[#B34F12] active:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8772E]"
          >
            <CheckCircle2Icon className="h-4 w-4" />
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// Sub-Component: Compact Cost Card
// ==========================================
function CostCard({ icon: Icon, color, label, amount }) {
  const colorClasses = {
    ember: "text-[#B34F12] bg-[#FCE9DA] border-[#E8772E]/25",
    blue: "text-[#1D4E68] bg-[#E2EEF4] border-[#1D4E68]/25",
    gold: "text-[#7A4E08] bg-[#FDF4DD] border-[#F2B544]/30",
    link: "text-[#B34F12] bg-[#FCE9DA] border-[#E8772E]/25",
    green: "text-[#1E5A3B] bg-[#E3F1E8] border-[#1E5A3B]/25",
    error: "text-[#8E2A1F] bg-[#FBE5E2] border-[#8E2A1F]/25",
  };

  return (
    <div className="min-w-0 border border-[#E4DCCB] bg-white p-2.5 transition-all duration-200 hover:border-[#E8772E]/40 hover:shadow-[0_4px_16px_-8px_rgba(232,119,46,0.25)] sm:p-3">
      <div className="mb-2 flex items-center gap-2">
        <div className={`shrink-0 rounded border p-1.5 ${colorClasses[color] || colorClasses.ember}`}>
          <Icon className="h-3.5 w-3.5" />
        </div>
        <span
          title={label}
          className="min-w-0 truncate text-[9px] font-bold uppercase tracking-wider text-[#6B6459] sm:text-[10px]"
        >
          {label}
        </span>
      </div>
      <p className="truncate font-mono text-sm font-black text-[#0F2A2E] sm:text-base">
        ${(amount || 0).toFixed(2)}
      </p>
    </div>
  );
}

