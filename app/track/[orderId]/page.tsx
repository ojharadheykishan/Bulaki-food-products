'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Order } from '@/types';
import SiteHeader from '@/components/layout/SiteHeader';
import TrackingProgress from '@/components/shared/TrackingProgress';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, Truck, MapPin, Phone, Mail } from 'lucide-react';
import Link from 'next/link';

export default function TrackOrderPage() {
  const params = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchOrder() {
      try {
        const res = await fetch(`/api/track/${params.orderId}`);
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || 'Order not found');
        }
        const data = await res.json();
        setOrder(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch order');
      } finally {
        setLoading(false);
      }
    }
    fetchOrder();
  }, [params.orderId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <SiteHeader />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto" />
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50">
        <SiteHeader />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Not Found</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link href="/">
            <Button>Go Back Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  const latestStatus = order.statusHistory[order.statusHistory.length - 1];

  return (
    <div className="min-h-screen bg-gray-50">
      <SiteHeader />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <div className="card p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Order #{order.orderId}</h1>
              <p className="text-sm text-gray-500 mt-1">
                Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
            <div className={`px-4 py-2 rounded-full border ${
              order.orderStatus === 'DELIVERED'
                ? 'bg-green-50 border-green-200 text-green-700'
                : order.orderStatus === 'OUT_FOR_DELIVERY'
                ? 'bg-blue-50 border-blue-200 text-blue-700'
                : order.orderStatus === 'CANCELLED'
                ? 'bg-red-50 border-red-200 text-red-700'
                : 'bg-yellow-50 border-yellow-200 text-yellow-700'
            }`}>
              <span className="font-semibold text-sm">{order.orderStatus.replace(/_/g, ' ')}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="card p-6 mb-6">
              <TrackingProgress
                orderStatus={order.orderStatus}
                statusDate={latestStatus?.updatedAt}
                statusMessage={latestStatus?.message}
              />
            </div>

            {order.trackingNumber && (
              <div className="card p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Courier Details</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Truck className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-900">Courier Partner</p>
                      <p className="text-sm text-gray-600">{order.courierPartner || 'Not assigned'}</p>
                    </div>
                  </div>
                  {order.trackingNumber && (
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 flex items-center justify-center text-gray-400">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Tracking Number</p>
                        <p className="text-sm text-gray-600 font-mono">{order.trackingNumber}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h3>
              <div className="space-y-4">
                {order.orderItems.map((item, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{item.name}</p>
                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-medium text-gray-900">₹{(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1 space-y-6">
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Delivery Address</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">{order.customer.name}</p>
                    <p className="text-sm text-gray-600">{order.customer.address}</p>
                    {order.customer.city && <p className="text-sm text-gray-600">{order.customer.city}</p>}
                    {order.customer.state && <p className="text-sm text-gray-600">{order.customer.state}</p>}
                    <p className="text-sm text-gray-600">Pincode: {order.customer.pincode}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <p className="text-sm text-gray-700">{order.customer.phone}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <p className="text-sm text-gray-700">{order.customer.email}</p>
                </div>
              </div>
            </div>

            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium text-gray-900">₹{order.totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment</span>
                  <span className="font-medium text-gray-900">{order.paymentMethod}</span>
                </div>
                <div className="border-t border-gray-200 pt-2 flex justify-between text-base">
                  <span className="font-semibold text-gray-900">Total</span>
                  <span className="font-bold text-gray-900">₹{order.totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
