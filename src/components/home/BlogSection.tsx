import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowRight, Tag } from "lucide-react";
import { useRef } from "react";

const CARD_W = 360;
const GAP = 24;

import blog1Img from '../../assets/section images/electrician-installing-laying-electrical-cables-ceiling-inside-house.jpg';
import blog2Img from '../../assets/section images/tradie-3.png';
import blog3Img from '../../assets/section images/tradie-1.png';
import blog4Img from '../../assets/section images/imgi_57_image-1738135596812.png';
import blog5Img from '../../assets/section images/david-clode-h7D3RSePhnc-unsplash.jpg';
import blog6Img from '../../assets/section images/imgi_5_fecar.png';

const BLOG_POSTS = [
  {
    id: 1,
    title: "How Much Does Plumbing Cost in Australia?",
    category: "PLUMBING",
    image: blog3Img,
    excerpt: "Learn how much plumbing costs in Australia. Explore pricing factors, common jobs, hourly rates, and tips to save money on your next project.",
    date: "May 15, 2026",
    publisher: "System Admin"
  },
  {
    id: 2,
    title: "How Much Does Electrical Work Cost in Australia?",
    category: "ELECTRICAL",
    image: blog1Img,
    excerpt: "Discover the cost of electrical work in Australia. Learn average prices per job, key cost factors, and tips to save on installation and repairs.",
    date: "May 12, 2026",
    publisher: "System Admin"
  },
  {
    id: 3,
    title: "How Much Does a Home Renovation Cost in Australia?",
    category: "BUILDING",
    image: blog2Img,
    excerpt: "Planning a home renovation? Explore average costs for kitchen, bathroom, and full-home renovations, plus tips to stay on budget.",
    date: "May 10, 2026",
    publisher: "System Admin"
  },
  {
    id: 4,
    title: "How to Find MyLocalPros in Australia",
    category: "TIPS",
    image: blog4Img,
    excerpt: "Finding a reliable tradie doesn't have to be hard. Here are the best tips for finding verified, trusted tradespeople for any job.",
    date: "May 08, 2026",
    publisher: "System Admin"
  },
  {
    id: 5,
    title: "How Much Does Landscaping Cost in Australia?",
    category: "LANDSCAPING",
    image: blog5Img,
    excerpt: "Transform your outdoor space with our comprehensive guide to landscaping costs. From basic turfing to complete garden redesigns, we break down the prices.",
    date: "May 05, 2026",
    publisher: "System Admin"
  },
  {
    id: 6,
    title: "Handyman Price Guide: What to Expect",
    category: "HANDYMAN",
    image: blog6Img,
    excerpt: "From fixing a leaky tap to hanging doors, find out the average costs for common handyman tasks and how they charge for their time.",
    date: "May 02, 2026",
    publisher: "System Admin"
  },
];

const BlogSection = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === "left" ? -(CARD_W + GAP) : (CARD_W + GAP),
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="pt-[30px] pb-[20px] bg-white overflow-hidden">
      {/* Header */}
      <div className="section-container mb-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-black text-[#0A1830]"
          >
            Our <span className="text-primary">Blogs</span>
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto"
          >
            {/* Nav arrows */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => scroll("left")}
                className="h-12 w-12 rounded-full border border-slate-100 flex items-center justify-center text-[#0A1830] hover:bg-primary hover:text-white transition-all duration-300 active:scale-95"
                aria-label="Scroll Left"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={() => scroll("right")}
                className="h-12 w-12 rounded-full border border-slate-100 flex items-center justify-center text-[#0A1830] hover:bg-primary hover:text-white transition-all duration-300 active:scale-95"
                aria-label="Scroll Right"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </div>

            <Link
              to="/blog"
              className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-primary text-[11px] font-black uppercase tracking-[0.15em] text-white shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all duration-300"
            >
              View All
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Full-bleed slider */}
      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto pb-10 no-scrollbar px-5 lg:px-20"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {BLOG_POSTS.map((post, idx) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            style={{ minWidth: CARD_W, maxWidth: CARD_W }}
            className="flex-shrink-0"
          >
            <Link
              to={`/blog/${post.id}`}
              className="group block bg-white rounded-[32px] overflow-hidden shadow-[0_4px_24px_rgb(10,24,48,0.06)] hover:shadow-[0_20px_48px_rgb(10,24,48,0.12)] transition-all duration-500 hover:-translate-y-2 border border-slate-100 h-full"
            >
              {/* Card image with title overlay */}
              <div className="relative overflow-hidden bg-[#0A1830] h-64">
                <img
                  src={post.image}
                  alt={post.title}
                  className="absolute inset-0 h-full w-full object-cover opacity-70 transition-transform duration-700 group-hover:scale-110"
                />
                {/* Dark gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A1830] via-transparent to-transparent opacity-90" />

                {/* Category badge */}
                <div className="absolute top-6 left-6 flex items-center gap-1.5 bg-primary rounded-full px-4 py-1.5 z-10 shadow-lg">
                  <Tag className="h-3.5 w-3.5 text-white" />
                  <span className="text-[10px] font-black uppercase tracking-wider text-white">
                    {post.category}
                  </span>
                </div>

                {/* Title on image */}
                <div className="absolute bottom-6 left-6 right-6 z-10">
                  <h3 className="text-white font-black text-xl leading-tight line-clamp-2">
                    {post.title}
                  </h3>
                </div>
              </div>

              {/* Card body */}
              <div className="p-8">
                <p className="text-sm text-[#5a7089] leading-relaxed line-clamp-3 mb-8">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between border-t border-slate-50 pt-6">
                  <span className="inline-flex items-center gap-1.5 text-primary text-sm font-black group-hover:gap-3 transition-all duration-300">
                    Explore More <ArrowRight className="h-4 w-4" />
                  </span>
                  <div className="flex flex-col items-end text-[11px] text-[#5a7089] font-bold">
                    <span className="text-primary font-black uppercase text-[9px] tracking-wider mb-0.5">By {post.publisher}</span>
                    <span>{post.date}</span>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}

        {/* Right padding sentinel */}
        <div className="shrink-0 w-20" aria-hidden />
      </div>
    </section>
  );
};

export default BlogSection;
