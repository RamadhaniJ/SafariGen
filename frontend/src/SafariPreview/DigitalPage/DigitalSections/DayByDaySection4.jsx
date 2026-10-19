import React, { useState, useEffect } from "react";
import StickyNavigationSubSection from "../SubSections/Navigations";
import { dayAnchorId } from "../SubSections/Navigations";
import {
  Sunrise,
  Sun,
  Moon,
  Clock,
  Compass,
  Hotel,
  Bed,
  Utensils,
  UtensilsCrossed,
  ChefHat,
  Sparkles,
  Maximize2,
  ChevronLeft,
  ChevronRight,
  X,
  MapPin,
} from "lucide-react";

const DAY_WORDS = [
  "Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight",
  "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen",
  "Sixteen", "Seventeen", "Eighteen", "Nineteen", "Twenty", "Twenty-one",
  "Twenty-two", "Twenty-three", "Twenty-four", "Twenty-five", "Twenty-six",
  "Twenty-seven", "Twenty-eight", "Twenty-nine", "Thirty", "Thirty-one",
];

const dayWord = (n) => DAY_WORDS[n] || String(n);

const CONTEXT_LABEL = {
  START: "Arrival",
  END: "Departure",
  CENTER: null,
};

export default function DayByDayDigitalSection({ safariData }) {
  const [modalState, setModalState] = useState({
    isOpen: false,
    images: [],
    currentIndex: 0,
  });

  // Keyboard + scroll-lock for the lightbox
  useEffect(() => {
    if (!modalState.isOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") closeGallery();
      if (e.key === "ArrowRight") nextImage();
      if (e.key === "ArrowLeft") prevImage();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalState.isOpen]);

  if (!safariData?.itinerary?.days) {
    return (
      <div className="p-8 text-center text-[#6B6153]">
        No itinerary data available.
      </div>
    );
  }

  const { days } = safariData.itinerary;

  const getMomentIcon = (moment) => {
    const m = moment?.toUpperCase() || "";
    if (m.includes("MORNING"))
      return <Sunrise className="w-4 h-4 text-[#B98B3E]" strokeWidth={1.75} />;
    if (m.includes("AFTERNOON"))
      return <Sun className="w-4 h-4 text-[#B98B3E]" strokeWidth={1.75} />;
    if (m.includes("EVENING"))
      return <Moon className="w-4 h-4 text-[#B98B3E]" strokeWidth={1.75} />;
    return <Clock className="w-4 h-4 text-[#B98B3E]" strokeWidth={1.75} />;
  };

  const openGallery = (images, startIndex = 0) => {
    if (!images || images.length === 0) return;
    setModalState({ isOpen: true, images, currentIndex: startIndex });
  };
  const closeGallery = () =>
    setModalState({ isOpen: false, images: [], currentIndex: 0 });
  const nextImage = () =>
    setModalState((prev) => ({
      ...prev,
      currentIndex: (prev.currentIndex + 1) % prev.images.length,
    }));
  const prevImage = () =>
    setModalState((prev) => ({
      ...prev,
      currentIndex:
        (prev.currentIndex - 1 + prev.images.length) % prev.images.length,
    }));

  return (
    <div className="bg-[#F1EAD9]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,400;0,500;0,600;1,500&family=Inter:wght@400;500;600;700&display=swap');
        .ddw-serif { font-family: 'Fraunces', serif; }
        .ddw-sans { font-family: 'Inter', sans-serif; }
      `}</style>

      <StickyNavigationSubSection safariData={safariData} />

      <div className="max-w-6xl mx-auto ddw-sans">
        {days.map((day, dayIdx) => {
          const destImages = day.destination_images || [];
          const accomImages = day.accommodation_images || [];
          const isMultiNight = day.nights_number > 1;
          const contextLabel = CONTEXT_LABEL[day.context_type];

          return (
            <article
              key={day.id || day.day_number}
              id={dayAnchorId(day)}
              className={`px-6 sm:px-10 lg:px-14 py-16 sm:py-20 ${
                dayIdx !== 0 ? "border-t border-[#B98B3E]/25" : "pt-10"
              }`}
            >
              {/* ─── Entry meta row ─── */}
              <div className="flex items-start justify-between gap-4 mb-8 flex-wrap">
                <div>
                  {contextLabel && (
                    <p className="text-[11px] uppercase tracking-[0.25em] text-[#B98B3E] font-semibold mb-2">
                      {contextLabel}
                    </p>
                  )}
                  <h2 className="ddw-serif text-3xl sm:text-4xl text-[#24352A] leading-tight">
                    {isMultiNight
                      ? `Days ${dayWord(day.day_number)}–${dayWord(
                          day.day_number + day.nights_number - 1
                        )}`
                      : `Day ${dayWord(day.day_number)}`}
                  </h2>
                </div>
                {day.date_display && (
                  <span className="text-xs text-[#6B6153] bg-white/70 backdrop-blur-sm border border-[#B98B3E]/25 rounded-full px-3.5 py-1.5 shrink-0">
                    {day.date_display}
                  </span>
                )}
              </div>

              {/* ─── Hero image ─── */}
              <div className="relative w-full h-[340px] sm:h-[460px] rounded-xl overflow-hidden mb-10 bg-[#24352A] shadow-sm">
                {day.destination_info?.featured_image && (
                  <img
                    src={day.destination_info.featured_image}
                    alt={day.destination_info?.name || `Day ${day.day_number}`}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#16211A]/95 via-[#16211A]/25 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-9">
                  <h3 className="ddw-serif text-3xl sm:text-5xl text-[#FBF8F1] leading-tight">
                    {day.destination_info?.name || "Destination"}
                  </h3>
                  {day.destination_info?.location && (
                    <p className="flex items-center gap-1.5 mt-2 text-sm text-[#FBF8F1]/80">
                      <MapPin className="w-4 h-4 text-[#B98B3E]" strokeWidth={1.75} />
                      {day.destination_info.location}
                    </p>
                  )}
                </div>
              </div>

              {/* ─── Overview + gallery ─── */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 mb-14">
                <div className="lg:col-span-7">
                  <h3 className="ddw-serif text-xl text-[#16211A] mb-3">
                    Overview
                  </h3>
                  <p className="text-[#3D4A3F] text-[15px] leading-[1.75] max-w-[62ch] whitespace-pre-line">
                    {day.destination_description}
                  </p>
                </div>

                {destImages.length > 0 && (
                  <div className="lg:col-span-5 grid grid-cols-2 gap-2.5">
                    <GalleryTile
                      src={destImages[0]}
                      onClick={() => openGallery(destImages, 0)}
                      className="col-span-2 sm:col-span-1 h-36"
                    />
                    {destImages.length > 1 && (
                      <GalleryTile
                        src={destImages[1]}
                        onClick={() => openGallery(destImages, 1)}
                        className="h-36"
                        overlayCount={
                          destImages.length > 2 ? destImages.length - 1 : null
                        }
                      />
                    )}
                  </div>
                )}
              </div>

              {/* ─── Activities timeline ─── */}
              {day.activities && day.activities.length > 0 && (
                <div className="mb-14">
                  <h3 className="flex items-center gap-2 ddw-serif text-xl text-[#16211A] mb-6">
                    <Compass className="w-5 h-5 text-[#B98B3E]" strokeWidth={1.75} />
                    Today's Activities
                  </h3>

                  <div className="relative pl-8">
                    <div className="absolute left-[7px] top-2 bottom-2 w-px bg-[#B98B3E]/30" />
                    <div className="space-y-7">
                      {day.activities.map((act, idx) => (
                        <div key={idx} className="relative">
                          <span className="absolute -left-8 top-1 w-3.5 h-3.5 rounded-full bg-[#F1EAD9] border-2 border-[#B98B3E]" />
                          <div className="flex items-start gap-3">
                            {getMomentIcon(act.moment)}
                            <div className="flex-1">
                              <div className="flex items-baseline justify-between gap-3 flex-wrap">
                                <p className="text-[#16211A] font-medium">
                                  {act.activity_type_name}
                                </p>
                                {act.is_optional && (
                                  <span className="inline-flex items-center gap-1 text-xs text-[#9C5B3C] bg-[#9C5B3C]/10 border border-[#9C5B3C]/20 px-2.5 py-1 rounded-full">
                                    <Sparkles className="w-3 h-3" strokeWidth={2} />
                                    Optional · ${act.optional_activity_price}
                                    {act.price_per && ` / ${act.price_per}`}
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-[#6B6153] mt-0.5">
                                {act.main_location_name}
                                {act.start_location_name &&
                                  `From ${act.start_location_name}`}
                                {act.via_location_name &&
                                  ` via ${act.via_location_name}`}
                                {act.end_location_name &&
                                  ` to ${act.end_location_name}`}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ─── Optional Meals (redesigned as premium cards) ─── */}
              {day.optional_meals && day.optional_meals.length > 0 && (
                <div className="mb-14">
                  <div className="flex items-center justify-between gap-3 mb-5 flex-wrap">
                    <h3 className="flex items-center gap-2 ddw-serif text-xl text-[#16211A]">
                      <ChefHat className="w-5 h-5 text-[#B98B3E]" strokeWidth={1.75} />
                      Optional Dining
                    </h3>
                    <span className="text-[10px] uppercase tracking-[0.2em] text-[#B98B3E] font-semibold">
                      Elevate your stay
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {day.optional_meals.map((meal, idx) => (
                      <div
                        key={idx}
                        className="group relative overflow-hidden bg-gradient-to-br from-white to-[#FBF8F1] border border-[#B98B3E]/20 hover:border-[#B98B3E]/60 rounded-xl p-5 transition-all duration-300 hover:shadow-[0_10px_40px_-15px_rgba(185,139,62,0.4)] hover:-translate-y-0.5"
                      >
                        <div className="absolute -top-10 -right-10 w-24 h-24 bg-[#B98B3E]/5 rounded-full group-hover:bg-[#B98B3E]/10 transition-colors" />
                        <div className="relative flex items-start justify-between gap-4">
                          <div className="flex items-start gap-3 flex-1">
                            <div className="shrink-0 w-10 h-10 rounded-lg bg-[#B98B3E]/10 flex items-center justify-center group-hover:bg-[#B98B3E]/20 transition-colors">
                              <UtensilsCrossed
                                className="w-4 h-4 text-[#B98B3E]"
                                strokeWidth={2}
                              />
                            </div>
                            <div>
                              <p className="text-[#16211A] font-semibold leading-snug">
                                {meal.meal_name}
                              </p>
                              <p className="text-xs text-[#6B6153] mt-1">
                                Optional experience
                              </p>
                            </div>
                          </div>
                          {meal.price && (
                            <div className="shrink-0 text-right">
                              <p className="ddw-serif text-xl text-[#9C5B3C] leading-none">
                                ${Number(meal.price).toFixed(0)}
                              </p>
                              <p className="text-[9px] uppercase tracking-widest text-[#6B6153] mt-1">
                                per person
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ─── Accommodation ─── */}
              {day.accommodation_info && (
                <div className="border-l-2 border-[#B98B3E] pl-6 sm:pl-8">
                  <div className="flex items-center gap-3 mb-4">
                    <Hotel className="w-5 h-5 text-[#B98B3E]" strokeWidth={1.75} />
                    <div>
                      <p className="text-xs text-[#6B6153]">
                        Where you'll stay
                      </p>
                      <h3 className="ddw-serif text-xl text-[#16211A]">
                        {day.accommodation_info.name}
                      </h3>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-7">
                      <p className="text-[#3D4A3F] text-[15px] leading-[1.75] max-w-[62ch] mb-5">
                        {day.accommodation_description}
                      </p>

                      <div className="flex flex-wrap gap-2.5">
                        {day.included_meals && (
                          <span className="flex items-center gap-1.5 text-sm text-[#16211A] bg-[#16211A]/[0.04] px-3 py-1.5 rounded-full">
                            <Utensils
                              className="w-3.5 h-3.5 text-[#B98B3E]"
                              strokeWidth={1.75}
                            />
                            {day.included_meals}
                          </span>
                        )}
                        {day.selected_rooms?.map((room, idx) => (
                          <span
                            key={idx}
                            className="flex items-center gap-1.5 text-sm text-[#16211A] bg-[#16211A]/[0.04] px-3 py-1.5 rounded-full"
                          >
                            <Bed
                              className="w-3.5 h-3.5 text-[#B98B3E]"
                              strokeWidth={1.75}
                            />
                            {room.quantity}× {room.room_type_name}
                          </span>
                        ))}
                      </div>
                    </div>

                    {accomImages.length > 0 && (
                      <div className="lg:col-span-5 grid grid-cols-2 gap-2.5">
                        <GalleryTile
                          src={accomImages[0]}
                          onClick={() => openGallery(accomImages, 0)}
                          className="col-span-2 h-40"
                        />
                        {accomImages.slice(1, 3).map((img, idx) => (
                          <GalleryTile
                            key={idx}
                            src={img}
                            onClick={() => openGallery(accomImages, idx + 1)}
                            className="h-28"
                            overlayCount={
                              idx === 1 && accomImages.length > 3
                                ? accomImages.length - 2
                                : null
                            }
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </article>
          );
        })}
      </div>

      {/* ─── Lightbox ─── */}
      {modalState.isOpen && (
        <div
          className="fixed inset-0 z-50 bg-[#16211A]/95 backdrop-blur-sm flex items-center justify-center p-4 sm:p-8"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeGallery();
          }}
        >
          <button
            onClick={closeGallery}
            aria-label="Close"
            className="absolute top-5 right-5 p-3 rounded-full bg-white/10 text-white/80 hover:bg-white/20 hover:text-white transition-all duration-200 border border-white/10 backdrop-blur-sm z-50"
          >
            <X className="w-5 h-5" strokeWidth={1.75} />
          </button>

          {modalState.images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                aria-label="Previous image"
                className="absolute left-4 sm:left-6 p-3 rounded-full bg-white/10 text-white/80 hover:bg-white/20 hover:text-white transition-all duration-200 border border-white/10 backdrop-blur-sm z-50"
              >
                <ChevronLeft className="w-6 h-6" strokeWidth={1.75} />
              </button>
              <button
                onClick={nextImage}
                aria-label="Next image"
                className="absolute right-4 sm:right-6 p-3 rounded-full bg-white/10 text-white/80 hover:bg-white/20 hover:text-white transition-all duration-200 border border-white/10 backdrop-blur-sm z-50"
              >
                <ChevronRight className="w-6 h-6" strokeWidth={1.75} />
              </button>
            </>
          )}

          <div
            className="max-w-4xl w-full flex flex-col items-center gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={modalState.images[modalState.currentIndex]}
              alt="Expanded view"
              className="max-w-full max-h-[75vh] object-contain rounded-xl shadow-2xl"
            />
            <span className="text-sm text-white/70 bg-black/30 px-4 py-1.5 rounded-full border border-white/10">
              {modalState.currentIndex + 1} / {modalState.images.length}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

function GalleryTile({ src, onClick, className = "", overlayCount }) {
  return (
    <div
      onClick={onClick}
      className={`relative group cursor-pointer overflow-hidden rounded-lg bg-[#24352A]/10 ${className}`}
    >
      <img
        src={src}
        alt=""
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
      />
      <div className="absolute inset-0 bg-[#16211A]/0 group-hover:bg-[#16211A]/25 transition-colors flex items-center justify-center">
        <Maximize2
          className="w-5 h-5 text-[#FBF8F1] opacity-0 group-hover:opacity-100 transition-opacity"
          strokeWidth={1.75}
        />
      </div>
      {overlayCount && (
        <div className="absolute inset-0 bg-[#16211A]/65 flex flex-col items-center justify-center text-[#FBF8F1]">
          <span className="text-lg font-medium">+{overlayCount}</span>
          <span className="text-xs">more</span>
        </div>
      )}
    </div>
  );
}



