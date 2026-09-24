import { useEffect, useState, useRef, useCallback } from "react";
import { Search, Loader2, X, MapPin, Check } from "lucide-react";
import api from "../../Apis/api";
import { toast } from "sonner";

const DestinationComponent = ({ onSelect, initialValue = null }) => {
  // --- States ---
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selected, setSelected] = useState(initialValue); // object { id, name, ... }
  const [isOpen, setIsOpen] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);

  // --- Refs ---
  const wrapperRef = useRef(null);
  const inputRef = useRef(null);
  const debounceTimer = useRef(null);

  // --- Search Function ---
  const searchDestinations = useCallback(async (query) => {
    if (!query || query.trim().length < 2) { 
      setResults([]);
      setIsOpen(false);
      return;
    }

    setIsLoading(true);
    setIsOpen(true);
    try {
      const response = await api.get(
        `destination/live/search/destination/?search=${encodeURIComponent(query.trim())}`
      );
      setResults(response.data || []);
    } catch (error) {
      const errorMsg = error.response?.data?.detail || "Search failed. Please try again.";
      toast.error(errorMsg);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // --- Debounce Effect ---
  useEffect(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    debounceTimer.current = setTimeout(() => {
      searchDestinations(searchTerm);
    }, 300);

    return () => clearTimeout(debounceTimer.current);
  }, [searchTerm, searchDestinations]);

  // --- Handlers ---
  const handleSelect = (item) => {
    setSelected(item);
    setSearchTerm(item.name);
    setResults([]);
    setIsOpen(false);
    setHighlightIndex(-1);
    if (onSelect) onSelect(item.id);
    inputRef.current?.blur();
  };

  const handleClear = () => {
    setSelected(null);
    setSearchTerm("");
    setResults([]);
    setIsOpen(false);
    setHighlightIndex(-1);
    if (onSelect) onSelect(null);
    inputRef.current?.focus();
  };

  // --- Keyboard Navigation ---
  const handleKeyDown = (e) => {
    if (!isOpen || results.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev));
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        e.preventDefault();
        if (highlightIndex >= 0 && highlightIndex < results.length) {
          handleSelect(results[highlightIndex]);
        }
        break;
      case "Escape":
        e.preventDefault();
        setIsOpen(false);
        setHighlightIndex(-1);
        break;
    }
  };

  // --- Click Outside ---
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
        setHighlightIndex(-1);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // --- Render ---
  return (
    <div className="relative w-full" ref={wrapperRef}>
      {/* Input Wrapper */}
      <div className="relative">
        {/* Search Icon */}
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
          <Search className="w-4 h-4" />
        </div>

        <input
          ref={inputRef}
          type="text"
          placeholder="Search destination (e.g. Serengeti, Ngorongoro)..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            if (selected) setSelected(null);
            if (!e.target.value) setIsOpen(false);
          }}
          onFocus={() => {
            if (searchTerm.trim().length >= 2) setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
          className={`
            w-full bg-slate-900 border rounded-xl pl-10 pr-10 py-3 
            text-sm text-slate-100 placeholder-slate-500 
            focus:outline-none focus:ring-2 transition-all duration-200
            ${
              selected
                ? "border-emerald-500 focus:ring-emerald-500/20"
                : "border-slate-800 focus:border-fuchsia-500 focus:ring-fuchsia-500/20"
            }
          `}
        />

        {/* Action Icons */}
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center gap-2">
          {isLoading && <Loader2 className="w-4 h-4 text-fuchsia-400 animate-spin" />}
          {searchTerm && (
            <button
              type="button"
              onClick={handleClear}
              className="text-slate-500 hover:text-slate-300 p-1 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Dropdown Results */}
      {isOpen && (
        <div
          className="
            absolute top-full left-0 right-0 mt-2 
            bg-slate-900/95 backdrop-blur-md border border-slate-800 
            rounded-xl z-50 shadow-2xl shadow-slate-950/80 
            max-h-72 overflow-y-auto 
            divide-y divide-slate-800/60 
            scrollbar-thin scrollbar-thumb-slate-800
            animate-in fade-in slide-in-from-top-2 duration-200
          "
        >
          {isLoading ? (
            // Loading Skeleton
            <div className="p-4 text-center">
              <Loader2 className="w-5 h-5 text-fuchsia-400 animate-spin mx-auto" />
              <p className="text-xs text-slate-400 mt-2">Searching destinations...</p>
            </div>
          ) : results.length > 0 ? (
            // Results List
            results.map((item, index) => (
              <div
                key={item.id}
                onClick={() => handleSelect(item)}
                onMouseEnter={() => setHighlightIndex(index)}
                className={`
                  flex items-center gap-3 p-3 cursor-pointer 
                  transition-all duration-150 
                  ${
                    highlightIndex === index
                      ? "bg-fuchsia-500/10 border-l-2 border-fuchsia-500"
                      : "hover:bg-slate-800/50"
                  }
                `}
              >
                {/* Image */}
                {item.featured_img ? (
                  <img
                    src={item.featured_img}
                    alt={item.name}
                    className="w-14 h-14 object-cover rounded-lg border border-slate-700/80 shrink-0"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-lg bg-slate-800 border border-slate-700/80 flex items-center justify-center text-xs text-slate-500 font-medium shrink-0">
                    No Img
                  </div>
                )}

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-white truncate">
                    {item.name} <span className="text-xs px-2 py-0 rounded-lg text-gray-500 bg-gray-700" >{item.destination_type}</span>
                  </h4>
                  {item.location && (
                    <div className="flex items-center gap-1 text-xs text-slate-400 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-fuchsia-400 shrink-0" />
                      <span className="truncate">{item.location}</span>
                    </div>
                  )}
                </div>

                {/* Selected Check */}
                {selected?.id === item.id && (
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                )}
              </div>
            ))
          ) : (
            // No Results
            <div className="p-6 text-center z-50">
              <div className="text-4xl mb-2">🔍</div>
              <p className="text-sm text-slate-400">
                No destination found for "
                <span className="text-fuchsia-400 font-medium">{searchTerm}</span>"
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Try a different keyword or check your spelling.
              </p>
            </div>
          )}
        </div> 
      )}
 
      {/* Selected Indicator (optional) */}
      {selected && (
        <div className="mt-2 text-xs text-emerald-400 flex items-center gap-1.5">
          <Check className="w-3 h-3" />
          <span>Selected: <strong>{selected.name}</strong></span>
        </div>
      )}
    </div>
  );
};

export default DestinationComponent;