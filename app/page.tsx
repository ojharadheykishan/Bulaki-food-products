'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Zap, Truck, Shield, Award, ChevronRight, Star } from 'lucide-react';
import { Product } from '@/types';
import ProductGrid from '@/components/shared/ProductGrid';

const categories = [
  { name: 'Bhujia & Namkeen', image: '🥨', href: '/products?category=Bhujia', color: 'bg-amber-50 border-amber-200' },
  { name: 'Sweets', image: '🍬', href: '/products?category=Sweets', color: 'bg-pink-50 border-pink-200' },
  { name: 'Bikaneri Snacks', image: '🧆', href: '/products?category=Snacks', color: 'bg-orange-50 border-orange-200' },
  { name: 'Spices', image: '🌶️', href: '/products?category=Spices', color: 'bg-red-50 border-red-200' },
  { name: 'Gift Hampers', image: '🎁', href: '/products?category=Gifts', color: 'bg-yellow-50 border-yellow-200' },
];

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch('/api/products?limit=8');
        const data = await res.json();
        setFeaturedProducts(data.products || []);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  const trustBadges = [
    { icon: Shield, title: 'Authentic Bikaner Taste', desc: 'Since generations' },
    { icon: Award, title: '100% Freshness Guaranteed', desc: 'Hygienically packed' },
    { icon: Truck, title: 'Express Delivery', desc: 'All over India' },
  ];

  return (
    <div>
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-crimson via-brand-maroon to-[#450909] text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, #D4AF37 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 relative z-10">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 bg-brand-gold/10 border border-brand-gold/30 text-brand-goldLight px-3 py-1.5 rounded-full text-xs font-semibold mb-6">
                <span className="w-1.5 h-1.5 bg-brand-goldLight rounded-full" />
                Authentic Bikaneri Snacks
              </motion.div>
              <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="text-4xl lg:text-6xl font-bold leading-tight">
                <span className="gold-text">Bulaki</span> Food & Product
              </motion.h1>
              <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mt-5 text-base lg:text-lg text-red-100 max-w-xl leading-relaxed">
                Taste of tradition. Handcrafted Bhujia, traditional sweets, and namkeen prepared with the finest ingredients and age-old Bikaneri recipes.
              </motion.p>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="mt-8 flex flex-wrap gap-4">
                <Link href="/products" className="btn-accent text-base">
                  Shop Now
                </Link>
                <Link href="/track-order" className="btn-outline border-white text-white hover:bg-white hover:text-brand-maroon">
                  Track Order
                </Link>
              </motion.div>

              <div className="mt-10 flex flex-wrap gap-6">
                {trustBadges.map((badge) => (
                  <div key={badge.title} className="flex items-start gap-3">
                    <div className="p-2 rounded-full bg-brand-gold/10 border border-brand-gold/20 text-brand-goldLight">
                      <badge.icon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{badge.title}</p>
                      <p className="text-xs text-red-200">{badge.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="hidden lg:block relative">
              <div className="relative aspect-square max-w-md mx-auto">
                <div className="absolute inset-0 bg-brand-gold/20 rounded-full blur-3xl" />
                <div className="relative bg-white/5 border border-brand-gold/20 rounded-3xl p-8 backdrop-blur-sm">
                  <div className="text-center">
                    <p className="text-6xl mb-4">🍬</p>
                    <p className="text-brand-goldLight font-bold text-xl">Bikaneri Specialties</p>
                    <p className="text-red-200 text-sm mt-2">Premium quality since decades</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-gold/60 to-transparent" />
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-6">
          {categories.map((category, index) => (
            <Link key={category.name} href={category.href}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                className={`card text-center p-5 lg:p-6 border-2 ${category.color} hover:shadow-md transition-all duration-200`}
              >
                <div className="text-4xl mb-3">{category.image}</div>
                <h3 className="text-sm font-bold text-brand-maroon">{category.name}</h3>
              </motion.div>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-brand-ivory border-y border-[#e6dfd3] py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-brand-maroon">
              Our <span className="gold-text">Bestsellers</span>
            </h2>
            <p className="mt-3 text-brand-maroon/70 max-w-2xl mx-auto">
              Handpicked favorites loved by thousands. Fresh, authentic, and delivered with care.
            </p>
          </motion.div>

          <ProductGrid products={featuredProducts} isLoading={loading} />

          <div className="text-center mt-10">
            <Link href="/products" className="btn-accent">
              View All Products <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-brand-maroon">Our Promise</h2>
          <p className="mt-3 text-brand-maroon/70 max-w-2xl mx-auto">We bring the authentic taste of Bikaner to your doorstep with purity and quality you can trust.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: Shield, title: '100% Pure & Fresh', description: 'Only the finest ingredients, no compromises on quality.' },
            { icon: Award, title: 'Traditional Recipes', description: 'Age-old Bikaneri recipes passed down through generations.' },
            { icon: Truck, title: 'Pan-India Delivery', description: 'Fast and secure shipping across India with live tracking.' },
          ].map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="card p-8 text-center border-2 border-[#e6dfd3] hover:border-brand-gold/60 transition-colors"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 bg-brand-crimson/5 text-brand-maroon rounded-xl mb-4 border border-brand-gold/30">
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-brand-maroon mb-2">{feature.title}</h3>
              <p className="text-brand-maroon/70 text-sm leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <footer className="bg-brand-maroon text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-brand-gold rounded-lg flex items-center justify-center">
                  <span className="text-brand-maroon font-bold text-lg">B</span>
                </div>
                <span className="text-xl font-bold">Bulaki Food</span>
              </div>
              <p className="text-red-200 text-sm leading-relaxed">Authentic Bikaneri bhujia, namkeen, sweets, and spices delivered right to your doorstep.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-brand-goldLight">Quick Links</h3>
              <ul className="space-y-2 text-sm text-red-100">
                <li><Link href="/products?category=Bhujia" className="hover:text-brand-goldLight">Bhujia & Namkeen</Link></li>
                <li><Link href="/products?category=Sweets" className="hover:text-brand-goldLight">Traditional Sweets</Link></li>
                <li><Link href="/products?category=Spices" className="hover:text-brand-goldLight">Spices & Grocery</Link></li>
                <li><Link href="/track-order" className="hover:text-brand-goldLight">Track Order</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-brand-goldLight">Contact Us</h3>
              <p className="text-sm text-red-100 mb-1">support@bulakifoods.com</p>
              <p className="text-sm text-red-100">+91 98765 43210</p>
            </div>
          </div>
          <div className="border-t border-white/10 mt-8 pt-6 text-center text-xs text-red-200">
            © {new Date().getFullYear()} Bulaki Food and Product. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
