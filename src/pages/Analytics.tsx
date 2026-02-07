import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { monthlySpendData, categoryData } from "@/lib/mockData";
import { SavingsMetrics } from "@/components/dashboard/SavingsMetrics";
import { useLocale } from "@/contexts/LocaleContext";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const dailyData = [
  { label: "Mon", spend: 5.2 }, { label: "Tue", spend: 4.8 }, { label: "Wed", spend: 6.1 },
  { label: "Thu", spend: 3.9 }, { label: "Fri", spend: 7.2 }, { label: "Sat", spend: 8.5 }, { label: "Sun", spend: 6.0 },
];

const weeklyData = [
  { label: "W1", spend: 38 }, { label: "W2", spend: 42 }, { label: "W3", spend: 35 }, { label: "W4", spend: 40 },
];

type Period = "daily" | "weekly" | "monthly";

const Analytics = () => {
  const [period, setPeriod] = useState<Period>("monthly");
  const { t, formatCurrency, locale } = useLocale();

  const chartData = period === "daily" ? dailyData : period === "weekly" ? weeklyData : monthlySpendData.map(d => ({ label: d.month, spend: d.spend }));

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
                {(["daily", "weekly", "monthly"] as Period[]).map((p) => (
                  <Button
                    key={p}
                    size="sm"
                    variant={period === p ? "default" : "ghost"}
                    className="h-7 text-xs px-2.5"
                    onClick={() => setPeriod(p)}
                  >
                    {t(`analytics.${p}`)}
                  </Button>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={chartData}>
                <XAxis dataKey="label" axisLine={false} tickLine={false} className="text-xs" />
                <YAxis axisLine={false} tickLine={false} className="text-xs" tickFormatter={(v) => locale === "hi" ? `₹${Math.round(v * 83.5)}` : `$${v}`} />
                <Tooltip
                  contentStyle={{
                    background: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                  formatter={(value: number) => [formatCurrency(value), ""]}
                />
                <Bar dataKey="spend" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="glass-card animate-fade-in">
          <CardHeader>
            <CardTitle className="text-base">{t("analytics.byCategory")}</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={110}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                  formatter={(value: number) => [formatCurrency(value), ""]}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
          <div className="px-6 pb-4 flex flex-wrap gap-3">
            {categoryData.map((c) => (
              <div key={c.name} className="flex items-center gap-1.5 text-xs">
                <div className="h-2.5 w-2.5 rounded-full" style={{ background: c.color }} />
                <span className="text-muted-foreground">{c.name}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
