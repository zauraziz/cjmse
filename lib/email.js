const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://cjmse.adda.edu.az';

export async function sendEmail({ to, subject, html }) {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.MAIL_FROM || 'CJMSE <onboarding@resend.dev>';
  if (!key) return { sent: false, reason: 'no_api_key' };
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from, to: [to], subject, html }),
    });
    return res.ok ? { sent: true } : { sent: false, reason: 'api_error', status: res.status };
  } catch {
    return { sent: false, reason: 'exception' };
  }
}

const shell = (inner) => `<div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;margin:0 auto;color:#1a1a1a">
  <div style="border-bottom:3px solid #0e7c7b;padding-bottom:10px;margin-bottom:18px">
    <strong style="font-size:18px">CJMSE</strong><br><span style="font-size:12px;color:#666">Caspian Journal of Maritime Science &amp; Engineering · ADDA</span>
  </div>${inner}
  <p style="font-size:11px;color:#999;margin-top:26px;border-top:1px solid #eee;padding-top:12px">Bu avtomatik bildirişdir. Suallar üçün jurnalın rəsmi e-poçtu ilə əlaqə saxlayın.</p>
</div>`;

export function submissionEmailHtml(title, link) {
  return shell(`<p>Hörmətli müəllif,</p>
  <p>«<strong>${title}</strong>» adlı məqaləniz CJMSE-yə uğurla təqdim edildi və ilkin yoxlamaya göndərildi.</p>
  <p>Məqalənizin statusunu istənilən vaxt aşağıdakı şəxsi keçid vasitəsilə — <strong>şifrə daxil etmədən</strong> — izləyə bilərsiniz:</p>
  <p style="margin:18px 0"><a href="${link}" style="background:#0e7c7b;color:#fff;padding:11px 18px;border-radius:8px;text-decoration:none;font-size:14px">Statusu izlə</a></p>
  <p style="font-size:12px;color:#666">və ya: <a href="${link}">${link}</a></p>
  <p style="font-size:12px;color:#666">Bu keçidi yadda saxlayın — status dəyişdikcə sizə yeni bildiriş göndəriləcək.</p>`);
}

export function statusEmailHtml(title, statusLabelText, note, link) {
  return shell(`<p>Hörmətli müəllif,</p>
  <p>«<strong>${title}</strong>» məqalənizin statusu yeniləndi:</p>
  <p style="font-size:16px;margin:14px 0"><strong style="color:#0e7c7b">${statusLabelText}</strong></p>
  ${note ? `<p style="background:#f4f0e8;border-radius:8px;padding:12px 14px;font-size:14px"><strong>Redaksiyanın qeydi:</strong><br>${note}</p>` : ''}
  <p style="margin:18px 0"><a href="${link}" style="background:#0e7c7b;color:#fff;padding:11px 18px;border-radius:8px;text-decoration:none;font-size:14px">Ətraflı bax</a></p>`);
}
