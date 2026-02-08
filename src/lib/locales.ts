export interface LocaleConfig {
  code: string;
  label: string;
  flag: string;
  currency: string;
  currencySymbol: string;
  rate: number; // rate relative to USD
  lang: "en" | "hi";
}

export const locales: LocaleConfig[] = [
  { code: "us", label: "United States", flag: "🇺🇸", currency: "USD", currencySymbol: "$", rate: 1, lang: "en" },
  { code: "in", label: "India", flag: "🇮🇳", currency: "INR", currencySymbol: "₹", rate: 83.5, lang: "hi" },
  { code: "gb", label: "United Kingdom", flag: "🇬🇧", currency: "GBP", currencySymbol: "£", rate: 0.79, lang: "en" },
  { code: "eu", label: "Eurozone", flag: "🇪🇺", currency: "EUR", currencySymbol: "€", rate: 0.92, lang: "en" },
  { code: "ca", label: "Canada", flag: "🇨🇦", currency: "CAD", currencySymbol: "C$", rate: 1.36, lang: "en" },
  { code: "au", label: "Australia", flag: "🇦🇺", currency: "AUD", currencySymbol: "A$", rate: 1.53, lang: "en" },
  { code: "jp", label: "Japan", flag: "🇯🇵", currency: "JPY", currencySymbol: "¥", rate: 149.5, lang: "en" },
  { code: "kr", label: "South Korea", flag: "🇰🇷", currency: "KRW", currencySymbol: "₩", rate: 1320, lang: "en" },
  { code: "cn", label: "China", flag: "🇨🇳", currency: "CNY", currencySymbol: "¥", rate: 7.24, lang: "en" },
  { code: "br", label: "Brazil", flag: "🇧🇷", currency: "BRL", currencySymbol: "R$", rate: 4.97, lang: "en" },
  { code: "mx", label: "Mexico", flag: "🇲🇽", currency: "MXN", currencySymbol: "$", rate: 17.1, lang: "en" },
  { code: "de", label: "Germany", flag: "🇩🇪", currency: "EUR", currencySymbol: "€", rate: 0.92, lang: "en" },
  { code: "fr", label: "France", flag: "🇫🇷", currency: "EUR", currencySymbol: "€", rate: 0.92, lang: "en" },
  { code: "sg", label: "Singapore", flag: "🇸🇬", currency: "SGD", currencySymbol: "S$", rate: 1.34, lang: "en" },
  { code: "ae", label: "UAE", flag: "🇦🇪", currency: "AED", currencySymbol: "د.إ", rate: 3.67, lang: "en" },
  { code: "sa", label: "Saudi Arabia", flag: "🇸🇦", currency: "SAR", currencySymbol: "﷼", rate: 3.75, lang: "en" },
  { code: "za", label: "South Africa", flag: "🇿🇦", currency: "ZAR", currencySymbol: "R", rate: 18.6, lang: "en" },
  { code: "ng", label: "Nigeria", flag: "🇳🇬", currency: "NGN", currencySymbol: "₦", rate: 1550, lang: "en" },
  { code: "eg", label: "Egypt", flag: "🇪🇬", currency: "EGP", currencySymbol: "E£", rate: 30.9, lang: "en" },
  { code: "se", label: "Sweden", flag: "🇸🇪", currency: "SEK", currencySymbol: "kr", rate: 10.5, lang: "en" },
  { code: "ch", label: "Switzerland", flag: "🇨🇭", currency: "CHF", currencySymbol: "CHF", rate: 0.88, lang: "en" },
  { code: "nz", label: "New Zealand", flag: "🇳🇿", currency: "NZD", currencySymbol: "NZ$", rate: 1.64, lang: "en" },
  { code: "th", label: "Thailand", flag: "🇹🇭", currency: "THB", currencySymbol: "฿", rate: 35.5, lang: "en" },
  { code: "id", label: "Indonesia", flag: "🇮🇩", currency: "IDR", currencySymbol: "Rp", rate: 15700, lang: "en" },
  { code: "my", label: "Malaysia", flag: "🇲🇾", currency: "MYR", currencySymbol: "RM", rate: 4.72, lang: "en" },
  { code: "ph", label: "Philippines", flag: "🇵🇭", currency: "PHP", currencySymbol: "₱", rate: 56.2, lang: "en" },
  { code: "pk", label: "Pakistan", flag: "🇵🇰", currency: "PKR", currencySymbol: "₨", rate: 278, lang: "en" },
  { code: "bd", label: "Bangladesh", flag: "🇧🇩", currency: "BDT", currencySymbol: "৳", rate: 110, lang: "en" },
  { code: "tr", label: "Turkey", flag: "🇹🇷", currency: "TRY", currencySymbol: "₺", rate: 32.3, lang: "en" },
  { code: "pl", label: "Poland", flag: "🇵🇱", currency: "PLN", currencySymbol: "zł", rate: 4.02, lang: "en" },
];

export function detectLocaleConfig(): LocaleConfig {
  try {
    const lang = navigator.language || "en";
    if (lang.startsWith("hi")) return locales.find(l => l.code === "in")!;
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
    if (tz.includes("Kolkata") || tz.includes("Calcutta")) return locales.find(l => l.code === "in")!;
  } catch {}
  return locales[0]; // US default
}
