// import { MapIcon } from "lucide-react";
// import PageFooter from "../shared/pageFooter";



// export default function Page6MapComponent({ safariData }) {

//     const { hero_image,itinerary } = safariData || {};
//     const { client_info, days, map_image_url  } = itinerary || {};

//     if (!client_info) return null;

//     return(
//         <div> 
//              <section className="w-full max-w-5xl mx-auto px-6 py-12 text-slate-100 font-sans">
//                 {/* header  */}
//          <div className="flex flex-col w-full sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#E0D8C8]/60 pb-5">
//           <div className="flex items-center gap-3">
//             <span className="bg-[#2B2620] text-[#F8F4EA] text-xs font-bold tracking-wider uppercase px-4 py-2 rounded-xl shadow-xs">
//               Journey Overview
//             </span>
//           </div>

//         </div>
//                   <div className="flex flex-col gap-10">
                    
//                     {/* Safari Route Interactive Map Card */}
//                     {map_image_url && (
//                       <div className="relative group rounded-3xl overflow-hidden border border-white/10 bg-zinc-900/60 backdrop-blur-xl shadow-2xl transition-all duration-500 hover:border-white/20">
            
//                         {/* Image Container with Subtle Zoom on Hover */}  this is a map image from map box 
//                         <div className="relative w-full overflow-hidden bg-zinc-950">
//                           <img
//                             src={map_image_url}
//                             alt="Safari Route Map"
//                             className="w-full h-auto object-cover transform transition-transform duration-700 ease-out group-hover:scale-[1.02]"
//                           />
//                           <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/60 via-transparent to-transparent pointer-events-none" />
//                         </div>
//                       </div>
//                     )}


//             <div className="mb-8">
//              <h3 className="text-2xl font-bold text-slate-900 mb-4">Day by Day Overview</h3>
//              <div className="flex items-center justify-between">
//                <div>
//                   <MapIcon/> <h1> Start Point {client_info.start_destination}</h1>
//                 </div> 

//                  <div>
//                      <MapIcon/> <h1> End Point {client_info.end_destination}</h1>
//                 </div> 
//              </div>

//              <div className="overflow-x-auto">
//                <table className="w-full">
//                  <thead>
//                    <tr className="border-b-2 border-slate-200 bg-slate-50">
//                      <th className="text-left py-3 px-4 font-bold text-slate-900">Day</th>
//                      <th className="text-left py-3 px-4 font-bold text-slate-900">Destination</th>
//                      <th className="text-left py-3 px-4 font-bold text-slate-900">Accommodation</th>
//                    </tr>
//                  </thead>
//                  <tbody>
//                    {days.map((day, idx) => (
//                     <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50">
//                       <td className="py-4 px-4">
//                         <p className="font-bold text-slate-900">
//                           {day.nights_number > 1
//                             ? `Day ${day.day_number}-${day.day_number + day.nights_number - 1}`
//                             : `Day ${day.day_number}`}
//                         </p>
//                         <p className="text-sm text-slate-500">{day.date_display}</p>
//                       </td>
//                       <td className="py-4 px-4 text-slate-700">{day.destination_info?.name}</td>
//                       <td className="py-4 px-4">
//                         <p className="font-medium text-slate-900">{day.accommodation_info?.name || "No Accommodation"}</p>
//                       </td>

//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
            

//                  </div>
            
//                 </section>

//                       <div className="mt-auto break-inside-avoid pt-6">
//                         <PageFooter 
//                           pageNumber={4} 
//                           tourCode={tour_code} 
//                           clientName={clientName} 
//                           company={company_name} 
//                         />
//                       </div>
//         </div>
//     )
    
// }






import React from "react";
import { MapPin, Navigation, Calendar, Tent } from "lucide-react";
import PageFooter from "../shared/pageFooter";

export default function Page6MapComponent({ safariData }) {
  const { itinerary } = safariData || {};
  const { client_info, days = [], map_image_url } = itinerary || {};

  if (!client_info) return null;

  // Safe data extraction with fallbacks
  const clientName = `${client_info.salutation || "Mr/Ms"}. ${client_info.first_name || ""} ${client_info.last_name || ""}`.trim();
  const tour_code = client_info.tour_code || "N/A";
  const company_name = client_info.staff_company || "ACE";

  // Fallback for start/end destinations if not explicitly in client_info
  const startDestination = client_info.start_destination || days[0]?.destination_info?.name || "N/A";
  const endDestination = client_info.end_destination || days[days.length - 1]?.destination_info?.name || "N/A";

  return (
    <div className="pdf-section w-full max-w-5xl mx-auto px-6 sm:px-10 py-8 text-[#2B2620]  font-sans bg-white">
      
      {/* Main Content Area */}
      <div className="w-full space-y-8">
        
        {/* Header Bar */}
        <div className="w-full flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="bg-[#2B2620] text-[#F8F4EA] rounded-lg px-5 py-2.5 shadow-sm">
            <h1 className="text-xs font-bold tracking-[0.15em] uppercase">
              Route & Summary
            </h1>
          </div>
        </div>

        {/* Section Title */}
        <div className="w-full border-b border-[#B98B3E]/30 pb-3">
          <h2 className="ddw-serif text-3xl sm:text-4xl text-[#16211A] tracking-tight">
            Journey Overview 
          </h2>
        </div>

        {/* Mapbox Map Card */}
        {map_image_url?.map_image && (
           <div className="w-full rounded-xl overflow-hidden border border-[#B98B3E]/20 shadow-sm border-[#E0D8C8]">
               <img 
                 src={map_image_url.map_image} 
                 alt="Safari Route Map" 
                 className="w-full h-auto object-cover" 
               />
               {/* Elegant Pricing Overlay utilizing backend data */}

         <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#F8F4EA]/50 border border-[#B98B3E]/10 rounded-xl p-5">
            <div className="flex items-center gap-4">
              <div className="p-2.5 bg-[#2B2620] rounded-lg shrink-0">
                <Navigation className="w-5 h-5 text-[#B98B3E]" />
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#6B6153] font-bold block mb-0.5">
                  Starting Point
                </span>
                <p className="text-base font-bold text-[#16211A] ddw-serif">
                  {startDestination}
                </p>
              </div>
            </div>

            {/* Elegant Dashed Connector for Desktop */}
            <div className="hidden sm:flex flex-1 items-center justify-center px-4">
               <div className="h-px flex-1 bg-[#B98B3E]/30 border-t border-dashed border-[#B98B3E]/60" />
               <MapPin className="w-4 h-4 text-[#B98B3E] mx-2" />
               <div className="h-px flex-1 bg-[#B98B3E]/30 border-t border-dashed border-[#B98B3E]/60" />
            </div>

            <div className="flex items-center gap-4">
              <div className="p-2.5 bg-[#2B2620] rounded-lg shrink-0">
                <MapPin className="w-5 h-5 text-[#B98B3E]" />
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#6B6153] font-bold block mb-0.5">
                  Ending Point
                </span>
                <p className="text-base font-bold text-[#16211A] ddw-serif">
                  {endDestination}
                </p>
              </div>
            </div>
          </div>
              
          </div>
        )}

        {/* Route Points & Day-by-Day Table */}
        <div className="w-full space-y-6">
        
          {/* Premium Day-by-Day Summary Table */}
          <div>
            <h1 className="text-[#2B2620]  text-3xl" >Map Summary.</h1>
          </div>

          <div className="bg-white border border-[#B98B3E]/15 rounded-xl overflow-hidden shadow-sm break-inside-avoid">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                
                <thead>
                  <tr className="bg-[#2B2620] text-[#F8F4EA] text-[11px] font-bold tracking-widest uppercase">
                    <th className="py-4 px-6 w-1/4">Schedule</th>
                    <th className="py-4 px-6 w-1/3">Destination</th>
                    <th className="py-4 px-6 w-5/12">Accommodation</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#B98B3E]/10 text-sm text-[#3D4A3F]">
                  {days.map((day, idx) => (
                    <tr key={day.id || idx} className="break-inside-avoid">
                      
                      {/* Day & Date */}
                      <td className="py-4 px-6 align-top">
                        <div className="font-bold text-[#16211A] flex items-center gap-2 mb-1">
                          <span className="ddw-serif text-base">
                            {day.nights_number > 1
                              ? `Days ${day.day_number}–${day.day_number + day.nights_number - 1}`
                              : `Day ${day.day_number}`}
                          </span>
                          {day.nights_number > 1 && (
                            <span className="text-[10px] font-medium text-[#9C5B3C]">
                              {day.nights_number} Nights
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Destination */}
                      <td className="py-4 px-6 align-top font-medium text-[#16211A]">
                        {day.destination_info?.name || "En Route / Transit"}
                        {day.destination_info?.location && (
                          <p className="text-xs text-[#6B6153] mt-1 flex items-center gap-1">
                            <MapPin className="w-3 h-3" /> {day.destination_info.location}
                          </p>
                        )}
                      </td>

                      {/* Accommodation */}
                      <td className="py-4 px-6 align-top">
                        {day.accommodation_info?.name ? (
                          <div>
                            <span className="text-[#16211A] font-bold ddw-serif text-base">
                              {day.accommodation_info.name}
                            </span>
                          </div>
                        ) : (
                          <span className="text-[#6B6153] font-normal italic text-sm">
                            No Accommodation
                          </span>
                        )}
                      </td>

                    </tr>
                  ))}
                </tbody>

              </table>
            </div>
          </div>

        </div>

      </div>



    </div>
  );
}