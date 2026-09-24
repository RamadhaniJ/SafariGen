import React from "react";
import { Star, MapPin, BedDouble } from "lucide-react";

export default function HighlightsSection({ days = [] }) {
  // 1. Group days and accommodations by destination
  const groupedHighlights = days.reduce((acc, day) => {
    const destName = day?.destination_info?.name?.trim();
    if (!destName) return acc;

    const dayNum = day?.day_number;
    const accommodation = day?.accommodation_info?.name?.trim();

    // Check if destination already exists in our grouped array
    const existing = acc.find((item) => item.destination === destName);

    if (existing) {
      if (dayNum) existing.dayNumbers.push(dayNum);
      if (accommodation && !existing.accommodations.includes(accommodation)) {
        existing.accommodations.push(accommodation);
      }
    } else {
      acc.push({
        destination: destName,
        dayNumbers: dayNum ? [dayNum] : [],
        accommodations: accommodation ? [accommodation] : [],
      });
    }

    return acc;
  }, []);

  // Helper to format days array e.g. [1, 2, 5] -> "Day 1, 2 & 5"
  const formatDaysLabel = (dayNumbers) => {
    if (!dayNumbers.length) return "";
    if (dayNumbers.length === 1) return `Day ${dayNumbers[0]}`;
    if (dayNumbers.length === 2) return `Day ${dayNumbers[0]} & ${dayNumbers[1]}`;
    
    const last = dayNumbers[dayNumbers.length - 1];
    const rest = dayNumbers.slice(0, -1).join(", "); 
    return `Day ${rest} & ${last}`;
  };

  if (!groupedHighlights.length) return null;

  return (
    <div className="flex flex-col gap-6 w-full max-w-5xl mx-auto px-6 py-8 text-slate-100 font-sans">
      {/* Section Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-400/10 border border-amber-400/20 text-amber-400">
            <Star className="w-4 h-4 fill-amber-400/20" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            Top Route Highlights
          </h2>
        </div>
      </div>

      {/* Highlights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {groupedHighlights.map((item, idx) => {
          const daysText = formatDaysLabel(item.dayNumbers);
          const accommodationText = item.accommodations.length > 0
            ? item.accommodations.join(" • ")
            : "No Accommodation";

          return (
            <div
              key={idx}
              className="group relative flex flex-col justify-between p-5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 hover:border-white/20 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 shadow-lg"
            >
              {/* Top Row: Days Badge + Destination Icon */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-amber-400/10 border border-amber-400/20 text-amber-300 font-mono text-xs font-semibold tracking-wide">
                  {daysText}
                </span>

                <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-xl bg-white/[0.05] border border-white/10 text-zinc-400 group-hover:bg-amber-400 group-hover:text-zinc-950 group-hover:border-amber-400 transition-colors">
                  <MapPin className="w-4 h-4" />
                </div>
              </div>

              {/* Destination Name */}
              <h3 className="text-base font-bold text-white tracking-tight mb-2 group-hover:text-amber-200 transition-colors">
                {item.destination}
              </h3>

              {/* Accommodation Row */}
              <div className="flex items-center gap-2 pt-2 border-t border-white/5 text-xs text-zinc-400 mt-auto">
                <BedDouble className="w-3.5 h-3.5 text-zinc-500 flex-shrink-0" />
                <span className="truncate" title={accommodationText}>
                  {accommodationText}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}