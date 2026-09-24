import { useEffect, useState, useRef, useCallback } from "react";
import { Search, Loader2, X, MapPin, Check } from "lucide-react";
import api from "../../Apis/api";
import { toast } from "sonner";

export default function DestinationComponentOnly({ 
  clientId, 
  autoFilledDestination = null, // Inatoka kwenye Accommodation Component { id, name }
  onSelect 
}) {
  // --- States --- 
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selected, setSelected] = useState(null); // Stores object { id, name, ... }
  const [isOpen, setIsOpen] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);

  // --- Refs ---
  const wrapperRef = useRef(null);
  const inputRef = useRef(null);
  const debounceTimer = useRef(null);
  const isAutoFillingRef = useRef(false);



  const onSeletcRef = useRef(onSelect);
  useEffect(()=>{
    onSeletcRef.current = onSelect;
  }, [onSelect]);




  // ==========================================
  // 2. LIVE SEARCH API CALL
  // ==========================================
  const searchDestinations = useCallback(async (query, isAutoFillFetch = false) => {
    if (!query || query.trim().length < 2) { 
      setResults([]);
      setIsOpen(false);
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.get(`destination/live/search/destination/`, {
        params: {
          client_id: clientId || "",
          search: query.trim()
        }
      });

      const fetchedResults = response.data || [];

      if (isAutoFillFetch && fetchedResults.length > 0){
        const matched = fetchedResults.find(
          (d) => d.name.toLowerCase() === query.toLowerCase()
        ) || fetchedResults[0];
      
        setSelected(matched);
        setSearchTerm(matched.name);
        if (onSeletcRef.current) onSeletcRef.current(matched);
        setIsOpen(false);
       } else{
        setResults(fetchedResults);
        setIsOpen(true);

       }
     
    } catch (error) {
      const errorMsg = error.response?.data?.detail || "Search failed. Please try again.";
      toast.error(errorMsg);
      setResults([]);
    } finally {
      setIsLoading(false);
      isAutoFillingRef.current = false;
    }
  }, [clientId]);





  useEffect(() => {
    if (autoFilledDestination && autoFilledDestination?.name) {
      isAutoFillingRef.current = true;

      setSearchTerm(autoFilledDestination.name);
      searchDestinations(autoFilledDestination.name, true);
    }

  }, [autoFilledDestination?.name, searchDestinations]);





  // Debounce Search Effect
  useEffect(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    // Isifanye API call kama search term inafanana kabisa na tayari kilichochaguliwa
    if (isAutoFillingRef.current || (selected && searchTerm === selected.name)) {
      return;
    }

    debounceTimer.current = setTimeout(() => {
      searchDestinations(searchTerm);
    }, 300);

    return () => clearTimeout(debounceTimer.current);
  }, [searchTerm, searchDestinations, selected]);



  const handleSelect = (item) => {
    setSelected(item);
    setSearchTerm(item.name);
    setResults([]);
    setIsOpen(false);
    setHighlightIndex(-1);
    
    // Tuma data iliyochaguliwa kwenda kwa parent component
    if (onSeletcRef.current) onSeletcRef.current(item);
    inputRef.current?.blur();
  };

  const handleClear = () => {
    setSelected(null);
    setSearchTerm("");
    setResults([]);
    setIsOpen(false);
    setHighlightIndex(-1);

    
    // Tuma null kuruhusu user achague tena anachotaka
    if (onSeletcRef.current) onSeletcRef.current(null);
    inputRef.current?.focus();
  };

  // Keyboard Navigation Support
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
      default:
        break;
    }
  };

  // Click Outside Listener
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

  return (
    <div className="relative w-full" ref={wrapperRef}>
      {/* <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5 block">
        Destination
      </label> */}

      {/* Input Field */}
      <div className="relative">
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
            if (selected) setSelected(null); // User akianza ku-edit, inajitoa kwenye previous selected state
            if (!e.target.value) setIsOpen(false);
          }}
          onFocus={() => {
            if (searchTerm.trim().length >= 2 && !selected) setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
          className={`
            w-full bg-slate-900 border rounded-xl pl-10 pr-10 py-4 
            text-xs font-medium text-slate-100 placeholder-slate-500 
            focus:outline-none focus:ring-2 transition-all duration-200
                border-slate-800 focus:border-indigo-500 focus:ring-indigo-500/20
            
          `}
        />

        {/* Action Controls */}
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center gap-2">
          {isLoading && <Loader2 className="w-4 h-4 text-indigo-400 animate-spin" />}
          {searchTerm && (
            <button
              type="button"
              onClick={handleClear}
              className="text-slate-500 hover:text-slate-200 p-1 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Live Results Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-slate-800 rounded-xl z-50 shadow-2xl max-h-72 overflow-y-auto divide-y divide-slate-800/60 backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-200">
          {results.length > 0 ? (
            results.map((item, index) => (
              <div
                key={item.id}
                onClick={() => handleSelect(item)}
                onMouseEnter={() => setHighlightIndex(index)}
                className={`flex items-center gap-3 p-3 cursor-pointer transition-all duration-150 ${
                  highlightIndex === index
                    ? "bg-indigo-500/10 border-l-2 border-indigo-500"
                    : "hover:bg-slate-800/50"
                }`}
              >
                {item.featured_img ? (
                  <img
                    src={item.featured_img}
                    alt={item.name}
                    className="w-12 h-12 object-cover rounded-lg border border-slate-700/80 shrink-0"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-lg bg-slate-800 border border-slate-700/80 flex items-center justify-center text-[10px] text-slate-500 font-medium shrink-0">
                    No Img
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-semibold text-white truncate flex items-center gap-2">
                    {item.name} 
                    <span className="text-[10px] px-2 py-0.5 rounded-md text-slate-400 bg-slate-800 border border-slate-700 font-normal">
                      {item.destination_type}
                      {item.destination_type === "Mountain" ? " (Park + Rescue Fee)" : item.destination_type === "Park" ? " (Park Fee)" : ""}
                    </span>
                  </h4>
                  {item.location && (
                    <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-0.5">
                      <MapPin className="w-3 h-3 text-indigo-400 shrink-0" />
                      <span className="truncate">{item.location}</span>
                    </div>
                  )}
                </div>

                {selected?.id === item.id && (
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                )}
              </div>
            ))
          ) : (
            <div className="p-5 text-center">
              <p className="text-xs text-slate-400">
                No destination found for "<span className="text-indigo-400 font-medium">{searchTerm}</span>"
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}