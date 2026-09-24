import React from "react";
import { 
  Lock, Clock, CreditCard, Globe, AlertTriangle, 
  FileText, ShieldCheck 
} from "lucide-react";
import PageFooter from "../shared/pageFooter";

export default function Page3Component({ safariData }) {
  const { itinerary } = safariData || {};
  const { client_info } = itinerary || {};

  if (!client_info) return null;

  const clientName = `${client_info.salutation || "Mr/Ms"}. ${client_info.first_name || ""} ${client_info.last_name || ""}`.trim();
  const tour_code = client_info.tour_code || "N/A";
  const company_name = client_info.staff_company || "ACE";

  // Structured policy data for clean, consistent rendering
  const policies = [
    {
      id: "deposit",
      icon: <Lock className="w-5 h-5 text-[#B98B3E]" />,
      title: "Deposit Requirement",
      content: (
        <p className="text-[#3D4A3F] leading-relaxed">
          A deposit of <strong className="text-[#16211A] font-bold">30% of the total safari cost</strong> is required at the time of booking confirmation. This deposit is non-refundable and serves to lock in park permits, accommodation bookings, and guide availability. Reservations will only be secured once the cleared deposit has been officially received.
        </p>
      )
    },
    {
      id: "final-payment",
      icon: <Clock className="w-5 h-5 text-[#B98B3E]" />,
      title: "Final Payment",
      content: (
        <p className="text-[#3D4A3F] leading-relaxed">
          The remaining balance must be fully settled at least <strong className="text-[#16211A] font-bold">30 days prior to your arrival date</strong>. For bookings made within 30 days of arrival, full payment is required immediately upon confirmation to guarantee all services.
        </p>
      )
    },
    {
      id: "methods",
      icon: <CreditCard className="w-5 h-5 text-[#B98B3E]" />,
      title: "Payment Methods",
      content: (
        <div className="space-y-3">
          <p className="text-[#3D4A3F] leading-relaxed">
            Payments can be securely processed through the following channels:
          </p>
          <ul className="space-y-2">
            {[
              "Direct Bank Wire Transfer (Details provided upon invoice request)",
              "Credit / Debit Card Online Payment (Secure gateway)"
            ].map((method, idx) => (
              <li key={idx} className="flex items-start gap-3 text-[#3D4A3F]">
                <ShieldCheck className="w-4 h-4 text-[#24352A] shrink-0 mt-1" />
                <span className="font-medium text-[#16211A]">{method}</span>
              </li>
            ))}
          </ul>
        </div>
      )
    },
    {
      id: "currency",
      icon: <Globe className="w-5 h-5 text-[#B98B3E]" />,
      title: "Currency & Itinerary Changes",
      content: (
        <p className="text-[#3D4A3F] leading-relaxed">
          All prices are quoted in <strong className="text-[#16211A] font-bold">US Dollars (USD)</strong> unless explicitly stated otherwise. Any requested modifications to confirmed itineraries are subject to availability and may incur additional tariff adjustments or vendor cancellation fees.
        </p>
      )
    },
    {
      id: "cancellation",
      icon: <AlertTriangle className="w-5 h-5 text-[#9C5B3C]" />,
      title: "Late Payments & Cancellations",
      content: (
        <p className="text-[#3D4A3F] leading-relaxed">
          Failure to complete payments within the specified deadlines may result in the <strong className="text-[#9C5B3C] font-bold">automatic cancellation</strong> of the booking and reserved accommodations without prior notice, subject to the vendor's specific cancellation policies.
        </p>
      )
    }
  ];

  return (
    <div className="pdf-section w-full mx-auto max-w-6xl px-8 sm:px-12 py-6 text-[#2B2620] font-sans bg-white">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="bg-[#2B2620] text-[#F8F4EA] rounded-lg px-5 py-2.5 shadow-sm">
          <h1 className="text-xs font-bold tracking-[0.15em] uppercase">
            Payment & Policies
          </h1>
        </div>
      </div>

      {/* Main Content Area */}
      <article className="space-y-8 w-full mt-6">
        
        {/* Main Title Section */}
        <div className="space-y-3 w-full border-b border-[#B98B3E]/30 pb-4">
          <h1 className="ddw-serif text-3xl sm:text-4xl text-[#16211A] tracking-tight flex items-center gap-3">
            <FileText className="w-8 h-8 text-[#B98B3E]" />
            Terms & Guidelines
          </h1>
          <p className="text-base sm:text-lg text-[#6B6153] italic ddw-serif max-w-3xl">
            To confirm and secure your safari reservation, the following terms and guidelines apply.
          </p>
        </div>

        {/* Policy Sections Grid */}
        <div className="space-y-5">
          {policies.map((policy) => (
            <section 
              key={policy.id} 
              className="bg-[#F8F4EA]/30 border border-[#B98B3E]/10 rounded-xl p-6 sm:p-7 shadow-sm  border-[#E0D8C8] break-inside-avoid"
            >
              <div className="flex items-start gap-4">
                <div className="p-2.5 bg-white rounded-lg border border-[#B98B3E]/15 shrink-0 shadow-sm">
                  {policy.icon}
                </div>
                <div className="flex-1 space-y-3">
                  <h2 className="text-lg sm:text-xl font-bold text-[#16211A] tracking-wide ddw-serif">
                    {policy.title}
                  </h2>
                  {policy.content}
                </div>
              </div>
            </section>
          ))}
        </div>

        {/* Closing Note */}
        <div className="mt-8 p-6 bg-[#24352A] rounded-xl text-center border border-[#24352A] text-[#24352A]">
          <p className="text-base sm:text-lg leading-relaxed ddw-serif italic text-white">
            "Thank you for choosing our services. We look forward to creating an unforgettable safari experience for you."
          </p>
        </div>

      </article>

    </div>
  );
}