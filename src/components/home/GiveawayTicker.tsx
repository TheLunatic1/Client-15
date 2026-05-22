import { Link } from "react-router-dom";
import { Gift, ArrowRight } from "lucide-react";

type Props = {
  items: string[];
};

const GiveawayTicker = ({ items }: Props) => {
  if (!items.length) return null;

  const renderItems = (suffix: string) =>
    items.map((text, i) => (
      <span
        key={`${suffix}-${i}`}
        className="inline-flex items-center gap-2 px-8 py-2.5 text-[10px] md:text-[11px] font-black uppercase tracking-[0.18em] text-white whitespace-nowrap"
      >
        <Gift className="h-3.5 w-3.5 shrink-0 opacity-90" aria-hidden />
        {text}
        <span className="text-white/40" aria-hidden>
          •
        </span>
      </span>
    ));

  return (
    <div
      className="relative bg-[#097DDD] border-b border-[#0869bb]/40 shrink-0"
      role="region"
      aria-label="Giveaway promotion"
    >
      <Link
        to="/giveaway"
        className="block overflow-hidden pr-0 sm:pr-[7.5rem] hover:bg-[#0869bb]/30 transition-colors"
      >
        <div className="flex w-max animate-giveaway-marquee hover:[animation-play-state:paused]">
          <div className="flex shrink-0 items-center">{renderItems("a")}</div>
          <div className="flex shrink-0 items-center" aria-hidden>
            {renderItems("b")}
          </div>
        </div>
      </Link>
      <Link
        to="/giveaway"
        className="absolute right-0 top-0 bottom-0 z-10 hidden sm:flex items-center gap-1.5 bg-gradient-to-l from-[#097DDD] via-[#097DDD] to-transparent pl-10 pr-5 text-[9px] font-black uppercase tracking-[0.2em] text-white hover:text-white/90"
      >
        Details
        <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  );
};

export default GiveawayTicker;
