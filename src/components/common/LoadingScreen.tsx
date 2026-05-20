import { motion } from 'framer-motion';
import logo from '../../assets/WhatsApp_Image_2026-05-14_at_11.37.20_AM__1_-removebg-preview.png';

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 bg-[#050f26] flex flex-col items-center justify-center z-[9999]">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="mb-8"
      >
        <img 
          src={logo} 
          alt="MyLocalPro" 
          className="h-20 w-auto"
        />
      </motion.div>

      <div className="w-64 h-[3px] bg-white/5 rounded-full overflow-hidden relative">
        <motion.div 
          className="absolute inset-0 bg-[#007fff] shadow-[0_0_15px_rgba(0,127,255,0.6)]"
          initial={{ x: "-100%" }}
          animate={{ x: "100%" }}
          transition={{ 
            duration: 2, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        />
      </div>
      
      {/* Optional subtle glow behind everything */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-primary/10 blur-[100px] rounded-full -z-10" />
    </div>
  );
};

export default LoadingScreen;
