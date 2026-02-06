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
}

export const subscriptions: Subscription[] = [
  { id: "1", service: "Netflix", icon: "🎬", status: "active", nextBilling: "2026-02-15", monthlyCost: 15.99, lastUsed: "Today", currentMonthUsage: "42 hrs", shared: true, sharedWith: ["Alice", "Bob"], category: "Entertainment" },
  { id: "2", service: "Spotify", icon: "🎵", status: "active", nextBilling: "2026-02-20", monthlyCost: 9.99, lastUsed: "Yesterday", currentMonthUsage: "28 hrs", shared: true, sharedWith: ["Alice"], category: "Music" },
  { id: "3", service: "Figma", icon: "🎨", status: "active", nextBilling: "2026-02-28", monthlyCost: 12.00, lastUsed: "2 days ago", currentMonthUsage: "18 hrs", shared: false, category: "Design" },
  { id: "4", service: "ChatGPT Plus", icon: "🤖", status: "active", nextBilling: "2026-03-01", monthlyCost: 20.00, lastUsed: "Today", currentMonthUsage: "156 queries", shared: false, category: "AI" },
  { id: "5", service: "GitHub Pro", icon: "💻", status: "active", nextBilling: "2026-02-18", monthlyCost: 4.00, lastUsed: "Today", currentMonthUsage: "320 commits", shared: false, category: "Dev Tools" },
  { id: "6", service: "Adobe CC", icon: "🖌️", status: "paused", nextBilling: "—", monthlyCost: 54.99, lastUsed: "45 days ago", currentMonthUsage: "0 hrs", shared: false, category: "Design" },
  { id: "7", service: "Notion", icon: "📝", status: "active", nextBilling: "2026-02-22", monthlyCost: 8.00, lastUsed: "3 days ago", currentMonthUsage: "12 hrs", shared: true, sharedWith: ["Team"], category: "Productivity" },
  { id: "8", service: "iCloud+", icon: "☁️", status: "active", nextBilling: "2026-03-05", monthlyCost: 2.99, lastUsed: "Today", currentMonthUsage: "48 GB", shared: true, sharedWith: ["Family"], category: "Storage" },
  { id: "9", service: "LinkedIn Premium", icon: "💼", status: "paused", nextBilling: "—", monthlyCost: 29.99, lastUsed: "62 days ago", currentMonthUsage: "0 hrs", shared: false, category: "Career" },
  { id: "10", service: "Grammarly", icon: "✍️", status: "active", nextBilling: "2026-02-25", monthlyCost: 12.00, lastUsed: "35 days ago", currentMonthUsage: "2 docs", shared: false, category: "Writing" },
];

export const monthlySpendData = [
  { month: "Sep", spend: 145 },
  { month: "Oct", spend: 152 },
  { month: "Nov", spend: 148 },
  { month: "Dec", spend: 170 },
  { month: "Jan", spend: 165 },
  { month: "Feb", spend: 169.96 },
];

export const categoryData = [
  { name: "Entertainment", value: 25.98, color: "hsl(238, 75%, 55%)" },
  { name: "Productivity", value: 20.00, color: "hsl(160, 84%, 39%)" },
  { name: "Dev Tools", value: 4.00, color: "hsl(38, 92%, 50%)" },
  { name: "AI", value: 20.00, color: "hsl(280, 65%, 60%)" },
  { name: "Design", value: 12.00, color: "hsl(350, 80%, 55%)" },
  { name: "Storage", value: 2.99, color: "hsl(200, 70%, 50%)" },
  { name: "Writing", value: 12.00, color: "hsl(150, 50%, 50%)" },
];

export const paymentHistory = [
  { id: "1", date: "2026-01-15", description: "Netflix - Monthly", amount: 15.99, status: "paid" },
  { id: "2", date: "2026-01-20", description: "Spotify - Monthly", amount: 9.99, status: "paid" },
  { id: "3", date: "2026-01-22", description: "Notion - Monthly", amount: 8.00, status: "paid" },
  { id: "4", date: "2026-01-01", description: "ChatGPT Plus - Monthly", amount: 20.00, status: "paid" },
  { id: "5", date: "2026-01-18", description: "GitHub Pro - Monthly", amount: 4.00, status: "paid" },
];

export const lowUsageAlerts = subscriptions.filter(s => {
  const daysMatch = s.lastUsed.match(/(\d+)\s*days?\s*ago/);
  if (daysMatch && parseInt(daysMatch[1]) >= 30) return true;
  return false;
});
