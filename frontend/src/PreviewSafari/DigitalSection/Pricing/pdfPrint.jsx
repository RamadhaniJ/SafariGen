import { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom'; // 1. MUHIMU: Hii inachukua ID kutoka URL
import api from '../../../Apis/api';
import GlobalLoader from '../../../Component/Loader';
import {
  Calculator, Users, Calendar, MapPin, Car,
  Utensils, Activity, FileText, TrendingUp, Wallet, Hotel
} from 'lucide-react';

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
   MAIN COMPONENT (PRINT VIEW)
   ============================================================ */
export default function PdfPricingDownload() {
  // 2. ONDOA PROPS. Tumia useParams kupata client_id moja kwa moja kutoka URL
  const { client_id, version_id } = useParams(); 
  
  const [pricingData, setPricingData] = useState(null);
  const [clientInfo, setClientInfo] = useState(null); // State tofauti kwa ajili ya client info
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 3. FETCH DATA ZOTE MBILI NDANI YA COMPONENT HII
  useEffect(() => {
    const fetchData = async () => {
      if (!client_id || !version_id) {
        setError("Client ID is missing from URL");
        setLoading(false);
        return;
      }

      try {
        // A. Fetch Pricing Data
        const pricingResp = await api.get(`itinerary/pricing-breakdown/${client_id}/${version_id}`);
        setPricingData(pricingResp.data);

        // B. Fetch Safari Data (kwa ajili ya client_info, tour_length, n.k.)
        const safariResp = await api.get(`itinerary/preview/client/safari/data/${client_id}/${version_id}`);
        setClientInfo(safariResp.data.itinerary?.client_info);

      } catch (err) {
        console.error("PDF Data Fetch Error 1.:", err);
        console.error("PDF Data Fetch Error 2.:", err.response?.status, err.response);

        setError("Failed to load data. Check console for details.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [client_id, version_id]);





  useEffect(()=>{
    if (pricingData && clientInfo){
        window.__PRICING_PDF_READY__ = true;
    }
  }, [pricingData, clientInfo]);




  // Fallbacks za safety
  const tourLength = clientInfo?.tour_length || 0;
  const tourNights = Math.max(0, tourLength - 1);
  const totalTravellers = clientInfo?.total_travellers || 1;

  const groupedItems = useMemo(() => {
    return (pricingData?.breakdown_items || []).reduce((acc, item) => {
      const dayLabel = item.day_number === 0 ? 'General / Entire Tour' : `Day ${item.day_number}`;
      if (!acc[dayLabel]) acc[dayLabel] = { date: item.date_display, items: [] };
      acc[dayLabel].items.push(item);
      return acc;
    }, {});
  }, [pricingData]);

  // 5. LOADING & ERROR STATES
  if (loading) return <GlobalLoader />;
  
  if (error || !pricingData || !clientInfo) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6">
        <div className="text-center text-red-600">
          <h2 className="text-xl font-bold mb-2">Error Loading PDF Data</h2>
          <p>{error || "Data not found for this client ID."}</p>
          <p className="text-sm text-gray-500 mt-4">Client ID: {client_id || 'Undefined'}</p>
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

  /* ============================================================
     RENDER
     ============================================================ */
  return (
    <div className="pricing-print-root min-h-screen bg-white text-stone-900 antialiased p-8 max-w-4xl mx-auto">
      
      {/* HEADER */}
      <header className="relative overflow-hidden rounded-3xl bg-stone-950 text-white mb-8 print-break-inside-avoid">
        <div className="absolute inset-0 opacity-70 pointer-events-none" style={{ background: 'radial-gradient(circle at 15% 20%, rgba(251,191,36,0.10), transparent 45%), radial-gradient(circle at 85% 80%, rgba(251,191,36,0.06), transparent 50%)' }} />
        <div className="relative p-7 md:p-10">
          <div className="flex items-center gap-3 mb-5">
            <span className="h-px w-8 bg-amber-400/60" />
            <span className="text-[10px] tracking-[0.32em] uppercase text-amber-300/90 font-medium">Pricing Breakdown</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div className="max-w-2xl">
              <p className="font-serif text-lg text-white/85 mb-2">
                {clientInfo?.salutation} {clientInfo?.first_name} {clientInfo?.last_name}
              </p>
              <h1 className="font-serif text-3xl md:text-4xl leading-tight tracking-tight text-white">
                {clientInfo?.tour_title || 'Safari Itinerary'}
              </h1>
              <div className="flex flex-wrap gap-2 mt-6">
                {heroStats.map((s, i) => (
                  <span key={i} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/15 bg-white/5 text-xs text-white/85 backdrop-blur-sm">
                    <s.icon className="w-3.5 h-3.5 text-amber-400" strokeWidth={1.75} />
                    <span className="tracking-wide">{s.value}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* FINANCIAL SUMMARY */}
      <section className="space-y-6 print-break-inside-avoid mb-8">
        <SectionHeading eyebrow="Cost Summary" title="Where the investment goes" subtitle="A transparent, line-by-line view of every cost component." />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {summaryCards.map((c, i) => <MetricCard key={i} {...c} />)}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <EmphasisCard icon={Wallet} label="Subtotal Net" value={p.subtotal_net} caption="Net cost before commission" />
          <EmphasisCard icon={TrendingUp} label={`Commission · ${p.commission_percentage}%`} value={p.commission_amount} caption="Agency commission applied" gold />
        </div>
      </section>

      {/* GRAND TOTAL BANNER */}
      <section className="relative overflow-hidden rounded-3xl bg-stone-950 text-white mb-8 print-break-inside-avoid">
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

      {/* DAY-BY-DAY BREAKDOWN */}
      <section className="bg-white rounded-3xl border border-stone-200/70 shadow-sm overflow-hidden print-break-inside-avoid">
        <div className="p-6 md:p-8 border-b border-stone-100 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-stone-100 border border-stone-200 flex items-center justify-center">
              <FileText className="w-4 h-4 text-stone-600" strokeWidth={1.75} />
            </div>
            <div>
              <h2 className="font-serif text-xl md:text-2xl text-stone-900 leading-none">Detailed Day-by-Day Breakdown</h2>
              <p className="text-xs text-stone-500 mt-1.5 tracking-wide">
                Prepared by <span className="text-stone-700 font-medium">{p.generated_by_email || 'System'}</span>
              </p>
            </div>
          </div>
          <span className="text-[10px] tracking-[0.28em] uppercase text-stone-400">{Object.keys(groupedItems).length} Sections</span>
        </div>
        <div className="p-6 md:p-8">
          <Timeline groupedItems={groupedItems} />
        </div>
      </section>

      <footer className="text-center pt-8 pb-4">
        <p className="text-[10px] tracking-[0.32em] uppercase text-stone-400">Confidential · For Internal Use</p>
      </footer>

      <style>{`
  @media print {
    @page {
      size: A4 portrait;
      margin: 0;   /* Playwright ina-handle margins */
    }
    html, body {
      margin: 0 !important;
      padding: 0 !important;
      background: white !important;
    }
    .pricing-print-root {
     
      padding-top: 40px !important;
      padding-bottom: 60px !important;
      padding-left: 30px !important;
      padding-right: 30px !important;
      margin: 0 !important;
      max-width: 100% !important;
    }
    .print-break-inside-avoid {
      break-inside: avoid !important;
      page-break-inside: avoid !important;
    }
    * {
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
  }
`}</style>

    </div>
  );
}

/* ============================================================
   SUB COMPONENTS (Paste your SectionHeading, MetricCard, EmphasisCard, Timeline here)
   ============================================================ */
function SectionHeading({ eyebrow, title, subtitle }) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-3">
        <span className="h-px w-6 bg-stone-300" />
        <span className="text-[10px] tracking-[0.3em] uppercase text-stone-500 font-medium">{eyebrow}</span>
      </div>
      <h2 className="font-serif text-2xl md:text-3xl text-stone-900 tracking-tight">{title}</h2>
      {subtitle && <p className="text-sm text-stone-500 max-w-xl">{subtitle}</p>}
    </div>
  );
}

function MetricCard({ icon: Icon, title, value, tone }) {
  return (
    <div className="group bg-white rounded-2xl border border-stone-200/70 p-5 hover:border-stone-300 hover:shadow-[0_8px_24px_-12px_rgba(15,23,42,0.12)] transition-all duration-300">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] tracking-[0.16em] uppercase text-stone-500 font-medium">{title}</p>
          <p className="font-serif text-2xl text-stone-900 mt-2 truncate">{formatCurrency(value)}</p>
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
    <div className={`rounded-2xl border p-5 md:p-6 flex items-start justify-between gap-4 ${gold ? 'bg-amber-50/70 border-amber-200/70' : 'bg-white border-stone-200/70'}`}>
      <div>
        <p className={`text-[11px] tracking-[0.2em] uppercase font-medium ${gold ? 'text-amber-700' : 'text-stone-500'}`}>{label}</p>
        <p className={`font-serif text-3xl mt-2 ${gold ? 'text-amber-800' : 'text-stone-900'}`}>{formatCurrency(value)}</p>
        {caption && <p className={`text-xs mt-1.5 ${gold ? 'text-amber-700/70' : 'text-stone-400'}`}>{caption}</p>}
      </div>
      <div className={`shrink-0 w-10 h-10 rounded-xl border flex items-center justify-center ${gold ? 'bg-amber-100/70 border-amber-200 text-amber-700' : 'bg-stone-50 border-stone-200 text-stone-600'}`}>
        <Icon className="w-4 h-4" strokeWidth={1.75} />
      </div>
    </div>
  );
}

function Timeline({ groupedItems }) {
  const entries = Object.entries(groupedItems);
  if (!entries.length) return <p className="text-sm text-stone-400 italic text-center py-8">No line items to display.</p>;

  return (
    <div className="relative">
      <div className="absolute left-[15px] md:left-[19px] top-2 bottom-2 w-px bg-stone-200 print:hidden" />
      <div className="space-y-8">
        {entries.map(([dayLabel, group], i) => {
          const isGeneral = dayLabel === 'General / Entire Tour';
          return (
            <div key={dayLabel} className="relative pl-12 md:pl-16 day-section">
              <div className={`absolute left-0 top-0 w-8 h-8 md:w-10 md:h-10 rounded-full border flex items-center justify-center font-serif text-sm ${isGeneral ? 'bg-white border-stone-200 text-stone-500' : 'bg-stone-900 border-stone-900 text-white'}`}>
                {isGeneral ? '★' : i}
              </div>
              <div className="mb-3">
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <h3 className="font-serif text-lg md:text-xl text-stone-900">{dayLabel}</h3>
                  {group.date && !isGeneral && <span className="text-xs text-stone-500 tracking-wide">{group.date}</span>}
                </div>
              </div>
              <div className="space-y-2">
                {group.items.map((item, idx) => {
                  const cat = getCategoryStyle(item.category);
                  return (
                    <div key={idx} className="group bg-stone-50/60 hover:bg-white border border-transparent hover:border-stone-200 rounded-xl p-4 transition-all duration-200 print-break-inside-avoid">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-1.5">
                            <span className={`inline-flex items-center gap-1.5 text-[10px] tracking-[0.14em] uppercase font-semibold px-2 py-0.5 rounded-full border ${cat.pill}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${cat.dot}`} />
                              {item.category.replace(/_/g, ' ')}
                            </span>
                            <span className="font-medium text-stone-900 text-sm">{item.item_title}</span>
                          </div>
                          {item.item_description && <p className="text-xs text-stone-500 leading-relaxed">{item.item_description}</p>}
                          <p className="text-[11px] text-stone-400 mt-1.5 tabular-nums">{formatCurrency(item.unit_price)} × {item.quantity} {item.unit_label}</p>
                        </div>
                        <div className="text-left sm:text-right shrink-0">
                          <span className="font-serif text-lg text-stone-900 tabular-nums">{formatCurrency(item.line_total)}</span>
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