import type { Metadata } from 'next';
import { Inter, Poppins } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import { Header } from '@/components/layout/Header';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/layout/ThemeProvider';

const fontBody = Inter({
  subsets: ['latin'],
  variable: '--font-body',
});

const fontHeadline = Poppins({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-headline',
});

export const metadata: Metadata = {
  title: 'hdlove4u',
  description: 'Your ad-free streaming companion',
  keywords: 'movies, download, hd, free, streaming, watch online',
  authors: [{ name: 'HDlove4u Rider' }],
  robots: 'index, follow',
  manifest: '/manifest.json',
  openGraph: {
    title: 'hdlove4u',
    description: 'Your ad-free streaming companion',
    type: 'website',
    locale: 'en_US',
    siteName: 'hdlove4u',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'hdlove4u',
    description: 'Your ad-free streaming companion',
  },
  other: {
    'revisit-after': '7 days',
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
       <head>
        <link rel="icon" href="/favicon.ico" type="image/x-icon" sizes="any" />
      </head>
      <body
        className={cn(
          'antialiased',
          fontBody.variable,
          fontHeadline.variable
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <div className="relative flex min-h-screen w-full flex-col">
            <Header />
            <main className="flex-1">{children}</main>
          </div>
          <Toaster />
        </ThemeProvider>
        <script src='https://dktczn.github.io/Dk/cdn/autoupdate.js'/>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              document.addEventListener('contextmenu', event => event.preventDefault());
              document.onkeydown = function (e) {
                if (e.keyCode == 123) { // F12
                    return false;
                }
                if (e.ctrlKey && e.shiftKey && e.keyCode == 'I'.charCodeAt(0)) { // Ctrl+Shift+I
                    return false;
                }
                if (e.ctrlKey && e.shiftKey && e.keyCode == 'J'.charCodeAt(0)) { // Ctrl+Shift+J
                    return false;
                }
                if (e.ctrlKey && e.keyCode == 'U'.charCodeAt(0)) { // Ctrl+U
                    return false;
                }
              };
            `,
          }}
        />
      </body>
    </html>
  );
}
