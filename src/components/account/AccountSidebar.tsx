import { useState } from "react";
import {
  User, BarChart3, CreditCard, Layers, Clock, KeyRound, HelpCircle, Bell, Users, Download, LogOut,
  ArrowLeft, Eye, EyeOff, ChevronDown, Mail, Phone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useLocale } from "@/contexts/LocaleContext";
import { subscriptions, paymentHistory } from "@/lib/mockData";
import { cn } from "@/lib/utils";

type View = "main" | "profile" | "usage" | "virtualCard" | "plan" | "paymentHistory" | "resetPassword" | "support" | "notifications" | "family" | "export";

const PanelHeader = ({ title, onBack }: { title: string; onBack: () => void }) => (
  <div className="p-3 border-b border-border flex items-center gap-2">
    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onBack}>
      <ArrowLeft className="h-4 w-4" />
    </Button>
    <p className="font-semibold text-sm">{title}</p>
  </div>
);

export function AccountSidebar({ onClose }: { onClose: () => void }) {
  const [view, setView] = useState<View>("main");
  const { t, formatCurrency } = useLocale();
  const [cardRevealed, setCardRevealed] = useState(false);
  const [notifSettings, setNotifSettings] = useState({
    renewal7Email: true, renewal7Push: false,
    renewal3Email: true, renewal3Push: true,
    renewal1Email: true, renewal1Push: true,
    paymentEmail: true, paymentPush: false,
    usageEmail: false, usagePush: true,
    summaryEmail: true, summaryPush: false,
    questionsEmail: false, questionsPush: true,
  });

  const sharedSubs = subscriptions.filter((s) => s.shared);

  const handleExportCSV = () => {
    const totalSpend = subscriptions.filter(s => s.status === "active").reduce((s, a) => s + a.monthlyCost, 0);
    const totalSave = subscriptions.filter(s => s.status === "paused").reduce((s, a) => s + a.monthlyCost, 0);
    const waste = subscriptions.filter(s => { const m = s.lastUsed.match(/(\d+)\s*days?\s*ago/); return m && parseInt(m[1]) >= 30; }).reduce((s, a) => s + a.monthlyCost, 0);
    const rows = [
      ["Service", "Status", "Monthly Cost", "Next Billing", "Category", "Shared"].join(","),
      ...subscriptions.map(s => [s.service, s.status, s.monthlyCost.toFixed(2), s.nextBilling, s.category, s.shared ? "Yes" : "No"].join(",")),
      "", `Monthly Spend,${totalSpend.toFixed(2)}`, `Monthly Save,${totalSave.toFixed(2)}`, `Monthly Waste,${waste.toFixed(2)}`,
    ];
    const blob = new Blob([rows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "subcentral-export.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const NotifRow = ({ label, emailKey, pushKey }: { label: string; emailKey: keyof typeof notifSettings; pushKey: keyof typeof notifSettings }) => (
    <div className="flex items-center justify-between py-2">
      <p className="text-xs font-medium">{label}</p>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <Switch checked={notifSettings[emailKey] as boolean} onCheckedChange={(v) => setNotifSettings(n => ({ ...n, [emailKey]: v }))} className="scale-75" />
          <Mail className="h-3 w-3 text-muted-foreground" />
        </div>
        <div className="flex items-center gap-1.5">
          <Switch checked={notifSettings[pushKey] as boolean} onCheckedChange={(v) => setNotifSettings(n => ({ ...n, [pushKey]: v }))} className="scale-75" />
          <Phone className="h-3 w-3 text-muted-foreground" />
        </div>
      </div>
    </div>
  );

  const menuItems: { icon: any; label: string; view: View }[] = [
    { icon: User, label: t("account.profile"), view: "profile" },
    { icon: BarChart3, label: t("account.usageSummary"), view: "usage" },
    { icon: CreditCard, label: t("account.virtualCard"), view: "virtualCard" },
    { icon: Layers, label: t("account.yourPlan"), view: "plan" },
    { icon: Clock, label: t("account.paymentHistory"), view: "paymentHistory" },
    { icon: KeyRound, label: t("account.resetPassword"), view: "resetPassword" },
    { icon: HelpCircle, label: t("account.support"), view: "support" },
    { icon: Bell, label: t("account.notifications"), view: "notifications" },
    { icon: Users, label: t("account.familyTeam"), view: "family" },
    { icon: Download, label: t("account.dataExport"), view: "export" },
  ];

  return (
    <div className="w-80 max-h-[70vh] overflow-y-auto rounded-lg border border-border bg-card shadow-lg z-50 animate-fade-in">
      {view === "main" && (
        <>
          <div className="p-4 border-b border-border flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">JD</div>
            <div>
              <p className="font-semibold text-sm">John Doe</p>
              <p className="text-xs text-muted-foreground">john.doe@email.com</p>
            </div>
          </div>
          <div className="py-1">
            {menuItems.map((item) => (
              <button key={item.label} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors" onClick={() => setView(item.view)}>
                <item.icon className="h-4 w-4 text-muted-foreground" />
                {item.label}
              </button>
            ))}
          </div>
          <div className="border-t border-border py-1">
            <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-destructive hover:bg-muted transition-colors" onClick={onClose}>
              <LogOut className="h-4 w-4" />
              {t("account.logout")}
            </button>
          </div>
        </>
      )}

      {view === "profile" && (
        <>
          <PanelHeader title={t("account.profile")} onBack={() => setView("main")} />
          <div className="p-4 space-y-4">
            <div className="flex justify-center">
              <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-2xl cursor-pointer hover:bg-primary/20 transition-colors">
                JD
              </div>
            </div>
            <div className="space-y-3">
              <div><Label className="text-xs">Name</Label><Input defaultValue="John Doe" className="mt-1 h-9 text-sm" /></div>
              <div><Label className="text-xs">Email</Label><Input defaultValue="john.doe@email.com" className="mt-1 h-9 text-sm" /></div>
              <div><Label className="text-xs">Confirm Password (to change email)</Label><Input type="password" placeholder="••••••••" className="mt-1 h-9 text-sm" /></div>
              <Button size="sm" className="w-full">Save Changes</Button>
            </div>
          </div>
        </>
      )}

      {view === "usage" && (
        <>
          <PanelHeader title={t("account.usageSummary")} onBack={() => setView("main")} />
          <div className="p-4 space-y-2">
            {subscriptions.filter(s => s.status === "active").map(s => (
              <div key={s.id} className="flex items-center justify-between p-2 rounded-lg bg-muted/50 text-sm">
                <span className="flex items-center gap-2"><span>{s.icon}</span>{s.service}</span>
                <span className="text-muted-foreground">{s.currentMonthUsage}</span>
              </div>
            ))}
          </div>
        </>
      )}

      {view === "virtualCard" && (
        <>
          <PanelHeader title={t("account.virtualCard")} onBack={() => setView("main")} />
          <div className="p-4 space-y-4">
            <div className="p-5 rounded-xl bg-gradient-to-br from-primary to-primary/70 text-primary-foreground space-y-4">
              <p className="text-xs opacity-80">Virtual Card</p>
              <p className="text-lg font-mono tracking-wider">{cardRevealed ? "4532 8921 0045 7831" : "•••• •••• •••• 7831"}</p>
              <div className="flex justify-between text-xs">
                <span>JOHN DOE</span><span>12/28</span>
              </div>
            </div>
            <Button variant="outline" size="sm" className="w-full gap-2" onClick={() => setCardRevealed(!cardRevealed)}>
              {cardRevealed ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              {cardRevealed ? "Hide Number" : "Reveal Number"}
            </Button>
          </div>
        </>
      )}

      {view === "plan" && (
        <>
          <PanelHeader title={t("account.yourPlan")} onBack={() => setView("main")} />
          <div className="p-4 space-y-3">
            <div className="p-3 rounded-lg border border-primary/30 bg-primary/5">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-sm">Free Plan</p>
                <Badge className="bg-primary/10 text-primary border-0">Current</Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Track up to 5 subscriptions</p>
            </div>
            <div className="p-3 rounded-lg border">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-sm">Pro Plan</p>
                <span className="text-sm font-bold">$4.99/mo</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Unlimited subs, advanced analytics</p>
              <Button size="sm" className="w-full mt-2">Upgrade to Pro</Button>
            </div>
          </div>
        </>
      )}

      {view === "paymentHistory" && (
        <>
          <PanelHeader title={t("account.paymentHistory")} onBack={() => setView("main")} />
          <div className="p-2">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs">Date</TableHead>
                  <TableHead className="text-xs">Description</TableHead>
                  <TableHead className="text-xs text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paymentHistory.map(p => (
                  <TableRow key={p.id}>
                    <TableCell className="text-xs py-2">{p.date}</TableCell>
                    <TableCell className="text-xs py-2">{p.description}</TableCell>
                    <TableCell className="text-xs py-2 text-right font-medium">{formatCurrency(p.amount)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </>
      )}

      {view === "resetPassword" && (
        <>
          <PanelHeader title={t("account.resetPassword")} onBack={() => setView("main")} />
          <div className="p-4 space-y-3">
            <div><Label className="text-xs">Current Password</Label><Input type="password" className="mt-1 h-9 text-sm" /></div>
            <div><Label className="text-xs">New Password</Label><Input type="password" className="mt-1 h-9 text-sm" /></div>
            <div><Label className="text-xs">Confirm New Password</Label><Input type="password" className="mt-1 h-9 text-sm" /></div>
            <Button size="sm" className="w-full">Update Password</Button>
          </div>
        </>
      )}

      {view === "support" && (
        <>
          <PanelHeader title={t("account.support")} onBack={() => setView("main")} />
          <div className="p-4 space-y-4">
            <a href="mailto:support@subcentral.app" className="flex items-center gap-2 text-sm text-primary hover:underline">
              <Mail className="h-4 w-4" /> support@subcentral.app
            </a>
            <Separator />
            <Accordion type="single" collapsible className="w-full">
              {[
                { q: "How do I cancel a subscription?", a: "Go to Subscriptions, click the service, and select Pause or Cancel." },
                { q: "Is my data secure?", a: "Yes, all data is encrypted and never shared with third parties." },
                { q: "How do shared accounts work?", a: "You can invite family or team members to split costs on shared subscriptions." },
              ].map((faq, i) => (
                <AccordionItem key={i} value={`faq-${i}`}>
                  <AccordionTrigger className="text-xs text-left">{faq.q}</AccordionTrigger>
                  <AccordionContent className="text-xs text-muted-foreground">{faq.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </>
      )}

      {view === "notifications" && (
        <>
          <PanelHeader title={t("account.notifications")} onBack={() => setView("main")} />
          <div className="p-4 space-y-1">
            <div className="flex justify-end gap-4 pb-2 text-[10px] text-muted-foreground uppercase tracking-wider">
              <span>Email</span><span>Push</span>
            </div>
            <NotifRow label="7 days before renewal" emailKey="renewal7Email" pushKey="renewal7Push" />
            <NotifRow label="3 days before renewal" emailKey="renewal3Email" pushKey="renewal3Push" />
            <NotifRow label="1 day before renewal" emailKey="renewal1Email" pushKey="renewal1Push" />
            <Separator className="my-2" />
            <NotifRow label="Payment confirmation" emailKey="paymentEmail" pushKey="paymentPush" />
            <NotifRow label="Usage alerts" emailKey="usageEmail" pushKey="usagePush" />
            <NotifRow label="Weekly summary" emailKey="summaryEmail" pushKey="summaryPush" />
            <NotifRow label="Daily questions" emailKey="questionsEmail" pushKey="questionsPush" />
            <Button size="sm" className="w-full mt-3">Save Preferences</Button>
          </div>
        </>
      )}

      {view === "family" && (
        <>
          <PanelHeader title={t("account.familyTeam")} onBack={() => setView("main")} />
          <div className="p-4 space-y-3">
            {sharedSubs.length === 0 ? (
              <p className="text-sm text-muted-foreground">No shared subscriptions yet.</p>
            ) : (
              sharedSubs.map(sub => (
                <div key={sub.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{sub.icon}</span>
                    <div>
                      <p className="text-sm font-medium">{sub.service}</p>
                      <p className="text-xs text-muted-foreground">Shared with {sub.sharedWith?.join(", ")}</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="text-xs h-7">Manage</Button>
                </div>
              ))
            )}
          </div>
        </>
      )}

      {view === "export" && (
        <>
          <PanelHeader title={t("account.dataExport")} onBack={() => setView("main")} />
          <div className="p-4 space-y-3">
            <p className="text-xs text-muted-foreground">Download a report including Monthly Spend, Monthly Save, and Monthly Waste.</p>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="flex-1 gap-2" onClick={handleExportCSV}>
                <Download className="h-3.5 w-3.5" /> CSV
              </Button>
              <Button size="sm" variant="outline" className="flex-1 gap-2" onClick={handleExportCSV}>
                <Download className="h-3.5 w-3.5" /> PDF
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
