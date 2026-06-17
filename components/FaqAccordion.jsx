'use client';
import { useState } from 'react';

export default function FaqAccordion({ faqs }) {
  const [open, setOpen] = useState(-1);
  return (
    <div className="faq-list">
      {faqs.map((f, i) => (
        <div className={'faq-item' + (open === i ? ' open' : '')} key={i}>
          <button className="faq-q" aria-expanded={open === i} onClick={() => setOpen(open === i ? -1 : i)}>
            <span>{f.question}</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 9l6 6 6-6" /></svg>
          </button>
          <div className={'faq-a' + (open === i ? ' open' : '')}>
            <p>{f.answer}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
