import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { LocaleConfig, locales, detectLocaleConfig } from "@/lib/locales";

export type Locale = "en" | "hi";

interface LocaleContextType {
  locale: Locale;
  localeConfig: LocaleConfig;
  setLocaleConfig: (config: LocaleConfig) => void;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
  formatCurrency: (amount: number) => string;
  currency: string;
}

const translations: Record<string, Record<Locale, string>> = {
  "dashboard.title": { en: "Dashboard", hi: "डैशबोर्ड" },
  "dashboard.subtitle": { en: "Overview of your subscription spending", hi: "आपके सब्सक्रिप्शन खर्चों का अवलोकन" },
  "stat.totalSpend": { en: "Total Monthly Spend", hi: "कुल मासिक खर्च" },
  "stat.activeSubs": { en: "Active Subscriptions", hi: "सक्रिय सब्सक्रिप्शन" },
  "stat.moneySaved": { en: "Money Saved", hi: "बचत" },
  "stat.fromPaused": { en: "From paused subs", hi: "रोके गए सब्सक्रिप्शन से" },
  "stat.newThisMonth": { en: "2 new this month", hi: "इस महीने 2 नए" },
  "table.title": { en: "Your Subscriptions", hi: "आपके सब्सक्रिप्शन" },
  "table.service": { en: "Service", hi: "सेवा" },
  "table.status": { en: "Status", hi: "स्थिति" },
  "table.nextBilling": { en: "Next Billing", hi: "अगली बिलिंग" },
  "table.cost": { en: "Cost", hi: "लागत" },
  "table.lastUsed": { en: "Last Used", hi: "आखिरी उपयोग" },
  "table.usage": { en: "Usage", hi: "उपयोग" },
  "table.shared": { en: "Shared", hi: "साझा" },
  "status.active": { en: "Active", hi: "सक्रिय" },
  "status.paused": { en: "Paused", hi: "रोका गया" },
  "alerts.title": { en: "Low Usage Alerts", hi: "कम उपयोग अलर्ट" },
  "alerts.consider": { en: "Consider pausing these subscriptions to save", hi: "बचत के लिए इन सब्सक्रिप्शन को रोकने पर विचार करें" },
  "alerts.lastUsed": { en: "Last used", hi: "आखिरी बार उपयोग" },
  "renewals.title": { en: "Upcoming Renewals", hi: "आगामी नवीनीकरण" },
  "renewals.days": { en: "days", hi: "दिन" },
  "renewals.today": { en: "Today", hi: "आज" },
  "renewals.tomorrow": { en: "Tomorrow", hi: "कल" },
  "analytics.title": { en: "Analytics", hi: "विश्लेषण" },
  "analytics.subtitle": { en: "Spending trends and insights", hi: "खर्च के रुझान और अंतर्दृष्टि" },
  "analytics.spendTrend": { en: "Spend Trend", hi: "खर्च का रुझान" },
  "analytics.byCategory": { en: "Spend by Category", hi: "श्रेणी के अनुसार खर्च" },
  "analytics.daily": { en: "Daily", hi: "दैनिक" },
  "analytics.weekly": { en: "Weekly", hi: "साप्ताहिक" },
  "analytics.monthly": { en: "Monthly", hi: "मासिक" },
  "analytics.currentSavings": { en: "Current Savings", hi: "वर्तमान बचत" },
  "analytics.potentialSavings": { en: "Potential Savings", hi: "संभावित बचत" },
  "analytics.annualProjection": { en: "Annual Projection", hi: "वार्षिक अनुमान" },
  "analytics.wastedOnUnused": { en: "Wasted on unused subs", hi: "अप्रयुक्त सब्सक्रिप्शन पर बर्बाद" },
  "analytics.projectedYearly": { en: "Projected yearly spend", hi: "अनुमानित वार्षिक खर्च" },
  "nav.dashboard": { en: "Dashboard", hi: "डैशबोर्ड" },
  "nav.analytics": { en: "Analytics", hi: "विश्लेषण" },
  "nav.subscriptions": { en: "Subscriptions", hi: "सब्सक्रिप्शन" },
  "nav.plans": { en: "Plans", hi: "योजनाएं" },
  "nav.shared": { en: "Shared Accounts", hi: "साझा खाते" },
  "header.search": { en: "Search subscriptions...", hi: "सब्सक्रिप्शन खोजें..." },
  "header.addNew": { en: "Add New", hi: "नया जोड़ें" },
  "account.profile": { en: "Profile", hi: "प्रोफाइल" },
  "account.usageSummary": { en: "Usage Summary", hi: "उपयोग सारांश" },
  "account.virtualCard": { en: "Virtual Credit Card", hi: "वर्चुअल क्रेडिट कार्ड" },
  "account.yourPlan": { en: "Your Plan", hi: "आपकी योजना" },
  "account.paymentHistory": { en: "Payment History", hi: "भुगतान इतिहास" },
  "account.resetPassword": { en: "Reset Password", hi: "पासवर्ड बदलें" },
  "account.support": { en: "Support", hi: "सहायता" },
  "account.notifications": { en: "Notification Settings", hi: "सूचना सेटिंग" },
  "account.familyTeam": { en: "Family / Team", hi: "परिवार / टीम" },
  "account.dataExport": { en: "Data Export", hi: "डेटा निर्यात" },
  "account.logout": { en: "Logout", hi: "लॉग आउट" },
};

const STORAGE_KEY = "subcentral-locale-code";

const LocaleContext = createContext<LocaleContextType | null>(null);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [localeConfig, setLocaleConfigState] = useState<LocaleConfig>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const found = locales.find(l => l.code === saved);
      if (found) return found;
    }
    return detectLocaleConfig();
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, localeConfig.code);
  }, [localeConfig]);

  const locale = localeConfig.lang;

  const setLocale = (l: Locale) => {
    const config = l === "hi" ? locales.find(lc => lc.code === "in")! : locales[0];
    setLocaleConfigState(config);
  };

  const setLocaleConfig = (config: LocaleConfig) => {
    setLocaleConfigState(config);
  };

  const t = (key: string): string => translations[key]?.[locale] || key;

  const formatCurrency = (amount: number): string => {
    const converted = amount * localeConfig.rate;
    if (localeConfig.rate >= 100) {
      return `${localeConfig.currencySymbol}${Math.round(converted).toLocaleString()}`;
    }
    return `${localeConfig.currencySymbol}${converted.toFixed(2)}`;
  };

  const currency = localeConfig.currencySymbol;

  return (
    <LocaleContext.Provider value={{ locale, localeConfig, setLocaleConfig, setLocale, t, formatCurrency, currency }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used within LocaleProvider");
  return ctx;
}

export type { LocaleConfig };
export { locales } from "@/lib/locales";
