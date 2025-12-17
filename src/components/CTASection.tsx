import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

const CTASection = () => {
  return (
    <section id="about" className="py-24 md:py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-navy" />
      
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-gold-light/10 rounded-full blur-3xl" />
      </div>

      <div className="container relative mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cream/10 border border-cream/20 mb-8">
            <Sparkles className="w-4 h-4 text-gold-light" />
            <span className="text-sm font-medium text-cream/80">
              Join Our Growing Community
            </span>
          </div>

          {/* Headline */}
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-semibold text-cream leading-tight mb-6">
            Ready to Transform{' '}
            <span className="italic text-gold-light">Your Giving?</span>
          </h2>

          {/* Description */}
          <p className="text-lg text-cream/70 max-w-xl mx-auto mb-10 leading-relaxed">
            Join thousands of faithful members who have made BlessPay their 
            trusted partner in spiritual giving and community support.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="xl" className="w-full sm:w-auto bg-accent text-accent-foreground font-semibold shadow-gold hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 group">
              Create Free Account
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button size="xl" className="w-full sm:w-auto bg-transparent border-2 border-cream/30 text-cream hover:bg-cream/10 transition-all duration-300">
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;