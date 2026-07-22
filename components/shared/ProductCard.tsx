'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Product, IVariant } from '@/types';
import { useCartStore } from '@/store/cartStore';
import { ShoppingCart, Star, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [selectedWeight, setSelectedWeight] = useState(product.variants[0]?.weight || '');
  const addItem = useCartStore((state) => state.addItem);

  const selectedVariant = product.variants.find((v) => v.weight === selectedWeight) || product.variants[0];
  const discountPercentage = selectedVariant?.mrp
    ? Math.round(((selectedVariant.mrp - selectedVariant.price) / selectedVariant.mrp) * 100)
    : 0;

  const handleAddToCart = () => {
    if (!selectedVariant || selectedVariant.stock <= 0) return;
    addItem(product, selectedVariant, 1);
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="card group relative"
    >
      <Link href={`/products/${product.slug || product._id}`}>
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          <Image
            src={product.images[0] || '/placeholder.svg'}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {discountPercentage > 0 && (
            <div className="absolute top-2 left-2 bg-brand-crimson text-white text-xs font-bold px-2 py-1 rounded">
              -{discountPercentage}%
            </div>
          )}
          {product.variants[0]?.stock === 0 && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-white font-semibold">Out of Stock</span>
            </div>
          )}
          <div
            className="absolute top-2 right-2 w-5 h-5 rounded-full border-2 border-white/80 shadow-sm"
            title={product.isVeg ? 'Veg' : 'Non-Veg'}
          >
            <div className={`w-full h-full rounded-full ${product.isVeg ? 'bg-green-600' : 'bg-red-600'}`} />
          </div>
        </div>

        <div className="p-4">
          <p className="text-[10px] font-bold text-brand-crimson uppercase tracking-wider">Authentic Bikaner Taste</p>
          <h3 className="mt-1.5 text-sm font-semibold text-gray-900 line-clamp-2 group-hover:text-brand-crimson transition-colors">
            {product.name}
          </h3>

          <div className="mt-2 flex items-center gap-1">
            <Star className="w-3.5 h-3.5 fill-brand-gold text-brand-gold" />
            <span className="text-xs font-medium text-gray-700">{product.ratings.toFixed(1)}</span>
            <span className="text-xs text-gray-400">({product.reviewCount})</span>
          </div>

          <div className="mt-3">
            <select
              value={selectedWeight}
              onChange={(e) => setSelectedWeight(e.target.value)}
              onClick={(e) => e.preventDefault()}
              className="w-full text-xs border border-[#e6dfd3] rounded-md px-2 py-1.5 bg-white text-brand-maroon font-medium focus:outline-none focus:ring-2 focus:ring-brand-gold/60"
            >
              {product.variants.map((variant) => (
                <option key={variant.weight} value={variant.weight}>
                  {variant.weight} - ₹{variant.price}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-2 flex items-center justify-between">
            <div>
              <span className="text-lg font-bold text-brand-maroon">₹{selectedVariant?.price}</span>
              {selectedVariant?.mrp && selectedVariant.mrp > selectedVariant.price && (
                <span className="ml-2 text-xs text-gray-400 line-through">₹{selectedVariant.mrp}</span>
              )}
            </div>
          </div>

          {selectedVariant && selectedVariant.stock > 0 && selectedVariant.stock <= 5 && (
            <p className="mt-1 text-[11px] text-red-700 font-medium">Only {selectedVariant.stock} left!</p>
          )}
        </div>
      </Link>

      <button
        onClick={(e) => {
          e.preventDefault();
          handleAddToCart();
        }}
        disabled={!selectedVariant || selectedVariant.stock === 0}
        className="absolute bottom-3 right-3 bg-brand-crimson text-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-brand-maroon disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        <ShoppingCart className="w-4 h-4" />
      </button>
    </motion.div>
  );
}
