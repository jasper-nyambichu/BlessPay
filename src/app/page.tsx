'use client';
import { useEffect, useRef } from 'react';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import TrustedPartners from '@/components/TrustSection';
import FeaturesSection from '@/components/FeatureSection';
import CTASection from '@/components/CTASection';
import Footer from '@/components/Footer';
import AboutSection from '@/components/AboutSection'; // Create this or use existing

export default function HomePage() {
  // Create refs for sections
  const featuresRef = useRef<HTMLElement>(null);
  const aboutRef = useRef<HTMLElement>(null);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <HeroSection />
        <section id="features" ref={featuresRef}>
          <FeaturesSection />
        </section>
        <TrustedPartners />
        <section id="about" ref={aboutRef}>
          <AboutSection />
        </section>
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}