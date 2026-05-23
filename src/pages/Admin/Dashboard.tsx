/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-hooks/immutability */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';
import { motion, AnimatePresence } from 'framer-motion';
import { createCategory, deleteCategory, updateCategory, getCategories } from '../../api/categoryApi';
import { createLocation, deleteLocation, updateLocation } from '../../api/locationApi';
import { getBlogs, createBlog, updateBlog, deleteBlog as apiDeleteBlog } from '../../api/blogApi';
import { uploadImage } from '../../api/uploadApi';
import { getAdminAllBusinesses, updateBusinessStatus, adminDeleteBusiness } from '../../api/businessApi';
import { getAdminStats } from '../../api/statsApi';
import axiosClient from '../../api/axios';
import {
  LayoutDashboard, Users, Briefcase, Settings, LayoutGrid,
  LogOut, Shield, MapPin, FileText, Clock, Gift,
  Camera, Upload, X, Menu, ChevronLeft, ChevronRight
} from 'lucide-react';
import logo from '../../assets/WhatsApp_Image_2026-05-14_at_11.37.20_AM__1_-removebg-preview.png';
import { NotificationBell } from '../../components/common/NotificationBell';
import DashboardProfileChip from '../../components/common/DashboardProfileChip';
import { getProfile } from '../../api/userApi';
import { resolveAvatarUrl, syncProfileCache } from '../../utils/profileUtils';
import {
  validateLogin,
  validateBlogForm,
  validateCategoryForm,
  validateLocationForm,
  showValidationAlert,
} from '../../utils/validation';

// Section Imports
import OverviewSection from './sections/OverviewSection';
import ListingsSection from './sections/ListingsSection';
import SubmissionsSection from './sections/SubmissionsSection';
import BlogSection from './sections/BlogSection';
import CategorySection from './sections/CategorySection';
import LocationSection from './sections/LocationSection';
import GiveawaySection from './sections/GiveawaySection';
import UsersSection from './sections/UsersSection';
import UserProfileSection from './sections/user/UserProfileSection';
import UserSecuritySection from './sections/user/UserSecuritySection';

// Chart palette for category pie chart
const CHART_COLORS = ['#097DDD', '#6ab4f5', '#0D1F43', '#e2e8f0', '#94a3b8', '#60a5fa', '#34d399', '#f59e0b', '#f87171', '#a78bfa'];


const AdminDashboard = () => {
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [settingsTab, setSettingsTab] = useState('profile');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // ── Business state (from API) ──────────────────────────────────
  const [professionals, setProfessionals] = useState<any[]>([]);
  const [pendingSubmissions, setPendingSubmissions] = useState<any[]>([]);
  const [businessLoading, setBusinessLoading] = useState(false);

  // ── Stats state (from API) ─────────────────────────────────────
  const [adminStats, setAdminStats] = useState<any>(null);
  const [statsLoading, setStatsLoading] = useState(false);

  // ── Chart data state (driven by API) ──────────────────────────
  const [signupData, setSignupData] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [locationData, setLocationData] = useState<any[]>([]);
  const [totalCategories, setTotalCategories] = useState<number | undefined>(undefined);
  const [totalLocations, setTotalLocations] = useState<number | undefined>(undefined);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  // ── Auth: restore session on mount ────────────────────────────
  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const userRole = localStorage.getItem('userRole');
    if (loggedIn && userRole === 'admin') {
      setIsLoggedIn(true);
    }
  }, []);

  // ── Fetch businesses & stats when logged in ────────────────────
  useEffect(() => {
    if (!isLoggedIn) return;
    fetchBusinesses();
    fetchStats();
  }, [isLoggedIn]);

  const fetchBusinesses = async () => {
    setBusinessLoading(true);
    try {
      const all = await getAdminAllBusinesses();
      setProfessionals(all.filter((b: any) => b.status === 'approved'));
      setPendingSubmissions(all.filter((b: any) => b.status === 'pending' || b.status === 'pending_delete'));

      // Build recent activity from latest business events
      const recent = [...all]
        .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 6)
        .map((b: any) => ({
          text: b.status === 'pending'
            ? `New submission: ${b.businessName}`
            : b.status === 'approved'
            ? `Approved: ${b.businessName}`
            : `Rejected: ${b.businessName}`,
          time: b.createdAt
            ? new Date(b.createdAt).toLocaleDateString('en-AU', { day: 'numeric', month: 'short' })
            : 'Recently',
          type: b.status === 'pending' ? 'add' : b.status === 'approved' ? 'approve' : 'business',
        }));
      setRecentActivity(recent);
    } catch (err) {
      console.error('Failed to fetch businesses:', err);
    } finally {
      setBusinessLoading(false);
    }
  };

  const fetchStats = async () => {
    setStatsLoading(true);
    try {
      const { getLocations } = await import('../../api/locationApi');
      const [data, cats, locs] = await Promise.all([
        getAdminStats(),
        getCategories(),
        getLocations(),
      ]);

      setAdminStats(data);

      // Category & location counts from their own endpoints
      setTotalCategories(Array.isArray(cats) ? cats.length : 0);
      setTotalLocations(Array.isArray(locs) ? locs.length : 0);

      // Wire chart data from backend response
      if (Array.isArray(data?.charts?.signups) && data.charts.signups.length > 0) {
        setSignupData(data.charts.signups);
      }
      if (Array.isArray(data?.charts?.categories) && data.charts.categories.length > 0) {
        setCategoryData(
          data.charts.categories.map((c: any, i: number) => ({
            ...c,
            color: CHART_COLORS[i % CHART_COLORS.length],
          }))
        );
      }
      if (Array.isArray(data?.charts?.locations) && data.charts.locations.length > 0) {
        setLocationData(data.charts.locations);
      }
    } catch (err) {
      console.warn('Stats endpoint unavailable, using computed counts.');
    } finally {
      setStatsLoading(false);
    }
  };
  
  // Blog Management State
  const [blogsRefreshKey, setBlogsRefreshKey] = useState(0);
  const [blogs, setBlogs] = useState<any[]>([]);
  const [categoriesList, setCategoriesList] = useState<any[]>([]);
  const [blogImageUploading, setBlogImageUploading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [blogsData, catsData] = await Promise.all([getBlogs(), getCategories()]);

        if (Array.isArray(catsData)) {
          setCategoriesList(catsData);
        }

        const mappedBlogs = blogsData.map((b: any) => {
          // Always coerce _id to a plain string so it's safe to use in URLs
          const rawId = b._id?.$oid || b._id?.toString?.() || String(b._id || '');
          const rawCatId = typeof b.category === 'object' && b.category
            ? (b.category._id?.$oid || b.category._id?.toString?.() || String(b.category._id || ''))
            : String(b.category || '');
          return {
            ...b,
            _id: rawId,
            categoryId: rawCatId,
            date: b.createdAt
              ? new Date(b.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
              : 'Unknown',
            publisher: b.writer || 'System Admin',
            category: typeof b.category === 'object' && b.category
              ? b.category.name
              : b.category || 'Uncategorized',
          };
        });
        setBlogs(mappedBlogs);
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };
    fetchData();
  }, [blogsRefreshKey]);

  const [isBlogModalOpen, setIsBlogModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<any>(null);
  const [blogForm, setBlogForm] = useState({
    title: '',
    category: '',
    image: '',      // always a URL string — never base64
    excerpt: '',
    content: '',
    publisher: '',
  });

  const handleOpenBlogModal = (blog: any = null) => {
    // If blog is an Event, ignore it (it means we clicked 'Create New')
    const isEvent = blog && (blog.nativeEvent || blog.target || typeof blog.preventDefault === 'function');
    const targetBlog = isEvent ? null : blog;

    if (targetBlog) {
      setEditingBlog(targetBlog);
      setBlogForm({
        title: targetBlog.title || '',
        category: targetBlog.categoryId || '',
        image: targetBlog.image || '',
        excerpt: targetBlog.excerpt || '',
        content: targetBlog.content || '',
        publisher: targetBlog.publisher || 'System Admin',
      });
    } else {
      setEditingBlog(null);
      setBlogForm({
        title: '',
        category: categoriesList.length > 0 ? (categoriesList[0]._id || categoriesList[0].id) : '',
        image: '',
        excerpt: '',
        content: '',
        publisher: 'System Admin',
      });
    }
    setIsBlogModalOpen(true);
  };

  // Upload image file to server → get back a URL, store in form
  const handleBlogImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setBlogImageUploading(true);
      const url = await uploadImage(file);
      setBlogForm(prev => ({ ...prev, image: url }));
    } catch (err: any) {
      Swal.fire('Upload Failed', err?.response?.data?.message || 'Could not upload image.', 'error');
    } finally {
      setBlogImageUploading(false);
    }
  };

  const handleSaveBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    const check = validateBlogForm({
      title: blogForm.title,
      category: blogForm.category,
      excerpt: blogForm.excerpt,
      content: blogForm.content,
      image: blogForm.image,
      writer: blogForm.publisher,
    });
    if (!check.ok) {
      showValidationAlert(check.message);
      return;
    }
    try {
      const payload = {
        title: blogForm.title,
        category: blogForm.category,
        image: blogForm.image,   // URL from upload API
        excerpt: blogForm.excerpt,
        content: blogForm.content,
        writer: blogForm.publisher,
      };
      if (editingBlog) {
        // Use _id — guaranteed to exist from the mapping above
        const blogId = editingBlog._id;
        await updateBlog(blogId, payload);
        Swal.fire('Updated!', 'Blog post has been updated.', 'success');
      } else {
        await createBlog(payload);
        Swal.fire('Created!', 'New blog post is now live.', 'success');
      }
      setBlogsRefreshKey(prev => prev + 1);
      setIsBlogModalOpen(false);
    } catch (err: any) {
      Swal.fire('Error', err?.response?.data?.message || err?.message || 'Unable to save blog.', 'error');
    }
  };

  const deleteBlog = async (id: string | number) => {    if (!id || id === 'undefined') {
      Swal.fire('Error', 'Invalid blog ID — cannot delete.', 'error');
      return;
    }
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This blog post will be permanently removed!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#097DDD',
      cancelButtonColor: '#f43f5e',
      confirmButtonText: 'Yes, delete it!',
    });

    if (result.isConfirmed) {
      try {
        await apiDeleteBlog(String(id));
        setBlogsRefreshKey(prev => prev + 1);
        Swal.fire('Deleted!', 'Post has been removed.', 'success');
      } catch (err: any) {
        Swal.fire('Error', err?.response?.data?.message || err?.message || 'Unable to delete blog.', 'error');
      }
    }
  };

  // Categories Management State
  const [categoriesRefreshKey, setCategoriesRefreshKey] = useState(0);

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [categoryForm, setCategoryForm] = useState({ name: '', slug: '' });

  // Locations Management State
  const [locationsRefreshKey, setLocationsRefreshKey] = useState(0);

  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<any>(null);
  const [locationForm, setLocationForm] = useState({ city: '', region: '' });

  const handleOpenCategoryModal = (category: any = null) => {
    if (category) {
      setEditingCategory(category);
      setCategoryForm({ name: category.name, slug: category.slug });
    } else {
      setEditingCategory(null);
      setCategoryForm({ name: '', slug: '' });
    }
    setIsCategoryModalOpen(true);
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    const check = validateCategoryForm(categoryForm);
    if (!check.ok) {
      showValidationAlert(check.message);
      return;
    }
    try {
      if (editingCategory) {
        await updateCategory(String(editingCategory.id), categoryForm);
        Swal.fire('Updated!', 'Category has been updated.', 'success');
      } else {
        await createCategory(categoryForm);
        Swal.fire('Added!', 'New category has been created.', 'success');
      }
      setIsCategoryModalOpen(false);
      setEditingCategory(null);
      setCategoryForm({ name: '', slug: '' });
      setCategoriesRefreshKey((prev) => prev + 1);
    } catch (err: any) {
      Swal.fire('Error', err?.response?.data?.message || err?.message || 'Unable to save category.', 'error');
    }
  };

  const handleDeleteCategory = async (id: number | string) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "This category and its settings will be permanently removed!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#097DDD',
      cancelButtonColor: '#f43f5e',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        await deleteCategory(String(id));
        setCategoriesRefreshKey((prev) => prev + 1);
        Swal.fire('Deleted!', 'Category has been removed.', 'success');
      } catch (err: any) {
        Swal.fire('Error', err?.response?.data?.message || err?.message || 'Unable to delete category.', 'error');
      }
    }
  };

  const handleOpenLocationModal = (location: any = null) => {
    if (location) {
      setEditingLocation(location);
      setLocationForm({ city: location.city, region: location.region });
    } else {
      setEditingLocation(null);
      setLocationForm({ city: '', region: '' });
    }
    setIsLocationModalOpen(true);
  };

  const handleSaveLocation = async (e: React.FormEvent) => {
    e.preventDefault();
    const check = validateLocationForm(locationForm);
    if (!check.ok) {
      showValidationAlert(check.message);
      return;
    }
    try {
      if (editingLocation) {
        await updateLocation(String(editingLocation.id), locationForm);
        Swal.fire('Updated!', 'Location has been updated.', 'success');
      } else {
        await createLocation(locationForm);
        Swal.fire('Added!', 'New location has been created.', 'success');
      }
      setIsLocationModalOpen(false);
      setEditingLocation(null);
      setLocationForm({ city: '', region: '' });
      setLocationsRefreshKey((prev) => prev + 1);
    } catch (err: any) {
      Swal.fire('Error', err?.response?.data?.message || err?.message || 'Unable to save location.', 'error');
    }
  };

  const handleDeleteLocation = async (id: number | string) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "This location and its coverage settings will be permanently removed!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#097DDD',
      cancelButtonColor: '#f43f5e',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        await deleteLocation(String(id));
        setLocationsRefreshKey((prev) => prev + 1);
        Swal.fire('Deleted!', 'Location has been removed.', 'success');
      } catch (err: any) {
        Swal.fire('Error', err?.response?.data?.message || err?.message || 'Unable to delete location.', 'error');
      }
    }
  };

  const [adminProfile, setAdminProfile] = useState({
    name: 'Admin',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    avatar: resolveAvatarUrl('Admin', ''),
    location: 'Australia',
    roleLabel: 'Administrator',
  });

  const fetchAdminProfile = async () => {
    try {
      const user = await getProfile();
      const displayName = `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Admin';
      const avatar = resolveAvatarUrl(displayName, user.profileImage);
      syncProfileCache({ name: displayName, profileImage: user.profileImage || '' });
      setAdminProfile({
        name: displayName,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email || '',
        phone: user.phone || '',
        avatar,
        location: `${user.city ? `${user.city}, ` : ''}${user.state || ''}`.trim().replace(/, $/, '') || 'Australia',
        roleLabel: 'Administrator',
      });
    } catch {
      /* keep defaults */
    }
  };

  useEffect(() => {
    const state = location.state as { activeTab?: string; settingsTab?: string } | null;
    if (state?.activeTab) setActiveTab(state.activeTab);
    if (state?.settingsTab) setSettingsTab(state.settingsTab);
  }, [location.state]);

  useEffect(() => {
    if (isLoggedIn) fetchAdminProfile();
  }, [isLoggedIn]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const check = validateLogin(email, password);
    if (!check.ok) {
      showValidationAlert(check.message);
      return;
    }
    try {
      const res = await axiosClient.post('/api/users/login', { email, password });
      const user = res.data;
      if (user.role !== 'admin') {
        Swal.fire({
          title: 'Access Denied',
          text: 'This account does not have admin privileges.',
          icon: 'warning',
          confirmButtonColor: '#0D1F43'
        });
        return;
      }
      localStorage.setItem('token', user.token);
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userRole', 'admin');
      localStorage.setItem('userName', user.name);
      localStorage.setItem('userEmail', user.email);
      if (user.profileImage) {
        localStorage.setItem('userProfileImage', user.profileImage);
      } else {
        localStorage.removeItem('userProfileImage');
      }
      setIsLoggedIn(true);
      fetchAdminProfile();
    } catch (err: any) {
      Swal.fire({
        title: 'Authentication Error',
        text: err?.response?.data?.message || 'Invalid credentials. Access denied.',
        icon: 'warning',
        confirmButtonColor: '#0D1F43'
      });
    }
  };

  const approveBusiness = async (id: string) => {
    try {
      await updateBusinessStatus(id, 'approved');
      setPendingSubmissions(prev => prev.filter(p => (p._id || p.id) !== id));
      await fetchBusinesses();
      await fetchStats();
      Swal.fire('Approved!', 'Business is now live.', 'success');
    } catch (err: any) {
      Swal.fire('Error', err?.response?.data?.message || 'Unable to approve.', 'error');
    }
  };

  const rejectBusiness = async (id: string, rejectionReason: string) => {
    try {
      await updateBusinessStatus(id, 'rejected', rejectionReason);
      setPendingSubmissions(prev => prev.filter(p => (p._id || p.id) !== id));
      await fetchStats();
      Swal.fire('Rejected', 'The tradie has been notified with your rejection message.', 'info');
    } catch (err: any) {
      Swal.fire('Error', err?.response?.data?.message || 'Unable to reject.', 'error');
    }
  };

  const approveDeletion = async (id: string) => {
    try {
      await adminDeleteBusiness(id);
      setPendingSubmissions(prev => prev.filter(p => (p._id || p.id) !== id));
      await fetchBusinesses();
      await fetchStats();
      Swal.fire('Deleted!', 'Business has been deleted from the database.', 'success');
    } catch (err: any) {
      Swal.fire('Error', err?.response?.data?.message || 'Unable to delete.', 'error');
    }
  };

  const rejectDeletion = async (id: string) => {
    try {
      await updateBusinessStatus(id, 'approved');
      setPendingSubmissions(prev => prev.filter(p => (p._id || p.id) !== id));
      await fetchBusinesses();
      await fetchStats();
      Swal.fire('Restored!', 'Listing is kept active and approved.', 'success');
    } catch (err: any) {
      Swal.fire('Error', err?.response?.data?.message || 'Unable to restore.', 'error');
    }
  };

  const removeBusiness = async (id: string) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This listing will be permanently removed!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#097DDD',
      cancelButtonColor: '#f43f5e',
      confirmButtonText: 'Yes, delete it!'
    });
    if (!result.isConfirmed) return;
    try {
      await adminDeleteBusiness(id);
      setProfessionals(prev => prev.filter(p => (p._id || p.id) !== id));
      await fetchStats();
      Swal.fire('Deleted', 'Listing has been removed.', 'success');
    } catch (err: any) {
      Swal.fire('Error', err?.response?.data?.message || 'Unable to delete.', 'error');
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050F26] px-4 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/10 blur-[150px] rounded-full -mr-[400px] -mt-[400px]" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#097DDD]/10 blur-[120px] rounded-full -ml-[300px] -mb-[300px]" />

        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="w-full max-w-md bg-white/5 backdrop-blur-2xl border border-white/10 p-12 rounded-[3rem] shadow-2xl relative z-10"
        >
          <div className="text-center mb-10">
            <div className="w-20 h-20 bg-[#097DDD] rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-blue-500/20">
              <Shield className="w-10 h-10 text-white" strokeWidth={2.5} />
            </div>
            <h1 className="text-2xl font-black text-white mb-2 tracking-tight">Super Admin</h1>
            <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.3em]">Restricted Access Area</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">Admin Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-white/10 focus:outline-none focus:border-[#097DDD] transition-all text-sm font-medium"
                placeholder="admin@mylocalpro.com.au"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">Secret Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-white/10 focus:outline-none focus:border-[#097DDD] transition-all text-sm font-medium"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-[#097DDD] hover:bg-[#0869bb] text-white font-black py-5 rounded-2xl transition-all shadow-xl shadow-blue-500/20 uppercase tracking-[0.2em] text-[10px]"
            >
              Authorized Login
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

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
                <span className="text-white text-[11px] font-black tracking-[0.2em] uppercase leading-none">MyLocalPro</span>
                <span className="text-primary text-[10px] font-black tracking-[0.3em] uppercase">Super Admin</span>
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

        <nav className="flex-grow px-4 space-y-1 overflow-y-auto">
          {(!isSidebarCollapsed || isMobileSidebarOpen) && (
            <p className="px-6 text-[10px] font-black text-white/20 uppercase tracking-[0.3em] mb-4">Management</p>
          )}
          {[
            { id: 'overview', name: 'Overview', icon: LayoutDashboard },
            { id: 'active', name: 'Business Listings', icon: Briefcase },
            { id: 'submissions', name: 'Pending Approvals', icon: Clock, badge: pendingSubmissions.length || 0 },
            { id: 'blogs', name: 'Blog Manager', icon: FileText },
            { id: 'giveaway', name: 'Giveaway', icon: Gift },
            { id: 'categories', name: 'Categories', icon: LayoutGrid },
            { id: 'locations', name: 'Locations', icon: MapPin },
            { id: 'users', name: 'Users / Tradies', icon: Users },
            { id: 'settings', name: 'Settings', icon: Settings },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => { setActiveTab(item.id); setIsMobileSidebarOpen(false); }}
              title={isSidebarCollapsed && !isMobileSidebarOpen ? item.name : undefined}
              className={`w-full flex items-center justify-between px-6 py-3.5 rounded-2xl transition-all group relative ${
                activeTab === item.id
                  ? 'bg-gradient-to-r from-primary to-blue-600 text-white shadow-lg shadow-primary/30'
                  : 'text-white/40 hover:bg-white/5 hover:text-white'
              }`}
            >
              <div className={`flex items-center ${isSidebarCollapsed && !isMobileSidebarOpen ? 'justify-center w-full' : 'gap-4'}`}>
                <item.icon size={20} strokeWidth={activeTab === item.id ? 2.5 : 2} />
                {(!isSidebarCollapsed || isMobileSidebarOpen) && (
                  <span className="text-[13px] font-bold tracking-tight whitespace-nowrap">{item.name}</span>
                )}
              </div>
              {item.badge > 0 && (!isSidebarCollapsed || isMobileSidebarOpen) && (
                <span className={`text-[12px] font-black px-2 py-0.5 rounded-md ${activeTab === item.id ? 'bg-white/20' : 'bg-primary/20 text-primary'}`}>
                  {item.badge}
                </span>
              )}
              {item.badge > 0 && isSidebarCollapsed && !isMobileSidebarOpen && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-[#097DDD] rounded-full text-white text-[9px] font-black flex items-center justify-center">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="p-8 border-t border-white/5 mt-auto">
          <button
            onClick={() => {
              localStorage.removeItem('isLoggedIn');
              localStorage.removeItem('userRole');
              localStorage.removeItem('token');
              localStorage.removeItem('userName');
              localStorage.removeItem('userEmail');
              setIsLoggedIn(false);
              window.location.href = '/login';
            }}
            title={isSidebarCollapsed && !isMobileSidebarOpen ? 'Logout' : undefined}
            className={`w-full flex items-center ${isSidebarCollapsed && !isMobileSidebarOpen ? 'justify-center' : 'gap-4'} px-6 py-4 text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all font-black uppercase tracking-widest text-[12px]`}
          >
            <LogOut size={18} className={isSidebarCollapsed && !isMobileSidebarOpen ? 'mx-auto' : ''} />
            {(!isSidebarCollapsed || isMobileSidebarOpen) && (
              <span className="whitespace-nowrap">Logout System</span>
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
              name={adminProfile.name}
              avatar={adminProfile.avatar}
              subtitle="Administrator"
              onGoToProfile={() => {
                setActiveTab('settings');
                setSettingsTab('profile');
              }}
              onGoToSecurity={() => {
                setActiveTab('settings');
                setSettingsTab('security');
              }}
            />
          </div>
        </header>

        <div className="p-6 sm:p-8 lg:p-12">
          {/* Dashboard Header */}
          <div className="mb-12">
            <p className="text-[12px] font-black text-primary uppercase tracking-[0.3em] mb-2">Access Granted</p>
            <h1 className="text-3xl font-black text-[#0D1F43] tracking-tight mb-2">Super Admin Dashboard</h1>
            <p className="text-[12px] font-black text-slate-400 uppercase tracking-[0.2em]">Welcome back — Overview of the Tasmania Tradie Network</p>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'overview' && (
                <OverviewSection
                  signupData={signupData}
                  categoryData={categoryData}
                  locationData={locationData}
                  isLoading={statsLoading}
                  stats={{
                    totalBusinesses: adminStats?.listings?.total ?? (professionals.length + pendingSubmissions.length),
                    pendingBusinesses: adminStats?.listings?.pending ?? pendingSubmissions.length,
                    approvedBusinesses: adminStats?.listings?.approved ?? professionals.length,
                    totalCategories: totalCategories,
                    totalLocations: totalLocations,
                    totalUsers: (adminStats?.users?.total ?? 0) + (adminStats?.users?.tradies ?? 0),
                    totalBlogs: adminStats?.blogs?.total,
                    recentActivity: recentActivity,
                  }}
                />
              )}
              {activeTab === 'active' && (
                <ListingsSection
                  professionals={professionals}
                  onDelete={removeBusiness}
                  isLoading={businessLoading}
                />
              )}
              {activeTab === 'submissions' && (
                <SubmissionsSection
                  pendingSubmissions={pendingSubmissions}
                  onApprove={approveBusiness}
                  onReject={rejectBusiness}
                  onApproveDeletion={approveDeletion}
                  onRejectDeletion={rejectDeletion}
                  isLoading={businessLoading}
                />
              )}
              {activeTab === 'blogs' && <BlogSection blogs={blogs} onAdd={() => handleOpenBlogModal(null)} onEdit={handleOpenBlogModal} onDelete={deleteBlog} />}
              {activeTab === 'giveaway' && <GiveawaySection />}
              {activeTab === 'categories' && <CategorySection refreshKey={categoriesRefreshKey} onAdd={() => handleOpenCategoryModal()} onEdit={(cat) => handleOpenCategoryModal(cat)} onDelete={handleDeleteCategory} />}
              {activeTab === 'locations' && <LocationSection refreshKey={locationsRefreshKey} onAdd={() => handleOpenLocationModal()} onEdit={(loc) => handleOpenLocationModal(loc)} onDelete={handleDeleteLocation} />}
              {activeTab === 'users' && <UsersSection />}
              {activeTab === 'settings' && (
                <div className="space-y-10">
                  <div className="flex gap-4 p-1 bg-slate-100 rounded-2xl w-fit">
                    <button
                      onClick={() => setSettingsTab('profile')}
                      className={`px-8 py-3 rounded-xl text-[12px] font-black uppercase tracking-widest transition-all ${settingsTab === 'profile' ? 'bg-white text-[#0D1F43] shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                      Admin Profile
                    </button>
                    <button
                      onClick={() => setSettingsTab('security')}
                      className={`px-8 py-3 rounded-xl text-[12px] font-black uppercase tracking-widest transition-all ${settingsTab === 'security' ? 'bg-white text-[#0D1F43] shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                      Security Settings
                    </button>
                  </div>

                  <AnimatePresence mode="wait">
                    <motion.div
                      key={settingsTab}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      {settingsTab === 'profile' && (
                        <UserProfileSection userData={adminProfile} onUpdate={fetchAdminProfile} />
                      )}
                      {settingsTab === 'security' && <UserSecuritySection />}
                    </motion.div>
                  </AnimatePresence>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Blog Management Modal */}
      <AnimatePresence>
        {isBlogModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsBlogModalOpen(false)}
              className="absolute inset-0 bg-[#050f26]/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white border border-slate-200 rounded-[3rem] p-12 max-w-2xl w-full shadow-2xl relative z-10 max-h-[90vh] overflow-y-auto custom-scrollbar"
            >
              <div className="flex justify-between items-center mb-10">
                <div>
                  <h3 className="text-2xl font-black text-[#0D1F43]">{editingBlog ? 'Edit Blog Post' : 'Create New Blog'}</h3>
                  <p className="text-[12px] font-bold text-slate-400 uppercase tracking-widest mt-1">Fill in the details below</p>
                </div>
                <button onClick={() => setIsBlogModalOpen(false)} className="p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-colors">
                  <X size={20} className="text-slate-400" />
                </button>
              </div>

              <form onSubmit={handleSaveBlog} className="space-y-8">
                <div className="space-y-4">
                  <label className="text-[12px] font-black uppercase tracking-widest text-slate-400 ml-1">Cover Image</label>
                  <div className="relative h-64 bg-slate-50 rounded-[2rem] border-4 border-dashed border-slate-100 overflow-hidden group cursor-pointer">
                    {/* Hidden file input — disabled while uploading */}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleBlogImageChange}
                      disabled={blogImageUploading}
                      className="absolute inset-0 opacity-0 cursor-pointer z-10 disabled:cursor-not-allowed"
                    />

                    {blogImageUploading ? (
                      /* Uploading spinner */
                      <div className="h-full flex flex-col items-center justify-center gap-4 text-[#097DDD]">
                        <svg className="animate-spin w-10 h-10" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                        </svg>
                        <span className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Uploading…</span>
                      </div>
                    ) : blogForm.image ? (
                      /* Preview uploaded image */
                      <>
                        <img src={blogForm.image} className="w-full h-full object-cover" alt="Cover preview" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Camera className="text-white w-10 h-10" />
                          <span className="ml-2 text-white font-black text-sm">Change Image</span>
                        </div>
                      </>
                    ) : (
                      /* Empty state */
                      <div className="h-full flex flex-col items-center justify-center text-slate-300 gap-4">
                        <Upload size={40} strokeWidth={1.5} />
                        <span className="text-[12px] font-black uppercase tracking-[0.2em]">Click to Upload Cover Image</span>
                        <span className="text-[10px] text-slate-300">JPG, PNG, WEBP up to 5MB</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[12px] font-black uppercase tracking-widest text-slate-400 ml-1">Post Title</label>
                    <input 
                      type="text" 
                      value={blogForm.title}
                      onChange={(e) => setBlogForm({...blogForm, title: e.target.value})}
                      placeholder="e.g. How to maintain your garden" 
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-slate-900 text-sm font-bold focus:outline-none focus:border-[#097DDD] transition-all" 
                      required
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[12px] font-black uppercase tracking-widest text-slate-400 ml-1">Category</label>
                    <select 
                      value={blogForm.category}
                      onChange={(e) => setBlogForm({...blogForm, category: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-slate-900 text-sm font-bold focus:outline-none focus:border-[#097DDD] transition-all appearance-none cursor-pointer"
                    >
                      <option value="">Select Category</option>
                      {categoriesList.map(c => (
                        <option key={c._id || c.id} value={c._id || c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[12px] font-black uppercase tracking-widest text-slate-400 ml-1">Excerpt / Short Description</label>
                  <textarea 
                    rows={2} 
                    value={blogForm.excerpt}
                    onChange={(e) => setBlogForm({...blogForm, excerpt: e.target.value})}
                    placeholder="Briefly describe what this post is about..." 
                    className="w-full bg-slate-50 border border-slate-100 rounded-[2rem] px-6 py-4 text-slate-900 text-sm font-bold focus:outline-none focus:border-[#097DDD] transition-all resize-none leading-relaxed"
                    required
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-[12px] font-black uppercase tracking-widest text-slate-400 ml-1">Full Blog Content (Description)</label>
                  <textarea 
                    rows={6} 
                    value={blogForm.content}
                    onChange={(e) => setBlogForm({...blogForm, content: e.target.value})}
                    placeholder="Write the full blog post content here..." 
                    className="w-full bg-slate-50 border border-slate-100 rounded-[2rem] px-6 py-4 text-slate-900 text-sm font-bold focus:outline-none focus:border-[#097DDD] transition-all resize-none leading-relaxed"
                    required
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-[12px] font-black uppercase tracking-widest text-slate-400 ml-1">Publisher Name</label>
                  <input
                    type="text"
                    value={blogForm.publisher}
                    onChange={(e) => setBlogForm({...blogForm, publisher: e.target.value})}
                    placeholder="e.g. System Admin"
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-slate-900 text-sm font-bold focus:outline-none focus:border-[#097DDD] transition-all"
                    required
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button type="submit" className="flex-1 bg-[#097DDD] hover:bg-[#0869bb] text-white font-black py-5 rounded-2xl transition-all shadow-xl shadow-blue-500/20 uppercase tracking-[0.2em] text-[10px]">
                    {editingBlog ? 'Update Blog Post' : 'Publish Blog Post'}
                  </button>
                  <button type="button" onClick={() => setIsBlogModalOpen(false)} className="px-8 bg-slate-50 hover:bg-slate-100 text-slate-400 font-black py-5 rounded-2xl transition-all uppercase tracking-[0.2em] text-[10px]">
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Category Modal */}
      <AnimatePresence>
        {isCategoryModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsCategoryModalOpen(false)} className="absolute inset-0 bg-[#050f26]/80 backdrop-blur-md" />
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-[3rem] p-12 max-w-md w-full shadow-2xl relative z-10">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h3 className="text-2xl font-black text-[#0D1F43]">{editingCategory ? 'Edit Category' : 'New Category'}</h3>
                  <p className="text-[12px] font-bold text-slate-400 uppercase tracking-widest mt-1">{editingCategory ? 'Modify service industry details' : 'Add a new service industry'}</p>
                </div>
                <button type="button" onClick={() => setIsCategoryModalOpen(false)} className="p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-colors">
                  <X size={20} className="text-slate-400" />
                </button>
              </div>
              <form onSubmit={handleSaveCategory} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Category Name</label>
                  <input
                    type="text"
                    value={categoryForm.name}
                    onChange={(e) => {
                      const name = e.target.value;
                      const slug = name.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
                      setCategoryForm({ ...categoryForm, name, slug });
                    }}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-slate-900 font-bold focus:outline-none focus:border-[#097DDD] transition-all"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Slug (URL friendly)</label>
                  <input type="text" value={categoryForm.slug} onChange={(e) => setCategoryForm({...categoryForm, slug: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-slate-900 font-bold focus:outline-none focus:border-[#097DDD] transition-all" required />
                </div>
                <button type="submit" className="w-full bg-[#097DDD] text-white font-black py-5 rounded-2xl shadow-xl shadow-blue-500/20 uppercase tracking-[0.2em] text-[10px] mt-4">{editingCategory ? 'Update Category' : 'Save Category'}</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Location Modal */}
      <AnimatePresence>
        {isLocationModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsLocationModalOpen(false)} className="absolute inset-0 bg-[#050f26]/80 backdrop-blur-md" />
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-[3rem] p-12 max-w-lg w-full shadow-2xl relative z-10">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h3 className="text-2xl font-black text-[#0D1F43]">{editingLocation ? 'Edit Location' : 'New Location'}</h3>
                  <p className="text-[12px] font-bold text-slate-400 uppercase tracking-widest mt-1">{editingLocation ? 'Modify regional coverage details' : 'Add a new operational region'}</p>
                </div>
                <button type="button" onClick={() => setIsLocationModalOpen(false)} className="p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-colors">
                  <X size={20} className="text-slate-400" />
                </button>
              </div>
              <form onSubmit={handleSaveLocation} className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">City/Area Name</label>
                    <input type="text" value={locationForm.city} onChange={(e) => setLocationForm({...locationForm, city: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-slate-900 font-bold focus:outline-none focus:border-[#097DDD] transition-all" required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Region (e.g. North)</label>
                    <input type="text" value={locationForm.region} onChange={(e) => setLocationForm({...locationForm, region: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-slate-900 font-bold focus:outline-none focus:border-[#097DDD] transition-all" required />
                  </div>
                </div>
                <button type="submit" className="w-full bg-[#097DDD] text-white font-black py-5 rounded-2xl shadow-xl shadow-blue-500/20 uppercase tracking-[0.2em] text-[10px] mt-4">{editingLocation ? 'Update Location' : 'Save Location'}</button>
              </form>
            </motion.div>
          </div>
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

export default AdminDashboard;