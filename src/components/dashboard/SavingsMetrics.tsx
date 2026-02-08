import { Card, CardContent } from "@/components/ui/card";
import { useSubscriptions } from "@/contexts/SubscriptionContext";
import { useLocale } from "@/contexts/LocaleContext";
import { PiggyBank, AlertTriangle, TrendingUp } from "lucide-react";

function getDaysInactive(lastUsed: string): number {
  const match = lastUsed.match(/(\d+)\s*days?\s*ago/);
  if (match) return parseInt(match[1]);
  if (lastUsed === "Never") return 999;
  return 0;
}

export function SavingsMetrics() {
  const { t, formatCurrency } = useLocale();
  const { subscriptions } = useSubscriptions();

  const pausedSavings = subscriptions.filter(s => s.status === "paused").reduce((sum, s) => sum + s.monthlyCost, 0);
  const potentialSavings = subscriptions.filter(s => getDaysInactive(s.lastUsed) >= 30).reduce((sum, s) => sum + s.monthlyCost, 0);
  const activeTotal = subscriptions.filter(s => s.status === "active").reduce((sum, s) => sum + s.monthlyCost, 0);
  const annualProjection = activeTotal * 12;

  const metrics = [
    { title: t("analytics.currentSavings"), value: formatCurrency(pausedSavings), subtitle: t("stat.fromPaused"), icon: PiggyBank, color: "text-success", bg: "bg-success/10" },
    { title: t("analytics.potentialSavings"), value: formatCurrency(potentialSavings), subtitle: t("analytics.wastedOnUnused"), icon: AlertTriangle, color: "text-warning", bg: "bg-warning/10" },
    { title: t("analytics.annualProjection"), value: formatCurrency(annualProjection), subtitle: t("analytics.projectedYearly"), icon: TrendingUp, color: "text-primary", bg: "bg-primary/10" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {metrics.map(m => (
        <Card key={m.title} className="glass-card animate-fade-in">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground font-medium">{m.title}</p>
                <p className="text-2xl font-bold tracking-tight">{m.value}</p>
                <p className="text-xs text-muted-foreground">{m.subtitle}</p>
              </div>
              <div className={`${m.bg} p-2.5 rounded-xl`}>
                <m.icon className={`h-4 w-4 ${m.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
