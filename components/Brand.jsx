import Link from 'next/link';

export default function Brand({ footer = false }) {
  return (
    <Link className="brand" href="/" aria-label="Caspian Journal of Maritime Science & Engineering — ana səhifə">
      <img
        src="/adda-logo.png"
        width={46}
        height={46}
        alt="Azərbaycan Dövlət Dəniz Akademiyası"
        style={{ display: 'block', flexShrink: 0, ...(footer ? { background: '#fff', borderRadius: '50%', padding: 2 } : {}) }}
      />
      <span className="brand__txt">
        <span className="brand__name">Caspian Journal of</span>
        <span className="brand__sub">Maritime Science &amp; Engineering</span>
      </span>
    </Link>
  );
}
