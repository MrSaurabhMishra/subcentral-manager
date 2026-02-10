import { AlertTriangle, Pause, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useSubscriptions } from "@/contexts/SubscriptionContext";
import { useLocale } from "@/contexts/LocaleContext";
import { useTier } from "@/contexts/TierContext";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

function getDaysInactive(lastUsed: string): number {
  const match = lastUsed.match(/(\d+)\s*days?\s*ago/);
  if (match) return parseInt(match[1]);
  if (lastUsed === "Never") return 999;
  return 0;
}

export function UsageAlerts() {
  const { t, formatCurrency } = useLocale();
  const { subscriptions, updateSubscription } = useSubscriptions();
  const { limits } = useTier();

  // Show for 7+ days inactive (not 30) — more prominent
  const lowUsage = subscriptions.filter(s => s.status === "active" && getDaysInactive(s.lastUsed) >= 7);

  if (lowUsage.length === 0) return null;

  // If tier doesn't have lowUsageAlerts, show a teaser
  if (!limits.lowUsageAlerts) {
    return (
      <Card className="glass-card border-warning/30 animate-fade-in">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-warning" />
            {t("alerts.title")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            {lowUsage.length} subscription{lowUsage.length > 1 ? "s" : ""} may be wasting money.
            <span className="text-primary font-medium ml-1">Upgrade to Premium to see details.</span>
          </p>
        </CardContent>
      </Card>
    );
  }

  const handlePause = (id: string, name: string) => {
    updateSubscription(id, { status: "paused", nextBilling: "—" });
    toast.success(`${name} paused!`);
  };

  return (
    <Card className="glass-card border-destructive/20 animate-fade-in">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-destructive" />
          {t("alerts.title")}
          <Badge variant="destructive" className="text-[10px] ml-auto">{lowUsage.length} alert{lowUsage.length > 1 ? "s" : ""}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {lowUsage.map((sub) => (
          <div
            key={sub.id}
            className="flex items-center justify-between p-3 rounded-xl bg-destructive/[0.04] border border-destructive/10"
          >
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center text-lg shadow-[0_0_10px_hsl(var(--destructive)/0.15)]">
                {sub.icon || <span className="text-xs font-bold text-muted-foreground">{sub.service[0]}</span>}
              </div>
              <div>
                <p className="text-sm font-medium">{sub.service}</p>
                <p className="text-xs text-muted-foreground">
                  {t("alerts.lastUsed")} {sub.lastUsed}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-destructive hidden sm:inline">
                {formatCurrency(sub.monthlyCost)}/mo
              </span>
              <Button variant="outline" size="sm" className="h-7 text-xs gap-1" onClick={() => handlePause(sub.id, sub.service)}>
                <Pause className="h-3 w-3" /> Pause
              </Button>
            </div>
          </div>
        ))}
        <p className="text-xs text-destructive/80 font-medium">
          💡 Consider pausing to save {formatCurrency(lowUsage.reduce((s, a) => s + a.monthlyCost, 0))}/month
        </p>
      </CardContent>
    </Card>
  );
}
