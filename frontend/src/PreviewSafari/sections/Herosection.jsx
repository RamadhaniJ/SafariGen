// import React from "react";
// import { Calendar, Users, MapPin, Phone, Mail, Sparkles, Plane, Map } from "lucide-react";
// import StatCard from "../shared/Stats";
// import { formatDate, calculateEndDate } from "../utils/ItineraryHelper";

// export default function HeroSection({ safariData }) {
//   const { hero_image, itinerary } = safariData || {};
//   const { client_info, days } = itinerary || {};

//   if (!client_info) return null;

//   const clientName = `${client_info.salutation || "Mr/Ms"}. ${client_info.first_name || ""} ${client_info.last_name || ""}`.trim();
//   const startDate = formatDate(client_info.tour_start_date);
//   const endDate = calculateEndDate(client_info.tour_start_date, client_info.tour_length);

//   const startDestination = client_info.start_destination || days[0]?.destination_info?.name || "N/A";
//   const endDestination = client_info.end_destination || days[days.length - 1]?.destination_info?.name || "N/A";

//   return (
//     <div className="relative mx-auto w-full min-h-[85vh] print:min-h-0 print:h-auto overflow-hidden print:overflow-visible bg-[#16211A]">
      
//       {/* Background Image */}
//       <div className="absolute inset-0">
//         <img 
//           src={hero_image || "/placeholder-safari.jpg"} 
//           alt="Safari Adventure" 
//           className="w-full h-full object-cover print:opacity-80"
//         />
//         {/* Premium Safari Palette Overlay (Deep Forest Green to Dark Earth) */}
//         <div className="absolute inset-0 bg-gradient-to-br from-[#16211A]/90 via-[#16211A]/80 to-[#2B2620]/90 print:from-[#16211A]/95 print:via-[#16211A]/95 print:to-[#2B2620]/95" />
//         <div className="absolute inset-0 bg-gradient-to-t from-[#16211A]/95 via-transparent to-[#16211A]/60" />
//       </div>

//       <div className="relative z-10 w-full max-w-6xl mx-auto px-6 sm:px-10 py-8 sm:py-12 flex flex-col print:py-6">
        
//         {/* Top Header Bar */}
//         <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-8 sm:mb-12 print:mb-6">
//           <div className="flex flex-wrap items-center gap-3">
//             <div className="bg-[#2B2620] border border-[#B98B3E]/30 rounded-lg px-4 py-2.5 shadow-lg print:shadow-none">
//               <h1 className="text-xs sm:text-sm font-bold text-[#F8F4EA] tracking-[0.15em] uppercase flex items-center gap-2">
//                 Safari Proposal
//               </h1>
//             </div>

//             <div className="bg-[#16211A]/60 backdrop-blur-md border border-[#B98B3E]/20 rounded-lg px-4 py-2.5 print:bg-[#16211A] print:backdrop-blur-none">
//               <p className="text-sm text-[#F8F4EA] font-medium whitespace-nowrap">
//                 Ref <span className="font-bold text-[#B98B3E]">#{client_info.tour_code}</span>
//               </p>
//             </div>
//           </div>

//           <div className="flex items-center justify-start sm:justify-end bg-[#F8F4EA] border border-[#B98B3E]/20 rounded-lg px-5 py-2.5 print:bg-[#F8F4EA]">
//             <p className="text-sm text-[#16211A] font-semibold">
//               Dear <span className="ddw-serif font-bold">{clientName}</span>
//             </p>
//           </div>
//         </div>

//         {/* Main Title Section */}
//         <div className="mb-10 print:mb-6">
//           <h1 className="ddw-serif text-5xl sm:text-6xl font-bold text-[#F8F4EA] leading-[1.1] tracking-tight flex items-center gap-4 mb-4">
//             <Plane className="w-8 h-8 sm:w-10 sm:h-10 text-[#B98B3E]" />
//             {client_info.tour_title}
//           </h1>

//           <div className="flex items-center gap-2 text-[#F8F4EA]/80">
//             <MapPin className="w-5 h-5 text-[#B98B3E]" />
//             <span className="text-lg sm:text-xl font-light tracking-wide">
//               {startDestination || "Start"} <span className="text-[#B98B3E] mx-1">→</span> {endDestination || "End"}
//             </span>
//           </div>
//         </div>

//         {/* Main Content Grid */}
//         <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start print:gap-6">
          
//           {/* Left Side - Welcome Message (Span 8) */}
//           <div className="lg:col-span-8 w-full space-y-6">
//             <div className="bg-[#2B2620]/70 backdrop-blur-xl border border-[#F8F4EA]/10 rounded-2xl p-6 sm:p-8 shadow-2xl print:bg-[#2B2620] print:backdrop-blur-none print:border-[#F8F4EA]/20 print:shadow-none print:break-inside-avoid">
//               <div className="space-y-5">
//                 <p className="text-xl sm:text-2xl text-[#F8F4EA] font-semibold ddw-serif">
//                   Dear {client_info.salutation || "Mr/Ms"}. {client_info.first_name}! 👋
//                 </p>

//                 <div className="space-y-4 text-[#F8F4EA]/90 leading-relaxed text-base sm:text-lg">
//                   <p>
//                     Thank you for reaching out! We are thrilled to share this custom-made{" "}
//                     <span className="font-bold text-[#B98B3E]">{client_info.tour_title}</span>{" "}
//                     Safari itinerary, tailored exclusively for you.
//                   </p>

//                   <p>
//                     Your unforgettable adventure begins on{" "}
//                     <span className="font-bold text-[#F8F4EA]">{startDate}</span>, right as you land at{" "}
//                     <span className="font-bold text-[#F8F4EA]">{client_info.start_destination || "your destination"}</span>.
//                   </p>

//                   <p>
//                     Please let us know if you would like to make any adjustments. We can't wait to help you bring this trip of a lifetime to reality! ✨
//                   </p>
//                 </div>

//                 <div className="pt-6 mt-6 border-t border-[#F8F4EA]/10 print:border-[#F8F4EA]/20">
//                   <p className="text-[#F8F4EA] font-bold text-lg mb-4 ddw-serif">Warm regards,</p>
                  
//                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//                     <div className="space-y-1">
//                       <p className="text-[#F8F4EA] font-bold text-base">
//                         {client_info.staff_full_name || "James Rashid"}
//                       </p>
//                       <p className="text-[#F8F4EA]/70 text-sm">
//                         {client_info.staff_company || "ACE"} Safaris Ltd.
//                       </p>
//                     </div>

//                     <div className="flex flex-col gap-3">
//                       <div className="flex items-center gap-3 text-[#F8F4EA]/90">
//                         <div className="p-1.5 bg-[#16211A] rounded-md border border-[#B98B3E]/20">
//                           <Phone className="w-4 h-4 text-[#B98B3E]" />
//                         </div>
//                         <span className="text-sm font-medium">
//                           {client_info.staff_phone || "+255 766 792 993"}
//                         </span>
//                       </div>
//                       <div className="flex items-center gap-3 text-[#F8F4EA]/90">
//                         <div className="p-1.5 bg-[#16211A] rounded-md border border-[#B98B3E]/20">
//                           <Mail className="w-4 h-4 text-[#B98B3E]" />
//                         </div>
//                         <span className="text-sm font-medium truncate">
//                           {client_info.staff_email || "info@safari.com"}
//                         </span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Right Side - Stats Cards (Span 4) */}
//           <div className="lg:col-span-4 w-full space-y-4 print:break-inside-avoid">
//             <div className="grid grid-cols-1 gap-4">
//               <StatCard
//                 icon={<Calendar className="w-6 h-6 text-[#B98B3E]" />}
//                 value={startDate}
//                 label="Start Date"
//               />
//               <StatCard
//                 icon={<Calendar className="w-6 h-6 text-[#B98B3E]" />}
//                 value={endDate}
//                 label="End Date"
//               />
//             </div>

//             <div className="grid grid-cols-1 gap-4">
//               <StatCard
//                 icon={<Users className="w-6 h-6 text-[#B98B3E]" />}
//                 value={client_info.total_travellers || "N/A"}
//                 label="Travellers"
//               />
//               <StatCard
//                 icon={<Map className="w-6 h-6 text-[#B98B3E]" />}
//                 value={`${client_info.tour_length || 0} ${client_info.tour_length === 1 ? 'Day' : 'Days'}`}
//                 label={`${(client_info.tour_length || 1) - 1} ${(client_info.tour_length || 1) - 1 === 1 ? 'Night' : 'Nights'}`}
//               />
//             </div>
//           </div>
//         </div>

//         {/* Footer */}
//         <div className="mt-12 pt-6 border-t border-[#F8F4EA]/10 print:border-[#F8F4EA]/20 flex flex-col sm:flex-row items-center justify-between gap-4 print:mt-auto">
//           <div className="text-center sm:text-left">
//             <p className="text-[#F8F4EA] font-bold text-lg ddw-serif">
//               {client_info.staff_company || "ACE"} Safaris Ltd.
//             </p>
//             <p className="text-[#F8F4EA]/60 text-sm">
//               {client_info.company_website || "www.safariadventures.com"}
//             </p>
//           </div>

//           <div className="flex items-center gap-3">
//             <div className="w-14 h-14 rounded-xl bg-[#F8F4EA]/10 backdrop-blur-md border border-[#F8F4EA]/20 flex items-center justify-center print:bg-[#F8F4EA] print:border-[#F8F4EA]">
//               <span className="text-lg font-black text-[#F8F4EA] print:text-[#16211A] tracking-tighter">LOGO</span>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Subtle Background Glows (Hidden in Print for Cleanliness) */}
//       <div className="absolute top-20 right-10 w-72 h-72 bg-[#B98B3E]/10 rounded-full blur-3xl animate-pulse print:hidden"></div>
//       <div className="absolute bottom-20 left-10 w-96 h-96 bg-[#F8F4EA]/5 rounded-full blur-3xl print:hidden"></div>
//     </div>
//   );
// }











import React from "react";
import { Calendar, Users, MapPin, Phone, Mail, Sparkles, Plane, Map } from "lucide-react";
import StatCard from "../shared/Stats";
import { formatDate, calculateEndDate } from "../utils/ItineraryHelper";

export default function HeroSection({ safariData }) {
  const { hero_image, itinerary } = safariData || {};
  const { client_info, days } = itinerary || {};

  if (!client_info) return null;

  const clientName = `${client_info.salutation || "Mr/Ms"}. ${client_info.first_name || ""} ${client_info.last_name || ""}`.trim();
  const startDate = formatDate(client_info.tour_start_date);
  const endDate = calculateEndDate(client_info.tour_start_date, client_info.tour_length);

  const startDestination =
    client_info.start_destination || days?.[0]?.destination_info?.name || "N/A";
  const endDestination =
    client_info.end_destination ||
    days?.[days.length - 1]?.destination_info?.name ||
    "N/A";

  return (
    // ✅ 1. Explicit A4 height. Hakuna h-full, hakuna min-h.
    <div className="relative w-full h-[297mm] bg-[#16211A] overflow-hidden">

      {/* ── Background ─────────────────────────────────── */}
      <div className="absolute inset-0 z-0">
        <img
          src={hero_image || "/placeholder-safari.jpg"}
          alt="Safari Adventure"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-[#16211A]/85" />
      </div>

      {/* ── Main Content — pb-28 inareserve nafasi ya footer ── */}
      <div className="relative z-10 w-full h-full flex flex-col px-10 pt-10 pb-28">

        {/* Top Header Bar */}
        <div className="flex flex-row items-center justify-between gap-4 mb-8">
          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-[#2B2620] border border-[#B98B3E]/30 rounded-lg px-4 py-2.5">
              <h1 className="text-sm font-bold text-[#F8F4EA] tracking-[0.15em] uppercase flex items-center gap-2">
                Safari Proposal
              </h1>
            </div>
            <div className="bg-[#16211A]/80 border border-[#B98B3E]/20 rounded-lg px-4 py-2.5">
              <p className="text-sm text-[#F8F4EA] font-medium whitespace-nowrap">
                Ref <span className="font-bold text-[#B98B3E]">#{client_info.tour_code}</span>
              </p>
            </div>
          </div>

          <div className="bg-[#F8F4EA] border border-[#B98B3E]/20 rounded-lg px-5 py-2.5">
            <p className="text-sm text-[#16211A] font-semibold">
              Dear <span className="ddw-serif font-bold">{clientName}</span>
            </p>
          </div>
        </div>

        {/* Main Title */}
        <div className="mb-8">
          <h1 className="ddw-serif text-5xl font-bold text-[#F8F4EA] leading-[1.1] tracking-tight flex items-start gap-4 mb-4">
            <Plane className="w-10 h-10 text-[#B98B3E] shrink-0 mt-2" />
            <span>{client_info.tour_title}</span>
          </h1>

          <div className="flex items-center gap-2 text-[#F8F4EA]/80">
            <MapPin className="w-5 h-5 text-[#B98B3E] shrink-0" />
            <span className="text-xl font-light tracking-wide">
              {startDestination}
              <span className="text-[#B98B3E] mx-2">→</span>
              {endDestination}
            </span>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-12 gap-6 items-start">
          {/* Left — Welcome card */}
          <div className="col-span-8 space-y-6">
            <div className="bg-[#2B2620]/80 border border-[#F8F4EA]/10 rounded-2xl p-8">
              <div className="space-y-5">
                <p className="text-2xl text-[#F8F4EA] font-semibold ddw-serif">
                  Dear {client_info.salutation || "Mr/Ms"}. {client_info.first_name}! 👋
                </p>

                <div className="space-y-4 text-[#F8F4EA]/90 leading-relaxed text-lg">
                  <p>
                    Thank you for reaching out! We are thrilled to share this custom-made{" "}
                    <span className="font-bold text-[#B98B3E]">{client_info.tour_title}</span>{" "}
                    Safari itinerary, tailored exclusively for you.
                  </p>
                  <p>
                    Your unforgettable adventure begins on{" "}
                    <span className="font-bold text-[#F8F4EA]">{startDate}</span>,
                    right as you land at{" "}
                    <span className="font-bold text-[#F8F4EA]">
                      {client_info.start_destination || "your destination"}
                    </span>.
                  </p>
                  <p>
                    Please let us know if you would like to make any adjustments. We
                    can't wait to help you bring this trip of a lifetime to reality! ✨
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-[#F8F4EA]/10">
                  <p className="text-[#F8F4EA] font-bold text-lg mb-4 ddw-serif">
                    Warm regards,
                  </p>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <p className="text-[#F8F4EA] font-bold text-base">
                        {client_info.staff_full_name || "James Rashid"}
                      </p>
                      <p className="text-[#F8F4EA]/70 text-sm">
                        {client_info.staff_company || "ACE"} Safaris Ltd.
                      </p>
                    </div>

                    <div className="flex flex-col gap-3">
                      <div className="flex items-center gap-3 text-[#F8F4EA]/90">
                        <div className="p-1.5 bg-[#16211A] rounded-md border border-[#B98B3E]/20">
                          <Phone className="w-4 h-4 text-[#B98B3E]" />
                        </div>
                        <span className="text-sm font-medium">
                          {client_info.staff_phone || "+255 766 792 993"}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-[#F8F4EA]/90">
                        <div className="p-1.5 bg-[#16211A] rounded-md border border-[#B98B3E]/20">
                          <Mail className="w-4 h-4 text-[#B98B3E]" />
                        </div>
                        <span className="text-sm font-medium truncate">
                          {client_info.staff_email || "info@safari.com"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right — Stats */}
          <div className="col-span-4 space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <StatCard
                icon={<Calendar className="w-6 h-6 text-[#B98B3E]" />}
                value={startDate}
                label="Start Date"
              />
              <StatCard
                icon={<Calendar className="w-6 h-6 text-[#B98B3E]" />}
                value={endDate}
                label="End Date"
              />
            </div>

            <div className="grid grid-cols-1 gap-4">
              <StatCard
                icon={<Users className="w-6 h-6 text-[#B98B3E]" />}
                value={client_info.total_travellers || "N/A"}
                label="Travellers"
              />
              <StatCard
                icon={<Map className="w-6 h-6 text-[#B98B3E]" />}
                value={`${client_info.tour_length || 0} ${
                  client_info.tour_length === 1 ? "Day" : "Days"
                }`}
                label={`${(client_info.tour_length || 1) - 1} ${
                  (client_info.tour_length || 1) - 1 === 1 ? "Night" : "Nights"
                }`}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ✅ 2. Footer — SIBLING ya content, sio mtoto wake. z-20 juu ya content. */}
      <div className="absolute bottom-0 left-0 right-0 z-20 px-10 pb-10">
        <div className="pt-6 border-t border-[#F8F4EA]/10 flex flex-row items-center justify-between gap-4">
          <div className="text-left">
            <p className="text-[#F8F4EA] font-bold text-lg ddw-serif">
              {client_info.staff_company || "ACE"}.
            </p>
            <p className="text-[#F8F4EA]/60 text-sm">
              {client_info.company_website || "www.safariadventures.com"}
            </p>
          </div>

          <div className="w-14 h-14 rounded-xl bg-[#F8F4EA]/10 border border-[#F8F4EA]/20 flex items-center justify-center">
            <span className="text-lg font-black text-[#F8F4EA] tracking-tighter">
              LOGO
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}