import { motion } from 'framer-motion';
import { Briefcase, ChevronRight, DollarSign, Upload, Check } from 'lucide-react';

interface UserJobSectionProps {
  selectedImage: string | null;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const UserJobSection = ({ selectedImage, onImageChange }: UserJobSectionProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-10"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl font-black text-slate-900 leading-tight mb-1">Create New Job</h2>
          <p className="text-slate-400 text-[8px] font-black uppercase tracking-[0.4em]">Broadcast your requirements to local pros</p>
        </div>
        <button className="flex items-center gap-3 px-6 py-3 bg-[#097DDD] hover:bg-[#0869bb] text-white font-black rounded-xl shadow-lg shadow-blue-500/20 transition-all uppercase tracking-widest text-[9px]">
          <Briefcase size={12} /> My Posted Jobs
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm">
        <form className="max-w-4xl mx-auto space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Job Category <span className="text-[#097DDD] font-black">*</span></label>
              <div className="relative">
                <select className="w-full bg-slate-50 border border-slate-100 rounded-xl px-6 py-4 text-slate-900 text-sm font-bold focus:outline-none focus:border-[#097DDD] transition-all appearance-none cursor-pointer">
                  <option value="" className="text-slate-400">Select Service Type</option>
                  <option value="plumbing">Plumbing & Drainage</option>
                  <option value="electrical">Electrical & Lighting</option>
                  <option value="carpentry">Carpentry & Woodwork</option>
                </select>
                <ChevronRight size={16} className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none rotate-90" />
              </div>
            </div>
            <div className="space-y-3">
              <label className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Service Location <span className="text-[#097DDD] font-black">*</span></label>
              <div className="relative">
                <select className="w-full bg-slate-50 border border-slate-100 rounded-xl px-6 py-4 text-slate-900 text-sm font-bold focus:outline-none focus:border-[#097DDD] transition-all appearance-none cursor-pointer">
                  <option value="" className="text-slate-400">Select Your Region</option>
                  <option value="hobart">Greater Hobart</option>
                  <option value="launceston">Greater Launceston</option>
                </select>
                <ChevronRight size={16} className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none rotate-90" />
              </div>
            </div>
            <div className="space-y-3">
              <label className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Estimated Budget (AUD)</label>
              <div className="relative">
                <DollarSign size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-[#097DDD]" />
                <input type="text" placeholder="1500.00" className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-xl text-slate-900 text-sm font-bold focus:outline-none focus:border-[#097DDD] transition-all" />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Job Description <span className="text-[#097DDD] font-black">*</span></label>
            <textarea
              rows={4}
              placeholder="Describe what you need done..."
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-slate-900 text-sm font-bold focus:outline-none focus:border-[#097DDD] transition-all resize-none"
            />
          </div>

          <div className="space-y-3">
            <label className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Visual References (Optional)</label>
            <div className="relative group">
              <input
                type="file"
                onChange={onImageChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                accept="image/*"
              />
              <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2.5rem] p-10 text-center group-hover:border-[#097DDD] group-hover:bg-[#097DDD]/5 transition-all">
                <div className="relative">
                  {selectedImage ? (
                    <div className="w-32 h-32 mx-auto mb-6 rounded-2xl overflow-hidden shadow-2xl ring-4 ring-white">
                      <img src={selectedImage} className="w-full h-full object-cover" alt="Selected" />
                    </div>
                  ) : (
                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm group-hover:scale-110 transition-transform">
                      <Upload size={24} className="text-slate-300 group-hover:text-[#097DDD]" />
                    </div>
                  )}
                </div>
                <h4 className="text-base font-black text-slate-900 mb-0.5">
                  {selectedImage ? 'Image Selected' : 'Drag & Drop references'}
                </h4>
                <p className="text-[8px] text-slate-400 font-black uppercase tracking-widest max-w-xs mx-auto mb-4">JPG, PNG up to 25MB</p>
                <button type="button" className="bg-white border border-slate-200 hover:bg-[#097DDD] hover:text-white px-6 py-2.5 rounded-lg font-black text-slate-500 transition-all tracking-widest text-[8px] uppercase shadow-sm">
                  Select Files
                </button>
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-[#097DDD]/0 to-[#097DDD]/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>

          <div className="flex items-center justify-center pt-6">
            <label className="flex items-center gap-4 cursor-pointer group">
              <input type="checkbox" className="hidden" />
              <div className="w-6 h-6 rounded-xl border-2 border-slate-200 flex items-center justify-center group-hover:border-[#097DDD] transition-all bg-white">
                <Check size={14} className="text-[#097DDD] opacity-0 group-hover:opacity-100 transition-all scale-50 group-hover:scale-100" />
              </div>
              <span className="text-[10px] font-bold text-slate-400 group-hover:text-slate-600 transition-colors">By posting this job, you agree to our Service Provider Terms & Privacy Policy.</span>
            </label>
          </div>

          <button className="w-full bg-[#097DDD] hover:bg-[#0869bb] text-white font-black py-4 rounded-xl shadow-lg shadow-blue-500/20 transition-all uppercase tracking-[0.4em] text-[10px] hover:-translate-y-1 active:translate-y-0">
            Publish Job Post
          </button>
        </form>
      </div>
    </motion.div>
  );
};

export default UserJobSection;
