import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../Apis/api";

import HeroSection from "./sections/Herosection";
import Page2Component from "./sections/Page2";
import Page3Component from "./sections/Page3";
import Page4Component from "./sections/page4";
import Page5Component from "./sections/page5";
import Page6MapComponent from "./sections/page6Map";
import PdfDayByDayComponent from "./sections/Pdf-day-by-day";
import CompanyAboutPage from "./sections/AboutPage";

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

export default function PrintPdfPage() {
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
        <HeroSection safariData={safariData} />
      </PageWrapper>

      <PageWrapper>
        <Page2Component safariData={safariData} />
      </PageWrapper>

      <PageWrapper>
        <Page3Component safariData={safariData} />
      </PageWrapper>

      <PageWrapper>
        <Page4Component safariData={safariData} />
      </PageWrapper>

      <PageWrapper>
        <Page5Component safariData={safariData} />
      </PageWrapper>

      <PageWrapper>
        <Page6MapComponent safariData={safariData} />
      </PageWrapper>

      <PageWrapper>
        <PdfDayByDayComponent safariData={safariData} />
      </PageWrapper>

      <PageWrapper>
        <CompanyAboutPage safariData={safariData} />
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