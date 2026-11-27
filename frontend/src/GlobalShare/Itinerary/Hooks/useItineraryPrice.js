// Live price while building or editing a quote.
//
// The price is NOT calculated in the browser any more. Shortly after each change,
// the screen sends the itinerary to the backend's price preview (the same pricing
// engine that runs when the quote is saved), so the number shown here is exactly
// the number that will be saved. Nothing is saved by the preview.

import { useEffect, useMemo, useRef, useState } from "react";
import api from "../../../Apis/api";
import buildDaysPayload from "../Helpers/buildDaysPayload";

const DEBOUNCE_MS = 350;

const EMPTY = {
  breakdown: [],
  subtotals: {
    parkFees: 0, concessionFees: 0, accommodationFees: 0,
    optionalActivities: 0, optionalMeals: 0, vehicleRental: 0,
  },
  subtotal: 0,
  commissionAmount: 0,
  grandTotal: 0,
  perPerson: 0,
  totalTravellers: 0,
  vehicleDetails: { vehiclesNeeded: 0, totalDays: 0, dailyRate: 0, totalCost: 0, source: null },
  missing: [],
  canSave: true,
};

const TYPE_BY_CATEGORY = {
  ACCOMMODATION: "accommodation",
  CONCESSION: "concession",
  PARK_FEE: "destination_fee",
  ACTIVITY: "activity",
  OPTIONAL_MEAL: "meal",
};

const num = (v) => Number(v) || 0;

function toScreenShape(data, nightsByDay) {
  const t = data.totals;
  const byDay = new Map();
  for (const line of data.lines) {
    if (line.category === "VEHICLE" || line.day_number === 0) continue;
    if (!byDay.has(line.day_number)) {
      const nights = nightsByDay.get(line.day_number) || 1;
      byDay.set(line.day_number, {
        dayIndex: line.day_number,
        endDaySpan: line.day_number + nights - 1,
        nights,
        dateDisplay: line.date_display,
        items: [],
      });
    }
    byDay.get(line.day_number).items.push({
      type: TYPE_BY_CATEGORY[line.category] || "other",
      label: line.item_title,
      description: line.item_description,
      amount: num(line.line_total),
    });
  }
  return {
    breakdown: [...byDay.values()].sort((a, b) => a.dayIndex - b.dayIndex),
    subtotals: {
      parkFees: num(t.park_fees),
      concessionFees: num(t.concession_fees),
      accommodationFees: num(t.accommodation),
      optionalActivities: num(t.activities),
      optionalMeals: num(t.optional_meals),
      vehicleRental: num(t.vehicle),
    },
    subtotal: num(t.subtotal),
    commissionAmount: num(t.commission_amount),
    grandTotal: num(t.grand_total),
    perPerson: num(t.price_per_person),
    totalTravellers: data.total_travellers,
    vehicleDetails: {
      vehiclesNeeded: data.vehicles_needed,
      totalDays: data.total_tour_days,
      dailyRate: num(data.vehicle_daily_rate),
      totalCost: num(t.vehicle),
      source: data.vehicle_rate_source,
    },
    // Prices that don't exist yet: shown in red, and the quote can't be saved.
    missing: data.missing || [],
    canSave: data.can_save !== false,
  };
}

/**
 * @param dayConfigs  the builder's day rows
 * @param clientInfo  the tour request (travellers and start date are sent, so edits count)
 * @param commissionPercentage  e.g. 10 for 10%
 * @param clientId    tour request id (defaults to clientInfo.id)
 * @returns pricing in the same shape the screens already use, plus
 *          commissionAmount, grandTotal, perPerson, missing, canSave, isCalculating, error
 */
export default function useItineraryPricingGlobal(dayConfigs, clientInfo, commissionPercentage = 0, clientId = null) {
  const [result, setResult] = useState(EMPTY);
  const [isCalculating, setIsCalculating] = useState(false);
  const [error, setError] = useState(null);
  const requestNo = useRef(0);

  const requestId = clientId || clientInfo?.id || null;
  const body = useMemo(() => {
    if (!requestId || !dayConfigs?.length) return null;
    const payload = {
      client_id: requestId,
      commission_percentage: Number(commissionPercentage) || 0,
      days: buildDaysPayload(dayConfigs),
    };
    if (clientInfo?.tour_start_date) payload.tour_start_date = clientInfo.tour_start_date;
    if (Array.isArray(clientInfo?.travellers)) {
      payload.travellers = clientInfo.travellers.map((t) => ({
        age_category: t.age_category,
        number: Number(t.number) || 0,
        is_resident: !!t.is_resident,
      }));
    }
    return payload;
  }, [requestId, dayConfigs, clientInfo?.tour_start_date, clientInfo?.travellers, commissionPercentage]);

  const bodyKey = useMemo(() => (body ? JSON.stringify(body) : ""), [body]);

  useEffect(() => {
    if (!body) {
      setResult(EMPTY);
      return undefined;
    }
    const mine = ++requestNo.current;
    const controller = new AbortController();
    setIsCalculating(true);
    const timer = setTimeout(async () => {
      try {
        const resp = await api.post("itinerary/price-preview/", body, { signal: controller.signal });
        if (mine !== requestNo.current) return;          // a newer change is on its way
        const nightsByDay = new Map(body.days.map((d) => [d.day_number, d.nights]));
        setResult(toScreenShape(resp.data, nightsByDay));
        setError(null);
      } catch (e) {
        if (controller.signal.aborted || mine !== requestNo.current) return;
        const data = e?.response?.data;
        setError(data?.detail || "Couldn't calculate the price right now. It will update when you change something.");
      } finally {
        if (mine === requestNo.current) setIsCalculating(false);
      }
    }, DEBOUNCE_MS);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
    // bodyKey captures every change to the request
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bodyKey]);

  return { ...result, isCalculating, error };
}
