import React from 'react';
import type { Metadata } from 'next';
import './globals.css';
import { Inter } from 'next/font/google';
import FlameParticles from './components/FlameParticles';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'CS Engineer',
  description: 'Nando\'s UK Head Office CS Engineer Assignment',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <FlameParticles />
        {children}
      </body>
    </html>
  );
} 