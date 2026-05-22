import { useState } from "react";
import { Mail, MapPin, Phone, CheckCircle2, ArrowRight, AlertCircle, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { validateContactForm, showValidationAlert } from "../../utils/validation";
import { submitContactForm } from "../../api/contactApi";

const contactItems = [
  { icon: Mail, label: "Email", value: "contactmylocalpro@gmail.com" },
  { icon: Phone, label: "Phone", value: "1300 555 010" },
  { icon: MapPin, label: "Office", value: "Hobart, MyLocalPro" },
];

const labelCls = "block text-[9px] font-black uppercase tracking-[0.22em] text-[#7a90a8] mb-1.5";
const inputCls = "w-full block rounded-[10px] border border-[#cdd6e3] bg-[#E4EAF1]/35 p-[11px_14px] text-[0.87rem] text-[#0A1830] font-medium outline-none transition-all duration-200 focus:border-[#097DDD] focus:ring-3 focus:ring-[#097DDD]/12 focus:bg-white box-border";

export const ContactFormSection = () => {
  const [sent, setSent] = useState(false);
  const [sentMessage, setSentMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const check = validateContactForm({ name, email, subject, message });
    if (!check.ok) {
      showValidationAlert(check.message);
      setError(check.message);
      return;
    }

    setLoading(true);

    try {
      const response = await submitContactForm({
        name,
        email,
        subject,
        message,
      });

      if (response.success) {
        if (response.partial) {
          setError(response.message);
          return;
        }

        setSentMessage(response.message);
        setSent(true);
        setTimeout(() => {
          setSent(false);
          setSentMessage(null);
          setName("");
          setEmail("");
          setSubject("");
          setMessage("");
        }, 4000);
        return;
      }

      setError(response.message || "Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-[#f4f7fb] pt-14 pb-18">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-[400px_minmax(0,720px)] gap-12 items-start justify-center">
        <div className="space-y-6">
          <h2 className="font-black text-[1.25rem] text-[#0A1830] mb-6">Get In Touch</h2>
          <div className="flex flex-col gap-4">
            {contactItems.map(({ icon: Icon, label, value }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, x: -14 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="flex items-center gap-6 bg-white border border-[#dde4ef] rounded-[18px] p-6 px-7 shadow-[0_2px_12px_rgba(10,24,48,0.06)]"
              >
                <div className="w-12 h-12 rounded-[12px] bg-[#097DDD]/10 flex items-center justify-center shrink-0">
                  <Icon size={22} className="text-[#097DDD]" />
                </div>
                <div>
                  <div className="text-[10px] font-black uppercase tracking-[0.25em] text-[#7a90a8] mb-1">{label}</div>
                  <div className="font-bold text-[#0A1830] text-[0.9rem]">{value}</div>
                </div>
              </motion.div>
            ))}
          </div>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.25 }}
            className="mt-4 rounded-[18px] bg-linear-to-br from-[#0a1628] to-[#0d2044] border border-white/8 p-6 px-8"
          >
            <div className="text-[10px] font-black uppercase tracking-[0.25em] text-[#E4EAF1]/35 mb-2">Response Time</div>
            <div className="text-white font-black text-[1.4rem] mb-1">Within 2&ndash;4 hours</div>
            <div className="text-[#E4EAF1]/45 text-[0.9rem]">Mon&ndash;Fri, 8am&ndash;6pm AEST</div>
          </motion.div>
        </div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          onSubmit={handleSubmit}
          className="bg-white border border-[#dde4ef] rounded-[20px] shadow-[0_4px_32px_rgba(10,24,48,0.08)] p-9"
        >
          {sent ? (
            <div className="text-center py-10">
              <div className="w-16 h-16 rounded-[16px] bg-[#097DDD]/10 flex items-center justify-center mx-auto mb-5">
                <CheckCircle2 size={32} className="text-[#097DDD]" />
              </div>
              <h2 className="font-black text-[1.4rem] text-[#0A1830] mb-1.5">Message sent!</h2>
              <p className="text-[#5a7089]">{sentMessage || "We\u2019ll get back to you shortly."}</p>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <h2 className="font-black text-[1.15rem] text-[#0A1830] mb-1">Send us a message</h2>
                <p className="text-[0.85rem] text-[#5a7089]">Fill out the form and we&rsquo;ll be in touch.</p>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 flex items-start gap-3 bg-red-50 border border-red-200 rounded-[12px] p-4"
                >
                  <AlertCircle size={18} className="text-red-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-red-900 text-sm">{error}</p>
                  </div>
                </motion.div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className={labelCls}>Name</label>
                  <input
                    type="text"
                    placeholder="John Smith"
                    className={inputCls}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    minLength={2}
                    maxLength={100}
                    disabled={loading}
                  />
                </div>
                <div>
                  <label className={labelCls}>Email</label>
                  <input
                    type="email"
                    placeholder="john@example.com"
                    className={inputCls}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className={labelCls}>Subject</label>
                <input
                  type="text"
                  placeholder="How can we help?"
                  className={inputCls}
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  minLength={3}
                  maxLength={120}
                  disabled={loading}
                />
              </div>
              <div className="mb-6">
                <label className={labelCls}>Message</label>
                <textarea
                  rows={5}
                  placeholder="Tell us more..."
                  className={`${inputCls} resize-y`}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  minLength={10}
                  maxLength={2000}
                  disabled={loading}
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className={`w-full flex items-center justify-center gap-2.5 font-black text-[11px] uppercase tracking-[0.18em] rounded-xl py-[15px] px-6 transition-all duration-200 ${
                  loading
                    ? 'bg-[#097DDD]/50 text-white cursor-not-allowed'
                    : 'bg-[#097DDD] text-white hover:bg-[#0a8ef0] cursor-pointer shadow-[0_4px_20px_rgba(9,125,221,0.4)]'
                }`}
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    Send Message
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </>
          )}
        </motion.form>
      </div>
    </section>
  );
};
