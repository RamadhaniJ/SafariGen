import { useState } from "react";
import {
  X,
  ChevronDown,
  PlusCircle,
  Users,
  Calendar,
  MapPin,
  Wallet,
  CheckCircle2,
  Receipt,
} from "lucide-react";
import { formatDate } from "../Utils/ItineraryHelper";

export default function PriceBreakdownSideBarSubSection({
  safariData, 
  onClose,
}) {
  const { itinerary } = safariData || {};
  const { client_info, days, map_image_url } = itinerary || {};

  // Collapsible section states
  const [showInclusions, setShowInclusions] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [showOptional, setShowOptional] = useState(false);

  // Dummy data (keep as provided, but ensure fields match)
  const DUMMY_INCLUDED = [
    "All accommodation during the safari itinerary",
    "Professional, English-speaking safari guide and driver",
    "Private 4x4 safari vehicle with a pop-up roof for game viewing",
    "All national park entrance fees and concession fees",
    "Full board meals (Breakfast, Lunch, and Dinner as specified)",
    "Complimentary bottled drinking water inside the safari vehicle",
    "All game drives scheduled in the itinerary",
    "Ngorongoro Crater service fees (if applicable)",
    "Government taxes and VAT on tourism services",
    "AMREF Flying Doctors emergency medical evacuation insurance",
  ];

  const DUMMY_EXCLUDED = [
    "Additional accommodation before and at the end of the tour",
    "International and domestic flights (unless specified otherwise)",
    "Entry visas for the destination country",
    "Tips and gratuities for the safari guide and camp staff",
    "Travel, medical, and baggage insurance",
    "Premium alcoholic beverages and soft drinks at the lodges",
  ];

  const OPTIONAL_FOOD = [
    {
      name: "Bush Dinner",
      day: "Day 1",
      destination: "Serengeti Np",
      pricing: "$200",
      pricingPer: "Per Person",
      howToBook: "Book with us before trip",
    },
    {
      name: "Bush Drinks",
      day: "Day 5",
      destination: "Lake Manyara Np",
      pricing: "$200",
      pricingPer: "Per Person",
      howToBook: "Book with us before trip",
    },
  ];

  const OPTIONAL_ACTIVITIES = [
    {
      name: "Balloon Safari",
      day: "Day 1",
      destination: "Serengeti Np",
      pricing: "$200",
      pricingPer: "Per Person",
      howToBook: "Book with us before trip",
    },
  ];

  // Merge optional food and activities for the table
  const optionalOptions = [...OPTIONAL_FOOD, ...OPTIONAL_ACTIVITIES];

  // Safely format grand total
  const grandTotal = map_image_url?.grand_total || client_info?.grand_total || 0;
  const formattedGrandTotal = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(grandTotal);

  const pricePerPerson = map_image_url?.price_per_person || 0;
  const formattedPricePerPerson = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(pricePerPerson);

  const tourLength = client_info?.tour_length || 0;
  const tourNights = tourLength - 1;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-stone-900/20 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Slide-over panel */}
      <div className="relative h-full w-full max-w-2xl bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-out">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-200 px-6 py-4 bg-white/95 backdrop-blur">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold tracking-tight text-stone-900">
              Detailed Price Information
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-stone-500 hover:bg-stone-100 hover:text-stone-800 transition-colors"
            aria-label="Close panel"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8">
          {/* Tour Overview */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                Tour Overview
              </h3>
              <span className="text-xs text-stone-400">
                {tourLength} {tourLength === 1 ? "Day" : "Days"} /{" "}
                {tourNights} {tourNights === 1 ? "Night" : "Nights"}
              </span>
            </div>
            <h4 className="text-xl font-bold text-stone-900 mb-4">
              {client_info?.tour_title || "Safari Adventure"}
            </h4>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <Calendar className="h-4 w-4 mt-0.5 text-stone-400" />
                <div>
                  <p className="text-xs text-stone-500">Start Date</p>
                  <p className="text-sm font-medium text-stone-800">
                    {formatDate(client_info?.tour_start_date)}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="h-4 w-4 mt-0.5 text-stone-400" />
                <div>
                  <p className="text-xs text-stone-500">End Date</p>
                  <p className="text-sm font-medium text-stone-800">
                    {formatDate(
                      (client_info?.tour_start_date || 0) + tourLength - 1
                    )}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 mt-0.5 text-stone-400" />
                <div>
                  <p className="text-xs text-stone-500">Start Destination</p>
                  <p className="text-sm font-medium text-stone-800">
                    {client_info?.start_destination || "Arusha"}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 mt-0.5 text-stone-400" />
                <div>
                  <p className="text-xs text-stone-500">End Destination</p>
                  <p className="text-sm font-medium text-stone-800">
                    {client_info?.end_destination || "Arusha"}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Breakdown of Cost */}
          <section className="bg-stone-50 rounded-xl p-5 border border-stone-100">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-500 mb-4">
              Breakdown of Cost
            </h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <Users className="h-5 w-5 mx-auto text-stone-400 mb-1" />
                <p className="text-xs text-stone-500">Total Travellers</p>
                <p className="text-lg font-bold text-stone-900">
                  {client_info?.total_travellers || 0}
                </p>
              </div>
              <div>
                <Wallet className="h-5 w-5 mx-auto text-stone-400 mb-1" />
                <p className="text-xs text-stone-500">Per Person</p>
                <p className="text-lg font-bold text-stone-900">
                  {formattedPricePerPerson}
                </p>
              </div>
              <div>
                <CheckCircle2 className="h-5 w-5 mx-auto text-stone-400 mb-1" />
                <p className="text-xs text-stone-500">Grand Total</p>
                <p className="text-lg font-bold text-stone-900">
                  {formattedGrandTotal}
                </p>
              </div>
            </div>
          </section>

          {/* Inclusions & Exclusions (collapsible) */}
          <section className="border border-stone-200 rounded-xl overflow-hidden">
            <button
              onClick={() => setShowInclusions(!showInclusions)}
              className="w-full flex items-center justify-between px-5 py-4 bg-white hover:bg-stone-50 transition-colors"
            >
              <span className="flex items-center gap-2 text-sm font-semibold text-stone-900">
                <PlusCircle className="h-4 w-4 text-stone-500" />
                Inclusions & Exclusions
              </span>
              <ChevronDown
                className={`h-4 w-4 text-stone-500 transition-transform duration-200 ${
                  showInclusions ? "rotate-180" : ""
                }`}
              />
            </button>
            {showInclusions && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 px-5 py-4 bg-stone-50 border-t border-stone-200">
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-emerald-600 mb-3">
                    Included
                  </h4>
                  <ul className="space-y-2">
                    {DUMMY_INCLUDED.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-stone-700">
                        <CheckCircle2 className="h-4 w-4 mt-0.5 text-emerald-500 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-rose-600 mb-3">
                    Excluded
                  </h4>
                  <ul className="space-y-2">
                    {DUMMY_EXCLUDED.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-stone-700">
                        <X className="h-4 w-4 mt-0.5 text-rose-500 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </section>

          {/* Payment Terms (collapsible) */}
          <section className="border border-stone-200 rounded-xl overflow-hidden">
            <button
              onClick={() => setShowPayment(!showPayment)}
              className="w-full flex items-center justify-between px-5 py-4 bg-white hover:bg-stone-50 transition-colors"
            >
              <span className="flex items-center gap-2 text-sm font-semibold text-stone-900">
                <Wallet className="h-4 w-4 text-stone-500" />
                Payment Terms
              </span>
              <ChevronDown
                className={`h-4 w-4 text-stone-500 transition-transform duration-200 ${
                  showPayment ? "rotate-180" : ""
                }`}
              />
            </button>
            {showPayment && (
              <article className="px-5 py-4 bg-stone-50 border-t border-stone-200 space-y-6 text-sm text-stone-700">
                <div className="space-y-2">
                  <h4 className="text-lg font-semibold text-stone-900">
                    Payment Terms & Policies
                  </h4>
                  <p className="leading-relaxed">
                    Thank you for choosing our services. We look forward to
                    creating an unforgettable safari experience for you.
                  </p>
                </div>
                <section className="space-y-2">
                  <h5 className="font-semibold text-stone-900">
                    Deposit Requirement
                  </h5>
                  <p className="leading-relaxed">
                    A deposit of{" "}
                    <strong className="font-semibold">30% of the total safari cost</strong>{" "}
                    is required at the time of booking confirmation. This deposit
                    is non-refundable and serves to lock in park permits,
                    accommodation bookings, and guide availability.
                  </p>
                </section>
                <section className="space-y-2">
                  <h5 className="font-semibold text-stone-900">
                    Final Payment
                  </h5>
                  <p className="leading-relaxed">
                    The remaining balance must be fully settled at least{" "}
                    <strong className="font-semibold">30 days prior to your arrival date</strong>.
                    For bookings made within 30 days of arrival, full payment is
                    required immediately upon confirmation.
                  </p>
                </section>
                <section className="space-y-2">
                  <h5 className="font-semibold text-stone-900">
                    Payment Methods & Fees
                  </h5>
                  <p className="leading-relaxed">
                    Payments can be processed through the following channels:
                  </p>
                  <ul className="list-disc list-inside space-y-1 pl-4">
                    <li>Direct Bank Wire Transfer</li>
                    <li>Credit / Debit Card Online Payment</li>
                  </ul>
                </section>
                <section className="space-y-2">
                  <h5 className="font-semibold text-stone-900">
                    Currency & Itinerary Changes
                  </h5>
                  <p className="leading-relaxed">
                    All prices are quoted in{" "}
                    <strong className="font-semibold">US Dollars (USD)</strong>{" "}
                    unless explicitly stated otherwise. Any requested
                    modifications to confirmed itineraries are subject to
                    availability and may incur additional tariff adjustments.
                  </p>
                </section>
                <section className="space-y-2">
                  <h5 className="font-semibold text-stone-900">
                    Late Payments & Cancellations
                  </h5>
                  <p className="leading-relaxed">
                    Failure to complete payments within the specified deadlines
                    may result in automatic cancellation of the booking and
                    reserved accommodations without prior notice.
                  </p>
                </section>
              </article>
            )}
          </section>

          {/* Optional Options (collapsible) */}
          <section className="border border-stone-200 rounded-xl overflow-hidden">
            <button
              onClick={() => setShowOptional(!showOptional)}
              className="w-full flex items-center justify-between px-5 py-4 bg-white hover:bg-stone-50 transition-colors"
            >
              <span className="flex items-center gap-2 text-sm font-semibold text-stone-900">
                <PlusCircle className="h-4 w-4 text-stone-500" />
                Optional Enhancements
              </span>
              <ChevronDown
                className={`h-4 w-4 text-stone-500 transition-transform duration-200 ${
                  showOptional ? "rotate-180" : ""
                }`}
              />
            </button>
            {showOptional && (
              <div className="px-5 py-4 bg-stone-50 border-t border-stone-200 overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[500px]">
                  <thead>
                    <tr className="border-b border-stone-200 text-xs font-semibold uppercase tracking-wider text-stone-500">
                      <th className="py-3 pr-4">Option</th>
                      <th className="py-3 px-4">Day</th>
                      <th className="py-3 px-4">Destination</th>
                      <th className="py-3 px-4">Price</th>
                      <th className="py-3 pl-4 text-right">How to Book</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200">
                    {optionalOptions.map((item, idx) => (
                      <tr key={idx} className="text-sm text-stone-700">
                        <td className="py-3 pr-4 font-medium text-stone-900">
                          {item.name}
                        </td>
                        <td className="py-3 px-4">{item.day}</td>
                        <td className="py-3 px-4">{item.destination}</td>
                        <td className="py-3 px-4 font-semibold">
                          {item.pricing}
                          {item.pricingPer && (
                            <span className="text-xs font-normal text-stone-500">
                              {" "}
                              / {item.pricingPer}
                            </span>
                          )}
                        </td>
                        <td className="py-3 pl-4 text-right text-stone-500">
                          {item.howToBook}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>

        {/* Sticky footer */}
        <div className="border-t border-stone-200 bg-white px-6 py-4">
          <button
            onClick={() => toast.success("Booking confirmed!")}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-stone-900 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-stone-800 transition-colors active:scale-[0.98]"
          >
            <CheckCircle2 className="h-4 w-4 text-amber-400" />
            Confirm Booking
          </button>
        </div>
      </div>
    </div>
  );
}