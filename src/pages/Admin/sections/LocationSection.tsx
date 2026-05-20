import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, MapPin } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getLocations } from '../../../api/locationApi';

interface LocationSectionProps {
  onAdd: () => void;
  onEdit: (loc: any) => void;
  onDelete: (id: number | string) => void;
  refreshKey: number;
}

const LocationSection = ({ onAdd, onEdit, onDelete, refreshKey }: LocationSectionProps) => {
  const [locations, setLocations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadLocations = async () => {
      try {
        setLoading(true);
        const data = await getLocations();
        const mapped = Array.isArray(data)
          ? data.map((item: any) => ({ id: item._id ?? item.id, city: item.city, region: item.region }))
          : [];
        if (mounted) {
          setLocations(mapped);
          setError(null);
        }
      } catch (err: any) {
        if (mounted) setError(err?.message ?? 'Error fetching locations');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadLocations();

    return () => {
      mounted = false;
    };
  }, [refreshKey]);

  const displayLocations = locations;

  return (
    <motion.div key="locations" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-black text-[#0D1F43]">Locations</h2>
          <p className="text-[12px] font-bold text-slate-400 uppercase tracking-widest">Manage regional coverage</p>
        </div>
        <button 
          onClick={onAdd}
          className="bg-[#097DDD] hover:bg-[#0869bb] text-white px-8 py-4 rounded-2xl font-black text-[12px] uppercase tracking-[0.2em] transition-all shadow-xl shadow-blue-500/20 flex items-center gap-3"
        >
          <Plus size={16} strokeWidth={3} />
          Add New Location
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading && (
          <div className="col-span-full text-center text-sm text-slate-500">Loading locations...</div>
        )}
        {!loading && error && (
          <div className="col-span-full text-center text-sm text-red-500">{error}</div>
        )}

        {displayLocations.map((loc) => (
          <div key={loc.id || loc._id || loc.city} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
              <MapPin size={80} />
            </div>
            <div className="relative z-10">
              <div className="w-12 h-12 bg-indigo-50 text-indigo-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <MapPin size={20} />
              </div>
              <h3 className="text-xl font-black text-[#0D1F43] mb-1">{loc.city}</h3>
              <p className="text-[12px] font-bold text-slate-400 uppercase tracking-widest mb-6">{loc.region}</p>
              
              <div className="flex items-center justify-end">
                <div className="flex gap-2">
                  <button onClick={() => onEdit(loc)} className="p-2.5 bg-slate-50 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-xl transition-all">
                    <Edit2 size={14} />
                  </button>
                  <button onClick={() => onDelete(loc.id)} className="p-2.5 bg-slate-50 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default LocationSection;
