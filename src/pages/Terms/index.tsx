import { motion } from 'framer-motion';
import { FileText, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import heroImg from "../../assets/section images/hero-tradie.jpg";

const TermsAndConditions = () => {
  const sections = [
    { title: "1. About MyLocalPro", content: "MyLocalPro is an online platform designed to connect customers with independent local service providers throughout MyLocalPro. MyLocalPro allows businesses to advertise their services and allows customers to search for and contact providers directly. MyLocalPro is not a contractor, employer, agent, or partner of any listed business. All work arrangements, pricing, communication, disputes, payments, warranties, and agreements are solely between the customer and the service provider." },
    { title: "2. Eligibility", content: "To use MyLocalPro, users must be at least 18 years of age, provide accurate and truthful information, use the Platform lawfully and respectfully, and not impersonate another person or business. MyLocalPro reserves the right to suspend or remove any account that breaches these Terms and Conditions." },
    { title: "3. Service Areas", content: "MyLocalPro currently operates within the following MyLocalPron locations: Hobart, Launceston, Devonport and Burnie. Additional locations may be added at the discretion of MyLocalPro." },
    { title: "4. Business Categories", content: "MyLocalPro currently offers listings within the following 16 categories: Handyman Services, Lawn Mowing and Gardening, Domestic Cleaning, Car Detailing, Pressure Washing, Carpet Cleaning, Plumbers, Electricians, Builders, Painters, Roofers, Concreters, Plasterers, Landscapers, Photographers and Fencing Contractors. MyLocalPro reserves the right to add, remove, rename, or modify categories at any time." },
    {
      title: "5. Subscription Structure", content: (
        <div className="space-y-4 ml-4">
          <p><strong className="text-[#0A1830] font-black">5.1 Free Access During 2026:</strong> All approved businesses listed on MyLocalPro will receive free access to the platform from launch until 31 December 2026. No subscription fees will apply during this promotional period. Businesses may cancel their listing at any time during the free period.</p>
          <p><strong className="text-[#0A1830] font-black">5.2 Paid Subscriptions From 1 January 2027:</strong> Beginning 1 January 2027, businesses wishing to remain active on the platform will transition to a paid monthly subscription model. Subscription pricing is set at a flat rate of $33 per month inc GST for all businesses.</p>
        </div>
      )
    },
    {
      title: "6. Subscription Flat Rate", content: (
        <div className="space-y-4 mt-6">
          <div className="bg-[#f8fafc] border border-[#f1f5f9] rounded-xl p-8 transition-all">
            <h4 className="text-[#097DDD] font-black text-2xl mb-2">$33 Per Month <span className="text-sm text-[#64748b] font-bold">inc GST</span></h4>
            <p className="text-[14px] text-[#64748b] leading-relaxed font-medium">This flat rate applies to all business categories listed on MyLocalPro. There are no lead fees, no hidden costs, and no lock-in contracts.</p>
          </div>
        </div>
      )
    },
    { title: "7. Payments and Billing", content: "Subscription fees are billed monthly in advance. Failure to make payment may result in suspension or removal of the business listing. Subscription fees are non-refundable except where required under Australian Consumer Law. MyLocalPro reserves the right to alter pricing with a minimum of 30 days written notice." },
    { title: "8. Business Listings", content: "Businesses agree that all information provided must be accurate and up to date, they are legally permitted to operate their business, any licences, insurance, registrations, or certifications required by law are their responsibility, and listings must not contain misleading, false, offensive, or unlawful content." },
    { title: "9. Customer Responsibilities", content: "Customers using the Platform acknowledge that MyLocalPro does not guarantee the quality, reliability, licensing, or performance of any listed business; customers must conduct their own checks before engaging a provider." },
    { title: "10. Limitation of Liability", content: "To the maximum extent permitted by law, MyLocalPro is not liable for any loss, damage, injury, dispute, delay, poor workmanship, or financial loss arising from services provided by businesses listed on the Platform." },
    { title: "11. Intellectual Property", content: "All website content including branding, logos, graphics, text, design elements, and platform functionality remain the intellectual property of MyLocalPro unless otherwise stated." },
    { title: "12. Privacy", content: "MyLocalPro may collect personal and business information required to operate the Platform. Information will not be sold to third parties. By using the Platform, users consent to the collection and use of information for operational and marketing purposes." },
    { title: "16. Governing Law", content: "These Terms and Conditions are governed by the laws of MyLocalPro, Australia. Any disputes arising from the use of the Platform will be subject to the jurisdiction of MyLocalPron courts." },
    { title: "17. Contact Information", content: "For all enquiries relating to these Terms and Conditions, please contact: MyLocalPro, ABN 39 494 930 909, Email: contactmylocalpro@gmail.com." },
  ];

  return (
    <div className="text-white font-sans">

      {/* ── Banner ── */}
      <section className="relative pt-48 pb-32 overflow-hidden">
        <img
          src={heroImg}
          alt="MyLocalPron tradie"
          className="absolute inset-0 h-full w-full object-cover opacity-[0.1]"
        />
        <div className="absolute inset-0 bg-[#050f26]/90" />

        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-[#097DDD] shadow-xl shadow-[#097DDD]/20 mb-8"
          >
            <FileText className="h-5 w-5 text-white" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-black text-white leading-tight mb-6"
          >
            Terms & <span className="text-[#097DDD]">Conditions</span>
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

              <div className="space-y-12">
                {sections.map((section, idx) => (
                  <div key={idx} className="space-y-4">
                    <h2 className="text-[17px] font-black text-[#0A1830] tracking-tight">
                      {section.title}
                    </h2>
                    <div className="text-[14px] text-[#5a6a85] leading-[1.8] font-medium">
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

export default TermsAndConditions;
