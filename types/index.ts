export interface IVariant {
  weight: string;
  price: number;
  mrp?: number;
  stock: number;
}

export interface Product {
  _id: string;
  name: string;
  slug: string;
  category: string;
  description: string;
  isVeg: boolean;
  images: string[];
  variants: IVariant[];
  ingredients?: string[];
  shelfLife?: string;
  nutritionalInfo?: {
    energy?: string;
    protein?: string;
    fat?: string;
    carbs?: string;
  };
  ratings: number;
  reviewCount: number;
  isBestseller?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  product: Product;
  variant: IVariant;
  quantity: number;
}

export interface OrderItem {
  product: string;
  name: string;
  selectedWeight: string;
  price: number;
  quantity: number;
  image: string;
}

export interface CustomerAddress {
  name: string;
  phone: string;
  email: string;
  address: string;
  city?: string;
  state?: string;
  pincode: string;
}

export interface Order {
  _id: string;
  orderId: string;
  customer: CustomerAddress;
  orderItems: OrderItem[];
  totalAmount: number;
  paymentMethod: 'COD' | 'ONLINE';
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED';
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  orderStatus: 'ORDER_PLACED' | 'CONFIRMED' | 'PREPARING' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED';
  statusHistory: {
    status: string;
    message: string;
    updatedAt: string;
  }[];
  trackingNumber?: string;
  courierPartner?: string;
  estimatedDelivery?: string;
  createdAt: string;
}
