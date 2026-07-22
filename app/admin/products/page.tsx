'use client';

import { useEffect, useState } from 'react';
import SiteHeader from '@/components/layout/SiteHeader';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Button';
import { Product } from '@/types';
import toast from 'react-hot-toast';
import { Plus, Edit, Trash2 } from 'lucide-react';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    category: 'Food' as 'Food' | 'Spices' | 'Snacks' | 'General Product',
    price: 0,
    discountPrice: 0,
    stock: 0,
    description: '',
    isFood: false,
    isVeg: true,
    ingredients: '',
    shelfLife: '',
    storageInstructions: '',
    weight: '',
    brand: '',
    images: [''],
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
    setFormData({
      name: product.name,
      category: product.category,
      price: product.price,
      discountPrice: product.discountPrice || 0,
      stock: product.stock,
      description: product.description,
      isFood: product.isFood,
      isVeg: product.isVeg,
      ingredients: product.ingredients?.join(', ') || '',
      shelfLife: product.shelfLife || '',
      storageInstructions: product.storageInstructions || '',
      weight: product.weight || '',
      brand: product.brand || '',
      images: product.images,
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
        category: 'Food',
        price: 0,
        discountPrice: 0,
        stock: 0,
        description: '',
        isFood: false,
        isVeg: true,
        ingredients: '',
        shelfLife: '',
        storageInstructions: '',
        weight: '',
        brand: '',
        images: [''],
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

  return (
    <div className="min-h-screen bg-gray-50">
      <SiteHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Product Management</h1>
          <Button onClick={() => { setShowForm(true); setEditingProduct(null); }}>
            <Plus className="w-4 h-4" /> Add Product
          </Button>
        </div>

        {showForm && (
          <div className="card p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Product Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="Food">Food</option>
                  <option value="Spices">Spices</option>
                  <option value="Snacks">Snacks</option>
                  <option value="General Product">General Product</option>
                </select>
              </div>
              <Input label="Price (₹)" type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })} required />
              <Input label="Discount Price (₹)" type="number" value={formData.discountPrice} onChange={(e) => setFormData({ ...formData, discountPrice: parseFloat(e.target.value) })} />
              <Input label="Stock" type="number" value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) })} required />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Weight</label>
                <input type="text" value={formData.weight} onChange={(e) => setFormData({ ...formData, weight: e.target.value })} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Ingredients (comma separated)</label>
                <input type="text" value={formData.ingredients} onChange={(e) => setFormData({ ...formData, ingredients: e.target.value })} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                <input type="text" value={formData.images[0]} onChange={(e) => setFormData({ ...formData, images: [e.target.value] })} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="https://example.com/image.jpg" required />
              </div>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={formData.isFood} onChange={(e) => setFormData({ ...formData, isFood: e.target.checked })} className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500" />
                  <span className="text-sm text-gray-700">Is Food Item</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={formData.isVeg} onChange={(e) => setFormData({ ...formData, isVeg: e.target.checked })} className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500" />
                  <span className="text-sm text-gray-700">Vegetarian</span>
                </label>
              </div>
              <div className="md:col-span-2 flex gap-4">
                <Button type="submit">{editingProduct ? 'Update Product' : 'Create Product'}</Button>
                <Button type="button" variant="outline" onClick={() => { setShowForm(false); setEditingProduct(null); }}>
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        )}

        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Image</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.map((product) => (
                  <tr key={product._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <img src={product.images[0]} alt={product.name} className="w-12 h-12 rounded-lg object-cover" />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.category}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">₹{product.price}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.stock}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button onClick={() => handleEdit(product)} className="text-primary-600 hover:text-primary-700 mr-4"><Edit className="w-4 h-4" /></button>
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
