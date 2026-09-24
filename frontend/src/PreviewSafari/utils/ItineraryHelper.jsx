// src/PreviewSafari/utils/ItineraryHelper.jsx
import { Sunrise, Sun, Moon, Clock } from "lucide-react";

export const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", { 
    day: "numeric", 
    month: "long", 
    year: "numeric" 
  });
};

export const calculateEndDate = (startDate, days) => {
  if (!startDate) return "";
  const date = new Date(startDate);
  date.setDate(date.getDate() + (days - 1));
  return formatDate(date.toISOString());
};

export const getMealPlan = (meals) => {
  if (!meals) return "No meals included";
  const mealList = meals.split(",").map(m => m.trim());
  if (mealList.length === 3) return "Full Board";
  if (mealList.length === 2) return "Half Board";
  return "Bed & Breakfast";
};

export const getMomentIcon = (moment) => {
  if (moment?.includes("MORNING")) return <Sunrise className="w-4 h-4 text-amber-400" />;
  if (moment?.includes("AFTERNOON")) return <Sun className="w-4 h-4 text-orange-400" />;
  if (moment?.includes("EVENING")) return <Moon className="w-4 h-4 text-indigo-400" />;
  return <Clock className="w-4 h-4 text-slate-400" />;
};