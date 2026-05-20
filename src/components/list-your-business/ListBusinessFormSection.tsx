import { useState, useEffect } from "react";
import { CheckCircle2, ArrowRight, Upload, Star, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import { createBusiness } from "../../api/businessApi";
import { getCategories } from "../../api/categoryApi";
import { getLocations } from "../../api/locationApi";

const benefits = [
  { title: "Free to List", desc: "No setup fees through 2026" },
  { title: "Instant Visibility", desc: "Live within 1 business day" },
  { title: "Direct Enquiries", desc: "Customers contact you directly" },
  { title: "No Lock-In", desc: "Cancel anytime, no contracts" },
];

const labelCls = "block text-[9px] font-black uppercase tracking-[0.22em] text-[#7a90a8] mb-1.5";
const inputCls = "w-full block rounded-[10px] border border-[#cdd6e3] bg-[#E4EAF1]/35 p-[11px_14px] text-[0.87rem] text-[#0A1830] font-medium outline-none transition-all duration-200 focus:border-[#097DDD] focus:ring-3 focus:ring-[#097DDD]/12 focus:bg-white box-border";

const FALLBACK_CATEGORIES = [
  "Handyman Services", "Lawn Mowing and Gardening", "Domestic Cleaning",
  "Car Detailing", "Pressure Washing", "Carpet Cleaning", "Plumbers",
  "Electricians", "Builders", "Painters", "Roofers", "Concretors",
  "Plasterers", "Landscapers", "Photographers", "Fencing Contractors",
];

const FALLBACK_LOCATIONS = [
  "Hobart Region (TAS)", "Launceston Region (TAS)", "Devonport Region (TAS)",
  "Burnie Region (TAS)", "North Brisbane (QLD)", "South Brisbane (QLD)",
  "West Brisbane (QLD)", "East Brisbane (QLD)", "Gold Coast Region (QLD)",
  "Sunshine Coast Region (QLD)", "Tasmania Region (TAS)", "Queensland Region (QLD)",
];

export const ListBusinessFormSection = () => {
  const [sent, setSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<string[]>(FALLBACK_CATEGORIES);
  const [locations, setLocations] = useState<string[]>(FALLBACK_LOCATIONS);

  // Form state — pre-fill from registration flow
  const [businessName, setBusinessName] = useState(localStorage.getItem('prefillBusinessName') || "");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [suburb, setSuburb] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [servicesOffered, setServicesOffered] = useState("");
  const [abn, setAbn] = useState("");
  const [website, setWebsite] = useState("");
  const [yearsInBusiness, setYearsInBusiness] = useState("");
  const [contactName, setContactName] = useState(localStorage.getItem('prefillContactName') || localStorage.getItem('userName') || "");
  const [contactPhone, setContactPhone] = useState("");
  const [contactEmail, setContactEmail] = useState(localStorage.getItem('prefillContactEmail') || localStorage.getItem('userEmail') || "");

  // Fetch live categories and locations on mount
  useEffect(() => {
    getCategories()
      .then((cats: any[]) => {
        if (cats && cats.length > 0) setCategories(cats.map((c) => c.name));
      })
      .catch(() => {});

    getLocations()
      .then((locs: any[]) => {
        if (locs && locs.length > 0)
          setLocations(locs.map((l) => l.region ? `${l.city} (${l.region})` : l.city));
      })
      .catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!businessName || !category || !location || !shortDescription || !servicesOffered || !abn || !contactPhone || !contactEmail) {
      Swal.fire({ title: 'Missing Fields', text: 'Please fill in all required fields.', icon: 'warning', confirmButtonColor: '#097DDD' });
      return;
    }

    const token = localStorage.getItem('token');
    if (!token || token === 'dummy-tradie-token') {
      Swal.fire({
        title: 'Not Logged In',
        text: 'You need to be logged in as a tradie to submit a listing. Please register or log in first.',
        icon: 'error',
        confirmButtonColor: '#097DDD',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await createBusiness({
        businessName,
        category,
        location,
        suburb,
        shortDescription,
        servicesOffered,
        abn,
        website,
        yearsInBusiness,
        contactPhone,
        contactEmail,
      });

      // Clear registration prefill cache
      localStorage.removeItem('prefillBusinessName');
      localStorage.removeItem('prefillContactName');
      localStorage.removeItem('prefillContactEmail');

      setSent(true);
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Failed to submit listing. Please try again.';
      Swal.fire({ title: 'Submission Failed', text: msg, icon: 'error', confirmButtonColor: '#097DDD' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="bg-[#f4f7fb] pt-14 pb-18">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-[400px_minmax(0,800px)] gap-12 items-start justify-center">
        
        {/* ── Left: Benefits ── */}
        <div className="space-y-6">
          <h2 className="font-black text-[1.25rem] text-[#0A1830] mb-6">
            Why list with us?
          </h2>

          <div className="flex flex-col gap-4">
            {benefits.map((benefit, i) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, x: -14 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="flex items-center gap-5 bg-white border border-[#dde4ef] rounded-[18px] p-5 px-6 shadow-[0_2px_12px_rgba(10,24,48,0.06)]"
              >
                <div className="w-10 h-10 rounded-[10px] bg-[#097DDD]/10 flex items-center justify-center shrink-0">
                  <CheckCircle2 size={18} className="text-[#097DDD]" />
                </div>
                <div>
                  <div className="font-bold text-[#0A1830] text-[0.95rem] mb-0.5">
                    {benefit.title}
                  </div>
                  <div className="text-[10px] font-bold text-[#7a90a8] uppercase tracking-wider">
                    {benefit.desc}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Promotion card */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.25 }}
            className="mt-4 rounded-[18px] bg-linear-to-br from-[#0a1628] to-[#0d2044] border border-white/8 p-6 px-8"
          >
            <div className="text-[10px] font-black uppercase tracking-[0.25em] text-[#E4EAF1]/35 mb-2">
              Free Through
            </div>
            <div className="text-white font-black text-[1.8rem] mb-1">
              2026
            </div>
            <div className="text-[#E4EAF1]/45 text-[0.9rem]">
              No lead fees, ever.
            </div>
          </motion.div>
        </div>

        {/* ── Right: Form ── */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          onSubmit={handleSubmit}
          className="bg-white border border-[#dde4ef] rounded-[24px] shadow-[0_8px_40px_rgba(10,24,48,0.08)] p-10 md:p-12"
        >
          {sent ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 rounded-[20px] bg-[#097DDD]/10 flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 size={40} className="text-[#097DDD]" />
              </div>
              <h2 className="font-black text-[1.8rem] text-[#0A1830] mb-2">
                Listing Submitted!
              </h2>
              <p className="text-[#5a7089] text-lg">Our team will review and publish your business within 1 business day.</p>
            </div>
          ) : (
            <>
              {/* Form heading */}
              <div className="mb-10">
                <h2 className="font-black text-[1.5rem] text-[#0A1830] mb-2">
                  Business Details
                </h2>
                <p className="text-[0.95rem] text-[#5a7089]">
                  Fill in your business information below.
                </p>
              </div>

              <div className="space-y-6">
                {/* Business Name */}
                <div>
                  <label className={labelCls}>Business Name *</label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Tassie Plumb Co."
                    className={inputCls}
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                  />
                </div>

                {/* Category + Location */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className={labelCls}>Service Category *</label>
                    <select required className={inputCls} value={category} onChange={(e) => setCategory(e.target.value)}>
                      <option value="">Choose a category</option>
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>Location *</label>
                    <select required className={inputCls} value={location} onChange={(e) => setLocation(e.target.value)}>
                      <option value="">Choose a location</option>
                      {locations.map((loc) => (
                        <option key={loc} value={loc}>{loc}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Suburb */}
                <div>
                  <label className={labelCls}>Suburb</label>
                  <input
                    type="text"
                    placeholder="e.g. Sandy Bay"
                    className={inputCls}
                    value={suburb}
                    onChange={(e) => setSuburb(e.target.value)}
                  />
                </div>

                {/* Description */}
                <div>
                  <label className={labelCls}>Business Description *</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Tell customers what you do and why they should choose you."
                    className={`${inputCls} resize-y`}
                    value={shortDescription}
                    onChange={(e) => setShortDescription(e.target.value)}
                  />
                </div>

                {/* Services Offered */}
                <div>
                  <label className={labelCls}>Services Offered (Comma Separated) *</label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Emergency repairs, Hot water, Gas fitting"
                    className={inputCls}
                    value={servicesOffered}
                    onChange={(e) => setServicesOffered(e.target.value)}
                  />
                </div>

                {/* ABN */}
                <div>
                  <label className={labelCls}>ABN (Australian Business Number) *</label>
                  <input
                    required
                    type="text"
                    placeholder="11 digits"
                    className={inputCls}
                    value={abn}
                    onChange={(e) => setAbn(e.target.value)}
                  />
                </div>

                {/* Website + Years in Business */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className={labelCls}>Website (optional)</label>
                    <input
                      type="text"
                      placeholder="www.yourbusiness.com.au"
                      className={inputCls}
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Years in Business</label>
                    <input
                      type="number"
                      placeholder="e.g. 5"
                      min="0"
                      className={inputCls}
                      value={yearsInBusiness}
                      onChange={(e) => setYearsInBusiness(e.target.value)}
                    />
                  </div>
                </div>

                {/* Photos Upload (UI only for now) */}
                <div>
                  <label className={labelCls}>Photos of your work</label>
                  <div className="mt-2 border-2 border-dashed border-[#cdd6e3] rounded-[14px] p-10 flex flex-col items-center justify-center bg-[#E4EAF1]/20 hover:bg-[#E4EAF1]/30 transition-colors cursor-pointer group">
                    <div className="w-12 h-12 rounded-full bg-[#097DDD]/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Upload size={24} className="text-[#097DDD]" />
                    </div>
                    <div className="text-[11px] font-black uppercase tracking-wider text-[#097DDD] mb-1">Click to upload</div>
                    <div className="text-[10px] font-bold text-[#7a90a8]">Up to 6 images, JPG or PNG.</div>
                  </div>
                </div>

                <hr className="border-[#dde4ef] my-10" />

                {/* Contact Info */}
                <div>
                  <h3 className="font-black text-[0.9rem] uppercase tracking-[0.2em] text-[#0A1830] mb-6 flex items-center gap-2">
                    <Star size={14} className="text-[#097DDD] fill-[#097DDD]" />
                    Contact Information
                  </h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className={labelCls}>Contact Name *</label>
                      <input
                        required
                        type="text"
                        placeholder="Your name"
                        className={inputCls}
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className={labelCls}>Phone *</label>
                      <input
                        required
                        type="tel"
                        placeholder="0400 000 000"
                        className={inputCls}
                        value={contactPhone}
                        onChange={(e) => setContactPhone(e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={labelCls}>Email *</label>
                    <input
                      required
                      type="email"
                      placeholder="you@business.com.au"
                      className={inputCls}
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                    />
                  </div>
                </div>

                {/* Terms and Submit */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-8">
                  <p className="text-[11px] text-[#7a90a8] font-bold">
                    By submitting you agree to our <a href="/terms" className="text-[#097DDD] hover:underline">listing terms</a>.
                  </p>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto flex items-center justify-center gap-3 bg-[#097DDD] text-white font-black text-[11px] uppercase tracking-[0.2em] rounded-xl py-5 px-12 shadow-[0_4px_25px_rgba(9,125,221,0.4)] hover:bg-[#0a8ef0] hover:shadow-[0_8px_35px_rgba(9,125,221,0.55)] transition-all duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <><Loader2 size={16} className="animate-spin" /> Submitting...</>
                    ) : (
                      <>Submit Listing <ArrowRight size={16} /></>
                    )}
                  </button>
                </div>
              </div>
            </>
          )}
        </motion.form>
      </div>
    </section>
  );
};
