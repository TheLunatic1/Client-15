/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getBlogs } from '../../api/blogApi';

// Fallback posts shown while API loads or if API returns nothing
const FALLBACK_POSTS = [
  {
    id: '1',
    title: "How Much Does Plumbing Cost in Australia?",
    category: "PLUMBING",
    image: "https://images.unsplash.com/photo-1504148455328-c6769171d3d2?auto=format&fit=crop&q=80&w=800",
    excerpt: "Learn how much plumbing costs in Australia. Explore pricing factors, common jobs, hourly rates, and tips to save money on your next job.",
    date: "May 15, 2026",
    publisher: "System Admin",
  },
  {
    id: '2',
    title: "How Much Does Electrical Work Cost in Australia?",
    category: "ELECTRICAL",
    image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=800",
    excerpt: "Discover the cost of electrical work in Australia. Learn average prices per job and tips to save on installation and repairs.",
    date: "May 12, 2026",
    publisher: "System Admin",
  },
  {
    id: '3',
    title: "How Much Does a Home Renovation Cost in Australia?",
    category: "BUILDING",
    image: "https://images.unsplash.com/photo-1503387762-592dea58ef21?auto=format&fit=crop&q=80&w=800",
    excerpt: "Planning a home renovation? Explore average costs for kitchen, bathroom, and full-home renovations, plus tips to stay on budget.",
    date: "May 10, 2026",
    publisher: "System Admin",
  },
];

const BlogPage = () => {
  const [blogs, setBlogs] = useState<any[]>(FALLBACK_POSTS);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const data = await getBlogs();
        if (data && Array.isArray(data) && data.length > 0) {
          setBlogs(
            data.map((b: any) => ({
              id: b._id || b.id,
              title: b.title,
              // category is a populated object { name, slug } or a raw string
              category: (typeof b.category === 'object' && b.category?.name)
                ? b.category.name.toUpperCase()
                : (b.category || 'BLOG').toString().toUpperCase(),
              // image may be a URL stored on the blog or a Cloudinary URL
              image: b.image || "https://images.unsplash.com/photo-1504148455328-c6769171d3d2?auto=format&fit=crop&q=80&w=800",
              excerpt: b.excerpt || '',
              date: b.createdAt
                ? new Date(b.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                : 'Unknown',
              publisher: b.writer || 'System Admin',
            }))
          );
        }
        // if API returns empty array keep the fallback posts so page isn't blank
      } catch (err) {
        console.error('BlogPage fetch error:', err);
        // keep fallback on error
      } finally {
        setIsLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  const filtered = blogs.filter(
    (p) =>
      !searchQuery ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#050f26] text-white font-sans">
      {/* ── Header ── */}
      <section className="relative pt-44 pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-[#050f26]" />
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-[#097DDD]/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-[1400px] mx-auto px-6 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-[#097DDD]/10 border border-[#097DDD]/20 mb-8">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#097DDD]">Knowledge Hub</span>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-5xl md:text-7xl font-black text-white leading-tight mb-8">
            Our <span className="text-[#097DDD]">Blogs</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-white/50 max-w-2xl mx-auto text-sm md:text-base font-medium leading-relaxed mb-12">
            Cost guides, how-to articles, and trade tips to help Australians hire smarter.
          </motion.p>

          {/* Search */}
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }} className="max-w-xl mx-auto relative group">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search blogs..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-8 text-white focus:outline-none focus:border-[#097DDD] transition-all placeholder:text-white/20"
            />
          </motion.div>
        </div>
      </section>

      {/* ── Blog Grid ── */}
      <section className="pb-32 px-6">
        <div className="max-w-[1400px] mx-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 size={40} className="text-[#097DDD] animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 text-white/40 font-bold">No blog posts found.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filtered.map((post, idx) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.08 }}
                  className="group bg-white rounded-[2rem] overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 flex flex-col"
                >
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1504148455328-c6769171d3d2?auto=format&fit=crop&q=80&w=800";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute top-6 left-6">
                      <span className="px-4 py-2 bg-[#097DDD] text-white text-[9px] font-black uppercase tracking-widest rounded-full shadow-lg flex items-center gap-2">
                        <BookOpen size={10} />
                        {post.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-8 flex-grow flex flex-col">
                    <h3 className="text-xl font-black text-[#0A1830] mb-4 group-hover:text-[#097DDD] transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-[#64748b] text-sm leading-relaxed mb-8 line-clamp-3 font-medium">
                      {post.excerpt}
                    </p>

                    <div className="mt-auto pt-6 border-t border-slate-100 flex items-center justify-between">
                      <Link
                        to={`/blog/${post.id}`}
                        className="inline-flex items-center gap-2 text-[#097DDD] text-[11px] font-black uppercase tracking-widest group/btn"
                      >
                        Explore More
                        <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                      </Link>
                      <div className="flex flex-col items-end text-[11px] text-[#64748b] font-bold">
                        <span className="text-[#097DDD] font-black uppercase text-[9px] tracking-wider mb-0.5">By {post.publisher}</span>
                        <span>{post.date}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default BlogPage;