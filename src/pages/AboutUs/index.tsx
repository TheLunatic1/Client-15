import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ShieldCheck, Users, MapPin, ArrowRight } from 'lucide-react';

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-[#050f26] text-white pt-32 pb-20 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#097DDD]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#097DDD]/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-6 lg:px-8 relative z-10">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#097DDD]/10 border border-[#097DDD]/20 text-[#097DDD] text-[10px] font-black uppercase tracking-widest mb-6">
            <MapPin size={12} /> Tasmania Owned & Operated
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-6">
            About Us
          </h1>
          <p className="text-xl text-white/60 max-w-2xl mx-auto font-medium leading-relaxed">
            Welcome to MyLocalPro – proudly Tasmanian owned and operated.
          </p>
        </motion.div>

        {/* Main Content Sections */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Text Content */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="md:col-span-7 space-y-8"
          >
            <div className="bg-[#1a2b4b]/20 backdrop-blur-xl border border-white/5 rounded-3xl p-8 lg:p-10 shadow-2xl">
              <div className="space-y-6 text-[#E4EAF1]/70 leading-relaxed font-medium">
                <p>
                  At MyLocalPro, we believe finding trusted local services should be simple, stress-free, and focused on supporting local communities. That's why we created a platform designed to connect everyday Tasmanians with quality local businesses across a wide range of services – all in one easy-to-use place.
                </p>
                <p>
                  Based right here in Tasmania, MyLocalPro was built with one goal in mind: helping local businesses grow while making it easier for customers to find reliable professionals in their area. Whether you're searching for a plumber, electrician, painter, lawn mowing expert, cleaner, photographer, handyman, or another trusted local service, we're here to help you connect with businesses that genuinely care about their reputation and community.
                </p>
                <p>
                  Unlike large national directories, MyLocalPro is focused on keeping things local. We understand Tasmania, our communities, and the importance of supporting small businesses that keep our towns and cities thriving. That's why we proudly showcase local service providers across the Hobart, Launceston, Devonport, and Burnie regions.
                </p>
                <p>
                  To maintain quality and create stronger opportunities for businesses, places are limited, ensuring providers have a genuine opportunity to stand out and connect with customers in their area.
                </p>
                <p>
                  At MyLocalPro, we're passionate about supporting local families, strengthening small businesses, and creating better connections between customers and trusted professionals.
                </p>
                <p className="text-white font-bold text-lg">
                  Whether you're looking for help around the home or wanting to grow your business, MyLocalPro is your trusted local connection.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Values & CTA */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="md:col-span-5 space-y-6"
          >
            {/* Feature Cards */}
            <div className="bg-[#097DDD]/10 border border-[#097DDD]/20 rounded-3xl p-8">
              <div className="w-12 h-12 bg-[#097DDD] rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-blue-500/20">
                <ShieldCheck className="text-white" size={24} />
              </div>
              <h3 className="text-xl font-black text-white mb-3">Trusted & Verified</h3>
              <p className="text-white/60 text-sm leading-relaxed">
                We ensure that all service providers on our platform are genuine local businesses committed to quality.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-6">
                <Users className="text-white" size={24} />
              </div>
              <h3 className="text-xl font-black text-white mb-3">Community Focused</h3>
              <p className="text-white/60 text-sm leading-relaxed">
                By keeping it local, we support small businesses and families across our local communities.
              </p>
            </div>

            {/* Call to Action Box */}
            <div className="bg-gradient-to-br from-[#0A1830] to-[#050f26] border border-white/10 rounded-3xl p-8 mt-8 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#097DDD]/20 rounded-full blur-2xl group-hover:bg-[#097DDD]/30 transition-colors" />
              <h3 className="text-2xl font-black text-white mb-3 relative z-10">Ready to join?</h3>
              <p className="text-white/60 text-sm mb-8 relative z-10 leading-relaxed">
                Ready to grow your business or find trusted local services? Join the growing MyLocalPro community today.
              </p>
              <Link 
                to="/join-now" 
                className="inline-flex w-full items-center justify-center gap-3 bg-[#097DDD] hover:bg-[#0869bb] text-white py-4 px-6 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all shadow-xl shadow-[#097DDD]/20 relative z-10"
              >
                👉 Sign Up Now <ArrowRight size={14} />
              </Link>
              <p className="text-center text-[10px] text-white/40 mt-4 uppercase tracking-widest font-bold">
                Be part of Tasmania's trusted local network!
              </p>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default AboutUs;
