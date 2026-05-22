import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, CheckCircle2, Star, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useGiveaway } from '../../context/GiveawayContext';

// Import images from assets
import tradie1 from '../../assets/section images/tradie-1.png';
import tradie2 from '../../assets/section images/tradie-2.png';
import tradie3 from '../../assets/section images/tradie-3.png';
import electrician from '../../assets/section images/electrician-installing-laying-electrical-cables-ceiling-inside-house.jpg';

const sliderImages = [tradie1, tradie2, tradie3, electrician];


const Hero = () => {
  const navigate = useNavigate();
  const { showTicker } = useGiveaway();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [service, setService] = useState('');
  const [location, setLocation] = useState('');
  const [isServiceOpen, setIsServiceOpen] = useState(false);
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const serviceRef = useRef<HTMLDivElement>(null);
  const locationRef = useRef<HTMLDivElement>(null);

  const SERVICES = [
    "Handyman Services",
    "Lawn Mowing and Gardening",
    "Domestic Cleaning",
    "Car Detailing",
    "Pressure Washing",
    "Carpet Cleaning",
    "Plumbers",
    "Electricians",
    "Builders",
    "Painters",
    "Roofers",
    "Concreters",
    "Plasterers",
    "Landscapers",
    "Photographers",
    "Fencing Contractors",
  ];

  const REGIONS = [
    "Hobart Region (TAS)",
    "Launceston Region (TAS)",
    "Devonport Region (TAS)",
    "Burnie Region (TAS)",
    "North Brisbane (QLD)",
    "South Brisbane (QLD)",
    "West Brisbane (QLD)",
    "East Brisbane (QLD)",
    "Gold Coast Region (QLD)",
    "Sunshine Coast Region (QLD)",
    "Tasmania Region (TAS)",
    "Queensland Region (QLD)",
    "more states coming soon",
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (service) params.append('category', service);
    if (location) params.append('location', location);
    navigate(`/find-a-pro?${params.toString()}`);
  };

  return (
    <section
      className={`relative min-h-[65vh] bg-[#050f26] pb-[100px] overflow-hidden flex items-center ${
        showTicker ? 'pt-8 md:pt-10' : 'pt-[90px]'
      }`}
    >
      {/* Background Animated Image (Low Opacity) */}
      <AnimatePresence mode="sync">
        <motion.img
          key={currentSlide + "-bg"}
          src={sliderImages[currentSlide]}
          alt="background"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.08 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2 }}
          className="absolute inset-0 h-full w-full object-cover -z-10"
        />
      </AnimatePresence>

      {/* Grid dot pattern */}
      <div
        className="absolute inset-0 opacity-[0.05] -z-10"
        style={{
          backgroundImage: "radial-gradient(circle, #3b82f6 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Background Glows */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[20%] right-[-10%] w-[600px] h-[600px] bg-primary/20 blur-[150px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-blue-900/30 blur-[150px] rounded-full" />
      </div>

      <div className="section-container relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center space-x-2 px-4 py-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-full w-fit mb-8 shadow-xl">
              <MapPin className="w-3 h-3 text-primary" />
              <span className="text-[11px] font-bold text-white/70 uppercase tracking-[0.2em]">
                Trusted Local Services — Australia
              </span>
            </div>

            <h1 className="text-4xl lg:text-[56px] font-extrabold leading-[1.1] mb-6 tracking-tight">
              Find Trusted <span className="text-primary relative inline-block">
                Local Pros
                <div className="absolute -bottom-2 left-0 w-full h-1 bg-primary/30 blur-sm" />
              </span><br />
              Near You — Fast.
            </h1>

            <p className="text-base text-white/60 mb-8 leading-relaxed max-w-xl">
              Search by service and location, connect directly with verified tradies, and get the job done. Free for customers — always.
            </p>

            <div className="flex flex-wrap gap-6 mb-12">
              {[
                'Verified Professionals',
                'No Lead Fees',
                'Instant Contact'
              ].map((item) => (
                <div key={item} className="flex items-center space-x-2">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  <span className="text-sm font-semibold text-white/80">{item}</span>
                </div>
              ))}
            </div>

            {/* Advertising Section */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-10 p-6 bg-white/5 backdrop-blur-md border border-white/10 rounded-[2rem]">
              <div className="flex flex-col">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-white/40 text-sm font-bold line-through decoration-primary decoration-2">$33 inc GST / month</span>
                  <span className="bg-primary/20 text-primary text-[10px] font-black px-2 py-0.5 rounded-full uppercase">Special</span>
                </div>
                <div className="text-2xl font-black text-white flex items-baseline gap-2">
                  FREE <span className="text-primary text-sm uppercase tracking-widest font-black">for all 2026</span>
                </div>
              </div>

              <div className="hidden sm:block w-px h-12 bg-white/10" />

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  <p className="text-white/90 text-sm font-bold">Only 10 spots per category/location</p>
                </div>
                <p className="text-white/40 text-xs font-medium ml-3.5">Secure your exclusive placement today.</p>
              </div>
            </div>

            {/* Search Box */}
            <form
              onSubmit={handleSearch}
              className="bg-white/5 backdrop-blur-xl p-4 rounded-[2rem] border border-white/10 shadow-2xl relative max-w-5xl"
            >
              <div className="grid md:grid-cols-[1.2fr_1fr_auto] gap-4 items-center">
                {/* Service Type Dropdown */}
                <div
                  ref={serviceRef}
                  className="relative space-y-2 group cursor-pointer"
                  onClick={() => {
                    setIsServiceOpen(!isServiceOpen);
                    setIsLocationOpen(false);
                  }}
                >
                  <label className="block text-[10px] font-black text-primary uppercase tracking-[0.15em] ml-1 opacity-70 group-hover:opacity-100 transition-opacity">
                    Service Type
                  </label>
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-4 transition-all hover:bg-white/10 flex items-center justify-between">
                    <span className={`text-sm font-bold ${service ? 'text-white' : 'text-white/40'}`}>
                      {service || "What do you need?"}
                    </span>
                    <ChevronDown size={16} className={`text-white/30 transition-transform ${isServiceOpen ? 'rotate-180' : ''}`} />
                  </div>

                  <AnimatePresence>
                    {isServiceOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute top-full left-0 right-0 mt-3 bg-[#0f172a] rounded-2xl shadow-2xl overflow-hidden z-50 border border-white/10"
                      >
                        <div className="bg-primary px-6 py-3">
                          <span className="text-white font-bold text-xs">Select Service...</span>
                        </div>
                        <div className="max-h-[250px] overflow-y-auto custom-scrollbar">
                          {SERVICES.map((s) => (
                            <div
                              key={s}
                              className="px-6 py-3 hover:bg-white/5 text-white/70 hover:text-white font-medium text-sm transition-colors cursor-pointer"
                              onClick={(e) => {
                                e.stopPropagation();
                                setService(s);
                                setIsServiceOpen(false);
                              }}
                            >
                              {s}
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>


                {/* Location Dropdown */}
                <div
                  ref={locationRef}
                  className="relative space-y-2 group cursor-pointer"
                  onClick={() => {
                    setIsLocationOpen(!isLocationOpen);
                    setIsServiceOpen(false);
                  }}
                >
                  <label className="block text-[10px] font-black text-primary uppercase tracking-[0.15em] ml-1 opacity-70 group-hover:opacity-100 transition-opacity">
                    Location
                  </label>
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-4 transition-all hover:bg-white/10 flex items-center justify-between">
                    <span className={`text-sm font-bold ${location ? 'text-white' : 'text-white/40'}`}>
                      {location || "Where?"}
                    </span>
                    <ChevronDown size={16} className={`text-white/30 transition-transform ${isLocationOpen ? 'rotate-180' : ''}`} />
                  </div>

                  <AnimatePresence>
                    {isLocationOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute top-full left-0 right-0 mt-3 bg-[#0f172a] rounded-2xl shadow-2xl overflow-hidden z-50 border border-white/10"
                      >
                        <div className="bg-primary px-6 py-3">
                          <span className="text-white font-bold text-xs">Select Region...</span>
                        </div>
                        <div className="max-h-[250px] overflow-y-auto custom-scrollbar">
                          {REGIONS.map((r) => (
                            <div
                              key={r}
                              className="px-6 py-3 hover:bg-white/5 text-white/70 hover:text-white font-medium text-sm transition-colors cursor-pointer"
                              onClick={(e) => {
                                e.stopPropagation();
                                setLocation(r);
                                setIsLocationOpen(false);
                              }}
                            >
                              {r}
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Search Button */}
                <button
                  type="submit"
                  className="bg-primary hover:bg-blue-600 text-white font-black px-12 py-5 rounded-2xl transition-all shadow-[0_10px_25px_rgba(59,130,246,0.4)] hover:shadow-[0_15px_35px_rgba(59,130,246,0.5)] uppercase tracking-widest text-sm self-end mb-0.5"
                >
                  Search
                </button>
              </div>
            </form>

            {/* Stats */}
            <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { label: 'Local Pros', value: '500+' },
                { label: 'Service Types', value: '16' },
                { label: 'Avg Rating', value: '4.9★' },
                { label: 'For Customers', value: 'Free' },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="text-xl font-black mb-0.5">{stat.value}</div>
                  <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right Image Slider */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="relative"
          >
            <div className="relative z-10 rounded-[2.5rem] overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(59,130,246,0.3)] aspect-[4/3]">
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentSlide}
                  src={sliderImages[currentSlide]}
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.7 }}
                  className="w-full h-full object-cover"
                />
              </AnimatePresence>

              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

              {/* Slider Dots */}
              <div className="absolute top-8 right-8 flex space-x-2">
                {sliderImages.map((_, i) => (
                  <div
                    key={i}
                    className={`h-1.5 rounded-full transition-all duration-300 ${i === currentSlide ? 'w-6 bg-primary' : 'w-1.5 bg-white/30'}`}
                  />
                ))}
              </div>

              {/* Overlay Card */}
              <div className="absolute bottom-8 left-8 right-8 glass-card p-4 rounded-2xl flex items-center justify-between border-white/20">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                    <Star className="w-5 h-5 text-primary fill-primary" />
                  </div>
                  <div>
                    <div className="text-sm font-bold">Top-Rated Pros</div>
                    <div className="text-[10px] text-white/50">Verified & reviewed by real customers</div>
                  </div>
                </div>
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-7 h-7 rounded-full border-2 border-[#1e293b] bg-slate-800 overflow-hidden">
                      <img src={`https://i.pravatar.cc/30?img=${i + 20}`} alt="User" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Decorative Glow */}
            <div className="absolute -inset-4 bg-primary/20 blur-[60px] rounded-full -z-10" />
          </motion.div>
        </div>
      </div>

      {/* Wavy Bottom */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
        <svg className="relative block w-full h-[60px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C58.15,116.75,133.45,123.77,202,112.5,251.29,104.4,289.47,76.54,321.39,56.44Z" className="fill-white"></path>
        </svg>
      </div>
    </section>
  );
};

export default Hero;
