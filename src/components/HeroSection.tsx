"use client";
import { Button } from "@/components/ui/button";
import { ArrowRight, Church } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden bg-gradient-warm">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
        {/* Subtle grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(hsl(var(--primary)) 1px, transparent 1px),
                              linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }}
        />
      </div>

      <div className="container relative mx-auto px-6 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border/60 shadow-soft mb-8 animate-fade-up animation-delay-100">
            <Church className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium text-muted-foreground">
              Trusted by 500+ Adventist Churches
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-semibold leading-[1.1] tracking-tight text-foreground mb-6 animate-fade-up animation-delay-200">
            Transform Your{' '}
            <span className="text-gradient-gold italic">
              Spiritual Giving
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-up animation-delay-300">
            Experience the future of faithful giving with our divine-inspired digital platform, 
            designed specifically for the global Seventh-day Adventist community.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-fade-up animation-delay-400">
            <Button variant="gold" size="xl" className="w-full sm:w-auto group">
              Start Giving Now
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button variant="navy-outline" size="xl" className="w-full sm:w-auto">
              Sign In
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 max-w-3xl mx-auto animate-fade-up animation-delay-500">
            {[
              { value: '10K+', label: 'Faithful Members' },
              { value: '500+', label: 'Churches' },
              { value: '$5M+', label: 'Offerings Processed' },
              { value: '99.9%', label: 'Service Uptime' },
            ].map((stat, index) => (
              <div key={index} className="text-center p-4 rounded-xl bg-card/50 backdrop-blur-sm border border-border/40 hover-lift">
                <div className="font-serif text-2xl md:text-3xl font-bold text-gradient-gold mb-1">
                  {stat.value}
                </div>
                <div className="text-xs md:text-sm text-muted-foreground font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default HeroSection;