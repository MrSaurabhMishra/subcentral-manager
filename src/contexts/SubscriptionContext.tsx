import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";

export interface Subscription {
  id: string;
  service: string;
  icon: string;
  status: "active" | "paused";
  nextBilling: string;
  monthlyCost: number;
  lastUsed: string;
  currentMonthUsage: string;
  shared: boolean;
  sharedWith?: string[];
  category: string;
  usageDays: number[];
}

const STORAGE_KEY = "subcentral-subscriptions";
const VIBE_KEY = "subcentral-vibe-date";

const defaultSubscriptions: Subscription[] = [];

interface SubscriptionContextType {
  subscriptions: Subscription[];
  addSubscription: (sub: Omit<Subscription, "id" | "usageDays">) => void;
  updateSubscription: (id: string, updates: Partial<Subscription>) => void;
  deleteSubscription: (id: string) => void;
  logUsage: (id: string, usedToday: number) => void;
  selectedSubId: string | null;
  setSelectedSubId: (id: string | null) => void;
  shouldShowVibeCheck: boolean;
  dismissVibeCheck: () => void;
}

const SubscriptionContext = createContext<SubscriptionContextType | null>(null);

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        // Migrate old dailyHours to usageDays
        const parsed = JSON.parse(saved);
        return parsed.map((s: any) => ({
          ...s,
          usageDays: s.usageDays || s.dailyHours || [],
        }));
      }
      return defaultSubscriptions;
    } catch {
      return defaultSubscriptions;
    }
  });

  const [selectedSubId, setSelectedSubId] = useState<string | null>(null);

  const [shouldShowVibeCheck, setShouldShowVibeCheck] = useState(() => {
    const today = new Date().toDateString();
    const lastDismissed = localStorage.getItem(VIBE_KEY);
    return lastDismissed !== today && subscriptions.length > 0;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(subscriptions));
  }, [subscriptions]);

  useEffect(() => {
    const today = new Date().toDateString();
    const lastDismissed = localStorage.getItem(VIBE_KEY);
    if (lastDismissed !== today && subscriptions.filter(s => s.status === "active").length > 0) {
      setShouldShowVibeCheck(true);
    }
  }, [subscriptions.length]);

  const addSubscription = useCallback((sub: Omit<Subscription, "id" | "usageDays">) => {
    const newSub: Subscription = { ...sub, id: crypto.randomUUID(), usageDays: [] };
    setSubscriptions(prev => [...prev, newSub]);
  }, []);

  const updateSubscription = useCallback((id: string, updates: Partial<Subscription>) => {
    setSubscriptions(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  }, []);

  const deleteSubscription = useCallback((id: string) => {
    setSubscriptions(prev => prev.filter(s => s.id !== id));
    if (selectedSubId === id) setSelectedSubId(null);
  }, [selectedSubId]);

  const logUsage = useCallback((id: string, usedToday: number) => {
    setSubscriptions(prev => prev.map(s => {
      if (s.id !== id) return s;
      const updated = { ...s, usageDays: [...s.usageDays, usedToday] };
      const totalUsedDays = updated.usageDays.filter(d => d > 0).length;
      if (usedToday > 0) {
        updated.lastUsed = "Today";
      }
      updated.currentMonthUsage = `${totalUsedDays} days`;
      return updated;
    }));
  }, []);

  const dismissVibeCheck = useCallback(() => {
    localStorage.setItem(VIBE_KEY, new Date().toDateString());
    setShouldShowVibeCheck(false);
  }, []);

  return (
    <SubscriptionContext.Provider value={{
      subscriptions, addSubscription, updateSubscription, deleteSubscription,
      logUsage, selectedSubId, setSelectedSubId, shouldShowVibeCheck, dismissVibeCheck,
    }}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscriptions() {
  const ctx = useContext(SubscriptionContext);
  if (!ctx) throw new Error("useSubscriptions must be used within SubscriptionProvider");
  return ctx;
}
