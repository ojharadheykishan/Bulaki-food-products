import mongoose, { Schema, Document } from 'mongoose';

export interface IOrderItem {
  product: mongoose.Schema.Types.ObjectId;
  name: string;
  selectedWeight: string;
  price: number;
  quantity: number;
  image: string;
}

export interface IStatusHistory {
  status: string;
  message: string;
  updatedAt: Date;
}

export interface ICustomerAddress {
  name: string;
  phone: string;
  email: string;
  address: string;
  city?: string;
  state?: string;
  pincode: string;
}

export interface IOrder extends Document {
  orderId: string;
  customer: ICustomerAddress;
  orderItems: IOrderItem[];
  subtotal: number;
  deliveryFee: number;
  totalAmount: number;
  paymentMethod: 'COD' | 'ONLINE';
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED';
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  orderStatus: 'ORDER_PLACED' | 'CONFIRMED' | 'PREPARING' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED';
  statusHistory: IStatusHistory[];
  trackingNumber?: string;
  courierPartner?: string;
  estimatedDelivery?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name: { type: String, required: true },
  selectedWeight: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  quantity: { type: Number, required: true, min: 1 },
  image: { type: String, required: true },
});

const StatusHistorySchema = new Schema<IStatusHistory>({
  status: { type: String, required: true },
  message: { type: String, required: true },
  updatedAt: { type: Date, default: Date.now },
});

const CustomerAddressSchema = new Schema<ICustomerAddress>({
  name: { type: String, required: true, trim: true },
  phone: { type: String, required: true, trim: true },
  email: { type: String, required: true, lowercase: true, trim: true },
  address: { type: String, required: true, trim: true },
  city: { type: String, trim: true },
  state: { type: String, trim: true },
  pincode: { type: String, required: true, trim: true },
});

const OrderSchema = new Schema<IOrder>(
  {
    orderId: { type: String, required: true, unique: true },
    customer: { type: CustomerAddressSchema, required: true },
    orderItems: [OrderItemSchema],
    subtotal: { type: Number, required: true, min: 0 },
    deliveryFee: { type: Number, required: true, min: 0, default: 0 },
    totalAmount: { type: Number, required: true, min: 0 },
    paymentMethod: { type: String, enum: ['COD', 'ONLINE'], required: true },
    paymentStatus: { type: String, enum: ['PENDING', 'PAID', 'FAILED'], default: 'PENDING' },
    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },
    orderStatus: {
      type: String,
      enum: ['ORDER_PLACED', 'CONFIRMED', 'PREPARING', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'],
      default: 'ORDER_PLACED',
    },
    statusHistory: [StatusHistorySchema],
    trackingNumber: { type: String },
    courierPartner: { type: String },
    estimatedDelivery: { type: Date },
  },
  { timestamps: true, id: false }
);

OrderSchema.index({ orderId: 1 });
OrderSchema.index({ createdAt: -1 });
OrderSchema.index({ 'customer.email': 1 });

export const Order = mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);
