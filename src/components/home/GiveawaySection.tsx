import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Gift, Trophy, MapPin } from "lucide-react";
import { GIVEAWAY_REGIONS } from "../../data/giveaway";

const GiveawaySection = () => {
  return (
    <section className="relative py-[50px] bg-[#E4EAF1] overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#097DDD]/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#0A1830]/5 rounded-full blur-[80px] pointer-events-none" />

      <div className="section-container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-[2.5rem] md:rounded-[3rem] bg-[#050f26] p-10 md:p-14 lg:p-16 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.45)]"
        >
          <div className="absolute top-[-15%] right-[-8%] w-[45%] h-[70%] bg-[#097DDD]/15 blur-[100px] rounded-full pointer-events-none" />
          <div className="absolute bottom-[-20%] left-[-10%] w-[35%] h-[55%] bg-primary/10 blur-[80px] rounded-full pointer-events-none" />

          <div className="relative z-10 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-[#097DDD]/20 border border-[#097DDD]/30 px-4 py-2">
                <Gift className="h-4 w-4 text-[#097DDD]" />
                <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#097DDD]">
                  Loyalty Rewards Giveaway
                </span>
              </div>

              <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white leading-tight">
                Join FREE in 2026.{" "}
                <span className="text-[#097DDD]">Get Rewarded</span> for Staying Local.
              </h2>

              <p className="text-white/60 text-base md:text-lg font-medium leading-relaxed max-w-xl">
                Every business that joins MyLocalPro and remains a paid member for their first 3 months in 2027
                goes into the draw to win one of four major Local Business Rewards Packages — $2,500 cash plus
                free membership until January 2028 in each Tasmanian region.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <Link
                  to="/giveaway"
                  className="inline-flex items-center justify-center gap-2.5 rounded-xl bg-[#097DDD] px-8 py-4 text-[11px] font-black uppercase tracking-[0.2em] text-white shadow-[0_10px_30px_rgba(9,125,221,0.35)] hover:bg-[#0869bb] hover:-translate-y-0.5 transition-all duration-300 group"
                >
                  Full Giveaway Details
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/list-your-business"
                  className="inline-flex items-center justify-center gap-2.5 rounded-xl border border-white/20 bg-white/5 px-8 py-4 text-[11px] font-black uppercase tracking-[0.2em] text-white hover:bg-white/10 hover:-translate-y-0.5 transition-all duration-300"
                >
                  List Your Business
                </Link>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <Trophy className="h-5 w-5 text-amber-400" />
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-white/50">
                  4 Major Winners — One Per Region
                </p>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                {GIVEAWAY_REGIONS.map((region, idx) => (
                  <motion.div
                    key={region.name}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.08 }}
                    className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm"
                  >
                    <div className="flex items-start gap-2 mb-3">
                      <MapPin className="h-4 w-4 text-[#097DDD] shrink-0 mt-0.5" />
                      <p className="text-sm font-black text-white">{region.name}</p>
                    </div>
                    <p className="text-lg font-black text-[#097DDD]">{region.cash} cash</p>
                    <p className="text-[11px] text-white/45 font-medium mt-1 leading-snug">
                      + Free membership until Jan 2028
                    </p>
                  </motion.div>
                ))}
              </div>
              <p className="text-[11px] text-white/35 font-medium pt-1">
                Strictly limited spots — 10 businesses per category, per location. Join early.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default GiveawaySection;
