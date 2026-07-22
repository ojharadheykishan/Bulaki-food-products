import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { connectToDatabase } from '@/lib/mongodb';
import { Order } from '@/models/Order';

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = body;

    const bodySignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (bodySignature === razorpay_signature) {
      await Order.findOneAndUpdate(
        { orderId },
        {
          paymentStatus: 'PAID',
          razorpayPaymentId: razorpay_payment_id,
          orderStatus: 'CONFIRMED',
          $push: {
            statusHistory: {
              status: 'CONFIRMED',
              message: 'Payment confirmed',
              updatedAt: new Date(),
            },
          },
        }
      );

      return NextResponse.json({ success: true, message: 'Payment verified successfully' });
    }

    return NextResponse.json({ success: false, message: 'Invalid signature' }, { status: 400 });
  } catch (error) {
    console.error('Error verifying payment:', error);
    return NextResponse.json({ error: 'Payment verification failed' }, { status: 500 });
  }
}
