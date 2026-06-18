import { neon } from '@neondatabase/serverless';

// DATABASE_URL Vercel-də env dəyişəni kimi təyin olunur.
// Build zamanı dəyər olmasa da, sorğular yalnız sorğu vaxtı (force-dynamic) işləyir.
const url = process.env.DATABASE_URL || 'postgresql://user:pass@localhost/db';
const sql = neon(url);

/** Parametrli sorğu — sətir massivi qaytarır.
 *  DB əlçatmazsa (məs. DATABASE_URL təyin olunmayıb) boş massiv qaytarır ki,
 *  səhifə 500 vermək əvəzinə boş, lakin işlək render olsun. Xəta runtime log-a yazılır. */
export async function q(text, params = []) {
  try {
    return await sql.query(text, params);
  } catch (err) {
    console.error('DB query failed:', err?.message || err);
    return [];
  }
}

export { sql };
