import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Locale = "en" | "hi";

interface LocaleContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
  formatCurrency: (amount: number) => string;
  currency: string;
}

const INR_RATE = 83.5;

const translations: Record<string, Record<Locale, string>> = {
  // Dashboard
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

  // Poll
  "poll.logUsage": { en: "Log Usage", hi: "उपयोग दर्ज करें" },
  "poll.hours": { en: "hours", hi: "घंटे" },
  "poll.submit": { en: "Submit", hi: "जमा करें" },
  "poll.logged": { en: "Logged!", hi: "दर्ज हो गया!" },

  // Renewals
  "renewals.title": { en: "Upcoming Renewals", hi: "आगामी नवीनीकरण" },
  "renewals.days": { en: "days", hi: "दिन" },
  "renewals.today": { en: "Today", hi: "आज" },
  "renewals.tomorrow": { en: "Tomorrow", hi: "कल" },

  // Analytics
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

  // Nav
  "nav.dashboard": { en: "Dashboard", hi: "डैशबोर्ड" },
  "nav.analytics": { en: "Analytics", hi: "विश्लेषण" },
  "nav.subscriptions": { en: "Subscriptions", hi: "सब्सक्रिप्शन" },
  "nav.plans": { en: "Plans", hi: "योजनाएं" },
  "nav.shared": { en: "Shared Accounts", hi: "साझा खाते" },

  // Header
  "header.search": { en: "Search subscriptions...", hi: "सब्सक्रिप्शन खोजें..." },
  "header.addNew": { en: "Add New", hi: "नया जोड़ें" },

  // Account
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

const pollQuestionsEn = [
  "Did you cheat on Netflix today? 😏",
  "How many hours did you binge-watch? 🍿",
  "Did Spotify play your guilty pleasure? 🎵",
  "Was ChatGPT your best friend today? 🤖",
  "Did you actually use that gym app? 💪",
  "How much screen time are we talking? 📱",
  "Did you open Figma or just stare at it? 🎨",
  "Netflix & chill or Netflix & bill? 💸",
];

const pollQuestionsHi = [
  "बाबू, आज Netflix को धोखा दिया? 😏",
  "आज कितने घंटे बिंज-वॉच किया? 🍿",
  "Spotify पे guilty pleasure सुना क्या? 🎵",
  "ChatGPT आज का बेस्ट फ्रेंड रहा? 🤖",
  "जिम ऐप खोला भी या बस icon देखा? 💪",
  "आज कितना स्क्रीन टाइम हुआ? 📱",
  "Figma खोला या बस ताकते रहे? 🎨",
  "Netflix देखा या बस बिल भरा? 💸",
];

export const getPollQuestions = (locale: Locale) =>
  locale === "hi" ? pollQuestionsHi : pollQuestionsEn;

function detectLocale(): Locale {
  try {
    const lang = navigator.language || (navigator as any).userLanguage || "en";
    if (lang.startsWith("hi")) return "hi";
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
    if (tz.includes("Kolkata") || tz.includes("Calcutta")) return "hi";
  } catch {}
  return "en";
}

const LocaleContext = createContext<LocaleContextType | null>(null);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>(() => {
    const saved = localStorage.getItem("subcentral-locale") as Locale | null;
    return saved || detectLocale();
  });

  useEffect(() => {
    localStorage.setItem("subcentral-locale", locale);
  }, [locale]);

  const t = (key: string): string => translations[key]?.[locale] || key;

  const formatCurrency = (amount: number): string => {
    if (locale === "hi") {
      const inr = amount * INR_RATE;
      return `₹${inr.toLocaleString("en-IN", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
    }
    return `$${amount.toFixed(2)}`;
  };

  const currency = locale === "hi" ? "₹" : "$";

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t, formatCurrency, currency }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used within LocaleProvider");
  return ctx;
}
