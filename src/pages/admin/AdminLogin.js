import { useEffect, useState } from 'react';
import { ADMIN_PASSWORD, ADMIN_SECRET, NOTICE_DURATION_MS, ROUTES } from '../../common/constants';

const AdminLogin = ({ onLogin, initialError = '' }) => {
  const [error, setError] = useState(initialError);
  useEffect(() => {
    if (!error) return undefined;
    const timer = window.setTimeout(() => setError(''), NOTICE_DURATION_MS);
    return () => window.clearTimeout(timer);
  }, [error]);
  const submit = async (event) => {
    event.preventDefault();
    setError('');
    const password = new FormData(event.currentTarget).get('password');
    if (!ADMIN_PASSWORD || !ADMIN_SECRET) {
      setError(
        'Admin login is not configured. Add the password and secret key to .env.local, then restart the app.',
      );
      return;
    }
    if (password !== ADMIN_PASSWORD) {
      setError('That password is not correct.');
      return;
    }
    try {
      await onLogin();
    } catch (loginError) {
      setError(loginError.message);
    }
  };

  return (
    <main className="admin-login-page">
      <form className="admin-login-card" onSubmit={submit}>
        <a
          className="admin-back-link"
          href={ROUTES.storefront}
          onClick={(event) => {
            event.preventDefault();
            window.location.assign(ROUTES.storefront);
          }}
        >
          ← Back to store
        </a>
        <p className="admin-eyebrow">BOXER SPORTS WEAR</p>
        <h1>Admin login</h1>
        <p className="admin-muted">Sign in to manage your local catalog files.</p>
        <label className="admin-field">
          <span>Password</span>
          <input
            autoFocus
            name="password"
            type="password"
            autoComplete="current-password"
            required
          />
        </label>
        {error && (
          <p className="admin-error" role="alert">
            {error}
          </p>
        )}
        <button className="admin-primary" type="submit">
          Sign in
        </button>
      </form>
    </main>
  );
};

export default AdminLogin;
