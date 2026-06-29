import './globals.css';
import { cookies } from 'next/headers';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getDict, DEFAULT_LANG } from '@/lib/i18n';

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
  const lang = cookies().get('lang')?.value || DEFAULT_LANG;
  const t = getDict(lang);
  return (
    <html lang={lang}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Spectral:ital,wght@0,400;0,500;0,600;1,400&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <a href="#main" className="skip">{t.skip}</a>
        <Header lang={lang} t={t} />
        <main id="main">{children}</main>
        <Footer t={t} />
      </body>
    </html>
  );
}
