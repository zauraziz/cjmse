import { neon } from '@neondatabase/serverless';

// DATABASE_URL Vercel-də env dəyişəni kimi təyin olunur.
// Build zamanı dəyər olmasa da, sorğular yalnız sorğu vaxtı (force-dynamic) işləyir.
const url = process.env.DATABASE_URL || 'postgresql://user:pass@localhost/db';
const sql = neon(url);

/** Parametrli sorğu — sətir massivi qaytarır. */
export async function q(text, params = []) {
  return await sql.query(text, params);
}

export { sql };
