import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Gift, Save, Plus, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';
import Swal from 'sweetalert2';
import { getGiveawayConfig, updateGiveawayConfig } from '../../../api/giveawayApi';
import { DEFAULT_GIVEAWAY_CONFIG } from '../../../data/giveaway';
import type { GiveawayConfig, GiveawayRegion } from '../../../types/giveaway';

const labelCls = 'text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1 block mb-1.5';
const inputCls =
  'w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-slate-800 text-sm font-semibold focus:outline-none focus:border-[#097DDD]';
const textareaCls = `${inputCls} resize-y min-h-[88px]`;

const Toggle = ({
  label,
  hint,
  checked,
  onChange,
}: {
  label: string;
  hint?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) => (
  <button
    type="button"
    onClick={() => onChange(!checked)}
    className="flex items-center justify-between w-full p-4 rounded-2xl border border-slate-100 bg-slate-50/80 hover:bg-slate-50 transition-colors text-left"
  >
    <div>
      <p className="text-sm font-black text-slate-800">{label}</p>
      {hint && <p className="text-xs text-slate-500 mt-1">{hint}</p>}
    </div>
    {checked ? (
      <ToggleRight className="text-[#097DDD] shrink-0" size={28} />
    ) : (
      <ToggleLeft className="text-slate-300 shrink-0" size={28} />
    )}
  </button>
);

const GiveawaySection = () => {
  const [form, setForm] = useState<GiveawayConfig>(DEFAULT_GIVEAWAY_CONFIG);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [section, setSection] = useState<'general' | 'ticker' | 'banner' | 'details'>('general');

  useEffect(() => {
    getGiveawayConfig()
      .then((data) => setForm({ ...DEFAULT_GIVEAWAY_CONFIG, ...data }))
      .catch(() => setForm(DEFAULT_GIVEAWAY_CONFIG))
      .finally(() => setLoading(false));
  }, []);

  const setField = <K extends keyof GiveawayConfig>(key: K, value: GiveawayConfig[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const updateRegion = (index: number, field: keyof GiveawayRegion, value: string) => {
    setForm((prev) => {
      const regions = [...prev.regions];
      regions[index] = { ...regions[index], [field]: value };
      return { ...prev, regions };
    });
  };

  const addTickerLine = () => setField('tickerItems', [...form.tickerItems, '']);
  const removeTickerLine = (i: number) =>
    setField(
      'tickerItems',
      form.tickerItems.filter((_, idx) => idx !== i)
    );

  const addEntryStep = () => setField('detailsEntrySteps', [...form.detailsEntrySteps, '']);
  const removeEntryStep = (i: number) =>
    setField(
      'detailsEntrySteps',
      form.detailsEntrySteps.filter((_, idx) => idx !== i)
    );

  const paragraphsFromText = (text: string) =>
    text
      .split(/\n\n+/)
      .map((p) => p.trim())
      .filter(Boolean);

  const textFromParagraphs = (arr: string[]) => arr.join('\n\n');

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        ...form,
        tickerItems: form.tickerItems.map((s) => s.trim()).filter(Boolean),
        detailsEntrySteps: form.detailsEntrySteps.map((s) => s.trim()).filter(Boolean),
        regions: form.regions.filter((r) => r.name.trim()),
      };
      const saved = await updateGiveawayConfig(payload);
      setForm({ ...DEFAULT_GIVEAWAY_CONFIG, ...saved });
      window.dispatchEvent(new Event('giveaway-updated'));
      Swal.fire({
        title: 'Saved',
        text: 'Giveaway content updated on the live site.',
        icon: 'success',
        confirmButtonColor: '#097DDD',
      });
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Failed to save giveaway.';
      Swal.fire({ title: 'Error', text: message, icon: 'error', confirmButtonColor: '#097DDD' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-slate-500 text-sm">Loading giveaway settings...</div>;
  }

  const tabs = [
    { id: 'general' as const, name: 'Overview' },
    { id: 'ticker' as const, name: 'Scrolling line' },
    { id: 'banner' as const, name: 'Home banner' },
    { id: 'details' as const, name: 'Details page' },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-[#0D1F43] flex items-center gap-3">
            <Gift className="text-[#097DDD]" size={28} />
            Giveaway Manager
          </h2>
          <p className="text-[12px] font-bold text-slate-400 uppercase tracking-widest mt-1">
            Control ticker, banner, and details page — turn off when the giveaway ends
          </p>
        </div>
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="bg-[#097DDD] hover:bg-[#0869bb] disabled:opacity-60 text-white px-8 py-4 rounded-2xl font-black text-[12px] uppercase tracking-[0.2em] shadow-xl shadow-blue-500/20 flex items-center gap-2"
        >
          <Save size={16} />
          {saving ? 'Saving...' : 'Save changes'}
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setSection(t.id)}
            className={`px-5 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all ${
              section === t.id
                ? 'bg-[#097DDD] text-white shadow-lg shadow-[#097DDD]/25'
                : 'bg-white border border-slate-200 text-slate-500 hover:border-[#097DDD]/30'
            }`}
          >
            {t.name}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8 space-y-6">
        {section === 'general' && (
          <>
            <Toggle
              label="Giveaway active (master switch)"
              hint="When off, ticker, banner, and details page are hidden site-wide."
              checked={form.isActive}
              onChange={(v) => setField('isActive', v)}
            />
            <p className="text-xs text-slate-500 leading-relaxed">
              Use the toggles in each tab to hide individual sections while keeping content saved for next time.
            </p>
          </>
        )}

        {section === 'ticker' && (
          <>
            <Toggle
              label="Show scrolling line on home page"
              hint="Appears below the navbar on the homepage only."
              checked={form.tickerEnabled}
              onChange={(v) => setField('tickerEnabled', v)}
            />
            <div className="space-y-3">
              <p className={labelCls}>Ticker messages (one per row)</p>
              {form.tickerItems.map((line, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    className={inputCls}
                    value={line}
                    onChange={(e) => {
                      const next = [...form.tickerItems];
                      next[i] = e.target.value;
                      setField('tickerItems', next);
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => removeTickerLine(i)}
                    className="p-3 text-rose-500 hover:bg-rose-50 rounded-xl border border-rose-100"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addTickerLine}
                className="text-[11px] font-black uppercase tracking-wider text-[#097DDD] flex items-center gap-1"
              >
                <Plus size={14} /> Add line
              </button>
            </div>
          </>
        )}

        {section === 'banner' && (
          <>
            <Toggle
              label="Show home page banner section"
              checked={form.bannerEnabled}
              onChange={(v) => setField('bannerEnabled', v)}
            />
            <div className="grid gap-4">
              <div>
                <label className={labelCls}>Badge text</label>
                <input className={inputCls} value={form.bannerBadge} onChange={(e) => setField('bannerBadge', e.target.value)} />
              </div>
              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <label className={labelCls}>Headline (before highlight)</label>
                  <input className={inputCls} value={form.bannerHeadline} onChange={(e) => setField('bannerHeadline', e.target.value)} />
                </div>
                <div>
                  <label className={labelCls}>Highlighted words</label>
                  <input className={inputCls} value={form.bannerHeadlineHighlight} onChange={(e) => setField('bannerHeadlineHighlight', e.target.value)} />
                </div>
                <div>
                  <label className={labelCls}>Headline (after highlight)</label>
                  <input className={inputCls} value={form.bannerHeadlineSuffix} onChange={(e) => setField('bannerHeadlineSuffix', e.target.value)} />
                </div>
              </div>
              <div>
                <label className={labelCls}>Description</label>
                <textarea className={textareaCls} value={form.bannerDescription} onChange={(e) => setField('bannerDescription', e.target.value)} />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Primary button</label>
                  <input className={inputCls} value={form.bannerPrimaryCta} onChange={(e) => setField('bannerPrimaryCta', e.target.value)} />
                </div>
                <div>
                  <label className={labelCls}>Secondary button</label>
                  <input className={inputCls} value={form.bannerSecondaryCta} onChange={(e) => setField('bannerSecondaryCta', e.target.value)} />
                </div>
              </div>
              <div>
                <label className={labelCls}>Regions heading</label>
                <input className={inputCls} value={form.bannerRegionsHeading} onChange={(e) => setField('bannerRegionsHeading', e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>Footer note</label>
                <input className={inputCls} value={form.bannerFooterNote} onChange={(e) => setField('bannerFooterNote', e.target.value)} />
              </div>
            </div>
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <p className="text-sm font-black text-slate-800">Prize regions (shared with details page)</p>
              {form.regions.map((region, i) => (
                <div key={i} className="grid sm:grid-cols-3 gap-3 p-4 bg-slate-50 rounded-xl">
                  <input className={inputCls} placeholder="Region name" value={region.name} onChange={(e) => updateRegion(i, 'name', e.target.value)} />
                  <input className={inputCls} placeholder="Cash prize" value={region.cash} onChange={(e) => updateRegion(i, 'cash', e.target.value)} />
                  <input className={inputCls} placeholder="Membership prize" value={region.membership} onChange={(e) => updateRegion(i, 'membership', e.target.value)} />
                </div>
              ))}
            </div>
          </>
        )}

        {section === 'details' && (
          <>
            <Toggle
              label="Show /giveaway details page"
              hint="When off, visitors see a short “giveaway ended” message."
              checked={form.detailsEnabled}
              onChange={(v) => setField('detailsEnabled', v)}
            />
            <div className="grid gap-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Hero title</label>
                  <input className={inputCls} value={form.detailsHeroTitle} onChange={(e) => setField('detailsHeroTitle', e.target.value)} />
                </div>
                <div>
                  <label className={labelCls}>Hero highlight</label>
                  <input className={inputCls} value={form.detailsHeroHighlight} onChange={(e) => setField('detailsHeroHighlight', e.target.value)} />
                </div>
              </div>
              <div>
                <label className={labelCls}>Hero subtitle</label>
                <input className={inputCls} value={form.detailsHeroSubtitle} onChange={(e) => setField('detailsHeroSubtitle', e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>About title</label>
                <input className={inputCls} value={form.detailsAboutTitle} onChange={(e) => setField('detailsAboutTitle', e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>About paragraphs (blank line between paragraphs)</label>
                <textarea
                  className={textareaCls}
                  value={textFromParagraphs(form.detailsAboutParagraphs)}
                  onChange={(e) => setField('detailsAboutParagraphs', paragraphsFromText(e.target.value))}
                />
              </div>
              <div>
                <label className={labelCls}>Regions section title</label>
                <input className={inputCls} value={form.detailsRegionsTitle} onChange={(e) => setField('detailsRegionsTitle', e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>Why section title</label>
                <input className={inputCls} value={form.detailsWhyTitle} onChange={(e) => setField('detailsWhyTitle', e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>Why paragraphs</label>
                <textarea
                  className={textareaCls}
                  value={textFromParagraphs(form.detailsWhyParagraphs)}
                  onChange={(e) => setField('detailsWhyParagraphs', paragraphsFromText(e.target.value))}
                />
              </div>
              <div>
                <label className={labelCls}>How to enter — title</label>
                <input className={inputCls} value={form.detailsHowTitle} onChange={(e) => setField('detailsHowTitle', e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>How to enter — intro</label>
                <input className={inputCls} value={form.detailsHowIntro} onChange={(e) => setField('detailsHowIntro', e.target.value)} />
              </div>
              <div className="space-y-3">
                <p className={labelCls}>Entry steps</p>
                {form.detailsEntrySteps.map((step, i) => (
                  <div key={i} className="flex gap-2">
                    <input
                      className={inputCls}
                      value={step}
                      onChange={(e) => {
                        const next = [...form.detailsEntrySteps];
                        next[i] = e.target.value;
                        setField('detailsEntrySteps', next);
                      }}
                    />
                    <button type="button" onClick={() => removeEntryStep(i)} className="p-3 text-rose-500 hover:bg-rose-50 rounded-xl border border-rose-100">
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
                <button type="button" onClick={addEntryStep} className="text-[11px] font-black uppercase tracking-wider text-[#097DDD] flex items-center gap-1">
                  <Plus size={14} /> Add step
                </button>
              </div>
              <div>
                <label className={labelCls}>How to enter — closing line</label>
                <input className={inputCls} value={form.detailsHowOutro} onChange={(e) => setField('detailsHowOutro', e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>Urgency title</label>
                <input className={inputCls} value={form.detailsUrgencyTitle} onChange={(e) => setField('detailsUrgencyTitle', e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>Urgency paragraphs</label>
                <textarea
                  className={textareaCls}
                  value={textFromParagraphs(form.detailsUrgencyParagraphs)}
                  onChange={(e) => setField('detailsUrgencyParagraphs', paragraphsFromText(e.target.value))}
                />
              </div>
              <div>
                <label className={labelCls}>Urgency tagline</label>
                <input className={inputCls} value={form.detailsUrgencyTagline} onChange={(e) => setField('detailsUrgencyTagline', e.target.value)} />
              </div>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
};

export default GiveawaySection;
