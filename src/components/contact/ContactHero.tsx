import { motion } from "framer-motion";

export const ContactHero = () => {
  return (
    <section className="relative overflow-hidden bg-linear-to-br from-[#0a1628] via-[#0d2044] to-[#091535] pt-[200px] pb-[120px]">
      {/* Dot grid */}
      <div
        className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle,_rgba(228,234,241,0.12)_1px,_transparent_1px)] bg-[length:30px_30px]"
      />
      {/* Blue glow top-right */}
      <div
        className="absolute top-[-40px] right-[-60px] pointer-events-none w-[420px] h-[320px] bg-[radial-gradient(ellipse,_rgba(9,125,221,0.18)_0%,_transparent_70%)] rounded-full"
      />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Label pill */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-block mb-5"
        >
          <span className="text-[9px] font-black uppercase tracking-[0.28em] text-[#6ab4f5] border border-[#6ab4f5]/30 rounded-full px-3.5 py-1 bg-[#097DDD]/10">
            We&rsquo;re here to help
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="font-black leading-tight text-[clamp(2rem,5vw,2.8rem)] text-white mb-2.5"
        >
          Contact <span className="text-[#097DDD]">Us</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.16 }}
          className="text-[#E4EAF1]/55 text-[0.95rem]"
        >
          We&rsquo;re here to help &mdash; usually replying within a few hours.
        </motion.p>
      </div>
    </section>
  );
};
