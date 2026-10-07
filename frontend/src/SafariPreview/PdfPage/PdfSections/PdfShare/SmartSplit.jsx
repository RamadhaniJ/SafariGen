// ── PdfShare/PdfBookPage.jsx ──
// Reusable book page wrapper that auto-splits content across pages
// when it overflows A4 height.
import React from "react";
import { GrainOverlay, CompassRose, PageRails } from "./ShareSection";

const A4_CONTENT_MM = 260; // 297mm - 36mm padding (18mm × 2)

/* ── Split sections across pages by estimated weight (mm) ── */
function splitSections({ sections, opener, openerWeight = 60, footer, footerWeight = 80 }) {
  const pages = [];
  let current = [];
  let used = opener ? openerWeight : 0;

  for (const section of sections) {
    const w = section.weight || 50;
    if (used + w > A4_CONTENT_MM && current.length > 0) {
      pages.push(current);
      current = [];
      used = 0;
    }
    current.push(section);
    used += w;
  }

  // Try to fit footer on last page, or push to new page
  if (footer) {
    if (used + footerWeight <= A4_CONTENT_MM) {
      current.push({ id: "__footer__", element: footer, weight: footerWeight });
    } else {
      pages.push(current);
      current = [{ id: "__footer__", element: footer, weight: footerWeight }];
    }
  }

  if (current.length > 0) pages.push(current);
  return pages;
}

/* ── Single page shell ── */
function SingleBookPage({
  pageIdx,
  totalPages,
  tourCode,
  leftRailLabel,
  rightRailTopLabel,
  watermarkSide,
  opener,
  sections,
  isLastPage,
  footer,
  children,
}) {
  const side =
    pageIdx % 2 === 0
      ? watermarkSide
      : watermarkSide === "right"
      ? "left"
      : "right";

  const compassClass =
    side === "right"
      ? "absolute -bottom-24 -right-24 h-[400px] w-[400px] opacity-[0.06]"
      : "absolute -bottom-24 -left-24 h-[400px] w-[400px] opacity-[0.06]";

  return (
    <div
      className="pdf-section relative w-full bg-[#F8F4EA] text-[#0F1A14]
                 [-webkit-print-color-adjust:exact] [print-color-adjust:exact]"
      style={{ pageBreakAfter: isLastPage ? "auto" : "always" }}
    >
      {/* Cream tint */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, #FDFBF6 0%, #F8F4EA 55%, #EFE8DA 100%)",
        }}
      />

      <CompassRose className={compassClass} stroke="#8A6528" />
      <GrainOverlay opacity={0.035} blend="multiply" />

      {/* Rails */}
      <PageRails
        leftLabel={`${leftRailLabel}${
          totalPages > 1 && pageIdx > 0 ? " · Continued" : ""
        }`}
        rightTop={rightRailTopLabel}
        rightValue={tourCode}
        theme="cream"
      />

      {/* Content */}
      <div className="relative z-10 w-full px-[22mm] py-[18mm]">
        {opener}

        {/* "Continued" indicator on pages 2+ */}
        {pageIdx > 0 && !opener && (
          <div className="mb-6 flex items-center gap-3 border-b border-[#B98B3E]/35 pb-4">
            <span className="h-px w-8 bg-[#B98B3E]" />
            <span className="text-[9.5px] font-bold uppercase tracking-[0.38em] text-[#8A6528]">
              {leftRailLabel} · Continued
            </span>
          </div>
        )}

        {/* Sections */}
        <div className="space-y-4">
          {sections
            .filter((s) => s.id !== "__footer__")
            .map((s) => (
              <div key={s.id} className="break-inside-avoid">
                {s.element}
              </div>
            ))}
        </div>

        {/* Footer if last page */}
        {isLastPage && footer}

        {children}
      </div>
    </div>
  );
}

/* ── Public component ── */
export default function PdfBookPage({
  tourCode = "—",
  leftRailLabel = "Proposal",
  rightRailTopLabel = "Reference",
  watermarkSide = "right",

  opener,
  openerWeight = 60,

  sections = [],
  footer,
  footerWeight = 80,
}) {
  const pages = splitSections({
    sections,
    opener,
    openerWeight,
    footer,
    footerWeight,
  });

  return (
    <>
      {pages.map((pageSections, pageIdx) => (
        <SingleBookPage
          key={pageIdx}
          pageIdx={pageIdx}
          totalPages={pages.length}
          tourCode={tourCode}
          leftRailLabel={leftRailLabel}
          rightRailTopLabel={rightRailTopLabel}
          watermarkSide={watermarkSide}
          opener={pageIdx === 0 ? opener : null}
          sections={pageSections}
          isLastPage={pageIdx === pages.length - 1}
          footer={footer}
        />
      ))}
    </>
  );
}