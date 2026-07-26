import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Order } from '@/models/Order';

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();

    const { items, customer, totalAmount, paymentMethod, paymentStatus } = body;

    const subtotal = items.reduce((sum: number, item: { price: number; quantity: number }) => sum + item.price * item.quantity, 0);
    const deliveryFee = subtotal > 499 ? 0 : 40;
    const calculatedTotal = subtotal + deliveryFee;

    let razorpayOrderId: string | undefined;
    let finalPaymentStatus = paymentStatus || 'PENDING';

    if (paymentMethod === 'ONLINE') {
      try {
        const Razorpay = (await import('razorpay')).default;
        const razorpay = new Razorpay({
          key_id: process.env.RAZORPAY_KEY_ID!,
          key_secret: process.env.RAZORPAY_KEY_SECRET!,
        });

        const options = {
          amount: Math.round(calculatedTotal * 100),
          currency: 'INR',
          receipt: `receipt_order_${Date.now()}`,
          payment_capture: 1,
        };

        const razorpayOrder = await razorpay.orders.create(options);
        razorpayOrderId = razorpayOrder.id;
      } catch (error) {
        console.error('Razorpay error:', error);
      }
    }

    const order = new Order({
      customer,
      orderItems: items,
      subtotal,
      deliveryFee,
      totalAmount: calculatedTotal,
      paymentMethod,
      paymentStatus: finalPaymentStatus,
      razorpayOrderId,
      orderStatus: 'ORDER_PLACED',
      statusHistory: [
        {
          status: 'ORDER_PLACED',
          message: 'Order placed successfully',
          updatedAt: new Date(),
        },
      ],
    });

    const createdOrder = await order.save();

    return NextResponse.json(createdOrder, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
