// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import api from "../Apis/api";
// import GlobalLoader from "../Component/Loader";
// import { toast } from "sonner";
// import {
//   MapPin, Calendar, Users, Star, Phone, Mail, Building2,
//   Utensils, Sparkles, Map, Bed, Clock, CheckCircle2,
//   ChevronRight, Award, Compass, Sun, Moon, Sunrise
// } from "lucide-react";

// export default function PreviewDayByDayItineraryPage() {
//   const { client_id } = useParams();
//   const [safariData, setSafariData] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const fetchSafariData = async () => {
//     setLoading(true);
//     try {
//       const resp = await api.get(`itinerary/preview/client/safari/data/${client_id}/`);
//       setSafariData(resp.data);
//     } catch (error) {
//       const errorMsg = error.response?.data?.detail || "Something went wrong";
//       toast.error(errorMsg);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (client_id) fetchSafariData();
//   }, [client_id]);

//   // Helper Functions
//   const formatDate = (dateStr) => {
//     if (!dateStr) return "";
//     const date = new Date(dateStr);
//     return date.toLocaleDateString("en-US", {
//       day: "numeric",
//       month: "long",
//       year: "numeric"
//     });
//   };

//   const calculateEndDate = (startDate, days) => {
//     if (!startDate) return "";
//     const date = new Date(startDate);
//     date.setDate(date.getDate() + (days - 1));
//     return formatDate(date.toISOString());
//   };

//   const getMealPlan = (meals) => {
//     if (!meals) return "No meals included";
//     const mealList = meals.split(",").map(m => m.trim());
//     if (mealList.length === 3) return "Full Board";
//     if (mealList.length === 2) return "Half Board";
//     return "Bed & Breakfast";
//   };

//   const getMomentIcon = (moment) => {
//     if (moment?.includes("MORNING")) return <Sunrise className="w-4 h-4 text-amber-400" />;
//     if (moment?.includes("AFTERNOON")) return <Sun className="w-4 h-4 text-orange-400" />;
//     if (moment?.includes("EVENING")) return <Moon className="w-4 h-4 text-indigo-400" />;
//     return <Clock className="w-4 h-4 text-slate-400" />;
//   };

//   if (loading) return <GlobalLoader />;
//   if (!safariData) return <div className="min-h-screen flex items-center justify-center">No data available</div>;

//   const { hero_image, itinerary } = safariData;
//   const { client_info, days, map_image_url } = itinerary;

//   return (
//     <div className="min-h-screen bg-slate-50 print:bg-white">
      
//       {/* ========================================== */}
//       {/* PAGE 1: HERO SECTION */}
//       {/* ========================================== */}
//       <div className="relative h-screen overflow-hidden">
//         {/* Hero Background Image */}
//         <div className="absolute inset-0">
//           <img
//             src={hero_image}
//             alt="Safari Hero"
//             className="w-full h-full object-cover"
//           />
//           <div className="absolute inset-0 bg-gradient-to-b from-slate-900/70 via-slate-900/50 to-slate-900/90" />
//         </div>

//         {/* Hero Content */}
//         <div className="relative z-10 h-full flex flex-col justify-between p-8 md:p-16">
          
//           {/* Top Bar */}
//           <div className="flex items-center justify-between">
//             <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-6 py-3">
//               <h1 className="text-2xl font-bold text-white">Safari Proposal</h1>
//             </div>
//             <div className="text-right text-white/80">
//               <p className="text-sm">Ref. Number</p>
//               <p className="text-lg font-bold">{client_info.tour_code}</p>
//             </div>
//           </div>

//           {/* Center Content */}
//           <div className="text-center text-white space-y-6">
//             <p className="text-xl md:text-2xl font-light">
//               Dear {client_info.salutation}. {client_info.first_name} {client_info.last_name}
//             </p>
//             <h1 className="text-5xl md:text-7xl font-black tracking-tight">
//               {client_info.tour_title}
//             </h1>
//             <div className="flex items-center justify-center gap-8 text-lg">
//               <div className="flex items-center gap-2">
//                 <Calendar className="w-5 h-5" />
//                 <span>{client_info.tour_length} Days</span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <Users className="w-5 h-5" />
//                 <span>{client_info.total_travellers}</span>
//               </div>
//             </div>
//           </div>

//           {/* Bottom Stats */}
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
//             <StatCard
//               icon={<Calendar className="w-6 h-6" />}
//               value={client_info.tour_length}
//               label="Days"
//             />
//             <StatCard
//               icon={<Users className="w-6 h-6" />}
//               value={client_info.total_travellers}
//               label="Travellers"
//             />
//             <StatCard
//               icon={<MapPin className="w-6 h-6" />}
//               value={formatDate(client_info.tour_start_date)}
//               label="Start Date"
//             />
//             <StatCard
//               icon={<MapPin className="w-6 h-6" />}
//               value={calculateEndDate(client_info.tour_start_date, client_info.tour_length)}
//               label="End Date"
//             />
//           </div>
//         </div>
//       </div>

//       {/* ========================================== */}
//       {/* PAGE 2: INTRODUCTION & STAFF INFO */}
//       {/* ========================================== */}
//       <div className="max-w-6xl mx-auto px-8 py-16 print:py-8">
//         <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-slate-200">
          
//           {/* Greeting */}
//           <div className="mb-8">
//             <h2 className="text-3xl font-bold text-slate-900 mb-4">
//               Dear {client_info.salutation}. {client_info.first_name} {client_info.last_name}
//             </h2>
//             <p className="text-lg text-slate-600 leading-relaxed mb-4">
//               Thank you for your inquiry. It is our pleasure to send you a custom-made quote for our{" "}
//               <span className="font-bold text-slate-900">{client_info.tour_title}</span> as per your request.
//             </p>
//             <p className="text-lg text-slate-600 leading-relaxed mb-4">
//               The tour begins on <span className="font-bold text-slate-900">{formatDate(client_info.tour_start_date)}</span> in{" "}
//               <span className="font-bold text-slate-900">{client_info.start_destination}</span> and runs for{" "}
//               <span className="font-bold text-slate-900">{client_info.tour_length} days</span>.
//             </p>
//             <p className="text-lg text-slate-600 leading-relaxed">
//               Please do not hesitate to contact us if you have any questions. We look forward to helping you plan your safari trip of a lifetime.
//             </p>
//           </div>

//           <div className="border-t border-slate-200 pt-8">
//             <p className="text-lg font-semibold text-slate-900 mb-6">Best regards,</p>
            
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//               {/* Staff Info */}
//               <div className="space-y-2">
//                 <h3 className="text-xl font-bold text-slate-900">{client_info.staff_full_name}</h3>
//                 <p className="text-slate-600">{client_info.staff_company}</p>
//               </div>

//               {/* Contact Info */}
//               <div className="space-y-3">
//                 <div className="flex items-center gap-3">
//                   <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
//                     <Phone className="w-5 h-5 text-indigo-600" />
//                   </div>
//                   <div>
//                     <p className="text-sm text-slate-500">Phone</p>
//                     <p className="text-slate-900 font-medium">{client_info.staff_phone}</p>
//                   </div>
//                 </div>
//                 <div className="flex items-center gap-3">
//                   <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
//                     <Mail className="w-5 h-5 text-indigo-600" />
//                   </div>
//                   <div>
//                     <p className="text-sm text-slate-500">Email</p>
//                     <p className="text-slate-900 font-medium">{client_info.staff_email}</p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Footer */}
//         <PageFooter pageNumber={1} tourCode={client_info.tour_code} clientName={`${client_info.salutation}. ${client_info.first_name} ${client_info.last_name}`} company={client_info.staff_company} />
//       </div>

//       {/* ========================================== */}
//       {/* PAGE 3: PRICING SUMMARY */}
//       {/* ========================================== */}
//       <div className="max-w-6xl mx-auto px-8 py-16 print:py-8">
//         <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-slate-200">
          
//           {/* Header */}
//           <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-200">
//             <div>
//               <h2 className="text-3xl font-bold text-slate-900">Pricing Summary</h2>
//               <p className="text-slate-600 mt-1">Our offer for {client_info.salutation}. {client_info.first_name} {client_info.last_name}</p>
//             </div>
//             <div className="text-right">
//               <p className="text-sm text-slate-500">Ref. Number</p>
//               <p className="text-lg font-bold text-slate-900">{client_info.tour_code}</p>
//             </div>
//           </div>

//           {/* Pricing Breakdown */}
//           <div className="space-y-6">
//             <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-6 border border-slate-200">
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                 <div>
//                   <p className="text-sm text-slate-500 mb-1">Travellers</p>
//                   <p className="text-xl font-bold text-slate-900">{client_info.total_travellers}</p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-slate-500 mb-1">Price Per Person</p>
//                   <p className="text-xl font-bold text-slate-900">${map_image_url?.price_per_person || "0.00"}</p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-slate-500 mb-1">Grand Total</p>
//                   <p className="text-3xl font-black text-emerald-600">${map_image_url?.grand_total || "0.00"}</p>
//                 </div>
//               </div>
//             </div>

//             {/* Total Box */}
//             <div className="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-6">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-lg font-bold text-slate-900">Total in USD</p>
//                   <p className="text-sm text-slate-600">All inclusive pricing</p>
//                 </div>
//                 <p className="text-4xl font-black text-emerald-600">${map_image_url?.grand_total || "0.00"}</p>
//               </div>
//             </div>

//             {/* Confirm Button */}
//             <button
//               onClick={() => toast.warning("Coming soon")}
//               className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-bold py-4 px-6 rounded-2xl transition-all shadow-lg shadow-indigo-600/30"
//             >
//               Confirm Booking
//             </button>
//           </div>
//         </div>

//         <PageFooter pageNumber={2} tourCode={client_info.tour_code} clientName={`${client_info.salutation}. ${client_info.first_name} ${client_info.last_name}`} company={client_info.staff_company} />
//       </div>

//       {/* ========================================== */}
//       {/* PAGE 4: OPTIONAL ACTIVITIES & MEALS */}
//       {/* ========================================== */}
//       <div className="max-w-6xl mx-auto px-8 py-16 print:py-8">
//         <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-slate-200">
          
//           <div className="mb-8">
//             <h2 className="text-3xl font-bold text-slate-900 mb-2">Optional Activities & Meals</h2>
//             <p className="text-slate-600">Not included in the base price - available upon request</p>
//           </div>

//           {/* Optional Activities Table */}
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead>
//                 <tr className="border-b-2 border-slate-200">
//                   <th className="text-left py-3 px-4 font-bold text-slate-900">Optional</th>
//                   <th className="text-left py-3 px-4 font-bold text-slate-900">Destination</th>
//                   <th className="text-left py-3 px-4 font-bold text-slate-900">Price</th>
//                   <th className="text-left py-3 px-4 font-bold text-slate-900">How to Book</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {days.map((day) => {
//                   const optionalActivities = day.activities?.filter(act => act.is_optional) || [];
//                   const optionalMeals = day.optional_meals?.filter(meal => meal.is_optional) || [];

//                   return (
//                     <>
//                       {optionalActivities.map((act, idx) => (
//                         <tr key={`act-${idx}`} className="border-b border-slate-100 hover:bg-slate-50">
//                           <td className="py-4 px-4">
//                             <p className="font-bold text-slate-900">Day {day.day_number}: {act.activity_type_name}</p>
//                             <p className="text-sm text-slate-500">{act.moment_display}</p>
//                           </td>
//                           <td className="py-4 px-4 text-slate-700">{day.destination_info?.name}</td>
//                           <td className="py-4 px-4">
//                             <p className="font-bold text-slate-900">${act.optional_activity_price}</p>
//                             <p className="text-sm text-slate-500">{act.price_per}</p>
//                           </td>
//                           <td className="py-4 px-4 text-sm text-slate-600">Book with us before trip</td>
//                         </tr>
//                       ))}
//                       {optionalMeals.map((meal, idx) => (
//                         <tr key={`meal-${idx}`} className="border-b border-slate-100 hover:bg-slate-50">
//                           <td className="py-4 px-4">
//                             <p className="font-bold text-slate-900">Day {day.day_number}: {meal.meal_name}</p>
//                           </td>
//                           <td className="py-4 px-4 text-slate-700">{day.destination_info?.name}</td>
//                           <td className="py-4 px-4">
//                             <p className="font-bold text-slate-900">${meal.price}</p>
//                             <p className="text-sm text-slate-500">Per Person</p>
//                           </td>
//                           <td className="py-4 px-4 text-sm text-slate-600">Book with us at anytime</td>
//                         </tr>
//                       ))}
//                     </>
//                   );
//                 })}
//               </tbody>
//             </table>
//           </div>
//         </div>

//         <PageFooter pageNumber={3} tourCode={client_info.tour_code} clientName={`${client_info.salutation}. ${client_info.first_name} ${client_info.last_name}`} company={client_info.staff_company} />
//       </div>

//       {/* ========================================== */}
//       {/* PAGE 5: TOUR SUMMARY */}
//       {/* ========================================== */}
//       <div className="max-w-6xl mx-auto px-8 py-16 print:py-8">
//         <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-slate-200">
          
//           {/* Tour Title */}
//           <div className="flex items-start gap-6 mb-8">
//             <div className="flex-1">
//               <h2 className="text-4xl font-black text-slate-900 mb-2">{client_info.tour_title}</h2>
//               <div className="flex items-center gap-6 text-slate-600">
//                 <div className="flex items-center gap-2">
//                   <Calendar className="w-5 h-5" />
//                   <span>{formatDate(client_info.tour_start_date)}</span>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <Users className="w-5 h-5" />
//                   <span>{client_info.total_travellers}</span>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Route Overview */}
//           <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-2xl p-6 mb-8 border border-indigo-200">
//             <div className="flex items-center justify-between">
//               <div className="flex items-center gap-3">
//                 <MapPin className="w-6 h-6 text-indigo-600" />
//                 <div>
//                   <p className="text-sm text-slate-600">Start Destination</p>
//                   <p className="text-lg font-bold text-slate-900">{client_info.start_destination}</p>
//                 </div>
//               </div>
//               <ChevronRight className="w-8 h-8 text-indigo-400" />
//               <div className="flex items-center gap-3">
//                 <MapPin className="w-6 h-6 text-indigo-600" />
//                 <div>
//                   <p className="text-sm text-slate-600">End Destination</p>
//                   <p className="text-lg font-bold text-slate-900">{client_info.end_destination}</p>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Day-by-Day Summary Table */}
//           <div className="mb-8">
//             <h3 className="text-2xl font-bold text-slate-900 mb-4">Day by Day Overview</h3>
//             <div className="overflow-x-auto">
//               <table className="w-full">
//                 <thead>
//                   <tr className="border-b-2 border-slate-200 bg-slate-50">
//                     <th className="text-left py-3 px-4 font-bold text-slate-900">Days</th>
//                     <th className="text-left py-3 px-4 font-bold text-slate-900">Main Destination</th>
//                     <th className="text-left py-3 px-4 font-bold text-slate-900">Accommodation</th>
//                     <th className="text-left py-3 px-4 font-bold text-slate-900">Meal Plan</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {days.map((day, idx) => (
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
//                         <p className="text-sm text-slate-500">
//                           {day.selected_rooms?.map(room => `${room.quantity}× ${room.room_type_name}`).join(", ")}
//                         </p>
//                       </td>
//                       <td className="py-4 px-4">
//                         <p className="font-medium text-slate-900">{getMealPlan(day.included_meals)}</p>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>

//           {/* Highlights */}
//           <div>
//             <h3 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
//               <Award className="w-6 h-6 text-amber-500" />
//               Tour Highlights
//             </h3>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               {days.slice(1, -1).map((day, idx) => (
//                 <div key={idx} className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
//                   <Star className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
//                   <div>
//                     <p className="font-bold text-slate-900">{day.destination_info?.name}</p>
//                     <p className="text-sm text-slate-600">{day.destination_description?.substring(0, 100)}...</p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         <PageFooter pageNumber={4} tourCode={client_info.tour_code} clientName={`${client_info.salutation}. ${client_info.first_name} ${client_info.last_name}`} company={client_info.staff_company} />
//       </div>

//       {/* ========================================== */}
//       {/* PAGE 6: MAP */}
//       {/* ========================================== */}
//       <div className="max-w-6xl mx-auto px-8 py-16 print:py-8">
//         <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-slate-200">
          
//           <div className="mb-8">
//             <h2 className="text-3xl font-bold text-slate-900 mb-2">Your Journey Overview</h2>
//             <p className="text-slate-600">Map showing your safari route and destinations</p>
//           </div>

//           {/* Map Image */}
//           {map_image_url?.map_image && (
//             <div className="mb-8 rounded-2xl overflow-hidden border-2 border-slate-200 shadow-lg">
//               <img src={map_image_url.map_image} alt="Safari Route Map" className="w-full h-auto" />
//             </div>
//           )}

//           {/* Day-by-Day Route */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div>
//               <h3 className="text-xl font-bold text-slate-900 mb-4">Route Details</h3>
//               <div className="space-y-3">
//                 {days.map((day, idx) => (
//                   <div key={idx} className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl">
//                     <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
//                       {day.day_number}
//                     </div>
//                     <div className="flex-1">
//                       <p className="font-bold text-slate-900">{day.destination_info?.name}</p>
//                       <p className="text-sm text-slate-600">
//                         {day.accommodation_info?.name || "No Accommodation"}
//                       </p>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             <div>
//               <h3 className="text-xl font-bold text-slate-900 mb-4">Journey Summary</h3>
//               <div className="space-y-4">
//                 <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-200">
//                   <p className="text-sm text-slate-600">Total Distance</p>
//                   <p className="text-2xl font-bold text-slate-900">{days.length} Destinations</p>
//                 </div>
//                 <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
//                   <p className="text-sm text-slate-600">Total Duration</p>
//                   <p className="text-2xl font-bold text-slate-900">{client_info.tour_length} Days</p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         <PageFooter pageNumber={5} tourCode={client_info.tour_code} clientName={`${client_info.salutation}. ${client_info.first_name} ${client_info.last_name}`} company={client_info.staff_company} />
//       </div>

//       {/* ========================================== */}
//       {/* PAGES 7+: DAY-BY-DAY DETAILS */}
//       {/* ========================================== */}
//       {days.map((day, idx) => (
//         <DayDetailPage
//           key={idx}
//           day={day}
//           pageNumber={6 + idx}
//           tourCode={client_info.tour_code}
//           clientName={`${client_info.salutation}. ${client_info.first_name} ${client_info.last_name}`}
//           company={client_info.staff_company}
//           getMomentIcon={getMomentIcon}
//         />
//       ))}
//     </div>
//   );
// }

// // ==========================================
// // COMPONENTS
// // ==========================================

// function StatCard({ icon, value, label }) {
//   return (
//     <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 text-white">
//       <div className="flex items-center gap-3 mb-2">
//         {icon}
//         <span className="text-sm text-white/80">{label}</span>
//       </div>
//       <p className="text-xl font-bold">{value}</p>
//     </div>
//   );
// }

// function DayDetailPage({ day, pageNumber, tourCode, clientName, company, getMomentIcon }) {
//   return (
//     <div className="max-w-6xl mx-auto px-8 py-16 print:py-8">
//       <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-slate-200">
        
//         {/* Day Header */}
//         <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-200">
//           <div className="flex items-center gap-4">
//             <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-600 to-indigo-700 flex items-center justify-center text-white font-black text-2xl shadow-lg">
//               {day.day_number}
//             </div>
//             <div>
//               <h2 className="text-3xl font-bold text-slate-900">
//                 {day.nights_number > 1
//                   ? `Day ${day.day_number}-${day.day_number + day.nights_number - 1}`
//                   : `Day ${day.day_number}`}
//               </h2>
//               <p className="text-slate-600">{day.date_display}</p>
//             </div>
//           </div>
//           <div className="text-right">
//             <div className="flex items-center gap-2 text-slate-600">
//               <MapPin className="w-5 h-5" />
//               <span className="font-medium">{day.destination_info?.name}</span>
//             </div>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
//           {/* Left Column: Destination & Accommodation */}
//           <div className="space-y-6">
            
//             {/* Destination */}
//             {day.destination_info && (
//               <div>
//                 <div className="relative rounded-2xl overflow-hidden mb-4 h-48">
//                   <img
//                     src={day.destination_info.featured_image}
//                     alt={day.destination_info.name}
//                     className="w-full h-full object-cover"
//                   />
//                   <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
//                   <div className="absolute bottom-4 left-4 text-white">
//                     <h3 className="text-2xl font-bold">{day.destination_info.name}</h3>
//                     <p className="text-sm">{day.destination_info.location}</p>
//                   </div>
//                 </div>
//                 <p className="text-slate-700 leading-relaxed">{day.destination_description}</p>
                
//                 {/* Destination Gallery */}
//                 {day.destination_images && day.destination_images.length > 0 && (
//                   <div className="grid grid-cols-2 gap-3 mt-4">
//                     {day.destination_images.slice(0, 2).map((img, idx) => (
//                       <img key={idx} src={img} alt="" className="w-full h-32 object-cover rounded-xl" />
//                     ))}
//                   </div>
//                 )}
//               </div>
//             )}

//             {/* Accommodation */}
//             {day.accommodation_info && (
//               <div>
//                 <div className="relative rounded-2xl overflow-hidden mb-4 h-48">
//                   <img
//                     src={day.accommodation_info.featured_image}
//                     alt={day.accommodation_info.name}
//                     className="w-full h-full object-cover"
//                   />
//                   <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
//                   <div className="absolute bottom-4 left-4 text-white">
//                     <div className="flex items-center gap-2 mb-1">
//                       <Bed className="w-5 h-5" />
//                       <span className="text-sm font-medium">{day.accommodation_info.tag_label}</span>
//                     </div>
//                     <h3 className="text-2xl font-bold">{day.accommodation_info.name}</h3>
//                     {day.accommodation_info.location && (
//                       <p className="text-sm">{day.accommodation_info.location}</p>
//                     )}
//                   </div>
//                 </div>
//                 <p className="text-slate-700 leading-relaxed">{day.accommodation_description}</p>
                
//                 {/* Rooms */}
//                 {day.selected_rooms && day.selected_rooms.length > 0 && (
//                   <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
//                     <p className="text-sm font-bold text-slate-900 mb-2">Rooms Selected:</p>
//                     <div className="space-y-1">
//                       {day.selected_rooms.map((room, idx) => (
//                         <p key={idx} className="text-sm text-slate-700">
//                           {room.quantity}× {room.room_type_name}
//                         </p>
//                       ))}
//                     </div>
//                   </div>
//                 )}

//                 {/* Accommodation Gallery */}
//                 {day.accommodation_images && day.accommodation_images.length > 0 && (
//                   <div className="grid grid-cols-2 gap-3 mt-4">
//                     {day.accommodation_images.slice(0, 2).map((img, idx) => (
//                       <img key={idx} src={img} alt="" className="w-full h-32 object-cover rounded-xl" />
//                     ))}
//                   </div>
//                 )}
//               </div>
//             )}
//           </div>

//           {/* Right Column: Activities & Meals */}
//           <div className="space-y-6">
            
//             {/* Activities */}
//             {day.activities && day.activities.length > 0 && (
//               <div>
//                 <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
//                   <Compass className="w-5 h-5 text-indigo-600" />
//                   Activities Day {day.day_number}
//                 </h3>
//                 <div className="space-y-3">
//                   {day.activities
//                     .filter(act => !act.is_optional)
//                     .map((act, idx) => (
//                       <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-200">
//                         <div className="flex items-start gap-3">
//                           {getMomentIcon(act.moment)}
//                           <div className="flex-1">
//                             <p className="font-bold text-slate-900">{act.activity_type_name}</p>
//                             <p className="text-sm text-slate-600">
//                               {act.main_location_name && act.main_location_name}
//                               {act.start_location_name && `From ${act.start_location_name}`}
//                               {act.via_location_name && ` via ${act.via_location_name}`}
//                               {act.end_location_name && ` to ${act.end_location_name}`}
//                             </p>
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                 </div>
//               </div>
//             )}

//             {/* Meals */}
//             <div>
//               <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
//                 <Utensils className="w-5 h-5 text-indigo-600" />
//                 Meal Plan
//               </h3>
//               <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
//                 <p className="text-slate-700">{day.included_meals}</p>
//               </div>
//             </div>

//             {/* Optional Activities */}
//             {day.activities?.filter(act => act.is_optional).length > 0 && (
//               <div>
//                 <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
//                   <Sparkles className="w-5 h-5 text-amber-500" />
//                   Optional Activities
//                 </h3>
//                 <div className="space-y-3">
//                   {day.activities
//                     .filter(act => act.is_optional)
//                     .map((act, idx) => (
//                       <div key={idx} className="p-4 bg-amber-50 rounded-xl border border-amber-200">
//                         <div className="flex items-start justify-between">
//                           <div className="flex items-start gap-3">
//                             {getMomentIcon(act.moment)}
//                             <div>
//                               <p className="font-bold text-slate-900">{act.activity_type_name}</p>
//                               <p className="text-sm text-slate-600">
//                                 {act.main_location_name || act.start_location_name || act.end_location_name}
//                               </p>
//                             </div>
//                           </div>
//                           <div className="text-right">
//                             <p className="font-bold text-amber-600">${act.optional_activity_price}</p>
//                             <p className="text-xs text-slate-500">{act.price_per}</p>
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       <PageFooter
//         pageNumber={pageNumber}
//         tourCode={tourCode}
//         clientName={clientName}
//         company={company}
//       />
//     </div>
//   );
// }

// function PageFooter({ pageNumber, tourCode, clientName, company }) {
//   return (
//     <div className="mt-8 pt-6 border-t border-slate-200 flex items-center justify-between text-sm text-slate-500 print:mt-4">
//       <p>Page {pageNumber} | Ref: {tourCode} | {clientName}</p>
//       <p className="font-medium">{company}</p>
//     </div>
//   );
// }
















import { useEffect, useState, useRef, useCallback } from "react";
import { useParams } from "react-router-dom";
import { Printer, Loader2 } from "lucide-react";
import { toast } from "sonner";

import api from "../Apis/api";
import GlobalLoader from "../Component/Loader";

import HeroSection from "./sections/Herosection";
import Page2Component from "./sections/Page2";
import Page3Component from "./sections/Page3";
import Page4Component from "./sections/page4";
import Page5Component from "./sections/page5";
import Page6MapComponent from "./sections/page6Map";
import PdfDayByDayComponent from "./sections/Pdf-day-by-day";
import CompanyAboutPage from "./sections/AboutPage";


const PageWrapper = ({ children, className = "" }) => (
  <div className={`pdf-page bg-white relative ${className}`}>
    {children}
  </div>
);

export default function PreviewDayByDayItineraryPage() {
  const { client_id, version_id } = useParams();
  const [safariData, setSafariData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [download, setDownloading] = useState(false);

  const componentRef = useRef(null);

  const fetchSafariData = useCallback(async () => {
    setLoading(true);
    try {
      const resp = await api.get(`itinerary/preview/client/safari/data/${client_id}/${version_id}/`);
      setSafariData(resp.data);
    } catch (error) {
      const errorMsg = error.response?.data?.detail || error.message || "Something went wrong";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, [client_id]);

  useEffect(() => {
    if (client_id) {
      fetchSafariData();
    } else {
      setLoading(false);
      toast.error("Client ID is missing in the URL.");
    }
  }, [client_id, fetchSafariData]);

  // ✅ SINGLE, correct print handler — waits for fonts + images, then prints

  const handleDownloadPdf = async () => {

     console.log("🚀 PDF Request: Client ID ni ->", client_id);
    console.log("🚀 Aina ya data (Type):", typeof client_id);

    if (!client_id || client_id === "undefined") {
      toast.error("Client ID haipo! Tafadhali refresh page.");
      return;
    }

  setDownloading(true);
  const toastId = toast.loading("Ina-generate PDF ya HD... Tafadhali subiri.");

  try {
    // Backend ina-generate PDF kwa Playwright
    const response = await api.get(`itinerary/view/pdf/${client_id}/`, {
      responseType: "blob",  // Muhimu: tunapokea binary PDF
      timeout: 120000,        // 2 dakika (Playwright inaweza kuchukua muda)
    });

    // Unda blob URL na uipakue
    const blob = new Blob([response.data], { type: "application/pdf" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${safariData.itinerary.client_info.tour_title}.pdf` || `Safari Proposal-${safariData.itinerary.client_info.tour_code}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    toast.success("PDF Imepakuliwa Kikamilifu! 🔥", { id: toastId });
  } catch (error) {
    console.error("PDF error:", error);
    toast.error("Imeshindwa ku-generate PDF. Jaribu tena.", { id: toastId });
  } finally {
    setDownloading(false);
  }
};

  if (loading) return <GlobalLoader />;

  if (!safariData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#1A1815]">
        <div className="text-center bg-white p-10 rounded-2xl shadow-2xl max-w-md mx-4">
          <h2 className="text-2xl font-bold text-[#16211A] ddw-serif">
            No data available
          </h2>
          <p className="text-[#6B6153] mt-3">
            Please check your connection and try again.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1A1815] py-16 print:bg-white print:p-0 print:m-0 font-sans">
      {/* 🌟 Floating Action Button (hidden in print) */}
      <div className="fixed top-6 right-6 z-50 print:hidden">
        <button
          onClick={handleDownloadPdf}
          disabled={download}
          className="flex items-center gap-2 bg-[#B98B3E] hover:bg-[#A37A34] disabled:opacity-70 disabled:cursor-not-allowed text-[#16211A] font-bold px-6 py-3 rounded-xl shadow-2xl transition-all active:scale-95 cursor-pointer"
        >
          {download ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Printer className="w-5 h-5" />
          )}
          {download ? "Ina-andaa..." : "Download PDF"}
        </button>
      </div>

      {/* 🖨️ Printable Area — each PageWrapper is exactly one A4 page */}
      <div
        ref={componentRef}
        className="flex flex-col items-center gap-10 print:block print:gap-0"
      >
        <PageWrapper>
          <HeroSection safariData={safariData} />
        </PageWrapper>

        <PageWrapper>
          <Page2Component safariData={safariData} />
        </PageWrapper>

        <PageWrapper>
          <Page3Component safariData={safariData} />
        </PageWrapper>

        <PageWrapper>
          <Page4Component safariData={safariData} />
        </PageWrapper>

        <PageWrapper>
          <Page5Component safariData={safariData} />
        </PageWrapper>

        <PageWrapper>
          <Page6MapComponent safariData={safariData} />
        </PageWrapper>

        <PageWrapper>
          <PdfDayByDayComponent safariData={safariData} />
        </PageWrapper>

        <PageWrapper>
          <CompanyAboutPage safariData={safariData} />
        </PageWrapper>

        {/* PAGE 9: BACK COVER (last page — no forced break after it) */}
        <PageWrapper className="flex items-center justify-center">
          <div className="text-center p-12 space-y-6">
            <div className="w-16 h-16 mx-auto rounded-full bg-[#F8F4EA] flex items-center justify-center border border-[#B98B3E]/20">
              <span className="text-2xl">✨</span>
            </div>
            <h2 className="text-4xl font-bold text-[#16211A] ddw-serif">
              End of Proposal
            </h2>
            <div className="h-px w-24 bg-[#B98B3E] mx-auto" />
            <p className="text-[#6B6153] text-lg max-w-md mx-auto leading-relaxed">
              We look forward to welcoming you on this incredible journey and
              creating unforgettable memories together.
            </p>
            <p className="text-sm text-[#B98B3E] font-bold uppercase tracking-widest pt-4">
              {safariData?.itinerary?.client_info?.staff_company || "ACE"} Safaris Ltd.
            </p>
          </div>
        </PageWrapper>
      </div>
    </div>
  );
}
