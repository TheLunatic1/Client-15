/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Mail, MapPin, ArrowRight, ShieldCheck, Star } from "lucide-react";
import logoImg from "../../assets/WhatsApp_Image_2026-05-14_at_11.37.20_AM__1_-removebg-preview.png";
import { getLocations } from "../../api/locationApi";

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

const Footer = () => {
  const [locations, setLocations] = useState<{ city: string; region: string }[]>([]);

  useEffect(() => {
    getLocations()
      .then((locs) => {
        if (locs && locs.length > 0) setLocations(locs);
      })
      .catch(() => {});
  }, []);

  return (
    <footer className="bg-[#050f26] relative overflow-visible mt-32">
      <div className="section-container relative z-10 pt-16 -mt-[80px]">
        {/* ── Grow Your Business Section ── */}
        <div className="relative mb-20 rounded-[3rem] bg-[#0A1830] border border-white/10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)] p-12 md:p-16 overflow-hidden">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-12">
            <div className="max-w-2xl">
              <h3 className="text-[2.5rem] md:text-[3.5rem] font-black text-white leading-[1.1] mb-6">
                Grow your business in <br />
                <span className="text-[#097DDD]">MyLocalPro</span>
              </h3>
              <p className="text-white/40 text-[0.95rem] font-medium leading-relaxed">
                Join MyLocalPro's premium local services platform. Connect directly with customers searching for businesses like yours across Hobart, Launceston, Devonport, and Burnie.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-6 shrink-0">
              <Link
                to="/join-now?type=tradie"
                className="flex items-center justify-center gap-3 rounded-2xl bg-[#097DDD] px-12 py-5 text-[11px] font-black uppercase tracking-[0.2em] text-white shadow-[0_10px_30px_rgba(9,125,221,0.3)] hover:bg-[#0869bb] hover:-translate-y-1 transition-all duration-300"
              >
                Sign up Now
                <ArrowRight size={16} strokeWidth={3} />
              </Link>
            </div>
          </div>
        </div>

        {/* ── Main Footer Grid ── */}
        <div className="grid gap-16 lg:grid-cols-12 pb-10">
          {/* Brand Column */}
          <div className="lg:col-span-4">
            <Link to="/" className="inline-block mb-8">
              <img src={logoImg} alt="MyLocalPro" className="h-14 w-auto object-contain brightness-110" />
            </Link>
            <p className="text-base text-[#E4EAF1]/50 leading-relaxed mb-10 max-w-sm">
              MyLocalPro is Tasmania's trusted directory connecting local residents with verified professionals. No middlemen, no hidden fees.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2.5 bg-white/5 border border-white/10 rounded-full px-5 py-2.5">
                <ShieldCheck className="h-4 w-4 text-primary" />
                <span className="text-[11px] font-black uppercase tracking-wider text-white">Verified Pros</span>
              </div>
              <div className="flex items-center gap-2.5 bg-white/5 border border-white/10 rounded-full px-5 py-2.5">
                <Star className="h-4 w-4 text-amber-400" />
                <span className="text-[11px] font-black uppercase tracking-wider text-white">Real Reviews</span>
              </div>
            </div>
          </div>

          {/* Links Grid */}
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-12">
            <div>
              <h4 className="text-xs font-black uppercase tracking-[0.25em] text-white mb-8">Locations</h4>
              <ul className="space-y-4">
                {locations.length > 0 ? (
                  locations.map((loc) => (
                    <li key={loc.city + loc.region}>
                      <Link
                        to={`/find-a-pro?location=${encodeURIComponent(`${loc.city}, ${loc.region}`)}`}
                        className="text-sm text-[#E4EAF1]/60 hover:text-primary transition-colors duration-300 font-bold"
                      >
                        {loc.city}, {loc.region}
                      </Link>
                    </li>
                  ))
                ) : (
                  // fallback while loading
                  ["Hobart", "Launceston", "Devonport", "Burnie"].map((name) => (
                    <li key={name}>
                      <Link
                        to={`/find-a-pro?location=${name}`}
                        className="text-sm text-[#E4EAF1]/60 hover:text-primary transition-colors duration-300 font-bold"
                      >
                        {name}
                      </Link>
                    </li>
                  ))
                )}
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-black uppercase tracking-[0.25em] text-white mb-8">Company</h4>
              <ul className="space-y-4">
                {[
                  { label: 'About Us', to: '/' },
                  { label: 'Find a Pro', to: '/find-a-pro' },
                  { label: 'List Your Business', to: '/list-your-business' },
                  { label: 'Blog & News', to: '/blog' },
                  { label: 'Contact Us', to: '/contact' },
                ].map((item) => (
                  <li key={item.label}>
                    <Link
                      to={item.to}
                      className="text-sm text-[#E4EAF1]/60 hover:text-primary transition-colors duration-300 font-bold"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-black uppercase tracking-[0.25em] text-white mb-8">Connect</h4>
              <div className="flex gap-4 mb-8">
                <a href="#" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-primary hover:border-primary/30 transition-all">
                  <Facebook className="w-4 h-4" />
                </a>
                <a href="#" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-primary hover:border-primary/30 transition-all">
                  <Instagram className="w-4 h-4" />
                </a>
              </div>
              <div className="space-y-3">
                <a href="mailto:contactmylocalpro@gmail.com" className="flex items-center gap-3 text-sm text-[#E4EAF1]/60 hover:text-primary transition-colors font-bold">
                  <Mail className="h-4 w-4 text-primary shrink-0" />
                  contactmylocalpro@gmail.com
                </a>
                <div className="flex items-start gap-3 text-sm text-[#E4EAF1]/60 font-bold">
                  <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  Tasmania, Australia
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Bottom Bar ── */}
        <div className="border-t border-white/5 py-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <p className="text-sm text-[#E4EAF1]/30 font-medium">
            © {new Date().getFullYear()} MyLocalPro. All rights reserved.
          </p>
          <div className="flex items-center gap-8">
            <Link to="/privacy" className="text-xs text-[#E4EAF1]/30 hover:text-primary transition-colors font-bold uppercase tracking-wider">Privacy</Link>
            <Link to="/terms" className="text-xs text-[#E4EAF1]/30 hover:text-primary transition-colors font-bold uppercase tracking-wider">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;