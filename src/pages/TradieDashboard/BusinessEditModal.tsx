/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Briefcase, Phone, FileText, Save, X, AlertCircle, Loader2, Upload, Clock,
} from 'lucide-react';
import Swal from 'sweetalert2';
import { updateBusiness, removeGalleryImage, addGalleryImage } from '../../api/businessApi';
import { uploadImage } from '../../api/uploadApi';
import { showValidationAlert, runValidations, validateEmail, validatePhoneAU } from '../../utils/validation';

export type BusinessEditForm = {
  businessName: string;
  abn: string;
  category: string;
  location: string;
  suburb: string;
  servicesOffered: string;
  website: string;
  yearsInBusiness: string;
  shortDescription: string;
  longDescription: string;
  contactPhone: string;
  contactEmail: string;
  openingHours?: {
    [key: string]: {
      open: string;
      close: string;
      closed: boolean;
    };
  };
};

type GalleryImage = {
  _id: string;
  url: string;
  title?: string;
};

type NewUploadedImage = {
  id: string;
  preview: string;
  url: string;
  uploading?: boolean;
};

const emptyForm: BusinessEditForm = {
  businessName: '',
  abn: '',
  category: '',
  location: '',
  suburb: '',
  servicesOffered: '',
  website: '',
  yearsInBusiness: '',
  shortDescription: '',
  longDescription: '',
  contactPhone: '',
  contactEmail: '',
  openingHours: {
    monday: { open: '09:00', close: '17:00', closed: false },
    tuesday: { open: '09:00', close: '17:00', closed: false },
    wednesday: { open: '09:00', close: '17:00', closed: false },
    thursday: { open: '09:00', close: '17:00', closed: false },
    friday: { open: '09:00', close: '17:00', closed: false },
    saturday: { open: '09:00', close: '14:00', closed: false },
    sunday: { open: '09:00', close: '17:00', closed: true },
  },
};

const LOCATIONS = [
  'Hobart Region (TAS)',
  'Launceston Region (TAS)',
  'Devonport Region (TAS)',
  'Burnie Region (TAS)',
  'North Brisbane (QLD)',
  'South Brisbane (QLD)',
];

const labelCls = 'text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1';
const inputCls =
  'w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-700 font-bold focus:outline-none focus:border-[#097DDD] focus:ring-4 focus:ring-[#097DDD]/10 transition-all';

const validateBusinessEdit = (data: BusinessEditForm) =>
  runValidations(
    data.businessName.trim().length >= 2
      ? { ok: true as const }
      : { ok: false as const, message: 'Business name is required (min 2 characters).' },
    data.category.trim()
      ? { ok: true as const }
      : { ok: false as const, message: 'Service category is required.' },
    data.location.trim()
      ? { ok: true as const }
      : { ok: false as const, message: 'Location is required.' },
    data.shortDescription.trim().length >= 20
      ? { ok: true as const }
      : { ok: false as const, message: 'Short description must be at least 20 characters.' },
    data.servicesOffered.trim().length >= 3
      ? { ok: true as const }
      : { ok: false as const, message: 'Services offered is required.' },
    validateEmail(data.contactEmail),
    validatePhoneAU(data.contactPhone, true)
  );

type Props = {
  isOpen: boolean;
  businessId: string | null;
  businessName: string;
  status: string;
  initialData: BusinessEditForm | null;
  logo?: string;
  gallery?: GalleryImage[];
  onClose: () => void;
  onSaved: () => void;
};

export default function BusinessEditModal({
  isOpen,
  businessId,
  businessName,
  status,
  initialData,
  logo,
  gallery = [],
  onClose,
  onSaved,
}: Props) {
  const [form, setForm] = useState<BusinessEditForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [newGalleryImages, setNewGalleryImages] = useState<NewUploadedImage[]>([]);
  const [logoUrl, setLogoUrl] = useState(logo || '');
  const [isUploadingGallery, setIsUploadingGallery] = useState(false);
  const profileFileInputRef = useRef<HTMLInputElement>(null);
  const galleryFileInputRef = useRef<HTMLInputElement>(null);

  const isRejected = status.toLowerCase() === 'rejected';
  const isPendingDelete = status.toLowerCase().includes('delete');
  const maxGallerySlots = 6;

  useEffect(() => {
    if (isOpen && initialData) {
      setForm(initialData);
      setGalleryImages(gallery);
      setNewGalleryImages([]);
      setLogoUrl(logo || '');
    }
  }, [isOpen, initialData, gallery, logo]);

  const setField = (field: keyof BusinessEditForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleProfileImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    e.target.value = "";
    if (!files.length) return;

    if (files.length > 1) {
      Swal.fire({
        title: "One Image Only",
        text: "Please select only one profile picture.",
        icon: "info",
        confirmButtonColor: "#097DDD",
      });
      return;
    }

    setIsUploadingGallery(true);

    const file = files[0];
    if (!["image/jpeg", "image/jpg", "image/png"].includes(file.type)) {
      Swal.fire({
        title: "Invalid File",
        text: "Only JPG and PNG images are allowed.",
        icon: "warning",
        confirmButtonColor: "#097DDD",
      });
      setIsUploadingGallery(false);
      return;
    }

    try {
      const url = await uploadImage(file);
      setLogoUrl(url);
      Swal.fire({
        title: "Profile Picture Updated",
        text: "Your new profile picture will be applied when you save changes.",
        icon: "success",
        confirmButtonColor: "#097DDD",
      });
    } catch {
      Swal.fire({
        title: "Upload Failed",
        text: "Could not upload image. Please try again.",
        icon: "error",
        confirmButtonColor: "#097DDD",
      });
    }

    setIsUploadingGallery(false);
  };

  const handleGalleryImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    e.target.value = "";
    if (!files.length) return;

    const totalGalleryImages = galleryImages.length + newGalleryImages.length;
    const slotsLeft = maxGallerySlots - totalGalleryImages;

    if (slotsLeft <= 0) {
      Swal.fire({
        title: "Gallery Limit Reached",
        text: `You can have up to ${maxGallerySlots} previous works images.`,
        icon: "info",
        confirmButtonColor: "#097DDD",
      });
      return;
    }

    const filesToUpload = files.slice(0, slotsLeft);
    setIsUploadingGallery(true);

    for (const file of filesToUpload) {
      if (!["image/jpeg", "image/jpg", "image/png"].includes(file.type)) {
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
      setNewGalleryImages((prev) => [...prev, { id, preview, url: "", uploading: true }]);

      try {
        const url = await uploadImage(file);
        setNewGalleryImages((prev) =>
          prev.map((img) => (img.id === id ? { ...img, url, uploading: false } : img))
        );
      } catch {
        setNewGalleryImages((prev) => prev.filter((img) => img.id !== id));
        URL.revokeObjectURL(preview);
        Swal.fire({
          title: "Upload Failed",
          text: "Could not upload image. Please try again.",
          icon: "error",
          confirmButtonColor: "#097DDD",
        });
      }
    }

    setIsUploadingGallery(false);
  };

  const removeNewGalleryImage = (id: string) => {
    setNewGalleryImages((prev) => {
      const removed = prev.find((img) => img.id === id);
      if (removed?.preview.startsWith("blob:")) URL.revokeObjectURL(removed.preview);
      return prev.filter((img) => img.id !== id);
    });
  };

  const removeExistingGalleryImage = async (imageId: string) => {
    if (!businessId) return;

    Swal.fire({
      title: "Remove Image?",
      text: "Are you sure you want to remove this image?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#097DDD",
      cancelButtonColor: "#dc2626",
      confirmButtonText: "Yes, remove it",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await removeGalleryImage(businessId, imageId);
          setGalleryImages((prev) => prev.filter((img) => img._id !== imageId));
          Swal.fire({
            title: "Removed!",
            text: "Image removed successfully.",
            icon: "success",
            confirmButtonColor: "#097DDD",
          });
        } catch (error) {
          Swal.fire({
            title: "Error",
            text: "Failed to remove image.",
            icon: "error",
            confirmButtonColor: "#097DDD",
          });
        }
      }
    });
  };

  const handleSave = async () => {
    if (!businessId) return;
    const check = validateBusinessEdit(form);
    if ('message' in check) {
      showValidationAlert(check.message);
      return;
    }

    if (newGalleryImages.some((img) => img.uploading)) {
      Swal.fire({
        title: 'Upload in Progress',
        text: 'Please wait for images to finish uploading.',
        icon: 'info',
        confirmButtonColor: '#097DDD',
      });
      return;
    }

    setSaving(true);
    try {
      const payload = {
        businessName: form.businessName.trim(),
        abn: form.abn.replace(/\s/g, ''),
        category: form.category.trim(),
        location: form.location.trim(),
        suburb: form.suburb.trim(),
        servicesOffered: form.servicesOffered.trim(),
        website: form.website.trim(),
        yearsInBusiness: form.yearsInBusiness.trim(),
        shortDescription: form.shortDescription.trim(),
        longDescription: form.longDescription.trim(),
        contactPhone: form.contactPhone.trim(),
        contactEmail: form.contactEmail.trim(),
        logo: logoUrl,
      };

      const updated = await updateBusiness(businessId, payload);

      // Add new gallery images
      if (newGalleryImages.length > 0) {
        for (const img of newGalleryImages) {
          if (img.url) {
            await addGalleryImage(businessId, { url: img.url });
          }
        }
      }

      Swal.fire({
        title: updated.resubmitted ? 'Resubmitted!' : 'Saved!',
        text: updated.resubmitted
          ? 'Your listing has been updated and sent back to admin for approval.'
          : 'Business details updated successfully.',
        icon: 'success',
        confirmButtonColor: '#097DDD',
        customClass: { popup: 'rounded-[2rem]' },
      });

      onSaved();
      onClose();
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Failed to update business.';
      Swal.fire({
        title: 'Error',
        text: message,
        icon: 'error',
        confirmButtonColor: '#097DDD',
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#050f26]/70 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            className="relative z-10 w-full max-w-3xl max-h-[85vh] sm:max-h-[90vh] overflow-hidden flex flex-col bg-white rounded-t-[2rem] sm:rounded-[2rem] border border-slate-200 shadow-2xl"
          >
            <div className="flex items-start justify-between gap-3 px-4 sm:px-8 pt-4 sm:pt-8 pb-3 sm:pb-4 border-b border-slate-100 shrink-0">
              <div className="min-w-0">
                <p className="text-[10px] font-black text-[#097DDD] uppercase tracking-[0.25em] mb-1">
                  Edit listing
                </p>
                <h2 className="text-lg sm:text-xl font-black text-slate-900 truncate">{businessName}</h2>
                <span
                  className={`inline-block mt-2 text-[8px] sm:text-[9px] font-black uppercase tracking-wider px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg ${
                    status.toLowerCase() === 'approved'
                      ? 'bg-emerald-100 text-emerald-600'
                      : status.toLowerCase() === 'rejected'
                        ? 'bg-rose-100 text-rose-600'
                        : status.toLowerCase().includes('delete')
                          ? 'bg-rose-100 text-rose-600'
                          : 'bg-amber-100 text-amber-600'
                  }`}
                >
                  {status}
                </span>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 sm:p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors shrink-0"
                aria-label="Close"
              >
                <X size={20} className="sm:w-5 sm:h-5" />
              </button>
            </div>

            <div className="overflow-y-auto px-4 sm:px-8 py-4 sm:py-6 space-y-6 sm:space-y-8 custom-scrollbar">
              {isRejected && (
                <div className="flex gap-2 sm:gap-3 p-3 sm:p-4 rounded-2xl bg-rose-50 border border-rose-200">
                  <AlertCircle className="text-rose-500 shrink-0 mt-0.5" size={18} />
                  <div className="min-w-0">
                    <p className="font-black text-rose-900 text-xs sm:text-sm">Listing rejected</p>
                    <p className="text-rose-700/80 text-[11px] sm:text-xs mt-1 leading-relaxed">
                      Update your details below and save to resubmit for admin approval. Check your
                      notifications for the rejection reason.
                    </p>
                  </div>
                </div>
              )}

              {isPendingDelete && (
                <div className="flex gap-2 sm:gap-3 p-3 sm:p-4 rounded-2xl bg-amber-50 border border-amber-200">
                  <AlertCircle className="text-amber-600 shrink-0" size={18} />
                  <p className="text-amber-900 text-[11px] sm:text-xs font-medium">
                    This listing is pending deletion approval. Editing is disabled.
                  </p>
                </div>
              )}

              {/* Profile Picture Section */}
              {!isPendingDelete && (
                <section>
                  <h3 className="text-xs sm:text-sm font-black text-slate-800 mb-3 sm:mb-4 flex items-center gap-2">
                    <Upload className="text-[#097DDD]" size={16} /> Profile Picture
                  </h3>
                  
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-lg sm:rounded-xl overflow-hidden border border-slate-200 bg-slate-100 shrink-0">
                      {logoUrl ? (
                        <img src={logoUrl} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs text-center p-2">
                          No profile picture
                        </div>
                      )}
                    </div>
                    
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
                      disabled={saving || isUploadingGallery}
                      className="w-24 h-24 sm:w-32 sm:h-32 px-4 py-3 sm:py-4 border-2 border-dashed border-slate-300 rounded-lg sm:rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex flex-col items-center justify-center shrink-0 text-center"
                    >
                      <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-[#097DDD]/10 flex items-center justify-center mb-1 sm:mb-2">
                        {isUploadingGallery ? (
                          <Loader2 size={14} className="text-[#097DDD] animate-spin" />
                        ) : (
                          <Upload size={14} className="text-[#097DDD]" />
                        )}
                      </div>
                      <div className="text-[9px] sm:text-xs font-black text-[#097DDD] uppercase tracking-wider">
                        Change
                      </div>
                      <div className="text-[8px] sm:text-xs text-slate-500 mt-0.5 sm:mt-1">Profile Pic</div>
                    </button>
                  </div>
                </section>
              )}

              {/* Previous Works Section */}
              {!isPendingDelete && (
                <section>
                  <h3 className="text-xs sm:text-sm font-black text-slate-800 mb-3 sm:mb-4 flex items-center gap-2">
                    <Upload className="text-[#097DDD]" size={16} /> Previous Works ({galleryImages.length + newGalleryImages.length}/{maxGallerySlots})
                  </h3>

                  {/* Existing Gallery Images */}
                  {galleryImages.length > 0 && (
                    <div className="mb-3 sm:mb-4">
                      <p className="text-[10px] sm:text-xs font-black text-slate-600 uppercase tracking-wider mb-2 sm:mb-3">Current Images</p>
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                        {galleryImages.map((img) => (
                          <div
                            key={img._id}
                            className="relative aspect-square rounded-lg overflow-hidden border border-slate-200 bg-slate-100"
                          >
                            <img src={img.url} alt="" className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => removeExistingGalleryImage(img._id)}
                              className="absolute top-1 right-1 p-1 rounded-lg bg-white/90 text-rose-500 hover:bg-rose-50 shadow-sm"
                              aria-label="Remove image"
                              disabled={saving}
                            >
                              <X size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* New Gallery Images */}
                  {newGalleryImages.length > 0 && (
                    <div className="mb-3 sm:mb-4">
                      <p className="text-[10px] sm:text-xs font-black text-slate-600 uppercase tracking-wider mb-2 sm:mb-3">Pending Upload</p>
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                        {newGalleryImages.map((img) => (
                          <div
                            key={img.id}
                            className="relative aspect-square rounded-lg overflow-hidden border border-slate-200 bg-slate-100"
                          >
                            <img src={img.url || img.preview} alt="" className="w-full h-full object-cover" />
                            {img.uploading && (
                              <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                                <Loader2 size={16} className="text-[#097DDD] animate-spin" />
                              </div>
                            )}
                            <button
                              type="button"
                              onClick={() => removeNewGalleryImage(img.id)}
                              className="absolute top-1 right-1 p-1 rounded-lg bg-white/90 text-rose-500 hover:bg-rose-50 shadow-sm"
                              aria-label="Remove image"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Upload Button */}
                  <input
                    ref={galleryFileInputRef}
                    type="file"
                    accept=".jpg,.jpeg,.png,image/jpeg,image/png"
                    multiple
                    className="hidden"
                    onChange={handleGalleryImageSelect}
                    disabled={saving || isUploadingGallery}
                  />
                  {galleryImages.length + newGalleryImages.length < maxGallerySlots && (
                    <button
                      type="button"
                      onClick={() => galleryFileInputRef.current?.click()}
                      disabled={saving || isUploadingGallery}
                      className="w-full border-2 border-dashed border-slate-300 rounded-lg p-3 sm:p-5 flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-[#097DDD]/10 flex items-center justify-center mb-1 sm:mb-2">
                        {isUploadingGallery ? (
                          <Loader2 size={14} className="text-[#097DDD] animate-spin" />
                        ) : (
                          <Upload size={14} className="text-[#097DDD]" />
                        )}
                      </div>
                      <div className="text-xs sm:text-sm font-black text-[#097DDD] uppercase tracking-wider">
                        Add More Images
                      </div>
                      <div className="text-[10px] sm:text-xs text-slate-500 mt-1">JPG or PNG</div>
                    </button>
                  )}
                </section>
              )}

              <section>
                <h3 className="text-xs sm:text-sm font-black text-slate-800 mb-3 sm:mb-4 flex items-center gap-2">
                  <Briefcase className="text-[#097DDD]" size={16} /> Business details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-5">
                  <div className="space-y-1 sm:space-y-2 md:col-span-2">
                    <label className={labelCls}>Business name</label>
                    <input
                      type="text"
                      value={form.businessName}
                      onChange={(e) => setField('businessName', e.target.value)}
                      className={inputCls}
                      disabled={isPendingDelete || saving}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className={labelCls}>ABN</label>
                    <input
                      type="text"
                      value={form.abn}
                      onChange={(e) => setField('abn', e.target.value)}
                      className={inputCls}
                      disabled={isPendingDelete || saving}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className={labelCls}>Category</label>
                    <input
                      type="text"
                      value={form.category}
                      onChange={(e) => setField('category', e.target.value)}
                      className={inputCls}
                      disabled={isPendingDelete || saving}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className={labelCls}>Location</label>
                    <select
                      value={form.location}
                      onChange={(e) => setField('location', e.target.value)}
                      className={`${inputCls} appearance-none`}
                      disabled={isPendingDelete || saving}
                    >
                      <option value="">Choose a location</option>
                      {LOCATIONS.map((loc) => (
                        <option key={loc} value={loc}>
                          {loc}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className={labelCls}>Suburb</label>
                    <input
                      type="text"
                      value={form.suburb}
                      onChange={(e) => setField('suburb', e.target.value)}
                      className={inputCls}
                      disabled={isPendingDelete || saving}
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className={labelCls}>Services offered</label>
                    <input
                      type="text"
                      value={form.servicesOffered}
                      onChange={(e) => setField('servicesOffered', e.target.value)}
                      className={inputCls}
                      disabled={isPendingDelete || saving}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className={labelCls}>Website</label>
                    <input
                      type="text"
                      value={form.website}
                      onChange={(e) => setField('website', e.target.value)}
                      className={inputCls}
                      disabled={isPendingDelete || saving}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className={labelCls}>Years in business</label>
                    <input
                      type="text"
                      value={form.yearsInBusiness}
                      onChange={(e) => setField('yearsInBusiness', e.target.value)}
                      className={inputCls}
                      disabled={isPendingDelete || saving}
                    />
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-sm font-black text-slate-800 mb-4 flex items-center gap-2">
                  <Phone className="text-[#097DDD]" size={18} /> Business contact
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className={labelCls}>Phone</label>
                    <input
                      type="text"
                      value={form.contactPhone}
                      onChange={(e) => setField('contactPhone', e.target.value)}
                      className={inputCls}
                      disabled={isPendingDelete || saving}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className={labelCls}>Email</label>
                    <input
                      type="email"
                      value={form.contactEmail}
                      onChange={(e) => setField('contactEmail', e.target.value)}
                      className={inputCls}
                      disabled={isPendingDelete || saving}
                    />
                  </div>
                </div>
              </section>

              {/* Opening Hours */}
              {!isPendingDelete && (
                <section>
                  <h3 className="text-xs sm:text-sm font-black text-slate-800 mb-3 sm:mb-4 flex items-center gap-2">
                    <Clock className="text-[#097DDD]" size={16} /> Business Hours
                  </h3>
                  <div className="space-y-2 sm:space-y-3">
                    {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map((day) => (
                      <div key={day} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                        <label className="capitalize text-xs sm:text-sm font-black text-slate-600 min-w-[70px]">{day}</label>
                        <div className="flex gap-2 flex-1">
                          <input
                            type="time"
                            disabled={form.openingHours?.[day]?.closed || saving}
                            className={`${inputCls} flex-1 disabled:opacity-50 text-sm`}
                            value={form.openingHours?.[day]?.open || '09:00'}
                            onChange={(e) => setForm({
                              ...form,
                              openingHours: {
                                ...form.openingHours,
                                [day]: { ...form.openingHours?.[day], open: e.target.value, closed: form.openingHours?.[day]?.closed || false }
                              }
                            })}
                          />
                          <input
                            type="time"
                            disabled={form.openingHours?.[day]?.closed || saving}
                            className={`${inputCls} flex-1 disabled:opacity-50 text-sm`}
                            value={form.openingHours?.[day]?.close || '17:00'}
                            onChange={(e) => setForm({
                              ...form,
                              openingHours: {
                                ...form.openingHours,
                                [day]: { ...form.openingHours?.[day], close: e.target.value, closed: form.openingHours?.[day]?.closed || false }
                              }
                            })}
                          />
                        </div>
                        <label className="flex items-center gap-2 cursor-pointer whitespace-nowrap">
                          <input
                            type="checkbox"
                            checked={form.openingHours?.[day]?.closed || false}
                            onChange={(e) => setForm({
                              ...form,
                              openingHours: {
                                ...form.openingHours,
                                [day]: { ...form.openingHours?.[day], closed: e.target.checked }
                              }
                            })}
                            className="w-4 h-4 rounded cursor-pointer"
                            disabled={saving}
                          />
                          <span className="text-xs font-bold text-slate-600">Closed</span>
                        </label>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              <section>
                <h3 className="text-xs sm:text-sm font-black text-slate-800 mb-3 sm:mb-4 flex items-center gap-2">
                  <FileText className="text-[#097DDD]" size={16} /> Descriptions
                </h3>
                <div className="space-y-3 sm:space-y-5">
                  <div className="space-y-1 sm:space-y-2">
                    <label className={labelCls}>Short description</label>
                    <textarea
                      rows={2}
                      value={form.shortDescription}
                      onChange={(e) => setField('shortDescription', e.target.value)}
                      className={`${inputCls} resize-none text-sm`}
                      disabled={isPendingDelete || saving}
                    />
                  </div>
                  <div className="space-y-1 sm:space-y-2">
                    <label className={labelCls}>Detailed writeup</label>
                    <textarea
                      rows={5}
                      value={form.longDescription}
                      onChange={(e) => setField('longDescription', e.target.value)}
                      className={`${inputCls} resize-y font-medium text-sm`}
                      disabled={isPendingDelete || saving}
                    />
                  </div>
                </div>
              </section>
            </div>

            <div className="shrink-0 px-4 sm:px-8 py-3 sm:py-5 border-t border-slate-100 flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 sm:px-6 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] text-slate-500 hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              {!isPendingDelete && (
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className="bg-[#097DDD] hover:bg-[#0869bb] disabled:opacity-60 text-white px-6 sm:px-8 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all flex items-center justify-center sm:justify-start gap-2 shadow-lg shadow-[#097DDD]/20"
                >
                  {saving ? (
                    <>
                      <Loader2 size={14} className="animate-spin" /> Saving...
                    </>
                  ) : (
                    <>
                      <Save size={14} />
                      <span className="hidden sm:inline">{isRejected ? 'Resubmit for approval' : 'Save changes'}</span>
                      <span className="sm:hidden">{isRejected ? 'Resubmit' : 'Save'}</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
