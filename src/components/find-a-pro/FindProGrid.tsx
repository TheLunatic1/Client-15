import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Star, ChevronRight, MapPin, Search } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { getApprovedBusinesses } from "../../api/businessApi";

export const FindProGrid = () => {
  const [searchParams] = useSearchParams();
  const categoryFilter = searchParams.get("category");
  const locationFilter = searchParams.get("location");
  
  const [professionals, setProfessionals] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        const data = await getApprovedBusinesses();
        const mapped = data.map((b: any) => ({
          id: b._id || b.id,
          name: b.businessName,
          category: b.category?.name || b.category || 'Service Provider',
          location: b.location?.city ? `${b.location.city}, ${b.location.region}` : (b.location || 'Australia'),
          description: b.description || 'No description provided.',
          image: b.gallery?.[0]?.url || "https://images.unsplash.com/photo-1542013936693-884638332954?auto=format&fit=crop&q=80&w=800",
          tags: b.services?.length ? b.services : ['Professional'],
          rating: (Math.random() * (5 - 4) + 4).toFixed(1), // placeholder
          reviews: Math.floor(Math.random() * 50) + 1 // placeholder
        }));
        setProfessionals(mapped);
      } catch(err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBusinesses();
  }, []);

  const filteredPros = professionals.filter((pro) => {
    // Improved category matching (fuzzy/partial)
    const matchesCategory = !categoryFilter || (() => {
      const search = categoryFilter.toLowerCase();
      const target = pro.category.toLowerCase();
      // Check if target is in search OR search is in target
      // This handles "Plumbers" vs "Plumber" and "Handyman Services" vs "Handyman"
      return target.includes(search) || search.includes(target) || 
             (target === 'gardener' && search.includes('garden')) ||
             (target === 'cleaner' && search.includes('clean'));
    })();

    // Improved location matching (fuzzy/partial)
    const matchesLocation = !locationFilter || (() => {
      const search = locationFilter.toLowerCase().replace(' region', '').replace(' area', '');
      const target = pro.location.toLowerCase();
      return target.includes(search);
    })();

    return matchesCategory && matchesLocation;
  });

  return (
    <section className="bg-slate-50 py-20 pb-32">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        {isLoading ? (
          <div className="text-center py-20">Loading professionals...</div>
        ) : filteredPros.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPros.map((pro, index) => (
              <motion.div
                key={pro.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-[0_10px_40px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.08)] transition-all group flex flex-col"
              >
                {/* Image Section */}
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img
                    src={pro.image}
                    alt={pro.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute top-6 left-6">
                    <span className="text-[10px] font-black uppercase tracking-wider text-white bg-black/40 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20">
                      {pro.category}
                    </span>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-8 flex-1 flex flex-col">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-xl font-black text-slate-900 group-hover:text-[#097DDD] transition-colors leading-tight">
                      {pro.name}
                    </h3>
                  </div>

                  <div className="flex items-center text-[#097DDD] text-xs font-bold mb-4">
                    <MapPin size={14} className="mr-1.5" />
                    {pro.location}
                  </div>

                  <p className="text-slate-500 text-sm leading-relaxed mb-6 line-clamp-2">
                    {pro.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-8">
                    {pro.tags.map((tag: string) => (
                      <span key={tag} className="text-[10px] font-bold text-slate-400 bg-slate-50 px-3 py-1 rounded-lg border border-slate-100">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center text-yellow-400">
                        <Star size={14} fill="currentColor" />
                        <span className="ml-1 text-sm font-black text-slate-900">{pro.rating}</span>
                      </div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">({pro.reviews} reviews)</span>
                    </div>

                    <Link 
                      to={`/business/${pro.id}`}
                      className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest text-[#097DDD] hover:gap-3 transition-all"
                    >
                      View Profile <ChevronRight size={14} />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-32 bg-white rounded-[3rem] border border-dashed border-slate-200"
          >
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="text-slate-300 w-8 h-8" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-2">No professionals found</h3>
            <p className="text-slate-400 max-w-xs mx-auto text-sm font-medium">We couldn't find any pros matching your search criteria. Try adjusting your filters.</p>
          </motion.div>
        )}

        {filteredPros.length > 0 && (
          <div className="mt-20 text-center">
            <button className="bg-white border border-slate-200 text-slate-900 font-black text-xs px-12 py-5 rounded-2xl hover:bg-slate-50 transition-all uppercase tracking-widest shadow-sm">
              Load More Professionals
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
