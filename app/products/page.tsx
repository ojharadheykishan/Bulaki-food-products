'use client';

import { useEffect, useState, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Product, IVariant } from '@/types';
import ProductGrid from '@/components/shared/ProductGrid';
import { X, ChevronDown, SlidersHorizontal } from 'lucide-react';
import SiteHeader from '@/components/layout/SiteHeader';

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('newest');

  const category = searchParams.get('category');
  const search = searchParams.get('search');

  const [filterCategory, setFilterCategory] = useState(category || '');
  const [filterPriceRange, setFilterPriceRange] = useState<string>('');
  const [filterDietary, setFilterDietary] = useState<string>('');
  const [inStockOnly, setInStockOnly] = useState(false);

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (filterCategory) params.set('category', filterCategory);
        if (search) params.set('search', search);
        if (inStockOnly) params.set('stock', 'true');

        const sortValue = sortBy === 'price-asc' ? 'price' : sortBy === 'price-desc' ? '-price' : '-createdAt';
        params.set('sort', sortValue);

        const res = await fetch(`/api/products?${params.toString()}`);
        const data = await res.json();
        setProducts(data.products || []);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, [filterCategory, search, sortBy, inStockOnly]);

  const filteredProducts = useMemo(() => {
    let result = [...products];
    if (filterDietary === 'veg') {
      result = result.filter(p => p.isVeg);
    } else if (filterDietary === 'non-veg') {
      result = result.filter(p => !p.isVeg);
    }
    if (filterPriceRange) {
      const [min, max] = filterPriceRange.split('-').map(Number);
      result = result.filter(p => {
        const prices = p.variants.map(v => v.price);
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);
        return (max ? maxPrice <= max : minPrice >= min);
      });
    }
    if (inStockOnly) {
      result = result.filter(p => p.variants.some(v => v.stock > 0));
    }
    return result;
  }, [products, filterDietary, filterPriceRange, inStockOnly]);

  const clearFilters = () => {
    setFilterCategory('');
    setFilterDietary('');
    setFilterPriceRange('');
    setInStockOnly(false);
    router.push('/products');
  };

  return (
    <div className="min-h-screen bg-brand-ivory">
      <SiteHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-brand-maroon">
            {category || search || 'All Products'}
          </h1>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden btn-outline text-sm"
            >
              <SlidersHorizontal className="w-4 h-4" /> Filters
            </button>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-[#e6dfd3] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold/60"
            >
              <option value="newest">Newest</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        <div className="flex gap-8">
          <aside className={`w-64 shrink-0 ${showFilters ? 'block' : 'hidden'} md:block`}>
            <div className="card p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-brand-maroon">Filters</h2>
                <button onClick={clearFilters} className="text-xs text-brand-crimson hover:text-brand-maroon">
                  Clear All
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-[#e6dfd3] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold/60"
                >
                  <option value="">All Categories</option>
                  <option value="Bhujia">Bhujia</option>
                  <option value="Namkeen">Namkeen</option>
                  <option value="Sweets">Sweets</option>
                  <option value="Snacks">Snacks</option>
                  <option value="Spices">Spices</option>
                  <option value="Gifts">Gift Hampers</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                <select
                  value={filterPriceRange}
                  onChange={(e) => setFilterPriceRange(e.target.value)}
                  className="w-full px-3 py-2 border border-[#e6dfd3] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold/60"
                >
                  <option value="">All Prices</option>
                  <option value="0-100">Under ₹100</option>
                  <option value="100-500">₹100 - ₹500</option>
                  <option value="500-1000">₹500 - ₹1000</option>
                  <option value="1000-999999">Above ₹1000</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Dietary Preference</label>
                <select
                  value={filterDietary}
                  onChange={(e) => setFilterDietary(e.target.value)}
                  className="w-full px-3 py-2 border border-[#e6dfd3] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold/60"
                >
                  <option value="">All</option>
                  <option value="veg">Vegetarian</option>
                  <option value="non-veg">Non-Vegetarian</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="inStock"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="w-4 h-4 text-brand-crimson border-[#e6dfd3] rounded focus:ring-brand-gold/60"
                />
                <label htmlFor="inStock" className="text-sm text-gray-700">
                  In Stock Only
                </label>
              </div>
            </div>
          </aside>

          <div className="flex-1">
            <p className="text-sm text-brand-maroon/70 mb-4">
              Showing {filteredProducts.length} products
            </p>
            <ProductGrid products={filteredProducts} isLoading={loading} />
          </div>
        </div>
      </div>
    </div>
  );
}
