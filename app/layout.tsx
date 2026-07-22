import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Providers from '@/components/Providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'Bulaki Food and Product',
    template: '%s | Bulaki Food and Product',
  },
  description: 'Fresh food, spices, snacks, and quality products delivered to your doorstep.',
  keywords: ['food', 'spices', 'snacks', 'grocery', 'bulaki'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
