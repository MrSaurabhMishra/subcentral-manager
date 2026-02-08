import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useSubscriptions, Subscription } from "@/contexts/SubscriptionContext";
import { useLocale } from "@/contexts/LocaleContext";
import { ArrowLeft, Clock, DollarSign, TrendingUp, AlertTriangle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

function getDaysInactive(lastUsed: string): number {
  const match = lastUsed.match(/(\d+)\s*days?\s*ago/);
  if (match) return parseInt(match[1]);
  if (lastUsed === "Today") return 0;
  if (lastUsed === "Yesterday") return 1;
  if (lastUsed === "Never") return 999;
  return 0;
}

export function SubscriptionDeepDive({ sub }: { sub: Subscription }) {
  const { setSelectedSubId } = useSubscriptions();
  const { formatCurrency, locale } = useLocale();

  const totalHours = sub.dailyHours.reduce((a, b) => a + b, 0);
  const totalDays = totalHours / 24;
  const costPerHour = totalHours > 0 ? sub.monthlyCost / totalHours : 0;
  const costPerDay = totalDays > 0 ? sub.monthlyCost / totalDays : 0;
  const daysInactive = getDaysInactive(sub.lastUsed);
  const isWasting = daysInactive >= 7;

  // Build usage chart from dailyHours (last 7 entries)
  const chartData = sub.dailyHours.slice(-7).map((h, i) => ({
    label: `D${i + 1}`,
    hours: h,
  }));

  // Renewal progress
  const renewalDays = (() => {
    if (sub.nextBilling === "—") return null;
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const target = new Date(sub.nextBilling); target.setHours(0, 0, 0, 0);
    const diff = Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return Math.max(0, diff);
  })();
  const renewalProgress = renewalDays !== null ? Math.max(0, ((30 - renewalDays) / 30) * 100) : 0;

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={() => setSelectedSubId(null)} className="gap-1.5">
          <ArrowLeft className="h-4 w-4" />
          {locale === "hi" ? "वापस जाएं" : "Back to Global View"}
        </Button>
      </div>

      <Card className={`glass-card ${isWasting ? "ring-2 ring-destructive/30 shadow-[0_0_20px_hsl(var(--destructive)/0.15)]" : ""}`}>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-muted flex items-center justify-center text-2xl">
              {sub.icon || <span className="text-base font-bold text-muted-foreground">{sub.service[0]}</span>}
            </div>
            <div>
              <CardTitle className="text-lg">{sub.service}</CardTitle>
              <div className="flex items-center gap-2 mt-0.5">
                <Badge variant="outline" className="text-[10px]">{sub.category}</Badge>
                {isWasting ? (
                  <Badge variant="destructive" className="text-[10px] gap-1"><AlertTriangle className="h-3 w-3" /> Wasting</Badge>
                ) : (
                  <Badge className="bg-success/15 text-success border-0 text-[10px]">Healthy</Badge>
                )}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground flex items-center gap-1"><DollarSign className="h-3 w-3" /> Cost/Hour</p>
              <p className="text-lg font-bold">{totalHours > 0 ? formatCurrency(costPerHour) : "—"}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground flex items-center gap-1"><DollarSign className="h-3 w-3" /> Cost/Day</p>
              <p className="text-lg font-bold">{totalDays > 0 ? formatCurrency(costPerDay) : "—"}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" /> Total Hours</p>
              <p className="text-lg font-bold">{totalHours.toFixed(1)}h</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground flex items-center gap-1"><TrendingUp className="h-3 w-3" /> Total Days</p>
              <p className="text-lg font-bold">{totalDays.toFixed(2)}d</p>
            </div>
          </div>

          {renewalDays !== null && (
            <div className="mb-5 space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">{locale === "hi" ? "नवीनीकरण काउंटडाउन" : "Renewal Countdown"}</span>
                <span className="font-medium">{renewalDays} {locale === "hi" ? "दिन बाकी" : "days left"}</span>
              </div>
              <Progress value={renewalProgress} className="h-2" />
            </div>
          )}

          {chartData.length > 0 && (
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-2">{locale === "hi" ? "हाल का उपयोग" : "Recent Usage"}</p>
              <ResponsiveContainer width="100%" height={140}>
                <BarChart data={chartData}>
                  <XAxis dataKey="label" axisLine={false} tickLine={false} className="text-xs" />
                  <YAxis axisLine={false} tickLine={false} className="text-xs" />
                  <Tooltip
                    contentStyle={{
                      background: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                    formatter={(v: number) => [`${v}h`, ""]}
                  />
                  <Bar dataKey="hours" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
