import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, User, ShieldCheck, Settings } from 'lucide-react';

interface DashboardProfileChipProps {
  name: string;
  avatar: string;
  subtitle: string;
  onGoToProfile: () => void;
  onGoToSecurity?: () => void;
}

const DashboardProfileChip = ({
  name,
  avatar,
  subtitle,
  onGoToProfile,
  onGoToSecurity,
}: DashboardProfileChipProps) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    if (open) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-4 rounded-2xl px-3 py-2 hover:bg-slate-50 transition-all cursor-pointer group"
        aria-expanded={open}
        aria-haspopup="menu"
      >
        <div className="text-right hidden sm:block">
          <p className="text-[11px] font-black text-slate-900 uppercase tracking-tight group-hover:text-[#097DDD] transition-colors">
            {name}
          </p>
          <p className="text-[9px] text-[#097DDD] font-black uppercase tracking-widest">{subtitle}</p>
        </div>
        <img
          src={avatar}
          alt=""
          className="w-10 h-10 rounded-xl object-cover border-2 border-slate-100 group-hover:border-[#097DDD]/40 transition-all"
        />
        <ChevronDown
          size={16}
          className={`text-slate-300 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            className="absolute right-0 mt-2 w-56 bg-white border border-slate-100 rounded-2xl shadow-xl p-2 z-50"
          >
            <button
              type="button"
              onClick={() => {
                onGoToProfile();
                setOpen(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50 text-left transition-colors"
            >
              <User size={16} className="text-[#097DDD]" />
              <span className="text-[12px] font-bold text-slate-700">Profile & Photo</span>
            </button>
            {onGoToSecurity && (
              <button
                type="button"
                onClick={() => {
                  onGoToSecurity();
                  setOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50 text-left transition-colors"
              >
                <ShieldCheck size={16} className="text-slate-400" />
                <span className="text-[12px] font-bold text-slate-700">Security</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                onGoToProfile();
                setOpen(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50 text-left transition-colors sm:hidden"
            >
              <Settings size={16} className="text-slate-400" />
              <span className="text-[12px] font-bold text-slate-700">Account Settings</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DashboardProfileChip;
