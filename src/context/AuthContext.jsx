import { createContext, useContext, useEffect, useState } from 'react';

const AuthCtx = createContext(null);
export const useAuth = () => useContext(AuthCtx);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [booting, setBooting] = useState(true);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('stm_user');
      if (saved) setUser(JSON.parse(saved));
    } catch {}
    setBooting(false);
  }, []);

  const login = (u) => {
    setUser(u);
    localStorage.setItem('stm_user', JSON.stringify(u));
  };
  const logout = () => {
    setUser(null);
    localStorage.removeItem('stm_user');
  };

  return (
    <AuthCtx.Provider value={{ user, login, logout, booting }}>
      {children}
    </AuthCtx.Provider>
  );
}
