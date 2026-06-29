import { cookies } from 'next/headers';
import { getDict, DEFAULT_LANG } from './i18n';

export function getLang() {
  try { return cookies().get('lang')?.value || DEFAULT_LANG; } catch { return DEFAULT_LANG; }
}
export function getT() { return getDict(getLang()); }
