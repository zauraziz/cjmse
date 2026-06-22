import crypto from 'crypto';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export const ADMIN_COOKIE = 'cjmse_admin';

function expectedToken() {
  const pw = process.env.ADMIN_PASSWORD || '';
  const secret = process.env.ADMIN_SESSION_SECRET || 'cjmse-dev-secret-change-me';
  return crypto.createHmac('sha256', secret).update('admin:' + pw).digest('hex');
}

function safeEqual(a, b) {
  const ba = Buffer.from(String(a || ''));
  const bb = Buffer.from(String(b || ''));
  return ba.length === bb.length && crypto.timingSafeEqual(ba, bb);
}

/** True if the submitted password matches ADMIN_PASSWORD (and it is set). */
export function verifyPassword(input) {
  const pw = process.env.ADMIN_PASSWORD || '';
  if (!pw) return false;
  return safeEqual(input, pw);
}

/** The signed session token to store in the cookie. */
export function sessionToken() {
  return expectedToken();
}

/** True if the current request carries a valid admin session cookie. */
export function isAuthed() {
  const c = cookies().get(ADMIN_COOKIE)?.value;
  if (!c) return false;
  return safeEqual(c, expectedToken());
}

/** Redirects to the login page if not authenticated. Call at top of protected pages. */
export function requireAdmin() {
  if (!isAuthed()) redirect('/admin/login');
}
