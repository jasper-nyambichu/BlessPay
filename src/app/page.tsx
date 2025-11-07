'use client';
import { motion } from 'framer-motion';
import { Shield, Zap, Heart, ArrowRight, Star, CheckCircle, Users, Church } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import Image from 'next/image';
import { useEffect } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';

export default function HomePage() {
  const { user } = useAuth();

  // Embla Carousel for partner logos
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 2000, stopOnInteraction: false })
  ]);

  useEffect(() => {
    if (emblaApi) {
      console.log('Embla carousel initialized');
    }
  }, [emblaApi]);

  // Partner logos data
  const partnerLogos = [
    { name: 'Adventist Health', image: '/images/partners/adventurer-removebg-preview.png' },
    { name: 'Adventist World Radio', image: '/images/partners/ay-removebg-preview.png' },
    { name: 'ADRA International', image: '/images/partners/christians-removebg-preview.png' },
    { name: 'LLU Health', image: '/images/partners/jasper-removebg-preview.png' },
    { name: 'Adventist Education', image: '/images/partners/themesda-removebg-preview.png' },
    { name: 'SDA Church', image: '/images/partners/sda-removebg-preview.png' },
  ];

  const features = [
    {
      icon: Shield,
      title: "Bank-Level Security",
      description: "Military-grade encryption ensures your offerings are protected with the highest security standards.",
      gradient: "from-blue-500 to-cyan-500",
      image: "/images/landing/SDA church in Wenchi honours 20 girls for staying chaste_ _Promoting good morals_.jpeg"
    },
    {
      icon: Zap,
      title: "Simple & Intuitive",
      description: "User-friendly interface designed for all generations with step-by-step guidance and instant processing.",
      gradient: "from-cyan-500 to-blue-500",
      image: "/images/landing/africa.jpeg"
    },
    {
      icon: Heart,
      title: "Faith-Centered",
      description: "Designed with biblical principles to support your spiritual journey and strengthen your community.",
      gradient: "from-indigo-500 to-purple-500",
      image: "/images/landing/hero-bg.jpg"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-indigo-100">
      {/* Modern Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-cyan-600/10 to-indigo-600/10"></div>
          <div className="absolute top-0 left-0 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute top-0 right-0 w-72 h-72 bg-cyan-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        <div className="container mx-auto max-w-6xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            {/* Logo/Brand */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mb-8 flex justify-center"
            >
              <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl flex items-center justify-center shadow-2xl">
                <Church className="w-10 h-10 text-white" />
              </div>
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-5xl md:text-7xl lg:text-8xl font-black text-gray-900 mb-6 leading-tight"
            >
              Transform Your{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-cyan-600 to-indigo-600">
                Spiritual Giving
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl md:text-2xl text-gray-700 mb-8 max-w-4xl mx-auto leading-relaxed font-medium"
            >
              Experience the future of faithful giving with our divine-inspired digital platform, 
              designed specifically for the global Seventh-day Adventist community.
            </motion.p>
            
            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
            >
              {user ? (
                <Link 
                  href="/dashboard"
                  className="group bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 shadow-2xl hover:shadow-3xl flex items-center gap-3 transform hover:-translate-y-1"
                >
                  Go to Dashboard
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              ) : (
                <>
                  <Link 
                    href="/signup"
                    className="group bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 shadow-2xl hover:shadow-3xl flex items-center gap-3 transform hover:-translate-y-1"
                  >
                    Start Giving Now
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link 
                    href="/login"
                    className="group glass-card border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-3 transform hover:-translate-y-1"
                  >
                    Sign In
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </>
              )}
            </motion.div>

            {/* Stats Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto glass-card rounded-2xl p-8 shadow-2xl border border-white/20"
            >
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-blue-600">10K+</div>
                <div className="text-gray-600 text-sm">Faithful Members</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-cyan-600">500+</div>
                <div className="text-gray-600 text-sm">Churches</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-indigo-600">$5M+</div>
                <div className="text-gray-600 text-sm">Offerings Processed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-amber-600">99.9%</div>
                <div className="text-gray-600 text-sm">Service Uptime</div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-6 h-10 border-2 border-blue-600 rounded-full flex justify-center"
          >
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1 h-3 bg-blue-600 rounded-full mt-2"
            />
          </motion.div>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 bg-gradient-to-b from-white to-blue-50">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Why Choose <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600">BlessPay</span>?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience the perfect blend of modern technology and spiritual commitment 
              with our comprehensive giving platform.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="group glass-card p-8 rounded-3xl shadow-2xl text-center hover:shadow-3xl transition-all duration-500 hover:-translate-y-2"
              >
                <div className="relative mb-6">
                  <div className="w-20 h-20 mx-auto rounded-2xl overflow-hidden shadow-lg mb-4">
                    <div className={`w-full h-full bg-gradient-to-r ${feature.gradient} flex items-center justify-center`}>
                      <feature.icon className="w-10 h-10 text-white" />
                    </div>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 text-lg leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Partner Carousel */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Trusted by Adventist Organizations Worldwide
            </h3>
            <p className="text-gray-600 mb-12 max-w-2xl mx-auto">
              Partnering with leading Seventh-day Adventist institutions to transform 
              digital giving across our global community.
            </p>

            <div className="embla overflow-hidden" ref={emblaRef}>
              <div className="embla__container flex">
                {partnerLogos.map((partner, index) => (
                  <div 
                    key={index} 
                    className="embla__slide flex-[0_0_25%] min-w-0 pl-4"
                  >
                    <div className="glass-card rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 h-32 flex items-center justify-center">
                      <div className="relative w-32 h-16">
                        <div className="w-full h-full flex items-center justify-center text-blue-600 font-bold text-lg">
                          {partner.name.split(' ')[0]}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 via-cyan-600 to-indigo-700 text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Transform Your Giving?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join thousands of faithful members who have made BlessPay their trusted 
              partner in spiritual giving and community support.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {user ? (
                <Link 
                  href="/dashboard"
                  className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 shadow-2xl hover:shadow-3xl flex items-center gap-3 transform hover:-translate-y-1"
                >
                  Continue to Dashboard
                  <ArrowRight className="w-5 h-5" />
                </Link>
              ) : (
                <>
                  <Link 
                    href="/signup"
                    className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 shadow-2xl hover:shadow-3xl flex items-center gap-3 transform hover:-translate-y-1"
                  >
                    Create Free Account
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                  <Link 
                    href="/about"
                    className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:-translate-y-1"
                  >
                    Learn More
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}