import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Briefcase } from "lucide-react";
import tradie1Img from "../../assets/section images/tradie-1.png";
import tradie2Img from "../../assets/section images/tradie-2.png";

const SkilledTradieCTA = () => {
  return (
    <section className="relative py-[50px] bg-white overflow-hidden">
      {/* Glow blobs */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/3 rounded-full blur-[100px] pointer-events-none" />

      {/* Dot grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: "radial-gradient(circle, #0A1830 1.5px, transparent 1.5px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="section-container relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-16 lg:gap-10">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex-1 max-w-xl space-y-6"
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#0A1830] leading-tight">
              Are You a Skilled <br />
              <span className="text-primary">Tradie?</span>
            </h2>
            <div className="space-y-4">
              <p className="text-[#5a7089] text-base md:text-lg leading-relaxed font-medium">
                Join MyLocalPro - a brand-new Australian
                owned and operated platform built to connect
                local businesses with customers actively
                searching for services in their area.

              </p>
              <p className="text-[#5a7089] text-base md:text-lg leading-relaxed font-medium">
                Whether you're an electrician, plumber, builder,
                painter, cleaner, landscaper, photographer,
                tiler, mechanic or other service provider,
                MyLocalPro helps put your business in front
                of local people looking for exactly what you offer.
              </p>
            </div>

            <div className="pt-4">
              <Link
                to="/list-business"
                className="inline-flex items-center justify-center gap-2.5 rounded-xl bg-primary px-10 py-5 text-[12px] font-black uppercase tracking-[0.2em] text-white shadow-[0_10px_40px_rgb(59,130,246,0.45)] hover:shadow-[0_15px_50px_rgb(59,130,246,0.6)] hover:bg-primary/90 hover:-translate-y-1 transition-all duration-300 group"
              >
                <Briefcase className="h-4 w-4" />
                List Your Business
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>

          {/* Right Overlapping Images */}
          <div className="flex-1 relative w-full h-[350px] sm:h-[450px] lg:h-[550px] max-w-lg mx-auto lg:ml-auto lg:mr-0">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, rotate: -5 }}
              whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="absolute top-0 left-0 w-[65%] h-[65%] rounded-[2.5rem] overflow-hidden border-[8px] border-white shadow-2xl z-10 bg-white"
            >
              <img
                src={tradie1Img}
                alt="Tradie working"
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-1000"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9, rotate: 5 }}
              whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
              className="absolute bottom-0 right-0 w-[70%] h-[70%] rounded-[2.5rem] overflow-hidden border-[8px] border-white shadow-2xl z-20 bg-white"
            >
              <img
                src={tradie2Img}
                alt="Tradie construction"
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-1000"
              />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SkilledTradieCTA;
