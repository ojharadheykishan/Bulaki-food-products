import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Order } from '@/models/Order';
import { Product } from '@/models/Product';

export async function GET() {
  try {
    await connectToDatabase();

    const [
      totalSales,
      totalOrders,
      activeShipments,
      lowStock,
      recentOrders,
    ] = await Promise.all([
      Order.aggregate([
        { $match: { orderStatus: { $nin: ['CANCELLED'] } } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } },
      ]),
      Order.countDocuments(),
      Order.countDocuments({ orderStatus: { $in: ['PREPARING', 'OUT_FOR_DELIVERY'] } }),
      Product.countDocuments({ stock: { $lt: 5 } }),
      Order.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('orderItems.product'),
    ]);

    return NextResponse.json({
      totalSales: totalSales[0]?.total || 0,
      totalOrders,
      activeShipments,
      lowStock,
      recentOrders: recentOrders.map((order) => ({
        _id: order._id,
        orderId: order.orderId,
        customer: order.customer,
        totalAmount: order.totalAmount,
        orderStatus: order.orderStatus,
        createdAt: order.createdAt,
      })),
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
