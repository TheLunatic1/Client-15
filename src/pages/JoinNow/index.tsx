/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, HardHat, ArrowLeft, ArrowRight, Check, ShieldCheck, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import Swal from 'sweetalert2';

// Assets
import logo from '../../assets/WhatsApp_Image_2026-05-14_at_11.37.20_AM__1_-removebg-preview.png';
import tradieBg from '../../assets/tradie-login-bg.png';
import axiosClient from '../../api/axios';

const JoinNow = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const defaultType = searchParams.get('type') as 'customer' | 'tradie' | null;

  const [step, setStep] = useState<'selection' | 'form'>(defaultType ? 'form' : 'selection');
  const [type, setType] = useState<'customer' | 'tradie' | null>(defaultType || null);

  // Form State
  const [showPassword, setShowPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  // Customer Form States
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Tradie Form States
  const [tradieName, setTradieName] = useState('');
  const [tradieBusinessName, setTradieBusinessName] = useState('');
  const [tradieEmail, setTradieEmail] = useState('');
  const [tradiePassword, setTradiePassword] = useState('');
  const [tradieConfirmPassword, setTradieConfirmPassword] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCustomerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName || !email || !password) {
      Swal.fire({
        title: 'Error',
        text: 'All fields are required',
        icon: 'error',
        confirmButtonColor: '#097DDD'
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axiosClient.post('/api/users/register', {
        firstName,
        lastName,
        email,
        password,
        role: 'user'
      });
      const data = response.data;

      Swal.fire({
        title: 'Success',
        text: 'Account created successfully! Please log in.',
        icon: 'success',
        confirmButtonColor: '#097DDD'
      }).then(() => {
        navigate('/login');
      });
    } catch (error: any) {
      console.error(error);
      const errorMsg = error.response?.data?.message || 'Failed to connect to server';
      Swal.fire({
        title: 'Registration Failed',
        text: errorMsg,
        icon: 'error',
        confirmButtonColor: '#097DDD'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTradieSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tradieName || !tradieEmail || !tradiePassword || !tradieConfirmPassword) {
      Swal.fire({
        title: 'Error',
        text: 'Please fill in name, email, password and confirm password',
        icon: 'error',
        confirmButtonColor: '#097DDD'
      });
      return;
    }
    if (tradiePassword !== tradieConfirmPassword) {
      Swal.fire({
        title: 'Error',
        text: 'Passwords do not match',
        icon: 'error',
        confirmButtonColor: '#097DDD'
      });
      return;
    }
    if (!agreeToTerms) {
      Swal.fire({
        title: 'Error',
        text: 'You must agree to the Terms & Conditions and Privacy Policy',
        icon: 'error',
        confirmButtonColor: '#097DDD'
      });
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(tradieEmail)) {
      Swal.fire({
        title: 'Error',
        text: 'Please enter a valid email address',
        icon: 'error',
        confirmButtonColor: '#097DDD'
      });
      return;
    }

    // Validate password length
    if (tradiePassword.length < 6) {
      Swal.fire({
        title: 'Error',
        text: 'Password must be at least 6 characters long',
        icon: 'error',
        confirmButtonColor: '#097DDD'
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const parts = tradieName.trim().split(' ');
      const fName = parts[0] || '';
      const lName = parts.slice(1).join(' ') || '';

      const response = await axiosClient.post('/api/users/register', {
        firstName: fName,
        lastName: lName,
        email: tradieEmail,
        password: tradiePassword,
        role: 'tradie'
      });
      const data = response.data;

      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('token', data.token || 'dummy-tradie-token');
      localStorage.setItem('userRole', 'tradie');
      localStorage.setItem('userName', tradieName);
      localStorage.setItem('userEmail', tradieEmail);

      if (tradieBusinessName) {
        localStorage.setItem('prefillBusinessName', tradieBusinessName);
      }
      localStorage.setItem('prefillContactName', tradieName);
      localStorage.setItem('prefillContactEmail', tradieEmail);

      Swal.fire({
        title: 'Welcome, ' + tradieName + '!',
        text: 'Your Tradie Account has been created successfully! Let\'s list your business now.',
        icon: 'success',
        confirmButtonColor: '#097DDD'
      }).then(() => {
        navigate('/list-your-business');
      });
    } catch (error: any) {
      console.error('Registration error:', error);
      
      // Get the error message from backend or show generic error
      const errorMsg = error.response?.data?.message || error.message || 'Registration failed. Please try again.';
      
      // Only show error, don't fall back to dummy token
      Swal.fire({
        title: 'Registration Failed',
        text: errorMsg,
        icon: 'error',
        confirmButtonColor: '#097DDD'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleContinue = () => {
    if (type) {
      setStep('form');
    }
  };

  const goBack = () => {
    setStep('selection');
  };

  return (
    <div className="min-h-screen bg-[#050f26] text-white flex flex-col pt-4 sm:pt-10">

      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Left Side: Content */}
        <div className={`w-full ${type === 'tradie' && step === 'form' ? 'lg:w-[50%]' : 'lg:w-[48%]'} flex flex-col items-center justify-center p-6 sm:p-8 lg:p-12 relative overflow-y-auto`}>
          <AnimatePresence mode="wait">
            {step === 'selection' ? (
              <motion.div
                key="selection"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="w-full max-w-lg"
              >
                {/* Back to Home Link */}
                <div className="mb-6 text-left">
                  <Link to="/" className="inline-flex items-center space-x-2 text-white hover:text-white/80 transition-colors group">
                    <ArrowLeft size={12} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="text-[9px] font-black uppercase tracking-[0.2em]">Back to Home</span>
                  </Link>
                </div>

                {/* Logo */}
                <div className="mb-4 sm:mb-6 text-center lg:text-left">
                  <img src={logo} alt="MyLocalPro" className="h-10 w-auto brightness-110 mx-auto lg:mx-0" />
                </div>

                <div className="mb-4 sm:mb-6 text-center lg:text-left">
                  <h1 className="text-3xl sm:text-[2.5rem] font-black text-white leading-tight mb-2">
                    Join the Network
                  </h1>
                  <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.3em]">
                    Choose your account type
                  </p>
                </div>

                {/* Account Type Selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                  {/* Customer Card */}
                  <button
                    onClick={() => setType('customer')}
                    className={`relative p-5 sm:p-8 rounded-[1.5rem] sm:rounded-[2rem] border transition-all text-center group ${type === 'customer'
                      ? 'bg-primary/10 border-primary shadow-[0_0_30px_rgba(59,130,246,0.15)]'
                      : 'bg-[#1a2b4b]/20 border-white/5 hover:border-white/10'
                      }`}
                  >
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-6 transition-all ${type === 'customer' ? 'bg-primary text-white' : 'bg-white/5 text-white/20 group-hover:text-white'
                      }`}>
                      <User size={18} className="sm:w-5 sm:h-5" />
                    </div>
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white mb-1 sm:mb-2">
                      As Customer
                    </h3>
                    <p className="text-[9px] font-black uppercase tracking-wider text-white/30 group-hover:text-white/50 transition-colors">
                      Find trusted local pros for any job
                    </p>
                    {type === 'customer' && (
                      <div className="absolute top-4 right-4 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                        <Check size={12} />
                      </div>
                    )}
                  </button>

                  {/* Tradie Card */}
                  <button
                    onClick={() => setType('tradie')}
                    className={`relative p-5 sm:p-8 rounded-[1.5rem] sm:rounded-[2rem] border transition-all text-center group ${type === 'tradie'
                      ? 'bg-[#097DDD]/10 border-[#097DDD] shadow-[0_0_30px_rgba(9,125,221,0.15)]'
                      : 'bg-[#1a2b4b]/20 border-white/5 hover:border-white/10'
                      }`}
                  >
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-6 transition-all ${type === 'tradie' ? 'bg-[#097DDD] text-white' : 'bg-white/5 text-white/20 group-hover:text-white'
                      }`}>
                      <HardHat size={18} className="sm:w-5 sm:h-5" />
                    </div>
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white mb-1 sm:mb-2">
                      As Tradie
                    </h3>
                    <p className="text-[9px] font-black uppercase tracking-wider text-white/30 group-hover:text-white/50 transition-colors">
                      List your business & get more work
                    </p>
                    {type === 'tradie' && (
                      <div className="absolute top-4 right-4 w-5 h-5 bg-[#097DDD] rounded-full flex items-center justify-center">
                        <Check size={12} />
                      </div>
                    )}
                  </button>
                </div>

                {/* Continue Button */}
                <div className="flex justify-center">
                  <button
                    disabled={!type}
                    onClick={handleContinue}
                    className={`min-w-[240px] py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] transition-all flex items-center justify-center gap-3 shadow-2xl ${type
                      ? 'bg-[#097DDD] hover:bg-[#0869bb] text-white shadow-blue-500/20'
                      : 'bg-white/5 text-white/10 cursor-not-allowed border border-white/5'
                      }`}
                  >
                    Continue
                    <ArrowRight size={12} strokeWidth={3} />
                  </button>
                </div>

                <div className="mt-12 text-center">
                  <p className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em]">
                    Already have an account?{' '}
                    <Link to="/login" className="text-[#097DDD] hover:text-white transition-colors">
                      Sign In
                    </Link>
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="form"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="w-full max-w-4xl"
              >
                {/* Header structure matching selection step */}
                <div className="mb-4 sm:mb-6">
                  <h1 className="text-2xl sm:text-[2.25rem] font-black text-white leading-tight mb-2">
                    {type === 'tradie' ? 'Welcome to MyLocalPro Network' : 'Join the Network'}
                  </h1>
                </div>

                <div className="bg-[#1a2b4b]/20 backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-6 sm:p-8 lg:p-12 shadow-2xl">
                  {type === 'tradie' ? (
                    /* TRADIE SPECIFIC FORM */
                    <form onSubmit={handleTradieSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <label className="text-[9px] font-black text-[#6ab4f5] uppercase tracking-[0.2em] ml-1">Full Name *</label>
                          <div className="relative">
                            <User className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                            <input
                              type="text"
                              required
                              placeholder="Enter your full name"
                              value={tradieName}
                              onChange={(e) => setTradieName(e.target.value)}
                              className="w-full pl-14 pr-6 py-4 bg-white rounded-2xl text-slate-900 font-bold placeholder:text-slate-300 focus:outline-none transition-all shadow-inner text-[13px]"
                            />
                          </div>
                        </div>

                        <div className="space-y-3">
                          <label className="text-[9px] font-black text-[#6ab4f5] uppercase tracking-[0.2em] ml-1">Business Name (Optional)</label>
                          <div className="relative">
                            <HardHat className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                            <input
                              type="text"
                              placeholder="Enter business name"
                              value={tradieBusinessName}
                              onChange={(e) => setTradieBusinessName(e.target.value)}
                              className="w-full pl-14 pr-6 py-4 bg-white rounded-2xl text-slate-900 font-bold placeholder:text-slate-300 focus:outline-none transition-all shadow-inner text-[13px]"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <label className="text-[9px] font-black text-[#6ab4f5] uppercase tracking-[0.2em] ml-1">Email Address *</label>
                        <div className="relative">
                          <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                          <input
                            type="email"
                            required
                            placeholder="you@example.com"
                            value={tradieEmail}
                            onChange={(e) => setTradieEmail(e.target.value)}
                            className="w-full pl-14 pr-6 py-4 bg-white rounded-2xl text-slate-900 font-bold placeholder:text-slate-300 focus:outline-none transition-all shadow-inner text-[13px]"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-3 relative">
                          <label className="text-[9px] font-black text-[#6ab4f5] uppercase tracking-[0.2em] ml-1">Password *</label>
                          <div className="relative">
                            <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                            <input
                              type={showPassword ? "text" : "password"}
                              required
                              placeholder="••••••••"
                              value={tradiePassword}
                              onChange={(e) => setTradiePassword(e.target.value)}
                              className="w-full pl-14 pr-12 py-4 bg-white rounded-2xl text-slate-900 font-bold placeholder:text-slate-300 focus:outline-none transition-all shadow-inner text-[13px]"
                            />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                          </div>
                        </div>

                        <div className="space-y-3 relative">
                          <label className="text-[9px] font-black text-[#6ab4f5] uppercase tracking-[0.2em] ml-1">Confirm Password *</label>
                          <div className="relative">
                            <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                            <input
                              type={showPassword ? "text" : "password"}
                              required
                              placeholder="••••••••"
                              value={tradieConfirmPassword}
                              onChange={(e) => setTradieConfirmPassword(e.target.value)}
                              className="w-full pl-14 pr-12 py-4 bg-white rounded-2xl text-slate-900 font-bold placeholder:text-slate-300 focus:outline-none transition-all shadow-inner text-[13px]"
                            />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Terms */}
                      <div className="pt-2">
                        <label className="flex items-center space-x-3 cursor-pointer group select-none">
                          <input
                            type="checkbox"
                            checked={agreeToTerms}
                            onChange={(e) => setAgreeToTerms(e.target.checked)}
                            className="hidden"
                          />
                          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${agreeToTerms ? 'border-[#097DDD] bg-[#097DDD]/10' : 'border-white/10 group-hover:border-[#097DDD]'}`}>
                            {agreeToTerms && <Check size={12} className="text-[#097DDD]" />}
                          </div>
                          <p className="text-[11px] font-medium text-white/40">
                            I agree to the <Link to="/terms" className="text-[#097DDD] hover:underline transition-all">Terms & Conditions</Link> and <Link to="/privacy" className="text-[#097DDD] hover:underline transition-all">Privacy Policy</Link>
                          </p>
                        </label>
                      </div>

                      {/* Submit Button */}
                      <div className="pt-4">
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full py-5 bg-[#097DDD] hover:bg-[#0869bb] text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] transition-all shadow-xl shadow-blue-500/20 disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                          {isSubmitting ? 'Creating Business Account...' : 'Create Business Account'}
                          <ArrowRight size={14} />
                        </button>
                      </div>
                    </form>
                  ) : (
                    /* CUSTOMER FORM */
                    <form onSubmit={handleCustomerSubmit} className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <label className="text-[9px] font-black text-[#6ab4f5] uppercase tracking-[0.2em] ml-1">First Name</label>
                          <div className="relative">
                            <User className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                            <input
                              type="text"
                              placeholder="John"
                              value={firstName}
                              onChange={(e) => setFirstName(e.target.value)}
                              className="w-full pl-14 pr-6 py-4 bg-white rounded-2xl text-slate-900 font-bold placeholder:text-slate-300 focus:outline-none transition-all shadow-inner text-[13px]"
                            />
                          </div>
                        </div>
                        <div className="space-y-3">
                          <label className="text-[9px] font-black text-[#6ab4f5] uppercase tracking-[0.2em] ml-1">Last Name</label>
                          <div className="relative">
                            <User className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                            <input
                              type="text"
                              placeholder="Doe"
                              value={lastName}
                              onChange={(e) => setLastName(e.target.value)}
                              className="w-full pl-14 pr-6 py-4 bg-white rounded-2xl text-slate-900 font-bold placeholder:text-slate-300 focus:outline-none transition-all shadow-inner text-[13px]"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <label className="text-[9px] font-black text-[#6ab4f5] uppercase tracking-[0.2em] ml-1">Email Address</label>
                        <div className="relative">
                          <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                          <input
                            type="email"
                            placeholder="john@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full pl-14 pr-6 py-4 bg-white rounded-2xl text-slate-900 font-bold placeholder:text-slate-300 focus:outline-none transition-all shadow-inner text-[13px]"
                          />
                        </div>
                      </div>
                      <div className="space-y-3">
                        <label className="text-[9px] font-black text-[#6ab4f5] uppercase tracking-[0.2em] ml-1">Password</label>
                        <div className="relative">
                          <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                          <input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full pl-14 pr-6 py-4 bg-white rounded-2xl text-slate-900 font-bold placeholder:text-slate-300 focus:outline-none transition-all shadow-inner text-[13px]"
                          />
                        </div>
                      </div>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-5 bg-[#097DDD] hover:bg-[#0869bb] text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] transition-all shadow-xl shadow-blue-500/20 disabled:opacity-50"
                      >
                        {isSubmitting ? 'Creating Account...' : 'Create Customer Account'}
                        <ArrowRight size={14} className="inline ml-2" />
                      </button>
                    </form>
                  )}
                </div>

                {/* Footer link */}
                <div className="mt-8 text-center">
                  <button onClick={goBack} className="text-[9px] font-black text-white hover:text-white/80 uppercase tracking-[0.2em] transition-colors">
                    ← Back to Selection
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Side: Visual Image */}
        <div className={`hidden lg:block ${type === 'tradie' && step === 'form' ? 'lg:w-[50%]' : 'lg:w-[52%]'} relative overflow-hidden`}>
          <img
            src={tradieBg}
            alt="Professional Tradie"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-[#050f26]/80" />

          {type === 'tradie' && step === 'form' ? (
            /* TRADIE PREMIUM BANNER CONTENT */
            <div className="absolute inset-0 flex flex-col justify-center px-16 z-10 bg-black/40">
              <div className="space-y-10">
                <div>
                  <h2 className="text-[3.5rem] font-black text-white leading-[1] mb-4">
                    GET PREMIUM ACCESS <br />
                    <span className="text-[#097DDD]">FREE FOR ALL OF 2026</span>
                  </h2>
                  <div className="inline-flex items-center px-6 py-3 bg-white rounded-full text-[#0D1F43] font-black text-xl shadow-xl">
                    Free Until <span className="ml-2">31st December 2026</span>
                  </div>
                </div>

                <div className="space-y-6">
                  <ul className="space-y-4">
                    {[
                      "Verified Job Leads",
                      "A Professional Tradie Profile",
                      "Priority Listing",
                      "No Charges Until Jan 1st, 2027"
                    ].map((title, i) => (
                      <li key={i} className="flex items-start space-x-3 group">
                        <div className="w-5 h-5 rounded-full bg-[#097DDD] flex items-center justify-center shrink-0 mt-1">
                          <Check size={12} className="text-white" strokeWidth={4} />
                        </div>
                        <p className="text-lg text-white font-black">
                          {title}
                        </p>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-12 p-8 bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 max-w-lg">
                    <p className="text-white font-bold text-sm leading-relaxed">
                      <span className="text-[#097DDD] block mb-2 uppercase tracking-widest text-xs">Payment Notice</span>
                      The platform is 100% free for all approved businesses throughout 2026. Card details are required during sign-up to prepare your account for automated subscriptions starting <span className="text-white underline">1 January 2027</span>. No payments will be processed before this date.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* DEFAULT SELECTION/CUSTOMER CONTENT */
            <>
              <div className="absolute top-12 right-12">
                <div className="bg-[#050f26]/70 backdrop-blur-md border border-white/10 rounded-2xl px-6 py-3 flex flex-col items-end shadow-2xl">
                  <span className="text-[8px] font-black text-[#6ab4f5] uppercase tracking-[0.3em] mb-1">Status</span>
                  <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Verified Professionals</span>
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="absolute bottom-20 left-12 right-12 max-w-lg bg-white/5 backdrop-blur-xl border border-white/10 p-10 rounded-[2.5rem] shadow-2xl"
              >
                <div className="flex items-center space-x-4 mb-8">
                  <div className="w-12 h-12 bg-[#097DDD] rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                    <ShieldCheck className="text-white w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-white leading-none">2,400+</h2>
                    <p className="text-[8px] font-black text-white/40 uppercase tracking-[0.2em]">Verified Professionals</p>
                  </div>
                </div>
                <h2 className="text-[1.75rem] font-black text-white mb-4 leading-tight">
                  Join Australia's fastest growing<br />network of trusted local trades.
                </h2>
                <p className="text-white/50 text-[0.95rem] font-medium leading-relaxed">
                  Find the best services in MyLocalPro or grow your own business with our premium professional platform.
                </p>
              </motion.div>
            </>
          )}

          {/* Decorative Dot Pattern */}
          <div className="absolute top-0 right-0 w-full h-full opacity-[0.03] pointer-events-none"
            style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>

    </div>
  );
};

export default JoinNow;
