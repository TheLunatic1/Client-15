import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HardHat, X, AlertCircle } from 'lucide-react';
import { logout } from '../../utils/authUtils';

interface BecomeTradieModalProps {
  onClose: () => void;
}

const BecomeTradieModal = ({ onClose }: BecomeTradieModalProps) => {
  const navigate = useNavigate();

  const handleConfirm = () => {
    logout();
    onClose();
    navigate('/join-now?type=tradie');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-[#050f26]/80 backdrop-blur-md cursor-pointer"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 24 }}
        className="relative z-10 bg-white rounded-[3rem] p-10 max-w-md w-full shadow-2xl text-center"
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-xl text-slate-300 hover:text-slate-500 hover:bg-slate-50 transition-all"
          aria-label="Close"
        >
          <X size={20} />
        </button>

        <div className="w-20 h-20 rounded-[2rem] bg-[#097DDD]/10 text-[#097DDD] flex items-center justify-center mx-auto mb-8 border border-[#097DDD]/20">
          <HardHat size={36} strokeWidth={1.5} />
        </div>

        <h3 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">Become a Tradie</h3>
        <p className="text-slate-500 text-sm leading-relaxed mb-4 font-medium">
          Want to list your business and connect with local customers?
        </p>
        <div className="bg-amber-50 border border-amber-200 rounded-2xl px-6 py-4 mb-8 text-left">
          <div className="flex items-start gap-3">
            <AlertCircle size={16} className="text-amber-500 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-700 font-bold leading-relaxed">
              You&apos;ll need to create a <strong>separate Tradie account</strong> with a different email
              address. You&apos;ll be logged out and taken directly to the Tradie sign-up page.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={handleConfirm}
            className="w-full py-4 rounded-2xl font-black text-white bg-[#097DDD] hover:bg-[#0869bb] shadow-lg shadow-[#097DDD]/20 uppercase tracking-widest text-[10px] transition-all"
          >
            Log Out & Sign Up as Tradie
          </button>
          <button
            onClick={onClose}
            className="w-full py-4 rounded-2xl font-black text-slate-400 hover:text-slate-600 transition-colors uppercase tracking-widest text-[10px]"
          >
            Maybe Later
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default BecomeTradieModal;
