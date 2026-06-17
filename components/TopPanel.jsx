'use client';
import { useState } from 'react';
import Link from 'next/link';
import { fmtViews } from '@/lib/format';

export default function TopPanel({ mostRead, mostCited }) {
  const [tab, setTab] = useState('views');
  const list = tab === 'views' ? mostRead : mostCited;
  return (
    <div className="panel">
      <div className="minitabs" role="tablist" aria-label="Top siyahı növü">
        <button role="tab" aria-selected={tab === 'views'} aria-controls="topList" onClick={() => setTab('views')}>Ən çox oxunan</button>
        <button role="tab" aria-selected={tab === 'cites'} aria-controls="topList" onClick={() => setTab('cites')}>Ən çox istinad</button>
      </div>
      <ol className="toplist" id="topList" role="tabpanel">
        {list.map((a) => (
          <li key={a.slug}>
            <div>
              <Link href={`/article/${a.slug}`} style={{ color: 'var(--ink)', fontWeight: 600, fontSize: 14, lineHeight: 1.3 }}>{a.title}</Link>
              <div style={{ fontFamily: 'var(--f-mono)', fontSize: 11.5, color: 'var(--muted)', marginTop: 4 }}>
                {tab === 'views' ? fmtViews(a.views) + ' oxunma' : a.citations + ' istinad'}
              </div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
