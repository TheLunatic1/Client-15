import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, CheckCircle2, Star, MapPin } from "lucide-react";
import { useRef, useEffect, useState } from "react";
import { getApprovedBusinesses } from "../../api/businessApi";

const CARD_W = 280;
const GAP = 24;

const ReviewedTradies = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [professionals, setProfessionals] = useState<any[]>([]);

  useEffect(() => {
    getApprovedBusinesses().then((data: any[]) => {
      const mapped = data.map((b) => ({
        id: b._id || b.id,
        name: b.businessName,
        category: b.category?.name || b.category || 'Service Provider',
        suburb: b.suburb || b.location?.city || b.location || 'Australia',
        image: b.coverImage || b.logo || "https://images.unsplash.com/photo-1542013936693-884638332954?auto=format&fit=crop&q=80&w=800",
        rating: b.rating && b.rating !== '0' && b.rating !== '0.0' ? Number(b.rating).toFixed(1) : 'New',
        reviews: b.reviews || 0,
      }));
      setProfessionals(mapped);
    }).catch(console.error);
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === "left" ? -(CARD_W + GAP) * 2 : (CARD_W + GAP) * 2,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="py-[30px] bg-[#f8fafc] overflow-hidden">
      {/* Header stays in container */}
      <div className="section-container mb-10">
        <div className="flex items-center justify-between gap-6">
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-black text-[#0A1830]"
          >
            Most Reviewed <span className="text-primary">Tradies</span>
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-4"
          >
            <button
              onClick={() => scroll("left")}
              className="h-12 w-12 rounded-full border border-[#cdd6e3] flex items-center justify-center text-[#0A1830] hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 active:scale-95"
              aria-label="Scroll Left"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={() => scroll("right")}
              className="h-12 w-12 rounded-full border border-[#cdd6e3] flex items-center justify-center text-[#0A1830] hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 active:scale-95"
              aria-label="Scroll Right"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </motion.div>
        </div>
      </div>

      {/* Full-bleed slider */}
      <div
        ref={scrollRef}
        className="flex overflow-x-auto gap-6 pb-10 no-scrollbar px-5 lg:px-20"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {professionals.map((business, idx) => (
          <motion.div
            key={business.id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.07 }}
            style={{ minWidth: CARD_W, maxWidth: CARD_W }}
            className="flex-shrink-0"
          >
            <Link
              to={`/business/${business.id}`}
              className="group block rounded-[2.5rem] overflow-hidden shadow-[0_4px_20px_rgb(10,24,48,0.09)] hover:shadow-[0_20px_48px_rgb(10,24,48,0.16)] transition-all duration-500 hover:-translate-y-2 bg-white h-full border border-slate-100"
            >
              {/* Image */}
              <div className="relative overflow-hidden h-60">
                <img
                  src={business.image}
                  alt={business.name}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />

                {/* ✓ Premium Verified badge */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-emerald-500 rounded-full px-2.5 py-1 z-10 shadow-lg">
                  <CheckCircle2 className="h-3 w-3 text-white" />
                  <span className="text-[9px] font-black uppercase tracking-wider text-white leading-none">
                    Verified
                  </span>
                </div>

                {/* Star rating */}
                <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-black/40 backdrop-blur-sm rounded-full px-2 py-1 z-10">
                  <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                  <span className="text-[10px] font-bold text-white">{business.rating}</span>
                </div>
              </div>

              {/* Footer info */}
              <div className="bg-white p-6 text-center">
                <h3 className="text-lg font-black text-[#0A1830] mb-1 truncate leading-tight">
                  {business.name}
                </h3>
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-4">{business.category}</p>

                <div className="flex items-center justify-between border-t border-slate-50 pt-4">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
                    <p className="text-[10px] text-[#5a7089] truncate font-bold">{business.suburb}</p>
                  </div>
                  <div className="shrink-0 flex items-center gap-1.5">
                    <span className="text-[10px] text-primary font-black">{business.reviews}</span>
                    <span className="text-[10px] text-[#5a7089] font-bold uppercase tracking-tighter">reviews</span>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}

        <div className="shrink-0 w-20" aria-hidden />
      </div>
    </section>
  );
};

export default ReviewedTradies;
