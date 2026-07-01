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

export function reviewInviteHtml(title, link, due) {
  return shell(`<p>Hörmətli resenzent,</p>
  <p>Sizi CJMSE jurnalına təqdim edilmiş «<strong>${title}</strong>» adlı əlyazmanın resenziyasına dəvət edirik.</p>
  ${due ? `<p>Rəyin son tarixi: <strong>${due}</strong>.</p>` : ''}
  <p>Əlyazmaya baxmaq və rəyinizi şifrə daxil etmədən təqdim etmək üçün aşağıdakı şəxsi keçiddən istifadə edin:</p>
  <p style="margin:18px 0"><a href="${link}" style="background:#0e7c7b;color:#fff;padding:11px 18px;border-radius:8px;text-decoration:none;font-size:14px">Resenziyaya keç</a></p>
  <p style="font-size:12px;color:#666">və ya: <a href="${link}">${link}</a></p>
  <p style="font-size:12px;color:#666">Resenziya ikili kor prinsipi ilə aparılır; kimliyiniz müəlliflərə açıqlanmır.</p>`);
}

export function editorNotifyHtml(title, what, link) {
  return shell(`<p>Redaksiya bildirişi:</p>
  <p>«<strong>${title}</strong>» təqdimatı üzrə <strong>${what}</strong>.</p>
  <p style="margin:18px 0"><a href="${link}" style="background:#0e7c7b;color:#fff;padding:11px 18px;border-radius:8px;text-decoration:none;font-size:14px">Admin paneldə bax</a></p>`);
}

export function subscribeWelcomeHtml(unsubscribeLink) {
  return `<div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;margin:auto;color:#0E2942">
    <h2 style="color:#145063;margin:0 0 6px">Abunəliyiniz təsdiqləndi</h2>
    <p style="font-size:15px;line-height:1.65">Caspian Journal of Maritime Science &amp; Engineering (CJMSE) jurnalına abunə oldunuz. Hər yeni məqalə dərc olunduqda ilk siz xəbərdar olacaqsınız — dənizçilik və mühəndislik sahələrində açıq giriş tədqiqatları birbaşa e-poçtunuza.</p>
    <p style="font-size:15px;line-height:1.65">Jurnalla əməkdaşlıq etmək — məqalə təqdim etmək və ya resenzent olmaq — üçün <a href="${SITE}/for-authors" style="color:#145063">müəllif qaydaları</a> ilə tanış ola bilərsiniz.</p>
    <p style="font-size:12px;color:#6E869A;margin-top:22px">Abunəlikdən çıxmaq: <a href="${unsubscribeLink}" style="color:#6E869A">bu keçid</a>.</p>
  </div>`;
}

export function newArticleHtml(title, authors, link, unsubscribeLink) {
  return `<div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;margin:auto;color:#0E2942">
    <p style="font-family:monospace;font-size:12px;letter-spacing:.08em;color:#145063;text-transform:uppercase;margin:0 0 4px">CJMSE · Yeni məqalə</p>
    <h2 style="margin:0 0 6px;font-size:19px">${title}</h2>
    ${authors ? `<p style="font-size:14px;color:#516A7E;margin:0 0 14px">${authors}</p>` : ''}
    <p style="font-size:15px;line-height:1.65">Jurnalda yeni açıq giriş məqaləsi dərc olundu. Tam mətni oxuyun və istinad edin:</p>
    <p><a href="${link}" style="display:inline-block;background:#1E6E88;color:#fff;padding:11px 20px;border-radius:8px;font-weight:bold;text-decoration:none">Məqaləni oxu</a></p>
    <p style="font-size:12px;color:#6E869A;margin-top:22px">Bu bildirişi CJMSE abunəçisi olduğunuz üçün alırsınız. Çıxmaq: <a href="${unsubscribeLink}" style="color:#6E869A">bu keçid</a>.</p>
  </div>`;
}
