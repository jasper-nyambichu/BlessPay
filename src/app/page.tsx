'use client';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import TrustedPartners from '@/components/TrustSection';
import FeaturesSection from '@/components/FeatureSection';
import CTASection from '@/components/CTASection';
import Footer from '@/components/Footer';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <HeroSection />
        <TrustedPartners />
        <FeaturesSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}