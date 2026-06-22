import { login } from '../actions';
export const dynamic = 'force-dynamic';
export const metadata = { title: 'Admin giriş' };

export default function LoginPage({ searchParams }) {
  return (
    <div className="adm-login">
      <form action={login}>
        <h1>CJMSE · Admin</h1>
        <p className="adm-hint">İdarəetmə panelinə giriş üçün parolu daxil edin.</p>
        {searchParams?.error && <div className="adm-err">Parol yanlışdır.</div>}
        <label htmlFor="pw">Parol</label>
        <input id="pw" type="password" name="password" required autoFocus />
        <button type="submit">Daxil ol</button>
      </form>
    </div>
  );
}
