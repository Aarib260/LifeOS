"use client";

import { MotionConfig } from "framer-motion";
import { LandingNav } from "./LandingNav";
import { Hero } from "./Hero";
import { SocialStrip } from "./SocialStrip";
import { FeatureGrid } from "./FeatureGrid";
import { FAQ } from "./FAQ";
import { FinalCTA } from "./FinalCTA";
import { LandingFooter } from "./LandingFooter";

export function LandingPage() {
  return (
    // reducedMotion="user" makes every Framer Motion animate/initial/
    // whileInView prop on the page respect the OS-level "reduce motion"
    // setting automatically. It does NOT cover raw scroll-linked
    // useTransform values (FeatureGrid's scroll-scrub), which are gated
    // separately inside that component.
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen bg-[var(--landing-bg)]">
        <LandingNav />
        <Hero />
        <SocialStrip />
        <FeatureGrid />
        <FAQ />
        <FinalCTA />
        <LandingFooter />
      </div>
    </MotionConfig>
  );
}
