// import { useEffect, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom"
// import DestinationComponent from "./Destination";
// import api from "../../../Apis/api";
// import GlobalLoader from "../../../Component/Loader";
// import { toast } from "sonner";


// export default function ClientRequestInformationPage() {

//     const TOUR_TYPES = [
//                         "Group Tour",
//                         "Solo Tour",
//                         "Private Tour",
//                         "Family Tour",
//                         "Luxury Tour",
//                         "Budget Tour"
//         ];

//     const TOUR_LENGTH = [
//     {value: 1, label : "1 Day"},
//     {value: 2, label : "2 Days / 1 Night"},
//     {value: 3, label : "3 Days / 2 Nights"},
//     {value: 4, label : "4 Days / 3 Nights"},
//     {value: 5, label : "5 Days / 4 Nights"},
//     {value: 6, label : "6 Days / 5 Nights"},
//     {value: 7, label : "7 Days / 6 Nights"},
//     {value: 8, label : "8 Days / 7 Nights"},
//     {value: 9, label : "9 Days / 8 Nights"},
//     {value: 10, label : "10 Days / 9 Nights"},
//     {value: 11, label : "11 Days / 10 Nights"},
//     {value: 12, label : "12 Days / 11 Nights"},
//     {value: 13, label : "13 Days / 12 Nights"},
//     {value: 14, label : "14 Days / 13 Nights"},
//     {value: 15, label : "15 Days / 14 Nights"},
//     {value: 16, label : "16 Days / 15 Nights"},
//     {value: 17, label : "17 Days / 16 Nights"},
//     {value: 18, label : "18 Days / 17 Nights"},
//     {value: 19, label : "19 Days / 18 Nights"},
//     {value: 20, label : "20 Days / 19 Nights"},
//     {value: 21, label : "21 Days / 20 Nights"},
//     {value: 22, label : "22 Days / 21 Nights"},
//     {value: 23, label : "23 Days / 22 Nights"},
//     {value: 24, label : "24 Days / 23 Nights"},
//     {value: 25, label : "25 Days / 24 Nights"},
//     {value: 26, label : "26 Days / 25 Nights"},
//     {value: 27, label : "27 Days / 26 Nights"},
//     {value: 28, label : "28 Days / 27 Nights"},
//     {value: 29, label : "29 Days / 28 Nights"},
//     {value: 30, label : "30 Days / 29 Nights"},
//     {value: "custom", label : "Enter Custom Number"}
// ];
    

//     const COUNTRY_VISITED = [
//         "Tanzania","Kenya","Uganda","Rwanda",
//         ". South Africa","Zambia","Botswana"
//     ]





//     const {clientId} = useParams();
//     const navigate = useNavigate();

//     const [clientInfo, setClientInfo] = useState([]);
//     const [laoding, setLoading] = useState(false);


//     const [tour_title, setTourTitle] = useState("")
//     const [tour_type, setTourType] = useState("")
//     const [tour_length, setTourLength] = useState("")

//     const [customTourTength, setCustomTourLength] = useState("")

//     const [country_visited, setCountryVisited] = useState("");
//     const [tour_start_date, setTourStartDate] = useState("");

//     const [startDestinationId, setStartDestinationId] = useState(null);
//     const [endDestinationId, setEndDestinationId] = useState(null);

//     const [request_info, setRequestInfo] = useState("");
//     const [showSuccessPopup, setShowSuccessPopup] = useState(false);



//     const handleStartSelect = (id)=>{
//       setStartDestinationId(id);
//       console.log("Start dest id ", id);
//     }

//     const handleEndSelect = (e)=>{
//       setEndDestinationId(id);
//       console.log("End destination: ",id);
//     }




//     const [travellers, setTravellers] = useState([
//         {label: "Adults", number: 1},
//     ]);

//     const [rooms, setRooms] = useState([
//         {label: "Single Room", number: 1},
//     ]);



//     const handleCustomTourLength = (e)=>{
//         setCustomTourLength(e.target.value);

//         // here we ge a number our goal is to submit a number not text;
//         let customLength = null;

//         if (customTourTength){
//             customLength = customTourTength.trim().find('Day'||'Days').split(' ').[0];
//         }
//     }

//     const getClientInformation = async ()=>{
//         setLoading(true);
//         try{
//             const resp = await api.get(`clients/update/clients/${clientId}/`)
//             setClientInfo(resp.data);
//         }catch(error){
//             const errorMsg = error.response.data?.detail || "Something went wrong. Try again later";
//             toast.error(errorMsg);
//         }finally{
//             setLoading(false);
//         }
//     }

//     useEffect(()=>{
//         getClientInformation();
//     }, [clientId]);


//     const handleSubmit = async (e)=>{
//       if (!validation()){
//         toast.error("Please fix the error to go.")
//         return;
//       }
//       try{
//         const resp = await api.post(
//           "clients/create/clients/request/",
//           {
//             client_requested: clientInfo.id,
//             tour_title,
//             tour_type,
//             tour_length: if is custom converted to number;
//             country_visited,
//             tour_start_date,
//             start_destination: startDestinationId,
//             end_destination: endDestinationId,
//             request_info,
//             travellers: travellers,
//             room_selected: rooms,

//           } 
//         )

//         setShowSuccessPopup(true);

//         setTimeout(() => {
//           navigate("preview/client/allinfo/")
//         }, 1100);

//       }
//     }





//     return(
//         <div>

//              <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800/60 rounded-2xl shadow-2xl shadow-fuchsia-500/5 p-6 sm:p-8 transition-all duration-300">

//              <div className="flex items-center" >
//               <div>
//                  <h1>Tour Request Information for</h1>
//                  <div>
//                     <h1>{clientInfo.salutation}. {clientInfo.first_name} {clientInfo.last_name}</h1>
//                     <span>From </span>
//                     <h1>{clientInfo.country}</h1>
//                  </div>
//                  <div>
//                    <span className="text-xs" >Complete the form above to go.</span>
//                  </div>
//               </div>
                
//              </div>
//                                 <form onSubmit={handleSubmit} className="space-y-6">
            
//                                     {/* ── Row: Salutation + First + Last ── */}
//                                     <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
//                                         {/* Salutation */}
//                                         <div className="sm:col-span-3 space-y-1.5">
//                                             <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
//                                                 Tour Title <span className="text-fuchsish-500">*</span>
//                                             </label>
//                                             <div className="relative">
//                                                 <input type="text"
//                                                     placeholder="eg. 7 Days / 6 Nights in Central serengeti national park"
//                                                     value={tour_title}
//                                                     onChange={(e) => setTourTitle(e.target.value)}
//                                                     onBlur={() => handleBlur('tour_title')}
//                                                     className={`w-full bg-slate-950 border rounded-xl px-4 py-3 pr-10 text-sm text-slate-100 appearance-none cursor-pointer transition-all duration-200 focus:outline-none focus:ring-2 ${
//                                                         getFieldError('tour_title')
//                                                             ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
//                                                             : 'border-slate-800 focus:border-fuchsia-500 focus:ring-fuchsia-500/20'
//                                                     }`}
//                                                 />
//                                             </div>
//                                             {getFieldError('tour_title') && (
//                                                 <p className="text-xs text-red-400 mt-1 animate-in slide-in-from-top-1">
//                                                     {getFieldError('tour_title')}
//                                                 </p>
//                                             )}
//                                         </div>
            
//                                         {/* First Name */}
//                                         <div className="sm:col-span-4 space-y-1.5">
//                                             <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
//                                                 Tour Type <span className="text-fuchsia-500">*</span>
//                                             </label>

//                                             {TOUR_TYPES.map((val)=>(
//                                                 <span
//                                                 onClick={(e)=>setTourType(e.value.target)}
//                                                 >{val}</span>
//                                             ))} // when is cliked select it and  set it? 
                                            

//                                             {getFieldError('tour_type') && (
//                                                 <p className="text-xs text-red-400 mt-1 animate-in slide-in-from-top-1">
//                                                     {getFieldError('tour_type')}
//                                                 </p>
//                                             )}
//                                         </div>
            
//                                         {/* Last Name */}
//                                         <div className="sm:col-span-5 space-y-1.5">
//                                             <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
//                                                 Tour Length <span className="text-fuchsia-500">*</span>
//                                             </label>

//                                             <select name="" 
//                                             onChange={(e)=> setTourLength(e.target.value)}
//                                              required id="">
//                                                 <optgroup>-select-</optgroup>
//                                                 {TOUR_LENGTH.map((tours)=>(
//                                                     <option value={tours.value}>{tours.label}</option>
//                                                 ))}
//                                             </select>
//                                             {tour_length === "custom" && (
//                                                 <div>
//                                                <label htmlFor="">Enter here a custom Tour Length</label>
//                                                     <input
//                                                     onChange={()=> setCustomTourLength(e.target.value) }
//                                                     required type="text" placeholder="eg. 45 Days / 44 Nights"/>
//                                                 </div>

//                                             ) }

//                                             {getFieldError('tour_length') && (
//                                                 <p className="text-xs text-red-400 mt-1 animate-in slide-in-from-top-1">
//                                                     {getFieldError('tour_length')}
//                                                 </p>
//                                             )}
//                                         </div>

//                                     </div>

//                                     <div>

//                                         <label htmlFor="">Country Visited</label> // here can select multiple
//                                         {COUNTRY_VISITED.map((country)=>(
//                                             <div>
//                                                 <span>{country} {is selected ? "+":"-"}</span>
//                                             </div>
//                                         ))}
//                                     </div>
            

//                                     <div className="space-y-1.5">
//                                         <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
//                                             Tour Start Date <span className="text-fuchsia-500">*</span>
//                                         </label>
//                                         <div className="relative">
//                                             <input
//                                              onChange={(e)=>setTourStartDate(e.target.value)}
//                                              type="date" name="" 
//                                              disabled={ Date.now() < tour_start_date}
//                                              value={tour_start_date} 

//                                               />

//                                         </div>
//                                         {getFieldError('tour_start_date') && (
//                                             <p className="text-xs text-red-400 mt-1 animate-in slide-in-from-top-1">
//                                                 {getFieldError('tour_start_date')}
//                                             </p>
//                                         )}
//                                     </div>
            
    
//                                     <div className="space-y-1.5" ref={countryRef}>
//                                         <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
//                                             Start Destination <span className="text-fuchsia-500">*</span>
//                                         </label>
//                                         <div className="relative">
//                                             <DestinationComponent
//                                              onSelect={handleStartSelect}
//                                             />
//                                         </div>

//                                         <div className="space-y-1.5" ref={countryRef}>
//                                         <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
//                                             End Destination <span className="text-fuchsia-500">*</span>
//                                         </label>
//                                         <div className="relative">
//                                             <DestinationComponent
//                                             onSelect={handleEndSelect}
//                                             />
//                                         </div>
                                       

//                                     </div>

//                                     <div>
//                                             <div className="flex items-center justify-between border-b border-slate-800 pb-3">
//                                             <label className="text-sm font-bold text-white flex items-center gap-2">
//                                                 <Users className="w-4 h-4 text-fuchsia-400" />
//                                                 Travellers
//                                             </label>
//                                             <span className="text-xs text-slate-500 font-medium">
//                                                 {travellers.reduce((acc, curr) => acc + Number(curr.number || 0), 0)} Total
//                                             </span>
//                                             </div>

//                                                   <div className="space-y-3">
//         {travellers.map((item, index) => (
//           <div key={index} className="flex items-center gap-3 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
//             {/* Quantity Selector */}
//             <div className="relative w-24">
//               <select
//                 value={item.number}
//                 onChange={(e) => handleTravellerChange(index, "number", e.target.value)}
//                 className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs font-semibold text-slate-100 focus:outline-none focus:border-fuchsia-500 appearance-none cursor-pointer"
//               >
//                 {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
//                   <option key={num} value={num} className="bg-slate-900 text-slate-100">
//                     {num}
//                   </option>
//                 ))}
//               </select>
//               <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none text-slate-500">
//                 <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
//                 </svg>
//               </div>
//             </div>

//             {/* Type Selector */}
//             <div className="relative flex-1">
//               <select
//                 value={item.label}
//                 onChange={(e) => handleTravellerChange(index, "label", e.target.value)}
//                 className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs font-semibold text-slate-100 focus:outline-none focus:border-fuchsia-500 appearance-none cursor-pointer"
//               >
//                 <option value="Adults" className="bg-slate-900 text-slate-100">Adults</option>
//                 <option value="Children" className="bg-slate-900 text-slate-100">Children</option>
//                 <option value="Infants" className="bg-slate-900 text-slate-100">Infants</option>
//               </select>
//               <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none text-slate-500">
//                 <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
//                 </svg>
//               </div>
//             </div>

//                         {travellers.length > 1 && (
//                           <button
//                             type="button"
//                             onClick={() => handleRemoveTraveller(index)}
//                             className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
//                             title="Remove row"
//                           >
//                             <Trash2 size={16} />
//                           </button>
//                         )}

//                               <button
//                                 type="button"
//                                 onClick={handleAddTraveller}
//                                 className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 text-fuchsia-400 hover:text-fuchsia-300 text-xs font-semibold rounded-xl transition-all cursor-pointer"
//                               >
//                                 <Plus size={14} />
//                                 <span>Add Traveller Type</span>
//                               </button>
//                                     </div>

//                                         <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 space-y-4">
//                                           <div className="flex items-center justify-between border-b border-slate-800 pb-3">
//                                             <label className="text-sm font-bold text-white flex items-center gap-2">
//                                               <Bed className="w-4 h-4 text-indigo-400" />
//                                               Room
//                                             </label>
//                                             <span className="text-xs text-slate-500 font-medium">
//                                               {rooms.reduce((acc, curr) => acc + Number(curr.number || 0), 0)} Rooms
//                                             </span>
//                                           </div>
                                    
//                                           <div className="space-y-3">
//                                             {rooms.map((item, index) => (
//                                               <div key={index} className="flex items-center gap-3 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
//                                                 {/* Room Quantity */}
//                                                 <div className="relative w-24">
//                                                   <select
//                                                     value={item.number}
//                                                     onChange={(e) => handleRoomChange(index, "number", e.target.value)}
//                                                     className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs font-semibold text-slate-100 focus:outline-none focus:border-fuchsia-500 appearance-none cursor-pointer"
//                                                   >
//                                                     {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
//                                                       <option key={num} value={num} className="bg-slate-900 text-slate-100">
//                                                         {num}
//                                                       </option>
//                                                     ))}
//                                                   </select>
//                                                   <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none text-slate-500">
//                                                     <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
//                                                     </svg>
//                                                   </div>
//                                                 </div>
                                    
//                                                 {/* Room Type */}
//                                                 <div className="relative flex-1">
//                                                   <select
//                                                     value={item.label}
//                                                     onChange={(e) => handleRoomChange(index, "label", e.target.value)}
//                                                     className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs font-semibold text-slate-100 focus:outline-none focus:border-fuchsia-500 appearance-none cursor-pointer"
//                                                   >
//                                                     <option value="Single Room" className="bg-slate-900 text-slate-100">Single Room</option>
//                                                     <option value="Double Room" className="bg-slate-900 text-slate-100">Double Room</option>
//                                                     <option value="Twin Room" className="bg-slate-900 text-slate-100">Twin Room</option>
//                                                     <option value="Triple Room" className="bg-slate-900 text-slate-100">Triple Room</option>
//                                                     <option value="Family Room" className="bg-slate-900 text-slate-100">Family Room</option>
//                                                   </select>
//                                                   <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none text-slate-500">
//                                                     <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
//                                                     </svg>
//                                                   </div>
//                                                 </div>
                                    
//                                                 {/* Remove Button */}
//                                                 {rooms.length > 1 && (
//                                                   <button
//                                                     type="button"
//                                                     onClick={() => handleRemoveRoom(index)}
//                                                     className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
//                                                     title="Remove row"
//                                                   >
//                                                     <Trash2 size={16} />
//                                                   </button>
//                                                 )}
//                                               </div>
//                                             ))}
//                                           </div>
                                    
//                                           <button
//                                             type="button"
//                                             onClick={handleAddRoom}
//                                             className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 text-indigo-400 hover:text-indigo-300 text-xs font-semibold rounded-xl transition-all cursor-pointer"
//                                           >
//                                             <Plus size={14} />
//                                             <span>Add Room Option</span>
//                                           </button>
//                                         </div>

//                                         <div>
//                                             <label htmlFor="">Request Information</label>
//                                             <textarea name="" value={request_info} onChange={(e)=> setRequestInfo(e.target.value)} id=""></textarea>
//                                         </div>


            

//                                     {/* ─── Submit Button ─── */}
//                                     <div className="pt-2">
//                                         <button
//                                             type="submit"
//                                             disabled={isSubmitting}
//                                             className="w-full relative flex items-center justify-center gap-2.5 bg-gradient-to-r from-fuchsia-600 to-fuchsia-500 hover:from-fuchsia-500 hover:to-fuchsia-400 disabled:from-fuchsia-700 disabled:to-fuchsia-700 text-white font-semibold py-3.5 px-6 rounded-xl transition-all duration-300 shadow-lg shadow-fuchsia-500/25 hover:shadow-fuchsia-500/40 disabled:shadow-none disabled:cursor-not-allowed text-sm sm:text-base"
//                                         >
//                                             {isSubmitting ? (
//                                                 <>
//                                                     <Loader2 className="w-5 h-5 animate-spin" />
//                                                     Saving…
//                                                 </>
//                                             ) : (
//                                                 <>
//                                                     <CheckCircle2 className="w-5 h-5" />
//                                                     Save & Continue
//                                                 </>
//                                             )}
//                                         </button>
//                                     </div>
//                                 </form>

//                               {showSuccessPopup && (

//                                <div className="flex items-center" > moder stylish pop up 
//                                   <h1>Client Request information saved success fully</h1>
//                                   <span>Redirecting to -> Preview Client Information & create a Quote</span>
//                                   <span>Wait...</span>

//                                 </div>


//                               )}



//         </div>
//     )
    
// }




















// pages/ClientRequestInformationPage.jsx
import { useNavigate, useParams } from 'react-router-dom';
import { useClientRequestForm } from './customHook';
import DestinationComponent from './Destination';
import GlobalLoader from '../../../Component/Loader';
import { CheckCircle2, Loader2, Users, Bed, Plus, Trash2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ClientRequestInformationPage() {
  const { clientId } = useParams();
  const navigate = useNavigate();
  const form = useClientRequestForm(clientId, navigate);

  // if (form.loading) return <GlobalLoader />;
  // if (!form.clientInfo) return null;


  const COUNTRY_LIST = [
            "Tanzania","Kenya","Uganda","Rwanda",
        ". South Africa","Zambia","Botswana"
      ];



  const TOUR_LENGTH_OPTIONS =[
      {value: 1, label : "1 Day"},
      {value: 2, label : "2 Days / 1 Night"},
      {value: 3, label : "3 Days / 2 Nights"},
      {value: 4, label : "4 Days / 3 Nights"},
      {value: 5, label : "5 Days / 4 Nights"},
      {value: 6, label : "6 Days / 5 Nights"},
      {value: 7, label : "7 Days / 6 Nights"},
      {value: 8, label : "8 Days / 7 Nights"},
      {value: 9, label : "9 Days / 8 Nights"},
      {value: 10, label : "10 Days / 9 Nights"},
      {value: 11, label : "11 Days / 10 Nights"},
      {value: 12, label : "12 Days / 11 Nights"},
      {value: 13, label : "13 Days / 12 Nights"},
      {value: 14, label : "14 Days / 13 Nights"},
      {value: 15, label : "15 Days / 14 Nights"},
      {value: 16, label : "16 Days / 15 Nights"},
      {value: 17, label : "17 Days / 16 Nights"},
      {value: 18, label : "18 Days / 17 Nights"},
      {value: 19, label : "19 Days / 18 Nights"},
      {value: 20, label : "20 Days / 19 Nights"},
      {value: 21, label : "21 Days / 20 Nights"},
      {value: 22, label : "22 Days / 21 Nights"},
      {value: 23, label : "23 Days / 22 Nights"},
      {value: 24, label : "24 Days / 23 Nights"},
      {value: 25, label : "25 Days / 24 Nights"},
      {value: 26, label : "26 Days / 25 Nights"},
      {value: 27, label : "27 Days / 26 Nights"},
      {value: 28, label : "28 Days / 27 Nights"},
      {value: 29, label : "29 Days / 28 Nights"},
      {value: 30, label : "30 Days / 29 Nights"},
      {value: "custom", label : "Enter Custom Number"}
  ];

  return (
    <div className="min-h-screen bg-slate-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-4 bg-slate-900/80 backdrop-blur-sm border border-slate-800/60 rounded-2xl p-6 shadow-2xl shadow-fuchsia-500/5">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                <span className="text-fuchsia-400">Tour Request</span>
                <span className="text-slate-500">for</span>
                <span className="text-slate-200">
                  {/* {form.clientInfo.salutation || "-"}. {form.clientInfo.first_name || "-"} {form.clientInfo.last_name || "-"} */}
                </span>
              </h1>
              <div className="flex items-center gap-3 mt-1 text-sm text-slate-400">
                {/* <span>📧 {form.clientInfo.email}</span> */}
                <span>•</span>
                {/* <span>📍 {form.clientInfo.country || 'N/A'}</span> */}
                <span>•</span>
                <span className="text-xs text-slate-500">Complete the form below to proceed</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Form */}
        <form onSubmit={form.handleSubmit} className="space-y-6">
          {/* Row: Tour Title, Type, Length */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Tour Title */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Tour Title <span className="text-fuchsia-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. 7 Days / 6 Nights in Central Serengeti"
                value={form.tourTitle}
                onChange={(e) => form.setTourTitle(e.target.value)}
                className={`w-full bg-slate-900 border rounded-xl px-4 py-3 text-sm text-slate-100 transition-all duration-200 focus:outline-none focus:ring-2 ${
                  form.errors.tourTitle
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                    : 'border-slate-800 focus:border-fuchsia-500 focus:ring-fuchsia-500/20'
                }`}
              />
              {form.errors.tourTitle && (
                <p className="text-xs text-red-400 mt-1">{form.errors.tourTitle}</p>
              )}
            </div>



            {/* Tour Length */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Tour Length <span className="text-fuchsia-500">*</span>
              </label>
              <select
                value={form.tourLength}
                onChange={(e) => form.setTourLength(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-fuchsia-500"
              >
                <option value="">Select duration</option>
                {TOUR_LENGTH_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              {form.tourLength === 'custom' && (
                <div className="mt-2 space-y-1">
                  <input
                    type="text"
                    placeholder="e.g. 45 Days / 44 Nights"
                    value={form.customTourLength}
                    onChange={(e) => form.setCustomTourLength(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-100 focus:outline-none focus:border-fuchsia-500"
                  />
                  {form.errors.customTourLength && (
                    <p className="text-xs text-red-400">{form.errors.customTourLength}</p>
                  )}
                </div>
              )}
              {form.errors.tourLength && (
                <p className="text-xs text-red-400 mt-1">{form.errors.tourLength}</p>
              )}
            </div>

          </div>


            {/* Tour Type - Buttons */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Tour Type <span className="text-fuchsia-500">*</span>
              </label>
              <div className="flex items-center flex-wrap gap-2">
                {['Group Tour', 'Solo Tour', 'Private Tour', 'Family Tour', 'Luxury Tour', 'Budget Tour'].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => form.setTourType(type)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      form.tourType === type
                        ? 'bg-fuchsia-600 text-white shadow-lg shadow-fuchsia-500/30'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>

              {form.errors.tourType && (
                <p className="text-xs text-red-400 mt-1">{form.errors.tourType}</p>
              )}
            </div>




        <div className='grid grid-cols-2 gap-8'>
          {/* Country Visited - Multi-select with badges */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Countries Visited <span className="text-fuchsia-500">*</span>
            </label>
            <div className="flex items-center justify-center flex-wrap gap-2">
              {COUNTRY_LIST.map((country) => (
                <button
                  key={country}
                  type="button"
                  onClick={() => form.toggleCountry(country)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    form.countryVisited.includes(country)
                      ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/30'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {country}
                </button>
              ))}
            </div>
            {/* {form.countryVisited.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {form.countryVisited.map((c) => (
                  <span key={c} className="inline-flex items-center gap-1 px-3 py-1 bg-slate-800 rounded-full text-xs text-slate-300">
                    {c}
                    <button type="button" onClick={() => form.toggleCountry(c)} className="hover:text-red-400">
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
            )} */}
            {form.errors.countryVisited && (
              <p className="text-xs text-red-400">{form.errors.countryVisited}</p>
            )}
          </div>

          {/* Start Date */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Tour Start Date <span className="text-fuchsia-500">*</span>
            </label>
            <input
              type="date"
              value={form.tourStartDate}
              onChange={(e) => form.setTourStartDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className={`w-full bg-slate-900 border rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:ring-2 ${
                form.errors.tourStartDate
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                  : 'border-slate-800 focus:border-fuchsia-500 focus:ring-fuchsia-500/20'
              }`}
            />
            {form.errors.tourStartDate && (
              <p className="text-xs text-red-400">{form.errors.tourStartDate}</p>
            )}
          </div>
      </div>




          {/* Start & End Destination */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Start Destination <span className="text-fuchsia-500">*</span>
              </label>
              <DestinationComponent onSelect={form.setStartDestinationId} />
              {form.errors.startDestination && (
                <p className="text-xs text-red-400">{form.errors.startDestination}</p>
              )}
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                End Destination <span className="text-fuchsia-500">*</span>
              </label>
              <DestinationComponent onSelect={form.setEndDestinationId} />
              {form.errors.endDestination && (
                <p className="text-xs text-red-400">{form.errors.endDestination}</p>
              )}
            </div>
          </div>

          {/* Travellers Section */}
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <label className="text-sm font-bold text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-fuchsia-400" />
                Travellers
              </label>
              <span className="text-xs text-slate-500 font-medium">
                {form.totalTravellers} Total
              </span>
            </div>
            <AnimatePresence>
              {form.travellers.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center gap-3 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80"
                >
                  <div className="relative w-24">
                    <select
                      value={item.number}
                      onChange={(e) => form.updateTraveller(index, 'number', e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs font-semibold text-slate-100 focus:outline-none focus:border-fuchsia-500"
                    >
                      {[1,2,3,4,5,6,7,8,9,10].map(num => (
                        <option key={num} value={num}>{num}</option>
                      ))}
                    </select>
                  </div>
                  <div className="relative flex-1">
                    <select
                      value={item.label}
                      onChange={(e) => form.updateTraveller(index, 'label', e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs font-semibold text-slate-100 focus:outline-none focus:border-fuchsia-500"
                    >
                      <option value="Adults">Adults</option>
                      <option value="Children">Children</option>
                      <option value="Infants">Infants</option>
                    </select>
                  </div>
                  {form.travellers.length > 1 && (
                    <button type="button" onClick={() => form.removeTraveller(index)} className="p-2 text-slate-500 hover:text-red-400">
                      <Trash2 size={16} />
                    </button>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
            <button
              type="button"
              onClick={form.addTraveller}
              className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 text-fuchsia-400 hover:text-fuchsia-300 text-xs font-semibold rounded-xl transition-all"
            >
              <Plus size={14} /> Add Traveller Type
            </button>
          </div>

          {/* Rooms Section */}
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <label className="text-sm font-bold text-white flex items-center gap-2">
                <Bed className="w-4 h-4 text-indigo-400" />
                Rooms
              </label>
              <span className="text-xs text-slate-500 font-medium">
                {form.totalRooms} Rooms
              </span>
            </div>
            <AnimatePresence>
              {form.rooms.map((item, index) => (
                <motion.div key={index} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex items-center gap-3 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                  <div className="relative w-24">
                    <select
                      value={item.number}
                      onChange={(e) => form.updateRoom(index, 'number', e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs font-semibold text-slate-100 focus:outline-none focus:border-fuchsia-500"
                    >
                      {[1,2,3,4,5,6,7,8,9,10].map(num => (
                        <option key={num} value={num}>{num}</option>
                      ))}
                    </select>
                  </div>
                  <div className="relative flex-1">
                    <select
                      value={item.label}
                      onChange={(e) => form.updateRoom(index, 'label', e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs font-semibold text-slate-100 focus:outline-none focus:border-fuchsia-500"
                    >
                      <option value="Single Room">Single Room</option>
                      <option value="Double Room">Double Room</option>
                      <option value="Twin Room">Twin Room</option>
                      <option value="Triple Room">Triple Room</option>
                      <option value="Family Room">Family Room</option>
                    </select>
                  </div>
                  {form.rooms.length > 1 && (
                    <button type="button" onClick={() => form.removeRoom(index)} className="p-2 text-slate-500 hover:text-red-400">
                      <Trash2 size={16} />
                    </button>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
            <button
              type="button"
              onClick={form.addRoom}
              className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 text-indigo-400 hover:text-indigo-300 text-xs font-semibold rounded-xl transition-all"
            >
              <Plus size={14} /> Add Room Option
            </button>
          </div>

          {/* Request Info */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Additional Request Info
            </label>
            <textarea
              value={form.requestInfo}
              onChange={(e) => form.setRequestInfo(e.target.value)}
              rows={4}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-fuchsia-500"
              placeholder="Any special requests or notes..."
            />
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={form.isSubmitting}
              className="w-full relative flex items-center justify-center gap-2.5 bg-gradient-to-r from-fuchsia-600 to-fuchsia-500 hover:from-fuchsia-500 hover:to-fuchsia-400 disabled:from-fuchsia-700 disabled:to-fuchsia-700 text-white font-semibold py-3.5 px-6 rounded-xl transition-all duration-300 shadow-lg shadow-fuchsia-500/25 hover:shadow-fuchsia-500/40 disabled:shadow-none disabled:cursor-not-allowed text-sm sm:text-base"
            >
              {form.isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Saving…
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  Save & Continue
                </>
              )}
            </button>
          </div>
        </form>

        {/* Success Popup */}
        <AnimatePresence>
          {form.showSuccess && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm"
            >
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 max-w-md w-full shadow-2xl shadow-fuchsia-500/20">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8 text-green-500" />
                  </div>
                  <h2 className="text-xl font-bold text-white mb-2">Success!</h2>
                  <p className="text-slate-300 text-sm"> 
                    Client request information saved successfully.
                  </p>
                  <p className="text-slate-400 text-xs mt-2">
                    Redirecting to preview page...
                  </p>
                  <div className="mt-4 w-full bg-slate-800 rounded-full h-1 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-fuchsia-500 to-fuchsia-400 animate-progress"></div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}