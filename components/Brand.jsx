import Link from 'next/link';

export default function Brand({ footer = false }) {
  return (
    <Link className="brand" href="/" aria-label="CJMSE — Caspian Journal of Maritime Science & Engineering">
      <img
        src="/adda-logo.png"
        width={46}
        height={46}
        alt="Azərbaycan Dövlət Dəniz Akademiyası"
        style={{ display: 'block', flexShrink: 0, ...(footer ? { background: '#fff', borderRadius: '50%', padding: 2 } : {}) }}
      />
      <span className="brand__txt">
        <span className="brand__name" style={{ letterSpacing: '.6px' }}>CJMSE</span>
        <span className="brand__sub" style={{ whiteSpace: 'normal', lineHeight: 1.25, maxWidth: '24ch' }}>
          {footer ? 'Azərbaycan Dövlət Dəniz Akademiyası' : 'Caspian Journal of Maritime Science & Engineering'}
        </span>
      </span>
    </Link>
  );
}
