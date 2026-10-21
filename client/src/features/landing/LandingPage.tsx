import React, { useState } from 'react';
import { CoverNavbar } from './components/CoverNavbar.js';
import { HeroSection } from './components/HeroSection.js';
import { FloatingHubPanels } from './components/FloatingHubPanels.js';
import { NetworkStatusPanel } from './components/NetworkStatusPanel.js';
import { LiveTelemetryTicker } from './components/LiveTelemetryTicker.js';
import { PlatformPillarsSection } from './components/PlatformPillarsSection.js';
import { InteractiveShowcaseSection } from './components/InteractiveShowcaseSection.js';
import { ResilienceWorkflowSection } from './components/ResilienceWorkflowSection.js';
import { EnterpriseRoiSection } from './components/EnterpriseRoiSection.js';
import { LandingCtaBanner } from './components/LandingCtaBanner.js';
import { LandingFooter } from './components/LandingFooter.js';
import { SystemActionTourModal } from './components/SystemActionTourModal.js';
import { SpotlightSearchModal } from './components/SpotlightSearchModal.js';

export const LandingPage: React.FC = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isTourOpen, setIsTourOpen] = useState(false);

  return (
    <div className="relative min-h-screen w-full bg-[#060814] text-white overflow-x-hidden font-sans selection:bg-cyan-500 selection:text-black">
      {/* ========================================================================= */}
      {/* 1. TOP GLASS NAVIGATION BAR                                               */}
      {/* ========================================================================= */}
      <CoverNavbar
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenTour={() => setIsTourOpen(true)}
      />

      {/* ========================================================================= */}
      {/* 2. CINEMATIC HERO SECTION                                                 */}
      {/* ========================================================================= */}
      <section className="relative w-full min-h-[90vh] lg:min-h-screen flex flex-col justify-center">
        {/* The Exact Text-Free Base Image */}
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat pointer-events-none"
          style={{
            backgroundImage: `url('/hero-bg.jpg')`,
            backgroundPosition: 'center 35%',
          }}
        />

        {/* Atmospheric Gradient Overlays for Readability & Depth */}
        {/* Left readable vignette (softened so artwork shines through without flat blank black) */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#060814]/80 via-[#060814]/45 to-transparent pointer-events-none w-full lg:w-[65%]" />

        {/* Global perimeter vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(6,8,20,0.85)_100%)] pointer-events-none" />

        {/* Ambient atmospheric glows */}
        <div className="absolute -top-32 left-1/4 w-[500px] h-[500px] bg-cyan-500/10 blur-[150px] pointer-events-none rounded-full" />
        <div className="absolute top-1/3 right-10 w-[450px] h-[450px] bg-purple-600/10 blur-[160px] pointer-events-none rounded-full" />

        {/* Bottom dark blend gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#060814] to-transparent pointer-events-none" />

        {/* Hero Grid Container */}
        <div className="relative z-20 max-w-[1440px] mx-auto w-full px-4 sm:px-8 lg:px-12 pt-28 lg:pt-32 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative">
            {/* Left Column: Hero Text, Headlines, Supporting Paragraph & Action Buttons */}
            <div className="lg:col-span-8 xl:col-span-7">
              <HeroSection onOpenTour={() => setIsTourOpen(true)} />
            </div>

            {/* Right Column: Live Network Status & Weather Alert Cards */}
            <div className="lg:col-span-4 xl:col-span-5 flex justify-end">
              <NetworkStatusPanel />
            </div>

            {/* Floating Information Panels A–F (Desktop scenic coordinates & Mobile carousel) */}
            <FloatingHubPanels />
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. LIVE GLOBAL OPERATIONS TELEMETRY TICKER                                */}
      {/* ========================================================================= */}
      <LiveTelemetryTicker />

      {/* ========================================================================= */}
      {/* 4. CORE PLATFORM PILLARS (5 Capabilities in Rich Deep Dive)               */}
      {/* ========================================================================= */}
      <PlatformPillarsSection />

      {/* ========================================================================= */}
      {/* 5. INTERACTIVE LIVE OPERATIONS SHOWCASE                                    */}
      {/* ========================================================================= */}
      <InteractiveShowcaseSection />

      {/* ========================================================================= */}
      {/* 6. RESILIENCE MULTI-AGENT WORKFLOW ARCHITECTURE                           */}
      {/* ========================================================================= */}
      <ResilienceWorkflowSection />

      {/* ========================================================================= */}
      {/* 7. ENTERPRISE ROI & OPERATIONAL PROOF                                     */}
      {/* ========================================================================= */}
      <EnterpriseRoiSection />

      {/* ========================================================================= */}
      {/* 8. HIGH-CONVERTING CTA BANNER                                             */}
      {/* ========================================================================= */}
      <LandingCtaBanner />

      {/* ========================================================================= */}
      {/* 9. COMPLETE MODERN ENTERPRISE FOOTER                                      */}
      {/* ========================================================================= */}
      <LandingFooter />

      {/* ========================================================================= */}
      {/* 10. INTERACTIVE MODALS                                                    */}
      {/* ========================================================================= */}
      {/* Guided System Tour Modal */}
      <SystemActionTourModal
        isOpen={isTourOpen}
        onClose={() => setIsTourOpen(false)}
      />

      {/* Quick Network Entity Spotlight Search Modal */}
      <SpotlightSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </div>
  );
};
