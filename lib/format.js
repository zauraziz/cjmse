export function fmtViews(n) {
  n = Number(n) || 0;
  return n >= 1000 ? (n / 1000).toFixed(1).replace('.0', '') + 'k' : String(n);
}

export function fmtDate(d) {
  if (!d) return '';
  const s = typeof d === 'string' ? d.slice(0, 10) : new Date(d).toISOString().slice(0, 10);
  const [y, m, dd] = s.split('-');
  return `${dd}.${m}.${y}`;
}

export const TYPE_LABEL = {
  research: 'Tədqiqat məqaləsi',
  review: 'İcmal məqaləsi',
  technical: 'Texniki məqalə',
  short: 'Qısa məlumat',
  editorial: 'Redaksiya məqaləsi',
};
