import React from "react";
import { Star, MapPin, Compass } from "lucide-react";
import HighlightsSubSection from "../SubSections/Highlights";

export default function DigitalMapSection({ safariData }) {
  const itinerary = safariData?.itinerary;
  const days = itinerary?.days || [];
  const mapImageUrl = itinerary?.map_image_url?.map_image;



  return (
    <section className="w-full max-w-5xl mx-auto px-6 py-12 text-slate-100 font-sans">
      <div className="flex flex-col gap-10">
        
        {/* Safari Route Interactive Map Card */}
        {mapImageUrl && (
          <div className="relative group rounded-lg overflow-hidden border border-white/10 bg-zinc-900/60 backdrop-blur-xl shadow-2xl transition-all duration-500 hover:border-white/20">

            {/* Image Container with Subtle Zoom on Hover */}
            <div className="relative w-full overflow-hidden bg-zinc-950">
              <img
                src={mapImageUrl}
                alt="Safari Route Map"
                className="w-full h-auto object-cover transform transition-transform duration-700 ease-out group-hover:scale-[1.02]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/60 via-transparent to-transparent pointer-events-none" />
            </div>
          </div>
        )}

        {/* Highlights Section */}
        <HighlightsSubSection
        days={days}
        />
     
     </div>

    </section>
  );
}