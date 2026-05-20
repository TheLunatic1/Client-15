import { motion } from "framer-motion";
import { MapPin, Search, CheckCircle2 } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Enter your location and find skilled experts near you.",
    description: "Simply type your suburb or city and we'll show you verified local professionals ready to help.",
    icon: <MapPin className="h-7 w-7 text-white" />,
    iconBg: "bg-[#097DDD]",
    cardBg: "bg-white",
    accentColor: "#097DDD",
  },
  {
    number: "02",
    title: "Browse verified profiles, read reviews, and compare options.",
    description: "Every pro is verified. Read real customer reviews and compare quotes to make the right choice.",
    icon: <Search className="h-7 w-7 text-white" />,
    iconBg: "bg-[#0A1830]",
    cardBg: "bg-[#E4EAF1]",
    accentColor: "#0A1830",
    offset: "md:mt-12",
  },
  {
    number: "03",
    title: "Connect directly and get the job done with confidence.",
    description: "Contact your chosen pro directly — no middlemen, no hidden fees. Just results.",
    icon: <CheckCircle2 className="h-7 w-7 text-white" />,
    iconBg: "bg-[#097DDD]",
    cardBg: "bg-white",
    accentColor: "#097DDD",
  },
];

const HowItWorks = () => {
  return (
    <section className="relative py-[30px] bg-[#E4EAF1] overflow-hidden">
      {/* Decorative top wave */}
      <div className="absolute top-0 left-0 right-0 -mt-1 z-0 pointer-events-none">
        <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full rotate-180">
          <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" fill="#ffffff" />
        </svg>
      </div>

      {/* Background grid dots */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: "radial-gradient(circle, #3b82f6 1px, transparent 1px)",
          backgroundSize: "36px 36px",
        }}
      />

      <div className="section-container relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-primary font-bold text-xs tracking-widest uppercase mb-5 block w-fit mx-auto"
          >
            Simple Process
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-5xl font-black text-[#0A1830] mb-5"
          >
            How It{" "}
            <span className="text-primary">Works</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.18 }}
            className="text-[#5a7089] text-sm md:text-base leading-relaxed"
          >
            MyLocalPro connects customers with trusted local trades across Australia —
            making it simple to find, book, and hire the right pro for any job.
          </motion.p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 relative">
          {/* Connecting dashed line (desktop) */}
          <div className="hidden md:block absolute top-16 left-[16.7%] right-[16.7%] h-[2px] pointer-events-none">
            <svg width="100%" height="2" xmlns="http://www.w3.org/2000/svg">
              <line
                x1="0" y1="1" x2="100%" y2="1"
                stroke="#3b82f6"
                strokeWidth="2"
                strokeDasharray="8 8"
                strokeLinecap="round"
              />
            </svg>
          </div>

          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.18 }}
              className={`${step.offset || ''}`}
            >
              <div
                className={`group relative ${step.cardBg} rounded-3xl p-8 border border-[#cdd6e3] shadow-[0_2px_24px_rgb(10,24,48,0.07)] hover:shadow-[0_8px_40px_rgb(10,24,48,0.13)] hover:-translate-y-2 transition-all duration-400 cursor-default overflow-hidden`}
              >
                {/* Step number watermark */}
                <span
                  className="absolute top-4 right-6 text-6xl font-black opacity-[0.05] select-none"
                  style={{ color: step.accentColor }}
                >
                  {step.number}
                </span>

                {/* Icon */}
                <div className={`mb-6 inline-flex h-14 w-14 rounded-2xl ${step.iconBg} items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  {step.icon}
                </div>

                {/* Step badge */}
                <div
                  className="mb-3 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.2em]"
                  style={{ background: `${step.accentColor}18`, color: step.accentColor }}
                >
                  Step {step.number}
                </div>

                <h3 className="text-[15px] font-bold text-[#0A1830] leading-snug mb-3">
                  {step.title}
                </h3>
                <p className="text-sm text-[#5a7089] leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Decorative bottom wave */}
      <div className="absolute bottom-0 left-0 right-0 -mb-1">
        <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path d="M0,40 C360,0 1080,80 1440,40 L1440,80 L0,80 Z" fill="white" />
        </svg>
      </div>
    </section>
  );
};

export default HowItWorks;
