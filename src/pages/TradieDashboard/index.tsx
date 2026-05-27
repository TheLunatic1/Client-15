/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Briefcase, LogOut,
  AlertCircle,
  LayoutDashboard,
  Plus, Trash2, MapPin, CheckCircle, Clock, ShieldCheck, Lock, Edit2,
  Menu, X, ChevronLeft, ChevronRight
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';
import Swal from 'sweetalert2';
// @ts-ignore
import logo from '../../assets/WhatsApp_Image_2026-05-14_at_11.37.20_AM__1_-removebg-preview.png';
import axiosClient from '../../api/axios';
import LoadingScreen from '../../components/common/LoadingScreen';
import { NotificationBell } from '../../components/common/NotificationBell';
import DashboardProfileChip from '../../components/common/DashboardProfileChip';
import UserProfileSection from '../Admin/sections/user/UserProfileSection';
import BusinessEditModal, { type BusinessEditForm } from './BusinessEditModal';
import { getMyListings } from '../../api/businessApi';
import { getProfile } from '../../api/userApi';
import { resolveAvatarUrl, syncProfileCache } from '../../utils/profileUtils';
import {
  validatePasswordChange,
  showValidationAlert,
  PASSWORD_REQUIREMENTS_HINT,
} from '../../utils/validation';

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
  businessesList: [] as Array<{
    id: string;
    name: string;
    category: string;
    status: string;
    location: string;
    image: string;
  }>,
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

const formatBusinessStatus = (status: string) => {
  if (status === 'pending_delete') return 'Pending Delete';
  return status.charAt(0).toUpperCase() + status.slice(1);
};

const businessToEditForm = (b: any): BusinessEditForm => ({
  businessName: b.businessName || '',
  abn: b.abn || '',
  category: b.category || '',
  location: b.location || '',
  suburb: b.suburb || '',
  servicesOffered: b.servicesOffered || '',
  website: b.website || '',
  yearsInBusiness: b.yearsInBusiness || '',
  shortDescription: b.shortDescription || '',
  longDescription: b.longDescription || '',
  contactPhone: b.contactPhone || '',
  contactEmail: b.contactEmail || '',
});

const TradieDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('overview');
  const [formData, setFormData] = useState(initialData);
  const [listings, setListings] = useState<any[]>([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editBusinessId, setEditBusinessId] = useState<string | null>(null);
  const [editBusinessName, setEditBusinessName] = useState('');
  const [editBusinessStatus, setEditBusinessStatus] = useState('');
  const [editFormData, setEditFormData] = useState<BusinessEditForm | null>(null);
  const [editBusinessLogo, setEditBusinessLogo] = useState('');
  const [editBusinessGallery, setEditBusinessGallery] = useState<any[]>([]);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [profileData, setProfileData] = useState({
    name: 'Tradie',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    avatar: resolveAvatarUrl('Tradie', ''),
    location: 'Australia',
    roleLabel: 'Tradie Account',
  });

  // Security Center States
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const mapListingsToCards = (businesses: any[]) =>
    businesses.map((b: any) => ({
      id: b._id,
      name: b.businessName,
      category: b.category,
      status: formatBusinessStatus(b.status),
      location: b.location,
      image:
        b.gallery && b.gallery.length > 0
          ? b.gallery[0].url
          : 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&q=80&w=800',
    }));

  const refreshListings = async () => {
    const businesses = await getMyListings();
    setListings(businesses);
    setFormData((prev) => ({
      ...prev,
      businessesList: mapListingsToCards(businesses),
    }));
  };

  const openEditBusiness = (id: string) => {
    const biz = listings.find((b) => b._id === id);
    if (!biz) return;
    setEditBusinessId(biz._id);
    setEditBusinessName(biz.businessName);
    setEditBusinessStatus(formatBusinessStatus(biz.status));
    setEditFormData(businessToEditForm(biz));
    setEditBusinessLogo(biz.logo || '');
    setEditBusinessGallery(biz.gallery || []);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditBusinessId(null);
    setEditFormData(null);
    setEditBusinessLogo('');
    setEditBusinessGallery([]);
  };

  useEffect(() => {
    const tabFromState = (location.state as { activeTab?: string } | null)?.activeTab;
    if (tabFromState === 'business') {
      setActiveTab('my-businesses');
    } else if (tabFromState) {
      setActiveTab(tabFromState);
    }

    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [profileRes, , businesses] = await Promise.all([
          axiosClient.get('/api/users/profile'),
          axiosClient.get('/api/stats/tradie'),
          getMyListings(),
        ]);

        const profile = profileRes.data;
        const displayName = `${profile.firstName || ''} ${profile.lastName || ''}`.trim() || 'Tradie';
        const avatar = resolveAvatarUrl(displayName, profile.profileImage);
        syncProfileCache({ name: displayName, profileImage: profile.profileImage || '' });
        setProfileData({
          name: displayName,
          firstName: profile.firstName || '',
          lastName: profile.lastName || '',
          email: profile.email || '',
          phone: profile.phone || '',
          avatar,
          location: `${profile.city ? `${profile.city}, ` : ''}${profile.state || ''}`.trim().replace(/, $/, '') || 'Australia',
          roleLabel: 'Tradie Account',
        });

        setListings(businesses);
        setFormData({
          contact: {
            firstName: profile.firstName || '',
            lastName: profile.lastName || '',
            email: profile.email || '',
            phone: profile.phone || '',
            address: profile.address || '',
            city: profile.city || '',
            state: profile.state || '',
            postcode: profile.postcode || '',
          },
          business: initialData.business,
          businessesList: mapListingsToCards(businesses),
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
    localStorage.removeItem('userProfileImage');
    navigate('/login');
  };

  const handleSave = async (section: string) => {
    try {
      if (section === 'Password') {
        const pwCheck = validatePasswordChange({
          currentPassword,
          newPassword,
          confirmPassword,
        });
        if (!pwCheck.ok) {
          if ('message' in pwCheck) {
            showValidationAlert(pwCheck.message);
          }
          return;
        }
        await axiosClient.put('/api/users/profile/password', {
          currentPassword,
          newPassword,
          confirmPassword,
        });
        setCurrentPassword(''); setNewPassword(''); setConfirmPassword('');
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

  const handleDeleteListing = async (id: string, name: string) => {
    const result = await Swal.fire({
      title: 'Request Deletion?',
      text: `Are you sure you want to request deletion of "${name}"? This listing will be sent to the administrator for final removal approval.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#f43f5e',
      cancelButtonColor: '#94a3b8',
      confirmButtonText: 'Yes, request deletion',
      cancelButtonText: 'Cancel',
      customClass: {
        popup: 'rounded-[2rem]',
        confirmButton: 'rounded-xl font-bold uppercase tracking-widest text-[10px] px-6 py-3',
        cancelButton: 'rounded-xl font-bold uppercase tracking-widest text-[10px] px-6 py-3'
      }
    });

    if (result.isConfirmed) {
      try {
        setIsLoading(true);
        const res = await axiosClient.delete(`/api/businesses/${id}`);
        
        Swal.fire({
          title: 'Requested!',
          text: res.data.message || 'Deletion request sent successfully.',
          icon: 'success',
          confirmButtonColor: '#097DDD',
          customClass: {
            popup: 'rounded-[2rem]'
          }
        });

        await refreshListings();
      } catch (err: any) {
        Swal.fire({
          title: 'Error',
          text: err.response?.data?.message || 'Failed to submit deletion request.',
          icon: 'error',
          confirmButtonColor: '#097DDD'
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const tabs = [
    { id: 'overview', name: 'Overview', icon: LayoutDashboard },
    { id: 'profile', name: 'Account Profile', icon: User },
    { id: 'my-businesses', name: 'Manage Business', icon: Briefcase },
    { id: 'security', name: 'Security Center', icon: ShieldCheck },
  ];

  const refreshProfile = async () => {
    try {
      const profile = await getProfile();
      const displayName = `${profile.firstName || ''} ${profile.lastName || ''}`.trim() || 'Tradie';
      const avatar = resolveAvatarUrl(displayName, profile.profileImage);
      syncProfileCache({ name: displayName, profileImage: profile.profileImage || '' });
      setProfileData({
        name: displayName,
        firstName: profile.firstName,
        lastName: profile.lastName,
        email: profile.email || '',
        phone: profile.phone || '',
        avatar,
        location: `${profile.city ? `${profile.city}, ` : ''}${profile.state || ''}`.trim().replace(/, $/, '') || 'Australia',
        roleLabel: 'Tradie Account',
      });
    } catch {
      /* ignore */
    }
  };

  const totalAdded = formData.businessesList.length;
  const approved = formData.businessesList.filter(b => b.status === 'Approved').length;
  const pending = formData.businessesList.filter(b => b.status === 'Pending').length;
  const rejected = formData.businessesList.filter(b => b.status === 'Rejected').length;

  const renderContent = () => {
    if (isLoading) return <LoadingScreen />;
    switch (activeTab) {
      case 'profile':
        return (
          <UserProfileSection userData={profileData} onUpdate={refreshProfile} />
        );

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
        const hasBusiness = formData.businessesList.length > 0;
        const biz = hasBusiness ? formData.businessesList[0] : null;

        return (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8 bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black text-slate-800">Manage Business</h3>
              {!hasBusiness && (
                <button onClick={() => navigate('/list-your-business')} className="bg-[#097DDD] hover:bg-[#0869bb] text-white px-6 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all flex items-center gap-2 shadow-lg shadow-[#097DDD]/20">
                  <Plus size={14} /> Add Business
                </button>
              )}
            </div>
            
            {!hasBusiness ? (
              <div className="text-center py-16 rounded-2xl border border-dashed border-slate-200 bg-slate-50">
                <Briefcase className="mx-auto text-slate-300 mb-4" size={40} />
                <p className="font-bold text-slate-600 mb-2">No business listed yet</p>
                <p className="text-sm text-slate-400 mb-6">Add your business to get started.</p>
                <button
                  onClick={() => navigate('/list-your-business')}
                  className="bg-[#097DDD] hover:bg-[#0869bb] text-white px-6 py-3 rounded-xl font-black uppercase tracking-widest text-[10px]"
                >
                  List your business
                </button>
              </div>
            ) : biz ? (
              <div className="border border-slate-200 rounded-2xl flex flex-col md:flex-row overflow-hidden bg-white shadow-sm group">
                <div className="md:w-1/3 h-64 md:h-auto bg-slate-100 relative overflow-hidden">
                  <img src={biz.image} alt={biz.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <span className={`absolute top-4 right-4 text-[9px] font-black uppercase tracking-wider px-3 py-1.5 rounded-lg shadow-lg backdrop-blur-md ${
                    biz.status.toLowerCase().includes('approved') ? 'bg-emerald-500/90 text-white' :
                    biz.status.toLowerCase().includes('rejected') ? 'bg-rose-500/90 text-white' :
                    biz.status.toLowerCase().includes('delete') ? 'bg-rose-500/90 text-white' :
                    'bg-amber-500/90 text-white'
                  }`}>
                    {biz.status}
                  </span>
                </div>
                <div className="p-8 md:w-2/3 flex flex-col justify-center">
                  <h4 className="font-black text-slate-800 text-3xl mb-2">{biz.name}</h4>
                  <p className="text-sm text-[#097DDD] mb-4 font-bold uppercase tracking-wider">{biz.category}</p>
                  <p className="text-sm text-slate-500 flex items-center gap-2 mb-6"><MapPin size={16} /> {biz.location}</p>
                  
                  {biz.status === 'Rejected' && (
                    <div className="bg-rose-50 border border-rose-100 rounded-xl p-4 mb-6">
                      <p className="text-xs text-rose-600 font-bold flex items-center gap-2">
                        <AlertCircle size={16} />
                        Your business was rejected. Please edit your details and resubmit for admin approval.
                      </p>
                    </div>
                  )}

                  <div className="flex gap-4 mt-auto">
                    <button
                      onClick={() => openEditBusiness(biz.id)}
                      className="flex-grow justify-center bg-[#097DDD] hover:bg-[#0869bb] text-white text-[11px] font-black uppercase tracking-wider flex items-center gap-2 transition-all px-6 py-4 rounded-xl shadow-lg shadow-[#097DDD]/20"
                    >
                      <Edit2 size={16} /> {biz.status === 'Rejected' ? 'Edit & Resubmit' : 'Edit Business Settings'}
                    </button>
                    <button 
                      onClick={() => handleDeleteListing(biz.id, biz.name)}
                      className="text-rose-500 hover:text-white hover:bg-rose-500 text-[11px] font-black uppercase tracking-wider flex items-center gap-2 transition-colors bg-rose-50 px-6 py-4 rounded-xl border border-rose-100"
                      title="Delete business"
                    >
                      <Trash2 size={16} /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ) : null}
          </motion.div>
        );

      case 'security':
        return (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8 bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <h3 className="text-xl font-black text-slate-800 mb-2 flex items-center gap-3">
              <ShieldCheck className="text-[#097DDD]" size={24} /> Security Center
            </h3>
            <p className="text-slate-500 text-sm mb-6 max-w-md">{PASSWORD_REQUIREMENTS_HINT}</p>
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
                <span className="text-[#097DDD] text-[8px] font-black tracking-[0.3em] uppercase">Tradie Command</span>
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
        </nav>

        <div className="p-8 border-t border-white/5 mt-auto">
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

      {/* Main Content Area */}
      <main className="flex-grow overflow-y-auto custom-scrollbar">
        {/* Top Header */}
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
              name={profileData.name}
              avatar={profileData.avatar}
              subtitle="Tradie Profile"
              onGoToProfile={() => setActiveTab('profile')}
              onGoToSecurity={() => setActiveTab('security')}
            />
          </div>
        </header>

        <div className="p-6 sm:p-8 lg:p-14 max-w-7xl mx-auto">
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

      <BusinessEditModal
        isOpen={isEditModalOpen}
        businessId={editBusinessId}
        businessName={editBusinessName}
        status={editBusinessStatus}
        initialData={editFormData}
        logo={editBusinessLogo}
        gallery={editBusinessGallery}
        onClose={closeEditModal}
        onSaved={refreshListings}
      />

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