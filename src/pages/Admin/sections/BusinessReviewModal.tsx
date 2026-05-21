import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  MapPin,
  Mail,
  Phone,
  Globe,
  Building2,
  User,
  Calendar,
  Tag,
  Image as ImageIcon,
  Check,
} from 'lucide-react';

export interface BusinessSubmission {
  _id?: string;
  id?: string;
  businessName?: string;
  name?: string;
  abn?: string;
  category?: string;
  location?: string;
  suburb?: string;
  servicesOffered?: string;
  website?: string;
  yearsInBusiness?: string;
  experience?: string;
  shortDescription?: string;
  longDescription?: string;
  description?: string;
  contactPhone?: string;
  contactEmail?: string;
  logo?: string;
  image?: string;
  coverImage?: string;
  gallery?: { url?: string; title?: string; _id?: string }[];
  tags?: string[];
  status?: string;
  createdAt?: string;
  owner?: {
    firstName?: string;
    lastName?: string;
    name?: string;
    email?: string;
    phone?: string;
  };
}

interface BusinessReviewModalProps {
  business: BusinessSubmission | null;
  onClose: () => void;
  onApprove: (id: string) => void;
  onReject: () => void;
  onApproveDeletion?: (id: string) => void;
  onRejectDeletion?: (id: string) => void;
  isProcessing?: boolean;
}

const DetailRow = ({ label, value }: { label: string; value?: string | null }) => {
  if (!value) return null;
  return (
    <div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
      <p className="text-[13px] font-semibold text-slate-700 leading-relaxed">{value}</p>
    </div>
  );
};

const BusinessReviewModal = ({
  business,
  onClose,
  onApprove,
  onReject,
  onApproveDeletion,
  onRejectDeletion,
  isProcessing = false,
}: BusinessReviewModalProps) => {
  if (!business) return null;

  const id = business._id || business.id || '';
  const name = business.businessName || business.name || 'Unnamed';
  const logo = business.logo || business.image || '';
  const isPendingDelete = business.status === 'pending_delete';
  const ownerName =
    business.owner?.name ||
    `${business.owner?.firstName || ''} ${business.owner?.lastName || ''}`.trim() ||
    '—';

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-[#0D1F43]/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-[2rem] shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col"
        >
          <div className="px-8 py-6 border-b border-slate-100 flex items-start justify-between gap-4 shrink-0">
            <div className="flex items-center gap-4 min-w-0">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 overflow-hidden flex items-center justify-center shrink-0">
                {logo ? (
                  <img src={logo} alt="" className="w-full h-full object-cover" />
                ) : (
                  <Building2 className="text-slate-300" size={24} />
                )}
              </div>
              <div className="min-w-0">
                <h3 className="text-lg font-black text-[#0D1F43] truncate">{name}</h3>
                <p className="text-[11px] font-black text-primary uppercase tracking-widest">
                  {business.category}
                  {isPendingDelete && (
                    <span className="ml-2 text-rose-500">· Deletion Request</span>
                  )}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 transition-colors shrink-0"
              aria-label="Close"
            >
              <X size={20} />
            </button>
          </div>

          <div className="overflow-y-auto flex-1 px-8 py-6 space-y-8">
            {(business.coverImage || logo) && (
              <div className="grid sm:grid-cols-2 gap-4">
                {business.coverImage && (
                  <div className="rounded-2xl overflow-hidden border border-slate-100 aspect-video bg-slate-50">
                    <img src={business.coverImage} alt="Cover" className="w-full h-full object-cover" />
                  </div>
                )}
                {logo && (
                  <div className="rounded-2xl overflow-hidden border border-slate-100 aspect-video bg-slate-50 flex items-center justify-center p-4">
                    <img src={logo} alt="Logo" className="max-h-full max-w-full object-contain" />
                  </div>
                )}
              </div>
            )}

            <div className="grid sm:grid-cols-2 gap-6">
              <DetailRow label="ABN" value={business.abn} />
              <DetailRow label="Location" value={business.location} />
              <DetailRow label="Suburb" value={business.suburb} />
              <DetailRow label="Years in Business" value={business.yearsInBusiness} />
              <DetailRow label="Experience" value={business.experience} />
              <DetailRow label="Services Offered" value={business.servicesOffered} />
            </div>

            <div className="space-y-4">
              <DetailRow
                label="Short Description"
                value={business.shortDescription || business.description}
              />
              {business.longDescription && (
                <DetailRow label="Full Description" value={business.longDescription} />
              )}
            </div>

            <div className="grid sm:grid-cols-2 gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-3">
                <User size={16} className="text-primary shrink-0" />
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Owner</p>
                  <p className="text-[13px] font-black text-slate-800">{ownerName}</p>
                </div>
              </div>
              {business.owner?.email && (
                <div className="flex items-center gap-3">
                  <Mail size={16} className="text-primary shrink-0" />
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Owner Email</p>
                    <p className="text-[13px] font-semibold text-slate-700">{business.owner.email}</p>
                  </div>
                </div>
              )}
              {business.contactEmail && (
                <div className="flex items-center gap-3">
                  <Mail size={16} className="text-slate-400 shrink-0" />
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Business Email</p>
                    <p className="text-[13px] font-semibold text-slate-700">{business.contactEmail}</p>
                  </div>
                </div>
              )}
              {business.contactPhone && (
                <div className="flex items-center gap-3">
                  <Phone size={16} className="text-slate-400 shrink-0" />
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Phone</p>
                    <p className="text-[13px] font-semibold text-slate-700">{business.contactPhone}</p>
                  </div>
                </div>
              )}
              {business.website && (
                <div className="flex items-center gap-3 sm:col-span-2">
                  <Globe size={16} className="text-slate-400 shrink-0" />
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Website</p>
                    <a
                      href={business.website.startsWith('http') ? business.website : `https://${business.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[13px] font-semibold text-primary hover:underline break-all"
                    >
                      {business.website}
                    </a>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-3">
                <MapPin size={16} className="text-slate-400 shrink-0" />
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Region</p>
                  <p className="text-[13px] font-semibold text-slate-700">{business.location}</p>
                </div>
              </div>
              {business.createdAt && (
                <div className="flex items-center gap-3">
                  <Calendar size={16} className="text-slate-400 shrink-0" />
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Submitted</p>
                    <p className="text-[13px] font-semibold text-slate-700">
                      {new Date(business.createdAt).toLocaleString('en-AU')}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {business.tags && business.tags.length > 0 && (
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1">
                  <Tag size={12} /> Tags
                </p>
                <div className="flex flex-wrap gap-2">
                  {business.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 rounded-lg bg-slate-100 text-[11px] font-bold text-slate-600"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {business.gallery && business.gallery.length > 0 && (
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1">
                  <ImageIcon size={12} /> Gallery ({business.gallery.length})
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {business.gallery.map((img, idx) => (
                    <div
                      key={img._id || idx}
                      className="aspect-square rounded-xl overflow-hidden border border-slate-100 bg-slate-50"
                    >
                      {img.url ? (
                        <img src={img.url} alt={img.title || ''} className="w-full h-full object-cover" />
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="px-8 py-6 border-t border-slate-100 flex flex-wrap items-center justify-end gap-3 shrink-0 bg-slate-50/50">
            <button
              onClick={onClose}
              disabled={isProcessing}
              className="px-6 py-3 rounded-xl text-[12px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-100 transition-all disabled:opacity-50"
            >
              Close
            </button>
            {isPendingDelete ? (
              <>
                <button
                  onClick={() => onRejectDeletion?.(id)}
                  disabled={isProcessing}
                  className="flex items-center gap-2 px-6 py-3 bg-slate-100 text-slate-600 rounded-xl text-[12px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all border border-slate-200 disabled:opacity-50"
                >
                  Keep Listing
                </button>
                <button
                  onClick={() => onApproveDeletion?.(id)}
                  disabled={isProcessing}
                  className="flex items-center gap-2 px-6 py-3 bg-rose-500 text-white rounded-xl text-[12px] font-black uppercase tracking-widest hover:bg-rose-600 transition-all shadow-lg shadow-rose-500/20 disabled:opacity-50"
                >
                  <Check size={14} strokeWidth={3} /> Approve Delete
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={onReject}
                  disabled={isProcessing}
                  className="flex items-center gap-2 px-6 py-3 bg-rose-50 text-rose-500 rounded-xl text-[12px] font-black uppercase tracking-widest hover:bg-rose-100 transition-all border border-rose-100 disabled:opacity-50"
                >
                  <X size={14} strokeWidth={3} /> Reject
                </button>
                <button
                  onClick={() => onApprove(id)}
                  disabled={isProcessing}
                  className="flex items-center gap-2 px-6 py-3 bg-emerald-500 text-white rounded-xl text-[12px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50"
                >
                  <Check size={14} strokeWidth={3} /> Approve
                </button>
              </>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default BusinessReviewModal;
