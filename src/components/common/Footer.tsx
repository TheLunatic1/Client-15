import { Link, useNavigate } from "react-router-dom";
import { Mail, MapPin, ArrowRight, ShieldCheck, Star } from "lucide-react";
import logoImg from "../../assets/WhatsApp_Image_2026-05-14_at_11.37.20_AM__1_-removebg-preview.png";

const LOCATIONS = ["Hobart", "Launceston", "Devonport", "Burnie", "Kingston", "Glenorchy", "Tasmania", "Queensland", "more states coming soon"];

// Brand icons were removed in Lucide v1.0, so we define them locally in the same style
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
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

  const handlePostJobClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isLoggedIn) {
      navigate('/user-dashboard', { state: { activeTab: 'jobpost' } });
    } else {
      navigate('/login');
    }
  };

  return (
    <footer className="bg-[#050f26] relative overflow-visible mt-32">
      {/* Background Decor */}
      {/* <div className="absolute top-0 right-1/3 w-[600px] h-[400px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[300px] bg-primary/3 rounded-full blur-[100px] pointer-events-none" /> */}

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
              MyLocalPro is MyLocalPro's trusted directory connecting local residents with verified professionals. No middlemen, no hidden fees.
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
                {LOCATIONS.map((loc) => (
                  <li key={loc}>
                    <Link
                      to={`/find-a-pro?location=${loc}`}
                      className="text-sm text-[#E4EAF1]/60 hover:text-primary transition-colors duration-300 font-bold"
                    >
                      {loc}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-black uppercase tracking-[0.25em] text-white mb-8">Company</h4>
              <ul className="space-y-4">
                {[
                  { to: "/", label: "Home" },
                  { to: "/categories", label: "All Categories" },
                  { to: "/join-now?type=tradie", label: "For Businesses" },
                  { to: "#", label: "Post a Job", onClick: handlePostJobClick },
                  { to: "/terms", label: "Terms of Service" },
                  { to: "/privacy", label: "Privacy Policy" },
                ].map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      onClick={link.onClick}
                      className="text-sm text-[#E4EAF1]/60 hover:text-white transition-colors duration-300 font-bold"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="col-span-1 sm:col-span-1">
              <h4 className="text-xs font-black uppercase tracking-[0.25em] text-white mb-8">Get in Touch</h4>
              <ul className="space-y-6 mb-10">
                <li>
                  <a href="mailto:hello@mylocalpro.com.au" className="flex items-center gap-4 text-sm text-[#E4EAF1]/60 hover:text-white transition-all group">
                    <div className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <Mail className="h-4 w-4" />
                    </div>
                    <span className="font-bold">hello@mylocalpro.com.au</span>
                  </a>
                </li>
                <li className="flex items-center gap-4 text-sm text-[#E4EAF1]/60">
                  <div className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <span className="font-bold">MyLocalPro, Australia</span>
                </li>
              </ul>
              <div className="flex gap-4">
                <a
                  href="#"
                  aria-label="Facebook"
                  className="h-12 w-12 rounded-full bg-white/5 flex items-center justify-center text-[#E4EAF1]/60 hover:bg-primary hover:text-white transition-all duration-500 hover:-translate-y-1.5 shadow-lg"
                >
                  <Facebook className="h-5 w-5" />
                </a>
                <a
                  href="#"
                  aria-label="Instagram"
                  className="h-12 w-12 rounded-full bg-white/5 flex items-center justify-center text-[#E4EAF1]/60 hover:bg-primary hover:text-white transition-all duration-500 hover:-translate-y-1.5 shadow-lg"
                >
                  <Instagram className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* ── Bottom Bar ── */}
        <div className="border-t border-white/10 py-4 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[#E4EAF1]/30">
            © {new Date().getFullYear()} MyLocalPro Australia. All rights reserved.
          </p>
          <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-[#E4EAF1]/20">
            <MapPin className="h-3 w-3 text-primary" />
            Proudly MyLocalPron
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
