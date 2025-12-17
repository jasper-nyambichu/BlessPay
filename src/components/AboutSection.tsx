// components/AboutSection.tsx
"use client";

import { motion } from "framer-motion";
import { Users, Globe, HeartHandshake } from "lucide-react";

const AboutSection = () => {
  return (
    <section className="py-20 md:py-32 bg-gradient-warm">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-6"
          >
            Our Divine Mission
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto"
          >
            Born from a vision to revolutionize spiritual giving, BlessPay connects 
            the global Seventh-day Adventist community through technology and faith.
          </motion.p>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Users className="w-8 h-8" />,
                title: "Community First",
                description: "Built for and by the Adventist community, ensuring every feature serves our unique needs."
              },
              {
                icon: <Globe className="w-8 h-8" />,
                title: "Global Reach",
                description: "Connecting churches and members worldwide with secure, seamless giving solutions."
              },
              {
                icon: <HeartHandshake className="w-8 h-8" />,
                title: "Faithful Stewardship",
                description: "We're committed to transparency and accountability in handling God's resources."
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-6 rounded-2xl bg-card border border-border/40 shadow-soft hover-lift"
              >
                <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center text-accent mb-4 mx-auto">
                  {item.icon}
                </div>
                <h3 className="font-serif text-xl font-semibold text-foreground mb-3">
                  {item.title}
                </h3>
                <p className="text-muted-foreground">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;