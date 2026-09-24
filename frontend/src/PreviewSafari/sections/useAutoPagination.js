import { useEffect, useRef, useState } from "react";

/**
 * Hupima urefu wa kila item kwenye list na kugawanya katika
 * makundi ya "page" kulingana na nafasi inayopatikana kwa kila A4 page.
 *
 * @param {Array} items - Data items
 * @param {number} availableHeight - Nafasi kwa page (CSS px) — karibu 680px kwa A4
 * @param {number} gapBetweenItems - Nafasi kati ya items (px), inalingana na space-y-2.5 = 10px
 * @returns {{ measureRef, pages, isReady }}
 */
export function useAutoPagination(items, availableHeight = 680, gapBetweenItems = 10) {
  const measureRef = useRef(null);
  const [pages, setPages] = useState(null);

  useEffect(() => {
    if (!items?.length) {
      setPages([[]]);
      return;
    }
    if (!measureRef.current) return;

    const run = () => {
      const container = measureRef.current;
      if (!container) return;

      const children = Array.from(container.children);
      const heights = children.map((c) => c.getBoundingClientRect().height);

      const result = [];
      let currentPage = [];
      let used = 0;

      for (let i = 0; i < items.length; i++) {
        const h = heights[i];
        const gapNeeded = currentPage.length > 0 ? gapBetweenItems : 0;

        if (used + h + gapNeeded > availableHeight && currentPage.length > 0) {
          result.push(currentPage);
          currentPage = [];
          used = 0;
        }

        currentPage.push(items[i]);
        used += h + (currentPage.length > 1 ? gapBetweenItems : 0);
      }

      if (currentPage.length > 0) result.push(currentPage);
      setPages(result.length ? result : [[]]);
    };

    // Subiri fonts zipaki kwanza (urefu wa text unategemea font)
    if (document.fonts?.ready) {
      document.fonts.ready.then(() => requestAnimationFrame(run));
    } else {
      requestAnimationFrame(run);
    }
  }, [items, availableHeight, gapBetweenItems]);

  return { measureRef, pages };
}

return(
      <div className="mt-auto break-inside-avoid pt-8 border-t border-[#B98B3E]/20">
        <PageFooter 
          pageNumber={3} 
          tourCode={tour_code} 
          clientName={clientName} 
          company={company_name} 
        />
      </div>
)