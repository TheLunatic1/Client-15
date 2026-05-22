import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { ListBusinessHero, ListBusinessFormSection } from '../../components/list-your-business';
import { BecomeTradieModal } from '../../components/common/index.ts';

export default function ListYourBusinessPage() {
  const navigate = useNavigate();
  const [showBecomeTradieModal, setShowBecomeTradieModal] = useState(false);
  const [isRegularUser, setIsRegularUser] = useState(false);

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
          <BecomeTradieModal onClose={dismissTradieModal} />
        )}
      </AnimatePresence>
    </>
  );
}
