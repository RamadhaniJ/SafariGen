
import { useState, useEffect, useMemo, useRef } from 'react';
import { toast } from 'sonner';
import api from '../../../Apis/api';
import GlobalLoader from '../../../Component/Loader';
import {
  Calculator, Users, Calendar, MapPin, Car,
  Utensils, Activity, FileText, Printer, Sparkles,
  TrendingUp, Wallet, Hotel, Download
} from 'lucide-react';
import PdfPricingDownload from './pdfPrint';

/* ============================================================
   HELPERS
   ============================================================ */
 
   const formatCurrency = (amount, compact = false) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: compact ? 0 : 2,
    maximumFractionDigits: compact ? 0 : 2,
  }).format(amount || 0);

const CATEGORY_STYLES = {
  ACCOMMODATION: { pill: 'bg-blue-50 text-blue-700 border-blue-100', dot: 'bg-blue-500' },
  PARK_FEE:      { pill: 'bg-emerald-50 text-emerald-700 border-emerald-100', dot: 'bg-emerald-500' },
  CONCESSION:    { pill: 'bg-teal-50 text-teal-700 border-teal-100', dot: 'bg-teal-500' },
  ACTIVITY:      { pill: 'bg-violet-50 text-violet-700 border-violet-100', dot: 'bg-violet-500' },
  OPTIONAL_MEAL: { pill: 'bg-orange-50 text-orange-700 border-orange-100', dot: 'bg-orange-500' },
  VEHICLE:       { pill: 'bg-slate-100 text-slate-700 border-slate-200', dot: 'bg-slate-500' },
  COMMISSION:    { pill: 'bg-amber-50 text-amber-700 border-amber-100', dot: 'bg-amber-500' },
};
const getCategoryStyle = (cat) => CATEGORY_STYLES[cat] || { pill: 'bg-slate-100 text-slate-700 border-slate-200', dot: 'bg-slate-400' };

/* ============================================================
   MAIN COMPONENT
   ============================================================ */
export default function PricingBreakdownToStaff({ client_id, version_id, safariData }) {
  const [pricingData, setPricingData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  
  // MUHIMU: Tangaza intervalRef hapa
  const intervalRef = useRef(null);

  const { itinerary } = safariData || {};
  const { client_info } = itinerary || {};

  const tourLength = client_info?.tour_length || 0;
  const tourNights = Math.max(0, tourLength - 1);
  const totalTravellers = client_info?.total_travellers || 1;

  const PDF_STEPS = [
    "Accessing your secure workspace…",
    "Collecting your personalized information…",
    "Creating your tailored document…",
    "Adding your branding and preferences…",
    "Building your high-resolution PDF…",
    "Perfecting the layout and running a quality check…",
    "Almost done — getting your file ready to download…",
  ];

  const fetchPricingBreakdown = async () => {
    setLoading(true);
    try {
      const resp = await api.get(`itinerary/pricing-breakdown/${client_id}/${version_id}/`);
      setPricingData(resp.data);
      toast.success('Pricing breakdown loaded successfully');
    } catch (error) {
      const errorMsg = error.response?.data?.detail || 'Failed to load pricing data.';
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (client_id && !pricingData) fetchPricingBreakdown();
  }, [client_id]);

  const groupedItems = useMemo(() => {
    return (pricingData?.breakdown_items || []).reduce((acc, item) => {
      const dayLabel = item.day_number === 0 ? 'General / Entire Tour' : `Day ${item.day_number}`;
      if (!acc[dayLabel]) acc[dayLabel] = { date: item.date_display, items: [] };
      acc[dayLabel].items.push(item);
      return acc;
    }, {});
  }, [pricingData]);

  /* ---------- PDF Generation via Django API ---------- */
  const handleDownloadPdf = async () => {
    if (!client_id || client_id === "undefined") {
      toast.error("Client ID is missing!");
      return;
    }

    setIsGeneratingPdf(true);
    let step = 0;
    const toastId = toast.loading(PDF_STEPS[0]);

    <PdfPricingDownload safariData={safariData} client_id={client_id} />

    intervalRef.current = setInterval(() => {
      step = Math.min(step + 1, PDF_STEPS.length - 1);
      toast.loading(PDF_STEPS[step], { id: toastId });
    }, 2500);

    try {
      // Hakikisha URL hii inalingana na base URL ya api yako na Django path
      const response = await api.get(`itinerary/view/pricing/pdf/${client_id}/${version_id}`, {
        responseType: "blob",
        timeout: 120000, // 2 minutes timeout for Playwright
      });

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Pricing_${client_info?.tour_title?.replace(/\s+/g, '_') || 'Safari'}_${client_info?.tour_code || 'Proposal'}.pdf`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      clearInterval(intervalRef.current);
      toast.success("PDF downloaded successfully! 🔥", { id: toastId });
    } catch (error) {
      console.error("PDF generation error:", error);
      clearInterval(intervalRef.current);
      toast.error("Failed to generate PDF. Please try again.", { id: toastId });
    } finally {
      clearInterval(intervalRef.current);
      setIsGeneratingPdf(false);
    }
  };

  if (loading && !pricingData) return <GlobalLoader />;

  if (!pricingData && !loading) {
    return (
      <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-2xl border border-stone-200/70 shadow-sm p-10 text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-amber-50 border border-amber-100 flex items-center justify-center mb-5">
            <Calculator className="w-5 h-5 text-amber-600" strokeWidth={1.75} />
          </div>
          <h2 className="font-serif text-2xl text-stone-900 mb-2">No pricing yet</h2>
          <p className="text-sm text-stone-500 mb-6 leading-relaxed">
            Pricing for this itinerary hasn't been generated.
          </p>
          <button onClick={fetchPricingBreakdown} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-stone-900 text-white text-sm font-medium hover:bg-stone-800 transition shadow-sm">
            <Sparkles className="w-4 h-4" /> Generate Pricing
          </button>
        </div>
      </div>
    );
  }

  const p = pricingData;
  const heroStats = [
    { icon: Calendar, label: 'Duration', value: `${tourLength} Days · ${tourNights} Nights` },
    { icon: Users, label: 'Travellers', value: `${totalTravellers} ${totalTravellers === 1 ? 'Guest' : 'Guests'}` },
  ];

  const summaryCards = [
    { icon: Hotel, title: 'Accommodation', value: p.total_accommodation, tone: 'text-blue-600 bg-blue-50 border-blue-100' },
    { icon: MapPin, title: 'Park & Rescue', value: p.total_park_fees, tone: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
    { icon: MapPin, title: 'Concession Fees', value: p.total_concession_fees, tone: 'text-teal-600 bg-teal-50 border-teal-100' },
    { icon: Car, title: 'Transport Vehicle', value: p.total_transport_vehicle, tone: 'text-slate-600 bg-slate-50 border-slate-100' },
    { icon: Activity, title: 'Activities', value: p.total_activities, tone: 'text-violet-600 bg-violet-50 border-violet-100' },
    { icon: Utensils, title: 'Optional Meals', value: p.total_optional_meals, tone: 'text-orange-600 bg-orange-50 border-orange-100' },
  ];

  return (
    <div className="min-h-screen bg-[#faf8f5] text-stone-900 antialiased">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-8">
        {/* HEADER */}
        <header className="relative overflow-hidden rounded-3xl bg-stone-950 text-white">
          <div className="absolute inset-0 opacity-70 pointer-events-none" style={{ background: 'radial-gradient(circle at 15% 20%, rgba(251,191,36,0.10), transparent 45%), radial-gradient(circle at 85% 80%, rgba(251,191,36,0.06), transparent 50%)' }} />
          <div className="relative p-7 md:p-10">
            <div className="flex items-center gap-3 mb-5">
              <span className="h-px w-8 bg-amber-400/60" />
              <span className="text-[10px] tracking-[0.32em] uppercase text-amber-300/90 font-medium">Pricing Breakdown</span>
            </div>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
              <div className="max-w-2xl">
                <p className="font-serif text-lg text-white/85 mb-2">{client_info?.salutation} {client_info?.first_name} {client_info?.last_name}</p>
                <h1 className="font-serif text-3xl md:text-5xl leading-tight tracking-tight text-white">{client_info?.tour_title || 'Safari Itinerary'}</h1>
                <div className="flex flex-wrap gap-2 mt-6">
                  {heroStats.map((s, i) => (
                    <span key={i} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/15 bg-white/5 text-xs text-white/85 backdrop-blur-sm">
                      <s.icon className="w-3.5 h-3.5 text-amber-400" strokeWidth={1.75} />
                      <span className="tracking-wide">{s.value}</span>
                    </span>
                  ))}
                </div>
              </div>
              <button
                onClick={handleDownloadPdf}
                disabled={isGeneratingPdf}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-amber-500 text-stone-950 text-sm font-semibold hover:bg-amber-400 transition shadow-lg shadow-amber-500/20 self-start md:self-auto disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isGeneratingPdf ? 'Processing...' : <><Download className="w-4 h-4" /> Download PDF</>}
              </button>
            </div>
          </div>
        </header>

        {/* SUMMARY CARDS */}
        <section>
          <SectionHeading eyebrow="Cost Summary" title="Where the investment goes" subtitle="A transparent, line-by-line view of every cost component." />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
            {summaryCards.map((c, i) => <MetricCard key={i} {...c} />)}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <EmphasisCard icon={Wallet} label="Subtotal Net" value={p.subtotal_net} caption="Net cost before commission" />
            <EmphasisCard icon={TrendingUp} label={`Commission · ${p.commission_percentage}%`} value={p.commission_amount} caption="Agency commission applied" gold />
          </div>
        </section>

        {/* GRAND TOTAL */}
        <section className="relative overflow-hidden rounded-3xl bg-stone-950 text-white">
          <div className="absolute inset-0 opacity-80 pointer-events-none" style={{ background: 'radial-gradient(circle at 80% 20%, rgba(251,191,36,0.14), transparent 45%)' }} />
          <div className="relative grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-center gap-6 md:gap-10 p-7 md:p-10">
            <div className="text-center md:text-left">
              <p className="text-[11px] tracking-[0.28em] uppercase text-white/50 font-medium">Grand Total</p>
              <p className="font-serif text-4xl md:text-5xl mt-2 text-white">{formatCurrency(p.grand_total)}</p>
            </div>
            <div className="hidden md:block h-16 w-px bg-white/10" />
            <div className="text-center md:text-right">
              <p className="text-[11px] tracking-[0.28em] uppercase text-white/50 font-medium">Price Per Person</p>
              <p className="font-serif text-4xl md:text-5xl mt-2 text-amber-400">{formatCurrency(p.price_per_person)}</p>
            </div>
          </div>
        </section>

        {/* DAY-BY-DAY */}
        <section className="bg-white rounded-3xl border border-stone-200/70 shadow-sm overflow-hidden">
          <div className="p-6 md:p-8 border-b border-stone-100 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-stone-100 border border-stone-200 flex items-center justify-center">
                <FileText className="w-4 h-4 text-stone-600" strokeWidth={1.75} />
              </div>
              <div>
                <h2 className="font-serif text-xl md:text-2xl text-stone-900 leading-none">Detailed Day-by-Day Breakdown</h2>
                <p className="text-xs text-stone-500 mt-1.5 tracking-wide">Prepared by <span className="text-stone-700 font-medium">{p.generated_by_email || 'System'}</span></p>
              </div>
            </div>
            <span className="text-[10px] tracking-[0.28em] uppercase text-stone-400">{Object.keys(groupedItems).length} Sections</span>
          </div>
          <div className="p-6 md:p-8">
            <Timeline groupedItems={groupedItems} />
          </div>
        </section>

        <footer className="text-center pt-4 pb-8">
          <p className="text-[10px] tracking-[0.32em] uppercase text-stone-400">Confidential · For Internal Use</p>
        </footer>
      </div>
         <style>{`
        @media print {
          body { background: white !important; }
          .print\\:hidden { display: none !important; }
        }
      `}</style>
    </div>
  );
}

function SectionHeading({ eyebrow, title, subtitle }) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-3">
        <span className="h-px w-6 bg-stone-300" />
        <span className="text-[10px] tracking-[0.3em] uppercase text-stone-500 font-medium">
          {eyebrow}
        </span>
      </div>
      <h2 className="font-serif text-2xl md:text-3xl text-stone-900 tracking-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="text-sm text-stone-500 max-w-xl">{subtitle}</p>
      )}
    </div>
  );
}

function MetricCard({ icon: Icon, title, value, tone }) {
  return (
    <div className="group bg-white rounded-2xl border border-stone-200/70 p-5 hover:border-stone-300 hover:shadow-[0_8px_24px_-12px_rgba(15,23,42,0.12)] transition-all duration-300">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] tracking-[0.16em] uppercase text-stone-500 font-medium">
            {title}
          </p>
          <p className="font-serif text-2xl text-stone-900 mt-2 truncate">
            {formatCurrency(value)}
          </p>
        </div>
        <div className={`shrink-0 w-10 h-10 rounded-xl border flex items-center justify-center ${tone}`}>
          <Icon className="w-4 h-4" strokeWidth={1.75} />
        </div>
      </div>
    </div>
  );
}

function EmphasisCard({ icon: Icon, label, value, caption, gold = false }) {
  return (
    <div
      className={`rounded-2xl border p-5 md:p-6 flex items-start justify-between gap-4 ${
        gold
          ? 'bg-amber-50/70 border-amber-200/70'
          : 'bg-white border-stone-200/70'
      }`}
    >
      <div>
        <p
          className={`text-[11px] tracking-[0.2em] uppercase font-medium ${
            gold ? 'text-amber-700' : 'text-stone-500'
          }`}
        >
          {label}
        </p>
        <p
          className={`font-serif text-3xl mt-2 ${
            gold ? 'text-amber-800' : 'text-stone-900'
          }`}
        >
          {formatCurrency(value)}
        </p>
        {caption && (
          <p
            className={`text-xs mt-1.5 ${
              gold ? 'text-amber-700/70' : 'text-stone-400'
            }`}
          >
            {caption}
          </p>
        )}
      </div>
      <div
        className={`shrink-0 w-10 h-10 rounded-xl border flex items-center justify-center ${
          gold
            ? 'bg-amber-100/70 border-amber-200 text-amber-700'
            : 'bg-stone-50 border-stone-200 text-stone-600'
        }`}
      >
        <Icon className="w-4 h-4" strokeWidth={1.75} />
      </div>
    </div>
  );
}

function Timeline({ groupedItems }) {
  const entries = Object.entries(groupedItems);

  if (!entries.length) {
    return (
      <p className="text-sm text-stone-400 italic text-center py-8">
        No line items to display.
      </p>
    );
  }

  return (
    <div className="relative">
      {/* vertical spine */}
      <div className="absolute left-[15px] md:left-[19px] top-2 bottom-2 w-px bg-stone-200" />

      <div className="space-y-8">
        {entries.map(([dayLabel, group], i) => {
          const isGeneral = dayLabel === 'General / Entire Tour';
          return (
            <div key={dayLabel} className="relative pl-12 md:pl-16">
              {/* node */}
              <div
                className={`absolute left-0 top-0 w-8 h-8 md:w-10 md:h-10 rounded-full border flex items-center justify-center font-serif text-sm ${
                  isGeneral
                    ? 'bg-white border-stone-200 text-stone-500'
                    : 'bg-stone-900 border-stone-900 text-white'
                }`}
              >
                {isGeneral ? '★' : i}
              </div>

              {/* header */}
              <div className="mb-3">
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <h3 className="font-serif text-lg md:text-xl text-stone-900">
                    {dayLabel}
                  </h3>
                  {group.date && !isGeneral && (
                    <span className="text-xs text-stone-500 tracking-wide">
                      {group.date}
                    </span>
                  )}
                </div>
              </div>

              {/* items */}
              <div className="space-y-2">
                {group.items.map((item, idx) => {
                  const cat = getCategoryStyle(item.category);
                  return (
                    <div
                      key={idx}
                      className="group bg-stone-50/60 hover:bg-white border border-transparent hover:border-stone-200 rounded-xl p-4 transition-all duration-200"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-1.5">
                            <span
                              className={`inline-flex items-center gap-1.5 text-[10px] tracking-[0.14em] uppercase font-semibold px-2 py-0.5 rounded-full border ${cat.pill}`}
                            >
                              <span className={`w-1.5 h-1.5 rounded-full ${cat.dot}`} />
                              {item.category.replace(/_/g, ' ')}
                            </span>
                            <span className="font-medium text-stone-900 text-sm">
                              {item.item_title}
                            </span>
                          </div>
                          {item.item_description && (
                            <p className="text-xs text-stone-500 leading-relaxed">
                              {item.item_description}
                            </p>
                          )}
                          <p className="text-[11px] text-stone-400 mt-1.5 tabular-nums">
                            {formatCurrency(item.unit_price)} × {item.quantity}{' '}
                            {item.unit_label}
                          </p>
                        </div>
                        <div className="text-left sm:text-right shrink-0">
                          <span className="font-serif text-lg text-stone-900 tabular-nums">
                            {formatCurrency(item.line_total)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}