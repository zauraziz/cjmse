'use client';
import { useRouter } from 'next/navigation';

const LANGS = [['az', 'AZ'], ['en', 'EN'], ['ru', 'RU']];

export default function LangSwitch({ current }) {
  const router = useRouter();
  const set = (l) => {
    document.cookie = `lang=${l}; path=/; max-age=31536000; samesite=lax`;
    router.refresh();
  };
  return (
    <span className="lang">
      {LANGS.map(([code, label], i) => (
        <span key={code}>
          <button type="button" onClick={() => set(code)} className={'lang-b' + (current === code ? ' on' : '')} aria-pressed={current === code}>{label}</button>
          {i < LANGS.length - 1 && <span className="lang-sep"> · </span>}
        </span>
      ))}
    </span>
  );
}
