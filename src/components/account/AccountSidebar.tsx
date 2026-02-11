import { useState } from "react";
import {
  User, BarChart3, CreditCard, Layers, Clock, KeyRound, HelpCircle, Bell, Users, Download, LogOut,
  ArrowLeft, Mail, Phone, Lock, Printer, Crown, Camera,
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
import { useSubscriptions } from "@/contexts/SubscriptionContext";
import { useTier } from "@/contexts/TierContext";
import { useAuth } from "@/contexts/AuthContext";
import { paymentHistory } from "@/lib/mockData";
import { toast } from "sonner";

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
  const { subscriptions } = useSubscriptions();
  const { tier, limits, tierName, setTier } = useTier();
  const { user, updateProfile, updatePassword } = useAuth();

  const [notifSettings, setNotifSettings] = useState({
    renewal7Email: true, renewal7Push: false,
    renewal3Email: true, renewal3Push: true,
    renewal1Email: true, renewal1Push: true,
    paymentEmail: true, paymentPush: false,
    usageEmail: false, usagePush: false,
    summaryEmail: true,
  });

  // Profile edit state
  const [profileName, setProfileName] = useState(user?.name || "");
  const [profileEmail, setProfileEmail] = useState(user?.email || "");

  // Password state
  const [curPw, setCurPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmNewPw, setConfirmNewPw] = useState("");

  const sharedSubs = subscriptions.filter((s) => s.shared);
  const initials = user?.name ? user.name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2) : "U";

  const handleExportCSV = () => {
    if (!limits.dataExport) { toast.error("Data Export is available on Premium+ only."); return; }
    const totalSpend = subscriptions.filter(s => s.status === "active").reduce((s, a) => s + a.monthlyCost, 0);
    const totalSave = subscriptions.filter(s => s.status === "paused").reduce((s, a) => s + a.monthlyCost, 0);
    const waste = subscriptions.filter(s => { const m = s.lastUsed.match(/(\d+)\s*days?\s*ago/); return m && parseInt(m[1]) >= 7; }).reduce((s, a) => s + a.monthlyCost, 0);
    const rows = [
      ["Service", "Status", "Monthly Cost", "Next Billing", "Category", "Shared"].join(","),
      ...subscriptions.map(s => [s.service, s.status, s.monthlyCost.toFixed(2), s.nextBilling, s.category, s.shared ? "Yes" : "No"].join(",")),
      "", `Monthly Spend,${totalSpend.toFixed(2)}`, `Monthly Save,${totalSave.toFixed(2)}`, `Monthly Waste,${waste.toFixed(2)}`,
    ];
    const blob = new Blob([rows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "subcentral-export.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadInvoice = (desc: string) => {
    if (!limits.billingDownload) { toast.error("Invoice download is available on Premium+ only."); return; }
    toast.success(`Downloading invoice for "${desc}"...`);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { toast.error("Image must be under 2MB."); return; }
    const reader = new FileReader();
    reader.onload = () => {
      updateProfile({ photoBase64: reader.result as string });
      toast.success("Profile photo updated!");
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = () => {
    updateProfile({ name: profileName, email: profileEmail });
    toast.success("Profile saved!");
  };

  const handleUpdatePassword = () => {
    if (!curPw || !newPw || !confirmNewPw) { toast.error("Fill all fields."); return; }
    if (newPw !== confirmNewPw) { toast.error("Passwords don't match."); return; }
    if (updatePassword(curPw, newPw)) {
      toast.success("Password updated!");
      setCurPw(""); setNewPw(""); setConfirmNewPw("");
    } else {
      toast.error("Current password is incorrect.");
    }
  };

  const NotifRow = ({ label, emailKey, pushKey, emailOnly }: { label: string; emailKey: keyof typeof notifSettings; pushKey?: keyof typeof notifSettings; emailOnly?: boolean }) => (
    <div className="flex items-center justify-between py-2">
      <p className="text-xs font-medium">{label}</p>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <Switch checked={notifSettings[emailKey] as boolean} onCheckedChange={(v) => setNotifSettings(n => ({ ...n, [emailKey]: v }))} className="scale-75" />
          <Mail className="h-3 w-3 text-muted-foreground" />
        </div>
        {!emailOnly && pushKey && (
          <div className="flex items-center gap-1.5">
            <Switch checked={notifSettings[pushKey] as boolean} onCheckedChange={(v) => setNotifSettings(n => ({ ...n, [pushKey]: v }))} className="scale-75" />
            <Phone className="h-3 w-3 text-muted-foreground" />
          </div>
        )}
      </div>
    </div>
  );

  const menuItems: { icon: any; label: string; view: View; locked?: boolean }[] = [
    { icon: User, label: t("account.profile"), view: "profile" },
    { icon: BarChart3, label: t("account.usageSummary"), view: "usage" },
    { icon: CreditCard, label: "Virtual Card (Coming Soon)", view: "virtualCard" },
    { icon: Layers, label: t("account.yourPlan"), view: "plan" },
    { icon: Clock, label: t("account.paymentHistory"), view: "paymentHistory" },
    { icon: KeyRound, label: t("account.resetPassword"), view: "resetPassword" },
    { icon: HelpCircle, label: t("account.support"), view: "support" },
    { icon: Bell, label: t("account.notifications"), view: "notifications" },
    { icon: Users, label: t("account.familyTeam"), view: "family" },
    { icon: Download, label: t("account.dataExport"), view: "export", locked: !limits.dataExport },
  ];

  return (
    <div className="w-80 max-h-[70vh] overflow-y-auto rounded-xl border border-border bg-card shadow-lg z-50 animate-fade-in">
      {view === "main" && (
        <>
          <div className="p-4 border-b border-border flex items-center gap-3">
            {user?.photoBase64 ? (
              <img src={user.photoBase64} alt="Profile" className="h-10 w-10 rounded-full object-cover" />
            ) : (
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">{initials}</div>
            )}
            <div>
              <p className="font-semibold text-sm">{user?.name || "User"}</p>
              <div className="flex items-center gap-1.5">
                <p className="text-xs text-muted-foreground">{user?.email || ""}</p>
                {tier !== "basic" && <Badge className="text-[8px] h-4 bg-primary/10 text-primary border-0 gap-0.5"><Crown className="h-2.5 w-2.5" />{tierName}</Badge>}
              </div>
            </div>
          </div>
          <div className="py-1">
            {menuItems.map((item) => (
              <button
                key={item.label}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors disabled:opacity-50"
                onClick={() => {
                  if (item.view === "virtualCard") { toast.info("Virtual Card is coming soon!"); return; }
                  setView(item.view);
                }}
                disabled={item.locked}
              >
                <item.icon className="h-4 w-4 text-muted-foreground" />
                {item.label}
                {item.locked && <Lock className="h-3 w-3 text-muted-foreground ml-auto" />}
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
              <label className="relative cursor-pointer group">
                {user?.photoBase64 ? (
                  <img src={user.photoBase64} alt="Profile" className="h-20 w-20 rounded-full object-cover" />
                ) : (
                  <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-2xl">
                    {initials}
                  </div>
                )}
                <div className="absolute inset-0 rounded-full bg-foreground/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Camera className="h-5 w-5 text-white" />
                </div>
                <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
              </label>
            </div>
            <div className="space-y-3">
              <div><Label className="text-xs">Name</Label><Input value={profileName} onChange={e => setProfileName(e.target.value)} className="mt-1 h-9 text-sm" /></div>
              <div><Label className="text-xs">Email</Label><Input value={profileEmail} onChange={e => setProfileEmail(e.target.value)} className="mt-1 h-9 text-sm" /></div>
              <Button size="sm" className="w-full" onClick={handleSaveProfile}>Save Changes</Button>
            </div>
          </div>
        </>
      )}

      {view === "usage" && (
        <>
          <PanelHeader title={t("account.usageSummary")} onBack={() => setView("main")} />
          <div className="p-4 space-y-2">
            {subscriptions.filter(s => s.status === "active").map(s => (
              <div key={s.id} className="flex items-center justify-between p-2 rounded-xl bg-muted/50 text-sm">
                <span className="flex items-center gap-2"><span>{s.icon}</span>{s.service}</span>
                <span className="text-muted-foreground">{s.currentMonthUsage}</span>
              </div>
            ))}
            {subscriptions.filter(s => s.status === "active").length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">No active subscriptions</p>
            )}
          </div>
        </>
      )}

      {view === "virtualCard" && (
        <>
          <PanelHeader title="Virtual Card" onBack={() => setView("main")} />
          <div className="p-4 space-y-4">
            <div className="p-5 rounded-xl bg-gradient-to-br from-muted to-muted/50 border border-border space-y-4 relative overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <Badge variant="outline" className="text-sm font-semibold bg-card/80 backdrop-blur-sm">Coming Soon</Badge>
              </div>
              <p className="text-xs opacity-40">Virtual Card</p>
              <p className="text-lg font-mono tracking-wider opacity-30">•••• •••• •••• ••••</p>
              <div className="flex justify-between text-xs opacity-30">
                <span>YOUR NAME</span><span>--/--</span>
              </div>
            </div>
          </div>
        </>
      )}

      {view === "plan" && (
        <>
          <PanelHeader title={t("account.yourPlan")} onBack={() => setView("main")} />
          <div className="p-4 space-y-3">
            <div className="p-3 rounded-xl border border-primary/30 bg-primary/5">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-sm">{tierName}</p>
                <Badge className="bg-primary/10 text-primary border-0">Current</Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {limits.maxSubscriptions ? `Up to ${limits.maxSubscriptions} subscriptions` : "Unlimited subscriptions"}
              </p>
            </div>
            {tier !== "premiumPlus" && (
              <div className="p-3 rounded-xl border">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-sm">{tier === "basic" ? "Premium" : "Premium+"}</p>
                  <span className="text-sm font-bold">{tier === "basic" ? "$15/yr" : "$25/yr"}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {tier === "basic" ? "10 subs, full analytics, alerts" : "Unlimited, export, invoices"}
                </p>
                <Button size="sm" className="w-full mt-2" onClick={() => { setTier(tier === "basic" ? "premium" : "premiumPlus"); toast.success("Plan upgraded!"); }}>
                  Upgrade
                </Button>
              </div>
            )}
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
                  <TableHead className="text-xs w-8"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paymentHistory.map(p => (
                  <TableRow key={p.id}>
                    <TableCell className="text-xs py-2">{p.date}</TableCell>
                    <TableCell className="text-xs py-2">{p.description}</TableCell>
                    <TableCell className="text-xs py-2 text-right font-medium">{formatCurrency(p.amount)}</TableCell>
                    <TableCell className="py-2">
                      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleDownloadInvoice(p.description)} title={limits.billingDownload ? "Download Invoice" : "Premium+ only"}>
                        <Printer className={`h-3 w-3 ${limits.billingDownload ? "text-primary" : "text-muted-foreground/30"}`} />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {!limits.billingDownload && (
              <p className="text-[10px] text-muted-foreground text-center py-2">Invoice download available on Premium+</p>
            )}
          </div>
        </>
      )}

      {view === "resetPassword" && (
        <>
          <PanelHeader title={t("account.resetPassword")} onBack={() => setView("main")} />
          <div className="p-4 space-y-3">
            <div><Label className="text-xs">Current Password</Label><Input type="password" value={curPw} onChange={e => setCurPw(e.target.value)} className="mt-1 h-9 text-sm" /></div>
            <div><Label className="text-xs">New Password</Label><Input type="password" value={newPw} onChange={e => setNewPw(e.target.value)} className="mt-1 h-9 text-sm" /></div>
            <div><Label className="text-xs">Confirm New Password</Label><Input type="password" value={confirmNewPw} onChange={e => setConfirmNewPw(e.target.value)} className="mt-1 h-9 text-sm" /></div>
            <Button size="sm" className="w-full" onClick={handleUpdatePassword}>Update Password</Button>
          </div>
        </>
      )}

      {view === "support" && (
        <>
          <PanelHeader title={t("account.support")} onBack={() => setView("main")} />
          <div className="p-4 space-y-4">
            {(tier === "premium" || tier === "premiumPlus") && (
              <Badge className="bg-primary/10 text-primary border-0 gap-1 mb-2">
                <Crown className="h-3 w-3" /> Priority Support
              </Badge>
            )}
            <a href="mailto:support@subcentral.app" className="flex items-center gap-2 text-sm text-primary hover:underline">
              <Mail className="h-4 w-4" /> support@subcentral.app
            </a>
            <Separator />
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">FAQ</p>
            <Accordion type="single" collapsible className="w-full">
              {[
                { q: "How do I cancel a subscription?", a: "Go to Subscriptions, click the service, and select Pause or Cancel." },
                { q: "Is my data secure?", a: "Yes, all data is stored locally on your device and never shared with third parties." },
                { q: "How do shared accounts work?", a: "You can invite family or team members to split costs on shared subscriptions." },
                { q: "What are the subscription limits?", a: "Basic: 4 subs, Premium: 10 subs, Premium+: Unlimited." },
                { q: "How do I upgrade my plan?", a: "Go to Plans in the sidebar or Your Plan in your account menu." },
                { q: "What is the Daily Vibe Check?", a: "A fun daily Yes/No poll that asks about your usage for each subscription to track engagement in days." },
                { q: "How are savings calculated?", a: "Savings = cost of paused subscriptions. Potential savings = cost of subs unused for 7+ days." },
                { q: "Can I export my data?", a: "Premium+ users can export data as CSV or PDF from the Data Export section." },
                { q: "How does the virtual card work?", a: "Virtual Card is a planned feature that will provide a dedicated card for managing sub payments." },
                { q: "How do I contact support?", a: "Email support@subcentral.app. Premium/Premium+ users get priority response." },
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
            {limits.lowUsageAlerts && (
              <NotifRow label="Usage alerts" emailKey="usageEmail" pushKey="usagePush" />
            )}
            <Separator className="my-2" />
            {limits.monthlySummary && (
              <NotifRow label="Monthly Summary" emailKey="summaryEmail" emailOnly />
            )}
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
                <div key={sub.id} className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
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
