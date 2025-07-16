import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/providers';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { AuthDebug } from '@/components/debug/auth-debug';
import { AdminFloatButton } from '@/components/admin/float-button';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'SUPERNOVA - Tu club de poker online',
  description: 'Únete al mejor club de poker online con torneos, ruleta y rankings',
  keywords: 'poker, casino, ruleta, torneos, rankings',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Remover atributos problemáticos de extensiones del navegador
              if (typeof window !== 'undefined') {
                const observer = new MutationObserver((mutations) => {
                  mutations.forEach((mutation) => {
                    if (mutation.type === 'attributes') {
                      const target = mutation.target;
                      if (target instanceof Element) {
                        // Remover atributos de extensiones conocidas
                        const badAttrs = ['bis_skin_checked', '__processed', 'bis_register'];
                        badAttrs.forEach(attr => {
                          if (target.hasAttribute(attr)) {
                            target.removeAttribute(attr);
                          }
                        });
                      }
                    }
                  });
                });
                
                // Observar cambios en todo el documento
                observer.observe(document.documentElement, {
                  attributes: true,
                  subtree: true,
                  attributeFilter: ['bis_skin_checked', '__processed', 'bis_register']
                });
              }
            `,
          }}
        />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <Providers>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <AdminFloatButton />
          <AuthDebug />
        </Providers>
      </body>
    </html>
  );
}