'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, User, Heart, Truck, Menu, X, ShoppingCart } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const categories = [
  { name: 'Bhujia & Namkeen', href: '/products?category=Bhujia' },
  { name: 'Traditional Sweets', href: '/products?category=Sweets' },
  { name: 'Bikaneri Snacks', href: '/products?category=Snacks' },
  { name: 'Spices & Grocery', href: '/products?category=Spices' },
  { name: 'Gift Hampers', href: '/products?category=Gifts' },
];

export default function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { data: session } = useSession();
  const router = useRouter();
  const cartCount = 0;

  return (
    <header className="sticky top-0 z-50 bg-brand-ivory/95 backdrop-blur border-b border-[#e6dfd3]">
      <div className="brand-gradient text-white text-xs py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center gap-2">
          <span>🚩</span>
          <p className="font-medium tracking-wide text-center">
            Authentic Bikaneri Bhujia & Sweets Delivered Fresh Across India | Free Shipping on Orders Above ₹499
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-brand-gold flex items-center justify-center border-2 border-brand-goldLight">
              <span className="text-brand-maroon font-bold text-lg">B</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold text-brand-maroon leading-tight">Bulaki Food</h1>
              <p className="text-[10px] text-brand-crimson uppercase tracking-widest font-semibold">Taste of Tradition</p>
            </div>
          </Link>

          <div className="hidden md:flex flex-1 max-w-2xl mx-8">
            <div className="relative w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-maroon/50" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for Bhujia, Rasgulla, Namkeen, Spices..."
                className="w-full pl-12 pr-4 py-2.5 bg-white border border-[#e6dfd3] rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold/60 focus:border-brand-gold shadow-sm"
              />
            </div>
          </div>

          <div className="flex items-center gap-5">
            <Link href="/wishlist" className="hidden sm:flex text-brand-maroon hover:text-brand-crimson transition-colors">
              <Heart className="w-5 h-5" />
            </Link>
            <Link href="/track-order" className="hidden sm:flex text-brand-maroon hover:text-brand-crimson transition-colors">
              <Truck className="w-5 h-5" />
            </Link>
            {session ? (
              <div className="hidden sm:flex items-center gap-4">
                <Link href="/admin" className="text-sm font-medium text-brand-maroon hover:text-brand-crimson">
                  Admin
                </Link>
                <button onClick={() => signOut()} className="text-sm font-medium text-red-700 hover:text-red-800">
                  Logout
                </button>
              </div>
            ) : (
              <Link href="/login" className="hidden sm:flex text-brand-maroon hover:text-brand-crimson transition-colors">
                <User className="w-5 h-5" />
              </Link>
            )}
            <Link href="/cart" className="relative text-brand-maroon hover:text-brand-crimson transition-colors">
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-brand-gold text-brand-maroon text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center border border-brand-goldLight">
                  {cartCount}
                </span>
              )}
            </Link>
            <button className="md:hidden p-2 text-brand-maroon" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      <nav className="hidden md:block border-t border-[#e6dfd3] bg-white/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-8 h-12">
            {categories.map((cat) => (
              <Link
                key={cat.name}
                href={cat.href}
                className="text-sm font-medium text-brand-maroon/80 hover:text-brand-crimson transition-colors whitespace-nowrap"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {mobileOpen && (
        <div className="md:hidden border-t border-[#e6dfd3] bg-brand-ivory">
          <div className="px-4 py-4 space-y-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-maroon/50" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="w-full pl-12 pr-4 py-2.5 bg-white border border-[#e6dfd3] rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold/60"
              />
            </div>
            {categories.map((cat) => (
              <Link
                key={cat.name}
                href={cat.href}
                className="block text-sm font-medium text-brand-maroon"
                onClick={() => setMobileOpen(false)}
              >
                {cat.name}
              </Link>
            ))}
            <Link href="/track-order" className="block text-sm font-medium text-brand-maroon">Track Order</Link>
            {session ? (
              <>
                <Link href="/admin" className="block text-sm font-medium text-brand-crimson">Admin</Link>
                <button onClick={() => signOut()} className="text-sm font-medium text-red-700">Logout</button>
              </>
            ) : (
              <Link href="/login" className="block text-sm font-medium text-brand-crimson">Login</Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
