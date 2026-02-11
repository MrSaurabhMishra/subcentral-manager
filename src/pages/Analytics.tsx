import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SavingsMetrics } from "@/components/dashboard/SavingsMetrics";
import { useLocale } from "@/contexts/LocaleContext";
import { useSubscriptions } from "@/contexts/SubscriptionContext";
import { useTier } from "@/contexts/TierContext";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Lock, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

type Period = "daily" | "weekly" | "monthly";

function getDaysInactive(lastUsed: string): number {
  const match = lastUsed.match(/(\d+)\s*days?\s*ago/);
  if (match) return parseInt(match[1]);
  if (lastUsed === "Never") return 999;
  return 0;
}

const Analytics = () => {
  const [period, setPeriod] = useState<Period>("monthly");
  const [filterType, setFilterType] = useState<"all" | "subscription" | "category">("all");
  const [filterValue, setFilterValue] = useState<string>("");
  const { t, formatCurrency } = useLocale();
  const { subscriptions, selectedSubId, setSelectedSubId } = useSubscriptions();
  const { limits, tierName } = useTier();

  if (!limits.analytics) {
    return (
      <div className="space-y-6 max-w-7xl">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t("analytics.title")}</h1>
          <p className="text-muted-foreground text-sm mt-1">{t("analytics.subtitle")}</p>
        </div>
        <Card className="glass-card">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="h-16 w-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
              <Lock className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-bold mb-2">Analytics Locked</h3>
            <p className="text-sm text-muted-foreground max-w-sm mb-4">
              Upgrade to Premium or Premium+ to unlock full analytics, spend trends, and savings insights.
            </p>
            <Badge variant="outline">{tierName}</Badge>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Filter subscriptions
  let filtered = subscriptions;
  if (selectedSubId) {
    filtered = subscriptions.filter(s => s.id === selectedSubId);
  } else if (filterType === "subscription" && filterValue) {
    filtered = subscriptions.filter(s => s.id === filterValue);
  } else if (filterType === "category" && filterValue) {
    filtered = subscriptions.filter(s => s.category === filterValue);
  }

  const activeSubs = filtered.filter(s => s.status === "active");

  // Category breakdown
  const categoryColors = ["hsl(238, 75%, 55%)", "hsl(160, 84%, 39%)", "hsl(38, 92%, 50%)", "hsl(280, 65%, 60%)", "hsl(350, 80%, 55%)", "hsl(200, 70%, 50%)", "hsl(150, 50%, 50%)", "hsl(30, 80%, 55%)"];
  const categoryMap = new Map<string, number>();
  activeSubs.forEach(s => {
    categoryMap.set(s.category, (categoryMap.get(s.category) || 0) + s.monthlyCost);
  });
  const categoryData = Array.from(categoryMap.entries()).map(([name, value], i) => ({
    name, value, color: categoryColors[i % categoryColors.length],
  }));

  // Usage data in DAYS
  const allDays = filtered.flatMap(s => s.usageDays);
  const dailyData = allDays.slice(-7).map((d, i) => ({
    label: `Day ${i + 1}`,
    spend: d > 0 ? 1 : 0,
  }));
  const weeklyData = [0, 1, 2, 3].map(w => {
    const slice = allDays.slice(w * 7, (w + 1) * 7);
    const totalUsed = slice.filter(d => d > 0).length;
    return { label: `Week ${w + 1}`, spend: totalUsed };
  });
  const totalMonthly = activeSubs.reduce((sum, s) => sum + s.monthlyCost, 0);
  const monthlyData = [{ label: "This Month", spend: totalMonthly }];

  const chartData = period === "daily" ? dailyData : period === "weekly" ? weeklyData : monthlyData;
  const yLabel = period === "monthly" ? "" : "days";

  // Potential Savings bar chart (per sub that's wasting)
  const wastingSubs = subscriptions.filter(s => s.status === "active" && getDaysInactive(s.lastUsed) >= 7);
  const potentialSavingsData = wastingSubs.map(s => ({
    name: s.service,
    amount: s.monthlyCost,
  }));

  // Unused subs pie chart
  const usedCount = subscriptions.filter(s => s.status === "active" && getDaysInactive(s.lastUsed) < 7).length;
  const unusedCount = wastingSubs.length;
  const unusedPieData = [
    { name: "Active & Used", value: usedCount, color: "hsl(160, 84%, 39%)" },
    { name: "Unused 7+ days", value: unusedCount, color: "hsl(0, 84%, 60%)" },
  ].filter(d => d.value > 0);

  // Unique categories
  const categories = [...new Set(subscriptions.map(s => s.category))];

  const isFiltered = selectedSubId || (filterType !== "all" && filterValue);

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t("analytics.title")}</h1>
          <p className="text-muted-foreground text-sm mt-1">{t("analytics.subtitle")}</p>
        </div>
        <div className="flex items-center gap-2">
          {isFiltered && (
            <Button variant="ghost" size="sm" className="gap-1.5" onClick={() => { setSelectedSubId(null); setFilterType("all"); setFilterValue(""); }}>
              <ArrowLeft className="h-4 w-4" /> Back to Global View
            </Button>
          )}
          <Select value={filterType} onValueChange={(v) => { setFilterType(v as any); setFilterValue(""); setSelectedSubId(null); }}>
            <SelectTrigger className="w-[150px] h-9 text-xs">
              <SelectValue placeholder="Filter by..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="subscription">By Subscription</SelectItem>
              <SelectItem value="category">By Category</SelectItem>
            </SelectContent>
          </Select>
          {filterType === "subscription" && (
            <Select value={filterValue} onValueChange={setFilterValue}>
              <SelectTrigger className="w-[160px] h-9 text-xs">
                <SelectValue placeholder="Select sub..." />
              </SelectTrigger>
              <SelectContent>
                {subscriptions.map(s => <SelectItem key={s.id} value={s.id}>{s.icon} {s.service}</SelectItem>)}
              </SelectContent>
            </Select>
          )}
          {filterType === "category" && (
            <Select value={filterValue} onValueChange={setFilterValue}>
              <SelectTrigger className="w-[150px] h-9 text-xs">
                <SelectValue placeholder="Select category..." />
              </SelectTrigger>
              <SelectContent>
                {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          )}
        </div>
      </div>

      <SavingsMetrics />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Spend Trend */}
        <Card className="glass-card animate-fade-in">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">{t("analytics.spendTrend")}</CardTitle>
              <div className="flex gap-1">
                {(["daily", "weekly", "monthly"] as Period[]).map(p => (
                  <Button key={p} size="sm" variant={period === p ? "default" : "ghost"} className="h-7 text-xs px-2.5" onClick={() => setPeriod(p)}>
                    {t(`analytics.${p}`)}
                  </Button>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {chartData.length === 0 ? (
              <div className="h-[280px] flex items-center justify-center text-sm text-muted-foreground">
                No usage data yet. Complete your Daily Vibe Check!
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={chartData}>
                  <XAxis dataKey="label" axisLine={false} tickLine={false} className="text-xs" />
                  <YAxis axisLine={false} tickLine={false} className="text-xs" />
                  <Tooltip
                    contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }}
                    formatter={(value: number) => [period === "monthly" ? formatCurrency(value) : `${value} ${yLabel}`, ""]}
                  />
                  <Bar dataKey="spend" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Category Pie */}
        <Card className="glass-card animate-fade-in">
          <CardHeader>
            <CardTitle className="text-base">{t("analytics.byCategory")}</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            {categoryData.length === 0 ? (
              <div className="h-[280px] flex items-center justify-center text-sm text-muted-foreground">
                Add subscriptions to see category breakdown
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie data={categoryData} cx="50%" cy="50%" innerRadius={70} outerRadius={110} paddingAngle={3} dataKey="value">
                    {categoryData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }}
                    formatter={(value: number) => [formatCurrency(value), ""]}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
          {categoryData.length > 0 && (
            <div className="px-6 pb-4 flex flex-wrap gap-3">
              {categoryData.map(c => (
                <div key={c.name} className="flex items-center gap-1.5 text-xs">
                  <div className="h-2.5 w-2.5 rounded-full" style={{ background: c.color }} />
                  <span className="text-muted-foreground">{c.name}</span>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Potential Savings Bar Chart */}
        <Card className="glass-card animate-fade-in">
          <CardHeader>
            <CardTitle className="text-base">Potential Savings</CardTitle>
          </CardHeader>
          <CardContent>
            {potentialSavingsData.length === 0 ? (
              <div className="h-[220px] flex items-center justify-center text-sm text-muted-foreground">
                No wasted subscriptions! You're doing great 🎉
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={potentialSavingsData} layout="vertical">
                  <XAxis type="number" axisLine={false} tickLine={false} className="text-xs" tickFormatter={(v) => formatCurrency(v)} />
                  <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} className="text-xs" width={90} />
                  <Tooltip
                    contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }}
                    formatter={(value: number) => [formatCurrency(value), "Wasted/mo"]}
                  />
                  <Bar dataKey="amount" fill="hsl(var(--destructive))" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Unused Subs Pie */}
        <Card className="glass-card animate-fade-in">
          <CardHeader>
            <CardTitle className="text-base">Unused Subs Analysis</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            {unusedPieData.length === 0 ? (
              <div className="h-[220px] flex items-center justify-center text-sm text-muted-foreground">
                Add subscriptions to see analysis
              </div>
            ) : (
              <div className="flex items-center gap-6">
                <ResponsiveContainer width={180} height={180}>
                  <PieChart>
                    <Pie data={unusedPieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="value">
                      {unusedPieData.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-2">
                  {unusedPieData.map(d => (
                    <div key={d.name} className="flex items-center gap-2 text-sm">
                      <div className="h-3 w-3 rounded-full" style={{ background: d.color }} />
                      <span className="text-muted-foreground">{d.name}</span>
                      <span className="font-semibold">{d.value}</span>
                    </div>
                  ))}
                  {unusedCount > 0 && (
                    <p className="text-xs text-destructive font-medium mt-2">
                      Wasting {formatCurrency(wastingSubs.reduce((s, a) => s + a.monthlyCost, 0))}/mo
                    </p>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
