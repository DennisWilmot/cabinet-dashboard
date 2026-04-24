import type { Metadata } from 'next';
import { Bitter, Figtree } from 'next/font/google';
import './globals.css';
import { MockDataProvider } from '@/lib/context';

const bitter = Bitter({
  variable: '--font-display',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

const figtree = Figtree({
  variable: '--font-body',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'Cabinet Dashboard — Government of Jamaica',
  description: 'Budget execution tracking for Jamaica\'s cabinet ministers',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${bitter.variable} ${figtree.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-page text-text-primary">
        <MockDataProvider>
          {children}
        </MockDataProvider>
      </body>
    </html>
  );
}
