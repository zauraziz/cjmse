'use client';
import { useState } from 'react';

const TYPES = [
  ['research', 'Tədqiqat məqaləsi'], ['review', 'İcmal məqaləsi'], ['technical', 'Texniki məqalə'],
  ['short', 'Qısa elmi hesabat (Tövsiyə)'], ['editorial', 'Redaksiya məqaləsi'], ['casestudy', 'Keys-stadi'],
];
const LANGS = [['az', 'Azərbaycan'], ['en', 'English'], ['ru', 'Русский'], ['tr', 'Türkçe']];

export default function SubmissionEditForm({ action, subjects = [], sub }) {
  let figs = [];
  try { figs = JSON.parse(sub?.figures_urls || '[]'); } catch { figs = []; }
  return (
    <form action={action} className="adm-form">
      <input type="hidden" name="id" value={sub.id} />
      <div className="adm-field full"><label>Başlıq</label><input name="title" defaultValue={sub.title ?? ''} /></div>
      <div className="adm-field"><label>Əlaqələndirici müəllif</label><input name="author_name" defaultValue={sub.author_name ?? ''} /></div>
      <div className="adm-field"><label>E-poçt</label><input name="email" type="email" defaultValue={sub.email ?? ''} /></div>
      <div className="adm-field full"><label>Digər müəlliflər (hər biri yeni sətirdə · "Ad — Təşkilat")</label><textarea name="coauthors" defaultValue={sub.coauthors ?? ''} /></div>
      <div className="adm-field"><label>Növ</label><select name="type" defaultValue={sub.type ?? 'research'}>{TYPES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select></div>
      <div className="adm-field"><label>Dil</label><select name="language" defaultValue={sub.language ?? 'az'}>{LANGS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select></div>
      <div className="adm-field"><label>Sahə</label>
        <select name="subject_id" defaultValue={sub.subject_id ?? ''}>
          <option value="">— seçin —</option>
          {subjects.map((s) => <option key={s.slug} value={s.id}>{s.name_az}</option>)}
        </select>
      </div>
      <div className="adm-field"><label>DOI</label><input name="doi" defaultValue={sub.doi ?? ''} placeholder="10.xxxxx/cjmse…" /></div>
      <div className="adm-field full"><label>Açar sözlər</label><input name="keywords" defaultValue={sub.keywords ?? ''} /></div>
      <div className="adm-field full"><label>Xülasə</label><textarea name="abstract" defaultValue={sub.abstract ?? ''} /></div>

      <div className="adm-field full"><label>Əlyazma faylını əvəz et (Word / LaTeX / PDF)</label>
        <input type="file" name="manuscript_file" accept=".doc,.docx,.tex,.pdf,.zip" />
        {sub.manuscript_file_url && <a href={sub.manuscript_file_url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, color: 'var(--teal-d)', marginTop: 4 }}>Mövcud fayl ↓</a>}
      </div>
      <div className="adm-field full"><label>Əlyazma keçidi (URL)</label><input name="manuscript_url" defaultValue={sub.manuscript_url ?? ''} /></div>
      <div className="adm-field full"><label>Şəkil əlavə et (mövcudlara əlavə olunur)</label>
        <input type="file" name="figures" multiple accept="image/*,.zip,.eps,.tif,.tiff" />
        {figs.length > 0 && <span style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>Mövcud: {figs.length} şəkil</span>}
      </div>

      <div className="adm-actions"><button className="adm-btn" type="submit">Yadda saxla</button>
        <a className="adm-btn adm-btn--ghost" href={`/admin/submissions/${sub.id}`}>Ləğv et</a>
      </div>
    </form>
  );
}
