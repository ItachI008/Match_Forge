// app/layout.tsx
import { Providers } from './providers';
import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {/* This makes the context available to all client components */}
        <Providers> 
          {children}
        </Providers>
      </body>
    </html>
  );
}