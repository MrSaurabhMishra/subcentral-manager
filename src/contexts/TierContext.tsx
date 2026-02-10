import { createContext, useContext, useState, ReactNode, useCallback } from "react";

export type Tier = "basic" | "premium" | "premiumPlus";

interface TierLimits {
  maxSubscriptions: number | null; // null = unlimited
  analytics: boolean;
  dataExport: boolean;
  billingDownload: boolean;
  lowUsageAlerts: boolean;
  monthlySummary: boolean;
  prioritySupport: boolean;
}

const tierLimits: Record<Tier, TierLimits> = {
  basic: { maxSubscriptions: 4, analytics: false, dataExport: false, billingDownload: false, lowUsageAlerts: false, monthlySummary: false, prioritySupport: false },
  premium: { maxSubscriptions: 10, analytics: true, dataExport: false, billingDownload: false, lowUsageAlerts: true, monthlySummary: true, prioritySupport: true },
  premiumPlus: { maxSubscriptions: null, analytics: true, dataExport: true, billingDownload: true, lowUsageAlerts: true, monthlySummary: true, prioritySupport: true },
};

const tierNames: Record<Tier, string> = { basic: "Basic (Free)", premium: "Premium", premiumPlus: "Premium+" };
const tierPrices: Record<Tier, string> = { basic: "$0/year", premium: "$15/year", premiumPlus: "$25/year" };

interface TierContextType {
  tier: Tier;
  setTier: (t: Tier) => void;
  limits: TierLimits;
  tierName: string;
  tierPrice: string;
  canAddSubscription: (currentCount: number) => boolean;
  allTiers: { id: Tier; name: string; price: string; limits: TierLimits }[];
}

const STORAGE_KEY = "subcentral-tier";

const TierContext = createContext<TierContextType | null>(null);

export function TierProvider({ children }: { children: ReactNode }) {
  const [tier, setTierState] = useState<Tier>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && (saved === "basic" || saved === "premium" || saved === "premiumPlus")) return saved;
    } catch {}
    return "basic";
  });

  const setTier = useCallback((t: Tier) => {
    setTierState(t);
    localStorage.setItem(STORAGE_KEY, t);
  }, []);

  const limits = tierLimits[tier];

  const canAddSubscription = useCallback((currentCount: number) => {
    const max = tierLimits[tier].maxSubscriptions;
    return max === null || currentCount < max;
  }, [tier]);

  const allTiers = (["basic", "premium", "premiumPlus"] as Tier[]).map(id => ({
    id, name: tierNames[id], price: tierPrices[id], limits: tierLimits[id],
  }));

  return (
    <TierContext.Provider value={{ tier, setTier, limits, tierName: tierNames[tier], tierPrice: tierPrices[tier], canAddSubscription, allTiers }}>
      {children}
    </TierContext.Provider>
  );
}

export function useTier() {
  const ctx = useContext(TierContext);
  if (!ctx) throw new Error("useTier must be used within TierProvider");
  return ctx;
}
