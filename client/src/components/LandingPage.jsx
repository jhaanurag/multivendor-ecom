/**
 * Landing Page Component
 * Refactored for maximum performance via modular components, lazy loading, and code-splitting.
 */

import { memo, lazy, Suspense } from "react";
import StripeGradientBackground from "./StripeGradientBackground";
import Hero from "./sections/Hero";
import Marquee from "./sections/Marquee";
import ScaleThrive from "./sections/ScaleThrive";
import MovedText from "./sections/MovedText";
import JoinSection from "./sections/JoinSection";
import LazySection from "./sections/LazySection";

// Lazy load heavy components for code-splitting
const BentoGrid = lazy(() => import("./sections/BentoGrid"));
const Stats = lazy(() => import("./sections/Stats"));

const LandingPage = memo(({ isPreloaderFinished }) => {
  return (
    <div className="landing-page" style={{ overflow: "hidden" }}>
      {/* BACKGROUND: Premium Shader (Global) */}
      <StripeGradientBackground
        intensity={0.4}
        speed={0.15}
        overlayOpacity={0.1}
        blur={true}
      />

      {/* 1. HERO SECTION (Critical) */}
      <Hero isPreloaderFinished={isPreloaderFinished} />

      {/* 2. SCALE / THRIVE (Contextual) */}
      <ScaleThrive />

      {/* 3. MOVED TEXT (Interaction) */}
      <MovedText />

      {/* 4. MARQUEE (Visual) */}
      <Marquee />

      {/* 5. BENTO FEATURES GRID (Heavy - Code Split + Lazy Shared) */}
      <Suspense fallback={<div style={{ height: "50vh" }} />}>
        <LazySection>
          <BentoGrid />
        </LazySection>
      </Suspense>

      {/* 6. STATS SECTION (Heavy - Code Split + Lazy) */}
      <Suspense fallback={<div style={{ height: "40vh" }} />}>
        <LazySection>
          <Stats />
        </LazySection>
      </Suspense>

      {/* 7. JOIN SELLERS SECTION (CTA) */}
      <JoinSection />

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
});

LandingPage.displayName = "LandingPage";
export default LandingPage;
