import { motion } from "framer-motion";

export const FindProHero = () => {
  return (
    <section className="relative overflow-hidden bg-[#050f26] pt-[180px] pb-[100px]">
      {/* Background Gradients to match brand */}
      <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-b from-[#097DDD]/10 to-transparent pointer-events-none" />
      <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-[#097DDD]/15 rounded-full blur-[120px] pointer-events-none" />

      {/* Dot grid - Ensure it covers the whole area */}
      <div
        className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle,_rgba(228,234,241,0.08)_1px,_transparent_1px)] bg-[length:32px_32px]"
      />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-left">
        {/* Label pill */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-block mb-6"
        >
          <div className="flex items-center gap-2.5 px-4 py-2 bg-white/5 backdrop-blur-md rounded-full border border-white/10">
            <div className="w-1.5 h-1.5 rounded-full bg-[#097DDD] animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#097DDD]">
              10+ Verified MyLocalPron Professionals
            </span>
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="font-black leading-[1.1] text-[clamp(2.5rem,6vw,4rem)] text-white mb-6"
        >
          Find Trusted <br />
          <span className="text-[#097DDD]">Local Services</span> in MyLocalPro
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-white/50 text-lg max-w-2xl leading-relaxed font-medium"
        >
          Connecting you with the best independent trade and service professionals across the state.
          Choose a service and your region to get started.
        </motion.p>
      </div>
    </section>
  );
};
