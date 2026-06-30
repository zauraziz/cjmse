'use client';
import { useState } from 'react';

const TYPES = [
  ['research',  'Tədqiqat məqaləsi',           'Orijinal empirik və ya nəzəri tədqiqat; tam IMRaD strukturu.'],
  ['review',    'İcmal məqaləsi',              'Mövcud ədəbiyyatın sistemli icmalı və sintezi.'],
  ['technical', 'Texniki məqalə',              'Texniki həll, metod, qurğu və ya tətbiqin təsviri.'],
  ['short',     'Qısa elmi hesabat (Tövsiyə)', 'Qısa ilkin nəticələr və ya tövsiyə xarakterli məlumat.'],
  ['editorial', 'Redaksiya məqaləsi',          'Redaksiya şərhi/girişi.'],
  ['casestudy', 'Keys-stadi',                  'Konkret hadisə/layihənin dərin təhlili (case study).'],
];
const LANGS = [['az', 'Azərbaycan'], ['en', 'English'], ['ru', 'Русский'], ['tr', 'Türkçe']];

export default function SubmitForm({ action, subjects = [] }) {
  const [type, setType] = useState('research');
  const desc = (TYPES.find(([v]) => v === type) || [])[2];
  return (
    <form action={action} className="adm-form">
      <input type="text" name="website" tabIndex={-1} autoComplete="off" style={{ position: 'absolute', left: '-9999px', width: 1, height: 1 }} aria-hidden="true" />

      <div className="adm-field full"><label>Məqalənin başlığı *</label><input name="title" required placeholder="Məqalənin tam başlığı" /></div>

      <div className="adm-field"><label>Əlaqələndirici müəllif (ad, soyad) *</label><input name="author_name" required /></div>
      <div className="adm-field"><label>E-poçt *</label><input name="email" type="email" required placeholder="ad@nümunə.az" /></div>

      <div className="adm-field full"><label>Digər müəlliflər (hər biri yeni sətirdə)</label><textarea name="coauthors" placeholder="Ad Soyad — Təşkilat" /></div>

      <div className="adm-field full"><label>Məqalə növü</label>
        <select name="type" value={type} onChange={(e) => setType(e.target.value)}>{TYPES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select>
        <span style={{ fontSize: 12.5, color: 'var(--muted)', marginTop: 6 }}>{desc}</span>
      </div>

      <div className="adm-field"><label>Əsas dil</label>
        <select name="language" defaultValue="az">{LANGS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select>
      </div>
      <div className="adm-field"><label>Sahə</label>
        <select name="subject_id" defaultValue="">
          <option value="">— seçin —</option>
          {subjects.map((s) => <option key={s.slug} value={s.id}>{s.name_az}</option>)}
        </select>
      </div>

      <div className="adm-field full"><label>Xülasə</label><textarea name="abstract" placeholder="150–250 söz" /></div>
      <div className="adm-field full"><label>Açar sözlər (vergüllə, 5–8)</label><input name="keywords" /></div>

      <div className="adm-field full"><label>Əlyazma faylı (Word / LaTeX / PDF)</label>
        <input type="file" name="manuscript_file" accept=".doc,.docx,.tex,.pdf,.zip,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/pdf,application/zip" />
        <span style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>.docx, .doc, .tex, .pdf və ya .zip (LaTeX layihəsi). Anonim resenziya üçün fayldan müəllif adlarını çıxarın.</span>
      </div>
      <div className="adm-field full"><label>Şəkillər və qrafiklər (bir neçə fayl)</label>
        <input type="file" name="figures" multiple accept="image/*,.zip,.eps,.tif,.tiff" />
        <span style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>PNG, JPG, TIFF, EPS və ya .zip. Yüksək ayırdetmə (≥300 dpi) tövsiyə olunur.</span>
      </div>
      <div className="adm-field full"><label>və ya əlyazmanın keçidi (URL)</label>
        <input name="manuscript_url" placeholder="Google Drive / Dropbox / OneDrive paylaşım linki" />
        <span style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>Fayl yükləmək əvəzinə (və ya çox böyük fayllar üçün) paylaşıma açıq link verə bilərsiniz. Ən azı fayl və ya link tələb olunur.</span>
      </div>

      <div className="adm-actions" style={{ marginTop: 8 }}>
        <button className="adm-btn" type="submit">Təqdim et</button>
        <a className="adm-btn adm-btn--ghost" href="/for-authors">Qaydaları oxu</a>
      </div>
    </form>
  );
}
