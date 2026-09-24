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
  Printer,
  Save,
  Calendar,
  ShieldCheck,
  Percent,
  X, 
  CheckCircle,
  CheckCircle2Icon
} from "lucide-react";
import useItineraryPricing from './useItineraryPricing';

export default function SmartPricingBreakdown({ 
  dayConfigs, 
  clientInfo, 
  officeCommission,       
  setOfficeCommission,    
  customCommission,       
  setCustomCommission,    
  onClose,                
  onSave 
}) {
  const [showDetailedBreakdown, setShowDetailedBreakdown] = useState(false);
  const pricing = useItineraryPricing(dayConfigs, clientInfo);

  // Close modal on ESC key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && onClose) onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // Safe commission calculations
  const commissionPercentage = officeCommission === "custom" 
    ? parseFloat(customCommission) || 0 
    : parseFloat(officeCommission) || 0;

  const commissionAmount = (pricing.subtotal * commissionPercentage) / 100;
  const grandTotal = pricing.subtotal + commissionAmount;
  const perPerson = pricing.totalTravellers > 0 ? grandTotal / pricing.totalTravellers : 0;

  const handleGeneratePDF = () => {
    window.print();
  };

  const handleSaveAndClose = () => {
    if (onSave) onSave();
    if (onClose) onClose();
  };

  const presetCommissions = ["0", "10", "15", "20", "25", "30", "custom"];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200 p-4 sm:p-6 md:p-10 flex justify-center items-start sm:items-center print:p-0 print:bg-white">
      
      {/* Silicon Valley Card Wrapper */}
      <div className="relative w-full   max-w-5xl my-auto bg-slate-900/95 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-[0_0_80px_rgba(0,0,0,0.8)] text-slate-100 space-y-8 print:max-h-none print:shadow-none print:bg-white print:text-black print:border-none">
        
        {/* Ambient Radial Background Glows */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* ========================================== */}
        {/* 1. TOP BAR & TRIP METRICS                  */}
        {/* ========================================== */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20 border border-indigo-400/30">
              <Calculator className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">Pricing Calculator</h2>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">Dynamic price modeling, park taxes & margin optimization</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-3 bg-slate-950/70 border border-slate-800 rounded-2xl px-4 py-2.5">
              <div className="flex items-center gap-2 pr-3 border-r border-slate-800">
                <Users className="w-4 h-4 text-indigo-400" />
                <div>
                  <p className="text-[9px] uppercase tracking-wider text-slate-500 font-bold">Pax</p>
                  <p className="text-xs font-bold text-white">{pricing.totalTravellers} <span className="text-slate-500 font-normal">Paying</span></p>
                </div>
              </div>
              <div className="flex items-center gap-2 pl-1">
                <Calendar className="w-4 h-4 text-emerald-400" />
                <div>
                  <p className="text-[9px] uppercase tracking-wider text-slate-500 font-bold">Duration</p>
                  <p className="text-xs font-bold text-white">{pricing.vehicleDetails?.totalDays || 0} Days</p>
                </div>
              </div>
            </div>

            {/* Modal Close Button */}
            {onClose && (
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-2xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700/60 flex items-center justify-center text-slate-400 hover:text-white transition-all duration-200 cursor-pointer print:hidden"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* ========================================== */}
        {/* 2. COST CATEGORIES GRID                    */}
        {/* ========================================== */}
        <div className="space-y-3 relative z-10">
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">Core Cost Components</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <CostCard icon={MapPin} color="emerald" label="Park/Rescue Fees" amount={pricing.subtotals.parkFees} />
            <CostCard icon={Building2} color="blue" label="Accommodation" amount={pricing.subtotals.accommodationFees} />
            <CostCard icon={ShieldCheck} color="amber" label="Concession" amount={pricing.subtotals.concessionFees} />
            <CostCard icon={Sparkles} color="purple" label="Opt. Activities" amount={pricing.subtotals.optionalActivities} />
            <CostCard icon={Utensils} color="rose" label="Opt. Meals" amount={pricing.subtotals.optionalMeals} />
            <CostCard icon={Bus} color="cyan" label="Vehicle Rental" amount={pricing.subtotals.vehicleRental} />
          </div>
        </div>

        {/* ========================================== */}
        {/* 3. DYNAMIC FLEET CALCULATION HIGHLIGHT     */}
        {/* ========================================== */}
        <div className="relative overflow-hidden bg-gradient-to-br from-slate-950/90 to-slate-900 border border-cyan-500/20 rounded-2xl p-5 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                <Bus className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-white">Land Cruiser Allocation</h3>
                <p className="text-[11px] text-slate-400">Automated vehicle scale based on total passenger volume</p>
              </div>
            </div>
            <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-lg border border-cyan-500/20">
              ${(pricing.vehicleDetails?.totalCost || 0).toFixed(2)}
            </span>
          </div>
          
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-slate-900/90 rounded-xl p-3 border border-slate-800">
              <p className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold mb-0.5">Vehicles</p>
              <p className="text-xl font-black text-cyan-400">{pricing.vehicleDetails?.vehiclesNeeded || 0}</p>
              <p className="text-[9px] text-slate-500 mt-0.5">Max 6 pax / 4WD</p>
            </div>
            
            <div className="bg-slate-900/90 rounded-xl p-3 border border-slate-800">
              <p className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold mb-0.5">Operating Days</p>
              <p className="text-xl font-black text-cyan-400">{pricing.vehicleDetails?.totalDays || 0}</p>
              <p className="text-[9px] text-slate-500 mt-0.5">Calculated Route</p>
            </div>

            <div className="bg-slate-900/90 rounded-xl p-3 border border-slate-800">
              <p className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold mb-0.5">Daily Rate</p>
              <p className="text-xl font-black text-cyan-400">${pricing.vehicleDetails?.dailyRate || 0}</p>
              <p className="text-[9px] text-slate-500 mt-0.5">Per Vehicle</p>
            </div>
          </div>
        </div>

        {/* ========================================== */}
        {/* 4. DAY-BY-DAY BREAKDOWN ACCORDION          */}
        {/* ========================================== */}
        <div className="border border-slate-800 rounded-2xl overflow-hidden bg-slate-950/40">
          <button
            onClick={() => setShowDetailedBreakdown(!showDetailedBreakdown)}
            className="w-full bg-slate-900/70 hover:bg-slate-800/60 p-4 flex items-center justify-between transition-all cursor-pointer group"
          >
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-400" />
              {showDetailedBreakdown ? "Hide" : "Show"} Day-by-Day Financial Breakdown
            </span>
            <div className={`p-1.5 rounded-xl bg-slate-800 text-slate-400 group-hover:text-white transition-transform duration-300 ${showDetailedBreakdown ? 'rotate-180' : ''}`}>
              <ChevronDown className="w-4 h-4" />
            </div>
          </button>

          {showDetailedBreakdown && (
            <div className="p-5 space-y-6 border-t border-slate-800/80 bg-slate-950/60">
              {pricing.breakdown.length === 0 ? (
                <p className="text-center text-xs text-slate-500 py-4">No specific itinerary item charges configured yet.</p>
              ) : (
                pricing.breakdown.map((day, index) => (
                  <div key={index} className="relative pl-4 border-l-2 border-indigo-500/30">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-bold text-indigo-400">Day {day.dayIndex}</span>
                      {day.nights > 1 && (
                        <span className="text-[9px] bg-indigo-500/10 text-indigo-300 px-2 py-0.5 rounded-full border border-indigo-500/20 font-medium">
                          {day.nights} Nights
                        </span>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      {day.items.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between text-xs py-1.5 px-3 rounded-lg bg-slate-900/60 border border-slate-800/50 hover:border-slate-700 transition-colors">
                          <div>
                            <p className="font-semibold text-slate-200">{item.label}</p>
                            <p className="text-slate-500 text-[10px]">{item.description}</p>
                          </div>
                          <span className="font-mono font-bold text-emerald-400">
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
        <div className="space-y-4">
          
          {/* Base Subtotal Bar */}
          <div className="flex items-center justify-between p-4 bg-slate-950/80 rounded-2xl border border-slate-800">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Subtotal (Net Cost)</span>
            <span className="text-xl font-bold text-white font-mono">${pricing.subtotal.toFixed(2)}</span>
          </div>

          {/* Segmented Commission Controller */}
          <div className="bg-slate-950/80 border border-indigo-500/20 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-indigo-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-white">Agency Commission Margin</h3>
              </div>
              <span className="text-xs font-mono font-bold text-indigo-400">
                +${commissionAmount.toFixed(2)}
              </span>
            </div>

            {/* Segmented Selector Buttons */}
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
              {presetCommissions.map((val) => {
                const isActive = officeCommission === val;
                const label = val === "custom" ? "Custom" : `${val}%`;
                return (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setOfficeCommission(val)}
                    className={`py-2 px-1 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                      isActive 
                        ? "bg-indigo-600 text-white border-indigo-400 shadow-md shadow-indigo-600/30" 
                        : "bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-slate-200"
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>

            {/* Custom Input Field */}
            {officeCommission === "custom" && (
              <div className="pt-2 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    placeholder="Enter custom percentage (e.g. 22.5)"
                    value={customCommission}
                    onChange={(e) => setCustomCommission(e.target.value)}
                    className="w-full bg-slate-900 border border-indigo-500/40 rounded-xl px-4 py-2.5 pr-10 text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all"
                  />
                  <Percent className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-indigo-400" />
                </div>
              </div>
            )}
          </div>

          {/* Silicon Valley Grand Total Card */}
          <div className="relative overflow-hidden bg-gradient-to-br from-emerald-950/70 via-slate-900 to-slate-950 border-2 border-emerald-500/40 rounded-3xl p-6 shadow-2xl shadow-emerald-950/30">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center justify-center text-emerald-400">
                  <DollarSign className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white tracking-tight">Client Quoted Price</h3>
                  <p className="text-xs text-emerald-400/80">Net cost + agency commission breakdown</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-4xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200">
                  ${grandTotal.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-emerald-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <span className="text-xs text-slate-300 flex items-center gap-2">
                <Users className="w-4 h-4 text-slate-400" />
                Cost Per Person <span className="text-slate-500">({pricing.totalTravellers} paying travellers)</span>
              </span>
              <span className="text-lg font-extrabold text-white bg-slate-950/60 px-4 py-1.5 rounded-xl border border-emerald-500/30 font-mono">
                ${perPerson.toFixed(2)} <span className="text-xs font-normal text-slate-400">/ pax</span>
              </span>
            </div>
          </div>
        </div>

        {/* ========================================== */}
        {/* 6. MODAL ACTION BUTTONS                    */}
        {/* ========================================== */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2 print:hidden relative z-10">
          
          <button
            type="button"
            onClick={handleSaveAndClose}
            className="flex-[2] bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white rounded-2xl py-3.5 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-600/30 cursor-pointer active:scale-[0.99]"
          >
            <CheckCircle2Icon className="w-4 h-4 fill-indigo-500 " />
            Okay😊  Save Now
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
    emerald: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    blue: "text-blue-400 bg-blue-500/10 border-blue-500/20",
    amber: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    purple: "text-purple-400 bg-purple-500/10 border-purple-500/20",
    rose: "text-rose-400 bg-rose-500/10 border-rose-500/20",
    cyan: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
  };

  return (
    <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-3 hover:border-slate-700 transition-all duration-200">
      <div className="flex items-center gap-2 mb-2">
        <div className={`p-1.5 rounded-lg ${colorClasses[color]}`}>
          <Icon className="w-3.5 h-3.5" />
        </div>
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight truncate">{label}</span>
      </div>
      <p className="text-base font-black text-white font-mono">
        ${(amount || 0).toFixed(2)}
      </p>
    </div>
  );
}