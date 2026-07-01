'use client';
import { useState } from 'react';

export default function Subscribe({ t = {}, compact = false }) {
  const [email, setEmail] = useState('');
  const [state, setState] = useState('idle'); // idle | loading | ok | err

  async function submit(e) {
    e.preventDefault();
    if (!email.trim() || state === 'loading') return;
    setState('loading');
    try {
      const r = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      setState(r.ok ? 'ok' : 'err');
      if (r.ok) setEmail('');
    } catch {
      setState('err');
    }
  }

  const MailIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2.5" y="4.5" width="19" height="15" rx="2.5" /><path d="m3 6 9 6 9-6" />
    </svg>
  );

  // ---------- footer compact variant ----------
  if (compact) {
    return (
      <form onSubmit={submit} className="sub-foot">
        {state === 'ok' ? (
          <p className="sub-foot__ok">✓ {t.sub_ok}</p>
        ) : (
          <>
            <div className="sub-foot__row">
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t.sub_ph} aria-label={t.sub_ph} />
              <button type="submit" disabled={state === 'loading'}>{state === 'loading' ? '…' : t.sub_btn}</button>
            </div>
            {state === 'err' && <span className="sub-foot__err">{t.sub_err}</span>}
          </>
        )}
      </form>
    );
  }

  // ---------- homepage section variant ----------
  return (
    <div className="sub-card">
      <div className="sub-card__text">
        <span className="sub-card__eyebrow"><MailIcon /> CJMSE Alerts</span>
        <h2>{t.sub_title}</h2>
        <p>{t.sub_desc}</p>
      </div>
      <form className="sub-card__form" onSubmit={submit}>
        {state === 'ok' ? (
          <div className="sub-card__ok">✓ {t.sub_ok}</div>
        ) : (
          <>
            <div className="sub-card__input">
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t.sub_ph} aria-label={t.sub_ph} />
              <button type="submit" disabled={state === 'loading'}>
                {state === 'loading' ? '…' : t.sub_btn}
              </button>
            </div>
            {state === 'err' && <div className="sub-card__err">{t.sub_err}</div>}
            <div className="sub-card__note">{t.sub_privacy}</div>
          </>
        )}
      </form>
    </div>
  );
}
