import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Briefcase, Phone, FileText, Save, X, AlertCircle, Loader2,
} from 'lucide-react';
import Swal from 'sweetalert2';
import { updateBusiness } from '../../api/businessApi';
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
  onClose: () => void;
  onSaved: () => void;
};

export default function BusinessEditModal({
  isOpen,
  businessId,
  businessName,
  status,
  initialData,
  onClose,
  onSaved,
}: Props) {
  const [form, setForm] = useState<BusinessEditForm>(emptyForm);
  const [saving, setSaving] = useState(false);

  const isRejected = status.toLowerCase() === 'rejected';
  const isPendingDelete = status.toLowerCase().includes('delete');

  useEffect(() => {
    if (isOpen && initialData) {
      setForm(initialData);
    }
  }, [isOpen, initialData]);

  const setField = (field: keyof BusinessEditForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!businessId) return;
    const check = validateBusinessEdit(form);
    if ('message' in check) {
      showValidationAlert(check.message);
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
      };

      const updated = await updateBusiness(businessId, payload);

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
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
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
            className="relative z-10 w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col bg-white rounded-[2rem] border border-slate-200 shadow-2xl"
          >
            <div className="flex items-start justify-between gap-4 px-8 pt-8 pb-4 border-b border-slate-100 shrink-0">
              <div>
                <p className="text-[10px] font-black text-[#097DDD] uppercase tracking-[0.25em] mb-1">
                  Edit listing
                </p>
                <h2 className="text-xl font-black text-slate-900">{businessName}</h2>
                <span
                  className={`inline-block mt-2 text-[9px] font-black uppercase tracking-wider px-3 py-1 rounded-lg ${
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
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                aria-label="Close"
              >
                <X size={22} />
              </button>
            </div>

            <div className="overflow-y-auto px-8 py-6 space-y-8 custom-scrollbar">
              {isRejected && (
                <div className="flex gap-3 p-4 rounded-2xl bg-rose-50 border border-rose-200">
                  <AlertCircle className="text-rose-500 shrink-0 mt-0.5" size={20} />
                  <div>
                    <p className="font-black text-rose-900 text-sm">Listing rejected</p>
                    <p className="text-rose-700/80 text-xs mt-1 leading-relaxed">
                      Update your details below and save to resubmit for admin approval. Check your
                      notifications for the rejection reason.
                    </p>
                  </div>
                </div>
              )}

              {isPendingDelete && (
                <div className="flex gap-3 p-4 rounded-2xl bg-amber-50 border border-amber-200">
                  <AlertCircle className="text-amber-600 shrink-0" size={20} />
                  <p className="text-amber-900 text-xs font-medium">
                    This listing is pending deletion approval. Editing is disabled.
                  </p>
                </div>
              )}

              <section>
                <h3 className="text-sm font-black text-slate-800 mb-4 flex items-center gap-2">
                  <Briefcase className="text-[#097DDD]" size={18} /> Business details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2 md:col-span-2">
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

              <section>
                <h3 className="text-sm font-black text-slate-800 mb-4 flex items-center gap-2">
                  <FileText className="text-[#097DDD]" size={18} /> Descriptions
                </h3>
                <div className="space-y-5">
                  <div className="space-y-2">
                    <label className={labelCls}>Short description</label>
                    <textarea
                      rows={2}
                      value={form.shortDescription}
                      onChange={(e) => setField('shortDescription', e.target.value)}
                      className={`${inputCls} resize-none`}
                      disabled={isPendingDelete || saving}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className={labelCls}>Detailed writeup</label>
                    <textarea
                      rows={5}
                      value={form.longDescription}
                      onChange={(e) => setField('longDescription', e.target.value)}
                      className={`${inputCls} resize-y font-medium`}
                      disabled={isPendingDelete || saving}
                    />
                  </div>
                </div>
              </section>
            </div>

            <div className="shrink-0 px-8 py-5 border-t border-slate-100 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] text-slate-500 hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              {!isPendingDelete && (
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className="bg-[#097DDD] hover:bg-[#0869bb] disabled:opacity-60 text-white px-8 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all flex items-center gap-2 shadow-lg shadow-[#097DDD]/20"
                >
                  {saving ? (
                    <>
                      <Loader2 size={14} className="animate-spin" /> Saving...
                    </>
                  ) : (
                    <>
                      <Save size={14} />
                      {isRejected ? 'Resubmit for approval' : 'Save changes'}
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
