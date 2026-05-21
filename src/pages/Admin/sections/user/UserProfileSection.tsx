import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Camera, Globe, ShieldCheck, Briefcase, Loader2 } from 'lucide-react';
import Swal from 'sweetalert2';
import { updateProfile, updateProfileImage } from '../../../../api/userApi';
import { uploadImage } from '../../../../api/uploadApi';
import { resolveAvatarUrl, syncProfileCache } from '../../../../utils/profileUtils';
import { validateProfileDetails, showValidationAlert } from '../../../../utils/validation';

interface UserProfileSectionProps {
  userData: {
    name: string;
    firstName?: string;
    lastName?: string;
    email: string;
    phone: string;
    avatar: string;
    location: string;
    roleLabel?: string;
  };
  onUpdate?: () => void;
}

const UserProfileSection = ({ userData, onUpdate }: UserProfileSectionProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatar, setAvatar] = useState(userData.avatar);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [formData, setFormData] = useState({
    firstName: userData.firstName || userData.name.split(' ')[0] || '',
    lastName: userData.lastName || userData.name.split(' ').slice(1).join(' ') || '',
    phone: userData.phone || '',
  });
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    setAvatar(userData.avatar);
    setFormData({
      firstName: userData.firstName || userData.name.split(' ')[0] || '',
      lastName: userData.lastName || userData.name.split(' ').slice(1).join(' ') || '',
      phone: userData.phone || '',
    });
  }, [userData.avatar, userData.firstName, userData.lastName, userData.name, userData.phone]);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    if (!['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type)) {
      Swal.fire({
        title: 'Invalid File',
        text: 'Please upload a JPG, PNG, or WebP image.',
        icon: 'warning',
        confirmButtonColor: '#097DDD',
      });
      return;
    }

    setIsUploadingAvatar(true);
    try {
      const url = await uploadImage(file);
      await updateProfileImage(url);
      const displayName = `${formData.firstName} ${formData.lastName}`.trim() || userData.name;
      const resolved = resolveAvatarUrl(displayName, url);
      setAvatar(resolved);
      syncProfileCache({ name: displayName, profileImage: url });
      Swal.fire('Updated', 'Profile photo saved.', 'success');
      onUpdate?.();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      Swal.fire(
        'Upload Failed',
        err?.response?.data?.message || 'Could not upload profile photo.',
        'error'
      );
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleUpdate = async () => {
    const check = validateProfileDetails({
      firstName: formData.firstName,
      lastName: formData.lastName,
      phone: formData.phone,
    });
    if (!check.ok) {
      showValidationAlert(check.message);
      return;
    }

    const firstName = formData.firstName.trim();
    const lastName = formData.lastName.trim();

    setIsUpdating(true);
    try {
      const updated = await updateProfile({
        firstName,
        lastName,
        phone: formData.phone.trim(),
      });
      const displayName =
        updated.name || `${formData.firstName} ${formData.lastName}`.trim();
      syncProfileCache({
        name: displayName,
        profileImage: updated.profileImage,
      });
      Swal.fire('Success', 'Profile updated successfully', 'success');
      onUpdate?.();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      Swal.fire('Error', err?.response?.data?.message || 'Failed to update profile', 'error');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl font-black text-slate-900 leading-tight mb-1">Account Profile</h2>
          <p className="text-slate-400 text-[11px] font-black uppercase tracking-[0.4em]">
            Manage your photo and personal details
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm">
            <input
              ref={fileInputRef}
              type="file"
              accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handleAvatarChange}
            />
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="relative shrink-0">
                <div className="w-28 h-28 rounded-[2rem] overflow-hidden ring-4 ring-[#097DDD]/20 shadow-lg">
                  <img src={avatar} className="w-full h-full object-cover" alt="Profile" />
                </div>
                {isUploadingAvatar && (
                  <div className="absolute inset-0 rounded-[2rem] bg-white/80 flex items-center justify-center">
                    <Loader2 className="text-[#097DDD] animate-spin" size={32} />
                  </div>
                )}
              </div>
              <div className="text-center md:text-left flex-1 space-y-4">
                <h3 className="text-xl font-black text-slate-900">{userData.name}</h3>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploadingAvatar}
                  className="inline-flex items-center justify-center gap-2.5 rounded-xl bg-[#097DDD] px-8 py-4 text-[11px] font-black uppercase tracking-[0.2em] text-white shadow-[0_8px_24px_rgba(9,125,221,0.35)] hover:bg-[#0869bb] hover:-translate-y-0.5 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isUploadingAvatar ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Camera size={16} strokeWidth={2.5} />
                      Change Profile Photo
                    </>
                  )}
                </button>
                <p className="text-[11px] font-bold text-slate-500">
                  JPG, PNG or WebP · max 5 MB
                </p>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                  <span className="px-4 py-1.5 bg-[#097DDD]/5 text-[#097DDD] rounded-full text-[11px] font-black uppercase tracking-widest border border-[#097DDD]/10">
                    {userData.roleLabel || 'Member Account'}
                  </span>
                  <span className="flex items-center gap-2 text-[11px] font-bold text-slate-400">
                    <Globe size={14} className="text-[#097DDD]" />
                    {userData.location}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm">
            <h3 className="text-base font-black text-slate-900 mb-8 flex items-center gap-3">
              <span className="w-1.5 h-5 bg-[#097DDD] rounded-full" />
              Personal Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">
                  First Name
                </label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-slate-900 text-sm font-bold focus:outline-none focus:border-[#097DDD] transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">
                  Last Name
                </label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-slate-900 text-sm font-bold focus:outline-none focus:border-[#097DDD] transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={userData.email}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-slate-900 text-sm font-bold opacity-50 cursor-not-allowed"
                  disabled
                />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-slate-900 text-sm font-bold focus:outline-none focus:border-[#097DDD] transition-all"
                />
              </div>
              <div className="space-y-2 flex items-end md:col-span-2">
                <button
                  onClick={handleUpdate}
                  disabled={isUpdating}
                  className="w-full sm:w-auto bg-[#097DDD] hover:bg-[#0869bb] text-white font-black py-4 px-10 rounded-xl shadow-lg shadow-blue-500/20 transition-all uppercase tracking-widest text-[11px] disabled:opacity-50"
                >
                  {isUpdating ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-gradient-to-br from-[#097DDD] to-[#0869bb] rounded-[2rem] p-6 text-white relative overflow-hidden group shadow-xl">
            <div className="relative z-10">
              <ShieldCheck size={40} className="mb-6 opacity-30" />
              <h4 className="text-xl font-black mb-2">Verified Status</h4>
              <p className="text-white/80 text-[13px] font-medium leading-relaxed mb-6">
                Your profile photo appears in the navbar and on your dashboard.
              </p>
              <div className="bg-white/20 backdrop-blur-md rounded-2xl px-4 py-2 inline-flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                <span className="text-[11px] font-black uppercase tracking-widest">Active Status</span>
              </div>
            </div>
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000" />
          </div>

          <div className="bg-white border border-slate-200 rounded-[2rem] p-6 shadow-sm">
            <h4 className="text-[13px] font-black text-slate-900 uppercase tracking-widest mb-6">
              Recent Activity
            </h4>
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-4 group">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 group-hover:bg-[#097DDD] group-hover:border-[#097DDD] transition-all group-hover:text-white text-slate-400">
                    <Briefcase size={14} />
                  </div>
                  <div>
                    <p className="text-[13px] font-bold text-slate-900 mb-1">Account activity</p>
                    <p className="text-[11px] font-medium text-slate-400">Keep your details up to date</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default UserProfileSection;
