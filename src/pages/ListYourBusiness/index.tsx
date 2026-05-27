import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Briefcase, X } from 'lucide-react';
import { ListBusinessHero, ListBusinessFormSection } from '../../components/list-your-business';
import { BecomeTradieModal } from '../../components/common/index.ts';

import { getMyListings } from '../../api/businessApi';

export default function ListYourBusinessPage() {
  const navigate = useNavigate();
  const [showBecomeTradieModal, setShowBecomeTradieModal] = useState(false);
  const [isRegularUser, setIsRegularUser] = useState(false);
  const [showBusinessExistsModal, setShowBusinessExistsModal] = useState(false);

  const dismissTradieModal = () => {
    setShowBecomeTradieModal(false);
    navigate('/find-a-pro');
  };

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const role = localStorage.getItem('userRole');
    if (isLoggedIn && role === 'user') {
      setIsRegularUser(true);
      setShowBecomeTradieModal(true);
    } else if (isLoggedIn && role === 'tradie') {
      getMyListings().then((listings) => {
        if (listings && listings.length > 0) {
          setShowBusinessExistsModal(true);
        }
      }).catch((err) => console.error(err));
    }
  }, [navigate]);

  return (
    <>
      <ListBusinessHero />
      <div className={isRegularUser || showBusinessExistsModal ? 'pointer-events-none select-none opacity-40' : ''}>
        <ListBusinessFormSection />
      </div>
      <AnimatePresence>
        {showBecomeTradieModal && (
          <BecomeTradieModal onClose={dismissTradieModal} />
        )}
        {showBusinessExistsModal && (
          <BusinessExistsModal onNavigate={() => navigate('/tradie-dashboard', { state: { activeTab: 'my-businesses' } })} />
        )}
      </AnimatePresence>
    </>
  );
}

const BusinessExistsModal = ({ onNavigate }: { onNavigate: () => void }) => {
  const navigate = useNavigate();
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => navigate('/tradie-dashboard')}
        className="absolute inset-0 bg-[#050f26]/80 backdrop-blur-md cursor-pointer"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 24 }}
        className="relative z-10 bg-white rounded-[3rem] p-10 max-w-md w-full shadow-2xl text-center"
      >
        <button
          onClick={() => navigate('/tradie-dashboard')}
          className="absolute top-6 right-6 p-2 rounded-xl text-slate-300 hover:text-slate-500 hover:bg-slate-50 transition-all"
          aria-label="Close"
        >
          <X size={20} />
        </button>

        <div className="w-20 h-20 rounded-[2rem] bg-[#097DDD]/10 text-[#097DDD] flex items-center justify-center mx-auto mb-8 border border-[#097DDD]/20">
          <Briefcase size={36} strokeWidth={1.5} />
        </div>

        <h3 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">Business Already Listed</h3>
        <p className="text-slate-500 text-sm leading-relaxed mb-8 font-medium">
          You already have an active business profile. Please head over to your Manage Business page to view or edit your details.
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={onNavigate}
            className="w-full py-4 rounded-2xl font-black text-white bg-[#097DDD] hover:bg-[#0869bb] shadow-lg shadow-[#097DDD]/20 uppercase tracking-widest text-[10px] transition-all"
          >
            Go to Manage Business
          </button>
        </div>
      </motion.div>
    </div>
  );
};
