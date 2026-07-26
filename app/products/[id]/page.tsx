'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import ImageGallery from '@/components/shared/ImageGallery';
import { useCartStore } from '@/store/cartStore';
import { Star, Minus, Plus, ShoppingCart, Check, Info, Truck } from 'lucide-react';
import SiteHeader from '@/components/layout/SiteHeader';
import { Button } from '@/components/ui/Button';
import toast from 'react-hot-toast';
import { Product, IVariant } from '@/types';

export default function ProductDetailsPage() {
  const params = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'description' | 'nutrition' | 'reviews'>('description');
  const [selectedWeight, setSelectedWeight] = useState('');
  const [pincode, setPincode] = useState('');
  const [deliveryMsg, setDeliveryMsg] = useState('');

  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`/api/products/${params.id}`);
        if (res.ok) {
          const data = await res.json();
          setProduct(data);
          setSelectedWeight(data.variants?.[0]?.weight || '');
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [params.id]);

  const selectedVariant = product?.variants.find((v: IVariant) => v.weight === selectedWeight) || product?.variants[0];
  const discountPercentage = selectedVariant?.mrp
    ? Math.round(((selectedVariant.mrp - selectedVariant.price) / selectedVariant.mrp) * 100)
    : 0;

  const handleAddToCart = () => {
    if (product && selectedVariant && selectedVariant.stock > 0) {
      addItem(product, selectedVariant, quantity);
      toast.success('Added to cart!');
    }
  };

  const checkDelivery = () => {
    if (pincode.length === 6) {
      setDeliveryMsg('Estimated delivery: 2-4 business days');
    } else {
      setDeliveryMsg('Please enter a valid 6-digit pincode');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-ivory">
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
      <div className="min-h-screen bg-brand-ivory">
        <SiteHeader />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h1 className="text-2xl font-bold text-brand-maroon">Product not found</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-ivory">
      <SiteHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <ImageGallery images={product.images} productName={product.name} />
          </div>

          <div>
            <span className="text-xs font-bold text-brand-crimson uppercase tracking-wider">Authentic Bikaner Taste</span>
            <span className="ml-3 text-xs font-medium text-brand-forest bg-brand-forest/10 px-2 py-1 rounded-full border border-brand-forest/20">
              {product.isVeg ? '🟢 Veg' : '🔴 Non-Veg'}
            </span>

            <h1 className="mt-4 text-3xl lg:text-4xl font-bold text-brand-maroon">
              {product.name}
            </h1>

            <div className="mt-4 flex items-center gap-2">
              <Star className="w-5 h-5 fill-brand-gold text-brand-gold" />
              <span className="font-medium text-brand-maroon">{product.ratings.toFixed(1)}</span>
              <span className="text-brand-maroon/60">({product.reviewCount} reviews)</span>
            </div>

            <div className="mt-6 flex items-baseline gap-3">
              <span className="text-4xl font-bold text-brand-maroon">
                ₹{selectedVariant?.price}
              </span>
              {selectedVariant?.mrp && selectedVariant.mrp > selectedVariant.price && (
                <>
                  <span className="text-xl text-brand-maroon/40 line-through">₹{selectedVariant.mrp}</span>
                  <span className="text-green-700 font-medium">-{discountPercentage}%</span>
                </>
              )}
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-brand-maroon/80 mb-2">Select Weight</label>
              <div className="flex flex-wrap gap-3">
                {product.variants.map((variant: IVariant) => (
                  <button
                    key={variant.weight}
                    onClick={() => { setSelectedWeight(variant.weight); setQuantity(1); }}
                    className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition-colors ${
                      selectedWeight === variant.weight
                        ? 'border-brand-crimson bg-brand-crimson/5 text-brand-maroon'
                        : 'border-[#e6dfd3] text-brand-maroon/70 hover:border-brand-gold/60'
                    }`}
                  >
                    {variant.weight} - ₹{variant.price}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6 flex items-center gap-4">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${
                selectedVariant && selectedVariant.stock > 0 ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
              }`}>
                {selectedVariant && selectedVariant.stock > 0 ? (
                  selectedVariant.stock <= 5 ? `Only ${selectedVariant.stock} left` : 'In Stock'
                ) : 'Out of Stock'}
              </span>
            </div>

            <div className="mt-8 flex items-center gap-4">
              <div className="flex items-center border border-[#e6dfd3] rounded-lg bg-white">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-3 hover:bg-brand-ivory transition-colors"
                >
                  <Minus className="w-4 h-4 text-brand-maroon" />
                </button>
                <span className="px-4 font-medium text-brand-maroon">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(selectedVariant?.stock || 1, quantity + 1))}
                  className="p-3 hover:bg-brand-ivory transition-colors"
                >
                  <Plus className="w-4 h-4 text-brand-maroon" />
                </button>
              </div>

              <Button
                onClick={handleAddToCart}
                disabled={!selectedVariant || selectedVariant.stock === 0}
                size="lg"
                className="flex-1"
              >
                <ShoppingCart className="w-5 h-5" />
                Add to Cart
              </Button>
            </div>

            {selectedVariant && selectedVariant.stock > 0 && (
              <button
                onClick={handleAddToCart}
                className="mt-4 w-full btn-accent"
              >
                <Check className="w-4 h-4" />
                Buy Now
              </button>
            )}

            <div className="mt-8">
              <label className="block text-sm font-medium text-brand-maroon/80 mb-2">Check Delivery</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  placeholder="Enter pincode"
                  className="flex-1 px-4 py-2.5 border border-[#e6dfd3] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold/60"
                  maxLength={6}
                />
                <Button type="button" onClick={checkDelivery} variant="outline">
                  <Truck className="w-4 h-4" />
                </Button>
              </div>
              {deliveryMsg && <p className="mt-2 text-sm text-brand-maroon/70">{deliveryMsg}</p>}
            </div>
          </div>
        </div>

        <div className="mt-16">
          <div className="border-b border-[#e6dfd3]">
            <nav className="flex gap-8">
              {[
                { key: 'description', label: 'Ingredients & Taste Profile' },
                { key: 'nutrition', label: 'Nutritional Values' },
                { key: 'reviews', label: 'Reviews' },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`py-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.key
                      ? 'border-brand-crimson text-brand-crimson'
                      : 'border-transparent text-brand-maroon/60 hover:text-brand-maroon'
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
                <p className="text-brand-maroon/80 leading-relaxed">{product.description}</p>
                {product.ingredients && product.ingredients.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold text-brand-maroon mb-3">Ingredients</h3>
                    <ul className="space-y-2">
                      {product.ingredients.map((ingredient: string, index: number) => (
                        <li key={index} className="flex items-center gap-2 text-brand-maroon/80">
                          <Check className="w-4 h-4 text-brand-forest" />
                          {ingredient}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {product.shelfLife && (
                  <div className="mt-6 p-4 bg-brand-ivory rounded-lg border border-[#e6dfd3]">
                    <div className="flex items-start gap-2">
                      <Info className="w-5 h-5 text-brand-crimson mt-0.5" />
                      <div>
                        <p className="font-medium text-brand-maroon">Shelf Life</p>
                        <p className="text-brand-maroon/70">{product.shelfLife}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'nutrition' && (
              <div>
                {product.nutritionalInfo ? (
                  <div className="overflow-x-auto">
                    <table className="w-full max-w-2xl">
                      <thead>
                        <tr className="bg-brand-ivory">
                          <th className="px-4 py-3 text-left text-sm font-semibold text-brand-maroon">Nutrient</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-brand-maroon">Per 100g</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#e6dfd3]">
                        {product.nutritionalInfo.energy && (
                          <tr><td className="px-4 py-3 text-sm text-brand-maroon/80">Energy</td><td className="px-4 py-3 text-sm text-brand-maroon/80">{product.nutritionalInfo.energy}</td></tr>
                        )}
                        {product.nutritionalInfo.protein && (
                          <tr><td className="px-4 py-3 text-sm text-brand-maroon/80">Protein</td><td className="px-4 py-3 text-sm text-brand-maroon/80">{product.nutritionalInfo.protein}</td></tr>
                        )}
                        {product.nutritionalInfo.fat && (
                          <tr><td className="px-4 py-3 text-sm text-brand-maroon/80">Fat</td><td className="px-4 py-3 text-sm text-brand-maroon/80">{product.nutritionalInfo.fat}</td></tr>
                        )}
                        {product.nutritionalInfo.carbs && (
                          <tr><td className="px-4 py-3 text-sm text-brand-maroon/80">Carbohydrates</td><td className="px-4 py-3 text-sm text-brand-maroon/80">{product.nutritionalInfo.carbs}</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-brand-maroon/70">No nutritional information available.</p>
                )}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="text-center py-12">
                <p className="text-brand-maroon/70">No reviews yet. Be the first to review this product!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
