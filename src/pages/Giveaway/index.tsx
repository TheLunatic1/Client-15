import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Trophy,
  Heart,
  CheckCircle2,
  Clock,
  MapPin,
  Banknote,
  Star,
} from "lucide-react";
import { Link } from "react-router-dom";
import heroImg from "../../assets/section images/hero-tradie.jpg";
import { useGiveaway } from "../../context/GiveawayContext";
import LoadingScreen from "../../components/common/LoadingScreen";

const Giveaway = () => {
  const { config, showDetailsPage, loading } = useGiveaway();

  if (loading) return <LoadingScreen />;

  if (!showDetailsPage) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-[#050f26] text-white px-6 pt-32">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-black mb-4">Giveaway ended</h1>
          <p className="text-white/60 text-sm mb-8">
            This promotion is no longer active. Browse local pros or list your business on MyLocalPro.
          </p>
          <Link
            to="/find-a-pro"
            className="inline-flex rounded-xl bg-[#097DDD] px-8 py-4 text-[11px] font-black uppercase tracking-[0.2em] text-white"
          >
            Find a Pro
          </Link>
        </div>
      </div>
    );
  }

  const c = config;

  return (
    <div className="text-white font-sans">
      <section className="relative pt-32 md:pt-36 pb-20 md:pb-24 overflow-hidden">
        <img
          src={heroImg}
          alt="MyLocalPro tradie"
          className="absolute inset-0 h-full w-full object-cover opacity-[0.1]"
        />
        <div className="absolute inset-0 bg-[#050f26]/90" />

        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-5"
          >
            {c.detailsHeroTitle}{" "}
            <span className="text-[#097DDD]">{c.detailsHeroHighlight}</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-white/50 max-w-2xl mx-auto text-base md:text-lg font-medium leading-relaxed"
          >
            {c.detailsHeroSubtitle}
          </motion.p>
        </div>
      </section>

      <main className="pb-40 px-6 relative z-10 -mt-10 md:-mt-12">
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

              <div className="space-y-14">
                <section className="space-y-4">
                  <h2 className="text-[17px] font-black text-[#0A1830] tracking-tight">
                    {c.detailsAboutTitle}
                  </h2>
                  {c.detailsAboutParagraphs.map((p) => (
                    <p key={p} className="text-[14px] text-[#5a6a85] leading-[1.8] font-medium">
                      {p}
                    </p>
                  ))}
                </section>

                <section className="space-y-6">
                  <div className="flex items-center gap-3">
                    <Trophy className="h-5 w-5 text-amber-500" />
                    <h2 className="text-[17px] font-black text-[#0A1830] tracking-tight">
                      {c.detailsRegionsTitle}
                    </h2>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {c.regions.map((region) => (
                      <div
                        key={region.name}
                        className="bg-[#f8fafc] border border-[#f1f5f9] rounded-xl p-6 space-y-3"
                      >
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-[#097DDD]" />
                          <h3 className="text-[#0A1830] font-black text-sm">{region.name}</h3>
                        </div>
                        <div className="flex items-start gap-2">
                          <Banknote className="h-4 w-4 text-[#097DDD] shrink-0 mt-0.5" />
                          <p className="text-[14px] text-[#5a6a85] font-medium">
                            <strong className="text-[#0A1830]">{region.cash} cash</strong> for your business
                          </p>
                        </div>
                        <div className="flex items-start gap-2">
                          <Star className="h-4 w-4 text-[#097DDD] shrink-0 mt-0.5" />
                          <p className="text-[14px] text-[#5a6a85] font-medium">{region.membership}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Heart className="h-5 w-5 text-[#097DDD]" />
                    <h2 className="text-[17px] font-black text-[#0A1830] tracking-tight">
                      {c.detailsWhyTitle}
                    </h2>
                  </div>
                  {c.detailsWhyParagraphs.map((p) => (
                    <p key={p} className="text-[14px] text-[#5a6a85] leading-[1.8] font-medium">
                      {p}
                    </p>
                  ))}
                </section>

                <section className="space-y-6">
                  <h2 className="text-[17px] font-black text-[#0A1830] tracking-tight">{c.detailsHowTitle}</h2>
                  <p className="text-[14px] text-[#5a6a85] leading-[1.8] font-medium">{c.detailsHowIntro}</p>
                  <ul className="space-y-4">
                    {c.detailsEntrySteps.map((step) => (
                      <li key={step} className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-[#097DDD] shrink-0 mt-0.5" />
                        <span className="text-[14px] text-[#5a6a85] font-medium leading-relaxed">{step}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="text-[14px] text-[#5a6a85] leading-[1.8] font-medium">{c.detailsHowOutro}</p>
                </section>

                <section className="rounded-xl border border-amber-200 bg-amber-50/80 p-6 md:p-8 space-y-3">
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-amber-600" />
                    <h2 className="text-[17px] font-black text-[#0A1830] tracking-tight">
                      {c.detailsUrgencyTitle}
                    </h2>
                  </div>
                  {c.detailsUrgencyParagraphs.map((p) => (
                    <p key={p} className="text-[14px] text-[#5a6a85] leading-[1.8] font-medium">
                      {p}
                    </p>
                  ))}
                  <p className="text-[14px] font-black text-[#0A1830]">{c.detailsUrgencyTagline}</p>
                </section>

                <div className="pt-4 flex flex-col sm:flex-row gap-4 border-t border-[#f1f5f9]">
                  <Link
                    to="/list-your-business"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#097DDD] px-8 py-4 text-[11px] font-black uppercase tracking-[0.2em] text-white shadow-[0_10px_30px_rgba(9,125,221,0.3)] hover:bg-[#0869bb] transition-all"
                  >
                    List Your Business
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    to="/contact"
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#e2e8f0] px-8 py-4 text-[11px] font-black uppercase tracking-[0.2em] text-[#0A1830] hover:bg-[#f8fafc] transition-all"
                  >
                    Contact Us
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Giveaway;
