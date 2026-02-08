import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { useSubscriptions } from "@/contexts/SubscriptionContext";
import { Users } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";

function getDaysInactive(lastUsed: string): number {
  const match = lastUsed.match(/(\d+)\s*days?\s*ago/);
  if (match) return parseInt(match[1]);
  if (lastUsed === "Never") return 999;
  return 0;
}

function getRenewalProgress(nextBilling: string): number | null {
  if (nextBilling === "—") return null;
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const target = new Date(nextBilling); target.setHours(0, 0, 0, 0);
  const diff = Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  if (diff < 0) return 100;
  return Math.max(0, ((30 - diff) / 30) * 100);
}

export function SubscriptionTable() {
  const { t, formatCurrency } = useLocale();
  const { subscriptions, setSelectedSubId, selectedSubId } = useSubscriptions();

  if (subscriptions.length === 0) return null;

  return (
    <Card className="glass-card animate-fade-in">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold">{t("table.title")}</CardTitle>
      </CardHeader>
      <CardContent className="px-0 pb-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="pl-6">{t("table.service")}</TableHead>
                <TableHead>{t("table.status")}</TableHead>
                <TableHead className="hidden md:table-cell">{t("table.nextBilling")}</TableHead>
                <TableHead>{t("table.cost")}</TableHead>
                <TableHead className="hidden lg:table-cell">{t("table.lastUsed")}</TableHead>
                <TableHead className="hidden lg:table-cell">{t("table.usage")}</TableHead>
                <TableHead className="hidden sm:table-cell">{t("table.shared")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subscriptions.map((sub) => {
                const inactive = getDaysInactive(sub.lastUsed);
                const isWasting = inactive >= 7;
                const renewalProg = getRenewalProgress(sub.nextBilling);

                return (
                  <TableRow
                    key={sub.id}
                    className={`cursor-pointer transition-all ${selectedSubId === sub.id ? "bg-primary/5 ring-1 ring-primary/20" : ""} ${isWasting ? "bg-destructive/[0.03]" : ""}`}
                    onClick={() => setSelectedSubId(sub.id === selectedSubId ? null : sub.id)}
                  >
                    <TableCell className="pl-6 font-medium">
                      <div className="flex items-center gap-3">
                        <div className={`h-9 w-9 rounded-lg flex items-center justify-center text-xl shrink-0 ${isWasting ? "bg-destructive/10 shadow-[0_0_12px_hsl(var(--destructive)/0.2)]" : "bg-muted"}`}>
                          {sub.icon || <span className="text-sm font-bold text-muted-foreground">{sub.service[0]?.toUpperCase()}</span>}
                        </div>
                        <div>
                          <p className="font-medium text-sm">{sub.service}</p>
                          <p className="text-xs text-muted-foreground">{sub.category}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={sub.status === "active" ? "default" : "secondary"}
                        className={
                          sub.status === "active"
                            ? "bg-success/15 text-success border-0 hover:bg-success/20"
                            : "bg-muted text-muted-foreground border-0"
                        }
                      >
                        {sub.status === "active" ? t("status.active") : t("status.paused")}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="space-y-1">
                        <span className="text-sm text-muted-foreground">{sub.nextBilling}</span>
                        {renewalProg !== null && (
                          <Progress value={renewalProg} className="h-1 w-20" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-semibold text-sm">
                      {formatCurrency(sub.monthlyCost)}
                    </TableCell>
                    <TableCell className={`hidden lg:table-cell text-sm ${isWasting ? "text-destructive font-medium" : "text-muted-foreground"}`}>
                      {sub.lastUsed}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                      {sub.currentMonthUsage}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {sub.shared ? (
                        <div className="flex items-center gap-1.5 text-primary">
                          <Users className="h-3.5 w-3.5" />
                          <span className="text-xs font-medium">{sub.sharedWith?.join(", ")}</span>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
