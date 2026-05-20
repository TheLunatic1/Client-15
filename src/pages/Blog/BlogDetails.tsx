import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Link as LinkIcon, ChevronRight, Loader2 } from 'lucide-react';

const Facebook = (props: any) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const Twitter = (props: any) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 4s-1 1-2 1.25c1 1 1 2.5 1.5 3.5-1-.5-2-1-3-1-2 0-3.5 1.5-3.5 3.5 0 .25 0 .5.05.75-3.5-.15-6.5-1.75-8.5-4 0 0-2 3.5 1.5 5.5-1 0-2-.25-3-.75 0 2.5 1.75 4.5 4 5-.5.15-1 .2-1.5.2-.35 0-.7 0-1-.05.75 2.25 2.75 4 5 4-1.75 1.5-4 2.25-6.5 2.25-.5 0-1 0-1.5-.05 2.25 1.5 5 2.25 8 2.25 9.5 0 14.5-8 14.5-14.5 0-.25 0-.5 0-.75 1-1 2-2 2-3z" />
  </svg>
);
import { Link, useParams } from 'react-router-dom';
import { getBlogById } from '../../api/blogApi';

const BlogDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    getBlogById(id)
      .then((data) => setPost(data))
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050f26]">
        <Loader2 size={40} className="text-[#097DDD] animate-spin" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050f26]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Blog post not found</h2>
          <Link to="/blog" className="text-[#097DDD] hover:underline">Return to Blog</Link>
        </div>
      </div>
    );
  }

  const authorName = post.writer || post.author?.name || 'System Admin';
  const postDate = post.createdAt
    ? new Date(post.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })
    : post.date || '';
  const category = post.category?.name || post.category || 'BLOG';
  const image = post.image || 'https://images.unsplash.com/photo-1504148455328-c6769171d3d2?auto=format&fit=crop&q=80&w=1600';
  const tags = post.tags || [category];


  return (
    <div className="min-h-screen bg-[#050f26] text-white font-sans">
      {/* ── Hero Section ── */}
      <section className="relative pt-44 pb-32 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={image}
            className="w-full h-full object-cover opacity-20"
            alt={post.title}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#050f26] via-[#050f26]/90 to-[#050f26]" />
        </div>

        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 mb-8"
          >
            <Link to="/blog" className="text-[#097DDD] text-[10px] font-black uppercase tracking-widest hover:opacity-70 transition-opacity">Blog</Link>
            <ChevronRight size={12} className="text-white/20" />
            <span className="text-white/40 text-[10px] font-black uppercase tracking-widest">{category}</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-black text-white leading-tight mb-8"
          >
            {post.title}
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap items-center gap-8 py-8 border-y border-white/10"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full border-2 border-[#097DDD] p-0.5 bg-[#097DDD]/20 flex items-center justify-center">
                <span className="text-white font-black text-lg">{authorName[0]}</span>
              </div>
              <div>
                <p className="text-sm font-black text-white">{authorName}</p>
                <p className="text-[10px] font-black text-[#097DDD] uppercase tracking-widest">Author</p>
              </div>
            </div>

            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2.5">
                <Calendar size={16} className="text-white/20" />
                <span className="text-xs font-bold text-white/50">{postDate}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Content Section ── */}
      <main className="pb-32 px-6 relative z-10 -mt-16">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-[2.5rem] shadow-[0_40px_100px_rgba(0,0,0,0.5)] overflow-hidden"
          >
            <div className="p-8 md:p-16 lg:p-20">
              <div className="prose prose-slate max-w-none prose-headings:text-[#0A1830] prose-headings:font-black prose-p:text-[#5a6a85] prose-p:leading-[1.8] prose-p:font-medium prose-strong:text-[#0A1830] prose-li:text-[#5a6a85] prose-li:font-medium">
                <div dangerouslySetInnerHTML={{ __html: post.content || `<p>${post.excerpt || ''}</p>` }} />
              </div>

              {/* Tag Cloud & Share */}
              <div className="mt-16 pt-16 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag: string) => (
                    <span key={tag} className="px-4 py-2 bg-[#F4F7FA] text-[#64748b] text-[10px] font-black uppercase tracking-widest rounded-lg">#{tag}</span>
                  ))}
                </div>

                <div className="flex items-center gap-4">
                  <p className="text-[10px] font-black text-[#A4B1CD] uppercase tracking-widest mr-2">Share this post</p>
                  <button className="w-10 h-10 rounded-full bg-[#f8fafc] flex items-center justify-center text-[#64748b] hover:bg-[#097DDD] hover:text-white transition-all"><Facebook size={18} /></button>
                  <button className="w-10 h-10 rounded-full bg-[#f8fafc] flex items-center justify-center text-[#64748b] hover:bg-[#097DDD] hover:text-white transition-all"><Twitter size={18} /></button>
                  <button className="w-10 h-10 rounded-full bg-[#f8fafc] flex items-center justify-center text-[#64748b] hover:bg-[#097DDD] hover:text-white transition-all"><LinkIcon size={18} /></button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Author Box */}
          <div className="mt-12 bg-white/5 border border-white/10 rounded-[2rem] p-10 flex flex-col md:flex-row items-center gap-8">
            <div className="w-24 h-24 rounded-full border-4 border-white/5 bg-[#097DDD]/20 flex items-center justify-center text-white text-3xl font-black">
              {authorName[0]}
            </div>
            <div className="text-center md:text-left">
              <h4 className="text-xl font-black mb-2">{authorName}</h4>
              <p className="text-white/40 text-sm leading-relaxed mb-4">
                A trade industry expert connecting homeowners with the right professionals across MyLocalPro Australia.
              </p>
              <Link to="/blog" className="text-[#097DDD] text-[10px] font-black uppercase tracking-widest hover:underline">View all posts</Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BlogDetails;

