import { Plus, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLocale } from "@/contexts/LocaleContext";
import { useSubscriptions } from "@/contexts/SubscriptionContext";
import { useTier } from "@/contexts/TierContext";
import { motion } from "framer-motion";
import { toast } from "sonner";

interface Props {
  onAdd: () => void;
}

const quickPicks = [
  { service: "Netflix", icon: "🎬", category: "Entertainment", monthlyCost: 15.99 },
  { service: "Spotify", icon: "🎵", category: "Music", monthlyCost: 9.99 },
  { service: "ChatGPT Plus", icon: "🤖", category: "AI", monthlyCost: 20.00 },
  { service: "YouTube Premium", icon: "📺", category: "Entertainment", monthlyCost: 13.99 },
];

export function EmptyState({ onAdd }: Props) {
  const { locale } = useLocale();
  const { addSubscription, subscriptions } = useSubscriptions();
  const { canAddSubscription } = useTier();

  const handleQuickAdd = (pick: typeof quickPicks[0]) => {
    if (!canAddSubscription(subscriptions.length)) {
      toast.error("Subscription limit reached. Upgrade your plan!");
      return;
    }
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    addSubscription({
      service: pick.service,
      icon: pick.icon,
      status: "active",
      nextBilling: nextMonth.toISOString().split("T")[0],
      monthlyCost: pick.monthlyCost,
      lastUsed: "Never",
      currentMonthUsage: "0 days",
      shared: false,
      category: pick.category,
    });
    toast.success(`${pick.service} added!`);
  };

  return (
    <Card className="glass-card">
      <CardContent className="flex flex-col items-center justify-center py-12 px-6 text-center">
        <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-5">
          <CreditCard className="h-8 w-8 text-primary" />
        </div>
        <h3 className="text-xl font-bold mb-2">
          {locale === "hi" ? "कोई सब्सक्रिप्शन नहीं" : "No Subscriptions Yet"}
        </h3>
        <p className="text-sm text-muted-foreground max-w-sm mb-6">
          {locale === "hi"
            ? "नीचे से जल्दी जोड़ें या अपना खुद का जोड़ें"
            : "Quick-pick a popular service below or add your own."}
        </p>

        {/* Quick Pick Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6 w-full max-w-lg">
          {quickPicks.map((pick, i) => (
            <motion.button
              key={pick.service}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              onClick={() => handleQuickAdd(pick)}
              className="flex flex-col items-center gap-2 p-4 rounded-xl border border-border bg-card hover:bg-muted/50 hover:border-primary/30 transition-all group cursor-pointer"
            >
              <span className="text-3xl group-hover:scale-110 transition-transform">{pick.icon}</span>
              <span className="text-sm font-medium">{pick.service}</span>
              <span className="text-xs text-muted-foreground">${pick.monthlyCost}/mo</span>
              <span className="text-[10px] font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                + Add
              </span>
            </motion.button>
          ))}
        </div>

        <div className="flex items-center gap-3 text-xs text-muted-foreground mb-4">
          <div className="h-px flex-1 bg-border" />
          <span>or</span>
          <div className="h-px flex-1 bg-border" />
        </div>

        <Button size="lg" className="gap-2" onClick={onAdd}>
          <Plus className="h-5 w-5" />
          {locale === "hi" ? "कस्टम सब्सक्रिप्शन जोड़ें" : "Add Custom Subscription"}
        </Button>
      </CardContent>
    </Card>
  );
}
