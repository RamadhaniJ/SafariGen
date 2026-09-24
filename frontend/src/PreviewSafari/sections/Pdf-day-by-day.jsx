// import PageFooter from "../shared/pageFooter";

// export default function PdfDayByDayComponent({safariData}) {

// const DAY_WORDS = [
//   "Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight",
//   "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen",
//   "Sixteen", "Seventeen", "Eighteen", "Nineteen", "Twenty", "Twenty-one",
//   "Twenty-two", "Twenty-three", "Twenty-four", "Twenty-five", "Twenty-six",
//   "Twenty-seven", "Twenty-eight", "Twenty-nine", "Thirty", "Thirty-one",
// ];

// const dayWord = (n) => DAY_WORDS[n] || String(n);


// const { itinerary } = safariData || {};
//   const { client_info,days, map_image_url } = itinerary || {};



//   const getMomentIcon = (moment) => {
//     const m = moment?.toUpperCase() || "";
//     if (m.includes("MORNING"))
//       return <Sunrise className="w-4 h-4 text-[#B98B3E]" strokeWidth={1.75} />;
//     if (m.includes("AFTERNOON"))
//       return <Sun className="w-4 h-4 text-[#B98B3E]" strokeWidth={1.75} />;
//     if (m.includes("EVENING"))
//       return <Moon className="w-4 h-4 text-[#B98B3E]" strokeWidth={1.75} />;
//     return <Clock className="w-4 h-4 text-[#B98B3E]" strokeWidth={1.75} />;
//   };
    
//     return(
//         <div>
//             <div className="grid grid-cols-2" >

//                 {days.map((day, dayIdx) => {
    
//                     const isMultiNight = day.nights_number > 1;
//         //  Header 
//         <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 ">
//         <div className="flex flex-wrap items-center gap-2 sm:gap-4">
//           <div className="bg-[#2B2620] text-[#F8F4EA] rounded-xl sm:rounded-2xl px-4 py-2.5 sm:px-6 sm:py-3 shadow-md">
//                  <p className="ddw-serif italic text-2xl sm:text-3xl text-[#24352A]">
//                   {isMultiNight
//                     ? `Days ${dayWord(day.day_number)}–${dayWord(
//                         day.day_number + day.nights_number - 1
//                       )}`
//                     : `Day ${dayWord(day.day_number)}`}
//                 </p>
//           </div>
//         </div>
//       </div>


//                 <div  
//               key={day.id || day.day_number}
//               className={`px-6 sm:px-10 lg:px-14 py-16 sm:py-20 ${
//                 dayIdx !== 0 ? "border-t border-[#B98B3E]/25" : "pt-10"
//               }`} >
//                           <div className="relative w-full h-[340px] sm:h-[440px]  overflow-hidden mb-10 bg-[#24352A]">
//                             {day.destination_info?.featured_image && (
//                               <img
//                                 src={day.destination_info.featured_image}
//                                 alt={day.destination_info?.name || `Day ${day.day_number}`}
//                                 className="absolute inset-0 w-full h-full object-cover"
//                               />
//                             )}
//                             <div className="absolute inset-0 bg-gradient-to-t from-[#16211A]/90 via-[#16211A]/10 to-transparent" />
//                             <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
//                                 <div className="flex items-center justify-between" >
//                                         <h2 className="ddw-serif text-3xl sm:text-5xl text-[#FBF8F1] leading-tight">
//                                             {day.destination_info?.name || "Destination"}
//                                         </h2>

//                                         {day.date_display && (
//                                              <p className="text-sm text-[#6B6153] shrink-0">
//                                                <Calendar/>  {day.date_display}
//                                              </p>
//                                          )}
//                                 </div>

//                               {day.destination_info?.location && (
//                                 <p className="flex items-center gap-1.5 mt-2 text-sm text-[#FBF8F1]/75">
//                                   <MapPin className="w-4 h-4 text-[#B98B3E]" strokeWidth={1.75} />
//                                   {day.destination_info.location}
//                                 </p>
//                               )}
//                             </div>

//              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 mb-14">
//                 <div className="lg:col-span-7">
//                   <h3 className="ddw-serif text-xl text-[#16211A] mb-3">
//                     Overview
//                   </h3>
//                   <p className="text-[#3D4A3F] text-[15px] leading-[1.75] max-w-[62ch]">
//                     {day.destination_description}
//                   </p>
//                 </div>

//                 {destination_images.length > 0 && (
//                   <div className="w-full h- flex flex-col"> take the full windth 
//                    {day.destination_images}
//                    {day.destination_images.tag && <span className="w-full h-2 p-2 bg-fuchsia-700 bottom-0" >{day.destination_images.tag}</span>}
//                   </div>
//                 )}
//               </div>

//                 </div>

//                 <div>


//                                     <div className="relative w-full h-[140px] sm:h-[440px]  overflow-hidden mb-10 bg-[#24352A]">
//                             {day.accommodation_info?.featured_image && (
//                               <img
//                                 src={day.accommodation_info.featured_image}  small differ with destination  
//                                 alt={day.accommodation_info?.name || `Day ${day.day_number}`}
//                                 className="absolute inset-0 w-full h-full object-cover"
//                               />
//                             )}
//                             <div className="absolute inset-0 bg-gradient-to-t from-[#16211A]/90 via-[#16211A]/10 to-transparent" />
//                             <div className="absolute text-center sm:p-8">
//                                 <div className="flex items-center justify-between" >
//                                        <AccommodationIcon/> <h2 className="text-3xl sm:text-5xl text-[#FBF8F1] leading-tight">
//                                             {day.accommodation_info?.name || "Accommodation"}
//                                         </h2>
//                                         <div className="flex items-center" >
//                                             <h1>{day.accommodation_info.location} | <span>{day.accommodation_info.tag_label} tag can be hotel, lodge or camp</span></h1>

//                                         </div>
//                                 </div>

//                             </div>

//                       <p className="text-[#3D4A3F] text-[15px] leading-[1.75] max-w-[62ch] mb-5">
//                         {day.accommodation_description}
//                       </p>

//                                             {day.selected_rooms?.map((room, idx) => (
//                                               <span
//                                                 key={idx}
//                                                 className="flex items-center gap-1.5 text-sm text-[#16211A] bg-[#16211A]/[0.04] px-3 py-1.5 rounded-full"
//                                               >
//                                                 <Bed className="w-3.5 h-3.5 text-[#B98B3E]" strokeWidth={1.75} />
//                                                 {room.quantity}× {room.room_type_name}
//                                               </span>
//                                             ))}
//                                           </div>


//                 {accommodation_images.length > 0 && (
//                   <div className="w-full h- flex flex-col"> take the full windth 
//                    {day.accommodation_images}
//                    {day.accommodation_images.tag && <span className="w-full h-2 p-2 bg-fuchsia-700 bottom-0" >{day.accommodation_images.tag}</span>}
//                   </div>
//                 )}
//                                         </div>



//                 </div>

//             </div>
//              right side 
//              <div>

//                 {day.activities && day.activities.length > 0 && (
//                 <div className="mb-14">
//                   <h3 className="flex items-center gap-2 ddw-serif text-xl text-[#16211A] mb-6">
//                     <Compass className="w-5 h-5 text-[#B98B3E]" strokeWidth={1.75} />
//                     Day {day.day_number} activities
//                   </h3>

//                   <div className="relative pl-8">
//                     <div className="absolute left-[7px] top-2 bottom-2 w-px bg-[#B98B3E]/30" />
//                     <div className="space-y-7">
//                       {day.activities.map((act, idx) => (
//                         <div key={idx} className="relative">
//                           <span className="absolute -left-8 top-1 w-3.5 h-3.5 rounded-full bg-[#F1EAD9] border-2 border-[#B98B3E]" />
//                           <div className="flex items-start gap-3">
//                             {getMomentIcon(act.moment)}
//                             <div className="flex-1">
//                               <div className="flex items-baseline justify-between gap-3 flex-wrap">
//                                 <p className="text-[#16211A] font-medium">
//                                   {act.activity_type_name}
//                                 </p>
//                                 {act.is_optional && (
//                                   <span className="text-xs text-[#9C5B3C] bg-[#9C5B3C]/10 px-2 py-0.5 rounded-full">
//                                     Optional · ${act.optional_activity_price}{" "}
//                                     / {act.price_per}
//                                   </span>
//                                 )}
//                               </div>
//                               <p className="text-sm text-[#6B6153] mt-0.5">
//                                 {act.main_location_name}
//                                 {act.start_location_name &&
//                                   `From ${act.start_location_name}`}
//                                 {act.via_location_name &&
//                                   ` via ${act.via_location_name}`}
//                                 {act.end_location_name &&
//                                   ` to ${act.end_location_name}`}
//                               </p>
//                             </div>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 </div>
//               )}

//               <div>
//                 <h1>Day {day.day_number} Meal</h1>
//                <MealIcon/> <span>{day.included_meals}</span>
//                {day.optional_meals.length > 0 && (
//                 <div>
//                     <h1>Others Meals </h1>
//                     {day.optional_meals.map((meal)=>(
//                         <div>
//                             <h1>{meal.meal_name}</h1> <span>{meal.is_optional && <span>Optional ${meal.price} Per pax</span>}</span>
//                         </div>
//                     ))}
//                 </div>
//                )}
//               </div>

//                           </div>

//              </div>

//                   <div className=":mt-auto :break-inside-avoid">
//                      <PageFooter 
//                        pageNumber={2} 
//                        tourCode={tour_code} 
//                        clientName={clientName} 
//                        company={company_name} 
//                      />
//                    </div>


//         </div>
//     )
// }
















// import React from "react";
// import { 
//   Sunrise, Sun, Moon, Clock, Calendar, MapPin, Bed, 
//   Compass, Utensils, Tent, Map, Star 
// } from "lucide-react";
// import PageFooter from "../shared/pageFooter";

// export default function PdfDayByDayComponent({ safariData }) {
//   const DAY_WORDS = [
//     "Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight",
//     "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen",
//     "Sixteen", "Seventeen", "Eighteen", "Nineteen", "Twenty", "Twenty-one",
//     "Twenty-two", "Twenty-three", "Twenty-four", "Twenty-five", "Twenty-six",
//     "Twenty-seven", "Twenty-eight", "Twenty-nine", "Thirty", "Thirty-one",
//   ];

//   const dayWord = (n) => DAY_WORDS[n] || String(n);

//   const { itinerary } = safariData || {};
//   const { client_info, days, map_image_url } = itinerary || {};

//   const getMomentIcon = (moment) => {
//     const m = moment?.toUpperCase() || "";
//     if (m.includes("MORNING")) return <Sunrise className="w-4 h-4 text-[#B98B3E]" strokeWidth={1.75} />;
//     if (m.includes("AFTERNOON")) return <Sun className="w-4 h-4 text-[#B98B3E]" strokeWidth={1.75} />;
//     if (m.includes("EVENING")) return <Moon className="w-4 h-4 text-[#B98B3E]" strokeWidth={1.75} />;
//     return <Clock className="w-4 h-4 text-[#B98B3E]" strokeWidth={1.75} />;
//   };

//   if (!days || days.length === 0) {
//     return <div className="p-8 text-center text-gray-500 ddw-serif">No itinerary data available.</div>;
//   }

//   return (
//     <div className="w-full max-w-4xl mx-auto bg-white text-[#16211A] font-sans p-6 sm:p-10">
//       {days.map((day, dayIdx) => {
//         const isMultiNight = day.nights_number > 1;
//         const dayLabel = isMultiNight
//           ? `Days ${dayWord(day.day_number)}–${dayWord(day.day_number + day.nights_number - 1)}`
//           : `Day ${dayWord(day.day_number)}`;

//         return (
//           <div 
//             key={day.id || day.day_number} 
//             className="mb-12 break-inside-avoid :break-inside-avoid"
//           >
//             {/* --- DAY HEADER --- */}
//             <div className="flex items-center gap-4 mb-6 :mb-4">
//               <div className="bg-[#2B2620] text-[#F8F4EA] rounded-lg px-5 py-2 shadow-sm">
//                 <p className="ddw-serif italic text-xl tracking-wide">
//                   {dayLabel}
//                 </p>
//               </div>
//               {day.date_display && (
//                 <div className="flex items-center gap-2 text-sm text-[#6B6153] font-medium">
//                   <Calendar className="w-4 h-4 text-[#B98B3E]" />
//                   <span>{day.date_display}</span>
//                 </div>
//               )}
//               <div className="flex-1 h-px bg-gradient-to-r from-[#B98B3E]/40 to-transparent" />
//             </div>

//             {/* --- DESTINATION SECTION --- */}
//             {day.destination_info && (
//               <div className="mb-8">
//                 <div className="relative w-full h-64 sm:h-80 rounded-xl overflow-hidden mb-4 shadow-md :shadow-none :border :border-gray-200">
//                   {day.destination_info.featured_image ? (
//                     <img
//                       src={day.destination_info.featured_image}
//                       alt={day.destination_info.name}
//                       className="absolute inset-0 w-full h-full object-cover"
//                     />
//                   ) : (
//                     <div className="absolute inset-0 bg-[#24352A] flex items-center justify-center">
//                       <Map className="w-12 h-12 text-[#B98B3E]/50" />
//                     </div>
//                   )}
//                   <div className="absolute inset-0 bg-gradient-to-t from-[#16211A]/80 via-transparent to-transparent" />
//                   <div className="absolute bottom-0 left-0 p-6 w-full">
//                     <h2 className="ddw-serif text-3xl sm:text-4xl text-white font-medium leading-tight mb-2">
//                       {day.destination_info.name}
//                     </h2>
//                     {day.destination_info.location && (
//                       <p className="flex items-center gap-2 text-sm text-white/80">
//                         <MapPin className="w-4 h-4 text-[#B98B3E]" />
//                         {day.destination_info.location}
//                       </p>
//                     )}
//                   </div>
//                 </div>

//                 {day.destination_description && (
//                   <p className="text-[#3D4A3F] text-[15px] leading-relaxed mb-4 max-w-3xl">
//                     {day.destination_description}
//                   </p>
//                 )}

//                 {/* Destination Image Gallery */}
//                 {Array.isArray(day.destination_images) && day.destination_images.length > 0 && (
//                   <div className="grid grid-cols-3 gap-3 mb-8">
//                     {day.destination_images.slice(0, 3).map((imgUrl, idx) => (
//                       <div key={idx} className="relative h-32 rounded-lg overflow-hidden shadow-sm :border :border-gray-100">
//                         <img src={imgUrl} alt={`Destination ${idx + 1}`} className="w-full h-full object-cover" />
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             )}

//             {/* --- ACCOMMODATION SECTION --- */}
//             {day.accommodation_info && (
//               <div className="mb-8 bg-[#F8F4EA]/40 rounded-xl p-6 border border-[#B98B3E]/10">
//                 <div className="flex items-start gap-4 mb-4">
//                   <div className="p-2.5 bg-[#2B2620] rounded-lg shrink-0">
//                     <Tent className="w-5 h-5 text-[#B98B3E]" />
//                   </div>
//                   <div className="flex-1">
//                     <div className="flex flex-wrap items-center gap-3 mb-1">
//                       <h3 className="ddw-serif text-2xl text-[#16211A]">
//                         {day.accommodation_info.name}
//                       </h3>
//                       {day.accommodation_info.tag_label && (
//                         <span className="text-xs font-bold uppercase tracking-wider text-[#B98B3E] bg-[#B98B3E]/10 px-2.5 py-1 rounded-full">
//                           {day.accommodation_info.tag_label}
//                         </span>
//                       )}
//                     </div>
//                     {day.accommodation_info.location && (
//                       <p className="flex items-center gap-1.5 text-sm text-[#6B6153] mb-3">
//                         <MapPin className="w-3.5 h-3.5" />
//                         {day.accommodation_info.location}
//                       </p>
//                     )}
//                   </div>
//                 </div>

//                 {day.accommodation_description && (
//                   <p className="text-[#3D4A3F] text-sm leading-relaxed mb-4 pl-0 sm:pl-14">
//                     {day.accommodation_description}
//                   </p>
//                 )}

//                 {/* Selected Rooms */}
//                 {Array.isArray(day.selected_rooms) && day.selected_rooms.length > 0 && (
//                   <div className="flex flex-wrap gap-2 mb-4 pl-0 sm:pl-14">
//                     {day.selected_rooms.map((room, idx) => (
//                       <span
//                         key={idx}
//                         className="flex items-center gap-1.5 text-xs font-medium text-[#16211A] bg-white border border-[#B98B3E]/20 px-3 py-1.5 rounded-full shadow-sm"
//                       >
//                         <Bed className="w-3.5 h-3.5 text-[#B98B3E]" />
//                         {room.quantity}× {room.room_type_name}
//                       </span>
//                     ))}
//                   </div>
//                 )}

//                 {/* Accommodation Image Gallery */}
//                 {Array.isArray(day.accommodation_images) && day.accommodation_images.length > 0 && (
//                   <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pl-0 sm:pl-14">
//                     {day.accommodation_images.slice(0, 4).map((imgUrl, idx) => (
//                       <div key={idx} className="relative h-24 rounded-lg overflow-hidden shadow-sm :border :border-gray-100">
//                         <img src={imgUrl} alt={`Accommodation ${idx + 1}`} className="w-full h-full object-cover" />
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             )}

//             {/* --- ACTIVITIES SECTION --- */}
//             {day.activities && day.activities.length > 0 && (
//               <div className="mb-8">
//                 <h3 className="flex items-center gap-2 ddw-serif text-xl text-[#16211A] mb-6">
//                   <Compass className="w-5 h-5 text-[#B98B3E]" />
//                   Day {day.day_number} Activities
//                 </h3>

//                 <div className="relative pl-8">
//                   <div className="absolute left-[7px] top-2 bottom-2 w-px bg-[#B98B3E]/30" />
//                   <div className="space-y-6">
//                     {day.activities.map((act, idx) => (
//                       <div key={act.id || idx} className="relative">
//                         <span className="absolute -left-8 top-1.5 w-3.5 h-3.5 rounded-full bg-white border-2 border-[#B98B3E]" />
//                         <div className="flex items-start gap-4">
//                           <div className="mt-0.5 shrink-0">
//                             {getMomentIcon(act.moment)}
//                           </div>
//                           <div className="flex-1 bg-white rounded-lg p-4 border border-[#B98B3E]/10 shadow-sm :shadow-none :border-gray-200">
//                             <div className="flex items-start justify-between gap-3 flex-wrap">
//                               <p className="text-[#16211A] font-semibold text-base">
//                                 {act.activity_type_name}
//                               </p>
//                               {act.is_optional && (
//                                 <span className="text-xs font-semibold text-[#9C5B3C] bg-[#9C5B3C]/10 px-2.5 py-1 rounded-full whitespace-nowrap">
//                                   Optional · ${Number(act.optional_activity_price).toFixed(2)} / {act.price_per}
//                                 </span>
//                               )}
//                             </div>
//                             <p className="text-sm text-[#6B6153] mt-1.5 leading-relaxed">
//                               {act.main_location_name}
//                               {act.start_location_name && ` From ${act.start_location_name}`}
//                               {act.via_location_name && ` via ${act.via_location_name}`}
//                               {act.end_location_name && ` to ${act.end_location_name}`}
//                             </p>
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* --- MEALS SECTION --- */}
//             <div className="mb-4">
//               <h3 className="flex items-center gap-2 ddw-serif text-xl text-[#16211A] mb-4">
//                 <Utensils className="w-5 h-5 text-[#B98B3E]" />
//                 Meals
//               </h3>
              
//               <div className="bg-[#F8F4EA]/30 rounded-xl p-5 border border-[#B98B3E]/10">
//                 {day.included_meals && (
//                   <div className="mb-4">
//                     <p className="text-xs font-bold uppercase tracking-wider text-[#6B6153] mb-2">
//                       Included Meals
//                     </p>
//                     <div className="flex flex-wrap gap-2">
//                       {day.included_meals.split(",").map((meal, idx) => (
//                         <span 
//                           key={idx} 
//                           className="flex items-center gap-1.5 text-sm font-medium text-[#24352A] bg-white border border-[#24352A]/10 px-3 py-1.5 rounded-md shadow-sm"
//                         >
//                           <Star className="w-3.5 h-3.5 text-[#B98B3E]" fill="#B98B3E" />
//                           {meal.trim()}
//                         </span>
//                       ))}
//                     </div>
//                   </div>
//                 )}

//                 {Array.isArray(day.optional_meals) && day.optional_meals.length > 0 && (
//                   <div>
//                     <p className="text-xs font-bold uppercase tracking-wider text-[#6B6153] mb-2">
//                       Optional Meals
//                     </p>
//                     <div className="space-y-2">
//                       {day.optional_meals.map((meal, idx) => (
//                         <div 
//                           key={meal.id || idx} 
//                           className="flex items-center justify-between text-sm p-3 bg-white rounded-lg border border-[#B98B3E]/10 shadow-sm print:shadow-none"
//                         >
//                           <span className="text-[#16211A] font-medium">{meal.meal_name}</span>
//                           {meal.is_optional && (
//                             <span className="text-[#9C5B3C] font-bold">
//                               +${Number(meal.price).toFixed(2)} <span className="text-[#6B6153] font-normal text-xs">per pax</span>
//                             </span>
//                           )}
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Elegant Separator between days */}
//             {dayIdx < days.length - 1 && (
//               <div className="border-t-2 border-dashed border-[#B98B3E]/20 my-10 print:my-8" />
//             )}
//           </div>
//         );
//       })}

//       {/* --- FOOTER --- */}
//       <div className="print:mt-auto print:break-inside-avoid mt-12 pt-8 border-t border-[#B98B3E]/20">
//         <PageFooter 
//           pageNumber={2} 
//           tourCode={client_info?.tour_code || "N/A"} 
//           clientName={`${client_info?.salutation || ""} ${client_info?.first_name || ""} ${client_info?.last_name || ""}`.trim() || "Valued Guest"} 
//           company={client_info?.staff_company || "ACE"} 
//         />
//       </div>
//     </div>
//   );
// }










import React from "react";
import { 
  Sunrise, Sun, Moon, Clock, Calendar, MapPin, Bed, 
  Compass, Utensils, Tent, Star 
} from "lucide-react";
import PageFooter from "../shared/pageFooter";

const API_BASE_URL = "http://127.0.0.1:8000";
const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=80";

const resolveImageUrl = (url) => {
  if (!url) return FALLBACK_IMAGE;
  if (url.startsWith("http://127.0.0.1:8000") || url.startsWith("http://localhost:8000")) {
    return url.replace(/http:\/\/(127\.0\.0\.1|localhost):8000/, API_BASE_URL);
  }
  return url;
};

export default function PdfDayByDayComponent({ safariData }) {
  const DAY_WORDS = [
    "Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight",
    "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen",
    "Sixteen", "Seventeen", "Eighteen", "Nineteen", "Twenty", "Twenty-One", "Twenty-Two"
  ];

  const dayWord = (n) => DAY_WORDS[n] || String(n);

  const { itinerary } = safariData || {};
  const { client_info, days } = itinerary || {};

  const getMomentIcon = (moment) => {
    const m = moment?.toUpperCase() || "";
    if (m.includes("MORNING")) return <Sunrise className="w-4 h-4 text-[#B98B3E]" strokeWidth={1.75} />;
    if (m.includes("AFTERNOON")) return <Sun className="w-4 h-4 text-[#B98B3E]" strokeWidth={1.75} />;
    if (m.includes("EVENING")) return <Moon className="w-4 h-4 text-[#B98B3E]" strokeWidth={1.75} />;
    return <Clock className="w-4 h-4 text-[#B98B3E]" strokeWidth={1.75} />;
  };

  if (!days || days.length === 0) {
    return <div className="p-12 text-center text-[#6B6153] ddw-serif text-xl">No itinerary data available.</div>;
  }

  const clientName = `${client_info?.salutation || ""} ${client_info?.first_name || ""} ${client_info?.last_name || ""}`.trim() || "Valued Guest";
  const tourCode = client_info?.tour_code || "N/A";
  const companyName = client_info?.staff_company || "ACE";

  return (
    // MAIN WRAPPER: Warm Ivory background that flows continuously. No white gaps!
    <div className="w-full bg-[#F8F4EA] text-[#16211A] print:bg-white">
      {days.map((day, dayIdx) => {
        const isMultiNight = day.nights_number > 1;
        const dayLabel = isMultiNight
          ? `Days ${dayWord(day.day_number)}–${dayWord(day.day_number + day.nights_number - 1)}`
          : `Day ${dayWord(day.day_number)}`;

        const destGallery = Array.isArray(day.destination_images) ? day.destination_images : [];
        const accommGallery = Array.isArray(day.accommodation_images) ? day.accommodation_images : [];

        return (
            <div 
                  key={day.id || day.day_number || dayIdx} 
                  className="day-card w-full mx-auto 
                    bg-[#FDFBF7] print:bg-[#FDFBF7] 
                    rounded-2xl shadow-sm border border-[#B98B3E]/10 
                    p-8 sm:p-10 mb-8 print:mb-0 
                    print:shadow-none print:border-none print:rounded-none 
                    break-inside-avoid"
                >
            {/* --- DAY HEADER --- */}
            <div className="flex items-center gap-4 mb-8 :mb-6 break-inside-avoid">
              <div className="bg-[#2B2620] text-[#F8F4EA] rounded-lg px-5 py-2.5 shadow-sm">
                <p className="ddw-serif italic text-xl tracking-wide">
                  {dayLabel}
                </p>
              </div>
              {day.date_display && (
                <div className="flex items-center gap-2 text-sm text-[#6B6153] font-medium">
                  <Calendar className="w-4 h-4 text-[#B98B3E]" />
                  <span>{day.date_display}</span>
                </div>
              )}
              <div className="flex-1 h-px bg-gradient-to-r from-[#B98B3E]/40 to-transparent" />
            </div>

            {/* --- DESTINATION SECTION (Protected from breaking in half) --- */}
            {day.destination_info && (
              <div className="mb-8  break-inside-avoid">
                <div className="relative w-full h-64 max-h-64 rounded-xl overflow-hidden mb-4 shadow-md :shadow-none :border :border-[#E0D8C8]">
                  <img
                    src={resolveImageUrl(day.destination_info.featured_image)}
                    alt={day.destination_info.name}
                    onError={(e) => { e.currentTarget.src = FALLBACK_IMAGE; }}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#16211A]/85 via-[#16211A]/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-6 w-full">
                    <h2 className="ddw-serif text-3xl sm:text-4xl text-white font-medium leading-tight mb-1">
                      {day.destination_info.name}
                    </h2>
                    {day.destination_info.location && (
                      <p className="flex items-center gap-2 text-sm text-white/85">
                        <MapPin className="w-4 h-4 text-[#B98B3E]" />
                        {day.destination_info.location}
                      </p>
                    )}
                  </div>
                </div>

                {day.destination_description && (
                  <p className="text-[#3D4A3F] text-[15px] leading-relaxed mb-5">
                    {day.destination_description}
                  </p>
                )}

                {/* Destination Gallery */}
                {destGallery.length > 0 && (
                  <div className="grid grid-cols-2 gap-4 mb-2 break-inside-avoid">
                    {destGallery.slice(0, 2).map((imgUrl, idx) => (
                      <div key={idx} className="relative h-40 rounded-lg overflow-hidden border border-[#B98B3E]/10">
                        <img 
                          src={resolveImageUrl(imgUrl)} 
                          alt={`Destination gallery ${idx + 1}`} 
                          onError={(e) => { e.currentTarget.src = FALLBACK_IMAGE; }}
                          className="w-full h-full object-cover" 
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* --- ACCOMMODATION SECTION (Protected from breaking in half) --- */}
            {day.accommodation_info && (
              <div className="mb-8 bg-[#F8F4EA]/50 rounded-xl p-6 border border-[#B98B3E]/10 break-inside-avoid">
                <div className="flex items-start gap-4 mb-3">
                  <div className="p-2.5 bg-[#2B2620] rounded-lg shrink-0">
                    <Tent className="w-5 h-5 text-[#B98B3E]" />
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-1">
                      <h3 className="ddw-serif text-2xl text-[#16211A]">
                        {day.accommodation_info.name}
                      </h3>
                      {day.accommodation_info.tag_label && (
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#B98B3E] bg-[#B98B3E]/10 px-2.5 py-1 rounded-full border border-[#B98B3E]/20">
                          {day.accommodation_info.tag_label}
                        </span>
                      )}
                    </div>
                    {day.accommodation_info.location && (
                      <p className="flex items-center gap-1.5 text-sm text-[#6B6153]">
                        <MapPin className="w-3.5 h-3.5" />
                        {day.accommodation_info.location}
                      </p>
                    )}
                  </div>
                </div>

                {day.accommodation_description && (
                  <p className="text-[#3D4A3F] text-sm leading-relaxed mb-4">
                    {day.accommodation_description}
                  </p>
                )}

                {/* Selected Rooms */}
                {Array.isArray(day.selected_rooms) && day.selected_rooms.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {day.selected_rooms.map((room, idx) => (
                      <span
                        key={idx}
                        className="flex items-center gap-1.5 text-xs font-medium text-[#16211A] bg-white border border-[#B98B3E]/20 px-3 py-1.5 rounded-full shadow-xs"
                      >
                        <Bed className="w-3.5 h-3.5 text-[#B98B3E]" />
                        {room.quantity}× {room.room_type_name}
                      </span>
                    ))}
                  </div>
                )}

                {/* Accommodation Gallery */}
                {accommGallery.length > 0 && (
                  <div className="grid grid-cols-2 gap-4 mt-4  break-inside-avoid">
                    {accommGallery.slice(0, 2).map((imgUrl, idx) => (
                      <div key={idx} className="relative h-36 rounded-lg overflow-hidden border border-[#B98B3E]/10">
                        <img 
                          src={resolveImageUrl(imgUrl)} 
                          alt={`Accommodation gallery ${idx + 1}`} 
                          onError={(e) => { e.currentTarget.src = FALLBACK_IMAGE; }}
                          className="w-full h-full object-cover" 
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* --- ACTIVITIES SECTION (Protected from breaking in half) --- */}
            {day.activities && day.activities.length > 0 && (
              <div className="mb-8 break-inside-avoid">
                <h3 className="flex items-center gap-2 ddw-serif text-xl text-[#16211A] mb-5">
                  <Compass className="w-5 h-5 text-[#B98B3E]" />
                  Scheduled Activities
                </h3>

                <div className="relative pl-6 space-y-4">
                  <div className="absolute left-[7px] top-2 bottom-2 w-px bg-[#B98B3E]/30" />
                  {day.activities.map((act, idx) => (
                    <div key={act.id || idx} className="relative pl-4">
                      <span className="absolute -left-[19px] top-1.5 w-3.5 h-3.5 rounded-full bg-white border-2 border-[#B98B3E] shadow-sm" />
                      <div className="flex items-center gap-3 bg-white rounded-lg p-4 border border-[#B98B3E]/10 shadow-xs :shadow-none">
                        {getMomentIcon(act.moment)}
                        <div className="flex-1">
                          <p className="text-[#16211A] font-semibold text-sm">
                            {act.activity_type_name}
                          </p>
                          <p className="text-xs text-[#6B6153] mt-0.5">
                            {act.main_location_name || act.start_location_name}
                          </p>
                        </div>
                        {act.is_optional && (
                          <span className="text-[10px] font-bold text-[#9C5B3C] bg-[#9C5B3C]/10 px-2.5 py-1 rounded-full border border-[#9C5B3C]/20">
                            Optional
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* --- MEALS SECTION --- */}
            {day.included_meals && (
              <div className="mb-6 bg-[#F8F4EA]/50 rounded-xl p-4 border border-[#B98B3E]/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 break-inside-avoid">
                <div className="flex items-center gap-2">
                  <Utensils className="w-4 h-4 text-[#B98B3E]" />
                  <span className="text-xs font-bold uppercase tracking-wider text-[#6B6153]">Meals Included:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {day.included_meals.split(",").map((meal, idx) => (
                    <span key={idx} className="text-xs font-medium text-[#24352A] bg-white border border-[#24352A]/10 px-3 py-1.5 rounded-md shadow-xs">
                      {meal.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}

          </div>
        );
      })}
    </div>
  );
}