export const STATUS_ORDER = ['submitted', 'screening', 'under_review', 'revisions', 'accepted', 'published'];
export const STATUS_LABELS = {
  submitted:    { az: 'Qəbul edildi',            en: 'Received',            ru: 'Получена' },
  screening:    { az: 'İlkin yoxlama',           en: 'Initial screening',   ru: 'Первичная проверка' },
  under_review: { az: 'Resenziyada',             en: 'Under review',        ru: 'На рецензии' },
  revisions:    { az: 'Düzəliş tələb olunur',    en: 'Revisions requested', ru: 'Требуются правки' },
  accepted:     { az: 'Qəbul olundu',            en: 'Accepted',            ru: 'Принята' },
  rejected:     { az: 'İmtina edildi',           en: 'Rejected',            ru: 'Отклонена' },
  published:    { az: 'Nəşr olundu',             en: 'Published',           ru: 'Опубликована' },
};
export function statusLabel(status, lang = 'az') {
  const o = STATUS_LABELS[status] || {};
  return o[lang] || o.az || status;
}
