import { useMemo } from "react";

export default function useItineraryPricing(dayConfigs, clientInfo) {
  return useMemo(() => {
    if (!clientInfo || !dayConfigs || dayConfigs.length === 0) {
      return {
        breakdown: [],
        subtotals: {
          parkFees: 0,
          concessionFees: 0,
          accommodationFees: 0,
          optionalActivities: 0,
          optionalMeals: 0,
          vehicleRental: 0,
        },
        subtotal: 0,
        totalTravellers: 0,
        vehicleDetails: { vehiclesNeeded: 0, totalDays: 0, dailyRate: 0, totalCost: 0 },
      };
    }

    const breakdown = [];
    const subtotals = {
      parkFees: 0,
      concessionFees: 0,
      accommodationFees: 0,
      optionalActivities: 0,
      optionalMeals: 0,
      vehicleRental: 0,
    };

    // 1. Calculate total travellers (excluding INFANTS)
    const travellers = clientInfo.travellers || [];
    const totalTravellers = travellers.reduce((sum, t) => {
      if (t.age_category !== "INFANT") {
        return sum + (t.number || 0);
      }
      return sum;
    }, 0);

    // 2. Calculate TRUE Total Days (Dynamic, accounts for added days)
    // Tunahesabu siku ya mwisho (endDaySpan) kama ilivyo kwenye logic ya ItineraryMainPage
    let currentDayPointer = 1;
    let calculatedTotalDays = 0;
    
    dayConfigs.forEach((config) => {
      calculatedTotalDays = currentDayPointer + config.nights - 1;
      currentDayPointer += config.nights;
    });
    
    const totalDays = calculatedTotalDays > 0 ? calculatedTotalDays : dayConfigs.length;

    // 3. Calculate Vehicles Needed (Max 6 pax per Safari Land Cruiser)
    const vehiclesNeeded = Math.max(1, Math.ceil(totalTravellers / 6));

    // 4. Get Daily Rental Rate (Fallback to 250 if not provided)
    const dailyRate = parseFloat(clientInfo.vehicle_rent_pricing?.vehicle_rent_pricing || 250);

    // 5. Calculate Total Vehicle Cost Dynamically
    const totalVehicleCost = vehiclesNeeded * totalDays * dailyRate;
    subtotals.vehicleRental = totalVehicleCost;




    // 6. Loop through all days for other costs (Parks, Accommodation, Activities, Meals)
    dayConfigs.forEach((day) => {
      const dayBreakdown = {
        dayIndex: day.dayIndex,
        nights: day.nights,
        items: [],
      };

      // A. DESTINATION PARK FEES
      if (day.destination && day.destination.destination_type) {
        const destType = day.destination.destination_type;
        if (destType === "Park" || destType === "Mountain") {
          const parkFeePerDay = day.destination.calculated_park_fee || 0;
          const rescueFeePerDay = day.destination.calculated_rescue_fee || 0;
          const totalDestFeePerDay = parkFeePerDay + rescueFeePerDay;
          
          if (totalDestFeePerDay > 0) {
            const totalForDays = totalDestFeePerDay * day.nights;
            dayBreakdown.items.push({
              type: "destination_fee",
              label: `${day.destination.name} (${destType})`,
              description: `Park/Rescue fees × ${day.nights} night${day.nights > 1 ? 's' : ''}`,
              amount: totalForDays,
            });
            subtotals.parkFees += totalForDays;
          }
        }
      }

      // B. ACCOMMODATION FEES
      if (day.accommodation) {
        const acc = day.accommodation;
        const roomTotal = acc.pricing_details?.roomTotal || 0;
        const concessionTotal = acc.pricing_details?.concessionTotal || 0;
        const nightsMultiplier = day.nights;

        if (roomTotal > 0) {
          const totalRoomCost = roomTotal * nightsMultiplier;
          dayBreakdown.items.push({
            type: "accommodation",
            label: acc.accommodation_name,
            description: `Room rates × ${nightsMultiplier} night${nightsMultiplier > 1 ? 's' : ''}`,
            amount: totalRoomCost,
          });
          subtotals.accommodationFees += totalRoomCost;
        }

        if (concessionTotal > 0) {
          const totalConcession = concessionTotal * nightsMultiplier;
          dayBreakdown.items.push({
            type: "concession",
            label: `${acc.accommodation_name} (Inside Park)`,
            description: `Concession fees × ${nightsMultiplier} night${nightsMultiplier > 1 ? 's' : ''}`,
            amount: totalConcession,
          });
          subtotals.concessionFees += totalConcession;
        }
      }

      // C. OPTIONAL ACTIVITIES & TRANSIT
      if (day.activities && day.activities.length > 0) {
        day.activities.forEach((activity) => {
          if (activity.is_optional && activity.price > 0) {
            let activityTotal = 0;
            if (activity.price_per === "PerPersonal") {
              activityTotal = activity.price * totalTravellers;
            } else if (activity.price_per === "PerGroup") {
              activityTotal = activity.price;
            } else if (activity.price_per === "PerVehicle") {
              activityTotal = activity.price * vehiclesNeeded;
            }

            if (activityTotal > 0) {
              dayBreakdown.items.push({
                type: "activity",
                label: activity.activity_type_title,
                description: `${activity.price_per} × ${activity.price_per === "PerPersonal" ? totalTravellers : (activity.price_per === "PerVehicle" ? vehiclesNeeded : 1)} pax/veh`,
                amount: activityTotal,
              });
              subtotals.optionalActivities += activityTotal;
            }
          }

          if (activity.transit_fee_included && activity.transit_fee > 0) {
            const transitTotal = activity.transit_fee * totalTravellers;
            dayBreakdown.items.push({
              type: "transit",
              label: `Transit Fee: ${activity.activity_type_title}`,
              description: `Transit fee × ${totalTravellers} travellers`,
              amount: transitTotal,
            });
            subtotals.optionalActivities += transitTotal;
          }
        });
      }

      // D. OPTIONAL MEALS
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

    // Calculate subtotal
    const subtotal = Object.values(subtotals).reduce((sum, val) => sum + val, 0);

    return {
      breakdown,
      subtotals,
      subtotal,
      totalTravellers,
      vehicleDetails: {
        vehiclesNeeded,
        totalDays,
        dailyRate,
        totalCost: totalVehicleCost,
      },
    };
  }, [dayConfigs, clientInfo]);
}

