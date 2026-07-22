import { useCartStore } from '@/store/cartStore';
import Link from 'next/link';
import { ShoppingCart, Heart, User, Menu, Search } from 'lucide-react';

export default function Navbar() {
  const totalItems = useCartStore((state) => state.getTotalItems());

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">B</span>
              </div>
              <span className="text-xl font-bold text-gray-900 hidden sm:block">
                Bulaki
              </span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            <Link href="/products" className="text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors">
              Products
            </Link>
            <div className="relative group">
              <button className="text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors flex items-center gap-1">
                Categories <Menu className="w-4 h-4" />
              </button>
              <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <Link href="/products?category=Food" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-600">Food Items</Link>
                <Link href="/products?category=Spices" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-600">Spices</Link>
                <Link href="/products?category=Snacks" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-600">Snacks</Link>
                <Link href="/products?category=General Product" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-600">General Products</Link>
              </div>
            </div>
          </nav>

          <div className="flex-1 max-w-lg mx-4 hidden lg:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/wishlist" className="hidden sm:block text-gray-700 hover:text-primary-600 transition-colors">
              <Heart className="w-5 h-5" />
            </Link>
            <Link href="/cart" className="relative text-gray-700 hover:text-primary-600 transition-colors">
              <ShoppingCart className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-accent-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
            <Link href="/login" className="text-gray-700 hover:text-primary-600 transition-colors">
              <User className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
