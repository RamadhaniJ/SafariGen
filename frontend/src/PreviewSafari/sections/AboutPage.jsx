// import { DiameterIcon, MailBadge, MapIcon, PhoneCall } from "lucide-react";
// import PageFooter from "../shared/pageFooter";

// export default function CompanyAboutPage({safariData}) {
//       const { hero_image, itinerary } = safariData || {};
//       const { client_info, days } = itinerary || {};

//     return(
//         <div>
//     <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
//         <div className="bg-[#2B2620] text-[#F8F4EA] rounded-lg px-5 py-2.5 shadow-sm">
//           <h1 className="text-xs font-bold tracking-[0.15em] uppercase">
//             About Us
//           </h1>
//         </div>
//       </div>
//             <div className="grid grid-cols-2" >
//                 <div>
//                     <h1>{client_info.staff_company} Safaris Ltd.</h1>
//                     <p>{client_info.company_about || "We run ...."}</p>
//                     <div>
//                         <h1>Contact Us</h1>
//                         <div className="grid grid-cols-2" >
//                             <div>
//                                 <h1>
//                                   <MapIcon/> Address 
//                                 </h1>
//                             </div>
//                             <div>
//                                 <h1>{client_info.company_address || "Arusha Sekei"}</h1>
//                             </div>


//                          <div>
//                                 <h1>
//                                   <Browser/> Country 
//                                 </h1>
//                             </div>
//                             <div>
//                                 <h1>{client_info.company_country || "Tanzania"}</h1>
//                             </div>

//                         <div>
//                                 <h1>
//                                   <PhoneCall/> Whatsupp Number 
//                                 </h1>
//                             </div>
//                             <div>
//                                 <h1>{client_info.company_whatsup_number || "+255 784892320"}</h1>
//                             </div>

                        
//                             <div>
//                                 <h1>
//                                   <PhoneCall/> Phone Number 
//                                 </h1>
//                             </div>
//                             <div>
//                                 <h1>{client_info.company_phone_number || "+255 7849002320"}</h1>
//                             </div>

//                         <div>
//                                 <h1>
//                                   <MailBadge/> Email 
//                                 </h1>
//                             </div>
//                             <div>
//                                 <h1>{client_info.company_email || "safarisltd@"}</h1>
//                             </div>

//                             <div>
//                                 <h1>
//                                   <Website/> Website 
//                                 </h1>
//                             </div>
//                             <div>
//                                 <h1>{client_info.company_website || "safarisltd.com"}</h1>
//                             </div>

//                         </div>
//                     </div>
//                 </div>

                

//             </div>
//             <div>
//                 <div>
//                     <h1><DiameterIcon/> Company logo</h1>
//                 </div>

//             </div>

//             at the botomm 
//             <div>
//                 <p>All Rights reserved {client_info.staff_company} Safaris Ltd & SafariSmartApp.com</p>
//                 <span>{client_info.staff_full_name} from {client_info.staff_company} Uses SafariSmartApp.com to generate this itinerary just for you</span>
//             </div>

//                   <div className="print:mt-auto print:break-inside-avoid pt-8 border-t border-[#B98B3E]/20">
//         <PageFooter 
//           pageNumber={2} 
//           tourCode={tour_code} 
//           clientName={clientName} 
//           company={company_name} 
//         />
//       </div>
//         </div>
//     )
    
// }




import React from "react";
import { 
  MapPin, Globe, Phone, Mail, Image as ImageIcon, 
  ShieldCheck, Sparkles, Building2 
} from "lucide-react";
import PageFooter from "../shared/pageFooter";

// Sub-component for clean, repeated contact items
const ContactItem = ({ icon, label, value }) => (
  <div className="flex items-start gap-4 p-4 bg-white rounded-xl border border-[#B98B3E]/10 shadow-sm print:shadow-none print:border-[#E0D8C8] print:break-inside-avoid">
    <div className="p-2.5 bg-[#F8F4EA] rounded-lg shrink-0">
      {React.cloneElement(icon, { className: "w-5 h-5 text-[#B98B3E]" })}
    </div>
    <div>
      <p className="text-[10px] uppercase tracking-widest text-[#6B6153] font-bold mb-1">
        {label}
      </p>
      <p className="text-[#16211A] font-semibold text-sm sm:text-base">
        {value}
      </p>
    </div>
  </div>
);

export default function CompanyAboutPage({ safariData }) {
  const { itinerary } = safariData || {};
  const { client_info } = itinerary || {};

  if (!client_info) return null;

  const companyName = client_info.staff_company || "ACE";
  const clientName = `${client_info.salutation || "Mr/Ms"}. ${client_info.first_name || ""} ${client_info.last_name || ""}`.trim();
  const tourCode = client_info.tour_code || "N/A";
  const staffName = client_info.staff_full_name || "Our Safari Team";

  return (
    <div className="w-full max-w-5xl mx-auto px-6 sm:px-10 py-8 text-[#2B2620] space-y-10 print:py-4 print:space-y-6 print:break-after-page print:h-screen print:flex print:flex-col print:justify-between font-sans bg-white">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="bg-[#2B2620] text-[#F8F4EA] rounded-lg px-5 py-2.5 shadow-sm">
          <h1 className="text-xs font-bold tracking-[0.15em] uppercase">
            About Us & Contact
          </h1>
        </div>

        <div className="flex items-center justify-start sm:justify-end bg-[#F8F4EA] border border-[#B98B3E]/20 rounded-lg px-5 py-2.5">
          <p className="text-xs sm:text-sm text-[#2B2620] font-medium">
            Prepared for <span className="font-bold ddw-serif text-[#16211A]">{clientName}</span>
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="space-y-8 w-full">
        
        {/* Company Introduction */}
        <div className="border-b border-[#B98B3E]/30 pb-6">
          <h2 className="ddw-serif text-3xl sm:text-4xl text-[#16211A] tracking-tight flex items-center gap-3 mb-4">
            <Building2 className="w-8 h-8 text-[#B98B3E]" />
            {companyName}.
          </h2>
          <p className="text-[#3D4A3F] text-base sm:text-lg leading-relaxed max-w-4xl">
            {client_info.company_about || 
              "We are a premier safari operator dedicated to crafting unforgettable, bespoke wildlife experiences in the heart of Tanzania. Our commitment to excellence, conservation, and personalized service ensures that every journey is nothing short of extraordinary."}
          </p>
        </div>

        {/* Contact Information Grid */}
        <div>
          <h3 className="ddw-serif text-xl text-[#16211A] mb-5 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#B98B3E]" />
            Get in Touch
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <ContactItem 
              icon={<MapPin />} 
              label="Headquarters" 
              value={client_info.company_address || "Arusha, Tanzania"} 
            />
            <ContactItem 
              icon={<Globe />} 
              label="Country of Operation" 
              value={client_info.company_country || "Tanzania"} 
            />
            <ContactItem 
              icon={<Phone />} 
              label="WhatsApp" 
              value={client_info.company_whatsup_number || "+255 784 892 320"} 
            />
            <ContactItem 
              icon={<Phone />} 
              label="Phone Number" 
              value={client_info.company_phone_number || "+255 784 900 232"} 
            />
            <ContactItem 
              icon={<Mail />} 
              label="Email Address" 
              value={client_info.company_email || "info@safaris.com"} 
            />
            <ContactItem 
              icon={<Globe />} 
              label="Official Website" 
              value={client_info.company_website || "www.safaris.com"} 
            />
          </div>
        </div>

        {/* Elegant Branding & Credit Section */}
        <div className="mt-8 p-6 sm:p-8 bg-[#F8F4EA]/50 rounded-2xl border border-[#B98B3E]/10 flex flex-col sm:flex-row items-center justify-between gap-6 print:break-inside-avoid">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-[#2B2620] flex items-center justify-center border border-[#B98B3E]/20 shadow-sm print:shadow-none">
              <ImageIcon className="w-8 h-8 text-[#B98B3E]" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-[#6B6153] font-bold mb-1">
                Official Company Logo
              </p>
              <p className="text-[#16211A] font-serif text-xl font-bold">
                {companyName}.
              </p>
            </div>
          </div>

          <div className="text-center sm:text-right">
            <p className="text-[10px] uppercase tracking-widest text-[#6B6153] font-bold mb-1 flex items-center sm:justify-end gap-2">
              <Sparkles className="w-3 h-3 text-[#B98B3E]" />
              Generated Exclusively By
            </p>
            <p className="text-[#16211A] font-bold text-2xl ddw-serif">
              SafariSmartApp.com
            </p>
            <p className="text-xs text-[#6B6153] mt-2 max-w-xs sm:ml-auto">
              This personalized itinerary was crafted just for you by <span className="font-semibold text-[#16211A]">{staffName}</span>.
            </p>
          </div>
        </div>

      </div>


    </div>
  );
}