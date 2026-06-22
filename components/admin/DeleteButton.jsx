'use client';
export default function DeleteButton({ action, id, label = 'Sil' }) {
  return (
    <form action={action} onSubmit={(e) => { if (!confirm('Silinsin? Bu əməliyyat geri qaytarıla bilməz.')) e.preventDefault(); }}>
      <input type="hidden" name="id" value={id} />
      <button className="adm-del" type="submit">{label}</button>
    </form>
  );
}
