  const [dayConfigs, setDayConfigs] = useState(() => {
    if (dataToEdit?.days && Array.isArray(dataToEdit.days)) {
      return dataToEdit.days.map(day => ({
        ...day,
        // 1. Hakikisha ID ipo (kwa ajili ya React keys)
        id: day.id || `day_${Date.now()}_${Math.random()}`,
        
        // 2. Badilisha 'included_meals' (kutoka backend) kuwa 'selectedMeals' (kwa frontend)
        selectedMeals: day.included_meals || day.selectedMeals || ["Breakfast", "Lunch", "Dinner"],
        
        // 3. Hakikisha arrays nyingine zipo ili zisipe 'undefined' error
        activities: day.activities || [],
        optionalMeals: day.optional_meals || day.optionalMeals || [],
        selectedRooms: day.selected_rooms || day.selectedRooms || [],
        
        // 4. Hakikisha destination na accommodation zina format sahihi (Object au ID)
        destination: day.destination_name 
          ? { id: day.destination, name: day.destination_name } 
          : (typeof day.destination === 'object' ? day.destination : null),
          
        accommodation: day.accommodation_name 
          ? { id: day.accommodation, name: day.accommodation_name, accommodation_id: day.accommodation } 
          : (typeof day.accommodation === 'object' ? day.accommodation : null),
      }));
    }
    return [];
  });