/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useRef, useEffect } from "react";
import { Search, MapPin, SlidersHorizontal, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getCategories } from "../../api/categoryApi";
import { getLocations } from "../../api/locationApi";
import { getApprovedBusinesses } from "../../api/businessApi";

const FALLBACK_SERVICES = [
  "Handyman Services", "Lawn Mowing and Gardening", "Domestic Cleaning",
  "Car Detailing", "Pressure Washing", "Carpet Cleaning",
  "Plumbers", "Electricians", "Builders", "Painters",
  "Roofers", "Concreters", "Plasterers", "Landscapers",
  "Photographers", "Fencing Contractors",
];

const FALLBACK_REGIONS = [
  "Hobart Region (TAS)", "Launceston Region (TAS)", "Devonport Region (TAS)",
  "Burnie Region (TAS)",
];

export const FindProSearch = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isServiceOpen, setIsServiceOpen] = useState(false);
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(searchParams.get("category") || "");
  const [selectedLocation, setSelectedLocation] = useState(searchParams.get("location") || "");
  const [services, setServices] = useState<string[]>(FALLBACK_SERVICES);
  const [regions, setRegions] = useState<string[]>(FALLBACK_REGIONS);
  const [filteredCount, setFilteredCount] = useState<number | null>(null);
  const [allBusinesses, setAllBusinesses] = useState<any[]>([]);

  // Fetch live data once on mount
  useEffect(() => {
    getCategories()
      .then((cats: any[]) => {
        if (cats && cats.length > 0) setServices(cats.map((c) => c.name));
      })
      .catch(() => {});

    getLocations()
      .then((locs) => {
        if (locs && locs.length > 0) {
          setRegions(locs.map((l) => l.region ? `${l.city} (${l.region})` : l.city));
        }
      })
      .catch(() => {});

    getApprovedBusinesses()
      .then((data) => {
        if (Array.isArray(data)) setAllBusinesses(data);
      })
      .catch(() => {});
  }, []);

  // Recompute filtered count whenever selection or allBusinesses changes
  useEffect(() => {
    if (allBusinesses.length === 0 && filteredCount === null) return;

    const count = allBusinesses.filter((b) => {
      const categoryName = (b.category?.name || b.category || "").toLowerCase();
      const locationStr = b.location?.city
        ? `${b.location.city} ${b.location.region || ""}`.toLowerCase()
        : (b.location || "").toLowerCase();

      const matchesService = !selectedService ||
        categoryName.includes(selectedService.toLowerCase()) ||
        selectedService.toLowerCase().includes(categoryName);

      const matchesLocation = !selectedLocation ||
        locationStr.includes(
          selectedLocation.toLowerCase().replace(" region", "").replace(" area", "")
        );

      return matchesService && matchesLocation;
    });

    setFilteredCount(count.length);
  }, [selectedService, selectedLocation, allBusinesses]);

  const serviceRef = useRef<HTMLDivElement>(null);
  const locationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (serviceRef.current && !serviceRef.current.contains(event.target as Node)) {
        setIsServiceOpen(false);
      }
      if (locationRef.current && !locationRef.current.contains(event.target as Node)) {
        setIsLocationOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (selectedService) params.append("category", selectedService);
    if (selectedLocation) params.append("location", selectedLocation);
    navigate(`/find-a-pro?${params.toString()}`);
  };

  const handleReset = () => {
    setSelectedService("");
    setSelectedLocation("");
    navigate("/find-a-pro");
  };

  return (
    <div className="relative z-20 -mt-10 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.10)] p-3 flex flex-col lg:flex-row items-center gap-3 w-full">
        {/* Service Input */}
        <div
          ref={serviceRef}
          className="flex-[1.2] relative flex items-center px-8 py-4 bg-[#F8FAFC] rounded-[1.8rem] group transition-all w-full cursor-pointer hover:bg-slate-100/50"
          onClick={() => { setIsServiceOpen(!isServiceOpen); setIsLocationOpen(false); }}
        >
          <div className="flex flex-col flex-1">
            <span className="text-[10px] font-black uppercase tracking-[0.15em] text-[#097DDD] mb-1.5">Type of Business</span>
            <div className="flex items-center gap-3">
              <SlidersHorizontal className="w-4 h-4 text-[#097DDD]" />
              <div className={`text-[0.95rem] font-bold ${selectedService ? 'text-[#0F172A]' : 'text-slate-400'}`}>
                {selectedService || "Select Service..."}
              </div>
            </div>
          </div>
          <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isServiceOpen ? 'rotate-180' : ''}`} />

          <AnimatePresence>
            {isServiceOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute top-full left-0 right-0 mt-3 bg-white rounded-2xl shadow-[0_15px_40px_rgba(0,0,0,0.15)] overflow-hidden z-50 border border-slate-100"
              >
                <div className="bg-[#097DDD] px-6 py-3">
                  <span className="text-white font-bold text-sm">Select Service...</span>
                </div>
                <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                  {services.map((service) => (
                    <div
                      key={service}
                      className="px-6 py-3 hover:bg-slate-50 text-slate-700 font-medium text-sm transition-colors cursor-pointer"
                      onClick={(e) => { e.stopPropagation(); setSelectedService(service); setIsServiceOpen(false); }}
                    >
                      {service}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Location Input */}
        <div
          ref={locationRef}
          className="flex-1 relative flex items-center px-8 py-4 bg-[#F8FAFC] rounded-[1.8rem] group transition-all w-full cursor-pointer hover:bg-slate-100/50"
          onClick={() => { setIsLocationOpen(!isLocationOpen); setIsServiceOpen(false); }}
        >
          <div className="flex flex-col flex-1">
            <span className="text-[10px] font-black uppercase tracking-[0.15em] text-[#097DDD] mb-1.5">Location</span>
            <div className="flex items-center gap-3">
              <MapPin className="w-4 h-4 text-[#097DDD]" />
              <div className={`text-[0.95rem] font-bold ${selectedLocation ? 'text-[#0F172A]' : 'text-slate-400'}`}>
                {selectedLocation || "Select Region..."}
              </div>
            </div>
          </div>
          <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isLocationOpen ? 'rotate-180' : ''}`} />

          <AnimatePresence>
            {isLocationOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute top-full left-0 right-0 mt-3 bg-white rounded-2xl shadow-[0_15px_40px_rgba(0,0,0,0.15)] overflow-hidden z-50 border border-slate-100"
              >
                <div className="bg-[#097DDD] px-6 py-3">
                  <span className="text-white font-bold text-sm">Select Region...</span>
                </div>
                <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                  {regions.map((region) => (
                    <div
                      key={region}
                      className="px-6 py-3 hover:bg-slate-50 text-slate-700 font-medium text-sm transition-colors cursor-pointer"
                      onClick={(e) => { e.stopPropagation(); setSelectedLocation(region); setIsLocationOpen(false); }}
                    >
                      {region}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between lg:justify-start gap-6 px-6 py-2 w-full lg:w-auto">
          <div className="flex items-center gap-6">
            <button
              onClick={handleSearch}
              className="bg-[#097DDD] hover:bg-[#0869bb] text-white font-black text-[11px] px-8 py-4 rounded-2xl transition-all shadow-[0_10px_25px_rgba(9,125,221,0.25)] flex items-center gap-2.5 uppercase tracking-[0.12em] whitespace-nowrap"
            >
              <Search size={16} strokeWidth={3} />
              Search
            </button>
            <button
              className="text-[10px] font-black text-[#A4B1CD] hover:text-[#097DDD] transition-all uppercase tracking-[0.15em] whitespace-nowrap"
              onClick={handleReset}
            >
              Reset
            </button>
          </div>
          <div className="flex items-center gap-4 border-l border-slate-100 pl-6">
            <div className="flex flex-col items-center">
              <span className="text-[1.1rem] font-black text-[#0F172A] leading-none">
                {filteredCount !== null ? filteredCount : '—'}
              </span>
              <span className="text-[8px] font-black text-[#A4B1CD] uppercase tracking-wider mt-1">Found</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};