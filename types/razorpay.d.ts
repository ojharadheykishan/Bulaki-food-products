declare module 'razorpay' {
  interface RazorpayOptions {
    key_id: string;
    key_secret: string;
  }
  interface RazorpayOrder {
    id: string;
    amount: number;
    currency: string;
    receipt: string;
  }
  class Razorpay {
    constructor(options: RazorpayOptions);
    orders: {
      create(options: { amount: number; currency: string; receipt: string; payment_capture: number }): Promise<RazorpayOrder>;
    };
  }
  export default Razorpay;
}
