/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Briefcase, LogOut,
  AlertCircle,
  LayoutDashboard,
  FileText, Image as ImageIcon,
  Save, Plus, Trash2, Camera, Phone, Mail, MapPin, Globe, CheckCircle, Clock, ShieldCheck, Lock, Edit2
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';
import Swal from 'sweetalert2';
// @ts-ignore
import logo from '../../assets/WhatsApp_Image_2026-05-14_at_11.37.20_AM__1_-removebg-preview.png';
import axiosClient from '../../api/axios';
import LoadingScreen from '../../components/common/LoadingScreen';

// Simulated initial data
const initialData = {
  contact: {
    firstName: 'John',
    lastName: 'Doe',
    email: 'tradie@mylocalpro.com.au',
    phone: '0412 345 678',
    address: '123 Tradie Lane',
    city: 'Hobart',
    state: 'TAS',
    postcode: '7000'
  },
  business: {
    businessName: 'JD Plumbing Services',
    abn: '12 345 678 901',
    category: 'Plumber',
    location: 'Hobart Region (TAS)',
    suburb: 'Sandy Bay',
    servicesOffered: 'Emergency repairs, Hot water, Gas fitting',
    website: 'www.jdplumbing.com.au',
    yearsInBusiness: '10'
  },
  businessesList: [
    { id: 1, name: 'JD Plumbing Services', category: 'Plumber', status: 'Approved', location: 'Hobart Region (TAS)', image: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&q=80&w=800' },
    { id: 2, name: 'JD Plumbing Services (Commercial)', category: 'Plumber', status: 'Pending', location: 'Hobart Region (TAS)', image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=800' },
    { id: 3, name: 'JD Emergency Gas Fitting', category: 'Gas Fitters', status: 'Rejected', location: 'Hobart Region (TAS)', image: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&q=80&w=800' }
  ],
  description: {
    shortDescription: 'Reliable and licensed plumbing services across Hobart.',
    longDescription: 'With over 10 years of experience, JD Plumbing Services provides top-notch residential and commercial plumbing solutions. From leaky taps to complete bathroom renovations, we do it all with a guarantee of quality and professionalism.'
  },
  gallery: [
    { id: 1, url: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&q=80&w=800', title: 'Bathroom Renovation' },
    { id: 2, url: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=800', title: 'Pipe Installation' }
  ]
};

// Premium Modal Component
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

const TradieDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('overview');
  const [formData, setFormData] = useState(initialData);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Security Center States
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    if (location.state && (location.state as any).activeTab) {
      setActiveTab((location.state as any).activeTab);
    } 
    
    // Fetch data from backend
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [profileRes, , businessesRes] = await Promise.all([
          axiosClient.get('/api/users/profile'),
          axiosClient.get('/api/stats/tradie'),
          axiosClient.get('/api/businesses/my/listings')
        ]);
        
        const profile = profileRes.data;
        const businesses = businessesRes.data;
        
        const mainBusiness = businesses.length > 0 ? businesses[0] : {};

        setFormData({
          contact: {
            firstName: profile.firstName || '',
            lastName: profile.lastName || '',
            email: profile.email || '',
            phone: profile.phone || '',
            address: profile.address || '',
            city: profile.city || '',
            state: profile.state || '',
            postcode: profile.postcode || ''
          },
          business: {
            id: mainBusiness._id || '',
            businessName: mainBusiness.businessName || '',
            abn: mainBusiness.abn || '',
            category: mainBusiness.category || '',
            location: mainBusiness.location || '',
            suburb: mainBusiness.suburb || '',
            servicesOffered: mainBusiness.servicesOffered || '',
            website: mainBusiness.website || '',
            yearsInBusiness: mainBusiness.yearsInBusiness || ''
          } as any,
          businessesList: businesses.map((b: any) => ({
            id: b._id,
            name: b.businessName,
            category: b.category,
            status: b.status.charAt(0).toUpperCase() + b.status.slice(1),
            location: b.location,
            image: b.gallery && b.gallery.length > 0 ? b.gallery[0].url : 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&q=80&w=800'
          })),
          description: {
            shortDescription: mainBusiness.description || '',
            longDescription: mainBusiness.longDescription || ''
          },
          gallery: mainBusiness.gallery || []
        });
      } catch (error) {
        console.warn('Failed to load tradie data from backend, using fallback data.', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [location.state]);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userRole');
    navigate('/login');
  };

  const handleSave = async (section: string) => {
    try {
      if (section === 'Password') {
        if (newPassword !== confirmPassword) {
          Swal.fire({ title: 'Error', text: 'Passwords do not match', icon: 'error', confirmButtonColor: '#097DDD' });
          return;
        }
        await axiosClient.put('/api/users/profile/password', { currentPassword, newPassword });
        setCurrentPassword(''); setNewPassword(''); setConfirmPassword('');
      } else if (section === 'Business Profile') {
        // Update User Profile
        await axiosClient.put('/api/users/profile', formData.contact);
        
        // Update Business if ID exists
        const bId = (formData.business as any).id;
        if (bId) {
          await axiosClient.put(`/api/businesses/${bId}`, {
            businessName: formData.business.businessName,
            category: formData.business.category,
            location: formData.business.location,
            description: formData.description.shortDescription,
            // Include other mapped fields if API supports them
          });
        }
      }

      Swal.fire({
        title: 'Success!',
        text: `${section} updated successfully.`,
        icon: 'success',
        confirmButtonColor: '#097DDD',
        background: '#ffffff',
        color: '#0f172a',
        customClass: {
          popup: 'rounded-[2rem]',
          confirmButton: 'rounded-xl font-bold uppercase tracking-widest text-[10px] px-8 py-4'
        }
      });
    } catch (error: any) {
      Swal.fire({
        title: 'Error',
        text: error.response?.data?.message || 'Failed to update',
        icon: 'error',
        confirmButtonColor: '#097DDD'
      });
    }
  };

  const handleInputChange = (section: keyof typeof formData, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof Omit<typeof formData, 'gallery'>],
        [field]: value
      }
    }));
  };

  const tabs = [
    { id: 'overview', name: 'Overview', icon: LayoutDashboard },
    { id: 'my-businesses', name: 'My Businesses', icon: Briefcase },
    { id: 'business', name: 'Business Details', icon: FileText },
    { id: 'security', name: 'Security Center', icon: ShieldCheck }
  ];

  const totalAdded = formData.businessesList.length;
  const approved = formData.businessesList.filter(b => b.status === 'Approved').length;
  const pending = formData.businessesList.filter(b => b.status === 'Pending').length;
  const rejected = formData.businessesList.filter(b => b.status === 'Rejected').length;

  const renderContent = () => {
    if (isLoading) return <LoadingScreen />;
    switch (activeTab) {
      case 'overview':
        return (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm flex items-center gap-6 transition-transform hover:-translate-y-1">
                <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-[#097DDD] shrink-0 border border-blue-100">
                  <Briefcase size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total</p>
                  <p className="text-3xl font-black text-slate-800">{totalAdded}</p>
                </div>
              </div>
              <div className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm flex items-center gap-6 transition-transform hover:-translate-y-1">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-500 shrink-0 border border-emerald-100">
                  <CheckCircle size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Approved</p>
                  <p className="text-3xl font-black text-slate-800">{approved}</p>
                </div>
              </div>
              <div className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm flex items-center gap-6 transition-transform hover:-translate-y-1">
                <div className="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-500 shrink-0 border border-amber-100">
                  <Clock size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Pending</p>
                  <p className="text-3xl font-black text-slate-800">{pending}</p>
                </div>
              </div>
              <div className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm flex items-center gap-6 transition-transform hover:-translate-y-1">
                <div className="w-14 h-14 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-500 shrink-0 border border-rose-100">
                  <AlertCircle size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Rejected</p>
                  <p className="text-3xl font-black text-slate-800">{rejected}</p>
                </div>
              </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              {/* Bar Chart - Business Status */}
              <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
                <h3 className="text-base font-black text-slate-800 mb-1 tracking-tight">Business Status Breakdown</h3>
                <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mb-6">By listing count</p>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={[
                    { name: 'Approved', value: approved, fill: '#10b981' },
                    { name: 'Pending', value: pending, fill: '#f59e0b' },
                    { name: 'Rejected', value: rejected, fill: '#f43f5e' },
                  ]} barSize={48} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fontWeight: 700, fill: '#94a3b8', letterSpacing: 1 }} axisLine={false} tickLine={false} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 11, fontWeight: 700, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                    <Tooltip
                      contentStyle={{ borderRadius: '1rem', border: '1px solid #e2e8f0', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', fontSize: 12, fontWeight: 700 }}
                      cursor={{ fill: '#f8fafc' }}
                    />
                    <Bar dataKey="value" radius={[10, 10, 0, 0]}>
                      {[
                        <Cell key="approved" fill="#10b981" />,
                        <Cell key="pending" fill="#f59e0b" />,
                        <Cell key="rejected" fill="#f43f5e" />,
                      ]}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Pie Chart - Category Distribution */}
              <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
                <h3 className="text-base font-black text-slate-800 mb-1 tracking-tight">Category Distribution</h3>
                <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mb-6">Services registered</p>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie
                      data={Object.entries(
                        formData.businessesList.reduce<Record<string, number>>((acc, biz) => {
                          acc[biz.category] = (acc[biz.category] || 0) + 1;
                          return acc;
                        }, {})
                      ).map(([name, value]) => ({ name, value }))}
                      cx="50%" cy="50%"
                      innerRadius={55}
                      outerRadius={90}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {['#097DDD', '#10b981', '#f59e0b', '#f43f5e', '#8b5cf6', '#06b6d4'].map((color, index) => (
                        <Cell key={`cell-${index}`} fill={color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ borderRadius: '1rem', border: '1px solid #e2e8f0', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', fontSize: 12, fontWeight: 700 }}
                    />
                    <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, fontWeight: 700, paddingTop: '12px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Service Listings Overview */}
            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
              <h3 className="text-xl font-black text-slate-800 mb-6 tracking-tight">Service Listings Overview</h3>
              <div className="space-y-4">
                {formData.businessesList.map((biz) => (
                  <div key={biz.id} className="p-5 border border-slate-100 bg-slate-50 rounded-2xl flex items-center justify-between gap-4 transition-colors hover:border-[#097DDD]/20 hover:bg-[#097DDD]/5">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                        biz.status === 'Approved' ? 'bg-emerald-100 text-emerald-500' :
                        biz.status === 'Pending' ? 'bg-amber-100 text-amber-500' :
                        'bg-rose-100 text-rose-500'
                      }`}>
                        <Briefcase size={20} />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800 text-lg">{biz.name}</h4>
                        <p className="text-xs text-slate-500 mt-0.5 font-bold uppercase tracking-wider text-[#097DDD]">Category: {biz.category}</p>
                      </div>
                    </div>
                    <span className={`text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-lg shadow-sm ${
                      biz.status === 'Approved' ? 'bg-emerald-500 text-white shadow-emerald-500/20' :
                      biz.status === 'Pending' ? 'bg-amber-500 text-white shadow-amber-500/20' :
                      'bg-rose-500 text-white shadow-rose-500/20'
                    }`}>
                      {biz.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        );

      case 'my-businesses':
        return (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8 bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black text-slate-800">My Businesses</h3>
              <button onClick={() => navigate('/list-your-business')} className="bg-[#097DDD] hover:bg-[#0869bb] text-white px-6 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all flex items-center gap-2 shadow-lg shadow-[#097DDD]/20">
                <Plus size={14} /> Add New Business
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {formData.businessesList.map((biz) => (
                <div key={biz.id} className="border border-slate-200 rounded-2xl flex flex-col justify-between hover:border-[#097DDD]/30 transition-colors overflow-hidden bg-white shadow-sm group">
                  <div className="h-40 w-full bg-slate-100 relative overflow-hidden">
                    <img src={biz.image} alt={biz.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    <span className={`absolute top-4 right-4 text-[9px] font-black uppercase tracking-wider px-3 py-1.5 rounded-lg shadow-lg backdrop-blur-md ${biz.status === 'Approved' ? 'bg-emerald-500/90 text-white' : 'bg-amber-500/90 text-white'}`}>
                      {biz.status}
                    </span>
                  </div>
                  <div className="p-6">
                    <h4 className="font-bold text-slate-800 text-lg mb-2">{biz.name}</h4>
                    <p className="text-xs text-slate-500 mb-1 font-bold">{biz.category}</p>
                    <p className="text-xs text-slate-400 flex items-center gap-1"><MapPin size={12} /> {biz.location}</p>
                    <div className="mt-6 flex justify-end">
                      <button onClick={() => setActiveTab('business')} className="w-full justify-center text-[#097DDD] hover:text-[#0869bb] text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5 transition-colors bg-[#097DDD]/5 px-4 py-3 rounded-xl hover:bg-[#097DDD]/10">
                        <Edit2 size={12} /> Edit Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        );

      case 'business':
        return (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8 bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
            
            {/* 1. Business Details Section */}
            <div className="mb-12">
              <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-3">
                <Briefcase className="text-[#097DDD]" size={24} /> Business Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2 md:col-span-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Business Name</label>
                  <div className="relative">
                    <Briefcase className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      value={formData.business.businessName}
                      onChange={(e) => handleInputChange('business', 'businessName', e.target.value)}
                      className="w-full pl-12 pr-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-700 font-bold focus:outline-none focus:border-[#097DDD] focus:ring-4 focus:ring-[#097DDD]/10 transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">ABN / ACN</label>
                  <input
                    type="text"
                    value={formData.business.abn}
                    onChange={(e) => handleInputChange('business', 'abn', e.target.value)}
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-700 font-bold focus:outline-none focus:border-[#097DDD] focus:ring-4 focus:ring-[#097DDD]/10 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Service Category *</label>
                  <input
                    type="text"
                    value={formData.business.category}
                    onChange={(e) => handleInputChange('business', 'category', e.target.value)}
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-700 font-bold focus:outline-none focus:border-[#097DDD] focus:ring-4 focus:ring-[#097DDD]/10 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Location</label>
                  <div className="relative">
                    <select
                      value={formData.business.location}
                      onChange={(e) => handleInputChange('business', 'location', e.target.value)}
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-700 font-bold focus:outline-none focus:border-[#097DDD] focus:ring-4 focus:ring-[#097DDD]/10 transition-all appearance-none"
                    >
                      <option value="">Choose a location</option>
                      <option value="Hobart Region (TAS)">Hobart Region (TAS)</option>
                      <option value="Launceston Region (TAS)">Launceston Region (TAS)</option>
                      <option value="Devonport Region (TAS)">Devonport Region (TAS)</option>
                      <option value="Burnie Region (TAS)">Burnie Region (TAS)</option>
                      <option value="North Brisbane (QLD)">North Brisbane (QLD)</option>
                      <option value="South Brisbane (QLD)">South Brisbane (QLD)</option>
                    </select>
                    <div className="absolute inset-y-0 right-5 flex items-center pointer-events-none">
                      <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Suburb</label>
                  <input
                    type="text"
                    value={formData.business.suburb}
                    onChange={(e) => handleInputChange('business', 'suburb', e.target.value)}
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-700 font-bold focus:outline-none focus:border-[#097DDD] focus:ring-4 focus:ring-[#097DDD]/10 transition-all"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Services Offered (Comma Separated)</label>
                  <input
                    type="text"
                    value={formData.business.servicesOffered}
                    onChange={(e) => handleInputChange('business', 'servicesOffered', e.target.value)}
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-700 font-bold focus:outline-none focus:border-[#097DDD] focus:ring-4 focus:ring-[#097DDD]/10 transition-all placeholder:text-slate-400"
                    placeholder="e.g. Emergency repairs, Hot water, Gas fitting"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Website URL</label>
                  <div className="relative">
                    <Globe className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      value={formData.business.website}
                      onChange={(e) => handleInputChange('business', 'website', e.target.value)}
                      className="w-full pl-12 pr-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-700 font-bold focus:outline-none focus:border-[#097DDD] focus:ring-4 focus:ring-[#097DDD]/10 transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Years in Business</label>
                  <input
                    type="text"
                    value={formData.business.yearsInBusiness}
                    onChange={(e) => handleInputChange('business', 'yearsInBusiness', e.target.value)}
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-700 font-bold focus:outline-none focus:border-[#097DDD] focus:ring-4 focus:ring-[#097DDD]/10 transition-all"
                  />
                </div>
              </div>
            </div>

            <hr className="border-slate-100 my-10" />

            {/* 2. Contact Information Section */}
            <div className="mb-12">
              <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-3">
                <User className="text-[#097DDD]" size={24} /> Contact Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">First Name</label>
                  <div className="relative">
                    <User className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      value={formData.contact.firstName}
                      onChange={(e) => handleInputChange('contact', 'firstName', e.target.value)}
                      className="w-full pl-12 pr-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-700 font-bold focus:outline-none focus:border-[#097DDD] focus:ring-4 focus:ring-[#097DDD]/10 transition-all placeholder:text-slate-400"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Last Name</label>
                  <div className="relative">
                    <User className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      value={formData.contact.lastName}
                      onChange={(e) => handleInputChange('contact', 'lastName', e.target.value)}
                      className="w-full pl-12 pr-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-700 font-bold focus:outline-none focus:border-[#097DDD] focus:ring-4 focus:ring-[#097DDD]/10 transition-all placeholder:text-slate-400"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="email"
                      value={formData.contact.email}
                      onChange={(e) => handleInputChange('contact', 'email', e.target.value)}
                      className="w-full pl-12 pr-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-700 font-bold focus:outline-none focus:border-[#097DDD] focus:ring-4 focus:ring-[#097DDD]/10 transition-all placeholder:text-slate-400"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      value={formData.contact.phone}
                      onChange={(e) => handleInputChange('contact', 'phone', e.target.value)}
                      className="w-full pl-12 pr-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-700 font-bold focus:outline-none focus:border-[#097DDD] focus:ring-4 focus:ring-[#097DDD]/10 transition-all placeholder:text-slate-400"
                    />
                  </div>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Address</label>
                  <div className="relative">
                    <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      value={formData.contact.address}
                      onChange={(e) => handleInputChange('contact', 'address', e.target.value)}
                      className="w-full pl-12 pr-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-700 font-bold focus:outline-none focus:border-[#097DDD] focus:ring-4 focus:ring-[#097DDD]/10 transition-all placeholder:text-slate-400"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">City</label>
                  <input
                    type="text"
                    value={formData.contact.city}
                    onChange={(e) => handleInputChange('contact', 'city', e.target.value)}
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-700 font-bold focus:outline-none focus:border-[#097DDD] focus:ring-4 focus:ring-[#097DDD]/10 transition-all placeholder:text-slate-400"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">State & Postcode</label>
                  <div className="flex gap-4">
                    <input
                      type="text"
                      value={formData.contact.state}
                      onChange={(e) => handleInputChange('contact', 'state', e.target.value)}
                      className="w-1/2 px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-700 font-bold focus:outline-none focus:border-[#097DDD] focus:ring-4 focus:ring-[#097DDD]/10 transition-all placeholder:text-slate-400"
                    />
                    <input
                      type="text"
                      value={formData.contact.postcode}
                      onChange={(e) => handleInputChange('contact', 'postcode', e.target.value)}
                      className="w-1/2 px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-700 font-bold focus:outline-none focus:border-[#097DDD] focus:ring-4 focus:ring-[#097DDD]/10 transition-all placeholder:text-slate-400"
                    />
                  </div>
                </div>
              </div>
            </div>

            <hr className="border-slate-100 my-10" />

            {/* 3. Descriptions Section */}
            <div className="mb-12">
              <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-3">
                <FileText className="text-[#097DDD]" size={24} /> Profile Descriptions
              </h3>
              <div className="space-y-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1 block">Short Description</label>
                  <p className="text-xs text-slate-400 mb-2 ml-1">A brief summary of what your business does (max 150 chars).</p>
                  <textarea
                    value={formData.description.shortDescription}
                    onChange={(e) => handleInputChange('description', 'shortDescription', e.target.value)}
                    rows={2}
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-700 font-bold focus:outline-none focus:border-[#097DDD] focus:ring-4 focus:ring-[#097DDD]/10 transition-all resize-none"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1 block">Detailed Writeup / About Us</label>
                  <p className="text-xs text-slate-400 mb-2 ml-1">Provide a comprehensive description of your services, history, and why customers should choose you.</p>
                  <textarea
                    value={formData.description.longDescription}
                    onChange={(e) => handleInputChange('description', 'longDescription', e.target.value)}
                    rows={8}
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-700 font-medium focus:outline-none focus:border-[#097DDD] focus:ring-4 focus:ring-[#097DDD]/10 transition-all resize-y"
                  />
                </div>
              </div>
            </div>

            <hr className="border-slate-100 my-10" />

            {/* 4. Gallery Section */}
            <div>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                  <h3 className="text-xl font-black text-slate-800 flex items-center gap-3">
                    <ImageIcon className="text-[#097DDD]" size={24} /> Job Images
                  </h3>
                  <p className="text-sm text-slate-500 mt-2">Upload images of your past work to showcase on your profile.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {formData.gallery.map((image) => (
                  <div key={image.id} className="relative group rounded-3xl overflow-hidden aspect-video border border-slate-200">
                    <img src={image.url} alt={image.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-4">
                      <div className="flex justify-end">
                        <button className="bg-red-500 hover:bg-red-600 text-white p-3 rounded-xl transition-colors shadow-lg">
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <div>
                        <p className="text-white font-bold text-sm truncate">{image.title}</p>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Upload Placeholder */}
                <div className="rounded-3xl border-2 border-dashed border-slate-300 bg-slate-50 aspect-video flex flex-col items-center justify-center cursor-pointer hover:bg-blue-50 hover:border-blue-300 hover:text-[#097DDD] transition-all group">
                  <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Camera className="w-6 h-6 text-slate-400 group-hover:text-[#097DDD]" />
                  </div>
                  <p className="text-[11px] font-black text-slate-600 group-hover:text-[#097DDD] uppercase tracking-widest">Upload New</p>
                  <p className="text-[10px] text-slate-400 mt-2">Drag & drop or click</p>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => handleSave('Business Profile')}
                className="bg-[#097DDD] hover:bg-[#0869bb] text-white px-10 py-4 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all flex items-center gap-3 shadow-lg shadow-[#097DDD]/20"
              >
                <Save size={16} /> Save All Changes
              </button>
            </div>
          </motion.div>
        );

      case 'security':
        return (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8 bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-3">
              <ShieldCheck className="text-[#097DDD]" size={24} /> Security Center
            </h3>
            <div className="max-w-md space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Current Password</label>
                <div className="relative">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="password"
                    placeholder="Enter current password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full pl-12 pr-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-700 font-bold focus:outline-none focus:border-[#097DDD] focus:ring-4 focus:ring-[#097DDD]/10 transition-all"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">New Password</label>
                <div className="relative">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="password"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full pl-12 pr-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-700 font-bold focus:outline-none focus:border-[#097DDD] focus:ring-4 focus:ring-[#097DDD]/10 transition-all"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Confirm New Password</label>
                <div className="relative">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="password"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-12 pr-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-700 font-bold focus:outline-none focus:border-[#097DDD] focus:ring-4 focus:ring-[#097DDD]/10 transition-all"
                  />
                </div>
              </div>
            </div>
            <div className="pt-8 border-t border-slate-100 flex justify-start">
              <button
                onClick={() => handleSave('Password')}
                className="bg-[#097DDD] hover:bg-[#0869bb] text-white px-10 py-4 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all flex items-center gap-3 shadow-lg shadow-[#097DDD]/20"
              >
                <Lock size={16} /> Update Password
              </button>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden">
      {/* Sidebar - Matching Admin Design */}
      <aside className="w-[280px] bg-[#0D1F43] flex flex-col relative z-50">
        <div className="p-8 mb-4">
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <img src={logo} className="h-8 w-auto brightness-200" alt="Logo" />
            <div className="flex flex-col">
              <span className="text-white text-[10px] font-black tracking-[0.2em] uppercase leading-none">MyLocalPro</span>
              <span className="text-[#097DDD] text-[8px] font-black tracking-[0.3em] uppercase">Tradie Command</span>
            </div>
          </Link>
        </div>

        <nav className="flex-grow px-4 space-y-1">
          <p className="px-6 text-[8px] font-black text-white/20 uppercase tracking-[0.3em] mb-4">Account Overview</p>
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-4 px-6 py-3.5 rounded-2xl transition-all group relative ${isActive
                    ? 'bg-gradient-to-r from-[#097DDD] to-blue-600 text-white shadow-lg shadow-[#097DDD]/30'
                    : 'text-white/40 hover:bg-white/5 hover:text-white'
                  }`}
              >
                <tab.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                <span className="text-[13px] font-bold tracking-tight">{tab.name}</span>
              </button>
            );
          })}
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
        {/* Top Header */}
        <header className="h-20 bg-white border-b border-slate-100 px-12 flex items-center justify-end sticky top-0 z-40">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-[11px] font-black text-slate-900 uppercase tracking-tight">{formData.contact.firstName} {formData.contact.lastName}</p>
                <p className="text-[9px] text-[#097DDD] font-black uppercase tracking-widest">Tradie Profile</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-[#097DDD] flex items-center justify-center text-white font-black text-lg border-2 border-slate-100 shadow-sm">
                {formData.contact.firstName[0]}
              </div>
            </div>
          </div>
        </header>

        <div className="p-12 lg:p-14 max-w-7xl mx-auto">
          {/* Dashboard Header */}
          <div className="mb-12">
            <p className="text-[10px] font-black text-[#097DDD] uppercase tracking-[0.3em] mb-2">Tradie Active</p>
            <h1 className="text-3xl font-black text-[#0D1F43] tracking-tight mb-2">Business Command Center</h1>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Manage your tradie profile, services and platform interactions</p>
          </div>

          <AnimatePresence mode="wait">
            {renderContent()}
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

export default TradieDashboard;