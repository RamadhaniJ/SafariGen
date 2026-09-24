import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import api from '../../../Apis/api';

const TOUR_TYPES = [
                        "Group Tour",
                        "Solo Tour",
                        "Private Tour",
                        "Family Tour",
                        "Luxury Tour",
                        "Budget Tour"
                ];


const COUNTRY_LIST = [
            "Tanzania","Kenya","Uganda","Rwanda",
        ". South Africa","Zambia","Botswana"
      ];

const initialTravellers = [{ label: 'Adults', number: 1 }];
const initialRooms = [{ label: 'Single Room', number: 1 }];

export const useClientRequestForm = (clientId, navigate) => {
  const [clientInfo, setClientInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  // Form fields
  const [tourTitle, setTourTitle] = useState('');
  const [tourType, setTourType] = useState('');
  const [tourLength, setTourLength] = useState('');
  const [customTourLength, setCustomTourLength] = useState('');
  const [countryVisited, setCountryVisited] = useState([]); // array of strings
  const [tourStartDate, setTourStartDate] = useState('');
  const [startDestinationId, setStartDestinationId] = useState(null);
  const [endDestinationId, setEndDestinationId] = useState(null);
  const [requestInfo, setRequestInfo] = useState('');
  const [travellers, setTravellers] = useState(initialTravellers);
  const [rooms, setRooms] = useState(initialRooms);
  
  // Validation errors
  const [errors, setErrors] = useState({});

  // Fetch client data
//   useEffect(() => {
//     const fetchClient = async () => {
//       try {
//         const resp = await api.get(`clients/update/clients/${clientId}/`);
//         setClientInfo(resp.data);
//       } catch (error) {
//         const msg = error.response?.data?.detail || 'Failed to load client data.';
//         toast.error(msg);
//         // navigate('/clients');
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchClient();
//   }, [clientId, navigate]);

  // Compute total travellers and rooms
  const totalTravellers = travellers.reduce((acc, curr) => acc + Number(curr.number || 0), 0);
  const totalRooms = rooms.reduce((acc, curr) => acc + Number(curr.number || 0), 0);

  // Validation function
  const validate = () => {
    const newErrors = {};
    if (!tourTitle.trim()) newErrors.tourTitle = 'Tour title is required';
    if (!tourType) newErrors.tourType = 'Please select a tour type';
    if (!tourLength) newErrors.tourLength = 'Please select tour length';
    if (tourLength === 'custom' && !customTourLength.trim()) {
      newErrors.customTourLength = 'Please enter custom tour length';
    }
    if (countryVisited.length === 0) newErrors.countryVisited = 'Select at least one country';
    if (!tourStartDate) newErrors.tourStartDate = 'Start date is required';
    if (!startDestinationId) newErrors.startDestination = 'Select start destination';
    if (!endDestinationId) newErrors.endDestination = 'Select end destination';
    // Check if start date is in the past
    if (tourStartDate && new Date(tourStartDate) < new Date().setHours(0,0,0,0)) {
      newErrors.tourStartDate = 'Start date cannot be in the past';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error('Please fix the errors before submitting.');
      return;
    }

    // Calculate final tour length value
    let finalTourLength = tourLength;
    if (tourLength === 'custom') {
      // Extract number from custom input (e.g., "45 Days / 44 Nights" -> 45)
      const numeric = parseInt(customTourLength.match(/\d+/)?.[0] || '0', 10);
      if (!numeric || numeric <= 0) {
        toast.error('Please enter a valid number of days.');
        return;
      }
      finalTourLength = numeric;
    }

    const payload = {
      client_requested: clientInfo.id,
      tour_title: tourTitle,
      tour_type: tourType,
      tour_length: finalTourLength,
      country_visited: countryVisited.join(','), // send as comma-separated string
      tour_start_date: tourStartDate,
      start_destination: startDestinationId,
      end_destination: endDestinationId,
      request_info: requestInfo,
      travellers: travellers,
      room_selected: rooms,
    };

    setIsSubmitting(true);
    try {
      const resp = await api.post('create/clients/request/', payload);
      setShowSuccess(true);
      toast.success('Tour request saved successfully!');
      setTimeout(() => {
        navigate(`/preview/client/allinfo/${resp.data.id}`); // Adjust route as needed
      }, 2000);
    } catch (error) {
      const msg = error.response?.data?.detail || 'Failed to save request.';
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handlers for travellers and rooms
  const addTraveller = () => setTravellers([...travellers, { label: 'Adults', number: 1 }]);
  const removeTraveller = (index) => setTravellers(travellers.filter((_, i) => i !== index));
  const updateTraveller = (index, field, value) => {
    const updated = [...travellers];
    updated[index][field] = value;
    setTravellers(updated);
  };

  const addRoom = () => setRooms([...rooms, { label: 'Single Room', number: 1 }]);
  const removeRoom = (index) => setRooms(rooms.filter((_, i) => i !== index));
  const updateRoom = (index, field, value) => {
    const updated = [...rooms];
    updated[index][field] = value;
    setRooms(updated);
  };

  // Toggle country selection
  const toggleCountry = (country) => {
    setCountryVisited(prev =>
      prev.includes(country)
        ? prev.filter(c => c !== country)
        : [...prev, country]
    );
  };

  return {
    clientInfo,
    loading,
    isSubmitting,
    showSuccess,
    tourTitle,
    setTourTitle,
    tourType,
    setTourType,
    tourLength,
    setTourLength,
    customTourLength,
    setCustomTourLength,
    countryVisited,
    toggleCountry,
    tourStartDate,
    setTourStartDate,
    startDestinationId,
    setStartDestinationId,
    endDestinationId,
    setEndDestinationId,
    requestInfo,
    setRequestInfo,
    travellers,
    addTraveller,
    removeTraveller,
    updateTraveller,
    rooms,
    addRoom,
    removeRoom,
    updateRoom,
    totalTravellers,
    totalRooms,
    errors,
    handleSubmit,
  };
};