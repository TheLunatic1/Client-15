/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect, useRef } from "react";
import { CheckCircle2, ArrowRight, Upload, Star, Loader2, X, Lock, Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axiosClient from "../../api/axios";
import { createBusiness, addGalleryImage } from "../../api/businessApi";
import { getCategories } from "../../api/categoryApi";
import { getLocations } from "../../api/locationApi";
import { uploadImage } from "../../api/uploadApi";
import { validateListBusinessForm, showValidationAlert } from "../../utils/validation";

const MAX_PROFILE_IMAGES = 1;
const MAX_GALLERY_IMAGES = 6;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"];

type UploadedImage = {
  id: string;
  preview: string;
  url: string;
  file?: File;
  uploading?: boolean;
  isProfile?: boolean;
};

const benefits = [
  { title: "Free to List", desc: "No setup fees through 2026" },
  { title: "Instant Visibility", desc: "Live within 1 business day" },
  { title: "Direct Enquiries", desc: "Customers contact you directly" },
  { title: "No Lock-In", desc: "Cancel anytime, no contracts" },
];

const labelCls = "block text-[9px] font-black uppercase tracking-[0.22em] text-[#7a90a8] mb-1.5";
const inputCls = "w-full block rounded-[10px] border border-[#cdd6e3] bg-[#E4EAF1]/35 p-[11px_14px] text-[0.87rem] text-[#0A1830] font-medium outline-none transition-all duration-200 focus:border-[#097DDD] focus:ring-3 focus:ring-[#097DDD]/12 focus:bg-white box-border";

const FALLBACK_CATEGORIES = [
  "Handyman Services", "Lawn Mowing and Gardening", "Domestic Cleaning",
  "Car Detailing", "Pressure Washing", "Carpet Cleaning", "Plumbers",
  "Electricians", "Builders", "Painters", "Roofers", "Concretors",
  "Plasterers", "Landscapers", "Photographers", "Fencing Contractors",
];

const FALLBACK_LOCATIONS = [
  "Hobart Region (TAS)", "Launceston Region (TAS)", "Devonport Region (TAS)",
  "Burnie Region (TAS)", "North Brisbane (QLD)", "South Brisbane (QLD)",
  "West Brisbane (QLD)", "East Brisbane (QLD)", "Gold Coast Region (QLD)",
  "Sunshine Coast Region (QLD)", "Tasmania Region (TAS)", "Queensland Region (QLD)",
];

export const ListBusinessFormSection = () => {
  const navigate = useNavigate();
  const formRef = useRef<HTMLDivElement>(null);
  const profileFileInputRef = useRef<HTMLInputElement>(null);
  const galleryFileInputRef = useRef<HTMLInputElement>(null);
  const [sent, setSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingImages] = useState(false);
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [categories, setCategories] = useState<string[]>(FALLBACK_CATEGORIES);
  const [locations, setLocations] = useState<string[]>(FALLBACK_LOCATIONS);
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    setIsLoggedIn(localStorage.getItem('isLoggedIn') === 'true' && localStorage.getItem('userRole') === 'tradie');
  }, []);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Form state — pre-fill from registration flow
  const [businessName, setBusinessName] = useState(localStorage.getItem('prefillBusinessName') || "");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [suburb, setSuburb] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [servicesOffered, setServicesOffered] = useState("");
  const [abn, setAbn] = useState("");
  const [website, setWebsite] = useState("");
  const [yearsInBusiness, setYearsInBusiness] = useState("");
  const [contactName, setContactName] = useState(localStorage.getItem('prefillContactName') || localStorage.getItem('userName') || "");
  const [contactPhone, setContactPhone] = useState("");
  const [contactEmail, setContactEmail] = useState(localStorage.getItem('prefillContactEmail') || localStorage.getItem('userEmail') || "");

  // Opening Hours State
  const [openingHours, setOpeningHours] = useState({
    monday: { open: '09:00', close: '17:00', closed: false },
    tuesday: { open: '09:00', close: '17:00', closed: false },
    wednesday: { open: '09:00', close: '17:00', closed: false },
    thursday: { open: '09:00', close: '17:00', closed: false },
    friday: { open: '09:00', close: '17:00', closed: false },
    saturday: { open: '09:00', close: '14:00', closed: false },
    sunday: { open: '09:00', close: '17:00', closed: true },
  });

  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const;

  // Fetch live categories and locations on mount
  useEffect(() => {
    getCategories()
      .then((cats: any[]) => {
        if (cats && cats.length > 0) setCategories(cats.map((c) => c.name));
      })
      .catch(() => {});

    getLocations()
      .then((locs: any[]) => {
        if (locs && locs.length > 0)
          setLocations(locs.map((l) => l.region ? `${l.city} (${l.region})` : l.city));
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (sent) {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [sent]);

  const scrollToFormTop = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleProfileImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    e.target.value = "";
    if (!files.length) return;

    if (files.length > MAX_PROFILE_IMAGES) {
      Swal.fire({
        title: "One Image Only",
        text: "Please select only one profile picture.",
        icon: "info",
        confirmButtonColor: "#097DDD",
      });
      return;
    }

    const file = files[0];
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      Swal.fire({
        title: "Invalid File",
        text: "Only JPG and PNG images are allowed.",
        icon: "warning",
        confirmButtonColor: "#097DDD",
      });
      return;
    }

    setImages((prev) => prev.filter((img) => !img.isProfile));
    const id = `profile-${Date.now()}`;
    const preview = URL.createObjectURL(file);
    setImages((prev) => [...prev, { id, preview, url: "", file, uploading: false, isProfile: true }]);
  };

  const handleGalleryImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    e.target.value = "";
    if (!files.length) return;

    const galleryImages = images.filter((i) => !i.isProfile);
    const gallerySlotsLeft = MAX_GALLERY_IMAGES - galleryImages.length;

    if (gallerySlotsLeft <= 0) {
      Swal.fire({
        title: "Gallery Limit Reached",
        text: `You can upload up to ${MAX_GALLERY_IMAGES} previous works images.`,
        icon: "info",
        confirmButtonColor: "#097DDD",
      });
      return;
    }

    const filesToUpload = files.slice(0, gallerySlotsLeft);

    for (const file of filesToUpload) {
      if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
        Swal.fire({
          title: "Invalid File",
          text: "Only JPG and PNG images are allowed.",
          icon: "warning",
          confirmButtonColor: "#097DDD",
        });
        continue;
      }

      const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      const preview = URL.createObjectURL(file);
      setImages((prev) => [...prev, { id, preview, url: "", file, uploading: false, isProfile: false }]);
    }
  };

  const removeImage = (id: string) => {
    setImages((prev) => {
      const removed = prev.find((img) => img.id === id);
      if (removed?.preview.startsWith("blob:")) URL.revokeObjectURL(removed.preview);
      return prev.filter((img) => img.id !== id);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validation = validateListBusinessForm({
      businessName,
      category,
      location,
      shortDescription,
      servicesOffered,
      abn,
      contactPhone,
      contactEmail,
      website,
      yearsInBusiness,
      contactName,
    });
    if (!validation.ok) {
      if ('message' in validation) {
        showValidationAlert(validation.message);
      }
      scrollToFormTop();
      return;
    }

    if (!isLoggedIn) {
      if (password.length < 8) {
        showValidationAlert("Password must be at least 8 characters long.");
        scrollToFormTop();
        return;
      }
      if (password !== confirmPassword) {
        showValidationAlert("Passwords do not match.");
        scrollToFormTop();
        return;
      }
    }

    const profileImage = images.find((img) => img.isProfile);
    if (!profileImage) {
      Swal.fire({
        title: 'Profile Picture Required',
        text: 'Please upload at least one profile picture.',
        icon: 'warning',
        confirmButtonColor: '#097DDD',
      });
      scrollToFormTop();
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. Register User if not logged in
      if (!isLoggedIn) {
        const parts = contactName.trim().split(' ');
        const fName = parts[0] || '';
        const lName = parts.slice(1).join(' ') || '';

        const response = await axiosClient.post('/api/users/register', {
          firstName: fName,
          lastName: lName,
          email: contactEmail.trim().toLowerCase(),
          password,
          role: 'tradie',
        });
        const data = response.data;
        
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('token', data.token);
        localStorage.setItem('userRole', 'tradie');
        localStorage.setItem('userName', contactName);
        localStorage.setItem('userEmail', contactEmail);
      }

      // 2. Upload Images
      const uploadedImages = [];
      for (const img of images) {
        if (img.file && !img.url) {
          const url = await uploadImage(img.file);
          uploadedImages.push({ ...img, url });
        } else if (img.url) {
          uploadedImages.push(img);
        }
      }

      const uploadedProfileImage = uploadedImages.find((img) => img.isProfile);
      const galleryImages = uploadedImages.filter((img) => !img.isProfile);

      const profileImageUrl = uploadedProfileImage?.url || "";

      // 3. Create Business
      const business = await createBusiness({
        businessName: businessName.trim(),
        category,
        location,
        suburb: suburb.trim(),
        shortDescription: shortDescription.trim(),
        servicesOffered: servicesOffered.trim(),
        abn: abn.replace(/\s/g, ''),
        website: website.trim(),
        yearsInBusiness,
        contactPhone: contactPhone.trim(),
        contactEmail: contactEmail.trim(),
        logo: profileImageUrl,
        coverImage: profileImageUrl,
        openingHours,
      });

      const businessId = business._id || business.id;
      if (businessId && galleryImages.length > 0) {
        await Promise.all(
          galleryImages.map((img) => addGalleryImage(businessId, { url: img.url }))
        );
      }

      // Clear registration prefill cache
      localStorage.removeItem('prefillBusinessName');
      localStorage.removeItem('prefillContactName');
      localStorage.removeItem('prefillContactEmail');

      setSent(true);
      
      Swal.fire({
        title: 'Listing Submitted!',
        text: 'Your business has been created successfully.',
        icon: 'success',
        confirmButtonColor: '#097DDD'
      }).then(() => {
        navigate('/tradie-dashboard');
      });

    } catch (error: any) {
      const msg = error.response?.data?.message || 'Failed to submit listing. Please try again.';
      Swal.fire({ title: 'Submission Failed', text: msg, icon: 'error', confirmButtonColor: '#097DDD' });
      scrollToFormTop();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section ref={formRef} id="list-business-form" className="bg-[#f4f7fb] pt-14 pb-18 scroll-mt-24">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-[400px_minmax(0,800px)] gap-12 items-start justify-center">
        
        {/* ── Left: Benefits ── */}
        <div className="space-y-6">
          <h2 className="font-black text-[1.25rem] text-[#0A1830] mb-6">
            Why list with us?
          </h2>

          <div className="flex flex-col gap-4">
            {benefits.map((benefit, i) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, x: -14 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="flex items-center gap-5 bg-white border border-[#dde4ef] rounded-[18px] p-5 px-6 shadow-[0_2px_12px_rgba(10,24,48,0.06)]"
              >
                <div className="w-10 h-10 rounded-[10px] bg-[#097DDD]/10 flex items-center justify-center shrink-0">
                  <CheckCircle2 size={18} className="text-[#097DDD]" />
                </div>
                <div>
                  <div className="font-bold text-[#0A1830] text-[0.95rem] mb-0.5">
                    {benefit.title}
                  </div>
                  <div className="text-[10px] font-bold text-[#7a90a8] uppercase tracking-wider">
                    {benefit.desc}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Promotion card */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.25 }}
            className="mt-4 rounded-[18px] bg-linear-to-br from-[#0a1628] to-[#0d2044] border border-white/8 p-6 px-8"
          >
            <div className="text-[10px] font-black uppercase tracking-[0.25em] text-[#E4EAF1]/35 mb-2">
              Free Through
            </div>
            <div className="text-white font-black text-[1.8rem] mb-1">
              2026
            </div>
            <div className="text-[#E4EAF1]/45 text-[0.9rem]">
              No lead fees, ever.
            </div>
          </motion.div>
        </div>

        {/* ── Right: Form ── */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          onSubmit={handleSubmit}
          className="bg-white border border-[#dde4ef] rounded-[24px] shadow-[0_8px_40px_rgba(10,24,48,0.08)] p-10 md:p-12"
        >
          {sent ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 rounded-[20px] bg-[#097DDD]/10 flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 size={40} className="text-[#097DDD]" />
              </div>
              <h2 className="font-black text-[1.8rem] text-[#0A1830] mb-2">
                Listing Submitted!
              </h2>
              <p className="text-[#5a7089] text-lg">Our team will review and publish your business within 1 business day.</p>
            </div>
          ) : (
            <>
              {/* Form heading */}
              <div className="mb-10">
                <h2 className="font-black text-[1.5rem] text-[#0A1830] mb-2">
                  Business Details
                </h2>
                <p className="text-[0.95rem] text-[#5a7089]">
                  Fill in your business information below.
                </p>
              </div>

              <div className="space-y-6">
                {/* Business Name */}
                <div>
                  <label className={labelCls}>Business Name *</label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Tassie Plumb Co."
                    className={inputCls}
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                  />
                </div>

                {/* Category + Location */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className={labelCls}>Service Category *</label>
                    <select required className={inputCls} value={category} onChange={(e) => setCategory(e.target.value)}>
                      <option value="">Choose a category</option>
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>Location *</label>
                    <select required className={inputCls} value={location} onChange={(e) => setLocation(e.target.value)}>
                      <option value="">Choose a location</option>
                      {locations.map((loc) => (
                        <option key={loc} value={loc}>{loc}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Suburb */}
                <div>
                  <label className={labelCls}>Suburb</label>
                  <input
                    type="text"
                    placeholder="e.g. Sandy Bay"
                    className={inputCls}
                    value={suburb}
                    onChange={(e) => setSuburb(e.target.value)}
                  />
                </div>

                {/* Description */}
                <div>
                  <label className={labelCls}>Business Description *</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Tell customers what you do and why they should choose you."
                    className={`${inputCls} resize-y`}
                    value={shortDescription}
                    onChange={(e) => setShortDescription(e.target.value)}
                  />
                </div>

                {/* Services Offered */}
                <div>
                  <label className={labelCls}>Services Offered (Comma Separated) *</label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Emergency repairs, Hot water, Gas fitting"
                    className={inputCls}
                    value={servicesOffered}
                    onChange={(e) => setServicesOffered(e.target.value)}
                  />
                </div>

                {/* ABN */}
                <div>
                  <label className={labelCls}>ABN (Australian Business Number) *</label>
                  <input
                    required
                    type="text"
                    placeholder="11 digits"
                    className={inputCls}
                    value={abn}
                    onChange={(e) => setAbn(e.target.value)}
                  />
                </div>

                {/* Website + Years in Business */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className={labelCls}>Website (optional)</label>
                    <input
                      type="text"
                      placeholder="www.yourbusiness.com.au"
                      className={inputCls}
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Years in Business</label>
                    <input
                      type="number"
                      placeholder="e.g. 5"
                      min="0"
                      className={inputCls}
                      value={yearsInBusiness}
                      onChange={(e) => setYearsInBusiness(e.target.value)}
                    />
                  </div>
                </div>

                {/* Profile Picture Upload */}
                <div>
                  <label className={labelCls}>Profile Picture *</label>
                  <input
                    ref={profileFileInputRef}
                    type="file"
                    accept=".jpg,.jpeg,.png,image/jpeg,image/png"
                    className="hidden"
                    onChange={handleProfileImageSelect}
                  />
                  <button
                    type="button"
                    onClick={() => profileFileInputRef.current?.click()}
                    disabled={isUploadingImages || images.some((i) => i.isProfile)}
                    className="mt-2 w-full border-2 border-dashed border-[#cdd6e3] rounded-[14px] p-8 flex flex-col items-center justify-center bg-[#E4EAF1]/20 hover:bg-[#E4EAF1]/30 transition-colors cursor-pointer group disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="w-10 h-10 rounded-full bg-[#097DDD]/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                      {isUploadingImages ? (
                        <Loader2 size={20} className="text-[#097DDD] animate-spin" />
                      ) : (
                        <Upload size={20} className="text-[#097DDD]" />
                      )}
                    </div>
                    <div className="text-[10px] font-black uppercase tracking-wider text-[#097DDD] mb-1">
                      Click to upload
                    </div>
                    <div className="text-[9px] font-bold text-[#7a90a8]">
                      1 image (JPG or PNG)
                    </div>
                  </button>

                  {images.some((img) => img.isProfile) && (
                    <div className="mt-4 flex justify-center">
                      {images
                        .filter((img) => img.isProfile)
                        .map((img) => (
                          <div
                            key={img.id}
                            className="relative w-40 h-40 rounded-xl overflow-hidden border border-[#dde4ef] bg-slate-100"
                          >
                            <img
                              src={img.url || img.preview}
                              alt="Profile"
                              className="w-full h-full object-cover"
                            />
                            {img.uploading && (
                              <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                                <Loader2 size={24} className="text-[#097DDD] animate-spin" />
                              </div>
                            )}
                            <button
                              type="button"
                              onClick={() => removeImage(img.id)}
                              className="absolute top-2 right-2 p-1.5 rounded-lg bg-white/90 text-rose-500 hover:bg-rose-50 shadow-sm"
                              aria-label="Remove image"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        ))}
                    </div>
                  )}
                </div>

                {/* Previous Works Gallery Upload */}
                <div>
                  <label className={labelCls}>Previous Works (Up to {MAX_GALLERY_IMAGES} Images)</label>
                  <input
                    ref={galleryFileInputRef}
                    type="file"
                    accept=".jpg,.jpeg,.png,image/jpeg,image/png"
                    multiple
                    className="hidden"
                    onChange={handleGalleryImageSelect}
                  />
                  <button
                    type="button"
                    onClick={() => galleryFileInputRef.current?.click()}
                    disabled={isUploadingImages || images.filter((i) => !i.isProfile).length >= MAX_GALLERY_IMAGES}
                    className="mt-2 w-full border-2 border-dashed border-[#cdd6e3] rounded-[14px] p-8 flex flex-col items-center justify-center bg-[#E4EAF1]/20 hover:bg-[#E4EAF1]/30 transition-colors cursor-pointer group disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="w-10 h-10 rounded-full bg-[#097DDD]/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                      {isUploadingImages ? (
                        <Loader2 size={20} className="text-[#097DDD] animate-spin" />
                      ) : (
                        <Upload size={20} className="text-[#097DDD]" />
                      )}
                    </div>
                    <div className="text-[10px] font-black uppercase tracking-wider text-[#097DDD] mb-1">
                      Click to upload
                    </div>
                    <div className="text-[9px] font-bold text-[#7a90a8]">
                      Multiple images ({images.filter((i) => !i.isProfile).length}/{MAX_GALLERY_IMAGES})
                    </div>
                  </button>

                  {images.filter((i) => !i.isProfile).length > 0 && (
                    <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {images
                        .filter((img) => !img.isProfile)
                        .map((img) => (
                          <div
                            key={img.id}
                            className="relative aspect-square rounded-xl overflow-hidden border border-[#dde4ef] bg-slate-100"
                          >
                            <img
                              src={img.url || img.preview}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                            {img.uploading && (
                              <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                                <Loader2 size={22} className="text-[#097DDD] animate-spin" />
                              </div>
                            )}
                            <button
                              type="button"
                              onClick={() => removeImage(img.id)}
                              className="absolute top-2 right-2 p-1.5 rounded-lg bg-white/90 text-rose-500 hover:bg-rose-50 shadow-sm"
                              aria-label="Remove image"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ))}
                    </div>
                  )}
                </div>

                <hr className="border-[#dde4ef] my-10" />

                {/* Opening Hours */}
                <div>
                  <h3 className="font-black text-[0.9rem] uppercase tracking-[0.2em] text-[#0A1830] mb-6 flex items-center gap-2">
                    <Star size={14} className="text-[#097DDD] fill-[#097DDD]" />
                    Business Hours
                  </h3>
                  
                  <div className="space-y-4">
                    {days.map((day) => (
                      <div key={day} className="flex flex-col sm:flex-row sm:items-center gap-3">
                        <label className="text-xs font-bold text-slate-600 capitalize min-w-[70px]">{day}</label>
                        <div className="flex gap-2 flex-1">
                          <input
                            type="time"
                            disabled={openingHours[day].closed}
                            className={`${inputCls} flex-1 disabled:opacity-50`}
                            value={openingHours[day].open}
                            onChange={(e) => setOpeningHours({
                              ...openingHours,
                              [day]: { ...openingHours[day], open: e.target.value }
                            })}
                          />
                          <input
                            type="time"
                            disabled={openingHours[day].closed}
                            className={`${inputCls} flex-1 disabled:opacity-50`}
                            value={openingHours[day].close}
                            onChange={(e) => setOpeningHours({
                              ...openingHours,
                              [day]: { ...openingHours[day], close: e.target.value }
                            })}
                          />
                        </div>
                        <label className="flex items-center gap-2 cursor-pointer whitespace-nowrap">
                          <input
                            type="checkbox"
                            checked={openingHours[day].closed}
                            onChange={(e) => setOpeningHours({
                              ...openingHours,
                              [day]: { ...openingHours[day], closed: e.target.checked }
                            })}
                            className="w-4 h-4 rounded cursor-pointer"
                          />
                          <span className="text-xs font-bold text-slate-600">Closed</span>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Contact Information */}
                <hr className="border-[#dde4ef] my-10" />
                <div>
                  <h3 className="font-black text-[0.9rem] uppercase tracking-[0.2em] text-[#0A1830] mb-6 flex items-center gap-2">
                    <Star size={14} className="text-[#097DDD] fill-[#097DDD]" />
                    {isLoggedIn ? 'Contact Information' : 'Account & Contact Setup'}
                  </h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className={labelCls}>Contact Name *</label>
                      <input
                        required
                        type="text"
                        placeholder="Your name"
                        className={inputCls}
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className={labelCls}>Phone *</label>
                      <input
                        required
                        type="tel"
                        placeholder="0400 000 000"
                        className={inputCls}
                        value={contactPhone}
                        onChange={(e) => setContactPhone(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className={labelCls}>Email *</label>
                    <input
                      required
                      type="email"
                      placeholder="you@business.com.au"
                      className={inputCls}
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                    />
                  </div>

                  {!isLoggedIn && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6 bg-[#097DDD]/5 p-6 rounded-2xl border border-[#097DDD]/10">
                      <div>
                        <label className={labelCls}>Create Password *</label>
                        <div className="relative">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                          <input
                            required
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            className={`${inputCls} pl-11 pr-11`}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                          />
                          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className={labelCls}>Confirm Password *</label>
                        <div className="relative">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                          <input
                            required
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            className={`${inputCls} pl-11 pr-11`}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Terms and Submit */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-8">
                  <p className="text-[11px] text-[#7a90a8] font-bold">
                    By submitting you agree to our <a href="/terms" className="text-[#097DDD] hover:underline">listing terms</a>.
                  </p>
                  <button
                    type="submit"
                    disabled={isSubmitting || isUploadingImages}
                    className="w-full sm:w-auto flex items-center justify-center gap-3 bg-[#097DDD] text-white font-black text-[11px] uppercase tracking-[0.2em] rounded-xl py-5 px-12 shadow-[0_4px_25px_rgba(9,125,221,0.4)] hover:bg-[#0a8ef0] hover:shadow-[0_8px_35px_rgba(9,125,221,0.55)] transition-all duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <><Loader2 size={16} className="animate-spin" /> Submitting...</>
                    ) : (
                      <>Submit Listing <ArrowRight size={16} /></>
                    )}
                  </button>
                </div>
              </div>
            </>
          )}
        </motion.form>
      </div>
    </section>
  );
};
