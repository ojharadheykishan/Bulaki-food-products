import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Order } from '@/models/Order';

export async function PATCH(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const { orderId, status, message, trackingNumber, courierPartner, estimatedDelivery } = body;

    const updateData: Record<string, unknown> = {
      orderStatus: status,
    };

    if (trackingNumber) updateData.trackingNumber = trackingNumber;
    if (courierPartner) updateData.courierPartner = courierPartner;
    if (estimatedDelivery) updateData.estimatedDelivery = new Date(estimatedDelivery);

    const order = await Order.findOneAndUpdate(
      { orderId },
      {
        ...updateData,
        $push: {
          statusHistory: {
            status,
            message: message || `Order status updated to ${status}`,
            updatedAt: new Date(),
          },
        },
      },
      { new: true }
    );

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error('Error updating order status:', error);
    return NextResponse.json({ error: 'Failed to update order status' }, { status: 500 });
  }
}
