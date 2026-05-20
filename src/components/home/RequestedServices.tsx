import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

import electricianImg from "../../assets/section images/electrician-installing-laying-electrical-cables-ceiling-inside-house.jpg";
import fencingImg from "../../assets/section images/jamie-street-qWYvQMIJyfE-unsplash.jpg";
import locksmithImg from "../../assets/section images/imgi_52_image-1737711390735.jpg";
import painterImg from "../../assets/section images/imgi_57_image-1738135596812.png";

const RequestedServices = () => {
  const services = [
    { name: "ELECTRICIAN", image: electricianImg },
    { name: "FENCING", image: fencingImg },
    { name: "LOCKSMITH", image: locksmithImg },
    { name: "PAINTER", image: painterImg },
  ];

  return (
    <section className="bg-[#f8fafc] py-[30px] overflow-hidden relative">
      <div className="section-container relative z-10">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl"
          >
            <span className="text-primary font-bold text-xs tracking-widest uppercase mb-5 block w-fit">Top Services</span>
            <h2 className="text-3xl md:text-5xl font-black text-[#0A1830] leading-tight">
              Our Most Requested <br /> <span className="text-primary">House Services</span>
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="flex shrink-0"
          >
            <Link
              to="/list-your-business"
              className="inline-flex items-center justify-center rounded-xl bg-[#0A1830] px-8 py-3.5 text-[13px] font-black uppercase tracking-widest text-white shadow-lg hover:bg-[#112340] transition-all hover:-translate-y-1"
            >
              List Your Business
            </Link>
          </motion.div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
          {/* Main Large Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-8 relative group overflow-hidden rounded-[32px] aspect-[16/10] lg:aspect-auto lg:h-[500px] shadow-sm bg-white"
          >
            <img
              src={services[0].image}
              alt={services[0].name}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A1830]/90 via-[#0A1830]/20 to-transparent opacity-80" />
            <div className="absolute bottom-10 left-10 right-10 flex items-center justify-between">
              <span className="text-xl md:text-3xl font-black text-white tracking-wide">
                {services[0].name}
              </span>
              <div className="h-12 w-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white group-hover:bg-primary transition-colors duration-300">
                <ArrowRight className="h-5 w-5" />
              </div>
            </div>
            <Link to="/categories" className="absolute inset-0 z-20"><span className="sr-only">View {services[0].name}</span></Link>
          </motion.div>

          {/* Side Cards Stack */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            {services.slice(1).map((service, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.15, duration: 0.6 }}
                className="relative group overflow-hidden rounded-[24px] flex-1 min-h-[150px] shadow-sm bg-white"
              >
                <img
                  src={service.image}
                  alt={service.name}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A1830]/90 via-[#0A1830]/30 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between">
                  <span className="text-lg font-black text-white tracking-wide">
                    {service.name}
                  </span>
                  <ArrowRight className="h-4 w-4 text-white/50 group-hover:text-white group-hover:translate-x-1 transition-all" />
                </div>
                <Link to="/categories" className="absolute inset-0 z-20"><span className="sr-only">View {service.name}</span></Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom Area */}
        <div className="mt-16 flex flex-col md:flex-row items-center justify-between gap-8 border-t border-slate-200 pt-10">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[#5a7089] text-sm md:text-base leading-relaxed max-w-3xl"
          >
            Enjoy a well-maintained home with our professional home services. Our tradespeople are highly trained, fully background-checked, and insured, ensuring your peace of mind with every job.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <Link
              to="/categories"
              className="inline-flex items-center gap-2 text-[13px] font-black uppercase tracking-widest text-primary hover:text-[#0A1830] transition-colors"
            >
              View All Services <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default RequestedServices;
