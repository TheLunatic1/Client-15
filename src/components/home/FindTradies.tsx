import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle2, ArrowRight } from "lucide-react";
import tradieImg from "../../assets/section images/tradie-3.png";

const reasons = [
  "Verify tradie licenses and insurances.",
  "Browse photos of their previous work.",
  "Check ABN and other business details for peace of mind.",
];

const FindTradies = () => {
  return (
    <section className="py-[30px] bg-white overflow-hidden">
      <div className="section-container">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-20">

          {/* ── Left Content ── */}
          <div className="flex-1 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              <h2 className="text-3xl md:text-5xl font-black text-[#0A1830] leading-tight">
                Are You Looking for <br />
                <span className="text-[#0A1830]">Professional Tradies</span>{" "}
                <span className="text-primary">Near You?</span>
              </h2>
              <p className="text-[#5a7089] text-base md:text-lg leading-relaxed max-w-xl">
                Finding skilled and MyLocalPros in Australia has been simpler with the MyLocalPro Network. If you need to hire a tradie for a quick fix or a major project, we've got you covered.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="space-y-5"
            >
              <h3 className="text-2xl md:text-3xl font-black text-[#0A1830]">
                Why Choose us?
              </h3>

              <ul className="space-y-4">
                {reasons.map((reason, idx) => (
                  <motion.li
                    key={idx}
                    initial={{ opacity: 0, x: -16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.15 + idx * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-[#5a7089] text-base leading-relaxed">{reason}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              <Link
                to="/find-a-pro"
                className="inline-flex items-center gap-2.5 rounded-xl bg-primary px-8 py-4 text-[11px] font-black uppercase tracking-[0.18em] text-white shadow-[0_8px_32px_rgb(59,130,246,0.35)] hover:shadow-[0_12px_40px_rgb(59,130,246,0.5)] hover:bg-primary/90 hover:-translate-y-1 transition-all duration-300 group"
              >
                Find Tradies
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </div>

          {/* ── Right Image ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, x: 30 }}
            whileInView={{ opacity: 1, scale: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="flex-1 relative w-full max-w-xl"
          >
            {/* Blue accent blob behind image */}
            <div className="absolute -bottom-6 -right-6 w-full h-full rounded-[2.5rem] bg-primary/5 -z-10" />

            <div className="relative rounded-[2.5rem] overflow-hidden shadow-[0_20px_60px_rgb(10,24,48,0.14)] border border-slate-100">
              <img
                src={tradieImg}
                alt="Professional tradie working"
                className="w-full h-[420px] md:h-[500px] object-cover hover:scale-105 transition-transform duration-700"
              />
              {/* Subtle dark gradient on bottom */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A1830]/20 to-transparent" />
            </div>

            {/* Floating trust badge */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="absolute -bottom-5 -left-5 bg-white rounded-2xl shadow-xl border border-slate-100 p-4 flex items-center gap-3 z-10"
            >
              <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-xs font-black text-[#0A1830] uppercase tracking-widest">Verified</p>
                <p className="text-[11px] text-slate-500 font-semibold">All Professionals</p>
              </div>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default FindTradies;
