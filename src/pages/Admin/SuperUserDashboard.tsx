/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Briefcase, LogOut,
  AlertCircle,
  DollarSign,
  ShieldCheck, Search
} from 'lucide-react';
import UserProfileSection from './sections/user/UserProfileSection';
import UserSecuritySection from './sections/user/UserSecuritySection';
// import UserJobSection from './sections/user/UserJobSection';
import logo from '../../assets/WhatsApp_Image_2026-05-14_at_11.37.20_AM__1_-removebg-preview.png';
import axiosClient from '../../api/axios';
import LoadingScreen from '../../components/common/LoadingScreen';

// Premium Modal Component with Glassmorphism
const Modal = ({ isOpen, onClose, onConfirm, title, message, confirmText, type = 'danger' }: any) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-[#050f26]/80 backdrop-blur-md"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white border border-slate-200 rounded-[3rem] p-10 max-w-sm w-full shadow-2xl text-center relative z-10"
      >
        <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-8 ${type === 'danger' ? 'bg-red-50/80 text-red-500' : 'bg-[#097DDD]/10 text-[#097DDD]'}`}>
          <AlertCircle size={32} />
        </div>
        <h3 className="text-xl font-black text-slate-900 mb-3">{title}</h3>
        <p className="text-slate-400 mb-10 leading-relaxed text-[13px] font-medium">{message}</p>
        <div className="flex flex-col gap-3">
          <button
            onClick={onConfirm}
            className={`w-full py-4 rounded-2xl font-black text-white shadow-lg transition-all uppercase tracking-widest text-[9px] ${type === 'danger' ? 'bg-red-500 hover:bg-red-600 shadow-red-500/20' : 'bg-[#097DDD] hover:bg-[#0869bb] shadow-[#097DDD]/20'}`}
          >
            {confirmText}
          </button>
          <button onClick={onClose} className="w-full py-4 rounded-2xl font-black text-slate-400 hover:text-slate-600 transition-colors uppercase tracking-widest text-[9px]">
            Cancel
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const SuperUserDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('profile');
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isBecomeTradieModalOpen, setIsBecomeTradieModalOpen] = useState(false);
  // const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Sync tab with navigation state
  useEffect(() => {
    if (location.state && (location.state as any).activeTab) {
      setActiveTab((location.state as any).activeTab);
    }
  }, [location.state]);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userRole');
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    navigate('/login');
  };

  const handleBecomeTradie = () => {
    navigate('/join-now');
  };

  /*
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  */

  const [userData, setUserData] = useState<any>({
    name: localStorage.getItem('userName') || "",
    email: localStorage.getItem('userEmail') || "",
    phone: "",
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(localStorage.getItem('userName') || "User")}&background=097DDD&color=fff`,
    location: ""
  });
  const [isLoading, setIsLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const response = await axiosClient.get('/api/users/profile');
      const user = response.data;
      setUserData({
        name: user.name || `${user.firstName} ${user.lastName}`,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone || "",
        avatar: user.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || user.firstName)}&background=097DDD&color=fff`,
        location: `${user.city ? user.city + ', ' : ''}${user.state || ''}`
      });
    } catch (error) {
      console.error("Failed to fetch profile", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (isLoading) return <LoadingScreen />;

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden">
      {/* Sidebar - Matching Admin Design */}
      <aside className="w-[280px] bg-[#0D1F43] flex flex-col relative z-50">
        <div className="p-8 mb-4">
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <img src={logo} className="h-8 w-auto brightness-200" alt="Logo" />
            <div className="flex flex-col">
              <span className="text-white text-[10px] font-black tracking-[0.2em] uppercase leading-none">MyLocalPro</span>
              <span className="text-primary text-[8px] font-black tracking-[0.3em] uppercase">User Command</span>
            </div>
          </Link>
        </div>

        <nav className="flex-grow px-4 space-y-1">
          <p className="px-6 text-[8px] font-black text-white/20 uppercase tracking-[0.3em] mb-4">Account Overview</p>
          {[
            { id: 'profile', name: 'Identity Profile', icon: User },
            { id: 'account', name: 'Security Center', icon: ShieldCheck },
            // { id: 'jobpost', name: 'Job Command', icon: LayoutDashboard },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-6 py-3.5 rounded-2xl transition-all group relative ${activeTab === item.id
                ? 'bg-gradient-to-r from-primary to-blue-600 text-white shadow-lg shadow-primary/30'
                : 'text-white/40 hover:bg-white/5 hover:text-white'
                }`}
            >
              <div className="flex items-center gap-4">
                <item.icon size={20} strokeWidth={activeTab === item.id ? 2.5 : 2} />
                <span className="text-[13px] font-bold tracking-tight">{item.name}</span>
              </div>
            </button>
          ))}

          <div className="pt-4 mt-4 border-t border-white/5">
            <button
              onClick={() => setIsBecomeTradieModalOpen(true)}
              className="w-full flex items-center gap-4 px-6 py-3.5 text-white/40 hover:bg-white/5 hover:text-white rounded-2xl transition-all"
            >
              <Briefcase size={20} />
              <span className="text-[13px] font-bold tracking-tight">Become a Tradie</span>
            </button>
          </div>
        </nav>

        <div className="p-8 border-t border-white/5 mt-auto">
          <button
            onClick={() => setIsLogoutModalOpen(true)}
            className="w-full flex items-center gap-4 px-6 py-4 text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all font-black uppercase tracking-widest text-[10px]"
          >
            <LogOut size={18} />
            Logout Session
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-grow overflow-y-auto custom-scrollbar">
        {/* Top Header - Matching Admin Design */}
        <header className="h-20 bg-white border-b border-slate-100 px-12 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-5 py-2.5 w-full max-w-xl group focus-within:border-primary/30 transition-all">
            <Search className="text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
            <input
              type="text"
              placeholder="Search your jobs, services or profile..."
              className="bg-transparent border-none focus:ring-0 text-sm font-medium ml-4 w-full text-slate-600 placeholder:text-slate-400"
            />
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4 border-l border-slate-100 pl-6 ml-2">
              <div className="text-right">
                <p className="text-[11px] font-black text-slate-900 uppercase tracking-tight">{userData.name}</p>
                <p className="text-[9px] text-primary font-black uppercase tracking-widest">User Profile</p>
              </div>
              <img src={userData.avatar} className="w-10 h-10 rounded-xl object-cover border-2 border-slate-100" alt="Avatar" />
            </div>
          </div>
        </header>

        <div className="p-12 lg:p-14 max-w-7xl mx-auto">
          {/* Dashboard Header - Matching Admin Design */}
          <div className="mb-12">
            <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-2">Session Active</p>
            <h1 className="text-3xl font-black text-[#0D1F43] tracking-tight mb-2">User Command Center</h1>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Manage your profile, security and platform interactions</p>
          </div>

          {/* Payment & Promotion Notice Banner */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#0D1F43] rounded-[2.5rem] p-8 text-white mb-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl relative overflow-hidden border border-white/5"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#097DDD]/20 blur-[100px] rounded-full -mr-32 -mt-32" />
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
              <div className="h-20 w-20 rounded-3xl bg-white/5 flex items-center justify-center text-[#097DDD] shrink-0 border border-white/10 shadow-inner">
                <DollarSign size={36} strokeWidth={2.5} />
              </div>
              <div>
                <h3 className="text-2xl font-black mb-2 tracking-tight">2026 Free Access Period</h3>
                <p className="text-white/50 text-sm font-medium leading-relaxed max-w-xl">
                  Welcome to the network! Our platform is 100% free for all approved businesses until <span className="text-white font-bold underline decoration-primary underline-offset-4">31 December 2026</span>. Automated paid subscriptions will only commence from 1 January 2027.
                </p>
              </div>
            </div>
            <div className="relative z-10 bg-white/5 backdrop-blur-xl rounded-[2rem] p-8 border border-white/10 text-center min-w-[200px] shadow-2xl">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#097DDD] mb-2">Billing Starts</p>
              <p className="text-2xl font-black">Jan 01, 2027</p>
              <div className="mt-4 pt-4 border-t border-white/5">
                <span className="text-[9px] font-bold text-white/30 uppercase tracking-widest">Zero Charges Today</span>
              </div>
            </div>
          </motion.div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'profile' && <UserProfileSection userData={userData} onUpdate={fetchProfile} />}
              {activeTab === 'account' && <UserSecuritySection />}
              {/* {activeTab === 'jobpost' && <UserJobSection selectedImage={selectedImage} onImageChange={handleImageChange} />} */}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Modals */}
      <AnimatePresence>
        {isLogoutModalOpen && (
          <Modal
            isOpen={isLogoutModalOpen}
            onClose={() => setIsLogoutModalOpen(false)}
            onConfirm={handleLogout}
            title="Terminate Session"
            message="Are you sure you want to end your current session? You will need to re-authenticate to access your command center."
            confirmText="Yes, Terminate"
            type="danger"
          />
        )}
        {isBecomeTradieModalOpen && (
          <Modal
            isOpen={isBecomeTradieModalOpen}
            onClose={() => setIsBecomeTradieModalOpen(false)}
            onConfirm={handleBecomeTradie}
            title="Switch Persona"
            message="Transitioning to a Tradie profile requires session termination. You will be redirected to the professional registration portal."
            confirmText="Switch to Tradie"
            type="warning"
          />
        )}
      </AnimatePresence>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #E2E8F0;
          border-radius: 20px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #CBD5E1;
        }
      `}</style>
    </div>
  );
};

export default SuperUserDashboard;
