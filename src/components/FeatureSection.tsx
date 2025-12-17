import { Shield, Zap, Heart, Globe } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Bank-Level Security",
    description: "Military-grade encryption ensures your offerings are protected with the highest security standards available.",
  },
  {
    icon: Zap,
    title: "Simple & Intuitive",
    description: "User-friendly interface designed for all generations with step-by-step guidance and instant processing.",
  },
  {
    icon: Heart,
    title: "Faith-Centered",
    description: "Designed with biblical principles to support your spiritual journey and strengthen your community.",
  },
  {
    icon: Globe,
    title: "Global Reach",
    description: "Connect with Adventist communities worldwide, supporting missions and ministries across continents.",
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-24 md:py-32 bg-background relative">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="max-w-2xl mx-auto text-center mb-16 md:mb-20">
          <span className="inline-block px-4 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-semibold mb-4">
            Features
          </span>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground mb-4">
            Why Choose <span className="italic text-gradient-gold">BlessPay?</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Experience the perfect blend of modern technology and spiritual commitment.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative p-8 rounded-2xl bg-card border border-border/60 shadow-soft hover:shadow-elevated transition-all duration-500 hover:-translate-y-1"
            >
              {/* Icon */}
              <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center mb-6 group-hover:bg-accent/20 transition-colors duration-300">
                <feature.icon className="w-7 h-7 text-accent" />
              </div>

              {/* Content */}
              <h3 className="font-serif text-xl font-semibold text-foreground mb-3">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>

              {/* Hover accent */}
              <div className="absolute bottom-0 left-8 right-8 h-0.5 bg-gradient-to-r from-transparent via-accent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;