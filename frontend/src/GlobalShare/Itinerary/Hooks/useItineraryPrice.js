// import { useMemo } from "react";

// export default function useItineraryPricingGlobal(dayConfigs, clientInfo) {
//   return useMemo(() => {
//     if (!clientInfo || !dayConfigs || dayConfigs.length === 0) {
//       return {
//         breakdown: [],
//         subtotals: {
//           parkFees: 0,
//           concessionFees: 0, 
//           accommodationFees: 0,
//           optionalActivities: 0,
//           optionalMeals: 0,
//           vehicleRental: 0,
//         },
//         subtotal: 0,
//         totalTravellers: 0,
//         vehicleDetails: { vehiclesNeeded: 0, totalDays: 0, dailyRate: 0, totalCost: 0 },
//       };
//     }

//     const breakdown = [];
//     const subtotals = {
//       parkFees: 0,
//       concessionFees: 0,
//       accommodationFees: 0,
//       optionalActivities: 0,
//       optionalMeals: 0,
//       vehicleRental: 0,
//     };

//     // 1. Calculate total travellers (excluding INFANTS)
//     const travellers = clientInfo.travellers || [];
//     const totalTravellers = travellers.reduce((sum, t) => {
//       if (t.age_category !== "INFANT") {
//         return sum + (t.number || 0);
//       }
//       return sum;
//     }, 0);

//     // 2. Calculate TRUE Total Days
//     let currentDayPointer = 1;
//     let calculatedTotalDays = 0;
//     dayConfigs.forEach((config) => {
//       calculatedTotalDays = currentDayPointer + config.nights - 1;
//       currentDayPointer += config.nights;
//     });
//     const totalDays = calculatedTotalDays > 0 ? calculatedTotalDays : dayConfigs.length;

//     // 3. Vehicles Needed
//     const vehiclesNeeded = Math.max(1, Math.ceil(totalTravellers / 6));

//     // 4. Daily Rate (default 250)
//     const dailyRate = parseFloat(clientInfo.vehicle_rent_pricing?.vehicle_rent_pricing || 250);
//     const totalVehicleCost = vehiclesNeeded * totalDays * dailyRate;
//     subtotals.vehicleRental = totalVehicleCost;

//     // 5. Loop through days
//     dayConfigs.forEach((day) => {
//       const dayBreakdown = {
//         dayIndex: day.dayIndex,
//         nights: day.nights,
//         items: [],
//       };

//       // ========== A. DESTINATION PARK FEES ==========
//       if (day.destination && day.destination.destination_type) {
//         const destType = day.destination.destination_type;
//         if (destType === "Park" || destType === "Mountain") {
//           const parkFeePerDay = day.destination.calculated_park_fee || 0;
//           const rescueFeePerDay = day.destination.calculated_rescue_fee || 0;
//           const totalDestFeePerDay = parkFeePerDay + rescueFeePerDay;
          
//           if (totalDestFeePerDay > 0) {
//             const totalForDays = totalDestFeePerDay * day.nights;
//             dayBreakdown.items.push({
//               type: "destination_fee",
//               label: `${day.destination.name} (${destType})`,
//               description: `Park/Rescue fees × ${day.nights} night${day.nights > 1 ? 's' : ''}`,
//               amount: totalForDays,
//             });
//             subtotals.parkFees += totalForDays;
//           }
//         }
//       }

//       // ========== B. ACCOMMODATION FEES (FIXED!) ==========
//       if (day.accommodation) {
//         const acc = day.accommodation;
//         const nightsMultiplier = day.nights;

//         // ✅ FIX: Kama pricing_details ipo, itumie. Vinginevyo, hesabu kutoka kwenye selectedRooms moja kwa moja
//         let roomTotal = 0;
//         let concessionTotal = 0;

//         if (acc.pricing_details && acc.pricing_details.roomTotal) {
//           // Kutoka kwenye AccommodationComponent (wakati wa edit)
//           roomTotal = parseFloat(acc.pricing_details.roomTotal || 0);
//           concessionTotal = parseFloat(acc.pricing_details.concessionTotal || 0);
//         } else if (acc.available_room_rates && day.selectedRooms) {
//           // ✅ FALLBACK: Hesabu kutoka kwenye selectedRooms + available_room_rates
//           day.selectedRooms.forEach((r) => {
//             const matched = acc.available_room_rates.find(
//               (rate) => String(rate.room_type_id) === String(r.room_type_id || r.room_type)
//             );
//             if (matched) {
//               roomTotal += parseFloat(matched.price_per_night || 0) * parseInt(r.quantity || r.number || 0);
//             }
//           });
//           // Concession
//           if (acc.calculated_concesion_fee?.is_inside_park) {
//             concessionTotal = (parseFloat(acc.calculated_concesion_fee.total_adult_concession || 0)) + 
//                               (parseFloat(acc.calculated_concesion_fee.total_child_concession || 0));
//           }
//         }

//         if (roomTotal > 0) {
//           const totalRoomCost = roomTotal * nightsMultiplier;
//           dayBreakdown.items.push({
//             type: "accommodation",
//             label: acc.accommodation_name || acc.name,
//             description: `Room rates × ${nightsMultiplier} night${nightsMultiplier > 1 ? 's' : ''}`,
//             amount: totalRoomCost,
//           });
//           subtotals.accommodationFees += totalRoomCost;
//         }

//         if (concessionTotal > 0) {
//           const totalConcession = concessionTotal * nightsMultiplier;
//           dayBreakdown.items.push({
//             type: "concession",
//             label: `${acc.accommodation_name || acc.name} (Inside Park)`,
//             description: `Concession fees × ${nightsMultiplier} night${nightsMultiplier > 1 ? 's' : ''}`,
//             amount: totalConcession,
//           });
//           subtotals.concessionFees += totalConcession;
//         }
//       }

//       // ========== C. OPTIONAL ACTIVITIES & TRANSIT (FIXED!) ==========
//       if (day.activities && day.activities.length > 0) {
//         day.activities.forEach((activity) => {
//           // ✅ FIX: Tumia optional_activity_price badala ya price
//           const actPrice = parseFloat(activity.optional_activity_price || activity.price || 0);
          
//           if (activity.is_optional && actPrice > 0) {
//             let activityTotal = 0;
//             const pricePer = activity.price_per;
            
//             if (pricePer === "PerPersonal") {
//               activityTotal = actPrice * totalTravellers;
//             } else if (pricePer === "PerGroup") {
//               activityTotal = actPrice;
//             } else if (pricePer === "PerVehicle") {
//               activityTotal = actPrice * vehiclesNeeded;
//             } else {
//               activityTotal = actPrice; // Default
//             }

//             if (activityTotal > 0) {
//               dayBreakdown.items.push({
//                 type: "activity",
//                 label: activity.activity_type_title || activity.activity_type_name,
//                 description: `${pricePer || 'Per Group'} × ${pricePer === "PerPersonal" ? totalTravellers : (pricePer === "PerVehicle" ? vehiclesNeeded : 1)}`,
//                 amount: activityTotal,
//               });
//               subtotals.optionalActivities += activityTotal;
//             }
//           }

//           // ✅ FIX: Transit fee ihusishe transit_fee_per
//           if (activity.transit_fee_included && activity.transit_fee > 0) {
//             let transitTotal = 0;
//             const transitFee = parseFloat(activity.transit_fee);
//             const transitPer = activity.transit_fee_per;

//             if (transitPer === "Pax") {
//               transitTotal = transitFee * totalTravellers;
//             } else if (transitPer === "Group") {
//               transitTotal = transitFee;
//             } else if (transitPer === "Vehicle") {
//               transitTotal = transitFee * vehiclesNeeded;
//             } else {
//               transitTotal = transitFee * totalTravellers; // Default
//             }

//             if (transitTotal > 0) {
//               dayBreakdown.items.push({
//                 type: "transit",
//                 label: `Transit: ${activity.activity_type_title || activity.activity_type_name}`,
//                 description: `${transitPer || 'Pax'} × ${transitPer === "Pax" ? totalTravellers : (transitPer === "Vehicle" ? vehiclesNeeded : 1)}`,
//                 amount: transitTotal,
//               });
//               subtotals.optionalActivities += transitTotal;
//             }
//           }
//         });
//       }

//       // ========== D. OPTIONAL MEALS ==========
//       if (day.optionalMeals && day.optionalMeals.length > 0) {
//         day.optionalMeals.forEach((meal) => {
//           if (meal.is_optional && parseFloat(meal.price) > 0) {
//             const mealTotal = parseFloat(meal.price) * totalTravellers;
//             dayBreakdown.items.push({
//               type: "meal",
//               label: meal.meal_name,
//               description: `Optional meal × ${totalTravellers} travellers`,
//               amount: mealTotal,
//             });
//             subtotals.optionalMeals += mealTotal;
//           }
//         });
//       }

//       if (dayBreakdown.items.length > 0) {
//         breakdown.push(dayBreakdown);
//       }
//     });

//     // Calculate subtotal
//     const subtotal = Object.values(subtotals).reduce((sum, val) => sum + val, 0);

//     return {
//       breakdown,
//       subtotals,
//       subtotal,
//       totalTravellers,
//       vehicleDetails: {
//         vehiclesNeeded,
//         totalDays,
//         dailyRate,
//         totalCost: totalVehicleCost,
//       },
//     };
//   }, [dayConfigs, clientInfo]);
// }





import { useMemo } from "react";

export default function useItineraryPricingGlobal(dayConfigs, clientInfo) {
  return useMemo(() => {
    if (!clientInfo || !dayConfigs || dayConfigs.length === 0) {
      return {
        breakdown: [],
        subtotals: {
          parkFees: 0, concessionFees: 0, accommodationFees: 0,
          optionalActivities: 0, optionalMeals: 0, vehicleRental: 0,
        },
        subtotal: 0,
        totalTravellers: 0,
        vehicleDetails: { vehiclesNeeded: 0, totalDays: 0, dailyRate: 0, totalCost: 0 },
      };
    }

    const breakdown = [];
    const subtotals = {
      parkFees: 0, concessionFees: 0, accommodationFees: 0,
      optionalActivities: 0, optionalMeals: 0, vehicleRental: 0,
    };

    // Travellers
    const travellers = clientInfo.travellers || [];
    const totalTravellers = travellers.reduce((sum, t) => {
      if (t.age_category !== "INFANT") return sum + (t.number || 0);
      return sum;
    }, 0);

    // Total days
    let currentDayPointer = 1;
    let calculatedTotalDays = 0;
    dayConfigs.forEach((config) => {
      calculatedTotalDays = currentDayPointer + config.nights - 1;
      currentDayPointer += config.nights;
    });
    const totalDays = calculatedTotalDays > 0 ? calculatedTotalDays : dayConfigs.length;

    // Vehicles
    const vehiclesNeeded = Math.max(1, Math.ceil(totalTravellers / 6));
    const dailyRate = parseFloat(clientInfo.vehicle_rent_pricing?.vehicle_rent_pricing || 250);
    const totalVehicleCost = vehiclesNeeded * totalDays * dailyRate;
    subtotals.vehicleRental = totalVehicleCost;

    // Loop — COMPUTE dayIndex internally
    let dayPointer = 1;
    dayConfigs.forEach((day) => {
      const dayIndex = dayPointer;
      const endDaySpan = dayPointer + day.nights - 1;
      dayPointer += day.nights;

      const dayBreakdown = {
        dayIndex,                  // ✅ computed, sio day.dayIndex
        endDaySpan,
        nights: day.nights,
        items: [],
      };

      // ========== A. DESTINATION PARK FEES ==========
      if (day.destination && day.destination.destination_type) {
        const destType = day.destination.destination_type;
        if (destType === "Park" || destType === "Mountain") {
          const parkFeePerDay = Number(day.destination.calculated_park_fee) || 0;
          const rescueFeePerDay = Number(day.destination.calculated_rescue_fee) || 0;
          const totalDestFeePerDay = parkFeePerDay + rescueFeePerDay;

          if (totalDestFeePerDay > 0) {
            const totalForDays = totalDestFeePerDay * day.nights;
            dayBreakdown.items.push({
              type: "destination_fee",
              label: `${day.destination.name} (${destType})`,
              description: `Park/Rescue fees × ${day.nights} night${day.nights > 1 ? "s" : ""}`,
              amount: totalForDays,
            });
            subtotals.parkFees += totalForDays;
          }
        }
      }

      // ========== B. ACCOMMODATION FEES ==========
      if (day.accommodation) {
        const acc = day.accommodation;
        const nightsMultiplier = day.nights;

        let roomTotal = 0;
        let concessionTotal = 0;

        if (acc.pricing_details && acc.pricing_details.roomTotal) {
          roomTotal = parseFloat(acc.pricing_details.roomTotal || 0);
          concessionTotal = parseFloat(acc.pricing_details.concessionTotal || 0);
        } else if (acc.available_room_rates && day.selectedRooms) {
          day.selectedRooms.forEach((r) => {
            const matched = acc.available_room_rates.find(
              (rate) => String(rate.room_type_id) === String(r.room_type_id || r.room_type)
            );
            if (matched) {
              roomTotal += parseFloat(matched.price_per_night || 0) * parseInt(r.quantity || r.number || 0);
            }
          });
          if (acc.calculated_concesion_fee?.is_inside_park) {
            concessionTotal =
              parseFloat(acc.calculated_concesion_fee.total_adult_concession || 0) +
              parseFloat(acc.calculated_concesion_fee.total_child_concession || 0);
          }
        }

        if (roomTotal > 0) {
          const totalRoomCost = roomTotal * nightsMultiplier;
          dayBreakdown.items.push({
            type: "accommodation",
            label: acc.accommodation_name || acc.name,
            description: `Room rates × ${nightsMultiplier} night${nightsMultiplier > 1 ? "s" : ""}`,
            amount: totalRoomCost,
          });
          subtotals.accommodationFees += totalRoomCost;
        }

        if (concessionTotal > 0) {
          const totalConcession = concessionTotal * nightsMultiplier;
          dayBreakdown.items.push({
            type: "concession",
            label: `${acc.accommodation_name || acc.name} (Inside Park)`,
            description: `Concession fees × ${nightsMultiplier} night${nightsMultiplier > 1 ? "s" : ""}`,
            amount: totalConcession,
          });
          subtotals.concessionFees += totalConcession;
        }
      }

      // ========== C. ACTIVITIES ==========
      if (day.activities && day.activities.length > 0) {
        day.activities.forEach((activity) => {
          const actPrice = parseFloat(activity.optional_activity_price || activity.price || 0);

          if (activity.is_optional && actPrice > 0) {
            let activityTotal = 0;
            const pricePer = activity.price_per;
            if (pricePer === "PerPersonal") activityTotal = actPrice * totalTravellers;
            else if (pricePer === "PerGroup") activityTotal = actPrice;
            else if (pricePer === "PerVehicle") activityTotal = actPrice * vehiclesNeeded;
            else activityTotal = actPrice;

            if (activityTotal > 0) {
              dayBreakdown.items.push({
                type: "activity",
                label: activity.activity_type_title || activity.activity_type_name,
                description: `${pricePer || "Per Group"} × ${
                  pricePer === "PerPersonal" ? totalTravellers :
                  pricePer === "PerVehicle" ? vehiclesNeeded : 1
                }`,
                amount: activityTotal,
              });
              subtotals.optionalActivities += activityTotal;
            }
          }

          if (activity.transit_fee_included && Number(activity.transit_fee) > 0) {
            const transitFee = parseFloat(activity.transit_fee);
            const transitPer = activity.transit_fee_per;
            let transitTotal = 0;
            if (transitPer === "Pax") transitTotal = transitFee * totalTravellers;
            else if (transitPer === "Group") transitTotal = transitFee;
            else if (transitPer === "Vehicle") transitTotal = transitFee * vehiclesNeeded;
            else transitTotal = transitFee * totalTravellers;

            if (transitTotal > 0) {
              dayBreakdown.items.push({
                type: "transit",
                label: `Transit: ${activity.activity_type_title || activity.activity_type_name}`,
                description: `${transitPer || "Pax"} × ${
                  transitPer === "Pax" ? totalTravellers :
                  transitPer === "Vehicle" ? vehiclesNeeded : 1
                }`,
                amount: transitTotal,
              });
              subtotals.optionalActivities += transitTotal;
            }
          }
        });
      }

      // ========== D. OPTIONAL MEALS ==========
      if (day.optionalMeals && day.optionalMeals.length > 0) {
        day.optionalMeals.forEach((meal) => {
          if (meal.is_optional && parseFloat(meal.price) > 0) {
            const mealTotal = parseFloat(meal.price) * totalTravellers;
            dayBreakdown.items.push({
              type: "meal",
              label: meal.meal_name,
              description: `Optional meal × ${totalTravellers} travellers`,
              amount: mealTotal,
            });
            subtotals.optionalMeals += mealTotal;
          }
        });
      }

      if (dayBreakdown.items.length > 0) {
        breakdown.push(dayBreakdown);
      }
    });

    const subtotal = Object.values(subtotals).reduce((sum, val) => sum + val, 0);

    return {
      breakdown,
      subtotals,
      subtotal,
      totalTravellers,
      vehicleDetails: { vehiclesNeeded, totalDays, dailyRate, totalCost: totalVehicleCost },
    };
  }, [dayConfigs, clientInfo]);
}
