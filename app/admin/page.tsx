'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import SiteHeader from '@/components/layout/SiteHeader';
import { Button } from '@/components/ui/Button';
import { Package, DollarSign, ShoppingCart, AlertTriangle, TrendingUp } from 'lucide-react';
import { Order } from '@/types';

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    activeShipments: 0,
    lowStock: 0,
  });
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch('/api/admin/stats');
        const data = await res.json();
        setStats(data);
        setRecentOrders(data.recentOrders || []);
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    }
    fetchStats();
  }, []);

  const statCards = [
    { title: 'Total Sales', value: `₹${stats.totalSales.toFixed(2)}`, icon: DollarSign, color: 'bg-green-100 text-green-600' },
    { title: 'Total Orders', value: stats.totalOrders, icon: ShoppingCart, color: 'bg-blue-100 text-blue-600' },
    { title: 'Active Shipments', value: stats.activeShipments, icon: Package, color: 'bg-purple-100 text-purple-600' },
    { title: 'Low Stock', value: stats.lowStock, icon: AlertTriangle, color: 'bg-red-100 text-red-600' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <SiteHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard Overview</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <div key={stat.title} className="card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="mt-2 text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-full ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
              <Button onClick={() => router.push('/admin/orders')} variant="outline" size="sm">
                View All
              </Button>
            </div>
            <div className="space-y-4">
              {recentOrders.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No orders yet.</p>
              ) : (
                recentOrders.map((order) => (
                  <div key={order._id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                    <div>
                      <p className="font-medium text-gray-900">#{order.orderId}</p>
                      <p className="text-sm text-gray-500">{order.customer.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">₹{order.totalAmount.toFixed(2)}</p>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        order.orderStatus === 'DELIVERED' ? 'bg-green-100 text-green-700' :
                        order.orderStatus === 'OUT_FOR_DELIVERY' ? 'bg-blue-100 text-blue-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {order.orderStatus.replace(/_/g, ' ')}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
            </div>
            <div className="space-y-3">
              <Button
                onClick={() => router.push('/admin/products')}
                className="w-full justify-start"
                variant="outline"
              >
                <Package className="w-5 h-5" />
                Manage Products
              </Button>
              <Button
                onClick={() => router.push('/admin/orders')}
                className="w-full justify-start"
                variant="outline"
              >
                <ShoppingCart className="w-5 h-5" />
                View All Orders
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
