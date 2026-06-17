export default function robots() {
  const site = process.env.NEXT_PUBLIC_SITE_URL || 'https://cjmse.adda.edu.az';
  return {
    rules: [{ userAgent: '*', allow: '/' }],
    sitemap: `${site}/sitemap.xml`,
  };
}
