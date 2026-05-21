import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Loader2, Eye } from 'lucide-react';
import BusinessReviewModal, { type BusinessSubmission } from './BusinessReviewModal';
import RejectionReasonModal from './RejectionReasonModal';

interface SubmissionsSectionProps {
  pendingSubmissions: BusinessSubmission[];
  onApprove: (id: string) => void | Promise<void>;
  onReject: (id: string, rejectionReason: string) => void | Promise<void>;
  onApproveDeletion: (id: string) => void | Promise<void>;
  onRejectDeletion: (id: string) => void | Promise<void>;
  isLoading?: boolean;
}

const SubmissionsSection = ({
  pendingSubmissions,
  onApprove,
  onReject,
  onApproveDeletion,
  onRejectDeletion,
  isLoading,
}: SubmissionsSectionProps) => {
  const [selectedBusiness, setSelectedBusiness] = useState<BusinessSubmission | null>(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const closeDetails = () => {
    if (!isProcessing) setSelectedBusiness(null);
  };

  const handleApprove = async (id: string) => {
    setIsProcessing(true);
    try {
      await onApprove(id);
      setSelectedBusiness(null);
    } finally {
      setIsProcessing(false);
    }
  };

  const openRejectFlow = () => {
    setShowRejectModal(true);
  };

  const handleRejectSubmit = async (reason: string) => {
    const id = selectedBusiness?._id || selectedBusiness?.id;
    if (!id) return;
    setIsProcessing(true);
    try {
      await onReject(id, reason);
      setShowRejectModal(false);
      setSelectedBusiness(null);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleApproveDeletion = async (id: string) => {
    setIsProcessing(true);
    try {
      await onApproveDeletion(id);
      setSelectedBusiness(null);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRejectDeletion = async (id: string) => {
    setIsProcessing(true);
    try {
      await onRejectDeletion(id);
      setSelectedBusiness(null);
    } finally {
      setIsProcessing(false);
    }
  };

  const selectedName =
    selectedBusiness?.businessName || selectedBusiness?.name || 'Business';

  return (
    <>
      <motion.div
        key="submissions"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="space-y-10"
      >
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
                    <th className="px-12 py-6 text-[12px] font-black text-slate-400 uppercase tracking-widest">
                      Submission
                    </th>
                    <th className="px-8 py-6 text-[12px] font-black text-slate-400 uppercase tracking-widest">
                      Details
                    </th>
                    <th className="px-8 py-6 text-[12px] font-black text-slate-400 uppercase tracking-widest">
                      Owner
                    </th>
                    <th className="px-12 py-6 text-[12px] font-black text-slate-400 uppercase tracking-widest text-right">
                      Review
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {pendingSubmissions.map((submission) => {
                    const id = submission._id || submission.id;
                    const name = submission.businessName || submission.name || 'Unnamed';
                    const logo = submission.logo || submission.image || '';
                    const description =
                      submission.shortDescription || submission.description || '—';
                    const ownerName =
                      submission.owner?.name ||
                      `${submission.owner?.firstName || ''} ${submission.owner?.lastName || ''}`.trim() ||
                      '—';
                    const ownerEmail = submission.owner?.email || '';
                    const isPendingDelete = submission.status === 'pending_delete';

                    return (
                      <tr
                        key={id}
                        className="hover:bg-slate-50/50 transition-colors group cursor-pointer"
                        onClick={() => setSelectedBusiness(submission)}
                      >
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
                              <div className="flex items-center gap-2 mb-1">
                                <p className="text-sm font-black text-slate-900">{name}</p>
                                {isPendingDelete && (
                                  <span className="bg-rose-100 text-rose-600 px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider">
                                    Deletion Request
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-3">
                                <span className="text-[11px] font-black text-primary uppercase tracking-widest">
                                  {submission.category}
                                </span>
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
                            <p className="text-[11px] text-slate-400 font-bold mt-1">
                              {submission.contactEmail}
                            </p>
                          )}
                        </td>
                        <td className="px-8 py-8">
                          <p className="text-[13px] font-black text-slate-700">{ownerName}</p>
                          {ownerEmail && (
                            <p className="text-[11px] text-slate-400 font-bold mt-0.5">{ownerEmail}</p>
                          )}
                        </td>
                        <td className="px-12 py-8" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end">
                            <button
                              onClick={() => setSelectedBusiness(submission)}
                              className="flex items-center gap-2 px-6 py-2.5 bg-[#097DDD] text-white rounded-xl text-[12px] font-black uppercase tracking-widest hover:bg-[#0869bb] transition-all shadow-lg shadow-[#097DDD]/20"
                            >
                              <Eye size={14} strokeWidth={3} /> View Details
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

      {selectedBusiness && (
        <BusinessReviewModal
          business={selectedBusiness}
          onClose={closeDetails}
          onApprove={handleApprove}
          onReject={openRejectFlow}
          onApproveDeletion={handleApproveDeletion}
          onRejectDeletion={handleRejectDeletion}
          isProcessing={isProcessing}
        />
      )}

      <RejectionReasonModal
        businessName={selectedName}
        isOpen={showRejectModal}
        onClose={() => !isProcessing && setShowRejectModal(false)}
        onSubmit={handleRejectSubmit}
        isProcessing={isProcessing}
      />
    </>
  );
};

export default SubmissionsSection;
