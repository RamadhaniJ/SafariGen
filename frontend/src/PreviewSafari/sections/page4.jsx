import React from "react";
import { Compass, Sparkles, CheckCircle2 } from "lucide-react";

export default function Page4Component({ safariData }) {
  const { itinerary } = safariData || {};
  const { client_info, days } = itinerary || {};

  if (!client_info) return null;

  const clientName = `${client_info.salutation || "Mr/Ms"}. ${client_info.first_name || ""} ${client_info.last_name || ""}`.trim();
  const tour_code = client_info.tour_code || "N/A";
  const company_name = client_info.staff_company || "ACE";

  return (
    <div className="pdf-section w-full mx-auto max-w-6xl px-8 sm:px-12 py-8 text-[#2B2620]  font-sans bg-white">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="bg-[#2B2620] text-[#F8F4EA] rounded-lg px-5 py-2.5 shadow-sm">
          <h1 className="text-xs font-bold tracking-[0.15em] uppercase">
            Optional
          </h1>
        </div>

      </div>

      {/* Main Content Area */}
      <article className="space-y-8 w-full flex-1 mt-6">
        
        {/* Main Title Section */}
        <div className="space-y-3 w-full border-b border-[#B98B3E]/30 pb-3">
          <h1 className="ddw-serif text-3xl sm:text-4xl text-[#16211A] tracking-tight flex items-center gap-3">
            <Compass className="w-8 h-8 text-[#B98B3E]" />
            Optional Activities & Meals
          </h1>
           <span className="text-[#a1680b]">Not included in the base price - available upon request</span>

        </div>

        {/* Structured Table Container */}
        <div className="bg-[#F8F4EA]/30 border border-[#B98B3E]/20 rounded-xl overflow-hidden shadow-sm border-[#E0D8C8] break-inside-avoid">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              
              {/* Table Header */}
              <thead>
                <tr className="bg-[#24352A] text-[#F8F4EA] text-xs font-bold tracking-wider uppercase">
                  <th className="py-4 px-6">Optional</th>
                  <th className="py-4 px-6">Destination</th>
                  <th className="py-4 px-6">Price</th>
                  <th className="py-4 px-6 text-right">How to Book</th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody className="divide-y divide-[#B98B3E]/15 text-sm text-[#3D4A3F]">
                {days.map((day) => {
                  const optionalActivities = day.activities?.filter(act => act.is_optional) || [];
                  const optionalMeals = day.optional_meals?.filter(meal => meal.is_optional) || [];

                  return (
                    <>
                  {optionalActivities.map((act, id)=>(
                    <tr key={id} className="hover:bg-[#F8F4EA]/60 transition-colors duration-150">
                    
                    <td className="py-5 px-6 font-bold text-[#16211A] ddw-serif">
                      <div className="flex items-center gap-3">
                        <span> Day {day.day_number} : {act.activity_type_name}</span>
                        <span className="text-[10px] font-sans font-semibold tracking-wider px-2 py-[1px] bg-[#B98B3E]/15 text-[#B98B3E] rounded-full border border-[#B98B3E]/30" >{act.moment_display}</span>
                      </div>
                    </td>

                    {/* Destination */}
                    <td className="py-5 px-6 text-[#3D4A3F] font-medium">
                      {day.destination_info.name}
                    </td>

                    {/* Price */}
                    <td className="py-5 px-6 font-bold text-[#16211A]">
                      $ {act.optional_activity_price} <span className="text-xs font-normal text-[#6B6153]">/ {act.price_per}</span>
                    </td>

                    {/* How to Book */}
                    <td className="py-5 px-6 text-right font-medium text-[#24352A]">
                      <span className="inline-flex items-center gap-1.5 justify-end">
                        <CheckCircle2 className="w-4 h-4 text-[#B98B3E] shrink-0" />
                        Book with us before trip
                      </span>
                    </td>

                  </tr>

                ))}

                {optionalMeals.map((meal, id)=>(

                  <tr key={`Meal-${id}`} className="hover:bg-[#F8F4EA]/60 transition-colors duration-150">
                    
                    <td className="py-5 px-6 font-bold text-[#16211A] ddw-serif">
                      <div className="flex items-center gap-3">
                        <span> Day {day.day_number} : {meal.meal_name}</span>
                      </div>
                    </td>

                    {/* Destination */}
                    <td className="py-5 px-6 text-[#3D4A3F] font-medium">
                      {day.destination_info.name}
                    </td>

                    {/* Price */}
                    <td className="py-5 px-6 font-bold text-[#16211A]">
                      $ {meal.price} <span className="text-xs font-normal text-[#6B6153]">/ Per Personal</span>
                    </td>

                    {/* How to Book */}
                    <td className="py-5 px-6 text-right font-medium text-[#24352A]">
                      <span className="inline-flex items-center gap-1.5 justify-end">
                        <CheckCircle2 className="w-4 h-4 text-[#B98B3E] shrink-0" />
                        Book with us before trip
                      </span>
                    </td>

                  </tr>

                ))}
              </>
               );
                })}

                
              </tbody>

            </table>
          </div>
        </div>

      </article>


    </div>
  );
}