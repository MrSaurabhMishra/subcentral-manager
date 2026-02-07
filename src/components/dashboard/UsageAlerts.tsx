import { AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { lowUsageAlerts } from "@/lib/mockData";
import { useLocale } from "@/contexts/LocaleContext";

export function UsageAlerts() {
  const { t, formatCurrency } = useLocale();

  if (lowUsageAlerts.length === 0) return null;

  return (
    <Card className="glass-card border-warning/30 animate-fade-in">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-warning" />
          {t("alerts.title")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {lowUsageAlerts.map((sub) => (
          <div
            key={sub.id}
            className="flex items-center justify-between p-3 rounded-lg bg-warning/5 border border-warning/10"
          >
            <div className="flex items-center gap-3">
              <span className="text-lg">{sub.icon}</span>
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
          {t("alerts.consider")} {formatCurrency(lowUsageAlerts.reduce((s, a) => s + a.monthlyCost, 0))}/month
        </p>
      </CardContent>
    </Card>
  );
}
