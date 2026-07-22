'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Product } from '@/types';
import ImageGallery from '@/components/shared/ImageGallery';
import { useCartStore } from '@/store/cartStore';
import { Star, Minus, Plus, ShoppingCart, Check, Info } from 'lucide-react';
import SiteHeader from '@/components/layout/SiteHeader';
import { Button } from '@/components/ui/Button';
import toast from 'react-hot-toast';

export default function ProductDetailsPage() {
  const params = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'description' | 'ingredients' | 'reviews'>('description');

  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`/api/products/${params.id}`);
        if (res.ok) {
          const data = await res.json();
          setProduct(data);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [params.id]);

  const handleAddToCart = () => {
    if (product && product.stock > 0) {
      addItem(product, quantity);
      toast.success('Added to cart!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <SiteHeader />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="aspect-square bg-gray-200 rounded-2xl" />
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 rounded w-3/4" />
                <div className="h-6 bg-gray-200 rounded w-1/4" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <SiteHeader />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Product not found</h1>
        </div>
      </div>
    );
  }

  const discountPercentage = product.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <SiteHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <ImageGallery images={product.images} productName={product.name} />
          </div>

          <div>
            <span className="text-sm font-medium text-primary-600 bg-primary-50 px-3 py-1 rounded-full">
              {product.category}
            </span>

            <h1 className="mt-4 text-3xl lg:text-4xl font-bold text-gray-900">
              {product.name}
            </h1>

            <div className="mt-4 flex items-center gap-2">
              <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              <span className="font-medium text-gray-900">{product.ratings.toFixed(1)}</span>
              <span className="text-gray-400">({product.reviewCount} reviews)</span>
            </div>

            <div className="mt-6 flex items-baseline gap-3">
              <span className="text-4xl font-bold text-gray-900">
                ₹{product.discountPrice || product.price}
              </span>
              {product.discountPrice && (
                <>
                  <span className="text-xl text-gray-400 line-through">₹{product.price}</span>
                  <span className="text-green-600 font-medium">-{discountPercentage}%</span>
                </>
              )}
            </div>

            <div className="mt-6 flex items-center gap-4">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${
                product.stock > 0 ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
              }`}>
                {product.stock > 0 ? (
                  product.stock <= 5 ? `Only ${product.stock} left` : 'In Stock'
                ) : 'Out of Stock'}
              </span>
              {product.isVeg !== undefined && (
                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${
                  product.isVeg ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                }`}>
                  {product.isVeg ? '🟢 Veg' : '🔴 Non-Veg'}
                </span>
              )}
            </div>

            <div className="mt-8 space-y-4">
              {product.weight && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Weight</h3>
                  <p className="mt-1 text-gray-900">{product.weight}</p>
                </div>
              )}
              {product.brand && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Brand</h3>
                  <p className="mt-1 text-gray-900">{product.brand}</p>
                </div>
              )}
            </div>

            <div className="mt-8 flex items-center gap-4">
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-3 hover:bg-gray-100 transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="p-3 hover:bg-gray-100 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <Button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                size="lg"
                className="flex-1"
              >
                <ShoppingCart className="w-5 h-5" />
                Add to Cart
              </Button>
            </div>

            {product.stock > 0 && (
              <button
                onClick={handleAddToCart}
                className="mt-4 w-full btn-outline"
              >
                <Check className="w-4 h-4" />
                Buy Now
              </button>
            )}
          </div>
        </div>

        <div className="mt-16">
          <div className="border-b border-gray-200">
            <nav className="flex gap-8">
              {[
                { key: 'description', label: 'Description' },
                { key: 'ingredients', label: product.isFood ? 'Ingredients' : 'Details' },
                { key: 'reviews', label: 'Reviews' },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`py-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.key
                      ? 'border-primary-600 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="mt-8">
            {activeTab === 'description' && (
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed">{product.description}</p>
                {product.shelfLife && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-start gap-2">
                      <Info className="w-5 h-5 text-primary-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-900">Shelf Life</p>
                        <p className="text-gray-600">{product.shelfLife}</p>
                      </div>
                    </div>
                  </div>
                )}
                {product.storageInstructions && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-start gap-2">
                      <Info className="w-5 h-5 text-primary-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-900">Storage Instructions</p>
                        <p className="text-gray-600">{product.storageInstructions}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'ingredients' && (
              <div>
                {product.ingredients && product.ingredients.length > 0 ? (
                  <ul className="space-y-2">
                    {product.ingredients.map((ingredient, index) => (
                      <li key={index} className="flex items-center gap-2 text-gray-700">
                        <Check className="w-4 h-4 text-green-600" />
                        {ingredient}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">No ingredients information available.</p>
                )}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="text-center py-12">
                <p className="text-gray-500">No reviews yet. Be the first to review this product!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
