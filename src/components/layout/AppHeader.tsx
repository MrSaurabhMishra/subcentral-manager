import { useState, useEffect, useRef } from "react";
import {
  Search,
  Plus,
  Sun,
  Moon,
  ChevronDown,
  User,
  CreditCard,
  Layers,
  Clock,
  KeyRound,
  HelpCircle,
  LogOut,
  BarChart3,
  Bell,
  Users,
  Download,
  ChevronRight,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { subscriptions } from "@/lib/mockData";

type PanelView = "main" | "notifications" | "family";

export function AppHeader() {
  const [dark, setDark] = useState(() => {
    if (typeof window !== "undefined") {
      return document.documentElement.classList.contains("dark");
    }
    return false;
  });
  const [profileOpen, setProfileOpen] = useState(false);
  const [panelView, setPanelView] = useState<PanelView>("main");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [notifSettings, setNotifSettings] = useState({
    lowUsageEmail: true,
    lowUsageSms: false,
    weeklySummaryEmail: true,
    weeklySummarySms: false,
    paymentConfirmEmail: true,
    paymentConfirmSms: false,
  });

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [dark]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
        setPanelView("main");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleClose = () => {
    setProfileOpen(false);
    setPanelView("main");
  };

  const sharedSubs = subscriptions.filter((s) => s.shared);

  const handleExport = () => {
    const csvRows = [
      ["Service", "Status", "Monthly Cost", "Next Billing", "Category", "Shared"].join(","),
      ...subscriptions.map((s) =>
        [s.service, s.status, s.monthlyCost.toFixed(2), s.nextBilling, s.category, s.shared ? "Yes" : "No"].join(",")
      ),
    ];
    const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "subcentral-export.csv";
    a.click();
    URL.revokeObjectURL(url);
    handleClose();
  };

  const PanelHeader = ({ title, onBack }: { title: string; onBack: () => void }) => (
    <div className="p-3 border-b border-border flex items-center gap-2">
      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onBack}>
        <ArrowLeft className="h-4 w-4" />
      </Button>
      <p className="font-semibold text-sm">{title}</p>
    </div>
  );

  const NotifToggle = ({
    label,
    emailKey,
    smsKey,
  }: {
    label: string;
    emailKey: keyof typeof notifSettings;
    smsKey: keyof typeof notifSettings;
  }) => (
    <div className="space-y-2">
      <p className="text-sm font-medium">{label}</p>
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <Switch
            checked={notifSettings[emailKey]}
            onCheckedChange={(v) => setNotifSettings((n) => ({ ...n, [emailKey]: v }))}
          />
          <Label className="text-xs text-muted-foreground">Email</Label>
        </div>
        <div className="flex items-center gap-2">
          <Switch
            checked={notifSettings[smsKey]}
            onCheckedChange={(v) => setNotifSettings((n) => ({ ...n, [smsKey]: v }))}
          />
          <Label className="text-xs text-muted-foreground">SMS</Label>
        </div>
      </div>
    </div>
  );

  return (
    <header className="h-16 border-b border-border bg-card flex items-center justify-between px-4 lg:px-6 gap-4">
      <div className="w-10 lg:hidden" />

      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search subscriptions..."
          className="pl-9 bg-muted/50 border-0 focus-visible:ring-1 focus-visible:ring-primary"
        />
      </div>

      <div className="flex items-center gap-2">
        <Button size="sm" className="hidden sm:flex gap-2">
          <Plus className="h-4 w-4" />
          <span>Add New</span>
        </Button>
        <Button size="icon" className="sm:hidden h-9 w-9">
          <Plus className="h-4 w-4" />
        </Button>

        <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => setDark(!dark)}>
          {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>

        <div className="relative" ref={dropdownRef}>
          <Button
            variant="ghost"
            className="flex items-center gap-2 px-2"
            onClick={() => setProfileOpen(!profileOpen)}
          >
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
              JD
            </div>
            <ChevronDown
              className={cn("h-4 w-4 text-muted-foreground transition-transform", profileOpen && "rotate-180")}
            />
          </Button>

          {profileOpen && (
            <div className="absolute right-0 top-full mt-2 w-80 rounded-lg border border-border bg-card shadow-lg z-50 animate-fade-in overflow-hidden">
              {panelView === "main" && (
                <>
                  <div className="p-4 border-b border-border">
                    <p className="font-semibold text-sm">John Doe</p>
                    <p className="text-xs text-muted-foreground">john.doe@email.com</p>
                  </div>

                  <div className="py-1">
                    {[
                      { icon: User, label: "Profile" },
                      { icon: BarChart3, label: "Usage Summary" },
                      { icon: CreditCard, label: "Virtual Credit Card" },
                      { icon: Layers, label: "Your Plan" },
                      { icon: Clock, label: "Payment History" },
                      { icon: KeyRound, label: "Reset Password" },
                      { icon: HelpCircle, label: "Support" },
                    ].map((item) => (
                      <button
                        key={item.label}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors"
                        onClick={handleClose}
                      >
                        <item.icon className="h-4 w-4 text-muted-foreground" />
                        {item.label}
                      </button>
                    ))}
                  </div>

                  <Separator />

                  <div className="py-1">
                    <button
                      className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors"
                      onClick={() => setPanelView("notifications")}
                    >
                      <span className="flex items-center gap-3">
                        <Bell className="h-4 w-4 text-muted-foreground" />
                        Notification Settings
                      </span>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </button>
                    <button
                      className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors"
                      onClick={() => setPanelView("family")}
                    >
                      <span className="flex items-center gap-3">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        Family / Team
                      </span>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </button>
                    <button
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors"
                      onClick={handleExport}
                    >
                      <Download className="h-4 w-4 text-muted-foreground" />
                      Data Export
                    </button>
                  </div>

                  <div className="border-t border-border py-1">
                    <button
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-destructive hover:bg-muted transition-colors"
                      onClick={handleClose}
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </button>
                  </div>
                </>
              )}

              {panelView === "notifications" && (
                <>
                  <PanelHeader title="Notification Settings" onBack={() => setPanelView("main")} />
                  <div className="p-4 space-y-4">
                    <NotifToggle label="Low Usage Alerts" emailKey="lowUsageEmail" smsKey="lowUsageSms" />
                    <Separator />
                    <NotifToggle label="Weekly Summary" emailKey="weeklySummaryEmail" smsKey="weeklySummarySms" />
                    <Separator />
                    <NotifToggle
                      label="Payment Confirmation"
                      emailKey="paymentConfirmEmail"
                      smsKey="paymentConfirmSms"
                    />
                    <Button size="sm" className="w-full mt-2" onClick={() => setPanelView("main")}>
                      Save Preferences
                    </Button>
                  </div>
                </>
              )}

              {panelView === "family" && (
                <>
                  <PanelHeader title="Family / Team" onBack={() => setPanelView("main")} />
                  <div className="p-4 space-y-3">
                    {sharedSubs.length === 0 ? (
                      <p className="text-sm text-muted-foreground">No shared subscriptions yet.</p>
                    ) : (
                      sharedSubs.map((sub) => (
                        <div
                          key={sub.id}
                          className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{sub.icon}</span>
                            <div>
                              <p className="text-sm font-medium">{sub.service}</p>
                              <p className="text-xs text-muted-foreground">
                                Shared with {sub.sharedWith?.join(", ")}
                              </p>
                            </div>
                          </div>
                          <Button variant="outline" size="sm" className="text-xs h-7">
                            Manage
                          </Button>
                        </div>
                      ))
                    )}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
