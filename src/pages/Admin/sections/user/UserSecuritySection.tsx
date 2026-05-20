import { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';
import Swal from 'sweetalert2';
import axiosClient from '../../../../api/axios';

const UserSecuritySection = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdatePassword = async () => {
    if (newPassword !== confirmPassword) {
      Swal.fire('Error', 'New passwords do not match.', 'error');
      return;
    }
    if (newPassword.length < 8) {
      Swal.fire('Error', 'Password must be at least 8 characters long.', 'error');
      return;
    }
    
    setIsUpdating(true);
    try {
      await axiosClient.put('/api/users/profile/password', {
        currentPassword,
        newPassword
      });
      Swal.fire('Success', 'Password updated successfully.', 'success');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      Swal.fire('Error', error.response?.data?.message || 'Failed to update password.', 'error');
    } finally {
      setIsUpdating(false);
    }
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl"
    >
      <div className="mb-8">
        <h2 className="text-2xl font-black text-slate-900 leading-tight mb-1">Security Settings</h2>
        <p className="text-slate-400 text-[11px] font-black uppercase tracking-[0.4em]">Keep your account safe & secure</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-[2.5rem] p-10 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="space-y-8">
            <div className="w-14 h-14 bg-[#097DDD] rounded-[1.25rem] flex items-center justify-center text-white shadow-xl shadow-[#097DDD]/20">
              <Lock size={20} strokeWidth={3} />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900 mb-4">Change Password</h3>
              <p className="text-slate-400 text-[13px] leading-relaxed font-medium">Ensure your password is at least 8 characters long and contains a mix of symbols, numbers, and letters.</p>
            </div>
          </div>
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Current Password</label>
              <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder="••••••••" className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-slate-900 text-sm font-bold focus:outline-none focus:border-[#097DDD] transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">New Password</label>
              <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="••••••••" className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-slate-900 text-sm font-bold focus:outline-none focus:border-[#097DDD] transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Confirm New Password</label>
              <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••" className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-slate-900 text-sm font-bold focus:outline-none focus:border-[#097DDD] transition-all" />
            </div>
            <button 
              onClick={handleUpdatePassword}
              disabled={isUpdating}
              className="w-full bg-[#097DDD] hover:bg-[#0869bb] text-white font-black py-4 rounded-xl shadow-lg shadow-[#097DDD]/20 transition-all uppercase tracking-widest text-[11px] mt-4 disabled:opacity-50"
            >
              {isUpdating ? 'Updating...' : 'Update Security Key'}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default UserSecuritySection;
