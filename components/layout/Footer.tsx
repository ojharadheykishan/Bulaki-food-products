import Link from 'next/link';
import { Package, Truck, Shield, Clock } from 'lucide-react';

const trustBadges = [
  { icon: Package, label: 'Quality Assured', description: '100% genuine products' },
  { icon: Truck, label: 'Fast Shipping', description: 'Delivery in 2-3 days' },
  { icon: Shield, label: 'Secure Payment', description: '100% secure checkout' },
  { icon: Clock, label: 'Fresh Products', description: 'Quality guaranteed' },
];

const categories = [
  { name: 'Food', image: '🍚', href: '/products?category=Food' },
  { name: 'Spices', image: '🌶️', href: '/products?category=Spices' },
  { name: 'Snacks', image: '🍿', href: '/products?category=Snacks' },
  { name: 'General Products', image: '📦', href: '/products?category=General+Product' },
];

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">B</span>
              </div>
              <span className="text-xl font-bold text-white">Bulaki</span>
            </div>
            <p className="text-sm text-gray-400">
              Your one-stop shop for fresh food and quality products. Delivering happiness to your doorstep.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Shop</h3>
            <ul className="space-y-2">
              <li><Link href="/products?category=Food" className="text-sm hover:text-white transition-colors">Food Items</Link></li>
              <li><Link href="/products?category=Spices" className="text-sm hover:text-white transition-colors">Spices</Link></li>
              <li><Link href="/products?category=Snacks" className="text-sm hover:text-white transition-colors">Snacks</Link></li>
              <li><Link href="/products?category=General+Product" className="text-sm hover:text-white transition-colors">General Products</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Customer Care</h3>
            <ul className="space-y-2">
              <li><Link href="#" className="text-sm hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link href="#" className="text-sm hover:text-white transition-colors">FAQs</Link></li>
              <li><Link href="#" className="text-sm hover:text-white transition-colors">Shipping Policy</Link></li>
              <li><Link href="#" className="text-sm hover:text-white transition-colors">Returns & Refunds</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Contact</h3>
            <p className="text-sm text-gray-400 mb-2">support@bulakifoods.com</p>
            <p className="text-sm text-gray-400">+91 98765 43210</p>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-400">© {new Date().getFullYear()} Bulaki Food and Product. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
