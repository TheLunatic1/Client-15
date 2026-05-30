import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { getCategories } from "../../api/categoryApi";

// Import local assets
import handymanImg from "../../assets/section images/handsome-woodworker-posing-photography.jpg";
import gardeningImg from "../../assets/section images/tradie-3.png";
import cleaningImg from "../../assets/section images/andriyko-podilnyk-VehdYPKnX8Y-unsplash.jpg";
import carDetailingImg from "../../assets/section images/imgi_5_fecar.png";
import pressureWashingImg from "../../assets/section images/imgi_57_image-1738135596812.png";
import carpetCleaningImg from "../../assets/section images/imgi_58_image-1738134664644.png";
import plumbersImg from "../../assets/section images/tradie-1.png";
import electriciansImg from "../../assets/section images/tradie-2.png";
import buildersImg from "../../assets/section images/imgi_6_carpentor.png";
import paintersImg from "../../assets/section images/imgi_16_professional_tradie.png";
import roofersImg from "../../assets/section images/kiros-amin-IrtBO4xp6NI-unsplash.jpg";
import concretorsImg from "../../assets/section images/imgi_52_image-1737711390735.jpg";
import plasterersImg from "../../assets/section images/imgi_56_image-1748337345038.png";
import landscapersImg from "../../assets/section images/david-clode-h7D3RSePhnc-unsplash.jpg";
import photographersImg from "../../assets/section images/jamie-street-qWYvQMIJyfE-unsplash.jpg";
import fencingImg from "../../assets/section images/imgi_62_image-1738134768994.png";

const FALLBACK_CATEGORIES = [
  { name: "HANDYMAN SERVICES", image: handymanImg },
  { name: "LAWN MOWING AND GARDENING", image: gardeningImg },
  { name: "DOMESTIC CLEANING", image: cleaningImg },
  { name: "CAR DETAILING", image: carDetailingImg },
  { name: "PRESSURE WASHING", image: pressureWashingImg },
  { name: "CARPET CLEANING", image: carpetCleaningImg },
  { name: "PLUMBERS", image: plumbersImg },
  { name: "ELECTRICIANS", image: electriciansImg },
  { name: "BUILDERS", image: buildersImg },
  { name: "PAINTERS", image: paintersImg },
  { name: "ROOFERS", image: roofersImg },
  { name: "CONCRETORS", image: concretorsImg },
  { name: "PLASTERERS", image: plasterersImg },
  { name: "LANDSCAPERS", image: landscapersImg },
  { name: "PHOTOGRAPHERS", image: photographersImg },
  { name: "FENCING CONTRACTORS", image: fencingImg },
];

export const CategoriesGrid = () => {
  const [displayCategories, setDisplayCategories] = useState<any[]>(FALLBACK_CATEGORIES);

  useEffect(() => {
    let mounted = true;
    getCategories()
      .then((cats) => {
        if (mounted && Array.isArray(cats) && cats.length > 0) {
          const mappedCats = cats.map(c => {
            const fallback = FALLBACK_CATEGORIES.find(fc => fc.name.toLowerCase() === c.name.toLowerCase());
            return {
              name: c.name,
              image: c.image || fallback?.image || handymanImg
            };
          });
          setDisplayCategories(mappedCats);
        }
      })
      .catch(() => {});
    return () => { mounted = false; };
  }, []);
  return (
    <section className="bg-slate-50 py-16 pb-24">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Categories Grid - 16 simplified cards, non-clickable, clean and large for older eyes */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 mb-16">
          {displayCategories.map((category, index) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.03 }}
              className="group relative aspect-[4/5] rounded-[2rem] overflow-hidden select-none shadow-[0_8px_30px_rgba(0,0,0,0.03)] border border-slate-100/80 bg-slate-100"
            >
              {/* Background Image - with polish hover zoom but no active pointer cursor */}
              <img
                src={category.image}
                alt={category.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              
              {/* High Contrast Gradient Overlay for text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A1830]/90 via-[#0A1830]/35 to-transparent" />

              {/* Title Content */}
              <div className="absolute inset-x-0 bottom-0 p-8 flex flex-col justify-end">
                <h3 className="text-white font-black text-base sm:text-[17px] md:text-lg leading-tight uppercase tracking-wider break-words text-wrap">
                  {category.name}
                </h3>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Large, centered, high-legibility CTA button linking to main search page */}
        <div className="flex justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <Link
              to="/find-a-pro"
              className="inline-flex items-center gap-3 bg-[#097DDD] hover:bg-[#0869bb] text-white font-black text-xs px-12 py-5 rounded-2xl transition-all shadow-[0_10px_25px_rgba(9,125,221,0.25)] hover:shadow-[0_15px_35px_rgba(9,125,221,0.35)] hover:-translate-y-1 uppercase tracking-widest"
            >
              <Search size={16} strokeWidth={3} />
              Search for a Pro
            </Link>
          </motion.div>
        </div>

      </div>
    </section>
  );
};
