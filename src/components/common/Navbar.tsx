import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Menu, X, ChevronDown, Search, Target, Settings, LogOut, MapPin as MapPinIcon, LayoutDashboard, FileText } from 'lucide-react';
import logo from '../../assets/WhatsApp_Image_2026-05-14_at_11.37.20_AM__1_-removebg-preview.png';
import LoadingScreen from './LoadingScreen';
import { logout } from '../../utils/authUtils';
import { NotificationBell } from './NotificationBell';

const Navbar = () => {
  const navigate = useNavigate();
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const [isAdmin, setIsAdmin] = useState(false);

  const [userName, setUserName] = useState("Erin Barr Qui saepe excepturi");



  // Dynamic User Data based on role
  const userData = isAdmin ? {
    name: "System Admin",
    avatar: "https://ui-avatars.com/api/?name=Admin&background=097DDD&color=fff"
  } : {
    name: userName,
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=097DDD&color=fff`
  };

  useEffect(() => {
    const auth = localStorage.getItem('isLoggedIn');
    const userRole = localStorage.getItem('userRole');
    if (auth === 'true') {
      setIsLoggedIn(true);
    }
    setIsAdmin(userRole === 'admin');

    const storedName = localStorage.getItem('userName');
    if (storedName) {
      setUserName(storedName);
    } else {
      setUserName("Erin Barr Qui saepe excepturi");
    }
  }, [location]);

  const handleLogout = () => {
    setIsLoading(true);
    // Simulate loading/reload animation
    setTimeout(() => {
      logout();
      setIsLoggedIn(false);
      setIsAdmin(false);
      setIsLoading(false);
      navigate('/');
    }, 1000);
  };

  /*
  const handlePostJobClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isLoggedIn) {
      handleDashboardNavigate('jobpost');
    } else {
      navigate('/login');
    }
  };
  */

  const handleDashboardNavigate = (tab: string) => {
    const role = localStorage.getItem('userRole');
    if (role === 'admin') {
      navigate('/admin', { state: { activeTab: tab } });
    } else if (role === 'tradie') {
      navigate('/tradie-dashboard', { state: { activeTab: tab } });
    } else {
      navigate('/user-dashboard', { state: { activeTab: tab } });
    }
    setIsUserDropdownOpen(false);
  };

  const navLinks = [
    { name: 'HOME', path: '/' },
    { name: 'FIND A PRO', path: '/find-a-pro' },
    { name: 'CATEGORIES', path: '/categories' },
    { name: 'LIST YOUR BUSINESS', path: '/list-your-business' },
    // { name: 'POST JOB', path: '#', onClick: handlePostJobClick },
    { name: 'CONTACT', path: '/contact' },
    { name: 'LOGIN', path: '/login' },
  ];

  const regions = [
    'Hobart Region (TAS)',
    'Launceston Region (TAS)',
    'Devonport Region (TAS)',
    'Burnie Region (TAS)',
    'North Brisbane (QLD)',
    'South Brisbane (QLD)',
    'West Brisbane (QLD)',
    'East Brisbane (QLD)',
    'Gold Coast Region (QLD)',
    'Sunshine Coast Region (QLD)'
  ];

  const isDashboard = location.pathname.startsWith('/user-dashboard');

  useEffect(() => {
    const hasSeenLocationModal = localStorage.getItem('hasSeenLocationModal');
    if (!hasSeenLocationModal) {
      const timer = setTimeout(() => {
        setIsLocationOpen(true);
        localStorage.setItem('hasSeenLocationModal', 'true');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <nav className={`absolute top-0 left-0 right-0 z-50 transition-all ${isDashboard ? 'bg-[#050f26] shadow-xl' : 'bg-transparent'}`}>
      {isLoading && <LoadingScreen />}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-24">
          {/* Logo & Location */}
          <div className="flex items-center space-x-6">
            <Link to="/" className="flex items-center">
              <img src={logo} alt="MyLocalPro" className="h-12 w-auto" />
            </Link>

            {/* <button
              onClick={() => setIsLocationOpen(true)}
              className="hidden md:flex items-center space-x-2 px-4 py-2 bg-white/5 backdrop-blur-md rounded-full border border-white/10 text-white/90 hover:bg-white/10 transition-all group"
            >
              <div className="flex items-center space-x-1">
                <MapPinIcon className="w-3 h-3 text-[#097DDD]" />
                <div className="flex flex-col items-start leading-none">
                  <span className="text-[10px] text-white/50 font-bold uppercase tracking-wider">Location</span>
                  <span className="text-xs font-bold">Australia</span>
                </div>
              </div>
              <ChevronDown className="w-4 h-4 text-white/30 group-hover:text-white transition-colors" />
            </button> */}
          </div>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center space-x-8">
            {!isLoggedIn ? (
              <>
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    onClick={(link as any).onClick}
                    className={`text-[13px] font-bold tracking-wider transition-colors hover:text-[#097DDD] ${location.pathname === link.path ? 'text-[#097DDD]' : 'text-white/80'
                      }`}
                  >
                    {link.name}
                  </Link>
                ))}

                <Link
                  to="/join-now"
                  className="bg-[#097DDD] hover:bg-[#0869bb] text-white text-[13px] font-bold px-8 py-3 rounded-xl transition-all shadow-[0_0_20px_rgba(9,125,221,0.3)] hover:shadow-[0_0_30px_rgba(9,125,221,0.5)] uppercase tracking-wider"
                >
                  Join Now
                </Link>
              </>
            ) : (
              <div className="flex items-center space-x-8">
                {/* Regular nav links except login/join */}
                {navLinks.filter(link => link.name !== 'LOGIN').map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    onClick={(link as any).onClick}
                    className={`text-[13px] font-bold tracking-wider transition-colors hover:text-[#097DDD] ${location.pathname === link.path ? 'text-[#097DDD]' : 'text-white/80'
                      }`}
                  >
                    {link.name}
                  </Link>
                ))}

                {/* Notification Bell */}
                <NotificationBell theme="dark" />

                {/* User Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                    className="flex items-center space-x-3 group"
                  >
                    <div className="w-10 h-10 rounded-full border-2 border-white/10 overflow-hidden group-hover:border-[#097DDD] transition-all">
                      <img src={userData.avatar} alt="Avatar" className="w-full h-full object-cover" />
                    </div>
                    <span className="text-sm font-bold text-white group-hover:text-[#097DDD] transition-colors max-w-[150px] truncate">
                      {userData.name}
                    </span>
                    <ChevronDown className={`w-4 h-4 text-white/30 group-hover:text-white transition-transform ${isUserDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {isUserDropdownOpen && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setIsUserDropdownOpen(false)} />
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          className="absolute right-0 mt-4 w-64 bg-[#1a2b4b]/90 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-4 shadow-2xl z-20"
                        >
                          <div className="space-y-1">
                            {isAdmin ? (
                              <>
                                <button 
                                  onClick={() => navigate('/admin')}
                                  className="w-full flex items-center space-x-3 px-6 py-4 rounded-2xl hover:bg-white/5 transition-all group"
                                >
                                  <LayoutDashboard size={18} className="text-white/40 group-hover:text-[#097DDD]" />
                                  <span className="text-sm font-medium text-white/80 group-hover:text-white">Admin Dashboard</span>
                                </button>
                                <button 
                                  onClick={() => handleDashboardNavigate('blogs')}
                                  className="w-full flex items-center space-x-3 px-6 py-4 rounded-2xl hover:bg-white/5 transition-all group"
                                >
                                  <FileText size={18} className="text-white/40 group-hover:text-[#097DDD]" />
                                  <span className="text-sm font-medium text-white/80 group-hover:text-white">Manage Blogs</span>
                                </button>
                              </>
                            ) : (
                              <>
                                <button 
                                  onClick={() => handleDashboardNavigate('profile')}
                                  className="w-full flex items-center space-x-3 px-6 py-4 rounded-2xl hover:bg-white/5 transition-all group"
                                >
                                  <User size={18} className="text-white/40 group-hover:text-[#097DDD]" />
                                  <span className="text-sm font-medium text-white/80 group-hover:text-white">Profile</span>
                                </button>
                                <button 
                                  onClick={() => handleDashboardNavigate('account')}
                                  className="w-full flex items-center space-x-3 px-6 py-4 rounded-2xl hover:bg-white/5 transition-all group"
                                >
                                  <Settings size={18} className="text-white/40 group-hover:text-[#097DDD]" />
                                  <span className="text-sm font-medium text-white/80 group-hover:text-white">Account</span>
                                </button>
                                {/* <button 
                                  onClick={() => handleDashboardNavigate('jobpost')}
                                  className="w-full flex items-center space-x-3 px-6 py-4 rounded-2xl hover:bg-white/5 transition-all group"
                                >
                                  <Briefcase size={18} className="text-white/40 group-hover:text-[#097DDD]" />
                                  <span className="text-sm font-medium text-white/80 group-hover:text-white">Job Post</span>
                                </button> */}
                              </>
                            )}
                            
                            <div className="h-px bg-white/5 my-2 mx-4" />

                            <button 
                              onClick={() => { setIsLocationOpen(true); setIsUserDropdownOpen(false); }}
                              className="w-full flex items-center space-x-3 px-6 py-4 rounded-2xl hover:bg-white/5 transition-all group"
                            >
                              <MapPinIcon size={18} className="text-white/40 group-hover:text-[#097DDD]" />
                              <span className="text-sm font-medium text-white/80 group-hover:text-white">Change Location</span>
                            </button>
                            <button 
                              onClick={handleLogout}
                              className="w-full flex items-center space-x-3 px-6 py-4 rounded-2xl hover:bg-red-500/5 transition-all group"
                            >
                              <LogOut size={18} className="text-red-500/50 group-hover:text-red-400" />
                              <span className="text-sm font-medium text-white/80 group-hover:text-white">Logout</span>
                            </button>
                          </div>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu & Bell Button */}
          <div className="lg:hidden flex items-center space-x-2">
            {isLoggedIn && (
              <NotificationBell theme="dark" />
            )}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-white/80"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="lg:hidden bg-[#0a1120] border-b border-white/10 absolute top-full left-0 right-0"
          >
            <div className="px-4 pt-2 pb-6 space-y-2">
              {navLinks.map((link) => {
                if (isLoggedIn && link.name === 'LOGIN') return null;
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-4 py-3 rounded-xl text-sm font-bold text-white/70 hover:bg-white/5 hover:text-white uppercase tracking-wider"
                  >
                    {link.name}
                  </Link>
                );
              })}
              {!isLoggedIn && (
                <div className="pt-4 px-4">
                  <Link
                    to="/join-now"
                    className="block w-full bg-[#097DDD] text-white text-center font-bold py-4 rounded-xl uppercase tracking-wider"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Join Now
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Location Modal */}
      <AnimatePresence>
        {isLocationOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsLocationOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-2xl bg-[#0a1120] border border-white/10 rounded-[2rem] p-10 shadow-2xl overflow-hidden"
            >
              {/* Background Glow */}
              <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/10 blur-[100px] rounded-full -z-10" />

              <button
                onClick={() => setIsLocationOpen(false)}
                className="absolute top-6 right-6 p-2 text-white/30 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="mb-8">
                <h3 className="text-2xl font-bold mb-2">Choose Location</h3>
                <p className="text-white/40 text-sm">All locations are in Australia. Search or pick a region.</p>
              </div>

              <div className="space-y-6">
                <div className="relative group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-primary transition-colors w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search location..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:border-primary transition-colors text-white placeholder:text-white/20"
                  />
                </div>

                <button className="flex items-center space-x-3 px-6 py-3 bg-primary/10 border border-primary/20 rounded-full text-primary hover:bg-primary/20 transition-all group">
                  <Target className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-bold">Detect my location</span>
                </button>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                  {regions.map((region) => (
                    <button
                      key={region}
                      onClick={() => setIsLocationOpen(false)}
                      className="px-6 py-4 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl text-sm font-bold text-white/70 hover:text-white transition-all text-left"
                    >
                      {region}
                    </button>
                  ))}
                </div>

                <div className="flex justify-end pt-8">
                  <button
                    onClick={() => setIsLocationOpen(false)}
                    className="bg-primary hover:bg-primary-dark text-white font-bold px-10 py-3 rounded-full transition-all shadow-lg shadow-primary/20"
                  >
                    Done
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
