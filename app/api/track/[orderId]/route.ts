import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Order } from '@/models/Order';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    await connectToDatabase();
    const { orderId } = await params;

    const order = await Order.findOne({ orderId }).select('-__v -createdAt -updatedAt');

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({
      orderId: order.orderId,
      orderStatus: order.orderStatus,
      statusHistory: order.statusHistory,
      trackingNumber: order.trackingNumber,
      courierPartner: order.courierPartner,
      estimatedDelivery: order.estimatedDelivery,
      totalAmount: order.totalAmount,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
      orderItems: order.orderItems,
      customer: order.customer,
    });
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json({ error: 'Failed to fetch order' }, { status: 500 });
  }
}
