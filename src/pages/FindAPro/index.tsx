import { FindProHero, FindProSearch, FindProGrid } from "../../components/find-a-pro";

// The hero section ends at pb-[60px], then the search bar uses -mt-10 so it
// straddles the blue hero and the white grid section cleanly.
export default function FindAProPage() {
  return (
    <div className="bg-slate-50">
      <FindProHero />
      <FindProSearch />
      <FindProGrid />
    </div>
  );
}