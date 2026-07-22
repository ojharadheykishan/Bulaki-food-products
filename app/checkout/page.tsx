'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import SiteHeader from '@/components/layout/SiteHeader';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Button';
import { useCartStore } from '@/store/cartStore';
import { generateOrderId } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'ONLINE'>('COD');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
  });

  const total = getTotalPrice();
  const shipping = total > 500 ? 0 : 40;
  const tax = total * 0.05;
  const grandTotal = total + shipping + tax;

  const loadRazorpayScript = useCallback(() => {
    return new Promise<boolean>((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const orderId = generateOrderId();
      const orderData = {
        orderId,
        customer: formData,
        items: items.map((item) => ({
          product: item.product._id,
          name: item.product.name,
          quantity: item.quantity,
          price: item.product.price,
          image: item.product.images[0],
        })),
        totalAmount: grandTotal,
        paymentMethod,
        paymentStatus: 'PENDING',
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      if (!res.ok) throw new Error('Failed to create order');

      const order = await res.json();

      if (paymentMethod === 'ONLINE' && order.razorpayOrderId) {
        const isLoaded = await loadRazorpayScript();
        if (!isLoaded) {
          toast.error('Payment gateway failed to load. Please try COD.');
          return;
        }

        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: Math.round(grandTotal * 100),
          currency: 'INR',
          name: 'Bulaki Food and Product',
          description: `Order ${orderId}`,
          order_id: order.razorpayOrderId,
          handler: async function (response: {
            razorpay_order_id: string;
            razorpay_payment_id: string;
            razorpay_signature: string;
          }) {
            try {
              await fetch('/api/payment/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  orderId,
                }),
              });
            } catch (error) {
              console.error('Payment verification error:', error);
            } finally {
              clearCart();
              router.push(`/track/${orderId}`);
            }
          },
          prefill: {
            name: formData.name,
            email: formData.email,
            contact: formData.phone,
          },
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.open();
      } else {
        clearCart();
        router.push(`/track/${orderId}`);
      }
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error('Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (items.length === 0) {
      router.push('/cart');
    }
  }, [items, router]);

  return (
    <div className="min-h-screen bg-gray-50">
      <SiteHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="card p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Shipping Address</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input label="Full Name" name="name" value={formData.name} onChange={handleChange} required />
                <Input label="Email" type="email" name="email" value={formData.email} onChange={handleChange} required />
                <Input label="Phone Number" name="phone" value={formData.phone} onChange={handleChange} required />
                <Input label="Pincode" name="pincode" value={formData.pincode} onChange={handleChange} required />
                <div className="sm:col-span-2">
                  <Input label="Address" name="address" value={formData.address} onChange={handleChange} required />
                </div>
                <Input label="City" name="city" value={formData.city} onChange={handleChange} />
                <Input label="State" name="state" value={formData.state} onChange={handleChange} />
              </div>
            </div>

            <div className="card p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Method</h2>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('ONLINE')}
                  className={`flex-1 p-4 rounded-lg border-2 text-center transition-colors ${
                    paymentMethod === 'ONLINE'
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <p className="font-semibold text-gray-900">Online Payment</p>
                  <p className="text-sm text-gray-500">UPI, Card, Netbanking</p>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('COD')}
                  className={`flex-1 p-4 rounded-lg border-2 text-center transition-colors ${
                    paymentMethod === 'COD'
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <p className="font-semibold text-gray-900">Cash on Delivery</p>
                  <p className="text-sm text-gray-500">Pay when delivered</p>
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium text-gray-900">₹{total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium text-gray-900">
                    {shipping === 0 ? 'FREE' : `₹${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax (5%)</span>
                  <span className="font-medium text-gray-900">₹{tax.toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-200 pt-3 flex justify-between text-base">
                  <span className="font-semibold text-gray-900">Total</span>
                  <span className="font-bold text-gray-900">₹{grandTotal.toFixed(2)}</span>
                </div>
              </div>
              <Button type="submit" size="lg" className="w-full mt-6" disabled={isSubmitting}>
                {isSubmitting ? 'Processing...' : 'Place Order'}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
