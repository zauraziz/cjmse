import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
  title: {
    default: 'CJMSE · Caspian Journal of Maritime Science & Engineering | Elmi Əsərləri (ADDA)',
    template: '%s · CJMSE',
  },
  description:
    'Azərbaycan Dövlət Dəniz Akademiyasının «Elmi Əsərləri» (CJMSE) — dənizçilik, nəqliyyat və mühəndislik elmləri üzrə resenziyalı, açıq girişli (Diamond OA) elmi jurnal.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://cjmse.adda.edu.az'),
  openGraph: {
    type: 'website',
    siteName: 'CJMSE · Elmi Əsərləri',
    locale: 'az_AZ',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="az">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Spectral:ital,wght@0,400;0,500;0,600;1,400&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <a href="#main" className="skip">Əsas məzmuna keç</a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
