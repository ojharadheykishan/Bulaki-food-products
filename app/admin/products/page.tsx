'use client';

import { useEffect, useState } from 'react';
import SiteHeader from '@/components/layout/SiteHeader';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Button';
import { Product, IVariant } from '@/types';
import toast from 'react-hot-toast';
import { Plus, Edit, Trash2 } from 'lucide-react';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    category: 'Bhujia',
    description: '',
    isVeg: true,
    images: [''],
    ingredients: '',
    shelfLife: '6 Months',
    nutritionalInfo: { energy: '', protein: '', fat: '', carbs: '' },
    isBestseller: false,
    variants: [{ weight: '200g', price: 0, mrp: 0, stock: 0 }] as IVariant[],
  });

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        setProducts(data.products || []);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    const variant = product.variants[0] || { weight: '', price: 0, mrp: 0, stock: 0 };
    setFormData({
      name: product.name,
      category: product.category,
      description: product.description,
      isVeg: product.isVeg,
      images: product.images,
      ingredients: product.ingredients?.join(', ') || '',
      shelfLife: product.shelfLife || '6 Months',
      nutritionalInfo: {
        energy: product.nutritionalInfo?.energy || '',
        protein: product.nutritionalInfo?.protein || '',
        fat: product.nutritionalInfo?.fat || '',
        carbs: product.nutritionalInfo?.carbs || '',
      },
      isBestseller: product.isBestseller || false,
      variants: product.variants.length > 0 ? product.variants : [variant],
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingProduct ? `/api/products/${editingProduct._id}` : '/api/products';
      const method = editingProduct ? 'PUT' : 'POST';

      const payload = {
        ...formData,
        ingredients: formData.ingredients.split(',').map(s => s.trim()).filter(Boolean),
        images: formData.images.filter(Boolean),
      };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Failed to save product');

      toast.success(editingProduct ? 'Product updated' : 'Product created');
      setShowForm(false);
      setEditingProduct(null);
      setFormData({
        name: '',
        category: 'Bhujia',
        description: '',
        isVeg: true,
        images: [''],
        ingredients: '',
        shelfLife: '6 Months',
        nutritionalInfo: { energy: '', protein: '', fat: '', carbs: '' },
        isBestseller: false,
        variants: [{ weight: '200g', price: 0, mrp: 0, stock: 0 }],
      });

      const productsRes = await fetch('/api/products');
      const productsData = await productsRes.json();
      setProducts(productsData.products || []);
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error('Failed to save product');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      toast.success('Product deleted');
      setProducts(products.filter((p) => p._id !== id));
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product');
    }
  };

  const updateVariant = (index: number, field: keyof IVariant, value: string | number) => {
    setFormData((prev) => {
      const variants = [...prev.variants];
      variants[index] = { ...variants[index], [field]: value };
      return { ...prev, variants };
    });
  };

  const addVariant = () => {
    setFormData((prev) => ({
      ...prev,
      variants: [...prev.variants, { weight: '', price: 0, mrp: 0, stock: 0 }],
    }));
  };

  const removeVariant = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="min-h-screen bg-brand-ivory">
      <SiteHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-brand-maroon">Product Management</h1>
          <Button onClick={() => { setShowForm(true); setEditingProduct(null); }}>
            <Plus className="w-4 h-4" /> Add Product
          </Button>
        </div>

        {showForm && (
          <div className="card p-6 mb-8 border-2 border-[#e6dfd3]">
            <h2 className="text-xl font-semibold text-brand-maroon mb-6">
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Product Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2.5 border border-[#e6dfd3] rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-gold/60"
                  >
                    <option value="Bhujia">Bhujia</option>
                    <option value="Namkeen">Namkeen</option>
                    <option value="Sweets">Sweets</option>
                    <option value="Snacks">Snacks</option>
                    <option value="Spices">Spices</option>
                    <option value="Gifts">Gift Hampers</option>
                  </select>
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2.5 border border-[#e6dfd3] rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-gold/60"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                <input
                  type="text"
                  value={formData.images[0]}
                  onChange={(e) => setFormData({ ...formData, images: [e.target.value] })}
                  className="w-full px-4 py-2.5 border border-[#e6dfd3] rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-gold/60"
                  placeholder="https://example.com/image.jpg"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Ingredients (comma separated)</label>
                <input
                  type="text"
                  value={formData.ingredients}
                  onChange={(e) => setFormData({ ...formData, ingredients: e.target.value })}
                  className="w-full px-4 py-2.5 border border-[#e6dfd3] rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-gold/60"
                />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Shelf Life</label>
                  <input
                    type="text"
                    value={formData.shelfLife}
                    onChange={(e) => setFormData({ ...formData, shelfLife: e.target.value })}
                    className="w-full px-4 py-2.5 border border-[#e6dfd3] rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-gold/60"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Energy</label>
                  <input
                    type="text"
                    value={formData.nutritionalInfo.energy}
                    onChange={(e) => setFormData({
                      ...formData,
                      nutritionalInfo: { ...formData.nutritionalInfo, energy: e.target.value },
                    })}
                    className="w-full px-4 py-2.5 border border-[#e6dfd3] rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-gold/60"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Protein</label>
                  <input
                    type="text"
                    value={formData.nutritionalInfo.protein}
                    onChange={(e) => setFormData({
                      ...formData,
                      nutritionalInfo: { ...formData.nutritionalInfo, protein: e.target.value },
                    })}
                    className="w-full px-4 py-2.5 border border-[#e6dfd3] rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-gold/60"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fat</label>
                  <input
                    type="text"
                    value={formData.nutritionalInfo.fat}
                    onChange={(e) => setFormData({
                      ...formData,
                      nutritionalInfo: { ...formData.nutritionalInfo, fat: e.target.value },
                    })}
                    className="w-full px-4 py-2.5 border border-[#e6dfd3] rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-gold/60"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">Weight Variants</label>
                  <button type="button" onClick={addVariant} className="text-sm text-brand-crimson hover:text-brand-maroon">+ Add Variant</button>
                </div>
                <div className="space-y-2">
                  {formData.variants.map((variant, index) => (
                    <div key={index} className="grid grid-cols-2 md:grid-cols-5 gap-2 items-end">
                      <Input
                        label="Weight"
                        value={variant.weight}
                        onChange={(e) => updateVariant(index, 'weight', e.target.value)}
                        required
                      />
                      <Input
                        label="Price"
                        type="number"
                        value={variant.price}
                        onChange={(e) => updateVariant(index, 'price', parseFloat(e.target.value))}
                        required
                      />
                      <Input
                        label="MRP"
                        type="number"
                        value={variant.mrp}
                        onChange={(e) => updateVariant(index, 'mrp', parseFloat(e.target.value))}
                      />
                      <Input
                        label="Stock"
                        type="number"
                        value={variant.stock}
                        onChange={(e) => updateVariant(index, 'stock', parseInt(e.target.value))}
                        required
                      />
                      <button type="button" onClick={() => removeVariant(index)} className="mb-2 text-red-600 hover:text-red-700">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.isVeg}
                    onChange={(e) => setFormData({ ...formData, isVeg: e.target.checked })}
                    className="w-4 h-4 text-brand-crimson border-[#e6dfd3] rounded focus:ring-brand-gold/60"
                  />
                  <span className="text-sm text-gray-700">Vegetarian</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.isBestseller}
                    onChange={(e) => setFormData({ ...formData, isBestseller: e.target.checked })}
                    className="w-4 h-4 text-brand-crimson border-[#e6dfd3] rounded focus:ring-brand-gold/60"
                  />
                  <span className="text-sm text-gray-700">Bestseller</span>
                </label>
              </div>

              <div className="flex gap-4">
                <Button type="submit">{editingProduct ? 'Update Product' : 'Create Product'}</Button>
                <Button type="button" variant="outline" onClick={() => { setShowForm(false); setEditingProduct(null); }}>
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        )}

        <div className="card overflow-hidden border-2 border-[#e6dfd3]">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-brand-ivory">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-brand-maroon/70 uppercase">Image</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-brand-maroon/70 uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-brand-maroon/70 uppercase">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-brand-maroon/70 uppercase">Variants</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-brand-maroon/70 uppercase">Bestseller</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-brand-maroon/70 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-[#e6dfd3]">
                {products.map((product) => (
                  <tr key={product._id} className="hover:bg-brand-ivory/50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <img src={product.images[0]} alt={product.name} className="w-12 h-12 rounded-lg object-cover" />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-brand-maroon">{product.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-brand-maroon/70">{product.category}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-brand-maroon/70">
                      {product.variants.map((v) => `${v.weight}: ₹${v.price}`).join(', ')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-brand-maroon/70">
                      {product.isBestseller ? 'Yes' : 'No'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button onClick={() => handleEdit(product)} className="text-brand-crimson hover:text-brand-maroon mr-4"><Edit className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(product._id)} className="text-red-600 hover:text-red-700"><Trash2 className="w-4 h-4" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
