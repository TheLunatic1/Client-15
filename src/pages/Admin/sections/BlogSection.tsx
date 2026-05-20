import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, Calendar } from 'lucide-react';

interface BlogSectionProps {
  blogs: any[];
  onAdd: () => void;
  onEdit: (blog: any) => void;
  onDelete: (id: string | number) => void;
}

const BlogSection = ({ blogs, onAdd, onEdit, onDelete }: BlogSectionProps) => {
  return (
    <motion.div key="blogs" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-black text-[#0D1F43]">Blog Manager</h2>
          <p className="text-[12px] font-bold text-slate-400 uppercase tracking-widest">Publish news and expert advice</p>
        </div>
        <button 
          onClick={onAdd}
          className="bg-[#097DDD] hover:bg-[#0869bb] text-white px-8 py-4 rounded-2xl font-black text-[12px] uppercase tracking-[0.2em] transition-all shadow-xl shadow-blue-500/20 flex items-center gap-3"
        >
          <Plus size={16} strokeWidth={3} />
          Create New Article
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogs.map((blog) => {
          const blogId = blog._id || blog.id;
          return (
            <div key={blogId} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group overflow-hidden flex flex-col">
              <div className="relative h-56 overflow-hidden">
                <img src={blog.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                <div className="absolute top-4 left-4">
                  <span className="bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-widest text-primary shadow-sm">
                    {blog.category}
                  </span>
                </div>
              </div>
              <div className="p-8 flex-grow flex flex-col">
                <div className="flex items-center justify-between text-slate-400 mb-4">
                  <div className="flex items-center gap-1.5">
                    <Calendar size={12} className="text-primary" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">{blog.date}</span>
                  </div>
                  <span className="text-[9px] font-black text-primary bg-primary/5 px-2.5 py-1 rounded-md uppercase tracking-wider">By {blog.publisher || 'Admin'}</span>
                </div>
                <h3 className="text-lg font-black text-[#0D1F43] mb-4 group-hover:text-primary transition-colors line-clamp-2 leading-tight">
                  {blog.title}
                </h3>
                <div className="mt-auto flex items-center justify-between pt-6 border-t border-slate-50">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Live on website</span>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => onEdit(blog)} className="p-2.5 bg-slate-50 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-xl transition-all">
                      <Edit2 size={14} />
                    </button>
                    <button onClick={() => onDelete(blogId)} className="p-2.5 bg-slate-50 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default BlogSection;
