// src/app/page.tsx
'use client';
import { motion } from 'framer-motion';
import { Shield, Zap, Heart, ArrowRight } from 'lucide-react';
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100">
      {/* Hero Section with Background Image */}
      <section 
        className="relative py-32 px-4 overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.26), rgba(255, 255, 255, 0.25)), url('/images/landing/dickson.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-1000"></div>
        </div>

        <div className="container mx-auto max-w-6xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            
            {/* <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mb-8"
            >
              <Image
                src="/images/landing/hero-bg.jpg"
                alt="BlessPay Logo"
                width={200}
                height={80}
                className="mx-auto mb-6 rounded-lg shadow-lg"
                priority
              />
            </motion.div> */}

            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Welcome to{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                BlessPay
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-3xl mx-auto leading-relaxed font-medium">
              Transform your spiritual giving with our faith-inspired digital offering system 
              designed for the Seventh-day Adventist community worldwide.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              {user ? (
                <Link 
                  href="/dashboard"
                  className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 shadow-2xl hover:shadow-3xl flex items-center gap-3"
                >
                  Go to Dashboard
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              ) : (
                <>
                  <Link 
                    href="/signup"
                    className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 shadow-2xl hover:shadow-3xl flex items-center gap-3"
                  >
                    Start Giving Now
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link 
                    href="/login"
                    className="group border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-3"
                  >
                    Sign In
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </>
              )}
            </div>

            {/* Stats Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20"
            >
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-blue-600">10K+</div>
                <div className="text-gray-600 text-sm">Faithful Members</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-green-600">500+</div>
                <div className="text-gray-600 text-sm">Churches</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-purple-600">$5M+</div>
                <div className="text-gray-600 text-sm">Offerings Processed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-orange-600">99.9%</div>
                <div className="text-gray-600 text-sm">Service Uptime</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid with Images */}
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
              Why Choose BlessPay?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience the perfect blend of modern technology and spiritual commitment 
              with our comprehensive giving platform.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20"
          >
            {/* Secure Feature Card */}
            <div className="group bg-white p-8 rounded-3xl shadow-2xl border border-blue-100 text-center hover:shadow-3xl transition-all duration-500 hover:-translate-y-2">
              <div className="relative mb-6">
                <div className="w-32 h-32 mx-auto rounded-2xl overflow-hidden shadow-lg">
                  <Image
                    src="/images/landing/SDA church in Wenchi honours 20 girls for staying chaste_ _Promoting good morals_.jpeg"
                    alt="Secure Payment Processing"
                    width={128}
                    height={128}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="absolute -top-2 -right-2 bg-blue-600 text-white p-3 rounded-full shadow-lg">
                  <Shield className="w-6 h-6" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Bank-Level Security</h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                Military-grade encryption and secure payment processing ensure your 
                offerings are protected with the highest security standards.
              </p>
            </div>

            {/* Simple Feature Card */}
            <div className="group bg-white p-8 rounded-3xl shadow-2xl border border-green-100 text-center hover:shadow-3xl transition-all duration-500 hover:-translate-y-2">
              <div className="relative mb-6">
                <div className="w-32 h-32 mx-auto rounded-2xl overflow-hidden shadow-lg">
                  <Image
                    src="/images/landing/africa.jpeg"
                    alt="Easy to Use Interface"
                    width={128}
                    height={128}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="absolute -top-2 -right-2 bg-green-600 text-white p-3 rounded-full shadow-lg">
                  <Zap className="w-6 h-6" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Simple & Intuitive</h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                User-friendly interface designed for all generations with step-by-step 
                guidance and instant payment processing.
              </p>
            </div>

            {/* Spiritual Feature Card */}
            <div className="group bg-white p-8 rounded-3xl shadow-2xl border border-purple-100 text-center hover:shadow-3xl transition-all duration-500 hover:-translate-y-2">
              <div className="relative mb-6">
                <div className="w-32 h-32 mx-auto rounded-2xl overflow-hidden shadow-lg">
                  <Image
                    src="/images/landing/hero-bg.jpg"
                    alt="Spiritual Growth"
                    width={128}
                    height={128}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="absolute -top-2 -right-2 bg-purple-600 text-white p-3 rounded-full shadow-lg">
                  <Heart className="w-6 h-6" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Faith-Centered</h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                Designed with biblical principles to support your spiritual journey 
                and strengthen your church community through faithful giving.
              </p>
            </div>
          </motion.div>

          {/* Partner Carousel Section */}
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

            {/* Embla Carousel */}
            <div className="embla overflow-hidden" ref={emblaRef}>
              <div className="embla__container flex">
                {partnerLogos.map((partner, index) => (
                  <div 
                    key={index} 
                    className="embla__slide flex-[0_0_25%] min-w-0 pl-4"
                  >
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 h-32 flex items-center justify-center">
                      <div className="relative w-32 h-16">
                        <Image
                          src={partner.image}
                          alt={partner.name}
                          fill
                          className="object-contain filter  transition-all duration-300"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-purple-700 text-white">
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
                  className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 shadow-2xl hover:shadow-3xl flex items-center gap-3"
                >
                  Continue to Dashboard
                  <ArrowRight className="w-5 h-5" />
                </Link>
              ) : (
                <>
                  <Link 
                    href="/signup"
                    className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 shadow-2xl hover:shadow-3xl flex items-center gap-3"
                  >
                    Create Free Account
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                  <Link 
                    href="/about"
                    className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300"
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