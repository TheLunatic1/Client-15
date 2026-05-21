import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageSquare, Send } from 'lucide-react';
import { validateRejectionReason, showValidationAlert } from '../../../utils/validation';

interface RejectionReasonModalProps {
  businessName: string;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reason: string) => void;
  isProcessing?: boolean;
}

const RejectionReasonModal = ({
  businessName,
  isOpen,
  onClose,
  onSubmit,
  isProcessing = false,
}: RejectionReasonModalProps) => {
  const [reason, setReason] = useState('');

  const handleClose = () => {
    setReason('');
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = reason.trim();
    const check = validateRejectionReason(trimmed);
    if (!check.ok) {
      showValidationAlert(check.message);
      return;
    }
    onSubmit(trimmed);
    setReason('');
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[210] flex items-center justify-center p-4 bg-[#0D1F43]/70 backdrop-blur-sm"
        onClick={handleClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-[2rem] shadow-2xl w-full max-w-lg overflow-hidden"
        >
          <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center">
                <MessageSquare className="text-rose-500" size={20} />
              </div>
              <div>
                <h3 className="text-base font-black text-[#0D1F43]">Reject Business</h3>
                <p className="text-[11px] font-bold text-slate-400 truncate max-w-[240px]">{businessName}</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-2 rounded-xl hover:bg-slate-100 text-slate-400"
              aria-label="Close"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-5">
            <p className="text-[13px] font-semibold text-slate-600 leading-relaxed">
              The tradie will receive a notification that begins with:{' '}
              <span className="font-black text-[#0D1F43]">
                &quot;This is the reason why your business got rejected.&quot;
              </span>{' '}
              Type your message below — it will be sent to them as the rejection reason.
            </p>

            <div>
              <label
                htmlFor="rejection-reason"
                className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2"
              >
                Rejection message <span className="text-rose-500">*</span>
              </label>
              <textarea
                id="rejection-reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={5}
                required
                placeholder="Explain why this listing cannot be approved (e.g. incomplete details, policy issue, duplicate listing…)"
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-[14px] font-medium text-slate-700 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-300 resize-none"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={handleClose}
                disabled={isProcessing}
                className="px-6 py-3 rounded-xl text-[12px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-100 transition-all disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isProcessing || !reason.trim()}
                className="flex items-center gap-2 px-6 py-3 bg-rose-500 text-white rounded-xl text-[12px] font-black uppercase tracking-widest hover:bg-rose-600 transition-all shadow-lg shadow-rose-500/20 disabled:opacity-50"
              >
                <Send size={14} />
                Send & Reject
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default RejectionReasonModal;
