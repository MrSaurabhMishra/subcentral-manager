import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";

export interface UserProfile {
  name: string;
  email: string;
  country: string;
  photoBase64?: string;
}

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  signUp: (name: string, email: string, password: string, country: string) => boolean;
  signIn: (email: string, password: string) => boolean;
  signOut: () => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  updatePassword: (currentPw: string, newPw: string) => boolean;
  resetPassword: (email: string) => boolean;
}

const AUTH_KEY = "subcentral-auth";
const USERS_KEY = "subcentral-users";

const AuthContext = createContext<AuthContextType | null>(null);

function getUsers(): Record<string, { name: string; email: string; password: string; country: string; photoBase64?: string }> {
  try { return JSON.parse(localStorage.getItem(USERS_KEY) || "{}"); } catch { return {}; }
}
function saveUsers(u: any) { localStorage.setItem(USERS_KEY, JSON.stringify(u)); }

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const s = localStorage.getItem(AUTH_KEY);
      return s ? JSON.parse(s) : null;
    } catch { return null; }
  });

  useEffect(() => {
    if (user) localStorage.setItem(AUTH_KEY, JSON.stringify(user));
    else localStorage.removeItem(AUTH_KEY);
  }, [user]);

  const signUp = useCallback((name: string, email: string, password: string, country: string) => {
    const users = getUsers();
    if (users[email]) return false; // already exists
    users[email] = { name, email, password, country };
    saveUsers(users);
    setUser({ name, email, country });
    return true;
  }, []);

  const signIn = useCallback((email: string, password: string) => {
    const users = getUsers();
    const u = users[email];
    if (!u || u.password !== password) return false;
    setUser({ name: u.name, email: u.email, country: u.country, photoBase64: u.photoBase64 });
    return true;
  }, []);

  const signOut = useCallback(() => setUser(null), []);

  const updateProfile = useCallback((updates: Partial<UserProfile>) => {
    setUser(prev => {
      if (!prev) return prev;
      const updated = { ...prev, ...updates };
      // Also update in users store
      const users = getUsers();
      if (users[prev.email]) {
        users[prev.email] = { ...users[prev.email], ...updates };
        saveUsers(users);
      }
      return updated;
    });
  }, []);

  const updatePassword = useCallback((currentPw: string, newPw: string) => {
    if (!user) return false;
    const users = getUsers();
    if (!users[user.email] || users[user.email].password !== currentPw) return false;
    users[user.email].password = newPw;
    saveUsers(users);
    return true;
  }, [user]);

  const resetPassword = useCallback((email: string) => {
    const users = getUsers();
    if (!users[email]) return false;
    // Simulate email sent
    return true;
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, signUp, signIn, signOut, updateProfile, updatePassword, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
