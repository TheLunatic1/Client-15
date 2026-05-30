import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, LayoutGrid } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getCategories } from '../../../api/categoryApi';

interface CategorySectionProps {
  onAdd: () => void;
  onEdit: (cat: any) => void;
  onDelete: (id: number | string) => void;
  refreshKey: number;
}

const CategorySection = ({ onAdd, onEdit, onDelete, refreshKey }: CategorySectionProps) => {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadCategories = async () => {
      try {
        setLoading(true);
        const data = await getCategories();
        const mapped = Array.isArray(data)
          ? data.map((item: any) => ({ id: item._id ?? item.id, name: item.name, slug: item.slug, image: item.image }))
          : [];
        if (mounted) {
          setCategories(mapped);
          setError(null);
        }
      } catch (err: any) {
        if (mounted) setError(err?.message ?? 'Error fetching categories');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadCategories();

    return () => {
      mounted = false;
    };
  }, [refreshKey]);

  const displayCategories = categories;

  return (
    <motion.div key="categories" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-black text-[#0D1F43]">Service Categories</h2>
          <p className="text-[12px] font-bold text-slate-400 uppercase tracking-widest">Manage industries and listing types</p>
        </div>
        <button 
          onClick={onAdd}
          className="bg-[#097DDD] hover:bg-[#0869bb] text-white px-8 py-4 rounded-2xl font-black text-[12px] uppercase tracking-[0.2em] transition-all shadow-xl shadow-blue-500/20 flex items-center gap-3"
        >
          <Plus size={16} strokeWidth={3} />
          Add New Category
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading && (
          <div className="col-span-full text-center text-sm text-slate-500">Loading categories...</div>
        )}
        {!loading && error && (
          <div className="col-span-full text-center text-sm text-red-500">{error}</div>
        )}

        {displayCategories.map((cat) => (
          <div key={cat.id || cat._id || cat.name} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
            <div className="flex items-center justify-between mb-8">
              <div className="w-14 h-14 bg-primary/5 text-primary rounded-2xl flex items-center justify-center overflow-hidden group-hover:scale-110 transition-transform">
                {cat.image ? (
                  <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                ) : (
                  <LayoutGrid size={24} />
                )}
              </div>
              <div className="flex gap-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                <button onClick={() => onEdit(cat)} className="p-2 text-slate-400 hover:text-primary transition-colors">
                  <Edit2 size={14} />
                </button>
                <button onClick={() => onDelete(cat.id)} className="p-2 text-slate-400 hover:text-red-500 transition-colors">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
            <h3 className="text-lg font-black text-[#0D1F43] mb-2">{cat.name}</h3>
            <div className="flex items-center justify-end">
              <span className="text-[11px] font-black text-primary uppercase bg-primary/5 px-3 py-1 rounded-full">Active</span>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default CategorySection;
