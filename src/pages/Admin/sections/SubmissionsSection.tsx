import { motion } from 'framer-motion';
import { Check, X, MapPin, Loader2 } from 'lucide-react';

interface SubmissionsSectionProps {
  pendingSubmissions: any[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  isLoading?: boolean;
}

const SubmissionsSection = ({ pendingSubmissions, onApprove, onReject, isLoading }: SubmissionsSectionProps) => {
  return (
    <motion.div key="submissions" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10">
      <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-12 py-10 border-b border-slate-50 flex items-center justify-between">
          <h3 className="text-xl font-black text-[#0D1F43]">Pending Approvals</h3>
          {!isLoading && pendingSubmissions.length > 0 && (
            <span className="bg-amber-50 text-amber-600 px-4 py-2 rounded-xl text-[12px] font-black uppercase tracking-widest">
              {pendingSubmissions.length} Awaiting Review
            </span>
          )}
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-24 text-slate-300">
            <Loader2 size={32} className="animate-spin" />
          </div>
        ) : pendingSubmissions.length === 0 ? (
          <div className="py-24 text-center text-slate-400 font-bold text-sm uppercase tracking-widest">
            No pending submissions
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-12 py-6 text-[12px] font-black text-slate-400 uppercase tracking-widest">Submission</th>
                  <th className="px-8 py-6 text-[12px] font-black text-slate-400 uppercase tracking-widest">Details</th>
                  <th className="px-8 py-6 text-[12px] font-black text-slate-400 uppercase tracking-widest">Owner</th>
                  <th className="px-12 py-6 text-[12px] font-black text-slate-400 uppercase tracking-widest text-right">Review</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {pendingSubmissions.map((submission) => {
                  const id = submission._id || submission.id;
                  const name = submission.businessName || submission.name || 'Unnamed';
                  const logo = submission.logo || submission.image || '';
                  const description = submission.shortDescription || submission.description || '—';
                  const ownerName = submission.owner?.name || submission.owner || '—';
                  const ownerEmail = submission.owner?.email || '';

                  return (
                    <tr key={id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-12 py-8">
                        <div className="flex items-center gap-6">
                          <div className="w-16 h-16 rounded-2xl bg-slate-100 flex-shrink-0 overflow-hidden flex items-center justify-center text-slate-300 text-xs font-black">
                            {logo ? (
                              <img src={logo} className="w-full h-full object-cover" alt="" />
                            ) : (
                              name.slice(0, 2).toUpperCase()
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-black text-slate-900 mb-1">{name}</p>
                            <div className="flex items-center gap-3">
                              <span className="text-[11px] font-black text-primary uppercase tracking-widest">{submission.category}</span>
                              <span className="w-1 h-1 bg-slate-200 rounded-full" />
                              <span className="text-[12px] font-bold text-slate-400 flex items-center gap-1">
                                <MapPin size={10} /> {submission.location}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-8">
                        <p className="text-[13px] text-slate-500 font-medium max-w-md leading-relaxed line-clamp-2">
                          {description}
                        </p>
                        {submission.contactEmail && (
                          <p className="text-[11px] text-slate-400 font-bold mt-1">{submission.contactEmail}</p>
                        )}
                      </td>
                      <td className="px-8 py-8">
                        <p className="text-[13px] font-black text-slate-700">{ownerName}</p>
                        {ownerEmail && <p className="text-[11px] text-slate-400 font-bold mt-0.5">{ownerEmail}</p>}
                      </td>
                      <td className="px-12 py-8">
                        <div className="flex items-center justify-end gap-3">
                          <button
                            onClick={() => onApprove(id)}
                            className="flex items-center gap-2 px-6 py-2.5 bg-emerald-500 text-white rounded-xl text-[12px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20"
                          >
                            <Check size={14} strokeWidth={3} /> Approve
                          </button>
                          <button
                            onClick={() => onReject(id)}
                            className="flex items-center gap-2 px-6 py-2.5 bg-rose-50 text-rose-500 rounded-xl text-[12px] font-black uppercase tracking-widest hover:bg-rose-100 transition-all border border-rose-100"
                          >
                            <X size={14} strokeWidth={3} /> Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default SubmissionsSection;
