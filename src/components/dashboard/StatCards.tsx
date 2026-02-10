import { DollarSign, CreditCard, PiggyBank, TrendingDown, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useSubscriptions } from "@/contexts/SubscriptionContext";
import { useLocale } from "@/contexts/LocaleContext";

export function StatCards() {
  const { t, formatCurrency } = useLocale();
  const { subscriptions, selectedSubId } = useSubscriptions();

  const filtered = selectedSubId ? subscriptions.filter(s => s.id === selectedSubId) : subscriptions;
  const activeCount = filtered.filter(s => s.status === "active").length;
  const totalMonthly = filtered.filter(s => s.status === "active").reduce((sum, s) => sum + s.monthlyCost, 0);
  const pausedSavings = filtered.filter(s => s.status === "paused").reduce((sum, s) => sum + s.monthlyCost, 0);

  const stats = [
    {
      title: t("stat.totalSpend"),
      value: formatCurrency(totalMonthly),
      change: selectedSubId ? "Filtered" : "2%",
      trend: "up" as const,
      icon: DollarSign,
      accent: "text-primary",
      bg: "bg-primary/10",
    },
    {
      title: t("stat.activeSubs"),
      value: activeCount.toString(),
      change: selectedSubId ? "1 service" : t("stat.newThisMonth"),
      trend: "up" as const,
      icon: CreditCard,
      accent: "text-chart-3",
      bg: "bg-warning/10",
    },
    {
      title: t("stat.moneySaved"),
      value: formatCurrency(pausedSavings),
      change: t("stat.fromPaused"),
      trend: "down" as const,
      icon: PiggyBank,
      accent: "text-success",
      bg: "bg-success/10",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {stats.map((stat) => (
        <Card key={stat.title} className="glass-card animate-fade-in">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground font-medium">{stat.title}</p>
                <p className="text-3xl font-bold tracking-tight">{stat.value}</p>
                <div className="flex items-center gap-1.5">
                  {stat.trend === "up" ? (
                    <TrendingUp className="h-3.5 w-3.5 text-success" />
                  ) : (
                    <TrendingDown className="h-3.5 w-3.5 text-success" />
                  )}
                  <span className="text-xs text-muted-foreground">{stat.change}</span>
                </div>
              </div>
              <div className={`${stat.bg} p-3 rounded-xl`}>
                <stat.icon className={`h-5 w-5 ${stat.accent}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
