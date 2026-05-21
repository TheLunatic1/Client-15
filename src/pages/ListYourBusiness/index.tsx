import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { ListBusinessHero, ListBusinessFormSection } from '../../components/list-your-business';
import { BecomeTradieModal } from '../../components/common/index.ts';

export default function ListYourBusinessPage() {
  const [showBecomeTradieModal, setShowBecomeTradieModal] = useState(false);
  const [isRegularUser, setIsRegularUser] = useState(false);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const role = localStorage.getItem('userRole');
    if (isLoggedIn && role === 'user') {
      setIsRegularUser(true);
      setShowBecomeTradieModal(true);
    }
  }, []);

  return (
    <>
      <ListBusinessHero />
      <div className={isRegularUser ? 'pointer-events-none select-none opacity-40' : ''}>
        <ListBusinessFormSection />
      </div>
      <AnimatePresence>
        {showBecomeTradieModal && (
          <BecomeTradieModal onClose={() => setShowBecomeTradieModal(false)} />
        )}
      </AnimatePresence>
    </>
  );
}
