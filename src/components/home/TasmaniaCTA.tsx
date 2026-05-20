import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const MyLocalProCTA = () => {
  return (
    <section className="py-24 bg-white">
      <div className="section-container">
        <div className="relative overflow-hidden rounded-[3.5rem] bg-[#050f26] p-12 md:p-20 shadow-2xl">
          {/* Decorative Elements */}
          <div className="absolute top-[-20%] right-[-10%] w-[40%] h-[80%] bg-primary/10 blur-[100px] rounded-full rotate-45" />
          <div className="absolute bottom-[-20%] left-[-10%] w-[30%] h-[60%] bg-blue-400/5 blur-[80px] rounded-full" />

          <div className="relative z-10 max-w-3xl mx-auto text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-black text-white mb-8 leading-tight"
            >
              Grow your business in <br />
              <span className="text-primary text-5xl md:text-6xl">MyLocalPro</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-white/60 font-medium text-base mb-12 leading-relaxed"
            >
              Join MyLocalPro's premium local services platform. Connect directly with customers searching for businesses like yours across Hobart, Launceston, Devonport, and Burnie.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-6"
            >
              <button className="w-full sm:w-auto bg-[#097DDD] text-white px-10 py-5 rounded-2xl font-black text-[11px] transition-all shadow-[0_10px_25px_rgba(9,125,221,0.3)] hover:shadow-[0_15px_35px_rgba(9,125,221,0.4)] hover:-translate-y-1 uppercase tracking-[0.2em] flex items-center justify-center gap-2">
                Sign up Now
                <ArrowRight size={14} />
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MyLocalProCTA;
