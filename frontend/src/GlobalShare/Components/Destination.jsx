import { useEffect, useState, useRef, useCallback } from "react";
import { Search, Loader2, X, MapPin, Check } from "lucide-react";
import api from "../../Apis/api";
import { toast } from "sonner";

const DestinationComponentGlobal = ({ 
  onSelect, 
  initialValue = null,
  autoFilledDestination = null,
 }) => {

  const bootstrap = initialValue || autoFilledDestination;
  // --- States ---
  const [searchTerm, setSearchTerm] = useState(bootstrap?.name || "");
  const [selected, setSelected] = useState(bootstrap);

  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);

  // --- Refs ---
  const wrapperRef = useRef(null);
  const inputRef = useRef(null);
  const debounceTimer = useRef(null);
  const justSelectedRef = useRef(false); 

  useEffect(()=>{
    if(!autoFilledDestination) return;

    if (selected?.id === autoFilledDestination.id) return;

    justSelectedRef.current = true;
    setSelected(autoFilledDestination);
    setSearchTerm(autoFilledDestination.name || "");
    setResults([]);
    setIsOpen(false);
    setHighlightIndex(-1);

  }, [autoFilledDestination, selected?.id]);

  // --- Search Function ---
  const searchDestinations = useCallback(async (query) => {
    if (!query || !query.trim()) {
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
    // ✅ NEW — if this searchTerm change came from selecting a result, skip the search
    if (justSelectedRef.current) {
      justSelectedRef.current = false; // reset for the next real keystroke
      return;
    }

    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    debounceTimer.current = setTimeout(() => {
      searchDestinations(searchTerm);
    }, 300);

    return () => clearTimeout(debounceTimer.current);
  }, [searchTerm, searchDestinations]);

  // --- Handlers ---
  const handleSelect = (item) => {
    justSelectedRef.current = true; // ✅ NEW — flag BEFORE setSearchTerm so the effect skips
    setSelected(item);
    setSearchTerm(item.name);
    setResults([]);
    setIsOpen(false);
    setHighlightIndex(-1);
    if (onSelect) onSelect({id: item.id, name: item.name});
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
      <div className="relative group">
        {/* Search Icon */}
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#6B6459] transition-colors group-focus-within:text-[#E8772E]">
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
            w-full bg-white border pl-10 pr-10 py-3
            text-sm text-[#0F2A2E] placeholder:text-[#6B6459]/50
            focus:outline-none focus:ring-2 transition-all duration-200
            ${
              selected
                ? "border-[#1E5A3B] focus:ring-[#1E5A3B]/20"
                : "border-[#E4DCCB] focus:border-[#E8772E] focus:ring-[#E8772E]/20"
            }
          `}
        />

        {/* Action Icons */}
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center gap-2">
          {isLoading && (
            <Loader2 className="w-4 h-4 text-[#E8772E] animate-spin" />
          )}
          {searchTerm && (
            <button
              type="button"
              onClick={handleClear}
              className="text-[#6B6459] hover:text-[#0F2A2E] p-1 rounded-lg hover:bg-[#F6F1E7] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8772E]"
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
            bg-white border border-[#E4DCCB]
            z-50 shadow-[0_12px_32px_-8px_rgba(15,42,46,0.18)]
            max-h-72 overflow-y-auto
            divide-y divide-[#E4DCCB]/60
            scrollbar-thin
            animate-in fade-in slide-in-from-top-2 duration-200
          "
        >
          {isLoading ? (
            /* Loading Skeleton */
            <div className="p-6 text-center">
              <Loader2 className="w-5 h-5 text-[#E8772E] animate-spin mx-auto" />
              <p className="text-xs text-[#6B6459] mt-2">
                Searching destinations...
              </p>
            </div>
          ) : results.length > 0 ? (
            /* Results List */
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
                      ? "bg-[#FCE9DA] border-l-2 border-[#E8772E]"
                      : "hover:bg-[#F6F1E7]/60"
                  }
                `}
              >
                {/* Image */}
                {item.featured_img ? (
                  <img
                    src={item.featured_img}
                    alt={item.name}
                    className="w-14 h-14 object-cover rounded-lg border border-[#E4DCCB] shrink-0"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-lg bg-[#F6F1E7] border border-[#E4DCCB] flex items-center justify-center text-xs text-[#6B6459] font-medium shrink-0">
                    No Img
                  </div>
                )}

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-[#0F2A2E] truncate flex items-center gap-2">
                    <span className="truncate">{item.name}</span>
                    {/* <span className="shrink-0 text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md text-[#7A4E08] bg-[#FDF4DD] border border-[#F2B544]/30">
                      {item.destination_type}
                    </span> */}
                  </h4>
                  {item.location && (
                    <div className="flex items-center gap-1 text-xs text-[#6B6459] mt-1">
                      <MapPin className="w-3.5 h-3.5 text-[#E8772E] shrink-0" />
                      <span className="truncate">{item.location}</span>
                    </div>
                  )}
                </div>

                {/* Selected Check */}
                {selected?.id === item.id && (
                  <Check className="w-4 h-4 text-[#1E5A3B] shrink-0" />
                )}
              </div>
            ))
          ) : (
            /* No Results */
            <div className="p-6 text-center">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-[#FCE9DA] border border-[#E8772E]/20 flex items-center justify-center mb-3">
                <Search className="w-5 h-5 text-[#B34F12]" />
              </div>
              <p className="text-sm text-[#0F2A2E] font-medium">
                No destination found for{" "}
                <span className="text-[#B34F12] font-semibold">"{searchTerm}"</span>
              </p>
              <p className="text-xs text-[#6B6459] mt-1.5">
                Try a different keyword or check your spelling.
              </p>
            </div>
          )}
        </div>
      )}

    </div>
  );
};

export default DestinationComponentGlobal;