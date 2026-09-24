// import { useState, useEffect, useMemo } from 'react';
// import api from '../../../Apis/api';
// import GlobalLoader from '../../../Component/Loader';
// import { Calculator, Users, Calendar, MapPin, Car, Utensils, Activity, FileText, TrendingUp, Wallet, Hotel } from 'lucide-react';

// // (Paste the SAME helpers and sub-components here: formatCurrency, CATEGORY_STYLES, SectionHeading, MetricCard, EmphasisCard, Timeline)

// export default function PdfPricingDownload({ client_id }) {
//   const [pricingData, setPricingData] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchPricing = async () => {
//       try {
//         const resp = await api.get(`itinerary/pricing-breakdown/${client_id}/`);
//         setPricingData(resp.data);
//       } catch (error) {
//         console.error("Failed to load pricing for print", error);
//       } finally {
//         setLoading(false);
//         // MUHIMU: Mwambie Playwright kwamba data imepakia na iweze kuchukua PDF
//         window.__PRICING_PDF_READY__ = true;
//       }
//     };
//     if (client_id) fetchPricing();
//   }, [client_id]);

//   if (loading || !pricingData) return <GlobalLoader />;

//   const p = pricingData;
//   // Note: Kwa print view, tunatumia data kutoka pricingData moja kwa moja
//   const tourLength = p.client_request?.tour_length || 0; 
//   const totalTravellers = p.client_request?.total_travellers || 1;

//   const heroStats = [
//     { icon: Calendar, label: 'Duration', value: `${tourLength} Days` },
//     { icon: Users, label: 'Travellers', value: `${totalTravellers} Guests` },
//   ];

//   const summaryCards = [
//     { icon: Hotel, title: 'Accommodation', value: p.total_accommodation, tone: 'text-blue-600 bg-blue-50 border-blue-100' },
//     { icon: MapPin, title: 'Park & Rescue', value: p.total_park_fees, tone: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
//     { icon: MapPin, title: 'Concession Fees', value: p.total_concession_fees, tone: 'text-teal-600 bg-teal-50 border-teal-100' },
//     { icon: Car, title: 'Transport Vehicle', value: p.total_transport_vehicle, tone: 'text-slate-600 bg-slate-50 border-slate-100' },
//     { icon: Activity, title: 'Activities', value: p.total_activities, tone: 'text-violet-600 bg-violet-50 border-violet-100' },
//     { icon: Utensils, title: 'Optional Meals', value: p.total_optional_meals, tone: 'text-orange-600 bg-orange-50 border-orange-100' },
//   ];

//   const groupedItems = useMemo(() => {
//     return (p.breakdown_items || []).reduce((acc, item) => {
//       const dayLabel = item.day_number === 0 ? 'General / Entire Tour' : `Day ${item.day_number}`;
//       if (!acc[dayLabel]) acc[dayLabel] = { date: item.date_display, items: [] };
//       acc[dayLabel].items.push(item);
//       return acc;
//     }, {});
//   }, [p]);

//   return (
//     // Background nyeupe ni bora zaidi kwa printing (inaokoa ink na inaonekana professional)
//     <div className="min-h-screen bg-white text-stone-900 p-8 max-w-4xl mx-auto print-break-inside-avoid">
//       <header className="border-b-2 border-stone-200 pb-6 mb-8 print-break-inside-avoid">
//         <h1 className="font-serif text-4xl text-stone-900 mb-2">{p.client_request?.tour_title || 'Safari Itinerary'}</h1>
//         <p className="text-stone-600 text-lg">Pricing Breakdown for {p.client_request?.client_requested?.first_name || 'Valued Guest'}</p>
//         <div className="flex flex-wrap gap-2 mt-4">
//           {heroStats.map((s, i) => (
//             <span key={i} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-stone-200 bg-stone-50 text-xs text-stone-700">
//               <s.icon className="w-3.5 h-3.5 text-stone-500" strokeWidth={1.75} />
//               <span>{s.value}</span>
//             </span>
//           ))}
//         </div>
//       </header>

//       <section className="space-y-6 print-break-inside-avoid">
//         <SectionHeading eyebrow="Cost Summary" title="Where the investment goes" />
//         <div className="grid grid-cols-2 gap-4">
//           {summaryCards.map((c, i) => <MetricCard key={i} {...c} />)}
//         </div>
//         <div className="grid grid-cols-2 gap-4 mt-4">
//           <EmphasisCard icon={Wallet} label="Subtotal Net" value={p.subtotal_net} caption="Net cost before commission" />
//           <EmphasisCard icon={TrendingUp} label={`Commission · ${p.commission_percentage}%`} value={p.commission_amount} caption="Agency commission applied" gold />
//         </div>
//       </section>

//       <section className="mt-8 print-break-inside-avoid">
//         <div className="bg-stone-900 text-white rounded-2xl p-6 flex justify-between items-center">
//           <div>
//             <p className="text-xs uppercase tracking-widest text-stone-400">Grand Total</p>
//             <p className="font-serif text-4xl mt-1">{formatCurrency(p.grand_total)}</p>
//           </div>
//           <div className="text-right">
//             <p className="text-xs uppercase tracking-widest text-stone-400">Price Per Person</p>
//             <p className="font-serif text-3xl mt-1 text-amber-400">{formatCurrency(p.price_per_person)}</p>
//           </div>
//         </div>
//       </section>

//       <section className="mt-10">
//         <SectionHeading eyebrow="Details" title="Day-by-Day Breakdown" />
//         <div className="mt-6 space-y-6">
//           <Timeline groupedItems={groupedItems} />
//         </div>
//       </section>

//       <footer className="mt-12 pt-6 border-t border-stone-200 text-center">
//         <p className="text-[10px] tracking-[0.32em] uppercase text-stone-400">Confidential · For Internal Use Only</p>
//       </footer>
//     </div>
//   );
// }





import React from 'react';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { FORMAT_TEXT_COMMAND } from 'lexical';

// 1. Hii ni Komponenti ya Toolbar (Vifungo vyako)
function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();

  const formatText = (command) => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, command);
  };

  return (
    <div style={{ 
      display: 'flex', 
      gap: '8px', 
      padding: '8px', 
      borderBottom: '1px solid #ddd', 
      backgroundColor: '#f9f9f9',
      marginBottom: '10px'
    }}>
      <button 
        onClick={() => formatText('bold')} 
        style={{ fontWeight: 'bold', padding: '4px 8px', cursor: 'pointer' }}
      >
        B
      </button>
      <button 
        onClick={() => formatText('italic')} 
        style={{ fontStyle: 'italic', padding: '4px 8px', cursor: 'pointer' }}
      >
        I
      </button>
      <button 
        onClick={() => formatText('underline')} 
        style={{ textDecoration: 'underline', padding: '4px 8px', cursor: 'pointer' }}
      >
        U
      </button>
    </div>
  );
}

// 2. Cfg kuu ya Editor
const editorConfig = {
  namespace: 'MyRichTextEditor',
  theme: {
    paragraph: 'editor-paragraph',
    text: {
      bold: 'editor-text-bold',
      italic: 'editor-text-italic',
      underline: 'editor-text-underline',
    },
  },
  onError(error) {
    console.error(error);
  },
};

export default function Editor() {
  return (
    <LexicalComposer initialConfig={editorConfig}>
      {/* CSS Styles za ndani kwa ajili ya kufanya Bold/Italic zionekane */}
      <style>{`
        .editor-text-bold { font-weight: bold; }
        .editor-text-italic { font-style: italic; }
        .editor-text-underline { text-decoration: underline; }
        .editor-input {
          min-height: 150px;
          outline: none;
          padding: 10px;
          position: relative;
        }
      `}</style>

      <div style={{ border: '1px solid #ccc', borderRadius: '4px', position: 'relative' }}>
        {/* Tunaita Toolbar yetu hapa juu ya sehemu ya kuandikia */}
        <ToolbarPlugin />
        
        <RichTextPlugin
          contentEditable={<ContentEditable className="editor-input" />}
          placeholder={
            <div style={{ color: '#aaa', position: 'absolute', top: '50px', left: '10px', pointerEvents: 'none' }}>
              Andika hapa, kisha weka "Highlight" kukoleza maandishi...
            </div>
          }
          ErrorBoundary={LexicalErrorBoundary}
        />
        <HistoryPlugin />
      </div>
    </LexicalComposer>
  );
}
