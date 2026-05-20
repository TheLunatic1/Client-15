import { motion } from 'framer-motion';
import { Shield, Lock, Eye, ArrowLeft, Info, Search, List, Share2, MousePointer2, Mail, ShieldCheck, ExternalLink, UserCheck, Scale, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const PrivacyPolicy = () => {
  const sections = [
    {
      title: "1. About MyLocalPro",
      icon: Info,
      content: "MyLocalPro is a MyLocalPron owned and operated online platform that connects customers with local businesses and service providers across MyLocalPro. This Privacy Policy applies to all users of the platform, including customers, business owners, website visitors, advertisers, and enquiry submitters."
    },
    {
      title: "2. Information We Collect",
      icon: Eye,
      content: (
        <div className="space-y-6">
          <p>We may collect personal information that is reasonably necessary for the operation of our platform and services.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#f8fafc] border border-[#f1f5f9] rounded-xl p-6">
              <h4 className="text-[#097DDD] font-black text-[10px] uppercase tracking-widest mb-3">2.1 Customers</h4>
              <ul className="text-[12px] text-[#64748b] space-y-1">
                <li>• Full name</li>
                <li>• Email address</li>
                <li>• Phone number</li>
                <li>• Suburb or location</li>
                <li>• Service enquiry details</li>
              </ul>
            </div>
            <div className="bg-[#f8fafc] border border-[#f1f5f9] rounded-xl p-6">
              <h4 className="text-[#097DDD] font-black text-[10px] uppercase tracking-widest mb-3">2.2 Businesses</h4>
              <ul className="text-[12px] text-[#64748b] space-y-1">
                <li>• Business name & ABN</li>
                <li>• Representative name</li>
                <li>• Contact information</li>
                <li>• Logos & photographs</li>
                <li>• Social media links</li>
              </ul>
            </div>
            <div className="bg-[#f8fafc] border border-[#f1f5f9] rounded-xl p-6">
              <h4 className="text-[#097DDD] font-black text-[10px] uppercase tracking-widest mb-3">2.3 Automatic Data</h4>
              <ul className="text-[12px] text-[#64748b] space-y-1">
                <li>• IP address & Browser type</li>
                <li>• Device information</li>
                <li>• Website usage data</li>
                <li>• Cookies & tracking</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "3. How We Collect Information",
      icon: Search,
      content: "Information may be collected when users register an account, submit a business listing, contact us through forms or email, submit enquiries, subscribe to updates, interact with the website, or participate in promotions."
    },
    {
      title: "4. How We Use Information",
      icon: List,
      content: "We use collected information to operate and improve the platform, connect customers with businesses, respond to enquiries, process subscriptions and billing, display business listings, send service updates, and conduct marketing activities."
    },
    {
      title: "5. Business Listing Information",
      icon: List,
      content: "Information submitted by businesses for public listings (name, contact info, descriptions, images, service areas) may be displayed publicly on the MyLocalPro website. Businesses are responsible for ensuring information is accurate."
    },
    {
      title: "6. Sharing of Information",
      icon: Share2,
      content: "MyLocalPro does not sell personal information to third parties. We may share information with customers and businesses for connectivity, with trusted service providers, where required by law, or to protect our legal rights."
    },
    {
      title: "7. Cookies and Tracking",
      icon: MousePointer2,
      content: "MyLocalPro may use cookies to remember preferences, analyse traffic, and support marketing campaigns. Users may disable cookies through browser settings, though some features may not function correctly."
    },
    {
      title: "8. Marketing Communications",
      icon: Mail,
      content: "Users may receive emails or SMS relating to platform updates, new features, or promotions. Users may opt out of marketing communications at any time by contacting us or using unsubscribe functions."
    },
    {
      title: "9. Data Security",
      icon: Lock,
      content: "We take reasonable steps to protect personal information from unauthorised access, misuse, or loss. However, no online platform is completely secure. Users provide information at their own risk."
    },
    {
      title: "10. Third-Party Services",
      icon: ExternalLink,
      content: "Our website may contain links to third-party services or social platforms. We are not responsible for the privacy practices, content, or security of external websites."
    },
    {
      title: "11. Access and Correction",
      icon: UserCheck,
      content: "Users may request access to personal information held by MyLocalPro or request corrections to inaccurate data by contacting contactmylocalpro@gmail.com."
    },
    {
      title: "12. Retention of Information",
      icon: ShieldCheck,
      content: "We retain personal information only for as long as necessary to operate the platform, meet legal obligations, resolve disputes, or enforce agreements."
    },
    {
      title: "13. Children's Privacy",
      icon: UserCheck,
      content: "MyLocalPro is not intended for individuals under 18. We do not knowingly collect personal information from children."
    },
    {
      title: "14. Australian Privacy Principles",
      icon: Scale,
      content: "MyLocalPro aims to comply with the Australian Privacy Principles contained within the Privacy Act 1988 (Cth)."
    },
    {
      title: "15. Changes to This Policy",
      icon: HelpCircle,
      content: "MyLocalPro may update this Privacy Policy at any time. Updated versions will be published on the website and become effective immediately upon publication."
    },
    {
      title: "16. Contact Information",
      icon: Mail,
      content: (
        <div className="bg-[#f8fafc] border border-[#f1f5f9] rounded-xl p-8">
          <p className="font-black text-[#0A1830] mb-2 text-base">MyLocalPro</p>
          <p className="text-sm text-[#64748b] mb-1">ABN: 39 494 930 909</p>
          <p className="text-sm text-[#097DDD] font-bold">contactmylocalpro@gmail.com</p>
        </div>
      )
    },
  ];

  return (
    <div className="text-white font-sans">

      {/* ── Banner ── */}
      <section className="relative pt-48 pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-[#050f26]" />
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-[#097DDD]/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-[#097DDD] shadow-xl shadow-[#097DDD]/20 mb-8"
          >
            <Shield className="h-5 w-5 text-white" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-black text-white leading-tight mb-6"
          >
            Privacy <span className="text-[#097DDD]">Policy</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-white/30 max-w-2xl mx-auto text-[10px] font-black uppercase tracking-[0.4em]"
          >
            Effective Date: 1 June 2026<br />
            Operated by MyLocalPro, ABN 39 494 930 909
          </motion.p>
        </div>
      </section>

      <main className="pb-40 px-6 relative z-10 -mt-24">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-[1.5rem] shadow-[0_40px_100px_rgba(0,0,0,0.5)] overflow-hidden">
            <div className="p-8 md:p-16 lg:p-20">
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-[#097DDD] hover:opacity-70 mb-12 transition-all group"
              >
                <ArrowLeft className="h-3 w-3 group-hover:-translate-x-1 transition-transform" />
                Back to Home
              </Link>

              {/* Intro */}
              <div className="mb-16 p-10 bg-[#f8fafc] rounded-2xl border border-[#f1f5f9]">
                <p className="text-[#5a6a85] leading-relaxed italic text-[15px] font-medium">
                  "This Privacy Policy explains how MyLocalPro collects, stores, uses, and protects your personal information when you use our website and services. By accessing or using the platform, you agree to the terms outlined here."
                </p>
              </div>

              <div className="space-y-16">
                {sections.map((section, index) => (
                  <div key={index} className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-[#097DDD]/5 rounded-xl flex items-center justify-center shrink-0">
                        <section.icon size={18} className="text-[#097DDD]" />
                      </div>
                      <h2 className="text-[17px] font-black text-[#0A1830] tracking-tight">
                        {section.title}
                      </h2>
                    </div>
                    <div className="text-[14px] text-[#5a6a85] leading-[1.8] font-medium pl-14">
                      {typeof section.content === 'string' ? (
                        <p>{section.content}</p>
                      ) : (
                        section.content
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

    </div>
  );
};

export default PrivacyPolicy;
