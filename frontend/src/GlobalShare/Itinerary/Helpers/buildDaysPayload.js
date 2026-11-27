// Turns the builder screen's day rows into the "days" list the backend expects.
// Used for the live price preview (and matches what Save sends), so the price
// on screen is calculated from exactly the same data that gets saved.

const idOf = (value, ...keys) => {
  if (value === null || value === undefined || value === "") return null;
  if (typeof value !== "object") return value;
  for (const k of keys.length ? keys : ["id"]) {
    if (value[k] !== undefined && value[k] !== null) return value[k];
  }
  return null;
};

export default function buildDaysPayload(dayConfigs = []) {
  let dayPointer = 1;
  return dayConfigs.map((d) => {
    const nights = Number(d.nights) || 1;
    const dayNumber = dayPointer;
    dayPointer += nights;

    const rooms = d.selectedRooms || d.accommodation?.selected_rooms || [];
    return {
      day_number: dayNumber,
      nights,
      destination_id: idOf(d.destination, "id", "destination_id"),
      accommodation_id: idOf(d.accommodation, "accommodation_id", "id"),
      included_meals: d.selectedMeals || [],
      activities: (d.activities || []).map((act) => ({
        activity_type_id: act.activity_type_id ?? idOf(act.activity_type),
        main_location_id: act.main_location_id ?? idOf(act.main_location),
        start_location_id: act.start_location_id ?? idOf(act.start_location),
        via_location_id: act.via_location_id ?? idOf(act.via_location),
        end_location_id: act.end_location_id ?? idOf(act.end_location),
        moment: act.moment ?? null,
        transit_fee_included: act.transit_fee_included || false,
        transit_fee: act.transit_fee ?? null,
        transit_fee_per: act.transit_fee_per ?? null,
        is_optional: act.is_optional || false,
        optional_activity_price: act.optional_activity_price ?? null,
        price_per: act.price_per ?? null,
      })).filter((a) => a.activity_type_id),
      optional_meals: (d.optionalMeals || []).map((meal) => ({
        meal_id: meal.meal_id ?? idOf(meal.meal) ?? meal.id,
        is_optional: meal.is_optional !== undefined ? meal.is_optional : true,
        price: meal.price ?? 0,
      })).filter((m) => m.meal_id),
      selected_rooms: rooms.map((room) => ({
        room_type_id: room.room_type_id ?? idOf(room.room_type) ?? room.id,
        quantity: Number(room.quantity ?? room.number ?? 1) || 1,
      })).filter((r) => r.room_type_id),
    };
  });
}
