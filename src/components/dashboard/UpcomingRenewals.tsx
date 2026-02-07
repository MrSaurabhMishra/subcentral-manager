import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { subscriptions } from "@/lib/mockData";
import { useLocale } from "@/contexts/LocaleContext";
import { CalendarClock } from "lucide-react";

function getDaysUntil(dateStr: string): number {
  if (dateStr === "—") return Infinity;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(dateStr);
  target.setHours(0, 0, 0, 0);
  return Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

export function UpcomingRenewals() {
  const { t, formatCurrency } = useLocale();

  const upcoming = subscriptions
    .filter((s) => s.status === "active")
    .map((s) => ({ ...s, daysUntil: getDaysUntil(s.nextBilling) }))
    .filter((s) => s.daysUntil >= 0 && s.daysUntil <= 7)
    .sort((a, b) => a.daysUntil - b.daysUntil);

  if (upcoming.length === 0) return null;

  const urgencyColor = (days: number) => {
    if (days <= 1) return "bg-destructive/15 text-destructive border-destructive/20";
    if (days <= 3) return "bg-warning/15 text-warning border-warning/20";
    return "bg-primary/10 text-primary border-primary/20";
  };

  const daysLabel = (days: number) => {
    if (days === 0) return t("renewals.today");
    if (days === 1) return t("renewals.tomorrow");
    return `${days} ${t("renewals.days")}`;
  };

  return (
    <Card className="glass-card animate-fade-in">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <CalendarClock className="h-4 w-4 text-primary" />
          {t("renewals.title")}
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="flex gap-3 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
          {upcoming.map((sub) => (
            <div
              key={sub.id}
              className="flex-shrink-0 w-36 p-3 rounded-xl border bg-card/50 space-y-2"
            >
              <div className="flex items-center gap-2">
                <span className="text-xl">{sub.icon}</span>
                <p className="text-sm font-medium truncate">{sub.service}</p>
              </div>
              <p className="text-sm font-bold">{formatCurrency(sub.monthlyCost)}</p>
              <Badge variant="outline" className={`text-[10px] ${urgencyColor(sub.daysUntil)}`}>
                {daysLabel(sub.daysUntil)}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
