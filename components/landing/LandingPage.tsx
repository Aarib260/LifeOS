import { LandingNav } from "./LandingNav";
import { Hero } from "./Hero";
import { FeatureGrid } from "./FeatureGrid";
import { FinalCTA } from "./FinalCTA";
import { LandingFooter } from "./LandingFooter";

export function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0A0E14]">
      <LandingNav />
      <Hero />
      <FeatureGrid />
      <FinalCTA />
      <LandingFooter />
    </div>
  );
}