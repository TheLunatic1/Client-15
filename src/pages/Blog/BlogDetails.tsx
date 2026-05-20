import { motion } from 'framer-motion';
import { Calendar, Link as LinkIcon, ChevronRight } from 'lucide-react';

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

const BlogDetails = () => {
  useParams();

  // Mock data for the blog post - in a real app, you'd fetch this based on the ID
  const post = {
    id: 1,
    title: "How Much Does Plumbing Cost in Australia?",
    category: "PLUMBING",
    author: {
      name: "Marcus Thorne",
      role: "Trade Expert",
      avatar: "https://i.pravatar.cc/150?u=marcus"
    },
    date: "15 May 2026",
    readTime: "4 min read",
    image: "https://images.unsplash.com/photo-1504148455328-c6769171d3d2?auto=format&fit=crop&q=80&w=1600",
    excerpt: "Learn how much plumbing costs in Australia. Explore pricing factors, common jobs, hourly rates, and tips to save money on your next project.",
    content: `
      <p>Plumbing issues can arise at any time, and understanding the potential costs involved is essential for every Australian homeowner. Whether it's a simple leaky tap or a complete bathroom renovation, being prepared for the financial aspect helps in making informed decisions.</p>
      
      <h3>1. Standard Hourly Rates</h3>
      <p>In Australia, most plumbers charge an hourly rate ranging from <strong>$80 to $150</strong>, depending on their experience, location, and the complexity of the job. It's important to note that many plumbers also charge a 'call-out fee', which typically covers the first 30 minutes of work or travel time.</p>
      
      <div class="bg-[#f8fafc] border-l-4 border-[#097DDD] p-8 my-10 rounded-r-2xl">
        <p class="text-[#0A1830] font-bold italic text-lg mb-0">"Always ensure your plumber is licensed and insured. While it might be tempting to go with the cheapest quote, quality workmanship saves you thousands in the long run."</p>
      </div>

      <h3>2. Common Plumbing Job Costs</h3>
      <ul>
        <li><strong>Leaky Taps:</strong> $80 – $150</li>
        <li><strong>Toilet Repairs:</strong> $150 – $300</li>
        <li><strong>Hot Water System Installation:</strong> $1,500 – $4,000</li>
        <li><strong>Blocked Drains:</strong> $150 – $500 (depending on equipment needed)</li>
      </ul>

      <h3>3. Factors Affecting the Price</h3>
      <p>Several factors can influence the final bill. Emergency call-outs after hours or on weekends will naturally incur higher fees. The accessibility of the plumbing, the materials required, and whether specialized equipment like drain cameras or jetters are needed will also play a role.</p>
    `
  };

  return (
    <div className="min-h-screen bg-[#050f26] text-white font-sans">
      {/* ── Hero Section ── */}
      <section className="relative pt-44 pb-32 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={post.image}
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
            <span className="text-white/40 text-[10px] font-black uppercase tracking-widest">{post.category}</span>
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
              <div className="w-12 h-12 rounded-full border-2 border-[#097DDD] p-0.5">
                <img src={post.author.avatar} className="w-full h-full rounded-full object-cover" alt={post.author.name} />
              </div>
              <div>
                <p className="text-sm font-black text-white">{post.author.name}</p>
                <p className="text-[10px] font-black text-[#097DDD] uppercase tracking-widest">{post.author.role}</p>
              </div>
            </div>

            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2.5">
                <Calendar size={16} className="text-white/20" />
                <span className="text-xs font-bold text-white/50">{post.date}</span>
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
            {/* Share Sidebar (Desktop Only) */}
            <div className="p-8 md:p-16 lg:p-20">
              <div className="prose prose-slate max-w-none prose-headings:text-[#0A1830] prose-headings:font-black prose-p:text-[#5a6a85] prose-p:leading-[1.8] prose-p:font-medium prose-strong:text-[#0A1830] prose-li:text-[#5a6a85] prose-li:font-medium">
                <div dangerouslySetInnerHTML={{ __html: post.content }} />
              </div>

              {/* Tag Cloud & Share */}
              <div className="mt-16 pt-16 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex flex-wrap gap-2">
                  {['Cost Guide', 'Plumbing', 'Australia', 'Home Advice'].map(tag => (
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
            <img src={post.author.avatar} className="w-24 h-24 rounded-full border-4 border-white/5" alt={post.author.name} />
            <div className="text-center md:text-left">
              <h4 className="text-xl font-black mb-2">{post.author.name}</h4>
              <p className="text-white/40 text-sm leading-relaxed mb-4">
                Marcus is a seasoned trade industry expert with over 15 years of experience in connecting homeowners with the right professionals across MyLocalPro and Australia.
              </p>
              <Link to="/find-a-pro" className="text-[#097DDD] text-[10px] font-black uppercase tracking-widest hover:underline">View all posts by Marcus</Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BlogDetails;
