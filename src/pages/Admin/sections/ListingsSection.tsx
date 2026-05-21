import { motion } from 'framer-motion';
import { Search, Trash2, MapPin, Star, Loader2 } from 'lucide-react';

interface ListingsSectionProps {
  professionals: any[];
  onDelete: (id: string) => void;
  isLoading?: boolean;
}

const ListingsSection = ({ professionals, onDelete, isLoading }: ListingsSectionProps) => {
  return (
    <motion.div key="active" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
      <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-12 py-10 border-b border-slate-50 flex items-center justify-between">
          <h3 className="text-xl font-black text-[#0D1F43]">Approved Listings</h3>
          <div className="flex gap-4">
            <span className="bg-primary/10 text-primary px-4 py-2 rounded-xl text-[12px] font-black uppercase tracking-widest">
              {isLoading ? '…' : `${professionals.length} Total`}
            </span>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-24 text-slate-300">
            <Loader2 size={32} className="animate-spin" />
          </div>
        ) : professionals.length === 0 ? (
          <div className="py-24 text-center text-slate-400 font-bold text-sm uppercase tracking-widest">
            No approved listings yet
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-12 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Business</th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Category</th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Location</th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Rating</th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Owner</th>
                  <th className="px-12 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {professionals.map((pro) => {
                  const id = pro._id || pro.id;
                  const name = pro.businessName || pro.name || 'Unnamed';
                  const image = pro.coverImage || pro.logo || pro.image || '';
                  const owner = pro.owner;
                  const ownerName =
                    (typeof owner === 'object' && owner
                      ? owner.name ||
                        `${owner.firstName || ''} ${owner.lastName || ''}`.trim() ||
                        owner.email
                      : typeof owner === 'string'
                        ? owner
                        : '') || '—';
                  return (
                    <tr key={id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-12 py-8">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:scale-105 transition-transform overflow-hidden flex-shrink-0">
                            {image ? (
                              <img src={image} className="w-full h-full object-cover" alt="" />
                            ) : (
                              <Search size={20} />
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-black text-slate-900 leading-tight">{name}</p>
                            <p className="text-[12px] font-bold text-slate-400 uppercase tracking-tighter mt-1">{pro.reviews ?? 0} reviews</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-8">
                        <span className="px-4 py-1.5 bg-indigo-50 text-indigo-500 rounded-full text-[11px] font-black uppercase tracking-widest border border-indigo-100">
                          {pro.category}
                        </span>
                      </td>
                      <td className="px-8 py-8">
                        <div className="flex items-center gap-2 text-slate-500">
                          <MapPin size={12} className="text-primary" />
                          <span className="text-[13px] font-bold">{pro.location}</span>
                        </div>
                      </td>
                      <td className="px-8 py-8">
                        <div className="flex items-center gap-2 text-amber-500">
                          <Star size={12} fill="currentColor" />
                          <span className="text-sm font-black">{pro.rating ?? '0.0'}</span>
                        </div>
                      </td>
                      <td className="px-8 py-8">
                        <p className="text-[13px] font-bold text-slate-600">{ownerName}</p>
                      </td>
                      <td className="px-12 py-8">
                        <div className="flex items-center justify-end gap-3">
                          <button
                            onClick={() => onDelete(id)}
                            className="p-3 bg-slate-50 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all shadow-sm"
                          >
                            <Trash2 size={14} />
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

export default ListingsSection;
