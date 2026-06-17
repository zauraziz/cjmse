import Link from 'next/link';

export default function Brand({ footer = false }) {
  return (
    <Link className="brand" href="/" aria-label="Elmi Əsərləri — ana səhifə">
      <svg className="brand__mark" viewBox="0 0 44 44" fill="none" aria-hidden="true">
        <rect x="1.5" y="1.5" width="41" height="41" rx="10" fill={footer ? '#0B2236' : '#fff'} stroke={footer ? '#23435D' : '#D8E2EA'} />
        <path d="M9 28c3.3-4.5 5.5-4.5 8.8 0s5.5 4.5 8.8 0 5.5-4.5 8.4 0" stroke={footer ? '#5BC7D4' : '#0A7C8B'} strokeWidth="2" fill="none" strokeLinecap="round" />
        <path d="M22 8l2.4 8.3L33 16.5l-6.6 5L28.6 30 22 25.5 15.4 30l2.2-8.5-6.6-5 8.6-.2z" fill={footer ? '#fff' : '#0E2942'} />
        {!footer && <circle cx="22" cy="20.3" r="2" fill="#9A6B1E" />}
      </svg>
      <span className="brand__txt">
        <span className="brand__name">Elmi Əsərləri</span>
        <span className="brand__sub">{footer ? 'ADDA · Dəniz elmləri jurnalı' : 'CJMSE · ADDA'}</span>
      </span>
    </Link>
  );
}
