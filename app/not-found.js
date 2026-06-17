import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="band">
      <div className="wrap" style={{ maxWidth: 620, textAlign: 'center', padding: '40px 0' }}>
        <h1 style={{ fontFamily: 'var(--f-display)', fontSize: '2.2rem' }}>404</h1>
        <p style={{ color: 'var(--ink-2)', fontSize: 16 }}>Axtardığınız səhifə və ya məqalə tapılmadı.</p>
        <div style={{ marginTop: 18 }}>
          <Link className="btn btn--primary" href="/">Ana səhifə</Link>
        </div>
      </div>
    </section>
  );
}
