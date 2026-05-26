/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { User, ShieldCheck, Briefcase, LogOut, CheckCircle, HardHat, Menu, X, ChevronLeft, ChevronRight } from 'lucide-react';
import logo from '../../assets/WhatsApp_Image_2026-05-14_at_11.37.20_AM__1_-removebg-preview.png';
import UserProfileSection from '../Admin/sections/user/UserProfileSection';
import UserSecuritySection from '../Admin/sections/user/UserSecuritySection';
import axiosClient from '../../api/axios';
import LoadingScreen from '../../components/common/LoadingScreen';
import { NotificationBell } from '../../components/common/NotificationBell';
import { BecomeTradieModal } from '../../components/common/index.ts';
import DashboardProfileChip from '../../components/common/DashboardProfileChip';
import { getProfile } from '../../api/userApi';
import { resolveAvatarUrl, syncProfileCache } from '../../utils/profileUtils';

// ── Logout Modal ──────────────────────────────────────────────────────────────
const LogoutModal = ({ onClose, onConfirm }: { onClose: () => void; onConfirm: () => void }) => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-[#050f26]/80 backdrop-blur-md" />
    <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} className="bg-white border border-slate-200 rounded-[3rem] p-10 max-w-sm w-full shadow-2xl text-center relative z-10">
      <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-8 bg-red-50/80 text-red-500">
        <LogOut size={32} />
      </div>
      <h3 className="text-xl font-black text-slate-900 mb-3">End Session</h3>
      <p className="text-slate-400 mb-10 leading-relaxed text-[13px]">Are you sure you want to sign out?</p>
      <div className="flex flex-col gap-3">
        <button onClick={onConfirm} className="w-full py-4 rounded-2xl font-black text-white bg-[#097DDD] shadow-lg shadow-[#097DDD]/20 uppercase tracking-widest text-[9px]">Yes, Sign Out</button>
        <button onClick={onClose} className="w-full py-4 rounded-2xl font-black text-slate-500 hover:text-slate-700 transition-colors uppercase tracking-widest text-[9px]">Cancel</button>
      </div>
    </motion.div>
  </div>
);

// ── Main Component ────────────────────────────────────────────────────────────
const UserDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('profile');
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isBecomeTradieOpen, setIsBecomeTradieOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState({
    name: 'Member',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    avatar: '',
    location: '',
    roleLabel: 'Member Account',
  });
  const [savedStats, setSavedStats] = useState({
    totalSaved: 0,
    savedBusinessesPreview: [] as Array<{ _id?: string; businessName: string; category: string; location: string; status: string; }>
  });

  useEffect(() => {
    if (location.state && (location.state as any).activeTab) {
      setActiveTab((location.state as any).activeTab);
    }
  }, [location.state]);

  const fetchUserData = async () => {
    try {
      const user = await getProfile();
      const displayName =
        `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Member';
      const avatar = resolveAvatarUrl(displayName, user.profileImage);
      syncProfileCache({ name: displayName, profileImage: user.profileImage || '' });
      setUserData({
        name: displayName,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email || '',
        phone: user.phone || '',
        avatar,
        location: `${user.city ? user.city + ', ' : ''}${user.state || ''}`.trim().replace(/, $/, ''),
        roleLabel: 'Member Account',
      });
    } catch (error) {
      console.error('Failed to fetch profile', error);
    }
  };

  const fetchSavedStats = async () => {
    try {
      const response = await axiosClient.get('/api/stats/user');
      setSavedStats(response.data);
    } catch (error) {
      console.error('Failed to fetch saved business stats', error);
    }
  };

  useEffect(() => {
    const fetchAll = async () => {
      setIsLoading(true);
      await Promise.all([fetchUserData(), fetchSavedStats()]);
      setIsLoading(false);
    };
    fetchAll();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userRole');
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    navigate('/login');
  };

  const tabs = [
    { id: 'profile', name: 'Identity Profile', icon: User },
    { id: 'saved', name: 'Saved Businesses', icon: Briefcase },
    { id: 'security', name: 'Security Center', icon: ShieldCheck },
  ];

  const renderSavedBusinesses = () => {
    if (savedStats.savedBusinessesPreview.length === 0) {
      return (
        <div className="rounded-[2rem] border border-slate-200 bg-white p-10 text-center shadow-sm">
          <div className="mx-auto mb-6 w-16 h-16 rounded-3xl bg-[#097DDD]/10 text-[#097DDD] grid place-items-center">
            <CheckCircle size={28} />
          </div>
          <h3 className="text-xl font-black text-slate-900 mb-4">No saved tradies yet</h3>
          <p className="text-sm text-slate-500 mb-6">Save tradies while browsing to access them quickly from your dashboard.</p>
          <button
            onClick={() => navigate('/find-a-pro')}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#097DDD] px-8 py-4 text-sm font-black uppercase tracking-[0.2em] text-white shadow-lg shadow-[#097DDD]/20 hover:bg-[#0869bb] transition-all"
          >
            Find a Tradie
          </button>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {savedStats.savedBusinessesPreview.map((biz: any) => {
          const isOpen = (() => {
            if (!biz.openingHours) return null;
            const now = new Date();
            const dayIndex = now.getDay();
            const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
            const dayKey = days[dayIndex];
            const dayHours = biz.openingHours[dayKey];
            
            if (!dayHours || dayHours.closed) return false;
            
            const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
            return currentTime >= dayHours.open && currentTime <= dayHours.close;
          })();

          return (
            <div key={biz._id || biz.businessName} className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between gap-4 mb-4">
                <div>
                  <h3 className="text-xl font-black text-slate-900">{biz.businessName}</h3>
                  <p className="text-xs uppercase tracking-[0.2em] font-black text-[#097DDD] mt-1">{biz.category}</p>
                </div>
                <span className={`text-[10px] font-black uppercase tracking-[0.25em] px-3 py-2 rounded-full ${biz.status === 'approved' ? 'bg-emerald-500 text-white' : biz.status === 'pending' ? 'bg-amber-500 text-white' : 'bg-rose-500 text-white'}`}>
                  {biz.status}
                </span>
              </div>
              <p className="text-sm text-slate-500 mb-2">{biz.location}</p>
              {isOpen !== null && (
                <p className={`text-xs font-black uppercase tracking-wider mb-4 flex items-center gap-1.5 ${isOpen ? 'text-emerald-600' : 'text-rose-600'}`}>
                  <span className={`inline-block w-2 h-2 rounded-full ${isOpen ? 'bg-emerald-600' : 'bg-rose-600'}`}></span>
                  {isOpen ? 'Open Now' : 'Closed'}
                </p>
              )}
              <button
                onClick={() => navigate(`/business/${biz._id}`)}
                className="inline-flex items-center gap-2 rounded-2xl bg-[#097DDD] px-5 py-3 text-xs font-black uppercase tracking-[0.2em] text-white shadow-sm hover:bg-[#0869bb] transition-all"
              >
                View Business
              </button>
            </div>
          );
        })}
      </div>
    );
  };

  if (isLoading) return <LoadingScreen />;

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden">
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobileSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileSidebarOpen(false)}
            className="fixed inset-0 bg-[#050f26]/80 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside 
        className={`bg-[#0D1F43] flex flex-col fixed inset-y-0 left-0 z-50 transform transition-all duration-300 lg:relative lg:translate-x-0 ${
          isMobileSidebarOpen ? 'translate-x-0 w-[280px]' : '-translate-x-full lg:w-auto'
        } ${isSidebarCollapsed && !isMobileSidebarOpen ? 'lg:w-[88px]' : 'lg:w-[280px]'}`}
      >
        <div className="p-8 mb-4 flex items-center justify-between">
          <Link to="/" className={`flex items-center gap-3 hover:opacity-80 transition-opacity ${isSidebarCollapsed && !isMobileSidebarOpen ? 'justify-center w-full' : ''}`}>
            <img src={logo} className="h-8 w-auto brightness-200" alt="Logo" />
            {(!isSidebarCollapsed || isMobileSidebarOpen) && (
              <div className="flex flex-col">
                <span className="text-white text-[10px] font-black tracking-[0.2em] uppercase leading-none">MyLocalPro</span>
                <span className="text-[#097DDD] text-[8px] font-black tracking-[0.3em] uppercase">User Command</span>
              </div>
            )}
          </Link>
          <button 
            className="lg:hidden text-white/50 hover:text-white p-2 -mr-4"
            onClick={() => setIsMobileSidebarOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-grow px-4 space-y-1">
          {(!isSidebarCollapsed || isMobileSidebarOpen) && (
            <p className="px-6 text-[8px] font-black text-white/20 uppercase tracking-[0.3em] mb-4">Account Overview</p>
          )}
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setIsMobileSidebarOpen(false); }}
                title={isSidebarCollapsed && !isMobileSidebarOpen ? tab.name : undefined}
                className={`w-full flex items-center ${isSidebarCollapsed && !isMobileSidebarOpen ? 'justify-center' : 'gap-4'} px-6 py-3.5 rounded-2xl transition-all group relative ${isActive
                  ? 'bg-gradient-to-r from-[#097DDD] to-blue-600 text-white shadow-lg shadow-[#097DDD]/30'
                  : 'text-white/40 hover:bg-white/5 hover:text-white'
                }`}
              >
                <tab.icon size={20} strokeWidth={isActive ? 2.5 : 2} className={isSidebarCollapsed && !isMobileSidebarOpen ? 'mx-auto' : ''} />
                {(!isSidebarCollapsed || isMobileSidebarOpen) && (
                  <span className="text-[13px] font-bold tracking-tight whitespace-nowrap">{tab.name}</span>
                )}
              </button>
            );
          })}

          {/* Become a Tradie */}
          <div className="pt-4 mt-4 border-t border-white/5">
            <button
              onClick={() => { setIsBecomeTradieOpen(true); setIsMobileSidebarOpen(false); }}
              title={isSidebarCollapsed && !isMobileSidebarOpen ? 'Become a Tradie' : undefined}
              className={`w-full flex items-center ${isSidebarCollapsed && !isMobileSidebarOpen ? 'justify-center' : 'gap-4'} px-6 py-3.5 text-[#097DDD]/70 hover:bg-[#097DDD]/10 hover:text-[#097DDD] rounded-2xl transition-all group`}
            >
              <HardHat size={20} strokeWidth={2} className={isSidebarCollapsed && !isMobileSidebarOpen ? 'mx-auto' : ''} />
              {(!isSidebarCollapsed || isMobileSidebarOpen) && (
                <span className="text-[13px] font-bold tracking-tight whitespace-nowrap">Become a Tradie</span>
              )}
            </button>
          </div>
        </nav>

        <div className="p-8 border-t border-white/5 mt-auto flex flex-col gap-4">
          <button
            onClick={() => setIsLogoutModalOpen(true)}
            title={isSidebarCollapsed && !isMobileSidebarOpen ? 'Logout' : undefined}
            className={`w-full flex items-center ${isSidebarCollapsed && !isMobileSidebarOpen ? 'justify-center' : 'gap-4'} px-6 py-4 text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all font-black uppercase tracking-widest text-[10px]`}
          >
            <LogOut size={18} className={isSidebarCollapsed && !isMobileSidebarOpen ? 'mx-auto' : ''} />
            {(!isSidebarCollapsed || isMobileSidebarOpen) && (
              <span className="whitespace-nowrap">Logout Session</span>
            )}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow overflow-y-auto custom-scrollbar relative">
        {/* Header */}
        <header className="h-20 bg-white border-b border-slate-100 px-6 lg:px-12 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button 
              className="lg:hidden text-slate-400 hover:text-slate-800 transition-colors p-2"
              onClick={() => setIsMobileSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>
            <button 
              className="hidden lg:flex text-slate-400 hover:text-slate-800 transition-colors p-2 bg-slate-50 hover:bg-slate-100 rounded-lg"
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              title="Toggle Sidebar"
            >
              {isSidebarCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            </button>
          </div>
          <div className="flex items-center gap-6">
            <NotificationBell theme="light" />
            <DashboardProfileChip
              name={userData.name}
              avatar={userData.avatar}
              subtitle="Member Profile"
              onGoToProfile={() => setActiveTab('profile')}
              onGoToSecurity={() => setActiveTab('security')}
            />
          </div>
        </header>

        <div className="p-6 sm:p-8 lg:p-14 max-w-7xl mx-auto">
          <div className="mb-12">
            <p className="text-[10px] font-black text-[#097DDD] uppercase tracking-[0.3em] mb-2">Session Active</p>
            <h1 className="text-3xl font-black text-[#0D1F43] tracking-tight mb-2">Member Control Center</h1>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Manage your profile, security settings, and saved tradies.</p>
          </div>

          {/* Stats Banner */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#0D1F43] rounded-[2.5rem] p-8 text-white mb-12 overflow-hidden border border-white/5 shadow-2xl"
          >
            <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr] items-center">
              <div>
                <h3 className="text-2xl font-black mb-3 tracking-tight">Saved Tradies at a Glance</h3>
                <p className="text-sm text-white/70 leading-relaxed">Keep your top tradies ready for fast booking and manage your account from one place.</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-[2rem] bg-white/10 p-6">
                  <p className="text-[10px] uppercase tracking-[0.3em] text-white/60 mb-2">Saved Tradies</p>
                  <p className="text-3xl font-black">{savedStats.totalSaved}</p>
                </div>
                <div className="rounded-[2rem] bg-white/10 p-6">
                  <p className="text-[10px] uppercase tracking-[0.3em] text-white/60 mb-2">Profile Status</p>
                  <p className="text-3xl font-black">{userData.email ? 'Active' : 'Pending'}</p>
                </div>
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
              {activeTab === 'profile' && <UserProfileSection userData={userData} onUpdate={fetchUserData} />}
              {activeTab === 'saved' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
                  <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                      <div>
                        <h3 className="text-2xl font-black text-slate-900">Saved Tradies</h3>
                        <p className="text-sm text-slate-500">A quick view of your favourites for faster booking.</p>
                      </div>
                      <button
                        onClick={() => navigate('/find-a-pro')}
                        className="inline-flex items-center gap-2 rounded-2xl bg-[#097DDD] px-6 py-3 text-xs font-black uppercase tracking-[0.2em] text-white shadow-lg shadow-[#097DDD]/20 hover:bg-[#0869bb] transition-all"
                      >
                        Find More Tradies
                      </button>
                    </div>
                    {renderSavedBusinesses()}
                  </div>
                </motion.div>
              )}
              {activeTab === 'security' && <UserSecuritySection />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Modals */}
      <AnimatePresence>
        {isLogoutModalOpen && <LogoutModal onClose={() => setIsLogoutModalOpen(false)} onConfirm={handleLogout} />}
        {isBecomeTradieOpen && <BecomeTradieModal onClose={() => setIsBecomeTradieOpen(false)} />}
      </AnimatePresence>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 20px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #CBD5E1; }
      `}</style>
    </div>
  );
};

export default UserDashboard;