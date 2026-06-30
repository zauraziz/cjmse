export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { Cite } from '@citation-js/core';
import '@citation-js/plugin-bibtex';
import '@citation-js/plugin-csl';

const STYLES = { apa: 'apa', vancouver: 'vancouver', harvard: 'harvard1' };

export async function POST(req) {
  try {
    const { input, style } = await req.json();
    if (!input || !String(input).trim()) return Response.json({ error: 'empty' }, { status: 400 });
    const template = STYLES[style] || 'vancouver';
    const cite = new Cite(input);
    const html = cite.format('bibliography', { format: 'html', template, lang: 'en-US' });
    const count = Array.isArray(cite.data) ? cite.data.length : 0;
    return Response.json({ html, count });
  } catch (e) {
    return Response.json({ error: e?.message || 'parse_failed' }, { status: 400 });
  }
}
