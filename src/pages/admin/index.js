import { useCallback, useEffect, useState } from 'react';
import AdminDashboard from './AdminDashboard';
import AdminLogin from './AdminLogin';
import { EMPTY_DATA } from './config';
import { clearSession, isSessionValid, loadData, saveData, saveSession } from './storage';
import { ROUTES } from '../../common/siteConfig';

const AdminApp = () => {
  const [path, setPath] = useState(window.location.pathname);
  const [authenticated, setAuthenticated] = useState(false);
  const [data, setData] = useState(EMPTY_DATA);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState('');

  const navigate = useCallback((nextPath, replace = false) => {
    window.history[replace ? 'replaceState' : 'pushState']({}, '', nextPath);
    setPath(nextPath);
  }, []);

  useEffect(() => {
    if (window.location.pathname === ROUTES.legacyLogin) navigate(ROUTES.adminLogin, true);
    const onPop = () => setPath(window.location.pathname);
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, [navigate]);

  useEffect(() => {
    let active = true;
    const initialize = async () => {
      const valid = await isSessionValid();
      if (!active) return;
      setAuthenticated(valid);
      if (valid) setData(await loadData());
      setLoading(false);
    };
    initialize().catch((error) => {
      if (active) {
        setAuthError(error.message);
        setLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!authenticated) return undefined;
    let lastRefresh = 0;
    const refresh = async () => {
      if (Date.now() - lastRefresh < 60_000) return;
      lastRefresh = Date.now();
      try {
        await saveSession();
      } catch (error) {
        setAuthError(error.message);
      }
    };
    const expiryCheck = window.setInterval(async () => {
      if (!(await isSessionValid())) {
        setAuthenticated(false);
        navigate(ROUTES.adminLogin);
      }
    }, 60_000);
    window.addEventListener('pointerdown', refresh, { passive: true });
    window.addEventListener('keydown', refresh);
    return () => {
      window.clearInterval(expiryCheck);
      window.removeEventListener('pointerdown', refresh);
      window.removeEventListener('keydown', refresh);
    };
  }, [authenticated, navigate]);

  useEffect(() => {
    if (!loading && path === ROUTES.adminDashboard && !authenticated)
      navigate(ROUTES.adminLogin, true);
    else if (path === ROUTES.adminLogin && authenticated) navigate(ROUTES.adminDashboard, true);
    else if (path === '/admin' || path === '/admin/')
      navigate(authenticated ? ROUTES.adminDashboard : ROUTES.adminLogin, true);
  }, [path, authenticated, loading, navigate]);

  const login = async () => {
    const savedData = await loadData();
    await saveData(savedData);
    await saveSession();
    setData(savedData);
    setAuthError('');
    setAuthenticated(true);
    navigate(ROUTES.adminDashboard, true);
  };
  const updateData = async (nextData) => {
    await saveData(nextData);
    setData(nextData);
  };
  const logout = () => {
    clearSession();
    setAuthenticated(false);
    navigate(ROUTES.adminLogin, true);
  };

  if (loading)
    return (
      <main className="admin-page">
        <div className="admin-panel">Loading admin portal…</div>
      </main>
    );
  if (path.endsWith('/login') || !authenticated)
    return <AdminLogin onLogin={login} initialError={authError} />;
  return <AdminDashboard data={data} onDataChange={updateData} onLogout={logout} />;
};

export default AdminApp;
