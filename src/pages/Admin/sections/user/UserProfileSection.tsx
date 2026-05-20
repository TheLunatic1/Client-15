import { motion } from 'framer-motion';
import { Camera, Globe, ShieldCheck, Briefcase } from 'lucide-react';

interface UserProfileSectionProps {
  userData: {
    name: string;
    email: string;
    phone: string;
    avatar: string;
    location: string;
  };
}

const UserProfileSection = ({ userData }: UserProfileSectionProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl font-black text-slate-900 leading-tight mb-1">Account Profile</h2>
          <p className="text-slate-400 text-[11px] font-black uppercase tracking-[0.4em]">Manage your personal identity</p>
        </div>
        <div className="flex gap-4">
          <button className="px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-[11px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
            View Public Profile
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white border border-slate-200 rounded-[2rem] p-8 relative overflow-hidden group shadow-sm">
            <div className="absolute top-0 right-0 p-6">
              <button className="p-2.5 bg-slate-50 hover:bg-[#097DDD] hover:text-white rounded-xl text-slate-300 transition-all group-hover:rotate-12 shadow-sm">
                <Camera size={18} />
              </button>
            </div>
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="relative">
                <div className="w-24 h-24 rounded-[2rem] overflow-hidden ring-4 ring-slate-50 rotate-3 group-hover:rotate-0 transition-transform duration-500 shadow-lg">
                  <img src={userData.avatar} className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-700" alt="Profile" />
                </div>
              </div>
              <div className="text-center md:text-left">
                <h3 className="text-xl font-black text-slate-900 mb-2">{userData.name}</h3>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                  <span className="px-4 py-1.5 bg-[#097DDD]/5 text-[#097DDD] rounded-full text-[11px] font-black uppercase tracking-widest border border-[#097DDD]/10">
                    Member Account
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
                <label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Full Name</label>
                <input type="text" defaultValue={userData.name} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-slate-900 text-sm font-bold focus:outline-none focus:border-[#097DDD] transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Email Address</label>
                <input type="email" defaultValue={userData.email} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-slate-900 text-sm font-bold focus:outline-none focus:border-[#097DDD] transition-all opacity-50 cursor-not-allowed" disabled />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Phone Number</label>
                <input type="tel" defaultValue={userData.phone} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-slate-900 text-sm font-bold focus:outline-none focus:border-[#097DDD] transition-all" />
              </div>
              <div className="space-y-2 flex items-end">
                <button className="w-full bg-[#097DDD] hover:bg-[#0869bb] text-white font-black py-4 rounded-xl shadow-lg shadow-blue-500/20 transition-all uppercase tracking-widest text-[11px]">
                  Save Changes
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
              <p className="text-white/80 text-[13px] font-medium leading-relaxed mb-6">Your account is fully verified as a member administrator.</p>
              <div className="bg-white/20 backdrop-blur-md rounded-2xl px-4 py-2 inline-flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                <span className="text-[11px] font-black uppercase tracking-widest">Active Status</span>
              </div>
            </div>
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000" />
          </div>

          <div className="bg-white border border-slate-200 rounded-[2rem] p-6 shadow-sm">
            <h4 className="text-[13px] font-black text-slate-900 uppercase tracking-widest mb-6">Recent Activity</h4>
            <div className="space-y-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex gap-4 group">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 group-hover:bg-[#097DDD] group-hover:border-[#097DDD] transition-all group-hover:text-white text-slate-400">
                    <Briefcase size={14} />
                  </div>
                  <div>
                    <p className="text-[13px] font-bold text-slate-900 mb-1">New Job Posted</p>
                    <p className="text-[11px] font-medium text-slate-400">2 hours ago</p>
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
