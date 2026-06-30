'use client';
import { useState } from 'react';
import Link from 'next/link';

const STYLES = [['vancouver', 'Vancouver'], ['apa', 'APA'], ['harvard', 'Harvard']];
const SAMPLE = `@article{example2024,
  title={Title of the article},
  author={Surname, Name and Other, Author},
  journal={Ocean Engineering},
  volume={250},
  pages={110--125},
  year={2024},
  doi={10.1016/j.oceaneng.2024.000000}
}`;

export default function ReferencesTool() {
  const [input, setInput] = useState('');
  const [style, setStyle] = useState('vancouver');
  const [html, setHtml] = useState('');
  const [count, setCount] = useState(0);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);

  async function format() {
    setBusy(true); setError(''); setHtml(''); setCopied(false);
    try {
      const res = await fetch('/api/format-references', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input, style }),
      });
      const data = await res.json();
      if (!res.ok || data.error) setError(data.error === 'empty' ? 'Mətn daxil edin.' : 'Mətn təhlil edilə bilmədi. BibTeX və ya CSL-JSON formatını yoxlayın.');
      else { setHtml(data.html || ''); setCount(data.count || 0); }
    } catch { setError('Xəta baş verdi. Yenidən cəhd edin.'); }
    setBusy(false);
  }

  function copyText() {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    navigator.clipboard.writeText(tmp.innerText.trim());
    setCopied(true); setTimeout(() => setCopied(false), 1500);
  }

  return (
    <section className="band">
      <div className="wrap" style={{ maxWidth: 820 }}>
        <div style={{ marginBottom: 8 }}>
          <Link href="/for-authors" style={{ fontFamily: 'var(--f-mono)', fontSize: 12.5, color: 'var(--teal-d)' }}>← Müəllif qaydaları</Link>
        </div>
        <h1 className="sec-title">İstinad formatlayıcısı</h1>
        <p style={{ fontSize: 15.5, lineHeight: 1.8, color: 'var(--ink-2)' }}>
          Mənbələrinizi <b>Zotero</b>, Mendeley və ya başqa proqramdan <b>BibTeX</b> (.bib) və ya <b>CSL-JSON</b> kimi ixrac edin və aşağıya yapışdırın.
          Sistem onları seçdiyiniz stildə avtomatik formatlayır (CSL mühərriki — Zotero ilə eyni). Nəticəni kopyalayıb məqalənizin «Mənbələr» bölməsinə əlavə edə bilərsiniz.
        </p>

        <div className="adm-form" style={{ marginTop: 14 }}>
          <div className="adm-field full">
            <label>BibTeX və ya CSL-JSON</label>
            <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={10} style={{ fontFamily: 'var(--f-mono)', fontSize: 13 }} placeholder={SAMPLE} />
            <button type="button" onClick={() => setInput(SAMPLE)} style={{ alignSelf: 'flex-start', marginTop: 6, background: 'none', border: 'none', color: 'var(--teal-d)', fontSize: 12.5, cursor: 'pointer', padding: 0 }}>Nümunə daxil et</button>
          </div>
          <div className="adm-field">
            <label>Stil</label>
            <select value={style} onChange={(e) => setStyle(e.target.value)}>{STYLES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select>
          </div>
          <div className="adm-actions" style={{ alignItems: 'center' }}>
            <button className="adm-btn" type="button" onClick={format} disabled={busy}>{busy ? 'Formatlanır…' : 'Formatla'}</button>
          </div>
        </div>

        {error && <div style={{ background: '#fdecea', color: '#b3261e', border: '1px solid #f3c2bd', borderRadius: 10, padding: '11px 14px', fontSize: 14, marginTop: 14 }}>{error}</div>}

        {html && (
          <div style={{ marginTop: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <h2 className="abs-h" style={{ margin: 0 }}>Nəticə ({count})</h2>
              <button type="button" onClick={copyText} className="adm-btn adm-btn--ghost" style={{ padding: '6px 12px' }}>{copied ? 'Kopyalandı ✓' : 'Mətni kopyala'}</button>
            </div>
            <div className="csl-out" style={{ background: '#fff', border: '1px solid var(--line)', borderRadius: 10, padding: '16px 18px', fontSize: 14.5, lineHeight: 1.7, color: '#111', boxShadow: 'var(--shadow)' }} dangerouslySetInnerHTML={{ __html: html }} />
          </div>
        )}

        <p style={{ fontFamily: 'var(--f-mono)', fontSize: 12, color: 'var(--muted)', marginTop: 20, lineHeight: 1.7 }}>
          Məsləhət: Zotero-da mənbələri seçin → sağ klik → “Export Items” → format “BibTeX” və ya “CSL JSON”.
        </p>
      </div>
    </section>
  );
}
