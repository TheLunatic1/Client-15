/* eslint-disable @typescript-eslint/no-explicit-any */
import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  MapPin, Star, Phone, Mail, Globe, 
  CheckCircle2,
  Briefcase, Shield, Clock, Camera,
  UserCheck, HardHat,
  Loader2,
  Bookmark,
  BookmarkCheck,
  MessageSquare,
} from "lucide-react";
import Swal from 'sweetalert2';
import { getBusinessById } from "../../api/businessApi";
import { reviewApi, type Review } from "../../api/reviewApi";
import { checkSavedStatus, saveBusiness, unsaveBusiness } from "../../api/userApi";
import { validateReview, showValidationAlert } from "../../utils/validation";

// Brand icons
const Facebook = (props: any) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);
const Instagram = (props: any) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);
const Twitter = (props: any) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 4s-1 2.17-2.41 3.06a8 8 0 1 1-11.58 8.06l-.31 1.17A10.12 10.12 0 0 1 2 17.64a10.86 10.86 0 0 8.23 2.31 10.88 10.88 0 0 0 10.79-9.13A7.37 7.37 0 0 0 22 4Z" />
  </svg>
);

// Fallback gallery images
import work1 from "../../assets/section images/electrician-installing-laying-electrical-cables-ceiling-inside-house.jpg";
import work2 from "../../assets/section images/imgi_16_professional_tradie.png";
import work3 from "../../assets/section images/jamie-street-qWYvQMIJyfE-unsplash.jpg";

const BusinessProfile = () => {
  const { id } = useParams<{ id: string }>();
  const [pro, setPro] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newRating, setNewRating] = useState(0);
  const [newComment, setNewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

  useEffect(() => {
    if (!id) return;
    getBusinessById(id)
      .then((data) => {
        setPro(data);
      })
      .catch(() => setError(true))
      .finally(() => setIsLoading(false));
  }, [id]);

  const handleSaveBusiness = async () => {
    if (!isLoggedIn) {
      Swal.fire({
        title: 'Login required',
        text: 'Please log in to save businesses to your list.',
        icon: 'info',
        confirmButtonColor: '#097DDD',
        customClass: { popup: 'rounded-[2rem]' },
      });
      return;
    }
    if (!pro || !pro._id) return;

    setIsSaving(true);
    try {
      if (isSaved) {
        await unsaveBusiness(pro._id);
        setIsSaved(false);
        Swal.fire({
          title: 'Removed',
          text: `"${pro.businessName}" has been removed from your saved businesses.`,
          icon: 'success',
          confirmButtonColor: '#097DDD',
          timer: 2200,
          showConfirmButton: true,
          customClass: {
            popup: 'rounded-[2rem]',
            confirmButton: 'rounded-xl font-bold uppercase tracking-widest text-[10px] px-8 py-4',
          },
        });
      } else {
        await saveBusiness(pro._id);
        setIsSaved(true);
        Swal.fire({
          title: 'Saved!',
          text: `"${pro.businessName}" is now in your saved businesses. View it anytime from your dashboard.`,
          icon: 'success',
          confirmButtonColor: '#097DDD',
          timer: 2800,
          showConfirmButton: true,
          customClass: {
            popup: 'rounded-[2rem]',
            confirmButton: 'rounded-xl font-bold uppercase tracking-widest text-[10px] px-8 py-4',
          },
        });
      }
    } catch (err: any) {
      console.error('Error saving business:', err.response?.data || err);
      Swal.fire({
        title: 'Could not update',
        text: err.response?.data?.message || err.message || 'Failed to update saved status.',
        icon: 'error',
        confirmButtonColor: '#097DDD',
        customClass: { popup: 'rounded-[2rem]' },
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    const check = validateReview(newRating, newComment);
    if ('message' in check) {
      showValidationAlert(check.message);
      return;
    }
    if (!pro || !pro._id) return;

    setIsSubmittingReview(true);
    try {
      const review = await reviewApi.postReview(pro._id, {
        rating: newRating,
        comment: newComment,
      });
      setReviews([review, ...reviews]);
      setNewRating(0);
      setNewComment('');
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to submit review.");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  // Fetch reviews and saved status when business data is ready
  useEffect(() => {
    if (pro && pro._id) {
      reviewApi.getReviews(pro._id)
        .then(setReviews)
        .catch(console.error);

      if (isLoggedIn) {
        checkSavedStatus(pro._id)
          .then((data) => setIsSaved(data.isSaved))
          .catch(console.error);
      }
    }
  }, [pro, isLoggedIn]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050f26]">
        <Loader2 size={40} className="text-primary animate-spin" />
      </div>
    );
  }

  if (error || !pro) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050f26]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Business not found</h2>
          <Link to="/find-a-pro" className="text-primary hover:underline">Return to Search</Link>
        </div>
      </div>
    );
  }

  // Normalize data from backend schema
  const name = pro.businessName || pro.name || 'Business';
  const category = pro.category?.name || pro.category || 'Service Provider';
  const location = pro.suburb
    ? `${pro.suburb}, ${pro.location}`
    : (pro.location?.city ? `${pro.location.city}, ${pro.location.region}` : pro.location || 'Australia');
  const coverImage = pro.coverImage || pro.logo || pro.gallery?.[0]?.url || work1;
  const logoImage = pro.logo || coverImage;
  const description = pro.shortDescription || pro.description || 'No description available.';
  const longDescription = pro.longDescription || description;
  const services = pro.servicesOffered
    ? pro.servicesOffered.split(',').map((s: string) => s.trim())
    : (pro.services || []);
  const gallery = pro.gallery?.length
    ? pro.gallery.map((g: any) => g.url || g)
    : [work1, work2, work3];
  const contactPhone = pro.contactPhone || '';
  const contactEmail = pro.contactEmail || pro.owner?.email || '';
  const website = pro.website || '';
  const yearsInBusiness = pro.yearsInBusiness || '5';
  const tags = pro.tags || [];

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* ── Hero Header ── */}
      <section className="relative h-[45vh] min-h-[400px] bg-[#0D1F43] overflow-hidden">
        <motion.div 
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.4 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0"
        >
          <img src={coverImage} alt="Cover" className="w-full h-full object-cover blur-sm scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#F8FAFC] via-[#0D1F43]/80 to-[#0D1F43]/40" />
        </motion.div>

        <div className="max-w-7xl mx-auto px-4 sm: B-6 lg:px-8 h-full relative z-10">
          <div className="flex flex-col justify-end h-full pb-12">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 text-white/60 text-[10px] font-black uppercase tracking-[0.2em] mb-8"
            >
              <Link to="/" className="hover:text-primary transition-colors">Home</Link>
              <span className="text-white/20">/</span>
              <Link to="/find-a-pro" className="hover:text-primary transition-colors">Find a Pro</Link>
              <span className="text-white/20">/</span>
              <span className="text-white">Profile</span>
            </motion.div>

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
              <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
                {/* Logo/Avatar */}
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="w-32 h-32 md:w-44 md:h-44 rounded-[2.5rem] bg-white p-2 shadow-2xl relative overflow-hidden"
                >
                  <img src={logoImage} alt={name} className="w-full h-full object-cover rounded-[2rem]" />
                  <div className="absolute bottom-4 right-4 bg-emerald-500 rounded-full p-1.5 border-4 border-white shadow-lg">
                    <CheckCircle2 size={16} className="text-white" />
                  </div>
                </motion.div>

                <div className="space-y-1">
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex flex-wrap items-center gap-3 mb-4"
                  >
                    <span className="px-3.5 py-1.5 rounded-full bg-primary/20 backdrop-blur-md border border-primary/30 text-primary text-[10px] font-black uppercase tracking-wider">
                      {category}
                    </span>
                    {pro.status === 'approved' && (
                      <span className="px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-[10px] font-black uppercase tracking-wider flex items-center gap-2">
                        <CheckCircle2 size={12} className="text-emerald-400" /> Verified
                      </span>
                    )}
                  </motion.div>
                    <motion.h1 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="text-3xl sm:text-4xl md:text-6xl font-black text-white leading-tight mb-2"
                    >
                    {name}
                  </motion.h1>
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="flex items-center gap-2 text-white/70"
                  >
                    <MapPin size={18} className="text-primary" />
                    <span className="text-sm font-bold tracking-wide">{location}</span>
                  </motion.div>
                </div>
              </div>

              {/* Action Stats */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 }}
                className="flex gap-6 items-center bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-5 px-7 shadow-2xl self-start md:self-auto overflow-x-auto"
              >
                <div className="text-center">
                  <p className="text-2xl font-black text-white">{reviews.length || 0}</p>
                  <p className="text-[9px] font-black text-white/40 uppercase tracking-widest mt-1">Reviews</p>
                </div>
                <div className="w-px h-10 bg-white/10" />
                <div className="text-center">
                  <p className="text-2xl font-black text-white">{yearsInBusiness}+</p>
                  <p className="text-[9px] font-black text-white/40 uppercase tracking-widest mt-1">Years</p>
                </div>
                <div className="w-px h-10 bg-white/10" />
                <div className="text-center">
                  <p className="text-2xl font-black text-primary">
                    {reviews.length > 0 ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length).toFixed(1) : 'New'}
                  </p>
                  <p className="text-[9px] font-black text-white/40 uppercase tracking-widest mt-1">Rating</p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Content Grid ── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20 pb-32">
        <div className="grid lg:grid-cols-12 gap-10">
          
          {/* Left Column (8 cols) - shown first on mobile */}
          <div className="lg:col-span-8 space-y-10">
            
            {/* About Section */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-[3rem] p-10 md:p-14 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-slate-100"
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="h-12 w-12 rounded-2xl bg-primary/5 flex items-center justify-center text-primary">
                  <Shield size={24} />
                </div>
                <h2 className="text-2xl md:text-3xl font-black text-[#0D1F43]">About the Business</h2>
              </div>
              <p className="text-slate-500 text-lg leading-[1.8] mb-12">
                {longDescription}
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-[#F8FAFC] rounded-[2rem] p-8 border border-slate-100 flex items-start gap-5">
                  <div className="h-14 w-14 rounded-2xl bg-white shadow-sm flex items-center justify-center text-primary shrink-0">
                    <UserCheck size={28} />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-[#0D1F43] uppercase tracking-wider mb-2">Verified Expert</h4>
                    <p className="text-slate-500 text-sm leading-relaxed">Identity and professional credentials verified by MyLocalPro Australia.</p>
                  </div>
                </div>
                <div className="bg-[#F8FAFC] rounded-[2rem] p-8 border border-slate-100 flex items-start gap-5">
                  <div className="h-14 w-14 rounded-2xl bg-white shadow-sm flex items-center justify-center text-primary shrink-0">
                    <HardHat size={28} />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-[#0D1F43] uppercase tracking-wider mb-2">Fully Insured</h4>
                    <p className="text-slate-500 text-sm leading-relaxed">This professional carries comprehensive public liability insurance for your peace of mind.</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Services Offered */}
            {services.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white rounded-[3rem] p-10 md:p-14 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-slate-100"
              >
                <div className="flex items-center gap-4 mb-10">
                  <div className="h-12 w-12 rounded-2xl bg-primary/5 flex items-center justify-center text-primary">
                    <Briefcase size={24} />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-black text-[#0D1F43]">Services Offered</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                  {services.map((service: string, i: number) => (
                    <div key={i} className="flex items-center gap-4 group">
                      <div className="h-2 w-2 rounded-full bg-primary/30 group-hover:bg-primary transition-colors" />
                      <span className="text-base font-bold text-slate-600 group-hover:text-[#0D1F43] transition-colors">{service}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Tags */}
            {tags.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white rounded-[3rem] p-10 md:p-14 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-slate-100"
              >
                <h2 className="text-2xl font-black text-[#0D1F43] mb-6">Specialisations</h2>
                <div className="flex flex-wrap gap-3">
                  {tags.map((tag: string, i: number) => (
                    <span key={i} className="px-5 py-2.5 bg-primary/5 border border-primary/10 rounded-xl text-sm font-bold text-primary">
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Gallery Section */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-[3rem] p-10 md:p-14 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-slate-100"
            >
              <div className="flex items-center justify-between gap-6 mb-10">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-2xl bg-primary/5 flex items-center justify-center text-primary">
                    <Camera size={24} />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-black text-[#0D1F43]">Recent Work Gallery</h2>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {gallery.map((img: string, i: number) => (
                  <div key={i} className={`relative overflow-hidden rounded-[2rem] cursor-pointer group h-[240px]`}>
                    <img src={img} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Work" />
                    <div className="absolute inset-0 bg-[#0D1F43]/0 group-hover:bg-[#0D1F43]/30 transition-all flex items-center justify-center">
                       <Star className="text-white opacity-0 group-hover:opacity-100 scale-50 group-hover:scale-100 transition-all duration-300" size={32} />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Reviews Section */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-[3rem] p-10 md:p-14 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-slate-100"
            >
              <div className="flex items-center gap-4 mb-10">
                <div className="h-12 w-12 rounded-2xl bg-primary/5 flex items-center justify-center text-primary">
                  <Star size={24} />
                </div>
                <h2 className="text-2xl md:text-3xl font-black text-[#0D1F43]">Reviews ({reviews.length})</h2>
              </div>

              {/* Add Review Form */}
              {isLoggedIn ? (
                <div className="mb-12 bg-[#F8FAFC] rounded-[2rem] p-8 border border-slate-100">
                  <h3 className="text-lg font-black text-[#0D1F43] mb-4">Write a Review</h3>
                  <form onSubmit={handleSubmitReview}>
                    <div className="mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-bold text-slate-500">Your Rating:</span>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              type="button"
                              key={star}
                              onClick={() => setNewRating(star)}
                              className="focus:outline-none transition-transform hover:scale-110 p-1"
                            >
                              <Star
                                size={24}
                                className={star <= newRating ? 'text-primary fill-primary' : 'text-slate-300'}
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="mb-4">
                      <textarea
                        className="w-full bg-white border border-slate-200 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-700"
                        placeholder="Share your experience..."
                        rows={4}
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isSubmittingReview}
                      className="bg-primary hover:bg-primary/90 text-white font-black text-xs py-4 px-8 rounded-xl transition-all shadow-lg uppercase tracking-[0.2em] flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmittingReview ? <Loader2 size={16} className="animate-spin" /> : <MessageSquare size={16} />}
                      {isSubmittingReview ? 'Submitting...' : 'Submit Review'}
                    </button>
                  </form>
                </div>
              ) : (
                <div className="mb-12 bg-[#F8FAFC] rounded-[2rem] p-8 border border-slate-100 text-center">
                  <p className="text-slate-500 mb-4 font-medium">Please log in to write a review for this business.</p>
                  <Link to="/login" className="inline-block bg-[#0D1F43] hover:bg-black text-white font-black text-xs py-3 px-6 rounded-xl transition-all uppercase tracking-[0.2em]">
                    Log In
                  </Link>
                </div>
              )}

              {/* Review List */}
              <div className="space-y-6">
                {reviews.length > 0 ? (
                  reviews.map((rev) => (
                    <div key={rev._id} className="border-b border-slate-100 pb-6 last:border-0 last:pb-0">
                      <div className="flex items-center gap-4 mb-3">
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-black text-lg shrink-0 overflow-hidden">
                          {rev.reviewer?.profileImage ? (
                            <img src={rev.reviewer.profileImage} alt={rev.reviewer.firstName} className="w-full h-full object-cover" />
                          ) : (
                            rev.reviewer?.firstName?.charAt(0) || 'U'
                          )}
                        </div>
                        <div>
                          <h4 className="font-black text-[#0D1F43]">
                            {rev.reviewer?.firstName} {rev.reviewer?.lastName}
                          </h4>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  size={12}
                                  className={star <= rev.rating ? 'text-primary fill-primary' : 'text-slate-200'}
                                />
                              ))}
                            </div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                              {new Date(rev.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <p className="text-slate-600 text-sm leading-relaxed pl-16">
                        {rev.comment}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-slate-500">No reviews yet. Be the first to leave one!</p>
                  </div>
                )}
              </div>
            </motion.div>

          </div>

          {/* Right Column (4 cols) - below content on mobile, sticky on desktop */}
          <div className="lg:col-span-4 space-y-8">
            
            <div className="lg:sticky lg:top-32 space-y-8">
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-[3rem] p-10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-slate-100 group"
              >
                <h3 className="text-2xl font-black text-[#0D1F43] mb-8">Contact Direct</h3>
                
                <div className="space-y-6 mb-10">
                  {contactPhone && (
                    <a href={`tel:${contactPhone}`} className="flex items-center gap-5 group/item cursor-pointer">
                        <div className="h-14 w-14 rounded-2xl bg-[#F8FAFC] border border-slate-100 flex items-center justify-center group-hover/item:bg-primary group-hover/item:text-white transition-all duration-300 text-[#0D1F43]">
                          <Phone size={22} />
                        </div>
                      <div>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Call Business</p>
                        <p className="text-[15px] font-black text-[#0D1F43] tracking-tight">{contactPhone}</p>
                      </div>
                    </a>
                  )}
                  {contactEmail && (
                    <a href={`mailto:${contactEmail}`} className="flex items-center gap-5 group/item cursor-pointer">
                      <div className="h-14 w-14 rounded-2xl bg-[#F8FAFC] border border-slate-100 flex items-center justify-center group-hover/item:bg-primary group-hover/item:text-white transition-all duration-300 text-[#0D1F43]">
                        <Mail size={22} />
                      </div>
                      <div>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Send Email</p>
                        <p className="text-[15px] font-black text-[#0D1F43] tracking-tight truncate max-w-[180px]">{contactEmail}</p>
                      </div>
                    </a>
                  )}
                  {website && (
                    <a href={`https://${website}`} target="_blank" rel="noreferrer" className="flex items-center gap-5 group/item cursor-pointer">
                      <div className="h-14 w-14 rounded-2xl bg-[#F8FAFC] border border-slate-100 flex items-center justify-center group-hover/item:bg-primary group-hover/item:text-white transition-all duration-300 text-[#0D1F43]">
                        <Globe size={22} />
                      </div>
                      <div>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Website</p>
                        <p className="text-[15px] font-black text-[#0D1F43] tracking-tight">{website}</p>
                      </div>
                    </a>
                  )}
                </div>

                <button
                  type="button"
                  disabled={isSaving}
                  className={`w-full text-white font-black text-xs py-6 rounded-2xl transition-all shadow-xl uppercase tracking-[0.2em] flex items-center justify-center gap-3 active:scale-[0.98] mb-4 disabled:opacity-70 ${
                    isSaved
                      ? 'bg-emerald-600 hover:bg-emerald-700 ring-2 ring-emerald-400/40'
                      : 'bg-[#0D1F43] hover:bg-black'
                  }`}
                  onClick={handleSaveBusiness}
                >
                  {isSaving ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : isSaved ? (
                    <BookmarkCheck size={18} />
                  ) : (
                    <Bookmark size={18} />
                  )}
                  {isSaving ? 'Updating...' : isSaved ? 'Unsave Business' : 'Save Business'}
                </button>

                <div className="mt-8 pt-8 border-t border-slate-50 flex items-center justify-center gap-6">
                  <a href="#" className="text-slate-300 hover:text-primary transition-colors"><Facebook size={18} /></a>
                  <a href="#" className="text-slate-300 hover:text-primary transition-colors"><Instagram size={18} /></a>
                  <a href="#" className="text-slate-300 hover:text-primary transition-colors"><Twitter size={18} /></a>
                </div>
              </motion.div>

              {/* Hours Card */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-[3rem] p-10 shadow-[0_15px_40px_rgba(0,0,0,0.04)] border border-slate-100"
              >
                <div className="flex items-center gap-3 mb-8">
                  <Clock size={20} className="text-primary" />
                  <h3 className="text-xl font-black text-[#0D1F43]">Business Hours</h3>
                </div>
                <div className="space-y-5">
                  {[
                    { day: "Mon - Fri", hours: "8:00 AM - 6:00 PM" },
                    { day: "Saturday", hours: "9:00 AM - 4:00 PM" },
                    { day: "Sunday", hours: "Closed" }
                  ].map((item) => (
                    <div key={item.day} className="flex justify-between items-center pb-4 border-b border-slate-50 last:border-0 last:pb-0">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{item.day}</span>
                      <span className={`text-[13px] font-black text-[#0D1F43]`}>{item.hours}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BusinessProfile;
