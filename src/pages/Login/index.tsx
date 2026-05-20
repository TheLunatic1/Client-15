import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, ShieldCheck, ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import Swal from 'sweetalert2';
import logo from '../../assets/WhatsApp_Image_2026-05-14_at_11.37.20_AM__1_-removebg-preview.png';
import LoadingScreen from '../../components/common/LoadingScreen';
// Using the generated image
import tradieBg from '../../assets/tradie-login-bg.png';
import axiosClient from '../../api/axios';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsLoading(true);

    const superUserEmail = import.meta.env.VITE_SUPERUSER_EMAIL;
    const superUserPass = import.meta.env.VITE_SUPERUSER_PASSWORD;
    const adminEmail = import.meta.env.VITE_ADMIN_EMAIL;
    const adminPass = import.meta.env.VITE_ADMIN_PASSWORD;
    const tradieEmail = import.meta.env.VITE_TRADIE_EMAIL;
    const tradiePass = import.meta.env.VITE_TRADIE_PASSWORD;

    try {
      // 1. Try to login via Backend API
      const response = await axiosClient.post('/api/users/login', { email, password });
      const data = response.data;

      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('token', data.token);
      const targetRole = data.role === 'admin' ? 'admin' : data.role === 'tradie' ? 'tradie' : 'user';
      localStorage.setItem('userRole', targetRole);
      localStorage.setItem('userName', data.name);
      localStorage.setItem('userEmail', data.email);

      setTimeout(() => {
        if (targetRole === 'admin') {
          navigate('/admin');
        } else if (targetRole === 'tradie') {
          navigate('/tradie-dashboard');
        } else {
          navigate('/user-dashboard');
        }
      }, 1000);
      return;
    } catch (apiError) {
      console.warn('Backend login connection failed, falling back to static env credentials...', apiError);
    }

    // 2. Fallback to static ENV-based checks if backend is offline or credentials don't exist yet
    setTimeout(() => {
      if (email === superUserEmail && password === superUserPass) {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userRole', 'user');
        navigate('/user-dashboard');
      } else if (email === adminEmail && password === adminPass) {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userRole', 'admin');
        navigate('/admin');
      } else if (email === tradieEmail && password === tradiePass) {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userRole', 'tradie');
        navigate('/tradie-dashboard');
      } else {
        setIsLoading(false);
        Swal.fire({
          title: 'Login Failed',
          text: 'The credentials you entered are incorrect or the server is offline. Please check your details and try again.',
          icon: 'error',
          confirmButtonColor: '#097DDD',
          background: '#FFFFFF',
          customClass: {
            popup: 'rounded-[2rem]',
            confirmButton: 'rounded-xl font-bold uppercase tracking-widest text-[10px] px-8 py-4'
          }
        });
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#050f26] flex flex-col pt-4 sm:pt-10">
      {isLoading && <LoadingScreen />}

      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Left Side: Login Form */}
        <div className="w-full lg:w-[48%] flex flex-col items-center justify-center p-6 sm:p-8 lg:p-20 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md"
          >
            {/* Back to Home Link */}
            <div className="mb-6">
              <Link to="/" className="inline-flex items-center space-x-2 text-white hover:text-white/80 transition-colors group">
                <ArrowLeft size={12} className="group-hover:-translate-x-1 transition-transform" />
                <span className="text-[9px] font-black uppercase tracking-[0.2em]">Back to Home</span>
              </Link>
            </div>

            {/* Logo */}
            <div className="mb-4 sm:mb-6">
              <img src={logo} alt="MyLocalPro" className="h-12 w-auto brightness-110" />
            </div>

            {/* Header */}
            <div className="mb-4 sm:mb-6">
              <h1 className="text-2xl sm:text-[2.25rem] font-black text-white leading-tight mb-2">
                Welcome Back
              </h1>
              <p className="text-white/40 text-[0.85rem] font-medium">
                Sign in to your account to continue.
              </p>
            </div>

            {/* Login Card */}
            <div className="bg-[#1a2b4b]/20 backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-6 sm:p-10 shadow-2xl mb-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Field */}
                <div className="space-y-3">
                  <label className="block text-[10px] font-black text-[#6ab4f5] uppercase tracking-[0.2em] ml-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-16 pr-6 py-4 bg-white rounded-2xl text-slate-900 font-bold placeholder:text-slate-300 focus:outline-none transition-all shadow-inner"
                      placeholder="Enter your email address"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center px-1">
                    <label className="text-[10px] font-black text-[#6ab4f5] uppercase tracking-[0.2em]">
                      Password
                    </label>
                    <a href="#" className="text-[9px] font-black text-[#097DDD] hover:text-white uppercase tracking-wider transition-colors">
                      Forgot?
                    </a>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-16 pr-6 py-4 bg-white rounded-2xl text-slate-900 font-bold placeholder:text-slate-300 focus:outline-none transition-all shadow-inner"
                      placeholder="••••••"
                    />
                  </div>
                </div>

                {/* Sign In Button */}
                <button
                  type="submit"
                  className="w-full bg-[#097DDD] hover:bg-[#0869bb] text-white font-black py-5 rounded-2xl transition-all shadow-[0_10px_30px_rgba(9,125,221,0.3)] flex items-center justify-center gap-3 uppercase tracking-[0.2em] text-[11px]"
                >
                  Sign In
                  <ArrowRight size={14} strokeWidth={3} />
                </button>
              </form>
            </div>

            {/* Footer Links */}
            <div className="text-center space-y-10">
              <div className="flex flex-col gap-4">
                <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">
                  Don't have an account?{' '}
                  <Link to="/join-now" className="text-[#097DDD] hover:text-white transition-colors border-b border-transparent hover:border-white">
                    Join the Network
                  </Link>
                </p>
                {/* <div className="pt-4 border-t border-white/5">
                  <p className="text-[9px] font-bold text-white/20 uppercase tracking-[0.3em]">
                    Administrative Access? <span className="text-[#097DDD]">Use your Admin credentials</span>
                  </p>
                </div> */}
              </div>

              <div className="flex items-center justify-center space-x-10 opacity-30">
                <div className="flex items-center space-x-2">
                  <ShieldCheck size={14} />
                  <span className="text-[9px] font-black uppercase tracking-[0.25em]">Secure Login</span>
                </div>
                <div className="flex items-center space-x-2">
                  <ShieldCheck size={14} />
                  <span className="text-[9px] font-black uppercase tracking-[0.25em]">Verified Pro Network</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Side: Visual Image */}
        <div className="hidden lg:block lg:w-[52%] relative overflow-hidden">
          <img
            src={tradieBg}
            alt="Professional Tradie"
            className="absolute inset-0 h-full w-full object-cover"
          />
          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-[#050f26]/60" />

          {/* Top Badge */}
          <div className="absolute top-12 right-12">
            <div className="bg-[#050f26]/70 backdrop-blur-md border border-white/10 rounded-2xl px-6 py-3 flex flex-col items-end shadow-2xl">
              <span className="text-[8px] font-black text-[#6ab4f5] uppercase tracking-[0.3em] mb-1">Platform</span>
              <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Super Admin Portal</span>
            </div>
          </div>

          {/* Floating Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="absolute bottom-20 left-12 right-12 max-w-lg bg-white/5 backdrop-blur-xl border border-white/10 p-10 rounded-[2.5rem] shadow-2xl"
          >
            <div className="w-12 h-12 bg-[#097DDD] rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-blue-500/20">
              <ShieldCheck className="text-white w-6 h-6" />
            </div>
            <h2 className="text-[1.75rem] font-black text-white mb-4 leading-tight">
              Manage your network<br />with confidence.
            </h2>
            <p className="text-white/50 text-[0.95rem] font-medium leading-relaxed">
              Access the Super Admin dashboard to oversee verified tradies, manage analytics, and grow the Australian network.
            </p>
          </motion.div>

          {/* Decorative Dot Pattern */}
          <div className="absolute top-0 right-0 w-full h-full opacity-[0.03] pointer-events-none"
            style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
        </div>
      </div>
    </div>
  );
};

export default Login;
