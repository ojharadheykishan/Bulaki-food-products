import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

export function generateOrderId(): string {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(100 + Math.random() * 900);
  return `BULAKI-${timestamp}${random}`;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-');
}

export function buildWhatsAppOrderMessage(cartItems: { name: string; selectedWeight?: string; quantity: number; price: number }[], total: number, address: string) {
  const lines = cartItems.map((item) => `- ${item.name}${item.selectedWeight ? ` (${item.selectedWeight})` : ''} x${item.quantity} = ₹${item.price * item.quantity}`);
  const message = [
    'Hi Bulaki Team, I would like to place a WhatsApp order:',
    '',
    ...lines,
    '',
    `Total: ₹${total}`,
    '',
    `Delivery Address: ${address}`,
    '',
    'Please confirm availability and payment details.',
  ].join('\n');
  return encodeURIComponent(message);
}

export function getWhatsAppLink(phone: string, message: string) {
  return `https://wa.me/${phone}?text=${message}`;
}
