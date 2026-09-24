import React from "react";
import { Sparkles, MapPin, Utensils, Hotel, CalendarCheck, Compass, Calendar } from "lucide-react";
import PageFooter from "../shared/pageFooter";

export default function Page5Component({ safariData }) {
  const { itinerary } = safariData || {};
  const { client_info, days } = itinerary || {};

  if (!client_info) return null;

  const clientName = `${client_info.salutation || "Mr/Ms"}. ${client_info.first_name || ""} ${client_info.last_name || ""}`.trim();
  const tour_code = client_info.tour_code || "N/A";
  const company_name = client_info.staff_company || "ACE";
  const tour_title = client_info.tour_title || "Safari Itinerary Summary";

   const getMealPlan = (meals) => {
     if (!meals) return "No meals included";
     const mealList = meals.split(",").map(m => m.trim());
     if (mealList.length === 3) return "Full Board";
     if (mealList.length === 2) return "Half Board";
     return "Bed & Breakfast";
   };


   const groupedHighlights =  days.reduce((acc, day)=>{
    const destinationName = day.destination_info?.name?.trim();
    if (!destinationName) return acc;

    const existing  = acc.find((item)=> item.destination === destinationName);

    if (!existing){
      acc.push({
        destination :destinationName,
      })
    }

    return acc;


   }, [])
  return (
    <div className="pdf-section w-full max-w-5xl mx-auto px-6 sm:px-10 py-8 text-[#2B2620] font-sans bg-white">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="bg-[#2B2620] text-[#F8F4EA] rounded-lg px-5 py-2.5 shadow-sm">
          <h1 className="text-xs font-bold tracking-[0.15em] uppercase">
            Trip Summary
          </h1>
        </div>
      </div>

      {/* Main Content Area */}
      <article className="space-y-8 w-full flex-1 mt-5">
        
        {/* Main Title Section */}
        <div className="space-y-3 w-full border-b border-[#B98B3E]/30 pb-4">
          <h1 className="ddw-serif text-3xl sm:text-4xl text-[#16211A] tracking-tight flex items-center gap-3">
            <CalendarCheck className="w-8 h-8 text-[#B98B3E]" />
            {tour_title} - <span className="italic font-light" >Summary</span>
          </h1>
        </div>

        {/* Structured Summary Table */}
        <div className="bg-[#F8F4EA]/30 border border-[#B98B3E]/20 rounded-xl overflow-hidden shadow-sm  border-[#E0D8C8] break-inside-avoid">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              
              {/* Table Header */}
              <thead>
                <tr className="bg-[#24352A] text-[#F8F4EA] text-xs font-bold tracking-wider uppercase">
                  <th className="py-4 px-6">Day</th>
                  <th className="py-4 px-6">Destination</th>
                  <th className="py-4 px-6">Accommodation</th>
                  <th className="py-4 px-6 text-right">Meal Plan</th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody className="divide-y divide-[#B98B3E]/15 text-sm text-[#3D4A3F]">
                {days.map((day, idx) => (
                  <tr key={idx} className="hover:bg-[#F8F4EA]/60 transition-colors duration-150">

                    <td className=" py-5 px-6 font-bold text-[#16211A] ddw-serif whitespace-nowrap">
                           <p>
                            {day.nights_number > 1
                             ? `Day ${day.day_number}-${day.day_number + day.nights_number - 1}`
                           : `Day ${day.day_number}`}
                           </p> 
                          <p className="text-xs text-[#6B6153] flex items-center gap-1.5">
                            <Calendar className="w-3 h-3 text-[#B98B3E]" />
                            <span className="font-normal">{day.date_display}</span>
                          </p>
                    </td>

                    {/* Destination */}
                    <td className="py-5 px-6 font-medium text-[#16211A]">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-[#B98B3E] shrink-0" />
                        <span>{day.destination_info.name}</span>
                      </div>
                    </td>

                    {/* Accommodation */}
                    <td className="py-5 px-6">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 font-bold text-[#16211A] ddw-serif">
                          <Hotel className="w-4 h-4 text-[#B98B3E] shrink-0 hidden" />
                          <span>
                            {day.accommodation_info?.name || "No Accommodation"}
                          </span>
                        </div>

                          <div className="flex flex-wrap items-center gap-2 pt-0.5">
                              <span className="text-xs text-[#6B6153] font-normal">
                                {day.selected_rooms?.map(room => `${room.quantity} x ${room.room_type_name}` ).join(", ")}
                              </span>
                          </div>
                      </div>
                    </td>

                    {/* Meal Plan */}
                    <td className="py-5 px-6 text-right">
                      <div className="inline-flex items-center justify-end gap-2 text-xs font-medium text-[#24352A]">
                        <Utensils className="w-4 h-4 text-[#B98B3E] shrink-0" />
                        <span>
                          {getMealPlan(day.included_meals)}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        </div>


          <div className="bg-[#F8F4EA]/40 border border-[#B98B3E]/20 rounded-xl p-6 space-y-3 shadow-none border-[#E0D8C8] break-inside-avoid">
            <div className="flex items-center gap-2 text-[#16211A]">
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#16211A] ddw-serif">
                Trip Highlights
              </h2>
            </div>
            
            <div className="flex flex-wrap gap-2.5 pt-1">
              {groupedHighlights.map((highlight, index) => (
                <span 
                  key={index} 
                  className="inline-flex items-center gap-2 bg-white border border-[#B98B3E]/20 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-[#16211A] shadow-xs shadow-none"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#B98B3E]" />
                  {highlight.destination}
                </span>
              ))}
            </div>
          </div>

      </article>

     

    </div>
  );
}