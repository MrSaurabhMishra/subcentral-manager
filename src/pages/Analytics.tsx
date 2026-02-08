import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SavingsMetrics } from "@/components/dashboard/SavingsMetrics";
import { useLocale } from "@/contexts/LocaleContext";
import { useSubscriptions } from "@/contexts/SubscriptionContext";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

type Period = "daily" | "weekly" | "monthly";

const Analytics = () => {
  const [period, setPeriod] = useState<Period>("monthly");
  const { t, formatCurrency, localeConfig } = useLocale();
  const { subscriptions } = useSubscriptions();

  // Build category data from live subscriptions
  const categoryColors = ["hsl(238, 75%, 55%)", "hsl(160, 84%, 39%)", "hsl(38, 92%, 50%)", "hsl(280, 65%, 60%)", "hsl(350, 80%, 55%)", "hsl(200, 70%, 50%)", "hsl(150, 50%, 50%)", "hsl(30, 80%, 55%)"];
  const categoryMap = new Map<string, number>();
  subscriptions.filter(s => s.status === "active").forEach(s => {
    categoryMap.set(s.category, (categoryMap.get(s.category) || 0) + s.monthlyCost);
  });
  const categoryData = Array.from(categoryMap.entries()).map(([name, value], i) => ({
    name, value, color: categoryColors[i % categoryColors.length],
  }));

  // Usage data: aggregate dailyHours
  const allHours = subscriptions.flatMap(s => s.dailyHours);
  const dailyData = allHours.slice(-7).map((h, i) => ({ label: `D${i + 1}`, spend: h }));
  const weeklyData = [0, 1, 2, 3].map((w) => {
    const slice = allHours.slice(w * 7, (w + 1) * 7);
    const totalH = slice.reduce((a, b) => a + b, 0);
    return { label: `W${w + 1}`, spend: +(totalH / 24).toFixed(2) };
  });
  const totalMonthly = subscriptions.filter(s => s.status === "active").reduce((sum, s) => sum + s.monthlyCost, 0);
  const monthlyData = [
    { label: "This Month", spend: totalMonthly },
  ];

  const chartData = period === "daily" ? dailyData : period === "weekly" ? weeklyData : monthlyData;
  const yLabel = period === "daily" ? "hrs" : period === "weekly" ? "days" : "";

  return (
    <div className="space-y-6 max-w-7xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{t("analytics.title")}</h1>
        <p className="text-muted-foreground text-sm mt-1">{t("analytics.subtitle")}</p>
      </div>

      <SavingsMetrics />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
      </div>
    </div>
  );
};

export default Analytics;
