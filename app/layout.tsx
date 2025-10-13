import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'High p(doom) Digital Twin',
  description: 'Chat with an AI safety advocate who believes superintelligence poses existential risk',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">{children}</body>
    </html>
  );
}
