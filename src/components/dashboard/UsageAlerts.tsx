import { AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSubscriptions } from "@/contexts/SubscriptionContext";
import { useLocale } from "@/contexts/LocaleContext";

function getDaysInactive(lastUsed: string): number {
  const match = lastUsed.match(/(\d+)\s*days?\s*ago/);
  if (match) return parseInt(match[1]);
  if (lastUsed === "Never") return 999;
  return 0;
}

export function UsageAlerts() {
  const { t, formatCurrency } = useLocale();
  const { subscriptions } = useSubscriptions();

  const lowUsage = subscriptions.filter(s => getDaysInactive(s.lastUsed) >= 30);

  if (lowUsage.length === 0) return null;

  return (
    <Card className="glass-card border-warning/30 animate-fade-in">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-warning" />
          {t("alerts.title")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {lowUsage.map((sub) => (
          <div
            key={sub.id}
            className="flex items-center justify-between p-3 rounded-lg bg-warning/5 border border-warning/10"
          >
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center text-lg">
                {sub.icon || <span className="text-xs font-bold text-muted-foreground">{sub.service[0]}</span>}
              </div>
              <div>
                <p className="text-sm font-medium">{sub.service}</p>
                <p className="text-xs text-muted-foreground">
                  {t("alerts.lastUsed")} {sub.lastUsed}
                </p>
              </div>
            </div>
            <span className="text-sm font-semibold text-warning">
              {formatCurrency(sub.monthlyCost)}/mo
            </span>
          </div>
        ))}
        <p className="text-xs text-muted-foreground">
          {t("alerts.consider")} {formatCurrency(lowUsage.reduce((s, a) => s + a.monthlyCost, 0))}/month
        </p>
      </CardContent>
    </Card>
  );
}
