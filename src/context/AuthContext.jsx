import { createContext, useCallback, useContext, useMemo, useState } from 'react';

const SESSION_KEY = 'usalama_demo_session';
export const DEMO_EMAIL = 'admin@example.com';
export const DEMO_PASSWORD = 'Usalama#Demo1';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [signedIn, setSignedIn] = useState(() => sessionStorage.getItem(SESSION_KEY) === '1');

  const signIn = useCallback(async (email, password) => {
    await new Promise((resolve) => setTimeout(resolve, 700));
    const ok = email.trim().toLowerCase() === DEMO_EMAIL && password === DEMO_PASSWORD;
    if (ok) {
      sessionStorage.setItem(SESSION_KEY, '1');
      setSignedIn(true);
    }
    return ok;
  }, []);

  const signOut = useCallback(() => {
    sessionStorage.removeItem(SESSION_KEY);
    setSignedIn(false);
  }, []);

  const value = useMemo(() => ({ signedIn, signIn, signOut }), [signedIn, signIn, signOut]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}