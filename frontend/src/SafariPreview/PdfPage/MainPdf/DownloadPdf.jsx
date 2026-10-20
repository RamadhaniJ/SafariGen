import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import api from "../../../Apis/api";
import PdfHeroSection from "../PdfSections/HeroSection";
import Page2PDFSection from "../PdfSections/Page2";
import Page3PDFSection from "../PdfSections/Page3";
import Page4PDFSection from "../PdfSections/Page4";
import Page5PDFSection from "../PdfSections/Page5";
import Page6MapPDFSection from "../PdfSections/Page6-Map";
import Page7PDFDayByDaySection from "../PdfSections/Page7-DaybyDay";
import Page8PDFCompanyAboutSection from "../PdfSections/Page8-About";

/** 
 * PageWrapper - Kila page ni A4 kamili.
 * Playwright anaheshimu hizi classes kwa page breaks.
 */
const PageWrapper = ({ children, isLast = false }) => (
  <div
    className={`
      relative bg-white w-full
      a4-page
      ${isLast ? "" : "break-after-page"}
    `}
  >
    {children}
  </div>
);
 
export default function ItineraryDownloadToPdf() {
  const { client_id, version_id } = useParams();
  const [safariData, setSafariData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const resp = await api.get(
          `itinerary/preview/client/safari/data/${client_id}/${version_id}/`
        );
        if (!cancelled) setSafariData(resp.data);
      } catch (err) {
        if (!cancelled) setError(err.message || "Failed to load");
      }
    }

    if (client_id) load();
    return () => { 
      cancelled = true;
    };
  }, [client_id]);

  // Fungua signal kwa Playwright: data imepakiwa
  useEffect(() => {
    if (safariData) {
      // Subiri picha zote zimalize (tutaongeza hadi 2s buffer)
      const allImgs = Array.from(document.images);
      const promises = allImgs.map((img) =>
        img.complete
          ? Promise.resolve()
          : new Promise((res) => {
              img.onload = res;
              img.onerror = res;
            })
      );
      Promise.all(promises).then(() => {
        // Subiri fonts pia
        if (document.fonts && document.fonts.ready) {
          document.fonts.ready.then(() => {
            window.__PDF_READY__ = true;
            console.log("[PrintPdfPage] ✅ Ready for PDF");
          });
        } else {
          window.__PDF_READY__ = true;
        }
      });
    }
  }, [safariData]);

  if (error) {
    return (
      <div className="p-8 text-red-600">
        Error: {error}
      </div>
    );
  }

  if (!safariData) {
    return <div className="p-8">Loading…</div>;
  }

  return (
    <div className="bg-white">
      <PageWrapper>
        <PdfHeroSection safariData={safariData} />
      </PageWrapper>

      <PageWrapper>
        <Page2PDFSection safariData={safariData} />
      </PageWrapper>

      <PageWrapper>
        <Page3PDFSection safariData={safariData} />
      </PageWrapper>

      <PageWrapper>
        <Page4PDFSection safariData={safariData} />
      </PageWrapper>

      <PageWrapper>
        <Page5PDFSection safariData={safariData} />
      </PageWrapper>

      <PageWrapper>
        <Page6MapPDFSection safariData={safariData} />
      </PageWrapper>

      <PageWrapper>
        <Page7PDFDayByDaySection safariData={safariData} />
      </PageWrapper>

      <PageWrapper>
        <Page8PDFCompanyAboutSection safariData={safariData} />
      </PageWrapper>

      {/* Back cover */}
      <PageWrapper isLast>
        <div className="flex items-center justify-center min-h-[1123px] text-center p-12 space-y-6">
          <div className="space-y-6">
            <div className="w-16 h-16 mx-auto rounded-full bg-[#F8F4EA] flex items-center justify-center border border-[#B98B3E]/20">
              <span className="text-2xl">✨</span>
            </div>
            <h2 className="text-4xl font-bold text-[#16211A] ddw-serif">
              End of Proposal
            </h2>
            <div className="h-px w-24 bg-[#B98B3E] mx-auto" />
            <p className="text-[#6B6153] text-lg max-w-md mx-auto leading-relaxed">
              We look forward to welcoming you on this incredible journey.
            </p>
            <p className="text-sm text-[#B98B3E] font-bold uppercase tracking-widest pt-4">
              {safariData?.itinerary?.client_info?.staff_company || "ACE"} Safaris Ltd.
            </p>
          </div>
        </div>
      </PageWrapper>
    </div>
  );
}