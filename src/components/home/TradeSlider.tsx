import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";

import handymanImg from '../../assets/section images/imgi_16_professional_tradie.png';
import gardeningImg from '../../assets/section images/david-clode-h7D3RSePhnc-unsplash.jpg';
import cleaningImg from '../../assets/section images/imgi_58_image-1738134664644.png';
import carDetailingImg from '../../assets/section images/kiros-amin-IrtBO4xp6NI-unsplash.jpg';
import pressureWashingImg from '../../assets/section images/imgi_62_image-1738134768994.png';
import carpetCleaningImg from '../../assets/section images/imgi_56_image-1748337345038.png';
import plumberImg from '../../assets/section images/tradie-1.png';
import electricianImg from '../../assets/section images/tradie-2.png';
import builderImg from '../../assets/section images/hero-tradie.jpg';
import painterImg from '../../assets/section images/imgi_57_image-1738135596812.png';
import rooferImg from '../../assets/section images/marco-xu-ToUPBCO62Lw-unsplash.jpg';
import concreterImg from '../../assets/section images/imgi_6_carpentor.png';
import plastererImg from '../../assets/section images/imgi_52_image-1737711390735.jpg';
import landscaperImg from '../../assets/section images/jamie-street-qWYvQMIJyfE-unsplash.jpg';
import photographerImg from '../../assets/section images/handsome-woodworker-posing-photography.jpg';
import fencingImg from '../../assets/section images/imgi_5_fecar.png';

const trades = [
  { name: 'Handyman Services', img: handymanImg, count: '120+ Pros', slug: 'handyman', blurb: 'Fixing everything around your home with ease.' },
  { name: 'Lawn & Gardening', img: gardeningImg, count: '85+ Pros', slug: 'gardening', blurb: 'Keep your garden beautiful and healthy.' },
  { name: 'Domestic Cleaning', img: cleaningImg, count: '150+ Pros', slug: 'cleaning', blurb: 'Sparkling clean homes, every single time.' },
  { name: 'Car Detailing', img: carDetailingImg, count: '40+ Pros', slug: 'car-detailing', blurb: 'Give your car the professional shine it deserves.' },
  { name: 'Pressure Washing', img: pressureWashingImg, count: '35+ Pros', slug: 'pressure-washing', blurb: 'Removing tough stains from every surface.' },
  { name: 'Carpet Cleaning', img: carpetCleaningImg, count: '55+ Pros', slug: 'carpet-cleaning', blurb: 'Fresh and clean carpets for a healthier home.' },
  { name: 'Plumbers', img: plumberImg, count: '140+ Pros', slug: 'plumbers', blurb: 'Expert plumbing solutions for any leak or repair.' },
  { name: 'Electricians', img: electricianImg, count: '95+ Pros', slug: 'electricians', blurb: 'Safe and certified electrical work for your home.' },
  { name: 'Builders', img: builderImg, count: '110+ Pros', slug: 'builders', blurb: 'Quality construction and renovation experts.' },
  { name: 'Painters', img: painterImg, count: '75+ Pros', slug: 'painters', blurb: 'Transform your space with a fresh coat of paint.' },
  { name: 'Roofers', img: rooferImg, count: '40+ Pros', slug: 'roofers', blurb: 'Protect your home with professional roofing.' },
  { name: 'Concreters', img: concreterImg, count: '50+ Pros', slug: 'concreters', blurb: 'Durable and stylish concrete solutions.' },
  { name: 'Plasterers', img: plastererImg, count: '65+ Pros', slug: 'plasterers', blurb: 'Perfect walls and ceilings for your home.' },
  { name: 'Landscapers', img: landscaperImg, count: '80+ Pros', slug: 'landscapers', blurb: 'Stunning landscape designs for outdoor living.' },
  { name: 'Photographers', img: photographerImg, count: '45+ Pros', slug: 'photographers', blurb: 'Capturing your special moments forever.' },
  { name: 'Fencing Contractors', img: fencingImg, count: '70+ Pros', slug: 'fencing', blurb: 'Secure and beautiful fencing for your property.' },
];

const TradeSlider = () => {
  const scroll = (direction: 'left' | 'right') => {
    const container = document.getElementById('job-scroll-container');
    if (container) {
      const scrollAmount = direction === 'left' ? -400 : 400;
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-[30px] overflow-hidden bg-white">
      <div className="section-container">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-black text-[#0A1830] leading-tight"
          >
            Find the <span className="text-primary">Right Jobs</span> <br className="hidden md:block" />
            As Per Your Needs
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-4"
          >
            <div className="flex items-center gap-2">
              <button
                onClick={() => scroll('left')}
                className="h-12 w-12 rounded-full border border-[#cdd6e3] flex items-center justify-center text-[#0A1830] hover:bg-primary hover:text-white hover:border-primary transition-all duration-300"
                aria-label="Scroll Left"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={() => scroll('right')}
                className="h-12 w-12 rounded-full border border-[#cdd6e3] flex items-center justify-center text-[#0A1830] hover:bg-primary hover:text-white hover:border-primary transition-all duration-300"
                aria-label="Scroll Right"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>

            <Link
              to="/categories"
              className="h-12 inline-flex items-center justify-center px-8 rounded-xl bg-primary text-[11px] font-black uppercase tracking-[0.15em] text-white shadow-[0_8px_32px_rgb(59,130,246,0.3)] hover:bg-primary/90 transition-all duration-300"
            >
              View All
            </Link>
          </motion.div>
        </div>
      </div>

      <div className="relative w-full">
        <div
          id="job-scroll-container"
          className="flex gap-5 overflow-x-auto pb-10 scrollbar-hide snap-x snap-mandatory px-5 lg:px-20"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {trades.map((trade, idx) => (
            <motion.div
              key={trade.slug}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="min-w-[280px] sm:min-w-[320px] md:min-w-[32vw] lg:min-w-[23vw] aspect-[1/1.1] snap-start flex-shrink-0"
            >
              <Link
                to={`/categories`}
                className="group relative block h-full w-full overflow-hidden rounded-[2rem] shadow-[0_8px_32px_rgb(10,24,48,0.12)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_16px_48px_rgb(10,24,48,0.2)]"
              >
                {/* Background Image */}
                <img
                  src={trade.img}
                  alt={trade.name}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />

                {/* Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A1830] via-[#0A1830]/10 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Hover Blue Tint */}
                <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors duration-500" />

                {/* Content Overlay */}
                <div className="absolute inset-x-0 bottom-0 p-8 flex flex-col justify-end">
                  <div className="space-y-2">
                    <h3 className="text-xl md:text-2xl font-black text-white uppercase tracking-wider mb-1">
                      {trade.name}
                    </h3>
                    <p className="text-xs md:text-sm text-white/70 font-medium line-clamp-2 max-w-[85%]">
                      {trade.blurb}
                    </p>
                  </div>

                  {/* Floating Arrow Icon */}
                  <div className="absolute bottom-8 right-8 h-11 w-11 rounded-full border border-white/20 bg-white/10 flex items-center justify-center text-white backdrop-blur-sm opacity-0 group-hover:opacity-100 group-hover:translate-x-0 translate-x-4 transition-all duration-500">
                    <ArrowRight className="h-5 w-5" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TradeSlider;
