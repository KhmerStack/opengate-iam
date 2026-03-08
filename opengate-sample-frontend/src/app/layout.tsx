import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Demo App — OpenGate IAM',
  description: 'Sample app protected by OpenGate IAM',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900 min-h-screen">{children}</body>
    </html>
  );
}
